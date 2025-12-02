import ffmpeg
import os
import sys
from pathlib import Path

def get_file_size_mb(file_path):
    """ファイルサイズをMB単位で取得"""
    size_bytes = os.path.getsize(file_path)
    size_mb = size_bytes / (1024 * 1024)
    return round(size_mb, 2)

def compress_video(input_path, output_path, crf=28):
    """
    動画を圧縮する

    Args:
        input_path: 入力動画のパス
        output_path: 出力動画のパス
        crf: 圧縮品質 (18-28推奨、小さいほど高品質)
    """
    try:
        print(f"圧縮開始: {input_path}")
        print(f"品質設定: CRF={crf}")

        # ffmpegで圧縮
        (
            ffmpeg
            .input(input_path)
            .output(
                output_path,
                vcodec='libx264',
                crf=crf,
                preset='medium',
                **{'movflags': '+faststart'}  # Web最適化
            )
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )

        # 結果表示
        original_size = get_file_size_mb(input_path)
        compressed_size = get_file_size_mb(output_path)
        reduction = round((1 - compressed_size / original_size) * 100, 1)

        print(f"✓ 圧縮完了!")
        print(f"  元のサイズ: {original_size} MB")
        print(f"  圧縮後: {compressed_size} MB")
        print(f"  削減率: {reduction}%")
        print()

        return compressed_size

    except ffmpeg.Error as e:
        print(f"✗ エラーが発生しました: {e.stderr.decode()}")
        return None

def compress_all_videos(video_dir, max_size_mb=100, crf=28):
    """
    フォルダ内のすべての動画を圧縮

    Args:
        video_dir: 動画フォルダのパス
        max_size_mb: 目標サイズ (MB)
        crf: 圧縮品質
    """
    video_dir = Path(video_dir)

    if not video_dir.exists():
        print(f"✗ フォルダが見つかりません: {video_dir}")
        return

    # 対応する動画フォーマット
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv']

    # 動画ファイルを検索
    video_files = []
    for ext in video_extensions:
        video_files.extend(video_dir.glob(f'*{ext}'))

    # -compressedファイルは除外
    video_files = [f for f in video_files if '-compressed' not in f.stem]

    if not video_files:
        print(f"✗ 動画ファイルが見つかりません: {video_dir}")
        return

    print(f"見つかった動画: {len(video_files)}件")
    print(f"目標サイズ: {max_size_mb} MB以下")
    print(f"圧縮品質: CRF={crf}")
    print("=" * 60)
    print()

    # 各動画を圧縮
    for video_file in video_files:
        # ファイルサイズチェック
        current_size = get_file_size_mb(video_file)

        if current_size <= max_size_mb:
            print(f"スキップ: {video_file.name} ({current_size} MB - 既に目標サイズ以下)")
            print()
            continue

        # 出力ファイル名
        output_file = video_file.parent / f"{video_file.stem}-compressed{video_file.suffix}"

        # 既に圧縮済みファイルがある場合
        if output_file.exists():
            print(f"スキップ: {video_file.name} (圧縮済みファイルが存在します)")
            print()
            continue

        # 圧縮実行
        compressed_size = compress_video(str(video_file), str(output_file), crf)

        # サイズチェック
        if compressed_size and compressed_size > max_size_mb:
            print(f"⚠ 警告: まだ{max_size_mb}MBを超えています")
            print(f"  → CRFを上げて再圧縮することをおすすめします")
            print()

def main():
    """メイン処理"""
    print("=" * 60)
    print("動画圧縮スクリプト")
    print("=" * 60)
    print()

    # プロジェクトルートからの相対パス
    # scripts/から見て ../public/mov/
    video_dir = Path(__file__).parent.parent / 'public' / 'mov'

    # カスタム設定
    MAX_SIZE_MB = 100  # Vercelの制限
    CRF = 28  # 圧縮品質 (18-28推奨)

    # 圧縮実行
    compress_all_videos(video_dir, MAX_SIZE_MB, CRF)

    print("=" * 60)
    print("完了!")
    print("=" * 60)

if __name__ == "__main__":
    main()
