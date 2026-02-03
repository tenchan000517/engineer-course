#!/usr/bin/env python3
"""
解説リール用 SRT + placement.json 生成スクリプト

入力:
  - {PROJECT_FOLDER}/audio_trimmed/*.json（Whisperタイムスタンプ）
  - {PROJECT_FOLDER}/telop.txt（分割済みテロップ）

出力:
  - {PROJECT_FOLDER}/subtitle.srt
  - {PROJECT_FOLDER}/placement.json

使用方法:
  python create_tutorial_srt.py "C:\\path\\to\\project_folder"
"""

import json
import os
import sys
import random
from pathlib import Path
from glob import glob

# ========== 設定 ==========

# フック動画の長さ（秒）
HOOK_DURATION = 5.0

# 共有素材パス
SHARED_BASE = r"C:\Instagramショート\Instagram_Reels_Production\共有素材"
AVATAR_VIDEO_BASE = os.path.join(SHARED_BASE, "アバター動画")
BGM_PATH = os.path.join(SHARED_BASE, "BGM", "Rise_of_the_New_Team.mp3")
SE_DECISION = os.path.join(SHARED_BASE, "SE", "decision.mp3")
SE_COMPLETE = os.path.join(SHARED_BASE, "SE", "complete.mp3")
SE_TYPING = os.path.join(SHARED_BASE, "SE", "typing.mp3")

# 字幕背景
TELOP_BACK_PATH = os.path.join(SHARED_BASE, "ランキングボード", "telop_back.png")

# アバター動画（V1トラック用）
AVATAR_VIDEOS = {
    "normal": os.path.join(AVATAR_VIDEO_BASE, "normal.mp4"),  # 5秒
    "cta": os.path.join(AVATAR_VIDEO_BASE, "cta.mp4"),  # 5秒
    "work": os.path.join(AVATAR_VIDEO_BASE, "work.mp4"),  # 5秒
}

# ステップ用ランダム動画（10秒）
RANDOM_AVATAR_VIDEOS = [
    os.path.join(AVATAR_VIDEO_BASE, "pc_back.mp4"),
    os.path.join(AVATAR_VIDEO_BASE, "bench_reading.mp4"),
    os.path.join(AVATAR_VIDEO_BASE, "sofa_reading.mp4"),
    os.path.join(AVATAR_VIDEO_BASE, "cooking.mp4"),
    os.path.join(AVATAR_VIDEO_BASE, "cleaning.mp4"),
]

# アバター動画の長さ（秒）
AVATAR_VIDEO_DURATION = {
    "normal": 5.0,
    "cta": 5.0,
    "work": 5.0,
    "random": 10.0,  # ランダム動画は全て10秒
}

# シーン→アバター動画マッピング
# "random" = ランダム動画から選択
SCENE_AVATAR_MAPPING = {
    1: "normal",   # 導入
    2: "random",   # ステップ1
    3: "random",   # ステップ2
    4: "random",   # ステップ2続き
    5: "normal",   # 完成
    6: "cta",      # CTA前半
    7: "cta",      # CTA後半（継続）
}

# デフォルトの素材名（Window用）
DEFAULT_ASSETS = {
    "hook": "hook.mp4",
    "ui_01": "ui_01.png",
    "ui_02": "ui_02.png",
    "completion": "completion.mp4",
    "trigger": "trigger.png",
}

# セグメント→Window映像マッピング（1始まり）
# アバター動画とは別トラックに配置
SEGMENT_MAPPING = {
    1: {"type": "none", "asset": None, "track": None, "se": None},  # 導入（Windowなし）
    2: {"type": "ui", "asset": "ui_01", "track": "V4", "se": "decision"},
    3: {"type": "ui", "asset": "ui_02", "track": "V5", "se": "decision"},
    4: {"type": "continue", "asset": None, "track": None, "se": None},  # 前行継続
    5: {"type": "completion", "asset": "completion", "track": "V6", "se": "complete"},
    6: {"type": "none", "asset": None, "track": None, "se": None},
    7: {"type": "trigger", "asset": "trigger", "track": "V7", "se": "typing"},
}

