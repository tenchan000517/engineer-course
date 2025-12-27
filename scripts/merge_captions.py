#!/usr/bin/env python3
"""
キャプションJSONを本体JSONに統合するスクリプト
"""

import json
import glob
import os

# パス設定
CAPTIONS_DIR = "/mnt/c/engineer-course/content/captions"
TARGET_JSON = "/mnt/c/Instagram_AI/20251211_08/instagram_ideas.json"

def main():
    # 本体JSONを読み込み
    with open(TARGET_JSON, 'r', encoding='utf-8') as f:
        ideas = json.load(f)

    # キャプションJSONを全て読み込み
    captions_map = {}
    caption_files = sorted(glob.glob(os.path.join(CAPTIONS_DIR, "captions_*.json")))

    for caption_file in caption_files:
        with open(caption_file, 'r', encoding='utf-8') as f:
            captions = json.load(f)
            for item in captions:
                captions_map[item['idea_id']] = item['caption']

    print(f"読み込んだキャプション数: {len(captions_map)}")

    # 本体JSONにキャプションを追加
    updated_count = 0
    for idea in ideas:
        idea_id = idea.get('idea_id')
        if idea_id in captions_map:
            idea['caption'] = captions_map[idea_id]
            updated_count += 1

    print(f"更新したアイデア数: {updated_count}")

    # 保存
    with open(TARGET_JSON, 'w', encoding='utf-8') as f:
        json.dump(ideas, f, ensure_ascii=False, indent=4)

    print(f"保存完了: {TARGET_JSON}")

if __name__ == "__main__":
    main()
