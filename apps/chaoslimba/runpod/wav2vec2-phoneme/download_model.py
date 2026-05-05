"""
Pre-download model weights into the Docker image so cold starts don't pay
the ~1.2GB download cost. Run during `docker build`, not at runtime.
"""
from transformers import Wav2Vec2ForCTC, AutoProcessor

MODEL = "facebook/wav2vec2-xlsr-53-espeak-cv-ft"

print(f"Pre-downloading processor for {MODEL}...")
AutoProcessor.from_pretrained(MODEL)

print(f"Pre-downloading model weights for {MODEL}...")
Wav2Vec2ForCTC.from_pretrained(MODEL)

print("Model cached in image.")