# SE種類→ファイルパス
SE_FILES = {
    "decision": SE_DECISION,
    "complete": SE_COMPLETE,
    "typing": SE_TYPING,
}


def load_whisper_json(json_path):
    """WhisperのJSONファイルを読み込み、セグメントの長さを返す"""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "segments" in data and len(data["segments"]) > 0:
        last_segment = data["segments"][-1]
        return last_segment["end"]

    if "words" in data and len(data["words"]) > 0:
        last_word = data["words"][-1]
        return last_word["end"]

    return 0.0


def parse_telop(telop_path):
    """telop.txtを読み込み、セグメントごとに分割"""
    with open(telop_path, "r", encoding="utf-8") as f:
        content = f.read()

    segments = []
    current_segment = []

    for line in content.split("\n"):
        if line.strip() == "":
            if current_segment:
                segments.append(current_segment)
                current_segment = []
        else:
            current_segment.append(line)

    if current_segment:
        segments.append(current_segment)

    return segments


def format_srt_time(seconds):
    """秒をSRT形式の時間に変換"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def load_whisper_words(json_path):
    """WhisperのJSONから単語タイムスタンプを取得"""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    words = []
    if "segments" in data:
        for segment in data["segments"]:
            if "words" in segment:
                words.extend(segment["words"])
    elif "words" in data:
        words = data["words"]

    return words


def calculate_telop_timestamps(telop_lines, words, segment_offset):
    """テロップ行に対してタイムスタンプを計算"""
    results = []
    word_idx = 0

    for line in telop_lines:
        if word_idx >= len(words):
            break

        start_time = words[word_idx]["start"] + segment_offset

        line_chars = len(line.replace(" ", ""))
        chars_consumed = 0
        end_word_idx = word_idx

        while end_word_idx < len(words) and chars_consumed < line_chars:
            word_text = words[end_word_idx].get("word", "")
            chars_consumed += len(word_text.replace(" ", ""))
            end_word_idx += 1

        if end_word_idx > word_idx:
            end_time = words[end_word_idx - 1]["end"] + segment_offset
        else:
            end_time = start_time + 0.5

        results.append({
            "text": line,
            "start": start_time,
            "end": end_time
        })

        word_idx = end_word_idx

    return results


def create_srt(entries, output_path):
    """SRTファイルを作成"""
    with open(output_path, "w", encoding="utf-8") as f:
        for i, entry in enumerate(entries, 1):
            f.write(f"{i}\n")
            f.write(f"{format_srt_time(entry['start'])} --> {format_srt_time(entry['end'])}\n")
            f.write(f"{entry['text']}\n")
            f.write("\n")


def to_windows_path(path):
    """WSLパスをWindowsパスに変換し、全てバックスラッシュに統一"""
    if path.startswith("/mnt/"):
        parts = path.split("/")
        drive = parts[2].upper()
        rest = "\\".join(parts[3:])
        return f"{drive}:\\{rest}"
    return path.replace("/", "\\")


def create_avatar_placements(segment_times, total_duration):
    """アバター動画の配置を生成（V1トラック、シーンごとに切り替え）"""
    placements = []
    used_random_videos = []  # 使用済みランダム動画を追跡

    # 利用可能なランダム動画をシャッフル
    available_random = RANDOM_AVATAR_VIDEOS.copy()
    random.shuffle(available_random)
    random_idx = 0

    # 各セグメントのアバター動画を決定
    current_time = HOOK_DURATION  # フック後から開始
    prev_avatar = None
    prev_avatar_start = current_time

    for seg_num in sorted(segment_times.keys()):
        times = segment_times[seg_num]
        avatar_type = SCENE_AVATAR_MAPPING.get(seg_num, "normal")

        # ランダム動画の場合、未使用のものを選択
        if avatar_type == "random":
            if random_idx < len(available_random):
                avatar_path = available_random[random_idx]
                avatar_duration = AVATAR_VIDEO_DURATION["random"]
                random_idx += 1
            else:
                # ランダム動画が足りない場合はリセット
                random.shuffle(available_random)
                random_idx = 0
                avatar_path = available_random[random_idx]
                avatar_duration = AVATAR_VIDEO_DURATION["random"]
                random_idx += 1
        else:
            avatar_path = AVATAR_VIDEOS.get(avatar_type)
            avatar_duration = AVATAR_VIDEO_DURATION.get(avatar_type, 5.0)

        # 前のセグメントと同じアバターなら継続
        if avatar_path == prev_avatar:
            continue

        # 前のアバター動画を確定（ループ配置）
        if prev_avatar is not None:
            segment_end = times["start"]
            _add_avatar_with_loop(
                placements, prev_avatar, prev_avatar_start, segment_end,
                AVATAR_VIDEO_DURATION.get(
                    next((k for k, v in AVATAR_VIDEOS.items() if v == prev_avatar), "random"),
                    10.0
                )
            )

        # 新しいアバター動画を開始
        prev_avatar = avatar_path
        prev_avatar_start = times["start"]

    # 最後のアバター動画を確定
    if prev_avatar is not None:
        _add_avatar_with_loop(
            placements, prev_avatar, prev_avatar_start, total_duration,
            AVATAR_VIDEO_DURATION.get(
                next((k for k, v in AVATAR_VIDEOS.items() if v == prev_avatar), "random"),
                10.0
            )
        )

    return placements


def _add_avatar_with_loop(placements, avatar_path, start_time, end_time, video_duration):
    """アバター動画をループ配置"""
    current = start_time
    loop_count = 0

    while current < end_time:
        remaining = end_time - current
        clip_duration = min(video_duration, remaining)

        placements.append({
            "type": "avatar_video",
            "name": f"avatar_{os.path.basename(avatar_path)}_{loop_count}",
            "path": to_windows_path(avatar_path),
            "track": "V1",
            "time": current,
            "duration": clip_duration
        })

        current += clip_duration
        loop_count += 1


def create_placement_json(project_folder, segment_times, total_duration):
    """placement.jsonを作成"""
    placements = []

    project_folder_win = to_windows_path(project_folder)

    # 1. 字幕背景（V14）- 全体
    placements.append({
        "type": "shared",
        "name": "telop_back",
        "path": to_windows_path(TELOP_BACK_PATH),
        "track": "V14",
        "time": 0.0,
        "duration": total_duration
    })

    # 2. フック動画（V3）- 0-5秒（Windowとして上に表示）
    hook_path = os.path.join(project_folder, DEFAULT_ASSETS["hook"])
    hook_path_win = to_windows_path(hook_path)
    if os.path.exists(hook_path):
        placements.append({
            "type": "hook_video",
            "name": "hook",
            "path": hook_path_win,
            "track": "V3",
            "time": 0.0,
            "duration": HOOK_DURATION
        })

    # 3. アバター動画（V1）- シーンごとに切り替え＆ループ
    avatar_placements = create_avatar_placements(segment_times, total_duration)
    placements.extend(avatar_placements)

    # 4. BGM（A3）- 全体
    placements.append({
        "type": "shared",
        "name": "bgm",
        "path": to_windows_path(BGM_PATH),
        "track": "A3",
        "time": 0.0,
        "duration": total_duration,
        "volume": -15
    })

    # 5. ナレーション音声（A1）- フック後から連続配置
    audio_trimmed_folder = os.path.join(project_folder, "audio_trimmed")
    audio_files = sorted(glob(os.path.join(audio_trimmed_folder, "*.mp3")))

    for i, audio_file in enumerate(audio_files):
        entry = {
            "type": "narration",
            "name": os.path.basename(audio_file),
            "path": to_windows_path(audio_file),
            "track": "A1"
        }
        if i == 0:
            entry["time"] = HOOK_DURATION
        placements.append(entry)

    # 6. 各セグメントのWindow映像とSE
    for seg_num, times in segment_times.items():
        mapping = SEGMENT_MAPPING.get(seg_num)
        if not mapping or mapping["type"] in ["continue", "none"]:
            continue

        start_time = times["start"]
        end_time = times["end"]
        duration = end_time - start_time

        # Window映像配置
        if mapping["asset"]:
            asset_name = DEFAULT_ASSETS.get(mapping["asset"])
            if asset_name:
                asset_path = os.path.join(project_folder, asset_name)
                asset_path_win = to_windows_path(asset_path)

                placements.append({
                    "type": mapping["type"],
                    "name": mapping["asset"],
                    "path": asset_path_win,
                    "track": mapping["track"],
                    "time": start_time,
                    "duration": duration
                })

        # SE配置
        if mapping["se"]:
            se_path = SE_FILES.get(mapping["se"])
            if se_path:
                placements.append({
                    "type": "se",
                    "name": f"se_{mapping['se']}_{seg_num}",
                    "path": to_windows_path(se_path),
                    "track": "A4",
                    "time": start_time
                })

    return placements


def main():
    if len(sys.argv) < 2:
        print("使用方法: python create_tutorial_srt.py <PROJECT_FOLDER>")
        print("例: python create_tutorial_srt.py \"C:\\path\\to\\project\"")
        sys.exit(1)

    project_folder = sys.argv[1]

    if not os.path.isdir(project_folder):
        print(f"エラー: フォルダが見つかりません: {project_folder}")
        sys.exit(1)

    audio_trimmed_folder = os.path.join(project_folder, "audio_trimmed")
    telop_path = os.path.join(project_folder, "telop.txt")

    if not os.path.isdir(audio_trimmed_folder):
        print(f"エラー: audio_trimmedフォルダが見つかりません: {audio_trimmed_folder}")
        sys.exit(1)

    if not os.path.isfile(telop_path):
        print(f"エラー: telop.txtが見つかりません: {telop_path}")
        sys.exit(1)

    json_files = sorted(glob(os.path.join(audio_trimmed_folder, "*.json")))
    if not json_files:
        print(f"エラー: JSONファイルが見つかりません: {audio_trimmed_folder}")
        sys.exit(1)

    print(f"プロジェクト: {project_folder}")
    print(f"JSONファイル数: {len(json_files)}")

    telop_segments = parse_telop(telop_path)
    print(f"テロップセグメント数: {len(telop_segments)}")

    all_srt_entries = []
    segment_times = {}
    current_offset = HOOK_DURATION

    for i, json_file in enumerate(json_files):
        seg_num = i + 1
        print(f"\nセグメント {seg_num}: {os.path.basename(json_file)}")

        words = load_whisper_words(json_file)
        segment_duration = load_whisper_json(json_file)

        print(f"  単語数: {len(words)}, 長さ: {segment_duration:.2f}秒")

        segment_times[seg_num] = {
            "start": current_offset,
            "end": current_offset + segment_duration
        }

        if i < len(telop_segments):
            telop_lines = telop_segments[i]
            entries = calculate_telop_timestamps(telop_lines, words, current_offset)
            all_srt_entries.extend(entries)
            print(f"  テロップ行数: {len(telop_lines)}, SRTエントリ数: {len(entries)}")

        current_offset += segment_duration

    total_duration = current_offset
    print(f"\n総時間: {total_duration:.2f}秒")

    # SRTファイル出力
    srt_path = os.path.join(project_folder, "subtitle.srt")
    create_srt(all_srt_entries, srt_path)
    print(f"\nSRT出力: {srt_path}")
    print(f"  エントリ数: {len(all_srt_entries)}")

    # placement.json出力
    placements = create_placement_json(project_folder, segment_times, total_duration)
    placement_path = os.path.join(project_folder, "placement.json")

    with open(placement_path, "w", encoding="utf-8") as f:
        json.dump(placements, f, indent=2, ensure_ascii=False)

    print(f"\nplacement.json出力: {placement_path}")
    print(f"  配置数: {len(placements)}")

    # アバター動画の割り当て表示
    print("\nアバター動画の割り当て:")
    for seg_num in sorted(segment_times.keys()):
        avatar_type = SCENE_AVATAR_MAPPING.get(seg_num, "normal")
        print(f"  セグメント {seg_num}: {avatar_type}")

    print("\n完了!")


if __name__ == "__main__":
    main()
