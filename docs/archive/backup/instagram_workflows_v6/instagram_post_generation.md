# Instagram Content Generation Workflow: Execution Manual (v6)

## 1. Workflow Overview

A workflow for generating high-quality Instagram posts based on real trends from Japanese AI influencers.

| Step | File | Description |
|------|------|-------------|
| 0 | This file | Initialization (Create task directory) |
| 1 | This file | Trend Discovery (Collect data from 14 influencers) |
| 2 | `instagram_step2_research.md` | Deep Dive Research (Knowledge Base from Top 10 videos) |
| 3 | `instagram_step3_expansion.md` | Content Expansion (Generate 32 posts) |
| 4 | `instagram_step4_validation.md` | Quality Assurance (Validate posts) |

**Language Requirements:**
- Research Target: Japanese AI influencers (YouTube)
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

**Target:** 14 Top Japanese AI Influencers (YouTube).
**Selection Criteria:** High Posting Frequency, High Average Views, High Follower Count.
**Action:** Collect **ALL** posts within the search period.

##### Pre-defined Influencer List (TOP 14)

| # | Name | YouTube URL |
|---|------|-------------|
| 1 | チャエン | https://www.youtube.com/@chaen-ai-lab |
| 2 | 木内翔大（SHIFT AI） | https://www.youtube.com/@SHIFT-AI_kiuchiAI |
| 3 | mikimiki | https://www.youtube.com/@mikimikiweb |
| 4 | AI まさおう | https://www.youtube.com/@ai_masaou |
| 5 | AIサボロー | https://www.youtube.com/@ai-saborou |
| 6 | KEITO | https://www.youtube.com/@keitoaiweb |
| 7 | Google School | https://www.youtube.com/@google-school |
| 8 | あずきチャンネル | https://www.youtube.com/@azukichannel3 |
| 9 | AIたろう | https://www.youtube.com/@AItaro61 |
| 10 | AI_aaafrog | https://www.youtube.com/@AI_aaafrog |
| 11 | AIAIChatGPT | https://www.youtube.com/@AIAIChatGPT-cj4sh |
| 12 | いけとも | https://www.youtube.com/@iketomo-ch |
| 13 | 松井健太 | https://www.youtube.com/@kentamatsui |
| 14 | AIVTuber | https://www.youtube.com/@aivtuber2866 |

##### Execution Method (CRITICAL - MUST FOLLOW)

Execute the following phases **in this exact order**.

**Phase 1: System Date Confirmation**
1. Confirm the current date from system metadata
2. Set search period: **Past 30 days from today**

**Phase 2: Direct YouTube Access (Browser Operation REQUIRED)**

For each influencer in the Pre-defined Influencer List:

1. Open browser and navigate to the YouTube URL directly
2. From **channel top page**: Extract follower count
3. Navigate to **Videos tab** and **filter by past 30 days**
4. For each video, extract:
   - Title, upload date, URL, view count
   - Hook (catchy phrase)
   - Presentation style → Map to Category (A/B/C/D/E)
   - Mentioned tools (mentioned_tools)

**Prohibited Actions:**
- Simulating/generating/fabricating data when search yields no results
- If data cannot be retrieved: **Report to user and await instructions**

**Phase 3: Progress Tracking & Loop (MANDATORY)**

**Create a tracking file** at the start of Step 1.1:

**File:** `{{CURRENT_PROJECT_DIR}}/step1_progress.json`

```json
{
  "influencers": {
    "チャエン": { "status": "pending", "videos_collected": 0 },
    "木内翔大": { "status": "pending", "videos_collected": 0 },
    "mikimiki": { "status": "pending", "videos_collected": 0 },
    "AI まさおう": { "status": "pending", "videos_collected": 0 },
    "AIサボロー": { "status": "pending", "videos_collected": 0 },
    "KEITO": { "status": "pending", "videos_collected": 0 },
    "Google School": { "status": "pending", "videos_collected": 0 },
    "あずきチャンネル": { "status": "pending", "videos_collected": 0 },
    "AIたろう": { "status": "pending", "videos_collected": 0 },
    "AI_aaafrog": { "status": "pending", "videos_collected": 0 },
    "AIAIChatGPT": { "status": "pending", "videos_collected": 0 },
    "いけとも": { "status": "pending", "videos_collected": 0 },
    "松井健太": { "status": "pending", "videos_collected": 0 },
    "AIVTuber": { "status": "pending", "videos_collected": 0 }
  },
  "completed_count": 0,
  "last_updated": ""
}
```

**After processing each influencer:**

1. Update `step1_progress.json`:
   - Set `status` to `"completed"` or `"no_videos"` (if no videos in period)
   - Update `videos_collected` count
   - Increment `completed_count`
   - Update `last_updated` timestamp

