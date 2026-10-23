# 作成メモ 2-2014-3（分割08・2級・50解答欄）

## 作成数・疑義
- 作成数：50／50（大問1：20、大問4〈語句整序〉：10、大問2：8、大問3：12）。長文全訳5本（cloze26 / cloze30 / reading34 / reading37 / reading41）。
- 疑義：0件。画像（q1～q20 各1枚、order21～25 各1枚、cloze26・cloze30・reading34 各1枚、reading37・reading41 各2枚）はすべて鮮明で、本文・選択肢の切れや読めない箇所はなし。抽出テキストと画像の食い違いもなし。

## 自力解答と正式解答
- 正答を見る前に画像と正答抜きデータだけで全50解答欄を解き、_selfsolve.tsv に保存。正式解答と全問一致（食い違い0件、selfSolveNote なし）。
- 語句整序の並び：q21 4 1 5 2 3 ／ q22 1 4 3 2 5 ／ q23 5 3 4 2 1 ／ q24 2 3 1 5 4 ／ q25 4 3 5 2 1。

## 検査スクリプト
- build_and_check.py --part 08 --batch 2-2014-3：target=50 written=50 issue=0 errors=0 warnings=0（残したWARNなし）。

## 粗探しで直したところ（作成者自身）
- 全訳・和訳で目的の to ～ を完了のように訳していた箇所を「～するために」に修正：reading41（loading it into boats that then took it abroad to be sold／come to the area to catch them）、reading37（burned as fuel to make electricity）、cloze30（use these sites to contact relatives）、reading34（face to face to exchange information）、q19（to look for them）。q39・q44 の引用訳も合わせて修正。
- cloze26 全訳と q29：比較級 healthier の訳落ち（「健康によい食べ物」）を「より健康によい食べ物」に修正。
- q16：work through the weekend の訳に原文にない「も」（週末も）が入っていたのを「週末の間ずっと」に修正。
- q15：和訳の erasing に原文にない「消しゴムで」を足していたのを削除（考え方の語の説明には「消しゴムなどで」を残した）。
- q18：「ラーメンばかり」の「ばかり」（原文にない）を削除し、「～と分かります」を「～と考えられます」に弱めた。
- q20：「やさしく断る」の「やさしく」（根拠のない決めつけ）を削除。
- q27：本文にない推論（「方法が昔のままだからこそ見直す研究が必要」）を削除。
- q36：本文と選択肢の対応で、意味が同じでない対（50分の予定 ＝ originally supposed to be）を「→」に変えた。
- q37・q38・q39・q40：段落・文番号を確認し、q39 の「5文目／6文目」を正しい「4文目／5文目」に修正、ほかは「第◯段落の～文目」と段落名を明記。
- q45：「えさがいなくなれば海鳥は生きていけない」という本文にない推論を、本文の「魚と鳥の両方がいなくなるかもしれない」に即した説明に差し替え。
- q34：「先週初めて会った」を本文の finally に即して「先週、ついに直接会えた」に修正。

## 要確認
- r-2-2014-3-q45：正解2の must protect both ... to save the guano industry は本文に直接の文はなく、第4段落の「グアノ産業への新たな脅威」「漁が管理されなければ魚と鳥の両方がいなくなるかもしれない」「ペルーはとる数の制限に各国の同意を求めている」から「読み取れます」と説明した。推論の書き方が適切か確認してほしい。
- r-2-2014-3-q11：in the course of ～ と同じ意味の言い方として over the course of ～ を紹介した（本文外の語句知識）。不要なら削ってよい。
- r-2-2014-3-reading41（q41～q45 の全訳）：organic fertilizers に（生き物に由来する自然の材料から作られた肥料）という語の説明を（）で添えた。q43 の organic food の説明（化学的に作られた肥料などを使わずに育てた食べ物）とあわせ、語の説明の範囲として許容できるか確認してほしい。
