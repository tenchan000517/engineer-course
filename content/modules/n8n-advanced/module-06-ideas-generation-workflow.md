# ideas生成ワークフロー - Antigravityによる自動リサーチ

**所要時間**: 60分（Step 1-3の合計）
**難易度**: ⭐⭐⭐⭐☆

---

## このモジュールで学ぶこと

- 従来のideas生成の問題点と解決策
- Antigravityを使った3ステップワークフロー
- Browser Agentによる事実ベースのKnowledge Base構築
- ハルシネーションのないコンテンツ生成

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Antigravityでワークフローを設定・実行できる
- TOP20ツールのトレンド調査とYouTube URL取得ができる
- 動画トランスクリプトから事実情報を抽出できる
- 事実のみに基づいたideasコンテンツを生成できる

---

## 目次

- [セクション1: 従来の問題点](#セクション1-従来の問題点)
- [セクション2: 新しいワークフローの概要](#セクション2-新しいワークフローの概要)
- [セクション3: Antigravityのセットアップ](#セクション3-antigravityのセットアップ)
- [セクション4: ワークフローの実行](#セクション4-ワークフローの実行)
- [セクション5: 出力スキーマ](#セクション5-出力スキーマ)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Google Antigravity（アクセス権限）
- Windows PC（`C:\Instagram_AI`フォルダを作成）

### 前提知識

- n8n基礎講座（Module 01-11）完了済み
- Module 03-05の内容を理解している

---

## セクション1: 従来の問題点

### 何が問題だったか

従来のideas生成フローでは、以下の問題が発生していました：

| 問題 | 具体例 |
|------|--------|
| 架空のツール名が生成される | カテゴリE（ランキング）で「CodeChecker」「AlgoVisualizer」等の存在しないツールが出現 |
| 機能名が創作される | 「Manager View」「Composer」等、実在しない機能名が混入 |
| 数値が捏造される | 「3倍高速」「90%削減」等の根拠のない数値 |

### 原因

Gemini APIは**リサーチ能力を持たない**ため、不完全な情報（title, tools, research_points）を渡すと、古い学習データや想像で補完してしまいます。

### 解決策

**上流（Antigravity）で完成コンテンツを生成し、下流（Gemini）の役割を最小化する**

- Antigravityはブラウザ操作ができるため、YouTube動画から事実を抽出可能
- 抽出した事実のみを使ってコンテンツを生成
- Geminiはキャプション・ハッシュタグ生成のみを担当

### チェックポイント

- [ ] 従来の問題点を理解した
- [ ] Antigravityを使う理由を理解した

---

## セクション2: 新しいワークフローの概要

### 3ステップ構成

```
Phase 1: Trend Discovery（TOP 20選定）
    ↓ step1_trend_list.json (20 tools + YouTube URLs)

Phase 2: Deep Dive Research（事実抽出）×4バッチ
    ↓ step2_knowledge_base_batch_1.json
    ↓ step2_knowledge_base_batch_2.json
    ↓ step2_knowledge_base_batch_3.json
    ↓ step2_knowledge_base_batch_4.json

Phase 3: Content Expansion（コンテンツ生成）×4バッチ
    ↓ instagram_ideas_batch_1.json
    ↓ instagram_ideas_batch_2.json
    ↓ instagram_ideas_batch_3.json
    ↓ instagram_ideas_batch_4.json
    ↓
    → 統合 → final_ideas.json → GASでideasシートにインポート
```

### なぜバッチ処理か

- 20ツールを一度に処理するとタイムアウトのリスクがある
- 5ツールずつ処理することで安定性を確保
- 途中でエラーが発生しても、そのバッチだけやり直せる

### チェックポイント

- [ ] 3ステップ構成を理解した
- [ ] バッチ処理（5ツールずつ）の意味を理解した

---

## セクション3: Antigravityのセットアップ

### ステップ1: 作業フォルダの作成

Windowsエクスプローラーで `C:\Instagram_AI` フォルダを作成します。

### ステップ2: Antigravityでワークスペースを開く

1. Antigravityを起動
2. 画面左上のメニューから **[File] > [Open Workspace (or Open Folder)]** を選択
3. `C:\Instagram_AI` を開く

ワークスペースを開いた状態：

![Antigravityでワークスペースを開いた状態](/n8n-advanced/module-06-antigravity-setup.png)

### ステップ3: ワークフローファイルの作成

新しいチャットが始まったら、以下のテキストをコピーして貼り付けます：

````
これよりInstagram自動投稿の環境構築を行います。
以下の内容で、`.agent/workflows/instagram_post_generation.md` というファイルを新規作成してください。

# Instagram Content Generation Workflow

This document defines the end-to-end workflow for generating high-quality Instagram Reels content about AI trends.

## Phase 1: Trend Discovery
**Objective:** Identify the Top 20 AI tools for the target month (e.g., December 2025) and gather video sources.

1.  **Select Tools:** Identify 20 trending AI tools based on social signals (YouTube, X).
2.  **Gather Video URLs:**
    *   Target detailed "Review" or "Tutorial" videos (10min+).
    *   **Fallback Strategy:** If a direct URL is unavailable (or for future simulation), use the format: `SEARCH: [Video Title Query]`.
3.  **Output:** `step1_trend_list.json`
    ```json
    {
      "month": "2025-12",
      "trends": [
        { "rank": 1, "tool_name": "ChatGPT Enterprise v5", "target_video_url": "SEARCH: ChatGPT v5 Full Tutorial" }
      ]
    }
    ```

## Phase 2: Deep Dive Research
**Objective:** Extract factual information, specs, and metrics for each tool.

1.  **Batch Processing:** Process tools in batches of 5 to prevent timeouts.
2.  **Extraction Logic:**
    *   Use Browser Subagent (or Search Web as fallback) to find capabilities, pros/cons, and metrics.
    *   **Validation:** Verify specific numbers (e.g., adoption rates) to avoid hallucinations.
3.  **Output:** `step2_knowledge_base_batch_X.json`
    ```json
    [
      {
        "tool_name": "ChatGPT Enterprise v5",
        "official_name": "...",
        "capabilities": [...],
        "pros": [...],
        "cons": [...],
        "metrics": ["92% of Fortune 500 companies", "1.1% hallucination rate"],
        "quotes": [...]
      }
    ]
    ```

## Phase 3: Content Expansion (Idea Generation)
**Objective:** Generate Instagram post ideas based strictly on Phase 2 data.

### 1. Input Source
- `step2_knowledge_base_batch_X.json`

### 2. Output Schema (Strict 17 Fields)
Each post idea MUST be a JSON object with EXACTLY these fields. No extra fields.

| Field | Type | Description |
|-------|------|-------------|
| `idea_id` | String | Unique ID (e.g., "IDEA-001"). |
| `month` | String | Target month (e.g., "2025-12"). |
| `title` | String | Catchy title for the post. |
| `category` | String | "A" (Versus), "B" (New Tech), "C" (How-to), "D" (Warning), "E" (Ranking). |
| `narration_1` | String | First half of the script/narration (approx 150 chars). |
| `narration_2` | String | Second half of the script/narration (approx 150 chars). |
| `thumb_main` | String | Main text for thumbnail image. |
| `thumb_sub` | String | Sub text/copy for thumbnail image. |
| `set_1` | String | Text for Slide 1 (Intro/Hook). |
| `set_2` | String | Text for Slide 2 (Point 1). |
| `set_3` | String | Text for Slide 3 (Point 2). |
| `set_4` | String | Text for Slide 4 (Point 3). |
| `set_5` | String | Text for Slide 5 (Conclusion). |
| `set_6` | String | Text for Slide 6 (CTA). |
| `main_tool` | String | The primary tool name discussed. |
| `status` | String | Always "draft". |
| `created_at` | String | Current ISO date (e.g. "2025-12-10"). |

### 3. Volume & Strategy
- **Goal:** Generate ~4-5 ideas PER TOOL (Total ~80+ ideas for 20 tools).
- **Strategy:**
    - **Category A (Versus):** Compare with a rival (e.g., ChatGPT vs Claude).
    - **Category B (New Tech):** Highlight a specific killer feature.
    - **Category C (How-to):** Step-by-step usage guide.
    - **Category D (Warning):** Discuss limitations or risks.
    - **Category E (Ranking):** Create a ranking post for the batch.

### 4. Tone Guidelines
- Benefit-oriented.
- Use explicit line breaks `\n` in slide text.
- **Forbidden Words:** "神", "魔法", "革命", "最強" (unless in "Ranking" context), "結論" (use sparsely).

### 5. JSON Example
```json
{
  "idea_id": "IDEA-001",
  "month": "2025-12",
  "title": "ChatGPT v5 vs Claude 3.5: エンジニアが選ぶべきは？",
  "category": "A",
  "narration_1": "2025年12月、AIの頂上決戦。ChatGPT Enterprise v5とClaude 3.5 Sonnet、どっちを使うべき？結論から言うと…",
  "narration_2": "推論と分析ならChatGPT。一方、実務と操作ならClaude。Computer UseでPC操作を代行。あなたの仕事に合わせて選びましょう。",
  "thumb_main": "ChatGPT v5 vs Claude 3.5",
  "thumb_sub": "2025年、どっち選ぶ？",
  "set_1": "【徹底比較】\nChatGPT v5 vs Claude 3.5\nエンジニアの正解は？",
  "set_2": "【ChatGPT v5】\n推論力と分析力が圧倒的。\nセキュリティも万全。",
  "set_3": "【Claude 3.5】\nComputer Use機能搭載。\nPC画面を直接操作可能。",
  "set_4": "【使い分け】\n脳を使う仕事はGPT。\n手を使う仕事はClaude。",
  "set_5": "【結論】\n両方使うのが\n最強のビジネスマン。",
  "set_6": "あなたのメインはどっち？\nコメントで投票して！",
  "main_tool": "ChatGPT Enterprise v5",
  "status": "draft",
  "created_at": "2025-12-10"
}
```
````

### チェックポイント

- [ ] `C:\Instagram_AI`フォルダを作成した
- [ ] Antigravityでフォルダを開いた
- [ ] ワークフローファイル作成のプロンプトを送信した

---

## セクション4: ワークフローの実行

### 実行手順

ワークフローファイルが作成されると、Antigravityが自動的に実行計画（Implementation Plan）を提示します。

実際の操作画面：

<video controls width="100%">
  <source src="/n8n-advanced/mv/research_workflow_compressed.mp4" type="video/mp4">
  お使いのブラウザは動画再生に対応していません。
</video>

### Implementation Planの確認

Antigravityが以下のような計画を提示します：

- **Phase 1**: `step1_trend_list.json`を作成（TOP 20ツール + YouTube URL）
- **Phase 2**: 4つのバッチでKnowledge Baseを作成
- **Phase 3**: 4つのバッチでInstagram投稿案を生成

Implementation Planの画面：

![Implementation Plan](/n8n-advanced/module-06-implementation-plan.png)

### 実行開始

計画を確認したら、**「Proceed」**ボタンを押して実行を開始します。

Proceedボタン：

![Proceedボタン](/n8n-advanced/module-06-proceed-button.png)

実行中の画面：

![実行中の画面](/n8n-advanced/module-06-execution.png)

### Phase 2完了時の画面

Phase 2が完了すると、4つのKnowledge Baseファイルが生成されます：

![Phase 2完了](/n8n-advanced/module-06-phase2-result.png)

生成されるファイル：
- `step2_knowledge_base_batch_1.json`（ツール1-5）
- `step2_knowledge_base_batch_2.json`（ツール6-10）
- `step2_knowledge_base_batch_3.json`（ツール11-15）
- `step2_knowledge_base_batch_4.json`（ツール16-20）

### Phase 3完了時の出力例

Phase 3が完了すると、各バッチから投稿案（ideas）が生成されます。以下は実際に生成された例です：

**生成件数（実績）**:
- Batch 1: 14件（IDEA-101〜114）
- Batch 2: 11件（IDEA-201〜211）
- Batch 3: 10件（IDEA-301〜310）
- Batch 4: 10件（IDEA-401〜410）
- **合計: 約45件**

**出力例（IDEA-101）**:

```json
{
  "idea_id": "IDEA-101",
  "month": "2025-12",
  "title": "ChatGPT v5 vs Claude 3.5: 2025年の覇権争い",
  "category": "A",
  "narration_1": "2025年、AIの頂上決戦。ChatGPT Enterprise v5とClaude 3.5 Sonnet、どっちを使うべき？結論から言うと「役割」が違います。",
  "narration_2": "推論と分析ならChatGPT。圧倒的なコンテキストとデータ分析力。一方、実務と操作ならClaude。Computer UseでPC操作を代行。あなたの仕事に合わせて選びましょう。",
  "thumb_main": "ChatGPT v5 vs Claude 3.5",
  "thumb_sub": "2025年、どっち選ぶ？",
  "set_1": "【徹底比較】\nChatGPT v5 vs Claude 3.5\nエンジニアの正解は？",
  "set_2": "【ChatGPT v5】\n推論力と分析力が最強。\n幻覚率1.1%の信頼性。\n分析業務ならこれ。",
  "set_3": "【Claude 3.5】\nComputer Use機能搭載。\nPC画面を直接操作可能。\n自動化ならこれ。",
  "set_4": "【使い分けの鍵】\n脳を使う仕事はGPT。\n手を使う仕事はClaude。",
  "set_5": "【結論】\n両方使うのが\n最強のビジネスマン。",
  "set_6": "あなたのメインはどっち？\nコメントで投票して！",
  "main_tool": "ChatGPT Enterprise v5",
  "status": "draft",
  "created_at": "2025-12-10"
}
```

**カテゴリ別の内容例**:

| カテゴリ | 内容例 |
|---------|--------|
| A (Versus) | ChatGPT v5 vs Claude 3.5: 2025年の覇権争い |
| B (New Tech) | ChatGPT v5の新機能「Dynamic Routing」とは？ |
| C (How-to) | Perplexity Proの使い方：モデル切り替え術 |
| D (Warning) | ChatGPT v5、企業導入での「落とし穴」 |
| E (Ranking) | 【総合ランキング】2025年冬、最強AIツールTOP5 |

### チェックポイント

- [ ] Implementation Planが表示された
- [ ] 内容を確認した
- [ ] Proceedを押して実行を開始した

---

## セクション5: 出力スキーマ

### ideas出力スキーマ（17列）

```json
[
  {
    "idea_id": "IDEA-001",
    "month": "2025-12",
    "title": "Title with strong hook",
    "category": "A",
    "narration_1": "First half of script (150-175 chars)",
    "narration_2": "Second half of script (150-175 chars)",
    "thumb_main": "Short trigger text (Max 8 chars)",
    "thumb_sub": "Sub text (Max 6 chars x 3 lines)",
    "set_1": "Slide 1 text (Max 14 chars x 3 lines)",
    "set_2": "Slide 2 text",
    "set_3": "Slide 3 text",
    "set_4": "Slide 4 text",
    "set_5": "Slide 5 text",
    "set_6": "Slide 6 text",
    "main_tool": "[Tool Name]",
    "status": "NEW",
    "created_at": "YYYY-MM-DD"
  }
]
```

### ideasシート列対応

| # | 列名 | JSONフィールド |
|---|------|---------------|
| 1 | idea_id | idea_id |
| 2 | month | month |
| 3 | title | title |
| 4 | category | category |
| 5 | narration_1 | narration_1 |
| 6 | narration_2 | narration_2 |
| 7 | thumb_main | thumb_main |
| 8 | thumb_sub | thumb_sub |
| 9 | set_1 | set_1 |
| 10 | set_2 | set_2 |
| 11 | set_3 | set_3 |
| 12 | set_4 | set_4 |
| 13 | set_5 | set_5 |
| 14 | set_6 | set_6 |
| 15 | main_tool | main_tool |
| 16 | status | status |
| 17 | created_at | created_at |

### チェックポイント

- [ ] 出力スキーマを理解した
- [ ] ideasシートの新しい列構成を理解した

---

## トラブルシューティング

### 動画にトランスクリプトがない場合

**症状**: 「文字起こしを表示」ボタンが見つからない

**解決方法**: 動画の説明文と上位10件のコメントを代わりに読み取るよう指示：

```
The video has no transcript. Instead, read the video description and the top 10 comments to extract feature names and user opinions.
```

### ツールが新しすぎてレビュー動画がない場合

**症状**: Phase 1で適切なYouTube URLが見つからない

**解決方法**: 公式ドキュメントのURLを代わりに使用：

```
No YouTube video found. Use the official documentation URL instead: [URL]
```

### バッチ処理がタイムアウトする場合

**症状**: 5ツール処理中にエラーが発生

**解決方法**: バッチサイズを3ツールに縮小して再実行

---

## まとめ

### このモジュールで学んだこと

- 従来のideas生成の問題点（ハルシネーション）
- Antigravityを使った3ステップワークフロー
- Browser Agentによる事実抽出手法
- バッチ処理による安定した大量コンテンツ生成

### 次のステップ

- GASのimportJsonToIdeas関数を新しい17列構成に対応させる
- Gemini APIをキャプション・ハッシュタグ生成専用に変更する

---

## 参考資料

- [Google Antigravity](https://idx.google.com/)

---

## よくある質問

**Q: 93件という目標件数はどうなりましたか？**
A: 固定件数から可変件数に変更しました。カテゴリA/D/Eは条件を満たさない場合スキップされるため、最終件数は実行結果によって変動します。

**Q: カテゴリEは何件生成されますか？**
A: 4バッチ × 1件 = 最大4件のランキング投稿が生成されます（各バッチ内の5ツールでランキング）。

**Q: START_IDの値はどう決めますか？**
A: Batch 1は001から開始。以降のバッチは、前バッチの最終ID+1から開始します。前バッチの生成件数を確認してから次のSTART_IDを決定してください。

**Q: 既存のModule 03のGASインポート機能はそのまま使えますか？**
A: いいえ。ideasシートの列構成が変更になるため、GASコードの更新が必要です。次のモジュールで対応します。

**Q: Gemini APIの役割は何に変わりますか？**
A: ナレーション・スライド生成は不要になり、キャプションとハッシュタグの生成のみを担当します。

**Q: Antigravityの実行にはどれくらい時間がかかりますか？**
A: Phase 1-3の合計で約60分程度です。バッチ処理のため、途中で中断しても再開可能です。
