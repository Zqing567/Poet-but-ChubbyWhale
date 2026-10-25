# 新项目整理模板

创建 `projects/<new-slug>/` 时建议按内容归档：

- README.md：作品简介、实际状态、入口。
- docs/VIDEO_STRUCTURE.md：剧情分场和每句/每镜编号。
- docs/PRODUCTION_MODULES.md：每模块输入、技术方案、输出、资产 ID、验收点。
- docs/EXPERIENCE.md：初稿、失败方案、修订原因、选定结果、可复用规则。
- docs/PROVENANCE.md：源码/画面/音频来源与实际确认情况。
- editor/ 或 project/：真实制作源码与依赖锁文件。
- assets/asset-manifest.json：素材来源、许可、缺失依赖、哈希。
- release/README.md：正式成片信息、发布链接、质量核验。
- history/README.md：候选版本与决定索引，不堆全量缓存。

不要先复制《将进 token》所有技术代码。用新的作品需求对照模块表，确定哪些可真实复用。