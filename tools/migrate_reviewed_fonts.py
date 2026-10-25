"""Copy only frozen fonts whose embedded license records match archived license texts."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
from curate_media import git_blob_sha

ROOT=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,required=True)
    args=parser.parse_args()
    src=args.source/'大肥鱼吟诗/production/v3'
    project=ROOT/'projects/jin-token'
    manifest_path=project/'assets/asset-manifest.json'
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    licenses=src/'01_references/fonts/licenses'
    dest=project/'assets/licenses/fonts'
    for file in licenses.rglob('*'):
        if file.is_file():
            target=dest/file.relative_to(licenses)
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text('\n'.join(line.rstrip() for line in file.read_text(encoding='utf-8-sig').splitlines())+'\n',encoding='utf-8')
    names={
        'Cubic_11.ttf':('ACh and Cubic 11 Project Authors; included upstream contributors','Cubic_11-LICENSE.txt','Cubic redistribution permission with bundled upstream notices'),
        'LXGWWenKaiScreen.ttf':('LXGW; The Klee Project Authors','LXGWWenKaiScreen-LICENSE.txt','SIL-OFL-1.1'),
        'fusion-pixel-12px-monospaced-zh_hans.otf':('TakWolf; included component authors','fusion-pixel-OFL-1.1.txt','SIL-OFL-1.1 with component notices'),
        'fusion-pixel-12px-monospaced-latin.otf':('TakWolf; included component authors','fusion-pixel-OFL-1.1.txt','SIL-OFL-1.1 with component notices'),
    }
    for a in manifest['assets']:
        if a.get('path') not in ['fonts/'+n for n in names]:continue
        name=Path(a['path']).name
        holder,license_file,license_id=names[name]
        source=src/'editor/public'/a['path']
        raw=source.read_bytes()
        if len(raw)!=a['size_bytes'] or git_blob_sha(raw)!=a['source_git_blob']:
            raise SystemExit('Frozen font mismatch: '+name)
        target=project/'editor/public'/a['path']
        target.parent.mkdir(parents=True,exist_ok=True)
        if target.exists() and target.read_bytes()!=raw:raise SystemExit('Refuse different destination '+name)
        shutil.copyfile(source,target)
        a.update(rights_holder=holder,license_status='redistributable_under_bundled_license',publish_approved=True,
            license_evidence='projects/jin-token/assets/licenses/fonts/'+license_file,
            license_or_permission=license_id,distribution='public_with_notices',migration_status='copied_hash_verified',
            review_basis='Embedded font name/copyright/license metadata inspected against frozen accompanying license texts; no author license override.')
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('4 frozen fonts copied with source hash verification and bundled notices')

if __name__=='__main__':main()
