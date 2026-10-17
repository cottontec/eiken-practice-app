// 英文法チェック 照合スクリプト
//   node verify.mjs          … 問題バンクの形式チェック＋校閲用シート（review-sheet.md）の書き出し
//   node verify.mjs --e2e    … 上記に加え、ブラウザで全級を「全問正解」「全問不正解」で通しで解き、結果画面の数値を照合する
// 終了コード 0 = すべて合格、1 = 不合格あり
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const BANK = require(path.join(here, 'questions.js'));

const errors = [];
const warns = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warns.push(`${id}: ${msg}`);
const BLANK = '(　　)';

// 各級の想定（英検公式「試験内容」ページの記載にもとづく形式。問題数はこのアプリでの設定）
const EXPECT = {
  g5: { choice: 15, order: 5 }, g4: { choice: 15, order: 5 },
  g3: { choice: 20, order: 0 }, gp2: { choice: 20, order: 0 }, g2: { choice: 20, order: 0 },
  gp1: { choice: 20, order: 0 }, g1: { choice: 20, order: 0 }
};

const allIds = new Set();
const allStems = new Map();
const sentence = (q, toks) => {
  const s = [q.before, ...toks, q.after].filter(Boolean).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

for (const g of BANK.grades) {
  const exp = EXPECT[g.key];
  if (!exp) { fail(g.key, '想定外の級キー'); continue; }
  const nChoice = g.items.filter(q => q.type === 'choice').length;
  const nOrder = g.items.filter(q => q.type === 'order').length;
  if (nChoice !== exp.choice) fail(g.key, `4択が ${nChoice} 問（想定 ${exp.choice}）`);
  if (nOrder !== exp.order) fail(g.key, `並べ替えが ${nOrder} 問（想定 ${exp.order}）`);
  const pos = [0, 0, 0, 0];
  const cats = {};

  for (const q of g.items) {
    if (allIds.has(q.id)) fail(q.id, 'ID重複');
    allIds.add(q.id);
    if (!q.id.startsWith(g.key + '-')) fail(q.id, `ID接頭辞が級（${g.key}）と不一致`);
    if (!q.cat) fail(q.id, '分野（cat）がない');
    cats[q.cat] = (cats[q.cat] || 0) + 1;
    if (!q.ja) fail(q.id, '和訳／日本文がない');

    if (q.type === 'choice') {
      const blanks = q.en.split(BLANK).length - 1;
      if (blanks !== 1) fail(q.id, `空所が ${blanks} 個`);
      if (!Array.isArray(q.choices) || q.choices.length !== 4) fail(q.id, '選択肢が4つでない');
      if (new Set(q.choices.map(c => c.toLowerCase())).size !== 4) fail(q.id, '選択肢が重複');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) fail(q.id, '正解の添字が不正');
      else pos[q.answer]++;
      if (!Array.isArray(q.why) || q.why.length !== 4 || q.why.some(w => !w || w.length < 6)) fail(q.id, '選択肢ごとの根拠（why）が4つそろっていない');
      if (/[ 　]{2,}/.test(q.en.replace(BLANK, '_'))) warn(q.id, '英文に連続スペース');
      // 空所の前が文頭（または "A: " の直後）なら、正解は大文字始まりのはず
      const before = q.en.split(BLANK)[0];
      const atStart = before === '' || /(^|\n)[AB]: $/.test(before);
      const ans = q.choices[q.answer] || '';
      if (atStart && !/^[A-Z]/.test(ans)) fail(q.id, '文頭の空所なのに正解が小文字始まり');
      if (!atStart && /^[A-Z]/.test(ans) && !/^I\b/.test(ans)) warn(q.id, '文中の空所なのに正解が大文字始まり');
      const stemKey = q.en.toLowerCase();
      if (allStems.has(stemKey)) fail(q.id, `英文が ${allStems.get(stemKey)} と重複`);
      allStems.set(stemKey, q.id);
    } else if (q.type === 'order') {
      if (!Array.isArray(q.tokens) || q.tokens.length !== 4) fail(q.id, '語句が4つでない');
      if (new Set(q.tokens.map(t => t.toLowerCase())).size !== q.tokens.length) fail(q.id, '語句が重複（並べ方が一意に判定できない）');
      if (q.tokens.some(t => /^[A-Z]/.test(t) && !/^I$/.test(t))) fail(q.id, '語句に大文字始まりがある（本番は文頭の語も小文字）');
      if (!q.why) fail(q.id, '解説がない');
      const s = sentence(q, q.tokens);
      if (!/[.?!]$/.test(s)) fail(q.id, `完成文が句読点で終わらない：${s}`);
    } else fail(q.id, `不明な type: ${q.type}`);
  }
  const nc = nChoice || 1;
  const maxShare = Math.max(...pos) / nc;
  if (nChoice && maxShare > 0.5) warn(g.key, `正解位置の偏り ${pos.join('/')}（画面ではシャッフルされる）`);
  g._stats = { nChoice, nOrder, pos, cats };
}

// 校閲用シート
const lines = [`# 英文法チェック 校閲用シート（問題バンク ${BANK.version}）`, '',
  'verify.mjs が自動生成。選択肢ごとの根拠を目視で確認するための一覧。', ''];
