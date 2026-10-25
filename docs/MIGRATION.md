# 从 AI-CookUp 迁移到 Poet-but-ChubbyWhale

## 不能直接运行 AI-CookUp 内的全部素材转移

来源：`Zqing567/AI-CookUp`（私有），分支 `codex/bigfish-v3-visuals`，锁定提交 `0357d1b7965c8bdb606a7fc45e75d9f4e3619897`。
目标：`Zqing567/Poet-but-ChubbyWhale`（公开），长期承载全部大肥鱼作品。
已核对的源仓库包含 760 文件、约 396.5MB，包括多个中间片、录音样本、表情、字体；禁止 `cp -r` 整体复制并推送。

## 关于 worktree：非常重要

Git worktree 是**同一个仓库**不同分支/提交的工作目录，不能把目标“新仓库”当成源仓库的一个 worktree。

正确路线：
1. 在源 AI-CookUp 上创建一个**独立、只读的 detached worktree**，指向 `0357d1b`，保证不打扰现有开发分支和未提交的用户修改。
2. 在旁边独立克隆 Poet-but-ChubbyWhale 目标仓库。这是**另一个 Git 仓库**，不能共享 worktree 元数据。
3. 从源 detached worktree **只复制清单中审核通过的文件**，必要时迁移原始版本的源码、运行资产及证据。
4. 目标仓库单独提交和推送，源仓库 worktree 不提交、不修改。完成验收后再手动移除临时源 worktree。

## Windows / PowerShell 7 安全命令参考

请把工作根目录替换为你实际使用的路径，不要默认就是下面示例。先用 git status 确认源库没有被同时改写。

```powershell
$SourceRepo = 'H:\AI整活合集'
$Workspace  = 'H:\worktrees\bigfish-open-source'
$SourceSnapshot = Join-Path $Workspace 'AI-CookUp-source-0357d1b'
$TargetRepo = Join-Path $Workspace 'Poet-but-ChubbyWhale'
New-Item -ItemType Directory -Force $Workspace | Out-Null

git -C $SourceRepo fetch origin codex/bigfish-v3-visuals
git -C $SourceRepo status -sb
git -C $SourceRepo worktree add --detach $SourceSnapshot 0357d1b7965c8bdb606a7fc45e75d9f4e3619897
git clone https://github.com/Zqing567/Poet-but-ChubbyWhale.git $TargetRepo
```

迁移完后：在目标仓库检查清单、许可证、npm ci / Remotion 构建、素材存在性、视频解码与 ffprobe、哈希；再提交。切勿先运行 destructive git clean/reset 或者删掉主项目目录。

## 本公开仓库已迁移了什么

本仓库逐项复制源分支中的核心 Remotion **文本源码与配置**，保留原文件名和内部关联，原路径与 SHA 可从 `projects/jin-token/docs/PROVENANCE.md` 对照。二进制素材没有经许可证审核，故尚未自动公开。首次克隆可能能打开源代码，但无法在缺少图像/音频时复现正式成片。

见 `projects/jin-token/assets/asset-manifest.json`，按 `public/xxx` 所需相对位置列出素材。待作者逐项确认素材许可后，在本地源 worktree 与目标仓库之间复制对应文件；先渲染再宣布“完整可复现”。

## Codex 的实际收口任务

- 保留最新版正式代码，不要清理成一个展示用空壳。
- 将角色、场景、字幕、声音、动效等方法文档和资产元数据对上真实源码。
- 清理失效的 H:/J:/G: 本地绝对路径。旧路径可以留在私有来源记录，但不能成为新项目的**运行时强依赖**。
- 按模块归类失败尝试：原想法/实际测试/反馈/最终取舍，每条有结论。不要复制全部几百份历史临时日志到主目录。
- 为能公开的 AI 原创素材、音效、封面与完整影片提供逐项权利记录，再依规则迁入。
- 提供 `npm ci`、Studio、渲染和 QC 的真实测试结果，且测试在目标仓库**独立克隆目录**完成。
- 最后提交并推送公开仓库，记录 tag/commit、文件数、可公开资产数、未授权资产数、能否真正重建同一成片。

不能获得用户机器上的材料时，报告 blocked，不要伪造实际 worktree、渲染或成功迁移。
