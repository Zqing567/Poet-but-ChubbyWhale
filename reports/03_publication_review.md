# P5｜公开审核与作者待决事项（2026-10-26）

## 本次可公开的成果

- P0/P1实物：基线与29项源码对照、760项冻结源清点、84项运行/交付记录、20张新增图的索引与最终/初版关系。
- 两张最终优化大肥鱼图：来源、署名、改编说明、CC BY-NC-SA 4.0范围见[角色权利说明](../projects/jin-token/assets/CHARACTER_RIGHTS.md)。不公开未经确认绘制者的原社区三视图。
- 四个字体文件：逐文件嵌入许可证和随附许可核对，保留全部组件声明；不随项目代码重新授权。
- 两轮完整角色提示词、七项经验复盘、正式可编辑Remotion入口、可移植导出器、按哈希本地补齐工具、无私人素材的演示生成器及测试。
- 完整4K本地重渲染实测与机器QC；[输入/输出合同](evidence/private-4k-render-contract.json)及[字节一致性](evidence/bit-reproducibility.json)。

公开二进制仅为2张批准图片＋4个带许可字体。没有迁入歌曲、BGM、克隆音色、原始表情GIF、透明表情视频或完整投稿视频。公开索引包含路径/用途不等于提供原始素材。

## 许可与敏感信息检查

[发布候选扫描](evidence/publication-scan.json)对Git跟踪媒体核对批准记录、许可证据及SHA-256；文本检查可能的Key/Bearer/签名URL，值不输出到报告。`git diff --check`通过（随源许可文本的行尾空白只做空白规范化，不改许可正文）。首次提交的全部29项文本来源有基线证据；3项维护改动有逐项delta。

原始工作区的未跟踪文件保留；冻结源worktree与目标基础克隆工作区干净；原main与交接分支没有改写。历史初始归档中机器FFmpeg路径已在当前正式预处理脚本移除，属于本机运行路径，不是服务凭证；未发现需要改写历史/轮换Key的证据。模式扫描不是穷尽安全证明。

## 建议

**可审阅整理分支，暂不合并main。** 工程已能在合法本地原输入下字节一致复现；公开下载能生成明确标注的替代演示，但不能承诺任何人无需原媒体就重建同款视频。

## 仍需作者决定

1. **代码许可**：推荐先考虑MIT，便于学习复用、条文简短；希望明确专利授权机制可选Apache-2.0；希望分发衍生代码继续保持同类开放义务可考虑GPLv3。最终由作者选择，只覆盖有权许可的代码，图片/字体/音轨继续分别列许可。目前package.json保留UNLICENSED，没有擅自加LICENSE。
2. **其余五位角色**：固定来源记录指向ZipZipPipe允许分享/再创作，但本轮B站原帖412未直接读到完整说明；不可把大肥鱼CC协议套给Claude/GPT/Qwen/Gemini/Grok。它们已完整入索引和Prompt，二进制待该许可范围核对后迁入。
3. **声音与经典表情**：是否取得可独立再分发的音乐、人声、声线/动图授权，或未来另作替代音轨/表情。这次保留定稿，没有擅自重制视频。
4. **观看链接**：请提供本片官方BV/动态链接，以补首页观看入口；未猜测投稿编号。

这些事项不阻止已完成的分类、代码维护、字体/已批准图迁入和本地验证；不把待决定写成全量开放授权。

## 成果导航

[整理分支](https://github.com/Zqing567/Poet-but-ChubbyWhale/tree/codex/jin-token-curation) · [P0](00_baseline.md) · [P1](01_inventory.md) · [QC](02_build_and_qc.md) · [七项经验](../projects/jin-token/docs/LESSONS_WITH_EVIDENCE.md) · [运行步骤](../projects/jin-token/editor/README.md)。已推送并以git ls-remote核验整理提交[ a09f3a8 ](https://github.com/Zqing567/Poet-but-ChubbyWhale/commit/a09f3a821c8d6f77445d84e501d98d3c33592feb)。main仍为dcc230c、交接分支仍为802d8e0；未合并。后续仅文档/证据收尾提交继续留在同一整理分支。
