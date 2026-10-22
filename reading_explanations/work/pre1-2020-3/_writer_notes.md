# 作成メモ pre1-2020-3（分割11）

## 作成数・疑義
- 作成数：41／41解答欄（大問1：25、大問2：6、大問3：10）。長文の全訳ファイル5本（cloze26、cloze29、reading32、reading35、reading38）。
- 疑義：0件。
- 全画像（大問1の25枚、長文7枚）を開いて本文・選択肢を照合した。抽出テキストは画像と一致していたが、ダッシュ（—）が抜けていた箇所があった（cloze26 の a key—something ... lost it—while、reading38 の phosphorus—nutrients required by phytoplankton—are）。reading38 の nutrient-rich／nutrient-poor は抽出テキストでは見えないハイフン（ソフトハイフン）になっていた。全訳・引用は画像に合わせた。

## 自力解答と正式解答の照合
- 41問中41問一致。不一致なし（selfSolveNote なし）。

## 検査スクリプト
- build_and_check.py --part 11 --batch pre1-2020-3：target=41 written=41 issue=0 missing=0 errors=0 warnings=0。残したWARNなし。

## 粗探しで直した主な点
- q34：本文との対応で、原文にない語順の英文（Spin withdrew ～）を書いていたのを、原文どおりの Two of the firms, including Spin, withdrew their services and left the city に直した。
- q9・q17：【覚えるポイント】に本文にない英語の例（a feasible plan、vivid colors）を入れていたので削った。
- q31（選択肢3）・q35（選択肢2）：「本文と合わない」と書いていたが、本文に書かれていないだけなので「本文にありません」に直した。q39（選択肢1）も同じ理由で直した。
- q33：「バスや電車の便が悪い地域」という本文にない具体化を外し、本文の「既存の公共交通機関が見過ごしていた地域」に合わせた。
- q26・q30・q38：【考え方】で文中に英文を埋めこんでいた引用を「英文（訳）」だけの行に分けた。
- q25：選択肢3 worked up の否定理由から、言い切りすぎの語法の説明を外した。

## 要確認
- r-pre1-2020-3-q38：Island Mass Effect を「アイランド・マス・エフェクト」とカタカナにした（日本語では「島嶼質量効果」などの訳語もあるが定着した呼び名がはっきりしないため）。sponges は「カイメン」、upwelling は「湧昇（ゆうしょう）」、Keeling Islands は「キーリング諸島」、the Beagle は「ビーグル号」とした（reading38 全訳、q38～q41 共通）。
- r-pre1-2020-3-q29：red-billed oxpeckers を日本語の鳥名「アカハシウシツツキ」、black rhinoceros を「クロサイ」、ticks を「ダニ」とした（cloze29 全訳、q29～q31 共通）。
- r-pre1-2020-3-q30：全訳の far more likely to detect に比較の相手「（止まっていないサイより）」を補った。直前の Rhinos with the birds perched on them から相手が明らかと判断した（cloze29 全訳、q29～q31 共通）。
- r-pre1-2020-3-q28：全訳の Return rates for wallets containing a key were significantly higher に比較の相手「（鍵が入っていない財布より）」を補った。直前の while others did not から相手が明らかと判断した（cloze26 全訳、q26～q28 共通）。
- r-pre1-2020-3-q35：snow petrels を「ユキドリ」、Antarctic Treaty System を「南極条約体制」、North Slope を「ノーススロープ」とした（reading35 全訳、q35～q37 共通）。
- r-pre1-2020-3-q37：Justine Shaw を「ジャスティン・ショー」とした（Justine は「ジャスティーン」とも書ける）。University of Queensland は「クイーンズランド大学」。
- r-pre1-2020-3-q32：Pronto Cycle Share を「プロント・サイクル・シェア」、docking stations を「ドッキングステーション（自転車を止めて固定しておく専用の場所）」とした（reading32 全訳、q32～q34 共通）。
