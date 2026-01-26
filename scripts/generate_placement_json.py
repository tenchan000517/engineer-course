#!/usr/bin/env python3
"""
SRTからPremiere Pro素材配置用JSONを生成

使い方:
    python generate_placement_json.py <project_folder>

入力:
    - {project_folder}/subtitle.srt
    - {project_folder}/audio_trimmed/ (ナレーション音声)
    - scripts/premiere/tool_image_mapping.json（マスターマッピング）

出力:
    - {project_folder}/placement.json（Premiere Pro用）
    - scripts/premiere/placement.json（ExtendScript用コピー）
"""

import json
import re
import sys
from pathlib import Path


# === トラック設定 ===
# 新トラック構造（2026-01-26更新）
# V1: アバター動画, V2: 調整レイヤー, V3: アバター静止画
# V4: ランキングボード, V5: 論外, V6-V9: No.4〜No.1
# V10-V12: プロンプト・手順, V13: タイトル背景, V14: 字幕背景

# 順位 → トラックのマッピング
RANK_TRACK_MAP = {
    "論外": "V5",
    "4位": "V6",
    "3位": "V7",
    "2位": "V8",
    "1位": "V9",
    "圧倒的1位": "V9"
}
PROMPT_TRACK_ORDER = ["V10", "V11", "V12"]  # プロンプト・手順①②③

# === 順位キーワード → Y座標のマッピング ===
RANK_Y_POSITIONS = {
    "1位": 494.5,
    "圧倒的1位": 494.5,
    "2位": 755.0,
    "3位": 1008.0,
    "4位": 1265.5,
    "論外": 1525.0
}

# === ランキングアイコン設定 ===
RANKING_SCALE = 28.5
RANKING_X = 320.5

# === CTAトリガーワード ===
CTA_TRIGGER = "今日紹介した"

# === プロンプトスクショトリガー ===
PROMPT_TRIGGER = "このプロンプト"

# === 共有素材パス ===
SHARED_FOLDER = "C:\\Instagramショート\\Instagram_Reels_Production\\共有素材"

SHARED_ASSETS = {
    # 字幕背景（V14）
    "telop_back": {
        "path": f"{SHARED_FOLDER}\\ランキングボード\\telop_back.png",
        "track": "V14",
        "timing": "start_to_cta"
    },
    "telop_cta_back": {
        "path": f"{SHARED_FOLDER}\\ランキングボード\\telop_cta_back.png",
        "track": "V14",
        "timing": "cta_to_end"
    },
    # ランキングボード（V4）
    "rankingboard": {
        "path": f"{SHARED_FOLDER}\\ランキングボード\\rankingboard.png",
        "track": "V4",
        "timing": "start_to_cta"
    },
    # タイトル背景（V13）
    "title_back": {
        "path": f"{SHARED_FOLDER}\\ランキングボード\\title_back.png",
        "track": "V13",
        "timing": "start_to_end"
    },
    # アバター動画（V1）- 特別処理（avatar_sequence）
    # ExtendScriptでループ配置を処理
    # アバター静止画（V3）- 動的配置
    "avatar_still": {
        "path": f"{SHARED_FOLDER}\\アバター静止画\\normal.png",
        "track": "V3",
        "timing": "dynamic"  # ツール名〜次の男性発話まで
    },
    # BGM（A3）
    "bgm": {
        "path": f"{SHARED_FOLDER}\\BGM\\Rise_of_the_New_Team.mp3",
        "track": "A3",
        "timing": "start_to_end"
        # volume: 手動で調整（ExtendScriptでの自動設定は不安定）
    }
}


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


def find_prompt_timings(subtitles: list) -> list:
    """「このプロンプト」の出現タイミングを検出"""
    timings = []
    for sub in subtitles:
        if PROMPT_TRIGGER in sub['text']:
            timings.append({
                'time': sub['start'],
                'end': sub['end'],
                'index': sub['index']
            })
    return timings


def find_prompt_screenshots(project_path: Path) -> list:
    """プロジェクトフォルダからプロンプトスクショを検索"""
    screenshots = []
    extensions = ['.png', '.jpg', '.jpeg']

    for i in range(1, 10):  # prompt_screenshot_1 ~ 9
        for ext in extensions:
            filename = f"prompt_screenshot_{i}{ext}"
            filepath = project_path / filename
            if filepath.exists():
                screenshots.append({
                    'index': i,
                    'path': wsl_to_windows_path(str(filepath)),
                    'filename': filename
                })
                break

    return screenshots


