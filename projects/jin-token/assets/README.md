# 可复现媒体与素材清单

## 这里暂时为什么没有所有图片/音频？

原源工程的 `production/v3/editor/public/` 含 70 个文件，其中为 Remotion 提供正式场景图片、经典大肥鱼表情、透明动画视频、朗诵/歌唱混音、字体等。新仓库先保留**准确文件路径和源 Git blob SHA/字节数**，而不是不加授权审核就把内容从私有仓库搬进公开仓库。

请查看同目录 `asset-manifest.json`，其中列每一个原源 `public/` 相对文件的大小和实际路径，以及默认审核状态。必须经所有者逐项确认出处、用途、再分发许可后，才可加入新仓库。**清单出现不代表素材可用或已经包含。**

## 缺失媒体时能做什么？

可以阅读、搜索、改造 `editor/src` 的真实代码，运行 JSON/TSX 静态检查与受限 npm 构建（具体以测试结果为准）；但 Remotion 预览和正式成片渲染会遇缺少图、字体和音轨的引用，不要宣称完整开源复现。

## 如何将文件放回原引用位置

例如，源媒体 `public/upper-half/gpu-scene-selected.png` 经确认可再分发后，目标仍为 `projects/jin-token/editor/public/upper-half/gpu-scene-selected.png`。保留同名以避免修改 Remotion 静态引用。以后若要统一英文命名，必须连同源码/配置一并修改并实际通过渲染。

## 当前必须重点审核的素材组

- art、upper-half、lower-half：AI 生成场景和经典角色图片，确认是否使用第三方原画/Logo/角色卡等。
- memes：社区经典动图/图片，源 manifest 多处明确“授权待核，仅内部审稿”，默认不公开。
- audio：最终混音含朗诵、BGM、歌曲，默认不公开音轨。
- fonts：Fusion Pixel、Cubic11、LXGW WenKai 等字体；需分别核许可证、保留声明。
- letmego、透明 webm：虽然部分是变换后的合成媒体，仍需追溯原视频与歌曲权利。

## 对于公开成片

若来源许可仅允许视频平台播放、不允许素材独立再分发，改为提供原官方 B 站视频链接和制作方法说明；可以提供**去媒体的源码**、用户自行补全的文件映射方式和可替代的开源素材指南。
## 2026-10-26 实际整理

[asset-manifest.json](asset-manifest.json)保留原70路径并补14项交付目录记录，正式运行媒体共19项；[source-inventory.json](source-inventory.json)覆盖冻结源760文件。4个字体已核对嵌入许可与随附文本并迁入，声明见licenses/fonts；角色最终图与署名见[CHARACTER_RIGHTS](CHARACTER_RIGHTS.md)。

[post-freeze-manifest](post-freeze-manifest.json)另记20张新增图，最终优化组7张，其中2张大肥鱼已迁入；其余图片保留精确本地映射与哈希。两轮提示词存放prompts。它们是影片发布后的衍生材料，不改变冻结影片来源。

公开可运行的几何占位演示与合法持有者的本地补齐流程见[editor](../editor/README.md)。
