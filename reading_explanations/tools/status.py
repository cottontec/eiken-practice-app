"""全バッチの進捗一覧（作業ファイルの有無と reviewed 数）。使い方: python3 -I status.py <ZIP展開先の親>"""
from pathlib import Path
import json, sys, re
HERE = Path(__file__).resolve().parent.parent
root = Path(sys.argv[1])
tot = {'target': 0, 'files': 0, 'reviewed': 0}
for part in sorted(p.name for p in root.iterdir() if p.is_dir()):
    for f in sorted((root / part / 'batches').glob('*.source.json')):
        bid = f.name[:-12]
        d = json.loads(f.read_text('utf-8-sig'))
        ids = [q['id'] for u in d['units'] for q in u['questions']]
        w = HERE / 'work' / bid
        files = sum((w / f'{i}.txt').exists() for i in ids)
        rev = sum((w / f'{i}.txt').exists() and re.search(r'^reviewed:\s*yes', (w / f'{i}.txt').read_text('utf-8'), re.M) is not None for i in ids)
        st = 'reviewed' if rev == len(ids) else 'written' if (w / '_writer_notes.md').exists() else 'writing' if files or (w / '_selfsolve.tsv').exists() else '-'
        print(f'{part} {bid:14} {len(ids):3} files={files:3} reviewed={rev:3} {st}')
        tot['target'] += len(ids); tot['files'] += files; tot['reviewed'] += rev
print(tot)
