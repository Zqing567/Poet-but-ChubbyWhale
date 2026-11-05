import React from 'react';
import {Composition} from 'remotion';
import {LogicPreview} from './LogicPreview';

export const Root: React.FC = () => (
  <Composition id="Tiepen-Logic" component={LogicPreview} durationInFrames={630} fps={30} width={1280} height={720} />
);
