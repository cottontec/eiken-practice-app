# Reading解説 作成作業（分割01～12・全93回・3,809解答欄）

- 原本：ユーザー提供の Reading_NN_*.zip（このリポジトリには入れない。問題画像・問題JSONは著作物のため）
- 作業ファイル：work/<batchId>/（問題ごとの .txt、本文全訳 .passage.txt、自力解答 _selfsolve.tsv、点検記録 _review.md）
- 統合と自動検算：tools/build_and_check.py（正解番号・自力解答との一致・選択肢の扱い・見出し・禁止形式・字数・抽出テキストとの選択肢照合）
- 成果：parts/partNN/（results/、Reading_解説完成_partNN.json、Reading_疑義一覧.json、progress.json、Reading_作成結果.md）
- 指示書：AGENT_BRIEF.md（作成担当）、REVIEW_BRIEF.md（点検担当）

再開方法：ZIPを scratchpad/zips/NN/ に展開 → tools/make_blind.py で正答抜きデータを作成 → 未完了バッチを作成担当へ。
自動検算は形式・機械照合のみで、訳や説明の正しさは保証しない。
