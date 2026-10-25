import React from 'react';
import {AbsoluteFill,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {UpperHalf} from './UpperHalf';
import {LowerHalf} from './LowerHalf';
import timing from './upper-half.json';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const FullReview:React.FC<{audio:boolean;audioSource?:string}>=({audio,audioSource})=>{
 const f=useCurrentFrame();const {fps,durationInFrames}=useVideoConfig();const g=f-timing.poemOffsetFrames;
 const cut=timing.sceneEndFrames;
 return <AbsoluteFill style={{background:'#f8f4ea'}}>
 {f<cut?<UpperHalf entryMode="mixed" gpu="gpu-hybrid" audio={false} reminder="new"/>:<LowerHalf audio={false} sourceFrame={g} thoughtEndFrame={durationInFrames-timing.poemOffsetFrames}/>}
 <AbsoluteFill style={{background:'#f8f4ea',opacity:interpolate(f,[cut-10,cut-1,cut,cut+8],[0,1,1,0],clamp)}}/>
 {audio&&<Audio src={staticFile(audioSource??timing.audioMaster)} premountFor={fps}/>}
 </AbsoluteFill>;
};
