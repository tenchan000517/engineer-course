# n8n Docker セットアップガイド

**所要時間**: 30-45分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- n8nとは何か
- Dockerを使ったn8nのセットアップ
- 完全無料でのn8n運用方法
- ライセンスキーの取得と有効化
- 基本的なDocker Composeの使い方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- n8nの概要と用途を理解している
- Dockerを使ってn8nをローカル環境で起動できる
- n8nに無料でアクセスして使える状態にできる
- 無料ライセンスを有効化して高度な機能を使える
- n8nの起動・停止・再起動ができる

---

## 目次

- [セクション1: n8nとは](#セクション1-n8nとは)
- [セクション2: 環境確認](#セクション2-環境確認)
- [セクション3: n8nディレクトリの作成](#セクション3-n8nディレクトリの作成)
- [セクション4: Docker Compose設定](#セクション4-docker-compose設定)
- [セクション5: n8nの起動](#セクション5-n8nの起動)
- [セクション6: n8nへのアクセスとアカウント登録](#セクション6-n8nへのアクセスとアカウント登録)
- [セクション7: 無料ライセンスの取得](#セクション7-無料ライセンスの取得)
- [セクション8: ライセンスの有効化](#セクション8-ライセンスの有効化)
- [セクション9: 基本的な操作](#セクション9-基本的な操作)
- [セクション10: README作成（オプション）](#セクション10-readmeオプション)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの
- パソコン（Windows/Mac/Linux）
- Docker Desktop（インストール済み）
- 安定したインターネット接続
- メールアドレス（ライセンスキー受信用）

### 推奨スペック
- メモリ: 8GB以上
- ストレージ: 5GB以上の空き容量
- OS: Windows 10以降 / macOS 10.15以降 / Ubuntu 20.04以降

---

## セクション1: n8nとは

### n8nの概要

**n8n**（エヌエイトエヌ）は、ワークフロー自動化ツールです。異なるサービスやアプリケーションを連携させて、繰り返し作業を自動化できます。

### 主な特徴

- **完全無料**（セルフホスト版）
- **ノーコード/ローコード** - プログラミング知識不要
- **300以上の統合** - Slack、Gmail、Notion、Google Sheets等
- **オープンソース** - カスタマイズ可能
- **無制限** - ワークフロー数、実行回数に制限なし

### クラウド版 vs セルフホスト版

| 項目 | クラウド版 | セルフホスト版（今回） |
|------|-----------|---------------------|
| 料金 | 月額約4,000円～ | 完全無料 |
| セットアップ | 不要 | 必要（本ガイドで解説） |
| ワークフロー数 | プラン制限あり | 無制限 |
| 実行回数 | プラン制限あり | 無制限 |
| データ保存 | クラウド | ローカル（安全） |

---

## セクション2: 環境確認

### Docker/Docker Composeの確認

n8nをDockerで動かすため、まずDockerがインストールされているか確認します。

#### 確認コマンド

ターミナルで以下のコマンドを実行：

```bash
docker --version
docker-compose --version
```

#### 期待される出力例

```
Docker version 28.1.1, build 4eba377
Docker Compose version v2.35.1-desktop.1
```

### チェックポイント

- [ ] Dockerのバージョンが表示される
- [ ] Docker Composeのバージョンが表示される

> **注意**: バージョンが表示されない場合は、Docker Desktopをインストールしてください。
> 公式サイト: https://www.docker.com/products/docker-desktop

---

## セクション3: n8nディレクトリの作成

### ディレクトリ構成の理解

n8n用のディレクトリを作成し、設定ファイルとデータを保存します。

```
C:/n8n/
├── docker-compose.yml    # Docker設定ファイル
├── n8n_data/             # ワークフロー・認証情報（自動作成）
└── README.md             # 使い方メモ
```

### ディレクトリ作成

#### Windowsの場合

```bash
mkdir C:/n8n
cd C:/n8n
```

#### Mac/Linuxの場合

```bash
mkdir ~/n8n
cd ~/n8n
```

### チェックポイント

- [ ] n8nディレクトリが作成された
- [ ] ターミナルでn8nディレクトリに移動している

---

## セクション4: Docker Compose設定

### docker-compose.ymlファイルの作成

n8nを起動するための設定ファイルを作成します。

#### ファイル内容

`C:/n8n/docker-compose.yml` を以下の内容で作成：

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      # タイムゾーン設定（日本時間）
      - TZ=Asia/Tokyo
      - GENERIC_TIMEZONE=Asia/Tokyo

      # n8n基本設定
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http

      # Webhook設定
      - WEBHOOK_URL=http://localhost:5678/

      # データ暗号化キー
      - N8N_ENCRYPTION_KEY=n8n-encryption-key-2025

      # 実行データの保存設定
      - EXECUTIONS_PROCESS=main
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true

    volumes:
      # データ永続化（ワークフロー、認証情報など）
      - ./n8n_data:/home/node/.n8n

    # ヘルスチェック
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 設定の説明

| 項目 | 説明 |
|------|------|
| `image: n8nio/n8n:latest` | 最新版のn8nを使用 |
| `ports: "5678:5678"` | ポート5678でアクセス可能に |
| `TZ=Asia/Tokyo` | 日本時間に設定 |
| `volumes: ./n8n_data` | データをローカルに保存 |
| `restart: unless-stopped` | PC再起動時も自動起動 |

### チェックポイント

- [ ] docker-compose.ymlファイルが作成された
- [ ] ファイルの内容が正しく保存された

---

## セクション5: n8nの起動

### Dockerコンテナの起動

n8nディレクトリで以下のコマンドを実行：

```bash
docker-compose up -d
```

### 起動プロセス

初回起動時は、Dockerイメージのダウンロードが行われます：

```
[+] Pulling n8n
 ⠿ 2d35ebdb57d9 Pull complete
 ⠿ 9682177f5dda Pull complete
 ⠿ e910c7b62cc7 Pull complete
...
[+] Running 1/1
 ✔ Container n8n  Started
```

**所要時間**: 約3-5分（インターネット速度による）

### 起動確認

コンテナが正常に起動しているか確認：

```bash
docker-compose ps
```

#### 正常な出力例

```
NAME   IMAGE              STATUS                    PORTS
n8n    n8nio/n8n:latest   Up 17 seconds (healthy)   0.0.0.0:5678->5678/tcp
```

`STATUS`が`Up`かつ`healthy`であればOK。

### ログ確認

問題がある場合は、ログを確認：

```bash
docker-compose logs -f n8n
```

最後に以下が表示されればOK：

```
Editor is now accessible via:
http://localhost:5678
```

### Windowsファイアウォールの許可

初回起動時、Windowsファイアウォールの通知が表示される場合があります。

**推奨設定**:
- **プライベートネットワーク** → チェックを **入れる**
- **パブリックネットワーク** → チェックを **外す**

> **理由**: ローカル環境と家庭内ネットワークでの使用には「プライベートネットワーク」の許可で十分です。パブリックネットワークを許可すると、外部からのアクセスリスクが高まります。

### チェックポイント

- [ ] `docker-compose up -d`が成功した
- [ ] `docker-compose ps`で`healthy`と表示される
- [ ] ファイアウォールを適切に設定した

---

## セクション6: n8nへのアクセスとアカウント登録

### ブラウザでアクセス

ブラウザで以下のURLを開く：

```
http://localhost:5678
```

### 初回アクセス: カスタマイズ画面

初回アクセス時、以下の画面が表示されます：

![n8nカスタマイズ画面](/n8n-setup/01-customize-screen.png)

**「Customize n8n to you」**

これは任意のアンケートです。答えても、スキップしてもOK。

#### 質問内容

1. What best describes your company? - 会社の種類
2. Which role best describes you? - あなたの役割
3. Who will your automations mainly be for? - 誰のための自動化か
4. How big is your company? - 会社の規模
5. How did you hear about n8n? - n8nをどこで知ったか

#### 対応方法

- **答える場合**: 各項目を選択して「Get started」
- **スキップする場合**: そのまま「Get started」をクリック

### チェックポイント

- [ ] http://localhost:5678にアクセスできた
- [ ] 初期設定画面が表示された
- [ ] 「Get started」を押した

---

## セクション7: 無料ライセンスの取得

### ライセンスオファー画面

次に、無料ライセンスのオファーが表示されます：

![無料ライセンスオファー](/n8n-setup/02-license-offer.png)

**「Get paid features for free (forever)」**

### 提供される機能

メールアドレスを登録すると、以下の機能が **永久に無料** で使えます：

1. **Workflow history** - ワークフロー履歴（過去24時間のバージョン復元）
2. **Advanced debugging** - 高度なデバッグ機能
3. **Execution search and tagging** - 実行履歴の検索とタグ付け
4. **Folders** - フォルダでワークフローを整理

### ライセンス取得手順

#### 1. メールアドレス入力

既に入力されている場合はそのままでOK。入力されていない場合は、受信可能なメールアドレスを入力。

#### 2. 「Send me a free license key」をクリック

#### 3. メール受信

数分以内に、n8nから以下のようなメールが届きます：

```
Subject: Your free n8n license key to unlock selected paid features

Your license key
bffe90f1-96ea-4e3c-b2d7-92ffc61dbbd4
```

> **注意**: ライセンスキーは14日以内に有効化する必要があります。

### チェックポイント

- [ ] メールアドレスを入力した
- [ ] 「Send me a free license key」をクリックした
- [ ] ライセンスキーのメールを受信した

---

## セクション8: ライセンスの有効化

### 有効化手順

#### 1. n8nの設定画面へ移動

画面左下の **Settings（設定）** アイコンをクリック

#### 2. Usage and Plan を選択

左側のメニューから「Usage and Plan」をクリック

#### 3. ライセンスキー入力

「Enter activation key」ボタンをクリック

![ライセンスキー入力画面](/n8n-setup/03-activation-key.png)

#### 4. ライセンスキーを貼り付け

メールで受信したライセンスキーを貼り付け：

```
bffe90f1-96ea-4e3c-b2d7-92ffc61dbbd4
```

#### 5. 「Activate」をクリック

### エラー対処

**「Activation key has already been used on this instance」** というエラーが出た場合：

これは **既に有効化済み** という意味です。問題ありません。

メールの「Activate License Key」ボタンをクリックした時点で自動的に有効化されている可能性があります。

### チェックポイント

- [ ] ライセンスキーを入力した
- [ ] 有効化が完了した（またはエラーで既に有効化済みと確認）
- [ ] 高度な機能が使える状態になった

---

## セクション9: 基本的な操作

### n8nの起動・停止・再起動

#### 起動

```bash
cd C:/n8n
docker-compose up -d
```

#### 停止

```bash
cd C:/n8n
docker-compose down
```

#### 再起動

```bash
cd C:/n8n
docker-compose restart
```

#### ログ確認

```bash
cd C:/n8n
docker-compose logs -f n8n
```

終了する場合は `Ctrl + C`

#### 状態確認

```bash
cd C:/n8n
docker-compose ps
```

### データの保存場所

ワークフロー、認証情報、実行履歴は以下に保存されます：

```
C:/n8n/n8n_data/
```

> **重要**: このフォルダをバックアップすれば、ワークフローを保護できます。

### ポート変更（オプション）

ポート5678が既に使われている場合、`docker-compose.yml`を編集：

```yaml
ports:
  - "8080:5678"  # 5678を8080など別のポートに変更
```

その場合のアクセスURL: `http://localhost:8080`

### チェックポイント

- [ ] n8nの起動・停止ができる
- [ ] ログを確認できる
- [ ] データ保存場所を理解している

---

## セクション10: README作成（オプション）

### 使い方メモの作成

後で見返せるように、`C:/n8n/README.md`を作成すると便利です：

```markdown
# n8n セットアップメモ

## アクセス方法
http://localhost:5678

## 起動
cd C:/n8n
docker-compose up -d

## 停止
docker-compose down

## ログ確認
docker-compose logs -f n8n

## データ保存場所
C:/n8n/n8n_data/

## ライセンスキー
bffe90f1-96ea-4e3c-b2d7-92ffc61dbbd4

## メモ
- ポート: 5678
- タイムゾーン: Asia/Tokyo
- 自動起動: 有効
```

---

## トラブルシューティング

### ポート5678が既に使用されている

**症状**: 起動時に「port is already allocated」エラー

**解決方法**: docker-compose.ymlのポートを変更（セクション9参照）

### Dockerイメージのダウンロードが遅い

**症状**: `docker-compose up -d`が長時間かかる

**解決方法**: インターネット接続を確認。初回は3-5分かかるのは正常。

### ブラウザで接続できない

**症状**: http://localhost:5678 にアクセスできない

**確認事項**:
1. `docker-compose ps`でコンテナが起動しているか
2. `STATUS`が`healthy`か
3. ファイアウォールで許可されているか

### データをリセットしたい

**手順**:
```bash
cd C:/n8n
docker-compose down
rm -rf n8n_data
docker-compose up -d
```

> **警告**: 全てのワークフローと設定が削除されます。

---

## まとめ

### このモジュールで学んだこと

- n8nをDockerで起動・停止できる
- ブラウザでn8nにアクセスできる
- 無料ライセンスで高度な機能が使える
- データがローカルに安全に保存される
- 完全無料で無制限に使える

### 次のステップ

1. **ワークフロー作成**: 「Create workflow」からワークフローを作成してみる
2. **テンプレート活用**: https://n8n.io/workflows/ で公開テンプレートを試す
3. **統合追加**: Gmail、Slack、Notionなど好きなサービスを連携
4. **自動化実践**: 日常業務の自動化を試す

---

## 参考資料

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [n8nコミュニティフォーラム](https://community.n8n.io/)
- [ワークフローテンプレート](https://n8n.io/workflows/)
- [Docker公式](https://www.docker.com/)

---

## よくある質問

**Q: n8nコンテナを再起動するとデータは消えますか？**
A: いいえ。`n8n_data`フォルダにデータが永続化されているため、コンテナを再起動してもワークフローや設定は保持されます。

**Q: 複数のn8nインスタンスを起動できますか？**
A: はい。docker-compose.ymlを別のディレクトリにコピーし、ポート番号を変更すれば複数起動できます。

**Q: Docker Desktopを起動していないとn8nにアクセスできませんか？**
A: はい。n8nはDockerコンテナで動作しているため、Docker Desktopが起動している必要があります。
