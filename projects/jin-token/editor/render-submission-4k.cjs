const fs=require('node:fs');const path=require('node:path');
const {values}=require('node:util').parseArgs({options:{output:{type:'string'},scale:{type:'string',default:'3'},'public-dir':{type:'string'},frames:{type:'string'}}});
const {createHash}=require('node:crypto');
const out=path.resolve(values.output||path.join(__dirname,'../release/outputs/jin-token-master-4k.mp4'));
const publicDir=path.resolve(values['public-dir']||path.join(__dirname,'public'));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/asset-manifest.json'),'utf8'));
const required=manifest.runtime_profile.required_paths;
const missing=required.filter(rel=>!fs.existsSync(path.join(publicDir,rel)));
if(missing.length)throw Error('Missing final runtime media:\n'+missing.join('\n')+'\nSee editor/README.md for public demo or legal local hydration.');
const scale=Number(values.scale);if(!Number.isFinite(scale)||scale<=0)throw Error('Invalid --scale');
let frameRange;
if(values.frames){frameRange=values.frames.split('-').map(Number);if(frameRange.length!==2||frameRange.some(n=>!Number.isInteger(n))||frameRange[0]<0||frameRange[1]>2612||frameRange[0]>frameRange[1])throw Error('Expected --frames START-END inside 0-2612');}
const run=path.dirname(out);
const temp=path.join(run,'render_temp');fs.mkdirSync(temp,{recursive:true});
process.env.TEMP=temp;process.env.TMP=temp;
const {bundle}=require('@remotion/bundler');
const {selectComposition,renderMedia,openBrowser}=require('@remotion/renderer');
(async()=>{
 if(fs.existsSync(out))throw Error('Output already exists');
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'src/index.ts'),publicDir,outDir:path.join(run,'render_bundle'),webpackOverride:config=>({...config,cache:false})});
 const browser=await openBrowser('chrome');
 try{
  const inputProps={audio:true,audioSource:'audio/full_mix_final_tail3s.wav'};
  const comp=await selectComposition({serveUrl,id:'JinToken-Final',inputProps,puppeteerInstance:browser});
  if(comp.durationInFrames!==2613||comp.fps!==30)throw Error('Final composition contract differs');
  let last=-1;const started=Date.now();
  await renderMedia({serveUrl,composition:comp,inputProps,outputLocation:out,scale,frameRange,codec:'h264',crf:12,audioCodec:'aac',audioBitrate:'320k',pixelFormat:'yuv420p',colorSpace:'bt709',concurrency:2,puppeteerInstance:browser,logLevel:'error',onProgress:p=>{let n=Math.floor(p.progress*20);if(n!==last){last=n;const line=JSON.stringify({percent:n*5,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,elapsedSeconds:Math.round((Date.now()-started)/1000)});console.log(line);fs.appendFileSync(path.join(run,'render_progress.jsonl'),line+'\n')}}});
  const hashes=Object.fromEntries(required.map(rel=>[rel,createHash('sha256').update(fs.readFileSync(path.join(publicDir,rel))).digest('hex')]));
  fs.writeFileSync(out+'.render.json',JSON.stringify({composition:comp.id,frames:frameRange||[0,2612],fps:30,scale,width:1280*scale,height:720*scale,inputs:hashes,outputSha256:createHash('sha256').update(fs.readFileSync(out)).digest('hex')},null,2)+'\n');
  console.log('EXPORTED '+out);
 }finally{await browser.close({silent:true})}
})().catch(e=>{console.error(e);process.exit(1)});
