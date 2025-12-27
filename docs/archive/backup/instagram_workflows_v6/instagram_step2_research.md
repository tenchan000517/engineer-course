# Step 2: Deep Dive Research

> Part of Instagram Content Generation Workflow v6
> See also: `instagram_post_generation.md` (Step 0-1), `instagram_step3_expansion.md`, `instagram_step4_validation.md`

---

## Pre-Execution Checklist (MANDATORY)

**Before starting Step 2, verify ALL of the following:**

| # | Check Item | Criteria |
|---|------------|----------|
| 1 | Step 1 Completed | All 14 influencers have been researched |
| 2 | Input File Exists | `step1_influencer_data.json` contains data for all 14 influencers |
| 3 | No Simulated Data | ALL Step 1 data was obtained from actual YouTube access |
| 4 | Selection Logic Confirmed | Video selection is by **Category (A/B/C/D/E)**, NOT by tool/trend name |

### If Any Check Fails
- **DO NOT proceed with Step 2**
- **Return to Step 1** and complete the missing work
- Report issue to user and await instructions

---

## Goal
Extract real information from YouTube videos for the top trends using browser automation. **NO SIMULATION ALLOWED.**

Create a "Best of the Month" Knowledge Base (10 videos).

## Input
- `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json` (Raw Data Pool from Step 1)

## Critical Rules

| Rule | Description |
|------|-------------|
| Strict Browser Usage | Must visit actual YouTube URLs |
| Watch Videos | Must watch videos to understand actual content |
| No Simulation | Title-only inference, fake content generation, Python simulation scripts are PROHIBITED |
| Error Handling | If a video cannot be watched, report it and **STOP** |

---

## Strategy (Global Category Selection)

1. **Pool Data:** Treat all posts in `step1_influencer_data.json` as one single dataset.
2. **Group by Category:** Separate posts into 5 buckets: A(Comparison), B(Hack), C(Secret), D(Warning), E(Ranking).
3. **Global Ranking:** Within each bucket, sort by Views × Follower Count.
4. **Select Top 2:** Pick exactly the **Top 2 videos** from each bucket.
   - Category A: Top 2
   - Category B: Top 2
   - Category C: Top 2
   - Category D: Top 2
   - Category E: Top 2
   - **Total:** 10 Videos.

---

## Execution Method (CRITICAL - MUST FOLLOW)

### Phase 1: Video Selection (No Browser Required)
1. Load `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`
2. Group posts by Category (A/B/C/D/E)
3. Within each category, rank by views × followers
4. Select Top 2 videos from each category (Total: 10 videos)

### Phase 2: Direct YouTube Access & Video Viewing (Browser Operation REQUIRED)

For each of the 10 selected videos:

1. **Open browser** and navigate to the video URL from Step 1.1 data
2. **Watch the video** to understand the actual content
   - Pay attention to: Main message, key points, tool demonstrations, recommendations
   - Note the structure: How the video opens, develops arguments, and concludes
3. **Extract information** based on what you watched:
   - narration_1: Summarize the first half of the video content (what was actually said)
   - narration_2: Summarize the second half of the video content (what was actually said)
   - thumb_main, thumb_sub: Create based on the video's actual hook/appeal
   - set_1-6: Structure based on the video's actual flow and key points
4. **Verify accuracy**: Ensure all extracted data reflects the actual video content

**Important:** The extracted data must be based on **what you actually saw and heard in the video**, not inferred from the title or description alone.

### Prohibited Actions (CRITICAL - Zero Tolerance)

The following actions are **strictly prohibited**:

| Prohibited Action | Description |
|-------------------|-------------|
| Title-Only Inference | Guessing video content based on title alone without watching the video |
| Fake Content Generation | Creating summaries without actually watching the video |
| Python Script Workarounds | Writing scripts that generate simulated data (e.g., template-based summaries) |
| Template Filling | Using generic phrases like "Key points include: High efficiency, easy integration..." |
| Description-Only Extraction | Using only video description/metadata without watching |

**Example of PROHIBITED code:**
```python
# THIS IS PROHIBITED - DO NOT DO THIS
transcript_summary = f"Transcript Summary for {post['title']}: " \
                     f"The video discusses {trend} and its impact. " \
                     f"Key points include: High efficiency, easy integration..."
```

**If video cannot be watched (error, region lock, etc.):**
1. Report the specific video URL and error to the user
2. Select **Option 3: Stop**
3. Await further instructions
4. **DO NOT generate simulated content as a workaround**

---

## Output

**File:** `{{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json` (Exactly 10 items)

**Constraint:** Text Only extraction.

### Schema (Category A/B/C/D)

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
    }
  ]
}
```

### Schema (Category E - Ranking)

```json
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
```

---

## Next Step
Proceed to Step 3: Content Expansion (`instagram_step3_expansion.md`)
