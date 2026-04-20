# コーチングログ活用エージェントチーム

Zoom/Plaud Note等から取得した文字起こしログを、Claude Codeのサブエージェントで自動分析するワークフロー。

## 構成

```
eiken-practice-app/
├── .claude/agents/              # サブエージェント定義
│   ├── transcript-analyzer.md   # 単一セッション分析
│   ├── student-profiler.md      # 生徒プロファイル管理
│   ├── coaching-insights.md     # 指導ナレッジ抽出
│   └── session-prep.md          # 次回セッション準備
├── transcripts/
│   ├── raw/                     # 元の文字起こし（ここに置く）
│   └── summaries/               # 要約済みセッション
├── students/                    # 生徒プロファイル（時系列）
├── insights/                    # 指導メソッド・原則の知識ベース
└── next-sessions/               # 次回セッション準備資料
```

## 使い方

### 1. 文字起こしを配置
PlaudやZoomからエクスポートしたテキストを `transcripts/raw/` に置く。

ファイル名規則: `YYYY-MM-DD-{種別}-{識別子}.txt`

### 2. エージェントを呼ぶ

#### 単一セッションを分析
```
transcripts/raw/2026-04-19-coaching-tanaka.txt を分析して要約して
```
→ `transcript-analyzer` が起動 → `transcripts/summaries/` に出力

#### 生徒プロファイルを更新
```
田中さんのプロファイルを最新ログで更新して
```
→ `student-profiler` が起動 → `students/` を更新

#### 知識ベースを更新
```
直近のログから指導メソッドを抽出して
```
→ `coaching-insights` が起動 → `insights/` を更新

#### 次回セッション準備
```
4/26の田中さんとのセッション準備して
```
→ `session-prep` が起動 → `next-sessions/` に出力

### 3. パイプライン実行（推奨）

新しいログを取り込んだら一気に処理：
```
transcripts/raw/ の新しいログを全部処理して、
要約・プロファイル更新・知見抽出までやって
```
→ Claude Codeが3つのエージェントを並列で起動

## エージェント一覧

| エージェント | 役割 | 入力 | 出力 |
|-------------|------|------|------|
| transcript-analyzer | 単一セッション要約 | raw/*.txt | summaries/*.md |
| student-profiler | 生徒の時系列追跡 | summaries/* | students/*.md |
| coaching-insights | 一般化可能な知見抽出 | summaries/* | insights/* |
| session-prep | 次回セッションの準備資料 | students/* + summaries/* | next-sessions/*.md |

## 想定ワークフロー

```
[Plaud Note]
    ↓ エクスポート
[transcripts/raw/]
    ↓ transcript-analyzer
[transcripts/summaries/]
    ↓        ↓
[student-profiler]  [coaching-insights]
    ↓                    ↓
[students/]          [insights/]
    ↓
[session-prep]
    ↓
[next-sessions/]
```

## 今後の拡張候補

- Plaud API連携で自動取り込み
- 全ログ横断検索エージェント（過去の議論を即座に思い出す）
- 生徒間の比較・成功パターン抽出
- 親御さん向けレポート自動生成
- アプリ本体（英検練習）との連携
