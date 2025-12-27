# Module 06 引き継ぎ資料（セッション4）

**作成日**: 2025-12-11
**前提**: HANDOFF-module-06.md, HANDOFF-module-06-session2.md, HANDOFF-module-06-session3.md を先に読むこと

---

## 本セッションで完了したタスク

### 1. インフルエンサーリストの厳選（20名 → 14名）

以下の6名を削除：
- usutaku
- すぐる
- さとり
- AI様の下僕
- 安野貴博
- ひかりのAI大学

順番も変更済み（優先度順に並び替え）

### 2. ハッシュタグルールの追加

`instagram_step3_expansion.md` に以下のルールを追加：

| カテゴリ | 固定タグ | 可変タグ |
|---------|---------|---------|
| A（Versus） | #AI #効率化 #仕事術 | 比較ツール名×2 |
| B/C/D | #AI #効率化 #仕事術 | メインツール名 + 内容関連×1 |
| E（Ranking） | #AI #仕事術 | TOP3ツール名×3 |

### 3. バリデーションチェックの追加

`instagram_step4_validation.md` に追加：

| Check ID | Rule |
|----------|------|
| C-06 | No Tool Name Generalization（ツール名の一般化禁止）|
| E-06 | Tool Relevance（ランキングツールの実在確認）|

### 4. 文字数制限の緩和

- 半角文字のみの行は22文字まで許容（ツール名対応）

### 5. ワークフローの大幅改善

#### Step 1 (`instagram_post_generation.md`)

**Phase 3: Progress Tracking & Loop** を追加：
- `step1_progress.json` で調査済みインフルエンサーを管理
- 14名全員完了までループ
- 重複調査を防止

**Phase 4: Final Verification** を追加：
- 14名全員のデータ存在確認スクリプト

**Step 1 Completion Checklist** を追加：
| # | Check Item |
|---|------------|
| 1 | Influencer Count（14名全員調査） |
| 2 | Data File Exists |
| 3 | Per-Influencer Data |
| 4 | Category Coverage（各カテゴリ最低2件） |
| 5 | Trend Ranking Updated |
| 6 | Data Source Verification |

**Prohibited Actions** テーブルを追加（シミュレート禁止の詳細）

#### Step 2 (`instagram_step2_research.md`)

**Pre-Execution Checklist** を追加：
| # | Check Item |
|---|------------|
| 1 | Step 1 Completed |
| 2 | Input File Exists |
| 3 | No Simulated Data |
| 4 | Selection Logic Confirmed（カテゴリベース、ツール名ベースではない） |

**Phase 2を「Video Viewing」に変更**：
- 動画を実際に視聴して内容を把握
- メタデータ抽出だけではNG

**Prohibited Actions** テーブルを追加：
- Pythonスクリプトでのシミュレート禁止
- 禁止コード例を明記

**Input から `step1_trend_ranking.json` を削除**（カテゴリベース選定のため不要）

---

## Antigravityで発生した問題と対策

### 問題1: データのシミュレート

**症状**: Pythonスクリプトでテンプレート文章を生成
```python
transcript_summary = f"Key points include: High efficiency, easy integration..."
```

**対策**: Prohibited Actionsに明記、禁止コード例を追加

### 問題2: インフルエンサー調査の不完全

**症状**: 14名中4名程度しか調査せずStep 2に進もうとした

**対策**:
- `step1_progress.json` で進捗管理
- Phase 3でループチェック
- Completion Checklistで最終確認

### 問題3: 選定ロジックの間違い

**症状**: 「ツール名ベース」で動画を選定（正しくは「カテゴリベース」）

**対策**:
- Pre-Execution Checklistに「Selection Logic Confirmed」追加
- Inputから `step1_trend_ranking.json` を削除

### 問題4: インフルエンサーリストの無視

**症状**: 定義済みリストを無視して検索ベースで動画を探そうとした

**対策**:
- Phase 4のVerificationスクリプトに14名のリストをハードコード
- インフルエンサー名の完全一致チェック

