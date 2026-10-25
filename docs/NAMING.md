# 文件和版本命名规范

## 目录命名

跨项目使用英文短 slug：`jin-token`。内容标题继续保留中文《将进 token》。源代码保持技术栈约定的文件名（UpperHalf.tsx、LowerHalf.tsx 等），不为形式统一而损坏 import。新增模块文档使用明显中文名或数字前缀，以便初学者查看。

- 文档：`01_场景与角色.md`、`02_声音与节奏.md`，编号只用于阅读顺序，不用于表达软件依赖。
- 素材：`S01_cliff_base_v01.png`、`S02_garden_base_v02.png` 等。相同资产不因为不同用途复制三份；在 manifest 以 asset_id 多次引用。
- 句子：固定 `L01`～`L12`，不改诗句 ID。场景 `SC01`/ `SC02`；片尾 `END`。
- 声音：`VO_G01_takeA.wav` 等；保留合成参数 metadata，不让人靠猜测文件名判断优劣。
- 提示词：`PROMPT_SC01_ink_cliff_v03.md`，写源输入与候选差异。
- 输出：`jin-token_master_4k_2026-10-23.mp4` 或按真实发布日期，绝不重命名冒充作者官方版。
- 报告：`YYYY-MM-DD_问题-结论.md`，记录问题、原版证据、调整、验证结果、未解决项。

## 稳定资产 ID 和原始文件

**一次性迁移不要同时改 Remotion 的所有 staticFile() 路径**。保留原有 `editor/public/upper-half` 和 `lower-half` 等引用路径，先跑通。为每个旧路径建立 `asset-manifest.json` 映射人类可读名字；后续单独重构命名并以实际渲染测试作为通过条件。

## 最终版 vs 历史试验

正式发布版本需要唯一明确入口：
- `editor/src/FullReview.tsx` 和 `editor/render-submission-4k.cjs`：正式工程入口；
- `release/README.md`：正式成片参数、校验值、观看方式；
- `history/`：候选、旧版、失败记录与早期 prompt 的索引，必要时链接源提交。

历史的 v06/v07/v09 是阶段标识，不应被重新排序命名为 v1/v2 而丢失来源。