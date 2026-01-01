---
title: "X自動投稿システム構成ガイド"
description: "1日12投稿を完全自動化するシステムの作り方"
---

# X自動投稿システム構成ガイド

X、まだ手動で投稿してますか？
1日12投稿を完全自動化する方法を解説します。

---

## システム構成図

```
┌─────────────────┐
│ スプレッドシート  │ 投稿内容を管理
│ (Google Sheets) │
└────────┬────────┘
         │ データ取得
         ↓
┌─────────────────┐
│      n8n       │ ワークフロー自動化
│ (セルフホスト)   │
└────────┬────────┘
         │ HTTP Request
         ↓
┌─────────────────┐
│  Python Flask  │ API認証処理
│   APIサーバー   │
└────────┬────────┘
         │ Tweepy
         ↓
┌─────────────────┐
│    X API v2    │ 投稿実行
│   (公式API)     │
└─────────────────┘
```

---

## なぜこの構成なのか

### X公式API vs 非公式方法

| 項目 | 公式API | ブラウザ自動操作 |
|------|--------|-----------------|
| 安全性 | ○ 公式認定 | × BANリスク |
| 安定性 | ○ DOM変更の影響なし | × アプデで壊れる |
| 規約 | ○ 準拠 | × 違反 |
| 制限 | Free: 17回/24時間 | なし（リスクあり） |

**結論**: 公式APIを使う

### Free tierの制限

- **17回/24時間**（月500回程度）
- **2時間ごと1投稿なら12回/日で十分**

---

## 必要なもの

| 項目 | 費用 | 備考 |
|------|------|------|
| n8n | 無料 | セルフホスト版 |
| Python環境 | 無料 | ローカルまたはVPS |
| X開発者アカウント | 無料 | developer.twitter.com |
| Google Sheets | 無料 | データ管理用 |

---

## ステップ1: X開発者アカウント取得

1. developer.twitter.com にアクセス
2. 「Developer Portal」に登録
3. 「Free」プランを選択
4. アプリを作成
5. 以下のキーを取得:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret

---

## ステップ2: スプレッドシート設計

| 列 | 内容 | 例 |
|----|------|-----|
| A | post_id | POST-001 |
| B | content | 投稿本文 |
| C | scheduled_date | 2025-01-15 |
| D | scheduled_time | 10:00 |
| E | status | DRAFT / SCHEDULED / POSTED |
| F | posted_at | 投稿完了日時 |
| G | tweet_id | 投稿後のID |

---

## ステップ3: Python APIサーバー

**必要なライブラリ**:
```bash
pip install flask tweepy python-dotenv
```

**基本構造**:
```python
from flask import Flask, request, jsonify
import tweepy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# 認証設定
client = tweepy.Client(
    consumer_key=os.getenv("API_KEY"),
    consumer_secret=os.getenv("API_SECRET"),
    access_token=os.getenv("ACCESS_TOKEN"),
    access_token_secret=os.getenv("ACCESS_TOKEN_SECRET")
)

@app.route("/post", methods=["POST"])
def post_tweet():
    data = request.json
    text = data.get("text")

    try:
        response = client.create_tweet(text=text)
        return jsonify({
            "success": True,
            "tweet_id": response.data["id"]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

---

## ステップ4: n8nワークフロー

### 基本フロー
```
Cron Trigger (2時間ごと)
     ↓
Google Sheets (次の投稿を取得)
     ↓
IF (投稿があるか)
     ↓
HTTP Request (Python APIを呼び出し)
     ↓
Google Sheets (ステータス更新)
```

### Cron設定例
- **2時間ごと**: `0 */2 * * *`
- **毎日10時**: `0 10 * * *`

---

## ステップ5: スレッド投稿

連続ツイートの場合:

```python
@app.route("/thread", methods=["POST"])
def post_thread():
    data = request.json
    tweets = data.get("tweets")  # リスト

    previous_id = None
    results = []

    for tweet_text in tweets:
        response = client.create_tweet(
            text=tweet_text,
            in_reply_to_tweet_id=previous_id
        )
        previous_id = response.data["id"]
        results.append(previous_id)

    return jsonify({
        "success": True,
        "tweet_ids": results
    })
```

---

## 運用のコツ

### 投稿タイミング
| 時間帯 | 特徴 |
|--------|------|
| 7-9時 | 通勤時間、高反応 |
| 12-13時 | 昼休み、高反応 |
| 18-20時 | 帰宅時間、高反応 |
| 22-24時 | 就寝前、まあまあ |

### 投稿内容のルール
- 280文字以内（日本語は140文字）
- ハッシュタグは2-3個まで
- リンクは1つまで

---

## トラブルシューティング

| 問題 | 原因 | 対策 |
|------|------|------|
| 403エラー | 権限不足 | アプリ設定でRead and Write権限を付与 |
| 429エラー | レート制限 | 2時間待つ or 間隔を広げる |
| 認証エラー | トークン期限切れ | Access Tokenを再生成 |

---

## セキュリティ注意点

- APIキーは`.env`ファイルで管理
- `.env`は`.gitignore`に追加
- 本番環境ではHTTPS必須

---

**この特典を活用して、X投稿を自動化してください！**
