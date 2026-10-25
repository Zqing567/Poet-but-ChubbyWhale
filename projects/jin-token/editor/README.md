# 《将进 token》正式 Remotion 源码

此处保留源 `AI-CookUp`@0357d1b 的 Remotion v11 源码（29个文本文件，包括部分 JSON 运行配置）。按旧源路径保持 `src`、`public/upper-half`、`public/lower-half` 关联关系。机器特定的 sourceSingingVideo 绝对路径和 clean-motion.json 内源/输出路径已替换为相对引用并登记。

**注意：本公开版本目前不附带 70 项二进制素材。** 若直接运行 Studio 会因为找不到背景图、字体、混音、GIF 等文件而出现素材缺失。不能把失败误判为 Remotion 代码坏了。

运行环境：Node 20.19+ / 22.13+ / 24+、npm、需要导出时的 Chrome/FFmpeg。依赖版本锁定在 package-lock.json。示例：

```sh
npm ci
npx remotion studio --no-open
```

正式渲染脚本是 `render-submission-4k.cjs`：原逻辑渲染 2613 帧，scale=3，H.264 CRF12/AAC320k，拒绝覆盖同名文件，输出至 `../24_submission_master_20261023/`。**媒体补齐与代码/字幕/QC 验收之后才运行。**

复用模块：
- src/Root.tsx 组成树
- src/UpperHalf.tsx 海崖/金币/心理活动
- src/LowerHalf.tsx 曲水/唱歌/经典鱼动图
- src/CaptionStudy.tsx 逐句累积字幕
- src/FullReview.tsx 两幕合成 + 总音轨
- src/Fonts.ts 字库和授权待迁移
- src/captions.json / upper-half.json 时间基准

不要给 package.json 直接写上自选许可证；根目录版权政策说明作者尚待批准正式代码开源许可证。