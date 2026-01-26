---
title: "Threads自動投稿スクリプトの実装"
order: 2
duration: "60分"
difficulty: "⭐⭐⭐☆☆"
status: "draft"
---

# Threads自動投稿スクリプトの実装

**所要時間**: 60分
**難易度**: ⭐⭐⭐☆☆
**ステータス**: 暫定版（実証後に更新予定）

---

## このモジュールで学ぶこと

- Pythonを使ったThreads API接続
- テキスト投稿の自動化
- スプレッドシート連携による投稿管理
- X・Instagramとの同時投稿

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- PythonでThreads APIに接続できる
- CSVファイルから投稿内容を読み込んで自動投稿できる
- 複数SNSへの同時投稿スクリプトを作成できる

---

## 目次

- [セクション1: 投稿の仕組み](#セクション1-投稿の仕組み)
- [セクション2: 基本的な投稿スクリプト](#セクション2-基本的な投稿スクリプト)
- [セクション3: スプレッドシート連携](#セクション3-スプレッドシート連携)
- [セクション4: マルチプラットフォーム投稿](#セクション4-マルチプラットフォーム投稿)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)

---

## 事前準備

### 必要なもの

- Module 01で取得したアクセストークン
- Python 3.x
- 必要ライブラリ: `requests`

### インストール

```bash
pip install requests
```

---

## セクション1: 投稿の仕組み

### Threads投稿の2ステップ

Threads APIでは、投稿は2段階で行います：

```
Step 1: メディアコンテナを作成（投稿の下書き）
        ↓
Step 2: メディアコンテナを公開（実際に投稿）
```

### APIエンドポイント

| 操作 | エンドポイント | メソッド |
|------|---------------|----------|
| コンテナ作成 | `/me/threads` | POST |
| 投稿公開 | `/me/threads_publish` | POST |
| ユーザー情報取得 | `/me` | GET |

### チェックポイント

- [ ] 2ステップ投稿の仕組みを理解した
- [ ] APIエンドポイントを把握した

---

## セクション2: 基本的な投稿スクリプト

### シンプルな投稿スクリプト

```python
# threads_post.py
# 実証後にコードを確定予定

import requests

# 設定
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"
USER_ID = "YOUR_USER_ID"  # 後述の方法で取得
BASE_URL = "https://graph.threads.net/v1.0"

def get_user_id():
    """ユーザーIDを取得"""
    url = f"{BASE_URL}/me"
    params = {"access_token": ACCESS_TOKEN}
    response = requests.get(url, params=params)
    return response.json().get("id")

def create_container(text):
    """メディアコンテナを作成"""
    url = f"{BASE_URL}/{USER_ID}/threads"
    params = {
        "media_type": "TEXT",
        "text": text,
        "access_token": ACCESS_TOKEN
    }
    response = requests.post(url, params=params)
    return response.json().get("id")

def publish_container(container_id):
    """コンテナを公開"""
    url = f"{BASE_URL}/{USER_ID}/threads_publish"
    params = {
        "creation_id": container_id,
        "access_token": ACCESS_TOKEN
    }
    response = requests.post(url, params=params)
    return response.json()

def post_to_threads(text):
    """Threadsに投稿"""
    container_id = create_container(text)
    result = publish_container(container_id)
    return result

# 使用例
if __name__ == "__main__":
    result = post_to_threads("テスト投稿です")
    print(result)
```

### 動作確認

```bash
python threads_post.py
```

（実証後に動作確認結果を追加）

### チェックポイント

- [ ] スクリプトを作成した
- [ ] テスト投稿が成功した

---

## セクション3: スプレッドシート連携

### CSVファイルからの投稿

```python
# threads_csv_post.py
# 実証後にコードを確定予定

import csv
import time
import random
from threads_post import post_to_threads

def load_posts_from_csv(filepath):
    """CSVファイルから投稿内容を読み込み"""
    posts = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            posts.append(row['content'])
    return posts

def post_with_interval(posts, min_interval=60, max_interval=180):
    """ランダムな間隔で投稿"""
    for i, post in enumerate(posts):
        print(f"投稿 {i+1}/{len(posts)}: {post[:30]}...")
        result = post_to_threads(post)
        print(f"結果: {result}")

        if i < len(posts) - 1:
            interval = random.randint(min_interval, max_interval)
            print(f"次の投稿まで {interval} 秒待機...")
            time.sleep(interval)

# 使用例
if __name__ == "__main__":
    posts = load_posts_from_csv("posts.csv")
    post_with_interval(posts)
```

### CSVファイルの形式

```csv
content
今日のAIニュースをお届けします！
新しいプロンプトテクニックを発見しました
```

### チェックポイント

- [ ] CSVファイルを作成した
- [ ] スプレッドシート連携スクリプトが動作した

---

## セクション4: マルチプラットフォーム投稿

### X・Instagram・Threads同時投稿

```python
# multi_platform_post.py
# 実証後にコードを確定予定

from threads_post import post_to_threads
# from x_api_server import post_to_x  # 既存のX投稿スクリプト

def post_to_all_platforms(content):
    """全プラットフォームに投稿"""
    results = {}

    # Threads投稿
    try:
        results['threads'] = post_to_threads(content)
        print("Threads: 投稿成功")
    except Exception as e:
        results['threads'] = str(e)
        print(f"Threads: エラー - {e}")

    # X投稿（既存スクリプトと連携）
    # try:
    #     results['x'] = post_to_x(content)
    #     print("X: 投稿成功")
    # except Exception as e:
    #     results['x'] = str(e)
    #     print(f"X: エラー - {e}")

    return results

# 使用例
if __name__ == "__main__":
    content = "マルチプラットフォーム投稿テスト"
    results = post_to_all_platforms(content)
    print(results)
```

### 統合サーバー構成（計画）

```
┌─────────────────────────────────────┐
│        統合投稿サーバー              │
│  (x_api_server_v3.py を拡張)         │
├─────────────────────────────────────┤
│  POST /post                          │
│  {                                   │
│    "content": "投稿内容",            │
│    "platforms": ["x", "threads"]     │
│  }                                   │
└─────────────────────────────────────┘
         ↓              ↓
    ┌────────┐    ┌──────────┐
    │ X API  │    │Threads API│
    └────────┘    └──────────┘
```

### チェックポイント

- [ ] マルチプラットフォーム投稿の仕組みを理解した
- [ ] 統合サーバーの構成を把握した

---

## トラブルシューティング

### よくあるエラー

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 401 Unauthorized | トークン失効 | 長期トークンを再取得 |
| 400 Bad Request | パラメータ不正 | text内容を確認 |
| Rate Limit | 投稿頻度過多 | 間隔を空ける |

### レート制限

- 1日250件まで
- 短時間での連続投稿は避ける
- 推奨間隔: 1〜3分

（実証後に詳細を追記）

---

## まとめ

### このモジュールで学んだこと

- Threads APIは2ステップ（コンテナ作成→公開）で投稿
- CSVファイルから投稿内容を読み込んで自動化可能
- X・Instagramと組み合わせたマルチプラットフォーム運用が可能

### 完成形のイメージ

```
1. Googleスプレッドシートに投稿を準備
2. CSVでエクスポート
3. スクリプト実行
4. X + Threads に自動投稿
```

---

## 参考資料

- [Threads API公式ドキュメント](https://developers.facebook.com/docs/threads/)
- [Threads APIの登録方法](https://wporz.com/threads-api-regist/)

---

## 更新履歴

- 2026-01-26: 暫定版作成（実証前）