def get_end_time(subtitles: list) -> float:
    """最後の字幕の終了時間を取得"""
    if subtitles:
        return subtitles[-1]['end']
    return 90.0  # デフォルト


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
                    'end': sub['end'],
                    'text': text,
                    'index': i,
                    'rank': rank
                })
                found_tools.add(tool.lower())
                break

    return mentions


def wsl_to_windows_path(wsl_path: str) -> str:
    """WSLパスをWindowsパスに変換"""
    if wsl_path.startswith('/mnt/'):
        # /mnt/c/... → C:\...
        parts = wsl_path[5:].split('/', 1)  # ['c', 'rest/of/path']
        if len(parts) == 2:
            return f"{parts[0].upper()}:\\{parts[1].replace('/', '\\')}"
        else:
            return f"{parts[0].upper()}:\\"
    return wsl_path


def find_narration_file(project_path: Path) -> dict:
    """ナレーション音声ファイル（combined_all.mp3）を検索"""
    audio_folder = project_path / 'audio_trimmed'
    combined_file = audio_folder / 'combined_all.mp3'

    if combined_file.exists():
        # WSLパスをWindowsパスに変換
        windows_path = wsl_to_windows_path(str(combined_file))
        return {
            'path': windows_path,
            'track': 'A1'  # 結合済み音声はA1に配置
        }

    return None


