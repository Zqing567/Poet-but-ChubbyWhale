export const getLineState = (line, frame) => {
  if (frame < line.startFrame) return {phase: 'unseen', entry: 0, archive: 0};
  if (frame < line.startFrame + 10) return {phase: 'entering', entry: (frame-line.startFrame)/10, archive: 0};
  if (frame < line.endFrame) return {phase: 'active', entry: 1, archive: 0};
  if (frame < line.endFrame + 18) return {phase: 'archiving', entry: 1, archive: (frame-line.endFrame)/18};
  return {phase: 'archived', entry: 1, archive: 1};
};
