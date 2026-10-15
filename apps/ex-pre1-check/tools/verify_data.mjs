// 内蔵データの照合：完成HTMLの単語データが、元HTMLの BUILTIN_WORDS と1件ずつ完全に一致するかを確かめる。
// 使い方: node tools/verify_data.mjs <元HTML> [完成HTML]
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [origPath, builtPath = path.join(root, 'dist', '単熟語EX準1級_定着チェック.html')] = process.argv.slice(2);
if (!origPath) { console.error('使い方: node tools/verify_data.mjs <元HTML> [完成HTML]'); process.exit(2); }

function decodeAfter(text, marker) {
  const i = text.indexOf(marker);
  if (i < 0 || text.indexOf(marker, i + 1) >= 0) throw new Error(`${marker} が1か所に見つかりません`);
  // JSON 値の終わりを括弧の対応で探す（文字列内の括弧は無視）
  let depth = 0, inStr = false, esc = false, start = i + marker.length;
  for (let j = start; j < text.length; j++) {
    const c = text[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return JSON.parse(text.slice(start, j + 1)); }
  }
  throw new Error(`${marker} の終わりが見つかりません`);
}

const orig = readFileSync(origPath, 'utf8');
const origWords = decodeAfter(orig, 'const BUILTIN_WORDS = ');
const origSource = decodeAfter(orig, 'const VOCAB_SOURCE = ');

// 完成HTMLの core と データの script をそのまま実行して BUILTIN_WORDS を得る
const built = readFileSync(builtPath, 'utf8');
const scripts = [...built.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 3) throw new Error('完成HTMLの script が3つではありません');
const ctx = vm.createContext({ module: undefined });
vm.runInContext(scripts[0] + '\n' + scripts[1] + '\n;globalThis.__out = { VOCAB_SOURCE, BUILTIN_WORDS };', ctx);
const { VOCAB_SOURCE, BUILTIN_WORDS } = ctx.__out;

const problems = [];
const check = (ok, msg) => { if (!ok) problems.push(msg); };
check(JSON.stringify(VOCAB_SOURCE) === JSON.stringify(origSource), '出典情報（VOCAB_SOURCE）が元HTMLと異なる');
check(BUILTIN_WORDS.length === origWords.length, `件数が異なる：完成 ${BUILTIN_WORDS.length} / 元 ${origWords.length}`);
const fields = ['key', 'edition', 'section', 'no', 'en', 'ja', 'pos', 'aliases'];
let mismatched = 0;
origWords.forEach((o, i) => {
  const b = BUILTIN_WORDS[i];
  for (const f of fields) if (JSON.stringify(b?.[f]) !== JSON.stringify(o[f])) { mismatched++; if (mismatched <= 10) problems.push(`${i + 1}件目 ${f}：完成 ${JSON.stringify(b?.[f])} / 元 ${JSON.stringify(o[f])}`); }
});
// 番号の連続性・重複
const nos = BUILTIN_WORDS.map(w => w.no), keys = new Set(BUILTIN_WORDS.map(w => w.key));
check(keys.size === BUILTIN_WORDS.length, '識別子（key）が重複している');
const expected = Array.from({ length: VOCAB_SOURCE.end - VOCAB_SOURCE.start + 1 }, (_, i) => VOCAB_SOURCE.start + i);
const missing = expected.filter(n => !nos.includes(n)), dupNo = nos.filter((n, i) => nos.indexOf(n) !== i);
check(!missing.length, `欠番：${missing.slice(0, 20).join(', ')}`);
check(!dupNo.length, `重複番号：${dupNo.slice(0, 20).join(', ')}`);
check(BUILTIN_WORDS.every(w => w.en && w.ja), '英語または訳語が空の項目がある');
check(VOCAB_SOURCE.count === BUILTIN_WORDS.length, `出典情報の件数 ${VOCAB_SOURCE.count} と実件数 ${BUILTIN_WORDS.length} が異なる`);

// 参考情報（エラーにはしない）：元データ内で英語が重複している項目
const byEn = new Map();
for (const w of BUILTIN_WORDS) { const k = w.en.toLowerCase(); byEn.set(k, [...(byEn.get(k) || []), w.no]); }
const dupEn = [...byEn.entries()].filter(([, v]) => v.length > 1);
const byJa = new Map();
for (const w of BUILTIN_WORDS) byJa.set(w.ja, [...(byJa.get(w.ja) || []), `${w.no} ${w.en}`]);
const dupJa = [...byJa.entries()].filter(([, v]) => v.length > 1);

console.log(`元HTML: ${path.basename(origPath)} / 完成HTML: ${path.basename(builtPath)}`);
console.log(`件数 ${BUILTIN_WORDS.length}（番号 ${Math.min(...nos)}〜${Math.max(...nos)}）、全フィールド不一致 ${mismatched}件`);
console.log(`先頭 ${BUILTIN_WORDS[0].no} ${BUILTIN_WORDS[0].en} / 末尾 ${BUILTIN_WORDS.at(-1).no} ${BUILTIN_WORDS.at(-1).en}`);
console.log(`【参考・要確認】英語が重複：${dupEn.map(([en, v]) => `${en}（No.${v.join(', No.')}）`).join(' / ') || 'なし'}`);
console.log(`【参考・要確認】訳語が完全一致する別項目：${dupJa.length}組`);
for (const [ja, v] of dupJa) console.log(`  ${ja}：${v.join(' ／ ')}`);
if (problems.length) { console.log('\n不一致・問題：'); problems.forEach(p => console.log(' - ' + p)); process.exit(1); }
console.log('\n照合OK：完成HTMLの内蔵データは元HTMLと全件一致しています。');
