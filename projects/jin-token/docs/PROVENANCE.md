# 来源基线、版本选择与历史资料索引

## 私有制作源

- 源仓库：Zqing567/AI-CookUp（private）
- 源分支：codex/bigfish-v3-visuals
- 固定提交：0357d1b7965c8bdb606a7fc45e75d9f4e3619897（2026-10-23 归档收尾）
- 源根目录：大肥鱼吟诗/
- 正式工程目录：大肥鱼吟诗/production/v3/editor/
- 正式提交后输出目录：production/v3/24_submission_master_20261023/
- 封面归档：production/v3/25_covers_remote_20261023/
- 旧图文与任务：Plan/、report/、开发日志/、将进token/
- 音频导演谱与 A/B：production/v3/18_director_audio_20261022/
- 修订记录：production/v3/19_refinement_20261022/ 等。

## 复制原则

新公开仓库 **editor/** 中的核心源码来自固定的源提交，保留相同文件名；`public/` 的媒体需要独立授权审核，不自动复制。旧源文件不会因为转移而被修改。后期如决定改变量较大，记录 `upstream_path`、`upstream_sha`、`new_path`、`delta_reason`。

历史记录按「决定」而不是按「某日第 17 次尝试」索引。例：为何改成海崖、为何选曲水、为何使用像素字体、导演谱解决什么、为什么结尾留三秒。详细失败图和临时测试属于上游 source branch/private archive，不应让公共根目录堆满实验截图。

## 最新产物事实

- 原始报告：production/v3/24_submission_master_20261023/evidence/submission_qc.json
- 最终视频：将进token_投稿定稿_4K高品质.mp4
- 3840×2160 / 30 fps / 87.1 s / 2613 frames
- 文件长度 78,540,650 bytes；SHA-256：200cc831123a83d8b88729138329264595e5aefe62105df686115c78db1fb2fc
- H.264 High、yuv420p、BT.709；AAC 48kHz 双声道，目标320kbps。
- 背景位图约1672像素宽，输出尺寸通过工程重新合成和3倍渲染，不等于原图就是4K。
- 官方首次采用 v11 内容、留约三秒末帧动画及 BGM 淡出；用户交给 Gemini 的显卡试验**未进入首次投稿**。
- 两张最终封面：16:9 和 4:3，均由旧工作区的 Image Gen 制作记录提供提示词与校验值。

以上列出原成片来源。迁移后的独立验证已经完成：使用合法本地原输入完整重渲染，输出与原投稿文件字节一致；公开占位演示也通过独立clone验证。具体命令、结果与限制见[构建与QC](../../../reports/02_build_and_qc.md)。公开仓库仍不包含私人音视频。

## 权利信息不是已验证开源许可

源资产记录标明大量经典鱼表情和音乐使用权待核。字库、插件与作者原资产必须单独检查。公开 repo 不等于同意将源音频、样本声音或旧模板全部给任何人再利用。