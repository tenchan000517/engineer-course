#!/usr/bin/env python3
"""
解説リール用ナレーション音声生成スクリプト

narration.txtを読み込み、各行を1つのセグメントとしてFish Audio APIで音声を生成する。
解説リールは男性の単一話者のため、話者指定行は不要。

使い方:
    python generate_tutorial_narration.py "{PROJECT_FOLDER}"

例:
    python generate_tutorial_narration.py "C:\\Instagramショート\\Instagram_Reels_Production\\チュートリアル_モンスターASMR_2026-01-27"

入力ファイル:
    {PROJECT_FOLDER}/narration.txt
    - 各行が1つのセグメント（編集点）
    - 空行はスキップ

出力ファイル:
    {PROJECT_FOLDER}/audio/01.mp3, 02.mp3, ...
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

# 解説リールは男性のみ
VOICE_ID = "b756350f646543bdb0b7e8df76bae3fd"


def parse_narration_file(narration_path: Path) -> list[str]:
    """
    narration.txtをパースしてセグメントリストを返す。
    各行が1つのセグメント。空行はスキップ。

    Returns:
        ["セグメント1のテキスト", "セグメント2のテキスト", ...]
    """
    with open(narration_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    segments = []
    for line in lines:
        text = line.strip()
        if text:  # 空行はスキップ
            segments.append(text)

    return segments


def generate_audio(text: str, output_path: Path) -> bool:
    """
    Fish Audio APIで音声を生成する。

    Returns:
        成功したらTrue、失敗したらFalse
    """
    if not FISH_AUDIO_API_KEY:
        print("エラー: FISH_AUDIO_API_KEYが設定されていません")
        print("scripts/.env に FISH_AUDIO_API_KEY=your_api_key を設定してください")
        return False

    headers = {
        "Authorization": f"Bearer {FISH_AUDIO_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "reference_id": VOICE_ID,
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
        print("使い方: python generate_tutorial_narration.py {PROJECT_FOLDER}")
        print()
        print("例:")
        print('  python generate_tutorial_narration.py "C:\\Instagramショート\\Instagram_Reels_Production\\チュートリアル_モンスターASMR_2026-01-27"')
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
    success_count = 0
    for i, text in enumerate(segments, 1):
        # ファイル名: 01.mp3, 02.mp3, ...
        filename = f"{i:02d}.mp3"
        output_path = audio_folder / filename

        # テキストプレビュー（長い場合は省略）
        preview = text[:50] + "..." if len(text) > 50 else text
        print(f"{filename}: {preview}")

        # 音声生成
        success = generate_audio(text, output_path)

        if success:
            print(f"  → 生成完了: {output_path}")
            success_count += 1
        else:
            print(f"  → 生成失敗")

    print("-" * 40)
    print(f"完了: {success_count}/{len(segments)} セグメント")
    print(f"出力先: {audio_folder}")


if __name__ == "__main__":
    main()
