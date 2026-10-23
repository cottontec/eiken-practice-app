# 作成メモ pre1-2017-2（分割10）

## 作成数・疑義
- 作成：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。

## 自力解答と正式解答の照合
- 正答を見る前に、blind データと全画像（reading/ 内の全11枚）で全41問を解き、_selfsolve.tsv に保存した。
- 正式解答との照合：41問すべて一致（不一致0件）。selfSolveNote なし。

## 画像との照合
- 抽出テキストは、長文の em ダッシュ（—）がすべて抜けていた（例：Tardigrades—also known as water bears—are／Tierra del Fuego—similar in size and population to Tasmania—shows／emergencies—the nearest one／winners—a saying／oval-shaped pits—a practice）。画像に合わせて、全訳・引用はダッシュのある原文どおりに扱った。そのほかの本文・選択肢は画像と一致。
- choices / answerText は画像どおり（アポストロフィは画像・抽出テキストと同じ ’ を使用）。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2017-2：target=41 written=41 issue=0 errors=0 warnings=0。残した WARN はなし。
- 追加で、解説中の英文引用（4語以上）が原文の語順どおりかをスクリプトで照合し、短縮・語順の変わっていた引用（q9・q14・q37・q38）を原文どおりに直した。

## 要確認
- r-pre1-2017-2-q29：本文（cloze29）の Dr. Vinay Prasad を「ビナイ・プラサド医師」とした。本文に職業の明記はないが、医学部・医療の話題であり Dr. の表記方針（医者なら「医師」）に従った。q30・q31 の全訳も同じ。カタカナは「ヴィナイ」とする書き方もある。
- r-pre1-2017-2-q29：全訳で a greater emphasis を「（以前より）重視」、became more aware を「（それまでより）強く意識」と比較の相手を補った（第1段落の In the past ⇔ In recent decades、第2段落の出来事の前後から相手は明らかと判断）。q29 の選択肢訳も同じ。
- r-pre1-2017-2-q32：本文（reading32）の Takekazu Kunieda を漢字で「國枝武和」とした（東京大学の研究者で、一般に「國枝武和」と表記される）。「国枝」とする表記もあるため確認してほしい。q33・q34 も同じ。
- r-pre1-2017-2-q35：La Nahuaterique を「ラ・ナワテリケ」とした（スペイン語の読みに近い形。冊子に読みはない）。q36・q37 も同じ。
- r-pre1-2017-2-q38：Philistia を「フィリスティア」とした（日本語では地域名も「ペリシテ」と呼ぶことがある）。Torah は「トーラー（ユダヤ教の聖典）」、Ashkelon は「アシュケロン」、Sherry Fox は「シェリー・フォックス」、Canaanites は「カナン人」とした。q39～q41 も同じ。
- r-pre1-2017-2-q26：Tierra del Fuego を「ティエラ・デル・フエゴ（島）」とした（日本語では「フエゴ島」とも呼ばれる）。Matt Ridley は「マット・リドレー」。q27・q28 も同じ。
- r-pre1-2017-2-q14：much less popular の比較の相手を「（小説より）」と補った（前の文から明らか）。
- r-pre1-2017-2-q19：more money の比較の相手を「（払う場合より）」と補った（Since they do not have to pay taxes から明らかと判断）。
- r-pre1-2017-2-q7：The new president を「大統領」と訳した（world peace・prevent all wars の文脈から。社長・学長などの可能性は低いと判断）。
- r-pre1-2017-2-q17：Giovanna を「ジョバンナ」とした（「ジョヴァンナ」とも書く）。
