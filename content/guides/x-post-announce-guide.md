# X投稿アナウンス生成ガイド

## トリガー

「X投稿アナウンスを作成して」「公式発表投稿を生成して」

---

## 概要

| 項目 | 内容 |
|------|------|
| 件数 | 60件/月（2件/日） |
| ソース | 公式サイトのニュース/ブログ/アップデートページ |
| 出力 | `{{PROJECT_DIR}}/step3_news_posts.json` |

---

## Step 0: 初期化

### 0.1 システム日時確認（必須）

1. 現在のシステム日時を取得して**必ず出力**すること

```
出力例:
今日: 2026-01-27
```

### 0.2 ディレクトリ確認・作成

1. `C:\Instagram_AI\X_Research\` 配下の当日ディレクトリを確認
2. 当日ディレクトリ内に `step3_news_posts.json` が**既にあれば**次の連番へ
3. パス: `C:\Instagram_AI\X_Research\YYYYMMDD_XX\`
4. 以降、このディレクトリを `{{PROJECT_DIR}}` とする

```
例:
- 20260127_01/step3_news_posts.json が既にある → 20260127_02 を使用
- 20260127_01 にアナウンスファイルが無い → 20260127_01 を使用
- 当日ディレクトリ無し → 20260127_01 を作成
```

**各タイプのチェックファイル:**

| タイプ | チェックするファイル |
|--------|---------------------|
| アナウンス | `step3_news_posts.json` |
| 画像付き | `step4_image_posts.json` |
| スレッド | `step5_thread_posts.json` |

---

## 重要ルール

- ソース: 公式サイトのニュース/ブログ/アップデートページのみ
- **TOPページは絶対不可**（具体的な記事URLが必要）

---

## 公式ニュースURL一覧（全35ツール対応）

### WebFetchでアクセス可能

| ツール | URL | 備考 |
|--------|-----|------|
| **LLM・チャット** | | |
| Claude / Anthropic | https://www.anthropic.com/news | Anthropic公式 |
| Perplexity / Comet | https://docs.perplexity.ai/changelog | APIチェンジログ |
| **Google系（7ツール）** | | |
| Gemini / NotebookLM | https://blog.google/technology/ai/ | Google AI Blog |
| Nano Banana / Veo 3.1 | https://blog.google/technology/ai/ | Google AI Blog（画像・動画生成）|
| Antigravity / Flow | https://developers.googleblog.com/ | Google開発者ブログ |
| Google AI Studio/Lab | https://developers.googleblog.com/ | Google開発者ブログ |
| **開発ツール** | | |
| Cursor | https://www.cursor.com/changelog | changelog |
| Lovable | https://lovable.dev/blog | AIアプリ開発 |
| n8n | https://blog.n8n.io/ | ワークフロー自動化 |
| Remotion | https://remotion.dev/blog | 動画生成フレームワーク |
| **動画生成** | | |
| Higgsfield | https://higgsfield.ai/blog | AI動画・Kling情報も |
| AKOOL | https://www.akool.com/blog | AI動画・アバター |
| Vrew | https://www.vrew.ai/en/update | アップデート情報 |
| **プレゼン・デザイン** | | |
| Gamma | https://meetgamma.canny.io/changelog | チェンジログ |
| Notion | https://www.notion.com/releases | リリースノート |
| **音声AI** | | |
| Fish Audio | https://fish.audio/blog | 音声クローン・TTS |
| Suno | https://suno.com/blog | 音楽生成AI |
| **検索・エージェント** | | |
| Felo | https://www.felo.ai/blog | AI検索 |
| Manus | https://manus.im/blog | AIエージェント |
| Skywork | http://skywork.ai/blog/ | AIエージェントニュース |

### TechCrunch経由（公式サイトがアクセス制限）

| ツール | TechCrunch URL | 備考 |
|--------|----------------|------|
| ChatGPT / OpenAI / GPT5.2 | https://techcrunch.com/tag/openai/ | GPT-5.2、Health機能、Atlas等 |
| Sora | https://techcrunch.com/tag/sora/ | OpenAI動画生成 |
| Grok / xAI | https://techcrunch.com/tag/xai/ | Grok 4/5、SuperGrok等 |
| Grok（製品単体） | https://techcrunch.com/tag/grok/ | Grok機能アップデート |
| Canva | https://techcrunch.com/tag/canva/ | AI機能、Affinity統合等 |
| Genspark | https://techcrunch.com/tag/genspark/ | Super Agent等 |
| Midjourney | https://techcrunch.com/tag/midjourney/ | V7等の最新モデル |
| Veo | https://techcrunch.com/tag/veo/ | Google動画生成（補完） |
| CapCut | https://techcrunch.com/tag/capcut/ | ByteDance動画編集 |

### Antigravity専用（JSレンダリングが必要）

| ツール | URL | 備考 |
|--------|-----|------|
| Dify | https://dify.ai/blog | ワークフローAI |
| Notta | https://www.notta.ai/blog | 文字起こしAI |
| Bolt | https://bolt.new/blog | AIアプリ開発 |
| Kling | https://app.klingai.com/global/blog | 動画生成AI |

---

## 取得方法

1. 公式URLがあるツール → `WebFetch` で直接取得
2. TechCrunch経由のツール → `WebFetch` でタグページから最新記事を取得
3. Antigravity専用のツール → Antigravityで直接アクセスして記事を確認
4. 記事URLを投稿に使用（TechCrunch・公式どちらでもOK）

---

## 投稿フォーマット

### パターンA: ニュース紹介型

```
【{ツール名}】{ニュースタイトル}

