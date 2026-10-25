"""Audit tracked publication candidates without reading ignored private staging media."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    names=[x for x in subprocess.check_output(['git','-C',str(ROOT),'ls-files','-z']).decode().split('\0') if x]
    assets=ROOT/'projects/jin-token/assets'
    approved={}
    for manifest in ['asset-manifest.json','post-freeze-manifest.json']:
        data=json.loads((assets/manifest).read_text(encoding='utf-8'))
        for a in data['assets']:
            if a.get('publish_approved') and a.get('target_path') and a.get('sha256'):
                approved[a['target_path']]=a
    findings=[];binaries=[];scanned=0
    secrets=re.compile(r'sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{20,}|AIza[A-Za-z0-9_-]{25,}|[?&](?:token|api_key|signature)=[^\s"<>]{12,}',re.I)
    media_ext={'.png','.jpg','.jpeg','.gif','.webm','.wav','.mp3','.mp4','.ttf','.otf','.flac','.m4a'}
    for name in names:
        file=ROOT/name
        if not file.is_file():continue
        if file.suffix.lower() in media_ext:
            a=approved.get(name)
            valid=bool(a and a.get('license_evidence') and hashlib.sha256(file.read_bytes()).hexdigest()==a['sha256'])
            binaries.append({'path':name,'bytes':file.stat().st_size,'approved_hash_and_evidence':valid})
            if not valid:findings.append({'path':name,'problem':'Unapproved media or missing evidence/hash mismatch'})
        else:
            try:text=file.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                findings.append({'path':name,'problem':'Unexpected non-UTF8 tracked file'});continue
            scanned+=1
            if secrets.search(text):findings.append({'path':name,'problem':'Possible credential pattern; inspect locally (value suppressed)'})
        if any(part in name for part in ['.local-staging/','node_modules/','.env','model-cache/']):
            findings.append({'path':name,'problem':'Private/cache path tracked'})
    report={'tracked_files':len(names),'text_scanned':scanned,'public_binary_count':len(binaries),'binaries':binaries,'findings':findings,
        'limits':'Pattern scan is not an exhaustive secret detector; source and history need separate review. Only manifests with scoped evidence authorize media.'}
    print(json.dumps(report,ensure_ascii=False,indent=2));return 1 if findings else 0
if __name__=='__main__':raise SystemExit(main())
