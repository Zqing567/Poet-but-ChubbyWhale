import captions from './captions.json';
import timing from './upper-half.json';
export const lineCue=(id:string)=>{
 const c=captions.find(x=>x.id===id);
 if(!c)throw new Error(`Missing frozen poem line: ${id}`);
 return c;
};
export const upperCues={
 rice:lineCue('L02').startFrame,
 refill:lineCue('L04').startFrame,
 singing:lineCue('L05').startFrame,
 end:timing.sceneEndFrames-timing.poemOffsetFrames,
};
const dream=lineCue('L08');const ending=lineCue('L12');
export const lowerCues={
 start:timing.sceneEndFrames-timing.poemOffsetFrames,
 riceEnd:lineCue('L07').endFrame,
 dream:Math.round(dream.startFrame+(dream.endFrame-dream.startFrame)*.43),
 singing:timing.songStartFrame,
 granary:lineCue('L10').startFrame,
 refill:lineCue('L11').startFrame,
 proud:ending.startFrame,
 end:timing.totalFrames-timing.poemOffsetFrames,
};
