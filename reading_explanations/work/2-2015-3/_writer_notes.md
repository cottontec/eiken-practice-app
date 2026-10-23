# 作成メモ 2-2015-3（分割08・2級・50解答欄）

## 作成数・疑義
- 作成数：50／50解答欄（大問1：20、大問4：10（5問×2番目・4番目）、大問2：8、大問3：12）
- 本文全訳：5本（r-2-2015-3-cloze26 / cloze30 / reading34 / reading37 / reading41 の .passage.txt）
- 疑義：0件

## 自力解答と正式解答
- 正答抜きデータと画像（q1～q20、order21～25、cloze26、cloze30、reading34、reading37 2枚、reading41 2枚）で全問を解き、正式解答と50件すべて一致。selfSolveNote はなし。
- 抽出テキストは全画像と照合し、本文・選択肢に食い違いなし。

## 検査スクリプト
- build_and_check.py --part 08 --batch 2-2015-3：target=50 written=50 errors=0 warnings=0（残したWARNなし）

## 粗探しで直した主な点
- q6：When ～ を「～ので」と因果で訳していたのを「～とき」に修正
- q30：本文にない背景知識（望遠鏡）を不正解理由から削除
- q41：often → regularly の言いかえで「いつも」と程度を強めていたのを「くり返し」に修正
- q38・q44：意味が完全には同じでない対応（not very good at ↔ bad at、trusts them to make the best decisions ↔ trusts the abilities）を「＝」から「→」に変更
- q34・q36・q43：段落内の文の位置の書き方を正確に修正
- reading37 全訳：the whole group flew more directly の比較の相手（年上の鳥がいないときより）を（）で明示
- reading41 全訳：not required to do much homework を「それほど」でなく「あまり多くの」と訳出

## 要確認
- r-2-2015-3-q34：全訳（reading34）の if any are available を「もしどなたかご都合がつくようでしたら」と、any を agents（担当者）と取って訳した。homes（見学できる家）と取る読み方も考えられる（q36 の【考え方】の引用訳も同じ）
- r-2-2015-3-q38：団体名 Whooping Crane Eastern Partnership を「アメリカシロヅル東部パートナーシップ」と訳し、英語名を（）で併記した（q37～q40 と reading37 全訳で共通）。表記の方針があれば差し替えが必要
- r-2-2015-3-q19：was to be seen を「be to ＋ 動詞の元の形」の可能の意味（否定と組んで「～されることができない」）として説明した。用法を1つに言い切らないよう「いくつかの意味がある」と添えたが、説明の深さは点検で確認してほしい
