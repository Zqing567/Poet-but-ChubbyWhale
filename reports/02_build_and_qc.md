# P4｜实际构建与复现QC（2026-10-26）

## 环境与边界

Windows，本轮实测 Node v24.15.0、npm11.12.1、Remotion4.0.537、Pillow12.2.0、numpy1.26.4。依赖由锁文件安装；未升级Remotion。Linux仅提供同样命令，没有Linux机器实测。

复现分两条：公开几何占位演示不含原角色/声音；作者本地合法素材依manifest补齐。私人原片/混音/透明动画均留在 `.local-staging/`，没有加入Git。

## 已完成的真实检查

| 检查 | 命令/范围 | 结果 |
| --- | --- | --- |
| 安装 | editor内 `npm ci --no-audit --no-fund` | 退出0，468包；部分tarball下载重试后成功，锁文件未变 |
| TS | `npx tsc --noEmit` | 退出0 |
| lint与TS | `npm run lint` | 退出0 |
| bundle | `npm run build` | 退出0，build在Git忽略目录 |
| 迁移边界测试 | `python tools/test_migration.py` | 3项通过：Windows/POSIX越界、空批准字段不能复制、12句与19项正式合同 |
| 初始源码对照 | 29项Git blob | [基线记录](baseline-code-comparison.json)全部匹配入口分支记录；后续3项改动另记curated-code-changes |
| 公开静态审计 | `python tools/audit_project.py` | 退出0，只证明文本/诗句及清单检查 |
| 公开严格审计 | `python tools/audit_project.py --strict` | **退出2，预期缺15项原正式媒体**；不以本地素材可用宣称公开同款可重现 |
| 完整本地720p | 正式导出器，scale1，私人public-dir | 2613帧、30fps、87.104秒容器时长，完整解码退出0 |
| 声音同步 | 六段各1秒，对最终WAV相关性、±5样本比较 | 全部相关性>0.9999，最优采样偏移0 |
| 尾声 | 84.1秒后的动画区域每0.5秒比较 | 五组平均像素差5.69–12.43，动作继续 |
| 音乐延续 | 84.1–84.8秒与末20ms | -26.63dBFS → -71.18dBFS，继续并渐弱（单声道分析值） |
| Studio | 真实Playwright打开JinToken-Final | 30fps/01:27.03；跳至1045帧五句、2560帧七句，均完整显示；公开演示标注DEMO |
| 演示片尾 | demo输入，frames2523-2612 | 90帧成功导出；声音为生成静音，不拿它证明音乐效果 |

720p SHA-256：`962ca9eacabfba1c8c41693c28e1cefdbc1bcf2e63d8bfd64a81fb0e0c25abf6`。

[720p机器QC](evidence/private-720p-qc.json) · [公开静态结果](evidence/public-static-audit.json) · [公开严格结果](evidence/public-strict-audit.json)。

## 执行命令

从仓库根目录，`hydrate_local_media.py`先干跑，再对合法持有素材加`--apply`。实际渲染从editor目录执行：

```sh
node render-submission-4k.cjs --scale 1 --public-dir ../../../.local-staging/private-public --output ../../../.local-staging/qc/private-final-720p.mp4
node render-submission-4k.cjs --public-dir ../../../.local-staging/private-public --output ../../../.local-staging/qc/private-final-4k.mp4
node render-submission-4k.cjs --scale 1 --public-dir ../../../.local-staging/demo-public --frames 2523-2612 --output ../../../.local-staging/qc/public-demo-tail.mp4
```

QC从根目录执行：

```sh
python tools/qc_video.py .local-staging/qc/private-final-720p.mp4 --audio-reference .local-staging/private-public/audio/full_mix_final_tail3s.wav --report reports/evidence/private-720p-qc.json
```

## 正在继续验证

4K完整重渲染正在运行，结束后追加实际参数/完整解码及关键帧结果。独立公开clone的占位演示验收待追加；此处不提前标通过。

## 已知限制

本地重渲染输入与冻结媒体哈希一致，不保证编码输出与原成片SHA相同；不同Remotion/Chrome/FFmpeg版本可能产生不同字节。背景源图约1672像素宽，工程4K合成不是原生4K图像细节。ASR/许可检查不能替代艺术试听或权利人授权。
