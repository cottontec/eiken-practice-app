# 作成メモ 2-2013-3（分割07・2級・50解答欄）

## 作成数・疑義
- 作成数：50／50（大問1 20問、語句整序 5問×2欄＝10、大問2（長文の語句空所補充）8問、大問3（長文の内容一致）12問）
- 長文の全訳：5本（scan2-26 Is It Worth It? / scan2-30 Jet Lag / scan3-34 Eメール（自転車事故・保険） / scan3-37 The New Kid in Class / scan3-41 Local Money）
- 疑義：0件。画像10枚（scan1-1 p2-3、scan4-21 p4、scan2-26 p5、scan2-30 p6、scan3-34 p7、scan3-37 p8-9、scan3-41 p10-11）はすべて鮮明で、読めない・切れている箇所はなかった。

## 自力解答と正式解答の照合
- 画像だけで全問を解いて _selfsolve.tsv に保存した後に正式解答と照合し、50欄すべて一致した。selfSolveNote は不要。
- 語句整序の並び：21 = 1 5 2 4 3（far as any of the teachers）、22 = 3 2 5 4 1（Alice compared Japanese to other）、23 = 5 1 4 2 3（the commercial will result in an increase）、24 = 5 4 1 3 2（way that the shop decorated her）、25 = 4 3 2 1 5（refused to give her the money）。

## 検査スクリプト
- build_and_check.py の結果：errors=0、warnings=0。

## 粗探しで直したこと・確認したこと
- q16：Not a day goes by that ～ の説明が「～しない日は1日も過ぎない」となっていて、that のあとの not と二重に数えていたので「～という日は1日も過ぎない」に直した。和訳も「恋しく思わずに過ぎる日は1日もない」にした。1文目からの「離れて暮らしている」は本文にない推論なので削った。
- q41：選択肢2の否定に「地域の中でお金を使うことが目的なので」という決めつけがあったので、本文の記述（お金が地域にとどまるので地元の店を助ける）と「国際的に成長する話はない」だけにした。
- q8：for a holiday の訳に「旅行で」を足していたので「休暇で」にした。q19：「賛成の人も」の「も」を削った。q37：選択肢4の訳の主語を原文どおり（子どもが家で親に教わることが許されていない）に直した。
- 全訳の目的（to ～）は完了にしないよう確認した（scan2-26 worked together to produce ～ は「生産するために協力し」、were given to install ～ は「設置するために出された」、scan2-30 in hopes of finding ～ は「見つけたいと考えて」、scan3-34 contact the hospital to confirm ～ は「確認して…始めるために連絡します」、scan3-37 is being used to solve ～ は「解決するために使われている」、began using one to represent ～ は「代わりを務めさせるために使い始めた」）。
- 関係詞がかかる語を確認した（scan2-26 an inventor who had come up with ～ は inventor、playground equipment that spins は equipment、scan3-37 rural hospitals that only have regular doctors は hospitals、a disease that made his body unable ～ は disease、scan3-41 local money that people can use ～ は money）。
- 否定の位置：scan2-30 are not directly affected は「直接影響を受けることはない」、scan3-41 will never completely replace は「完全に取って代わることは決してない」とした。強調の does have（scan3-37）は「確かに」と訳した。
- 語句整序の2番目・4番目のファイルは【考え方】を書き分け、それぞれの位置になぜその語が来るかを1文入れた。

## 要確認
- r-2-2013-3-q21-2 / q21-4：as far as any of the teachers know の any を「どの先生が知っている限りでも」と訳した。Ms. Baker は文脈上先生と思われるが、本文に明示がないので「ベイカーさん」とした。
- r-2-2013-3-q36：選択肢3の否定で、医療用の書類の送り先は本文に明記されていないが、「病院から受け取った領収書といっしょに送る」ことから送り先は病院ではなく保険会社（ラッセルさん）と「考えられる」と書いた。あわせて「コピー」の話がないことも理由にした。
- r-2-2013-3-scan3-41（q41～q45 の全訳）：Chiemgauer を「キームガウアー」、Christian Gelleri を「クリスティアン・ゲレリ」と表記した。businesses は文脈に合わせて「店や会社」と訳した。
- r-2-2013-3-q1 / q15：sister は年上か年下か分からないので「姉か妹」と訳した。
