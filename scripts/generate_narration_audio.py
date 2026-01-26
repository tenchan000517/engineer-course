#!/usr/bin/env python3
"""
ナレーション音声生成スクリプト

narration.txtを読み込み、Fish Audio APIで音声を生成する。

使い方:
    python generate_narration_audio.py "{PROJECT_FOLDER}"

例:
    python generate_narration_audio.py "C:\\Instagramショート\\Instagram_Reels_Production\\ランキング_SNS_AIツール_2026-01-26"
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

# .envファイルを読み込む
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Fish Audio API設定
FISH_AUDIO_API_URL = "https://api.fish.audio/v1/tts"
FISH_AUDIO_API_KEY = os.getenv("FISH_AUDIO_API_KEY")

# 話者のreference_id
VOICE_IDS = {
    "女性": "88a17a7e26be43209ac73c51544df368",
    "男性": "b756350f646543bdb0b7e8df76bae3fd",
}


def parse_narration_file(narration_path: Path) -> list[dict]:
    """
    narration.txtをパースしてセグメントリストを返す。

    Returns:
        [
            {"speaker": "女性", "text": "チャットジーピーティー"},
            {"speaker": "男性", "text": "うーん、論外。..."},
            ...
        ]
    """
    with open(narration_path, "r", encoding="utf-8") as f:
        content = f.read()

    segments = []
    current_speaker = None
    current_lines = []

    for line in content.split("\n"):
        line_stripped = line.strip()

        # 話者指定行かどうか判定
        if line_stripped in VOICE_IDS:
            # 前のセグメントを保存
            if current_speaker and current_lines:
                text = "\n".join(current_lines).strip()
                if text:
                    segments.append({
                        "speaker": current_speaker,
                        "text": text
                    })
            # 新しい話者に切り替え
            current_speaker = line_stripped
            current_lines = []
        elif line_stripped == "":
            # 空行はスキップ（ただしセグメント内の改行は保持しない）
            continue
        else:
            # ナレーション内容
            if current_speaker:
                current_lines.append(line_stripped)

    # 最後のセグメントを保存
    if current_speaker and current_lines:
        text = "\n".join(current_lines).strip()
        if text:
            segments.append({
                "speaker": current_speaker,
                "text": text
            })

    return segments


def generate_audio(text: str, speaker: str, output_path: Path) -> bool:
    """
    Fish Audio APIで音声を生成する。

    Returns:
        成功したらTrue、失敗したらFalse
    """
    if not FISH_AUDIO_API_KEY:
        print("エラー: FISH_AUDIO_API_KEYが設定されていません")
        return False

    reference_id = VOICE_IDS.get(speaker)
    if not reference_id:
        print(f"エラー: 未知の話者: {speaker}")
        return False

    headers = {
        "Authorization": f"Bearer {FISH_AUDIO_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "reference_id": reference_id,
    }

    try:
        response = requests.post(FISH_AUDIO_API_URL, headers=headers, json=payload)
        response.raise_for_status()

        with open(output_path, "wb") as f:
            f.write(response.content)

        return True
    except requests.RequestException as e:
        print(f"エラー: 音声生成失敗 - {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("使い方: python generate_narration_audio.py {PROJECT_FOLDER}")
        sys.exit(1)

    project_folder = Path(sys.argv[1])
    narration_path = project_folder / "narration.txt"
    audio_folder = project_folder / "audio"

    # 入力ファイル確認
    if not narration_path.exists():
        print(f"エラー: {narration_path} が見つかりません")
        sys.exit(1)

    # 出力フォルダ作成
    audio_folder.mkdir(parents=True, exist_ok=True)

    # ナレーションをパース
    segments = parse_narration_file(narration_path)

    if not segments:
        print("エラー: セグメントが見つかりません")
        sys.exit(1)

    print(f"セグメント数: {len(segments)}")
    print("-" * 40)

    # 各セグメントの音声を生成
    for i, segment in enumerate(segments, 1):
        speaker = segment["speaker"]
        text = segment["text"]

        # ファイル名: 01_female.mp3, 02_male.mp3, ...
        speaker_en = "female" if speaker == "女性" else "male"
        filename = f"{i:02d}_{speaker_en}.mp3"
        output_path = audio_folder / filename

        # テキストプレビュー（長い場合は省略）
        preview = text[:50] + "..." if len(text) > 50 else text
        print(f"{filename}: [{speaker}] {preview}")

        # 音声生成
        success = generate_audio(text, speaker, output_path)

        if success:
            print(f"  → 生成完了: {output_path}")
        else:
            print(f"  → 生成失敗")

    print("-" * 40)
    print(f"完了: {audio_folder}")


if __name__ == "__main__":
    main()
