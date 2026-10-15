// 単熟語EX準1級 定着チェック — 画面に依存しない判定・出題・移行ロジック。
// ブラウザでは app.js より前に読み込まれ、Node のテストからは require される。
const DAY = 86400000;
const STAGES = ['未確認', '要復習', '翌日チェック', '3日後チェック', '7日後チェック', '定着確認済み'];
const STAGE_GAP_DAYS = { 3: 3, 4: 7, 5: 14 };
const MODE_NAMES = { recall: '意味を思い出す', choice: '4択で確認', spelling: '英語を書く', book: '本と一緒に確認' };
// 4択は recognition として別管理し、意味の定着段階（receptive）を進めない。
const FAMILY_OF = { recall: 'receptive', book: 'receptive', spelling: 'productive', choice: 'recognition' };
const FAMILY_NAMES = { receptive: '意味の想起', productive: '英語のつづり', recognition: '4択の識別' };
const SECTIONS = ['全項目', '単語', '熟語', 'テクニカルターム'];
const COUNTS = [5, 10, 20, 30, 50, 100];
const TARGETS = ['all', 'smart', 'due', 'weak', 'new'];
const CONFIDENCES = { sure: '自信あり', unsure: '迷った', guess: 'ほぼ勘' };
const SCORE_NAMES = { 1: '正解', 0.5: 'あいまい', 0: '不正解' };
const DEFAULT_CONFIG = { edition: '第2版', section: '全項目', start: 1, end: 100, count: 20, mode: 'recall', target: 'all' };
const APP_ID = 'stasta-ex-check';
const STATE_VERSION = 2;
const MAX_PROFILES = 100;

