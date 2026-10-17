"""英文法チェック 問題バンク照合スクリプト（外部AI監査用・Python版）

使い方:  python3 verify_bank.py bank.json
Node.js 版 verify.mjs の形式チェック部分と同じ内容を、Python だけで確認する。
（ブラウザでの通し検算は verify.mjs --e2e 側で実施済み）
終了コード 0 = 合格、1 = 不合格あり
"""
import json
import re
import sys
from collections import Counter

BLANK = '(　　)'
EXPECT = {
    'g5': (15, 5), 'g4': (15, 5), 'g3': (20, 0), 'gp2': (20, 0),
    'g2': (20, 0), 'gp1': (20, 0), 'g1': (20, 0),
}


def sentence(q, toks):
    s = ' '.join(x for x in [q['before'], *toks, q['after']] if x)
    return s[:1].upper() + s[1:]


def main(path):
    bank = json.load(open(path, encoding='utf-8'))
    errors, ids, stems = [], set(), {}

    def fail(i, m):
        errors.append(f'{i}: {m}')

    for g in bank['grades']:
        exp = EXPECT.get(g['key'])
        if not exp:
            fail(g['key'], '想定外の級キー')
            continue
        n_choice = sum(q['type'] == 'choice' for q in g['items'])
        n_order = sum(q['type'] == 'order' for q in g['items'])
        if (n_choice, n_order) != exp:
            fail(g['key'], f'問題数 4択{n_choice}/並べ替え{n_order}（想定 {exp[0]}/{exp[1]}）')
        pos = Counter()
        for q in g['items']:
            i = q['id']
            if i in ids:
                fail(i, 'ID重複')
            ids.add(i)
            if not i.startswith(g['key'] + '-'):
                fail(i, 'ID接頭辞が級と不一致')
            if not q.get('cat'):
                fail(i, '分野がない')
            if not q.get('ja'):
                fail(i, '和訳／日本文がない')
            if q['type'] == 'choice':
                if q['en'].count(BLANK) != 1:
                    fail(i, f"空所が {q['en'].count(BLANK)} 個")
                ch = q['choices']
                if len(ch) != 4 or len({c.lower() for c in ch}) != 4:
                    fail(i, '選択肢が4つでない／重複')
                a = q['answer']
                if not isinstance(a, int) or not 0 <= a <= 3:
                    fail(i, '正解の添字が不正')
                else:
                    pos[a] += 1
                why = q.get('why', [])
                if len(why) != 4 or any(len(w or '') < 6 for w in why):
                    fail(i, '選択肢ごとの根拠が4つそろっていない')
                before = q['en'].split(BLANK)[0]
                at_start = before == '' or re.search(r'(^|\n)[AB]: $', before)
                if at_start and not re.match(r'[A-Z]', ch[a]):
                    fail(i, '文頭の空所なのに正解が小文字始まり')
                key = q['en'].lower()
                if key in stems:
                    fail(i, f'英文が {stems[key]} と重複')
                stems[key] = i
            elif q['type'] == 'order':
                t = q['tokens']
                if len(t) != 4 or len({x.lower() for x in t}) != 4:
                    fail(i, '語句が4つでない／重複')
                if any(re.match(r'[A-Z]', x) and x != 'I' for x in t):
                    fail(i, '語句に大文字始まり（本番は文頭も小文字）')
                if not re.search(r'[.?!]$', sentence(q, t)):
                    fail(i, '完成文が句読点で終わらない')
            else:
                fail(i, f"不明な type {q['type']}")
        print(f"{g['label']}: 4択 {n_choice} / 並べ替え {n_order} / 正解位置 {[pos[k] for k in range(4)]}")
    print(f'合計 {len(ids)} 問')
    if errors:
        print(f'\n不合格 {len(errors)} 件')
        for e in errors:
            print('  ✗ ' + e)
        return 1
    print('\nすべて合格')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'bank.json'))