{記事の要約 2-3行}

・{ポイント1}
・{ポイント2}
・{ポイント3}

詳細はこちら
{記事URL}
```

### パターンB: 資料紹介型

```
{企業名}の「{資料名}」が有益。

{ターゲット}にとって、「{概念1}」から「{概念2}」、さらには「{概念3}」といった{学べること}が学べる。

こちら👉
{記事URL}
```

---

## 出力形式

**ファイル名**: `step3_news_posts.json`

```json
{
  "generated_at": "2026-01-27",
  "total": 60,
  "posts": [
    {
      "post_id": "20260127-001",
      "pattern": "announcement",
      "tool_name": "Claude",
      "source_url": "https://www.anthropic.com/news/specific-article",
      "source_title": "記事タイトル",
      "content": "投稿本文"
    }
  ]
}
```

**post_id形式**: `YYYYMMDD-XXX`（例: 20260127-001）

**必須フィールド（GAS/n8n対応）**:

| フィールド | 内容 | n8n参照 |
|-----------|------|---------|
| post_id | 一意のID | `$json.post_id` |
| pattern | `announcement` 固定 | フィルタ条件 |
| tool_name | ツール名 | - |
| content | 投稿本文 | `$json.content` |

**省略可能フィールド（GASがデフォルト値を設定）**:

| フィールド | GASデフォルト | 備考 |
|-----------|--------------|------|
| status | `READY` | n8nが`READY`を取得 |
| tweet_count | `1` | announcementは1 |
| angle | 空文字 | 未使用 |
| scheduled_date | 空文字 | 未使用 |
| image_prompt | 空文字 | アナウンスでは不要 |
| reply_content | 空文字 | 任意（リプライ用） |

---

## シャッフル処理（必須）

生成後、同じツールが連続しないようにシャッフルする。

### 理由

- ツールごとにまとめて生成すると同じツールが連続する
- 投稿の多様性を確保するため分散配置が必要

### アルゴリズム

1. 残り投稿数が多いツールを優先的に選択
2. ただし前回と同じツールは避ける
3. post_idを `YYYYMMDD-001` から再採番

### 実行方法

```python
# 連続を避けながら配置
shuffled = []
last_tool = None

while any(tool_groups.values()):
    available = [t for t in sorted_tools if tool_groups[t] and t != last_tool]
    if not available:
        available = [t for t in sorted_tools if tool_groups[t]]
    available.sort(key=lambda x: len(tool_groups[x]), reverse=True)
    chosen_tool = available[0]
    shuffled.append(tool_groups[chosen_tool].pop(0))
    last_tool = chosen_tool

# post_id再採番
for i, post in enumerate(shuffled, 1):
    post['post_id'] = f"YYYYMMDD-{i:03d}"
```

### 確認事項

- [ ] 同じツールが連続していない
- [ ] post_idが `YYYYMMDD-001` 形式で連番

---

## 品質チェック

- [ ] 事実の捏造がない
- [ ] TOPページURLを使用していない
- [ ] 具体的な記事URLがある
- [ ] 文字数制限内（280文字）

---

## 参照

- 統合ガイド: `content/guides/x-post-generation-guide.md`
- ワークフロー詳細: `/mnt/c/Instagram_AI/.agent/workflows/x_research_workflow_v2.md`
