// 判定・出題・移行ロジックのテスト。実行: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const C = require('../src/core.js');
const DAY = C.DAY, T0 = new Date(2026, 9, 1, 9, 0).getTime();
const dataPath = new URL('../data/words.json', import.meta.url);
const WORDS = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')).words : null;
const seeded = (s = 7) => () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
const w = (no, en, ja) => ({ key: C.wordKey('第2版', '全項目', no), edition: '第2版', section: '全項目', no, en, ja, pos: '', aliases: [] });
const attempt = (key, mode, score, confidence, at) => ({ key, mode, score, confidence, at });

test('定着段階：自信あり正解は 24時間→3日→7日 で定着確認済み、14日後に再確認', () => {
  const p = C.newProfile('t'), k = 'x';
  C.applyAttempt(p, attempt(k, 'recall', 1, 'sure', T0));
  let m = C.getMemory(p, k, 'receptive'); assert.equal(m.stage, 2); assert.equal(m.due, T0 + DAY);
  C.applyAttempt(p, attempt(k, 'recall', 1, 'sure', T0 + DAY)); m = C.getMemory(p, k, 'receptive');
  assert.equal(m.stage, 3); assert.equal(m.due, T0 + 4 * DAY);
  C.applyAttempt(p, attempt(k, 'recall', 1, 'sure', T0 + 4 * DAY)); m = C.getMemory(p, k, 'receptive');
  assert.equal(m.stage, 4); assert.equal(m.due, T0 + 11 * DAY);
  C.applyAttempt(p, attempt(k, 'book', 1, 'sure', T0 + 11 * DAY)); m = C.getMemory(p, k, 'receptive');
  assert.equal(m.stage, 5); assert.equal(m.due, T0 + 25 * DAY);
  assert.equal(C.isConfirmed(m, T0 + 24 * DAY), true);
  assert.equal(C.isConfirmed(m, T0 + 25 * DAY), false, '期限を過ぎたら定着確認済みから外す');
  assert.equal(C.statusOf(p, k, 'receptive', T0 + 25 * DAY).label, '定着の再確認');
});

test('同じ日の連続正解では段階が進まない', () => {
  const p = C.newProfile('t'), k = 'x';
  for (let i = 0; i < 5; i++) C.applyAttempt(p, attempt(k, 'recall', 1, 'sure', T0 + i * 3600e3));
  assert.equal(C.getMemory(p, k, 'receptive').stage, 2);
  C.applyAttempt(p, attempt(k, 'recall', 1, 'sure', T0 + DAY - 1));
  assert.equal(C.getMemory(p, k, 'receptive').stage, 2, '24時間未満は進まない');
});

test('あいまい・迷った正解・不正解は要復習（stage 1）に戻り、24時間後が期限', () => {
  for (const [score, conf] of [[0.5, 'sure'], [1, 'unsure'], [1, 'guess'], [0, 'sure']]) {
    const p = C.newProfile('t');
    C.applyAttempt(p, attempt('x', 'recall', 1, 'sure', T0));
    C.applyAttempt(p, attempt('x', 'recall', 1, 'sure', T0 + DAY));
    C.applyAttempt(p, attempt('x', 'recall', score, conf, T0 + 2 * DAY));
    const m = C.getMemory(p, 'x', 'receptive');
    assert.equal(m.stage, 1); assert.equal(m.due, T0 + 3 * DAY); assert.equal(m.lapses, 1);
  }
});

test('4択とつづりの正解は意味の定着記録に混ざらない', () => {
  const p = C.newProfile('t');
  C.applyAttempt(p, attempt('x', 'choice', 1, 'sure', T0));
  C.applyAttempt(p, attempt('x', 'spelling', 1, 'sure', T0));
  assert.equal(C.getMemory(p, 'x', 'receptive').stage, 0);
  assert.equal(C.getMemory(p, 'x', 'receptive').seen, 0);
  assert.equal(C.getMemory(p, 'x', 'productive').stage, 2);
  assert.equal(C.getMemory(p, 'x', 'recognition').seen, 1);
});

test('4択の対象条件は4択自身の記録で選ぶ', () => {
  const p = C.newProfile('t'), a = w(1, 'a', 'あ'), b = w(2, 'b', 'い'), c = w(3, 'c', 'う');
  C.applyAttempt(p, attempt(a.key, 'recall', 0, 'sure', T0)); // 意味の想起では苦手
  C.applyAttempt(p, attempt(b.key, 'choice', 0, 'sure', T0)); // 4択で不正解
  C.applyAttempt(p, attempt(c.key, 'choice', 1, 'unsure', T0)); // 4択で迷って正解
  const pick = target => C.pickWords([a, b, c], p, { mode: 'choice', target, count: 10 }, T0 + 1).map(x => x.no).sort();
  assert.deepEqual(pick('weak'), [2, 3]);
  assert.deepEqual(pick('new'), [1]);
  assert.deepEqual(pick('due'), []);
  assert.match(C.configError({ start: 1, end: 10, mode: 'choice', target: 'due' }), /4択/);
  const recall = C.pickWords([a, b, c], p, { mode: 'recall', target: 'weak', count: 10 }, T0 + 1).map(x => x.no);
  assert.deepEqual(recall, [1]);
});

