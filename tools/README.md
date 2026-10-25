# 整理与验证工具

本目录是给 Codex 在作者 Windows 本地环境完成迁移收口的工具，**不直接访问个人机器，也不自动 Git push**。

## 先做静态审计

```powershell
python tools/audit_project.py
```

默认只验证源码与文本清单，列出暂缺的媒体；命令返回 0 不代表已可渲染。严格模式：

```powershell
python tools/audit_project.py --strict
```

当经过审核且需要 Remotion 正式重建时，应在完整媒体复制后使用严格模式。

## 只复制人工审核的原始媒体

复制样板 `projects/jin-token/assets/approved.example.json` 到临时审核 JSON。为每个批准的路径填写 `decision = redistributable`、`rights_holder`、`license_or_permission`、`evidence`、`reviewed_by`，路径必须与 asset-manifest.json 完全一致。尚未确认的文件保持不批准。

默认干跑：

```powershell
python tools/curate_media.py --source-public "H:\path\to\AI-CookUp-snapshot\大肥鱼吟诗\production\v3\editor\public" --approvals "C:\your-private-reviews\approved.json"
```

经人工审核后加 `--apply` 才会复制。脚本校验 Git blob SHA-1 与字节数、禁止覆盖不同文件、拒绝越界路径，所有源文件只读。**哈希相同只能证明来源一致，不能证明版权许可**。不要未经审核即批量把原始歌声、社区动图、克隆音色上传公共仓库。

完成后运行 npm ci、Remotion Studio、正式渲染与 FFmpeg QC；输出最新提交 SHA、图片/媒体资产数、可再分发与未授权数。
## 新增可执行工具

- inventory_source.py：只读冻结快照，完整清点及源/目标源码Git blob对照。
- inventory_derivatives.py：新增三视图/优化图/分享图索引，保存两轮提示词；哈希不变时保留已有批准记录。
- migrate_reviewed_fonts.py：只迁入清单中的四种冻结字体，附各自许可证和组件声明。
- migrate_selected_bigfish.py：只迁入用户许可确认的两张最终大肥鱼图，署名见CHARACTER_RIGHTS。
- hydrate_local_media.py：为合法本地持有者补齐19项输入，不改变公开批准状态。先干跑，再--apply。
- make_public_demo.py：仅用公开字体和程序图形生成演示，无原角色/声音，默认写.local-staging。
- test_migration.py：路径边界、空授权字段、字幕/运行合同测试。
- qc_video.py：完整解码、参数、音频相关/偏移及尾声运动；需要requirements-qc.txt和FFmpeg。
- check_publication.py：扫描Git跟踪文件，媒体须有逐项许可证据与正确哈希；忽略目录不会被扫描或上传。

具体命令见[editor](../projects/jin-token/editor/README.md)。生成/导出工具拒绝覆盖已有输出，重跑应指定新的目标路径，不清空原目录。

extract_prompt_examples.py从冻结源导出四项精选Prompt记录，去本机路径、保留阶段状态；不复制参考图。
