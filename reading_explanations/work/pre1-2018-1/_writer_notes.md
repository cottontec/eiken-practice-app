# 作成メモ pre1-2018-1（分割10）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- すべての画像（大問1の25枚、長文は全ページ）を開いて、抽出テキストと照合した。抽出テキストの欠け：
  - cloze29 第2段落 glass objects—thought to be parts of weapons—found のダッシュ（—）が抜けていた。
  - reading32 第3段落 to the business district—a common practice のダッシュが抜けていた。
  - reading38 第1段落 The zoot suit—an oversized ～ fedora-style hat—was のダッシュが抜けていた。
  - chemical-free、d-limonene、African-American などのハイフンが特殊な文字になっていた（画像では普通のハイフン）。
  - いずれも画像どおりに読んで訳した。本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 41件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2018-1：written=41、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終える。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし、言いかえ・まとめ・推論でつながるものは「→」にした。
- 比較：q8 more of them は「実際よりも多くの生徒が」、q10 less boring は「前よりも退屈ではなくなった」、q17 twice as long ～ as it should は「本来かかるはずの時間の2倍」、reading32 less busy areas outside Manhattan's business district は「ビジネス街の外にある、ビジネス街ほど混んでいない地域」と、比べる相手が文中から分かるものだけ補った。
- reading38 第4段落 The zoot suit may have been as much a fashion as a political statement は「政治的な主張であったのと同じくらい、ファッションでもあったのかもしれない」と訳した（as much A as B ＝ Bであるのと同じくらいAでもある）。q41 の選択肢2の否定理由でもこの訳を使っている。
- brother（q13）は「兄（弟）」とした。

## 要確認
- r-pre1-2018-1-q26：Del Oro は「デル・オロ」とした（スペイン語の社名。冊子に読みなし）。d-limonene は「d-リモネン」とした。q26～q28 に共通。
- r-pre1-2018-1-q29：Rapa Nui は「ラパ・ヌイ」、moai は日本語で定着した「モアイ」とした。Carl Lipo は「カール・リポ」、Terry Hunt は「テリー・ハント」とした（冊子に読みなし）。q29～q31 に共通。
- r-pre1-2018-1-q32：Move NY は「ムーブ・NY」とした（冊子に読みなし。「ムーブNY」などの書き方もありうる）。John Lindsay は「ジョン・リンゼイ」とした。q32～q34 に共通。
- r-pre1-2018-1-q33：選択肢4の否定理由は、本文 some bridges into Manhattan remained toll-free（いくつかの橋は通行料がかからないままだった）を「すでにあった通行料をなくしたのではない」と読んだことにもとづく。正解1の判断には影響しない。
- r-pre1-2018-1-q35：Davis-Monthan Air Force Base は「デビスモンサン空軍基地」とした（「デービスモンサン」とも書く）。the "Boneyard" は「ボーンヤード（骨置き場）」とした。q35～q37 に共通。
- r-pre1-2018-1-q38：Octavio Paz は日本語で定着した「オクタビオ・パス」とした（「オクタヴィオ・パス」とも書く）。pachucos は「パチューコ」、zoot suit は「ズートスーツ」、fedora-style hat は「中折れ帽（フェドーラ型の帽子）」とした。q38～q41 に共通。
