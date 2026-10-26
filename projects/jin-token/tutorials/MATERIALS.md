# 图片、提示词和参考，从哪里取？

本页直接链接可公开文件，不另做下载包。想保存单张图，打开图片后保存原文件；保存提示词时优先取完整Markdown、TXT或JSON，别只复制正文节选。

## 角色与场景图片

| 内容 | 文件与说明 |
| --- | --- |
| 最终优化的诗人大肥鱼三视图 | [方案一](../assets/characters/final/诗人大肥鱼形象三视图.png) · [方案二](../assets/characters/final/诗人大肥鱼2.png)，两套保留造型 |
| 换装过程 | [经典皮输入](images/role-classic-cutout.png) · [古风v01](images/role-poet-v01.png) · [古风v02](images/role-poet-v02.png) |
| 三视图初版 | [第二场景大肥鱼](images/role-turnaround-initial.png)，视频发布后生成 |
| GPU海崖 | [自然底图](images/cliff-natural-selected.png) · [密集GPU候选](images/cliff-gpu-dense.png) · [正式背景](images/cliff-gpu-final.png) |
| 曲水局部 | [主角](images/garden-host-crop.png) · [下游饭碗](images/garden-bowls-crop.png)，从定稿实际裁切 |
| 心理纸云 | [粮仓图](images/thought-granary.png) · [片尾金币底图](images/thought-token-plate.png)，后者不含运动人物 |

项目大肥鱼改编图遵守CC BY-NC-SA 4.0，需署名、限非商业、改编同协议分享。原始设计与二次设计的署名、许可链接见[角色说明](../assets/CHARACTER_RIGHTS.md)与[本教程图像说明](IMAGE_NOTES.md)。这不等于声音、社区原GIF及其他角色都采用同一许可。

## 完整提示词与请求

| 用途 | 完整记录 |
| --- | --- |
| 配音 | [八份脱敏请求](voice/requests/) · [导演谱](voice/director-score.md) · [最小试音脚本](voice/try_voice.py) |
| 换装与透明边缘 | [初始立绘](prompts/02_character-cutouts.md) · [边缘修订](prompts/02_character-alpha-fix.md) |
| 三视图与修复 | [大肥鱼三视图](prompts/02_bigfish-turnaround.md) · [六角色Prompt](../assets/prompts/scene2-turnarounds.json) · [高保真修复](../assets/prompts/high-fidelity-refinement.txt) |
| 海崖 | [水岸初稿](prompts/03_riverbank-study.md) · [高崖](prompts/03_high-cliff.md) · [GPU加密](prompts/03_gpu-density.md) · [恢复石台](prompts/03_rock-platform.md) |
| 曲水 | [构图候选](prompts/04_garden-layout.md) · [Q版站姿](prompts/04_garden-chibi.md) · [两角色与分辨率修订](prompts/04_garden-identities.md) |
| 心理活动 | [早期候选Prompt](../assets/prompts/upper-candidate-prompts.json) · [4:3交接复现规格](prompts/06_cloud-reconstruction-spec.md) |
| 显卡动态实验 | [Gemini完整实验请求](prompts/06_gemini-gpu-experiment.md)，未用于首发 |

历史Prompt用于理解迭代，不保证一次生成同款。部分参考未公开、底层模型或参数未知的地方，文件均保留说明。新写的[Agent任务](agents/README.md)与历史请求分开保存。

## 代码与参数

字幕用[句稿时点](../editor/src/captions.json)、[布局](../editor/src/selected-layout.json)和[字体加载](../editor/src/Fonts.ts)；心理活动用[cue时点](../editor/src/cue-model.ts)；导出用[正式脚本](../editor/render-submission-4k.cjs)。完整安装步骤见[工程README](../editor/README.md)。

其他角色完整图、原歌曲、人声音色与部分表情不随此页提供。合法本地原媒体复现有独立入口，不用公开图像说明替代媒体许可。

[返回教程](README.md) · [逐图来源](image-sources.json)
