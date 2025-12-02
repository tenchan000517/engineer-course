from pathlib import Path
import os

def get_file_size_mb(file_path):
    """ファイルサイズをMB単位で取得"""
    size_bytes = os.path.getsize(file_path)
    return round(size_bytes / (1024 * 1024), 2)

def check_video_sizes(video_dir, max_size=100):
    """
    動画ファイルのサイズをチェック

    Args:
        video_dir: 動画フォルダのパス
        max_size: 制限サイズ (MB)
    """
    video_dir = Path(video_dir)

    if not video_dir.exists():
        print(f"✗ フォルダが見つかりません: {video_dir}")
        return

    video_files = list(video_dir.glob('*.mp4'))

    if not video_files:
        print(f"✗ 動画ファイルが見つかりません: {video_dir}")
        return

    print("=" * 60)
    print("動画ファイルサイズチェック")
    print("=" * 60)
    print()

    over_limit = []

    for video_file in sorted(video_files):
        size = get_file_size_mb(video_file)
        status = "✓ OK" if size <= max_size else "✗ 超過"

        print(f"{status} {video_file.name}: {size} MB")

        if size > max_size:
            over_limit.append((video_file.name, size))

    print()
    print("=" * 60)

    if over_limit:
        print(f"⚠ {len(over_limit)}件が{max_size}MBを超えています:")
        for name, size in over_limit:
            print(f"  - {name}: {size} MB")
    else:
        print(f"✓ すべてのファイルが{max_size}MB以下です!")

    print("=" * 60)

if __name__ == "__main__":
    # プロジェクトルートからの相対パス
    video_dir = Path(__file__).parent.parent / 'public' / 'mov'
    check_video_sizes(video_dir)
