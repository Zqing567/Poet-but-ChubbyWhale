# Poet but ChubbyWhale 🐟

**大肥鱼诗歌、角色表演与视频创作工程的长期公开仓库。** 不是《将进 token》的一次性项目。

首个归档项目：[《将进 token》](projects/jin-token/README.md)。

## 从这里开始

| 我想做什么 | 入口 |
| --- | --- |
| 看《将进 token》的叙事结构、技术模块与制作方法 | [项目文档](projects/jin-token/docs/README.md) |
| 阅读真实 Remotion 制作源码 | [editor](projects/jin-token/editor) |
| 学习海崖、曲水、字幕、声音和动效的经验 | [创作经验](projects/jin-token/docs/EXPERIENCE.md) |
| 了解为什么按三层来组织工程 | [组织方法](docs/STRUCTURE.md) |
| 从原私有项目继续迁移资产 | [迁移与 worktree](docs/MIGRATION.md) |
| 检查媒体文件与来源 | [70 项媒体依赖索引](projects/jin-token/assets/asset-manifest.json) |
| 查看版权与公开范围 | [素材和授权政策](docs/ASSET_POLICY.md) |

## 首期归档状态

| 内容 | 当前状态 |
| --- | --- |
| 《将进 token》12句诗的双场景结构 | 已整理，见项目文档 |
| 正式 Remotion v11 核心文本源码及配置 | 已迁入 29 个文件，来源和 Git blob SHA 已登记 |
| 角色/海崖/曲水/表情/字幕/音频/合成/验收方法 | 已按模块说明 |
| 正式投稿信息 | 已根据私有源的验收记录归档：4K、30fps、87.1秒 |
| 图片/音频/表情/透明动画/字体等二进制运行依赖 | **70项源清单已登记，需逐项授权核查后迁入** |
| 本公开仓库独立完整渲染 | **尚未通过，缺媒体文件** |
| 代码的开放许可证 | **待作者确认，原工程 package.json 标为 UNLICENSED** |

因此这是一个**公开可读、已整理核心源码与方法、仍在媒体迁移收口中的工程仓库**，当前不能宣称“克隆即完整复现”。旧私人源项目保留不动。

## 为什么要这样整理？

原用户思维导图按“视觉/听觉”拆解；Codex 制作图按“声音骨架 → 两幕画面 → 叠加层 → 合成导出”组织。本仓库改为 **叙事结构 × 制作模块 × 经验/资产来源** 三层索引，让普通观众读得懂，创作者能重用，开发者找得到代码。

## 代码与资产来源

源项目：AI-CookUp 的私有分支 `codex/bigfish-v3-visuals`，固定 `0357d1b`。本次初始迁入了制作源码/配置信息，并对两处机器特定的参考视频/透明动画路径做了脱敏处理；逐文件 hash 对照在 [code-provenance.json](projects/jin-token/code-provenance.json)。

已有 BGM、歌曲、参考人声与经典社区表情的权利尚未逐项确认，本仓库**不会因为公开就自动重新上传这些媒体**。具体见 [素材政策](docs/ASSET_POLICY.md)。真正开放源代码许可（MIT/Apache-2.0/GPL 等）仍需作者作出决定，公开可读不等于默认授予再许可权。

## 下一部大肥鱼作品

新的独立作品应放在 `projects/<slug>/`；跨多部验证的通用字幕、导演谱、生成流程和效果组件再提炼到 `shared/`，不把第一部独有的海崖/GPU/铁盆写成通用平台规则。