function wordKey(edition, section, no) { return JSON.stringify([edition, section, Number(no)]); }
function normalize(s) { return String(s ?? '').normalize('NFKC').toLowerCase().trim().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' '); }
function normEn(s) {
  return normalize(s).replace(/[〜～~…]/g, ' ').replace(/\.{3}/g, ' ').replace(/[.。!?]+$/g, '').replace(/\s+/g, ' ').trim();
}
function englishCorrect(answer, word) {
  const a = normEn(answer);
  return !!a && [word.en, ...(word.aliases || [])].some(x => normEn(x) === a);
}
// 訳語「Ａ／Ｂ（Ｃ）」を区切り単位に分ける。
function jaSegments(ja) { return String(ja || '').split(/[;；|｜／/]/).map(s => s.trim()).filter(Boolean); }
function normJa(s) { return normalize(s).replace(/[\s。、・.,;；〜～~…「」]/g, ''); }
// 括弧を外した形と括弧内を除いた形の両方を受け付ける（補助表示用。最終判定は人が行う）。
function japaneseMatch(answer, word) {
  const a = normJa(answer);
  if (!a) return false;
  return jaSegments(word.ja).some(seg => {
    const kept = normJa(seg.replace(/[（()）]/g, '')), dropped = normJa(seg.replace(/[（(][^）)]*[）)]/g, ''));
    return a === kept || (dropped && a === dropped);
  });
}
function shuffle(arr, random = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// 「英語を書く」では、訳語がまったく同じ別項目の英語も正解にする（例：mandatory と compulsory）。
function spellingAliases(word, list) {
  const ja = normJa(word.ja), out = [...(word.aliases || [])];
  for (const x of list) if (x.key !== word.key && x.en && normJa(x.ja) === ja && !out.includes(x.en) && normEn(x.en) !== normEn(word.en)) out.push(x.en);
  return out;
}

// ---------- 記録と定着段階 ----------
function emptyMemory() { return { stage: 0, due: null, eligibleAt: null, lastAt: null, seen: 0, correct: 0, lapses: 0, lastScore: null }; }
function emptyRecognition() { return { seen: 0, correct: 0, lastAt: null, lastScore: null, lastConfidence: null }; }
function getMemory(profile, key, family) {
  const m = profile.memory[key]?.[family];
  if (m) return m;
  return family === 'recognition' ? emptyRecognition() : emptyMemory();
}
// 予定時刻より前の反復は正解しても段階を進めない。誤答・あいまい・自信なしは stage 1 に戻す。
function applyAttempt(profile, a) {
  const family = FAMILY_OF[a.mode];
  const groups = profile.memory[a.key] ||= {};
  if (family === 'recognition') {
    const m = groups.recognition ||= emptyRecognition();
    m.seen++; m.correct += a.score === 1 ? 1 : 0; m.lastAt = a.at; m.lastScore = a.score; m.lastConfidence = a.confidence;
    return;
  }
  const m = groups[family] ||= emptyMemory();
  m.seen++; m.correct += a.score === 1 ? 1 : 0; m.lastAt = a.at; m.lastScore = a.score;
  if (a.score < 1 || a.confidence !== 'sure') {
    if (m.stage >= 2) m.lapses++;
    m.stage = 1; m.eligibleAt = a.at + DAY; m.due = m.eligibleAt; return;
  }
  if (m.stage < 2) { m.stage = 2; m.eligibleAt = a.at + DAY; m.due = m.eligibleAt; return; }
  if (a.at < m.eligibleAt) return;
  m.stage = Math.min(5, m.stage + 1);
  m.eligibleAt = a.at + STAGE_GAP_DAYS[m.stage] * DAY; m.due = m.eligibleAt;
}
function recognitionWeak(m) {
  if (!m.seen) return false;
  if (m.lastScore == null) return m.correct < m.seen; // 旧形式の記録（直近の結果なし）
  return m.lastScore < 1 || m.lastConfidence !== 'sure';
}
// 画面表示用の状態。className は good / warn / bad / neutral。
function statusOf(profile, key, family, now = Date.now()) {
  const m = getMemory(profile, key, family);
  if (family === 'recognition') {
    if (!m.seen) return { label: '4択未実施', className: 'neutral', due: false };
    return recognitionWeak(m) ? { label: '4択で要復習', className: 'bad', due: false } : { label: '前回4択で正解', className: 'good', due: false };
  }
  if (m.stage === 5 && m.due != null && m.due <= now) return { label: '定着の再確認', className: 'warn', due: true, stage: 5 };
  return { label: STAGES[m.stage], className: m.stage === 5 ? 'good' : m.stage === 1 ? 'bad' : m.stage ? 'warn' : 'neutral', due: m.due != null && m.due <= now, stage: m.stage };
}
function isConfirmed(m, now) { return m.stage === 5 && m.due != null && m.due > now; }

// 対象条件は、出題する形式自身の記録で判定する（4択は4択の記録、英語を書くはつづりの記録）。
function matchesTarget(profile, word, mode, target, now) {
  const family = FAMILY_OF[mode], m = getMemory(profile, word.key, family);
  if (target === 'all' || target === 'smart') return true;
  if (family === 'recognition') {
    if (target === 'new') return m.seen === 0;
    if (target === 'weak') return recognitionWeak(m);
    return false; // 4択には復習日がない
  }
  if (target === 'new') return m.stage === 0;
  if (target === 'weak') return m.stage === 1;
  if (target === 'due') return m.due != null && m.due <= now;
  return false;
}
function smartRank(profile, word, mode, now) {
  const family = FAMILY_OF[mode], m = getMemory(profile, word.key, family);
  if (family === 'recognition') return recognitionWeak(m) ? 0 : m.seen === 0 ? 1 : 2;
  if (m.due != null && m.due <= now) return 0;
  return m.stage === 1 ? 1 : m.stage === 0 ? 2 : m.stage < 5 ? 3 : 4;
}
function pickWords(pool, profile, config, now = Date.now(), random = Math.random) {
  let list = shuffle(pool.filter(w => matchesTarget(profile, w, config.mode, config.target, now)), random);
  if (config.target === 'smart') {
    const rank = new Map(list.map(w => [w.key, smartRank(profile, w, config.mode, now)]));
    list = list.sort((a, b) => rank.get(a.key) - rank.get(b.key)); // 安定ソートなので同順位内はランダムのまま
  }
  return list.slice(0, config.count);
}

// ---------- 4択の選択肢 ----------
// 誤答選択肢が正解と意味で重ならないよう、文字列一致だけでなく漢字の2字連続・カタカナ語・包含関係でも除外する。
// 同義語（例：「捨てる」と「処分する」）までは機械的に判定できないため、画面に「選択肢の問題を報告」を残す。
function meaningFeatures(ja) {
  const feats = new Set(), cores = [];
  for (const seg of jaSegments(ja)) {
    const core = normJa(seg.replace(/[（(][^）)]*[）)]/g, '')).replace(/^(を|に|が|の|と|で|から)/, '');
    if (!core) continue;
    cores.push(core); feats.add('w:' + core);
    const kanji = seg.match(/[一-鿿々]+/g) || [];
    for (const run of kanji) for (let i = 0; i + 1 < run.length; i++) feats.add('k:' + run.slice(i, i + 2));
    for (const kata of seg.match(/[ァ-ーー]{3,}/g) || []) feats.add('c:' + kata);
  }
  return { feats, cores };
}
function meaningsOverlap(a, b) {
  const fa = meaningFeatures(a), fb = meaningFeatures(b);
  for (const f of fa.feats) if (fb.feats.has(f)) return true;
  for (const x of fa.cores) for (const y of fb.cores) {
    if (x.length >= 2 && y.length >= 2 && (x.includes(y) || y.includes(x))) return true;
  }
  return false;
}
// 訳語の先頭の語尾から、品詞のおおまかな形をそろえる（動詞・形容詞・名詞）。
function jaShape(ja) {
  const first = normJa((jaSegments(ja)[0] || '').replace(/[（(][^）)]*[）)]/g, ''));
  if (/(する|させる|れる|[うくぐすつぬぶむる])$/.test(first)) return 'v';
  if (/(い|な|の|的|しい)$/.test(first)) return 'a';
  return 'n';
}
function isPhrase(en) { return /\s/.test(String(en).trim()); }
function choiceOptions(word, rangePool, widePool, random = Math.random) {
  const used = new Set([normJa(word.ja)]), usedEn = new Set([normEn(word.en)]);
  const ok = x => {
    if (x.key === word.key || !x.ja || !x.en) return false;
    if (usedEn.has(normEn(x.en)) || used.has(normJa(x.ja))) return false;
    return !meaningsOverlap(word.ja, x.ja);
  };
  const shape = jaShape(word.ja), phrase = isPhrase(word.en);
  const tiers = [
    x => isPhrase(x.en) === phrase && jaShape(x.ja) === shape,
    x => jaShape(x.ja) === shape,
    () => true,
  ];
  const chosen = [];
  for (const pool of [rangePool, widePool]) {
    for (const tier of tiers) {
      for (const x of shuffle(pool, random)) {
        if (chosen.length === 3) break;
        if (!tier(x) || !ok(x)) continue;
        if (chosen.some(c => meaningsOverlap(c.ja, x.ja))) continue; // 誤答同士の重なりも避ける
        chosen.push(x); used.add(normJa(x.ja)); usedEn.add(normEn(x.en));
      }
      if (chosen.length === 3) break;
    }
    if (chosen.length === 3) break;
  }
  if (chosen.length < 3) return null;
  const options = shuffle([word, ...chosen], random).map(x => ({ key: x.key, ja: x.ja }));
  return { options, answer: options.findIndex(o => o.key === word.key) };
}

