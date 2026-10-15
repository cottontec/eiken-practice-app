"""準2級 二次試験 添削PDFのビルド＋スコア検算。

python3 build.py  ->  score_check.txt と tensaku.html を出力し、検算に失敗すれば停止する。
"""
import html
from pathlib import Path

HERE = Path(__file__).parent

# ---- 公式（2026-10-15 Web検索で確認） ----
# CSE：準2級 二次（Speaking）満点600・合格基準406（英検公式FAQ）
# 素点：音読5＋No.1〜5 各5＋アティチュード3＝33（解説サイト複数で一致。公式ページは接続不可で直接未確認）
CSE_MAX, CSE_PASS = 600, 406
RAW_MAX = 33
ITEMS = ["音読", "No.1", "No.2", "No.3", "No.4", "No.5", "アティチュード"]
ITEM_MAX = {"音読": 5, "No.1": 5, "No.2": 5, "No.3": 5, "No.4": 5, "No.5": 5, "アティチュード": 3}
assert sum(ITEM_MAX.values()) == RAW_MAX

# ---- 推定素点（録音から。None＝録音なしで未評価） ----
SCORES = {
    "D": {"音読": 4, "No.1": 4, "No.2": 3, "No.3": 2, "No.4": 2, "No.5": None, "アティチュード": None},
    "A": {"音読": 3, "No.1": 3, "No.2": 3, "No.3": 3, "No.4": 3, "No.5": None, "アティチュード": None},
}
# 未評価項目の仮置き（下限, 上限）【推定】
ASSUME = {"No.5": (2, 3), "アティチュード": (2, 3)}


def cse(raw):
    """素点→CSEの比例換算【推定】。公式の換算表は非公開。"""
    return round(raw / RAW_MAX * CSE_MAX)


def card_total(card):
    s = SCORES[card]
    known = sum(v for v in s.values() if v is not None)
    lo = known + sum(ASSUME[k][0] for k, v in s.items() if v is None)
    hi = known + sum(ASSUME[k][1] for k, v in s.items() if v is None)
    return known, lo, hi


lines = []
for card in SCORES:
    for k, v in SCORES[card].items():
        assert v is None or 0 <= v <= ITEM_MAX[k], (card, k, v)
    known, lo, hi = card_total(card)
    lines.append(f"カード{card}: 評価済み {known}/25（音読＋No.1〜4）  仮置き込み {lo}〜{hi}/33  "
                 f"CSE【推定】{cse(lo)}〜{cse(hi)}/600（合格基準{CSE_PASS}）")
