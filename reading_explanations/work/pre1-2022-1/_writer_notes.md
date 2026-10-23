# 作成メモ pre1-2022-1（分割11）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- すべての画像（大問1の25枚、長文は全ページ計8枚）を開いて、抽出テキストと照合した。抽出テキストの欠け・違い：
  - reading35 第4段落 "You should change things when they work—not when they don't work." のダッシュ（—）が抜けていた（抽出テキストは work not when）。画像どおりに読み、訳でも「――」を入れた。
  - q18 lesser-known、reading38 British-owned・present-day（選択肢3）のハイフンが特殊な文字（ソフトハイフン）になっていた。画像では普通のハイフン。
  - cloze26・reading32 の抽出テキストの先頭に、指示文の切れはし（find the number of the question ～）が入っていた。本文ではないので訳していない。
  - 本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 41件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2022-1：written=41、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問2は＜この空所の選択肢の意味＞を「番号 英語（意味）」、大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終え、引用の行は「英文（訳）」だけにした。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし、言いかえ・まとめ・推論でつながるものは「→」にした。
- 比較：q18 lesser-known は前の文の名門大学と比べているので「その大学より名の知られていない大学」、q21 fewer fatty foods and more fiber は「脂肪の多い食べ物を減らし、食物繊維を増やす」、cloze29 greater dopamine production は「より多くのドーパミンが作られる」、cloze29 第3段落 more practical は「～ほうが現実的」（相手は補わず、【考え方】で「屋外で3時間過ごすことと比べていると読める」と説明）、reading35 others were less serious は「そうした人たちほど真剣ではなかった」、fewer than 800 は「800より少ない数」、more than 25 people は「25人より多く」、reading38 British culture was superior は「イギリスの文化のほうがすぐれている」（相手は補わない）とした。
- reading35 Not all intentional communities are destined to fall apart は部分否定として「すべての意図的共同体がばらばらになる運命にあるわけではない」と訳した。
- reading38 q41 選択肢4（If the company had never been established, ～ would likely have ～）は「もし～されていなかったら、～していただろう」とし、「～としても」は使っていない。
- twin sister（q2）は「双子の姉（妹）」とした。

## 要確認
- r-pre1-2022-1-q8：more affluent customers を「（裕福な）客をもっと引きつける」（裕福な客の数を増やす）と読んだ。「より裕福な客」と読む余地もある。正解4の判断には影響しない。
- r-pre1-2022-1-q18：Gaspar は英語の読みに近い「ガスパー」とした（「ガスパール」とも書く。冊子に読みなし）。
- r-pre1-2022-1-q26：The Peter Principle は日本語で定着した「ピーターの法則」とした（q26～q28共通）。
- r-pre1-2022-1-q32：honey fungus は日本語の「ナラタケ」とし、本文全訳では「ナラタケ（英語では honey fungus）」と書いた。fruiting bodies は「子実体（キノコとして外に出てくる部分）」とした（q32～q34共通）。
- r-pre1-2022-1-q35：Damanhur は「ダマヌール」、Turin は日本語で定着した「トリノ」、kibbutzim は日本語で定着した「キブツ」とした。Foundation for Intentional Communities は「意図的共同体財団」、back-to-the-land movement は「『土地へ帰れ』運動」、constitution は共同体の決まりなので「憲章」とした（q35～q37共通）。
- r-pre1-2022-1-q38：Indian emperor は「インドの皇帝」、"divide and rule" は「分割統治」とした（q38～q41共通）。
