#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Whisperタイムスタンプ取得スクリプト (faster-whisper)

音声ファイルから単語レベルのタイムスタンプをJSON形式で出力する。
SRT作成はClaude Codeが台本とJSONを組み合わせて行う。

使い方:
    python whisper_timestamps.py <音声ファイルパス>

例:
    python whisper_timestamps.py "audio_trimmed/combined_all.mp3"
"""

import sys
import os
import argparse
import json
from pathlib import Path

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("[ERROR] faster-whisperがインストールされていません")
    print("インストール: pip install faster-whisper")
    sys.exit(1)


def transcribe_to_json(audio_file, model_size="medium", language="ja", device="cpu", compute_type="int8"):
    """
    音声ファイルから単語レベルタイムスタンプを取得してJSONで出力する

    Args:
        audio_file: 音声ファイルのパス
        model_size: モデルサイズ (tiny, base, small, medium, large-v3)
        language: 言語コード (ja, en, など)
        device: デバイス (cpu, cuda)
        compute_type: 計算型 (int8, float16, float32)

    Returns:
        出力ファイルのパス
    """
    if not os.path.exists(audio_file):
        raise FileNotFoundError(f"音声ファイルが見つかりません: {audio_file}")

    print(f"=" * 60)
    print(f"タイムスタンプ取得開始: {os.path.basename(audio_file)}")
    print(f"=" * 60)
    print(f"モデル: {model_size}")
    print(f"言語: {language}")
    print(f"デバイス: {device} ({compute_type})")
    print()

    # モデルをロード
    print("モデルをロード中...")
    try:
        model = WhisperModel(model_size, device=device, compute_type=compute_type)
        print("[OK] モデルのロードが完了しました")
    except Exception as e:
        print(f"[ERROR] モデルのロードに失敗しました: {e}")
        raise

    print()
    print("文字起こし中... (時間がかかる場合があります)")

    # 文字起こし実行（単語レベルタイムスタンプ有効）
    try:
        segments, info = model.transcribe(
            audio_file,
            language=language,
            beam_size=5,
            word_timestamps=True
        )

        print(f"[OK] 検出された言語: {info.language} (確率: {info.language_probability:.2%})")
        print(f"  音声の長さ: {info.duration:.2f}秒")
        print()

        # 出力ファイルパスを生成
        audio_path = Path(audio_file)
        json_file = audio_path.with_suffix('.json')

        # JSON形式でデータを構築
        json_data = {
            "audio_file": os.path.basename(audio_file),
            "duration": info.duration,
            "language": info.language,
            "segments": []
        }
        segment_count = 0
        word_count = 0

        for segment in segments:
            segment_count += 1
            text = segment.text.strip()

            segment_data = {
                "id": segment_count,
                "start": segment.start,
                "end": segment.end,
                "text": text,
                "words": []
            }

            if segment.words:
                for word in segment.words:
                    word_count += 1
                    segment_data["words"].append({
                        "word": word.word,
                        "start": word.start,
                        "end": word.end,
                        "probability": word.probability
                    })

            json_data["segments"].append(segment_data)

            # コンソールに表示
            print(f"[{segment.start:>7.2f}s -> {segment.end:>7.2f}s] {text}")

        # JSONファイル書き込み
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)

        print()
        print("=" * 60)
        print(f"[OK] 完了!")
        print(f"  セグメント数: {segment_count}")
        print(f"  単語数: {word_count}")
        print(f"  出力ファイル: {json_file}")
        print("=" * 60)

        return str(json_file)

    except Exception as e:
        print(f"[ERROR] 文字起こしに失敗しました: {e}")
        raise


def main():
    parser = argparse.ArgumentParser(
        description="faster-whisperを使って音声ファイルから単語レベルタイムスタンプを取得します",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
例:
  python whisper_timestamps.py audio.mp3
  python whisper_timestamps.py audio.mp3 --model large-v3
  python whisper_timestamps.py audio.mp3 --model small

出力:
  音声ファイルと同じディレクトリにJSONファイルが生成されます。
  SRT作成はClaude Codeが台本（script.txt）とJSONを組み合わせて行います。
        """
    )

    parser.add_argument(
        "audio_file",
        help="文字起こしする音声ファイルのパス"
    )

    parser.add_argument(
        "--model",
        default="medium",
        choices=["tiny", "base", "small", "medium", "large-v3"],
        help="使用するWhisperモデル (デフォルト: medium)"
    )

    parser.add_argument(
        "--language",
        default="ja",
        help="音声の言語コード (デフォルト: ja)"
    )

    parser.add_argument(
        "--device",
        default="cpu",
        choices=["cpu", "cuda"],
        help="使用するデバイス (デフォルト: cpu)"
    )

    parser.add_argument(
        "--compute-type",
        default="int8",
        choices=["int8", "float16", "float32"],
        help="計算型 (デフォルト: int8)"
    )

    args = parser.parse_args()

    try:
        output_file = transcribe_to_json(
            args.audio_file,
            model_size=args.model,
            language=args.language,
            device=args.device,
            compute_type=args.compute_type
        )
        return 0
    except KeyboardInterrupt:
        print("\n\n中断されました")
        return 1
    except Exception as e:
        print(f"\n\nエラーが発生しました: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
