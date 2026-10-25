#!/usr/bin/env python3
"""Copy *explicitly approved* media from a private local source snapshot.

Default mode is dry-run. This script never changes the source or runs git push.
Requires Python 3.10+ and a human-signed approvals JSON.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path, PurePosixPath


def git_blob_sha(raw: bytes) -> str:
    head = f"blob {len(raw)}\0".encode("ascii")
    return hashlib.sha1(head + raw).hexdigest()


def safe_path(base: Path, relative: str) -> Path:
    p = PurePosixPath(relative)
    if p.is_absolute() or ".." in p.parts or not p.parts or '\\' in relative or ':' in relative:
        raise ValueError(f"Unsafe relative path: {relative!r}")
    result = base.joinpath(*p.parts)
    if not result.resolve().is_relative_to(base.resolve()):
        raise ValueError(f"Path escapes root: {relative!r}")
    return result


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-public", type=Path, required=True,
                        help="Local private snapshot/.../production/v3/editor/public")
    parser.add_argument("--dest-public", type=Path, default=Path(__file__).resolve().parent.parent / "projects/jin-token/editor/public")
    parser.add_argument("--manifest", type=Path, default=Path(__file__).resolve().parent.parent / "projects/jin-token/assets/asset-manifest.json")
    parser.add_argument("--approvals", type=Path, required=True,
                        help="Human-reviewed JSON file, see approved.example.json")
    parser.add_argument("--apply", action="store_true", help="Copy explicitly approved files after verification")
    args = parser.parse_args()

    source = args.source_public.resolve()
    dest = args.dest_public.resolve()
    if not source.is_dir():
        parser.error(f"Source public/ folder is missing: {source}")
    if source == dest or source.is_relative_to(dest) or dest.is_relative_to(source):
        parser.error("Source and destination must be independent.")
    data = load_json(args.manifest)
    approval_data = load_json(args.approvals)
    approvals = approval_data.get("assets", {})
    known = {a["path"]: a for a in data["assets"] if a.get('path')}
    if any(key not in known for key in approvals):
        parser.error("Approval file refers to a path absent from source manifest.")

    results = []
    errors = []
    for rel, review in approvals.items():
        if review.get("decision") != "redistributable":
            results.append({"path": rel, "status": "skipped_unapproved"})
            continue
        required = ("rights_holder", "license_or_permission", "evidence", "reviewed_by")
        missing = [k for k in required if not isinstance(review.get(k), str) or not review[k].strip()]
        if missing:
            errors.append(f"{rel}: missing approval evidence fields: {missing}")
            continue

        src = safe_path(source, rel)
        dst = safe_path(dest, rel)
        if not src.is_file() or src.is_symlink():
            errors.append(f"{rel}: not a regular source file")
            continue
        raw = src.read_bytes()
        meta = known[rel]
        if len(raw) != meta["size_bytes"] or git_blob_sha(raw) != meta["source_git_blob"]:
            errors.append(f"{rel}: source bytes differ from frozen Git blob; review again")
            continue
        if dst.exists():
            if dst.is_file() and git_blob_sha(dst.read_bytes()) == meta["source_git_blob"]:
                results.append({"path": rel, "status": "identical_exists"})
            else:
                errors.append(f"{rel}: destination exists with different bytes; will not overwrite")
            continue
        if args.apply:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dst)
            if git_blob_sha(dst.read_bytes()) != meta["source_git_blob"]:
                errors.append(f"{rel}: copy verification failed")
                continue
        results.append({"path": rel, "status": "copied" if args.apply else "ready_dry_run"})

    report = {"mode": "apply" if args.apply else "dry_run", "source": str(source),
              "dest": str(dest), "approved": sum(x.get("decision") == "redistributable" for x in approvals.values()),
              "results": results, "errors": errors}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
