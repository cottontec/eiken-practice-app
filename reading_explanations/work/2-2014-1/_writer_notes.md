# 作成メモ 2-2014-1（分割07・2級・50解答欄）

## 作成数・疑義
- 作成数：50／50（大問1：20、大問4〈語句整序〉：10、大問2：8、大問3：12）。長文全訳5本（cloze26 / cloze30 / reading34 / reading37 / reading41）。
- 疑義：0件。画像（q1～q20 各1枚、order21～25 各1枚、cloze26・cloze30・reading34 各1枚、reading37・reading41 各2枚）はすべて鮮明で、切れや読めない箇所はなし。抽出テキストと画像を全問照合し、食い違いなし。

## 自力解答と正式解答
- 正答を見る前に画像と正答抜きデータだけで全50解答欄を解き、_selfsolve.tsv に保存。正式解答と全問一致（食い違い0件、selfSolveNote なし）。
- 語句整序の並び：q21 2 4 3 1 5 ／ q22 4 1 5 3 2 ／ q23 1 5 3 2 4 ／ q24 2 5 1 4 3 ／ q25 5 2 1 3 4。
- 語句整序の2番目・4番目のファイルは【考え方】の組み立てと「まちがえやすい並べ方」の例を別々にした。例はすべて与えられた5語で実際に作れる並び（例：q21-2 now and every then he goes to、q22-4 it's not much too trouble、q23-4 provided that you home come、q24-4 think either would be fine picture、q25-4 they have the amount of half）。

## 検査スクリプト
- build_and_check.py --part 07 --batch 2-2014-1：target=50 written=50 issue=0 errors=0 warnings=0。

## 粗探しで直したところ（作成者自身）
- q36：【正解】行と選択肢1の訳で、Help him agree on a price を「価格を決めるのを、彼が手伝う」と主語を取り違えていたのを「彼が大事な取引先と価格を取り決めるのを手伝う」に修正。
- q11：only on condition that の only が訳で弱かったため「～という条件でだけ」に修正。
- q12：won't give you any extra vacation days を「1日も追加でくれない」に修正。
- q13：Just go over there を「隣に行って」（原文にない補い）から「向こうに行って」に修正。
- q20：She lost one ～ の主語をはっきりさせ「ジャネットは昨日～」に修正。
- q22：pick us up a pizza for dinner を「私たちに夕食用のピザを買ってきて」に修正。
- q26：「仕事の時間が終わってもメールが追いかけてくる」という本文にない推論を削り、第1段落の「ほとんどどこからでもEメールを見られる」から考える説明に修正。
- q28：サイレンス・ルームなどの休憩について「その間だけ」と言い切っていたのを「～と考えられます」に和らげた。
- q18：「司会の人などによって」という本文にない補いを「だれかによって」に修正。
- cloze30 全訳・q30：music can help plants grow better を「植物がよりよく育つのを助けることがある」に修正。人名 Mi-Jeong Jeong は英文の語順どおり「ミジョン・チョン」とした。
- q3：覚えるポイントの不要な一般論（形容詞 relative の別の意味）を削除。

## 要確認
- r-2-2014-1-q22-2 / q22-4：B の Sure, honey. を「もちろん、いいよ」と訳し、honey は（）で「家族や恋人などに親しみをこめて呼びかける言葉」と補足した。訳し方の好みの確認。
- r-2-2014-1-q39：正解4の in some cases を、本文 a beneficial effect on the brains of older people（高齢の人の脳によい効果）の言いかえと説明した。対応のさせ方が適切か確認してほしい。
- r-2-2014-1-cloze30（q30～q33 の全訳）：人名 Mi-Jeong Jeong の表記を「ミジョン・チョン」とした（韓国語の姓名順に直していない）。表記の確認。
- r-2-2014-1-q16：For all I know を「（よく分からないが）ひょっとすると」と説明した。2 At heart の否定理由（人の本当の性格を言う語）が十分か確認してほしい。
