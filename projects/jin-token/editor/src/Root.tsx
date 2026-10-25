import React from 'react';
import {Composition,Still,Folder} from 'remotion';
import {CaptionStudy,MemeStill,MemeDemo,Combo} from './CaptionStudy';
import {UpperHalf} from './UpperHalf';
import {GpuBackdrop} from './GpuBackdrop';
import upperTiming from './upper-half.json';
import {FullReview} from './FullReview';
import {LowerHalf,PoetryGarden,GardenGeminiReference} from './LowerHalf';
export const Root:React.FC=()=> <>
 <Folder name="Current-review">
  <Composition id="Lower-final" component={LowerHalf} durationInFrames={upperTiming.totalFrames-upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{audio:true}}/>
  <Still id="Garden-background" component={PoetryGarden} width={1280} height={720}/>
  <Still id="Garden-Gemini-reference" component={GardenGeminiReference} width={1280} height={720}/>
  <Still id="Gpu-background" component={GpuBackdrop} width={1672} height={941} defaultProps={{g:-75}}/>
  <Composition id="Upper-small-original" component={UpperHalf} durationInFrames={upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{entryMode:'mixed',gpu:'gpu-hybrid',audio:true,reminder:'small-original'}}/>
  <Composition id="V3-Review" component={FullReview} durationInFrames={upperTiming.totalFrames} fps={30} width={1280} height={720} defaultProps={{audio:true}}/>
  <Composition id="Upper-final" component={UpperHalf} durationInFrames={upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{entryMode:'mixed',gpu:'gpu-stack',audio:true}}/>
 </Folder>
 <Folder name="Upper-half-workshop">
  <Composition id="Upper-fade" component={UpperHalf} durationInFrames={upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{entryMode:'fade',gpu:'gpu-stack',audio:true}}/>
  <Composition id="Upper-wipe" component={UpperHalf} durationInFrames={upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{entryMode:'wipe',gpu:'gpu-stack',audio:true}}/>
  <Composition id="Upper-pixel" component={UpperHalf} durationInFrames={upperTiming.sceneEndFrames} fps={30} width={1280} height={720} defaultProps={{entryMode:'pixel',gpu:'gpu-stack',audio:true}}/>
 </Folder>
 <Folder name="Caption-studies">
  <Composition id="F1-A" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F1',art:'A1',offset:30,audio:true,freeze:null,showCaptions:true}}/>
  <Composition id="F1-B" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F1',art:'B1',offset:1074,audio:true,freeze:null,showCaptions:true}}/>
  <Composition id="F2-A" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F2',art:'A1',offset:30,audio:true,freeze:null,showCaptions:true}}/>
  <Composition id="F2-B" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F2',art:'B1',offset:1074,audio:true,freeze:null,showCaptions:true}}/>
  <Composition id="F3-A" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F3',art:'A1',offset:30,audio:true,freeze:null,showCaptions:true}}/>
  <Composition id="F3-B" component={CaptionStudy} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{font:'F3',art:'B1',offset:1074,audio:true,freeze:null,showCaptions:true}}/>
 </Folder>
 <Folder name="Layout-comparisons">
  {(['flat','gradient'] as const).flatMap(mask=>(['left','center'] as const).map(align=><Composition key={`${mask}-${align}`} id={`Layout-${mask}-${align}`} component={CaptionStudy} durationInFrames={2840} fps={30} width={1280} height={720} defaultProps={{font:'F1',art:'A1',offset:0,audio:true,freeze:null,showCaptions:true,mask,align}}/>))}
 </Folder>
 <Folder name="Review-stills">
  <Still id="Caption-checkpoint" component={CaptionStudy} width={1280} height={720} defaultProps={{font:'F1',art:'B1',offset:0,audio:false,freeze:2839,showCaptions:true}}/>
  <Still id="Scene-candidate" component={CaptionStudy} width={1280} height={720} defaultProps={{font:'F1',art:'A1',offset:0,audio:false,freeze:0,showCaptions:false}}/>
  <Still id="Meme-sample" component={MemeStill} width={1280} height={720} defaultProps={{mode:'M1',asset:'A09',art:'A1',globalFrame:280,font:'F1'}}/>
 </Folder>
 <Folder name="Motion-studies">
  <Composition id="M1-two-bubbles" component={MemeDemo} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{mode:'M1'}}/>
  <Composition id="M3-two-bubbles" component={MemeDemo} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{mode:'M3'}}/>
  <Composition id="C1-sea-to-stream" component={Combo} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{look:'C1'}}/>
  <Composition id="C2-classic-night" component={Combo} durationInFrames={450} fps={30} width={1280} height={720} defaultProps={{look:'C2'}}/>
 </Folder>
</>;
