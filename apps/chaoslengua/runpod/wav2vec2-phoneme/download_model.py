"""
Pre-download model weights into the Docker image so cold starts don't pay
the download cost. Run during `docker build`, not at runtime.
"""
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODEL = "jonatasgrosman/wav2vec2-large-xlsr-53-spanish"

print(f"Pre-downloading processor for {MODEL}...")
# Use Wav2Vec2Processor directly — AutoProcessor would try to load
# Wav2Vec2ProcessorWithLM (requires pyctcdecode) since this model ships with
# an LM decoder. We don't need the LM for greedy CTC inference.
Wav2Vec2Processor.from_pretrained(MODEL)

print(f"Pre-downloading model weights for {MODEL}...")
Wav2Vec2ForCTC.from_pretrained(MODEL)

print("Model cached in image.")
