const fs=require('node:fs');const path=require('node:path');
const run=path.resolve('../24_submission_master_20261023');
const temp=path.join(run,'render_temp');fs.mkdirSync(temp,{recursive:true});
process.env.TEMP=temp;process.env.TMP=temp;
const {bundle}=require('@remotion/bundler');
const {selectComposition,renderMedia,openBrowser}=require('@remotion/renderer');
(async()=>{
 const out=path.join(run,'将进token_投稿定稿_4K高品质.mp4');
 if(fs.existsSync(out))throw Error('Output already exists');
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:path.join(run,'render_bundle'),webpackOverride:config=>({...config,cache:false})});
 const browser=await openBrowser('chrome');
 try{
  const inputProps={audio:true,audioSource:'audio/full_mix_final_tail3s.wav'};
  const comp=await selectComposition({serveUrl,id:'V3-Review',inputProps,puppeteerInstance:browser});
  let last=-1;const started=Date.now();
  await renderMedia({serveUrl,composition:{...comp,durationInFrames:2613},inputProps,outputLocation:out,scale:3,codec:'h264',crf:12,audioCodec:'aac',audioBitrate:'320k',pixelFormat:'yuv420p',colorSpace:'bt709',concurrency:2,puppeteerInstance:browser,logLevel:'error',onProgress:p=>{let n=Math.floor(p.progress*20);if(n!==last){last=n;const line=JSON.stringify({percent:n*5,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,elapsedSeconds:Math.round((Date.now()-started)/1000)});console.log(line);fs.appendFileSync(path.join(run,'evidence/render_progress.jsonl'),line+'\n')}}});
  console.log('EXPORTED '+out);
 }finally{await browser.close({silent:true})}
})().catch(e=>{console.error(e);process.exit(1)});
