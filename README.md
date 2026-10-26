# 大肥鱼的 AI 视频制作手记

大肥鱼站上显卡海崖吟诗，转头又邀 Claude、GPT 来一场“曲水流饭”。这里记下视频的做法：画面怎么改，声音怎么选，哪些地方试了几轮才顺。

## 第一部：《将进 token》

十二句诗，87.1秒。传统诗人的架势，讲的却是 token、显卡和白米饭。

<a href="projects/jin-token/README.md"><img src="projects/jin-token/assets/characters/final/诗人大肥鱼2.png" width="680" alt="《将进 token》衍生诗人皮大肥鱼，正面、侧面与背面三视图"></a>

*图为视频衍生的角色三视图。[看作品介绍与制作过程](projects/jin-token/README.md)；成片官方观看链接待作者补充。*

## 你想从哪里开始？

| 想看什么 | 从这里进入 |
| --- | --- |
| 了解《将进 token》讲了什么、怎么做 | [作品介绍](projects/jin-token/README.md) |
| 跟着试做一段朗诵 | [我们是怎么让大肥鱼开口吟诗的？](projects/jin-token/tutorials/01_voice.md) |
| 找人物图片与生图提示词 | [可公开的大肥鱼图片](projects/jin-token/assets/CHARACTER_RIGHTS.md) · [角色三视图提示词](projects/jin-token/assets/prompts/scene2-turnarounds.json) |
| 自己运行视频工程 | [安装、预览与渲染](projects/jin-token/editor/README.md) |

## 我们怎么做一条视频？

1. **先写诗和笑点。** 确定大肥鱼在想什么，哪些句子要认真念，哪些地方靠画面接梗。
2. **画角色与场景。** 用 AI 生成候选，再对着参考改比例、构图、服装和留白。两张主场景撑起整首诗。
3. **做声音。** 选好音色，分段生成配音，试听停顿、重音和英文读法；有问题的句子单独重做。
4. **把画面和声音接起来。** 字幕逐句出现，金币、心理气泡和动态表情配合诗句，最后留几秒让音乐收住。

现在先公开一篇完整的[配音教程样章](projects/jin-token/tutorials/01_voice.md)，里面保留真实模型、八份脱敏请求、导演谱和失败经过。海崖、曲水、角色、字幕与表情的做法已有[制作复盘](projects/jin-token/docs/EXPERIENCE.md)，样章确认后，再继续写其他分步教程。

后续大肥鱼作品也会记录在这里，每部作品有自己的页面。

<details>
<summary>开发者与素材使用说明</summary>

- [视频结构与技术模块](projects/jin-token/docs/README.md)、[实际构建与重渲染验证](reports/02_build_and_qc.md)。使用合法本地原媒体，已重渲染出与投稿定稿字节一致的4K文件；公开下载的演示使用占位图和静音，不是原片。
- [运行与交付资产清单](projects/jin-token/assets/asset-manifest.json)、[新增图片索引](projects/jin-token/assets/post-freeze-manifest.json)、[源码来源](projects/jin-token/code-provenance.json)、[迁移记录](docs/MIGRATION.md)。
- 图片、字体各有自己的许可，见[署名表](projects/jin-token/assets/ATTRIBUTIONS.md)。原歌曲、参考人声和未获再分发确认的表情不作为下载素材提供。代码许可证尚待作者选择，当前保留 `UNLICENSED`；具体见[素材政策](docs/ASSET_POLICY.md)。
- 想了解目录怎么组织，见[组织方法](docs/STRUCTURE.md)。

</details>

本轮图文样章：[角色形象](projects/jin-token/tutorials/02_character.md) · [显卡海崖](projects/jin-token/tutorials/03_cliff.md)（待作者审核）。[全部教程与Agent入口](projects/jin-token/tutorials/README.md)。
