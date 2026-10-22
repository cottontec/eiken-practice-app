# 作成メモ 2-2022-2（分割09・2級・38解答欄）

## 作成数・疑義
- 作成数：38／38（大問1：20、大問2：6、大問3：12）。本文全訳5本（cloze21 / cloze24 / reading27 / reading30 / reading34）。
- 疑義：0件。

## 自力解答と正式解答
- 全38問を画像と正答抜きデータだけで先に解き（_selfsolve.tsv）、正式解答と照合した。食い違いは0件。
- 抽出テキストと画像を全ページ照合した。食い違いは reading34 のダッシュ（—）が抽出テキストで落ちていた2か所だけ（it rains a couple of times each year—once in the winter ... / This fruit—the saguaro fruit—has ...）。訳と引用は画像に合わせた。選択肢はすべて画像どおり。

## 検査スクリプト
- build_and_check.py --part 09 --batch 2-2022-2：written=38 errors=0 warnings=0。

## 要確認
- r-2-2022-2-q4：Shuta Omura は漢字が分からないので、和訳では「オオムラ・シュウタ」（日本語の姓・名の順）にした。
- r-2-2022-2-q24：Andrew Lloyd Webber は「アンドリュー・ロイド・ウェバー」にした。日本では「ロイド＝ウェバー」と書くことも多い。作品名は、定着した邦題の『オペラ座の怪人』と『キャッツ』を使った。Joseph and the Amazing Technicolor Dreamcoat は「ジョセフ・アンド・ザ・アメージング・テクニカラー・ドリームコート」としたが、日本での上演題名（ヨセフ／ジョセフなど）は要確認（cloze24 の全訳にも同じ表記）。
- r-2-2022-2-q25：T. S. Eliot の Old Possum's Book of Practical Cats は、英語の題名に直訳（ポッサムおじさんの実用的なネコの本）を添えた。日本では『キャッツ―ポッサムおじさんの猫とつき合う法』などの邦題があるので、どちらにそろえるか要確認（cloze24 の全訳にも同じ表記）。
- r-2-2022-2-q32：phuti karpas は「フティ・カルパス」とした（「プティ・カルパス」と書くこともある）。Dhaka muslin は「ダッカ・モスリン」。Saiful Islam は「サイフル・イスラム」とし、地の文では原文どおり「イスラム」と呼んだ（reading30 の全訳とq30～q33も同じ表記）。
- r-2-2022-2-q34：Tohono O'odham は「トホノ・オオダム」とした（「トホノ・オーダム」と書く例もある）。saguaro cactus は「サワロサボテン」とした（和名は「ベンケイチュウ」）。reading34 の全訳とq34～q38も同じ表記。
- r-2-2022-2-q21：International Union for Conservation of Nature は定着した日本語名の「国際自然保護連合」に、Center for Biological Diversity は直訳で「生物多様性センター」にした。
- タイトルの訳：Performing Cats は「演じるネコたち」、Desert Delight は「砂漠の楽しみ」とした。どちらも言葉遊びを含む題で、ほかの訳し方もできる。
