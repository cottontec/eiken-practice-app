# pre1-2025-3 作成メモ（分割番号 12・準1級・31解答欄）

## 作成数
- 作成数：31／31解答欄（大問1：18、大問2：6、大問3：7）
- 本文全訳ファイル：4（cloze19, cloze22, reading25, reading28）
- 疑義数：0（画像24枚すべて判読でき、切れている箇所はない）

## 画像と抽出テキストの照合
- 画像24枚をすべて開いて、本文・設問・選択肢を抽出テキストと照合した。語句の食い違いはなかった。
- 抽出テキストではダッシュ（—）が抜けていた。cloze22 の smuggling—an illegal trade ～、duties—a kind of tax—on ～、reading28 の flyers—printed not only ～ workers—were distributed、mayor—there to ensure ～、employees—often poor immigrants—to sign ～。引用と訳は画像どおりダッシュを入れた形で扱った。
- 抽出テキストの German­speaking・pro­worker・profit­seeking・well­known は、画像ではふつうのハイフン（German-speaking など）。
- reading25 と reading28 のタイトルは画像では斜体。

## 自力解答と正式解答の照合
- 正答を見る前に、画像を使って全31問を解き、_selfsolve.tsv に保存した。そのあとで source.json の correct と照合した。
- 一致31件／不一致0件。selfSolveNote は不要。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2025-3：target=31 written=31 issue=0 missing=0 errors=0 warnings=0
- WARN は出ておらず、残したものはない。

## 粗探しで直した点
- q5：和訳で「小説」が重なっていたのを直し、to make it more dramatic の it（小説）が分かる形にした。
- q17・q18：【ほかの選択肢】で使っていた細かい語法の説明（後ろに置く語の形）を消し、文に入れたときの意味で説明した。
- q20：選択肢1の that の指す内容を「考えられる」に弱めた。
- q25：【覚えるポイント】の「段落の結論は so のあとに書かれていることが多い」という根拠のない一般化を、本文の流れに沿った説明に直した。
- q27：「むしろ」を消した。
- cloze22：It could also be dangerous. の also を訳に入れた。instances of officials being killed に原文にない「も」を足していたのを消した。
- reading25：原文にない（注）を付けていたのを消し、誘導抵抗性の説明は本文中の（　）に移した。
- reading28：contributed to を「つながった」から「貢献した」に直した。what they saw as ～ の訳を、かぎかっこを使わない形に直した。
- 比べる相手を（　）で補った箇所：reading28 の less politically oriented「（それらより）」（同じ文の過激な団体・社会主義の団体と比べている）。cloze19 の their wealthier peers は their（低所得の子どもたち自身）が同じ文にあるので「自分たちより裕福な」とした。そのほかの比較（cloze19 の better prepared・wealthier parents・more effective、cloze22 の more decisive・much less appealing、reading28 の longer working days など）は補わずに「より～」とした。

## 要確認
- r-pre1-2025-3-q13：New Croix City は架空の都市名と思われる。Croix をフランス語風の「クロワ」ではなく、英語の読み（St. Croix ＝ セントクロイ）に合わせて「ニュー・クロイ市」とした。
- r-pre1-2025-3-q29：William J. Adelman を「ウィリアム・J・アデルマン」とした（「エーデルマン」とも書ける）。q28・q30・q31 も同じ全訳を使う。
- r-pre1-2025-3-q29：reading28 の longer working days は、前の文の limit working hours to eight a day から「1日8時間より長い」と読めるが、補いは控えて「より長い1日の労働時間」とした。補ってよいか確認してほしい（q28・q30・q31 も同じ全訳を使う）。
- r-pre1-2025-3-q15：the couple を、子どもたちと一緒にいるので「その夫婦」とした。q3 の the couple は手がかりがないので「その二人」とした。
- r-pre1-2025-3-q29：mills を「製粉・紡績工場」とした（第2段落 factories, shipyards, and mills）。q28・q30・q31 も同じ全訳を使う。
