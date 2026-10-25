import {loadFont} from '@remotion/fonts';
import {delayRender,continueRender,cancelRender,staticFile} from 'remotion';
const handle=delayRender('加载三种已核验本地字体');
Promise.all([
  loadFont({family:'Fusion',url:staticFile('fonts/fusion-pixel-12px-monospaced-zh_hans.otf')}),
  loadFont({family:'Cubic',url:staticFile('fonts/Cubic_11.ttf')}),
  loadFont({family:'WenKai',url:staticFile('fonts/LXGWWenKaiScreen.ttf')}),
]).then(()=>continueRender(handle)).catch(cancelRender);
