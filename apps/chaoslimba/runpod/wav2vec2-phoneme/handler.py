"""
RunPod serverless handler for Romanian phoneme ASR.
Model: facebook/wav2vec2-xlsr-53-espeak-cv-ft (multilingual, outputs IPA).

Input format (RunPod serverless convention):
    { "input": { "audio": "<base64-encoded audio bytes>" } }

Supported audio formats: wav, mp3, webm, ogg, m4a, flac (anything ffmpeg reads).

Output:
    { "ipa": "b u n a   z i w a", "duration_sec": 1.23 }
    or
    { "error": "..." }
"""

import base64
import io
import os
import tempfile
import time

import librosa
import runpod
import torch
from transformers import Wav2Vec2ForCTC, AutoProcessor

MODEL_NAME = "facebook/wav2vec2-xlsr-53-espeak-cv-ft"
TARGET_SR = 16000

print(f"[init] Loading {MODEL_NAME}...")
_t0 = time.time()
processor = AutoProcessor.from_pretrained(MODEL_NAME)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_NAME)
model.eval()
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
print(f"[init] Model loaded on {device} in {time.time() - _t0:.1f}s")


def handler(event):
    try:
        input_data = event.get("input", {})
        audio_b64 = input_data.get("audio")
        if not audio_b64:
            return {"error": "Missing 'audio' field (base64-encoded audio bytes)"}

        try:
            audio_bytes = base64.b64decode(audio_b64)
        except Exception as e:
            return {"error": f"Invalid base64 audio: {e}"}

        # Write to tempfile so librosa can sniff the format (BytesIO is unreliable across formats)
        with tempfile.NamedTemporaryFile(suffix=".audio", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            audio, _sr = librosa.load(tmp_path, sr=TARGET_SR, mono=True)
        finally:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass

        if audio.size == 0:
            return {"error": "Audio decoded to empty array"}

        duration = len(audio) / TARGET_SR

        inputs = processor(audio, sampling_rate=TARGET_SR, return_tensors="pt")
        input_values = inputs.input_values.to(device)

        with torch.no_grad():
            logits = model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        ipa = processor.batch_decode(predicted_ids)[0]

        return {"ipa": ipa, "duration_sec": round(duration, 3), "device": device}

    except Exception as e:
        return {"error": f"{type(e).__name__}: {e}"}


if __name__ == "__main__":
    # Only start the serverless worker when run directly (in RunPod). Guarded so
    # `from handler import handler` works for local testing without triggering
    # the worker startup loop.
    runpod.serverless.start({"handler": handler})
