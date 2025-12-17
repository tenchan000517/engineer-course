# Whisper.cpp セットアップ

**所要時間**: 15分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- n8nのDockerイメージにWhisper.cppを追加する方法
- Dockerfileの編集とイメージの再ビルド
- Whisper.cppの動作確認

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- n8nコンテナ内でWhisper.cppを実行できる
- 音声ファイルを文字起こしする準備が整う

---

## 目次

- [セクション1: Whisper.cppとは](#セクション1-whispercppとは)
- [セクション2: Dockerfileの編集](#セクション2-dockerfileの編集)
- [セクション3: Dockerイメージの再ビルド](#セクション3-dockerイメージの再ビルド)
- [セクション4: 動作確認](#セクション4-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Docker Desktop がインストール済み
- n8nがDockerで動作している（`C:\n8n` にdocker-compose.ymlがある状態）
- VSCode または ターミナル

### 確認事項

n8nが正常に動作していることを確認：

```bash
docker ps
```

`n8n` コンテナが表示されていればOKです。

---

## セクション1: Whisper.cppとは

### 概要

Whisper.cppは、OpenAIのWhisperモデルをC++で実装した軽量な音声認識ツールです。

| 特徴 | 説明 |
|------|------|
| 無料 | クラウドAPIと違い、料金がかからない |
| 高精度 | 日本語の文字起こしも高精度 |
| 軽量 | C++実装でメモリ効率が良い |
| オフライン | インターネット接続不要で動作 |

### なぜDockerに追加するのか

n8nのワークフローから直接Whisper.cppを呼び出すためです。

```
[Google Drive] → [n8n: 音声ダウンロード] → [Whisper.cpp: 文字起こし] → [結果保存]
```

### チェックポイント

- [ ] Whisper.cppの概要を理解した

---

## セクション2: Dockerfileの編集

### Step 1: n8nフォルダを開く

VSCodeで `C:\n8n` フォルダを開きます。

### Step 2: Dockerfileを編集

`Dockerfile` を開き、以下の内容に置き換えます：

```dockerfile
FROM n8nio/n8n:latest

USER root

# ffmpeg（音声・動画処理）
RUN apk add --no-cache ffmpeg

# Whisper.cpp（文字起こし）
RUN apk add --no-cache git build-base cmake curl
RUN git clone https://github.com/ggerganov/whisper.cpp.git /opt/whisper.cpp
WORKDIR /opt/whisper.cpp
RUN cmake -B build && cmake --build build --config Release
# 日本語対応モデル（base: 142MB）をcurlで直接ダウンロード
RUN curl -L -o ./models/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin

USER node
WORKDIR /home/node
```

### 各行の説明

| 行 | 説明 |
|----|------|
| `apk add git build-base cmake curl` | ビルドに必要なツールをインストール |
| `git clone ...` | Whisper.cppのソースコードを取得 |
| `cmake -B build && cmake --build ...` | ソースコードをコンパイル |
| `curl -L -o ...` | 日本語対応の音声認識モデル（142MB）をダウンロード |

### チェックポイント

- [ ] Dockerfileを編集した
- [ ] 保存した（Ctrl + S）

---

## セクション3: Dockerイメージの再ビルド

### Step 1: ターミナルを開く

VSCodeで `Ctrl + `` を押してターミナルを開きます。

### Step 2: 再ビルドコマンドを実行

以下のコマンドを順番に実行します：

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 各コマンドの説明

| コマンド | 説明 | 所要時間 |
|---------|------|---------|
| `docker-compose down` | 現在のコンテナを停止・削除 | 数秒 |
| `docker-compose build --no-cache` | 新しいイメージをビルド | 5-10分 |
| `docker-compose up -d` | 新しいイメージでコンテナを起動 | 数秒 |

### ビルド中の出力例

```
[+] Building 219.1s (13/13) FINISHED
 => [n8n 6/8] RUN cmake -B build && cmake --build build --config Release    183.0s
 => [n8n 7/8] RUN curl -L -o ./models/ggml-base.bin ...                      10.2s
 => [n8n 8/8] WORKDIR /home/node                                              0.2s
```

`FINISHED` と表示されれば成功です。

### チェックポイント

- [ ] `docker-compose down` が成功した
- [ ] `docker-compose build --no-cache` が成功した（5-10分待つ）
- [ ] `docker-compose up -d` が成功した

---

## セクション4: 動作確認

### Step 1: Whisper.cppのヘルプを表示

Git Bashを使っている場合は、パスの先頭にスラッシュを2つ付けます：

```bash
docker exec n8n //opt/whisper.cpp/build/bin/whisper-cli --help
```

PowerShellの場合：

```bash
docker exec n8n /opt/whisper.cpp/build/bin/whisper-cli --help
```

### 成功時の出力

```
usage: /opt/whisper.cpp/build/bin/whisper-cli [options] file0 file1 ...
supported audio formats: flac, mp3, ogg, wav

options:
  -h,        --help                 [default] show this help message and exit
  -t N,      --threads N            [4      ] number of threads to use during computation
  ...
```

ヘルプが表示されればインストール成功です。

### Step 2: モデルファイルの確認

```bash
docker exec n8n ls -la //opt/whisper.cpp/models/
```

`ggml-base.bin`（約142MB）が表示されればOKです。

### チェックポイント

- [ ] `--help` でヘルプが表示された
- [ ] モデルファイル `ggml-base.bin` が存在する

---

## トラブルシューティング

### cmake: No such file or directory

**症状**: ビルド中に `cmake: No such file or directory` エラーが出る

**解決方法**: Dockerfileに `cmake` が含まれているか確認：

```dockerfile
RUN apk add --no-cache git build-base cmake curl
```

### Failed to download ggml model

**症状**: モデルのダウンロードに失敗する

**解決方法**: `curl` コマンドで直接ダウンロードする方式に変更（本講座のDockerfileは対応済み）

### Git Bashでパスがおかしくなる

**症状**: `/opt/...` が `C:/Program Files/Git/opt/...` に変換される

**解決方法**: パスの先頭にスラッシュを2つ付ける：

```bash
docker exec n8n //opt/whisper.cpp/build/bin/whisper-cli --help
```

---

## まとめ

### このモジュールで学んだこと

- n8nのDockerイメージにWhisper.cppを追加する方法
- Dockerfileの編集と再ビルドの手順
- Whisper.cppの動作確認方法

### 次のステップ

[文字起こしワークフローの構築](./module-02-transcription-workflow.md)では、n8nワークフローを作成し、Google Driveの音声ファイルを自動で文字起こしする方法を学びます。

---

## 参考資料

- [Whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp)
- [Hugging Face - Whisper Models](https://huggingface.co/ggerganov/whisper.cpp)

---

## よくある質問

**Q: ビルドにどのくらい時間がかかりますか？**
A: 初回ビルドは5-10分程度です。Whisper.cppのコンパイルとモデルダウンロード（142MB）に時間がかかります。

**Q: モデルサイズを変更できますか？**
A: はい。`ggml-base.bin`（142MB）の代わりに、`ggml-small.bin`（466MB、より高精度）や`ggml-tiny.bin`（75MB、より高速）を使用できます。

**Q: GPUを使えますか？**
A: Docker Desktop + WSL2環境では難しいです。CPU版で十分な速度が出ます。

**Q: 既存のワークフローは消えますか？**
A: いいえ。ワークフローは `n8n_data/` フォルダに保存されているため、再ビルドしても消えません。

**Q: ffmpegは消えますか？**
A: いいえ。Dockerfileにffmpegも含まれているため、再ビルド後も使えます。
