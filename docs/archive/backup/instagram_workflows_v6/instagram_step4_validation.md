# Step 4: Quality Assurance (Validation)

> Part of Instagram Content Generation Workflow v6
> See also: `instagram_post_generation.md` (Step 0-1), `instagram_step2_research.md`, `instagram_step3_expansion.md`

---

## Goal
Validate all 32 generated posts against strict quality criteria before publishing.

## Input
`{{CURRENT_PROJECT_DIR}}/instagram_ideas.json` (32 posts from Step 3)

## Output
`{{CURRENT_PROJECT_DIR}}/quality_check_report.json`

**Actor:** Antigravity or External LLM

---

## 4.1 Validation Categories

### PRE-CHECK (Volume Validation - Must Pass Before Individual Checks)

| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| P-01 | Total Count | Exactly 32 posts | HALT (return to Step 3) |
| P-02 | Category Distribution | All posts have valid category (A, B, C, D, or E) | HALT |
| P-03 | No Duplicates | No duplicate idea_id values | HALT |
| P-04 | ID Sequence | idea_id must be sequential (IDEA-001 to IDEA-032) | WARN |

**Note:** Category imbalance is acceptable (e.g., A:12, B:8, C:5, D:4, E:3 = 32 total is OK).

### CRITICAL (Must Pass - Auto Reject if Failed)

| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| C-01 | Factual Accuracy | No fabricated facts, stats, or claims not in source data | REJECT |
| C-02 | Tool Name Integrity | Tool names must match exactly with Step 1 data (no modifications) | REJECT |
| C-03 | Comparison Validity | Category A posts must use actual comparison pairs from Step 1 (no invented comparisons) | REJECT |
| C-04 | Source Traceability | All claims must be traceable to Step 2 Knowledge Base | REJECT |
| C-05 | No Hallucination | No benchmark scores, percentages, or metrics unless from source | REJECT |
| C-06 | No Tool Name Generalization | Specific tool names must NOT be simplified to generic names (e.g., "Google Nanobanana" → "Google", "Gemini 3.0" → "Gemini", "Claude Opus 4.5" → "Claude" is PROHIBITED). Always use the full specific name from source | REJECT |

### HIGH (Should Pass - Flag for Review)

| Check ID | Category | Rule | Action on Fail |
|----------|----------|------|----------------|
| H-01 | Emoji Ban | Zero emojis in all fields (narration, slides, caption, thumbnail) | FLAG |
| H-02 | Forbidden Words | No use of: 神, 魔法, 革命, 最強 (unless proven), 結論 | FLAG |
| H-03 | Forbidden Expressions | No abstract terms: 便利, 凄い, すごい, 素晴らしい | FLAG |
| H-04 | No Violent Language | No expressions like: 〜を殺す, 〜は終わり, 〜はオワコン | FLAG |
| H-05 | Natural Japanese | No translation-style expressions (翻訳調禁止) | FLAG |

### MEDIUM (Character Limits - Flag if Exceeded)

| Check ID | Field | Limit | Tolerance | Action |
|----------|-------|-------|-----------|--------|
| M-01 | narration_1 | 150-175 chars | ±10 chars | FLAG |
| M-02 | narration_2 | 150-175 chars | ±10 chars | FLAG |
| M-03 | narration_1 + narration_2 | 300-350 chars | ±20 chars | FLAG |
| M-04 | thumb_main | 全角12 chars | 0 tolerance | FLAG |
| M-05 | thumb_sub (each line) | 全角6 chars | 0 tolerance | FLAG |
| M-06 | set_1 to set_6 (each line) | 全角14 chars (or 22 half-width chars if all half-width) | +2 chars | FLAG |
| M-07 | thumb_sub | Exactly 3 lines | 0 tolerance | FLAG |
| M-08 | set_1 to set_6 | Exactly 3 lines each | 0 tolerance | FLAG |

### LOW (Structure Checks - Log Only)

