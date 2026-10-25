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