test('出題：範囲内から重複なし、不足時は実際の件数', () => {
  const pool = Array.from({ length: 7 }, (_, i) => w(i + 1, 'w' + i, '意味' + i));
  const got = C.pickWords(pool, C.newProfile('t'), { mode: 'recall', target: 'all', count: 20 }, T0, seeded());
  assert.equal(got.length, 7); assert.equal(new Set(got.map(x => x.key)).size, 7);
  const ten = C.pickWords(Array.from({ length: 100 }, (_, i) => w(i + 1, 'w' + i, 'x')), C.newProfile('t'), { mode: 'recall', target: 'all', count: 20 }, T0, seeded());
  assert.equal(ten.length, 20); assert.equal(new Set(ten.map(x => x.key)).size, 20);
});

test('英語の採点：大文字小文字・全角半角・空白・アポストロフィ・～・別解', () => {
  const word = { en: "fall back on ～", aliases: ["rely on"] };
  for (const ans of ['fall back on', 'Fall Back On', 'ｆａｌｌ　ｂａｃｋ　ｏｎ', '  fall  back on ~ ', 'fall back on …', 'rely on']) assert.equal(C.englishCorrect(ans, word), true, ans);
  for (const ans of ['fall back', 'fallback on', '', '～']) assert.equal(C.englishCorrect(ans, word), false, ans);
  assert.equal(C.englishCorrect('one’s', { en: "one's" }), true);
  assert.equal(C.englishCorrect('ceo', { en: 'CEO' }), true);
});

test('日本語の一致は補助表示のみ：括弧あり・なしの両方', () => {
  const word = { ja: '脱水（症）／（薬を）投与する' };
  for (const a of ['脱水', '脱水症', '投与する', '薬を投与する', ' 脱水。']) assert.equal(C.japaneseMatch(a, word), true, a);
  assert.equal(C.japaneseMatch('水', word), false);
});

test('4択：誤答選択肢は正解と意味が重ならない（自作データ）', () => {
  const target = w(1, 'endure', '耐える／持ちこたえる');
  const pool = [target, w(2, 'withstand', '耐える／持ちこたえる'), w(3, 'tolerate', '我慢する／耐える'), w(4, 'resist', '抵抗する'), w(5, 'abandon', '捨てる'), w(6, 'acquire', '獲得する'), w(7, 'endure', 'もちこたえる'), w(8, 'grasp', 'つかむ')];
  for (let i = 0; i < 30; i++) {
    const r = C.choiceOptions(target, pool, pool, seeded(i + 1));
    assert.ok(r); assert.equal(r.options[r.answer].key, target.key);
    const others = r.options.filter(o => o.key !== target.key).map(o => o.key);
    assert.ok(!others.includes(pool[1].key) && !others.includes(pool[2].key), '同じ・重なる訳語を除外');
    assert.ok(!others.includes(pool[6].key), '同じ英語の別項目を除外');
  }
});

test('4択：内蔵データ全件で4択を作れ、重なりの規則に反する誤答がない', { skip: !WORDS && 'data/words.json がない' }, () => {
  const rnd = seeded(3);
  for (const word of WORDS) {
    const range = WORDS.filter(x => Math.abs(x.no - word.no) < 50);
    const r = C.choiceOptions(word, range, WORDS, rnd);
    assert.ok(r, `No.${word.no}`);
    assert.equal(new Set(r.options.map(o => o.key)).size, 4);
    assert.equal(new Set(r.options.map(o => C.normJa(o.ja))).size, 4, `No.${word.no} 訳語の重複`);
    for (const o of r.options) if (o.key !== word.key) assert.equal(C.meaningsOverlap(o.ja, word.ja), false, `No.${word.no} と ${o.ja}`);
  }
});

test('英語を書く：訳語が同じ別項目の英語も正解にする', { skip: !WORDS && 'data/words.json がない' }, () => {
  const m = WORDS.find(x => x.en === 'mandatory');
  const al = C.spellingAliases(m, WORDS);
  assert.deepEqual(al, ['compulsory']);
  assert.equal(C.englishCorrect('compulsory', { en: m.en, aliases: al }), true);
  const d = WORDS.find(x => x.en === 'decode');
  assert.deepEqual(C.spellingAliases(d, WORDS), [], '同じ英語は別解に重複して入れない');
});

