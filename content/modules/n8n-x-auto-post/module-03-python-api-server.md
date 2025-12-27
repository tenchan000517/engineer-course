# Python APIサーバー構築

**所要時間**: 25分
**難易度**: ⭐⭐⭐☆☆

このモジュールの最後に[スクリプトダウンロード](#スクリプトダウンロード)があります。

---

## このモジュールで学ぶこと

- Python環境の確認とライブラリインストール
- X投稿用APIサーバーの構築
- サーバーの起動とテスト

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. tweepyとflaskをインストールできる
2. X投稿用のAPIサーバーを起動できる
3. サーバーが正常に動作することを確認できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: Python環境の確認](#セクション1-python環境の確認)
- [セクション2: ライブラリのインストール](#セクション2-ライブラリのインストール)
- [セクション3: APIサーバースクリプトの作成](#セクション3-apiサーバースクリプトの作成)
- [セクション4: サーバーの起動とテスト](#セクション4-サーバーの起動とテスト)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [スクリプトダウンロード](#スクリプトダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Python 3.8以上
- pip（Pythonパッケージマネージャー）
- Module 02で取得した4つのAPIキー

### APIキーの確認

以下の4つのキーが手元にあることを確認してください。

| キー | 用途 |
|------|------|
| API Key | アプリ識別子 |
| API Secret | アプリ秘密鍵 |
| Access Token | ユーザートークン |
| Access Token Secret | ユーザー秘密鍵 |

---

## セクション1: Python環境の確認

### 1-1. Pythonバージョン確認

PowerShellを開いて以下を実行します。

```powershell
python --version
```

**期待される出力**:
```
Python 3.10.9
```

Python 3.8以上であればOKです。

### 1-2. pipバージョン確認

```powershell
pip --version
```

**期待される出力**:
```
pip 24.2 from C:\Users\...\pip (python 3.10)
```

### チェックポイント

- [ ] Python 3.8以上がインストールされている
- [ ] pipが使用できる

---

## セクション2: ライブラリのインストール

### 2-1. tweepyのインストール

tweepyはX API v2を簡単に使うためのライブラリです。

```powershell
pip install tweepy
```

**期待される出力**:
```
Successfully installed tweepy-4.16.0
```

### 2-2. flaskのインストール

flaskはAPIサーバーを作成するためのライブラリです。

```powershell
pip install flask
```

**期待される出力**:
```
Successfully installed flask-x.x.x
```

（既にインストール済みの場合は「Requirement already satisfied」と表示されます）

### 2-3. インストール確認

```powershell
pip show tweepy
```

```powershell
pip show flask
```

それぞれバージョン情報が表示されればOKです。

### チェックポイント

- [ ] tweepyがインストールされた
- [ ] flaskがインストールされた

---

## セクション3: APIサーバースクリプトの作成

### 3-1. スクリプト保存用フォルダの作成

任意の場所にフォルダを作成します（例: `C:\scripts`）。

```powershell
mkdir C:\scripts
```

### 3-2. スクリプトファイルの作成

以下の内容で `C:\scripts\x_api_server.py` を作成します。

```python
from flask import Flask, request, jsonify
import tweepy

app = Flask(__name__)

# ====== 認証情報を入力 ======
API_KEY = "YOUR_API_KEY"
API_SECRET = "YOUR_API_SECRET"
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"
ACCESS_TOKEN_SECRET = "YOUR_ACCESS_TOKEN_SECRET"
# ============================

# Twitterクライアント
client = tweepy.Client(
    consumer_key=API_KEY,
    consumer_secret=API_SECRET,
    access_token=ACCESS_TOKEN,
    access_token_secret=ACCESS_TOKEN_SECRET
)

@app.route('/post', methods=['POST'])
def post_tweet():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'text is required'}), 400

        response = client.create_tweet(text=text)
        tweet_id = response.data['id']

        return jsonify({
            'success': True,
            'tweet_id': tweet_id,
            'text': text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("X API Server starting on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000)
```

### 3-3. 認証情報の入力

スクリプト内の以下の部分を、Module 02で取得したAPIキーに置き換えます。

```python
API_KEY = "YOUR_API_KEY"           # ← あなたのAPI Keyに置き換え
API_SECRET = "YOUR_API_SECRET"     # ← あなたのAPI Secretに置き換え
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN" # ← あなたのAccess Tokenに置き換え
ACCESS_TOKEN_SECRET = "YOUR_ACCESS_TOKEN_SECRET"  # ← あなたのAccess Token Secretに置き換え
```

### 重要な注意事項

- **APIキーを含むスクリプトは絶対にGitHubなどに公開しないでください**
- 本番環境では環境変数を使用することを推奨します

### チェックポイント

- [ ] スクリプトファイルを作成した
- [ ] 4つのAPIキーを入力した

---

## セクション4: サーバーの起動とテスト

### 4-1. サーバーの起動

PowerShellで以下を実行します。

```powershell
python C:\scripts\x_api_server.py
```

**期待される出力**:
```
X API Server starting on http://localhost:5000
 * Serving Flask app 'x_api_server'
 * Debug mode: off
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
Press CTRL+C to quit
```

### 4-2. ヘルスチェック

**別のPowerShellウィンドウ**を開いて、以下を実行します。

```powershell
curl http://localhost:5000/health
```

**期待される出力**:
```json
{"status":"ok"}
```

### 4-3. テスト投稿（任意）

curlでテスト投稿ができます。

```powershell
curl -X POST http://localhost:5000/post -H "Content-Type: application/json" -d "{\"text\":\"APIサーバーからのテスト投稿\"}"
```

**期待される出力**:
```json
{"success":true,"tweet_id":"123456789...","text":"APIサーバーからのテスト投稿"}
```

### 4-4. サーバーの停止

サーバーを停止するには、PowerShellで **Ctrl+C** を押します。

### チェックポイント

- [ ] サーバーが起動した
- [ ] ヘルスチェックで `{"status":"ok"}` が返ってきた

---

## トラブルシューティング

### ModuleNotFoundError: No module named 'tweepy'

**原因**: tweepyがインストールされていない

**解決策**:
```powershell
pip install tweepy
```

### 403 Forbidden エラー

**原因**: App permissionsが「Read」のみになっている

**解決策**:
1. X Developer Portalで「Read and write」に変更
2. Access Tokenを再生成
3. スクリプト内のトークンを更新
4. サーバーを再起動

### Address already in use

**原因**: ポート5000が既に使用されている

**解決策**:
```python
app.run(host='0.0.0.0', port=5001)  # ポート番号を変更
```

---

## まとめ

### このモジュールで学んだこと

- tweepyとflaskのインストール方法
- X投稿用APIサーバーの構築方法
- サーバーの起動とテスト方法

### APIエンドポイント

| エンドポイント | メソッド | 用途 |
|---------------|----------|------|
| `/health` | GET | サーバー状態確認 |
| `/post` | POST | ツイート投稿 |

### 次のステップ

Module 04では、n8nからこのAPIサーバーを呼び出すワークフローを構築します。

---

## スクリプトダウンロード

以下のスクリプトをダウンロードして使用できます。

[x_api_server.py](/n8n-x-auto-post/download/x_api_server.py)

**ダウンロード後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|-----------------|---------|
| `YOUR_API_KEY` | あなたのAPI Key |
| `YOUR_API_SECRET` | あなたのAPI Secret |
| `YOUR_ACCESS_TOKEN` | あなたのAccess Token |
| `YOUR_ACCESS_TOKEN_SECRET` | あなたのAccess Token Secret |

---

## 参考資料

- [tweepy ドキュメント](https://docs.tweepy.org/)
- [Flask ドキュメント](https://flask.palletsprojects.com/)
- [X API v2 Tweet作成](https://developer.x.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets)

---

## よくある質問

**Q: サーバーをバックグラウンドで実行できますか？**
A: Windowsの場合、タスクスケジューラでスタートアップ時に実行するか、`pythonw`コマンドを使用します。

**Q: ポート番号を変更できますか？**
A: はい、スクリプト内の `app.run(host='0.0.0.0', port=5000)` のポート番号を変更してください。

**Q: 複数のアカウントで投稿したい場合は？**
A: 別のポートで別のAPIサーバーを起動し、それぞれに異なるAPIキーを設定します。

**Q: 環境変数でAPIキーを管理できますか？**
A: はい、`os.environ.get('API_KEY')` を使用して環境変数から読み込むことを推奨します。

**Q: サーバーが落ちたらどうなりますか？**
A: n8nからのリクエストがエラーになります。本番運用ではsupervisordなどでプロセス監視することを推奨します。
