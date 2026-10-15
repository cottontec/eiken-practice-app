#!/usr/bin/env python3
"""src/ と data/words.json から、1ファイルで動く dist/index.html を作る。

単語データは番号・英語・訳語・品詞・別解を [no, en, ja, pos, aliases] の配列に詰め直すだけで、値は変えない。
（照合は tools/verify_data.mjs で行う）
使い方: python3 -I tools/build.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def js_json(value) -> str:
    # </script> などで埋め込みが壊れないよう < > & をエスケープする
    s = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return s.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def main():
    data = json.loads((ROOT / "data" / "words.json").read_text(encoding="utf-8"))
    source, words = data["source"], data["words"]
    rows = []
    for w in words:
        if w["edition"] != source["edition"] or w["section"] != source["section"]:
            raise SystemExit(f"版・区分が出典情報と異なる項目があります: {w['key']}")
        row = [w["no"], w["en"], w["ja"]]
        if w.get("pos") or w.get("aliases"):
            row += [w.get("pos", ""), w.get("aliases", [])]
        rows.append(row)
    data_js = (
        f"const VOCAB_SOURCE = {js_json(source)};\n"
        f"const BUILTIN_ORIGIN = {js_json(data['origin'])};\n"
        f"const BUILTIN_WORDS = {js_json(rows)}.map(([no, en, ja, pos = '', aliases = []]) => "
        "({ key: wordKey(VOCAB_SOURCE.edition, VOCAB_SOURCE.section, no), edition: VOCAB_SOURCE.edition, section: VOCAB_SOURCE.section, no, en, ja, pos, aliases }));"
    )
    src = ROOT / "src"
    html = (src / "template.html").read_text(encoding="utf-8")
    parts = {
        "/*STYLE*/": (src / "style.css").read_text(encoding="utf-8"),
        "/*CORE*/": (src / "core.js").read_text(encoding="utf-8"),
        "/*DATA*/": data_js,
        "/*APP*/": (src / "app.js").read_text(encoding="utf-8"),
    }
    for marker, body in parts.items():
        if html.count(marker) != 1:
            raise SystemExit(f"テンプレートの {marker} が1か所ではありません")
        if "</script" in body.lower() and marker != "/*STYLE*/":
            raise SystemExit(f"{marker} に </script が含まれています")
        html = html.replace(marker, body)
    out = ROOT / "dist" / "単熟語EX準1級_定着チェック.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"{out} を作成しました（{len(html.encode('utf-8')):,} バイト、内蔵 {len(rows)} 項目）")
    # claude.ai 公開用：公開時に doctype / html / head / body が付くため、中身だけにする
    head = html[html.index("<head>") + 6:html.index("</head>")]
    body = html[html.index("<body>") + 6:html.rindex("</body>")]
    keep = "\n".join(l for l in head.splitlines() if not l.startswith(("<meta charset", "<meta name=\"viewport\"")))
    art = ROOT / "dist" / "artifact.html"
    art.write_text(keep.strip() + "\n" + body.strip() + "\n", encoding="utf-8")
    print(f"{art} を作成しました（claude.ai 公開用）")


if __name__ == "__main__":
    main()
