# 作成メモ 2-2010-2（分割05・2級・50解答欄）

## 作成数・疑義
- 作成数：50／50（大問1 20問、語句整序 5問×2欄＝10、大問2（長文の語句空所補充）8問、大問3（長文の内容一致）12問）
- 長文の全訳：5本（scan2-26 Lights Out / scan2-30 Water for N.Y.C. / scan3-34 Eメール / scan3-37 The Gift of Sight / scan3-41 Desert Power）
- 疑義：0件。画像10枚はすべて鮮明で、本文・選択肢に読めない・切れている箇所はなかった。

## 自力解答と正式解答の照合
- 画像だけで全問を解いて _selfsolve.tsv に保存した後に正式解答と照合し、50欄すべて一致した。selfSolveNote は不要。
- 語句整序の並び：21 = 3 4 2 1 5（that's out of the question）、22 = 1 5 4 3 2（cases where he needs to）、23 = 5 3 4 2 1（to be free of chemicals）、24 = 3 1 5 2 4（has little hope of winning）、25 = 5 1 2 4 3（he seemed to have lost）。

## 検査スクリプト
- build_and_check.py の結果：errors=0、warnings=0。

## 粗探しで直したこと
- q41：本文と選択肢の対応で、本文にない英文（the energy from the sun that deserts receive）を引用の形で書いていたので、原文の use the Sahara Desert / use this energy / to provide clean electricity to Europe に差しかえた。
- q45：選択肢2の否定で「発電所の電気」と言い切っていた部分を、本文で電気の使い道として出てくるのは塩分の除去、という書き方に弱めた。
- q17：1 fall through の否定理由を「その文に入れるとどうなるか」の形に書き直した。q21-2：まちがえやすい並べ方の例が筋の通らないものだったので書き直した。
- scan3-34（Eメール）：good publicity の訳「大きく取り上げられ、よい評判を得る」は足しすぎなので「よい形で広く紹介される」にした。
- q25：plane ticket を「搭乗券」から「飛行機のチケット（航空券）」にした。
- 全訳では目的の to ～ を完了にしないよう確認した（scan2-26 の is now trying to reduce は「減らそうとしています」、scan3-41 の a plan to use the Sahara Desert … to provide ～ は「供給する計画」、hope to use this energy to create ～ は「作り出したいと考えている」）。関係詞がかかる語も確認した（q2 a scar that can still be seen は scar、q20 a job that interested him は job、scan2-30 each part of the building that needs it は part にかかるものとして「水を必要とする各部分」と訳した）。

## 要確認
- r-2-2010-2-scan2-26（q26～q29 の全訳）：baby turtles は文脈からウミガメと思われるが、本文に sea はないので「カメの赤ちゃん」と訳した。barrels は（バレルは石油の量の単位）と補足を（）で入れた。
- r-2-2010-2-scan3-41（q41～q45 の全訳）：solar power stations を、本文で水を蒸気に変えるしくみが説明されていることから「太陽熱発電所」と訳した（ソーラーパネルと区別するため）。
- r-2-2010-2-q39：正解1の「以前は治せなかった動物」は、獣医の言葉 without the new portable equipment, it would have been impossible to cure these bears からの言いかえとして説明した。正式解答と一致し、ほかの選択肢は本文と明確に違うので疑義にはしていない。
