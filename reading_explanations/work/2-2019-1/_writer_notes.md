# 2-2019-1 作成メモ（分割08）

## 作成数・疑義
- 作成数：38／38解答欄（大問1：20、大問2：6、大問3：12）。本文全訳ファイル5本（cloze21、cloze24、reading27、reading30、reading34）。
- 疑義：0件。全画像を開いて抽出テキストと照合。画像の切れ・読めない箇所はなし。
  - 抽出テキストとの差：cloze21 第1段落の「fossils—the remains」のダッシュが抽出テキストで抜けていた（画像どおりに訳した）。そのほかの選択肢・本文は画像と一致。

## 自力解答と正式解答の照合
- 38問すべて一致（_selfsolve.tsv）。selfSolveNote なし。

## 検査スクリプト
- build_and_check.py：written=38、errors=0、warnings=0。

## 要確認
- r-2-2019-1-q28：本文 want to get some writing experience（書く経験を積みたい）と選択肢 practical writing skills（実践的な書く力）は完全な同義ではないため、「＝」ではなく「→」で対応を示した。
- r-2-2019-1-q27：「書き手にお金を払っていない」は instead of hiring paid writers からの読み取りとして「→読み取れること」で示した。
- r-2-2019-1-q34：Unique Identification Authority of India の日本語名は定まった訳がないため「インド固有識別庁」とした（reading34 の全訳と q35～q38 で共通）。
- r-2-2019-1-q21：人名 Lida Xing を「リダ・シン（Lida Xing）」と表記した（cloze21 全訳）。
- r-2-2019-1-q15：不正解 on について、on -ing（～するとすぐに）の用法には触れず「原因の関係をはっきり表せない」と説明した。
