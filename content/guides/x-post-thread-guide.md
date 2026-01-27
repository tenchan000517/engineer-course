# X投稿スレッド生成ガイド

## トリガー

「X投稿スレッドを作成して」「スレッド投稿を生成して」

---

## 概要

| 項目 | 内容 |
|------|------|
| 件数 | 30件/月（1件/日） |
| 構成 | 7ツイート/スレッド |
| ソース | 特典ページ・講座 |
| 出力 | `{{PROJECT_DIR}}/step5_thread_posts.json` |

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
2. 当日ディレクトリ内に `step5_thread_posts.json` が**既にあれば**次の連番へ
3. パス: `C:\Instagram_AI\X_Research\YYYYMMDD_XX\`
4. 以降、このディレクトリを `{{PROJECT_DIR}}` とする

```
例:
- 20260127_01/step5_thread_posts.json が既にある → 20260127_02 を使用
- 20260127_01 にスレッドファイルが無い → 20260127_01 を使用
- 当日ディレクトリ無し → 20260127_01 を作成
```

**各タイプのチェックファイル:**

| タイプ | チェックするファイル |
|--------|---------------------|
| アナウンス | `step3_news_posts.json` |
| 画像付き | `step4_image_posts.json` |
| スレッド | `step5_thread_posts.json` |

### 0.3 既存JSONの引き継ぎ確認

1. `step5_thread_posts.json`が存在する場合、`total`フィールドを検索で確認
2. **30件未満**なら途中から引き継ぎ
3. **30件以上**なら次の連番ディレクトリへ

```bash
# totalを確認（全文読み込み不要）
grep '"total"' {{PROJECT_DIR}}/step5_thread_posts.json
```

```
例:
- total: 3 → T004から作成開始
- total: 30 → 次のディレクトリを使用
```

---

## ソース優先順位

1. **特典ページ**（優先）: `/mnt/c/engineer-course/content/gifts/`
2. **講座**（補完）: `/mnt/c/engineer-course/content/`

---

## 選定基準

- 1スレッド（7ツイート）で**1つの目標が達成できる**
- **人気のあるトピック**を優先
- コピペで使えるプロンプト等、実用的な内容
- 前後の文脈なしで理解できる独立性

---

## スレッド構成（7ツイート）

### 1ツイート目: フック（TOP）

**重要**: リンクなし、280文字以内、番号は「1/」から開始

```
1/ {目を引くタイトル}

このスレッドを読むと：
・{達成できること1}
・{達成できること2}
・{達成できること3}

詳細はスレッドで👇
```

### 2ツイート目: 目次

```
2/ {見出し}

{本文 200-250文字}
```

### 3-6ツイート目: 本編

```
{番号}/ {見出し}

{本文 200-250文字}
プロンプトを記載する場合は文字数をオーバーすることは可能です

{ポイントや具体例}
```

### 7ツイート目: まとめ + CTA

```
7/ まとめ

・{要点1}
・{要点2}
・{要点3}

このスレッドが役に立ったら
いいね・リポスト・フォロー
お願いします！

@TENCHAN_0517
```

---

## Xアルゴリズム対応

| 項目 | 対策 |
|------|------|
| 外部リンク | HEAVY PENALTY → **1ツイート目は絶対リンクなし** |
| リンク配置 | 2ツイート目以降 or プロフ誘導 |
| Dwell Time | 長く読ませるほど有利 |
| 初動15-60分 | この間のエンゲージメントが鍵 |

---

## 出力形式

**ファイル名**: `step5_thread_posts.json`

**post_id形式**: `YYYYMMDD-T連番`（例: `20260127-T001`）

```json
{
  "generated_at": "2026-01-27",
  "total": 30,
  "posts": [
    {
      "post_id": "20260127-T001",
      "pattern": "thread",
      "source_type": "gifts",
      "source_file": "gifts/prompt-template.md",
      "topic": "ChatGPTプロンプトテンプレート",
      "status": "READY",
      "image_prompt": "（1ツイート目用サムネイル画像プロンプト）",
      "tweets": [
        {
          "order": 1,
          "content": "1ツイート目の内容",
          "char_count": 140,
          "has_link": false
        },
        {
          "order": 2,
          "content": "2ツイート目の内容",
          "char_count": 230,
          "has_link": false
        }
      ],
      "total_tweets": 7
    }
  ]
}
```

---

## 1ツイート目サムネイル画像

1ツイート目には**サムネイル画像**を添付する。画像は`image_prompt`で生成。

### 画像プロンプトテンプレート

```
【タイトル】{スレッドのタイトル}
【要約の核心】{このスレッドで得られること}

上記の情報をもとに、要約の内容を視覚化したバナーを作成してください。

【デザイン要件】
- メインコピー：{タイトルそのまま}
- サブコピー：{核心を一文で}
- ビジュアル：{内容を視覚化した具体的な指示}
- 配色：{テーマに合った配色}
- レイアウト：上部にメインコピー、中央にビジュアル、下部にサブコピー
- サイズ：1080x1080px
- フォント：メインコピーは太めのゴシック体、サブコピーは読みやすいゴシック体
- 雰囲気：{テーマに合った雰囲気}
```

### 例

```
【タイトル】ChatGPTが嘘をつかなくなる「3つの魔法の言葉」
【要約の核心】3つの言葉を追加するだけでChatGPTの回答精度が劇的に上がる

上記の情報をもとに、要約の内容を視覚化したバナーを作成してください。

