# 教程中用到的图片与示意

前两篇样章只挑选与角色、海崖修改直接有关的项目图片，复用已经记录的角色署名与作者提供的CC BY-NC-SA 4.0声明。没有重做整个工程的素材清点，也没有搬入外部摄影、古画扫描、来源绘制者未核实的原始三视图、其他五位角色原图或声音。

## 署名与许可

- 原始鲸鱼娘设计：上善无形／上善；DeepSeek拟人二次设计：ZipZipPipe。原帖、许可依据见[现有角色说明](../assets/CHARACTER_RIGHTS.md)。
- 本项目角色换装、场景、后续三视图及图像迭代：Zqing567，AI辅助制作。
- 本页列入的项目改编图按 **CC BY-NC-SA 4.0** 分享，保留上述署名、[许可链接](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)及改编说明；不代表原参考文件也能整包再分发。
- 角色、海崖样章没有重新生成图片。九张展示原件按原字节复制；两张石台局部图仅裁切，矩形范围为原图 `(0,550)–(650,850)`，没有补画或调色。

## 图片与阶段

| 图号 | 文件 | 怎么看 |
| --- | --- | --- |
| ROLE-REF | [经典皮透明图](images/role-classic-cutout.png) | 项目AI重绘的经典皮输入，不能称为上游画师原图 |
| ROLE-01 | [古风v01](images/role-poet-v01.png) | 早期生成，有明显光晕与边缘处理问题 |
| ROLE-02 | [古风v02](images/role-poet-v02.png) | 以经典皮轮廓为锚的换装修订，早期同景换皮使用；不是最终影片中的独立人物图层 |
| ROLE-03 | [三视图初版](images/role-turnaround-initial.png) | 2026-10-25发布后的衍生图，未进入10月23日影片 |
| — | [最终优化图](../assets/characters/final/诗人大肥鱼2.png) | 已公开的后期优化方案；另一套最终造型也独立保留，不能混当同图去噪前后 |
| CLIFF-01 | [早期水岸图](images/cliff-riverbank-study.png) | V2早期方向，展示低水岸与远山为何不像海崖 |
| CLIFF-02 | [高断崖候选](images/cliff-high-candidate.png) | V3重新研究地理空间后的候选，非最终构图 |
| CLIFF-03 | [作者选定自然底图](images/cliff-natural-selected.png) | 作者提供并选定；原创建工具和完整Prompt未记录，不替它补写模型与参数 |
| CLIFF-04 | [GPU密集版](images/cliff-gpu-dense.png) | 有对应实际生图记录，脚下石台随后还需修订 |
| CLIFF-05 | [正式GPU背景](images/cliff-gpu-final.png) | 改图后局部合成，正式片加载的静态背景；不带字幕、金币或气泡 |
| 裁切图 | [修改前](images/cliff-platform-before.png)／[修改后](images/cliff-platform-after.png) | 分别取自CLIFF-04/05，方便看站面；不是另外两次生成 |

每张图的源文件映射、尺寸、透明通道与哈希保存在[图片来源记录](image-sources.json)。新增公开路径另加到原资产清单末尾，不改变原来的运行映射。

## 没有冒充历史原图的部分

角色比例被拉长、古风服装误变洛丽塔、夕阳高光被画成珍珠，来自已有作者反馈与复盘；没有找到能明确逐项对应的原始错误图，就不把其他候选硬贴成这些错误。ROLE-01只用来讲实际可见的服装层次、光晕和透明边缘问题。

作者红线裁切和手绘标注原件本轮未找回；本次只引用真实请求里记录的近景、右移、人物位置等要求。高崖候选、后续右崖研究与最终左崖是不同阶段，不能画成一条“从不改变构图的连续编辑”。

清水断崖、莫赫断崖、鲸的呼吸照片以及古画只提供已有来源链接，借它们解释空间、留白或动作；本仓库没有因此取得摄影文件的公开分发权。

## 完整版续作新增图（2026-10-27）

新增8张PNG：3张历史素材原字节复制、2张定稿实际裁切、3张当前字幕层重绘。沿用本页署名与逐项许可，不增加其他角色完整形象、社区GIF、声音或外部画作。

| 文件 | 来源与处理 |
| --- | --- |
| [早期无人河景](images/garden-river-study.png) | `lower-half/B-grand-river-v1.png`，原件；不是湖畔群像错误图，未定位逐字生成Prompt |
| [主角局部](images/garden-host-crop.png) | `B-approved-20261022.png`，矩形(350,400)–(610,720)，只裁切；非独立立绘 |
| [下游饭碗](images/garden-bowls-crop.png) | 同一定稿，矩形(450,745)–(675,930)，只裁切；不展示全画面数量 |
| [片尾纸云](images/thought-token-plate.png) | `token-plate-4x3-v21.png`，原件；没有运动人物 |
| [粮仓纸云](images/thought-granary.png) | `granary-4x3-v21.png`，原件；均有历史交接规格与生成素材记录 |
| [第一句](images/captions-first-line.png)／[五句末态](images/captions-scene-a-complete.png)／[七句末态](images/captions-scene-b-complete.png) | 本轮用未改`Poem`组件在第120/1050/2500帧实际重绘，只显示纸色与字幕；不包含原影片背景、表情或声音。字体按仓库原许可加载 |

另有两张新SVG教学示意：[曲水位置](images/garden-seating.svg)、[片尾分层](images/motion-layers.svg)。均为当前依据源码/定稿整理，非历史手绘或成片截图，不包含角色绘画。文字图表为项目教程原创，按本页项目图同协议分享。

字幕图的具体帧点与生成方法见[逐图记录](image-sources.json)。它们只证明现有字幕组件的渲染，不证明本轮重新导出或验收了整部视频。