pass_raw = CSE_PASS / CSE_MAX * RAW_MAX
lines.append(f"CSE {CSE_PASS} に相当する素点（比例換算）: {pass_raw:.2f}/33 → 23点以上で基準を超える")
assert cse(22) < CSE_PASS <= cse(23)
(HERE / "score_check.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines))

# ---- 本文データ ----
D_KNOWN, D_LO, D_HI = card_total("D")
A_KNOWN, A_LO, A_HI = card_total("A")

CARDS = [
    {
        "id": "D", "title": "Online Music",
        "reading": [
            ("and in this way they can...", "and in the way ...（と聞こえる）", "this を the と読んだか、th の音が弱い可能性。this way はひとかたまり。"),
            ("and in this way / they can", "way の後で約1.8秒止まる", "意味の切れ目ではないので止まらない。"),
            ("become more popular", "more の後で約0.9秒止まる", "more popular で1語のつもりで読む。"),
        ],
        "reading_note": "語の抜けはなく、全体は安定しています。止まる位置を意味の切れ目（カンマ・ピリオド）だけにすると、さらに聞きやすくなります。",
        "qa": [
            {"no": "No.1", "q": "According to the passage, how can people listen to songs outside even without an Internet connection?",
             "x": "By people downloading their favorite music to their smartphones.",
             "o": "By downloading their favorite music to their smartphones.",
             "why": "By ＋ -ing で答えるときは主語（people）を入れない。内容は正解。", "label": "文法"},
            {"no": "No.2", "q": "Tell me as much as you can about what the people in Picture A are doing.",
             "x": "A boy is go up the stairs. A man is fixing a chair. A girl is feeding a dog. A woman is cooking. A woman is painting.",
             "o": "A boy is going up the stairs. A man is fixing a chair. A girl is feeding a dog. A woman is cooking. A woman is painting the wall.",
             "why": "is go → is going。「is ＋ ing形」を毎回そろえる。painting は何を塗っているか（the wall）まで言う。5人全員に触れられたのは良い点。1人ごとに2〜3秒の沈黙があるので、言い終えたらすぐ次の人へ。", "label": "文法"},
            {"no": "No.3", "q": "Look at the woman and the man in Picture B. Please describe the situation.",
             "x": "A man is looking for a ticket.",
             "o": "The woman wants to see his ticket, but he can't find it.",
             "why": "女性（車掌）に触れていないので、状況説明として半分です。吹き出し（切符を見せてほしい）と、男性が困っている理由を but でつなぐ。", "label": "今回いちばん大きい失点"},
            {"no": "No.4", "q": "Do you think listening to English songs is a good way for people to learn English?",
             "x": "Yes. People can be interested in English.",
             "o": "Yes. Listening to English songs makes people more interested in English. Also, they can learn new words while enjoying music.",
             "why": "理由が1文で短い。English の直前で約5秒止まった。理由は2文、2つ目は Also, で足す型に固定する。", "label": "内容"},
        ],
    },
    {
        "id": "A", "title": "Keeping in Touch",
        "reading": [
            ("many adults live far", "leave と聞こえる", "live は短く「リヴ」。leave（リーヴ）にしない。"),
            ("Now, some older people", "聞き取れない（詰まった可能性）", "3文目の入り。事前に2〜3回声に出しておく。"),
            ("their children's faces", "face と聞こえる", "複数形の -s を落とさない。"),
            ("through video calls", "so video ... と聞こえる", "th は舌先を歯に当てる。"),
            ("These calls can even ...", "clothes と聞こえる", "calls（コールズ）をはっきり。"),
            ("talk to family members", "talk の後で約1秒止まる", "talk to family members は続けて読む。"),
        ],
        "reading_note": "カードDより止まる箇所が多いです。特に3文目（Now, some older people ... through video calls）を重点的に。",
        "qa": [
            {"no": "No.1", "q": "According to the passage, why are some older people less likely to get lonely?【推定】",
             "x": "Because some older people can see their children's faces through video calls.",
             "o": "Because they can see their children's faces through video calls.",
             "why": "本文の some older people は they に置き換える。内容は正解。準2級No.1で毎回出る型。", "label": "今回いちばん大きい失点"},
            {"no": "No.2", "q": "Tell me as much as you can about what the people in Picture A are doing.【推定】",
             "x": "A boy is climbing a tree. A woman is planting. A man is running to catch cats. Two (girls are) playing basketball. A man is throwing out.",
             "o": "A boy is climbing a tree. A woman is planting flowers. A man is chasing a cat. Two girls are playing basketball. A man is throwing away some trash.",
             "why": "目的語（flowers／trash）まで言い切る。猫は1匹なので a cat。「追いかける」は chase で言える。", "label": "語彙"},
            {"no": "No.3", "q": "Look at the man and the woman in Picture B. Please describe the situation.【推定】",
             "x": "A man will carry a box because a woman cannot carry a box.",
             "o": "She can't lift the box, so he is thinking of helping her carry it.",
             "why": "男性はまだ考えている段階（吹き出し）なので will ではなく is thinking of ～ing。2回目からは the box／it。", "label": "文法"},
            {"no": "No.4", "q": "（質問文は未受領）",
             "x": "Yes. It is very convenient. (For th... Oh, sorry.) It saves a lot of time.",
             "o": "Yes. It is very convenient. Also, it saves a lot of time.",
             "why": "Yes＋理由2つの形はできている。言い直すときに sorry は要らない。黙って言い直せばよい。", "label": "構成"},
        ],
    },
]

TOP3 = [
    ("No.3は2人とも説明する", "カードDは男性だけ、カードAは will で言った。吹き出し・困っている理由を but／so でつなぎ、1文で2人を説明する。"),
    ("No.1は代名詞に置き換える", "some older people → they。本文の主語をそのまま繰り返さない。By ＋ -ing のときは主語を入れない。"),
    ("No.2は「is ＋ ing形 ＋ 目的語」まで", "is go → is going。painting the wall／planting flowers／throwing away some trash まで言い切る。"),
]
GOOD = [
    "No.2で、カードDの5人全員の動作に触れられている。",
    "No.1の内容はカードA・Dとも正しく、本文の該当箇所をすばやく見つけられている。",
    "カードAのNo.4は「Yes ＋ 理由2つ」の形ができている。",
]
CHECK = [
    "音読：カンマとピリオド以外で止まらない",
    "No.1：本文の主語を they／it に置き換えた",
    "No.2：全員について「is ＋ ing ＋ 目的語」で言った",
    "No.3：2人とも登場させ、but／so でつないだ",
    "No.4・No.5：理由を2文言い、2つ目は Also, で始めた",
    "言い直すときに sorry と言わない",
]

e = html.escape


def score_rows():
    out = []
    for k in ITEMS:
        d, a = SCORES["D"][k], SCORES["A"][k]
        f = lambda v: "録音なし" if v is None else str(v)
        out.append(f"<tr><td>{k}</td><td class=c>{ITEM_MAX[k]}</td><td class=c>{f(d)}</td><td class=c>{f(a)}</td></tr>")
    out.append(f"<tr class=sum><td>評価できた分（音読＋No.1〜4）</td><td class=c>25</td><td class=c>{D_KNOWN}</td><td class=c>{A_KNOWN}</td></tr>")
    out.append(f"<tr class=sum><td>合計（No.5・アティチュードを各{ASSUME['No.5'][0]}〜{ASSUME['No.5'][1]}点と仮置き）</td><td class=c>33</td><td class=c>{D_LO}〜{D_HI}</td><td class=c>{A_LO}〜{A_HI}</td></tr>")
    out.append(f"<tr class=sum><td>CSEスコア【推定】</td><td class=c>600</td><td class=c>{cse(D_LO)}〜{cse(D_HI)}</td><td class=c>{cse(A_LO)}〜{cse(A_HI)}</td></tr>")
    return "\n".join(out)


def card_html(c):
    rows = "".join(f"<tr><td class=en>{e(a)}</td><td>{e(b)}</td><td>{e(w)}</td></tr>" for a, b, w in c["reading"])
    qa = ""
    for q in c["qa"]:
        qa += f"""<div class=qa><div class=qh><b>{q['no']}</b><span class=lab>{e(q['label'])}</span></div>
<div class="qq en">{e(q['q'])}</div>
<div class=row><span class=mk>×</span><span class=en>{e(q['x'])}</span></div>
<div class="row o"><span class=mk>○</span><span class=en>{e(q['o'])}</span></div>
<div class=row><span class=mk>・</span><span>{e(q['why'])}</span></div></div>"""
    return f"""<h2 class=pb>問題カード{c['id']}　<span class=en>{e(c['title'])}</span></h2>
<h3>音読</h3>
<table class=rd><tr><th>本文</th><th>聞こえた読み</th><th>直し方</th></tr>{rows}</table>
<p class=note>{e(c['reading_note'])}</p>
<h3>質問への応答</h3>{qa}"""


top3 = "".join(f"<li><b>{e(t)}</b><br>{e(d)}</li>" for t, d in TOP3)
good = "".join(f"<li>{e(g)}</li>" for g in GOOD)
check = "".join(f"<div class=ck><span class=box></span>{e(c)}</div>" for c in CHECK)

import math
pass_int = math.ceil(pass_raw)
need_lo, need_hi = pass_int - max(D_HI, A_HI), pass_int - min(D_LO, A_LO)
up_lo, up_hi = min(D_LO, A_LO) + 3, max(D_HI, A_HI) + 4
cse_pass_int = cse(pass_int)
assert (need_lo, need_hi, pass_int, cse_pass_int) == (2, 4, 23, 418), (need_lo, need_hi, pass_int, cse_pass_int)
assert D_KNOWN + 5 + 3 == pass_int and A_KNOWN + 5 + 3 == pass_int
page = f"""<!doctype html><html lang=ja><head><meta charset=utf-8><style>
@page {{ size: A4; margin: 14mm 15mm 14mm 15mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: 'Noto Sans JP', sans-serif; font-size: 9.6pt; line-height: 1.6; color: #000; margin: 0; }}
.en {{ font-family: 'Noto Sans JP', sans-serif; }}
.band {{ background: #000; color: #fff; padding: 8px 12px; font-size: 15pt; font-weight: 700; }}
.sub {{ font-size: 9pt; margin: 4px 0 10px; }}
h2 {{ font-size: 13pt; border-bottom: 2px solid #000; padding-bottom: 2px; margin: 11px 0 5px; break-after: avoid; }}
h3 {{ font-size: 10.5pt; margin: 10px 0 4px; break-after: avoid; }}
table {{ border-collapse: collapse; width: 100%; line-height: 1.45; }}
th, td {{ border: 1px solid #000; padding: 1.5px 6px; vertical-align: top; }}
th {{ background: #e6e6e6; font-weight: 700; }}
td.c {{ text-align: center; white-space: nowrap; }}
tr.sum td {{ font-weight: 700; }}
.rd td:first-child {{ width: 34%; }} .rd td:nth-child(2) {{ width: 26%; }}
.top3 {{ border: 2.5px solid #000; padding: 6px 12px 6px 28px; margin: 8px 0; }}
.top3 li {{ margin: 3px 0; }}
.note {{ margin: 4px 0; }}
.small {{ font-size: 8.3pt; }}
.qa {{ border: 1px solid #000; padding: 5px 8px; margin: 6px 0; break-inside: avoid; }}
.qh {{ display: flex; justify-content: space-between; }}
.lab {{ border: 1px solid #000; padding: 0 6px; font-size: 8.3pt; }}
.qq {{ font-size: 8.6pt; color: #333; margin-bottom: 3px; }}
.row {{ display: flex; gap: 6px; }} .mk {{ width: 1.2em; flex: none; font-weight: 700; }}
.row.o {{ font-weight: 700; }}
.ck {{ display: flex; align-items: center; gap: 8px; margin: 3px 0; break-inside: avoid; }}
.box {{ width: 8mm; height: 8mm; border: 1.5px solid #000; flex: none; }}
.cks {{ margin-bottom: 0; }}
ul {{ margin: 2px 0; }}
.top3 li {{ line-height: 1.5; }}
.cks {{ display: grid; grid-template-columns: 1fr 1fr; column-gap: 10px; }}
.pb {{ break-before: page; }}
</style></head><body>
<div class=band>英検準2級 二次試験（面接）練習　添削</div>
<div class=sub>教材：2025年度第2回 問題カードD「Online Music」／問題カードA「Keeping in Touch」　練習日：2026年10月15日<br>
読み方：×＝言った英語、○＝直した英語、・＝理由。理由のほうを先に読んでください。</div>

<h2>推定スコア</h2>
<table><tr><th>項目</th><th>満点</th><th>カードD</th><th>カードA</th></tr>{score_rows()}</table>
<p class="note small">合格基準：CSEスコア {CSE_PASS}／{CSE_MAX}（英検公式）。配点は音読5点、No.1〜5が各5点、アティチュード3点の計33点。
素点とCSEの換算表は公開されていないため、ここでは素点を600点に比例換算した【推定】です。
今回は No.5 の録音がなく、アティチュード（入退室・態度）も音声では判断できないため、仮置きで幅を持たせています。</p>
<p class=note><b>判定【推定】：現時点では合格基準に届いていません。あと{need_lo}〜{need_hi}点足りない位置です。</b>合格には素点{pass_int}点以上（CSE {cse_pass_int}）が必要で、今のままではNo.5とアティチュードが満点でやっと届く計算です。下の3つを直してNo.2〜No.4で3〜4点を上積みできれば、{up_lo}〜{up_hi}点になり、余裕を持って基準を超える見込みです。</p>

<h2>今回いちばん効く3つ</h2>
<ol class=top3>{top3}</ol>

<h2>すでにできているところ</h2>
<ul>{good}</ul>

<h2>次の練習で確認すること</h2>
<div class=cks>{check}</div>

{card_html(CARDS[0])}
{card_html(CARDS[1])}

<p class="note small">カードAの質問文（No.1〜No.3）は準2級の定型からの推定、No.4は未受領です。音読の発音の指摘は録音の機械書き起こしに基づくため、先生の耳で最終確認します。</p>
</body></html>"""
(HERE / "tensaku.html").write_text(page, encoding="utf-8")
