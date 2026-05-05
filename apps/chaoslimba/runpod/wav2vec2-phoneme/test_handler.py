"""
Local sanity check — runs the handler against a real audio file without RunPod.
Useful for verifying the Docker image works before deploying.

Usage:
    python test_handler.py path/to/audio.wav
"""
import base64
import json
import sys

from handler import handler


def main():
    if len(sys.argv) != 2:
        print("Usage: python test_handler.py <audio_file>")
        sys.exit(1)

    audio_path = sys.argv[1]
    with open(audio_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")

    event = {"input": {"audio": audio_b64}}
    result = handler(event)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
