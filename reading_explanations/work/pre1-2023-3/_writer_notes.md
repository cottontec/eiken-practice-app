# 作成メモ pre1-2023-3（分割12）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- すべての画像（大問1の25枚、長文は全ページ）を開いて、抽出テキストと照合した。抽出テキストの欠け：
  - cloze26 第2段落 over a long period—often due to overconsumption—cause のダッシュ（—）が抜けていた。
  - reading35 第2段落 Simon won—prices of the metals fell のダッシュが抜けていた。
  - reading38 working-class、self-assessment、two-thirds、well-being のハイフンが特殊な文字になっていた（画像では普通のハイフン）。
  - reading38 は抽出テキストでは While these attempts ～ が行頭から始まっているが、画像では字下げがなく第1段落の続きである（第1段落の最後は meritocracy can often be manipulated）。段落は画像どおり4段落として訳した。
  - いずれも画像どおりに読んで訳した。本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 41件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2023-3：written=41、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終える。英文の引用は「英文（訳）」だけの行にした。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし（q33 a Confederate ship ＝ a ship that was used by the Confederates、q39 bias ＝ prejudices）、言いかえ・推論でつながるものは「→」にした。
- 【ほかの選択肢】は、本文にないだけのものは「本文に書かれていません」とし、本文に反する記述がはっきりあるもの（q32-3 was unable to raise enough money、q39-1 awarded larger amounts to males、q40-1 must work with crushing intensity、q41-4 just one-third など）だけ「本文と合いません」とした。
- 比較：reading35 far more familiar は「エーリックの側の主張のほうが、一般の人々にはるかによく知られていた」（次の文の his side〈サイモンの側〉と比べていることが分かるため「～のほうが」とした）、on a longer timescale は「より長い期間でみれば」、reading32 would be safer there は「そこでならより安全だろう」（比べる相手は補わなかった）、cloze29 more likely to be consumed は「より食べられやすかった」、reading38 more accessible は「より入りやすいもの」、more likely to show bias は「より偏見を示しやすくなる」、awarded larger amounts to males than they did to females は「業績評価がまったく同じ女性に対してよりも、男性に対して多くの額を与えた」とした。
- q7 は原文が the town なので mayor を「町長」とした。
- reading32 第3段落 If they managed this, they still risked ～ は、「～としても」を足さずに still を生かして「これをうまくやりとげても、まだ～危険があった」とした。

## 要確認
- r-pre1-2023-3-q8：Kiernan は「キーナン」とした（「キアナン」とも書ける。冊子に読みなし）。
- r-pre1-2023-3-q26：Grizzly bears は「グリズリー（ハイイログマ）」とした。20,000 calories は原文どおり「約2万カロリー」とした（日本語では「2万キロカロリー」と書くのがふつう）。q26～q28 に共通。
- r-pre1-2023-3-q29：argonaut octopus は日本語で定着した名前「アオイガイ（タコの仲間）」とした（「アルゴノート」「カイダコ」とも）。Adolf Naef は「アドルフ・ネフ」とした（スイスの動物学者で「ネーフ」とも書ける。冊子に読みなし）。q29～q31 に共通。
- r-pre1-2023-3-q30：maintain their vertical positions in the ocean を「海の中での上下の位置を保つ」と訳した（「縦向きの姿勢を保つ」と読む余地もある。正解3の判断には影響しない）。
- r-pre1-2023-3-q32：Robert Smalls は「ロバート・スモールズ」、Charleston は「チャールストン」とした。Union は日本語で定着した「北軍（合衆国の軍）」、Confederate States は「南部連合国」、Union Navy は「北軍の海軍」とした。q32～q34 に共通。
- r-pre1-2023-3-q35：Paul Ehrlich は「ポール・エーリック」とした（「エーリッヒ」とも書く）。Julian Simon は「ジュリアン・サイモン」とした。q35～q37 に共通。
- r-pre1-2023-3-q38：Daniel Markovits は「ダニエル・マルコビッツ」とした（「マルコヴィッツ」とも書く）。"leisure class" は「有閑階級」とし、（）で意味を説明した。q38～q41 に共通。