// ---------- 単語リスト ----------
// CSV/TSV。引用符・カンマ・BOM・CRLF・引用符内の改行に対応する。
function parseDelimited(text) {
  text = String(text).replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0];
  const delimiter = first.includes('\t') ? '\t' : ',';
  const rows = []; let row = [], cell = '', quote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quote && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quote || cell === '') quote = !quote;
      else cell += c;
    } else if (!quote && c === delimiter) { row.push(cell.trim()); cell = ''; }
    else if (!quote && (c === '\n' || c === '\r')) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (quote) throw new Error('閉じていない引用符があります。CSVの形式をご確認ください。');
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}
function parseWords(text, edition, section) {
  const rows = parseDelimited(text);
  if (!rows.length) throw new Error('取り込む単語がありません。');
  const isHeader = /^(番号|no\.?|number|id)$/i.test(rows[0][0]);
  const words = [], errors = [], used = new Set();
  for (let i = isHeader ? 1 : 0; i < rows.length; i++) {
    const [rawNo, en, ja, pos = '', rawAliases = ''] = rows[i];
    const no = Number(rawNo), line = i + 1;
    if (!Number.isInteger(no) || no < 1 || no > 99999 || !en || !ja) { errors.push(`${line}行目：番号・英語・意味を確認してください。`); continue; }
    if (en.length > 150 || ja.length > 500 || pos.length > 30 || rawAliases.length > 300) { errors.push(`${line}行目：文字数が長すぎます。`); continue; }
    if (used.has(no)) { errors.push(`${line}行目：番号 ${no} が重複しています。`); continue; }
    used.add(no);
    words.push({ key: wordKey(edition, section, no), edition, section, no, en, ja, pos, aliases: rawAliases.split(/[;；|｜]/).map(s => s.trim()).filter(Boolean) });
  }
  if (errors.length) throw new Error(errors.slice(0, 6).join('\n') + (errors.length > 6 ? `\nほか${errors.length - 6}件` : ''));
  if (words.length > 10000) throw new Error('1回の取込は10,000語までです。');
  return words;
}
// 内蔵データは上書きできない。追加分は同じ番号に別の英語を入れるとエラー。
function mergeCustomWords(builtinMap, custom, words) {
  const existing = new Map(custom.map(w => [w.key, w]));
  for (const w of words) {
    if (builtinMap.has(w.key)) throw new Error(`番号 ${w.no}（${w.edition}／${w.section}）は内蔵データにあります。別の版・リスト名で登録してください。`);
    const old = existing.get(w.key);
    if (old && normalize(old.en) !== normalize(w.en)) throw new Error(`番号 ${w.no} は ${old.en} で登録済みです。異なる版名で登録してください。`);
    existing.set(w.key, w);
  }
  return [...existing.values()];
}
function rangePool(bank, c) { return bank.filter(w => w.edition === c.edition && w.section === c.section && w.no >= c.start && w.no <= c.end); }
function bookPool(bankMap, c) {
  const list = [];
  for (let no = c.start; no <= c.end; no++) {
    const k = wordKey(c.edition, c.section, no);
    list.push(bankMap.get(k) || { key: k, edition: c.edition, section: c.section, no, en: '', ja: '', pos: '', aliases: [] });
  }
  return list;
}
function configError(c) {
  if (!c || !Number.isInteger(c.start) || !Number.isInteger(c.end) || c.start < 1 || c.end < c.start || c.end > 99999) return '開始・終了番号を正しく入力してください。';
  if (c.end - c.start > 9999) return '1回の出題範囲は10,000語以内にしてください。';
  if (c.mode === 'choice' && c.target === 'due') return '4択には復習日がありません。対象条件を変えてください。';
  return '';
}
function validConfig(c) {
  return !!c && typeof c.edition === 'string' && c.edition.length > 0 && c.edition.length <= 60 && SECTIONS.includes(c.section)
    && COUNTS.includes(c.count) && TARGETS.includes(c.target) && Object.hasOwn(MODE_NAMES, c.mode) && !configError(c);
}
function newProfile(name, now = Date.now()) {
  return { id: 'p_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 7), name, memory: {}, history: [], pending: null, paperTests: [] };
}
function newState(now = Date.now()) {
  const p = newProfile('自分の学習', now);
  return { app: APP_ID, version: STATE_VERSION, customWords: [], profiles: [p], active: p.id, config: { ...DEFAULT_CONFIG }, flags: [], migration: null, createdAt: now };
}

// ---------- 旧形式（version 1）・新形式（version 2）の読み込み ----------
// 読めない項目は黙って捨てず、skipped に元の値を残して報告する。
function finiteOrNull(x) { return x == null ? null : Number.isFinite(x) ? x : undefined; }
function cleanMemoryEntry(family, m) {
  if (!m || typeof m !== 'object') return null;
  if (!Number.isInteger(m.seen) || m.seen < 0 || !Number.isFinite(m.correct) || m.correct < 0 || m.correct > m.seen) return null;
  const lastAt = finiteOrNull(m.lastAt);
  if (lastAt === undefined) return null;
  if (family === 'recognition') {
    const out = { seen: m.seen, correct: m.correct, lastAt, lastScore: [0, 0.5, 1].includes(m.lastScore) ? m.lastScore : null, lastConfidence: Object.hasOwn(CONFIDENCES, m.lastConfidence ?? '') ? m.lastConfidence : null };
    return out;
  }
  const due = finiteOrNull(m.due), eligibleAt = finiteOrNull(m.eligibleAt);
  if (!Number.isInteger(m.stage) || m.stage < 0 || m.stage > 5 || due === undefined || eligibleAt === undefined) return null;
  return { stage: m.stage, due, eligibleAt, lastAt, seen: m.seen, correct: m.correct, lapses: Number.isInteger(m.lapses) && m.lapses >= 0 ? m.lapses : 0, lastScore: [0, 0.5, 1].includes(m.lastScore) ? m.lastScore : null };
}
function cleanResult(r) {
  if (!r || typeof r !== 'object') return null;
  if (![0, 0.5, 1].includes(r.score) || typeof r.key !== 'string' || !Number.isInteger(r.no) || typeof r.edition !== 'string' || typeof r.section !== 'string') return null;
  if (r.key !== wordKey(r.edition, r.section, r.no) || !Object.hasOwn(MODE_NAMES, r.mode) || !Object.hasOwn(CONFIDENCES, r.confidence)) return null;
  if (!Number.isFinite(r.at)) return null;
  return { key: r.key, no: r.no, edition: r.edition, section: r.section, en: String(r.en ?? ''), ja: String(r.ja ?? ''), answer: String(r.answer ?? ''), score: r.score, confidence: r.confidence, mode: r.mode, at: r.at, latency: Number.isFinite(r.latency) && r.latency > 0 ? r.latency : 0, grading: String(r.grading || (['recall', 'book'].includes(r.mode) ? '自己・講師採点' : '自動採点')) };
}
function cleanConfig(c) {
  if (!c || typeof c !== 'object') return null;
  const out = { ...DEFAULT_CONFIG, ...c };
  for (const k of ['start', 'end', 'count']) out[k] = Number(out[k]);
  return validConfig(out) ? { edition: out.edition, section: out.section, start: out.start, end: out.end, count: out.count, mode: out.mode, target: out.target } : null;
}
// 履歴の config は当時の値をそのまま残す（範囲表示に使う）。count が規定外でも結果自体は有効とする。
function cleanHistoryConfig(c, results) {
  const strict = cleanConfig(c);
  if (strict) return strict;
  if (!c || typeof c !== 'object' || !Object.hasOwn(MODE_NAMES, c.mode)) return null;
  const nos = results.map(r => r.no);
  return { edition: String(c.edition || results[0].edition), section: String(c.section || results[0].section), start: Number.isInteger(c.start) ? c.start : Math.min(...nos), end: Number.isInteger(c.end) ? c.end : Math.max(...nos), count: Number(c.count) || results.length, mode: c.mode, target: TARGETS.includes(c.target) ? c.target : 'all' };
}
function convertPending(p, bankMap, version) {
  if (!p || typeof p !== 'object') return null;
  const config = cleanConfig(p.config);
  if (!config || !Array.isArray(p.questions) || !p.questions.length || !Array.isArray(p.results)) return null;
  const questions = [];
  for (const q of p.questions) {
    if (!q || typeof q.key !== 'string') return null;
    const w = bankMap.get(q.key) || q;
    if (!Number.isInteger(w.no)) return null;
    const out = { key: q.key, no: w.no, edition: w.edition, section: w.section, en: String(w.en || ''), ja: String(w.ja || ''), aliases: Array.isArray(w.aliases) ? w.aliases : [] };
    if (config.mode === 'choice') {
      if (version === 1) {
        if (!Array.isArray(q.options) || q.options.length !== 4) return null;
        out.options = q.options.map(ja => ({ key: null, ja: String(ja) }));
        out.answer = q.options.indexOf(q.ja);
        if (out.answer < 0) return null;
      } else {
        if (!Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.answer)) return null;
        out.options = q.options.map(o => ({ key: o.key ?? null, ja: String(o.ja ?? '') })); out.answer = q.answer;
      }
    }
    questions.push(out);
  }
  const results = p.results.map(cleanResult);
  if (results.some(r => !r)) return null;
  const index = Number.isInteger(p.index) ? p.index : results.length;
  if (index !== results.length || index > questions.length) return null;
  return { id: String(p.id || ('s_' + Date.now())), config, questions, results, index, startedAt: Number(p.startedAt) || Date.now(), questionStartedAt: Date.now(), phase: 'answer', draft: '', confidence: '', selected: null, skipped: false };
}
function importState(raw, builtinMap, { keepPending = false, now = Date.now() } = {}) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.profiles)) throw new Error('このアプリのバックアップファイルではありません。');
  const version = raw.version;
  if (version !== 1 && !(version === 2 && raw.app === APP_ID)) throw new Error('対応していない形式です（version ' + String(version) + '）。');
  const report = { from: version, warnings: [], skipped: [], counts: { profiles: 0, tests: 0, results: 0, memory: 0, customWords: 0, sameAsBuiltin: 0, paperTests: 0 } };
  const skip = (where, reason, value) => report.skipped.push({ where, reason, value });
  const state = newState(now); state.profiles = [];
  // 単語
  const sourceWords = version === 1 ? (Array.isArray(raw.bank) ? raw.bank : []) : (Array.isArray(raw.customWords) ? raw.customWords : []);
  const customKeys = new Set();
  sourceWords.forEach((w, i) => {
    const valid = w && typeof w.edition === 'string' && w.edition && SECTIONS.includes(w.section) && Number.isInteger(w.no) && w.no >= 1 && w.no <= 99999 && typeof w.en === 'string' && w.en && typeof w.ja === 'string' && w.ja && w.key === wordKey(w.edition, w.section, w.no) && (!w.aliases || (Array.isArray(w.aliases) && w.aliases.every(a => typeof a === 'string')));
    if (!valid) { skip(`単語 ${i + 1}件目`, '番号・英語・意味・区分のいずれかが不正', w); return; }
    const b = builtinMap.get(w.key);
    if (b) {
      if (normalize(b.en) === normalize(w.en) && b.ja === w.ja) { report.counts.sameAsBuiltin++; return; }
      skip(`単語 No.${w.no}（${w.edition}／${w.section}）`, '内蔵データと英語・訳語が異なるため内蔵データを優先', w); return;
    }
    if (customKeys.has(w.key)) { skip(`単語 No.${w.no}`, '同じ番号が重複', w); return; }
    customKeys.add(w.key);
    state.customWords.push({ key: w.key, edition: w.edition, section: w.section, no: w.no, en: w.en, ja: w.ja, pos: typeof w.pos === 'string' ? w.pos : '', aliases: w.aliases ? [...w.aliases] : [] });
  });
  report.counts.customWords = state.customWords.length;
  const bankMap = new Map(builtinMap); for (const w of state.customWords) bankMap.set(w.key, w);
  // 学習者
  const ids = new Set();
  raw.profiles.slice(0, MAX_PROFILES).forEach((p, pi) => {
    if (!p || typeof p !== 'object') { skip(`学習者 ${pi + 1}人目`, '学習者データが不正', p); return; }
    let id = typeof p.id === 'string' && p.id ? p.id : '';
    if (!id || ids.has(id)) { const fresh = newProfile('', now + pi).id; report.warnings.push(`学習者 ${pi + 1}人目のIDが${id ? '重複' : '空'}のため ${fresh} を割り当てました。`); id = fresh; }
    ids.add(id);
    let name = typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 40) : '';
    if (!name) { name = `学習者${pi + 1}`; report.warnings.push(`学習者 ${pi + 1}人目に名前がないため「${name}」としました。`); }
    const profile = { id, name, memory: {}, history: [], pending: null, paperTests: [] };
    if (p.memory && typeof p.memory === 'object' && !Array.isArray(p.memory)) {
      for (const [k, groups] of Object.entries(p.memory)) {
        let parts; try { parts = JSON.parse(k); } catch { parts = null; }
        if (!Array.isArray(parts) || parts.length !== 3 || k !== wordKey(...parts) || !groups || typeof groups !== 'object') { skip(`${name}：記録 ${k}`, '識別子が不正', groups); continue; }
        for (const [family, m] of Object.entries(groups)) {
          if (!Object.hasOwn(FAMILY_NAMES, family)) { skip(`${name}：記録 ${k} / ${family}`, '未知の記録区分', m); continue; }
          const clean = cleanMemoryEntry(family, m);
          if (!clean) { skip(`${name}：記録 ${k} / ${family}`, '段階・回数・日時が不正', m); continue; }
          (profile.memory[k] ||= {})[family] = clean; report.counts.memory++;
        }
      }
    } else if (p.memory != null) skip(`${name}：定着記録`, '形式が不正', p.memory);
    (Array.isArray(p.history) ? p.history : []).forEach((h, hi) => {
      if (!h || typeof h !== 'object' || !Array.isArray(h.results) || !Number.isFinite(h.at)) { skip(`${name}：テスト ${hi + 1}件目`, '日時・結果が不正', h); return; }
      const results = [];
      h.results.forEach((r, ri) => { const c = cleanResult(r); if (c) results.push(c); else skip(`${name}：テスト ${hi + 1}件目の ${ri + 1}問目`, '回答記録が不正', r); });
      if (!results.length) { skip(`${name}：テスト ${hi + 1}件目`, '有効な回答がない', h); return; }
      const config = cleanHistoryConfig(h.config, results);
      if (!config) { skip(`${name}：テスト ${hi + 1}件目`, '出題設定が不正', h); return; }
      profile.history.push({ id: typeof h.id === 'string' && h.id ? h.id : `h_${hi}_${now}`, at: h.at, startedAt: Number.isFinite(h.startedAt) ? h.startedAt : h.at, config, planned: Number.isInteger(h.planned) && h.planned >= results.length ? h.planned : results.length, results, ...(Number.isInteger(h.excluded) && h.excluded >= 0 ? { excluded: h.excluded } : {}), source: h.source === 'paper' || results.every(r => /紙/.test(r.grading)) ? 'paper' : 'screen' });
      report.counts.tests++; report.counts.results += results.length;
    });
    if (p.pending) {
      if (!keepPending) report.warnings.push(`${name}：途中のテストは、別の端末での再開を避けるため引き継いでいません。`);
      else {
        const pend = convertPending(p.pending, bankMap, version);
        if (pend) profile.pending = pend; else skip(`${name}：途中のテスト`, '再開に必要な情報が不足', p.pending);
      }
    }
    if (version === 2 && Array.isArray(p.paperTests)) {
      for (const t of p.paperTests) {
        if (t && typeof t.id === 'string' && cleanConfig(t.config) && Array.isArray(t.questions) && t.questions.length) { profile.paperTests.push(t); report.counts.paperTests++; }
        else skip(`${name}：紙テスト`, '形式が不正', t);
      }
    }
    state.profiles.push(profile); report.counts.profiles++;
  });
  if (raw.profiles.length > MAX_PROFILES) report.warnings.push(`学習者が${MAX_PROFILES}人を超えていたため、${MAX_PROFILES + 1}人目以降は読み込んでいません。`), raw.profiles.slice(MAX_PROFILES).forEach((p, i) => skip(`学習者 ${MAX_PROFILES + i + 1}人目`, '上限超過', p));
  if (!state.profiles.length) throw new Error('読み込める学習者がいません。');
  state.active = state.profiles.some(p => p.id === raw.active) ? raw.active : state.profiles[0].id;
  const config = cleanConfig(raw.config);
  // 旧版の復元処理は区分「単語」・本と一緒に確認を既定にしていたため、単語データのない版・区分を指す設定は既定値に戻す。
  const hasWords = config && [...bankMap.values()].some(w => w.edition === config.edition && w.section === config.section);
  state.config = config && hasWords ? config : { ...DEFAULT_CONFIG };
  if (raw.config && (!config || !hasWords)) report.warnings.push('テスト設定を初期値（第2版／全項目／1〜100番／20問／意味を思い出す）に戻しました。');
  state.flags = version === 2 && Array.isArray(raw.flags) ? raw.flags.filter(f => f && typeof f.key === 'string') : [];
  for (const k of Object.keys(raw)) {
    if (!['app', 'version', 'bank', 'customWords', 'profiles', 'active', 'config', 'flags', 'migration', 'sourceDataVersion', 'exportedAt', 'createdAt'].includes(k)) skip(`項目 ${k}`, 'このアプリで使わない項目', raw[k]);
  }
  const previous = version === 2 && raw.migration ? raw.migration : null;
  state.migration = { at: now, from: version, report: { ...report, skipped: report.skipped.map(s => ({ where: s.where, reason: s.reason })) }, skippedRaw: report.skipped.map(s => ({ where: s.where, value: s.value })), previous };
  return { state, report };
}

