"""
RunPod serverless handler for Spanish phoneme ASR.
Model: jonatasgrosman/wav2vec2-large-xlsr-53-spanish (~315MB, baked into image).

This model outputs Spanish graphemes (text), not IPA directly. We run the
transcription through espeak-ng (via the phonemizer library) to convert to IPA
so the output contract matches the Romanian endpoint: always returns IPA tokens.

Input format (RunPod serverless convention):
    { "input": { "audio": "<base64-encoded audio bytes>" } }

Supported audio formats: wav, mp3, webm, ogg, m4a, flac (anything ffmpeg reads).

Output:
    { "ipa": "p e ɾ o", "duration_sec": 1.23 }
    or
    { "error": "..." }
"""

import base64
import os
import tempfile
import time

import librosa
import runpod
import torch
from phonemizer import phonemize
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODEL_NAME = "jonatasgrosman/wav2vec2-large-xlsr-53-spanish"
TARGET_SR = 16000
ESPEAK_LANG = "es"

print(f"[init] Loading {MODEL_NAME}...")
_t0 = time.time()
processor = Wav2Vec2Processor.from_pretrained(MODEL_NAME)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_NAME)
model.eval()
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
print(f"[init] Model loaded on {device} in {time.time() - _t0:.1f}s")

# Warm up espeak backend at init so first request isn't slow
print("[init] Warming espeak-ng backend...")
phonemize("hola", language=ESPEAK_LANG, backend="espeak", with_stress=False)
print("[init] Ready.")


def graphemes_to_ipa(text: str) -> str:
    """Convert Spanish text to space-separated IPA tokens via espeak-ng."""
    ipa = phonemize(
        text,
        language=ESPEAK_LANG,
        backend="espeak",
        with_stress=False,
        preserve_punctuation=False,
        njobs=1,
    )
    # espeak returns a continuous IPA string; split into tokens to match the
    # format comparePhonemes() expects (space-separated phoneme tokens)
    return " ".join(ipa.strip())


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
        transcription = processor.batch_decode(predicted_ids)[0].lower().strip()

        if not transcription:
            return {"error": "Model returned empty transcription"}

        ipa = graphemes_to_ipa(transcription)

        return {
            "ipa": ipa,
            "transcription": transcription,
            "duration_sec": round(duration, 3),
            "device": device,
        }

    except Exception as e:
        return {"error": f"{type(e).__name__}: {e}"}


if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})
