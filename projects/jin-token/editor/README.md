# 《将进 token》可编辑工程

正式入口 **JinToken-Final**：1280×720逻辑画布，30fps，2613帧（87.1秒），最终尾声混音。`V3-Review`保留为旧84.1秒工作坊入口。两幕、金币、累积字幕、气泡、透明动画和完整音轨仍在原组件中，没有另造简化版引擎。

依赖固定在package-lock.json；Node按package.json engines安装。迁移实测Windows流程与结果见[QC报告](../../../reports/02_build_and_qc.md)。Linux命令相同，但本轮没有Linux机器实测，Chrome可能需要系统依赖。

## A：公开占位演示（无私人素材）

仓库只包含已审核字体。用程序生成的几何占位图、循环圆点和静音，验证原时间线；不使用角色图片、原歌曲或克隆声音。

从仓库根目录执行（Python 3.10+、Pillow、FFmpeg需可用）：

```sh
python -m pip install Pillow
cd projects/jin-token/editor
npm ci
cd ../../..
python tools/make_public_demo.py
cd projects/jin-token/editor
npx remotion studio --no-open --public-dir ../../../.local-staging/demo-public
```

打开终端实际返回的URL，选择 `JinToken-Final`。演示保留真实字幕/时间线，背景明确标注DEMO，声音为静音；不是原片替代品。

```sh
node render-submission-4k.cjs --scale 1 --public-dir ../../../.local-staging/demo-public --output ../../../.local-staging/demo.mp4
```

## B：作者本地合法素材复现

仅限已合法持有源文件者。无需也不允许用私人素材包替代公开授权审核。工具按19项正式运行依赖核对SHA-256；不改变权利状态，目标目录被Git忽略。

从仓库根目录：

```sh
python tools/hydrate_local_media.py --source-public <frozen-source-editor-public> --dest-public .local-staging/private-public
python tools/hydrate_local_media.py --source-public <frozen-source-editor-public> --dest-public .local-staging/private-public --apply
cd projects/jin-token/editor
npm ci
npx remotion studio --no-open --public-dir ../../../.local-staging/private-public
node render-submission-4k.cjs --public-dir ../../../.local-staging/private-public --output ../../../.local-staging/jin-token-master-4k.mp4
```

## 渲染合同与验收

- 默认scale=3，3840×2160，H.264 CRF12 / AAC320k / yuv420p / BT.709。
- `--scale 1`仅用于720p检查；`--frames 2523-2612`可单独检查追加90帧。范围渲染不冒充全片验证。
- `--output`必须是新文件；脚本拒绝覆盖。打包与临时目录跟随输出，不依赖源工程兄弟目录或个人盘符。
- 导出后写 `.render.json`，含19项输入SHA-256、帧范围和输出SHA-256；输出字节可能随浏览器/编码器变化，不承诺与旧成片SHA一致。
- 缺媒体会列出具体路径。`python tools/audit_project.py --strict`默认检查公开public，不会因私人ignored目录有素材就误报公开仓库完整。
- 改源码运行 `npm run lint`、`npm run build`；完整解码、关键帧、字幕末态与尾声/声音仍要单独检查。

## 组件与预处理

`FullReview`统一声音/两幕；`UpperHalf`海崖金币气泡；`LowerHalf`诗会/尾声；`CaptionStudy`文字；`cue-model`时点；`Fonts`加载三种字库。素材稳定路径不重命名。

`matte-a48-cpu-v21.mjs`为历史抠图预处理，可设置FFMPEG_PATH及MODNET_MODEL_PATH；需要原GIF、已合法取得的本地模型和重模型依赖，不是播放或渲染必跑步骤。另一GPU试验脚本保留用于历史研究，未宣称跨机器复现。

代码仍为UNLICENSED，角色图和字体按各自许可；见根目录素材政策。
