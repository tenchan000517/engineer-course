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
import re
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
BGM_PATH = os.path.join(SHARED_BASE, "BGM", "Pixel_Heart_Signal.mp3")
SE_DECISION = os.path.join(SHARED_BASE, "SE", "decision.mp3")
SE_COMPLETE = os.path.join(SHARED_BASE, "SE", "complete.mp3")
SE_TYPING = os.path.join(SHARED_BASE, "SE", "typing.mp3")

# 字幕背景
TELOP_BACK_PATH = os.path.join(SHARED_BASE, "ランキングボード", "telop_back.png")

# ツール名画像
TOOL_NAME_BASE = os.path.join(SHARED_BASE, "ツール名")
AI_TOOL_NAME_LIST_PATH = r"C:\engineer-course\docs\archive\ai-tool-name-list.md"

# ツール名画像のスケール・位置（V4と同じ）
TOOL_NAME_SCALE = 100
TOOL_NAME_X = 540
TOOL_NAME_Y = 1266

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
    1: "normal",   # 導入（完成動画プレビュー）
    2: "random",   # ステップ1開始（ui_00）
    3: "random",   # ステップ1結果（ui_01）
    4: "random",   # ステップ2開始（ui_02）
    5: "random",   # ステップ2続き（ui_03）
    6: "normal",   # 完成（completion）
    7: "cta",      # CTA前半
    8: "cta",      # CTA後半（継続）
}

# デフォルトの素材名（Window用）
DEFAULT_ASSETS = {
    "hook": "hook.mp4",
    "ui_00": "ui_00.png",
    "ui_01": "ui_01.png",
    "ui_02": "ui_02.png",
    "ui_03": "ui_03.png",
    "completion": "completion.mp4",
    "trigger": "trigger.png",
}

# セグメント→Window映像マッピング（1始まり）
# アバター動画とは別トラックに配置
# 全SEに音量設定（デフォルト-10dB）
SE_DEFAULT_VOLUME = -10

# 動的セグメント構造
# セグメント1: 導入（completion_preview）
# セグメント2〜N: ステップ（動的検出）
# セグメントN+1: 完成（「これだけで」で検出）
# セグメントN+2: CTA前半（「今日紹介した」で検出）
# セグメントN+3: CTA後半（「コメントしてください」で検出）

# 固定セグメント設定（動的に番号が変わるためパターンで定義）
SEGMENT_PATTERNS = {
    "intro": {
        "pattern": None,  # 常に最初のセグメント
        "type": "completion_preview",
        "asset": "completion",
        "track": "V6",
        "scale": 40, "x": 410, "y": 607,
        "crop_left": 5, "crop_right": 5, "crop_bottom": 2
    },
    "completion": {
        "pattern": r"これだけで",
        "type": "completion",
        "asset": "completion",
        "track": "V6",
        "se": "complete",
        "scale": 40, "x": 536, "y": 640
    },
    "cta_first": {
        "pattern": r"今日紹介した|ほしい人は",
        "type": "none",
        "asset": None,
        "track": None,
        "se": None
    },
    "cta_trigger": {
        "pattern": r"コメントしてください",
        "type": "trigger",
        "asset": "trigger",
        "track": "V7",
        "se": "typing",
        "scale": 100, "x": 540, "y": 1474.5
    }
}

# 後方互換のためのSEGMENT_MAPPING（空、動的検出に移行）
SEGMENT_MAPPING = {}

# SE種類→ファイルパス
SE_FILES = {
    "decision": SE_DECISION,
    "complete": SE_COMPLETE,
    "typing": SE_TYPING,
}


def load_tool_name_mapping():
    """ai-tool-name-list.mdからカタカナ→英語のマッピングを読み込む"""
    mapping = {}
    if not os.path.exists(AI_TOOL_NAME_LIST_PATH):
        print(f"警告: ツール名リストが見つかりません: {AI_TOOL_NAME_LIST_PATH}")
        return mapping

    with open(AI_TOOL_NAME_LIST_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # テーブル行をパース（| SRT表記 | ナレーション表記 | 備考 |）
    for line in content.split("\n"):
        if "|" in line and "SRT表記" not in line and "---" not in line:
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 3:
                srt_name = parts[1]  # 英語名
                narration_name = parts[2]  # カタカナ名
                if srt_name and narration_name:
                    # ファイル名形式に変換（小文字、スペース→アンダースコア）
                    filename = srt_name.lower().replace(" ", "_")
                    mapping[narration_name] = filename

    return mapping


def detect_tool_name(text, tool_mapping):
    """テキストからツール名を検出し、ファイル名を返す"""
    for katakana_name, filename in tool_mapping.items():
        if katakana_name in text:
            return filename
    return None


def detect_step_info(text, tool_mapping):
    """
    テキストから「ステップN」パターンとツール名を検出
    戻り値: (step_number, tool_filename) または (None, None)
    """
    # 「ステップN」パターンを検出（全角・半角数字対応）
    step_patterns = [
        r'ステップ(\d+)',  # 半角数字
        r'ステップ([１２３４５６７８９０]+)',  # 全角数字
    ]

    step_number = None
    for pattern in step_patterns:
        match = re.search(pattern, text)
        if match:
            num_str = match.group(1)
            # 全角数字を半角に変換
            zen_to_han = str.maketrans('１２３４５６７８９０', '1234567890')
            step_number = int(num_str.translate(zen_to_han))
            break

    if step_number is None:
        return None, None

    # ツール名を検出
    tool_filename = detect_tool_name(text, tool_mapping)

    return step_number, tool_filename


def load_narration_lines(project_folder):
    """narration.txtを読み込み、各行のリストを返す"""
    narration_path = os.path.join(project_folder, "narration.txt")
    if not os.path.exists(narration_path):
        return []

    with open(narration_path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    return lines


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
            "duration": clip_duration,
            "scale": 110,
            "y": 984
        })

        current += clip_duration
        loop_count += 1


