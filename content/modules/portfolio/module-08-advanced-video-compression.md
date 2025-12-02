# モジュール8: Python + FFMPEGによる動画圧縮（応用編）

**所要時間**: 60-90分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Pythonの環境構築（Windows/Mac/Linux）
- FFMPEGのインストールと確認
- 仮想環境（venv）の作成と管理
- Pythonスクリプトでの動画一括圧縮
- 圧縮後のファイルサイズ確認と最適化

---

## このモジュールのゴール

このモジュールを終えると、以下のことができるようになります：

- ✅ Pythonの仮想環境を作成・管理できる
- ✅ FFMPEGをPythonから操作できる
- ✅ 複数の動画を一括で圧縮できる
- ✅ デプロイ前に動画サイズを最適化できる
- ✅ 圧縮品質を自由に調整できる

---

## なぜPythonで動画圧縮？

### Module 7との違い

**Module 7（基本編）:**
- ffmpegコマンドを直接実行
- 1つずつ手動で圧縮
- Claude Codeに指示して実行

**Module 8（応用編）:**
- Pythonスクリプトで自動化
- 複数の動画を一括圧縮
- サイズチェックと再圧縮を自動化
- より細かい制御が可能

### こんな人におすすめ

- 動画が10本以上ある
- 定期的に動画を追加する
- 圧縮作業を自動化したい
- プログラミングスキルを身につけたい

---

## ステップ1: Pythonのインストール確認

### 1-1. Pythonがインストール済みか確認

**Claude Codeで実行:**

```bash
python --version
```

または

```bash
python3 --version
```

**期待される出力:**
```
Python 3.10.x
```

### 1-2. Pythonがない場合のインストール

#### Windows

**方法1: Microsoft Store（推奨）**

1. Microsoft Storeを開く
2. "Python 3.12"で検索
3. インストール

**方法2: winget**

```bash
winget install Python.Python.3.12
```

#### Mac

```bash
brew install python@3.12
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### 1-3. インストール確認

```bash
python3 --version
pip3 --version
```

両方でバージョンが表示されればOKです。

---

## ステップ2: FFMPEGのインストール

### 2-1. FFMPEGがインストール済みか確認

```bash
ffmpeg -version
```

バージョン情報が表示されればスキップしてOKです。

### 2-2. FFMPEGのインストール

#### Windows

```bash
winget install ffmpeg
```

#### Mac

```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt install ffmpeg
```

### 2-3. インストール確認

```bash
ffmpeg -version
```

**期待される出力:**
```
ffmpeg version 6.x.x
```

---

## ステップ3: プロジェクトディレクトリの準備

### 3-1. scriptsフォルダを作成

プロジェクトルートに`scripts`フォルダを作成します。

**Claude Codeで実行:**

```bash
mkdir scripts
cd scripts
```

**ディレクトリ構造:**
```
my-portfolio/
├── app/
├── public/
│   └── mov/           # 動画ファイルがここにある
├── scripts/           # ← 新規作成
│   ├── compress_videos.py
│   └── requirements.txt
├── package.json
└── README.md
```

---

## ステップ4: 仮想環境の作成

### 4-1. 仮想環境とは？

**仮想環境**は、Pythonプロジェクトごとに独立した環境を作る仕組みです。

**メリット:**
- プロジェクトごとにパッケージを管理できる
- バージョンの競合を防げる
- 他のプロジェクトに影響しない

### 4-2. 仮想環境を作成

**scriptsフォルダ内で実行:**

```bash
python3 -m venv venv
```

**説明:**
- `python3 -m venv`: 仮想環境を作成するコマンド
- `venv`: 仮想環境の名前（任意だが慣例的に`venv`を使う）

**作成後のディレクトリ構造:**
```
scripts/
├── venv/              # ← 仮想環境フォルダ
│   ├── bin/           # (Mac/Linux)
│   ├── Scripts/       # (Windows)
│   ├── lib/
│   └── ...
├── compress_videos.py
└── requirements.txt
```

---

## ステップ5: 仮想環境のアクティベート

### 5-1. アクティベートとは？

**アクティベート**すると、仮想環境内のPythonとパッケージが使われるようになります。

**重要:** スクリプト実行前に毎回アクティベートが必要です。

### 5-2. アクティベートコマンド

#### Windows (PowerShell)

```bash
.\venv\Scripts\Activate.ps1
```

#### Windows (コマンドプロンプト)

```bash
venv\Scripts\activate.bat
```

#### Mac/Linux

```bash
source venv/bin/activate
```

### 5-3. アクティベート確認

プロンプトの先頭に`(venv)`が付けばOKです。

**例:**
```
(venv) C:\portfolio\scripts>
```

または

```
(venv) ~/portfolio/scripts$
```

### 5-4. ディアクティベート（終了）

仮想環境を終了するには：

```bash
deactivate
```

---

## ステップ6: 必要なパッケージのインストール

### 6-1. requirements.txtの作成

**scripts/requirements.txt**を作成します。

**Claude Codeで実行:**

```
scripts/requirements.txt というファイルを作成して、
以下の内容を書き込んでください：

