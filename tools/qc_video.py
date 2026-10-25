"""Decode a full final render; inspect format, input hashes, audio sync and animated tail."""
import argparse
import hashlib
import json
import math
import subprocess
from pathlib import Path
import numpy as np

def run(cmd):return subprocess.check_output(cmd)
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('video',type=Path);p.add_argument('--audio-reference',type=Path)
    p.add_argument('--ffmpeg',default='ffmpeg');p.add_argument('--ffprobe',default='ffprobe')
    p.add_argument('--report',type=Path,required=True);args=p.parse_args()
    video=args.video
    probe=json.loads(run([args.ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(video)]))
    vs=next(s for s in probe['streams'] if s['codec_type']=='video')
    audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    decode=subprocess.run([args.ffmpeg,'-v','error','-i',str(video),'-f','null','-'],capture_output=True)
    fmt={'width':vs['width'],'height':vs['height'],'fps':vs['avg_frame_rate'],'frames':int(vs['nb_frames']),
        'duration':float(probe['format']['duration']),'video_codec':vs['codec_name'],'pixel_format':vs['pix_fmt'],
        'color_space':vs.get('color_space'),'audio_codec':audio['codec_name'],'audio_rate':audio['sample_rate'],
        'audio_channels':audio['channels'],'audio_bitrate':audio.get('bit_rate')}
    decode_audio=lambda file:np.frombuffer(run([args.ffmpeg,'-v','error','-i',str(file),'-vn','-ar','48000','-ac','1','-f','f32le','-']),dtype='<f4')
    data=decode_audio(video)
    windows=[]
    if args.audio_reference:
        ref=decode_audio(args.audio_reference)
        for start in [3.5,12,24,47,60,82]:
            lo=int(start*48000);length=48000
            a=data[lo:lo+length];b=ref[lo:lo+length]
            corr=float(np.corrcoef(a,b)[0,1])
            # +/- 5 samples verifies alignment at the expected cue, not just presence.
            candidates={lag:float(np.corrcoef(a,ref[lo+lag:lo+lag+length])[0,1]) for lag in range(-5,6)}
            lag=max(candidates,key=candidates.get)
            windows.append({'start_seconds':start,'duration_seconds':1,'correlation_at_zero':corr,'best_sample_lag':lag})
    rms=lambda a:20*math.log10(max(float(np.sqrt(np.mean(a.astype(float)**2))),1e-12))
    tail_levels={'84.1_to_84.8_dbfs':rms(data[int(84.1*48000):int(84.8*48000)]),'last_20ms_dbfs':rms(data[int(87.08*48000):int(87.1*48000)])}
    raw=run([args.ffmpeg,'-v','error','-ss','84.1','-i',str(video),'-an','-vf','scale=1280:720,crop=170:210:43:36,fps=2','-pix_fmt','rgb24','-f','rawvideo','-'])
    frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,210,170,3).astype(float)
    differences=[float(np.mean(np.abs(frames[i+1]-frames[i]))) for i in range(len(frames)-1)]
    result={'video_name':video.name,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'format':fmt,
        'full_decode_exit':decode.returncode,'decode_stderr_empty':not decode.stderr,
        'audio_sync_windows':windows,'tail_audio':tail_levels,'tail_motion_half_second_mean_absolute_differences':differences,
        'limits':'Checks technical synchronization, not artistic recitation quality or redistribution rights; output hash need not match old encoder output.'}
    passed=(decode.returncode==0 and not decode.stderr and fmt['frames']==2613 and fmt['fps']=='30/1' and abs(fmt['duration']-87.1)<.04
        and min(differences,default=0)>.5 and tail_levels['last_20ms_dbfs']<tail_levels['84.1_to_84.8_dbfs']-20
        and (not windows or all(x['correlation_at_zero']>.9999 and x['best_sample_lag']==0 for x in windows)))
    result['technical_pass']=passed
    args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2));return 0 if passed else 1
if __name__=='__main__':raise SystemExit(main())
