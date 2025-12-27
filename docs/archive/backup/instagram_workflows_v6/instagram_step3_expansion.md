# Step 3: Content Expansion

> Part of Instagram Content Generation Workflow v6
> See also: `instagram_post_generation.md` (Step 0-1), `instagram_step2_research.md`, `instagram_step4_validation.md`

---

## Goal
Generate exactly 32 High-Quality Posts

## Category Allocation (Fixed)

| Category           | Count | Theme        |
|--------------------|-------|--------------|
| A (Versus)         | 8     | Comparison   |
| B (Instant Hack)   | 6     | Time-saving  |
| C (Secret Feature) | 6     | New features |
| D (Warning)        | 6     | Risk alerts  |
| E (Ranking)        | 6     | Rankings     |
| **Total**          | **32**|              |

## Selection Logic
1. Category A: Select from `step1_influencer_data.json` where category: "A" (actual comparison pairs only)
2. Category B/C/D: Select from `step1_influencer_data.json` by category, ranked by views × followers
3. Category E: Use `step1_trend_ranking.json` top tools

## Shortfall補完
- If total < 32: Add unused posts from `step1_influencer_data.json` (sorted by mention count)
- Category imbalance is acceptable

**Actor:** Antigravity or External LLM

---

## Instruction (Copy & Paste)

あなたはInstagramリール投稿コンテンツを作成するプロフェッショナルです。
以下の参考資料を元に、ハイクオリティな60秒動画用コンテンツを生成してください。

### パラメータ
- **Start ID**: {{START_ID}}
- **Category**: {{CATEGORY}} (A / B / C / D / E)
- **生成件数**: {{COUNT}}件

### 参考資料（必ず参照すること）

#### Step 1 インフルエンサーデータ
{{STEP1_DATA_CONTEXT}}

#### Step 2 Knowledge Base（お手本）
{{STEP2_KNOWLEDGE_BASE_CONTEXT}}

---

## 最重要指示（絶対厳守）

1. 参考資料の内容を**元に**投稿を作成すること（丸写し禁止）
2. 不足情報は**最新の情報を検索して補完**すること
3. **古い情報は使用禁止**
4. **事実と異なる情報は絶対禁止**
5. **捏造・推測は絶対禁止**

---

## カテゴリ別ルール（CRITICAL）

### Category A（Versus）専用ルール
- **条件**: `step1_influencer_data.json` で**実際に比較されている組み合わせのみ**使用可能
- **禁止**: 独立したツールを勝手に組み合わせて比較を作成すること
- **構造**: ツールA強み → ツールB強み → 比較 → 使い分け → 結論
- **結論**: 「こういう人はA、こういう人はB」と明確に線引き

### Category B（Instant Hack）専用ルール
- **フォーカス**: 時間短縮、効率化
- **フック**: 「まだ手作業でやってるの？」等の課題提起
- **構造**: 課題 → 解決策 → 仕組み → ベネフィット → 結論

### Category C（Secret Feature）専用ルール
- **フォーカス**: 新機能、知られていない機能
- **フック**: 「まだ○○してるの？それ古いです」等の常識否定
- **構造**: 従来否定 → 新機能概要 → 動作描写 → インパクト → 結論

### Category D（Warning）専用ルール
- **フォーカス**: リスク、注意点、落とし穴
- **フック**: 「警告します」「このままだとヤバいです」等
- **構造**: 警告 → リスク1 → リスク2 → リスク3 → 対策 → 結論
- **必須**: 単なる批判ではなく「賢い使い方」も提示

### Category E（Ranking）専用ルール
- **条件**: `step1_trend_ranking.json` のTOP 5-10ツールを使用
- **構造**: 5位→4位→3位→2位→1位のカウントダウン形式
- **必須**: 各ツールは「名前」+「最強のメリット一言」のみ（ダラダラ説明禁止）
- **必須**: 1位に最も時間を割く（約13秒）

---

## 禁止事項（厳守）

- 絵文字の使用（一切禁止）
- 抽象的な表現（「便利」「凄い」「魔法」など）
- 過激な表現（「〜を殺す」「〜は終わり」など）
- 禁止ワード: 「神」「魔法」「革命」「最強」（証明がない限り）「結論」
- 想像や推測で数値・スコアを生成すること
- 比較対象の事例がないのに比較を作成すること

