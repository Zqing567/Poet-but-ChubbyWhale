import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
const source=(name:string)=>staticFile(`upper-half/${name}`);
// Only the cliff face is replaced. The original character, cap and open sea remain pixels from the baseline.
export const cliffPatch='M0 675 L439 675 L447 689 L486 692 L486 739 L526 754 L532 784 L571 805 L584 839 L622 855 L634 898 L682 900 L707 941 L0 941 Z';
// Keep the approved still until Gemini footage replaces the rejected GPU motion.
export const GpuBackdrop:React.FC<{g?:number}>=()=> <AbsoluteFill><Img src={source('gpu-scene-selected.png')} style={{width:'100%',height:'100%'}}/></AbsoluteFill>;
