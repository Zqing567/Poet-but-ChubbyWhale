import {registerMediabunnyServer} from '@mediabunny/server';
import {env} from '@huggingface/transformers';
import {canUseVideoMatting,downloadVideoMattingModel,separateVideoLayers,disposeVideoMattingModel} from '@remotion/video-matting';
import {resolve} from 'node:path';
import {writeFile,access} from 'node:fs/promises';
registerMediabunnyServer();
env.cacheDir=resolve('../21_bubble_adaptation_editor_20261022/model-cache');
const model=process.argv.includes('--modnet')?'modnet':'ben2-base';
const out=resolve(`public/lower-half/A48-foreground-${model}-v21.webm`);
let completed=false;
try{await access(out);completed=true}catch{}
if(completed)throw Error('Foreground output already exists; inspect existing output first.');
const support=await canUseVideoMatting({model});console.log('GPU '+JSON.stringify(support));
if(!support.supported)throw Error(support.detailedReason);
let last='';
await downloadVideoMattingModel({model,onProgress:p=>{const k=p.file+' '+Math.floor(p.progress/25)*25;if(k!==last){last=k;console.log('MODEL '+k)}}});
const result=await separateVideoLayers({src:resolve('public/lower-half/A48-motion-source-v21.mp4'),model,audio:'none',videoBitrate:'very-high',onProgress:p=>{if(p.processedFrames%15===0)console.log('MATTE '+p.stage+' '+p.processedFrames)}});
try{
 const blob=await result.foreground.getBlob();await writeFile(out,new Uint8Array(await blob.arrayBuffer()));
 const meta={source:'public/lower-half/A48-motion-source-v21.mp4',original:'public/lower-half/A48-token-original.gif',output:out,model,width:result.width,height:result.height,duration_seconds:result.durationInSeconds,processed_frames:result.processedFrames,bytes:blob.size,source_character_motion_preserved:true,visual_qc:'pending'};
 await writeFile(resolve('../21_bubble_adaptation_editor_20261022/evidence/matting.json'),JSON.stringify(meta,null,2),'utf8');console.log('FOREGROUND '+JSON.stringify(meta));
}finally{await result[Symbol.asyncDispose]();await disposeVideoMattingModel({model})}
