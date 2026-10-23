# 作成メモ pre1-2016-3（分割10）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文の全訳ファイル5本（cloze26、cloze29、reading32、reading35、reading38）。
- 疑義：0件。
- 全画像（大問1の25枚、長文7枚）を開いて本文・選択肢を照合した。抽出テキストは画像と一致していたが、ダッシュ（—）が抜けて空白になっている箇所があった（cloze26の ago—a time／equivalents—for example、cloze29の error—failing、reading35の River—a natural border ... control—had、reading38の foods—only、fats—a type ... fish—was）。全訳・引用は画像に合わせた。

## 自力解答と正式解答の照合
- 41問中41問一致。不一致なし（selfSolveNote なし）。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2016-3：target=41 written=41 issue=0 missing=0 errors=0 warnings=0。残したWARNなし。

## 粗探しで直した主な点
- q15：when を「ため」と因果で訳していたのを「～を発見したとき」に直した。
- q17・q21・q27・q31：本文にない推論や断定（「そのため緊急着陸」「家を離れて」「生態系を元に近づけようと考えていた」など）を外すか「考えられます」「読み取れます」にした。
- reading32 全訳：原文にない「も」（若い人々も）を削った。
- q33：social media ＝ technological advances を「＝」で結んでいたのを「→」（具体例とまとめ）にした。
- 大問1・2・3：英文を文中に埋めこんでいた引用を、「英文（訳）」だけの行に分けた。

## 要確認
- r-pre1-2016-3-q25：Paulo を「パウロ」とした（ポルトガル語系の名前で日本語ではパウロが定着。英語読みなら「ポーロ」に近い）。
- r-pre1-2016-3-q34：Deventer（オランダ）を「デーフェンテル」とした（オランダ語読み。日本語の表記には「デフェンター」「デーベンター」など揺れがある）。Karlsruhe は日本語で定着した「カールスルーエ」、Tartu は「タルトゥ」とした（reading32 全訳、q32～q34 共通）。
- r-pre1-2016-3-q35：Isla Portillos を「イスラ・ポルティージョス」とした（スペイン語の地名。「ポルティーヨス」「ポルティジョス」の表記もありうる）。San Juan River は「サンフアン川」（reading35 全訳、q35～q37 共通）。
- r-pre1-2016-3-q29：Herminia Ibarra を「ハーミニア・イバーラ」、Victoria Brescoll を「ビクトリア・ブレスコル」とした（cloze29 全訳、q29～q31 共通）。
- r-pre1-2016-3-q26：Pleistocene epoch を「更新世（地球の歴史の時代区分の一つ）」と訳し、（）で補足した。全訳の「（ふつうの再野生化よりも）さらに議論を呼ぶ考え」は、more controversial の比較の相手を第1段落の再野生化と判断して補った（q26～q28 共通）。
- r-pre1-2016-3-q30：全訳で比較の相手を補った（far more critical of the female police chiefs and male college presidents →「（男性の警察署長や女性の学長に対してよりも）」、a more serious problem for women →「（男性よりも）」、better suited →「（女性より）」、more experience →「（女性より）」）。前後の文から相手が明らかと判断した（q29～q31 共通）。
- r-pre1-2016-3-q38：red meat を「赤肉（牛や羊などの肉）」とした。reading38 全訳の less easily explained には「（壊血病の場合ほど）」と比較の相手を補った（q38～q41 共通）。
