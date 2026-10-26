# 事实与写作约束

Issue #1于2026-10-26发布，无评论。用户示例只定五步结构，不把其中全部事实自动当作已核验。

- 原公众首页仍以归档/状态表为主；本轮重写根README与jin-token项目README，以作品/图片/教程入口开头。
- 本机技能：C:/Users/Administrator/.codex/skills/humanizer-zh/SKILL.md。已读取，按模型内编辑工作流应用，未额外调用CLI。要求保留信息、确定程度、代码/数据与清晰列表。
- 源voice_service.py真实模型qwen-audio-3.1-tts-flash，原入口为千问兼容HTTP服务；不据此把原项目写成已证实直连阿里云官方。
- 后续audio_work.py采用24kHz单声道WAV、rate1、volume60、seed1061；G1A/B完整文本/instruction可从generation_cases及代码核对。
- 原始创建音色脚本使用早期歌曲参考18秒；最终派蒙参考克隆的原始创建请求尚未找到，不能混写。后续复用既有克隆有明确记录。
- 官方价格页2026-10-26核验qwen-audio-3.1-tts-flash北京100万Token，90天条件；新加坡该表无同类免费额度。不据此承诺本项目实际入口的账户权益。
- Instruction被接受不等于情绪精控有效。SSML250ms单样本只证实增顿，实测增加350ms。R11/R12/R13和后续G34A选版须保留历史阶段。