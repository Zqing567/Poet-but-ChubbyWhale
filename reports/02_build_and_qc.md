# P4｜实际构建与复现QC（2026-10-26）

## 环境与边界

Windows，本轮实测 Node v24.15.0、npm11.12.1、Remotion4.0.537、Python3.11.5、Pillow12.2.0、numpy1.26.4。依赖由锁文件安装；未升级Remotion。Linux仅提供同样命令，没有Linux机器实测。

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
| 尾声 | 84.1秒后的动画区域每0.5秒比较 | 五组平均像素差25.57–42.12，动作继续 |
| 音乐延续 | 84.1–84.8秒与末20ms | -26.63dBFS → -71.18dBFS，继续并渐弱（单声道分析值） |
| Studio | 真实Playwright打开JinToken-Final | 30fps/01:27.03；跳至1045帧五句、2560帧七句，均完整显示；公开演示标注DEMO |
| 演示片尾 | demo输入，frames2523-2612 | 90帧成功导出；声音为生成静音，不拿它证明音乐效果 |

720p SHA-256：`e37f725b8780950d119eece9771e0026e747d1928dfafc50628367bd446e444f`。

[720p机器QC](evidence/private-720p-qc.json) · [公开静态结果](evidence/public-static-audit.json) · [公开严格结果](evidence/public-strict-audit.json)。

## 执行命令

从仓库根目录，`hydrate_local_media.py`先干跑，再对合法持有素材加`--apply`。实际渲染从editor目录执行：

```sh
node render-submission-4k.cjs --scale 1 --public-dir ../../../.local-staging/private-public --output ../../../.local-staging/qc/private-final-720p-verified.mp4
node render-submission-4k.cjs --public-dir ../../../.local-staging/private-public --output ../../../.local-staging/qc/private-final-4k.mp4
node render-submission-4k.cjs --scale 1 --public-dir ../../../.local-staging/demo-public --frames 2523-2612 --output ../../../.local-staging/qc/public-demo-tail.mp4
```

QC从根目录执行：

```sh
python tools/qc_video.py .local-staging/qc/private-final-720p-verified.mp4 --audio-reference .local-staging/private-public/audio/full_mix_final_tail3s.wav --report reports/evidence/private-720p-qc.json
```

## 完整4K复现

目标仓库独立工程已重新渲染完整2613帧，耗时495秒，3840×2160/30fps、87.104秒容器时长，H.264/yuv420p/BT.709、AAC48k双声道。完整解码退出0，无错误输出。

**本次输出SHA-256与直接重新计算的原投稿文件SHA-256完全一致：**

`200cc831123a83d8b88729138329264595e5aefe62105df686115c78db1fb2fc`

这证明本次固定工具链和合法本地原媒体下达成字节一致复现；不是仅引用上游旧报告。其它操作系统/编码器版本仍不承诺同哈希。

六段音轨相关性均>0.9999，最佳采样偏移0；尾声五组半秒像素差24.07–40.89。两幕末态关键帧已实际查看，五句/七句完整，片尾气泡仍在。关键帧含待审原画，保留在本地忽略目录，不为报告截图绕过媒体审核。

[4K机器QC](evidence/private-4k-qc.json)。输入哈希与原始源清单一致；渲染器写的输入/输出记录见同目录private-final-4k.mp4.render.json（本地）。

## 独立公开clone

从首次整理提交8e9165e全新clone到独立目录，未复制源私有媒体；npm ci退出0，468包，29秒。生成DEMO输入及三项迁移测试通过。全长占位演示已渲染完成（97秒）：1280×720、2613帧、30fps、87.104秒，完整解码退出0，尾声循环继续，音频为静音（-240dBFS分析底值）。输出SHA-256：`b67089eb2a281b72154139dd99d539db30c489041320860942472fe816c1c9f3`。

[公开clone机器QC](evidence/public-clone-demo-qc.json)及[公开演示输入合同](evidence/public-clone-render-contract.json)。这个clone没有私人原媒体；使用的2张公开大肥鱼图也未被演示引用，演示只用程序图形和许可字体。

## 并行渲染路径修复

验收发现同一输出父目录的不同任务曾共用render_bundle，720p私人片和demo片尾有交叉污染风险；该次720p结果作废，未作为最终交付。导出器已改为每个输出basename独享工作目录。4K在其他任务结束后运行，且与原片字节一致，不受此疑点影响。

真实并发回归：同父目录同时渲染private/demo各3帧，两个独立bundle存在，16项非字体输入不同，输出首帧平均RGB差异见[隔离证据](evidence/concurrent-render-isolation.json)。完整私人720p已用独立目录重跑通过（107秒），新SHA及QC已替换旧记录；尾声平均像素差25.57–42.12。旧产物仅保留本地作问题记录，不作为复现证据。



## 已知限制

本地重渲染输入与冻结媒体哈希一致，不保证编码输出与原成片SHA相同；不同Remotion/Chrome/FFmpeg版本可能产生不同字节。背景源图约1672像素宽，工程4K合成不是原生4K图像细节。ASR/许可检查不能替代艺术试听或权利人授权。
