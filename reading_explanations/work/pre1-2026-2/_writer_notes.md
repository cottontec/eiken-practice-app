# 作成メモ pre1-2026-2（分割12）

## 作成数・疑義
- 作成数：31／31解答欄（大問1：18、大問2：6、大問3：7）。本文全訳4本（cloze19・cloze22・reading25・reading28）。
- 疑義：0件。
- 画像照合：全画像（短文18枚、長文4本ぶんの本文・設問画像6枚）を開いて本文・選択肢を照合した。抽出テキストは、reading28 の Ascension Island—over one thousand kilometers away—to のダッシュ2か所が抜けていた（画像どおり引用）。また長文のハイフン語（mid-twentieth、two-digit、able-bodied など）が抽出テキストでは見えない文字（ソフトハイフン）になっていたので、引用では普通のハイフンにした。それ以外は画像と一致。

## 自力解答と正式解答
- 31問中31問一致。不一致なし（selfSolveNote なし）。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2026-2：target=31 written=31 issue=0 missing=0 errors=0 warnings=0。

## 書き方で決めたこと
- 指示書の「6. 学習効果を上げる書き方」（まず見るところ／この問題の型／英語の再掲／選択肢を1行1つ）に従った。短文では「空所のある文」「後ろの文」「前半」「後半」で場所を示した。
- 比較の相手を（）で補ったものはない。more seriously（cloze19）、the more extreme predictions（cloze19）、stricter（reading25）、deeper economic harm（reading25）、a shorter route（reading28）、More settlers（reading28）は相手が前後にはっきり書かれていないので「より～」のまま訳した。longer distances than sailing ships（reading28）は原文どおり「帆船よりも」。q27選択肢1の not as serious / much more effective は、文の中で比べる相手（深刻な景気後退）が決まるので「深刻なときよりも、そこまで深刻でないときのほうが」と訳した。
- 「本文の内容と合いません」と書いたのは、本文に逆の内容がはっきり書かれている選択肢だけ（q26の2、q28の1・3、q29の1）。
- cloze19 の the two-digit system saved space and became standard の and は因果にせず「場所を節約し、標準になった」と訳した。

## 要確認
- r-pre1-2026-2-q3：Emir を「エミール」、Corinne を「コリーヌ」とした（「エミル」「コリン」などの読みもありうる。冊子に読みなし）。
- r-pre1-2026-2-q2：Luna を「ルナ」とした。
- r-pre1-2026-2-q16：Miranda を「ミランダ」とした。hold A against B の説明として「不利な材料にされる」と訳した。
- r-pre1-2026-2-q19：タイトル The Y2K Bug を「Y2Kバグ（2000年問題）」とした（日本では「2000年問題」の呼び名が定着している）。q20・q21 と共通の全訳 cloze19。emergency services に「（救急や消防など）」、public and private sectors に「（国や役所など）」「（会社など）」の説明を（）で補った。
- r-pre1-2026-2-q22：Ikeda Kikunae を日本語の「池田菊苗」とした。fermented sauces を「発酵させた調味料」、starchy を「でんぷんの味」、fatty を「脂肪の味」とした。q23・q24 と共通の全訳 cloze22。
- r-pre1-2026-2-q25：Supplemental Nutrition Assistance Program を「補助的栄養支援プログラム（SNAP）」、able-bodied adults without dependents を「扶養家族のいない、健康で働ける大人」とした（定まった訳語は未確認）。q26・q27 と共通の全訳 reading25。
- r-pre1-2026-2-q28：English explorer / English trading company を「イングランドの」とし、Britain / British は「イギリス」とした（「イギリスの」にそろえる方針なら reading28 の全訳を直す）。Thomas Cavendish を「トーマス・キャベンディッシュ」（「トマス・キャヴェンディッシュ」とも書く）。the East India Company は定着した「東インド会社」。q29～q31 と共通の全訳 reading28。
- r-pre1-2026-2-q30：Battle of Waterloo を日本で定着した「ワーテルローの戦い」とした（英語の読みでは「ウォータールー」）。Elba「エルバ島」、Ascension Island「アセンション島」、Longwood House「ロングウッド・ハウス」。
- r-pre1-2026-2-q27：正解4の「景気後退から立ち直るのが難しくなる」は、第3段落の loses its ability to protect ～ from deeper economic harm と a source of economic activity that could lessen the impact of job losses を失うことから読み取れる内容として説明した（直接の言いかえではない点を確認推奨）。
