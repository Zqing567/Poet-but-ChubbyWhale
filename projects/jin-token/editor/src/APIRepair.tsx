import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import config from './api-repair.json';

/** Original banknote bitmaps on counter planes; no generated replacements. */
export const APIRepair:React.FC=()=> <AbsoluteFill>
 <Img src={staticFile(config.plate)} style={{position:'absolute',inset:0,width:config.width,height:config.height}}/>
 {config.notes.map(n=><Img key={n.id} src={staticFile(n.src)} style={{position:'absolute',left:0,top:0,width:n.width,height:n.height,transformOrigin:'0 0',transform:`matrix3d(${n.matrix.join(',')})`,backfaceVisibility:'hidden'}}/>)}
 {config.foreground.length>0&&<svg width={config.width} height={config.height} style={{position:'absolute',inset:0}}>
  <defs><clipPath id="api-hand-foreground">{config.foreground.map((p,i)=><path key={i} d={p}/>)}</clipPath></defs>
  <image href={staticFile(config.plate)} width={config.width} height={config.height} clipPath="url(#api-hand-foreground)"/>
 </svg>}
 </AbsoluteFill>;
