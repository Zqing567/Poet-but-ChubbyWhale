#!/usr/bin/env python3
"""Audit a curated Jin Token source archive; never attempts network or media generation."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true", help="Fail if runtime media are missing")
    args = parser.parse_args()

    project = root / "projects/jin-token"
    editor = project / "editor"
    expected_code = [
        "package.json", "package-lock.json", "tsconfig.json", "remotion.config.ts",
        "render-submission-4k.cjs", "src/Root.tsx", "src/UpperHalf.tsx",
        "src/LowerHalf.tsx", "src/FullReview.tsx", "src/CaptionStudy.tsx",
        "src/captions.json", "src/selected-layout.json", "src/upper-half.json",
    ]
    missing_code = [p for p in expected_code if not (editor / p).is_file()]
    manifest = json.loads((project / "assets/asset-manifest.json").read_text(encoding="utf-8"))
    media = [a for a in manifest["assets"] if a.get("path") and a["category"] != "metadata_only"]
    runtime = [a for a in media if a.get('used_in_final')]
    present = [a["path"] for a in media if (editor / "public" / a["path"]).is_file()]
    missing_media = [a["path"] for a in media if not (editor / "public" / a["path"]).is_file()]
    missing_runtime = [a['path'] for a in runtime if not (editor/'public'/a['path']).is_file()]
    suspicious = []
    secrets = re.compile(r"sk-[a-zA-Z0-9]{20,}|Bearer\s+[a-zA-Z0-9._-]{20,}|AIza[0-9A-Za-z_-]{25,}")
    for base in (editor / "src",):
        for path in base.glob("**/*"):
            if not path.is_file() or path.suffix.lower() not in (".js", ".ts", ".tsx", ".json", ".mjs", ".mts"):
                continue
            value = path.read_text(encoding="utf-8", errors="replace")
            if secrets.search(value):
                suspicious.append(str(path.relative_to(root)))
    bad_text = []
    cap_file = editor / "src/captions.json"
    if cap_file.exists():
        lines = json.loads(cap_file.read_text(encoding="utf-8"))
        actual = [x.get("id") for x in lines]
        if actual != [f"L{i:02d}" for i in range(1, 13)]:
            bad_text.append("Unexpected caption IDs/order")
        if [x.get("scene") for x in lines] != ["A"] * 5 + ["B"] * 7:
            bad_text.append("Expected five A lines followed by seven B lines")
    report = {
        "project": "jin-token", "mode": "strict" if args.strict else "source_archive",
        "code_files_missing": missing_code, "media_manifest_total": len(media),
        "media_present": len(present), "media_missing": len(missing_media),
        "final_runtime_total":len(runtime), "final_runtime_missing": missing_runtime,
        "media_missing_names": missing_media,
        "possible_secret_patterns": suspicious, "poem_errors": bad_text,
        "runnable_media_complete": not missing_runtime,
        "remark": "Static source checks do not prove npm build, video render or legal redistribution."
    }
    print(json.dumps(report, indent=2, ensure_ascii=False))
    failed = bool(missing_code or suspicious or bad_text or (args.strict and missing_runtime))
    return 2 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
