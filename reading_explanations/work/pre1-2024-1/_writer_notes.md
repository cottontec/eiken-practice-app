# 作成メモ pre1-2024-1（分割12・準1級 2024年度第1回）

## 作成数・疑義
- 作成数：31／31解答欄（大問1：18、大問2：6、大問3：7）。本文全訳ファイル4本（cloze19・cloze22・reading25・reading28）。
- 疑義：0件。
- 全画像（短文18枚・長文6枚）を開いて抽出テキストと照合した。本文・選択肢に欠けはなかった。抽出テキストではダッシュ（—）が落ちている（reading25 の leader—an alpha male—that と flexible—for example、reading28 の women—who were ～ in the 1940s—other）。また、reading28 の male-dominated・mid-1990s・so-called・architecture-related のハイフンがソフトハイフン（­）になっている。どちらも意味に影響はなく、引用・choices は画像どおりに書いた。

## 自力解答と正式解答
- 正答を見る前に画像と正答抜きデータだけで全31問を解き、_selfsolve.tsv に保存した。正式解答と照合した結果、31問すべて一致（不一致0件）。selfSolveNote はなし。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2024-1：target=31 written=31 issue=0 missing=0 errors=0 warnings=0。
- 別に、【考え方】【ほかの選択肢】【覚えるポイント】の英文引用が抽出テキストと一致するかを機械的に照合した（ダッシュ・ソフトハイフンは除いて比べた）。食い違いとして出たのは either A or B・get down to business などの「語句の形」の説明だけで、本文からの引用はすべて原文どおりだった。【考え方】で4文以上の段落がないことも確かめた。

## 書き方で判断したこと
- 指示書6（まず見るところ／この問題の型／引用のあとの改行／選択肢ごとの改行／英語の再掲）を全ファイルに当てはめた。
- 比較の相手は、前後の文からはっきり分かるときだけ補った。q15 の even worse は直前の bad enough と比べているので「さらにひどい」とした。reading25 の has more in common behaviorally with humans in prisons は直前の「人間の家族」と比べているので「刑務所の人間とのほうが共通点が多い」とした。q4 の do more to prevent pollution、reading25 の bolder and riskier actions、reading28 の harder for them to navigate・feel safer は比べる相手が原文にないので「より～」とだけ訳した。q20 の選択肢3 much less knowledge about も相手を補わず「ずっと少ない知識」とした。
- q13 の Ms. Jones は、本文に teacher という語がないので「ジョーンズさん」とした（宿題の書き直しを指示している場面なので先生とも読めるが、補わなかった）。
- q3 の their mom は「お母さん」、q16 の they（Kelsey と a client）は「二人」とした。
- q29 の正解（よい点と問題のある点の両方があった）は、本文の did not negatively impact（悪い影響を与えなかった）と選択肢の beneficial（有益だった）が全く同じ意味ではないことを【考え方】に明記し、「→」で対応させた。
- q30 の正解は、本文の「実際に使う人のニーズを理解しようとすることで最高の仕事ができる」から「平均に注目すると見落としやすい」を推論する形なので、「読み取れること」として示した。
- reading25 の Toxoplasma gondii は単細胞の生き物で「虫」ではないため、parasite を「寄生虫」ではなく「寄生生物」と訳した。
- q28 の「フェミニスト建築」は、本文の説明（女性のニーズが考えに入れられていなかったことへの不満）から「女性のニーズを考えに入れた建築を目指す考え方を指していると読み取れる」とした。

## 要確認
- r-pre1-2024-1-q1：Raoul を「ラウール」とした。
- r-pre1-2024-1-q5：Jaina を「ジェイナ」とした（「ジャイナ」「ヤイナ」とも読める。冊子に読みなし）。
- r-pre1-2024-1-q14：Caleb を「ケイレブ」とした（「カレブ」と書かれることもある）。
- r-pre1-2024-1-q13：Ms. Jones を「ジョーンズさん」とした（場面から先生と考えられるが、teacher の語がないため）。
- r-pre1-2024-1-q22：タイトル・本文の sudden savant syndrome を「突発性サヴァン症候群」とした（日本語では「後天性サヴァン症候群」と書かれることもある）。q23・q24 も同じ本文。
- r-pre1-2024-1-q25：Toxoplasma gondii を「トキソプラズマ・ゴンディ」とし、parasite を「寄生生物」と訳した。alpha male は「アルファオス」とした。q26・q27 も同じ本文。
- r-pre1-2024-1-q28：Matrix を「マトリックス」、Le Modulor を「ル・モデュロール」（日本語では「モデュロール」と書かれることが多い）、Jagonari Women’s Educational Resource Centre を「ジャゴナリ女性教育資料センター」とした。冊子に読みなし。q29～q31 も同じ本文。
