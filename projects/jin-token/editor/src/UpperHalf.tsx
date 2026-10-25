import React from 'react';
import {AbsoluteFill,Img,OffthreadVideo,Sequence,Loop,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Poem} from './CaptionStudy';
import {GpuBackdrop} from './GpuBackdrop';
import timing from './upper-half.json';
import {lineCue,upperCues as cues} from './cue-model';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export type UpperProps={entryMode:'fade'|'wipe'|'pixel'|'mixed';gpu:'gpu-material'|'gpu-stack'|'gpu-hybrid';audio:boolean;reminder?:'new'|'small-original'};
const source=(name:string)=>staticFile(`upper-half/${name}`);
const restingCoin=(index:number)=>{
 const counts=[7,6,5,4,2];let local=index,row=0;while(local>=counts[row]){local-=counts[row];row++;}
 return {x:96+(local-(counts[row]-1)/2)*7,y:465-row*3};
};
export const TokenRain:React.FC<{g:number}>=({g})=>{
 const line=lineCue('L01');const duration=line.endFrame-line.startFrame;
 const onset=line.startFrame+duration*.16;const flight=Math.min(30,Math.max(18,duration*.25));const step=Math.max(1,(duration*.84-flight)/23);
 if(g<onset)return null;
 return <AbsoluteFill data-metal-coins style={{pointerEvents:'none'}}>
 {Array.from({length:24},(_,i)=>{
 const start=onset+i*step,land=start+flight,rest=restingCoin(i),age=g-start,t=age/flight;
 if(age<0)return null;
 if(g>=land)return <Img key={i} src={source('metal-token-v1.png')} style={{position:'absolute',left:rest.x-9,top:rest.y-9,width:18,height:18,scale:'1 .48',rotate:`${(i%3-1)*12}deg`}}/>;
 const x=(80+(i%5)*8)*(1-t)+rest.x*t+Math.sin(t*Math.PI)*(i%2?8:-8);
 const y=-24+(rest.y+24)*t*t;
 return <Img key={i} src={source('metal-token-v1.png')} style={{position:'absolute',left:x-12,top:y-12,width:24,height:24,scale:`${.18+.82*Math.abs(Math.cos(age*.22))} 1`,rotate:`${age*9+(i%3)*30}deg`}}/>;
 })}
 <svg width="1280" height="720" style={{position:'absolute',inset:0}}>
 {Array.from({length:6},(_,i)=>{const phase=(g-onset-flight-i*13)%57;if(phase<0||phase>10)return null;const x=76+(i%4)*12,y=449+(i%2)*7,size=Math.sin(phase/10*Math.PI)*5;return <path key={i} d={`M ${x-size} ${y} Q ${x} ${y-1} ${x} ${y-size} Q ${x+1} ${y} ${x+size} ${y} Q ${x} ${y+1} ${x} ${y+size} Q ${x-1} ${y} ${x-size} ${y}`} fill="#fffbe6" stroke="#ffe58b" strokeWidth=".5"/>})}
 </svg>
 </AbsoluteFill>;
};
export const ThoughtDots:React.FC=()=> <>
 <Img src={source('thought-dot-large.png')} style={{position:'absolute',left:154,top:266,width:29,height:20}}/>
 <Img src={source('thought-dot-small.png')} style={{position:'absolute',left:180,top:288,width:17,height:12}}/>
 </>;
export const ThoughtBubble:React.FC<{g:number;reminder?:UpperProps['reminder']}>=({g,reminder='new'})=>{
 const {fps}=useVideoConfig();if(g<cues.rice||g>=cues.end)return null;
 const look=g<cues.refill?'rice':g<cues.singing?'token':'singing';
 const opacity=interpolate(g,[cues.rice,cues.rice+15,cues.end-15,cues.end-1],[0,1,1,0],clamp);
 const windowOpacity=(start:number,end:number)=>interpolate(g,[start,start+10,end-10,end],[0,1,1,0],clamp);
 return <AbsoluteFill data-thought={look} style={{opacity,pointerEvents:'none'}}>
 <Img src={source('paper-main-cut.png')} style={{position:'absolute',left:25,top:12,width:385,height:245,opacity:Math.max(...[cues.refill,cues.singing].map(s=>interpolate(g,[s-10,s,s+10],[0,1,0],clamp)))}}/>
 {g<cues.refill&&<Img src={source('rice-integrated-v2.png')} style={{position:'absolute',left:5,top:3,width:415,height:260,objectFit:'contain',opacity:windowOpacity(cues.rice-10,cues.refill)}}/>}
 {g>=cues.refill&&g<cues.singing&&<AbsoluteFill style={{opacity:windowOpacity(cues.refill,cues.singing)}}>
  {reminder==='new'?<Img src={source('empty-basin-reminder-v2-caption.png')} style={{position:'absolute',left:5,top:3,width:415,height:260,objectFit:'contain'}}/>:<div style={{position:'absolute',left:75,top:10,width:320,height:248}}>
   <Img src={source('singing-frame-v2.png')} style={{position:'absolute',inset:0,width:320,height:248}}/>
   <div style={{position:'absolute',left:65,top:12,width:190,height:224,maskImage:'radial-gradient(ellipse 54% 57% at 50% 50%,#000 78%,transparent 100%)'}}>
    <Loop durationInFrames={151}><OffthreadVideo src={source('token-clean-v2.webm')} transparent muted style={{width:190,height:224,objectFit:'contain'}}/></Loop>
   </div>
  </div>}
 </AbsoluteFill>}
 {g>=cues.singing&&<div style={{position:'absolute',left:60,top:0,width:350,height:282,opacity:interpolate(g,[cues.singing,cues.singing+10],[0,1],clamp)}}>
  <Img src={source('singing-frame-v2.png')} style={{position:'absolute',inset:0,width:350,height:282}}/>
  <Sequence from={timing.poemOffsetFrames+cues.singing} premountFor={fps}><Loop durationInFrames={180}><OffthreadVideo src={source('singing-clean-v2.webm')} transparent muted style={{position:'absolute',left:35,top:7,width:280,height:270,objectFit:'contain'}}/></Loop></Sequence>
 </div>}
 <ThoughtDots/>
 </AbsoluteFill>;
};
export const UpperHalf:React.FC<UpperProps>=({entryMode,audio,reminder})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const g=f-timing.poemOffsetFrames;
 return <AbsoluteFill><GpuBackdrop g={g}/>
 {f>=30&&<AbsoluteFill style={{opacity:interpolate(f,[30,42],[0,1],clamp)}}><Poem font="F1" globalFrame={g} scene="A" entryMode={entryMode}/></AbsoluteFill>}
 <TokenRain g={g}/><ThoughtBubble g={g} reminder={reminder}/>
 {audio&&<Audio src={staticFile(timing.audioMaster)} premountFor={fps}/>}
 </AbsoluteFill>;
};
