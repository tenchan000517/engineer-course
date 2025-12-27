# スレッド投稿（ツリー投稿）

**所要時間**: 15分
**難易度**: ⭐⭐⭐☆☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- X APIのスレッド投稿の仕組み
- Python APIサーバーへのスレッドエンドポイント追加
- n8nからスレッド投稿を実行する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. X APIの `in_reply_to_tweet_id` パラメータを理解できる
2. 複数ツイートを連結したスレッドを自動投稿できる
3. n8nでJSONボディを直接指定できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: スレッド投稿の仕組み](#セクション1-スレッド投稿の仕組み)
- [セクション2: Python APIサーバーの更新](#セクション2-python-apiサーバーの更新)
- [セクション3: n8nワークフローの作成](#セクション3-n8nワークフローの作成)
- [セクション4: テスト投稿の実行](#セクション4-テスト投稿の実行)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01〜04が完了していること
- Python APIサーバーが起動可能な状態
- n8n（Docker版）が起動している

### 前提知識

- Module 04で学んだHTTP Requestノードの基本設定

---

## セクション1: スレッド投稿の仕組み

### 1-1. スレッドとは

Xのスレッド（ツリー投稿）は、複数のツイートを連結して表示する機能です。長文を分割して投稿したり、ストーリー形式で情報を伝えるのに使用します。

### 1-2. 技術的な仕組み

スレッドは「返信」の連鎖で実現されています。

```
1. 最初のツイートを投稿 → tweet_id を取得
2. 2番目のツイートを投稿（in_reply_to_tweet_id = 1のID）
3. 3番目のツイートを投稿（in_reply_to_tweet_id = 2のID）
   ...以下繰り返し
```

### 1-3. tweepyでの実装

tweepyの`create_tweet()`メソッドには`in_reply_to_tweet_id`パラメータがあります。

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `text` | str | ツイート本文 |
| `in_reply_to_tweet_id` | int/str | 返信先のツイートID |

このパラメータを使って、前のツイートに返信する形でスレッドを構築します。

### チェックポイント

- [ ] スレッドが「返信の連鎖」で実現されることを理解した
- [ ] `in_reply_to_tweet_id`パラメータの役割を理解した

---

## セクション2: Python APIサーバーの更新

### 2-1. スレッドエンドポイントの追加

既存のPython APIサーバーに `/thread` エンドポイントを追加します。

サーバー起動時の表示（更新後）:

![サーバー起動画面](/n8n-x-auto-post/images/server-v2-startup.png)

### 2-2. 更新されたコード

`x_api_server_v2.py` として新しいファイルを作成します。主な変更点は `/thread` エンドポイントの追加です。

```python
@app.route('/thread', methods=['POST'])
def post_thread():
    try:
        data = request.get_json()
        tweets = data.get('tweets', [])

        if not tweets or len(tweets) == 0:
            return jsonify({'error': 'tweets array is required'}), 400

        results = []
        previous_tweet_id = None

        for i, tweet_text in enumerate(tweets):
            if previous_tweet_id:
                # 2番目以降: 前のツイートに返信
                response = client.create_tweet(
                    text=tweet_text,
                    in_reply_to_tweet_id=previous_tweet_id
                )
            else:
                # 最初のツイート
                response = client.create_tweet(text=tweet_text)

            tweet_id = response.data['id']
            previous_tweet_id = tweet_id
            results.append({
                'index': i + 1,
                'tweet_id': tweet_id,
                'text': tweet_text
            })

        return jsonify({
            'success': True,
            'thread_count': len(results),
            'tweets': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 2-3. エンドポイント一覧

| エンドポイント | メソッド | 用途 |
|---------------|----------|------|
| `/post` | POST | 単一ツイート投稿 |
| `/thread` | POST | スレッド投稿（新規） |
| `/health` | GET | ヘルスチェック |

### 2-4. サーバーの起動

更新したスクリプトを起動します。

```powershell
python C:\engineer-course\scripts\x_api_server_v2.py
```

### チェックポイント

- [ ] `x_api_server_v2.py`を作成した
- [ ] サーバーを起動して `/thread` エンドポイントが表示された

---

## セクション3: n8nワークフローの作成

### 3-1. 新規ワークフロー作成

1. n8nを開く
2. 「Add Workflow」をクリック
3. ワークフロー名を「X Thread Post」に変更

### 3-2. Manual Triggerの追加

1. 「+」ボタンをクリック
2. 「Manual Trigger」を検索して追加

### 3-3. HTTP Requestノードの追加

1. Manual Triggerの「+」をクリック
2. 「HTTP Request」を検索して追加

### 3-4. HTTP Request設定

以下の設定を行います。

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/thread` |
| **Authentication** | None |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON |

### 3-5. JSONボディの入力

「Specify Body」を「Using JSON」に変更すると、JSONを直接入力できるエディタが表示されます。

以下のJSONを入力します。

```json
{
  "tweets": [
    "【1/3】n8nとPythonでX自動投稿システムを構築中。スレッド投稿のテスト。",
    "【2/3】tweepyのin_reply_to_tweet_idで連続ツイートをスレッド形式に。",
    "【3/3】これで自動スレッド投稿完成！"
  ]
}
```

設定完了後の画面：

![HTTP Request設定](/n8n-x-auto-post/images/n8n-thread-success.png)

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] URLを `/thread` に設定した
- [ ] 「Specify Body」を「Using JSON」に変更した
- [ ] tweetsの配列を入力した

---

## セクション4: テスト投稿の実行

### 4-1. ワークフローの実行

1. 「Execute step」ボタンをクリック
2. 実行結果を確認

### 4-2. 成功時のレスポンス

成功すると、以下のようなレスポンスが返ります。

```json
{
  "success": true,
  "thread_count": 3,
  "tweets": [
    {
      "index": 1,
      "tweet_id": "2004761156846768383",
      "text": "【1/3】n8nとPythonでX自動投稿システムを構築中。スレッド投稿のテスト。"
    },
    {
      "index": 2,
      "tweet_id": "2004761158058959207",
      "text": "【2/3】tweepyのin_reply_to_tweet_idで連続ツイートをスレッド形式に。"
    },
    {
      "index": 3,
      "tweet_id": "2004761159124258951",
      "text": "【3/3】これで自動スレッド投稿完成！"
    }
  ]
}
```

### 4-3. Xでの確認

Xを開いて、スレッドが正しく投稿されていることを確認します。

X上でのスレッド表示：

![X上のスレッド表示](/n8n-x-auto-post/images/x-thread-result.png)

3つのツイートが連結されてスレッド形式で表示されています。

### チェックポイント

- [ ] ワークフローを実行した
- [ ] `success: true` と `thread_count: 3` が返ってきた
- [ ] Xでスレッドが連結表示されている

---

## トラブルシューティング

### tweets配列が空エラー

**エラーメッセージ**: `tweets array is required`

**原因**: JSONの形式が正しくない、または `tweets` キーがない

**解決策**:
- JSONの構文を確認（カンマ、ブラケットの位置）
- `tweets` キーが正しく記述されているか確認

### スレッドが連結されない

**原因**: `in_reply_to_tweet_id` が正しく設定されていない

**解決策**:
- Python APIサーバーのコードを確認
- サーバーを再起動

### API制限エラー

**原因**: Free tierの投稿制限（17回/24時間）を超過

**解決策**:
- 24時間待つ
- スレッドの投稿数は各ツイートがカウントされることに注意（3ツイートのスレッド = 3回消費）

---

## まとめ

### このモジュールで学んだこと

- スレッドは `in_reply_to_tweet_id` を使った返信の連鎖で実現される
- Python APIサーバーに `/thread` エンドポイントを追加する方法
- n8nでJSONを直接指定してAPIを呼び出す方法

### 次のステップ

- Google Sheetsからスレッド内容を取得して投稿
- 投稿テンプレートの活用
- 画像付きスレッドの投稿

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[x-thread-post-workflow.json](/n8n-x-auto-post/download/x-thread-post-workflow.json)

**インポート後に変更が必要な箇所**:

| 項目 | 変更内容 |
|------|---------|
| URL | 必要に応じてホスト名を変更 |
| tweets | 投稿内容を変更 |

また、Python APIサーバーも更新版が必要です。

[x_api_server_v2.py](/n8n-x-auto-post/download/x_api_server_v2.py)

**APIサーバーの設定**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_API_KEY` | X Developer PortalのAPI Key |
| `YOUR_API_SECRET` | X Developer PortalのAPI Secret |
| `YOUR_ACCESS_TOKEN` | X Developer PortalのAccess Token |
| `YOUR_ACCESS_TOKEN_SECRET` | X Developer PortalのAccess Token Secret |

---

## 参考資料

- [Tweepy Client Documentation](https://docs.tweepy.org/en/stable/client.html)
- [X API - Conversation ID](https://developer.twitter.com/en/docs/twitter-api/conversation-id)
- [n8n HTTP Request Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)

---

## よくある質問

**Q: スレッドは何ツイートまで投稿できますか？**
A: X API側に明確な制限はありませんが、Free tierの投稿制限（17回/24時間）に注意してください。10ツイートのスレッドを投稿すると、残り7回しか投稿できません。

**Q: スレッドの途中で失敗した場合はどうなりますか？**
A: 途中まで投稿されたツイートは残り、不完全なスレッドになります。現在のコードではエラー時のロールバック機能はありません。

**Q: 既存のツイートに返信してスレッドを追加できますか？**
A: はい、最初のツイートの `in_reply_to_tweet_id` に既存ツイートのIDを指定すれば、そのツイートへの返信としてスレッドを開始できます。

**Q: スレッドの各ツイートに画像を付けられますか？**
A: 本講座ではテキストのみ扱っています。画像付きスレッドはMedia Upload APIの追加実装が必要です。

**Q: 投稿の型（テンプレート）を使いたい場合は？**
A: Google Sheetsにテンプレートを保存し、n8nでシートからデータを取得して `tweets` 配列を動的に生成する方法があります。これは応用編で扱う予定です。
