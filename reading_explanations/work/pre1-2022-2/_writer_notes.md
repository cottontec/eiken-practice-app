# 作成メモ pre1-2022-2（分割11）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- すべての画像（大問1の25枚、長文は全ページ）を開いて、抽出テキストと照合した。抽出テキストの欠け：
  - cloze26 第1段落 England's Stonehenge—probably the world's best-known prehistoric stone circle—by のダッシュ（—）が抜けていた。
  - reading32 第3段落 the layout of a human face—two eyes and a nose above a mouth—can のダッシュが抜けていた。
  - reading38 第3段落 mental toughness—men who could ～、第4段落 the Special Air Service (SAS)—a British army unit ～ enemy lines—suffered のダッシュが抜けていた。
  - reading38 の long-range、first-name、ground-based、British-held のハイフンが特殊な文字になっていた（画像では普通のハイフン）。
  - いずれも画像どおりに読んで訳した。本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 41件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2022-2：written=41、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終える。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし、言いかえ・まとめ・推論でつながるものは「→」にした。
- 比較：q6 more confident は「はじめのときより自信を」（同じ文の At first から相手が分かるため補った）。cloze29 better, safer roads／better roads、q20 more delicious、reading38 with greater success and fewer casualties、weaker points は、相手を補わず「より～」と訳した。airplanes were better suited は「飛行機のほうが向いている」とした（相手は直前の「そうした部隊」）。
- q1 は A が B を Mom と呼んでいるが、B の語尾は中立的な「～よ」「～ね」にした。q17 の manager（she）は「上司」とした。
- q12 の「合併すると同じような仕事をする人が重なるので社員が不要になる」は、本文にない説明なので「考えられます」と書いた。

## 要確認
- r-pre1-2022-2-q2：Jocelyn は「ジョスリン」とした。
- r-pre1-2022-2-q17：Caleb は「ケイレブ」とした（「カレブ」とも書く）。
- r-pre1-2022-2-q26：Nabta Playa は「ナブタ・プラヤ」とした。England's Stonehenge の England は「イングランド」とした（「イギリス」とする書き方もある）。astrological map は原文どおり「占星術の地図」と訳し、占星術に（）で説明を付けた。q26～q28 に共通。
- r-pre1-2022-2-q29：The Gospel of Good Roads: A Letter to the American Farmer は『よい道路の福音（よい知らせ）――アメリカの農民への手紙』とした（定まった日本語題はないと思われる）。Ford Model T は「フォード・モデルT（T型フォード）」とし、日本で定着した呼び名を（）に添えた。q29～q31 に共通。
- r-pre1-2022-2-q35：giant fruit bats は「オオコウモリ」とした（日本語で定着した呼び名。直訳の「大きなフルーツコウモリ」ではない）。Musang King は「ムサンキング」とした。q35～q37 に共通。
- r-pre1-2022-2-q38：The Long Range Desert Group は日本で定着した「長距離砂漠挺身隊」、Special Air Service は「特殊空挺部隊（SAS）」とした（小学生には難しい語なので、直訳の「長距離砂漠部隊」にする案もある）。Major Ralph Bagnold は「ラルフ・バグノルド少佐」とした。q38～q41 に共通。
