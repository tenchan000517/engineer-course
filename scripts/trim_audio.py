#!/usr/bin/env python3
"""
音声トルツメスクリプト

audio/ フォルダ内の各mp3ファイルの前後の無音を削除し、
audio_trimmed/ フォルダに保存する。

使い方:
    python trim_audio.py "{PROJECT_FOLDER}"
"""

import subprocess
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("使い方: python trim_audio.py {PROJECT_FOLDER}")
        sys.exit(1)

    project_folder = Path(sys.argv[1])
    audio_folder = project_folder / "audio"
    trimmed_folder = project_folder / "audio_trimmed"

    if not audio_folder.exists():
        print(f"エラー: {audio_folder} が見つかりません")
        sys.exit(1)

    trimmed_folder.mkdir(parents=True, exist_ok=True)

    mp3_files = sorted(audio_folder.glob("*.mp3"))

    if not mp3_files:
        print("エラー: audio/ フォルダにmp3ファイルがありません")
        sys.exit(1)

    print(f"ファイル数: {len(mp3_files)}")
    print("-" * 40)

    for mp3_file in mp3_files:
        output_path = trimmed_folder / mp3_file.name
        print(f"{mp3_file.name}...", end=" ")

        # 中間の無音も削除（0.3秒以上の無音を削除）
        cmd = [
            "ffmpeg", "-y",
            "-i", str(mp3_file),
            "-af",
            "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,"
            "silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-50dB",
            str(output_path),
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("完了")
        else:
            print("失敗")
            print(f"  {result.stderr[:200]}")

    print("-" * 40)
    print(f"出力先: {trimmed_folder}")


if __name__ == "__main__":
    main()
