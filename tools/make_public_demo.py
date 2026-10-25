"""Generate clearly marked procedural substitutes; no private artwork, music or voice required."""
import argparse
import json
import math
import shutil
import subprocess
import wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--dest-public',type=Path,default=ROOT/'.local-staging/demo-public')
    p.add_argument('--ffmpeg',default='ffmpeg')
    args=p.parse_args();dest=args.dest_public.resolve()
    project=ROOT/'projects/jin-token'
    manifest=json.loads((project/'assets/asset-manifest.json').read_text(encoding='utf-8'))
    if dest.exists() and any(dest.iterdir()):raise SystemExit('Choose an empty demo destination; refuses overwriting')
    dest.mkdir(parents=True,exist_ok=True)
    font=ImageFont.truetype(str(project/'editor/public/fonts/fusion-pixel-12px-monospaced-zh_hans.otf'),24)
    for a in manifest['assets']:
        if not a.get('used_in_final'):continue
        rel=a['path'];out=dest/rel;out.parent.mkdir(parents=True,exist_ok=True)
        if rel.startswith('fonts/'):
            shutil.copyfile(project/'editor/public'/rel,out)
        elif rel.endswith('.wav'):
            with wave.open(str(out),'wb') as w:
                w.setparams((2,2,48000,0,'NONE','not compressed'))
                w.writeframes(b'\0'*(2613*1600*4))
        elif rel.endswith('.png'):
            backdrop=rel.endswith('gpu-scene-selected.png') or rel.endswith('B-approved-20261022.png')
            size=(1280,720) if backdrop else (320,240)
            if 'thought-dot' in rel:size=(34,25)
            im=Image.new('RGBA',size,(238,244,247,255) if backdrop else (0,0,0,0));d=ImageDraw.Draw(im)
            if backdrop:
                d.rectangle((0,0,560,720),fill=(206,225,230,255))
                d.text((35,420),'公开占位演示',font=font,fill='#244650')
                d.text((35,462),'无原角色 / 无原声音',font=font,fill='#244650')
                d.text((35,504),'SC01' if 'gpu-scene' in rel else 'SC02',font=font,fill='#244650')
            elif 'metal-token' in rel:
                d.ellipse((60,50,260,190),fill='#edc965',outline='#846630',width=5)
            elif 'thought-dot' in rel:
                d.ellipse((1,1,size[0]-2,size[1]-2),fill='#ffffff')
            else:
                d.rounded_rectangle((4,4,316,236),radius=35,fill='#fffaf0',outline='#6d929d',width=3)
                d.text((24,30),'DEMO',font=font,fill='#244650')
                d.text((24,70),Path(rel).stem[:17],font=font,fill='#244650')
            im.save(out)
        elif rel.endswith('.webm'):
            count=151 if 'A48-' in rel else 180
            frames=[]
            for i in range(count):
                im=Image.new('RGBA',(170,210),(0,0,0,0));d=ImageDraw.Draw(im)
                y=95+int(22*math.sin(i/count*math.tau*2))
                d.ellipse((40,y-35,130,y+35),fill='#73a7bd')
                d.text((24,155),'DEMO',font=font,fill='#244650')
                frames.append(im)
            gif=out.with_suffix('.demo.gif')
            frames[0].save(gif,save_all=True,append_images=frames[1:],duration=33,loop=0,disposal=2)
            subprocess.run([args.ffmpeg,'-v','error','-i',str(gif),'-vf','fps=30','-frames:v',str(count),'-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','25','-b:v','0',str(out)],check=True)
    (dest/'DEMO.json').write_text(json.dumps({'kind':'procedural substitute demo','original_media':False,'audio':'silence','duration_frames':2613,
        'limitations':'Demonstrates original timing/subtitles/coin trajectories/overlays/loops only; no artistic or sound equivalence.'},indent=2)+'\n',encoding='utf-8')
    print('Created public demo inputs without private source media')

if __name__=='__main__':main()
