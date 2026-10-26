# 《将进 token》正式版本

本项目只以一个成片为正式版本：**4K高品质投稿定稿，87.1秒**。

| 项目 | 正式参数 |
| --- | --- |
| 分辨率与帧率 | 3840×2160，30fps |
| 时间线 | 2613帧，含追加90帧动态尾声 |
| 视频 | H.264、CRF12、yuv420p、BT.709 |
| 音频 | AAC，48kHz双声道，目标320kbps |
| 工程入口 | `JinToken-Final` |

官方B站成片URL尚未录入仓库，因此本页不提供猜测的BV或非官方转载。公开仓库没有原始混音和完整成片文件；[教程素材入口](../tutorials/MATERIALS.md)列出可以单独使用的图片与Prompt。

## 预览与导出

按[工程README](../editor/README.md)选择公开占位演示或合法本地原媒体复现。正式脚本是[render-submission-4k.cjs](../editor/render-submission-4k.cjs)，默认scale=3，拒绝覆盖已有输出。具体制作步骤见[合成与导出教程](../tutorials/07_compositing.md)。

## 验证记录

迁移后已使用合法本地输入完整重渲染并通过解码、音画和尾声检查，输出与原投稿文件字节一致；详见[构建与QC](../../../reports/02_build_and_qc.md)。不同浏览器或编码器版本不承诺相同哈希。

原投稿文件SHA-256：`200cc831123a83d8b88729138329264595e5aefe62105df686115c78db1fb2fc`。背景位图约1672像素宽，工程4K合成不等于原画原生4K细节。

素材与代码分别按[许可说明](../assets/ATTRIBUTIONS.md)和[仓库政策](../../../docs/ASSET_POLICY.md)处理。代码仍为UNLICENSED，不能由成片发布状态推导许可。
