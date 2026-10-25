// Video foreground extraction on CPU. Original RGB/motion retained; infer alpha only.
import {pipeline,env,RawImage} from '@huggingface/transformers';
import {resolve} from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {access,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {once} from 'node:events';
const ff=process.env.FFMPEG_PATH||'ffmpeg';
const source=resolve('public/lower-half/A48-token-original.gif');
const out=resolve('public/lower-half/A48-foreground-cpu-v21.webm');
let exists=false;try{await access(out);exists=true}catch{}
if(exists)throw Error('Output exists; inspect it before another run.');
env.allowRemoteModels=false;env.useBrowserCache=false;
const modelPath=resolve(process.env.MODNET_MODEL_PATH||'.cache/models/modnet-v1');
console.log('Loading local CPU MODNet');
const remove=await pipeline('background-removal',modelPath,{device:'cpu',dtype:'fp32',local_files_only:true});
const w=300,h=370,size=w*h*4;
const raw=execFileSync(ff,['-v','error','-i',source,'-vf','fps=30','-pix_fmt','rgba','-f','rawvideo','-'],{maxBuffer:120*1024*1024});
const count=raw.length/size;if(!Number.isInteger(count))throw Error('Invalid video frame bytes');
console.log('VIDEO '+count+' frames, original GIF decoded directly');
const enc=spawn(ff,['-v','error','-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-r','30','-i','-','-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','18','-b:v','0',out],{stdio:['pipe','ignore','pipe']});
let errors='';enc.stderr.on('data',b=>errors+=b.toString());const close=once(enc,'close');
const cache=new Map();const samples=[];let inferred=0;
try{
 for(let i=0;i<count;i++){
  const src=raw.subarray(i*size,(i+1)*size);const key=createHash('sha256').update(src).digest('hex');let rgba=cache.get(key);
  if(!rgba){
   const result=await remove(new RawImage(new Uint8ClampedArray(src),w,h,4));
   if(result.width!==w||result.height!==h||result.channels!==4)throw Error('Matte size mismatch');
   rgba=Buffer.from(result.data);cache.set(key,rgba);inferred++;console.log('ALPHA '+inferred+' unique, video frame '+i);
  }
  if(i===0||i===Math.floor(count/2)||i===count-1){
   let zero=0,opaque=0;for(let j=3;j<rgba.length;j+=4){if(rgba[j]<5)zero++;if(rgba[j]>250)opaque++}
   samples.push({frame:i,transparent_pixels:zero,opaque_pixels:opaque});
   execFileSync(ff,['-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-i','-','-frames:v','1',resolve(`../21_bubble_adaptation_editor_20261022/previews/matte-cpu-${i}.png`)],{input:rgba,maxBuffer:5*1024*1024});
  }
  if(!enc.stdin.write(rgba))await once(enc.stdin,'drain');
 }
 enc.stdin.end();const [code]=await close;if(code!==0)throw Error('Encoding failed: '+errors);
 const meta={source,output:out,model:'MODNet fp32 on CPU',frames:count,fps:30,width:w,height:h,unique_frames_inferred:inferred,samples,method:'Original GIF RGB and frame holds; semantic alpha inferred per unique frame. No rectangular soft mask, no generated replacement animation.',visual_qc:'pending'};
 await writeFile(resolve('../21_bubble_adaptation_editor_20261022/evidence/matting-cpu.json'),JSON.stringify(meta,null,2),'utf8');console.log('COMPLETE '+JSON.stringify(meta));
}finally{await remove.dispose();if(!enc.stdin.destroyed)enc.stdin.destroy()}
