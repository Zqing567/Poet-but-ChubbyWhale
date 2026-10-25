export function getLineState(line: {startFrame:number;endFrame:number}, frame:number): {phase:'unseen'|'entering'|'active'|'archiving'|'archived';entry:number;archive:number};