| Check ID | Category | Rule | Action |
|----------|----------|------|--------|
| L-01 | JSON Validity | Valid JSON structure | LOG |
| L-02 | Required Fields | All required fields present | LOG |
| L-03 | ID Format | idea_id follows IDEA-XXX pattern | LOG |
| L-04 | Category Value | category is A, B, C, D, or E | LOG |
| L-05 | Hashtag Count | Exactly 5 hashtags | LOG |
| L-06 | Date Format | created_at is YYYY-MM-DD | LOG |

---

## 4.2 Category-Specific Validation

### Category A (Versus) Additional Checks

| Check ID | Rule |
|----------|------|
| A-01 | Comparison pair exists in `step1_influencer_data.json` with `category: "A"` |
| A-02 | Both tools mentioned in `mentioned_tools` array |
| A-03 | Narration includes clear distinction: 「こういう人はA、こういう人はB」 |
| A-04 | Set structure follows: Hook → Tool A → Tool B → Compare → Use Case → Conclusion |

### Category B (Instant Hack) Additional Checks

| Check ID | Rule |
|----------|------|
| B-01 | Hook addresses a pain point (課題提起) |
| B-02 | Time-saving benefit is explicitly stated |
| B-03 | Set structure follows: Pain → Solution → Mechanism → Benefit → Conclusion |

### Category C (Secret Feature) Additional Checks

| Check ID | Rule |
|----------|------|
| C-01 | Hook challenges conventional wisdom (常識否定) |
| C-02 | New/unknown feature is clearly described |
| C-03 | Set structure follows: Old Way → New Feature → Demo → Impact → Conclusion |

### Category D (Warning) Additional Checks

| Check ID | Rule |
|----------|------|
| D-01 | At least 3 specific risks mentioned |
| D-02 | Countermeasure/smart usage is provided (not just criticism) |
| D-03 | Set structure follows: Warning → Risk1 → Risk2 → Risk3 → Solution → Mindset |

### Category E (Ranking) Additional Checks

| Check ID | Rule |
|----------|------|
| E-01 | Exactly 5 tools ranked (5位→1位) |
| E-02 | Tools are from `step1_trend_ranking.json` top 10 |
| E-03 | Each tool has name + one key benefit only (no long explanations) |
| E-04 | 1位 gets longest description (Set 6) |
| E-05 | Countdown format: Set2=5位, Set3=4位, Set4=3位, Set5=2位, Set6=1位 |
| E-06 | Tool Relevance: All ranked tools must be in `step1_trend_ranking.json` mention count ranking. If not found, verify the tool actually exists (no fabricated tools) |

---

## 4.3 Character Count Rules (Japanese)

### Counting Method
- 全角文字 (Hiragana, Katakana, Kanji, Full-width symbols): 1 char
- 半角英数字 (A-Z, a-z, 0-9): 0.5 char (2 half-width = 1 full-width)
- 半角記号 (!, ?, ., etc.): 0.5 char
- 改行 `\n`: Not counted

### Examples
```
"Claude vs GPT" = 5 + 1 + 1.5 + 1 + 1.5 = 10 full-width equivalent
"AIツール比較" = 1 + 1 + 4 = 6 chars
"最強はどっち？" = 7 chars
```

---

## 4.4 Validation Process

### Execution Flow
```
instagram_ideas.json (32 posts)
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

### Decision Matrix

| CRITICAL Fails | HIGH Flags | Action |
|----------------|------------|--------|
| ≥1 | Any | REJECT post, require regeneration |
| 0 | ≥3 | FLAG for manual review |
| 0 | 1-2 | AUTO-FIX if possible, else FLAG |
| 0 | 0 | PASS |

---

## 4.5 Output Schema

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

## 4.6 Validation Instruction (Copy & Paste)

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

## 4.7 Post-Validation Actions

### If REJECTED posts exist:
1. Return to Step 3 with specific error details
2. Regenerate only the rejected posts
3. Re-run Step 4 validation

### If FLAGGED posts exist:
1. Review flagged issues
2. Apply auto-fix suggestions if available
3. Manual correction if auto-fix not possible
4. Re-run Step 4 validation

### If all PASSED:
1. Export `{{CURRENT_PROJECT_DIR}}/instagram_ideas_validated.json`
2. Proceed to publishing workflow
