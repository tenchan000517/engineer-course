# Instagram Content Generation Workflow: Execution Manual (v5)

## 1. Workflow Overview

A workflow for generating high-quality Instagram posts based on real trends from Japanese AI influencers.

- **Step 0: Initialization** (Create unique task directory for this run)
- **Step 1: Trend Discovery**
  - 1.1: Influencer Data Collection (Collect posts from 20 top Japanese AI influencers)
  - 1.2: Trend Aggregation (Rank TOP 20 tools by mention count)
- **Step 2: Deep Dive Research** (Create Knowledge Base from Top 10 videos)
- **Step 3: Content Expansion** (Generate 32 posts with fixed category allocation)
- **Step 4: Quality Assurance** (Validate all posts against strict quality criteria)

**Language Requirements:**
- Research Target: Japanese AI influencers (YouTube/X)
- Output Language: Natural Japanese (avoid translation-style expressions)

---

## 2. Step-by-Step Execution Guide

### Step 0: Initialization (Directory Setup)
**Goal:** Create a unique task directory to store all artifacts for this run.
**Naming Convention:** `YYYYMMDD_XX` (e.g., `20251211_01`)
**Root Path:** `C:\Instagram_AI\`

**Logic:**
1. **Get Current Date:** Format as `YYYYMMDD` (e.g., `20251211`).
2. **Scan Root:** List directories matching `YYYYMMDD_*`.
3. **Determine Suffix:**
   - If no match found -> `_01`
   - If matches found (e.g., `_01`, `_02`) -> `Max(_XX) + 1` (e.g., `_03`)
4. **Create Directory:** Create the new folder.
5. **Set Context:** Define `{{CURRENT_PROJECT_DIR}}` as this new path.
   - *All subsequent file operations (write/read) MUST use this path.*

**Action:**
- **Actor:** Antigravity (System)
- **Result:** New directory created (e.g., `C:\Instagram_AI\20251211_01\`).

---

### Step 1: Trend Discovery (Influencer-First Approach)
**Goal:** Identify TOP 20 trending tools
**Actor:** Antigravity (Research Mode)

---

#### Step 1.1: Influencer Identification & Data Collection
**Target:** 20 Top Japanese AI Influencers (YouTube/X).
**Selection Criteria:** High Posting Frequency, High Average Views, High Follower Count.
**Action:** Collect **ALL** posts within the search period.

##### Execution Method (CRITICAL - MUST FOLLOW)

Execute the following phases **in this exact order**.

**Phase 1: System Date Confirmation**
1. Confirm the current date from system metadata
2. Set search period: **Past 30 days from today**

**Phase 2: Influencer Identification**
1. Use Web Search to find "Japanese AI Influencer YouTube" or similar keywords (Web Search allowed)
2. Identify TOP 20 influencers from the latest sources (articles, rankings, etc.)
3. List each influencer's **name** (URL not required at this stage)

**Phase 3: Direct YouTube Access (Browser Operation REQUIRED)**

For each influencer identified in Phase 2:

1. Open browser and navigate to YouTube (youtube.com)
2. Enter **influencer name directly into YouTube's search bar**
3. From search results, identify the correct channel and **access the channel page**
4. From **channel top page**: Extract follower count
5. Navigate to **Videos tab** and **filter by past 30 days**
6. For each video, extract:
   - Title, upload date, URL, view count
   - Hook (catchy phrase)
   - Presentation style → Map to Category (A/B/C/D/E)
   - Mentioned tools (mentioned_tools)

**Prohibited Actions:**
- Using URLs directly from Web Search results (MUST go through YouTube's internal search)
- Simulating/generating/fabricating data when search yields no results
- If data cannot be retrieved: **Report to user and await instructions**

**Style & Category Mapping (CRITICAL):**
Classify each post's `presentation_style` into Categories A-E:
*   **Comparison** -> **Category A** (Versus)
*   **Ranking** -> **Category E** (Ranking)
*   **Warning** -> **Category D** (Warning)
*   **Hack / Secret** -> **Category C** (Novelty) or **B** (Efficiency)
*   **News / Update** -> **Category C** (Novelty)
*   **Tutorial** -> **Category B** (Instant Hack/How-to)

**Extraction Fields (Must be separate):**
- `title`: Full Post Title.
- `hook`: The "Catchy Phrase".
- `presentation_style`: Comparison, News, etc.
- `category`: **Mapped Category (A, B, C, D, E).**
- `url`: Direct Video URL.
- `metrics`: View Count & Follower Count.
- `mentioned_tools`: List of tools.

**Output:** `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`
   ```json
   {
     "month": "2025-12",
     "posts": [
       {
         "influencer": "Influencer Name",
         "date": "2025-12-10",
         "title": "Full YouTube/X Title",
         "hook": "Extracted Catchy Phrase",
         "presentation_style": "Comparison",
         "category": "A",
         "url": "https://...",
         "metrics": { "views": 15000, "followers": 50000 },
         "mentioned_tools": ["Claude 4.5", "Gemini 3"]
       }
     ]
   }
   ```

#### Step 1.2: Trend Aggregation (Ranking)
**Logic:**
1. **Extract Tools:** from `mentioned_tools`.
2. **Rank:** by Unique Influencer Count (x/20).
3. **Consolidate:** List the best representative URLs for each trend.
**Output:** `{{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json`
   ```json
   {
     "month": "2025-12",
     "trends": [
       {
         "rank": 1,
         "tool_name": "Claude 4.5",
         "mention_count": 18,
         "dominant_style": "Comparison",
         "target_urls": [
            { "url": "https://...", "style": "Comparison", "category": "A", "views": 15000 },
            { "url": "https://...", "style": "Hack", "category": "B", "views": 12000 }
         ]
       }
     ]
   }
   ```

---

### Step 2: Deep Dive Research (Execution)
**Goal:** Create a "Best of the Month" Knowledge Base (10 videos).
**Input:** `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json` (Raw Data Pool).

**Strategy (Global Category Selection):**
1.  **Pool Data:** Treat all posts in `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json` as one single dataset.
2.  **Group by Category:** Separate posts into 5 buckets: A(Comparison), B(Hack), C(Secret), D(Warning), E(Ranking).
3.  **Global Ranking:** Within each bucket, sort by Views & Follower Count.
4.  **Select Top 2:** Pick exactly the **Top 2 videos** from each bucket.
    *   Category A: Top 2
    *   Category B: Top 2
    *   Category C: Top 2
    *   Category D: Top 2
    *   Category E: Top 2
    *   **Total:** 10 Videos.

##### Execution Method (CRITICAL - MUST FOLLOW)

**Phase 1: Video Selection (No Browser Required)**
1. Load `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`
2. Group posts by Category (A/B/C/D/E)
3. Within each category, rank by views × followers
4. Select Top 2 videos from each category (Total: 10 videos)

**Phase 2: Direct YouTube Access (Browser Operation REQUIRED)**

For each of the 10 selected videos:

1. Open browser and navigate to the video URL from Step 1.1 data
2. Access the video page directly
3. Extract transcript/captions from the video
4. Summarize and structure into the required format (narration_1, narration_2, thumb_main, set_1-6, etc.)

**Prohibited Actions:**
- Guessing video content from title alone
- Generating transcript without actually accessing the video
- If transcript cannot be retrieved: **Report to user and await instructions**

**Constraint:** Text Only extraction.
**Output:** `{{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json` (Exactly 10 items).
   ```json
   {
     "month": "2025-12",
     "posts": [
       {
         "influencer": "Influencer Name",
         "date": "2025-12-10",
         "title": "Full YouTube/X Title",
         "hook": "Extracted Catchy Phrase",
         "presentation_style": "Comparison",
         "category": "A",
         "url": "https://...",
         "metrics": { "views": 15000, "followers": 50000 },
         "mentioned_tools": ["Claude 4.5", "Gemini 3"],
         "extracted_data": {
           "title": "動画の正確なタイトル",
           "narration_1": "前半150-175文字（文字起こし要約。メインメッセージ・論理構成を保持。口調は標準に統一。動画にない文章はNG）",
           "narration_2": "後半150-175文字（文字起こし要約。メインメッセージ・論理構成を保持。口調は標準に統一。動画にない文章はNG）",
           "thumb_main": "全角12文字以内の興味付け（煽り）",
           "thumb_sub": "全角6文字以内\n全角6文字以内\n全角6文字以内",
           "set_1": "全角14文字以内\n全角14文字以内\n全角14文字以内",
           "set_2": "全角14文字以内\n全角14文字以内\n全角14文字以内",
           "set_3": "全角14文字以内\n全角14文字以内\n全角14文字以内",
           "set_4": "全角14文字以内\n全角14文字以内\n全角14文字以内",
           "set_5": "全角14文字以内\n全角14文字以内\n全角14文字以内",
           "set_6": "全角14文字以内\n全角14文字以内\n全角14文字以内"
         }
       },
       // Special Schema for Category E (Ranking)
       {
         "category": "E",
         "extracted_data": {
           "title": "動画の正確なタイトル",
           "narration_1": "前半150-175文字（5位→3位紹介。文字起こし要約。口調は標準に統一。動画にない文章はNG）",
           "narration_2": "後半150-175文字（2位→1位紹介。文字起こし要約。口調は標準に統一。動画にない文章はNG）",
           "thumb_main": "全角12文字以内の疑問・煽りテキスト",
           "thumb_sub": "全角6文字以内（1行目）\n全角6文字以内（2行目）\n全角6文字以内（3行目）",
           "set_1": "フックとなる導入\nランキングのテーマ\n期待を高める一言",
           "set_2": "第5位\nツール名\nそのツールの特徴",
           "set_3": "第4位\nツール名\nそのツールの特徴",
           "set_4": "第3位\nツール名\nそのツールの特徴",
           "set_5": "第2位\nツール名\nそのツールの特徴",
           "set_6": "第1位\nツール名\nそのツールの特徴"
         }
       }
       // ... Total 10 items
     ]
   }
   ```

---

### Step 3: Content Expansion

  Goal: Generate exactly 32 High-Quality Posts

  Category Allocation (Fixed):
  | Category           | Count | Theme        |
  |--------------------|-------|--------------|
  | A (Versus)         | 8     | Comparison   |
  | B (Instant Hack)   | 6     | Time-saving  |
  | C (Secret Feature) | 6     | New features |
  | D (Warning)        | 6     | Risk alerts  |
  | E (Ranking)        | 6     | Rankings     |
  | Total              | 32    |              |

  Selection Logic:
  1. Category A: Select from {{CURRENT_PROJECT_DIR}}/step1_influencer_data.json where category: "A" (actual comparison pairs only)
  2. Category B/C/D: Select from {{CURRENT_PROJECT_DIR}}/step1_influencer_data.json by category, ranked by views × followers
  3. Category E: Use {{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json top tools

  Shortfall補完:
  - If total < 32: Add unused posts from {{CURRENT_PROJECT_DIR}}/step1_influencer_data.json (sorted by mention count)
  - Category imbalance is acceptable

  Actor: Antigravity or External LLM

  ---
  Instruction (Copy & Paste):

  あなたはInstagramリール投稿コンテンツを作成するプロフェッショナルです。
  以下の参考資料を元に、ハイクオリティな60秒動画用コンテンツを生成してください。

  # パラメータ
  - **Start ID**: {{START_ID}}
  - **Category**: {{CATEGORY}} (A / B / C / D / E)
  - **生成件数**: {{COUNT}}件

  # 参考資料（必ず参照すること）
  ## Step 1 インフルエンサーデータ
  {{STEP1_DATA_CONTEXT}}

  ## Step 2 Knowledge Base（お手本）
  {{STEP2_KNOWLEDGE_BASE_CONTEXT}}

  # 最重要指示（絶対厳守）

  1. 参考資料の内容を**元に**投稿を作成すること（丸写し禁止）
  2. 不足情報は**最新の情報を検索して補完**すること
  3. **古い情報は使用禁止**
  4. **事実と異なる情報は絶対禁止**
  5. **捏造・推測は絶対禁止**

  # カテゴリ別ルール（CRITICAL）

  ## Category A（Versus）専用ルール
  - **条件**: `step1_influencer_data.json` で**実際に比較されている組み合わせのみ**使用可能
  - **禁止**: 独立したツールを勝手に組み合わせて比較を作成すること
  - **構造**: ツールA強み → ツールB強み → 比較 → 使い分け → 結論
  - **結論**: 「こういう人はA、こういう人はB」と明確に線引き

  ## Category B（Instant Hack）専用ルール
  - **フォーカス**: 時間短縮、効率化
  - **フック**: 「まだ手作業でやってるの？」等の課題提起
  - **構造**: 課題 → 解決策 → 仕組み → ベネフィット → 結論

  ## Category C（Secret Feature）専用ルール
  - **フォーカス**: 新機能、知られていない機能
  - **フック**: 「まだ○○してるの？それ古いです」等の常識否定
  - **構造**: 従来否定 → 新機能概要 → 動作描写 → インパクト → 結論

  ## Category D（Warning）専用ルール
  - **フォーカス**: リスク、注意点、落とし穴
  - **フック**: 「警告します」「このままだとヤバいです」等
  - **構造**: 警告 → リスク1 → リスク2 → リスク3 → 対策 → 結論
  - **必須**: 単なる批判ではなく「賢い使い方」も提示

  ## Category E（Ranking）専用ルール
  - **条件**: `step1_trend_ranking.json` のTOP 5-10ツールを使用
  - **構造**: 5位→4位→3位→2位→1位のカウントダウン形式
  - **必須**: 各ツールは「名前」+「最強のメリット一言」のみ（ダラダラ説明禁止）
  - **必須**: 1位に最も時間を割く（約13秒）

  # 禁止事項（厳守）

  - 絵文字の使用（一切禁止）
  - 抽象的な表現（「便利」「凄い」「魔法」など）
  - 過激な表現（「〜を殺す」「〜は終わり」など）
  - 禁止ワード: 「神」「魔法」「革命」「最強」（証明がない限り）「結論」
  - 想像や推測で数値・スコアを生成すること
  - 比較対象の事例がないのに比較を作成すること

  # ナレーション制約

  - 合計300〜350文字（読み上げ60秒相当）
  - narration_1: 前半0:00-0:30（150-175文字）
  - narration_2: 後半0:30-1:00（150-175文字）
  - CTAは「コメント」「保存」への誘導のみ（プロフリンク禁止）

  # スライド制約

  - 各セット3行、各行全角14文字以内（厳守）
  - 英数字は半角2文字=全角1文字で換算
  - 改行は `\n` で表現

  # サムネイル制約

  - thumb_main: 全角12文字以内（疑問形または煽り）
  - thumb_sub: 6文字以内×3行（改行 `\n` 区切り）

  # 時系列対応（カテゴリA/B/C/D共通）

  - Set 1 (0:00-0:05): フック
  - Set 2 (0:05-0:15): ポイント1
  - Set 3 (0:15-0:25): ポイント2
  - Set 4 (0:25-0:35): ポイント3
  - Set 5 (0:35-0:45): ベネフィット/対策
  - Set 6 (0:45-0:55): 結論
  - CTA (0:55-1:00): 固定画像（生成不要）

  # 時系列対応（カテゴリE専用）

  - Set 1 (0:00-0:05): フック - ランキングテーマの提示
  - Set 2 (0:05-0:12): 第5位 - ツール名と特徴
  - Set 3 (0:12-0:20): 第4位 - ツール名と特徴
  - Set 4 (0:20-0:28): 第3位 - ツール名と特徴
  - Set 5 (0:28-0:37): 第2位 - ツール名と特徴
  - Set 6 (0:37-0:50): 第1位 - ツール名と特徴（長め）
  - CTA (0:50-1:00): 固定画像（生成不要）

  # キャプションテンプレート

  [共感の一言]

  @ten_urushibata ← 他の投稿はこちら
  ━━━━━━━━━━━━━━━━━━━━

  ▶ [見出し1]
  [解説]

  ▶ [見出し2]
  ① [ポイント1と具体的な解説]
  ② [ポイント2と具体的な解説]
  ③ [ポイント3と具体的な解説]

  ▶ [見出し3]
  [まとめ]

  ━━━━━━━━━━━━━━━━━━━━
  「自分には何もない」から
  「自分にはこれがある」が見つかるコミュニティ

  最初は誰でも初心者。
  ここで見つけた「得意」が、人生を変えるきっかけになる。

  一人で頑張るより、みんなで挑戦する方が圧倒的に早く成長できる。

  プロフィール欄のURLからお気軽にご参加ください！

  @ten_urushibata

  ━━━━━━━━━━━━━━━━━━━━

  いいね・コメント・シェアありがとうございます！
  保存して後で見返すと便利です

  天ちゃん|0から始めるエンジニア生活

  \ AIを活用して、自分らしい人生を /
  ▶︎ 0からでもできる。AIとの付き合い方
  ▶︎ 仕事も暮らしも、AIで豊かに
  ▶︎ 漫画と図解でわかりやすく発信
  Voicy「0から始めるエンジニア生活」

  ━━━━━━━━━━━━━━━━━━━━

  [ハッシュタグ5個]

  # 出力形式（JSON）

  以下のJSON形式で出力してください。他の文字は含めないでください。

  [
    {
      "idea_id": "IDEA-{{START_ID}}",
      "month": "2025-12",
      "category": "{{CATEGORY}}",
      "title": "（フック付きタイトル）",
      "narration_1": "（0:00-0:30のナレーション 150-175文字）",
      "narration_2": "（0:30-1:00のナレーション 150-175文字）",
      "thumb_main": "（全角12文字以内）",
      "thumb_sub": "（6文字以内）\n（6文字以内）\n（6文字以内）",
      "set_1": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "set_2": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "set_3": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "set_4": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "set_5": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "set_6": "（1行目14文字以内）\n（2行目14文字以内）\n（3行目14文字以内）",
      "main_tool": "（メインツール名）",
      "caption": "（キャプション全文）",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5"],
      "status": "NEW",
      "created_at": "YYYY-MM-DD"
    }
  ]

  ---
  実行手順:

  1. Category A を生成
    - {{START_ID}}: 001
    - {{CATEGORY}}: A
    - {{COUNT}}: 8
    - 参考資料: {{CURRENT_PROJECT_DIR}}/step1_influencer_data.json の category: "A" + {{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json
  2. Category B を生成
    - {{START_ID}}: 009
    - {{CATEGORY}}: B
    - {{COUNT}}: 6
  3. Category C を生成
    - {{START_ID}}: 015
    - {{CATEGORY}}: C
    - {{COUNT}}: 6
  4. Category D を生成
    - {{START_ID}}: 021
    - {{CATEGORY}}: D
    - {{COUNT}}: 6
  5. Category E を生成
    - {{START_ID}}: 027
    - {{CATEGORY}}: E
    - {{COUNT}}: 6
    - 参考資料: {{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json + {{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json
  6. 補完（32件未満の場合）
    - 未使用投稿から言及数上位を選出
    - 該当categoryに追加

---

### Step 4: Quality Assurance (Validation)

**Goal:** Validate all 32 generated posts against strict quality criteria before publishing.
**Input:** `{{CURRENT_PROJECT_DIR}}/instagram_ideas.json` (32 posts from Step 3)
**Actor:** Antigravity or External LLM

**Output:** `{{CURRENT_PROJECT_DIR}}/quality_check_report.json`

---

#### 4.1 Validation Categories

**PRE-CHECK (Volume Validation - Must Pass Before Individual Checks):**
| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| P-01 | Total Count | Exactly 32 posts | HALT (return to Step 3) |
| P-02 | Category Distribution | All posts have valid category (A, B, C, D, or E) | HALT |
| P-03 | No Duplicates | No duplicate idea_id values | HALT |
| P-04 | ID Sequence | idea_id must be sequential (IDEA-001 to IDEA-032) | WARN |

**Note:** Category imbalance is acceptable (e.g., A:12, B:8, C:5, D:4, E:3 = 32 total is OK).

**CRITICAL (Must Pass - Auto Reject if Failed):**
| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| C-01 | Factual Accuracy | No fabricated facts, stats, or claims not in source data | REJECT |
| C-02 | Tool Name Integrity | Tool names must match exactly with Step 1 data (no modifications) | REJECT |
| C-03 | Comparison Validity | Category A posts must use actual comparison pairs from Step 1 (no invented comparisons) | REJECT |
| C-04 | Source Traceability | All claims must be traceable to Step 2 Knowledge Base | REJECT |
| C-05 | No Hallucination | No benchmark scores, percentages, or metrics unless from source | REJECT |

**HIGH (Should Pass - Flag for Review):**
| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| H-01 | Emoji Ban | Zero emojis in all fields (narration, slides, caption, thumbnail) | FLAG |
| H-02 | Forbidden Words | No use of: 神, 魔法, 革命, 最強 (unless proven), 結論 | FLAG |
| H-03 | Forbidden Expressions | No abstract terms: 便利, 凄い, すごい, 素晴らしい | FLAG |
| H-04 | No Violent Language | No expressions like: 〜を殺す, 〜は終わり, 〜はオワコン | FLAG |
| H-05 | Natural Japanese | No translation-style expressions (翻訳調禁止) | FLAG |

**MEDIUM (Character Limits - Flag if Exceeded):**
| Check ID | Field | Limit | Tolerance | Action |
|----------|-------|-------|-----------|--------|
| M-01 | narration_1 | 150-175 chars | ±10 chars | FLAG |
| M-02 | narration_2 | 150-175 chars | ±10 chars | FLAG |
| M-03 | narration_1 + narration_2 | 300-350 chars | ±20 chars | FLAG |
| M-04 | thumb_main | 全角12 chars | 0 tolerance | FLAG |
| M-05 | thumb_sub (each line) | 全角6 chars | 0 tolerance | FLAG |
| M-06 | set_1 to set_6 (each line) | 全角14 chars | +2 chars | FLAG |
| M-07 | thumb_sub | Exactly 3 lines | 0 tolerance | FLAG |
| M-08 | set_1 to set_6 | Exactly 3 lines each | 0 tolerance | FLAG |

**LOW (Structure Checks - Log Only):**
| Check ID | Category | Rule | Action |
|----------|----------|------|--------|
| L-01 | JSON Validity | Valid JSON structure | LOG |
| L-02 | Required Fields | All required fields present | LOG |
| L-03 | ID Format | idea_id follows IDEA-XXX pattern | LOG |
| L-04 | Category Value | category is A, B, C, D, or E | LOG |
| L-05 | Hashtag Count | Exactly 5 hashtags | LOG |
| L-06 | Date Format | created_at is YYYY-MM-DD | LOG |

---

#### 4.2 Category-Specific Validation

**Category A (Versus) Additional Checks:**
| Check ID | Rule |
|----------|------|
| A-01 | Comparison pair exists in `step1_influencer_data.json` with `category: "A"` |
| A-02 | Both tools mentioned in `mentioned_tools` array |
| A-03 | Narration includes clear distinction: 「こういう人はA、こういう人はB」 |
| A-04 | Set structure follows: Hook → Tool A → Tool B → Compare → Use Case → Conclusion |

**Category B (Instant Hack) Additional Checks:**
| Check ID | Rule |
|----------|------|
| B-01 | Hook addresses a pain point (課題提起) |
| B-02 | Time-saving benefit is explicitly stated |
| B-03 | Set structure follows: Pain → Solution → Mechanism → Benefit → Conclusion |

**Category C (Secret Feature) Additional Checks:**
| Check ID | Rule |
|----------|------|
| C-01 | Hook challenges conventional wisdom (常識否定) |
| C-02 | New/unknown feature is clearly described |
| C-03 | Set structure follows: Old Way → New Feature → Demo → Impact → Conclusion |

**Category D (Warning) Additional Checks:**
| Check ID | Rule |
|----------|------|
| D-01 | At least 3 specific risks mentioned |
| D-02 | Countermeasure/smart usage is provided (not just criticism) |
| D-03 | Set structure follows: Warning → Risk1 → Risk2 → Risk3 → Solution → Mindset |

**Category E (Ranking) Additional Checks:**
| Check ID | Rule |
|----------|------|
| E-01 | Exactly 5 tools ranked (5位→1位) |
| E-02 | Tools are from `step1_trend_ranking.json` top 10 |
| E-03 | Each tool has name + one key benefit only (no long explanations) |
| E-04 | 1位 gets longest description (Set 6) |
| E-05 | Countdown format: Set2=5位, Set3=4位, Set4=3位, Set5=2位, Set6=1位 |

---

#### 4.3 Character Count Rules (Japanese)

**Counting Method:**
- 全角文字 (Hiragana, Katakana, Kanji, Full-width symbols): 1 char
- 半角英数字 (A-Z, a-z, 0-9): 0.5 char (2 half-width = 1 full-width)
- 半角記号 (!, ?, ., etc.): 0.5 char
- 改行 `\n`: Not counted

**Examples:**
```
"Claude vs GPT" = 5 + 1 + 1.5 + 1 + 1.5 = 10 full-width equivalent
"AIツール比較" = 1 + 1 + 4 = 6 chars
"最強はどっち？" = 7 chars
```

---

#### 4.4 Validation Process

**Execution Flow:**
```
{{CURRENT_PROJECT_DIR}}/instagram_ideas.json (32 posts)
                    ↓
          ┌────────────────────┐
          │  For each post:    │
          │  1. CRITICAL checks│
          │  2. HIGH checks    │
          │  3. MEDIUM checks  │
          │  4. Category checks│
          │  5. LOW checks     │
          └────────────────────┘
                    ↓
          ┌────────────────────┐
          │  Aggregate Results │
          │  - PASS count      │
          │  - REJECT count    │
          │  - FLAG count      │
          └────────────────────┘
                    ↓
          quality_check_report.json
```

**Decision Matrix:**
| CRITICAL Fails | HIGH Flags | Action |
|----------------|------------|--------|
| ≥1 | Any | REJECT post, require regeneration |
| 0 | ≥3 | FLAG for manual review |
| 0 | 1-2 | AUTO-FIX if possible, else FLAG |
| 0 | 0 | PASS |

---

#### 4.5 Output Schema

```json
{
  "report_date": "2025-12-11",
  "total_posts": 32,
  "summary": {
    "passed": 28,
    "flagged": 3,
    "rejected": 1
  },
  "posts": [
    {
      "idea_id": "IDEA-001",
      "category": "A",
      "status": "PASSED",
      "critical_checks": {
        "C-01": { "status": "PASS", "detail": null },
        "C-02": { "status": "PASS", "detail": null },
        "C-03": { "status": "PASS", "detail": null },
        "C-04": { "status": "PASS", "detail": null },
        "C-05": { "status": "PASS", "detail": null }
      },
      "high_checks": {
        "H-01": { "status": "PASS", "detail": null },
        "H-02": { "status": "PASS", "detail": null },
        "H-03": { "status": "FAIL", "detail": "Found: 便利 in narration_1" },
        "H-04": { "status": "PASS", "detail": null },
        "H-05": { "status": "PASS", "detail": null }
      },
      "medium_checks": {
        "M-01": { "status": "PASS", "value": 168, "limit": "150-175" },
        "M-02": { "status": "PASS", "value": 172, "limit": "150-175" },
        "M-03": { "status": "PASS", "value": 340, "limit": "300-350" },
        "M-04": { "status": "PASS", "value": 8, "limit": 12 },
        "M-05": { "status": "PASS", "value": [5, 6, 4], "limit": 6 },
        "M-06": { "status": "FLAG", "value": { "set_3_line_2": 16 }, "limit": 14, "tolerance": 2 }
      },
      "category_checks": {
        "A-01": { "status": "PASS", "detail": null },
        "A-02": { "status": "PASS", "detail": null },
        "A-03": { "status": "PASS", "detail": null },
        "A-04": { "status": "PASS", "detail": null }
      },
      "issues": [
        {
          "severity": "HIGH",
          "check_id": "H-03",
          "field": "narration_1",
          "message": "禁止表現「便利」が含まれています",
          "suggestion": "具体的なベネフィットに置き換えてください"
        }
      ],
      "auto_fixable": true,
      "fix_suggestions": [
        {
          "field": "narration_1",
          "original": "...とても便利です...",
          "suggested": "...作業時間を半分に短縮できます..."
        }
      ]
    },
    {
      "idea_id": "IDEA-002",
      "category": "A",
      "status": "REJECTED",
      "critical_checks": {
        "C-03": { "status": "FAIL", "detail": "Comparison pair 'Tool X vs Tool Y' not found in step1_influencer_data.json" }
      },
      "rejection_reason": "比較ペアがStep 1のデータに存在しません。実際に比較されている組み合わせのみ使用可能です。",
      "required_action": "REGENERATE with valid comparison pair from step1_influencer_data.json"
    }
  ],
  "regeneration_required": ["IDEA-002"],
  "manual_review_required": ["IDEA-015", "IDEA-023", "IDEA-029"]
}
```

---

#### 4.6 Validation Instruction (Copy & Paste)

```text
あなたは品質検証のエキスパートです。
以下の32件のInstagram投稿データを、厳格な品質基準に基づいて検証してください。

# 入力データ
{{INSTAGRAM_IDEAS_JSON}}

# 参照データ（ソース確認用）
## Step 1 インフルエンサーデータ
{{STEP1_DATA_CONTEXT}}

## Step 2 Knowledge Base
{{STEP2_KNOWLEDGE_BASE_CONTEXT}}

# 検証基準

## CRITICAL（1つでも失敗 → REJECT）
- C-01: 事実の捏造がないか（ソースデータにない情報を生成していないか）
- C-02: ツール名が入力データと完全一致しているか
- C-03: Category Aの比較ペアがStep 1に実在するか
- C-04: 全ての主張がStep 2 Knowledge Baseに遡れるか
- C-05: 数値・スコア・パーセンテージの捏造がないか

## HIGH（3つ以上失敗 → FLAG）
- H-01: 絵文字が含まれていないか（全フィールド）
- H-02: 禁止ワード（神, 魔法, 革命, 最強, 結論）がないか
- H-03: 抽象的表現（便利, 凄い, すごい, 素晴らしい）がないか
- H-04: 過激表現（〜を殺す, 〜は終わり, 〜はオワコン）がないか
- H-05: 翻訳調の不自然な日本語がないか

## MEDIUM（文字数チェック）
- M-01: narration_1 = 150-175文字（±10許容）
- M-02: narration_2 = 150-175文字（±10許容）
- M-03: narration合計 = 300-350文字（±20許容）
- M-04: thumb_main ≤ 全角12文字
- M-05: thumb_sub = 各行全角6文字以内 × 3行
- M-06: set_1〜set_6 = 各行全角14文字以内 × 3行（+2文字許容）

## カテゴリ別チェック
カテゴリに応じた構造・内容の検証を実施。

# 文字数カウントルール
- 全角文字: 1カウント
- 半角英数字: 0.5カウント（2文字で1全角相当）
- 改行(\n): カウントしない

# 出力形式
quality_check_report.json のスキーマに従って出力してください。
```

---

#### 4.7 Post-Validation Actions

**If REJECTED posts exist:**
1. Return to Step 3 with specific error details
2. Regenerate only the rejected posts
3. Re-run Step 4 validation

**If FLAGGED posts exist:**
1. Review flagged issues
2. Apply auto-fix suggestions if available
3. Manual correction if auto-fix not possible
4. Re-run Step 4 validation

**If all PASSED:**
1. Export `{{CURRENT_PROJECT_DIR}}/instagram_ideas_validated.json`
2. Proceed to publishing workflow
