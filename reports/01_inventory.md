# P1｜素材分类与授权清点（2026-10-26）

## 可直接查阅的实物

- [冻结源完整文件索引](../projects/jin-token/assets/source-inventory.json)：760项，396,504,239字节；源路径、Git blob、SHA-256、体积和分类。全量扫描仅指冻结提交所有跟踪文件，不含本机缓存或其他项目未提交资料。
- [运行与交付资产清单](../projects/jin-token/assets/asset-manifest.json)：原70项加14项发布目录记录（含报告/交付元数据，不能把84项全称为媒体）。每项带稳定ID、用途、目标路径、最终片引用、权利状态和替代入口。
- [新增素材清单](../projects/jin-token/assets/post-freeze-manifest.json)：20张源图片，标明最终优化/初版/分享图分组；不把它们伪装成已进入10月23日正式片。
- [六角色三视图完整提示词](../projects/jin-token/assets/prompts/scene2-turnarounds.json)。参考图改为asset路径，正文保留。
- [高保真优化提示词](../projects/jin-token/assets/prompts/high-fidelity-refinement.txt)。优化模型、参数未见记录，不反推或捏造。

## 分类与覆盖

冻结源导航分类：19项正式运行依赖、14项交付目录文件、92项工程元数据/文本、48项工作坊/预处理、554项经验/源码记录、7项私人音频研究、26项历史候选/参考。分类服务导航，不是授权结论；在经验记录中的文字也须去隐私后才能迁入。

19项正式运行依赖经过调用链核对：`FullReview → UpperHalf/LowerHalf → Poem/Fonts`；包括最终尾声混音、两张主场景、金币、气泡与指示点、唱歌透明视频、片尾透明动画及三种预加载字体。旧提醒动画、工作坊 art 与原始 GIF 不直接进入正式片；源GIF仍是透明动画制作溯源依赖。

所有正式交付（4K成片、v11视频、两张封面）登记但默认不上传。音乐或角色复合权利未清楚时，成片文件本身不能作为绕过审查的捷径。

## 公开决定

- 三视图与优化图：用户明确要求加入整理范围；尚缺上游角色设定再分发/改编许可依据。用户随后提供大肥鱼CC BY-NC-SA 4.0声明；两张最终大肥鱼图已附署名迁入，其他五位角色仍需分别核对。见CHARACTER_RIGHTS.md。
- BGM、歌曲、人声分离、克隆声音及原始社区表情：仅本地合法持有者按映射使用，不公开原文件。
- 字体：逐一核对嵌入name/license记录及源许可文本；可按具体许可迁入并保留声明。不能把字体归为作者原创。
- 代码：继续 `UNLICENSED`，不擅自设置整个仓库LICENSE。

## 可重复清点

```sh
python tools/inventory_source.py --source <frozen-source-worktree>
python tools/inventory_derivatives.py --source-project <local-source-project>
python tools/audit_project.py
python tools/audit_project.py --strict
```

前两个命令只读各自源目录、写目标清单与去机器路径的提示词；不复制媒体。strict仅考核正式运行依赖；退出0仍不代表渲染和授权通过。缺媒体结果必须保留，不以宽松模式成功替代正式片复现。
