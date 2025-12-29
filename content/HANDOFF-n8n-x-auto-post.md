# HANDOFF: X自動投稿初級編

**総合HANDOFF**: Module 06（画像付き投稿）を実装する場合は `content/HANDOFF-nanobanana-x-master.md` を先に読んでください。

---

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
| Module 06（画像付き投稿） | **完了（暫定版）** |
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
│       ├── module-05-thread-posting.md
│       └── module-06-image-posting.md（新規・画像付き投稿）
├── HANDOFF-n8n-x-auto-post.md（本ファイル）

public/
└── n8n-x-auto-post/
    ├── download/
    │   ├── x_api_server.py
    │   ├── x_api_server_v2.py（スレッド対応）
    │   ├── x_api_server_v3.py（新規・画像付き投稿対応）
    │   ├── x-auto-post-workflow.json
    │   ├── x-thread-post-workflow.json
    │   └── x-image-post-workflow.json（新規）
    └── images/
        ├── developer-portal-app-details.png
        ├── developer-portal-app-info.png
        ├── developer-portal-auth-settings.png
        ├── developer-portal-permissions.png
        ├── n8n-http-request.png
        ├── server-v2-startup.png
        ├── n8n-thread-success.png
        └── x-thread-result.png

scripts/
├── x_api_server.py（実稼働用・認証情報入り）
├── x_api_server_v2.py（実稼働用・スレッド対応）
└── x_api_server_v3.py（実稼働用・画像付き投稿対応）
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

#### 2. Nanobanana画像生成 + X投稿 - 次のタスク

投稿内容に合った画像を自動生成してX投稿に添付する機能。

**参考プロジェクト**: `C:\instagram-manga-generator`

**モデル比較（2025年12月調査）**:

| 項目 | Nano Banana | Nano Banana Pro |
|------|-------------|-----------------|
| モデルID | `gemini-2.5-flash-image` | `gemini-3-pro-image-preview` |
| 最大解像度 | 1024px | 4096px (4K) |
| Thinking機能 | なし | あり |
| Search grounding | なし | あり |
| 価格 | ~$0.039/枚 | $0.134 (1K/2K), $0.24 (4K) |
| ステータス | Stable | Preview |

※ `gemini-2.5-flash-image-preview` は2025年10月31日で廃止済み
※ 旧SDK `google-generativeai` は2025年11月30日EOL → `google-genai` に移行

**ImageConfigパラメータ**:
```python
types.ImageConfig(
    aspect_ratio="16:9",  # 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
    image_size="2K"       # 1K, 2K, 4K (Proのみ)
)
```

**実装手順**:
1. Python APIサーバーに `/generate-image` エンドポイント追加
2. X Media Upload APIで画像をアップロード
3. `create_tweet(text, media_ids)` で画像付き投稿
4. n8nワークフローで連携

**コード例（Nano Banana Pro - 4K画像生成）**:
```python
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents="プロンプト",
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="4K"
        ),
        tools=[{"google_search": {}}]  # Search grounding
    )
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        image.save("output.png")
```

**コード例（Nano Banana - 高速・低コスト）**:
```python
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents="プロンプト",
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(aspect_ratio="1:1")
    )
)
```

**参考資料**:
- [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation)
- [Nano Banana Guide](https://ai.google.dev/gemini-api/docs/nanobanana)
- [Gemini 3 Pro Image - DeepMind](https://deepmind.google/models/gemini-image/pro/)
- [google-genai PyPI](https://pypi.org/project/google-genai/)

### 機能拡張（将来）
- [ ] Google Sheetsから投稿内容を取得
- [ ] Instagram投稿との連携
- [ ] 画像付きツイート対応（Media Upload API）
- [ ] APIサーバーの自動起動設定
- [x] ツリー投稿対応（Module 05で完了）
- [ ] Nanobanan画像生成連携

## 連携講座: Nanobanana画像生成

**HANDOFF**: `content/HANDOFF-nanobanana-image-generation.md`

Module 06（画像付き投稿）では、Nanobanana画像生成講座で作成した画像生成機能を統合します。

### 連携ポイント

```
┌─────────────────────────────────────────────────────────────┐
│  Nanobanana画像生成講座                                      │
│  ├── Module 03: 基本的な画像生成                            │
│  └── Module 04: 応用編（参照画像、アスペクト比）             │
└─────────────────────────────────────────────────────────────┘
                          ↓ 統合
┌─────────────────────────────────────────────────────────────┐
│  X自動投稿講座                                               │
│  └── Module 06: 画像付きX投稿                                │
│      ├── 画像生成（Nanobanana講座を参照）                   │
│      ├── X Media Upload API                                 │
│      └── 画像付き投稿                                        │
└─────────────────────────────────────────────────────────────┘
```

### 共有技術情報

#### 参照プロジェクト
**instagram-manga-generator** (`C:\instagram-manga-generator`)

#### 技術スタック

| 項目 | 現状 | 備考 |
|------|------|------|
| SDK | `google-generativeai` | **※EOL済み → `google-genai` に移行必要** |
| モデル | `gemini-2.5-flash-image-preview` | Nano Banana |
| フレームワーク | なし（直接API呼び出し） | シンプルな構成 |

#### システムフロー（instagram-manga-generator）

```
簡易YAML → expand_story.py → 完全YAML → generate_from_yaml.py → Nanobanana API → 画像
                                                ↑
                                        参照画像（キャラ、レイアウト）
```

#### 主要ファイル

| ファイル | 役割 | 備考 |
|----------|------|------|
| `scripts/generate_from_yaml.py` | 画像生成の核心 | 341行目: モデル指定 |
| `scripts/expand_story.py` | YAML展開 | - |
| `templates/character_templates.yaml` | キャラクター定義 | - |

#### Nanobanana講座の構成

```
content/modules/nanobanana-image-generation/
├── module-01-overview.md           # 概要・Nanobananaとは
├── module-02-setup.md              # 環境構築（google-genai SDK）
├── module-03-basic-generation.md   # 基本的な画像生成
├── module-04-advanced.md           # 応用（参照画像、アスペクト比）
├── module-05-manga-system.md       # マンガ生成システム
└── module-06-pro.md                # Nano Banana Pro（検証後追加）
```

| Module | 内容 | 備考 |
|--------|------|------|
| 01 | 概要・Nanobananaとは | モデル比較含む |
| 02 | 環境構築 | APIキー取得、SDK移行 |
| 03 | 基本的な画像生成 | シンプルなプロンプトから |
| 04 | 応用編 | 参照画像、パラメータ |
| 05 | マンガ生成システム | instagram-manga-generator統合 |
| 06 | Nano Banana Pro | 検証しながら作成 |

## 参考リンク

- [X Developer Portal](https://developer.x.com/)
- [tweepy ドキュメント](https://docs.tweepy.org/)
- [n8n Twitter OAuth Issue #15286](https://github.com/n8n-io/n8n/issues/15286)

---

**最終更新**: 2025-12-28（Module 06 画像付き投稿 暫定版作成）
**担当**: AI Assistant
