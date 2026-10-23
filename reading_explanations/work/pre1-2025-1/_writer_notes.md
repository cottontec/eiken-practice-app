# pre1-2025-1 作成メモ（分割番号 12・準1級・31解答欄）

## 作成数
- 作成数：31／31解答欄（大問1：18、大問2：6、大問3：7）
- 本文全訳ファイル：4（cloze19, cloze22, reading25, reading28）
- 疑義数：0（画像24枚すべて判読可能。切れている箇所なし）

## 画像と抽出テキストの照合
- 大問1の18枚、大問2の2枚、大問3の4枚をすべて開き、本文・設問・選択肢を抽出テキストと照合した。語の食い違い・欠けはなし。
- reading28：抽出テキストでは upper-body、low-income、well-known、more-modern のハイフンが見えない文字（ソフトハイフン）になっていた。画像どおり普通のハイフンで書いた。
- reading25：船名（Dei Gratia、Mary Celeste）は画像では斜体。プレーンテキストのため斜体なしで書いた。

## 自力解答と正式解答の照合
- 正答を見る前に画像で全31問を解き、_selfsolve.tsv に記録してから source.json の correct と照合した。
- 一致：31件／不一致：0件。selfSolveNote は不要。

## 検査スクリプト
- build_and_check.py --part 12 --batch pre1-2025-1：target=31 written=31 issue=0 missing=0 errors=0 warnings=0
- 残したWARN：なし。
- 字数（本文全訳を除く）：大問1は約1,030～1,350字、大問2は約1,170～1,710字、大問3は約2,270～2,910字（設問・選択肢の英語の再掲と訳を含むため目安の1,800字を超える）。本文全訳を入れても12,000字の上限内。

## 粗探しで直した点
- 全問：【考え方】の英文の引用を原文と機械的に突き合わせた。q26（it was unusual to operate → it was unusual for them to operate）、q30（a greater tendency to retaliate → there is a greater tendency for their residents to retaliate）で、短くしていた引用を原文どおりに戻した。
- reading28（q28 にも同じ引用訳）：just as releasing steam ～ を、原文にない「というわけだ」をつけて別の文にしていたのを、1文の中で「ちょうど～と同じように」と訳す形に直した。leave people with increased levels of anger を「怒りの度合いを高めたままにする」から「より高い度合いの怒りを残す」に直した（「まま」は原文にない）。
- reading25（q25 にも同じ引用訳）：sailed the Mary Celeste to Gibraltar を「動かしてジブラルタルまで行き」から「航海させてジブラルタルまで運び」に直した。
- q5：引用の訳「運転手、その人たちは常に道路を見ているべきだ」が不自然だったので、「運転手、つまり常に道路を見ているべき人たち」に直した。
- q23：「それまで男性ばかりだった剣闘士の試合で」と本文にない言い切りをしていたのを、「～と考えられます」の推論の形に弱めた。
- q24：「奴隷は自分で望んだからではなく」という本文にない読みを削り、本文どおり「持ち主のためにお金をかせぐ目的で戦っていた」とした。選択肢3の否定理由を、However の前後の対比に即した説明に直した。

## 要確認
- r-pre1-2025-1-q19：地名 Campion district を「キャンピオン地区」とした。この出来事は日本語では「エミュー戦争」と呼ばれることがあるが、本文の題名 Bird Battle は「鳥との戦い」と訳した。q20・q21 も同じ全訳を使う。
- r-pre1-2025-1-q22：題名 Gladiator Equality を「剣闘士の平等」とした。republic／empire を「共和政」「帝政」とし、全訳の（）で意味を補った。q23・q24 も同じ全訳を使う。
- r-pre1-2025-1-q25：船名 Dei Gratia を「デイ・グラシア号」とした（ラテン語の読みで「デイ・グラティア号」「デイ・グラツィア号」とも書かれる）。Anne MacGregor を「アン・マグレガー」、Santa Maria を「サンタ・マリア島」、the Azores を「アゾレス諸島」とした。q26・q27 も同じ全訳を使う。
- r-pre1-2025-1-q25：chronometer を「クロノメーター（船の位置を知るために使う、とても正確な時計）」と（）で補った。本文には vital piece of navigational equipment としか書かれていないので、補足の言い方が適切か確認してほしい。q26・q27 も同じ全訳を使う。
- r-pre1-2025-1-q28：本文の less developed／greater tendency／more capable などの比較は、比べる相手がはっきりしないものを「より～」「～のほうが」とした（例：法律を守らせるための制度があまり発達していない社会のほうが、復讐がより頻繁に起こる）。q29～q31 も同じ全訳を使う。
