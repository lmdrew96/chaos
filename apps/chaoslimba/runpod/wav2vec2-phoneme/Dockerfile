# Romanian phoneme ASR endpoint for RunPod Serverless
# Model: facebook/wav2vec2-xlsr-53-espeak-cv-ft (~1.2GB, baked into image for fast cold starts)

FROM runpod/base:0.6.2-cuda12.4.1

# ── System deps ──────────────────────────────────────────────
# ffmpeg     — librosa uses it to decode mp3/webm/ogg/m4a
# espeak-ng  — required by the phonemizer Python lib (loaded by Wav2Vec2PhonemeCTCTokenizer at init)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg espeak-ng && \
    rm -rf /var/lib/apt/lists/*

# ── Python deps (cached layer — invalidated only when requirements change) ──
COPY requirements.txt /requirements.txt
# Use `python3 -m pip` (not bare `pip`) so the install lands in the same interpreter
# we run with — RunPod base images ship multiple Python installs and bare pip can
# install into a different prefix than `python3` reads from.
RUN python3 -m pip install --no-cache-dir -r /requirements.txt

# ── Pre-download model into the image (separate layer for build cache) ──
COPY download_model.py /download_model.py
RUN python3 /download_model.py

# ── Handler (small layer, frequently changing) ──
COPY handler.py /handler.py

CMD ["python3", "-u", "/handler.py"]
