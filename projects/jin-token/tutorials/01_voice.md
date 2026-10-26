# 我们是怎么让大肥鱼开口吟诗的？

《将进 token》的配音先选定音色，再逐段调整朗诵。难的是让这条鱼既有诗人的架势，说起吃白饭时又理直气壮。中文念顺了，Claude、GPT 和 token 还可能把节奏打断。这篇按当时的五步做法，讲清楚用了什么、怎么生成，以及不好听时怎么改。

你可以先拿开头两句试做，不必一次生成整首。本页给出真实请求模板和原导演谱；原始人声参考没有公开，跟做时请用自己的声音、获准使用的参考，或者平台内置音色。

## 1. 选平台和模型，先生成一句试听

我们用的是千问语音模型 **`qwen-audio-3.1-tts-flash`**，通过 API 生成音频。API 就是让脚本把台词和要求发给服务，再把返回的声音保存下来；TTS 指把文字合成为语音。第一次接触，可以从[阿里云百炼的语音教程](https://help.aliyun.com/zh/model-studio/voice-cloning-user-guide)开始开通；项目当时使用的是另一处兼容服务地址，开通和额度要以你选择的平台为准。

第一次试做可以这样走：

1. 在你使用的千问服务中开通该模型，取得自己的 API Key，并确认请求地址和地域。
2. 选一个该模型支持的内置音色，或准备好自己的复刻音色。先用“天生用户必有用，token 用尽还复来！”这一句测试。
3. 保存返回的 WAV，听有没有漏字、奇怪停顿，以及“还复来”是不是读成了 **huán fù lái**。一句能正常生成后，再接着做两句或一组。

本项目后期试听使用的参数如下。这些参数来自实际生成脚本，换平台时不一定全部通用。

| 项目 | 当时使用的值 |
| --- | --- |
| 模型 | `qwen-audio-3.1-tts-flash` |
| 音频格式 | WAV，24,000 Hz，单声道 |
| 语速、音量 | `rate: 1.0`、`volume: 60` |
| seed | `1061`；没有验证固定它就能逐样本重复生成 |

**关于“免费100万 Token”**：2026年10月26日查阅阿里云官方价格页时，该模型在华北2（北京）列有100万 Token免费额度，表注有效期为开通百炼或模型发布之日起90天内，以较晚者为准。是否能用还要看你的账号、地域和实际入口；项目脚本记录的是千问兼容 HTTP 服务，不能用官方额度直接推断它的账户权益。领取前看[官方价格与免费额度说明](https://help.aliyun.com/zh/model-studio/model-pricing)，具体到账额度在自己的控制台查看。本片没有核对过完整平台账单，因此这里不列总花费。

## 2. 确定音色，把“像谁”与“怎么念”分开

音色复制，是让服务根据参考录音创建一个以后可以反复使用的音色。它决定声音的基本特征；重音、停顿和收尾还得另外安排。

作者回忆，声音方向曾参考 B 站 UP 主“DeepSeek鲸鱼娘在运营”，后来又尝试了接近“派蒙”风格的参考。这些是声音风格参考，实际配音由 AI 模型合成。

跟做时按这个顺序准备：

1. 选一段你有权使用的清楚人声，先听有没有背景音乐、多人说话或明显噪声。
2. 按平台的音频要求创建音色，目标模型填 `qwen-audio-3.1-tts-flash`。创建后把返回的音色 ID 保存在本机。
3. 用同一音色生成一小段台词，满意后就保留它。调整一句朗诵时，先改台词与表演要求，不要同时换音色。

当前官方的[声音复刻教程](https://help.aliyun.com/zh/model-studio/voice-cloning-user-guide)给出了创建音色、查询状态、再用音色合成的步骤。音色与目标模型绑定；你需要使用自己账号下、匹配模型的音色 ID。

<details>
<summary>原项目的音色创建记录：哪些找到了，哪些还缺？</summary>

冻结源保留了早期“歌曲参考18秒”的创建脚本，但最终派蒙风格克隆最初的完整创建请求，这轮没有找回。后续复用已有克隆的调用有记录，所以不能把早期18秒配置说成最终音色的创建参数，也不能把这一过程写成训练或微调了模型权重。

</details>

## 3. 分段生成，先听声音，不急着剪进视频

我们让 Agent 写脚本调用服务。这里的 Agent 指能在本机读写文件、运行脚本的 AI 助手。你也可以自己运行文末的小脚本，使用同样的请求模板。

最初的基础表演提示词是：

```text
使用参考音色，认真地吟诵古风诗歌。中文清楚，英文术语自然；不要唱成流行歌，不要添加原文外的字。逗号处有气口，句尾完整。
```

这段是早期 `voice_service.py` 中的真实基础提示词，后面还加过庄重、自信、微醺等方向。它能说明想要的风格，但还没有细到每一句该怎么收、哪次“君不见”该短一些。

我们后来按相邻句子做三组重点试听：

| 组别 | 生成内容 | 为什么放在一起听 |
| --- | --- | --- |
| G1 | 第1、2句，两次“君不见” | 听起兴与炫饭能不能形成反差 |
| G34 | 第6～9句的朗诵部分 | 听邀请、收势、微醺，再交给歌曲的变化 |
| G56 | 第11、12句 | 听劝充值怎样接到最后两次“token来” |

先做这四件事：

1. 拿[真实 G1_A 请求](voice/requests/G1_A.json)生成开头两句。模板中的 `YOUR_PRIVATE_VOICE_ID` 要换成你的音色，密钥只从本机环境变量读取。
2. 输出命名为 `G1_A_r01.wav`，同时留一份不含密钥和真实音色 ID 的参数记录。文件名里的 `r01` 表示第一轮候选。
3. 听完整两句，再记具体问题，比如第二次起势太重、英文后突然换气、句尾截断。别只写“不够好听”。
4. 修改后另存 `r02`，不要覆盖第一轮。声音可用的段落先保存下来，后续只重做有问题的部分。

第9句英文唱段用了已有歌曲片段，不是让朗诵模型直接把英文唱出来。我们没有把该原声放进公开仓库，跟做时可以先用自己的合法唱段，或者先只完成朗诵部分。

## 4. 用导演谱安排起伏，再试停顿

音色基本可用之后，我们借助 GPT 网页端讨论了朗诵的停连、重音、语速和拖腔，整理出十二句导演谱。导演谱就是给声音写的表演说明：哪一句放开，哪一句收住，哪个词需要强调。

当时网页对话里的完整提问没有找回，下面展示的是项目实际保存的导演批注，不是事后补写的“当年提示词”。例如第一句：

```text
节奏：君不见 // 用户 token 天上来 / 落入铁盆 / 不复回。

情绪：开阔、庄重，带一点得意，尚未达到高潮。
起势：“君不见”起音稍低，逐渐抬高，不要从第一个字就大喊。
重音：天上来、落入铁盆。
延音：“来”略舒展，“不复回”最后一个“回”自然下落，收声干净。
句尾：给下一次“君不见”留下气口。
```

这里的 `/` 和 `//` 是给人看的节奏标记，不直接交给模型读。第二次“君不见”的批注则要求更短、更直接，说到“两碗、一碗”时轻快一些。[十二句原导演谱](voice/director-score.md)可以直接阅读，[对应JSON](voice/director-score.json)保留了逐句批注和语音输入。

### 把要求写进一组完整请求

G1 的 A、B 两版都使用了下面这段表演提示词：

```text
沿用参考音色。像诗会主人对朋友吟诗：第一次君不见开阔庄重、由低渐扬；第二次短些，转为得意炫饭，吃白饭、两碗一碗轻快清楚。词组连贯，收声干净。只读台词。
```

A版是自然连续文本；B版的输入加了 SSML。SSML 是给合成服务看的语音标记，这里用 `<break>` 请求句子之间的停顿。B版的完整文本如下：

```xml
<speak>君不见<break time="260ms"/>用户 token 天上来<break time="180ms"/>落入铁盆不复回。<break time="380ms"/>君不见<break time="130ms"/>高高在上吃白饭<break time="180ms"/>招炫两碗暮一碗。</speak>
```

“招炫”只用于帮助 TTS 把“朝”读成 zhāo，屏幕上的原诗仍然是“朝炫”。同样，“将进”在部分语音输入里写成“羌进”来辅助读 qiāng；字幕没有跟着改。

![两次君不见的A/B试听记录；此图是时长示意，不是音频波形](voice/g1-comparison.svg)

这轮记录中，A版10.89秒，B版14.49秒，这一组我最后选了B版。B版不是仅加标签就直接采用，还修整了过长静默；这个选择只说明这两句更适合B。另一组邀请与切歌，我们选的是A；标签加不加、加多少，仍要逐段试听。完整请求在[G1_A](voice/requests/G1_A.json)和[G1_B](voice/requests/G1_B.json)，音色、语速、音量和seed都能对照。

### 有参数，不代表一定控制得住

为了确认接口是否真的听这些要求，我们用同一句做了五个短测试，每次只改一项：

| 尝试 | 当时看到了什么 | 后来怎样用 |
| --- | --- | --- |
| 增加 `instruction` 表演指令 | 请求成功，但没有获得明确的情绪差异证据 | 保留简短意图，最终仍靠试听选择 |
| 加一个250ms的 `break` | 该样本内部停顿从0.46秒变0.81秒，实际多约350ms | 用它增加气口，不把请求值当精确剪辑时长 |
| `hot_fix` 改“还”的读音 | 原版已经读成huán，无法证明修复是否有效 | 不因为返回成功就说读音已被精准控制 |
| `rate: 0.94` | 总长略短，发声与静音比例也变了 | 不靠这个数值精确控时，分组试听统一用1.0 |

需要减短空白时，我们保留原始WAV，只剪长静默的中间部分。这轮A/B处理中，检查了低于−55dBFS、持续超过0.8秒的空白，每侧留下250ms；发声中的字头、字尾没有拿来硬切。dBFS 是相对数字音频满幅的电平，数值越负通常越安静，不能只凭“看着像一条平线”就下刀。

## 5. 最后逐处改，好的候选留住

到了这里，“不满意”要尽量说成能操作的反馈。我们不是不断重做整首，而是保留好的段落，把问题句单独抽出来。

### 例子一：Claude、GPT，越解释反而越别扭

| 轮次 | 做过的尝试 | 后续决定 |
| --- | --- | --- |
| R11 | 在字母之间加停顿 | 辅助转写漏掉G，继续修改 |
| R12 | 改用中文近音，把名字分成几拍 | 作者不满意，撤回中文谐音方向 |
| R13 | 恢复英文，沿用已喜欢的R10表演语汇，再生成候选 | 作者确认过，作为后续英文读法与声音风格参考 |
| 后来的G34 A/B | 把邀请到切歌放进连续的一组里试听 | 选择G34_A，正式混音使用其L06/L07等片段，并继续局部修订其他句 |

R13的完整请求原文，这轮没有在可公开资料中找回。能完整复制的后续版本是[G34_A请求](voice/requests/G34_A.json)。本项目没有验证“固定seed就必定生成同样的声音”；文字和表演要求变化时，也不能仅凭音色ID没变就断言听感一定相同。

### 例子二：token后面别突然换气

第4句早一轮尝试把前后两半用220ms停顿隔开，并要求更豪迈。后来仍需要调整连贯性，最终这一轮改成了普通文本，把问题直接写给模型：

```text
沿用参考音色，豪迈而自然地吟诗。后半句一气呵成，token直接连着用尽说，像普通中英混说一样流畅；重音落在还复来，语气上扬、来舒展。不要在英文后换气或重新起句。只读台词。
```

实际送入TTS的完整文本是：

```text
天生用户必有用，token用尽寰复来！
```

这里用“寰”辅助 huán 的读音，字幕仍为“还”。这轮没有SSML，也没有把“token”和“用尽”分别剪开再拼。`L04_natural_connected_r03` 进入了正式混音；[完整请求](voice/requests/L04_natural_connected_r03.json)保留了真实参数。

最后七个字也是单独处理的。作者要求“与尔同销”四字连贯，后面“万、卡、愁”逐字强调，我们只重做了这七字，再接回已选段落。[这次的完整提示词和停顿标记](voice/requests/G56_tail_four_connected_three_stressed_r01.json)也保留着。这里的“最后微调”指改表演、选候选和剪接，没有训练新的模型权重。

## 生成之后，音频怎么接进成片？

1. **先拼干声。** 干声就是还没混BGM的配音。保留已经选好的分组，把需要修订的句子接进去；先听声音有没有突然变、字有没有断。
2. **接缝放在自然气口。** 项目里在确认静默的位置剪接，部分接缝用了8ms交叉淡化，让前后声音短暂重叠过渡。这个数值不是任意两段都能直接套用，先确认没剪到发声中的字。
3. **再加歌曲、BGM和音效。** 朗诵出现时适当压低配乐；项目用了侧链压缩，也就是让配音的音量变化带动BGM避让。歌曲作为独立片段接入。
4. **声音确定后再排字幕。** 以实际音频时长校准每句出现时间，不按十二句平均分配。Remotion 是我们用来按帧合成字幕、画面和音频的工具。
5. **听到片尾再结束。** 定稿最后延长约3秒，画面和表情继续，BGM慢慢收下去，最终全片87.1秒。

## 这次最值得记住的五件事

- **音色满意后，先别换它。** 改声音、台词、情绪、速度一起动，就很难知道哪处起了作用。
- **中文显示稿与TTS读音辅助分开存。** “朝→招”“将→羌”“还→寰”只改送进语音服务的文字，不要改坏原诗字幕；英文名字也不必越写越复杂。
- **一句一句都豪迈，整首就没有起伏。** 两次“君不见”需要反差，“倾耳听”要收，最后召唤才放开。
- **停顿要听，不只看毫秒数。** SSML请求值与实际时长不完全相等，音频转文字的ASR结果也只能帮你找疑点，不能替你判表演。
- **好的一轮另存，不覆盖。** 每次重试留下文本、提示词、参数和自己的听感记录，只改真正不满意的句子。

<details>
<summary>动手附录：用模板生成自己的两句试听</summary>

### 准备文件与环境

打开本页[请求模板目录](voice/requests)，先把 `G1_A.json` 和 `G1_B.json` 的完整JSON复制到本机同名文件。另备Python、自己的服务地址、API Key与匹配模型的音色ID。下面代码是为了公开教程改写的最小客户端，保留项目的请求形状、参数及两种音频返回处理；不是原项目完整服务脚本。

在本机设置 `TTS_BASE_URL`、`TTS_API_KEY`、`TTS_VOICE_ID`。其中 `TTS_BASE_URL` 只填服务主机，不包含 `/api/v1`。当前阿里云官方地址需要业务空间ID与相应地域；以[官方HTTP文档](https://help.aliyun.com/zh/model-studio/qwen-audio-tts-http-api)为准。换用其他兼容入口时，先确认该入口的参数、音色和计费，不直接照搬账户配置。

Windows用PowerShell 7设置本次终端会话的变量。先把地址里的 `YOUR_WORKSPACE_ID` 换成你在平台看到的业务空间ID；下面是官方北京地域的地址形状，不是本项目私有账号地址。

```powershell
$env:TTS_BASE_URL = 'https://YOUR_WORKSPACE_ID.cn-beijing.maas.aliyuncs.com'
$env:TTS_API_KEY = Read-Host -MaskInput '输入自己的 API Key'
$env:TTS_VOICE_ID = Read-Host -MaskInput '输入自己的音色 ID'
```

Linux或macOS使用Bash时，可以这样设置；服务与音色仍需来自同一账号和地域。

```bash
export TTS_BASE_URL='https://YOUR_WORKSPACE_ID.cn-beijing.maas.aliyuncs.com'
read -rs -p 'API Key: ' TTS_API_KEY
export TTS_API_KEY
read -rs -p 'Voice ID: ' TTS_VOICE_ID
export TTS_VOICE_ID
```

把下列代码存为 `try_voice.py`，与JSON模板放在同一目录。代码不会把密钥、真实音色ID或返回的临时下载链接写入旁边的参数记录；已有同名输出时会停止，避免不小心重付一次费。

```python
import base64
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)
request_file = Path(sys.argv[1])
output_file = Path(sys.argv[2])
metadata_file = output_file.with_suffix(".request.json")
if output_file.exists() or metadata_file.exists():
    raise SystemExit("输出已存在，请换一个轮次文件名。")
if not output_file.parent.is_dir():
    raise SystemExit("输出目录不存在，请先建好目录。")

payload = json.loads(request_file.read_text(encoding="utf-8"))
payload["input"]["voice"] = os.environ["TTS_VOICE_ID"]
endpoint = os.environ["TTS_BASE_URL"].rstrip("/")
endpoint += "/api/v1/services/audio/tts/SpeechSynthesizer"
if not endpoint.startswith("https://"):
    raise SystemExit("服务地址需要使用HTTPS。")

request = urllib.request.Request(
    endpoint,
    data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
    headers={
        "Authorization": "Bearer " + os.environ["TTS_API_KEY"],
        "Content-Type": "application/json",
    },
    method="POST",
)
try:
    with opener.open(request, timeout=60) as response:
        result = json.load(response)
except urllib.error.HTTPError as error:
    raise SystemExit(f"请求失败：HTTP {error.code}；先核对本机服务配置。")

if result.get("code"):
    raise SystemExit("服务返回错误；在本机检查响应，不要公开带隐私的原始返回。")
audio = result.get("output", {}).get("audio", {})
if audio.get("data"):
    raw = base64.b64decode(audio["data"])
elif audio.get("url", "").startswith("https://"):
    with urllib.request.urlopen(audio["url"], timeout=60) as response:
        raw = response.read()
else:
    raise SystemExit("没有得到音频；请核对当前服务的返回格式。")

output_file.write_bytes(raw)
safe_payload = {
    **payload,
    "input": {**payload["input"], "voice": "YOUR_PRIVATE_VOICE_ID"},
}
metadata_file.write_text(
    json.dumps(safe_payload, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print("已保存音频和脱敏参数；请先试听。")
```

实际执行会调用你的语音服务，可能计费。本轮编写教程只做语法和模板核对，没有用它向服务发请求。

```sh
python try_voice.py G1_A.json G1_A_r01.wav
python try_voice.py G1_B.json G1_B_r01.wav
```

第一次先听A，确认音色、文本和服务正常，再决定是否生成B。原项目B版还做了静默修整，你下载到的原始B音频仍需要试听和处理。

用FFmpeg检查文件能否完整解码：

```sh
ffmpeg -v error -i G1_A_r01.wav -f null -
```

这只检查文件，不评价好不好听。整理自己的参考音频时，下面命令可转成24kHz单声道WAV；它是教程中的格式转换示例，不是最终克隆那次已找回的完整预处理参数。

```sh
ffmpeg -i my-reference.wav -ac 1 -ar 24000 -c:a pcm_s16le reference-24k.wav
```

API Key、真实音色ID、人声参考与服务配置只保存在本机，不把 `.local.md`、带签名下载地址或原始响应上传GitHub。没有允许再分发的人声参考，也不作为教程附件。

</details>

<details>
<summary>进阶资料：完整请求、原始记录与最终工程</summary>

- [八份真实请求](voice/requests)：三组A/B、第4句自然连读修订、最后七字修订。每份只替换实际私密音色值；模型、表演提示词、台词和参数保留。
- [十二句导演谱](voice/director-score.md)、[逐句JSON](voice/director-score.json)与[提示词来源](voice/prompt-sources.json)。导演批注不是每一个都已被模型精确执行。
- 早期提示词：冻结源 `production/scripts/voice_service.py` 的 `BASE_STYLE`。分组与参数：`production/v3/18_director_audio_20261022/audio_work.py`、`generation_cases.json`、`capabilities.md`。逐轮修改：`production/v3/19_refinement_20261022/`。
- 英文读法的R11～R13经过：冻结源 `report/大肥鱼吟诗_卡住进程恢复与逐句配音_20261021.md`；它包含历史待审状态，不能把每段都读作最终结论。
- 早期78.859秒的音频预览是一次阶段产物，后面还改过；正式影片为87.1秒。
- 最终[Remotion工程与运行步骤](../editor/README.md)、[实际重渲染验证](../../../reports/02_build_and_qc.md)。源码档案保留；读这篇教程不需要先懂Git提交或文件哈希。

</details>