def create_placement_json(project_folder, segment_times, total_duration):
    """placement.jsonを作成"""
    placements = []

    project_folder_win = to_windows_path(project_folder)

    # ツール名マッピングとナレーションを読み込み
    tool_mapping = load_tool_name_mapping()
    narration_lines = load_narration_lines(project_folder)

    # 動的セグメント検出
    detected_steps = {}  # セグメント番号→{"step": ステップ番号, "tool": ツールファイル名}
    detected_segments = {}  # セグメント番号→セグメントタイプ（"intro", "completion", "cta_first", "cta_trigger"）

    for seg_num, line in enumerate(narration_lines, start=1):
        # ステップ検出
        step_number, tool_filename = detect_step_info(line, tool_mapping)
        if step_number is not None:
            detected_steps[seg_num] = {
                "step": step_number,
                "tool": tool_filename
            }
            tool_info = tool_filename if tool_filename else "（ツール未検出）"
            print(f"  セグメント{seg_num}: ステップ{step_number} 検出 - {tool_info}")
            continue

        # 固定セグメントパターン検出
        for seg_type, config in SEGMENT_PATTERNS.items():
            pattern = config.get("pattern")
            if pattern is None and seg_num == 1:
                # 最初のセグメントは導入
                detected_segments[seg_num] = seg_type
                print(f"  セグメント{seg_num}: {seg_type} 検出（導入）")
                break
            elif pattern and re.search(pattern, line):
                detected_segments[seg_num] = seg_type
                print(f"  セグメント{seg_num}: {seg_type} 検出")
                break

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
    # 注意: hook_videoはV3に配置、音声はA2に配置
    hook_path = os.path.join(project_folder, DEFAULT_ASSETS["hook"])
    hook_path_win = to_windows_path(hook_path)
    if os.path.exists(hook_path):
        # 映像をV3に配置
        placements.append({
            "type": "hook_video",
            "name": "hook",
            "path": hook_path_win,
            "track": "V3",
            "time": 0.0,
            "duration": HOOK_DURATION,
            "scale": 118
        })
        # 音声をA2に配置（BGMと別トラック）
        placements.append({
            "type": "hook_audio",
            "name": "hook_audio",
            "path": hook_path_win,
            "track": "A2",
            "time": 0.0,
            "duration": HOOK_DURATION
        })

    # 2.5. completion_previewの終了時間を取得（最初のステップセグメントの開始時間）
    step1_start_time = None
    if detected_steps:
        first_step_seg = min(detected_steps.keys())
        step1_start_time = segment_times.get(first_step_seg, {}).get("start")
    if step1_start_time is None:
        step1_start_time = segment_times.get(2, {}).get("start")  # フォールバック

    # 3. アバター動画（V1）- シーンごとに切り替え＆ループ
    avatar_placements = create_avatar_placements(segment_times, total_duration)
    placements.extend(avatar_placements)

    # 4. BGM（A3）- フック後から開始（フック動画には独自の音声があるため）
    # 音量は-8dB（ナレーションより小さく、でも聞こえるレベル）
    placements.append({
        "type": "shared",
        "name": "bgm",
        "path": to_windows_path(BGM_PATH),
        "track": "A3",
        "time": HOOK_DURATION,
        "duration": total_duration - HOOK_DURATION,
        "volume": -8
    })

    # 5. 各セグメントのWindow映像とSE
    # まずtriggerの開始時間を取得（completionの終了時間として使用）
    trigger_start_time = None
    for seg_num, seg_type in detected_segments.items():
        if seg_type == "cta_trigger":
            trigger_start_time = segment_times.get(seg_num, {}).get("start")
            break

    for seg_num, times in segment_times.items():
        start_time = times["start"]
        end_time = times["end"]
        duration = end_time - start_time

        tool_name_duration = 1.5  # ツール名表示時間（秒）
        actual_ui_start = start_time

        # 動的ステップ処理: ステップN が検出されたセグメント
        if seg_num in detected_steps:
            step_info = detected_steps[seg_num]
            step_number = step_info["step"]
            tool_filename = step_info["tool"]

            # ツール名画像を配置
            if tool_filename:
                tool_path = os.path.join(TOOL_NAME_BASE, f"{tool_filename}.png")
                if os.path.exists(tool_path):
                    placements.append({
                        "type": "tool_name",
                        "name": f"tool_{tool_filename}_step{step_number}",
                        "path": to_windows_path(tool_path),
                        "track": "V4",
                        "time": start_time,
                        "duration": tool_name_duration,
                        "scale": TOOL_NAME_SCALE,
                        "x": TOOL_NAME_X,
                        "y": TOOL_NAME_Y
                    })
                    actual_ui_start = start_time + tool_name_duration
                    print(f"  ツール名画像追加: {tool_filename}.png (ステップ{step_number}, {start_time}秒〜)")
                else:
                    print(f"  警告: ツール名画像が見つかりません: {tool_path}")

            # 動的UI画像を配置（ui_01.png, ui_02.png, ...）
            ui_asset_name = f"ui_{step_number:02d}.png"
            ui_path = os.path.join(project_folder, ui_asset_name)
            if os.path.exists(ui_path):
                placements.append({
                    "type": "ui",
                    "name": f"ui_{step_number:02d}",
                    "path": to_windows_path(ui_path),
                    "track": "V4",
                    "time": actual_ui_start,
                    "duration": end_time - actual_ui_start,
                    "scale": 100,
                    "x": 540,
                    "y": 1266
                })
                print(f"  UI画像追加: {ui_asset_name} (ステップ{step_number}, {actual_ui_start}秒〜)")
            else:
                print(f"  警告: UI画像が見つかりません: {ui_path}")

            # ステップセグメントのSE（decision）
            placements.append({
                "type": "se",
                "name": f"se_decision_step{step_number}",
                "path": to_windows_path(SE_DECISION),
                "track": "A4",
                "time": start_time,
                "volume": SE_DEFAULT_VOLUME
            })
            continue  # ステップセグメントはここで処理完了

        # パターン検出されたセグメント処理（導入、完成、CTAなど）
        if seg_num not in detected_segments:
            continue

        seg_type = detected_segments[seg_num]
        config = SEGMENT_PATTERNS.get(seg_type)
        if not config:
            continue

        # CTA前半はテロップ背景のみ（映像なし）
        if seg_type == "cta_first":
            continue

        # Window映像配置
        asset_name = config.get("asset")
        if asset_name:
            asset_key = asset_name  # "completion" or "trigger"
            actual_asset = DEFAULT_ASSETS.get(asset_key)
            if actual_asset:
                asset_path = os.path.join(project_folder, actual_asset)
                asset_path_win = to_windows_path(asset_path)

                # triggerは最後まで表示
                if config["type"] == "trigger":
                    duration = total_duration - start_time
                # completion_previewはステップ1開始まで表示
                elif config["type"] == "completion_preview" and step1_start_time:
                    duration = step1_start_time - start_time
                # completionはtrigger開始まで表示
                elif config["type"] == "completion" and trigger_start_time:
                    duration = trigger_start_time - start_time

                entry = {
                    "type": config["type"],
                    "name": config["asset"],
                    "path": asset_path_win,
                    "track": config["track"],
                    "time": start_time,
                    "duration": duration
                }
                # スケール・位置・クロップ設定を追加
                if config.get("scale"):
                    entry["scale"] = config["scale"]
                if config.get("x"):
                    entry["x"] = config["x"]
                if config.get("y"):
                    entry["y"] = config["y"]
                if config.get("crop_left"):
                    entry["crop_left"] = config["crop_left"]
                if config.get("crop_right"):
                    entry["crop_right"] = config["crop_right"]
                if config.get("crop_top"):
                    entry["crop_top"] = config["crop_top"]
                if config.get("crop_bottom"):
                    entry["crop_bottom"] = config["crop_bottom"]
                placements.append(entry)

        # SE配置（全SEにデフォルト音量適用）
        if config.get("se"):
            se_path = SE_FILES.get(config["se"])
            if se_path:
                se_volume = config.get("se_volume", SE_DEFAULT_VOLUME)
                placements.append({
                    "type": "se",
                    "name": f"se_{config['se']}_{seg_num}",
                    "path": to_windows_path(se_path),
                    "track": "A4",
                    "time": start_time + config.get("se_delay", 0),
                    "volume": se_volume
                })

    # 6. ナレーション音声（A1）- 最後に配置（動画の音声を上書きするため）
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
