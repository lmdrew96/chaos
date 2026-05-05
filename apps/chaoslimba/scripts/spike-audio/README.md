# Spike Audio Drop Folder (Optional)

The spike (`spike-phoneme-pronunciation.ts`) **auto-fetches native Romanian samples from the YODAS-Granary HuggingFace dataset** by default. You don't need to drop anything here for it to run.

This folder is only useful if you want to test additional samples — e.g., your own voice as a "learner" comparison against the TTS reference.

## Filename convention (if you do drop files)

Match the **index** of a YODAS sample (1-based):

```
01-mine.{wav,mp3,webm,ogg,m4a}
02-mine.{wav,mp3,webm,ogg,m4a}
```

The script picks them up automatically and adds a "user vs TTS reference" row to the report.

## What to record (if you want to)

Record yourself saying the **same Romanian sentence** as the YODAS sample at that index (the spike prints each sample's transcript). The whole point is to compare your pronunciation against both the native baseline and the TTS reference.
