// 画面の通しテスト（スマホ幅 390px）。実行: node tests/e2e.mjs <元HTML> [スクリーンショット出力先]
// 旧アプリで実際に記録を作り、その記録を新アプリへ移す手順も確認する。
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [origPath, shotDir = path.join(root, 'dist', 'screens')] = process.argv.slice(2);
if (!origPath) { console.error('使い方: node tests/e2e.mjs <元HTML> [スクリーンショット出力先]'); process.exit(2); }
mkdirSync(shotDir, { recursive: true });
const files = { '/new.html': path.join(root, 'dist', '単熟語EX準1級_定着チェック.html'), '/old.html': origPath };
const server = createServer((req, res) => { const f = files[req.url.split('?')[0]]; if (!f) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(readFileSync(f)); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const results = [];
const step = async (name, fn) => { try { await fn(); results.push(['OK', name]); console.log('OK  ', name); } catch (e) { results.push(['NG', name, e.message]); console.log('NG  ', name, '\n     ', e.message.split('\n').slice(0, 6).join('\n      ')); } };
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ja-JP', acceptDownloads: true });
const page = await ctx.newPage();
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('dialog', d => d.dismiss());
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('stasta-ex-check-v2')));
const shot = name => page.screenshot({ path: path.join(shotDir, name + '.png'), fullPage: true });
const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const tap = sel => page.locator(sel).first().click();
// ハッシュだけの移動では再読み込みされないため、クエリを付けて読み込み直す
const nav = r => page.goto(`${base}/new.html?t=${Date.now()}#${r}`);
const confirmIfAsked = async () => { await page.waitForTimeout(150); if (await page.locator('#c-ok').isVisible()) await tap('#c-ok'); };

