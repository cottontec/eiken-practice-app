# pre1-2016-1 作成メモ（分割番号 10・準1級・41解答欄）

## 作成数
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）
- 本文全訳ファイル：5（cloze26, cloze29, reading32, reading35, reading38）
- 疑義数：0（画像33枚すべて判読可能。切れている箇所なし）

## 画像と抽出テキストの照合
- 33枚の画像をすべて開き、本文・選択肢を抽出テキストと照合した。語句の食い違いはなし。
- 抽出テキストではダッシュが落ちていた（cloze26 の without cutting staff—its plan involves、cloze29 の the prey it catches—the insects simply remain、reading35 の women aged 25–34）。訳と引用は画像どおりダッシュを含む形で扱った。
- cloze29 の Heliothis phloxiphaga は画像では斜体（学名）。

## 自力解答と正式解答の照合
- 正答を見る前に画像で全41問を解き、_selfsolve.tsv に記録してから source.json の correct と照合した。
- 一致：41件／不一致：0件。selfSolveNote は不要。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2016-1：target=41 written=41 issue=0 missing=0 errors=0 warnings=0
- 残したWARN：なし。
- 字数：大問1は約2,100～3,000字（英語の再掲・選択肢の英語を含む）。大問3は本文全訳を含めても最大約10,300字（q36）で、12,000字の上限内。

## 粗探しで直した点
- q5：miss Earth by over 100,000 kilometers の訳を「10万キロメートル以上の差で地球に当たらずにそれる」とし、「離れたところを通り」という言い足しをやめた。
- q13：1 refugee の不正解理由を、決めつけ（「難民は大人と区別されない」）から「難民かどうかは大人かどうかとは関係がない」に直した。
- q23：1 touch up の説明から語法の言い切り（目的語が必要）を削った。
- q28：3 Otherwise の説明を、実際に入れたときに if the minimum wage is raised と食い違うことで示すように直した。「この問題の型」を指定の型（語の意味・組み合わせ）に直した。
- q32：選択肢3の訳を、that do not involve ～ が ways にかかる形で訳し直した。
- q33・q34・q36・q37・q41：意味が完全には同じでない本文と選択肢の対応を「＝」から「→」に改めた。
- q35 1・q38 3：「本文と反対」と言い切っていた不正解理由を、「本文にない」＋本文の実際の記述の形に改めた。
- 本文全訳で比較の相手を（　）で補った：cloze26 の hire as many workers「（今ほど）」、less motivation「（より高い賃金の人々より）」、cloze29 の twice as likely「（取り除かない場合と比べて）」、21 percent more likely「（空の容器と比べて）」、reading35 の much greater funding「（以前より）」、more chances / also higher「（ほかの州より）」、reading38 の twice as likely「（そうでない人と比べて）」、less extreme「（手術グループほど）」。

## 要確認
- r-pre1-2016-1-q29：植物名 serpentine columbine を「サーペンタイン・コロンバイン」とした（columbine は日本語では「オダマキ」。本文にない情報なので訳には入れていない）。trichomes は「トライコーム（毛状突起）」とした。q30・q31 も同じ全訳を使う。
- r-pre1-2016-1-q30：イモムシの学名 Heliothis phloxiphaga を英語のまま残し「（ヘリオティス・フロキシファガ）」と読みを添えた。学名の読みは定まっていないため確認してほしい。Eric LoPresti は「エリック・ロプレスティ」、University of California, Davis は「カリフォルニア大学デービス校」とした。
- r-pre1-2016-1-q33：Ulrich Boser を「ウルリッヒ・ボーザー」とした（英語読みでは「ボーザー／ボウザー」のどちらもありうる）。Munch Museum は定着した「ムンク美術館」とした。q32・q34 も同じ全訳を使う。
- r-pre1-2016-1-q34：Historical Society of Pennsylvania を「ペンシルベニア歴史協会」、nighttime janitor を「夜間の用務員（建物の清掃や管理をする人）」とした。
- r-pre1-2016-1-q35：Title IX を「タイトル・ナイン」とした（日本語では「教育改正法第9編」などと訳されることもある）。q36・q37 も同じ全訳を使う。
- r-pre1-2016-1-q36：Battle of the Sexes を「バトル・オブ・ザ・セクシーズ（男女の戦い）」とした。Billie Jean King「ビリー・ジーン・キング」、Bobby Riggs「ボビー・リッグス」は一般的な表記。
- r-pre1-2016-1-q37：Betsey Stevenson を「ベッツィー・スティーブンソン」とした。
- r-pre1-2016-1-q39：Dr. の訳し分け。外科学教授の Paul O'Brien は「ポール・オブライエン博士」、手術を批判する Edward Livingston は所属が書かれていないため「エドワード・リビングストン博士」、病院所属の David Haslam は「デイビッド・ハズラム医師」、研究センター所長の David Katz は「デイビッド・カッツ博士」とした。統一方針に合うか確認してほしい（q38・q40・q41 も同じ全訳）。
- r-pre1-2016-1-q41：Luton and Dunstable University Hospital を「ルートン・アンド・ダンスタブル大学病院」、Yale-Griffin Prevention Research Center を「イェール・グリフィン予防研究センター」とした。bariatric surgery は「肥満外科手術（体重を減らすための手術）」とした。
- r-pre1-2016-1-q3：Mr. Cruz を「クルーズさん」とした（スペイン語系の姓として「クルス」と書く例もある）。
- r-pre1-2016-1-q10：ma'am を「お客様」と訳した（店員が女性客に呼びかける丁寧な言い方。性別を訳に出さない形にした）。
- r-pre1-2016-1-q4：Ms. Klein は指示どおり「クラインさん」とした（原文に teacher の語はないが、her lessons / her students から授業をする人物）。
