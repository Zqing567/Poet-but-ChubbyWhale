"""Inventory the frozen source snapshot; never copies source media or writes source files."""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / 'projects/jin-token'
PREFIX = '大肥鱼吟诗/production/v3/editor/'
# Reviewed against FullReview -> UpperHalf / LowerHalf -> Poem -> Fonts.
# Fonts.ts eagerly loads all three fonts, including two workshop alternatives.
FINAL = {
    'audio/full_mix_final_tail3s.wav': ('L01-L12,END', 'FullReview: final master audio'),
    'fonts/Cubic_11.ttf': ('ALL', 'Fonts: eagerly loaded workshop alternative'),
    'fonts/LXGWWenKaiScreen.ttf': ('ALL', 'Fonts: eagerly loaded workshop alternative'),
    'fonts/fusion-pixel-12px-monospaced-zh_hans.otf': ('L01-L12', 'Poem: selected F1 font'),
    'upper-half/gpu-scene-selected.png': ('L01-L05', 'GpuBackdrop'),
    'upper-half/metal-token-v1.png': ('L01-L05', 'TokenRain'),
    'upper-half/paper-main-cut.png': ('L02-L12', 'ThoughtBubble / LowerThought transitions'),
    'upper-half/rice-integrated-v2.png': ('L02-L03', 'ThoughtBubble rice'),
    'upper-half/empty-basin-reminder-v2-caption.png': ('L04', 'ThoughtBubble new reminder'),
    'upper-half/singing-frame-v2.png': ('L05,L09', 'Transparent singing frame'),
    'upper-half/singing-clean-v2.webm': ('L05,L09', 'Transparent singing Loop'),
    'upper-half/thought-dot-large.png': ('L02-L12,END', 'Thought pointer'),
    'upper-half/thought-dot-small.png': ('L02-L12,END', 'Thought pointer'),
    'lower-half/B-approved-20261022.png': ('L06-L12,END', 'PoetryGarden'),
    'lower-half/rice-dream-thought-v1.png': ('L08', 'LowerThought dream'),
    'lower-half/granary-4x3-v21.png': ('L10', 'LowerThought granary'),
    'lower-half/refill-api-platform-v7.png': ('L11', 'LowerThought refill'),
    'lower-half/token-plate-4x3-v21.png': ('L12,END', 'LowerThought proud mask and plate'),
    'lower-half/A48-foreground-cpu-v21.webm': ('L12,END', 'LowerThought 151-frame Loop'),
}

def blob(raw):
    return hashlib.sha1(f'blob {len(raw)}\0'.encode() + raw).hexdigest()

