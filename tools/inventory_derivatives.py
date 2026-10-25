"""Index post-freeze character sheets and publish sanitized author prompt text only."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-project',type=Path,required=True)
    args=parser.parse_args()
    src=args.source_project
    assets=ROOT/'projects/jin-token/assets'
    groups=[('initial_turnarounds','发布素材/20261025_第二场景角色三视图'),
            ('final_optimized','发布素材/20261026_角色立绘最终优化版'),
            ('bilibili_material_selection','发布素材/20261025_B站图文')]
    records=[]
    previous_path=assets/'post-freeze-manifest.json'
    previous={a['source_path']:a for a in json.loads(previous_path.read_text(encoding='utf-8'))['assets']} if previous_path.exists() else {}
    for group,rel in groups:
        folder=src/rel
        if not folder.is_dir():
            raise SystemExit('Expected derivative folder missing: '+rel)
        for file in sorted(folder.glob('*.png')):
            raw=file.read_bytes()
            records.append({'asset_id':'JT-POST-'+hashlib.sha256((rel+'/'+file.name).encode()).hexdigest()[:12].upper(),
                'source_path':rel+'/'+file.name,'source_commit':None,'group':group,'size_bytes':len(raw),
                'sha256':hashlib.sha256(raw).hexdigest(),'used_in_final_video':False if group!='bilibili_material_selection' else 'see frozen runtime manifest',
                'status':'user_selected_final' if group=='final_optimized' else 'reference_or_earlier_delivery',
                'tool':'external optimization; model/settings not documented' if group=='final_optimized' else 'see linked production record',
                'reference_asset':'lower-half/B-approved-20261022.png' if group!='bilibili_material_selection' else None,
                'rights_status':'pending_character_reference_and_service_review','publish_approved':False,
                'migration_status':'indexed_no_public_binary','fallback':'Local import from source_path after rights review'})
            prior=previous.get(records[-1]['source_path'])
            if prior and prior['sha256']==records[-1]['sha256'] and prior.get('publish_approved'):
                records[-1]=prior
    prompt_dir=assets/'prompts'
    prompt_dir.mkdir(parents=True,exist_ok=True)
    original=src/'production/v3/27_scene2_turnarounds_20261025/imagegen-prompts.json'
    data=json.loads(original.read_text(encoding='utf-8-sig'))
    data['reference']='asset:lower-half/B-approved-20261022.png'
    data['source_record']='production/v3/27_scene2_turnarounds_20261025/imagegen-prompts.json (post-freeze local record)'
    data['scope']='Author production text; image inputs and third-party character rights are not granted by this prompt.'
    (prompt_dir/'scene2-turnarounds.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    optimization=src/'发布素材/20261026_角色立绘最终优化版/prompt-高保真画质优化与视觉伪影清理.txt'
    (prompt_dir/'high-fidelity-refinement.txt').write_text(optimization.read_text(encoding='utf-8-sig'),encoding='utf-8')
    (assets/'post-freeze-manifest.json').write_text(json.dumps({'date':'2026-10-26','basis':'Explicit user request to include post-0357d1b materials; not present in frozen commit',
        'final_group':'final_optimized','source_of_final_selection':'User designated optimized desktop folder; archived byte-identically in local source project',
        'noncanonical_details':'Standing pose and unseen backs are consistent AI completion, not recovered orthographic design.',
        'prompts':['prompts/scene2-turnarounds.json','prompts/high-fidelity-refinement.txt'],'assets':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'post_freeze_images':len(records),'final_optimized_images':sum(x['group']=='final_optimized' for x in records),'prompt_records':2,'public_binary_copies':0}))

if __name__=='__main__':main()
