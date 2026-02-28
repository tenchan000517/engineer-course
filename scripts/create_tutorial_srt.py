#!/usr/bin/env python3
"""
解説リール用 SRT + placement.json 生成スクリプト

入力:
  - {PROJECT_FOLDER}/audio_trimmed/*.json（Whisperタイムスタンプ）
  - {PROJECT_FOLDER}/narration.txt（ナレーション原稿）

出力:
  - {PROJECT_FOLDER}/subtitle.srt
  - {PROJECT_FOLDER}/placement.json

使用方法:
  python create_tutorial_srt.py "C:\\path\\to\\project_folder"

変更履歴:
  2026-02-16: telop.txt依存を廃止、narration.txtから直接テロップを生成
              - ひらがな数字→半角数字変換
              - カタカナツール名→SRT表記変換
              - 8文字分割ルール自動適用
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

# 終了余白（秒）- ブツ切れ防止
END_PADDING = 0.5

# 共有素材パス
SHARED_BASE = r"C:\Instagramショート\Instagram_Reels_Production_V26.0.0\共有素材"
AVATAR_VIDEO_BASE = os.path.join(SHARED_BASE, "アバター動画")
BGM_PATH = os.path.join(SHARED_BASE, "BGM", "Pixel_Heart_Signal.mp3")
SE_DECISION = os.path.join(SHARED_BASE, "SE", "decision.mp3")
SE_COMPLETE = os.path.join(SHARED_BASE, "SE", "complete.mp3")
SE_TYPING = os.path.join(SHARED_BASE, "SE", "typing.mp3")

# 字幕背景（解説リール用）
TELOP_BACK_PATH = os.path.join(SHARED_BASE, "ランキングボード", "telop_back_tutorial.png")

# ツール名画像（AIロゴフォルダ）- Windows/WSL両対応
_TOOL_NAME_BASE_WIN = os.path.join(SHARED_BASE, "AIロゴ")
_TOOL_NAME_BASE_WSL = "/mnt/c/Instagramショート/Instagram_Reels_Production_V26.0.0/共有素材/AIロゴ"
TOOL_NAME_BASE = _TOOL_NAME_BASE_WSL if os.path.exists(_TOOL_NAME_BASE_WSL) else _TOOL_NAME_BASE_WIN
# ツール名リスト（Windows/WSL両対応）
_TOOL_LIST_WIN = r"C:\engineer-course\docs\archive\ai-tool-name-list.md"
_TOOL_LIST_WSL = "/mnt/c/engineer-course/docs/archive/ai-tool-name-list.md"
AI_TOOL_NAME_LIST_PATH = _TOOL_LIST_WSL if os.path.exists(_TOOL_LIST_WSL) else _TOOL_LIST_WIN

# ツール名画像のスケール・位置（V4トラック）
TOOL_NAME_SCALE = 60
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
        "pattern": r"今日紹介した",
        "type": "none",
        "asset": None,
        "track": None,
        "se": None
    },
    "cta_trigger": {
        "pattern": r"ほしい人は|コメントしてください",
        "type": "trigger",
        "asset": "trigger",
        "track": "V7",
        "se": "typing",
        "scale": 100, "x": 540, "y": 1474.5
    }
}

# 後方互換のためのSEGMENT_MAPPING（空、動的検出に移行）
SEGMENT_MAPPING = {}

# 導入トリガー（訴求タイプ別）
INTRO_TRIGGERS = {
    "buzz": r"今やれば",           # バズ系
    "income": r"で月",             # 収益系
    "efficiency": r"削減|効率",    # 効率化系（削減効果の文言を検出）
    "skill": r"誰でもプロ級の",    # スキル系
}

# 導入イラスト（訴求タイプ別）- 共有素材（Windows/WSL両対応）
_INTRO_IMAGE_BASE_WSL = "/mnt/c/Instagramショート/Instagram_Reels_Production_V26.0.0/共有素材/導入イラスト"
_INTRO_IMAGE_BASE = _INTRO_IMAGE_BASE_WSL if os.path.exists(_INTRO_IMAGE_BASE_WSL) else os.path.join(SHARED_BASE, "導入イラスト")
INTRO_IMAGES = {
    "buzz": os.path.join(_INTRO_IMAGE_BASE, "intro_buzz.png"),
    "income": os.path.join(_INTRO_IMAGE_BASE, "intro_income.png"),
    "efficiency": os.path.join(_INTRO_IMAGE_BASE, "intro_efficiency.png"),
    "skill": os.path.join(_INTRO_IMAGE_BASE, "intro_skill.png"),
}

# 導入画像設定
INTRO_IMAGE_SETTINGS = {
    "scale": 60,
    "x": 540,
    "y": 1450
}

# SE種類→ファイルパス
SE_FILES = {
    "decision": SE_DECISION,
    "complete": SE_COMPLETE,
    "typing": SE_TYPING,
}


def load_tool_name_mapping():
    """ai-tool-name-list.mdからカタカナ→英語のマッピングを読み込む

    戻り値: {
        "カタカナ名": {
            "filename": "ファイル名形式",
            "display": "SRT表記（表示用）"
        }
    }
    """
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
                srt_name = parts[1]  # 英語名（SRT表記）
                narration_name = parts[2]  # カタカナ名
                if srt_name and narration_name:
                    # ファイル名形式に変換（AIロゴフォルダの命名規則に合わせる）
                    # 例: "Nano Banana" → "Nanobanana", "Kling" → "Kling"
                    filename = srt_name.replace(" ", "")
                    # 先頭大文字、残りは小文字に統一
                    if len(filename) > 1:
                        filename = filename[0].upper() + filename[1:].lower()
                    mapping[narration_name] = {
                        "filename": filename,
                        "display": srt_name
                    }

    return mapping


# ========== テロップ変換機能 ==========

# ひらがな数字→半角数字マッピング（ステップの直後のみ）
HIRAGANA_TO_NUMBER = {
    'いち': '1', 'に': '2', 'さん': '3', 'よん': '4', 'ご': '5',
    'ろく': '6', 'なな': '7', 'はち': '8', 'きゅう': '9', 'じゅう': '10'
}


def convert_hiragana_numbers(text):
    """ひらがな数字を半角数字に変換（「ステップ」の直後のみ）

    例: 「ステップいち」→「ステップ1」
    例: 「キャプションにある」→ 変換しない（「に」は残る）
    """
    result = text

    # 「ステップ」の直後のひらがな数字のみ変換
    for hiragana, number in HIRAGANA_TO_NUMBER.items():
        # 「ステップ」+ひらがな数字のパターンを検索して置換
        pattern = f'ステップ{hiragana}'
        replacement = f'ステップ{number}'
        result = result.replace(pattern, replacement)

    return result


def convert_tool_names_to_srt(text, tool_mapping):
    """カタカナツール名をSRT表記（英語）に変換

    例: 「ナノバナナ」→「Nano Banana」
    """
    result = text
    # 長いツール名から先に変換（部分一致を防ぐ）
    sorted_tools = sorted(tool_mapping.keys(), key=len, reverse=True)
    for katakana_name in sorted_tools:
        if katakana_name in result:
            srt_name = tool_mapping[katakana_name]["display"]
            result = result.replace(katakana_name, srt_name)
    return result


def split_telop_line(text, target_chars=8, max_chars=12, preserve_words=None):
    """テキストをテロップ分割ルールに従って分割

    ルール:
    - 目標は8文字前後だが、意味の区切りを優先
    - 助詞・動詞語尾の後で区切る（が・を・に・で・は・ます・です・して等）
    - 単語の途中では絶対に切らない
    - 最大12文字まで許容（それ以上は強制分割）
    - preserve_wordsに指定した単語は分割しない
    """
    preserve_words = preserve_words or []

    if len(text) <= target_chars:
        return [text]

    lines = []
    remaining = text

    # 区切りパターン（優先度順）- これらの後ろで区切る
    # 長いパターンから先にマッチさせる
    break_patterns = [
        # 動詞・助動詞の終止形
        'ました', 'ません', 'ます', 'です', 'ください',
        # 接続助詞・て形
        'ですが', 'ですけど', 'ですので', 'ですから',
        'ますが', 'ますけど', 'ますので', 'ますから',
        'して', 'った', 'った', 'れば',
        # 助詞（接続）
        'ので', 'から', 'まで', 'より', 'って', 'ても', 'けど', 'けれど',
        # 助詞（格助詞・係助詞）
        'には', 'では', 'とは', 'への', 'での',
        'が', 'を', 'に', 'で', 'は', 'と', 'の', 'も', 'へ', 'や',
    ]

    # 保護ワードの位置を取得する関数
    def get_protected_ranges(text_segment):
        ranges = []
        for word in preserve_words:
            pos = text_segment.find(word)
            if pos >= 0:
                ranges.append((pos, pos + len(word)))
        return ranges

    def is_protected(pos, protected_ranges):
        """指定位置が保護範囲内かどうか"""
        for start, end in protected_ranges:
            if start < pos < end:
                return True
        return False

    def find_best_break(text_segment, protected_ranges):
        """最適な区切り位置を見つける"""
        # target_chars以内で最も良い区切り位置を探す
        best_pos = -1

        # まずtarget_chars以内で区切りパターンを探す
        for pattern in break_patterns:
            search_end = min(target_chars + len(pattern), len(text_segment))
            search_range = text_segment[:search_end]
            pos = 0
            while True:
                found = search_range.find(pattern, pos)
                if found < 0:
                    break
                cut_pos = found + len(pattern)
                # target_chars以内で、保護範囲内でなければ採用
                if cut_pos <= target_chars + 2 and not is_protected(found, protected_ranges) and not is_protected(cut_pos - 1, protected_ranges):
                    if cut_pos > best_pos:
                        best_pos = cut_pos
                pos = found + 1

        if best_pos > 0:
            return best_pos

        # target_chars以内で見つからない場合、max_charsまで範囲を広げる
        for pattern in break_patterns:
            search_end = min(max_chars + len(pattern), len(text_segment))
            search_range = text_segment[:search_end]
            pos = 0
            while True:
                found = search_range.find(pattern, pos)
                if found < 0:
                    break
                cut_pos = found + len(pattern)
                if cut_pos <= max_chars and not is_protected(found, protected_ranges) and not is_protected(cut_pos - 1, protected_ranges):
                    if best_pos < 0 or cut_pos < best_pos:  # max_chars範囲では最初に見つかったものを優先
                        best_pos = cut_pos
                        break
                pos = found + 1
            if best_pos > 0:
                break

        if best_pos > 0:
            return best_pos

        # 保護ワードがある場合は、その終わりまで含める
        for start, end in protected_ranges:
            if start < max_chars < end:
                return end

        # どうしても見つからない場合はmax_charsで切る
        return min(max_chars, len(text_segment))

    while remaining:
        if len(remaining) <= target_chars:
            lines.append(remaining)
            break

        protected_ranges = get_protected_ranges(remaining)
        cut_pos = find_best_break(remaining, protected_ranges)

        # 区切り
        lines.append(remaining[:cut_pos])
        remaining = remaining[cut_pos:]

    return lines


def convert_narration_to_telop(narration_text, tool_mapping):
    """ナレーションテキストをテロップ形式に変換

    スラッシュ方式:
    - スラッシュ（/）がある場合: スラッシュで分割
    - スラッシュがない場合: 自動分割（フォールバック）

    変換処理:
    1. ひらがな数字→半角数字（「ステップいち」→「ステップ1」）
    2. カタカナツール名→SRT表記（「ナノバナナ」→「Nano Banana」）
    """
    # スラッシュで分割されているか確認
    if '/' in narration_text:
        # スラッシュ方式: スラッシュで分割
        raw_lines = [line.strip() for line in narration_text.split('/') if line.strip()]
        lines = []
        for line in raw_lines:
            # 1. ひらがな数字→半角数字
            converted = convert_hiragana_numbers(line)
            # 2. カタカナツール名→SRT表記
            converted = convert_tool_names_to_srt(converted, tool_mapping)
            lines.append(converted)
        return lines
    else:
        # フォールバック: 自動分割（スラッシュがない場合）
        # 1. ひらがな数字→半角数字
        text = convert_hiragana_numbers(narration_text)

        # 2. カタカナツール名→SRT表記
        text = convert_tool_names_to_srt(text, tool_mapping)

        # 3. 分割時に保護するワード（SRT表記のツール名）
        preserve_words = [info["display"] for info in tool_mapping.values()]
        # 重要ワードも追加
        preserve_words.extend(['キャプション', 'プロンプト', 'モンスター', 'ASMR'])

        # 4. 自動分割
        lines = split_telop_line(text, preserve_words=preserve_words)

        return lines


def generate_telop_from_narration(narration_lines, tool_mapping):
    """narration.txtの各行をテロップセグメントに変換

    戻り値: セグメントごとのテロップ行のリスト
    [
        ["これ見たこと", "ありますか", ...],  # セグメント1
        ["ステップ1", "Nano Bananaで", ...],   # セグメント2
        ...
    ]
    """
    telop_segments = []

    for narration_line in narration_lines:
        telop_lines = convert_narration_to_telop(narration_line, tool_mapping)
        telop_segments.append(telop_lines)

    return telop_segments


def detect_tool_name(text, tool_mapping):
    """テキストからツール名を検出し、ツール情報を返す

    戻り値: {"filename": "...", "display": "..."} または None
    """
    for katakana_name, tool_info in tool_mapping.items():
        if katakana_name in text:
            return tool_info
    return None


def detect_step_info(text, tool_mapping, prev_step_number=0):
    """
    テキストから「ステップN」または「まず」「次に」パターンとツール名を検出
    戻り値: (step_number, tool_info) または (None, None)
    tool_info = {"filename": "...", "display": "..."} または None
    """
    step_number = None

    # 「ステップN」パターンを検出（全角・半角・漢数字・ひらがな対応）
    step_patterns = [
        r'ステップ(\d+)',  # 半角数字
        r'ステップ([１２３４５６７８９０]+)',  # 全角数字
        r'ステップ([一二三四五六七八九十]+)',  # 漢数字
        r'ステップ(いち|に|さん|し|ご|ろく|なな|はち|きゅう|じゅう)',  # ひらがな
    ]

    # 漢数字→半角数字変換
    kanji_to_han = {'一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
                    '六': '6', '七': '7', '八': '8', '九': '9', '十': '10'}

    # ひらがな→半角数字変換
    hiragana_to_han = {'いち': '1', 'に': '2', 'さん': '3', 'し': '4', 'ご': '5',
                       'ろく': '6', 'なな': '7', 'はち': '8', 'きゅう': '9', 'じゅう': '10'}

    for pattern in step_patterns:
        match = re.search(pattern, text)
        if match:
            num_str = match.group(1)
            # 全角数字を半角に変換
            zen_to_han = str.maketrans('１２３４５６７８９０', '1234567890')
            num_str = num_str.translate(zen_to_han)
            # 漢数字を半角に変換
            if num_str in kanji_to_han:
                step_number = int(kanji_to_han[num_str])
            # ひらがなを半角に変換
            elif num_str in hiragana_to_han:
                step_number = int(hiragana_to_han[num_str])
            else:
                try:
                    step_number = int(num_str)
                except ValueError:
                    continue
            break

    # 「まず」「次に」「そして」パターンを検出
    if step_number is None:
        if re.search(r'^まず', text):
            step_number = 1
        elif re.search(r'^次に', text):
            step_number = prev_step_number + 1 if prev_step_number else 2
        elif re.search(r'^そして', text):
            step_number = prev_step_number + 1 if prev_step_number else 2

    if step_number is None:
        return None, None

    # ツール名を検出
    tool_info = detect_tool_name(text, tool_mapping)

    return step_number, tool_info


def load_narration_lines(project_folder):
    """narration.txtを読み込み、各行のリストを返す"""
    narration_path = os.path.join(project_folder, "narration.txt")
    if not os.path.exists(narration_path):
        return []

    with open(narration_path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    return lines


def load_whisper_words(json_path):
    """WhisperのJSONファイルからワードリストを取得"""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    words = []
    if "segments" in data:
        for segment in data["segments"]:
            if "words" in segment:
                words.extend(segment["words"])
    return words


def find_trigger_timestamps(words):
    """
    ワードリストからトリガータイムスタンプを検出

    Whisperは日本語を文字単位で分割することがあるため、
    連続する文字を結合してパターン検索を行う。

    戻り値: {
        "tool_end": float or None,      # 「〜で」の終了時間
        "prompt_start": float or None,  # 「キャプション」の開始時間
        "step_start": float or None     # 「〜して」系の開始時間
    }
    """
    result = {
        "tool_end": None,
        "prompt_start": None,
        "step_start": None
    }

    # プロンプト系トリガー
    prompt_triggers = ["キャプション", "プロンプト"]

    # 手順系トリガー（「〜して」パターン）
    step_triggers = re.compile(r'(して|したら|すると|してから|した後)$')

    # 文字を結合してパターン検索用のバッファ
    # 各エントリ: (結合文字列, 開始インデックス, 開始時間)
    buffer_text = ""
    buffer_start_times = []  # 各文字の開始時間を記録

    for i, word_data in enumerate(words):
        word = word_data.get("word", "").strip()
        word_start = word_data.get("start")
        word_end = word_data.get("end")

        # バッファに追加
        for char in word:
            buffer_text += char
            buffer_start_times.append(word_start)

        # 「で、」または「で」の検出（ツール名の後）
        if (word == "で" or word == "で、") and result["tool_end"] is None:
            result["tool_end"] = word_end

        # プロンプト系トリガー検出（結合文字列から検索）
        if result["prompt_start"] is None:
            for trigger in prompt_triggers:
                idx = buffer_text.find(trigger)
                if idx >= 0:
                    # トリガーの開始位置の時間を取得
                    result["prompt_start"] = buffer_start_times[idx]
                    break

        # 手順系トリガー検出（「〜して」など）
        if step_triggers.search(word) and result["step_start"] is None:
            # プロンプト系が既に検出されていなければ手順系として扱う
            if result["prompt_start"] is None:
                result["step_start"] = word_end

    return result


def find_intro_trigger_timestamp(words, narration_text):
    """
    導入セグメントのトリガータイムスタンプを検出

    訴求タイプ別トリガー:
    - バズ系: 「今やれば」→「狙えます」まで
    - 収益系: 「で月」→「です」まで
    - 効率化系: 「削減」「効率」→「です」まで
    - スキル系: 「誰でもプロ級の」→「です」まで

    戻り値: (float or None, float or None, str or None)（トリガー開始時間, 文終了時間, 訴求タイプ）
    """
    # 訴求タイプを判定してトリガーパターンを決定
    trigger_pattern = None
    detected_appeal_type = None
    for appeal_type, pattern in INTRO_TRIGGERS.items():
        if re.search(pattern, narration_text):
            trigger_pattern = pattern
            detected_appeal_type = appeal_type
            break

    if trigger_pattern is None:
        return None, None, None

    # 文字を結合してパターン検索（開始時間と終了時間を両方記録）
    buffer_text = ""
    buffer_start_times = []
    buffer_end_times = []

    for word_data in words:
        word = word_data.get("word", "").strip()
        word_start = word_data.get("start")
        word_end = word_data.get("end")

        for char in word:
            buffer_text += char
            buffer_start_times.append(word_start)
            buffer_end_times.append(word_end)

    # トリガーパターンを検索
    match = re.search(trigger_pattern, buffer_text)
    if match and match.start() < len(buffer_start_times):
        trigger_start = buffer_start_times[match.start()]

        # トリガー位置以降で文末（「ます」「です」）を探す
        sentence_end_pattern = r'(ます|です|ません)'
        remaining_text = buffer_text[match.start():]
        sentence_match = re.search(sentence_end_pattern, remaining_text)

        if sentence_match:
            sentence_end_idx = match.start() + sentence_match.end() - 1
            if sentence_end_idx < len(buffer_end_times):
                sentence_end = buffer_end_times[sentence_end_idx]
                return trigger_start, sentence_end, detected_appeal_type

        # 文末が見つからない場合はトリガー開始のみ返す
        return trigger_start, None, detected_appeal_type

    return None, None, detected_appeal_type


def load_whisper_json(json_path):
    """WhisperのJSONファイルを読み込み、セグメントの長さを返す

    優先順位:
    1. duration（実際のMP3ファイル長）← タイミング精度のため
    2. 最後のセグメントのend時間（フォールバック）
    """
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 実際のMP3ファイル長を優先使用（累積誤差防止）
    if "duration" in data:
        return data["duration"]

    # フォールバック: Whisperセグメント終了時間
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


def create_avatar_placements(segment_times, total_duration, detected_segments=None, detected_steps=None):
    """アバター動画の配置を生成（V1トラック、シーンごとに切り替え）

    動的にセグメントタイプに基づいてアバター動画を割り当て:
    - intro → normal
    - step（ステップセグメント） → random
    - completion → normal
    - cta_first → cta（「今日紹介した」からCTA開始）
    - cta_trigger → cta
    """
    placements = []
    detected_segments = detected_segments or {}
    detected_steps = detected_steps or {}

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

        # 動的にアバタータイプを決定
        if seg_num in detected_steps:
            # ステップセグメント → ランダム動画
            avatar_type = "random"
        elif seg_num in detected_segments:
            seg_type = detected_segments[seg_num]
            if seg_type in ("cta_first", "cta_trigger"):
                # CTA系 → cta動画（「今日紹介した」からCTA開始）
                avatar_type = "cta"
            else:
                # intro, completion → normal
                avatar_type = "normal"
        else:
            # フォールバック: 静的マッピングを使用
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
    detected_steps = {}  # セグメント番号→{"step": ステップ番号, "tool": ツール情報}
    detected_segments = {}  # セグメント番号→セグメントタイプ（"intro", "completion", "cta_first", "cta_trigger"）
    prev_step_number = 0  # 前回検出されたステップ番号

    for seg_num, line in enumerate(narration_lines, start=1):
        # ステップ検出
        step_number, tool_info = detect_step_info(line, tool_mapping, prev_step_number)
        if step_number is not None:
            prev_step_number = step_number  # 次回のために記録
            detected_steps[seg_num] = {
                "step": step_number,
                "tool": tool_info
            }
            tool_display = tool_info.get("display") if tool_info else "（ツール未検出）"
            print(f"  セグメント{seg_num}: ステップ{step_number} 検出 - {tool_display}")
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

    # 1. 字幕背景（V14）- フック後から終了まで
    placements.append({
        "type": "shared",
        "name": "telop_back",
        "path": to_windows_path(TELOP_BACK_PATH),
        "track": "V14",
        "time": HOOK_DURATION,
        "duration": total_duration - HOOK_DURATION
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

    # 3. アバター動画（V1）- シーンごとに切り替え＆ループ（動的割り当て）
    avatar_placements = create_avatar_placements(
        segment_times, total_duration, detected_segments, detected_steps
    )
    placements.extend(avatar_placements)

    # 4. BGM（A3）- フック後から開始（フック動画には独自の音声があるため）
    # 音量は-40dB（約1%、ほぼ聞こえないバックグラウンドレベル）
    placements.append({
        "type": "shared",
        "name": "bgm",
        "path": to_windows_path(BGM_PATH),
        "track": "A3",
        "time": HOOK_DURATION,
        "duration": total_duration - HOOK_DURATION,
        "volume": -40
    })

    # 5. 各セグメントのWindow映像とSE
    # cta_first（「今日紹介した」）とtriggerの開始時間を取得
    cta_first_start_time = None
    trigger_start_time = None
    for seg_num, seg_type in detected_segments.items():
        if seg_type == "cta_first":
            cta_first_start_time = segment_times.get(seg_num, {}).get("start")
        elif seg_type == "cta_trigger":
            trigger_start_time = segment_times.get(seg_num, {}).get("start")

    # audio_trimmedフォルダのパス
    audio_trimmed_folder = os.path.join(project_folder, "audio_trimmed")

    for seg_num, times in segment_times.items():
        start_time = times["start"]
        end_time = times["end"]
        duration = end_time - start_time

        # 動的ステップ処理: ステップN が検出されたセグメント
        if seg_num in detected_steps:
            step_data = detected_steps[seg_num]
            step_number = step_data["step"]
            tool_info = step_data["tool"]
            tool_filename = tool_info.get("filename") if tool_info else None

            # Whisper JSONからワードレベルタイムスタンプを取得
            json_path = os.path.join(audio_trimmed_folder, f"{seg_num:02d}.json")
            triggers = {"tool_end": None, "prompt_start": None, "step_start": None}
            if os.path.exists(json_path):
                words = load_whisper_words(json_path)
                triggers = find_trigger_timestamps(words)

            # 切り替えタイミングを計算
            # デフォルト: 2段階（ツール名 → UI）
            tool_end_time = start_time + (triggers["tool_end"] or 1.5)
            prompt_start_time = None
            step_trigger_time = None

            # プロンプト系: 3段階（ツール名 → プロンプトスクショ → UI/成果物）
            if triggers["prompt_start"]:
                prompt_start_time = start_time + triggers["prompt_start"]
                print(f"  セグメント{seg_num}: プロンプト系3段階検出")

            # 手順系: 「〜して」パターンがあれば3段階
            elif triggers["step_start"]:
                step_trigger_time = start_time + triggers["step_start"]
                print(f"  セグメント{seg_num}: 手順系3段階検出（〜して）")

            else:
                print(f"  セグメント{seg_num}: 2段階（デフォルト）")

            # 1. ツール名画像を配置
            if tool_filename:
                tool_path = os.path.join(TOOL_NAME_BASE, f"{tool_filename}.png")
                if os.path.exists(tool_path):
                    # ツール名の終了時間を決定
                    if prompt_start_time:
                        tool_duration = prompt_start_time - start_time
                    elif step_trigger_time:
                        tool_duration = step_trigger_time - start_time
                    else:
                        tool_duration = tool_end_time - start_time

                    placements.append({
                        "type": "tool_name",
                        "name": f"tool_{tool_filename}_step{step_number}",
                        "path": to_windows_path(tool_path),
                        "track": "V4",
                        "time": start_time,
                        "duration": tool_duration,
                        "scale": TOOL_NAME_SCALE,
                        "x": TOOL_NAME_X,
                        "y": TOOL_NAME_Y
                    })
                    print(f"  ツール名画像: {tool_filename}.png ({start_time:.2f}秒〜{start_time + tool_duration:.2f}秒)")
                else:
                    print(f"  警告: ツール名画像が見つかりません: {tool_path}")

            # 2. プロンプトスクショを配置（プロンプト系の場合）
            if prompt_start_time:
                prompt_asset_name = f"prompt_{step_number:02d}.png"
                prompt_path = os.path.join(project_folder, prompt_asset_name)
                if os.path.exists(prompt_path):
                    # プロンプトスクショの終了時間（UIが始まる時間）
                    # セグメントの中間点をUI開始とする
                    prompt_end_time = prompt_start_time + (end_time - prompt_start_time) * 0.4
                    placements.append({
                        "type": "prompt",
                        "name": f"prompt_{step_number:02d}",
                        "path": to_windows_path(prompt_path),
                        "track": "V4",
                        "time": prompt_start_time,
                        "duration": prompt_end_time - prompt_start_time,
                        "scale": 90,
                        "x": 540,
                        "y": 1266
                    })
                    print(f"  プロンプトスクショ: {prompt_asset_name} ({prompt_start_time:.2f}秒〜{prompt_end_time:.2f}秒)")

                    # UIの開始時間を更新
                    actual_ui_start = prompt_end_time
                else:
                    print(f"  警告: プロンプトスクショが見つかりません: {prompt_path}")
                    actual_ui_start = prompt_start_time
            elif step_trigger_time:
                # 手順系3段階: 「〜して」の後からUI開始
                actual_ui_start = step_trigger_time
            else:
                # 2段階: ツール名の後からUI開始
                actual_ui_start = tool_end_time

            # 3. UI画像を配置
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
                    "scale": 90,
                    "x": 540,
                    "y": 1266
                })
                print(f"  UI画像: {ui_asset_name} ({actual_ui_start:.2f}秒〜{end_time:.2f}秒)")
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

        # 導入セグメント: 訴求タイプ別イラストをV4に配置（トリガー検出）
        if seg_type == "intro":
            # Whisperからトリガータイムスタンプと訴求タイプを取得
            json_path = os.path.join(audio_trimmed_folder, f"{seg_num:02d}.json")
            intro_trigger_time = None
            sentence_end_time = None
            appeal_type = None
            if os.path.exists(json_path) and seg_num <= len(narration_lines):
                words = load_whisper_words(json_path)
                narration_text = narration_lines[seg_num - 1]
                intro_trigger_time, sentence_end_time, appeal_type = find_intro_trigger_timestamp(words, narration_text)

            if appeal_type is not None:
                # 訴求タイプに対応する共有イラストを使用
                intro_path = INTRO_IMAGES.get(appeal_type)
                appeal_names = {"buzz": "バズ系", "income": "収益系", "efficiency": "効率化系", "skill": "スキル系"}

                if intro_path and os.path.exists(intro_path):
                    if intro_trigger_time is not None:
                        intro_start = start_time + intro_trigger_time
                        # 文終了時間があればそこまで、なければセグメント終了まで
                        if sentence_end_time is not None:
                            intro_end = start_time + sentence_end_time
                        else:
                            intro_end = end_time
                        intro_duration = intro_end - intro_start
                        placements.append({
                            "type": "intro",
                            "name": f"intro_{appeal_type}",
                            "path": to_windows_path(intro_path),
                            "track": "V4",
                            "time": intro_start,
                            "duration": intro_duration,
                            "scale": INTRO_IMAGE_SETTINGS["scale"],
                            "x": INTRO_IMAGE_SETTINGS["x"],
                            "y": INTRO_IMAGE_SETTINGS["y"]
                        })
                        print(f"  導入画像: {appeal_names.get(appeal_type)} ({intro_start:.2f}秒〜{intro_end:.2f}秒)")
                    else:
                        print(f"  警告: 導入トリガー「{INTRO_TRIGGERS.get(appeal_type)}」のタイムスタンプが取得できませんでした")
                else:
                    print(f"  警告: 導入イラストが見つかりません: {intro_path}")
            else:
                print(f"  注意: 訴求タイプが検出できませんでした（導入イラストなし）")

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
                # completionはCTA開始（「今日紹介した」）まで表示
                elif config["type"] == "completion" and cta_first_start_time:
                    duration = cta_first_start_time - start_time

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
    narration_path = os.path.join(project_folder, "narration.txt")

    if not os.path.isdir(audio_trimmed_folder):
        print(f"エラー: audio_trimmedフォルダが見つかりません: {audio_trimmed_folder}")
        sys.exit(1)

    if not os.path.isfile(narration_path):
        print(f"エラー: narration.txtが見つかりません: {narration_path}")
        sys.exit(1)

    json_files = sorted(glob(os.path.join(audio_trimmed_folder, "*.json")))
    if not json_files:
        print(f"エラー: JSONファイルが見つかりません: {audio_trimmed_folder}")
        sys.exit(1)

    print(f"プロジェクト: {project_folder}")
    print(f"JSONファイル数: {len(json_files)}")

    # ツール名マッピングを読み込み
    tool_mapping = load_tool_name_mapping()
    print(f"ツール名マッピング: {len(tool_mapping)}件")

    # narration.txtを読み込んでテロップに変換
    narration_lines = load_narration_lines(project_folder)
    print(f"ナレーション行数: {len(narration_lines)}")

    # narration.txtからテロップセグメントを生成
    telop_segments = generate_telop_from_narration(narration_lines, tool_mapping)
    print(f"テロップセグメント数: {len(telop_segments)}")

    # 変換結果を表示
    print("\n=== テロップ変換結果 ===")
    for i, segment in enumerate(telop_segments, 1):
        print(f"セグメント{i}: {' / '.join(segment[:3])}{'...' if len(segment) > 3 else ''}")

    all_srt_entries = []
    segment_times = {}
    current_offset = HOOK_DURATION

    for i, json_file in enumerate(json_files):
        seg_num = i + 1
        print(f"\nセグメント {seg_num}: {os.path.basename(json_file)}")

        words = load_whisper_words(json_file)
        segment_duration = load_whisper_json(json_file)

        print(f"  単語数: {len(words)}, 長さ: {segment_duration:.2f}秒")

        # 浮動小数点誤差を減らすため丸める
        start_time = round(current_offset, 2)
        end_time = round(current_offset + segment_duration, 2)

        segment_times[seg_num] = {
            "start": start_time,
            "end": end_time
        }

        if i < len(telop_segments):
            telop_lines = telop_segments[i]
            entries = calculate_telop_timestamps(telop_lines, words, start_time)
            all_srt_entries.extend(entries)
            print(f"  テロップ行数: {len(telop_lines)}, SRTエントリ数: {len(entries)}")

        current_offset = end_time

    # 終了余白を追加（ブツ切れ防止）
    total_duration = round(current_offset + END_PADDING, 2)
    print(f"\n総時間: {total_duration:.2f}秒（終了余白{END_PADDING}秒含む）")

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
    # ※動的割り当て: intro/completion/cta_first→normal, step→random, cta_trigger→cta
    print("\nアバター動画: 動的割り当て完了")

    print("\n完了!")


if __name__ == "__main__":
    main()
