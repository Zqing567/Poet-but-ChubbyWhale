"""Publish selected author prompt records with local machine paths removed; no reference images copied."""
import argparse
import hashlib
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def clean(value):
    if isinstance(value,dict):return {k:clean(v) for k,v in value.items()}
    if isinstance(value,list):return [clean(v) for v in value]
    if isinstance(value,str) and re.match(r'^[A-Za-z]:[/\\]',value):
        normal=value.replace('\\','/')
        return normal.split('/大肥鱼吟诗/',1)[1] if '/大肥鱼吟诗/' in normal else 'local-reference:'+normal.rsplit('/',1)[-1]
    return value
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--source-project',type=Path,required=True);args=p.parse_args()
    selections=[('production/v3/10_upper_half_20261021/generation-manifest.json','upper-candidate-prompts.json','Historical candidates, not an assertion every output was selected'),
        ('参考图片/曲水流饭_构图候选_20261022/生图提示词与候选说明.json','garden-layout-candidates.json','Layout candidate comparison'),
        ('参考图片/曲水流饭_定稿_20261022/定稿修订说明与提示词.json','garden-chibi-revision.json','Selected base revision; later character corrections are separately recorded'),
        ('参考图片/曲水流饭_定稿_20261022/v2_两角色修订与4K实测.json','garden-character-corrections.json','Later character correction and actual output size record')]
    dest=ROOT/'projects/jin-token/assets/prompts';index=[]
    for rel,name,status in selections:
        file=args.source_project/rel;raw=file.read_bytes();record=json.loads(raw.decode('utf-8-sig'))
        result={'source_record':rel,'source_checkout_sha256':hashlib.sha256(raw).hexdigest(),'status':status,
            'sanitization':'Machine absolute paths replaced with project relative paths or local-reference basenames; prompt text retained.',
            'record':clean(record)}
        (dest/name).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');index.append({'file':name,'source':rel,'status':status})
    (dest/'history-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print('Saved 4 selected source prompt records; no images copied')
if __name__=='__main__':main()
