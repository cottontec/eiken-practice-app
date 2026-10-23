# 作成メモ pre1-2021-2（分割11）

## 作成数・疑義
- 作成：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文全訳5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。

## 自力解答と正式解答の照合
- 正答を見る前に、blind データと全画像（reading/ 内の全33枚）で全41問を解き、_selfsolve.tsv に保存した。
- 正式解答との照合：41問すべて一致（不一致0件）。selfSolveNote なし。

## 画像との照合
- 抽出テキストは、長文の em ダッシュ（—）が抜けていた（cloze26 の “Seven Wonders of the Ancient World”—the Pyramids of Giza, in Egypt—survives／reading38 の his time may be limited—he became king）。全訳・引用は画像どおりダッシュのある形で扱った。
- q7 の CO2 は画像では下付きの 2（抽出テキストでは「CO」と「2」が別の行）。英文では CO2 と書いた。
- そのほかの本文・選択肢は画像と一致。choices / answerText は画像どおり（アポストロフィは ’ を使用）。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2021-2：target=41 written=41 issue=0 errors=0 warnings=0。残した WARN はなし。
- 追加で、解説中の英文引用が原文の語順どおりかをスクリプトで照合し、選択肢の語順を変えていた引用（q36 の not only was he ～、q37 の no better or worse as a ruler than ～）を原文どおりに直した。

## 要確認
- r-pre1-2021-2-q38：Jayavarman VII を「ジャヤーヴァルマン7世」とした（日本の歴史の教科書などで定着した表記。英語読みに近い「ジャヤバルマン」とする書き方もある）。Cham people は「チャム人」とし、Cham invasion も「チャム人の侵攻」でそろえた。Khmer は「クメール」、Angkor は「アンコール」。q39～q41 も同じ。
- r-pre1-2021-2-q38：全訳の warlords を「武将たち（武力で土地を支配する者たち）」、monsoons を「モンスーン（季節風がもたらす大雨）」とした。
- r-pre1-2021-2-q38：正解2の other leaders in the region と本文 his allies の対応は、同じ段落の alliances of powerful local warlords から「味方もこの地域で力を持つ者たちだったと考えられる」と推論として説明した。
- r-pre1-2021-2-q35：History of King Richard III を『リチャード3世史』とした（日本語では『リチャード三世史』とも）。Leicester は「レスター」、Shakespeare は「シェークスピア」（「シェイクスピア」とも）、Thomas More は「トマス・モア」。q36・q37 も同じ。
- r-pre1-2021-2-q35：本文の his brother を「兄（弟）」とした（本文から年上か年下か分からないため）。選択肢4の his brother も同じ。
- r-pre1-2021-2-q37：Cardinal Vincent Nichols, archbishop of Westminster を「ウェストミンスター大司教のヴィンセント・ニコルズ枢機卿（キリスト教の教会の高い位の聖職者）」とした。「ビンセント」とする書き方もある。
- r-pre1-2021-2-q26：Nebuchadnezzar II を「ネブカドネザル2世」、Sennacherib を「センナケリブ」、Nineveh を「ニネベ」（「ニネヴェ」とも）、Stephanie Dalley を「ステファニー・ダリー」とした。“Seven Wonders of the Ancient World” は「古代世界の七不思議」と訳した。300 miles に（約480キロメートル）を補った。q27・q28 も同じ。
- r-pre1-2021-2-q27：全訳の Without any firsthand records of the gardens’ construction, archaeologists have been unable to ～ を、原因を言い切らないように「直接の記録がまったくない状態で、～見つけられずにいる」と訳した。
- r-pre1-2021-2-q29：aquaculture, also known as fish farming を「魚の養殖とも呼ばれる水産養殖」とした。全訳の more easily replaceable one は比べる相手を補わず「より簡単に代わりを用意できる別の資源」、greater overall energy consumption は「エネルギー全体の消費がより大きくなる」、smaller fish は「より小さな魚」とした。q30・q31 も同じ。
- r-pre1-2021-2-q32：全訳の the younger generation became less likely to follow family traditions を「家族の伝統に従う傾向が以前より弱くなり」とした（became から比べる相手は以前と判断）。q33・q34 も同じ。
- r-pre1-2021-2-q32：全訳の open their wallets を「お金を出す（原文では「財布を開く」）」とした。single-malt whiskeys は説明を足さず「シングルモルト・ウイスキー」とした。
- r-pre1-2021-2-q13：Stephano を「ステファノ」とした。
- r-pre1-2021-2-q3：雑誌名 Nature Lover を『ネイチャー・ラバー』誌とした。
- r-pre1-2021-2-q25：full-time job を「フルタイムの仕事」とし、「正社員」とはしなかった。
