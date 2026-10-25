# P0｜基线核验（2026-10-26）

## 隔离与原工程保护

| 对象 | 实测状态 |
| --- | --- |
| 私有源仓库 | `Zqing567/AI-CookUp`，HEAD `0357d1b7965c8bdb606a7fc45e75d9f4e3619897`，分支 `codex/bigfish-v3-visuals` |
| 私有源工作区 | `H:/AI整活合集`；执行前只有未跟踪文件（新增角色图文及其他独立项目），未暂存、未删除、未修改 |
| 冻结只读快照 | `H:/worktrees/jin-token-source-0357d1b`，detached HEAD `0357d1b`；只读取，不安装依赖、不写报告 |
| 目标独立克隆 | `H:/Poet-but-ChubbyWhale`，入口 `802d8e04a8ed7a9d998da363ee918f316e1049bc`，工作区起始干净 |
| 实际整理 worktree | `H:/worktrees/jin-token-curation`，新分支 `codex/jin-token-curation`，从 `origin/curation/jin-token-assets` 建立 |
| 远端 main 基线 | `dcc230c2e61bc5accbb0d6897138fdc7ca89de98`；未合并、未改写 |

路径只用于此次本地交接，不是工程运行时配置。新仓库与源仓库没有共享 Git 数据库；各自 worktree 归各自仓库。

## 初始源码与依赖

对照 [逐文件记录](baseline-code-comparison.json)：29项迁入文本按 Git 规范字节核对；源中两个机器路径已在入口分支脱敏，其余保留来源。Windows checkout 会把部分文本转为 CRLF，不能直接拿工作区原始字节冒充 Git blob。

初始运行问题：

- `V3-Review` 默认2523帧、v07音轨，正式导出器另行覆盖为2613帧、尾声音轨。Studio预览与正式导出的合同不统一。
- `Fonts.ts` 同时加载三种字体，因此两种未选字体仍是运行依赖。
- 现有70项清单有3项元数据、67项媒体；正式片调用链实际需要19项媒体，不能把历史/工作坊全部算作正式片必需。
- 抠图预处理脚本有本机 FFmpeg 路径；不属于播放运行时，但仍需移植。
- 公开仓库尚无角色、音乐、克隆声线的可再分发证据；独立完整正式片渲染暂缺合法媒体输入。原成片的QC不等于此次仓库复现。

## 本次范围补充

用户进一步要求包含 `0357d1b` 之后的新增素材。冻结快照不变，新增内容另建 [post-freeze-manifest](../projects/jin-token/assets/post-freeze-manifest.json)，与冻结源清单分开。包括初版6张三视图、最终7张优化图、B站图文7张，以及生成/优化提示词；七张优化图是用户指定最终版，不能回退为前一轮生成图。