for (const g of BANK.grades) {
  lines.push(`## ${g.label}（${g.scope}・CEFR ${g.cefr}）`, '',
    `4択 ${g._stats.nChoice}問 / 並べ替え ${g._stats.nOrder}問 / 正解位置 ${g._stats.pos.join('-')}`, '',
    `分野：${Object.entries(g._stats.cats).map(([k, v]) => `${k} ${v}`).join('、')}`, '');
  for (const q of g.items) {
    if (q.type === 'choice') {
      lines.push(`### ${q.id}［${q.cat}］`, '', '```', q.en, '```', '', `和訳：${q.ja}`, '');
      q.choices.forEach((c, i) => lines.push(`${i === q.answer ? '- **◎' : '- ×'} ${c}${i === q.answer ? '**' : ''} … ${q.why[i]}`));
      lines.push('');
    } else {
      lines.push(`### ${q.id}［${q.cat}］並べ替え`, '', `日本文：${q.ja}`, '',
        `語句：${q.tokens.join(' / ')}`, '', `完成文：**${sentence(q, q.tokens)}**`, '', `解説：${q.why}`, '');
    }
  }
}
writeFileSync(path.join(here, 'review-sheet.md'), lines.join('\n'));

// 外部AI監査用：問題バンクをJSONで書き出す（audit/verify_bank.py が読む）
mkdirSync(path.join(here, 'audit'), { recursive: true });
const plain = { version: BANK.version, grades: BANK.grades.map(({ _stats, ...g }) => g) };
writeFileSync(path.join(here, 'audit', 'bank.json'), JSON.stringify(plain, null, 2) + '\n');

// 画面での通し確認
if (process.argv.includes('--e2e')) {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.js')); }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(String(e)));
  // フォントはテスト中は読み込まない（オフライン）。それ以外の読み込み失敗とスクリプトエラーを拾う
  page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) consoleErrors.push('読み込み失敗 ' + r.url()); });
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) consoleErrors.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(pathToFileURL(path.join(here, 'index.html')).href);

  for (const g of BANK.grades) {
    for (const mode of ['allCorrect', 'allWrong']) {
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
      await page.reload();
      await page.fill('#student-name', '検算 太郎');
      await page.click(`#grade-${g.key}`);
      await page.click('#start');
      const total = g.items.length;
      for (let i = 0; i < total; i++) {
        const head = await page.textContent('.qno');
        if (!head.includes(`${i + 1} / ${total}`)) fail(g.key, `${mode}: 問題番号表示が不正（${head}）`);
        if (await page.$('#submit-order')) {
          const ja = await page.textContent('.ja');
          const q = g.items.find(x => x.type === 'order' && x.ja === ja);
          if (!q) { fail(g.key, `${mode}: 並べ替えの日本文が見つからない（${ja}）`); break; }
          let order = q.tokens.map((_, k) => k);
          if (mode === 'allWrong') order = [1, 0, 2, 3];
          for (const k of order) await page.click(`#token-${k}`);
          await page.click('#submit-order');
        } else {
          const stem = await page.textContent('.stem');
          const q = g.items.find(x => x.type === 'choice' && x.en === stem);
          if (!q) { fail(g.key, `${mode}: 英文が見つからない（${stem}）`); break; }
          const texts = await page.$$eval('.choice .txt', ns => ns.map(n => n.textContent));
          if (texts.slice().sort().join('|') !== q.choices.slice().sort().join('|')) fail(q.id, '画面の選択肢がデータと不一致');
          const target = mode === 'allCorrect' ? q.choices[q.answer] : q.choices[(q.answer + 1) % 4];
          await page.click(`#choice-${texts.indexOf(target)}`);
          const verdict = await page.textContent('.verdict');
          const shownOk = verdict.startsWith('○');
          if (shownOk !== (mode === 'allCorrect')) fail(q.id, `${mode}: 判定表示が不正（${verdict}）`);
        }
        await page.click('#next');
      }
      const big = (await page.textContent('.score .big')).replace(/\s/g, '');
      const want = mode === 'allCorrect' ? `${total}/${total}` : `0/${total}`;
      if (big !== want) fail(g.key, `${mode}: 結果 ${big}（期待 ${want}）`);
      const report = await page.textContent('#report-text');
      if (!report.includes('検算 太郎') || !report.includes(g.label)) fail(g.key, `${mode}: コピー用文面に名前・級がない`);
      const sumCats = await page.$$eval('.cat .val', ns => ns.map(n => n.textContent.split('/').map(s => +s.trim())));
      const catN = sumCats.reduce((a, [, n]) => a + n, 0);
      if (catN !== total) fail(g.key, `${mode}: 分野別の合計 ${catN} ≠ ${total}`);
      const misses = await page.$$('.miss');
      if (misses.length !== (mode === 'allCorrect' ? 0 : total)) fail(g.key, `${mode}: まちがえた問題の件数 ${misses.length}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) fail(g.key, `${mode}: 横スクロールが出ている`);
    }
    console.log(`  e2e ${g.label} OK`);
  }
  // スマホ幅でのはみ出し
  await page.setViewportSize({ width: 360, height: 740 });
  await page.reload();
  for (const g of BANK.grades) {
    await page.click(`#grade-${g.key}`);
    await page.click('#start');
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) fail(g.key, '360px幅で横スクロール');
    await page.reload();
  }
  if (consoleErrors.length) fail('e2e', 'コンソールエラー: ' + consoleErrors.join(' / '));
  await browser.close();
}

for (const g of BANK.grades) console.log(`${g.label}: 4択 ${g._stats.nChoice} / 並べ替え ${g._stats.nOrder} / 正解位置 ${g._stats.pos.join('-')}`);
console.log(`合計 ${allIds.size} 問`);
if (warns.length) { console.log(`\n注意 ${warns.length} 件`); warns.forEach(w => console.log('  - ' + w)); }
if (errors.length) { console.log(`\n不合格 ${errors.length} 件`); errors.forEach(e => console.log('  ✗ ' + e)); process.exit(1); }
console.log('\nすべて合格');
