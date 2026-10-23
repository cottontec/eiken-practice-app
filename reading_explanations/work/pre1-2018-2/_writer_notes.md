# 作成メモ pre1-2018-2（分割10・準1級 2018年度第2回）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳ファイル5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- 全画像（短文25枚・長文8枚）を開いて抽出テキストと照合した。本文・選択肢に欠けや食い違いはなかった。抽出テキストではダッシュ（—）が落ちている（cloze26 の bacteria—a type of ～ MRSA—were、reading32 の work—for example と babies—a mismatch、reading38 の dramatically—by as much as 30 percent—after）。また、行末の large-scale・time-consuming などがソフトハイフン（­）＋改行になっている。どちらも意味に影響はなく、引用・choices は画像どおりに書いた。

## 自力解答と正式解答
- 正答を見る前に画像と正答抜きデータだけで全41問を解き、_selfsolve.tsv に保存した。正式解答と照合した結果、41問すべて一致（不一致0件）。selfSolveNote はなし。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2018-2：target=41 written=41 issue=0 errors=0 warnings=1。
- 残したWARN：r-pre1-2018-2-q40 選択肢3「When wages ... large-scale immigration ...」が抽出テキストに見つからない。原因は、抽出テキストで large と scale の間がソフトハイフン＋改行になっているため（正規化すると "large scale" になる）。画像では行末で large- と切れた large-scale で、choices は画像どおりなので直さなかった。
- 別に、【考え方】【ほかの選択肢】の英文引用が抽出テキストと一致するかを機械的に照合した（ダッシュとハイフンは除いて比べた）。食い違いは q28 の time-consuming（上と同じソフトハイフンの問題）だけで、画像どおりだった。

## 書き方で判断したこと
- 指示書6（まず見るところ／この問題の型／引用のあとの改行／選択肢ごとの改行／英語の再掲）を全ファイルに当てはめた。1段落が4文以上になった【考え方】の段落は2つに分けた。
- 比較の相手は、前後の文からはっきり分かるときだけ補った。cloze26「（今のやり方より）互いのすぐ近くで長い時間を過ごす可能性が低くなる」「（今のやり方より）時間がかかる」、cloze29 の空所(29)「（高校生の選手と比べて）プロの選手たちには持たれていることが少なかった」、q8「以前より目立ってやせていました」、q17「（今回より）もっとうまくやれる」。cloze26 の infectious diseases could spread more widely と more effective cleaning strategies、cloze29 の better performance は比べる相手が原文にないので「より広く」「より効果的な」「よりよい成績」とだけ訳した。
- reading32 の「医学部進学課程の学生（医学部に進む前の段階の学生）」「依存（頼りきりになること）」の（ ）は説明のための補足で、原文の内容は足していない。
- q29 の正解の根拠は「高校生の4分の3以上がこの考え」と「子どもに専念してほしいと答えたプロはわずか5分の1」の比較。2つは質問の中身が少し違うので、「読み取れます」と書き、言い切っていない。
- q40 の正解（大規模な移民が賃金に悪い影響を与えると思いこむのはまちがい）は、「理論上は悪い影響があったはず」⇔「事実上影響がなかった」からの推論として「→読み取れること」の形で示した。
- q37 の「ポートランド市に残ったのは1つだけ」は、本文の One of them eventually relocated to Mexico, and the remaining facility ～ から読み取れることとして示した（本文に「ポートランドに残った」とそのまま書いてあるわけではない）。

## 要確認
- r-pre1-2018-2-q5：Farouk を「ファルーク」とした。
- r-pre1-2018-2-q26：Kiril Vaglenov を「キリル・バグレノフ」とした（「ヴァグレノフ」とも書ける。冊子に読みなし）。Auburn University は「オーバーン大学」、Ashok Srinivasan は「アショク・スリニバサン」、E. Coli は「大腸菌」、Staphylococcus aureus は「黄色ブドウ球菌」、MRSA は英字のままにした。q27・q28 も同じ本文。
- r-pre1-2018-2-q29：Thomas Jefferson University Hospital を「トーマス・ジェファーソン大学病院」、University of Wisconsin-Madison を「ウィスコンシン大学マディソン校」とした。q30・q31 も同じ本文。
- r-pre1-2018-2-q30：Dr. Drew Watson はスポーツ医学の医師と考えて「ドリュー・ワトソン医師」とした（研究者として「博士」とする書き方もある）。
- r-pre1-2018-2-q31：Timothy McGuine を「ティモシー・マクギン」とした（読みに自信がない。「マクグワイン」の可能性もある）。
- r-pre1-2018-2-q32：タイトル Medical Voluntourism と本文の voluntourism を「ボランツーリズム」とした（volunteer＋tourism の造語。「ボランティア旅行」と訳す書き方もある）。Lexy Adams は「レクシー・アダムズ」。q33・q34 も同じ本文。
- r-pre1-2018-2-q35：Oregon Department of Environmental Quality（DEQ）を「オレゴン州環境品質局」、US Forest Service を「アメリカ森林局」とした。Orthotrichum lyellii は日本語で定着した名前が見当たらないため「オルトトリクム・ライエリー（Orthotrichum lyellii）」と学名を併記した。q36・q37 も同じ本文。
- r-pre1-2018-2-q38：タイトル・本文の Marielitos を「マリエリートス」とした（スペイン語の読み。「マリエリトス」「マリエル難民」とも書かれる）。Mariel は「マリエル港」、Havana は「ハバナ」。George Borjas は「ジョージ・ボージャス」（日本語の経済学の文献で一般的な表記のつもり）、David Card は「デビッド・カード」。q39～q41 も同じ本文。