---

## ナレーション制約

- 合計300〜350文字（読み上げ60秒相当）
- narration_1: 前半0:00-0:30（150-175文字）
- narration_2: 後半0:30-1:00（150-175文字）
- CTAは「コメント」「保存」への誘導のみ（プロフリンク禁止）

---

## スライド制約

- 各セット3行、各行全角14文字以内（厳守）
- 英数字は半角2文字=全角1文字で換算
- 改行は `\n` で表現
- 半角文字のみの行は22文字まで許容（ツール名等の長い英字対応）

---

## サムネイル制約

- thumb_main: 全角12文字以内（疑問形または煽り）
- thumb_sub: 6文字以内×3行（改行 `\n` 区切り）

---

## ハッシュタグ制約（CRITICAL）

**必ず5個。以下のカテゴリ別ルールに従うこと。**

### Category A（Versus）
| 枠 | 内容 |
|---|------|
| 1 | #AI（固定） |
| 2 | #効率化（固定） |
| 3 | #仕事術（固定） |
| 4 | #[比較ツール1の名前] |
| 5 | #[比較ツール2の名前] |

### Category B / C / D
| 枠 | 内容 |
|---|------|
| 1 | #AI（固定） |
| 2 | #効率化（固定） |
| 3 | #仕事術（固定） |
| 4 | #[メインツール名] |
| 5 | #[投稿内容に関連するタグ1つ] |

※ 枠5の例: #自動化 #プロンプト #画像生成 など内容に沿ったもの

### Category E（Ranking）
| 枠 | 内容 |
|---|------|
| 1 | #AI（固定） |
| 2 | #仕事術（固定） |
| 3 | #[1位ツール名] |
| 4 | #[2位ツール名] |
| 5 | #[3位ツール名] |

---

## 時系列対応（カテゴリA/B/C/D共通）

- Set 1 (0:00-0:05): フック
- Set 2 (0:05-0:15): ポイント1
- Set 3 (0:15-0:25): ポイント2
- Set 4 (0:25-0:35): ポイント3
- Set 5 (0:35-0:45): ベネフィット/対策
- Set 6 (0:45-0:55): 結論
- CTA (0:55-1:00): 固定画像（生成不要）

---

## 時系列対応（カテゴリE専用）

- Set 1 (0:00-0:05): フック - ランキングテーマの提示
- Set 2 (0:05-0:12): 第5位 - ツール名と特徴
- Set 3 (0:12-0:20): 第4位 - ツール名と特徴
- Set 4 (0:20-0:28): 第3位 - ツール名と特徴
- Set 5 (0:28-0:37): 第2位 - ツール名と特徴
- Set 6 (0:37-0:50): 第1位 - ツール名と特徴（長め）
- CTA (0:50-1:00): 固定画像（生成不要）

---

## キャプションテンプレート

```
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
```

---

## 出力形式（JSON）

以下のJSON形式で出力してください。他の文字は含めないでください。

```json
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
```

---

## 実行手順

1. **Category A を生成**
   - {{START_ID}}: 001
   - {{CATEGORY}}: A
   - {{COUNT}}: 8
   - 参考資料: `step1_influencer_data.json` の category: "A" + `step2_knowledge_base.json`

2. **Category B を生成**
   - {{START_ID}}: 009
   - {{CATEGORY}}: B
   - {{COUNT}}: 6

3. **Category C を生成**
   - {{START_ID}}: 015
   - {{CATEGORY}}: C
   - {{COUNT}}: 6

4. **Category D を生成**
   - {{START_ID}}: 021
   - {{CATEGORY}}: D
   - {{COUNT}}: 6

5. **Category E を生成**
   - {{START_ID}}: 027
   - {{CATEGORY}}: E
   - {{COUNT}}: 6
   - 参考資料: `step1_trend_ranking.json` + `step2_knowledge_base.json`

6. **補完（32件未満の場合）**
   - 未使用投稿から言及数上位を選出
   - 該当categoryに追加

---

## Output
**File:** `{{CURRENT_PROJECT_DIR}}/instagram_ideas.json`

---

## Next Step
Proceed to Step 4: Quality Assurance (`instagram_step4_validation.md`)
