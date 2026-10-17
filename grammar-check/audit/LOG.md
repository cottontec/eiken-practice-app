# 監査ログ

各ラウンドの指摘と対応結果。対応は「反映」「一部反映」「見送り（理由つき）」のどれか。

## ラウンド0（2026-10-17）Claude 粗探し役エージェント

指摘20件（要修正2・要検討5・軽微13）。19件反映、1件見送り（g2-04）。

| ID | 重大度 | 指摘 | 対応 |
|---|---|---|---|
| gp2-11 | 要修正 | cross と across が重なり不自然 | 反映（across を削除） |
| gp2-14 | 要修正 | so / very kind to help も成立し別解 | 反映（old enough to drive に差し替え） |
| gp1-09 | 要検討 | 英では submits も標準的 | 反映（選択肢を to submit に変更） |
| gp1-15 | 要検討 | Less people は口語で一般的・級に易しい | 反映（few, if any に差し替え） |
| g1-07 | 要検討 | I'd rather you don't tell は口語で聞く | 反映（選択肢を not telling に変更） |
| g2-08 | 要検討 | closing の根拠説明が誤り | 反映（説明を修正） |
| gp2-18 | 要検討 | The work must finish は自動詞読みで成立しうる | 反映（主語を The report に変更、和訳修正） |
| gp1-13 | 軽微 | which も文脈次第で成立 | 反映（whether に変更） |
| gp1-08 | 軽微 | In spite of の根拠が曖昧 | 反映（説明を明確化） |
| g1-08 / g1-09 | 軽微 | 英では should＋原形も可 | 反映（根拠に注記） |
| g1-05 | 軽微 | raised の根拠「受け身」は不正確 | 反映（説明を修正） |
| g1-06 | 軽微 | It is high time は1級に易しい・g2-04と重複 | 反映（What with A and B に差し替え） |
| g1-14 | 軽微 | 完了不定詞が g2-14 と重複 | 反映（独立分詞構文 the reason being に差し替え） |
| g1-15 | 軽微 | Needless to say は1級に易しい | 反映（Suffice it to say に差し替え） |
| g1-19 | 軽微 | Considering は1級に易しい | 反映（Granted that に差し替え） |
| g1-17 | 軽微 | 和訳のずれ | 反映 |
| g2-15 | 軽微 | look forward to -ing は2級に易しい | 反映（What do you say to -ing に差し替え） |
| g2-04 | 軽微 | It's time you go も口語でまれに聞く | 見送り（標準的な誤答として許容範囲。README の要確認に記載） |
| g3-03 | 軽微 | 和訳が不自然 | 反映 |