// ---------- 1. 旧アプリで実際に記録を作る ----------
let legacy;
await step('旧アプリ：意味想起5問と4択5問を実施して記録を作る', async () => {
  await page.goto(base + '/old.html');
  await page.evaluate(() => localStorage.clear());
  await page.goto(base + '/old.html#create');
  await page.fill('#start', '1'); await page.fill('#end', '50'); await page.selectOption('#count', '5');
  await page.check('[name="mode"][value="recall"]', { force: true });
  await tap('#start-test');
  for (let i = 0; i < 5; i++) {
    await page.fill('#answer', 'テスト回答');
    await page.check(`[name="confidence"][value="${i < 3 ? 'sure' : 'unsure'}"]`, { force: true });
    await tap('#reveal-answer');
    await tap(`[data-grade="${i === 4 ? 0 : 1}"]`);
  }
  await page.waitForURL(/#result/);
  await page.goto(base + '/old.html#create');
  await page.selectOption('#count', '5'); await page.check('[name="mode"][value="choice"]', { force: true });
  await tap('#start-test');
  for (let i = 0; i < 5; i++) { await tap('[data-choice="0"]'); await page.check('[name="confidence"][value="sure"]', { force: true }); await tap('#reveal-answer'); await tap('#next-question'); }
  await page.waitForURL(/#result/);
  // 途中のテストも作っておく（同じ端末の移行では引き継ぐ）
  await page.goto(base + '/old.html#create'); await page.check('[name="mode"][value="recall"]', { force: true }); await tap('#start-test');
  await page.fill('#answer', 'とちゅう'); await page.check('[name="confidence"][value="sure"]', { force: true }); await tap('#reveal-answer'); await tap('[data-grade="1"]');
  legacy = await page.evaluate(() => JSON.parse(localStorage.getItem('stasta-ex-check-v1')));
  assert.equal(legacy.profiles[0].history.length, 2);
  assert.equal(legacy.profiles[0].pending.results.length, 1);
});

// ---------- 2. 新アプリで旧記録を移す ----------
await step('新アプリ：旧記録の検出と移行（履歴・定着記録・途中のテストを引き継ぐ）', async () => {
  await page.goto(base + '/new.html');
  await page.waitForSelector('#h-migrate');
  await shot('01_home_before_migration');
  await tap('#h-migrate');
  await page.waitForSelector('#m-ok');
  const text = await page.locator('#dialog-body').innerText();
  assert.match(text, /テスト 2回（10問）/);
  await tap('#m-ok');
  const s = await state();
  const lp = legacy.profiles[0], np = s.profiles[0];
  assert.equal(np.history.length, lp.history.length);
  assert.deepEqual(np.history.map(h => h.results.map(r => [r.key, r.score, r.confidence, r.mode, r.answer])), lp.history.map(h => h.results.map(r => [r.key, r.score, r.confidence, r.mode, r.answer])));
  for (const [k, g] of Object.entries(lp.memory)) for (const [f, m] of Object.entries(g)) for (const field of ['stage', 'due', 'eligibleAt', 'seen', 'correct'].filter(x => x in m)) assert.equal(np.memory[k][f][field], m[field], `${k} ${f} ${field}`);
  assert.equal(np.pending.results.length, 1);
  assert.equal(await page.evaluate(() => !!localStorage.getItem('stasta-ex-check-v1')), true, '旧記録は消さない');
  assert.equal(await page.locator('#h-migrate').count(), 0);
});

await step('移行した途中のテストを再開して保存終了', async () => {
  await tap('#h-resume');
  await page.waitForSelector('[data-conf]');
  assert.match(await page.locator('.session-top').first().innerText(), new RegExp(`2 / ${legacy.profiles[0].pending.questions.length}`));
  await tap('#t-finish'); await tap('#c-ok');
  await page.waitForURL(/#result\//);
  const s = await state();
  assert.equal(s.profiles[0].pending, null); assert.equal(s.profiles[0].history.length, 3);
});

// ---------- 3. 画面テスト（意味を思い出す） ----------
await step('意味想起：日本語入力中のEnterで送信しない／自信を選ぶと答えが出る', async () => {
  await nav('home');
  await page.waitForSelector('#h-main');
  assert.match(await page.locator('#h-main').innerText(), /1〜100番から20問/);
  await shot('02_home');
  await tap('#h-main');
  await page.waitForSelector('#t-answer');
  await shot('03_test_question');
  await page.fill('#t-answer', 'きずつきやすい');
  await page.evaluate(() => { const i = document.querySelector('#t-answer'); i.dispatchEvent(new CompositionEvent('compositionstart')); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, bubbles: true })); i.dispatchEvent(new CompositionEvent('compositionend')); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true })); });
  assert.equal(await page.locator('[data-conf]').count(), 3, 'Enterで答えが表示されていない');
  assert.equal((await state()).profiles[0].pending.phase, 'answer');
  await page.keyboard.press('Enter');
  assert.equal((await state()).profiles[0].pending.phase, 'answer', '確定後のEnterでも送信しない');
  await tap('[data-conf="sure"]');
  await page.waitForSelector('[data-grade]');
  await shot('04_test_grade');
  assert.ok(await overflow() <= 0, '横にはみ出している');
  await tap('[data-grade="1"]');
});
await step('意味想起：入力なしで自信を選ぶと注意が出る／思い出せない', async () => {
  await page.waitForSelector('#t-answer');
  await tap('[data-conf="sure"]');
  assert.match(await page.locator('#t-error').innerText(), /回答を入力/);
  await tap('#t-skip'); await page.waitForSelector('#t-next'); await tap('#t-next');
});
await step('再読み込みしても途中のテストと入力中の回答が残る', async () => {
  await page.waitForSelector('#t-answer');
  await page.fill('#t-answer', '下書き');
  await page.waitForTimeout(600);
  await page.reload();
  await page.waitForSelector('#t-answer');
  assert.equal(await page.inputValue('#t-answer'), '下書き');
  await tap('#t-pause');
  await page.waitForSelector('#h-resume');
  await tap('#h-resume');
  await page.waitForSelector('#t-answer');
  assert.equal(await page.inputValue('#t-answer'), '下書き');
  assert.match(await page.locator('.session-top').first().innerText(), /3 \/ 20/);
});
await step('残りを採点し、ここまでを保存して終了（未回答は分母に入れない）', async () => {
  await tap('[data-conf="unsure"]'); await tap('[data-grade="0.5"]');
  await page.fill('#t-answer', 'x'); await tap('[data-conf="guess"]'); await tap('[data-grade="1"]');
  await tap('#t-finish'); await tap('#c-ok');
  await page.waitForURL(/#result\//);
  await shot('05_result');
  const txt = await page.locator('.result').innerText();
  assert.match(txt, /正解 2 \/ 4問/); assert.match(txt, /未回答・除外 16問/);
  assert.match(txt, /要復習\s*3語/);
  const s = await state(), h = s.profiles[0].history.at(-1);
  const m = k => s.profiles[0].memory[k].receptive;
  assert.equal(m(h.results[0].key).stage, 2); assert.equal(m(h.results[1].key).stage, 1); assert.equal(m(h.results[2].key).stage, 1); assert.equal(m(h.results[3].key).stage, 1);
});
await step('要復習の語だけで再テストを作れる', async () => {
  await tap('#r-retry');
  await page.waitForSelector('#t-answer');
  const s = await state();
  assert.equal(s.profiles[0].pending.questions.length, 3);
  await tap('#t-pause');
});

// ---------- 4. 4択・英語を書く ----------
await step('4択：4つの選択肢は訳語が重ならず、結果は意味の定着に混ざらない', async () => {
  await nav('create');
  await page.waitForSelector('#f-start');
  await page.fill('#f-start', '201'); await page.fill('#f-end', '300');
  await page.locator('label:has(> input[name="f-mode"][value="choice"])').click();
  await page.locator('label:has(> input[name="f-count"][value="5"])').click();
  assert.equal(await page.locator('#f-target option[value="due"]').evaluate(o => o.disabled), true);
  await shot('06_create');
  assert.ok(await overflow() <= 0, '作成画面がはみ出している');
  await tap('#f-start-btn'); await confirmIfAsked();
  await page.waitForSelector('[data-choice]');
  await shot('07_choice');
  const before = await state();
  for (let i = 0; i < 5; i++) {
    const q = (await state()).profiles[0].pending.questions[i];
    assert.equal(new Set(q.options.map(o => o.ja)).size, 4);
    await tap(`[data-choice="${q.answer}"]`); await tap('[data-conf="sure"]'); await page.waitForSelector('#t-next'); await tap('#t-next');
  }
  await page.waitForURL(/#result\//);
  const s = await state(), h = s.profiles[0].history.at(-1);
  assert.equal(h.results.every(r => r.score === 1), true);
  for (const r of h.results) {
    assert.deepEqual(s.profiles[0].memory[r.key].receptive, before.profiles[0].memory[r.key]?.receptive, '意味の記録が変わっていない');
    assert.ok(s.profiles[0].memory[r.key].recognition.seen >= 1);
  }
});
await step('英語を書く：大文字・全角でも自動採点で正解、つづり記録は別管理', async () => {
  await nav('create');
  await page.waitForSelector('#f-start');
  await page.locator('label:has(> input[name="f-mode"][value="spelling"])').click();
  await page.locator('label:has(> input[name="f-count"][value="5"])').click();
  await tap('#f-start-btn'); await confirmIfAsked();
  await page.waitForSelector('#t-answer');
  const qs = (await state()).profiles[0].pending.questions;
  for (let i = 0; i < 5; i++) {
    const en = qs[i].en.replace(/[～〜]/g, '').trim();
    await page.fill('#t-answer', i === 0 ? en.toUpperCase() : i === 1 ? en.replace(/[a-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xFEE0)) : i === 4 ? 'zzzz' : en);
    await tap('[data-conf="sure"]'); await page.waitForSelector('#t-next');
    if (i === 4) assert.equal(await page.locator('#t-override').count(), 1);
    await tap('#t-next');
  }
  await page.waitForURL(/#result\//);
  const s = await state(), h = s.profiles[0].history.at(-1);
  assert.deepEqual(h.results.map(r => r.score), [1, 1, 1, 1, 0]);
  assert.equal(s.profiles[0].memory[h.results[0].key].productive.stage, 2);
});

// ---------- 5. 報告 ----------
await step('報告：その日の集計が記録と一致し、1画面で読める', async () => {
  await nav('report');
  await page.waitForSelector('#report-card');
  await shot('08_report');
  const s = await state(), p = s.profiles[0];
  const today = new Date(); const from = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const rs = p.history.flatMap(h => h.results).filter(r => r.at >= from);
  const rec = rs.filter(r => r.mode === 'recall' || r.mode === 'book');
  const txt = await page.locator('#report-card').innerText();
  assert.match(txt, new RegExp(`実施\\s*${rs.length}\\s*問`));
  assert.match(txt, new RegExp(`意味の想起 ${rec.length}問：正解${rec.filter(r => r.score === 1).length}`));
  const box = await page.locator('#report-card').boundingBox();
  console.log(`      報告カード上端 ${Math.round(box.y)}px・高さ ${Math.round(box.height)}px（画面 844px）`);
  assert.ok(box.height <= 844 - 56, '報告カードが上部バーを除いた1画面に収まらない');
  assert.ok(await overflow() <= 0);
  await page.evaluate(() => { window.__copied = null; navigator.clipboard.writeText = t => { window.__copied = t; return Promise.resolve(); }; });
  await tap('#rp-copy');
  const copied = await page.evaluate(() => window.__copied);
  assert.match(copied, /【単熟語EX準1級 学習報告】/); assert.match(copied, /自分の学習/);
  const dl = page.waitForEvent('download');
  await page.evaluate(() => { navigator.canShare = () => false; });
  await tap('#rp-image');
  const file = await dl; const out = path.join(shotDir, '09_report_image.png'); await file.saveAs(out);
});

// ---------- 6. 紙テスト ----------
await step('紙テスト：問題と解答が別ページで印刷され、採点を記録できる', async () => {
  await nav('create');
  await page.waitForSelector('#f-start');
  await page.locator('label:has(> input[name="f-mode"][value="recall"])').click();
  await page.locator('label:has(> input[name="f-count"][value="30"])').click();
  await tap('#f-paper');
  await page.waitForURL(/#paper\//);
  await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
  await tap('#pp-print');
  assert.equal(await page.evaluate(() => window.__printed), true);
  await page.emulateMedia({ media: 'print' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  writeFileSync(path.join(shotDir, '10_paper_test.pdf'), pdf);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`      30問の紙テスト：PDF ${pages}ページ`);
  assert.ok(pages >= 2);
  await page.emulateMedia({ media: 'screen' });
  const rows = await page.locator('.paper-q').count(); assert.equal(rows, 30);
  for (let i = 0; i < 30; i++) await page.locator('.paper-q').nth(i).locator(`[data-pq-score="${i % 3 === 0 ? 0 : 1}"]`).click();
  await shot('11_paper_grading');
  await tap('#pp-save');
  await page.waitForURL(/#result\//);
  const s = await state(); assert.equal(s.profiles[0].paperTests.length, 0); assert.equal(s.profiles[0].history.at(-1).source, 'paper'); assert.equal(s.profiles[0].history.at(-1).results.length, 30);
});

// ---------- 7. 学習者・バックアップ ----------
await step('学習者の追加・切り替えで記録が分かれる', async () => {
  await nav('settings');
  await page.fill('#s-name', '生徒B'); await tap('#s-add button');
  let s = await state(); assert.equal(s.profiles.length, 2); assert.equal(s.profiles.find(p => p.id === s.active).name, '生徒B');
  await nav('history');
  assert.match(await page.locator('main').innerText(), /まだ記録がありません/);
  await page.selectOption('#learner', { label: '自分の学習' });
  s = await state(); assert.equal(s.profiles.find(p => p.id === s.active).name, '自分の学習');
});
await step('バックアップ保存 → 全消去 → 復元で記録が戻る', async () => {
  await nav('settings');
  const before = await state();
  const dl = page.waitForEvent('download'); await tap('#s-export'); const file = await dl;
  const backupPath = path.join(shotDir, 'backup.json'); await file.saveAs(backupPath);
  await page.evaluate(() => localStorage.removeItem('stasta-ex-check-v2'));
  await page.reload(); await nav('settings');
  assert.equal((await state()).profiles[0].history.length, 0);
  await page.setInputFiles('#s-file', backupPath);
  await page.waitForSelector('#rs-ok'); await tap('#rs-ok');
  const after = await state();
  assert.equal(after.profiles.length, before.profiles.length);
  after.profiles.forEach((p, i) => { assert.deepEqual(p.history, before.profiles[i].history); assert.deepEqual(p.memory, before.profiles[i].memory); });
});
await step('旧アプリのバックアップファイルも復元できる', async () => {
  const p = path.join(shotDir, 'legacy_backup.json'); writeFileSync(p, JSON.stringify(legacy));
  await page.setInputFiles('#s-file', p);
  await page.waitForSelector('#rs-ok');
  assert.match(await page.locator('#dialog-body').innerText(), /途中のテストは、別の端末での再開を避けるため引き継いでいません/);
  await tap('#rs-cancel');
});

// ---------- 8. 全画面のはみ出し ----------
await step('全画面で横にはみ出さない（390px / 320px）', async () => {
  for (const w of [390, 320]) {
    await page.setViewportSize({ width: w, height: 760 });
    for (const r of ['home', 'create', 'report', 'history', 'bank', 'settings']) {
      await nav(r); await page.waitForTimeout(80);
      const o = await overflow(); assert.ok(o <= 0, `${w}px ${r} で ${o}px はみ出し`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await nav('bank'); await shot('12_bank');
  await nav('settings'); await shot('13_settings');
});
await step('単語リスト：検索と定着状態の絞り込み', async () => {
  await nav('bank');
  await page.fill('#b-search', 'vulnerable');
  assert.match(await page.locator('#b-table').innerText(), /vulnerable/);
  await page.fill('#b-search', '');
  await page.selectOption('#b-filter', 'weak');
  const t = await page.locator('#b-table').innerText(); assert.match(t, /要復習/);
});
await step('PC幅（1280px）でサイドメニュー表示', async () => {
  const pc = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pc.goto(base + '/new.html');
  assert.equal(await pc.locator('.sidebar').isVisible(), true); assert.equal(await pc.locator('.tabbar').isVisible(), false);
  await pc.screenshot({ path: path.join(shotDir, '14_pc_home.png') }); await pc.close();
});
await step('ページ上のJavaScriptエラーがない', async () => { assert.deepEqual(pageErrors, []); });

await browser.close(); server.close();
const ng = results.filter(r => r[0] === 'NG');
console.log(`\n${results.length - ng.length} / ${results.length} 項目OK${ng.length ? '、NGあり' : ''}`);
process.exit(ng.length ? 1 : 0);
