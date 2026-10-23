# 作成メモ pre1-2021-3（分割11）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- すべての画像（大問1の25枚、長文は全ページ）を開いて、抽出テキストと照合した。抽出テキストの欠け：
  - cloze26 第1段落 donor premiums—small gifts such as coffee mugs—to people のダッシュ（—）2つが抜けていた。
  - reading38 第1段落 mummification—the process ～、bitumen—a black, petroleum-based substance ～、第3段落 disrespectful—one well-known British painter ～ のダッシュが抜けていた。
  - reading38 の petroleum-based、mummy-based、ground-up、well-known などのハイフンが特殊な文字になっていた（画像では普通のハイフン）。
  - いずれも画像どおりに読んで訳した。本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 41件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2021-3：written=41、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終える。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし、言いかえ・まとめ・推論でつながるものは「→」にした。
- 比較：q15 more disappointed は、直前の「窓を割ったときに腹を立てた」を相手として「それよりもがっかりしたのは」とした。cloze26 give more／less fortunate／less likely は相手を補わず「より多く」「より恵まれない」「より低く」とした。responded better ～ when they did not expect them は「予想していなかったときのほうが」とした（直後の On the other hand の文で比べる相手が分かるため）。cloze29 stricter government regulation は「より厳しい政府の規制」、reading32 a position higher than theirs は「彼らの地位よりも高い地位」、reading38 more critics than fans は「好む人よりも批判する人のほうが多かった」。
- reading38 第4段落 could not always be certain は部分否定（いつも確信できるわけではなかった）として訳した。
- Ms. Pereira・Mrs. Wilson は「～さん」とした。Professor Markham は「マーカム教授」（原文に Professor があるため）。

## 要確認
- r-pre1-2021-3-q8：her brother's room の brother は、赤ちゃんのきょうだいなので兄と考えるのが自然だが、指示書どおり和訳では「兄（弟）」とし、【考え方】で一言説明した。
- r-pre1-2021-3-q6：Pereira は「ペレイラ」とした（冊子に読みなし）。guidance counselor は「進路指導カウンセラー」とした。
- r-pre1-2021-3-q13：Markham は「マーカム」とした（冊子に読みなし）。
- r-pre1-2021-3-q29：operating speed method は「運行速度方式」とした（定まった日本語訳が分からない。「実勢速度方式」などの言い方もありうる）。q29～q31 に共通。
- r-pre1-2021-3-q32：Caligula は日本語で定着した「カリグラ」、Roman Senate は「元老院」、Incitatus は「インキタトゥス」とした（冊子に読みなし。ラテン語読み）。q32～q34 に共通。
- r-pre1-2021-3-q35：George V. Higgins は「ジョージ・V・ヒギンズ」、作品名 The Friends of Eddie Coyle は『エディ・コイルの友人たち』とした（日本で定着した邦題があるかは未確認）。q35～q37 に共通。
- r-pre1-2021-3-q38：bitumen は「ビチューメン」（瀝青〈れきせい〉とも訳される）、mummy brown は「マミー・ブラウン」、Napoleon Bonaparte は「ナポレオン・ボナパルト」とした。q38～q41 に共通。
- r-pre1-2021-3-q41：本文の little consistency（一貫性がない）は製造業者の違いについての文にあり、選択肢2はミイラ作りの工程の変化と「中身が一定でない」を結んでいる。【考え方】では、工程の変化からも中身がそろわなくなると「考えられる」とし、どちらも These same factors にまとめられている点を根拠にした。正解2の判断には影響しない。
