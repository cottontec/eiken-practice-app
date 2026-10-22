# 作成メモ pre1-2023-1（分割11）

## 作成数・疑義
- 作成：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。

## 自力解答と正式解答の照合
- 正答を見る前に、blind データと全画像（reading/ 内の全33枚：大問1の25枚、大問2の2枚、大問3の6枚）で全41問を解き、_selfsolve.tsv に保存した。
- 正式解答との照合：41問すべて一致（不一致0件）。selfSolveNote なし。

## 画像との照合
- 抽出テキストは、reading32 の em ダッシュ（—）が2か所抜けていた（local conditions—whether it was suited ～／by themselves—a development that ～）。画像に合わせ、全訳・引用はダッシュのある原文どおりに扱った。
- 抽出テキストでは well-being・66-million-year-old・soft-shelled・hard-shelled・self-proclaimed のハイフンが見えないソフトハイフン（U+00AD）になっていた。引用では通常のハイフンで書いた。
- そのほかの本文・設問・選択肢は画像と一致。choices / answerText は画像どおり（アポストロフィは抽出テキストと同じ ’）。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2023-1：target=41 written=41 issue=0 errors=0 warnings=0。残した WARN はなし。
- 追加で、解説中の英文引用（4語以上）が原文の語順どおりかをスクリプトで照合し、短縮していた引用（q32・q34・q35 の3か所）を原文どおりに直した。残った不一致は「disclose A to B」「hand over A to B」などの語法の型の表示と、正解を入れた完成文の一部だけ。

## 要確認
- r-pre1-2023-1-q3：presidential debate を「大統領選挙の討論会」と訳した（candidates・debate から判断。会長選などの可能性は低いと考えた）。
- r-pre1-2023-1-q8：Greenville United を「グリーンビル・ユナイテッド」とした。
- r-pre1-2023-1-q20：Pieter を「ピーター」とした（オランダ語風の名前で、「ピーテル」と書くこともある）。
- r-pre1-2023-1-q29：The Thing を「ザ・シング」とし、タイトルの訳に「（「例の物」という意味の呼び名）」と添えた。mosasaur は「モササウルス」。q30・q31 と全訳も同じ。
- r-pre1-2023-1-q29：全訳（cloze29）の much less likely to be preserved は、比べる相手を補わず「残る可能性がずっと低い」とした（softer materials から相手はかたい物質と読めるが、原文に明示がないため）。
- r-pre1-2023-1-q34：正解の3は、本文で according to animal rights activists（動物の権利を守る活動家によれば）として書かれている内容を言い切った形になっている。解説ではその点を一言添えた。
- r-pre1-2023-1-q35：B. F. Skinner を「B・F・スキナー」、Ross Greene を「ロス・グリーン」、prefrontal cortex を「前頭前皮質」とした（「前頭前野」とも呼ぶ）。q36・q37 と全訳も同じ。全訳の may be less developed in students with behavioral problems は、比べる相手を補わず「発達の程度がより低い可能性がある」とした。
- r-pre1-2023-1-q36：正解の3（prevent them from developing important skills）は、本文の rather than understanding the importance of gaining ～ と、前の文の delay or prevent their development（Similarly で結ばれる）を合わせて読み取る形なので、解説では「→」と「推論」で示し、＝にはしなかった。
- r-pre1-2023-1-q38：Robert the Bruce を「ロバート・ザ・ブルース」（スコットランド王ロバート1世）、John Balliol を「ジョン・ベイリャル」（「ベイリオル」とも）、Alexander III を「アレグザンダー3世」（「アレクサンダー3世」とも）、Edward I を「エドワード1世」、the Declaration of Arbroath を「アーブロース宣言」、the Pope を「ローマ教皇」とした。q39～q41 と全訳も同じ。
- r-pre1-2023-1-q39：closest rival to the throne を「王位をめぐる最も有力なライバル」と訳した（closest を「王位にいちばん近い」の意味と判断）。
