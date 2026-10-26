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
