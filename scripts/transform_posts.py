#!/usr/bin/env python3
"""
150投稿JSONを変換するスクリプト

変換内容:
1. IDを日付+ナンバリング形式に（例: 20250101-001）
2. 順序を「公開情報、画像、公開情報、画像、スレッド」の5投稿1セットに
3. 5分割（30件×5ファイル）
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

# 入力ファイル
INPUT_FILE = Path("/mnt/c/Instagram_AI/X_Research/20251229_01/x_posts_month_202501.json")
# 出力ディレクトリ
OUTPUT_DIR = Path("/mnt/c/Instagram_AI/X_Research/20251229_01/split")

def load_json(filepath: Path) -> dict:
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data: dict, filepath: Path):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"保存: {filepath}")

def transform_posts(data: dict) -> list:
    """
    投稿を変換:
    - 順序: 公開情報→画像→公開情報→画像→スレッド（5投稿1セット）
    - ID: 日付+ナンバリング
    """
    posts = data['posts']

    # パターン別に分類
    announcements = [p for p in posts if p['pattern'] == 'announcement']
    images = [p for p in posts if p['pattern'] == 'image']
    threads = [p for p in posts if p['pattern'] == 'thread']

    print(f"元データ: announcement={len(announcements)}, image={len(images)}, thread={len(threads)}")

    # 30セット（5投稿×30=150件）に再構成
    # 各セット: 公開情報2件、画像2件、スレッド1件
    reordered = []
    start_date = datetime(2025, 1, 1)

    for set_idx in range(30):
        # このセットの日付（1日5投稿）
        current_date = start_date + timedelta(days=set_idx)
        date_str = current_date.strftime("%Y%m%d")

        # 1セット5投稿
        set_posts = [
            announcements[set_idx * 2],      # 公開情報1
            images[set_idx * 2],              # 画像1
            announcements[set_idx * 2 + 1],  # 公開情報2
            images[set_idx * 2 + 1],          # 画像2
            threads[set_idx],                 # スレッド
        ]

        for i, post in enumerate(set_posts, 1):
            # 新しいID（日付+ナンバリング）
            new_id = f"{date_str}-{i:03d}"
            post['post_id'] = new_id
            post['scheduled_date'] = current_date.strftime("%Y-%m-%d")
            reordered.append(post)

    return reordered

def split_into_files(posts: list, num_files: int = 5) -> list:
    """
    投稿を指定数のファイルに分割
    """
    chunk_size = len(posts) // num_files
    chunks = []

    for i in range(num_files):
        start = i * chunk_size
        end = start + chunk_size
        chunks.append(posts[start:end])

    return chunks

def main():
    print("=" * 50)
    print("150投稿JSON変換スクリプト")
    print("=" * 50)

    # 入力ファイル読み込み
    print(f"\n読み込み: {INPUT_FILE}")
    data = load_json(INPUT_FILE)
    print(f"総投稿数: {data['total_posts']}")

    # 変換（順序変更 + ID変更）
    print("\n変換中...")
    reordered_posts = transform_posts(data)
    print(f"変換後: {len(reordered_posts)}件")

    # 5分割
    print("\n5分割中...")
    chunks = split_into_files(reordered_posts, 5)

    # 各ファイル保存
    for i, chunk in enumerate(chunks, 1):
        start_date = chunk[0]['scheduled_date']
        end_date = chunk[-1]['scheduled_date']

        output_data = {
            "generated_at": datetime.now().strftime("%Y-%m-%d"),
            "month": "2025-01",
            "file_number": i,
            "total_files": 5,
            "date_range": f"{start_date} ~ {end_date}",
            "total_posts": len(chunk),
            "posts": chunk
        }

        output_file = OUTPUT_DIR / f"x_posts_part{i}.json"
        save_json(output_data, output_file)

        # サマリー表示
        patterns = {}
        for p in chunk:
            patterns[p['pattern']] = patterns.get(p['pattern'], 0) + 1
        print(f"  Part {i}: {len(chunk)}件 ({start_date}～{end_date})")
        print(f"    内訳: {patterns}")

    print("\n" + "=" * 50)
    print("完了！")
    print(f"出力先: {OUTPUT_DIR}")
    print("=" * 50)

if __name__ == "__main__":
    main()
