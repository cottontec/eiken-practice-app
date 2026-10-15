// 単熟語EX準1級 定着チェック — 画面。core.js と内蔵データ（VOCAB_SOURCE / BUILTIN_WORDS）の後に読み込む。
(() => {
'use strict';
const STORAGE = 'stasta-ex-check-v2', LEGACY_STORAGE = 'stasta-ex-check-v1';
const BUILTIN = BUILTIN_WORDS;
const builtinMap = new Map(BUILTIN.map(w => [w.key, w]));

// ---------- 保存 ----------
let state, storageError = '', legacyRaw = null, saveTimer = null;
function readStorage(k) { try { return localStorage.getItem(k); } catch { return null; } }
(function load() {
  const raw = readStorage(STORAGE);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.app !== APP_ID || parsed.version !== STATE_VERSION || !Array.isArray(parsed.profiles) || !parsed.profiles.length) throw new Error('invalid');
      state = parsed;
      for (const p of state.profiles) { p.memory ||= {}; p.history ||= []; p.paperTests ||= []; if (p.pending === undefined) p.pending = null; }
      state.customWords ||= []; state.flags ||= [];
      if (!validConfig(state.config)) state.config = { ...DEFAULT_CONFIG };
    } catch {
      storageError = '保存されたデータを読み込めませんでした。元のデータはブラウザに残しています。バックアップがあれば「設定・データ」から復元してください。';
      try { localStorage.setItem(STORAGE + '-unreadable-' + Date.now(), raw); } catch {}
    }
  }
  if (!state) state = newState();
  const legacy = readStorage(LEGACY_STORAGE);
  if (legacy && !state.migration) legacyRaw = legacy;
})();
function save() {
  clearTimeout(saveTimer); saveTimer = null;
  try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true; }
  catch { storageError = 'ブラウザに保存できませんでした。「設定・データ」からバックアップを保存してください。'; toast(storageError); return false; }
}
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
window.addEventListener('pagehide', () => { if (saveTimer) save(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer) save(); });

let bankCache = null, bankMapCache = null;
function bank() { if (!bankCache) bankCache = BUILTIN.concat(state.customWords); return bankCache; }
function bankMap() { if (!bankMapCache) bankMapCache = new Map(bank().map(w => [w.key, w])); return bankMapCache; }
function invalidateBank() { bankCache = null; bankMapCache = null; }
const profile = () => state.profiles.find(p => p.id === state.active) || state.profiles[0];

// ---------- 小道具 ----------
const $ = (q, root = document) => root.querySelector(q), $$ = (q, root = document) => [...root.querySelectorAll(q)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
const num = n => Number(n).toLocaleString('ja-JP');
const md = t => t ? new Date(t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }) : '—';
const stamp = t => new Date(t).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const shortStamp = t => new Date(t).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const app = $('#app');
let toastTimer;
function toast(text) { clearTimeout(toastTimer); const t = $('#toast'); t.textContent = text; t.classList.add('show'); toastTimer = setTimeout(() => t.classList.remove('show'), 4200); }
function modal(html) { $('#dialog-body').innerHTML = html; const d = $('#dialog'); if (!d.open) d.showModal(); $('#dialog-body').scrollTop = 0; }
function closeModal() { const d = $('#dialog'); if (d.open) d.close(); }
$('#dialog-close').onclick = closeModal;
$('#dialog').addEventListener('click', e => { if (e.target === $('#dialog')) closeModal(); });
function confirmAction(title, text, label, fn, danger = false) {
  modal(`<h2>${esc(title)}</h2><p class="muted">${esc(text)}</p><div class="actions"><button class="btn outline" id="c-cancel">キャンセル</button><button class="btn ${danger ? 'danger' : 'primary'}" id="c-ok">${esc(label)}</button></div>`);
  $('#c-cancel').onclick = closeModal; $('#c-ok').onclick = () => { closeModal(); fn(); };
}
function download(name, body, type = 'application/json') {
  const a = document.createElement('a'), u = URL.createObjectURL(body instanceof Blob ? body : new Blob([body], { type }));
  a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
}
function csv(rows) { return '﻿' + rows.map(r => r.map(x => '"' + String(x ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n'); }
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
  document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); return ok;
}
// 敬称：「自分の学習」など人名でない名前や、すでに敬称があるときは付けない。
const honor = name => /(さん|くん|君|様|ちゃん|先生|の学習)$/.test(name) ? name : name + 'さん';
const pill = (label, cls = 'neutral') => `<span class="pill ${cls}">${esc(label)}</span>`;
const badge = s => pill(s.label, s.className);
const scorePill = s => pill(SCORE_NAMES[s], s === 1 ? 'good' : s === 0.5 ? 'warn' : 'bad');
function pageHead(title, sub = '', action = '') { return `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${action}</div>`; }
function emptyBox(title, text, action = '') { return `<div class="empty"><strong>${title}</strong><p>${text}</p>${action}</div>`; }
function rangeLabel(c) { return `${c.start === c.end ? c.start + '番' : c.start + '〜' + c.end + '番'}`; }
function listLabel(c) { return c.edition === VOCAB_SOURCE.edition && c.section === VOCAB_SOURCE.section ? '単熟語EX ' + c.edition : `${c.edition}／${c.section}`; }
// 日本語入力の確定Enterで送信しない（Safari は compositionend が keydown より先に来るため時刻でも判定）。
function guardEnter(input, onEnter) {
  let composing = false, endedAt = 0;
  input.addEventListener('compositionstart', () => { composing = true; });
  input.addEventListener('compositionend', () => { composing = false; endedAt = Date.now(); });
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (e.isComposing || composing || e.keyCode === 229 || Date.now() - endedAt < 120) return;
    e.preventDefault(); onEnter();
  });
}

// ---------- 集計 ----------
function listWords(c = state.config) {
  const list = new Map(bank().filter(w => w.edition === c.edition && w.section === c.section).map(w => [w.key, w]));
  for (const k of Object.keys(profile().memory)) {
    if (list.has(k)) continue;
    try { const [edition, section, no] = JSON.parse(k); if (edition === c.edition && section === c.section) list.set(k, { key: k, edition, section, no, en: '', ja: '' }); } catch {}
  }
  return [...list.values()].sort((a, b) => a.no - b.no);
}
function stats() {
  const list = listWords(), p = profile(), now = Date.now();
  const s = { total: list.length, confirmed: 0, checking: 0, recheck: 0, weak: 0, unseen: 0, due: 0, seen: 0, spellSeen: 0, spellConfirmed: 0, recogSeen: 0, recogWeak: 0 };
  for (const w of list) {
    const m = getMemory(p, w.key, 'receptive');
    if (m.seen) s.seen++;
    if (m.stage === 0) s.unseen++; else if (m.stage === 1) s.weak++; else if (isConfirmed(m, now)) s.confirmed++; else if (m.stage === 5) s.recheck++; else s.checking++;
    if (m.due != null && m.due <= now) s.due++;
    const sp = getMemory(p, w.key, 'productive'); if (sp.seen) s.spellSeen++; if (isConfirmed(sp, now)) s.spellConfirmed++;
    const rc = getMemory(p, w.key, 'recognition'); if (rc.seen) s.recogSeen++; if (recognitionWeak(rc)) s.recogWeak++;
  }
  return s;
}

