# AI音声生成の基本セットアップ

**所要時間**: 30-40分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- n8n DockerにffmpegをインストールしてAI音声と動画を合成できる環境を構築する
- Fish Audio APIを使ってテキストから音声を生成する方法
- n8nでFish Audio APIに接続するためのCredential設定

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- n8n Docker環境でffmpegコマンドを実行できる
- Fish AudioのAPIキーとVoice IDを取得できる
- n8nからFish Audio APIを呼び出して音声ファイルを生成できる

---

## 目次

- [セクション1: ffmpegのインストール](#セクション1-ffmpegのインストール)
- [セクション2: Fish Audioアカウントの作成](#セクション2-fish-audioアカウントの作成)
- [セクション3: APIキーの取得](#セクション3-apiキーの取得)
- [セクション4: Voice IDの取得](#セクション4-voice-idの取得)
- [セクション5: n8nでCredential設定](#セクション5-n8nでcredential設定)
- [セクション6: 音声生成テスト](#セクション6-音声生成テスト)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- n8n基礎講座（Module 01-11）を完了していること
- Docker Desktopが起動していること
- Fish Audioアカウント（無料で作成可能）

### 前提知識

- n8nの基本操作（ワークフロー作成、ノード追加）
- HTTP Requestノードの使い方

---

## セクション1: ffmpegのインストール

### なぜffmpegが必要か

AI音声を生成した後、その音声を動画に合成する必要があります。ffmpegは動画・音声処理の定番ツールで、以下のことができます：

- 動画と音声の合成
- 音声の配置タイミング調整（前半・後半など）
- 動画形式の変換

### 現在の状態確認

まず、n8nコンテナにffmpegが入っているか確認します。

PowerShell（またはコマンドプロンプト）を開いて実行：

```bash
docker exec n8n ffmpeg -version
```

**ffmpegが入っていない場合**の出力例：
```
OCI runtime exec failed: exec failed: unable to start container process: exec: "ffmpeg": executable file not found in $PATH
```

**ffmpegが入っている場合**の出力例：
```
ffmpeg version 6.1.2 Copyright (c) 2000-2024 the FFmpeg developers
```

既に入っている場合はセクション2へ進んでください。

### Dockerfileの作成

`C:/n8n/Dockerfile` を以下の内容で新規作成します：

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN apk add --no-cache ffmpeg
USER node
```

**解説**：
- `FROM n8nio/n8n:latest` - 公式n8nイメージをベースにする
- `USER root` - インストールのためroot権限に切り替え
- `RUN apk add --no-cache ffmpeg` - ffmpegをインストール
- `USER node` - セキュリティのためnodeユーザーに戻す

### docker-compose.ymlの修正

`C:/n8n/docker-compose.yml` を編集します。

**変更前**：
```yaml
services:
  n8n:
    image: n8nio/n8n:latest
```

**変更後**：
```yaml
services:
  n8n:
    build: .
    # image: n8nio/n8n:latest  # ffmpeg追加のためカスタムビルドに変更
```

### 再ビルドと起動

PowerShellで以下を実行：

```bash
cd C:/n8n
docker-compose down
docker-compose build
docker-compose up -d
```

ビルドには1-2分かかります。

![Dockerビルド成功](/n8n-advanced/01-docker-build.png)

### ffmpegの確認

```bash
docker exec n8n ffmpeg -version
```

以下のような出力が表示されればOK：

```
ffmpeg version 6.1.2 Copyright (c) 2000-2024 the FFmpeg developers
built with gcc 14.2.0 (Alpine 14.2.0)
```

![ffmpeg確認](/n8n-advanced/02-ffmpeg-version.png)

### チェックポイント

- [ ] Dockerfileを作成した
- [ ] docker-compose.ymlを修正した
- [ ] `docker-compose build` が成功した
- [ ] `docker exec n8n ffmpeg -version` でバージョンが表示される

---

## セクション2: Fish Audioアカウントの作成

### Fish Audioとは

Fish Audioは高品質なAI音声生成サービスです。

**特徴**：
- 日本語を含む多言語対応
- ネイティブレベルの自然な音声
- 無料枠：月1時間の音声生成
- 低遅延（約150ms）

### アカウント作成

1. [Fish Audio](https://fish.audio/ja/) にアクセス
2. 右上の「ログイン」をクリック
3. Google または GitHub でログイン（またはメールで新規作成）

![Fish Audioログイン画面](/n8n-advanced/03-fish-login.png)

### チェックポイント

- [ ] Fish Audioにログインできた

---

## セクション3: APIキーの取得

### 開発者ダッシュボードへ移動

1. ログイン後、左メニューの「**使用**」または「**音声生成履歴**」をクリック
2. 上部の「**開発者**」タブをクリック
3. 「**APIキー**」タブを選択

![開発者ダッシュボード](/n8n-advanced/04-developer-dashboard.png)

### APIキーの作成

1. 「**新規シクレットキーを作成します**」をクリック
2. 表示されたAPIキーを**必ずコピーして安全な場所に保存**

![APIキー画面](/n8n-advanced/05-api-key.png)

**重要**: APIキーは一度しか表示されません。必ずコピーしてください。

### チェックポイント

- [ ] APIキーを作成した
- [ ] APIキーを安全な場所に保存した

---

## セクション4: Voice IDの取得

### 音声モデルの選択

1. 左メニューの「**発見**」をクリック
2. 言語フィルターで「**日本語**」を選択
3. 好みの音声をクリック

![音声一覧](/n8n-advanced/06-voice-list.png)

### おすすめの音声

| 音声名 | 特徴 | 用途 |
|--------|------|------|
| 元気な女性 | 明るく元気な声 | エンタメ系コンテンツ |
| まな | 落ち着いた女性の声 | 解説系コンテンツ |
| ほしVer3.0 | 自然な男性の声 | ビジネス系コンテンツ |

### Voice IDのコピー

1. 音声の詳細ページを開く
2. 右側のメニューから「**モデルIDをコピー**」をクリック

![Voice IDコピー](/n8n-advanced/07-voice-id.png)

**例**: `b756350f646543bdb0b7e8df76bae3fd`（元気な女性）

### チェックポイント

- [ ] 使用する音声を選んだ
- [ ] Voice IDをコピーした

---

## セクション5: n8nでCredential設定

### Header Auth Credentialの作成

1. n8n（http://localhost:5678）を開く
2. 左メニュー → **Credentials**
3. **Add Credential** をクリック
4. 検索で「**Header Auth**」を選択

![Credential検索](/n8n-advanced/08-credential-search.png)

### Credential設定

以下を入力：

| フィールド | 値 |
|-----------|-----|
| **Credential名**（左上） | Fish Audio API |
| **Name** | Authorization |
| **Value** | Bearer あなたのAPIキー |

**重要**: Valueの先頭に `Bearer ` （スペース含む）を付けてください。

![Credential設定](/n8n-advanced/09-credential-config.png)

**Save** をクリックして保存。

### チェックポイント

- [ ] Header Auth Credentialを作成した
- [ ] Name に「Authorization」を入力した
- [ ] Value に「Bearer APIキー」を入力した
- [ ] 保存した

---

## セクション6: 音声生成テスト

### テスト用ワークフローの作成

1. n8nで新規ワークフローを作成
2. ワークフロー名：「**Fish Audio テスト**」

### Manual Triggerの追加

1. 「+」をクリック → 「**Manual Trigger**」を選択

### HTTP Requestノードの追加

1. 「+」をクリック → 「**HTTP Request**」を選択
2. 以下を設定：

| 項目 | 値 |
|------|-----|
| **Method** | POST |
| **URL** | `https://api.fish.audio/v1/tts` |
| **Authentication** | Generic Credential Type |
| **Generic Auth Type** | Header Auth |
| **Header Auth** | Fish Audio API |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON |

**JSON Body**：
```json
{
  "text": "こんにちは、テストです。",
  "reference_id": "b756350f646543bdb0b7e8df76bae3fd",
  "format": "mp3"
}
```

`reference_id` は取得したVoice IDに置き換えてください。

![HTTP Request設定](/n8n-advanced/10-test-success.png)

### テスト実行

1. 「**Execute step**」または「**Test workflow**」をクリック
2. 右側のOUTPUTパネルに結果が表示される

**成功時の出力**：
```
data
File Name: tts
File Extension: mpga
Mime Type: audio/mpeg
File Size: 24.2 kB
```

![テスト成功](/n8n-advanced/10-test-success.png)

「**View**」ボタンをクリックすると音声を再生できます。

### チェックポイント

- [ ] ワークフローを作成した
- [ ] HTTP Requestノードを設定した
- [ ] テスト実行で音声が生成された
- [ ] 音声を再生して確認した

---

## トラブルシューティング

### docker-compose build でエラー

**症状**: `failed to solve: n8nio/n8n:latest: failed to resolve source metadata`

**解決方法**: Docker Desktopが起動しているか確認。起動していなければ起動する。

### ffmpegが見つからない

**症状**: `executable file not found in $PATH`

**解決方法**:
1. Dockerfileが `C:/n8n/Dockerfile` に存在するか確認
2. docker-compose.yml で `build: .` が設定されているか確認
3. `docker-compose build` を再実行

### Fish Audio API 401エラー

**症状**: `Unauthorized` または `401` エラー

**解決方法**:
1. APIキーが正しいか確認
2. Valueの形式を確認：`Bearer ` + APIキー（スペース必須）
3. APIキーを再生成して試す

### Fish Audio API 400エラー

**症状**: `Bad Request` または `400` エラー

**解決方法**:
1. JSONの形式が正しいか確認
2. `reference_id`（Voice ID）が正しいか確認
3. `text` が空でないか確認

---

## まとめ

### このモジュールで学んだこと

- n8n DockerにffmpegをインストールしてAI音声と動画を合成できる環境を構築した
- Fish AudioのAPIキーとVoice IDを取得した
- n8nからFish Audio APIを呼び出して音声ファイルを生成できるようになった

### 次のステップ

次のモジュールでは、シートからナレーションテキストを取得して音声を自動生成し、Google Driveにアップロードするワークフローを構築します。

---

## 参考資料

- [Fish Audio 公式サイト](https://fish.audio/ja/)
- [Fish Audio API ドキュメント](https://docs.fish.audio/)
- [Fish Audio 料金プラン](https://fish.audio/plan/)
- [n8n-docker-ffmpeg（GitHub）](https://github.com/yigitkonur/n8n-docker-ffmpeg)

---

## よくある質問

**Q: Fish Audioの無料枠はどれくらいですか？**
A: 月1時間の音声生成が無料です。1分あたり約600-625クレジット消費します。

**Q: Voice IDは変更できますか？**
A: はい。「発見」ページから別の音声を選んでVoice IDを取得し、ワークフローのJSONを更新すれば変更できます。

**Q: 自分の声でカスタムボイスを作れますか？**
A: はい。Fish Audioの「ボイスクローン」機能で、自分の音声をアップロードしてカスタムボイスを作成できます。

**Q: ffmpegを追加するとn8nのアップデートに影響しますか？**
A: Dockerfileで `FROM n8nio/n8n:latest` を指定しているため、`docker-compose build` を再実行すれば最新版のn8nにffmpegが追加された状態で更新されます。

**Q: 日本語以外の音声も使えますか？**
A: はい。Fish Audioは英語、中国語、韓国語、フランス語、ドイツ語など多言語に対応しています。「発見」ページで言語フィルターを変更して探せます。
