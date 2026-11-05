import React from 'react';
import {AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// These simple drawings are blocking diagrams, not character or scene assets.
const motion = (time: number, start: number, end: number, from: number, to: number) =>
  interpolate(time, [start, end], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Text: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number}> =
  ({x, y, children, size = 22, fill = '#35424a', anchor = 'start', weight = 500}) =>
    <text x={x} y={y} fill={fill} textAnchor={anchor} fontFamily="Microsoft YaHei, sans-serif" fontSize={size} fontWeight={weight}>{children}</text>;

const Board: React.FC<{title: string; cue: string; children: React.ReactNode}> = ({title, cue, children}) => (
  <AbsoluteFill style={{backgroundColor: '#f6f3ec'}}>
    <svg viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="1280" height="720" fill="#f6f3ec" />
      <rect x="28" y="79" width="1224" height="528" rx="16" fill="#e9edf0" />
      <svg x="28" y="79" width="1224" height="528" viewBox="0 0 1224 528" overflow="hidden">{children}</svg>
      <Text x={36} y={45} size={22} weight={700}>第一节 · 动画逻辑示意</Text>
      <Text x={1240} y={45} size={17} fill="#717b80" anchor="end">示意图 / 无配音 / 时长待定</Text>
      <Text x={38} y={652} size={27} weight={700}>{title}</Text>
      <Text x={38} y={687} size={19} fill="#69777d">{cue}</Text>
    </svg>
  </AbsoluteFill>
);

const Room: React.FC = () => <>
  <rect width="1224" height="528" fill="#e9e2d4" />
  <rect y="385" width="1224" height="143" fill="#cbbca5" />
  <rect x="40" y="45" width="350" height="270" rx="8" fill="#bed2d4" stroke="#7f9292" strokeWidth="8" />
  <path d="M215 49 V312 M44 181 H386" stroke="#eaf1ed" strokeWidth="7" />
  <rect x="70" y="337" width="660" height="26" rx="3" fill="#866e58" />
  <path d="M95 363 V488 M705 363 V488" stroke="#725b49" strokeWidth="15" />
  <rect x="225" y="201" width="165" height="108" rx="6" fill="#465862" />
  <rect x="236" y="212" width="143" height="85" fill="#8ca2a7" />
  <path d="M308 309 V335 M276 335 H340" stroke="#465862" strokeWidth="8" />
  <rect x="260" y="324" width="110" height="12" rx="4" fill="#566267" />
  <path d="M490 310 Q560 293 580 337 V433 H473 V345 Q471 320 490 310Z" fill="#829195" />
  <path d="M523 433 V487 M475 491 H570" stroke="#596b70" strokeWidth="10" />
  <Text x={55} y={38} size={17} fill="#6d7c7d">工位</Text>
</>;

const Yard: React.FC = () => <>
  <rect width="1224" height="528" fill="#dce8e2" />
  <rect y="110" width="1224" height="276" fill="#c7ccc1" />
  <path d="M0 250 H1224 M260 110 V250 M820 250 V386" stroke="#b6beb5" strokeWidth="3" />
  <rect y="386" width="1224" height="142" fill="#c7b9a3" />
  <path d="M0 464 Q320 435 605 464 T1224 456" fill="none" stroke="#b8aa94" strokeWidth="3" />
  <Text x={45} y={39} size={17} fill="#667b73">院落 · 固定空间关系</Text>
</>;

const Crate: React.FC = () => <g>
  <rect x="952" y="304" width="195" height="126" rx="5" fill="#ad8b65" stroke="#806548" strokeWidth="5" />
  <path d="M963 317 L1138 418 M1138 317 L963 418" stroke="#937350" strokeWidth="5" />
  <Text x={1050} y={455} size={17} anchor="middle" fill="#695f51">木箱</Text>
</g>;

const Girl: React.FC<{x: number; y: number; arms?: 'typing' | 'carry' | 'cover' | 'ears' | 'still'; showAhoge?: boolean; gaze?: number; stride?: number}> = ({x, y, arms = 'still', showAhoge = true, gaze = 0, stride = 0}) => <g transform={`translate(${x} ${y})`}>
  <ellipse cx="0" cy="0" rx="45" ry="8" fill="#617474" opacity="0.16" />
  <path d="M-24 -88 Q-48 -59 -53 -16 Q0 -2 53 -16 Q48 -59 24 -88Z" fill="#e5f0ef" stroke="#4e718a" strokeWidth="4" />
  <path d={`M-21 -18 L${-21 + stride} -3 M21 -18 L${21 - stride} -3`} stroke="#4e718a" strokeWidth="6" strokeLinecap="round" />
  <circle cx="0" cy="-121" r="38" fill="#f5d9c7" stroke="#4e718a" strokeWidth="4" />
  <path d="M-38 -128 Q-32 -169 0 -163 Q37 -166 38 -128 Q10 -147 -8 -130 Q-25 -136 -38 -128Z" fill="#47759d" />
  <path d="M-30 -138 Q-49 -89 -48 -55 M30 -138 Q49 -89 48 -55" fill="none" stroke="#47759d" strokeWidth="12" strokeLinecap="round" />
  {showAhoge && <path d="M0 -158 Q3 -186 19 -183 Q30 -179 21 -169" fill="none" stroke="#47759d" strokeWidth="5" strokeLinecap="round" />}
  <circle cx={-12 + gaze} cy="-121" r="3" fill="#35424a" /><circle cx={12 + gaze} cy="-121" r="3" fill="#35424a" />
  {arms === 'ears' ? <path d="M-22 -78 L-43 -119 M22 -78 L43 -119" fill="none" stroke="#4e718a" strokeWidth="6" strokeLinecap="round" /> :
    <path d={arms === 'typing' ? 'M-22 -76 L-65 -63 M22 -76 L-32 -63' : arms === 'cover' ? 'M-22 -76 L-50 -38 M22 -76 L54 -38' : arms === 'carry' ? 'M-22 -76 L7 -66 M22 -76 L48 -65' : 'M-25 -75 L-45 -37 M25 -75 L45 -37'} fill="none" stroke="#4e718a" strokeWidth="6" strokeLinecap="round" />}
</g>;

const Basin: React.FC<{x: number; y: number; broken?: boolean; inverted?: boolean; scale?: number; angle?: number; ahoge?: boolean}> = ({x, y, broken = false, inverted = true, scale = 1, angle = 0, ahoge = false}) => <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale} ${inverted ? scale : -scale})`}>
  <path d="M-54 0 Q-52 -63 0 -71 Q52 -63 54 0 Z" fill="#c4cbcc" stroke="#64777d" strokeWidth="4" />
  <path d="M-56 0 H56" stroke="#52676e" strokeWidth="7" strokeLinecap="round" />
  <path d="M-42 -13 Q-32 -19 -27 -14" stroke="#7f9295" strokeWidth="3" fill="none" />
  {broken && <ellipse cx="0" cy="-65" rx="10" ry="5" fill="#617175" stroke="#46565b" strokeWidth="2" />}
  {ahoge && <path d="M0 -65 Q3 -97 19 -93 Q30 -89 20 -79" fill="none" stroke="#47759d" strokeWidth="5" strokeLinecap="round" />}
</g>;

const Thought: React.FC<{opacity: number}> = ({opacity}) => <g opacity={opacity}>
  <circle cx="680" cy="205" r="8" fill="#fff" stroke="#b3aaa0" strokeWidth="3" />
  <circle cx="714" cy="184" r="13" fill="#fff" stroke="#b3aaa0" strokeWidth="3" />
  <rect x="740" y="43" width="340" height="162" rx="65" fill="#fffdf9" stroke="#b3aaa0" strokeWidth="4" />
  <circle cx="808" cy="123" r="38" fill="#e9b58e" stroke="#b36e44" strokeWidth="3" />
  <path d="M772 117 Q776 75 808 78 Q842 77 845 117 Q825 100 804 106 Q788 103 772 117Z" fill="#c96f3e" />
  <Text x={868} y={115} size={21} weight={700}>Claude 气泡</Text>
  <Text x={868} y={151} size={18}>「老实编程，很枯燥吧？」</Text>
</g>;

const Workspace: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  return <Board title="01 / 工位：疲倦，气泡闪现" cue="小汐看着电脑，注意到旁边的铁盆。">
    <Room /><Basin x={670} y={335} inverted={false} scale={0.68} />
    <Girl x={520} y={405} arms="typing" gaze={motion(t, 2.2, 2.8, 0, 5)} /><Thought opacity={motion(t, 0.7, 1.1, 0, 1) * motion(t, 3.2, 3.7, 1, 0)} />
  </Board>;
};

const Depart: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const x = motion(t, 0.7, 2.45, 520, 1285);
  const bx = t < 0.7 ? motion(t, 0, 0.7, 670, 570) : x + 50;
  const by = t < 0.7 ? motion(t, 0, 0.7, 335, 330) : 330;
  return <Board title="02 / 拿盆离开" cue="小汐拿起工位上的同一只盆，向右跑出；下一镜从左进入院落。">
    <Room /><Girl x={x} y={405} arms="carry" stride={t > 0.7 ? Math.sin(t * 14) * 9 : 0} /><Basin x={bx} y={by} inverted={false} scale={0.68} />
  </Board>;
};

const CoverAndHide: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const x = t < 1.0 ? motion(t, 0, 1.0, 40, 555) : motion(t, 2.0, 3.5, 555, 1000);
  const bx = t < 1.5 ? x + 50 : motion(t, 1.5, 2, 605, 615);
  const by = t < 1.5 ? 310 : motion(t, 1.5, 2, 310, 390);
  return <Board title={t < 2 ? '03 / 院落：盖住鞭炮' : '04 / 退到木箱旁'} cue={t < 2 ? '道具已经在地上；动作直接从盖盆开始。' : '小汐退开并捂耳朵，留一拍等待。'}>
    <Yard />
    {t < 2 && <g><rect x="590" y="375" width="50" height="14" rx="5" fill="#d6755c" /><Text x={615} y={429} size={16} fill="#835f55" anchor="middle">预置鞭炮</Text></g>}
    <Basin x={bx} y={by} scale={0.75} inverted={t >= 1.5} />
    <Girl x={x} y={405} arms={t < 1.5 ? 'carry' : t < 2.1 ? 'cover' : 'ears'} stride={t < 1 || (t > 2 && t < 3.5) ? Math.sin(t * 14) * 9 : 0} /><Crate />
  </Board>;
};

const Blast: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const y = motion(t, 0.3, 1.5, 390, -120);
  const burst = t > 0.22 && t < 0.75;
  return <Board title="05 / 爆响，盆飞底破" cue="爆炸后期表现：盆向上飞，一片铁片与盆分离。">
    <Yard /><Girl x={1000} y={405} arms="ears" /><Crate />
    {burst && <g><circle cx="615" cy="370" r={motion(t, 0.22, 0.75, 12, 95)} fill="#ecd49a" opacity={motion(t, 0.22, 0.75, 0.8, 0)} /><Text x={720} y={325} size={30} weight={700} fill="#b55e48">砰</Text></g>}
    <Basin x={615} y={y} scale={0.75} broken={t >= 0.3} />
    {t >= 0.35 && <path d={`M${motion(t, 0.35, 1.5, 600, 355)} ${motion(t, 0.35, 1.5, 340, 140)} l24 -8 l-9 21 z`} fill="#92a0a2" stroke="#627277" strokeWidth="3" />}
  </Board>;
};

const Sky: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  return <Board title="06 / 天空：盆与铁片分开" cue="能看清同一只盆的破口；铁片飞出画外。">
    <rect width="1224" height="528" fill="#cfe0e5" />
    <path d="M105 112 Q155 82 198 113 Q230 93 265 122 M840 85 Q889 58 933 88 Q970 68 1010 98" fill="none" stroke="#edf4f2" strokeWidth="15" strokeLinecap="round" />
    <Basin x={motion(t, 0, 2.3, 510, 840)} y={motion(t, 0, 2.3, 550, -100)} angle={motion(t, 0, 2.3, -25, 70)} broken scale={1.05} />
    <path d={`M${motion(t, 0, 2.1, 445, 20)} ${motion(t, 0, 2.1, 355, 190)} l31 -12 l-11 27 z`} fill="#99a8aa" stroke="#607176" strokeWidth="3" />
  </Board>;
};

const ReturnAndLand: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const x = motion(t, 0.1, 1.35, 1000, 720);
  const landed = t >= 3.05;
  const y = motion(t, 2.4, 3.05, -100, 270);
  const shadowOpacity = motion(t, 1.65, 2.1, 0, 0.4) * motion(t, 2.6, 3.0, 1, 0);
  return <Board title={landed ? '08 / 破盆扣头，呆毛露出' : '07 / 回到院落，头顶出现阴影'} cue="先停一拍，再从画外落盆；破口对应前一镜，呆毛从同一破口伸出。">
    <Yard /><Girl x={x} y={405} showAhoge={!landed} /><Crate />
    <ellipse cx={720} cy={290} rx={70} ry={13} fill="#5e6e6c" opacity={shadowOpacity} />
    {t >= 2.4 && <Basin x={720} y={y} scale={0.85} broken ahoge={landed} />}
    {landed && <Text x={820} y={267} size={28} weight={700} fill="#a96d4d">当</Text>}
  </Board>;
};

const End: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return <Board title="09 / 收尾：铁片已消失" cue="小汐僵住，望向空中；这里收住第一节。">
    <Yard /><Girl x={720} y={405} showAhoge={false} gaze={motion(t, 0.3, 1.0, 0, 5)} /><Crate /><Basin x={720} y={270} scale={0.85} broken ahoge />
    <Text x={878} y={166} size={20} fill="#81928d">空中已没有铁片</Text>
  </Board>;
};

export const LogicPreview: React.FC = () => {
  const {fps} = useVideoConfig();
  return <Series>
    <Series.Sequence name="01 工位与气泡" durationInFrames={4 * fps} premountFor={fps}><Workspace /></Series.Sequence>
    <Series.Sequence name="02 拿盆跑出" durationInFrames={2.5 * fps} premountFor={fps}><Depart /></Series.Sequence>
    <Series.Sequence name="03 盖盆退开" durationInFrames={4.5 * fps} premountFor={fps}><CoverAndHide /></Series.Sequence>
    <Series.Sequence name="04 爆炸起飞" durationInFrames={1.6 * fps} premountFor={fps}><Blast /></Series.Sequence>
    <Series.Sequence name="05 天空飞盆" durationInFrames={2.4 * fps} premountFor={fps}><Sky /></Series.Sequence>
    <Series.Sequence name="06 扣头" durationInFrames={4 * fps} premountFor={fps}><ReturnAndLand /></Series.Sequence>
    <Series.Sequence name="07 铁片消失" durationInFrames={2 * fps} premountFor={fps}><End /></Series.Sequence>
  </Series>;
};
