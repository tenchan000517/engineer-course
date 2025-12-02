# 動画圧縮スクリプト

Vercelデプロイ用に動画を100MB以下に圧縮するPythonスクリプトです。

## 初回セットアップ

```bash
# 1. scriptsフォルダに移動
cd scripts

# 2. 仮想環境を作成
python3 -m venv venv

# 3. 仮想環境をアクティベート
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Mac/Linux:
source venv/bin/activate

# 4. 依存パッケージをインストール
pip install -r requirements.txt
```

## 使い方

### 動画圧縮

```bash
# 1. 仮想環境をアクティベート
source venv/bin/activate  # Mac/Linux
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# 2. スクリプト実行
python compress_videos.py

# 3. 仮想環境を終了
deactivate
```

### サイズチェック

```bash
# 仮想環境をアクティベート後
python check_sizes.py
```

## カスタマイズ

`compress_videos.py`の設定を変更できます：

```python
# カスタム設定
MAX_SIZE_MB = 100  # 目標サイズ
CRF = 28  # 圧縮品質 (18-28推奨)
```

**CRF値の目安:**
- `18`: ほぼ無劣化
- `23`: 高品質（デフォルト）
- `28`: バランス（推奨）
- `30-32`: 強圧縮

## トラブルシューティング

### Windows: スクリプト実行が無効

PowerShellを管理者権限で開き：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ffmpeg-pythonのインストールエラー

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## ファイル構成

- `compress_videos.py`: 動画圧縮スクリプト
- `check_sizes.py`: サイズチェックスクリプト
- `requirements.txt`: 依存パッケージ
- `venv/`: 仮想環境（自動作成）