// ---------- 画面の切り替え ----------
const ROUTES = { home: 'ホーム', create: 'テストを作る', test: 'テスト', result: 'テスト結果', report: '先生への報告', history: 'テストの記録', bank: '単語リスト', settings: '設定・データ', paper: '紙テスト' };
function route() { const [r, ...rest] = location.hash.replace(/^#/, '').split('/'); return { name: Object.hasOwn(ROUTES, r) ? r : 'home', arg: decodeURIComponent(rest.join('/')) }; }
function go(hash) { if (location.hash === '#' + hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', () => { closeModal(); render(); window.scrollTo({ top: 0 }); });
function renderChrome(r) {
  $('#learner').innerHTML = state.profiles.map(p => `<option value="${esc(p.id)}" ${p.id === state.active ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
  $('#page-title').textContent = ROUTES[r];
  const navKey = { test: 'create', result: 'history', paper: 'history' }[r] || r;
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === navKey || (a.dataset.nav === 'settings' && navKey === 'bank' && a.closest('.tabbar'))));
  document.body.classList.toggle('in-test', r === 'test' && !!profile().pending);
}
$('#learner').onchange = e => { state.active = e.target.value; save(); render(); toast(honor(profile().name) + 'の記録に切り替えました。'); };
function render() {
  const r = route();
  renderChrome(r.name);
  ({ home: renderHome, create: renderCreate, test: renderTest, result: () => renderResult(r.arg), report: () => renderReport(r.arg), history: renderHistory, bank: renderBank, settings: renderSettings, paper: () => renderPaper(r.arg) }[r.name])();
}

// ---------- ホーム ----------
function renderHome() {
  const s = stats(), p = profile(), recent = [...p.history].reverse().slice(0, 4);
  const stack = [['定着確認済み', s.confirmed, 'c-good'], ['チェック中', s.checking + s.recheck, 'c-mid'], ['要復習', s.weak, 'c-bad'], ['未確認', s.unseen, 'c-none']];
  app.innerHTML = `
  ${storageError ? `<div class="banner error">${esc(storageError)}</div>` : ''}
  ${legacyRaw ? `<div class="banner"><b>以前のアプリの記録が、このブラウザに見つかりました。</b><span>新しいアプリに移すと、学習者・定着状態・テスト履歴を引き継げます。元の記録は消しません。</span><button class="btn primary small" id="h-migrate">記録を移す</button></div>` : ''}
  ${p.pending ? `<div class="banner warn"><b>途中のテストがあります</b><span>${esc(MODE_NAMES[p.pending.config.mode])} · ${p.pending.results.length} / ${p.pending.questions.length}問 回答済み</span><button class="btn primary small" id="h-resume">続きから再開</button></div>` : ''}
  <section class="hero">
    <p class="hero-who">${esc(honor(p.name))} · ${esc(listLabel(state.config))}</p>
    <h1>${s.due ? `今日の復習が <em>${num(s.due)}</em> 語あります` : '今日、思い出せるか確かめよう'}</h1>
    <p>${s.due ? '日を空けた今こそ確認のタイミングです。答えを見る前に、自分で意味を思い出しましょう。' : '答えを見る前に、選択肢なしで意味を思い出すテストから始めましょう。'}</p>
    <button class="btn lime big" id="h-main">${s.due ? `復習テストを始める（${Math.min(20, s.due)}問）` : '1〜100番から20問を始める'}</button>
  </section>
  <section class="quick">
    ${s.due ? '<button class="quick-btn" data-quick="first100"><b>1〜100番から20問</b><small>意味を思い出す</small></button>' : '<button class="quick-btn" data-quick="new"><b>未確認の語から20問</b><small>全範囲・意味を思い出す</small></button>'}
    <button class="quick-btn" data-quick="all"><b>全${num(VOCAB_SOURCE.count)}項目から20問</b><small>意味を思い出す</small></button>
    <button class="quick-btn" data-quick="weak" ${s.weak ? '' : 'disabled'}><b>苦手な語を復習</b><small>要復習 ${num(s.weak)}語</small></button>
    <a class="quick-btn" href="#create"><b>条件を選んで作る</b><small>範囲・形式・紙テスト</small></a>
  </section>
  <section class="tiles">
    ${[['定着確認済み', s.confirmed, '日を空けた想起で確認'], ['意味を確認した語', s.seen, `対象${num(s.total)}語のうち`], ['今日の復習', s.due, '復習日を迎えた語'], ['もう一度覚える語', s.weak, '不正解・あいまい・迷った語']].map(([l, n, note]) => `<div class="tile"><span>${l}</span><strong>${num(n)}<small>語</small></strong><em>${note}</em></div>`).join('')}
  </section>
  <section class="card">
    <div class="card-head"><h2>意味の定着状況</h2><button class="btn link" id="h-rules">判定のしくみ</button></div>
    <div class="stackbar" role="img" aria-label="${stack.map(([l, n]) => `${l}${n}語`).join('、')}">${stack.map(([, n, c]) => n ? `<span class="${c}" style="flex:${n}"></span>` : '').join('')}</div>
    <div class="legend">${stack.map(([l, n, c]) => `<div><i class="${c}"></i>${l}<b>${num(n)}語</b></div>`).join('')}</div>
    <p class="note">対象は${esc(listLabel(state.config))}の${num(s.total)}語。定着確認済みの割合は ${s.total ? pct(s.confirmed, s.total) + '%' : '—'} です。書籍全体の習得率や英検の合格可能性を示す数値ではありません。</p>
    <div class="sub-stats"><div><span>英語のつづり（別管理）</span><b>記録 ${num(s.spellSeen)}語 · 定着確認済み ${num(s.spellConfirmed)}語</b></div><div><span>4択の識別（別管理）</span><b>実施 ${num(s.recogSeen)}語 · 前回不正解・自信なし ${num(s.recogWeak)}語</b></div></div>
  </section>
  <section class="card">
    <div class="card-head"><h2>最近のテスト</h2><a class="btn link" href="#history">すべての記録</a></div>
    ${recent.length ? `<div class="rows">${recent.map(historyRow).join('')}</div>` : emptyBox('まだテストの記録がありません。', 'テストを終えると、正答率と復習する語がここに残ります。')}
    <a class="btn outline full" href="#report">今日の学習を先生に報告する</a>
  </section>
  ${sourceCard()}`;
  if ($('#h-migrate')) $('#h-migrate').onclick = () => migrateLegacy();
  if ($('#h-resume')) $('#h-resume').onclick = () => go('test');
  $('#h-main').onclick = () => quickStart(s.due ? 'due' : 'first100');
  $$('[data-quick]').forEach(b => b.onclick = () => quickStart(b.dataset.quick));
  $('#h-rules').onclick = showRules;
}
function sourceCard() {
  return `<section class="card source"><h2>内蔵の単語データ</h2><p>単熟語EX準1級 第2版・全項目（番号${VOCAB_SOURCE.start}〜${VOCAB_SOURCE.end}、${num(BUILTIN.length)}項目）。単語・熟語・専門語をまとめた一覧で、番号は掲載ページの番号です。書籍原本との全件照合は済んでいないため、訳語は必ず本と合わせて確認してください。</p><p class="muted small">出典：<a href="${esc(VOCAB_SOURCE.url)}" target="_blank" rel="noopener noreferrer">${esc(VOCAB_SOURCE.title)}</a>（${esc(VOCAB_SOURCE.importedOn)} 取り込み）· 利用範囲：${esc(VOCAB_SOURCE.scope)}</p></section>`;
}
function quickStart(kind) {
  const base = { ...DEFAULT_CONFIG };
  const c = kind === 'all' ? { ...base, end: VOCAB_SOURCE.end }
    : kind === 'weak' ? { ...base, start: VOCAB_SOURCE.start, end: VOCAB_SOURCE.end, target: 'weak' }
    : kind === 'due' ? { ...base, start: VOCAB_SOURCE.start, end: VOCAB_SOURCE.end, target: 'due' }
    : kind === 'new' ? { ...base, start: VOCAB_SOURCE.start, end: VOCAB_SOURCE.end, target: 'new' }
    : base;
  state.config = c; save(); startTest(c);
}
function showRules() {
  modal(`<h2>定着の判定ルール</h2><p class="muted">復習の優先順位をつけるための運用基準です。忘れないことを保証する判定ではありません。</p><ol class="rules">
  <li>答えを見る前に回答を確定し、自信（自信あり・迷った・ほぼ勘）を選びます。</li>
  <li>採点は 正解＝1、あいまい＝0.5、不正解＝0。正答率に数えるのは「正解」だけです。</li>
  <li>正解でも「迷った」「ほぼ勘」は要復習とし、24時間後に再確認します。</li>
  <li>自信ありで正解した語は、24時間後 → そこから3日後 → さらに7日後に確認し、すべて自信ありで正解すると「定着確認済み」になります。</li>
  <li>予定時刻より前に何度正解しても、段階は進みません（同じ日の繰り返しでは進みません）。</li>
  <li>定着確認済みの語は14日後に再確認の対象になり、その間は定着確認済みの数から外れます。</li>
  <li>「意味を思い出す」「本と一緒に確認」は意味の想起、「英語を書く」はつづりの想起、「4択」は識別として、それぞれ別に記録します。4択とつづりの正解は、意味の定着確認済みの数に入りません。</li>
  <li>意味の採点は自動ではありません。登録訳語との一致は参考表示で、言い換えも中心的な意味が合っていれば正解にできます。</li>
  <li>回答時間は参考に記録しますが、判定には使いません。</li></ol>`);
}

// ---------- テスト作成 ----------
function editions() { return [...new Set([VOCAB_SOURCE.edition, state.config.edition, ...state.customWords.map(w => w.edition)])]; }
function selectHtml(id, values, current, labels = {}) { return `<select id="${id}">${values.map(v => `<option value="${esc(v)}" ${v === current ? 'selected' : ''}>${esc(labels[v] ?? v)}</option>`).join('')}</select>`; }
const TARGET_LABELS = { all: '範囲からランダム', smart: '復習・苦手・未確認を優先', due: '復習日を迎えた語だけ', weak: '要復習の語だけ', new: '未確認の語だけ' };
const MODE_DESC = { recall: '英語 → 日本語を入力。自分または先生が採点。', choice: '英語 → 4つから意味を選ぶ。自動採点。', spelling: '日本語 → 英語を入力。自動採点。', book: '番号だけ表示。本の英語を見て意味を答える。' };
function configPool(c) { return c.mode === 'book' ? bookPool(bankMap(), c) : rangePool(bank(), c); }
function renderCreate() {
  const c = state.config;
  app.innerHTML = pageHead('テストを作る', '範囲と形式を選んで、今の記憶を確かめましょう。') + `
  <section class="card"><h2>1. 出題範囲</h2>
    <div class="form-grid">
      <label class="field"><span>書籍の版・リスト</span>${selectHtml('f-edition', editions(), c.edition)}</label>
      <label class="field"><span>区分</span>${selectHtml('f-section', SECTIONS, c.section)}</label>
      <div class="field full"><span>番号の範囲</span><div class="range"><input type="number" inputmode="numeric" id="f-start" min="1" max="99999" value="${c.start}" aria-label="開始番号"><span>〜</span><input type="number" inputmode="numeric" id="f-end" min="1" max="99999" value="${c.end}" aria-label="終了番号"></div>
        <div class="presets">${[[1, 100], [101, 200], [201, 300], [1, 500], [1, VOCAB_SOURCE.end]].map(([a, b]) => `<button type="button" class="chip-btn" data-preset="${a}-${b}">${a}〜${b}</button>`).join('')}</div></div>
    </div>
  </section>
  <section class="card"><h2>2. 形式</h2><div class="modes">${Object.keys(MODE_NAMES).map(m => `<label class="mode"><input type="radio" name="f-mode" value="${m}" ${c.mode === m ? 'checked' : ''}><span><b>${MODE_NAMES[m]}</b><small>${MODE_DESC[m]}</small></span></label>`).join('')}</div><p class="note" id="f-mode-note"></p></section>
  <section class="card"><h2>3. 問題数と出題する語</h2>
    <div class="field"><span>問題数</span><div class="seg">${COUNTS.map(n => `<label><input type="radio" name="f-count" value="${n}" ${c.count === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div></div>
    <label class="field"><span>出題する語</span>${selectHtml('f-target', TARGETS, c.target, TARGET_LABELS)}</label>
    <p class="note" id="f-target-note"></p>
  </section>
  <div class="create-bar"><div id="f-preview"></div><div id="f-error" role="alert"></div><div class="actions"><button class="btn outline" id="f-paper">紙テストを作る</button><button class="btn primary grow" id="f-start-btn">テストを始める</button></div></div>`;
  ['f-edition', 'f-section', 'f-start', 'f-end', 'f-target'].forEach(id => $('#' + id).addEventListener('input', previewConfig));
  $$('[name="f-mode"],[name="f-count"]').forEach(x => x.addEventListener('change', previewConfig));
  $$('[data-preset]').forEach(b => b.onclick = () => { const [a, z] = b.dataset.preset.split('-'); $('#f-start').value = a; $('#f-end').value = z; previewConfig(); });
  $('#f-start-btn').onclick = () => { const cfg = readConfig(); if (!configError(cfg)) startTest(cfg); };
  $('#f-paper').onclick = () => { const cfg = readConfig(); if (!configError(cfg)) createPaper(cfg); };
  previewConfig();
}
function readConfig() {
  return { edition: $('#f-edition').value, section: $('#f-section').value, start: Number($('#f-start').value), end: Number($('#f-end').value), count: Number($('[name="f-count"]:checked').value), target: $('#f-target').value, mode: $('[name="f-mode"]:checked').value };
}
function eligible(c) { return configError(c) ? [] : pickWords(configPool(c), profile(), { ...c, count: 100000 }); }
function previewConfig() {
  const c = readConfig(), error = configError(c), family = FAMILY_OF[c.mode];
  $('#f-target').querySelector('option[value="due"]').disabled = c.mode === 'choice';
  const pool = error ? [] : configPool(c), avail = error ? [] : eligible(c), withData = pool.filter(w => w.en && w.ja).length;
  const count = Math.min(c.count, avail.length);
  $('#f-mode-note').textContent = {
    recall: '答えを見たあと、自分または先生が「正解・あいまい・不正解」で採点します。意味の想起として記録します。',
    choice: '4択の結果は「識別」として別に記録し、意味の定着段階は進めません。誤答の選択肢は、正解と意味が重なる語を除いて選びます。',
    spelling: '登録された英語と別解で自動採点します（大文字小文字・全角半角・余分な空白・「～」は区別しません。訳語がまったく同じ別の項目の英語も正解にします）。訳語に合う別の英語を書いて不正解になった場合は、先生が確認して正解に直せます。つづりの想起として別に記録します。',
    book: '本の日本語を隠し、番号の英語を本で見て意味を答えます。答えの確認後、本の訳語と照合して採点します。先生の口頭テストにも使えます。',
  }[c.mode];
  $('#f-target-note').textContent = `「${TARGET_LABELS[c.target]}」は${FAMILY_NAMES[family]}の記録で選びます。` + (c.mode === 'choice' ? '4択には復習日がないため「復習日を迎えた語だけ」は選べません。' : '');
  $('#f-preview').innerHTML = error ? '' : `<div class="preview"><b>${count}<small>問</small></b><span>${esc(MODE_NAMES[c.mode])} · ${esc(c.section)} ${rangeLabel(c)}</span><span class="muted">範囲内 ${num(pool.length)}語 · 条件に合う語 ${num(avail.length)}語${c.mode === 'book' ? '' : ` · データあり ${num(withData)}語`}</span></div>${count < c.count && count > 0 ? `<p class="small muted">条件に合う語が${count}語のため、重複なしで${count}問を出題します。</p>` : ''}${!error && c.mode !== 'book' && withData === 0 ? '<p class="small warn-text">この版・区分・範囲には単語データがありません。区分「全項目」を選ぶか、「本と一緒に確認」を使ってください。</p>' : ''}${!error && count === 0 && withData > 0 ? '<p class="small warn-text">条件に合う語がありません。「出題する語」を変えてください。</p>' : ''}`;
  $('#f-error').innerHTML = error ? `<div class="banner error">${esc(error)}</div>` : '';
  $('#f-start-btn').disabled = $('#f-paper').disabled = !!error || count === 0;
  if (!error) { state.config = c; save(); }
}
function buildQuestions(c, words) {
  const pool = rangePool(bank(), c), wide = bank().filter(w => w.edition === c.edition && w.section === c.section);
  const qs = [];
  for (const w of words) {
    const q = { key: w.key, no: w.no, edition: w.edition, section: w.section, en: w.en, ja: w.ja, aliases: c.mode === 'spelling' ? spellingAliases(w, wide) : (w.aliases || []) };
    if (c.mode === 'choice') { const o = choiceOptions(w, pool, wide); if (!o) return null; q.options = o.options; q.answer = o.answer; }
    qs.push(q);
  }
  return qs;
}
function startTest(c, presetWords = null) {
  const error = configError(c); if (error) { toast(error); return; }
  const words = presetWords || pickWords(configPool(c), profile(), c);
  if (!words.length) { toast('条件に合う語がありません。'); go('create'); return; }
  if (c.mode === 'choice' && words.some(w => !w.en || !w.ja)) { toast('4択には英語と訳語のデータが必要です。'); return; }
  const questions = buildQuestions(c, words);
  if (!questions) { toast('4択の選択肢を作れませんでした。範囲を広げてください。'); return; }
  const begin = () => {
    profile().pending = { id: uid('s_'), config: { ...c }, questions, results: [], excluded: [], index: 0, startedAt: Date.now(), questionStartedAt: Date.now(), phase: 'answer', draft: '', confidence: '', selected: null, skipped: false };
    save(); go('test');
  };
  if (profile().pending) confirmAction('途中のテストがあります', `新しいテストを始めると、途中のテスト（${profile().pending.results.length}問回答済み）は破棄されます。完了したテストの記録は残ります。`, '新しく始める', begin, true);
  else begin();
}

// ---------- テスト ----------
function renderTest() {
  const p = profile(), s = p.pending;
  if (!s) { app.innerHTML = pageHead('テスト') + emptyBox('進行中のテストはありません。', '範囲と形式を選んで始めましょう。', '<a class="btn primary" href="#create">テストを作る</a>'); return; }
  const q = s.questions[s.index]; if (!q) { finishTest(); return; }
  const c = s.config, mode = c.mode, grading = s.phase === 'grade';
  if (!grading && !s.questionStartedAt) s.questionStartedAt = Date.now();
  const prompt = mode === 'spelling' ? q.ja : mode === 'book' ? 'No. ' + q.no : q.en;
  app.innerHTML = `<div class="session">
    <div class="session-top"><span>${esc(MODE_NAMES[mode])} · <b>${s.index + 1}</b> / ${s.questions.length}</span><button class="btn link" id="t-pause">保存して中断</button></div>
    <div class="progress" role="progressbar" aria-valuenow="${s.results.length}" aria-valuemin="0" aria-valuemax="${s.questions.length}" aria-label="進み具合"><span style="width:${pct(s.index, s.questions.length)}%"></span></div>
    <section class="card qcard">
      <div class="qmeta"><span>No. ${q.no}</span><span>${esc(listLabel(c))}</span></div>
      <div class="prompt ${mode === 'spelling' ? 'ja' : ''}">${esc(prompt)}</div>
      <p class="prompt-note">${mode === 'book' ? '本の日本語を隠し、この番号の英語を見て意味を答えてください。' : mode === 'spelling' ? 'この意味の英語を書いてください。' : mode === 'choice' ? '意味に合うものを選んでください。' : 'この英語の意味を日本語で答えてください。'}</p>
      ${mode === 'choice' ? `<div class="choices">${q.options.map((o, i) => `<button class="choice ${s.selected === i ? 'selected' : ''} ${grading && i === q.answer ? 'right' : ''} ${grading && s.selected === i && i !== q.answer ? 'wrong' : ''}" data-choice="${i}" ${grading ? 'disabled' : ''}><b>${i + 1}</b><span>${esc(o.ja)}</span></button>`).join('')}</div>`
      : `<input id="t-answer" class="answer" maxlength="300" value="${esc(s.skipped ? '' : s.draft)}" placeholder="${mode === 'spelling' ? '英語を入力' : '思い出した意味を入力'}" autocomplete="off" ${mode === 'spelling' ? 'lang="en" autocapitalize="off" autocorrect="off" spellcheck="false"' : 'lang="ja"'} ${grading ? 'readonly' : ''} aria-label="回答">`}
      ${grading ? gradeHtml(s, q) : `<p class="conf-label">自信を選ぶと答えが表示されます</p><div class="conf">${Object.entries(CONFIDENCES).map(([k, l]) => `<button class="conf-btn conf-${k}" data-conf="${k}">${l}</button>`).join('')}</div><div id="t-error" role="alert"></div><button class="btn link center" id="t-skip">思い出せない（答えを見る）</button>`}
    </section>
    <div class="session-bottom"><button class="btn link" id="t-finish">ここまでを保存して終了</button></div>
  </div>`;
  $('#t-pause').onclick = () => { save(); go('home'); toast('途中の状態を保存しました。ホームから再開できます。'); };
  $('#t-finish').onclick = () => {
    if (!s.results.length) { confirmAction('テストを終了する', 'まだ採点済みの回答がありません。このテストを記録せずに終了しますか。', '記録せずに終了', () => { p.pending = null; save(); go('home'); }, true); return; }
    confirmAction('ここまでの結果を保存する', `採点済みの${s.results.length}問を保存します。残りの${s.questions.length - s.index}問は未回答として、正答率・定着の集計に含めません。`, '保存して終了', finishTest);
  };
  if (!grading) {
    const input = $('#t-answer');
    if (input) {
      input.oninput = e => { s.draft = e.target.value; saveSoon(); };
      guardEnter(input, () => input.blur()); // Enterでは送信せず、キーボードを閉じるだけ
    }
    $$('[data-choice]').forEach(b => b.onclick = () => { s.selected = Number(b.dataset.choice); saveSoon(); $$('[data-choice]').forEach(x => x.classList.toggle('selected', x === b)); });
    $$('[data-conf]').forEach(b => b.onclick = () => reveal(b.dataset.conf));
    $('#t-skip').onclick = () => { s.skipped = true; s.draft = ''; s.selected = null; s.confidence = 'guess'; s.latency = Math.max(0, Date.now() - s.questionStartedAt); s.phase = 'grade'; save(); renderTest(); };
  } else bindGrade(s, q);
}
function reveal(conf) {
  const s = profile().pending, mode = s.config.mode, err = t => { $('#t-error').innerHTML = `<p class="small warn-text">${t}</p>`; };
  if (mode === 'choice' && s.selected == null) return err('選択肢を選んでから自信を選んでください。わからなければ「思い出せない」を押してください。');
  if (mode !== 'choice') { s.draft = $('#t-answer').value; if (!s.draft.trim()) return err('回答を入力してから自信を選んでください。わからなければ「思い出せない」を押してください。'); }
  s.confidence = conf; s.skipped = false; s.latency = Math.max(0, Date.now() - s.questionStartedAt); s.phase = 'grade'; save(); renderTest();
}
function gradeHtml(s, q) {
  const mode = s.config.mode, manual = mode === 'recall' || mode === 'book';
  const answer = s.skipped ? '思い出せなかった' : mode === 'choice' ? q.options[s.selected].ja : s.draft;
  const shown = mode === 'spelling' ? q.en : q.ja;
  let html = `<div class="reveal"><span>答え</span><strong class="${mode === 'spelling' ? 'en' : ''}">${shown ? esc(shown) : '本の訳語で確認してください'}</strong>${mode !== 'spelling' && q.en ? `<em>${esc(q.en)}</em>` : ''}<p>あなたの回答：<b>${esc(answer)}</b> <small>（${esc(CONFIDENCES[s.confidence] || '')}）</small></p></div>`;
  if (s.skipped) { s.autoScore = 0; return html + `<p class="note warn">不正解として記録し、24時間後の復習に回します。</p><button class="btn primary full" id="t-next">記録して次へ</button>`; }
  if (manual) {
    const hint = q.ja && japaneseMatch(s.draft, q);
    return html + (hint ? '<p class="note good">登録された訳語の一つと一致しています。意味が合っているか確認して採点してください。</p>' : '') + `${mode === 'book' ? '<p class="small muted">表示の訳語は内蔵データです。本の訳語とも照らし合わせてください。</p>' : ''}<p class="small muted">中心的な意味が合っていれば、言い換えも正解です。</p><div class="grades"><button class="grade g-good" data-grade="1">正解<small>合っている</small></button><button class="grade g-mid" data-grade="0.5">あいまい<small>一部・不正確</small></button><button class="grade g-bad" data-grade="0">不正解<small>違う</small></button></div>`;
  }
  s.autoScore = mode === 'spelling' ? (englishCorrect(s.draft, q) ? 1 : 0) : (s.selected === q.answer ? 1 : 0);
  const msg = s.autoScore ? (s.confidence === 'sure' ? '正解です。' : '正解です。迷った語として、翌日に再確認します。') : '今回は不正解です。';
  return html + `<p class="note ${s.autoScore ? 'good' : 'warn'}">${msg}${mode === 'choice' ? '（4択の結果として記録し、意味の定着段階は進めません）' : ''}</p><button class="btn primary full" id="t-next">記録して次へ</button>
    ${mode === 'spelling' && !s.autoScore ? '<button class="btn link center" id="t-override">表記の違いだけなので正解にする（先生確認）</button>' : ''}
    ${mode === 'choice' ? '<button class="btn link center" id="t-flag">選択肢に問題がある（この問題は記録しない）</button>' : ''}`;
}
function bindGrade(s, q) {
  $$('[data-grade]').forEach(b => b.onclick = () => commitAnswer(Number(b.dataset.grade)));
  if ($('#t-next')) $('#t-next').onclick = () => commitAnswer(s.autoScore);
  if ($('#t-override')) $('#t-override').onclick = () => commitAnswer(1, '自動採点→手動で正解に修正');
  if ($('#t-flag')) $('#t-flag').onclick = () => confirmAction('選択肢の問題を報告', 'この問題は正答率・記録に含めず、選択肢を「設定・データ」の報告一覧に残します。先生が確認できます。', '報告して次へ', () => {
    state.flags.push({ at: Date.now(), learner: profile().name, key: q.key, no: q.no, en: q.en, ja: q.ja, options: q.options.map(o => o.ja), selected: s.selected });
    s.excluded = [...(s.excluded || []), q.key]; advance(s);
  });
}
function commitAnswer(score, gradingNote) {
  const s = profile().pending; if (!s || s.phase !== 'grade') return;
  const q = s.questions[s.index], mode = s.config.mode;
  s.results.push({ key: q.key, no: q.no, edition: q.edition, section: q.section, en: q.en, ja: q.ja, answer: s.skipped ? '' : mode === 'choice' ? q.options[s.selected].ja : s.draft, score, confidence: s.confidence, mode, at: Date.now(), latency: s.latency || 0, grading: gradingNote || (mode === 'recall' || mode === 'book' ? '自己・講師採点' : '自動採点') });
  advance(s);
}
function advance(s) {
  s.index++; s.phase = 'answer'; s.draft = ''; s.confidence = ''; s.selected = null; s.skipped = false; s.latency = 0; s.questionStartedAt = Date.now();
  save();
  if (s.index >= s.questions.length) finishTest(); else { renderTest(); window.scrollTo({ top: 0 }); const i = $('#t-answer'); if (i && window.matchMedia('(hover:hover)').matches) i.focus(); }
}
function finishTest() {
  const p = profile(), s = p.pending; if (!s) return;
  if (!s.results.length) { p.pending = null; save(); toast('記録する回答がなかったため、テストを終了しました。'); go('home'); return; }
  for (const a of s.results) applyAttempt(p, a);
  const h = { id: s.id, at: Date.now(), startedAt: s.startedAt, config: s.config, planned: s.questions.length, results: s.results, excluded: (s.excluded || []).length, source: 'screen' };
  p.history.push(h); p.pending = null; save(); go('result/' + h.id);
}
// 中断・再開時は、離れていた時間を回答時間に含めない。
function resumeTiming() { const s = profile().pending; if (s && s.phase === 'answer') s.questionStartedAt = Date.now(); }

// ---------- 結果 ----------
function historyRow(h) {
  const t = tally(h.results);
  return `<a class="row" href="#result/${encodeURIComponent(h.id)}"><div><b>${esc(MODE_NAMES[h.config.mode])} · ${esc(h.config.section)} ${rangeLabel(h.config)}</b><small>${stamp(h.at)} · ${h.results.length}問${h.source === 'paper' ? ' · 紙テスト' : ''}</small></div>${pill(t.rate + '%', t.rate >= 90 ? 'good' : t.rate >= 60 ? 'warn' : 'bad')}</a>`;
}
function weakOf(h) { return h.results.filter(a => a.score < 1 || a.confidence !== 'sure'); }
function renderResult(id) {
  const p = profile(), h = p.history.find(x => x.id === id) || p.history.at(-1);
  if (!h) { app.innerHTML = pageHead('テスト結果') + emptyBox('表示できる結果がありません。', 'テストを終えると、ここに結果が表示されます。', '<a class="btn primary" href="#create">テストを作る</a>'); return; }
  const mode = h.config.mode, family = FAMILY_OF[mode], t = tally(h.results), weak = weakOf(h);
  const measured = h.results.filter(a => a.latency > 0), avg = measured.length ? Math.round(measured.reduce((n, a) => n + a.latency, 0) / measured.length / 1000) : null;
  app.innerHTML = pageHead('テスト結果', `${esc(honor(p.name))} · ${stamp(h.at)}`) + `
  <section class="card result">
    <span class="kicker">${esc(FAMILY_NAMES[family])} · ${esc(MODE_NAMES[mode])}${h.source === 'paper' ? ' · 紙テスト' : ''}</span>
    <div class="score">${t.rate}<small>%</small></div>
    <p>正解 ${t.correct} / ${t.n}問（あいまい ${t.partial}・不正解 ${t.wrong}）${h.planned > t.n ? `<br><span class="muted small">未回答・除外 ${h.planned - t.n}問は集計に含めていません</span>` : ''}</p>
    <p class="muted small">${esc(listLabel(h.config))} · ${rangeLabel(h.config)} · ${mode === 'recall' || mode === 'book' ? '自己・講師採点' : '自動採点'}</p>
    <div class="strip"><div><span>正解・自信あり</span><b>${t.sureCorrect}語</b></div><div><span>要復習</span><b>${weak.length}語</b></div><div><span>平均回答時間</span><b>${avg == null ? '—' : avg + '秒'}</b></div></div>
    <p class="note">${mode === 'choice' ? '4択の正解は意味の定着段階を進めません。次は選択肢なしで意味を思い出すテストで確かめましょう。' : weak.length ? `不正解・あいまい・迷った正解の${weak.length}語を要復習にしました。正解でも迷った語は翌日に再確認します。` : 'すべて自信ありで正解でした。日を空けた再テストで、覚えているかを確かめましょう。'} 回答時間は参考値で、判定には使いません。</p>
    <div class="actions col"><button class="btn primary" id="r-retry" ${weak.length && h.results.every(a => a.edition) ? '' : 'disabled'}>要復習の${weak.length}語をもう一度${mode === 'choice' ? '（意味を思い出す形式）' : ''}</button><a class="btn outline" href="#report/${dayKey(h.at)}">この日の報告を見る</a><button class="btn outline" id="r-csv">結果をCSV保存</button></div>
  </section>
  <section class="card"><div class="card-head"><h2>回答と次の復習</h2><span class="muted small">あいまいは正解数に含めません</span></div>
    <div class="answers">${h.results.map(a => { const st = statusOf(p, a.key, family), m = getMemory(p, a.key, family); return `<div class="ans"><div class="ans-word"><small>No.${a.no}</small><b>${esc(a.en || '本で確認')}</b></div><div class="ans-body"><span>回答：${esc(a.answer || '思い出せなかった')}</span><span class="muted">答え：${esc(mode === 'spelling' ? a.en : a.ja || '書籍で照合')}</span></div><div class="ans-tags">${scorePill(a.score)}${pill(CONFIDENCES[a.confidence] || '', 'neutral')}${badge(st)}${family !== 'recognition' && m.due ? `<small class="muted">次回 ${shortStamp(m.due)}</small>` : ''}</div></div>`; }).join('')}</div>
  </section>`;
  $('#r-csv').onclick = () => exportHistoryCsv(h);
  $('#r-retry').onclick = () => {
    const c = { ...h.config, target: 'all', count: COUNTS.find(n => n >= weak.length) || 100 };
    if (c.mode === 'choice') c.mode = 'recall';
    const words = weak.map(a => bankMap().get(a.key) || { key: a.key, no: a.no, edition: a.edition, section: a.section, en: a.en, ja: a.ja, aliases: [] });
    if (c.mode !== 'book' && words.some(w => !w.en || !w.ja)) c.mode = 'book';
    startTest(c, shuffle(words));
  };
}
function exportHistoryCsv(h) {
  const name = profile().name;
  download(`定着チェック結果_${name}_${dayKey(h.at)}.csv`, csv([['学習者', '日時', '版', '区分', '番号', '英語', '答え', '回答', '判定', '自信', '形式', '採点方法', '回答秒'],
    ...h.results.map(a => [name, stamp(a.at), a.edition, a.section, a.no, a.en, a.ja, a.answer, SCORE_NAMES[a.score], CONFIDENCES[a.confidence], MODE_NAMES[a.mode], a.grading, a.latency > 0 ? Math.round(a.latency / 1000) : '未計測'])]), 'text/csv;charset=utf-8');
}

// ---------- 報告 ----------
function reportWords() { return bank().filter(w => w.edition === state.config.edition && w.section === state.config.section); }
function renderReport(arg) {
  const today = dayKey(Date.now()), day = /^\d{4}-\d{2}-\d{2}$/.test(arg) ? arg : today;
  const p = profile(), r = buildReport(p, reportWords(), day);
  const days = [...new Set(p.history.flatMap(h => h.results.map(x => dayKey(x.at))))].sort().reverse().slice(0, 30);
  const fam = ['receptive', 'recognition', 'productive'].filter(f => r.byFamily[f].n);
  const c = r.counts, n = r.next;
  app.innerHTML = `
  <div class="report-tools"><button class="btn outline small" id="rp-prev" aria-label="前の日">‹</button><input type="date" id="rp-day" value="${day}" max="${today}" aria-label="報告する日"><button class="btn outline small" id="rp-next" aria-label="次の日" ${day >= today ? 'disabled' : ''}>›</button></div>
  <section class="report" id="report-card">
    <header><span>スタスタLIVE英検 · 単熟語EX準1級</span><h1>${esc(honor(r.learner))}の学習報告</h1><p>${formatDay(day)}${r.isToday ? `（${new Date(r.generatedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}時点）` : ''}</p></header>
    ${r.total ? `
    <div class="rp-main"><div><span>実施</span><b>${r.total}<small>問</small></b><em>${r.testCount}回のテスト</em></div><div><span>意味の想起 正答率</span><b>${r.byFamily.receptive.n ? r.byFamily.receptive.rate + '<small>%</small>' : '—'}</b><em>${r.byFamily.receptive.n ? `${r.byFamily.receptive.correct} / ${r.byFamily.receptive.n}問 正解` : '実施なし'}</em></div></div>
    <ul class="rp-lines">${fam.map(f => `<li>${esc(familyLine(f, r.byFamily[f]))}</li>`).join('')}<li>範囲：${esc(formatRanges(r))}</li></ul>
    <div class="rp-block"><h2>要復習 ${r.weak.length}語</h2>${r.weak.length ? `<ol class="rp-weak">${r.weak.slice(0, 6).map(w => `<li><span>No.${w.no}</span><b>${esc(w.en || '本で確認')}</b><em>${esc(w.ja)}</em></li>`).join('')}</ol>${r.weak.length > 6 ? `<p class="small muted">ほか${r.weak.length - 6}語（全語はコピーした報告文に入ります）</p>` : ''}` : '<p class="small">この日の要復習はありません。</p>'}</div>`
    : '<p class="rp-empty">この日のテスト記録はありません。</p>'}
    <div class="rp-block"><h2>次の復習（意味の想起）</h2><div class="rp-next"><div><b>${n.dueNow}</b><span>今すぐ</span></div><div><b>${n.dueTomorrow}</b><span>明日</span></div><div><b>${n.dueWeek}</b><span>7日以内</span></div></div></div>
    <div class="rp-block"><h2>意味の定着状況（${num(c.total)}語中）</h2><div class="stackbar slim">${[[c.confirmed, 'c-good'], [c.checking + c.recheck, 'c-mid'], [c.weak, 'c-bad'], [c.unseen, 'c-none']].map(([v, k]) => v ? `<span class="${k}" style="flex:${v}"></span>` : '').join('')}</div><p class="rp-counts">定着確認済み <b>${num(c.confirmed)}</b> · チェック中 <b>${num(c.checking + c.recheck)}</b> · 要復習 <b>${num(c.weak)}</b> · 未確認 <b>${num(c.unseen)}</b></p></div>
    <footer>正答率はその日のテスト結果です。定着率や合格可能性を示すものではありません。</footer>
  </section>
  <div class="actions col report-actions"><button class="btn primary" id="rp-copy">報告文をコピー（LINE用）</button><button class="btn outline" id="rp-image">画像で保存・共有</button><p class="small muted">この画面をそのままスクリーンショットしても報告できます。</p>${days.length ? `<label class="field"><span>記録のある日から選ぶ</span><select id="rp-days">${['<option value="">日付を選ぶ</option>', ...days.map(d => `<option value="${d}" ${d === day ? 'selected' : ''}>${formatDay(d)}</option>`)].join('')}</select></label>` : ''}</div>
  <details class="card"><summary>コピーされる文面を見る</summary><pre class="rp-text">${esc(reportText(r))}</pre></details>`;
  const to = d => go('report/' + d);
  $('#rp-day').onchange = e => { if (e.target.value) to(e.target.value); };
  $('#rp-prev').onclick = () => to(dayKey(addDays(dayStart(day), -1)));
  $('#rp-next').onclick = () => to(dayKey(addDays(dayStart(day), 1)));
  if ($('#rp-days')) $('#rp-days').onchange = e => { if (e.target.value) to(e.target.value); };
  $('#rp-copy').onclick = async () => toast(await copyText(reportText(r)) ? '報告文をコピーしました。LINEに貼り付けて送れます。' : 'コピーできませんでした。下の文面を長押しして選択してください。');
  $('#rp-image').onclick = () => saveReportImage(r);
}
function reportCanvas(r) {
  const W = 1080, pad = 64, scale = 1, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  const font = (w, s) => `${w} ${s}px "Hiragino Sans","Noto Sans JP","Yu Gothic",sans-serif`;
  const ops = []; let y = pad;
  const text = (t, size, { weight = 400, color = '#233543', x = pad, max = W - pad * 2, lh = 1.5 } = {}) => {
    ctx.font = font(weight, size); const lines = []; let line = '';
    for (const ch of String(t)) { if (ctx.measureText(line + ch).width > max && line) { lines.push(line); line = ch; } else line += ch; }
    if (line) lines.push(line);
    for (const l of lines) { ops.push({ t: l, size, weight, color, x, y: y + size }); y += size * lh; }
  };
  const gap = h => { y += h; };
  text('スタスタLIVE英検 · 単熟語EX準1級', 28, { color: '#167f72', weight: 700 }); gap(6);
  text(`${honor(r.learner)}の学習報告`, 52, { weight: 700 }); text(formatDay(r.day), 32, { color: '#71808b' }); gap(24);
  if (r.total) {
    text(`実施 ${r.total}問（${r.testCount}回）`, 40, { weight: 700 });
    for (const f of ['receptive', 'recognition', 'productive']) { const l = familyLine(f, r.byFamily[f]); if (l) text('・' + l, 32); }
    text('範囲：' + formatRanges(r), 32); gap(20);
    text(`要復習 ${r.weak.length}語`, 38, { weight: 700, color: '#a4473c' });
    for (const w of r.weak.slice(0, 10)) text(`No.${w.no}  ${w.en || '本で確認'}　${w.ja}`, 30);
    if (r.weak.length > 10) text(`ほか${r.weak.length - 10}語`, 28, { color: '#71808b' });
  } else text('この日のテスト記録はありません。', 34);
  gap(20);
  text('次の復習（意味の想起）', 38, { weight: 700 });
  text(`今すぐ ${r.next.dueNow}語 · 明日 ${r.next.dueTomorrow}語 · 7日以内 ${r.next.dueWeek}語`, 32); gap(20);
  text(`意味の定着状況（${num(r.counts.total)}語中）`, 38, { weight: 700 });
  text(`定着確認済み ${num(r.counts.confirmed)} · チェック中 ${num(r.counts.checking + r.counts.recheck)} · 要復習 ${num(r.counts.weak)} · 未確認 ${num(r.counts.unseen)}`, 30); gap(24);
  text('正答率はその日のテスト結果です。定着率や合格可能性を示すものではありません。', 24, { color: '#71808b' });
  y += pad;
  cv.width = W * scale; cv.height = Math.ceil(y) * scale; ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, y); ctx.fillStyle = '#162d3d'; ctx.fillRect(0, 0, W, 14);
  for (const o of ops) { ctx.font = font(o.weight, o.size); ctx.fillStyle = o.color; ctx.fillText(o.t, o.x, o.y); }
  return cv;
}
function saveReportImage(r) {
  const cv = reportCanvas(r), name = `学習報告_${r.learner}_${r.day}.png`;
  cv.toBlob(async blob => {
    if (!blob) { toast('画像を作れませんでした。画面のスクリーンショットをお使いください。'); return; }
    const file = new File([blob], name, { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: '学習報告' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    download(name, blob); toast('報告画像を保存しました。');
  }, 'image/png');
}

// ---------- 記録 ----------
function renderHistory() {
  const p = profile(), hs = [...p.history].reverse(), meaning = hs.filter(h => FAMILY_OF[h.config.mode] === 'receptive').slice(0, 10).reverse();
  const papers = p.paperTests || [];
  app.innerHTML = pageHead('テストの記録', `${esc(honor(p.name))} · 形式と範囲を分けて確認できます。`, '<a class="btn outline small" href="#report">報告を作る</a>') + `
  ${papers.length ? `<section class="card"><h2>採点待ちの紙テスト</h2><div class="rows">${papers.map(t => `<a class="row" href="#paper/${encodeURIComponent(t.id)}"><div><b>${esc(MODE_NAMES[t.config.mode])} · ${esc(t.config.section)} ${rangeLabel(t.config)}</b><small>${stamp(t.createdAt)} 作成 · ${t.questions.length}問 · 採点 ${t.grades.filter(g => g && g.score != null).length}問済み</small></div>${pill('採点する', 'warn')}</a>`).join('')}</div></section>` : ''}
  <section class="card"><div class="card-head"><h2>最近の意味想起テスト</h2><span class="muted small">直近10回</span></div>
    ${meaning.length ? `<div class="chart" role="img" aria-label="直近の意味想起テストの正答率">${meaning.map(h => { const t = tally(h.results); return `<div class="col"><b>${t.rate}%</b><div class="bar"><span style="height:${t.rate}%"></span></div><small>${md(h.at)}</small><small class="muted">${h.results.length}問</small></div>`; }).join('')}</div><p class="small muted">各回で範囲や問題数が異なります。グラフだけで定着の伸びを判断せず、日を空けた語ごとの結果も確認してください。</p>` : emptyBox('意味想起テストの記録がありません。', '「意味を思い出す」または「本と一緒に確認」のテストを終えると表示されます。')}
  </section>
  <section class="card"><div class="card-head"><h2>すべてのテスト</h2><span class="muted small">${hs.length}回</span></div>${hs.length ? `<div class="rows">${hs.map(historyRow).join('')}</div>` : emptyBox('まだ記録がありません。', '小さな範囲からテストを作ってみましょう。', '<a class="btn primary" href="#create">テストを作る</a>')}</section>`;
}

// ---------- 紙テスト ----------
function createPaper(c) {
  const words = pickWords(configPool(c), profile(), c);
  if (!words.length) { toast('条件に合う語がありません。'); return; }
  const questions = buildQuestions(c, words);
  if (!questions) { toast('4択の選択肢を作れませんでした。範囲を広げてください。'); return; }
  const t = { id: uid('paper_'), createdAt: Date.now(), config: { ...c }, questions, grades: questions.map(() => null) };
  profile().paperTests.push(t); save(); go('paper/' + t.id);
}
function paperPrompt(c, q) { return c.mode === 'spelling' ? q.ja : c.mode === 'book' ? '本の番号 ' + q.no : q.en; }
function paperAnswer(c, q) { return c.mode === 'choice' ? `${q.answer + 1}. ${q.options[q.answer].ja}` : c.mode === 'spelling' ? [q.en, ...(q.aliases || [])].join(' / ') : q.ja || '書籍で照合'; }
function renderPaper(id) {
  const p = profile(), t = (p.paperTests || []).find(x => x.id === id);
  if (!t) { app.innerHTML = pageHead('紙テスト') + emptyBox('この紙テストは見つかりません。', 'すでに記録済みか、削除された可能性があります。', '<a class="btn primary" href="#history">記録を見る</a>'); return; }
  const c = t.config, done = t.grades.filter(g => g && g.score != null).length;
  app.innerHTML = pageHead('紙テスト', `${esc(MODE_NAMES[c.mode])} · ${esc(c.section)} ${rangeLabel(c)} · ${t.questions.length}問 · ${stamp(t.createdAt)} 作成`) + `
  <section class="card"><h2>1. 印刷する</h2><p class="small muted">問題と解答は別のページに印刷されます。ブラウザの印刷画面からPDFとしても保存できます。</p><div class="actions"><button class="btn primary" id="pp-print">問題と解答を印刷</button></div>
  <p class="note">紙で解いた結果は自動では記録されません。採点したら、下で1問ずつ結果を入力してください（記録日時は入力した日時になります）。</p></section>
  <section class="card"><div class="card-head"><h2>2. 採点を入力</h2><span class="muted small">${done} / ${t.questions.length}問</span></div>
  <div class="paper-list">${t.questions.map((q, i) => { const g = t.grades[i] || {}; return `<div class="paper-q" data-i="${i}"><div class="pq-head"><b>${i + 1}.</b><span>No.${q.no} ${esc(paperPrompt(c, q))}</span></div><p class="small muted">答え：${esc(paperAnswer(c, q))}</p><div class="pq-inputs"><input placeholder="生徒の回答（任意）" value="${esc(g.answer || '')}" data-pq-answer aria-label="${i + 1}問目の回答"><select data-pq-conf aria-label="${i + 1}問目の自信">${[['unsure', '自信は不明・迷った'], ['sure', '自信ありと答えた'], ['guess', 'ほぼ勘']].map(([v, l]) => `<option value="${v}" ${(g.confidence || 'unsure') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div><div class="grades small-grades">${[[1, '正解', 'g-good'], [0.5, 'あいまい', 'g-mid'], [0, '不正解', 'g-bad']].map(([s, l, k]) => `<button class="grade ${k} ${g.score === s ? 'on' : ''}" data-pq-score="${s}">${l}</button>`).join('')}</div></div>`; }).join('')}</div>
  <p class="small muted">自信が不明な場合は「迷った」扱いになり、定着の段階は進みません。</p>
  <div class="actions col"><button class="btn primary" id="pp-save" ${done ? '' : 'disabled'}>${done === t.questions.length ? '採点を記録する' : `採点済みの${done}問を記録する`}</button><button class="btn link danger-text" id="pp-delete">この紙テストを削除</button></div></section>`;
  $('#pp-print').onclick = () => printPaper(t);
  $$('.paper-q').forEach(row => {
    const i = Number(row.dataset.i), grade = () => (t.grades[i] ||= { score: null, answer: '', confidence: 'unsure' });
    $('[data-pq-answer]', row).oninput = e => { grade().answer = e.target.value; saveSoon(); };
    $('[data-pq-conf]', row).onchange = e => { grade().confidence = e.target.value; save(); };
    $$('[data-pq-score]', row).forEach(b => b.onclick = () => { const g = grade(); g.score = Number(b.dataset.pqScore); g.answer = $('[data-pq-answer]', row).value; g.confidence = $('[data-pq-conf]', row).value; save(); const y = window.scrollY; renderPaper(id); window.scrollTo({ top: y }); });
  });
  $('#pp-save').onclick = () => {
    const graded = t.grades.map((g, i) => g && g.score != null ? i : -1).filter(i => i >= 0);
    const finish = () => {
      const now = Date.now();
      const results = graded.map(i => { const q = t.questions[i], g = t.grades[i]; return { key: q.key, no: q.no, edition: q.edition, section: q.section, en: q.en, ja: q.ja, answer: g.answer || '', score: g.score, confidence: g.confidence, mode: c.mode, at: now, latency: 0, grading: '紙テスト・講師採点' }; });
      results.forEach(a => applyAttempt(p, a));
      const h = { id: uid('h_'), at: now, startedAt: t.createdAt, config: c, planned: t.questions.length, results, source: 'paper' };
      p.history.push(h); p.paperTests = p.paperTests.filter(x => x.id !== t.id); save(); go('result/' + h.id);
    };
    if (graded.length < t.questions.length) confirmAction('採点済みの問題だけ記録する', `未採点の${t.questions.length - graded.length}問は記録しません。`, '記録する', finish); else finish();
  };
  $('#pp-delete').onclick = () => confirmAction('紙テストを削除', '入力した採点も削除されます。', '削除する', () => { p.paperTests = p.paperTests.filter(x => x.id !== t.id); save(); go('history'); }, true);
}
function printPaper(t) {
  const c = t.config, qs = t.questions;
  const instr = c.mode === 'book' ? '先生が読み上げる（または本で示す）番号の英語の意味を、日本語で書いてください。' : c.mode === 'spelling' ? '日本語に合う英語を書いてください。' : c.mode === 'choice' ? '英語の意味に合う選択肢の番号を書いてください。' : '英語の意味を日本語で書いてください。';
  $('#print-area').innerHTML = `<section class="print-page"><h1>単熟語EX 準1級 確認テスト</h1><div class="print-meta"><span>${esc(listLabel(c))} · ${esc(c.section)} ${rangeLabel(c)} · ${esc(MODE_NAMES[c.mode])} · ${qs.length}問</span><span>名前 ____________________　日付 ______________</span></div><p>${instr}</p>
  <table><thead><tr><th class="n">問</th><th>問題</th><th class="blank-h">回答</th></tr></thead><tbody>${qs.map((q, i) => `<tr><td class="n">${i + 1}</td><td><small class="pno">No.${q.no}</small>${esc(paperPrompt(c, q))}${c.mode === 'choice' ? `<div class="opts">${q.options.map((o, j) => `<span>${j + 1}. ${esc(o.ja)}</span>`).join('')}</div>` : ''}</td><td class="blank"></td></tr>`).join('')}</tbody></table></section>
  <section class="print-page"><h1>解答・採点用</h1><p>${esc(listLabel(c))} · ${rangeLabel(c)} · 意味は中心的な内容が合っていれば言い換えも正解にできます。</p>
  <table><thead><tr><th class="n">問</th><th>英語・番号</th><th>答え</th><th class="n2">採点</th></tr></thead><tbody>${qs.map((q, i) => `<tr><td class="n">${i + 1}</td><td>No.${q.no} ${esc(q.en || '')}</td><td>${esc(paperAnswer(c, q))}</td><td class="n2"></td></tr>`).join('')}</tbody></table></section>`;
  window.print();
}

// ---------- 単語リスト ----------
let bankSearch = '', bankFilter = 'all', bankFamily = 'receptive', bankPage = 0, importPreview = null;
function renderBank() {
  app.innerHTML = pageHead('単語リスト', `${esc(listLabel(state.config))} · 番号・英語・意味で検索できます。`, '<button class="btn outline small" id="b-import">＋ 単語を登録</button>') + `
  <section class="card"><div class="toolbar">
    <input id="b-search" type="search" value="${esc(bankSearch)}" placeholder="英語・意味・番号で検索" aria-label="検索">
    ${selectHtml('b-edition', editions(), state.config.edition)}${selectHtml('b-section', SECTIONS, state.config.section)}
    ${selectHtml('b-family', Object.keys(FAMILY_NAMES), bankFamily, FAMILY_NAMES)}
    ${selectHtml('b-filter', ['all', 'weak', 'due', 'confirmed', 'unseen'], bankFilter, { all: 'すべての状態', weak: '要復習', due: '復習日を迎えた語', confirmed: '定着確認済み', unseen: '未確認・未実施' })}
  </div><div id="b-table"></div></section>
  <section class="card"><h2>単語データの登録・書き出し</h2><p class="small muted">内蔵の${num(BUILTIN.length)}項目（${esc(VOCAB_SOURCE.edition)}／${esc(VOCAB_SOURCE.section)}）に加えて、別の版やリストを登録できます。列は「番号、英語、意味、品詞（任意）、英語の別解（任意）」。内蔵データの番号・訳語は上書きできません。</p>
  <div class="actions"><button class="btn outline small" id="b-template">空のCSVテンプレート</button><button class="btn outline small" id="b-export">表示中の版・区分をCSV保存</button></div></section>`;
  $('#b-import').onclick = openImport;
  $('#b-search').oninput = e => { bankSearch = e.target.value; bankPage = 0; renderBankTable(); };
  $('#b-filter').onchange = e => { bankFilter = e.target.value; bankPage = 0; renderBankTable(); };
  $('#b-family').onchange = e => { bankFamily = e.target.value; bankPage = 0; renderBankTable(); };
  ['b-edition', 'b-section'].forEach(id => $('#' + id).onchange = () => { state.config = { ...state.config, edition: $('#b-edition').value, section: $('#b-section').value }; bankPage = 0; save(); renderBank(); });
  $('#b-template').onclick = () => download('単熟語EX_取込テンプレート.csv', '﻿番号,英語,意味,品詞,英語の別解\r\n', 'text/csv;charset=utf-8');
  $('#b-export').onclick = () => { const ws = bank().filter(w => w.edition === state.config.edition && w.section === state.config.section).sort((a, b) => a.no - b.no); if (!ws.length) { toast('この版・区分には単語データがありません。'); return; } download(`単語リスト_${state.config.edition}_${state.config.section}.csv`, csv([['番号', '英語', '意味', '品詞', '英語の別解'], ...ws.map(w => [w.no, w.en, w.ja, w.pos || '', (w.aliases || []).join(';')])]), 'text/csv;charset=utf-8'); };
  renderBankTable();
}
function renderBankTable() {
  const p = profile(), now = Date.now(), all = listWords(), q = normalize(bankSearch);
  const words = all.filter(w => !q || String(w.no) === q || normalize(w.en).includes(q) || normalize(w.ja).includes(q)).filter(w => {
    if (bankFilter === 'all') return true;
    const m = getMemory(p, w.key, bankFamily);
    if (bankFamily === 'recognition') return bankFilter === 'weak' ? recognitionWeak(m) : bankFilter === 'unseen' ? !m.seen : bankFilter === 'confirmed' ? m.seen && !recognitionWeak(m) : false;
    return bankFilter === 'weak' ? m.stage === 1 : bankFilter === 'due' ? m.due != null && m.due <= now : bankFilter === 'confirmed' ? isConfirmed(m, now) : m.stage === 0;
  });
  const per = 30, pages = Math.max(1, Math.ceil(words.length / per)); bankPage = Math.min(bankPage, pages - 1);
  const shown = words.slice(bankPage * per, bankPage * per + per);
  $('#b-table').innerHTML = shown.length ? `<p class="small muted">${num(all.length)}語のうち${num(words.length)}語 · ${esc(FAMILY_NAMES[bankFamily])}の状態</p><div class="wordlist">${shown.map(w => { const st = statusOf(p, w.key, bankFamily, now), m = getMemory(p, w.key, bankFamily); return `<div class="wl"><span class="wl-no">${w.no}</span><div class="wl-main"><b>${esc(w.en || 'データ未登録')}</b><span>${esc(w.ja || '本で確認')}</span></div><div class="wl-st">${badge(st)}<small class="muted">${m.seen ? `${m.seen}回` : ''}${bankFamily !== 'recognition' && m.due ? ` · 次回${md(m.due)}` : ''}</small></div></div>`; }).join('')}</div>
  <div class="pager"><button class="btn outline small" id="b-prev" ${bankPage ? '' : 'disabled'}>前へ</button><span>${num(bankPage * per + 1)}〜${num(Math.min(words.length, bankPage * per + per))} / ${num(words.length)}</span><button class="btn outline small" id="b-next" ${bankPage >= pages - 1 ? 'disabled' : ''}>次へ</button></div>`
    : emptyBox(all.length ? '条件に合う語がありません。' : 'この版・区分には単語データがありません。', all.length ? '検索や絞り込みを変えてください。' : '内蔵データは「第2版／全項目」です。別のリストは「単語を登録」から取り込めます。');
  if ($('#b-prev')) $('#b-prev').onclick = () => { bankPage--; renderBankTable(); window.scrollTo({ top: 0 }); };
  if ($('#b-next')) $('#b-next').onclick = () => { bankPage++; renderBankTable(); window.scrollTo({ top: 0 }); };
}
function openImport() {
  importPreview = null;
  const ed = state.config.edition === VOCAB_SOURCE.edition && state.config.section === VOCAB_SOURCE.section ? '' : state.config.edition;
  modal(`<h2>単語リストを登録</h2><p class="small muted">番号・英語・意味の3列は必須、品詞・英語の別解は任意です。英語の別解は ; で区切ります。内蔵データ（${esc(VOCAB_SOURCE.edition)}／${esc(VOCAB_SOURCE.section)}）と同じ版・区分・番号は登録できません。</p>
  <div class="form-grid"><label class="field"><span>版・リスト名</span><input id="i-edition" value="${esc(ed)}" maxlength="60" placeholder="例：学校配布リスト"></label><label class="field"><span>区分</span>${selectHtml('i-section', SECTIONS, state.config.section)}</label></div>
  <label class="field"><span>CSV・TSVファイル</span><input type="file" id="i-file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"></label>
  <label class="field"><span>または表を貼り付け</span><textarea id="i-text" rows="6" placeholder="番号[TAB]英語[TAB]意味"></textarea></label>
  <div id="i-error" role="alert"></div><div id="i-preview"></div>
  <div class="actions"><button class="btn outline grow" id="i-check">内容を確認</button><button class="btn primary grow hidden" id="i-ok">この内容で登録</button></div>`);
  const reset = () => { importPreview = null; $('#i-ok').classList.add('hidden'); $('#i-preview').innerHTML = ''; };
  ['i-text', 'i-edition', 'i-section'].forEach(id => $('#' + id).addEventListener('input', reset));
  $('#i-file').onchange = async e => { const f = e.target.files[0]; if (!f) return; if (f.size > 3 * 1024 * 1024) { $('#i-error').innerHTML = '<p class="warn-text small">3MB以下のファイルを選んでください。</p>'; return; } try { $('#i-text').value = await f.text(); reset(); } catch { $('#i-error').innerHTML = '<p class="warn-text small">ファイルを読み込めませんでした。</p>'; } };
  $('#i-check').onclick = () => {
    try {
      const edition = $('#i-edition').value.trim(), section = $('#i-section').value;
      if (!edition) throw new Error('版・リスト名を入力してください。');
      const words = parseWords($('#i-text').value, edition, section);
      mergeCustomWords(builtinMap, state.customWords, words);
      importPreview = { words, edition, section }; $('#i-error').innerHTML = '';
      $('#i-preview').innerHTML = `<p class="note">${words.length}語を登録します。同じ版・区分・番号の登録済みデータは、意味・品詞・別解を更新します。</p><div class="wordlist">${words.slice(0, 5).map(w => `<div class="wl"><span class="wl-no">${w.no}</span><div class="wl-main"><b>${esc(w.en)}</b><span>${esc(w.ja)}</span></div></div>`).join('')}</div><p class="small muted">先頭${Math.min(5, words.length)}語を表示しています。</p>`;
      $('#i-ok').classList.remove('hidden');
    } catch (e) { reset(); $('#i-error').innerHTML = `<p class="warn-text small" style="white-space:pre-line">${esc(e.message)}</p>`; }
  };
  $('#i-ok').onclick = () => {
    if (!importPreview) return;
    try {
      state.customWords = mergeCustomWords(builtinMap, state.customWords, importPreview.words); invalidateBank();
      const nos = importPreview.words.map(w => w.no);
      state.config = { ...state.config, edition: importPreview.edition, section: importPreview.section, start: Math.min(...nos), end: Math.max(...nos), mode: 'recall', target: 'all' };
      save(); closeModal(); bankPage = 0; render(); toast(importPreview.words.length + '語を登録しました。');
    } catch (e) { $('#i-error').innerHTML = `<p class="warn-text small">${esc(e.message)}</p>`; }
  };
}

// ---------- 設定・データ ----------
function renderSettings() {
  const p = profile(), mig = state.migration;
  app.innerHTML = pageHead('設定・データ', '学習者の切り替え、バックアップ、データの確認') + `
  <div class="grid2"><div>
  <section class="card"><h2>学習者</h2><div class="rows">${state.profiles.map(x => `<div class="row static"><div><b>${esc(x.name)}</b> ${x.id === p.id ? pill('選択中', 'good') : ''}<small>テスト ${x.history.length}回${x.pending ? ' · 途中のテストあり' : ''}</small></div><div class="row-actions">${x.id !== p.id ? `<button class="btn outline small" data-use="${esc(x.id)}">切り替え</button>` : ''}<button class="btn outline small" data-rename="${esc(x.id)}">名前</button>${state.profiles.length > 1 ? `<button class="btn link small danger-text" data-del="${esc(x.id)}">削除</button>` : ''}</div></div>`).join('')}</div>
    <form id="s-add" class="inline-form"><input id="s-name" placeholder="生徒名・学習者名" maxlength="40" aria-label="新しい学習者名" required><button class="btn primary">追加</button></form>
    <p class="note">単語リストは共通、テスト結果と定着状態は学習者ごとに保存します。このブラウザを使う人は、すべての学習者の記録を見られます（ログイン機能ではありません）。</p></section>
  <section class="card"><h2>単語リスト</h2><p class="small muted">集計・出題の対象：${esc(listLabel(state.config))}</p><div class="actions"><a class="btn outline small" href="#bank">単語リストを開く</a><button class="btn link small" id="s-default" ${state.config.edition === DEFAULT_CONFIG.edition && state.config.section === DEFAULT_CONFIG.section ? 'disabled' : ''}>第2版／全項目に戻す</button></div></section>
  <section class="card"><h2>判定ルール</h2><p class="small muted">選択肢なしの想起と、日を空けた再確認を組み合わせています。</p><button class="btn outline small" id="s-rules">判定ルールを見る</button></section>
  </div><div>
  <section class="card"><h2>バックアップ</h2><p class="small muted">全学習者の定着状態・テスト履歴・紙テスト・追加した単語を1つのファイルに保存します。記録はこのブラウザだけに保存されているため、定期的に保存してください。別の端末へ移すときにも使います（自動同期ではありません）。</p>
    <button class="btn primary full" id="s-export">バックアップを保存</button>
    <label class="field"><span>復元するファイル（新アプリ・旧アプリのどちらのバックアップも可）</span><input type="file" id="s-file" accept=".json,application/json"></label>
    <div id="s-error" role="alert"></div>
    <p class="note warn">復元すると、今ある全学習者・履歴を置き換えます。先に現在のバックアップを保存してください。途中のテストは引き継ぎません。</p></section>
  ${legacyRaw ? `<section class="card"><h2>以前のアプリの記録</h2><p class="small muted">このブラウザに旧アプリ（stasta-ex-check-v1）の記録があります。移しても元の記録は消しません。</p><button class="btn primary" id="s-migrate">記録を移す</button></section>` : ''}
  ${mig ? `<section class="card"><h2>読み込み結果</h2>${migrationSummary(mig)}<div class="actions"><button class="btn outline small" id="s-mig-export">読み込めなかった項目を保存</button></div></section>` : ''}
  <section class="card"><h2>選択肢の報告 ${state.flags.length ? pill(state.flags.length + '件', 'warn') : ''}</h2><p class="small muted">4択で「選択肢に問題がある」と報告された問題です。報告された問題は記録に含めていません。</p>
    ${state.flags.length ? `<div class="rows">${state.flags.slice(-5).reverse().map(f => `<div class="row static"><div><b>No.${f.no} ${esc(f.en)}</b><small>${esc(f.options.join(' ／ '))}</small><small>${shortStamp(f.at)} · ${esc(f.learner)}</small></div></div>`).join('')}</div><div class="actions"><button class="btn outline small" id="s-flags">報告をCSV保存</button><button class="btn link small danger-text" id="s-flags-clear">報告を消去</button></div>` : '<p class="small">報告はありません。</p>'}</section>
  </div></div>
  <p class="small muted center">保存先：このブラウザ（localStorage「${STORAGE}」）。ファイルの置き場所やブラウザが変わると、記録は引き継がれません。</p>`;
  $('#s-add').onsubmit = e => { e.preventDefault(); const name = $('#s-name').value.trim(); if (!name) return; if (state.profiles.length >= MAX_PROFILES) { toast(`学習者は${MAX_PROFILES}人までです。`); return; } const n = newProfile(name); state.profiles.push(n); state.active = n.id; save(); render(); toast(name + 'さんを追加しました。'); };
  $$('[data-use]').forEach(b => b.onclick = () => { state.active = b.dataset.use; save(); render(); });
  $$('[data-rename]').forEach(b => b.onclick = () => {
    const x = state.profiles.find(y => y.id === b.dataset.rename);
    modal(`<h2>学習者名を変更</h2><form id="rn"><input id="rn-name" value="${esc(x.name)}" maxlength="40" required class="full-input"><div class="actions"><button class="btn primary">保存</button></div></form>`);
    $('#rn').onsubmit = e => { e.preventDefault(); const n = $('#rn-name').value.trim(); if (!n) return; x.name = n; save(); closeModal(); render(); };
  });
  $$('[data-del]').forEach(b => b.onclick = () => {
    const x = state.profiles.find(y => y.id === b.dataset.del);
    confirmAction(`${x.name}さんを削除`, `テスト${x.history.length}回分の記録と定着状態が消えます。元に戻せません。必要ならば先にバックアップを保存してください。`, '削除する', () => { state.profiles = state.profiles.filter(y => y.id !== x.id); if (state.active === x.id) state.active = state.profiles[0].id; save(); render(); }, true);
  });
  $('#s-default').onclick = () => { state.config = { ...DEFAULT_CONFIG }; save(); render(); toast('第2版／全項目に戻しました。'); };
  $('#s-rules').onclick = showRules;
  $('#s-export').onclick = exportBackup;
  $('#s-file').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      if (f.size > 30 * 1024 * 1024) throw new Error('30MB以下のファイルを選んでください。');
      let raw; try { raw = JSON.parse(await f.text()); } catch { throw new Error('JSONとして読み込めませんでした。バックアップファイルを選んでください。'); }
      const { state: next, report } = importState(raw, builtinMap);
      $('#s-error').innerHTML = '';
      modal(`<h2>バックアップを復元</h2><p class="small muted">${esc(f.name)}（${report.from === 1 ? '旧アプリ' : '新アプリ'}の形式）</p>${reportSummary(report)}<p class="note warn">現在の全データ（学習者${state.profiles.length}人）を置き換えます。</p><div class="actions"><button class="btn outline" id="rs-cancel">キャンセル</button><button class="btn primary" id="rs-ok">置き換えて復元</button></div>`);
      $('#rs-cancel').onclick = closeModal;
      $('#rs-ok').onclick = () => { next.migration.file = f.name; state = next; invalidateBank(); save(); closeModal(); render(); toast('バックアップを復元しました。'); };
    } catch (err) { $('#s-error').innerHTML = `<p class="warn-text small">${esc(err.message)}</p>`; }
    e.target.value = '';
  };
  if ($('#s-migrate')) $('#s-migrate').onclick = () => migrateLegacy();
  if ($('#s-mig-export')) $('#s-mig-export').onclick = () => download(`読み込めなかった項目_${dayKey(Date.now())}.json`, JSON.stringify(state.migration.skippedRaw || [], null, 2));
  if ($('#s-flags')) $('#s-flags').onclick = () => download(`選択肢の報告_${dayKey(Date.now())}.csv`, csv([['日時', '学習者', '番号', '英語', '正解の訳語', '選択肢1', '選択肢2', '選択肢3', '選択肢4', '選んだ番号'], ...state.flags.map(f => [stamp(f.at), f.learner, f.no, f.en, f.ja, ...f.options, f.selected == null ? '' : f.selected + 1])]), 'text/csv;charset=utf-8');
  if ($('#s-flags-clear')) $('#s-flags-clear').onclick = () => confirmAction('報告を消去', `${state.flags.length}件の報告を消去します。`, '消去する', () => { state.flags = []; save(); render(); }, true);
}
function reportSummary(r) {
  const c = r.counts;
  return `<ul class="mini">${[`学習者 ${c.profiles}人`, `テスト ${c.tests}回（${c.results}問）`, `定着記録 ${c.memory}件`, `追加した単語 ${c.customWords}語`, c.sameAsBuiltin ? `内蔵データと同じ単語 ${c.sameAsBuiltin}語（内蔵データを使用）` : '', c.paperTests ? `採点待ちの紙テスト ${c.paperTests}件` : ''].filter(Boolean).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  ${r.warnings.length ? `<p class="small"><b>注意</b></p><ul class="mini">${r.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
  ${r.skipped.length ? `<p class="small warn-text"><b>読み込めなかった項目 ${r.skipped.length}件</b>（復元後、「設定・データ」から内容を保存できます）</p><ul class="mini">${r.skipped.slice(0, 8).map(s => `<li>${esc(s.where)}：${esc(s.reason)}</li>`).join('')}${r.skipped.length > 8 ? `<li>ほか${r.skipped.length - 8}件</li>` : ''}</ul>` : '<p class="small">読み込めなかった項目はありません。</p>'}`;
}
function migrationSummary(m) { return `<p class="small muted">${stamp(m.at)} · ${m.from === 1 ? '旧アプリ' : '新アプリ'}の形式${m.file ? ' · ' + esc(m.file) : ''}</p>` + reportSummary(m.report); }
function exportBackup() {
  const body = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 1);
  download(`単熟語EX_バックアップ_${dayKey(Date.now())}.json`, body);
  toast('バックアップを保存しました。');
}
function migrateLegacy() {
  let raw;
  try { raw = JSON.parse(legacyRaw); } catch { toast('旧アプリの記録を読み込めませんでした。旧アプリでバックアップを保存し、そのファイルから復元してください。'); return; }
  let result;
  try { result = importState(raw, builtinMap, { keepPending: true }); } catch (e) { toast(e.message); return; }
  const hasData = state.profiles.some(p => p.history.length || Object.keys(p.memory).length);
  modal(`<h2>以前のアプリの記録を移す</h2>${reportSummary(result.report)}${hasData ? `<p class="note warn">新しいアプリにすでに記録があります。移すと、現在の記録（学習者${state.profiles.length}人）を置き換えます。必要ならば先にバックアップを保存してください。</p>` : ''}<p class="small muted">旧アプリの記録はブラウザに残したままにします。</p><div class="actions"><button class="btn outline" id="m-cancel">キャンセル</button><button class="btn primary" id="m-ok">移す</button></div>`);
  $('#m-cancel').onclick = closeModal;
  $('#m-ok').onclick = () => { result.state.migration.file = 'このブラウザの旧アプリの記録'; state = result.state; legacyRaw = null; invalidateBank(); save(); closeModal(); render(); toast('以前の記録を移しました。'); };
}

// ---------- 起動 ----------
resumeTiming();
save();
render();
})();
