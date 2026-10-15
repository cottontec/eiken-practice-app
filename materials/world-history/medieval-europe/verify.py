#!/usr/bin/env python3
"""中世ヨーロッパ演習20題（index.html）の機械照合スクリプト。

使い方: python3 verify.py [index.html のパス]

確認すること
1. 問題数20・各大問5問・各5点で100点
2. 選択肢数（4択または整序6択）と解説の数の一致、正解番号が範囲内
3. 整序問題：問題内の年代から求めた正しい順序が正解番号と一致するか
   さらに、問題内の年代を下の独立した年代表（REF_YEARS）と照合
4. 正誤問題：a/b の正誤から求めた番号が正解番号と一致するか
5. 組合せ問題：truth の語の組が正解の選択肢と一致し、他の選択肢が一致しないか
6. 単一選択の問題：解説で「正しい。」で始まるのが正解の1つだけか
7. 解説・本文に出てくる西暦を REF_YEARS と照合（表にある出来事のみ）
8. 正解番号の分布を表示

REF_YEARS は作問者とは別に教科書の標準年代を書き起こしたもの。
これ自体も人の記憶に基づくため、最終的には教科書・用語集で確認すること。
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
TF = [[True, True], [True, False], [False, True], [False, False]]

# 出来事のキーワード -> 標準的な年代（教科書記述）
REF_YEARS = {
    "ピピンが、ランゴバルド王国から奪ったラヴェンナ地方": 756,
    "聖像禁止令": 726,
    "メルセン条約": 870,
    "ヴェルダン条約": 843,
    "トゥール・ポワティエ間の戦い": 732,
    "サラディンが、イェルサレムを奪回": 1187,
    "ラテン帝国を建てた": 1204,
    "イェルサレム王国を建てた": 1099,
    "模範議会": 1295,
    "大憲章（マグナ＝カルタ）を認めた": 1215,
    "シモン＝ド＝モンフォールが": 1265,
    "コンスタンツ公会議が開かれ": 1414,
    "教会大分裂（大シスマ）が始まった": 1378,
    "アヴィニョンに移された": 1309,
}

# 解説・本文中の「語句…年」の記述を照合するための表（語句, 年）
REF_MENTIONS = [
    ("ニケーア公会議", 325), ("496年ごろ", 496), ("1098年創設", 1098), ("910年", 910),
    ("1077年", 1077), ("1122年のヴォルムス協約", 1122), ("1095年", 1095),
    ("911年", 911), ("862年", 862), ("1130年", 1130), ("1066年", 1066),
    ("1453年", 1453), ("1303年", 1303), ("1397年", 1397), ("962年", 962),
    ("1356年", 1356), ("1358年", 1358), ("1381年", 1381), ("1689年", 1689),
    ("1302年", 1302), ("1328年", 1328), ("1339年", 1339), ("1337年", 1337), ("1429年", 1429),
    ("1455〜85年", 1455), ("1414〜18年", 1414), ("1415年", 1415), ("1377年", 1377),
]
KNOWN_YEARS = {y for _, y in REF_MENTIONS} | set(REF_YEARS.values()) | {800, 843, 732, 1187}


def load(path):
    html = Path(path).read_text(encoding="utf-8")
    m = re.search(r'<script type="application/json" id="exam-data">(.*?)</script>', html, re.S)
    if not m:
        sys.exit("exam-data が見つかりません")
    return json.loads(m.group(1))


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else Path(__file__).with_name("index.html")
    data = load(path)
    qs = data["questions"]
    errors, notes = [], []

    def check(cond, msg):
        if not cond:
            errors.append(msg)

    check(len(qs) == 20, f"問題数が20ではない: {len(qs)}")
    check([q["no"] for q in qs] == list(range(1, 21)), "問番号が1〜20の連番でない")
    per_sec = Counter(q["section"] for q in qs)
    check(all(per_sec[s] == 5 for s in (1, 2, 3, 4)), f"大問ごとの問題数が5でない: {dict(per_sec)}")
    check(len(qs) * 5 == 100, "満点が100点でない")

    for q in qs:
        n, t, a = q["no"], q["type"], q["answer"]
        if t == "order":
            check(len(q["items"]) == 3 and len(q["years"]) == 3, f"問{n}: 整序の項目数")
            order = sorted(range(3), key=lambda i: q["years"][i])
            check(len(set(q["years"])) == 3, f"問{n}: 年代が重複")
            correct = ORDERS.index(order) + 1
            check(a == correct, f"問{n}: 整序の正解 {a} と年代から求めた {correct} が不一致")
            for item, year in zip(q["items"], q["years"]):
                hits = [y for k, y in REF_YEARS.items() if k in item]
                check(len(hits) == 1, f"問{n}: 年代表に該当する出来事がない/複数: {item}")
                if hits:
                    check(hits[0] == year, f"問{n}: {item} の年 {year} が年代表 {hits[0]} と不一致")
            check(len(q["explain_items"]) == 3, f"問{n}: 整序の解説数")
            for item_ex, year in zip(q["explain_items"], q["years"]):
                check(str(year) in item_ex, f"問{n}: 解説に年 {year} がない: {item_ex}")
        elif t == "tf":
            correct = TF.index(q["truth"]) + 1
            check(a == correct, f"問{n}: 正誤の正解 {a} と truth から求めた {correct} が不一致")
            for ex, tv in zip(q["explain_items"], q["truth"]):
                head = ex[2:5]
                check(head.startswith("正しい") == tv, f"問{n}: 解説の正誤表記と truth が不一致: {ex[:12]}")
        elif t == "combo":
            check(len(q["choices"]) == 4, f"問{n}: 組合せの選択肢数")
            target = [q["truth"][k] for k in q["keys"]]
            matches = [i + 1 for i, c in enumerate(q["choices"]) if c == target]
            check(matches == [a], f"問{n}: truth と一致する選択肢 {matches} が正解 {a} と不一致")
            check(len({tuple(c) for c in q["choices"]}) == 4, f"問{n}: 組合せの選択肢が重複")
            check(len(q["explain"]) == 4, f"問{n}: 解説数")
            check(q["explain"][a - 1].startswith("正しい"), f"問{n}: 正解の解説が「正しい」で始まらない")
        elif t == "single":
            check(len(q["choices"]) == 4 and len(q["explain"]) == 4, f"問{n}: 選択肢または解説の数")
            ok = [i + 1 for i, e in enumerate(q["explain"]) if e.startswith("正しい")]
            check(ok == [a], f"問{n}: 「正しい」の解説 {ok} と正解 {a} が不一致")
            ng = [i + 1 for i, e in enumerate(q["explain"]) if e.startswith("誤り")]
            check(sorted(ok + ng) == [1, 2, 3, 4], f"問{n}: 正誤の表記が抜けている選択肢がある")
        else:
            errors.append(f"問{n}: 不明な形式 {t}")

    # 本文・解説中の西暦を照合
    blob = json.dumps(data, ensure_ascii=False)
    for phrase, year in REF_MENTIONS:
        if phrase in blob:
            continue
        notes.append(f"照合用語句が本文にない（確認不要なら無視）: {phrase}")
    years_in_text = {int(y) for y in re.findall(r"(?<!\d)(\d{3,4})年", blob)}
    unknown = sorted(years_in_text - KNOWN_YEARS)
    if unknown:
        notes.append(f"年代表にない西暦（目視確認）: {unknown}")

    dist = Counter(q["answer"] for q in qs)
    print("正解番号の分布:", {f"{k}": dist[k] for k in sorted(dist)})
    print("正解一覧:", " ".join(f"問{q['no']}={q['answer']}" for q in qs))
    for msg in notes:
        print("NOTE:", msg)
    if errors:
        print(f"\nNG {len(errors)}件")
        for msg in errors:
            print(" -", msg)
        sys.exit(1)
    print("\nOK すべての機械チェックを通過")


if __name__ == "__main__":
    main()
