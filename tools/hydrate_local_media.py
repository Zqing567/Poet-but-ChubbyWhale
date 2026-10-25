"""Populate local media for a legally held private reproduction; never approves publication."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
from curate_media import safe_path

ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source-public',type=Path,required=True)
    p.add_argument('--dest-public',type=Path,required=True)
    p.add_argument('--apply',action='store_true')
    args=p.parse_args()
    source=args.source_public.resolve();dest=args.dest_public.resolve()
    if source==dest or source.is_relative_to(dest) or dest.is_relative_to(source):p.error('Independent roots required')
    m=json.loads((ROOT/'projects/jin-token/assets/asset-manifest.json').read_text(encoding='utf-8'))
    assets=[x for x in m['assets'] if x.get('used_in_final')]
    checked=[]
    for a in assets:
        rel=a['path'];src=safe_path(source,rel);target=safe_path(dest,rel)
        if not src.is_file() or src.is_symlink():raise SystemExit('Missing regular source: '+rel)
        raw=src.read_bytes()
        if hashlib.sha256(raw).hexdigest()!=a['sha256']:raise SystemExit('Source hash mismatch: '+rel)
        if target.exists() and target.read_bytes()!=raw:raise SystemExit('Refuse different destination: '+rel)
        checked.append((src,target,rel))
    if args.apply:
        for src,target,rel in checked:
            target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,target)
            if hashlib.sha256(target.read_bytes()).digest()!=hashlib.sha256(src.read_bytes()).digest():raise SystemExit('Copy mismatch: '+rel)
    print(json.dumps({'mode':'apply_local_only' if args.apply else 'dry_run','runtime_files':len(checked),'publication_approval':False}))

if __name__=='__main__':main()
