# RunPod Serverless: Romanian Phoneme ASR

Self-hosted endpoint for `facebook/wav2vec2-xlsr-53-espeak-cv-ft` — produces IPA from Romanian audio. This is the model that no longer has free HF Inference, so we host it ourselves.

**Expected cost:** ~$0.001–0.005 per call on RTX 4000 Ada (cheapest viable GPU). 1000 calls/month ≈ $1–5. Stays inside the $0–5 chaoslimba budget.

## Prerequisites

- [ ] Docker Desktop installed on Mac (`docker --version` should work)
- [ ] Docker Hub account (free) at https://hub.docker.com — needed to push the image
- [ ] RunPod account at https://runpod.io with at least $10 credit loaded

## Step 1 — Build the image locally

From this directory (`apps/chaoslimba/runpod/wav2vec2-phoneme/` — wherever it lives on your machine):

```bash
docker build --platform linux/amd64 -t chaoslimba-phoneme:latest .
```

`--platform linux/amd64` is **required** on Apple Silicon Macs — RunPod runs x86 hosts and won't execute arm64 images. (Skip the flag on x86 Linux.)

This downloads ~1.2GB of model weights and bakes them into the image. Build takes ~5–10 minutes. Final image is ~6–8 GB.

## Step 2 — Sanity check the handler locally

Before pushing to RunPod, confirm the handler actually works. From the chaoslimba app root (`apps/chaoslimba/`):

```bash
# Drop a Romanian audio file at scripts/spike-audio/01-anything.wav first (or use a YODAS sample)
docker run --rm \
  -v "$(pwd)/scripts/spike-audio:/audio" \
  --entrypoint python3 \
  chaoslimba-phoneme:latest \
  /test_handler.py /audio/01-anything.wav
```

You should see a JSON response like:

```json
{
  "ipa": "n u   tʃ e t s i v ə   d e   tʃ e r tʃ e t a t s i ...",
  "duration_sec": 10.86,
  "device": "cpu"
}
```

Note: locally it'll say `device: cpu` (you don't have a CUDA GPU on Mac). On RunPod it'll be `device: cuda`. Inference will be slow locally (~30–60s for a 10s clip on CPU) — this is expected, just a sanity check that the pipeline doesn't crash.

## Step 3 — Push to Docker Hub

```bash
docker login
# Replace YOUR_USERNAME with your Docker Hub username
docker tag chaoslimba-phoneme:latest YOUR_USERNAME/chaoslimba-phoneme:latest
docker push YOUR_USERNAME/chaoslimba-phoneme:latest
```

Push takes ~5–15 minutes depending on upload speed.

## Step 4 — Create the RunPod Serverless endpoint

1. Go to https://runpod.io/console/serverless
2. Click **+ New Endpoint**
3. Choose **Custom Source** → **Docker Image**
4. **Container Image:** `YOUR_USERNAME/chaoslimba-phoneme:latest`
5. **Container Disk:** 15 GB (image + scratch space)
6. **GPUs:** Select **RTX 4000 Ada** (cheapest that handles the model well). If unavailable, RTX 3090 or A4000 are fine alternatives.
7. **Workers:**
   - Min Workers: `0` (scale to zero when idle — critical for budget)
   - Max Workers: `1` (single-user app, no concurrency needed yet)
   - Idle Timeout: `5` seconds (kill workers fast)
   - Flashboot: `Enabled` (faster cold starts)
8. **Advanced** → leave defaults
9. Click **Deploy**

The first cold start will take ~30–60 seconds (worker boots, image pulls if not cached). Subsequent calls within ~30s are warm (~1–2s inference).

## Step 5 — Wire credentials into chaoslimba

Once deployed, on the endpoint detail page grab:
- **Endpoint ID** (looks like `4b3xy7q8...`)
- **API Key** — from your RunPod account settings (Settings → API Keys → Create)

Add to `apps/chaoslimba/.env.local`:

```bash
RUNPOD_PHONEME_RO_ENDPOINT_ID=4b3xy7q8...
RUNPOD_API_KEY=rpa_...
```

## Step 6 — Re-run the spike

```bash
cd apps/chaoslimba
npx tsx scripts/spike-phoneme-pronunciation.ts
```

The script will detect the RunPod env vars and route through your endpoint instead of HF Inference. You should see real IPA output for the YODAS samples and a usable comparison report.

## Common gotchas

- **Endpoint stuck "In Queue" forever** → workers aren't booting. Check the endpoint logs in RunPod console. Usually means image pull is failing (typo in image name) or no GPU available in your selected region (try a different region in endpoint settings).
- **`CUDA out of memory`** → you picked a GPU with <8GB VRAM. Switch to RTX 4000 Ada or larger.
- **Cold start >2 minutes** → image is being pulled fresh. After the first cold start RunPod caches it on the worker host and subsequent cold starts are ~10s.
- **Cost spiraling** → check Min Workers is `0` and Idle Timeout is `5s`. If Min Workers is `>0`, you're paying for an always-on GPU even when idle.
- **403 from API** → API key was generated under a different account, or the key was revoked. Generate a fresh one.

## Updating the model later

```bash
# From this directory, after editing handler.py / Dockerfile:
docker build --platform linux/amd64 -t YOUR_USERNAME/chaoslimba-phoneme:latest .
docker push YOUR_USERNAME/chaoslimba-phoneme:latest
# In RunPod console → endpoint → Edit → click "Refresh Workers" to pull the new image
```
