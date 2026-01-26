#!/usr/bin/env python3
"""
telop.txt + combined_all.json → subtitle.srt 生成スクリプト

アルゴリズム:
1. JSONセグメントとtelop行の先頭3文字が一致する箇所をアンカーポイントとして特定
2. アンカー間のtelop行は文字数で按分

使い方:
  python generate_srt.py <project_folder>

例:
  python generate_srt.py "C:\\Instagramショート\\Instagram_Reels_Production\\ランキング_SNS_AIツール_2026-01-23"

入力（project_folder内に配置）:
  - telop.txt
  - audio_trimmed/combined_all.json

出力:
  - subtitle.srt
"""

import json
import sys
import os

def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def load_telop(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines()]
    return [line for line in lines if line]

def format_srt_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def count_chars(text):
    return len(text.replace(" ", "").replace("　", ""))

def find_anchor_points(segments, telop_lines):
    """
    JSONセグメントとtelop行の先頭3文字が一致する箇所を特定
    順序を考慮して、telop_idxは常に前に進む
    """
    anchors = []  # [(telop_idx, segment_start_time)]
    telop_idx = 0

    for seg in segments:
        seg_head = seg["text"].replace(" ", "").replace("　", "")[:3]
        seg_start = seg["start"]

        # 現在のtelop_idx以降で一致するものを探す
        for i in range(telop_idx, len(telop_lines)):
            telop_head = telop_lines[i].replace(" ", "").replace("　", "")[:3]
            if seg_head == telop_head:
                anchors.append((i, seg_start))
                telop_idx = i + 1  # 次はこの行の次から探す
                break

    return anchors

def generate_srt(telop_lines, anchors, total_duration):
    """
    アンカーポイントを基準に、間のtelop行を文字数で按分
    """
    srt_entries = []

    # 最初のアンカーより前の処理
    if anchors and anchors[0][0] > 0:
        first_anchor_idx, first_anchor_time = anchors[0]
        telops_before = telop_lines[:first_anchor_idx]
        if telops_before:
            total_chars = sum(count_chars(t) for t in telops_before)
            current_time = 0.0
            for telop in telops_before:
                char_ratio = count_chars(telop) / total_chars if total_chars > 0 else 1/len(telops_before)
                duration = first_anchor_time * char_ratio
                srt_entries.append({
                    "text": telop,
                    "start": current_time,
                    "end": current_time + duration
                })
                current_time += duration

    # アンカー間の処理
    for i in range(len(anchors)):
        anchor_idx, anchor_time = anchors[i]

        # 次のアンカーまたは終端
        if i + 1 < len(anchors):
            next_anchor_idx, next_anchor_time = anchors[i + 1]
        else:
            next_anchor_idx = len(telop_lines)
            next_anchor_time = total_duration

        # このアンカーから次のアンカーまでのtelop行
        telops_in_range = telop_lines[anchor_idx:next_anchor_idx]

        if telops_in_range:
            total_chars = sum(count_chars(t) for t in telops_in_range)
            available_time = next_anchor_time - anchor_time
            current_time = anchor_time

            for telop in telops_in_range:
                char_ratio = count_chars(telop) / total_chars if total_chars > 0 else 1/len(telops_in_range)
                duration = available_time * char_ratio
                srt_entries.append({
                    "text": telop,
                    "start": current_time,
                    "end": current_time + duration
                })
                current_time += duration

    return srt_entries

def write_srt(srt_entries, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        for i, entry in enumerate(srt_entries, 1):
            f.write(f"{i}\n")
            f.write(f"{format_srt_time(entry['start'])} --> {format_srt_time(entry['end'])}\n")
            f.write(f"{entry['text']}\n")
            f.write("\n")

def main():
    if len(sys.argv) < 2:
        print("使い方: python generate_srt.py <project_folder>")
        print("例: python generate_srt.py \"C:\\\\Instagramショート\\\\...\\\\ランキング_xxx\"")
        sys.exit(1)

    project_folder = sys.argv[1]

    # ファイルパス
    json_path = os.path.join(project_folder, "audio_trimmed", "combined_all.json")
    telop_path = os.path.join(project_folder, "telop.txt")
    srt_path = os.path.join(project_folder, "subtitle.srt")

    # ファイル存在チェック
    if not os.path.exists(json_path):
        print(f"エラー: {json_path} が見つかりません")
        sys.exit(1)
    if not os.path.exists(telop_path):
        print(f"エラー: {telop_path} が見つかりません")
        sys.exit(1)

    print("JSONを読み込み中...")
    data = load_json(json_path)
    segments = data["segments"]
    total_duration = segments[-1]["end"]
    print(f"  セグメント数: {len(segments)}, 総時間: {total_duration:.2f}秒")

    print("telop.txtを読み込み中...")
    telop_lines = load_telop(telop_path)
    print(f"  テロップ行数: {len(telop_lines)}")

    print("\nアンカーポイントを特定中...")
    anchors = find_anchor_points(segments, telop_lines)
    print(f"  アンカーポイント数: {len(anchors)}/{len(segments)} ({len(anchors)/len(segments)*100:.0f}%)")

    print("\nSRTを生成中...")
    srt_entries = generate_srt(telop_lines, anchors, total_duration)
    print(f"  生成されたSRTエントリ数: {len(srt_entries)}")

    print(f"\nSRTを書き出し中: {srt_path}")
    write_srt(srt_entries, srt_path)

    print("\n完了!")
    print(f"  出力: {srt_path}")

if __name__ == "__main__":
    main()
