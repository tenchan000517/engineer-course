# HANDOFF: X自動投稿初級編

## 概要

n8nとPythonを使ってX（旧Twitter）への自動投稿システムを構築する講座。

## 現在のステータス

| 項目 | 状態 |
|------|------|
| Module 01（概要） | 完了 |
| Module 02（Developer Portal設定） | 完了 |
| Module 03（Python APIサーバー） | 完了 |
| Module 04（n8nワークフロー） | 完了 |
| Module 05（スレッド投稿） | 完了 |
| 動作検証 | 完了（テスト投稿成功） |
| スクリーンショット | 完了（8枚） |

## 作成済みファイル

```
content/
├── modules/
│   └── n8n-x-auto-post/
│       ├── _category.json
│       ├── module-01-overview.md
│       ├── module-02-developer-setup.md
│       ├── module-03-python-api-server.md
│       ├── module-04-n8n-workflow.md
│       └── module-05-thread-posting.md（新規）
├── HANDOFF-n8n-x-auto-post.md（本ファイル）

public/
└── n8n-x-auto-post/
    ├── download/
    │   ├── x_api_server.py
    │   ├── x_api_server_v2.py（新規・スレッド対応）
    │   ├── x-auto-post-workflow.json
    │   └── x-thread-post-workflow.json（新規）
    └── images/
        ├── developer-portal-app-details.png
        ├── developer-portal-app-info.png
        ├── developer-portal-auth-settings.png
        ├── developer-portal-permissions.png
        ├── n8n-http-request.png
        ├── server-v2-startup.png（新規）
        ├── n8n-thread-success.png（新規）
        └── x-thread-result.png（新規）

scripts/
├── x_api_server.py（実稼働用・認証情報入り）
└── x_api_server_v2.py（実稼働用・スレッド対応）
```

## 技術的な背景

### なぜPython APIサーバー経由なのか

2025年12月現在、n8nのセルフホスト版には以下の問題があります：

1. **OAuth 1.0a非推奨**: n8n v0.236.0でOAuth 1.0aサポートが廃止
2. **OAuth 2.0バグ**: セルフホスト環境でOAuth認証フローに500エラーが発生
3. **403エラー**: 権限設定後もAPIリクエストが失敗

これらを回避するため、Python（tweepy）経由でX APIを呼び出す方式を採用。

### システム構成

```
n8n (Docker) → HTTP Request → Python APIサーバー (Flask+Tweepy) → X API v2
```

## 実施した手順

### 1. X Developer Portal設定
- アプリ作成
- APIキー取得（4種類）
- App permissions: Read and write に設定
- Access Token再生成

### 2. Python環境構築
- tweepy, flask インストール
- APIサーバースクリプト作成
- ローカルでサーバー起動

### 3. n8n連携
- HTTP Requestノードで `http://host.docker.internal:5000/post` を呼び出し
- テスト投稿成功

## トラブルシューティング履歴

### 発生した問題

| 問題 | 原因 | 解決策 |
|------|------|--------|
| OAuth認証500エラー | n8nセルフホスト環境のバグ | Python APIサーバー経由に変更 |
| 403 Forbidden | App permissionsが「Read」のみ | 「Read and write」に変更後、Access Token再生成 |
| Cannot find module 'crypto' | n8n Codeノードの制限 | Python APIサーバー方式に変更 |

## API制限

| 項目 | Free tier |
|------|-----------|
| 投稿数 | 17回/24時間 |
| 月間 | 約500回 |

## 次のアクション

### 講座の改善
- [x] 各ステップのスクリーンショットを追加（5枚）
- [ ] トラブルシューティングに実際のエラー画面を追加

### 完了済み

#### 1. ツリー投稿（スレッド投稿）- 完了
- [x] 技術調査（in_reply_to_tweet_idパラメータ）
- [x] Python APIサーバーに /thread エンドポイント追加
- [x] n8nワークフロー作成・テスト成功
- [x] Module 05 講座作成

### 次世代セッションで実装予定

#### 1. 投稿の型（テンプレート）
高品質な投稿のためのテンプレート構造：

```
【投稿の型サンプル】

■ フック（1ツイート目）
Gemに革命が起こりました。GeminiのカスタムAI機能「Gem」の知識に、
ついにNotebookLMが追加できるようになりました。
これ、「毎回プロンプトや連携するNotebookLMを指示する」という作業が
この世から消える神アップデートです。
一度作れば一生使える最強の活用法3選をプロンプト付きで解説します👇

■ 本文（2〜5ツイート目）
- 問題提起 → 解決策 → 具体例の流れ
- 各ツイートに番号（1/5）などを付ける
- 「次に〜👇」で次ツイートへ誘導

■ まとめ（最終ツイート）
- 要点を箇条書き
- CTA（フォロー誘導など）
```

#### 2. Nanobananで画像生成
投稿内容に合った画像を自動生成して添付する機能。

### 機能拡張（将来）
- [ ] Google Sheetsから投稿内容を取得
- [ ] Instagram投稿との連携
- [ ] 画像付きツイート対応（Media Upload API）
- [ ] APIサーバーの自動起動設定
- [x] ツリー投稿対応（Module 05で完了）
- [ ] Nanobanan画像生成連携

## 参考リンク

- [X Developer Portal](https://developer.x.com/)
- [tweepy ドキュメント](https://docs.tweepy.org/)
- [n8n Twitter OAuth Issue #15286](https://github.com/n8n-io/n8n/issues/15286)

---

**最終更新**: 2025-12-27（Module 05 スレッド投稿追加）
**担当**: AI Assistant
