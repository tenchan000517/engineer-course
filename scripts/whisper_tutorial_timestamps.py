#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
解説リール用Whisperタイムスタンプ取得スクリプト

audio_trimmed/ フォルダ内の各mp3ファイルを個別にfaster-whisperで処理し、
単語レベルのタイムスタンプをJSON形式で出力する。

使い方:
    python whisper_tutorial_timestamps.py "{PROJECT_FOLDER}"

出力:
    {PROJECT_FOLDER}/audio_trimmed/01.json, 02.json, ...
"""

import sys
import os
import json
from pathlib import Path

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("[ERROR] faster-whisperがインストールされていません")
    print("インストール: pip install faster-whisper")
    sys.exit(1)


def transcribe_to_json(audio_file, model, language="ja"):
    """
    音声ファイルから単語レベルタイムスタンプを取得してJSONで出力する。
    """
    print(f"  {os.path.basename(audio_file)}...", end=" ")

    segments, info = model.transcribe(
        audio_file,
        language=language,
        beam_size=5,
        word_timestamps=True
    )

    audio_path = Path(audio_file)
    json_file = audio_path.with_suffix('.json')

    json_data = {
        "audio_file": os.path.basename(audio_file),
        "duration": info.duration,
        "language": info.language,
        "segments": []
    }

    for segment in segments:
        segment_data = {
            "id": segment.id,
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip(),
            "words": []
        }

        if segment.words:
            for word in segment.words:
                segment_data["words"].append({
                    "word": word.word,
                    "start": word.start,
                    "end": word.end,
                    "probability": word.probability
                })

        json_data["segments"].append(segment_data)

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)

    print(f"完了 ({info.duration:.1f}秒)")


def main():
    if len(sys.argv) < 2:
        print("使い方: python whisper_tutorial_timestamps.py {PROJECT_FOLDER}")
        sys.exit(1)

    project_folder = Path(sys.argv[1])
    trimmed_folder = project_folder / "audio_trimmed"

    if not trimmed_folder.exists():
        print(f"エラー: {trimmed_folder} が見つかりません")
        sys.exit(1)

    mp3_files = sorted(trimmed_folder.glob("*.mp3"))

    if not mp3_files:
        print("エラー: audio_trimmed/ にmp3ファイルがありません")
        sys.exit(1)

    print("モデルをロード中... (medium)")
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    print("[OK] モデルのロード完了")
    print("-" * 40)
    print(f"ファイル数: {len(mp3_files)}")

    for mp3_file in mp3_files:
        transcribe_to_json(str(mp3_file), model)

    print("-" * 40)
    print(f"完了: {len(mp3_files)} ファイル")
    print(f"出力先: {trimmed_folder}")


if __name__ == "__main__":
    main()
