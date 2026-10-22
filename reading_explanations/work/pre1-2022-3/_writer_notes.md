# 作成メモ pre1-2022-3（分割11・準1級 2022年度第3回）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳ファイル5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- 全画像（短文25枚・長文8枚）を開いて抽出テキストと照合した。抽出テキストではダッシュ（—）が抜けていた（reading32 の generalist species—those ～—have、months—or even years—later、cloze29 の on the ground—exactly）ので、引用は画像どおりダッシュを入れた。それ以外の語・選択肢の欠けや食い違いはなかった。

## 自力解答と正式解答
- 正答を見る前に画像だけで全41問を解き、_selfsolve.tsv に保存した。正式解答と41問すべて一致（不一致0件）。selfSolveNote なし。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2022-3：target=41 written=41 issue=0 errors=0 warnings=0。
- 大問1の（英文）は、add_english.py と同じ方法で抽出テキストから作る文と25問すべて完全に一致することを確かめた。

## 書き方で判断したこと
- 指示書6（まず見るところ／この問題の型／引用のあとの改行／選択肢ごとの改行／英語の再掲）を全ファイルに適用した。短文で「1文目／2文目」は使わず、「空所のあとの文」「最初の文」などで示した。
- 比較の相手：reading35 の far less densely populated は同じ文の El Salvador が相手なので「人口密度はエルサルバドルよりもはるかに低い」とした。reading38 第3段落の Braille, though, could more efficiently and clearly display ～ は直前の文の New York Point が相手なので「（ニューヨーク・ポイントよりも）」と（）で補った。reading38 第1段落 more challenging ～ than they did with Braille は原文どおり「ブライユ点字の場合よりも」。cloze26 の better opportunities、reading32 の a more fundamental change、q8 の more vegetables、q15 の faster / better は相手を補わず「より～」とした。
- q16 her brother は「兄（弟）」とし、【考え方】で理由を説明した。
- Braille は、本文でニューヨーク・ポイントなどほかの「点の体系」と比べられているため、「点字」だけだと区別がつかないので、全体を「ブライユ点字」で統一した。
- 【ほかの選択肢】で「本文の内容と合いません」としたのは、本文に反対の記述がはっきりあるもの（q30-2、q36-2、q38-2、q39-3、q39-4、q41-1）だけで、ほかは「本文に書かれていません」とした。

## 要確認
- r-pre1-2022-3-q26：San Jose を「サンノゼ」とした（日本語で定着した表記）。giant snakehead は「ジャイアント・スネークヘッド」とした（ライギョの仲間の魚。和名で呼ぶかの確認）。q27・q28 も同じ本文。
- r-pre1-2022-3-q30：Aristolochia microstoma を「アリストロキア・ミクロストマ」とした（学名。ウマノスズクサ属の植物で、日本語の定着した呼び名は未確認）。female part of that plant は「雌の部分（めしべ）」と訳した。q29・q31 も同じ本文。
- r-pre1-2022-3-q31：（31）の this theory を、直前の「この植物はハエをねらうように進化した」という研究者の考えと解釈した。
- r-pre1-2022-3-q32：journal BioScience を「『バイオサイエンス』という専門誌」とした。generalist species / specialist species は「ジェネラリスト種」「スペシャリスト種」とカタカナにした（「万能種」「特殊種」などとする訳もありうる）。q33・q34 も同じ本文。
- r-pre1-2022-3-q33：wildebeest を「ヌー」とした。
- r-pre1-2022-3-q35：the press を「報道機関」、cut off relations を「国交を断ち」と訳した。q36・q37 も同じ本文。
- r-pre1-2022-3-q38：Samuel Gridley Howe を「サミュエル・グリドリー・ハウ」、Boston Line Type を「ボストン・ライン・タイプ」、New York Point を「ニューヨーク・ポイント」、the War of the Dots を「点の戦争」とした。instructor は「指導者」と訳した。q39～q41 も同じ本文。
- r-pre1-2022-3-q14：artifacts を「人工遺物」と訳し、（昔の人が作った物）と説明した。
