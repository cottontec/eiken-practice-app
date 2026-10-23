# 作成メモ pre1-2017-3（分割10・準1級 2017年度第3回）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。本文全訳ファイル5本（cloze26・cloze29・reading32・reading35・reading38）。
- 疑義：0件。
- 全画像（短文25枚・長文8枚）を開いて抽出テキストと照合した。本文・選択肢に欠けや食い違いはなかった。

## 自力解答と正式解答
- 正答を見る前に画像だけで全41問を解き、_selfsolve.tsv に保存した。正式解答と41問すべて一致（不一致0件）。selfSolveNote なし。

## 検査スクリプト
- build_and_check.py --part 10 --batch pre1-2017-3：target=41 written=41 issue=0 errors=0 warnings=0。
- 大問1の（英文）は、add_english.py と同じ方法で抽出テキストから作る文と25問すべて完全に一致することを確かめた。

## 書き方で判断したこと
- 指示書6（まず見るところ／この問題の型／引用のあとの改行／選択肢ごとの改行／英語の再掲）を全ファイルに適用した。【覚えるポイント】では、本文・選択肢にない英語の例文や句は使わないようにした（語の仲間の単語として attach・bias・depict などを挙げたのみ）。
- 比較の相手：reading32 第3段落 presents a greater challenge は、前の段落の2つの島との比較が明らかなので「（2つの島の場合よりも）大きな課題」と補った。cloze26 の fewer things / less likely、reading35 の wealthier areas は相手が原文にないため「より少なく」「より低い」「より裕福な」とだけ訳した。q34 の選択肢 pose less of a danger は、【考え方】で比較の相手（ヘリコプターで毒を広くまく標準的な方法）を説明した。
- 会話文の語尾：「～んだ」は q11 の1か所だけにした。Honey は「ねえ」と訳した（q18・q20）。

## 要確認
- r-pre1-2017-3-q26：タイトル Minimalism: Is Less Really More? を「ミニマリズム――少ないほうが本当に豊かなのか？」と訳した（"Less is more"〔少ないほうが豊か〕という決まった言い回しをふまえた題と考えた）。q27・q28 も同じ本文。
- r-pre1-2017-3-q26：Faisal Hoque を「ファイサル・ホーク」とした（冊子に読みなし。邦訳書の表記は未確認）。
- r-pre1-2017-3-q28：Kyle Chayka を「カイル・チャイカ」とした（邦訳書の表記に合わせたつもりだが要確認。「チェイカ」とも書ける）。
- r-pre1-2017-3-q29：Gurgaon を「グルガオン」、Gurugram を「グルグラム」、Faridabad を「ファリダバード」とした（日本語の報道での一般的な表記と考えた）。political district は「行政上の地区」と訳した。q30・q31 も同じ本文。
- r-pre1-2017-3-q32：Rangitoto・Motutapu を「ランギトト島」「モツタプ島」とした（マオリ語の地名）。James Russell は「ジェームズ・ラッセル」。1080 は毒の名前としてそのまま「1080」と書いた（日本語では「1080（モノフルオロ酢酸ナトリウム）」などと説明されることがある）。q33・q34 も同じ本文。
- r-pre1-2017-3-q35：タイトルと計画名 Operation Site を「オペレーション・サイト（敷地作戦）」、Operation Chalk を「オペレーション・チョーク（チョーク作戦）」とした。チリでの元の名前はスペイン語の Operación Sitio なので、日本語では「オペラシオン・シティオ」と書かれることもある。q36・q37 も同じ本文。
- r-pre1-2017-3-q36：bathroom を「浴室」と訳した（風呂・トイレなどの水回りの部屋）。
- r-pre1-2017-3-q38：Jennifer Lewis を「ジェニファー・ルイス」、Pluronic ink を「プルロニック・インク」とした。q39～q41 も同じ本文。
- r-pre1-2017-3-q38：選択肢1の drugs that prevent their immune system from rejecting the new tissue と、本文の recipients must take medications so the transplanted organ can survive の対応は、同じ段落の immune system does not reject the organ と合わせて「→読み取れること」として示した（完全な言いかえではないため）。
- r-pre1-2017-3-q17：England は「イングランド（イギリスの一部）」と訳した。「イギリス」とするかどうか、方針の確認をお願いしたい。Reza は「レザ」とした。
