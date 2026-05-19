# ChaosLengua — Spanish Phoneme ASR (RunPod Serverless)

**Model:** `Cnam-LMSSC/wav2vec2-spanish-phonemizer`  
**Size:** ~94MB (much smaller than the Romanian endpoint's 1.2GB)  
**Output:** IPA token string, e.g. `p e ɾ o` for "pero"

---

## How it works

1. Learner records audio in the browser
2. App sends base64-encoded audio to `/api/analyze-pronunciation`
3. Route calls this RunPod endpoint via `transcribeToIpa(buffer, 'es')`
4. Model returns IPA tokens
5. `comparePhonemes()` aligns them against the reference IPA (generated from Google TTS)
6. Per-phoneme diff goes back to the UI

---

## Deploy steps

You need: Docker Desktop running, a Docker Hub account, a RunPod account.

### 1. Build the image

```bash
cd apps/chaoslengua/runpod/wav2vec2-phoneme
docker build -t YOUR_DOCKERHUB_USERNAME/chaoslengua-phoneme:latest .
```

The build will take a few minutes — it downloads the model weights into the image layer during `docker build` so cold starts are fast.

### 2. Test locally before pushing

Record or grab any `.wav` file of someone saying a Spanish word, then:

```bash
docker run --rm \
  -v $(pwd)/test_audio.wav:/test.wav \
  YOUR_DOCKERHUB_USERNAME/chaoslengua-phoneme:latest \
  python3 test_handler.py /test.wav
```

You should see something like:
```json
{
  "ipa": "p e ɾ o",
  "duration_sec": 0.832,
  "device": "cpu"
}
```

If you get an error about espeak-ng or phonemizer, the image didn't build correctly — re-run `docker build` with `--no-cache`.

### 3. Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/chaoslengua-phoneme:latest
```

### 4. Create the RunPod serverless endpoint

1. Go to [runpod.io](https://runpod.io) → **Serverless** → **New Endpoint**
2. **Container image:** `YOUR_DOCKERHUB_USERNAME/chaoslengua-phoneme:latest`
3. **GPU:** `NVIDIA RTX 3090` or `RTX 4090` (the model is small, 3090 is fine and cheaper)
4. **Min workers:** `0` (scale to zero when idle — saves money)
5. **Max workers:** `3` (adjust based on expected concurrent users)
6. **Idle timeout:** `5` seconds
7. Click **Deploy**

RunPod will show you an **Endpoint ID** once it's live — looks like `abc123xyz`.

### 5. Set the env var in Vercel

In the ChaosLengua Vercel project → Settings → Environment Variables:

```
RUNPOD_PHONEME_ES_ENDPOINT_ID = abc123xyz
```

`RUNPOD_API_KEY` should already be set from the Romanian endpoint — it's shared.

### 6. Verify end-to-end

Once the Vercel env var is deployed, `isPhonemeAnalysisAvailable('es')` will return `true` and the phoneme pipeline will activate automatically. No code changes needed.

Quick check — hit the analyze-pronunciation route with a test recording and confirm the response includes a `phoneme` field:

```json
{
  "result": {
    "pronunciationScore": 0.82,
    "transcription": "pero",
    "phoneme": {
      "userIpa": "p e ɾ o",
      "referenceIpa": "p e ɾ o",
      "phonemeAccuracy": 1.0,
      "alignment": [...]
    }
  }
}
```

---

## Fallback model

If the Cnam model produces bad results (it has low download count — ~150 — so production quality is less proven), swap to:

**`jonatasgrosman/wav2vec2-large-xlsr-53-spanish`** (~315M params, 1.2M downloads)

This model outputs graphemes (text), not IPA directly. To use it you'd need to add a g2p step for the target text comparison — `phonemizer` with `espeak-ng` backend handles this. The handler and Dockerfile are already set up with the `espeak-ng` + `phonemizer` deps, so the only change is:

1. In `handler.py` and `download_model.py`: change `MODEL_NAME` to `jonatasgrosman/wav2vec2-large-xlsr-53-spanish`
2. Add a g2p call to convert target text → IPA before `comparePhonemes()`
3. Rebuild + redeploy

The Romanian endpoint uses this exact pattern — `facebook/wav2vec2-xlsr-53-espeak-cv-ft` is grapheme-output with g2p on the reference side.

---

## Cost estimate

Same as Romanian: ~$0.001–0.002 per analysis. At 1000 analyses/month ≈ $1–2.
