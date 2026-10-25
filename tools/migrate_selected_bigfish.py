"""Copy the two user-selected final Bigfish derivatives with scoped CC attribution."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source-project',type=Path,required=True)
    args=p.parse_args();assets=ROOT/'projects/jin-token/assets'
    path=assets/'post-freeze-manifest.json';data=json.loads(path.read_text(encoding='utf-8'))
    count=0
    for a in data['assets']:
        if a['group']!='final_optimized' or Path(a['source_path']).name not in ['诗人大肥鱼2.png','诗人大肥鱼形象三视图.png']:continue
        src=args.source_project/a['source_path'];raw=src.read_bytes()
        if hashlib.sha256(raw).hexdigest()!=a['sha256']:raise SystemExit('Source changed; review again')
        rel='characters/final/'+src.name;dst=assets/rel;dst.parent.mkdir(parents=True,exist_ok=True)
        if dst.exists() and dst.read_bytes()!=raw:raise SystemExit('Refuse destination replacement')
        shutil.copyfile(src,dst)
        a.update(target_path='projects/jin-token/assets/'+rel,rights_status='CC-BY-NC-SA-4.0_user_confirmed_character_derivative',
            rights_holder='上善无形/上善; ZipZipPipe; project adaptation Zqing567',license_evidence='CHARACTER_RIGHTS.md',
            publish_approved=True,migration_status='copied_hash_verified',license='CC-BY-NC-SA-4.0')
        count+=1
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Copied '+str(count)+' user-approved final Bigfish images; no other character license inferred')
if __name__=='__main__':main()
