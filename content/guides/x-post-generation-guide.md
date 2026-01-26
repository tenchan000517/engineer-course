# X投稿生成ガイド

## トリガー

「X投稿を作成して」「今月のX投稿ネタを生成して」「150件のX投稿を作って」

---

## 役割分担

- **Antigravity**: データ収集（YouTubeタイトル、ツール名抽出）
- **Claude Code**: 正規化、トレンドランキング、3パターンの投稿生成、品質チェック
- **Nano Banana Pro**: 画像生成（5パターン）

---

## 投稿パターン（150件/月）

| パターン | 件数/月 | 件数/日 | 内容 |
|----------|---------|---------|------|
| 公式発表・アップデート | 60件 | 2件 | 公式サイトのニュース記事（TOPページ不可） |
| 画像付き投稿 | 60件 | 2件 | Nano Banana Proで生成したバナー |
| スレッド投稿 | 30件 | 1件 | 特典ページ・講座のライトコンテンツ |

---

## 出力フォルダ

**場所**: `/mnt/c/X_Research/YYYYMMDD_XX/`

**特定方法**:
- ユーザーから指定がある場合 → 指定のフォルダ
- 指定がない場合 → `/mnt/c/X_Research/` 内の最新フォルダ
- 同じ日付で複数ある場合（_01, _02, _03...） → 連番が最も大きいもの

**ファイル構造**:

| ファイル名 | 生成 | 内容 |
|------------|------|------|
| step1_topics.json | Antigravity | YouTubeタイトル収集結果（入力） |
| step2_trend_ranking.json | Claude Code | トレンドランキング（出力） |
| step3_news_posts.json | Claude Code | 公式発表投稿60件（出力） |
| step4_image_posts.json | Claude Code | 画像付き投稿60件（出力） |
| step5_thread_posts.json | Claude Code | スレッド投稿30件（出力） |
| x_posts_YYYYMM.json | Claude Code | 統合済み150件（最終出力） |

---

## フロー

### Phase 1: リサーチ

#### ステップ1: Antigravityでトピック収集

1. Antigravityのエージェントを開く
2. X_Researchフォルダを開く
3. `@x_research_workflow_v2.md` をメンションし Step 1-2 を実行
4. 出力: `step1_topics.json`, `step2_trend_ranking.json`

**対象YouTuber（5人）**:
- チャエン、mikimiki、AIサボロー、木内翔大、KEITO

---

### Phase 2: 投稿生成

#### ステップ2: 公式発表・アップデート投稿（60件）

**重要ルール**:
- ソース: 公式サイトのニュース/ブログ/アップデートページのみ
- **TOPページは絶対不可**（具体的な記事URLが必要）

**公式ニュースURL一覧**（検証済み・WebFetchでアクセス可能 / 全35ツール対応）:

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
| Dify | https://dify.ai/blog | 公式ブログ（※Antigravity専用） |
| n8n | https://blog.n8n.io/ | ワークフロー自動化 |
| Remotion | https://remotion.dev/blog | 動画生成フレームワーク |
| **動画生成** | | |
| Higgsfield | https://higgsfield.ai/blog | AI動画・Kling情報も |
| AKOOL | https://www.akool.com/blog | AI動画・アバター |
| Kling | https://app.klingai.com/global/blog | 公式ブログ |
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

**TechCrunch経由で情報取得**（公式サイトがアクセス制限のツール）:

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

**Antigravity専用**（JSレンダリングが必要 / Claude Codeでは取得不可）:

| ツール | URL | 備考 |
|--------|-----|------|
| Dify | https://dify.ai/blog | ワークフローAI |
| Notta | https://www.notta.ai/blog | 文字起こしAI |
| Bolt | https://bolt.new/blog | AIアプリ開発 |
| Kling | https://app.klingai.com/global/blog | 動画生成AI |

**取得方法**:
1. 公式URLがあるツール → `WebFetch` で直接取得
2. TechCrunch経由のツール → `WebFetch` でタグページから最新記事を取得
3. Antigravity専用のツール → Antigravityで直接アクセスして記事を確認
4. 記事URLを投稿に使用（TechCrunch・公式どちらでもOK）

**投稿フォーマット**:
```
【{ツール名}】{ニュースタイトル}

{記事の要約 2-3行}

・{ポイント1}
・{ポイント2}

詳細はこちら
{記事URL}

#AI #{ツール名} #アップデート
```

出力: `step3_news_posts.json`

---

#### ステップ3: 画像付き投稿（60件）

**5パターンで作成**（各12件）:

| パターン | 用途 |
|----------|------|
| 問題提起型 | ターゲットの悩みに共感 |
| 数字訴求型 | 実績・数字で信頼性訴求 |
| 限定性訴求型 | 緊急性・限定性で行動促進 |
| ストーリー型 | Before→Afterで感情に訴求 |
| シンプル訴求型 | ミニマルで高級感 |

**重要**: 複雑な図解ではなく、**目を引くバナー**を作成

プロンプトテンプレートは `x_research_workflow_v2.md` のStep 4を参照

出力: `step4_image_posts.json`

---

#### ステップ4: スレッド投稿（30件）

**ソース優先順位**:
1. **特典ページ**（優先）: `/mnt/c/engineer-course/content/gifts/`
2. **講座**（補完）: `/mnt/c/engineer-course/content/`

**選定基準**:
- 1スレッド（7ツイート）で1つの目標が達成できる
- **人気のあるトピック**を優先
- コピペで使えるプロンプト等、実用的な内容

**スレッド構成**:
```
1ツイート目: フック（リンクなし、280文字以内）
2ツイート目: ソース + 理由1（URLはここに配置）
3-6ツイート目: 本編
7ツイート目: まとめ + CTA
```

出力: `step5_thread_posts.json`

---

### Phase 3: 品質管理

#### ステップ5: 品質チェック・統合

**CRITICALチェック（必須通過）**:
- [ ] 事実の捏造がない
- [ ] TOPページURLを使用していない（公式発表）
- [ ] 具体的な記事URLがある（公式発表）
- [ ] 1ツイート目にリンクがない（スレッド）

**統合出力**: `x_posts_YYYYMM.json`

---

## 参照

- ワークフロー詳細: `/mnt/c/Instagram_AI/.agent/workflows/x_research_workflow_v2.md`
- 投稿フロー詳細: `/mnt/c/engineer-course/docs/workflows/x_post_workflow_v1.md`
- X APIサーバー: `python C:\engineer-course\scripts\x_api_server_v3.py`

---

## X API制限

| 項目 | 無料枠 | 目標 | 判定 |
|------|--------|------|------|
| 投稿/24時間 | 17件 | 5件 | OK |
| 投稿/月 | 500件 | 330件* | OK |

*スレッド30件×7ツイート = 210 + 単一投稿120件 = 330件
