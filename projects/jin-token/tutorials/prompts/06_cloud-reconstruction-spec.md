# 第21轮生成素材复现规格

生成方式：内置 Image Gen，透明背景；编辑既有同系列纸云参考图。生成原路径、尺寸及 SHA-256 见 `production/v3/21_bubble_adaptation_editor_20261022/evidence/generated_assets.json`。以下为交接复现规格，非逐字请求日志。

## token-plate-4x3-v21.png
参考 editor/public/lower-half/proud-token-thought-v1.png。重构为约4:3的透明不规则纸云，暖象牙纸纹、蓝色花饰、金色微光；左侧约58%留白给实际运动角色，右下约35%保留盛满金色token的盆。无需人物、文字、矩形内框或指示小圆点。必须形成统一画面，可直接叠加进水彩诗会底图。

## granary-4x3-v21.png
参考 editor/public/lower-half/gpu-granary-thought-v1.png。同系列蓝发Q版角色、女仆服、双手捧米饭碗，角色位于左侧约52%，脸足够清晰；右侧为GPU堆叠与米袋。以暖纸纹、青花蓝色和金色小装饰融为不规则纸云，透明背景，约4:3。完整重构构图，无矩形插图或单纯把原图套进边框。

## A48动态
生图只制作承载底图；运动人物使用原始A48 GIF。CPU MODNet推断每个唯一画面的透明度，保留原RGB和动作，经透明WebM叠加。未用生成静态人物替代原动作。


[返回心理活动与动效教程](../06_motion.md)。