ffmpeg-python==0.2.0
```

**ファイルの内容:**
```txt
ffmpeg-python==0.2.0
```

### 6-2. パッケージのインストール

**仮想環境がアクティベートされていることを確認してから:**

```bash
pip install -r requirements.txt
```

**説明:**
- `pip install`: パッケージをインストール
- `-r requirements.txt`: ファイルに記載されたパッケージをすべてインストール

### 6-3. インストール確認

```bash
pip list
```

**期待される出力:**
```
Package       Version
------------- -------
ffmpeg-python 0.2.0
...
```

---

## ステップ7: 動画圧縮スクリプトの作成

### 7-1. compress_videos.pyの作成

**scripts/compress_videos.py**を作成します。

```python
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
```

### 7-2. スクリプトの説明

**主な関数:**

1. `get_file_size_mb()`: ファイルサイズを計算
2. `compress_video()`: 1つの動画を圧縮
3. `compress_all_videos()`: フォルダ内の全動画を一括圧縮
4. `main()`: メイン処理

**圧縮設定:**
- `crf=28`: 圧縮品質（小さいほど高品質、大きいほど圧縮率高）
- `preset='medium'`: 圧縮速度
- `movflags='+faststart'`: Web最適化（ストリーミング再生向け）

---

## ステップ8: スクリプトの実行

### 8-1. 実行前のチェックリスト

- [ ] 仮想環境がアクティベートされている（プロンプトに`(venv)`表示）
- [ ] `public/mov/`フォルダに動画ファイルがある
- [ ] ffmpeg-pythonがインストール済み

### 8-2. スクリプト実行

**scriptsフォルダ内で:**

```bash
python compress_videos.py
```

### 8-3. 実行結果の例

```
============================================================
動画圧縮スクリプト
============================================================

見つかった動画: 3件
目標サイズ: 100 MB以下
圧縮品質: CRF=28
============================================================

圧縮開始: demo-video.mp4
品質設定: CRF=28
✓ 圧縮完了!
  元のサイズ: 150.5 MB
  圧縮後: 45.2 MB
  削減率: 70.0%

スキップ: small-video.mp4 (12.3 MB - 既に目標サイズ以下)

圧縮開始: project-showcase.mp4
品質設定: CRF=28
✓ 圧縮完了!
  元のサイズ: 200.8 MB
  圧縮後: 65.4 MB
  削減率: 67.4%

============================================================
完了!
============================================================
```

### 8-4. 圧縮後のファイル確認

**public/mov/フォルダ:**
```
public/mov/
├── demo-video.mp4              # 元ファイル (150MB)
├── demo-video-compressed.mp4   # 圧縮後 (45MB) ← 使用
├── small-video.mp4             # 元ファイル (12MB) - 圧縮不要
├── project-showcase.mp4        # 元ファイル (200MB)
└── project-showcase-compressed.mp4  # 圧縮後 (65MB) ← 使用
```

---

## ステップ9: 圧縮品質の調整

### 9-1. まだサイズが大きい場合

**問題:**
```
圧縮後: 105.3 MB
⚠ 警告: まだ100MBを超えています
```

**解決策:** CRF値を上げて再圧縮

### 9-2. CRF値の変更

**compress_videos.py**の設定を変更:

```python
# カスタム設定
MAX_SIZE_MB = 100
CRF = 30  # 28 → 30に変更（より強く圧縮）
```

**CRF値の目安:**
- `18`: ほぼ無劣化（ファイルサイズ大）
- `23`: 高品質（デフォルト）
- `28`: バランス（推奨）
- `30-32`: 強圧縮（サイズ優先）
- `35+`: 低品質（非推奨）

### 9-3. 特定のファイルだけ再圧縮

**手動で削除してから再実行:**

```bash
# 圧縮済みファイルを削除
rm public/mov/demo-video-compressed.mp4

