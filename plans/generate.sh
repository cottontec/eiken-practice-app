#!/usr/bin/env bash
# 学習計画HTMLからPDFを生成する。
# 依存: Chromium (Playwright同梱のものでも可) と 日本語フォント (IPAGothic 等)。
#
# 使い方:
#   CHROME=/path/to/chrome ./generate.sh "英検2級_S-CBT_学習計画"
# 第1引数を省略すると "英検2級_S-CBT_学習計画" を対象にする。
set -euo pipefail
cd "$(dirname "$0")"

NAME="${1:-英検2級_S-CBT_学習計画}"
CHROME="${CHROME:-}"

# Chromium を自動検出（未指定の場合）
if [[ -z "${CHROME}" ]]; then
  for c in \
    /opt/pw-browsers/chromium-*/chrome-linux/chrome \
    "$(command -v chromium 2>/dev/null || true)" \
    "$(command -v chromium-browser 2>/dev/null || true)" \
    "$(command -v google-chrome 2>/dev/null || true)"; do
    if [[ -n "${c}" && -x "${c}" ]]; then CHROME="${c}"; break; fi
  done
fi
[[ -n "${CHROME}" ]] || { echo "Chromium が見つかりません。CHROME=... で指定してください。" >&2; exit 1; }

# マルチバイトのパスを避けるため一時ディレクトリ(ASCII名)で生成してから移動する
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT
cp "${NAME}.html" "${TMP}/plan.html"

"${CHROME}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=4000 \
  --print-to-pdf="${TMP}/plan.pdf" "file://${TMP}/plan.html"

mv "${TMP}/plan.pdf" "${NAME}.pdf"
echo "生成しました: ${NAME}.pdf"
