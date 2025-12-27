# n8nワークフロー構築

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- n8nからPython APIサーバーを呼び出す方法
- HTTP Requestノードの設定方法
- テスト投稿の実行と確認

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. n8nでHTTP Requestノードを設定できる
2. Python APIサーバーにリクエストを送信できる
3. Xへの投稿が成功することを確認できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: ワークフローの作成](#セクション1-ワークフローの作成)
- [セクション2: HTTP Requestノードの設定](#セクション2-http-requestノードの設定)
- [セクション3: テスト投稿の実行](#セクション3-テスト投稿の実行)
- [セクション4: スケジュール実行の設定](#セクション4-スケジュール実行の設定)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- n8n（Docker版）が起動している
- Python APIサーバーが起動している（Module 03で構築）

### APIサーバーの起動確認

Python APIサーバーが起動していることを確認してください。

```powershell
python C:\scripts\x_api_server.py
```

「X API Server starting on http://localhost:5000」と表示されていればOKです。

---

## セクション1: ワークフローの作成

### 1-1. 新規ワークフロー作成

1. n8nを開く（通常は http://localhost:5678）
2. 「Workflows」→「Add Workflow」をクリック
3. ワークフロー名を「X Auto Post」に変更

### 1-2. Manual Triggerの追加

1. キャンバスをクリックして「+」ボタンを表示
2. 「Manual Trigger」を検索して追加

Manual Triggerは手動実行のためのトリガーです。

### チェックポイント

- [ ] 新規ワークフロー「X Auto Post」を作成した
- [ ] Manual Triggerノードを追加した

---

## セクション2: HTTP Requestノードの設定

### 2-1. HTTP Requestノードの追加

1. Manual Triggerノードの「+」をクリック
2. 「HTTP Request」を検索して追加

HTTP Requestノードの設定画面：

![HTTP Request設定画面](/n8n-x-auto-post/images/n8n-http-request.png)

### 2-2. 基本設定

以下の設定を行います。

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/post` |

### URL設定の注意

n8nがDockerで動いている場合、`localhost`ではなく`host.docker.internal`を使用します。

| n8n環境 | URL |
|---------|-----|
| Docker版 | `http://host.docker.internal:5000/post` |
| ローカル版 | `http://localhost:5000/post` |

### 2-3. 認証設定

| 項目 | 設定値 |
|------|--------|
| **Authentication** | None |

Python APIサーバー側で認証を行っているため、n8n側では認証不要です。

### 2-4. Body設定

1. 「Send Body」を **ON** にする
2. 「Body Content Type」を **JSON** に設定
3. 「Specify Body」を **Using Fields Below** に設定

### 2-5. Body Parametersの追加

「Add Parameter」をクリックして以下を追加します。

| Name | Value |
|------|-------|
| `text` | `n8nからの自動投稿テスト！` |

### ワークフロー全体図

```
┌──────────────────┐      ┌──────────────────┐
│  Manual Trigger  │ ───→ │  HTTP Request    │
│                  │      │                  │
│                  │      │  POST            │
│                  │      │  /post           │
│                  │      │  {"text": "..."}│
└──────────────────┘      └──────────────────┘
```

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] Method: POSTを設定した
- [ ] URL: `http://host.docker.internal:5000/post`を設定した
- [ ] Body Parameters: textを設定した

---

## セクション3: テスト投稿の実行

### 3-1. ワークフローの実行

1. 画面下部の「Execute Workflow」ボタンをクリック
2. ワークフローが実行される

### 3-2. 実行結果の確認

成功すると、HTTP Requestノードの出力に以下のようなレスポンスが表示されます。

```json
{
  "success": true,
  "tweet_id": "1234567890123456789",
  "text": "n8nからの自動投稿テスト！"
}
```

### 3-3. Xで投稿を確認

Xアプリまたはブラウザで、投稿が表示されていることを確認します。

### チェックポイント

- [ ] ワークフローを実行した
- [ ] `success: true`が返ってきた
- [ ] Xで投稿が表示された

---

## セクション4: スケジュール実行の設定

定期的に自動投稿したい場合は、Manual TriggerをSchedule Triggerに変更します。

### 4-1. Schedule Triggerへの変更

1. Manual Triggerノードを削除
2. 「Schedule Trigger」を検索して追加
3. HTTP Requestノードに接続

### 4-2. スケジュール設定

2時間ごとに実行する場合の設定例：

| 項目 | 設定値 |
|------|--------|
| **Trigger Interval** | Hours |
| **Hours Between Triggers** | 2 |

### 4-3. ワークフローの有効化

1. 画面右上の「Active」トグルをONにする
2. ワークフローが有効化され、スケジュールに従って実行される

### 投稿内容の動的化

毎回同じ投稿だと重複エラーになるため、投稿内容を動的にする必要があります。

例: タイムスタンプを追加

```
自動投稿テスト {{ $now.format('yyyy-MM-dd HH:mm') }}
```

### チェックポイント

- [ ] Schedule Triggerを設定した（任意）
- [ ] ワークフローを有効化した（任意）

---

## トラブルシューティング

### ECONNREFUSED エラー

**原因**: Python APIサーバーが起動していない

**解決策**:
```powershell
python C:\scripts\x_api_server.py
```

### host.docker.internal が解決できない

**原因**: Docker Desktop のバージョンが古い、またはLinuxコンテナモードではない

**解決策**:
- Docker Desktopを最新版にアップデート
- または、ホストPCのIPアドレス（例: `192.168.0.x`）を直接指定

### 403 Forbidden エラー

**原因**: X Developer Portalの権限設定が「Read」のみ

**解決策**:
1. X Developer Portalで「Read and write」に変更
2. Access Tokenを再生成
3. Python APIサーバーのスクリプトを更新
4. サーバーを再起動

### duplicate tweet エラー

**原因**: 同じ内容のツイートを投稿しようとした

**解決策**:
- 投稿内容にタイムスタンプや変数を追加して重複を避ける

---

## まとめ

### このモジュールで学んだこと

- n8nからHTTP Requestノードを使ってAPIサーバーを呼び出す方法
- Docker環境でのURL設定（host.docker.internal）
- テスト投稿の実行と確認方法

### 構築したシステム

```
┌──────────────────────────────────────────────────────────┐
│                    完成したシステム                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐     HTTP      ┌──────────────────┐   │
│   │    n8n       │  ─────────→   │  Python API      │   │
│   │  (Docker)    │   Request     │  サーバー        │   │
│   │              │               │  (Flask+Tweepy)  │   │
│   │  Schedule    │               │                  │   │
│   │  Trigger     │               │  OAuth認証       │   │
│   └──────────────┘               └────────┬─────────┘   │
│                                           │              │
│                                           │ X API v2     │
│                                           ▼              │
│                                  ┌──────────────────┐   │
│                                  │    X (Twitter)   │   │
│                                  │    投稿完了！    │   │
│                                  └──────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 次のステップ

- Google Sheetsと連携して投稿内容を管理
- Instagram自動投稿との連携
- 投稿のスケジュール管理

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[x-auto-post-workflow.json](/n8n-x-auto-post/download/x-auto-post-workflow.json)

**インポート後に変更が必要な箇所**:

| 項目 | 変更内容 |
|------|---------|
| URL | 必要に応じてホスト名を変更 |
| text | 投稿内容を変更 |

---

## 参考資料

- [n8n HTTP Request ドキュメント](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [n8n Schedule Trigger ドキュメント](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/)

---

## よくある質問

**Q: Docker以外の環境でも使えますか？**
A: はい、URLを`http://localhost:5000/post`に変更すれば、ローカルインストール版n8nでも使用できます。

**Q: 画像付きツイートはできますか？**
A: 本講座ではテキスト投稿のみ扱います。画像投稿は別途Media Upload APIの設定が必要です。

**Q: 投稿が失敗した場合の通知は？**
A: n8nのError Workflowを設定することで、失敗時にSlackやメールで通知を受け取れます。

**Q: APIサーバーを常時起動しておく必要がありますか？**
A: はい、n8nからのリクエストを受け取るため、APIサーバーは常時起動している必要があります。Windowsのタスクスケジューラでスタートアップ時に自動起動させることを推奨します。

**Q: 複数のXアカウントで投稿できますか？**
A: はい、アカウントごとにAPIサーバーを別ポートで起動し、n8nのワークフローでそれぞれのエンドポイントを呼び出します。
