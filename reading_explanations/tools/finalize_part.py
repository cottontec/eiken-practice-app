"""分割1つ分を統合し、形式検査・作成結果.md・返却ZIPを作る。
使い方: python3 -I finalize_part.py --src-root <ZIP展開先の親> --part 01"""
from pathlib import Path
import argparse, json, re, subprocess, sys, zipfile, shutil

HERE = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument('--src-root', required=True)
ap.add_argument('--part', required=True)
a = ap.parse_args()
src = Path(a.src_root) / a.part
pdir = HERE / 'parts' / f'part{a.part}'
r = subprocess.run([sys.executable, '-I', str(HERE / 'tools' / 'build_and_check.py'), '--src-root', a.src_root, '--part', a.part],
                   capture_output=True, text=True)
build_log = r.stdout + r.stderr
final = pdir / f'Reading_解説完成_part{a.part}.json'
v = subprocess.run([sys.executable, '-I', str(src / 'validate_reading_explanations.py'), str(final), '--source', str(src / 'Reading_解説作成用.json'), '--allow-partial'],
                   capture_output=True, text=True)
vrep = json.loads(v.stdout) if v.stdout.strip().startswith('{') else {'error': v.stderr}
vf = subprocess.run([sys.executable, '-I', str(HERE / 'tools' / 'verify_final.py'), str(src / 'Reading_解説作成用.json'), str(final)], capture_output=True, text=True)
prog = json.loads((pdir / 'progress.json').read_text('utf-8'))
issues = json.loads((pdir / 'Reading_疑義一覧.json').read_text('utf-8'))
src_all = json.loads((src / 'Reading_解説作成用.json').read_text('utf-8-sig'))
grade = {'2': '2級', 'pre1': '準1級'}.get(src_all['units'][0]['grade'], src_all['units'][0]['grade'])

def grab(md, head):
    m = re.search(rf'^## {head}\s*\n(.*?)(?=^## |\Z)', md, re.S | re.M)
    return [l.strip() for l in m.group(1).splitlines() if l.strip().startswith('-')] if m else []

L = [f'# Reading解説 作成結果（分割{a.part}・{grade}）', '']
tot = {k: 0 for k in ['target', 'written', 'contentReviewed', 'blank', 'issues']}
L += ['| 実施回 | 対象 | 完成 | 内容点検済み | 未作成 | 疑義 |', '| --- | ---: | ---: | ---: | ---: | ---: |']
for b in prog['batches']:
    L.append(f"| {b['batchId']} | {b['target']} | {b.get('written',0)} | {b.get('contentReviewed',0)} | {b.get('blank',b['target'])} | {b.get('issues',0)} |")
    for k in tot:
        tot[k] += b.get(k, 0) if k != 'blank' else b.get('blank', b['target'])
L.append(f"| 合計 | {tot['target']} | {tot['written']} | {tot['contentReviewed']} | {tot['blank']} | {tot['issues']} |")
L += ['', '## 形式検査（validate_reading_explanations.py）', '',
      f"対象 {vrep.get('target')}・キー {vrep.get('keys')}・記入済み {vrep.get('filled')}・欠落ID {len(vrep.get('missingIds',[]))}・余分なID {len(vrep.get('extraIds',[]))}・型不正 {len(vrep.get('invalidTypes',[]))}・空欄 {len(vrep.get('emptyIds',[]))}・12,000字超 {len(vrep.get('over12000Characters',[]))}（終了コード {v.returncode}、空欄は疑義分のみ許容）。",
      'これは形式検査であり、内容の正しさは保証しません。', '',
      '## 独立検算（tools/verify_final.py：完成JSONと原本の正答だけを照合）', '', vf.stdout.strip().replace('\n', '\n'), '',
      '## 実施した点検', '',
      '- 作成担当が正答を伏せたデータで全問を自力で解き、正式正答と機械照合（不一致は再読のうえ理由を記録、または疑義）。',
      '- 統合スクリプト tools/build_and_check.py による自動照合：【正解】番号と正式正答の一致、選択肢英文と正解英文の対応、不正解選択肢の全件記載、語句整序の並び順と2番目・4番目の正答の一致、見出し、禁止形式、12,000字以内、抽出テキストがある回は選択肢英文の照合。',
      '- 別の点検担当（粗探し役）が原画像と突き合わせ、正解の一意性・全選択肢の扱い・訳の抜け・否定と比較・小学生への分かりやすさを点検し修正（内容点検済み数に反映）。', '',
      '注意：正答を伏せた状態での独立した自力解答は作成担当のものだけです。点検担当の解き直しは、正解が書かれた解説ファイルを参照できる状態で行っており、完全には独立していません（2026-10-22以降の点検分は、先に正答抜きデータで解く手順に変更）。', '',
      '## 実施していない点検', '',
      '- ネイティブ話者・人間の講師による確認。',
      '- 公式解答PDFとの再照合（正答は提供データの correct を使用。自力解答との一致のみ確認）。', '',
      '## 疑義', '']
L += [f"- {i['questionId']}：{i['reason']}" for i in issues] or ['- なし']
fixes, todo = [], []
for b in prog['batches']:
    rv = HERE / 'work' / b['batchId'] / '_review.md'
    if rv.exists():
        md = rv.read_text('utf-8')
        fixes += grab(md, '修正一覧')
        todo += [x for x in grab(md, '要確認') if x != '- なし']
L += ['', f'## 点検での修正（{len(fixes)}件）', ''] + (fixes or ['- なし'])
L += ['', '## 要確認（人の目で確認が必要）', ''] + (todo or ['- なし'])
(pdir / 'Reading_作成結果.md').write_text('\n'.join(L) + '\n', 'utf-8')
complete = v.returncode == 0 and vf.returncode == 0 and set(vrep.get('emptyIds', [])) == {i['questionId'] for i in issues}  # 空欄は疑義のみ
zp = pdir / f'Reading_解説完成_part{a.part}_返却.zip'
if complete:
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in [final, pdir / 'Reading_疑義一覧.json', pdir / 'Reading_作成結果.md', pdir / 'progress.json']:
            z.write(f, f.name)
        for f in sorted((pdir / 'results').glob('*.json')):
            z.write(f, 'results/' + f.name)
print(build_log.splitlines()[-1] if build_log else '')
print(json.dumps(tot, ensure_ascii=False), 'zip' if complete else 'NOT complete (no zip)')
