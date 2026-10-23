"""完成JSONを原本の正答データだけと突き合わせる独立検算（build_and_check.py とは別実装）。
使い方: python3 -I verify_final.py <Reading_解説作成用.json> <Reading_解説完成_partNN.json>"""
import json, re, sys
src = json.load(open(sys.argv[1], encoding='utf-8-sig'))
fin = json.load(open(sys.argv[2], encoding='utf-8-sig'))
bad, n = [], 0
for u in src['units']:
    for q in u['questions']:
        v = fin.get(q['id'], '')
        if not v:
            continue
        n += 1
        m = re.match(r'【正解】\s*(\d)', v)
        if not m or int(m.group(1)) != q['correct']:
            bad.append((q['id'], '正解番号'))
        if '{{' in v or '}}' in v:
            bad.append((q['id'], 'プレースホルダ残り'))
        if u['section'] in (2, 3) and len(v.split('【考え方】')[0]) < 400:
            bad.append((q['id'], '和訳（本文全訳）が短すぎる'))
        if u['section'] != 4:
            other = v.split('【ほかの選択肢】', 1)[-1].split('【覚えるポイント】')[0]
            for c in range(1, q['choices'] + 1):
                if c != q['correct'] and not re.search(rf'(^|\n)\s*{c}\s', other):
                    bad.append((q['id'], f'選択肢{c}の説明なし'))
print(f'checked={n} problems={len(bad)}')
for b in bad:
    print(' ', *b)
sys.exit(1 if bad else 0)