### 問題5: 同じインフルエンサーの重複調査

**症状**: 調査済みのインフルエンサーを何度も調査

**対策**: `step1_progress.json` で `status: "completed"` を管理、スキップ処理

---

## 未完了タスク

### 1. Antigravityでのワークフロー再実行

修正したワークフローでStep 1から再実行が必要：
1. `step1_progress.json` を新規作成
2. 14名全員を調査
3. Step 1 Completion Checklistを確認
4. Step 2に進む

### 2. n8nワークフローのブラッシュアップ

Antigravity成果物（`instagram_ideas.json`）をn8nに流す部分は未着手。

現状理解：
```
instagram_ideas.json → posts シート（content_json） → Canva用シート振り分けadvanced → canva_A〜E
```

canva_A〜Eの列構成（13列）：
```
post_id, narration_1, narration_2, thumb_main, thumb_sub,
set_1-6, audio_status, main_tool
```

Antigravity JSONとの差分：
- `caption`, `hashtags` がcanvaシートにない
- `idea_id` → `post_id` 変換が必要
- `category` → `pattern` 変換が必要（または Parse JSON を修正）

---

## 関連ファイル

### ワークフロー定義

| ファイル | パス |
|---------|------|
| エントリーポイント | `/mnt/c/Instagram_AI/.agent/workflows/instagram_workflow_runner.md` |
| Step 0-1 | `/mnt/c/Instagram_AI/.agent/workflows/instagram_post_generation.md` |
| Step 2 | `/mnt/c/Instagram_AI/.agent/workflows/instagram_step2_research.md` |
| Step 3 | `/mnt/c/Instagram_AI/.agent/workflows/instagram_step3_expansion.md` |
| Step 4 | `/mnt/c/Instagram_AI/.agent/workflows/instagram_step4_validation.md` |

### n8nワークフロー

| ファイル | パス |
|---------|------|
| SNS投稿作成advanced | `/mnt/c/engineer-course/public/n8n-advanced/download/sns-post-advanced-workflow.json` |
| Canva用シート振り分けadvanced | `/mnt/c/engineer-course/content/modules/n8n-advanced/Canva用シート振り分けadvanced.json` |

### 成果物

| ファイル | パス |
|---------|------|
| 生成済みideas（32件） | `/mnt/c/Instagram_AI/20251211_03/instagram_ideas.json` |

### 引き継ぎ資料

| ファイル | パス |
|---------|------|
| セッション1 | `content/HANDOFF-module-06.md` |
| セッション2 | `content/HANDOFF-module-06-session2.md` |
| セッション3 | `content/HANDOFF-module-06-session3.md` |

---

## 次にやること

### 優先度 High

1. **Antigravityでワークフロー再実行**
   - 修正済みワークフローを読み込ませる
   - Step 1から14名全員の調査を完了させる

### 優先度 Medium

2. **n8nワークフローのブラッシュアップ**
   - Antigravity成果物をpostsシートに直接流す方法の実装
   - canvaシートへの列追加（caption, hashtags）の検討

### 優先度 Low

3. **Module 06 教材の更新**
   - `module-06-ideas-generation-workflow.md` に新システムを反映

---

## 技術的メモ

### Antigravityへの指示のコツ

1. **シミュレート禁止は何度も明確に伝える**
   - 禁止コード例を見せる
   - 「Option 3: Stop」を選ぶよう指示

2. **ワークフロー定義ファイルを参照させる**
   - 「`instagram_post_generation.md` を読んでください」と明示

3. **チェックリストを使わせる**
   - 各Phase完了時にチェックを確認させる

4. **進捗ファイルを作らせる**
   - `step1_progress.json` で状態管理

### Step 2の選定ロジック

**正しい方法**:
```
カテゴリ（A/B/C/D/E）でグループ化 → Views × Followers でランキング → 各カテゴリ上位2件
```

**間違った方法（Antigravityがやりがち）**:
```
ツール名（trend）でグループ化 → 各ツールの上位2件
```

---

**最終更新**: 2025-12-11
