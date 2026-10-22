# pre1-2015-1 作成メモ（分割番号 10・準1級・41解答欄）

## 作成数
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）
- 本文全訳ファイル：5（cloze26, cloze29, reading32, reading35, reading38）
- 疑義数：0（画像33枚すべて判読可能。切れている箇所なし）

## 画像と抽出テキストの照合
- 33枚の画像をすべて開き、本文・選択肢を抽出テキストと照合した。語の食い違いはなし。
- 抽出テキストで落ちていた・崩れていた箇所は画像から起こした。
  - reading35（textVerified=false）：斜体の作品名 Body Worlds が (cid:..) の文字化けになっていた。画像で Body Worlds と確認し、q35 の choices・設問も画像どおりにした。
  - reading38：ダッシュが抽出テキストで落ちていた（young people—many from elite institutions—to spend、high achievers—who are, it should be noted, not trained as professional teachers—in struggling classrooms、2013–2014）。訳と q39 の引用は画像どおりダッシュを含む文として扱った。

## 自力解答と正式解答の照合
- 正答を見る前に画像で全41問を解き、_selfsolve.tsv に記録してから source.json の correct と照合した。
- 一致：41件／不一致：0件。selfSolveNote は不要。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2015-1：target=41 written=41 issue=0 missing=0 errors=0 warnings=0
- 残したWARN：なし。
- 字数：大問1は約990～1,320字。大問2は本文全訳を除いて約1,350～1,730字。大問3は本文全訳を除いて約2,270～2,890字（設問・選択肢の英語の再掲と訳を含むため、目安の1,800字を超える）。いずれも本文全訳を入れても12,000字の上限内。

## 粗探しで直した点
- q1・q5・q6：【覚えるポイント】で本文・選択肢にない英語（prey、tooth decay、clerk）を出していたので削除し、日本語の説明に替えた。
- q19：4 endorsed の否定理由を、細かい語法（to ～ を続けない）ではなく「秘密の計画が報道機関に支持された、では秘密が外に出た話にならない」という文の意味に即した説明に直した。
- q36：「博物館に保管するには山から博物館へ移すことになる」という断定を、「～を支持する考えだと読み取れる」に弱めた。
- q39：【考え方】で ... で省略して説明文に混ぜていた引用を、原文どおりの1行（英文（訳））に分けた。
- q41：正解の訳「経歴と知性だけでは」の「だけ」は原文にないので削除した。研究結果の説明「1年目の教師の生徒より成績がよくなかった」を、no better than に合わせて「比べて少しもよくなく」に直した。
- reading38（本文全訳）：「政策によって、～増やすことに成功した」の主語のねじれを「政策は～増やすことに成功した」に直した。
- cloze26（本文全訳）：easier for humans to control の比較が訳に出ていなかったので「人間にとってより扱いやすくなる」とした（q27 の引用の訳も同じに直した）。

## 要確認
- r-pre1-2015-1-q26：活動家 Sangduen Chailert を「サンドゥエン・チャイラート」とした。日本では愛称の「レック・チャイラート」でも知られている。q27・q28 も同じ全訳を使う。
- r-pre1-2015-1-q27：選択肢1 are considered easier to train、3 are found in fewer places の比較の相手を、直前の文に合わせて「（犬や馬より）」と補った。補い方が適切か確認してほしい。
- r-pre1-2015-1-q29：Trout Creek を「トラウト・クリーク（クリークは「小川」の意味）」、Hemlock Dam を「ヘムロック・ダム」、U.S. Forest Service を「アメリカ森林局」とした。q30・q31 も同じ全訳を使う。
- r-pre1-2015-1-q32：David Lusseau を「デビッド・ルソー」、Faxaflói Bay を「ファクサフロイ湾」、Doubtful Sound を「ダウトフル・サウンド」とした（Lusseau はフランス系の姓で読みが定まらない）。q33・q34 も同じ全訳を使う。
- r-pre1-2015-1-q35：展示名 Body Worlds を「ボディ・ワールド（Body Worlds）」とした。日本での展示名・表記が別にあれば合わせてほしい。q36・q37 も同じ全訳を使う。
- r-pre1-2015-1-q36：Llullaillaco を「ユーヤイヤコ（山）」、Rogelio Guanuco を「ロヘリオ・グアヌコ」、Johan Reinhard を「ヨハン・ラインハルト」、The Indigenous Association of Argentina を「アルゼンチン先住民協会」とした（スペイン語の読みに寄せた）。q35・q37 も同じ全訳を使う。
- r-pre1-2015-1-q38：National Commission on Excellence in Education を「教育の卓越性に関する国家委員会」とした（日本語で定着した訳名が別にあれば合わせてほしい）。q39～q41 も同じ全訳を使う。
- r-pre1-2015-1-q40：Richard Kahlenberg を「リチャード・カーレンバーグ」とした。本文の one of the most important factors（最も重要な要因の一つ）と正解選択肢の show the most progress（最も伸びる）は完全に同じ意味ではないため、【考え方】では「→」で結び、ほかの選択肢との比較で3に決まると説明した。
- r-pre1-2015-1-q38：本文全訳で With their weaker students を「比較的学力の低い生徒」、children who are less fortunate を「（その人たちより）恵まれない子どもたち」とし、比較の相手が原文に明示されない比較級をこの形で訳した。q39～q41 も同じ全訳を使う。
- r-pre1-2015-1-q41：Deborah Appleman を「デボラ・アップルマン」、Carleton College を「カールトン大学」とした。