test('CSV取込：引用符・改行・見出し・重複エラー・内蔵データの上書き禁止', () => {
  const words = C.parseWords('番号,英語,意味\n1,"a, b","x\ny"\n2,c,d', '学校', '単語');
  assert.equal(words.length, 2); assert.equal(words[0].en, 'a, b'); assert.equal(words[0].ja, 'x\ny');
  assert.throws(() => C.parseWords('1,a,b\n1,c,d', 'x', '単語'), /重複/);
  const builtin = new Map([[C.wordKey('第2版', '全項目', 1), w(1, 'vulnerable', 'x')]]);
  assert.throws(() => C.mergeCustomWords(builtin, [], C.parseWords('1,vulnerable,x', '第2版', '全項目')), /内蔵データ/);
  const merged = C.mergeCustomWords(builtin, [], words);
  assert.throws(() => C.mergeCustomWords(builtin, merged, C.parseWords('1,zzz,x', '学校', '単語')), /登録済み/);
});

// 旧アプリ（version 1）のバックアップを模したデータ
function v1Backup() {
  const k1 = C.wordKey('第2版', '全項目', 1), k2 = C.wordKey('第2版', '全項目', 2);
  const res = (key, no, en, ja, score, mode = 'recall') => ({ key, no, edition: '第2版', section: '全項目', en, ja, answer: 'a', score, confidence: 'sure', mode, at: T0, latency: 3000, grading: '自己・講師採点' });
  return {
    version: 1, sourceDataVersion: 1, active: 'p1',
    bank: [w(1, 'vulnerable', '傷つきやすい'), w(2, 'heed', '注意を払う'), { ...w(3, 'bystander', '別の訳') }, { key: 'bad' }, w(5000, 'extra', '追加')],
    config: { edition: '第2版', section: '単語', start: 1, end: 100, count: 20, mode: 'book', target: 'all' },
    profiles: [
      { id: 'p1', name: '田中', memory: { [k1]: { receptive: { stage: 3, due: T0 + DAY, eligibleAt: T0 + DAY, lastAt: T0, seen: 2, correct: 2, lapses: 0, lastScore: 1 }, recognition: { seen: 1, correct: 0, lastAt: T0 } }, [k2]: { receptive: { stage: 9 } }, 'broken': {} },
        history: [{ id: 'h1', at: T0, config: { edition: '第2版', section: '全項目', start: 1, end: 100, count: 20, mode: 'recall', target: 'all' }, results: [res(k1, 1, 'vulnerable', '傷つきやすい', 1), { score: 3 }], planned: 20 }],
        pending: { id: 's', config: { edition: '第2版', section: '全項目', start: 1, end: 100, count: 20, mode: 'choice', target: 'all' }, questions: [{ ...w(1, 'vulnerable', '傷つきやすい'), options: ['a', '傷つきやすい', 'b', 'c'] }], results: [], index: 0 } },
      { id: 'p1', name: '', memory: {}, history: [] },
    ],
    unknownField: 1,
  };
}
const builtinMap = new Map([[C.wordKey('第2版', '全項目', 1), w(1, 'vulnerable', '傷つきやすい')], [C.wordKey('第2版', '全項目', 2), w(2, 'heed', '注意を払う')], [C.wordKey('第2版', '全項目', 3), w(3, 'bystander', '傍観者')]]);

test('旧形式の移行：読める項目は引き継ぎ、読めない項目は理由つきで残す', () => {
  const { state, report } = C.importState(v1Backup(), builtinMap, { keepPending: true, now: T0 });
  assert.equal(state.version, 2); assert.equal(state.profiles.length, 2);
  const p = state.profiles[0];
  assert.equal(p.name, '田中'); assert.equal(p.history.length, 1); assert.equal(p.history[0].results.length, 1);
  assert.equal(p.memory[C.wordKey('第2版', '全項目', 1)].receptive.stage, 3);
  assert.equal(p.memory[C.wordKey('第2版', '全項目', 1)].recognition.seen, 1);
  assert.ok(!p.memory[C.wordKey('第2版', '全項目', 2)], '不正な stage の記録は取り込まない');
  assert.ok(p.pending && p.pending.questions[0].answer === 1, '途中のテスト（同じ端末）は答えの位置ごと引き継ぐ');
  assert.notEqual(state.profiles[1].id, 'p1', '重複IDは振り直す'); assert.equal(state.profiles[1].name, '学習者2');
  assert.equal(state.customWords.length, 1); assert.equal(state.customWords[0].no, 5000);
  assert.equal(report.counts.sameAsBuiltin, 2);
  assert.deepEqual(state.config, C.DEFAULT_CONFIG, '空の区分「単語」の設定は初期値に戻す');
  const reasons = report.skipped.map(s => s.where + ':' + s.reason).join('\n');
  for (const needle of ['No.3', '単語 4件目', '記録 broken', 'stage' in {} ? '' : '記録', '2問目', '項目 unknownField']) assert.match(reasons, new RegExp(needle));
  assert.equal(state.migration.skippedRaw.length, report.skipped.length, '元の値を保存');
});

