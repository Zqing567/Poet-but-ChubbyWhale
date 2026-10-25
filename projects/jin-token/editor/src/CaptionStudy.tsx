import React from 'react';
import {AbsoluteFill,CanvasImage,Img,AnimatedImage,staticFile,useCurrentFrame,useVideoConfig,interpolate,Sequence} from 'remotion';
import {Audio} from '@remotion/media';
import captions from './captions.json';
import {getLineState} from './caption-model.mjs';
import './Fonts';
import selectedLayout from './selected-layout.json';

export type StudyProps={font:'F1'|'F2'|'F3';art:'A1'|'A2-poet'|'A2-classic'|'A3'|'B1'|'B2';offset:number;audio:boolean;freeze:number|null;showCaptions:boolean;mask?:'flat'|'gradient';align?:'left'|'center'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const Art:React.FC<{art:StudyProps['art']}>=({art})=>{
 const cutout=art==='A2-poet'||art==='A2-classic';
 return <AbsoluteFill><CanvasImage src={staticFile(`art/${cutout?'A2-base':art==='A1'?'A-selected':art}.png`)} style={{width:1280,height:720,objectFit:'fill'}} />
 {cutout&&<Img src={staticFile(`art/${art}-sprite.png`)} style={{position:'absolute',left:331,top:202,width:129,height:150}}/>}
 </AbsoluteFill>;
};

export const Poem:React.FC<{font:StudyProps['font'];globalFrame:number;scene:'A'|'B';venue?:string;mask?:'flat'|'gradient';align?:'left'|'center';entryMode?:'fade'|'wipe'|'pixel'|'mixed'}>=({font,globalFrame,scene,mask,align,entryMode='fade'})=>{
 const c=selectedLayout[scene];
 const selectedFont=c.font||font;const family=selectedFont==='F1'?'Fusion':selectedFont==='F2'?'Cubic':'WenKai';
 const activeMask=mask??c.maskMode,activeAlign=align??c.align;
 const rgb=c.maskColor.match(/\w\w/g)!.map(n=>parseInt(n,16)).join(',');const alpha=c.maskOpacity/100;
 return <AbsoluteFill data-poem-scene={scene} data-mask={activeMask} data-align={activeAlign}>
  <div data-poem-mask style={{position:'absolute',left:c.maskX,top:0,width:c.maskWidth,height:720,background:activeMask==='flat'?`rgba(${rgb},${alpha})`:`linear-gradient(90deg,rgba(${rgb},0),rgba(${rgb},${alpha*3/7}) 20%,rgba(${rgb},${alpha}) 55%,rgba(${rgb},${alpha*11/14}))`}} />
  {scene==='A'&&<>
  <div data-poem-title style={{position:'absolute',left:c.titleX,top:c.titleY,width:c.titleWidth,textAlign:'center',fontFamily:family,fontSize:c.titleSize,lineHeight:`${c.titleSize+10}px`,color:'#294957'}}>将进 token</div>
  <div data-poem-author style={{position:'absolute',left:c.authorX,top:c.authorY,width:c.authorWidth,textAlign:'center',fontFamily:family,fontSize:c.authorSize,color:'#526b72'}}>[DeepSeek]大肥鱼</div>
  <div style={{position:'absolute',left:c.authorX+90,top:c.authorY+c.authorSize+20,width:Math.max(0,c.authorWidth-180),height:1,background:'#466574',opacity:.16}} />
  </>}
  {captions.filter(c=>c.scene===scene).map(c=>{
   const state=getLineState(c,globalFrame);if(state.phase==='unseen')return null;
   const rows=scene==='B'?c.rows:[c.text];const display=rows.join('\n');
   const extraRows=scene==='B'?captions.filter(x=>x.scene===scene&&x.slot<c.slot).reduce((n,x)=>n+Math.max(0,x.rows.length-1),0):0;
   const y=selectedLayout[scene].poemY+c.slot*selectedLayout[scene].gap+extraRows*(selectedLayout[scene].poemSize+10);
   const entry=Math.min(1,Math.max(0,(globalFrame-c.startFrame)/18));
   const mode=entryMode==='mixed'?(['wipe','pixel','fade','wipe','pixel','fade','wipe','fade','pixel','fade','wipe','pixel'] as const)[captions.findIndex(x=>x.id===c.id)]:entryMode;
   return <div key={c.id} data-line-id={c.id} data-phase={state.phase} data-entry-mode={mode} style={{position:'absolute',left:selectedLayout[scene].poemX,width:selectedLayout[scene].poemWidth,top:y,fontFamily:family,fontSize:selectedLayout[scene].poemSize,lineHeight:`${selectedLayout[scene].poemSize+10}px`,textAlign:activeAlign as 'left'|'center',color:'#153b4d',opacity:mode==='fade'?entry:1,clipPath:mode==='wipe'?`inset(0 ${(1-entry)*100}% 0 0)`:undefined,whiteSpace:'pre',fontWeight:400,letterSpacing:0,fontKerning:'none',textShadow:'0 1px 2px rgba(247,244,232,.65)'}}>
    <span data-poem-line>{mode==='pixel'?Array.from(display).map((ch,i)=><span key={i} style={{opacity:i<Math.ceil(entry*display.length)?1:0}}>{ch}</span>):display}</span>
   </div>;
  })}
 </AbsoluteFill>;
};
export const CaptionStudy:React.FC<StudyProps>=({font,art,offset,audio,freeze,showCaptions,mask,align})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const g=freeze??frame+offset;
 return <AbsoluteFill><Art art={art}/>{showCaptions&&<Poem font={font} globalFrame={g} scene={art.startsWith('A')?'A':'B'} venue={art==='B2'?'月下夜宴':'曲水诗会'} mask={mask} align={align}/>} {audio&&freeze===null&&<Audio src={staticFile('audio/frozen_mix.wav')} trimBefore={offset} premountFor={fps}/>}</AbsoluteFill>;
};
export type MemeProps={mode:'M1'|'M3';asset:'A09'|'A03'|'A37'|'A15';art:StudyProps['art'];globalFrame:number;font:StudyProps['font']};
export const MemeCard:React.FC<{mode:'M1'|'M3';asset:MemeProps['asset'];opacity?:number;lift?:number}>=({mode,asset,opacity=1,lift=0})=>{
 const m1=mode==='M1';const src=asset==='A03'?'A03.jpeg':asset==='A09'?'A09.jpg':'A37.png';
 return <div style={{position:'absolute',left:m1?70:55,top:350+lift,width:314,height:314,padding:m1?18:10,boxSizing:'border-box',background:m1?'#f5f1e7':'#fff',border:m1?'1px solid rgba(119,136,139,.25)':'3px solid #253d53',borderRadius:m1?36:2,boxShadow:m1?'0 0 32px 20px rgba(249,246,235,.75)':'7px 7px 0 rgba(31,61,81,.14)',opacity,rotate:m1?'0deg':'-2deg'}}>
  {m1&&<><div style={{position:'absolute',right:22,top:-22,width:14,height:14,borderRadius:'50%',background:'#f5f1e7',border:'1px solid #b0bbba'}}/><div style={{position:'absolute',right:8,top:-45,width:8,height:8,borderRadius:'50%',background:'#f5f1e7',border:'1px solid #b0bbba'}}/></>}
  {asset==='A15'?<AnimatedImage src={staticFile('memes/A15.gif')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<CanvasImage src={staticFile(`memes/${src}`)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>}
 </div>;
};
export const MemeStill:React.FC<MemeProps>=({mode,asset,art,globalFrame,font})=><AbsoluteFill><Art art={art}/><Poem font={font} globalFrame={globalFrame} scene={art.startsWith('A')?'A':'B'}/><MemeCard mode={mode} asset={asset}/></AbsoluteFill>;
export const MemeDemo:React.FC<{mode:'M1'|'M3'}>=({mode})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const second=f>=225;const local=second?f-225:f;const g=second?709+local:229+local;
 const opacity=interpolate(local,second?[20,34,140,160]:[20,34,166,186],[0,1,1,0],clamp);
 return <AbsoluteFill><Art art="A1"/><Poem font="F1" globalFrame={g} scene="A"/><MemeCard mode={mode} asset={second?'A03':'A09'} opacity={opacity} lift={interpolate(local,[20,34],[8,0],clamp)}/>
  <Sequence durationInFrames={225} premountFor={fps}><Audio src={staticFile('audio/frozen_mix.wav')} trimBefore={229} premountFor={fps}/></Sequence>
  <Sequence from={225} durationInFrames={225} premountFor={fps}><Audio src={staticFile('audio/frozen_mix.wav')} trimBefore={709} premountFor={fps}/></Sequence>
 </AbsoluteFill>;
};
export const Combo:React.FC<{look:'C1'|'C2'}>=({look})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const g=900+f;const scene=g<1065?'A':'B';
 return <AbsoluteFill><Art art={scene==='A'?(look==='C1'?'A1':'A2-classic'):(look==='C1'?'B1':'B2')}/><AbsoluteFill style={{background:'#f8f4ea',opacity:interpolate(g,[1054,1064,1065,1076],[0,1,1,0],clamp)}}/><Poem font={look==='C1'?'F1':'F3'} globalFrame={g} scene={scene} venue={look==='C2'?'月下夜宴':'曲水诗会'}/><Audio src={staticFile('audio/frozen_mix.wav')} trimBefore={900} premountFor={fps}/></AbsoluteFill>;
};
