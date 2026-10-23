"""全12分割の返却物を1つのZIP（parts/Reading_解説完成_全体_返却.zip）にまとめ、原本の正答と照合する。
使い方: python3 -I tools/merge_all.py --src-root <zips>"""
import argparse, glob, json, os, re, zipfile
from pathlib import Path
ap = argparse.ArgumentParser(); ap.add_argument('--src-root', required=True); a = ap.parse_args()
P = Path(__file__).resolve().parent.parent / 'parts'; A = P / 'all'; A.mkdir(exist_ok=True)
out, prog, issues = {}, [], []
md = [(P / 'Reading_全体まとめ.md').read_text('utf-8').rstrip(), '']
for p in [f'{i:02d}' for i in range(1, 13)]:
    d = json.loads((P / f'part{p}/Reading_解説完成_part{p}.json').read_text('utf-8'))
    assert not set(d) & set(out)
    out.update(d)
    prog.append(json.loads((P / f'part{p}/progress.json').read_text('utf-8')))
    issues += json.loads((P / f'part{p}/Reading_疑義一覧.json').read_text('utf-8'))
    r = (P / f'part{p}/Reading_作成結果.md').read_text('utf-8').replace('\n## ', '\n### ')
    md += ['---', '', '## ' + r.lstrip('# ').rstrip(), '']
corr = {}
for f in glob.glob(f'{a.src_root}/*/batches/*.source.json'):
    for u in json.load(open(f, encoding='utf-8'))['units']:
        for q in u['questions']:
            corr[q['id']] = q['correct']
bad = [k for k, v in out.items() if not (m := re.search(r'【正解】\s*(\d)', v)) or int(m.group(1)) != corr.get(k)]
assert set(out) == set(corr) and not bad and all(v.strip() for v in out.values()), (len(out), len(corr), bad[:5])
json.dump(out, open(A / 'Reading_解説完成_全体.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
json.dump(issues, open(A / 'Reading_疑義一覧.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
json.dump({'parts': prog, 'totalAnswerSlots': sum(x['targetAnswerSlots'] for x in prog)},
          open(A / 'progress.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
(A / 'Reading_作成結果_全体.md').write_text('\n'.join(md) + '\n', 'utf-8')
with zipfile.ZipFile(P / 'Reading_解説完成_全体_返却.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in ['Reading_解説完成_全体.json', 'Reading_疑義一覧.json', 'Reading_作成結果_全体.md', 'progress.json']:
        zf.write(A / f, f)
    for f in sorted(P.glob('part*/results/*.json')):
        zf.write(f, 'results/' + f.name)
print(f'merged={len(out)} source={len(corr)} answer_mismatch={len(bad)} issues={len(issues)}')