【デザイン要件】
- メインコピー：ChatGPTが嘘をつかなくなる「3つの魔法の言葉」
- サブコピー：コピペで使えるプロンプト付き
- ビジュアル：チャット画面のイメージ、3つのポイントが並んでいるデザイン、チェックマークやライトバルブのアイコン
- 配色：ChatGPTのグリーン系（#10a37f）をベースに、白と黒でコントラスト
- レイアウト：上部にメインコピー、中央にビジュアル、下部にサブコピー
- サイズ：1080x1080px
- フォント：メインコピーは太めのゴシック体、サブコピーは読みやすいゴシック体
- 雰囲気：シンプル、信頼感、実用的
```

---

## 品質チェック

- [ ] 事実の捏造がない
- [ ] **1ツイート目にリンクがない**（CRITICAL）
- [ ] 各ツイート250文字以内
- [ ] 最終ツイートにCTA（フォロー誘導）がある
- [ ] 1スレッドで1つの成果が出せる完結性
- [ ] `image_prompt`が正しいテンプレート形式
- [ ] メインコピーがタイトルそのまま（揺らぎなし）

---

## 禁止事項

- 1ツイート目へのリンク配置
- 人気のないトピックの優先
- 前後の文脈が必要な内容の選定
- **一括作成**（必ず1件ずつ丁寧に作成すること）

---

## ファイル分割（必須）

30件作成完了後、**必ず3分割**してスプレッドシートへの取り込みを容易にする。

### 分割ルール

| ファイル名 | 件数 | 範囲 |
|-----------|------|------|
| `step5_thread_posts_part1.json` | 10件 | T001-T010 |
| `step5_thread_posts_part2.json` | 10件 | T011-T020 |
| `step5_thread_posts_part3.json` | 10件 | T021-T030 |

### 分割スクリプト（Python）

```python
import json

# JSONファイルを読み込み
with open('step5_thread_posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

posts = data['posts']
generated_at = data['generated_at']

# 30件を10件ずつ3分割
for i, (start, end, range_str) in enumerate([
    (0, 10, "T001-T010"),
    (10, 20, "T011-T020"),
    (20, 30, "T021-T030")
], 1):
    part = {
        "generated_at": generated_at,
        "total": 10,
        "part": f"{i}/3",
        "range": range_str,
        "posts": posts[start:end]
    }
    with open(f'step5_thread_posts_part{i}.json', 'w', encoding='utf-8') as f:
        json.dump(part, f, ensure_ascii=False, indent=2)

print("分割完了")
```

### 分割後のファイル処理

1. 元ファイルを `_backup` にリネーム
2. 3つの分割ファイルをスプレッドシートに取り込み

```bash
mv step5_thread_posts.json step5_thread_posts_backup.json
```

---

## 使用済みソース

スレッド作成に使用したソースファイル（重複防止用）

- `gifts/chatgpt-accuracy-tips.md` - ChatGPTの回答精度を上げる3つの言葉
- `gifts/ai-image-7-elements.md` - AI画像生成の7つの必須要素
- `gifts/sora2-quick-start.md` - Sora 2でAI動画を生成する方法
- `gifts/ai-video-prompts.md` - AIで作った動画のカメラワーク用語チートシート
- `gifts/ad-creative-prompts.md` - SNS広告画像をAIで量産する方法
- `gifts/logo-banner-prompts.md` - AIでロゴを作る方法（外注なし）
- `gifts/product-image-prompts.md` - メルカリで売れる商品画像をAIで作る方法
- `gifts/youtube-thumbnail-prompts.md` - クリック率が上がるYouTubeサムネイルをAIで作る方法
- `gifts/nanobanana-video-prompts.md` - バズるASMR動画をAIで作る方法
- `gifts/trend-research-prompt.md` - AIでトレンドを自動リサーチする方法
- `gifts/reel-script-generation-flow.md` - 毎月30本のリール台本を効率的に作る方法
- `gifts/sns-image-prompts.md` - SNS用画像をAIで作る3つのテンプレート
- `gifts/audio-transcription-workflow.md` - 音声ファイルを入れるだけで記事になるシステム
- `gifts/genspark-guide.md` - Gensparkで出典付きリサーチをする方法
- `gifts/genspark-guide.md` - Gensparkで営業資料を自動生成する方法
- `gifts/nanobanana-quick-start.md` - Nanobananaで無料でAI画像を生成する方法
- `gifts/sns-ai-tools-ranking-2026.md` - 素人写真をプロ級広告ビジュアルに変えるプロンプト
- `gifts/viral-reel-research.md` - バズったリールを効率的に見つける方法
- `gifts/sample-chatgpt-canvas.md` - ChatGPT Canvasで資料作成を10倍速くする方法
- `gifts/x-post-generation-flow.md` - X投稿150件/月を自動生成するフロー
- `gifts/sns-image-prompts-v2.md` - SNS投稿用画像プロンプト集
- `gifts/youtube-thumbnail-templates.md` - YouTubeサムネイル生成プロンプト集
- `gifts/recruitment-pv-template.md` - Sora 2で採用PVを作る方法
- `gifts/x-auto-post-system.md` - X自動投稿システム構築ガイド
- `gifts/instagram-auto-post-flow.md` - Instagram自動投稿フロー全体図
- `gifts/trend-research-prompts.md` - 毎月100個以上のネタを見つけるリサーチ方法
- `gifts/ai-tool-ranking.md` - 無料で使えるAIツールランキングTOP5
- `gifts/hook-robot-to-illustration.md` - ロボット→イラスト変身の冒頭フック作成法
- `gifts/efficiency-ai-tools.md` - Claude ArtifactsとPerplexity Proプロンプト集
- `gifts/selling-creative.md` - 売れるクリエイティブを作る5パターン

---

## 参照

- 統合ガイド: `content/guides/x-post-generation-guide.md`
- ワークフロー詳細: `/mnt/c/Instagram_AI/.agent/workflows/x_research_workflow_v2.md`
- 特典ページ: `/mnt/c/engineer-course/content/gifts/`