# 再実行
python compress_videos.py
```

---

## ステップ10: コードの更新

### 10-1. 動画パスを変更

**app/page.tsx**（または該当ファイル）:

```tsx
// 変更前
<video src="/mov/demo-video.mp4" />

// 変更後（圧縮版を使用）
<video src="/mov/demo-video-compressed.mp4" />
```

### 10-2. Claude Codeで一括変更

```
app/フォルダ内のすべてのTSXファイルで、
/mov/xxx.mp4 を /mov/xxx-compressed.mp4 に変更してください。

ただし、既に-compressedが付いているものは除外してください。
```

---

## ステップ11: 毎回使うコマンドまとめ

### 11-1. 基本フロー

```bash
# 1. scriptsフォルダに移動
cd scripts

# 2. 仮想環境をアクティベート
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Mac/Linux:
source venv/bin/activate

# 3. スクリプト実行
python compress_videos.py

# 4. 仮想環境を終了
deactivate
```

### 11-2. ワンライナー（Mac/Linux）

```bash
cd scripts && source venv/bin/activate && python compress_videos.py && deactivate
```

### 11-3. ワンライナー（Windows PowerShell）

```powershell
cd scripts; .\venv\Scripts\Activate.ps1; python compress_videos.py; deactivate
```

---

## ステップ12: 便利なスクリプト追加（オプション）

### 12-1. サイズチェック専用スクリプト

**scripts/check_sizes.py**:

```python
from pathlib import Path
import os

def get_file_size_mb(file_path):
    size_bytes = os.path.getsize(file_path)
    return round(size_bytes / (1024 * 1024), 2)

def check_video_sizes(video_dir, max_size=100):
    video_dir = Path(video_dir)
    video_files = list(video_dir.glob('*.mp4'))

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
    video_dir = Path(__file__).parent.parent / 'public' / 'mov'
    check_video_sizes(video_dir)
```

**実行:**
```bash
python check_sizes.py
```

---

## トラブルシューティング

### Q1: 仮想環境のアクティベートができない（Windows）

**エラー:**
```
このシステムではスクリプトの実行が無効になっているため...
```

**解決策:**

PowerShellを管理者権限で開き:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q2: ffmpeg-pythonのインストールでエラー

**エラー:**
```
ERROR: Could not find a version that satisfies the requirement ffmpeg-python
```

**解決策:**

1. Pythonのバージョン確認（3.8以上推奨）
2. pipのアップデート:
```bash
pip install --upgrade pip
```

### Q3: 圧縮後もサイズが大きい

**原因:** CRF値が低すぎる

**解決策:**

1. CRFを30-32に上げる
2. 解像度を下げる（スクリプト改造が必要）
3. YouTube/Vimeoに移行

### Q4: 動画の画質が悪すぎる

**原因:** CRF値が高すぎる

**解決策:**

1. CRFを23-26に下げる
2. 元の動画品質を確認

---

## まとめ

### ✅ 学んだこと

- [x] Pythonの仮想環境作成・管理
- [x] ffmpeg-pythonの使い方
- [x] 動画の一括圧縮自動化
- [x] ファイルサイズの確認と最適化

### 📁 作成したファイル

```
scripts/
├── venv/                    # 仮想環境
├── compress_videos.py       # 圧縮スクリプト
├── check_sizes.py           # サイズチェック（オプション）
└── requirements.txt         # 依存パッケージ
```

### 🔄 ワークフロー

```
1. 動画を public/mov/ に配置
   ↓
2. scripts/compress_videos.py を実行
   ↓
3. 圧縮後のファイル（-compressed.mp4）を確認
   ↓
4. コード内の動画パスを更新
   ↓
5. デプロイ
```

### 次のステップ

このスクリプトをベースに、さらにカスタマイズできます：

- 解像度の自動調整
- 複数のCRF値を試して最適値を探す
- 圧縮前後のプレビュー画像生成
- SlackやDiscordへの通知機能

---

## 参考リンク

### Python関連
- [Python公式ドキュメント](https://docs.python.org/ja/3/)
- [venv - 仮想環境](https://docs.python.org/ja/3/library/venv.html)

### FFMPEG関連
- [ffmpeg-python GitHub](https://github.com/kkroening/ffmpeg-python)
- [FFMPEG公式ドキュメント](https://ffmpeg.org/documentation.html)
- [CRF設定ガイド](https://trac.ffmpeg.org/wiki/Encode/H.264#crf)

---

**おつかれさまでした！**

Pythonスクリプトによる動画圧縮の自動化を習得できました。これで大量の動画を効率的に処理できます。