2. Check progress:
```
PROGRESS CHECK (from step1_progress.json):
COMPLETED: [completed_count]/14
PENDING: [list influencers with status="pending"]

IF any status = "pending":
  → Process NEXT PENDING influencer (skip already completed ones)
  → DO NOT re-process completed influencers
  → DO NOT proceed to Step 1.2

IF all status != "pending":
  → Proceed to Phase 4 (Verification)
```

**CRITICAL:** Always read `step1_progress.json` before processing to avoid duplicate work.

**Phase 4: Final Verification Before Step 1.2**

Run this verification script to confirm all 14 influencers are covered:

```python
# Verification: Check all 14 influencers are in the data
REQUIRED_INFLUENCERS = [
    "チャエン", "木内翔大", "mikimiki", "AI まさおう", "AIサボロー",
    "KEITO", "Google School", "あずきチャンネル", "AIたろう", "AI_aaafrog",
    "AIAIChatGPT", "いけとも", "松井健太", "AIVTuber"
]

# Load data and check
missing = [name for name in REQUIRED_INFLUENCERS if name not in found_influencers]

if missing:
    print(f"INCOMPLETE: Missing {len(missing)} influencers: {missing}")
    print("ACTION: Return to Phase 2 and complete missing influencers")
else:
    print("COMPLETE: All 14 influencers collected. Proceed to Step 1.2")
```

**If any influencer is missing:** DO NOT proceed to Step 1.2. Return to Phase 2 and collect the missing data.

##### Style & Category Mapping (CRITICAL)

Classify each post's `presentation_style` into Categories A-E:
- **Comparison** -> **Category A** (Versus)
- **Ranking** -> **Category E** (Ranking)
- **Warning** -> **Category D** (Warning)
- **Hack / Secret** -> **Category C** (Novelty) or **B** (Efficiency)
- **News / Update** -> **Category C** (Novelty)
- **Tutorial** -> **Category B** (Instant Hack/How-to)

##### Extraction Fields (Must be separate)
- `title`: Full Post Title.
- `hook`: The "Catchy Phrase".
- `presentation_style`: Comparison, News, etc.
- `category`: **Mapped Category (A, B, C, D, E).**
- `url`: Direct Video URL.
- `metrics`: View Count & Follower Count.
- `mentioned_tools`: List of tools.

##### Output

**File:** `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`

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

---

#### Step 1.2: Trend Aggregation (Ranking)

**Logic:**
1. **Extract Tools:** from `mentioned_tools`.
2. **Rank:** by Unique Influencer Count (x/14).
3. **Consolidate:** List the best representative URLs for each trend.

##### Output

**File:** `{{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json`

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

## Step 1 Completion Checklist (MANDATORY)

**Before proceeding to Step 2, ALL of the following conditions MUST be met.**

| # | Check Item | Criteria | Status |
|---|------------|----------|--------|
| 1 | Influencer Count | All 14 influencers have been researched | [ ] |
| 2 | Data File Exists | `step1_influencer_data.json` contains data for all 14 influencers | [ ] |
| 3 | Per-Influencer Data | Each influencer has at least 1 video entry (or explicit "no videos in period" note) | [ ] |
| 4 | Category Coverage | **Each category (A/B/C/D/E) has at least 2 YouTube videos** | [ ] |
| 5 | Trend Ranking Updated | `step1_trend_ranking.json` is aggregated from all 14 influencers' data | [ ] |
| 6 | Data Source Verification | ALL data was obtained from **actual YouTube access** (no simulation) | [ ] |

### If Any Check Fails

- **DO NOT proceed to Step 2**
- **Return to Step 1.1** and complete the missing influencer research
- If 429 error or rate limit occurs: **Report to user with Option 3: Stop** and await instructions
- **NEVER simulate or fabricate data** to pass the checklist

### Prohibited Actions (CRITICAL - Zero Tolerance)

The following actions are **strictly prohibited** throughout the entire workflow:

| Prohibited Action | Description |
|-------------------|-------------|
| Data Simulation | Generating fake data when actual data cannot be retrieved |
| Template Filling | Using template text instead of actual extracted content |
| Python Script Generation | Creating scripts that generate simulated data (e.g., fake transcript summaries) |
| Inference from Titles | Guessing video content based on title alone without accessing the video |
| Fabricated Metrics | Inventing view counts, follower counts, or other metrics |

**If data cannot be retrieved:**
1. Report the specific issue to the user
2. Select **Option 3: Stop**
3. Await further instructions

**DO NOT attempt workarounds that involve simulated data.**

---

## Next Step

Proceed to Step 2: Deep Dive Research (`instagram_step2_research.md`)
