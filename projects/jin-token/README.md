# 《将进 token》：工程与制作经验

> 大肥鱼在 GPU 海崖望海吟诗，再邀请 AI 娘参加“曲水流饭”诗会。这是视频和制作方法的工程归档，不是单纯一个成片下载目录。

## 项目事实与当前可用性

- 原始制作基线：AI-CookUp `codex/bigfish-v3-visuals`@`0357d1b`（原工程仓库私有）。
- 正式片：3840×2160、30fps、87.1秒，Remotion 工程直接以三倍比例输出，片尾保留 3 秒动态留白。
- 声音：已确认的朗诵配音、音乐/歌曲片段与一个金币入盆音效组合。公开源码不附赠第三方歌曲或个人声音素材。
- 画面：第一幕 GPU 海崖与大肥鱼；第二幕曲水流饭与 AI 娘群像；人物表演、心理气泡、金币、字幕等由不同图层合成。
- 源码目录：`editor/`，保持上游生产结构的真实 Remotion 代码。**目前尚未公开完整运行媒体，无法仅凭克隆直接重建同一成片。**

## 按用途找内容

| 想做什么 | 入口 |
| --- | --- |
| 了解全片故事与 L01～L12 | [VIDEO_STRUCTURE](docs/VIDEO_STRUCTURE.md) |
| 找视觉、配音、字幕、特效的实现 | [PRODUCTION_MODULES](docs/PRODUCTION_MODULES.md) |
| 学创作与修改的经验 | [EXPERIENCE](docs/EXPERIENCE.md) |
| 读取所有文档 | [文档索引](docs/README.md) |
| 开始补齐媒体与授权 | [资产索引](assets/README.md) |
| 了解最终导出与核验 | [发布说明](release/README.md) |
| 从旧私有仓库安全迁移 | [迁移指引](../../docs/MIGRATION.md) |

## 运行环境（媒体完整后）

Node.js 20.19+、22.13+ 或 24+，npm，必要时 FFmpeg 与 Python。实际版本/依赖记录在 editor/package-lock.json。

```sh
cd projects/jin-token/editor
npm ci
npx remotion studio --no-open
```

正式入口改为 `JinToken-Final`；导出脚本支持 `--output`、`--public-dir`、`--scale`。详见[两种复现路径](editor/README.md)与[本次QC](../../reports/02_build_and_qc.md)。

## 系列仓库定位

未来新作放在 `projects/<new-slug>/`；跨两部以上作品验证有效的内容才考虑抽取到根目录 shared，避免把第一部视频定制的代码误认成通用产品。
## 新增角色素材

[最终大肥鱼优化图与署名](assets/CHARACTER_RIGHTS.md) · [全部20张新增图索引](assets/post-freeze-manifest.json) · [完整提示词](assets/prompts/scene2-turnarounds.json)。五位其他角色分别保留许可待审，不套大肥鱼协议。
