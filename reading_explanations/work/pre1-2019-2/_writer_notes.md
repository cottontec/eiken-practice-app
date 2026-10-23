# pre1-2019-2 作成メモ（分割番号 11・準1級・41解答欄）

## 作成数
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）
- 本文全訳ファイル：5（cloze26, cloze29, reading32, reading35, reading38）
- 疑義数：0（画像33枚すべて判読でき、切れている箇所はない）

## 画像と抽出テキストの照合
- 画像33枚をすべて開いて、本文と選択肢を抽出テキストと照合した。語句の食い違いはなかった。
- 抽出テキストではダッシュ（—）が抜けていた（cloze29 の inflammation—a condition ～、melanin—a substance ～ coloring—and、reading35 の open ocean—and therefore ～ regulations—most ships、reading38 の homelessness—two of ～ poverty—would）。引用と訳は画像どおりダッシュを入れた形で扱った。
- reading32 の書名 In Search of Dracula と、reading38 の Utopia は画像では斜体。

## 自力解答と正式解答の照合
- 正答を見る前に、画像を使って全41問を解き、_selfsolve.tsv に保存した。そのあとで source.json の correct と照合した。
- 一致41件／不一致0件。selfSolveNote は不要。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2019-2：target=41 written=41 issue=0 missing=0 errors=0 warnings=0
- WARN は出ておらず、残したものはない。

## 粗探しで直した点
- q12：雷に打たれるのも「めったにない」という本文にない推論を消した。greatly overstated の訳は「大いに誇張されている」にした。
- q22：backed off の説明に入れていた細かい語法（from が必要）を消し、文に当てはめたときの不自然さで説明した。
- q26：「この問題の型」を指定の型（語の意味・組み合わせ）に直した。ウォッカの補足から背景知識を消した。
- q28：「国などが決める」という補足を消し、本文の place limitations on ～ に沿った説明にした。
- q31：選択肢4の訳から比べる相手のあいまいな補足を消した。理由も、本文の研究範囲に沿った書き方に直した。
- q33・q34：「むしろ」と、言い切りすぎていた「本文と合いません」を、本文の記述を示す形に改めた。
- q35：must の訳に足していた「必ず」を消した。
- q2（would be doing を過去から見た予定として訳した）、q16（原文にない「ちょっと」を消した）、q23（「あまりにも～すぎ」の重複を直した）、q25（perform well の時制を「あげる」に直した）。
- reading38：could eliminate を「なくすことができるだろう」にした。encourage employers to decrease wages の訳を「下げさせる」から「下げるのを後押しする」に弱めた。less incentive の比べる相手を（UBIがないときより）と補った。
- 比べる相手を（　）で補った箇所：cloze29 の 10 percent shorter「（ほかの色のラブラドールより）」、reading35 の水滴が smaller「（エアロゾルが少ないときより）」、reading38 の perform better「（そうでない子どもより）」と working more「（以前より）」。

## 要確認
- r-pre1-2019-2-q36：twice as likely to occur in two of the busiest shipping routes は、本文に比べる相手が書かれていない。第3段落の nearby waters with less shipping activity を手がかりにして、全訳では「（まわりの海域と比べて）ほぼ2倍」と補った。補ってよいか確認してほしい（q35・q37 も同じ全訳を使う）。
- r-pre1-2019-2-q36：Katrina Virts を「カトリーナ・バーツ」とした（「ヴァーツ」とも書ける）。q35・q37 も同じ全訳を使う。
- r-pre1-2019-2-q33：書名 In Search of Dracula は日本語訳の正式な書名を確かめられなかったので、『In Search of Dracula（ドラキュラを探して）』とした。Raymond T. McNally は「レイモンド・T・マクナリー」、Radu Florescu は「ラドゥ・フロレスク」、Vlad III は定着している「ヴラド3世」とした。q32・q34 も同じ全訳を使う。
- r-pre1-2019-2-q38：Sir Thomas More は「トマス・モア卿」とし、Sir の意味を（　）で説明した（日本語では「トマス・モア」とだけ書くことが多い）。Utopia は定着している『ユートピア』とした。q39～q41 も同じ全訳を使う。
- r-pre1-2019-2-q31：Autonomous University of Barcelona は定着している「バルセロナ自治大学」とした。q29・q30 も同じ全訳を使う。
- r-pre1-2019-2-q27：Johns Hopkins Bloomberg School of Public Health は「ジョンズ・ホプキンス大学ブルームバーグ公衆衛生大学院」とした。q26・q28 も同じ全訳を使う。
- r-pre1-2019-2-q13：Morgan's Department Store は「モーガンズ百貨店」とした（「モーガン百貨店」とも訳せる）。
- r-pre1-2019-2-q3：the president は、nation's economy の話なので「大統領」とした（「社長」の可能性は低いと判断した）。