// ---------- 報告 ----------
function dayKey(ts) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function dayStart(key) { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }
function addDays(ts, n) { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); }
function tally(results) {
  const t = { n: results.length, correct: 0, partial: 0, wrong: 0, sureCorrect: 0 };
  for (const r of results) { if (r.score === 1) t.correct++; else if (r.score === 0.5) t.partial++; else t.wrong++; if (r.score === 1 && r.confidence === 'sure') t.sureCorrect++; }
  t.rate = t.n ? Math.round(t.correct / t.n * 100) : null;
  return t;
}
function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]), out = [];
  for (const r of sorted) { const last = out.at(-1); if (last && r[0] <= last[1] + 1) last[1] = Math.max(last[1], r[1]); else out.push([...r]); }
  return out;
}
// 指定日の実施状況と、次の復習予定をまとめる。counts は意味の想起（receptive）で集計する。
function buildReport(profile, words, day, now = Date.now()) {
  const from = dayStart(day), to = addDays(from, 1);
  const results = [], tests = [];
  for (const h of profile.history) {
    const rs = h.results.filter(r => r.at >= from && r.at < to);
    if (rs.length) { results.push(...rs); tests.push(h); }
  }
  const byFamily = {};
  for (const f of Object.keys(FAMILY_NAMES)) byFamily[f] = tally(results.filter(r => FAMILY_OF[r.mode] === f));
  const rangeMap = {};
  for (const h of tests) { const k = `${h.config.edition}／${h.config.section}`; (rangeMap[k] ||= []).push([h.config.start, h.config.end]); }
  const ranges = Object.entries(rangeMap).map(([label, rs]) => ({ label, ranges: mergeRanges(rs) }));
  const latest = new Map();
  for (const r of [...results].sort((a, b) => a.at - b.at)) latest.set(r.key + '|' + FAMILY_OF[r.mode], r);
  const weak = [...latest.values()].filter(r => r.score < 1 || r.confidence !== 'sure')
    .sort((a, b) => a.score - b.score || a.no - b.no)
    .map(r => ({ key: r.key, no: r.no, en: r.en, ja: r.ja, score: r.score, confidence: r.confidence, mode: r.mode }));
  const todayEnd = addDays(dayStart(dayKey(now)), 1), tomorrowEnd = addDays(todayEnd, 1), weekEnd = addDays(todayEnd, 7);
  let dueNow = 0, dueRestOfToday = 0, dueTomorrow = 0, dueWeek = 0, nextDue = null;
  const counts = { confirmed: 0, checking: 0, recheck: 0, weak: 0, unseen: 0, total: words.length };
  for (const w of words) {
    const m = getMemory(profile, w.key, 'receptive');
    if (m.stage === 0) counts.unseen++;
    else if (m.stage === 1) counts.weak++;
    else if (isConfirmed(m, now)) counts.confirmed++;
    else if (m.stage === 5) counts.recheck++;
    else counts.checking++;
    if (m.due == null) continue;
    if (m.due <= now) dueNow++;
    else if (m.due < todayEnd) dueRestOfToday++;
    else if (m.due < tomorrowEnd) dueTomorrow++;
    if (m.due > now && m.due < weekEnd) dueWeek++;
    if (m.due > now && (nextDue == null || m.due < nextDue)) nextDue = m.due;
  }
  return { day, generatedAt: now, learner: profile.name, testCount: tests.length, total: results.length, byFamily, ranges, weak, next: { dueNow, dueRestOfToday, dueTomorrow, dueWeek, nextDue }, counts, isToday: dayKey(now) === day };
}
function formatDay(day) {
  const d = new Date(dayStart(day));
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${'日月火水木金土'[d.getDay()]}）`;
}
function formatRanges(report) {
  return report.ranges.map(r => `${r.ranges.map(([a, b]) => a === b ? `${a}番` : `${a}〜${b}番`).join('、')}`).join(' ／ ');
}
function familyLine(f, t) {
  if (!t.n) return '';
  if (f === 'receptive') return `意味の想起 ${t.n}問：正解${t.correct}・あいまい${t.partial}・不正解${t.wrong}（正答率${t.rate}%）`;
  return `${FAMILY_NAMES[f]} ${t.n}問：正解${t.correct}（正答率${t.rate}%）`;
}
function reportText(r, { maxWeak = 10 } = {}) {
  const lines = ['【単熟語EX準1級 学習報告】', `学習者：${r.learner}`, `日付：${formatDay(r.day)}`];
  if (!r.total) lines.push('この日のテスト記録はありません。');
  else {
    lines.push(`実施：${r.testCount}回・${r.total}問`);
    for (const f of ['receptive', 'recognition', 'productive']) { const l = familyLine(f, r.byFamily[f]); if (l) lines.push('・' + l); }
    lines.push(`範囲：${formatRanges(r)}`);
    lines.push(`要復習：${r.weak.length}語` + (r.weak.length ? '（不正解・あいまい・自信なしの正解）' : ''));
    for (const w of r.weak.slice(0, maxWeak)) lines.push(`　No.${w.no} ${w.en || '（本で確認）'}${w.ja ? '　' + w.ja : ''}`);
    if (r.weak.length > maxWeak) lines.push(`　ほか${r.weak.length - maxWeak}語`);
  }
  const n = r.next;
  lines.push(`次の復習：今すぐ${n.dueNow}語・明日${n.dueTomorrow}語・7日以内${n.dueWeek}語`);
  lines.push(`意味の定着確認済み：${r.counts.confirmed}語（対象${r.counts.total}語中）`);
  lines.push('※正答率はその日のテスト結果で、定着率や合格可能性を示すものではありません。');
  return lines.join('\n');
}

if (typeof module !== 'undefined') module.exports = {
  DAY, STAGES, MODE_NAMES, FAMILY_OF, FAMILY_NAMES, SECTIONS, COUNTS, TARGETS, CONFIDENCES, SCORE_NAMES, DEFAULT_CONFIG, APP_ID, STATE_VERSION, MAX_PROFILES,
  wordKey, normalize, normEn, englishCorrect, spellingAliases, jaSegments, normJa, japaneseMatch, shuffle, emptyMemory, getMemory, applyAttempt, statusOf, isConfirmed,
  recognitionWeak, matchesTarget, pickWords, meaningsOverlap, jaShape, choiceOptions, parseDelimited, parseWords, mergeCustomWords, rangePool, bookPool,
  configError, validConfig, newProfile, newState, importState, dayKey, dayStart, addDays, tally, buildReport, reportText, formatDay, formatRanges, familyLine,
};
