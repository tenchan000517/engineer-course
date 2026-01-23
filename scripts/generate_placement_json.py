#!/usr/bin/env python3
"""
SRTからPremiere Pro画像配置用JSONを生成

使い方:
    python generate_placement_json.py <project_folder>

入力:
    - {project_folder}/subtitle.srt
    - scripts/premiere/tool_image_mapping.json（マスターマッピング）

出力:
    - {project_folder}/placement.json（Premiere Pro用）
    - scripts/premiere/placement.json（ExtendScript用コピー）
"""

import json
import re
import sys
from pathlib import Path


# トラック自動割り当て（出現順）
TRACK_ORDER = ["V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12"]

# 順位キーワード → Y座標のマッピング
RANK_Y_POSITIONS = {
    "1位": 496.0,
    "圧倒的1位": 496.0,
    "2位": 758.0,
    "3位": 1007.0,
    "4位": 1263.0,
    "論外": 1525.0
}

# 共通設定
SCALE = 28.0
X_POSITION = 319.0

# CTAトリガーワード
CTA_TRIGGER = "今日紹介した"


def parse_srt_time(time_str: str) -> float:
    """SRT時間形式をfloat秒に変換"""
    match = re.match(r'(\d{2}):(\d{2}):(\d{2}),(\d{3})', time_str)
    if not match:
        raise ValueError(f"Invalid SRT time format: {time_str}")

    hours, minutes, seconds, milliseconds = map(int, match.groups())
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000


def parse_srt(srt_path: Path) -> list:
    """SRTファイルをパースして字幕リストを返す"""
    content = srt_path.read_text(encoding='utf-8')

    pattern = r'(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.+?)(?=\n\n|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)

    subtitles = []
    for index, start, end, text in matches:
        subtitles.append({
            'index': int(index),
            'start': parse_srt_time(start),
            'end': parse_srt_time(end),
            'text': text.strip().replace('\n', ' ')
        })

    return subtitles


def find_rank_after_tool(subtitles: list, tool_index: int, search_range: int = 10) -> str:
    """ツール名の後に続く順位を検出"""
    rank_keywords = list(RANK_Y_POSITIONS.keys())

    for i in range(tool_index + 1, min(tool_index + search_range + 1, len(subtitles))):
        text = subtitles[i]['text'].strip()
        for rank in rank_keywords:
            if rank == text or rank in text:
                return rank

    return None


def find_cta_start_time(subtitles: list) -> float:
    """CTA開始時間を検出（「今日紹介した」）"""
    for sub in subtitles:
        if CTA_TRIGGER in sub['text']:
            return sub['start']
    return None


def find_tool_mentions(subtitles: list, tool_names: list) -> list:
    """SRTからツール名の初回出現タイミングを検出（完全一致のみ、重複除外）"""
    mentions = []
    found_tools = set()

    for i, sub in enumerate(subtitles):
        text = sub['text'].strip()
        for tool in tool_names:
            # 既に見つかったツールはスキップ
            if tool.lower() in found_tools:
                continue

            # 完全一致のみ（女性が「Canva」「Vrew」と単独で読み上げる部分）
            if tool.lower() == text.lower():
                # 順位を検出
                rank = find_rank_after_tool(subtitles, i)

                mentions.append({
                    'tool': tool,
                    'time': sub['start'],
                    'text': text,
                    'index': i,
                    'rank': rank
                })
                found_tools.add(tool.lower())
                break

    return mentions


def generate_placement_json(project_folder: str):
    """メイン処理"""
    project_path = Path(project_folder)
    script_dir = Path(__file__).parent

    # マスターマッピングを読み込み
    mapping_path = script_dir / 'premiere' / 'tool_image_mapping.json'
    if not mapping_path.exists():
        print(f"エラー: マスターマッピングが見つかりません: {mapping_path}")
        return

    mapping = json.loads(mapping_path.read_text(encoding='utf-8'))
    image_folder = mapping.get('image_folder', '')
    tool_images = mapping.get('tools', {})

    # SRTファイルを読み込み
    srt_path = project_path / 'subtitle.srt'
    if not srt_path.exists():
        print(f"エラー: SRTファイルが見つかりません: {srt_path}")
        return

    subtitles = parse_srt(srt_path)
    print(f"SRT読み込み完了: {len(subtitles)} エントリ")

    # CTA開始時間を検出
    cta_start_time = find_cta_start_time(subtitles)
    if cta_start_time:
        print(f"CTA開始時間: {cta_start_time:.2f}s")
    else:
        print("警告: CTA開始時間が見つかりません。デフォルト長さを使用します。")

    # ツール名リスト
    tool_names = list(tool_images.keys())

    # ツール出現タイミングを検出（初回のみ）
    mentions = find_tool_mentions(subtitles, tool_names)
    print(f"ツール検出: {len(mentions)} 件")

    # placement.json を生成
    placements = []

    for i, mention in enumerate(mentions):
        tool = mention['tool']
        rank = mention['rank']
        image_file = tool_images.get(tool)

        if not image_file:
            print(f"  警告: 画像マッピングなし: {tool}")
            continue

        # トラック自動割り当て（出現順）
        track = TRACK_ORDER[i] if i < len(TRACK_ORDER) else f"V{5 + i}"

        # Y座標を順位から取得
        y_position = RANK_Y_POSITIONS.get(rank, 1007.0)  # デフォルトは中央

        # 長さを計算（CTA開始まで）
        if cta_start_time:
            duration = cta_start_time - mention['time']
        else:
            duration = 60.0  # デフォルト

        image_path = f"{image_folder}\\{image_file}" if image_folder else image_file

        placements.append({
            'tool': tool,
            'rank': rank,
            'image': image_path,
            'time': mention['time'],
            'duration': duration,
            'track': track,
            'scale': SCALE,
            'x': X_POSITION,
            'y': y_position
        })
        print(f"  {mention['time']:.2f}s: {tool} ({rank}) → {track}, Y={y_position}, 長さ={duration:.2f}s")

    # JSONファイルを出力
    output_path = project_path / 'placement.json'
    output_path.write_text(json.dumps(placements, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"\n出力完了: {output_path}")

    # ExtendScript用にコピー
    jsx_folder = script_dir / 'premiere'
    if jsx_folder.exists():
        jsx_placement = jsx_folder / 'placement.json'
        jsx_placement.write_text(json.dumps(placements, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f"ExtendScript用にコピー: {jsx_placement}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("使い方: python generate_placement_json.py <project_folder>")
        print("例: python generate_placement_json.py \"C:\\Instagramショート\\Instagram_Reels_Production\\ランキング_SNS_AIツール_2026-01-23\"")
        sys.exit(1)

    generate_placement_json(sys.argv[1])
