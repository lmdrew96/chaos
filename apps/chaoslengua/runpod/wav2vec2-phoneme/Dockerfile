# Spanish phoneme ASR endpoint for RunPod Serverless
# Model: Cnam-LMSSC/wav2vec2-spanish-phonemizer (~94MB, baked into image for fast cold starts)

FROM runpod/base:0.6.2-cuda12.4.1

# ── System deps ──────────────────────────────────────────────
# ffmpeg     — librosa uses it to decode mp3/webm/ogg/m4a
# espeak-ng  — required by Wav2Vec2PhonemeCTCTokenizer at init
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg espeak-ng && \
    rm -rf /var/lib/apt/lists/*

# ── Python deps ──────────────────────────────────────────────
COPY requirements.txt /requirements.txt
RUN python3 -m pip install --no-cache-dir -r /requirements.txt

# ── Pre-download model into image ────────────────────────────
COPY download_model.py /download_model.py
RUN python3 /download_model.py

# ── Handler ──────────────────────────────────────────────────
COPY handler.py /handler.py

CMD ["python3", "-u", "/handler.py"]
