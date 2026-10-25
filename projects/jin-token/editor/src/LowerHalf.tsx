import React from 'react';
import {AbsoluteFill,Img,OffthreadVideo,Loop,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Poem} from './CaptionStudy';
import {lowerCues as cues} from './cue-model';
import timing from './upper-half.json';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const lower=(name:string)=>staticFile(`lower-half/${name}`);
const upper=(name:string)=>staticFile(`upper-half/${name}`);

export const PoetryGarden:React.FC=()=> <AbsoluteFill>
 <Img src={lower('B-approved-20261022.png')} style={{width:1280,height:720,objectFit:'fill'}}/>
 </AbsoluteFill>;

export const LowerThought:React.FC<{g:number;endFrame?:number}>=({g,endFrame=cues.end})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 if(g<cues.dream||g>=endFrame)return null;
 const mode=g<cues.singing?'dream':g<cues.granary?'singing':g<cues.refill?'granary':g<cues.proud?'refill':'proud';
 const opacity=interpolate(g,[cues.dream,cues.dream+15],[0,1],clamp);
 const window=(a:number,b:number)=>interpolate(g,[a,a+10,b-10,b],[0,1,1,0],clamp);
 const bridge=Math.max(...[cues.singing,cues.granary,cues.refill,cues.proud].map(s=>interpolate(g,[s-10,s,s+10],[0,1,0],clamp)));
 return <AbsoluteFill data-lower-thought={mode} style={{opacity,pointerEvents:'none'}}>
  <div data-thought-area="4:3" style={{position:'absolute',left:8,top:24,width:320,height:240}}>
  {mode!=='proud'&&<Img src={upper('paper-main-cut.png')} style={{position:'absolute',inset:0,width:320,height:240,objectFit:'contain',opacity:bridge}}/>}
  {mode==='dream'&&<Img src={lower('rice-dream-thought-v1.png')} style={{position:'absolute',inset:0,width:320,height:240,objectFit:'contain',opacity:window(cues.dream-10,cues.singing)}}/>}
  {mode==='singing'&&<div style={{position:'absolute',left:12,top:0,width:350,height:282,scale:.85,transformOrigin:'top left',opacity:window(cues.singing,cues.granary)}}>
   <Img src={upper('singing-frame-v2.png')} style={{position:'absolute',inset:0,width:350,height:282}}/>
   <Sequence from={frame-g+cues.singing} premountFor={fps}><Loop durationInFrames={180}><OffthreadVideo transparent src={upper('singing-clean-v2.webm')} muted style={{position:'absolute',left:35,top:7,width:280,height:270,objectFit:'contain'}}/></Loop></Sequence>
  </div>}
  {mode==='granary'&&<Img src={lower('granary-4x3-v21.png')} style={{position:'absolute',inset:0,width:320,height:240,objectFit:'contain',opacity:window(cues.granary,cues.refill)}}/>}
  {mode==='refill'&&<Img src={lower('refill-api-platform-v7.png')} style={{position:'absolute',inset:0,width:320,height:240,objectFit:'contain',opacity:window(cues.refill,cues.proud)}}/>}
  </div>
  {mode==='proud'&&<div data-token-ending style={{position:'absolute',left:8,top:24,width:320,height:240,maskImage:`url("${lower('token-plate-4x3-v21.png')}")`,maskSize:'100% 100%',maskRepeat:'no-repeat',opacity:interpolate(g,[cues.proud,cues.proud+10],[0,1],clamp)}}>
   <Img src={lower('token-plate-4x3-v21.png')} style={{position:'absolute',inset:0,width:320,height:240}}/>
   <div style={{position:'absolute',left:35,top:12,width:170,height:210,maskImage:'linear-gradient(90deg,transparent,#000 8%,#000 94%,transparent),linear-gradient(180deg,transparent,#000 5%,#000 94%,transparent)',maskComposite:'intersect'}}>
    <Sequence from={frame-g+cues.proud} premountFor={fps}>
     <Loop durationInFrames={151}><OffthreadVideo transparent src={lower('A48-foreground-cpu-v21.webm')} muted style={{width:170,height:210,objectFit:'contain'}}/></Loop>
    </Sequence>
   </div>
  </div>}
  <Img data-thought-pointer="large" src={upper('thought-dot-large.png')} style={{position:'absolute',left:185,top:292,width:34,height:25}}/>
  <Img data-thought-pointer="small" src={upper('thought-dot-small.png')} style={{position:'absolute',left:245,top:323,width:20,height:15}}/>
 </AbsoluteFill>;
};

export const LowerHalf:React.FC<{audio:boolean;sourceFrame?:number;thoughtEndFrame?:number}>=({audio,sourceFrame,thoughtEndFrame})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const g=sourceFrame??f+cues.start;
 return <AbsoluteFill><PoetryGarden/><Poem font="F1" globalFrame={g} scene="B" entryMode="mixed"/><LowerThought g={g} endFrame={thoughtEndFrame}/>
  {audio&&<Audio src={staticFile(timing.audioMaster)} trimBefore={timing.sceneEndFrames} premountFor={fps}/>}
 </AbsoluteFill>;
};

export const GardenGeminiReference:React.FC=()=> <PoetryGarden/>;
