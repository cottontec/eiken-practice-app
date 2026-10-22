"""各バッチから正答（correct）を除いた「自力解答用」JSONを作る。作業担当は先にこれで解く。
使い方: python3 -I make_blind.py <ZIP展開先の親> <出力先>"""
from pathlib import Path
import json, sys
src_root, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
n = 0
for f in sorted(src_root.glob('*/batches/*.source.json')):
    d = json.loads(f.read_text('utf-8-sig'))
    for u in d['units']:
        for q in u['questions']:
            q.pop('correct', None)
    (out / f.name.replace('.source.json', '.blind.json')).write_text(json.dumps(d, ensure_ascii=False, indent=1), 'utf-8')
    n += 1
print(n, 'batches')