def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    args = parser.parse_args()
    source = args.source.resolve()
    head = subprocess.check_output(['git','-C',str(source),'rev-parse','HEAD'], text=True).strip()
    expected = '0357d1b7965c8bdb606a7fc45e75d9f4e3619897'
    if head != expected:
        raise SystemExit('Source is not frozen 0357d1b snapshot')
    names = subprocess.check_output(['git','-C',str(source),'ls-files','-z']).decode().split('\0')
    trees = subprocess.check_output(['git','-C',str(source),'ls-tree','-rz','HEAD']).split(b'\0')
    blobs = {row.split(b'\t',1)[1].decode():row.split(b'\t',1)[0].split()[2].decode() for row in trees if row}
    def frozen(name):
        raw = (source/name).read_bytes()
        if blob(raw) != blobs[name]:
            raw = subprocess.check_output(['git','-C',str(source),'cat-file','blob',blobs[name]])
        return raw
    inventory = []
    for name in filter(None, names):
        file = source / name
        raw = frozen(name)
        rel = name.removeprefix(PREFIX + 'public/') if name.startswith(PREFIX + 'public/') else None
        suffix = file.suffix.lower()
        if rel in FINAL:
            group = 'final_runtime'
        elif '/24_submission_master_' in name or '/25_covers_remote_' in name and '/covers/' in name or name.endswith('_v11.mp4'):
            group = 'release_delivery'
        elif name.startswith(PREFIX):
            group = 'editor_metadata' if suffix in {'.json','.tsx','.ts','.mjs','.cjs','.mts'} or file.name == 'package.json' else 'workshop_or_preprocessing'
        elif suffix in {'.wav','.mp3','.flac','.m4a','.ogg'} or '/参考视频/' in name or '/参考音频/' in name:
            group = 'private_research_audio'
        elif suffix in {'.md','.json','.py','.js','.ts','.tsx','.mjs','.cjs','.txt','.ps1','.yml','.yaml','.csv','.html'}:
            group = 'experience_or_source_record'
        else:
            group = 'historical_candidate_or_reference'
        inventory.append({'source_path':name,'size_bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),
                          'source_git_blob':blob(raw),'classification':group,
                          'publish_status':'not_approved_by_inventory',
                          'note':'Classification is for navigation, not a legal permission decision.'})
    dump(PROJECT/'assets/source-inventory.json', {'source_commit':head,'scope':'all tracked files in frozen snapshot; caches/untracked files excluded',
         'counts':dict(Counter(x['classification'] for x in inventory)), 'files':inventory})
    manifest_file = PROJECT/'assets/asset-manifest.json'
    manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
    for asset in manifest['assets']:
        rel = asset['path']
        if not rel:
            continue
        raw = frozen(PREFIX+'public/'+rel)
        if asset['source_git_blob'] != blob(raw) or asset['size_bytes'] != len(raw):
            raise SystemExit('Source mismatch: ' + rel)
        asset.update(asset_id='JT-' + hashlib.sha256(rel.encode()).hexdigest()[:12].upper(),
                     source_path=PREFIX+'public/'+rel, target_path='projects/jin-token/editor/public/'+rel,
                     sha256=hashlib.sha256(raw).hexdigest(), used_in_final=rel in FINAL,
                     story_nodes=FINAL.get(rel, ('WORKSHOP', 'Historical/workshop/preprocessing dependency'))[0].split(','),
                     usage=FINAL.get(rel, ('', 'Historical/workshop/preprocessing dependency'))[1],
                     rights_holder=asset.get('rights_holder','unconfirmed'),
                     migration_status=asset.get('migration_status','copied_hash_verified') if asset.get('publish_approved') else 'withheld_pending_rights',
                     fallback='See editor/README.md: local legal media hydration; public demo uses substitutes.')
        if rel.endswith('.wav'):
            asset['category']='audio_rights_review'
        if asset['category'] != 'metadata_only' and not asset.get('publish_approved'):
            asset['distribution']='local_only_pending_review'
    existing = {x['source_path'] for x in manifest['assets']}
    for item in inventory:
        if item['classification'] != 'release_delivery' or item['source_path'] in existing:
            continue
        name=item['source_path']
        manifest['assets'].append({**item,'asset_id':'JT-'+hashlib.sha256(name.encode()).hexdigest()[:12].upper(),
            'path':None,'target_path':'projects/jin-token/release/withheld/'+name.split('production/v3/',1)[-1],'category':'release_delivery','used_in_final':False,
            'story_nodes':['RELEASE'],'usage':'Final video / cover delivery, not runtime input',
            'rights_holder':'unconfirmed composite rights','license_status':'pending','publish_approved':False,
            'license_evidence':None,'distribution':'local_only_pending_review','migration_status':'withheld_pending_rights',
            'fallback':'Verified official publication link when supplied; do not upload composite media.'})
    manifest['schema_version']='1.1.0'
    manifest['runtime_profile']={'entry':'FullReview via 4K exporter','frames':2613,'fps':30,'required_paths':sorted(FINAL),
        'review_basis':'Manual call-chain inspection, including conditional final props and eager font loads; excludes alternative reminder and workshop assets.'}
    dump(manifest_file,manifest)
    provenance=json.loads((PROJECT/'code-provenance.json').read_text(encoding='utf-8'))
    comparisons=[]
    for entry in provenance['files']:
        rel=entry['file']
        upstream=frozen(PREFIX+rel)
        current_blob=subprocess.check_output(['git','-C',str(ROOT),'hash-object','--path=projects/jin-token/editor/'+rel,str(PROJECT/'editor'/rel)],text=True).strip()
        comparisons.append({'file':rel,'source_blob_matches_record':blob(upstream)==entry['old_sha'],
            'target_blob_matches_record':current_blob==entry['new_sha'],'sanitized_at_baseline':entry['changed']})
    dump(ROOT/'reports/baseline-code-comparison.json',comparisons)
    print(json.dumps({'source_files':len(inventory),'source_bytes':sum(x['size_bytes'] for x in inventory),
        'manifest_entries':len(manifest['assets']),'final_runtime':len(FINAL),
        'baseline_code_all_match':all(x['source_blob_matches_record'] and x['target_blob_matches_record'] for x in comparisons)},indent=2))

if __name__ == '__main__':
    main()