test('バックアップ復元（別端末）では途中のテストを引き継がず、その旨を表示', () => {
  const { state, report } = C.importState(v1Backup(), builtinMap, { now: T0 });
  assert.equal(state.profiles[0].pending, null);
  assert.ok(report.warnings.some(x => /途中のテスト/.test(x)));
});

test('新形式は書き出し→読み込みで記録が変わらない', () => {
  const { state } = C.importState(v1Backup(), builtinMap, { keepPending: true, now: T0 });
  state.profiles[0].paperTests.push({ id: 'pp', createdAt: T0, config: { ...C.DEFAULT_CONFIG }, questions: [w(1, 'vulnerable', 'x')], grades: [null] });
  const round = C.importState(JSON.parse(JSON.stringify(state)), builtinMap, { keepPending: true, now: T0 + 1 }).state;
  for (const k of ['customWords', 'active', 'config']) assert.deepEqual(round[k], state[k], k);
  round.profiles.forEach((p, i) => { const o = state.profiles[i]; assert.deepEqual(p.memory, o.memory); assert.deepEqual(p.history, o.history); assert.deepEqual(p.paperTests, o.paperTests); assert.equal(p.name, o.name); assert.equal(p.id, o.id); });
  assert.ok(round.migration.previous, '前回の読み込み結果も残す');
  state.profiles[0].history[0].excluded = 2;
  const round2 = C.importState(JSON.parse(JSON.stringify(state)), builtinMap, { keepPending: true, now: T0 + 1 }).state;
  assert.equal(round2.profiles[0].history[0].excluded, 2);

});

test('壊れたファイルはエラー', () => {
  assert.throws(() => C.importState(null, builtinMap), /バックアップ/);
  assert.throws(() => C.importState({ version: 3, profiles: [] }, builtinMap), /対応していない/);
  assert.throws(() => C.importState({ version: 1, profiles: [null] }, builtinMap), /学習者/);
});

test('報告：指定日の集計・要復習・次の復習', () => {
  const p = C.newProfile('佐藤'), words = [w(1, 'a', 'あ'), w(2, 'b', 'い'), w(3, 'c', 'う'), w(4, 'd', 'え')];
  const day = C.dayKey(T0);
  const r = (no, mode, score, conf, at = T0) => ({ key: words[no - 1].key, no, edition: '第2版', section: '全項目', en: words[no - 1].en, ja: words[no - 1].ja, answer: '', score, confidence: conf, mode, at, latency: 0, grading: '' });
  const h1 = { id: '1', at: T0, excluded: 1, config: { ...C.DEFAULT_CONFIG, start: 1, end: 100 }, results: [r(1, 'recall', 1, 'sure'), r(2, 'recall', 0.5, 'sure'), r(3, 'recall', 1, 'unsure')] };
  const h2 = { id: '2', at: T0, config: { ...C.DEFAULT_CONFIG, start: 101, end: 200, mode: 'choice' }, results: [r(4, 'choice', 1, 'sure')] };
  const h3 = { id: '3', at: T0 + DAY, config: { ...C.DEFAULT_CONFIG, start: 1, end: 10 }, results: [r(4, 'recall', 0, 'sure', T0 + DAY)] };
  p.history.push(h1, h2, h3); for (const h of [h1, h2, h3]) for (const a of h.results) C.applyAttempt(p, a);
  const rep = C.buildReport(p, words, day, T0 + 3600e3);
  assert.equal(rep.total, 4); assert.equal(rep.testCount, 2);
  assert.deepEqual([rep.byFamily.receptive.n, rep.byFamily.receptive.correct, rep.byFamily.receptive.partial, rep.byFamily.receptive.rate], [3, 2, 1, 67]);
  assert.equal(rep.byFamily.recognition.n, 1);
  assert.deepEqual(rep.weak.map(x => x.no), [2, 3]);
  assert.deepEqual(rep.ranges[0].ranges, [[1, 200]]);
  assert.equal(rep.next.dueTomorrow, 3);
  const text = C.reportText(rep);
  assert.match(text, /佐藤/); assert.match(text, /正答率67%/); assert.match(text, /No\.2 b/); assert.doesNotMatch(text, /No\.4/);
  const empty = C.buildReport(p, words, C.dayKey(T0 + 5 * DAY), T0 + 5 * DAY);
  assert.equal(empty.total, 0); assert.match(C.reportText(empty), /記録はありません/);
});
