# 作成メモ pre1-2023-2（分割11）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文の全訳ファイル5本（cloze26、cloze29、reading32、reading35、reading38）。
- 疑義：0件。
- 全画像（大問1の25枚、長文7枚）を開いて本文・選択肢を照合した。抽出テキストの単語・選択肢は画像と一致していたが、ダッシュ（—）が抜けて空白になっている箇所があった（cloze26の stories—often、cloze29の beaks—a process、reading35の mechanism—talk to it ... about it—even、reading38の enlistment—any）。また reading38 と q40 の選択肢で better-equipped／as-needed／all-powerful／ex-soldiers のハイフンが特殊文字になっていた。全訳・引用・choices は画像に合わせた（ハイフンはふつうの - にした）。

## 自力解答と正式解答の照合
- 41問中41問一致。不一致なし（selfSolveNote なし）。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2023-2：target=41 written=41 issue=0 missing=0 errors=0 warnings=0。
- 途中で q36 の選択肢の訳「～にもとづくもの。」が性別口調の WARN に当たったため、「～にもとづいていた。」などの形に直して解消した。残した WARN なし。

## 粗探しで直した主な点
- q2：「準備し始められるようになる前に」というぎこちない訳を「書類の準備を始める前に」に直した。
- q14：「彼らにより近づいた」（「彼らによって」と読めてしまう）を「彼らのもっと近くへ移動した」に直した。
- q27：This の指す内容を断定していたのを「～を指すと考えられます」にした。
- q31・cloze29 全訳：be more likely to consume を「食べやすい」（食べるのが簡単、とも読める）と訳していたのを「食べる傾向がある」に直した。アンティングでアリがギ酸を出すことは一部の科学者の推測（suspect, may）なので、「～という考えです」と言い切らない形にした。
- q10・q24・q29：「この問題の型」を中身に合うものに直した。

## 要確認
- r-pre1-2023-2-q38：Gaius Marius を日本語で定着している「ガイウス・マリウス」、Marian reforms を「マリウスの改革」（歴史の本では「マリウスの軍制改革」とも）とした。legionaries は「軍団兵」と訳した（reading38 全訳、q38～q41 共通）。
- r-pre1-2023-2-q41：Julius Caesar を日本語で定着している「ユリウス・カエサル」とした（英語読みでは「ジュリアス・シーザー」）（reading38 全訳、q38～q41 共通）。
- r-pre1-2023-2-q40：provinces を「属州（ローマの支配下に入った地域）」、veterans を「退役兵（軍を退いた兵士）」とした（reading38 全訳、q38～q41 共通）。
- r-pre1-2023-2-q29：anting を「アンティング（蟻浴）」とした。ethology は「動物行動学」（cloze29 全訳、q29～q31 共通）。
- r-pre1-2023-2-q35：探査車 Opportunity を「オポチュニティ」、愛称 Oppy を「オッピー」、Scott Simon を「スコット・サイモン」とした（reading35 全訳、q35～q37 共通）。
- r-pre1-2023-2-q8：Enzo を「エンツォ」とした（イタリア系の名前としての読み。英語読みなら「エンゾー」に近い）。
- r-pre1-2023-2-q18：Josie を「ジョージー」とした。
- r-pre1-2023-2-q26：losing control over content を「内容を自分で決める力を失いつつある」と、小学生向けにかみくだいて訳した（cloze26 全訳と選択肢の訳で共通）。
