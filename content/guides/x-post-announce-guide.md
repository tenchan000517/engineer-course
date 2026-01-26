# X投稿アナウンス生成ガイド

## トリガー

「X投稿アナウンスを作成して」「公式発表投稿を生成して」

---

## 概要

| 項目 | 内容 |
|------|------|
| 件数 | 60件/月（2件/日） |
| ソース | 公式サイトのニュース/ブログ/アップデートページ |
| 出力 | `step3_news_posts.json` |

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

#AI #{ツール名} #アップデート
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
      "post_id": "NEWS-001",
      "tool_name": "Claude",
      "source_url": "https://www.anthropic.com/news/specific-article",
      "source_title": "記事タイトル",
      "text": "投稿本文",
      "hashtags": ["#AI", "#Claude", "#アップデート"],
      "char_count": 280,
      "is_top_page": false
    }
  ]
}
```

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
