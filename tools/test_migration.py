"""Boundary tests for public copy approvals and formal runtime contracts."""
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from curate_media import safe_path, git_blob_sha

ROOT=Path(__file__).resolve().parents[1]
class Boundaries(unittest.TestCase):
    def test_windows_and_posix_escape_paths(self):
        base=ROOT/'unused-test-root'
        for rel in ['../secret','/secret','C:/secret','C:secret','x\\..\\secret','\\\\server\\share']:
            with self.subTest(rel=rel),self.assertRaises(ValueError):safe_path(base,rel)
        self.assertEqual(safe_path(base,'fonts/test.otf'),base/'fonts/test.otf')

    def test_null_evidence_cannot_copy(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source';source.mkdir();dest=root/'dest';raw=b'example'
            (source/'x.png').write_bytes(raw)
            manifest=root/'m.json';manifest.write_text(json.dumps({'assets':[{'path':'x.png','size_bytes':len(raw),'source_git_blob':git_blob_sha(raw)}]}))
            approvals=root/'a.json';approvals.write_text(json.dumps({'assets':{'x.png':{'decision':'redistributable','rights_holder':None,'license_or_permission':'test','evidence':'test','reviewed_by':'test'}}}))
            result=subprocess.run([sys.executable,str(ROOT/'tools/curate_media.py'),'--source-public',str(source),'--dest-public',str(dest),'--manifest',str(manifest),'--approvals',str(approvals),'--apply'],capture_output=True,text=True)
            self.assertEqual(result.returncode,1)
            self.assertFalse((dest/'x.png').exists())

    def test_final_runtime_and_poem_contract(self):
        project=ROOT/'projects/jin-token'
        m=json.loads((project/'assets/asset-manifest.json').read_text(encoding='utf-8'))
        self.assertEqual(len(m['runtime_profile']['required_paths']),19)
        self.assertEqual(m['runtime_profile']['frames'],2613)
        ids=[a['asset_id'] for a in m['assets']];self.assertEqual(len(ids),len(set(ids)))
        captions=json.loads((project/'editor/src/captions.json').read_text(encoding='utf-8'))
        self.assertEqual([a['id'] for a in captions],[f'L{i:02d}' for i in range(1,13)])
        self.assertEqual([a['scene'] for a in captions],['A']*5+['B']*7)
        for a in captions:self.assertEqual(''.join(a['rows']).replace(' ',''),a['text'].replace(' ',''))

if __name__=='__main__':unittest.main()
