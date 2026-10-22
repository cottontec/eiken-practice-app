# 作成メモ pre1-2024-2（分割12）

## 作成数・疑義
- 作成数：31／31解答欄（大問1：18、大問2：6、大問3：7）。本文全訳4本（cloze19・cloze22・reading25・reading28）。
- 疑義：0件。
- すべての画像（大問1の18枚、長文は全ページ）を開いて、抽出テキストと照合した。抽出テキストの欠け：
  - cloze19 第2段落 some ships—along with their crews—were lost のダッシュ（—）が抜けていた。
  - reading25 第2段落 three different aspects of mental ability—short-term memory, ～ のダッシュが抜けていた。
  - reading28 第4段落 older workers are more efficient—and therefore more productive—than ～ のダッシュが抜けていた。第2段落 seventy-five のハイフンが特殊な文字（ソフトハイフン）になっていた。
  - いずれも画像どおりに読んで訳した。本文・選択肢の語の欠けはなかった。

## 自力解答と正式解答の照合
- 正答を見る前に画像と正答抜きデータだけで全問を解き、_selfsolve.tsv に保存した。
- 一致 31件／不一致 0件（不一致の問題ID：なし）。selfSolveNote の記入はなし。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2024-2：written=31、errors=0、warnings=0。

## 書き方について
- 指示書の「6. 学習効果を上げる書き方」と「英語の再掲」に合わせた。大問1は（英文）（訳）、選択肢は「番号 英語：意味」を1行ずつ。大問3は設問・選択肢とも英語のあとに（訳）。【考え方】は「まず見るところ：」で始め、「この問題の型：」で終える。
- 本文と選択肢の対応は、意味が同じものだけ「＝」にし、言いかえ・まとめ・推論でつながるものは「→」にした。
- 【ほかの選択肢】で「本文と合いません」と書いたのは、本文に食いちがう記述がはっきりあるものだけ（q26の1：脳の異なる領域⇔1つの部分、q28の4：もともと予測のつもり⇔別の目的、q29の3：ノーベル賞受賞者の平均年齢も上がっている、q31の3：年配の働き手のほうが生産性が高い）。ほかは「本文に書かれていません」とした。
- 比較：cloze19 a less dangerous prospect ～ than it had been just a few decades earlier は「ほんの数十年前よりも」、reading28 seventy-five times more than it was in the early 1970s は「1970年代初めの約75倍」、more efficient ～ than their younger colleagues は「より若い同僚よりも」と、相手が文中にあるものは補った。相手が文中にない less chance（reading25）、more students（reading25）、take longer／less frequently／live longer（reading28）、less sophisticated（cloze22）は「より～」と訳した（cloze22は直前の文が今日の工事なので、【考え方】で今日と初期の比較として説明した）。
- 会話（q8・q9・q15）は性別を決めない語尾にした。q8の husband は原文どおり「ご主人」「夫」とした。

## 要確認
- r-pre1-2024-2-q25：Alfred Binet は日本語で定着した「アルフレッド・ビネー」、Binet-Simon test は「ビネー・シモン式テスト」とした（「ビネー・シモン式知能検査」とも。q25～q27共通）。gifted education programs は「ギフテッド教育プログラム」とし、（ ）で説明を付けた。ethnic minorities は「少数民族」とした。
- r-pre1-2024-2-q28：Gordon Moore は「ゴードン・ムーア」、Moore's law は「ムーアの法則」とした（定着した呼び名。q28～q31共通）。"burden of knowledge" は「知識の重荷」とした（定まった訳語があれば合わせたい）。
- r-pre1-2024-2-q22：the Metropolitan Railway は「メトロポリタン鉄道」、the London Underground subway system は「ロンドン地下鉄の路線網」とした（q22～q24共通）。
- r-pre1-2024-2-q19：Liberty ships は「リバティ船」とした（q19～q21共通）。
- r-pre1-2024-2-q6：A report を「報告」と訳した（報道の意味の可能性もあるが、原文からは決められないため）。
- r-pre1-2024-2-q14：Vikram は「ビクラム」、q17 Deepak は「ディーパック」、q3 Rashid は「ラシード」とした。
