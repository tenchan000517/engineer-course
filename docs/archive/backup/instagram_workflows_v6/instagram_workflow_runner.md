# Instagram Workflow Runner

## Overview

This file orchestrates the full Instagram content generation workflow.
Execute all steps sequentially without stopping until Step 4 is complete.

---

## Execution Order

### Step 0-1: Initialization & Trend Discovery
**File:** `instagram_post_generation.md`

**Actions:**
- Step 0: Create task directory (`{{CURRENT_PROJECT_DIR}}`)
- Step 1.1: Collect data from 20 influencers (Browser Required)
- Step 1.2: Aggregate trends and rank tools

**Outputs:**
- `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`
- `{{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json`

---

### Step 2: Deep Dive Research
**File:** `instagram_step2_research.md`

**Actions:**
- Select Top 2 videos from each category (10 total)
- Extract transcripts from videos (Browser Required)
- Create Knowledge Base

**Output:**
- `{{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json`

---

### Step 3: Content Expansion
**File:** `instagram_step3_expansion.md`

**Actions:**
- Generate 32 Instagram posts (A:8, B:6, C:6, D:6, E:6)
- Apply category-specific rules
- Format according to constraints

**Output:**
- `{{CURRENT_PROJECT_DIR}}/instagram_ideas.json`

---

### Step 4: Quality Assurance
**File:** `instagram_step4_validation.md`

**Actions:**
- Validate all 32 posts against quality criteria
- Flag or reject non-compliant posts
- Regenerate if needed

**Output:**
- `{{CURRENT_PROJECT_DIR}}/quality_check_report.json`
- `{{CURRENT_PROJECT_DIR}}/instagram_ideas_validated.json` (if all passed)

---

## Execution Instructions (CRITICAL)

1. **Read each workflow file in order** and execute all instructions within
2. **Do not skip steps** - each step depends on outputs from previous steps
3. **Browser operations are required** for Step 1.1 and Step 2 - do not simulate data
4. **If data cannot be retrieved:** Report to user and await instructions
5. **Do not stop** until Step 4 is complete and `quality_check_report.json` is generated

---

## Start Execution

Begin by reading and executing: `instagram_post_generation.md`
