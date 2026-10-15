#!/usr/bin/env python3
"""元HTML（単熟語EX準1級_定着チェック.html）から VOCAB_SOURCE と BUILTIN_WORDS をそのまま取り出す。

番号・英語・訳語は一切書き換えない。出力は data/words.json（リポジトリには含めない）。
使い方: python3 -I tools/extract_data.py <元HTML> [出力先]
"""
import hashlib
import json
import sys
from pathlib import Path


def extract(html: str):
    dec = json.JSONDecoder()
    out = {}
    for name in ("VOCAB_SOURCE", "BUILTIN_WORDS"):
        marker = f"const {name} = "
        if html.count(marker) != 1:
            raise SystemExit(f"{name} の宣言が1か所に見つかりません（{html.count(marker)}件）")
        start = html.index(marker) + len(marker)
        out[name], _ = dec.raw_decode(html, start)
    return out["VOCAB_SOURCE"], out["BUILTIN_WORDS"]


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src_path = Path(sys.argv[1])
    dest = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent / "data" / "words.json"
    raw = src_path.read_bytes()
    source, words = extract(raw.decode("utf-8"))
    dest.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": source,
        "origin": {"file": src_path.name, "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest()},
        "words": words,
    }
    dest.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(words)}件を {dest} に書き出しました（元HTML {len(raw):,} バイト / sha256 {payload['origin']['sha256'][:12]}…）")


if __name__ == "__main__":
    main()