def find_next_male_start(mentions: list, current_index: int, cta_start: float) -> float:
    """次の男性発話開始時間を取得（＝次のツール名出現時間）"""
    # ツール名は女性が読み上げ、その後に男性が解説する
    # 次のツール名が出現するまでの間、アバター静止画を表示
    if current_index + 1 < len(mentions):
        return mentions[current_index + 1]['time']
    else:
        # 最後のツールの場合はCTA開始まで
        return cta_start


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

    # 時間情報を取得
    cta_start_time = find_cta_start_time(subtitles)
    end_time = get_end_time(subtitles)

    if cta_start_time:
        print(f"CTA開始時間: {cta_start_time:.2f}s")
    else:
        print("警告: CTA開始時間が見つかりません。デフォルト値を使用します。")
        cta_start_time = end_time - 10.0

    print(f"終了時間: {end_time:.2f}s")

    # ツール名リスト
    tool_names = list(tool_images.keys())

    # ツール出現タイミングを検出（初回のみ）
    mentions = find_tool_mentions(subtitles, tool_names)
    print(f"ツール検出: {len(mentions)} 件")

    # ナレーションファイルを検索
    narration = find_narration_file(project_path)
    print(f"ナレーション: {'検出' if narration else '未検出'}")

    # placement.json を生成
    placements = []

    # === 1. 共有素材（固定配置）===
    print("\n--- 共有素材 ---")
    for name, asset in SHARED_ASSETS.items():
        if asset['timing'] == 'dynamic':
            continue  # 動的配置は後で処理

        timing = asset['timing']
        if timing == 'start_to_cta':
            start = 0.0
            duration = cta_start_time
        elif timing == 'cta_to_end':
            start = cta_start_time
            duration = end_time - cta_start_time
        elif timing == 'start_to_end':
            start = 0.0
            duration = end_time
        else:
            continue

        placement = {
            'type': 'shared',
            'name': name,
            'path': asset['path'],
            'track': asset['track'],
            'time': start,
            'duration': duration
        }

        # ボリューム設定（オーディオ）
        if 'volume' in asset:
            placement['volume'] = asset['volume']

        placements.append(placement)
        print(f"  {name}: {asset['track']}, {start:.2f}s ～ {start + duration:.2f}s")

    # === 2. アバター静止画（動的配置）===
    print("\n--- アバター静止画 ---")
    avatar_still = SHARED_ASSETS['avatar_still']
    for i, mention in enumerate(mentions):
        # ツール名の開始から終了まで（女性が言い終わるまで）
        start = mention['time']
        end = mention['end']
        duration = end - start

        placements.append({
            'type': 'avatar_still',
            'name': f"avatar_still_{mention['tool']}",
            'path': avatar_still['path'],
            'track': avatar_still['track'],
            'time': start,
            'duration': duration
        })
        print(f"  {mention['tool']}: {start:.2f}s ～ {end:.2f}s (長さ: {duration:.2f}s)")

    # === 2.5. アバター動画シーケンス（V1）===
    print("\n--- アバター動画シーケンス ---")
    # u---n.mp4: 0.01sから開始（最初から）
    avatar_video_start = 0.01

    placements.append({
        'type': 'avatar_video',
        'name': 'avatar_intro',
        'path': f"{SHARED_FOLDER}\\アバター動画\\u---n.mp4",
        'track': 'V1',
        'time': avatar_video_start,
        'loop': False  # ループなし、1回だけ
    })
    print(f"  u---n.mp4: V1, {avatar_video_start:.2f}s から開始")

    # normal.mp4: u---n.mp4終了直後 ～ CTA開始まで（ループ）
    placements.append({
        'type': 'avatar_video',
        'name': 'avatar_normal',
        'path': f"{SHARED_FOLDER}\\アバター動画\\normal.mp4",
        'track': 'V1',
        'time': -1,  # 前のクリップの直後（ExtendScriptで処理）
        'loop': True,
        'loop_until': cta_start_time
    })
    print(f"  normal.mp4: V1, u---n終了後 ～ {cta_start_time:.2f}s までループ")

    # cta.mp4: CTA開始 ～ 終了まで（ループ）
    placements.append({
        'type': 'avatar_video',
        'name': 'avatar_cta',
        'path': f"{SHARED_FOLDER}\\アバター動画\\cta.mp4",
        'track': 'V1',
        'time': -1,  # 前のクリップの直後（ExtendScriptで処理）
        'loop': True,
        'loop_until': end_time
    })
    print(f"  cta.mp4: V1, normal終了後 ～ {end_time:.2f}s までループ")

    # === 3. ランキングアイコン ===
    print("\n--- ランキングアイコン ---")
    for i, mention in enumerate(mentions):
        tool = mention['tool']
        rank = mention['rank']
        image_file = tool_images.get(tool)

        if not image_file:
            print(f"  警告: 画像マッピングなし: {tool}")
            continue

        # トラックを順位から取得
        track = RANK_TRACK_MAP.get(rank, "V5")
        if not track:
            print(f"  警告: トラックマッピングなし: {rank}")
            track = "V5"

        # Y座標を順位から取得
        y_position = RANK_Y_POSITIONS.get(rank, 1008.0)

        # 長さを計算（CTA開始まで）
        duration = cta_start_time - mention['time']

        image_path = f"{image_folder}\\{image_file}" if image_folder else image_file

        placements.append({
            'type': 'ranking',
            'tool': tool,
            'rank': rank,
            'path': image_path,
            'time': mention['time'],
            'duration': duration,
            'track': track,
            'scale': RANKING_SCALE,
            'x': RANKING_X,
            'y': y_position
        })
        print(f"  {mention['time']:.2f}s: {tool} ({rank}) → {track}, Y={y_position}, 長さ={duration:.2f}s")

    # === 4. プロンプトスクショ（V10-V12）===
    print("\n--- プロンプトスクショ ---")
    prompt_timings = find_prompt_timings(subtitles)
    prompt_screenshots = find_prompt_screenshots(project_path)

    if prompt_screenshots:
        for i, screenshot in enumerate(prompt_screenshots):
            if i < len(prompt_timings) and i < len(PROMPT_TRACK_ORDER):
                timing = prompt_timings[i]
                track = PROMPT_TRACK_ORDER[i]
                # 次のプロンプトまたはCTAまでの長さ
                if i + 1 < len(prompt_timings):
                    duration = prompt_timings[i + 1]['time'] - timing['time']
                else:
                    duration = cta_start_time - timing['time']

                placements.append({
                    'type': 'prompt_screenshot',
                    'name': f"prompt_screenshot_{screenshot['index']}",
                    'path': screenshot['path'],
                    'track': track,
                    'time': timing['time'],
                    'duration': duration,
                    'scale': 50,  # スケール（調整可能）
                    'x': 740,     # プロンプトスクショ用X座標
                    'y': 1373     # プロンプトスクショ用Y座標
                })
                print(f"  {screenshot['filename']}: {track}, {timing['time']:.2f}s ～ {timing['time'] + duration:.2f}s")
            else:
                print(f"  警告: {screenshot['filename']} に対応するタイミングまたはトラックがありません")
    else:
        if prompt_timings:
            print(f"  「このプロンプト」が {len(prompt_timings)} 箇所見つかりましたが、スクショがありません")
            print(f"  → prompt_screenshot_1.png, prompt_screenshot_2.png ... をプロジェクトフォルダに配置してください")
        else:
            print(f"  スクショなし、タイミングなし")

    # === 5. ナレーション ===
    print("\n--- ナレーション ---")
    if narration:
        placements.append({
            'type': 'shared',  # 共有素材と同じ処理で配置
            'name': 'narration',
            'path': narration['path'],
            'track': narration['track'],
            'time': 0.0,
            'duration': end_time
        })
        print(f"  combined_all.mp3 → {narration['track']}, 0.00s ～ {end_time:.2f}s")
    else:
        print("  ナレーションファイルが見つかりません")

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
