# R2 + Google TTS Setup (ChaosLengua)

External-service provisioning Nae handles outside this repo. Once the env
vars below land in `apps/chaoslengua/.env.local` (and Vercel), the runtime
`/api/tts` route and the `scripts/generate-gap-audio-es.ts` bulk generator
work end-to-end.

## TL;DR env vars

Add these to `apps/chaoslengua/.env.local`:

```
# Cloudflare R2
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<token access key>
R2_SECRET_ACCESS_KEY=<token secret>
R2_BUCKET_NAME=chaoslengua-audio
R2_PUBLIC_URL=https://audio.chaoslengua.adhdesigns.dev

# Google Cloud TTS — pick one, not both
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json   # local dev
# or:
GOOGLE_TTS_CREDENTIALS_JSON={"type":"service_account","project_id":"…"}  # Vercel / serverless
```

Same keys go in the Vercel project's Environment Variables.

## Cloudflare R2

New bucket, separate from ChaosLimbă's. Keeps audio libraries isolated so
deleting/rewriting ES audio never touches RO audio.

1. **Create bucket**
   - Cloudflare Dashboard → R2 → Create bucket
   - Name: `chaoslengua-audio` (matches `R2_BUCKET_NAME` above)
   - Location: Automatic

2. **Connect a custom domain for public reads**
   - Bucket → Settings → Custom Domains → Connect Domain
   - Subdomain: `audio.chaoslengua.adhdesigns.dev` (whatever DNS record
     you own — this is what consumers GET from)
   - Cloudflare auto-provisions TLS. DNS takes ~1 min
   - Whatever URL you land on goes into `R2_PUBLIC_URL` (no trailing
     slash)

3. **Generate an API token for the app**
   - R2 → Manage R2 API Tokens → Create API token
   - Permission: **Object Read & Write**
   - Specify bucket: `chaoslengua-audio` only (don't grant account-wide)
   - TTL: your call — longer is easier, shorter is safer
   - Save `Access Key ID` → `R2_ACCESS_KEY_ID`
   - Save `Secret Access Key` → `R2_SECRET_ACCESS_KEY`
   - `R2_ENDPOINT` shows on the same page (starts with
     `https://<account-id>.r2.cloudflarestorage.com`)

4. **CORS** — only needed if browsers fetch audio directly from a
   non-same-origin page. The standard flow serves MP3s through a
   `<audio src>` from the R2 custom domain, which doesn't need CORS.
   Skip unless the player needs `fetch()` access to audio bytes.

## Google Cloud TTS

Decision up front: reuse ChaosLimbă's GCP project, or new project?
- **Reuse existing** — simpler, one billing account, voices/quotas pool.
  Strong default.
- **Separate project** — only if you want cost isolation per app.

Assuming reuse:

1. **Enable the TTS API** (one-time, per project)
   - GCP Console → APIs & Services → Library → "Cloud Text-to-Speech API"
     → Enable. Already on if ChaosLimbă has ever synthesized audio.

2. **Service account**
   - IAM & Admin → Service Accounts → Create
   - Name: `chaoslengua-tts` (purely organizational)
   - Role: **Cloud Text-to-Speech User** (principle of least privilege;
     don't grant Editor or Owner)
   - Done → open the new SA → Keys → Add Key → Create new key → JSON
   - Save the JSON file somewhere outside the repo (never commit it)

3. **Wire credentials**
   - Local dev:
     ```
     GOOGLE_APPLICATION_CREDENTIALS=/Users/nae/…/chaoslengua-tts.json
     ```
   - Vercel: can't mount a file. Paste the JSON contents as one line into
     `GOOGLE_TTS_CREDENTIALS_JSON` (the env var accepts stringified
     JSON). `google-cloud.ts` parses it at client init.
   - The two env vars are mutually exclusive; `google-cloud.ts` prefers
     `GOOGLE_TTS_CREDENTIALS_JSON` if both are set.

4. **Dialect / voice choice**
   - `google-cloud.ts` currently synthesizes with
     `es-ES-Wavenet-C` (female) and `es-ES-Wavenet-B` (male) —
     Peninsular Spanish, verified in Google's voice catalog.
   - If you want LatAm-neutral synthesis (matching ChaosLengua's
     content-side dialectal policy), swap to `es-US-Neural2-A` /
     `es-US-Neural2-B` (or Wavenet equivalents) after verifying the
     exact voice names at the Google Cloud Console → Text-to-Speech →
     Voice list. Code change is two lines in the `VOICES` constant plus
     `LANGUAGE_CODE`.
   - **Do not** silently enable both `es-ES` and `es-US` voices in
     parallel without a product decision — voice-gender consistency
     across a learner's history matters for recognition.

## Runtime TTS vs bulk generation

- **Runtime** — `/api/tts` (POST) synthesizes on-demand when a user
  clicks "play" on a word/phrase. Limited to 200 chars/request and
  2000 chars/user/day (see `MAX_TEXT_LENGTH` / `DAILY_CHAR_LIMIT` in
  `src/app/api/tts/route.ts`). Usage is logged to `tts_usage`.
- **Bulk** — `scripts/generate-gap-audio-es.ts` synthesizes audio for
  any content row that has `textContent` but null `audioUrl`, uploads
  MP3s to R2 under `gap-content/<uuid>.mp3`, and updates the row with
  `audioUrl` + `durationSeconds`. Bypasses the daily-usage table
  entirely — it's infrastructure, not user-attributable usage.

## Running the bulk generator

Once env vars are in place:

```bash
cd apps/chaoslengua
npx tsx scripts/generate-gap-audio-es.ts
```

Walks every `contentItems` row where `type='text'` AND `audioUrl IS NULL`,
synthesizes, uploads, updates. Alternates female/male voice by item
index. Rate-limited to ~3/sec via a 300ms delay between items. Prints
per-item cost (~$0.00003 for a typical passage) and a running total.

Rerunnable — items that succeeded on a prior pass already have `audioUrl`
set, so the filter excludes them.

## Failure modes to expect

- **`PERMISSION_DENIED` on the TTS API** — service account is missing
  the `Cloud Text-to-Speech User` role, or the TTS API isn't enabled
  on the project.
- **`INVALID_ARGUMENT` on voice name** — you swapped to a voice code
  that Google has deprecated or that doesn't exist in the current
  catalog. Check the voice list page, update `VOICES` in
  `src/lib/tts/google-cloud.ts`.
- **`NoSuchBucket` from R2** — `R2_BUCKET_NAME` doesn't match the bucket
  you created, or the API token's scope excludes the bucket.
- **Audio plays but the MP3 is served from the wrong origin** —
  `R2_PUBLIC_URL` doesn't match what you wired in Cloudflare. The app
  constructs `${R2_PUBLIC_URL}/<key>` and stores that as `audioUrl`; if
  the custom domain changes later, a migration script (model it on
  chaoslimba's `update-audio-urls-to-r2.ts`) rewrites the saved URLs.

## Cost

Google TTS Wavenet: **$16 per 1M characters** = $0.000016/char.
For a typical ChaosLengua passage (~200 chars), that's ~$0.003 per item.
1000 items ≈ $3. Cloudflare R2 egress is free; storage ~$0.015/GB/month.

Audio volume, not TTS synthesis, is the cost driver at scale —
keep textContent concise and don't re-synthesize on cache miss.
