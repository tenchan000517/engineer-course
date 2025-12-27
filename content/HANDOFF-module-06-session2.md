# Module 06 引き継ぎ資料（セッション2）

**作成日**: 2025-12-11
**前提**: HANDOFF-module-06.md を先に読むこと

---

## 本セッションで完了したタスク

### 1. ワークフロー定義の大幅改訂

**ファイル**: `/mnt/c/Instagram_AI/.agent/workflows/instagram_post_generation.md`

#### 追加・修正した内容

| 項目 | 内容 |
|------|------|
| Workflow Overview | 目的・構成を明確化、Step 0/4 を追加 |
| Step 0 | 初期化（ディレクトリ作成、`{{CURRENT_PROJECT_DIR}}` 設定） |
| Step 1 | 変更なし（1.1 + 1.2 構成を明記） |
| Step 2 | 変更なし（Global Category Selection） |
| Step 3 | 大幅改訂（カテゴリ別ルール詳細化、固定枠配分、補完ロジック） |
| Step 4 | 新規追加（Quality Assurance） |
| ファイルパス | 全て `{{CURRENT_PROJECT_DIR}}/` プレフィックスに統一 |
| thumb_main | 文字数制約を「全角12文字以内」に統一 |

#### Step 3 の主な改訂点

- **カテゴリ配分固定**: A:8, B:6, C:6, D:6, E:6 = 32件
- **Category A**: 実際に比較されている組み合わせのみ使用（独自組み合わせ禁止）
- **補完ロジック**: 32件未満なら未使用投稿から言及数上位を補完（偏り許容）
- **情報補完**: 不足情報は最新情報を検索して補完（古い情報禁止）
- **カテゴリ別プロンプト**: 各カテゴリの詳細ルールを統合

#### Step 4（新規）: Quality Assurance

**チェックレベル**:
- **PRE-CHECK**: 投稿数（32件）、重複なし、ID連番
- **CRITICAL**: 事実捏造、ツール名改変、比較ペア不正、ハルシネーション
- **HIGH**: 絵文字、禁止ワード、抽象表現、過激表現、翻訳調
- **MEDIUM**: 文字数制限（narration, thumb, set）
- **LOW**: JSON構造、必須フィールド

**出力**: `quality_check_report.json`

---

### 2. Antigravityテスト実行（途中）

#### 実行状況

| Step | ステータス | 備考 |
|------|-----------|------|
| Step 0 | 完了 | `C:\Instagram_AI\20251211_01\` 作成 |
| Step 1 | 完了 | 既存データをコピー（テストデータの可能性あり） |
| Step 2 | 未確認 | |
| Step 3 | 未確認 | |
| Step 4 | 未実行 | |

#### 確認が必要な点

1. **Step 1 の出力データがテストデータっぽい**
   - `step1_trend_ranking.json` の言及数が全体的に少ない（TOP 1でも4人）
   - URLがサンプルっぽい（`watch?v=dec_top10_zunda` など）
   - TOP 20ではなくTOP 10しかない

2. **実際のリサーチが必要か確認**
   - テストデータで進めるか
   - 実際にインフルエンサーをリサーチするか

---

## 未完了タスク

### 1. Antigravityテスト実行の継続

- Step 2〜4 の実行結果確認
- 品質チェック結果の確認
- 問題があればワークフロー修正

### 2. 動画表示問題（前セッションから継続）

**症状**: `module-06-ideas-generation-workflow.md` に埋め込んだ動画が表示されない

**該当ファイル**: `public/n8n-advanced/mv/research_workflow_compressed.mp4`

---

## 関連ファイル

| ファイル | パス |
|---------|------|
| ワークフロー定義 | `/mnt/c/Instagram_AI/.agent/workflows/instagram_post_generation.md` |
| Step 1.1 出力 | `C:\Instagram_AI\20251211_01\step1_influencer_data.json` |
| Step 1.2 出力 | `C:\Instagram_AI\20251211_01\step1_trend_ranking.json` |
| 前回引き継ぎ | `content/HANDOFF-module-06.md` |
| 品質引き継ぎ | `content/HANDOFF-content-quality.md` |

---

## 次にやること

1. **Antigravityテスト結果の確認**
   - Step 2〜4 が完了しているか確認
   - `instagram_ideas.json` と `quality_check_report.json` を確認

2. **データ品質の判断**
   - テストデータで進めるか
   - 実リサーチが必要か

3. **問題があれば修正**
   - ワークフロー定義の微調整
   - プロンプトの調整

---

## Antigravity 実行指示（再開用）

```
@instagram_post_generation.md

上記ワークフロー定義に基づき、Step 0 〜 Step 4 を順次実行してください。

---

## 実行ステップ

### Step 0: Initialization
- `C:\Instagram_AI\` 配下に本日の日付ディレクトリを作成（命名規則: `YYYYMMDD_XX`）
- 以降の全成果物は `{{CURRENT_PROJECT_DIR}}` に保存すること

### Step 1: Trend Discovery
**Step 1.1: Influencer Data Collection**
- 日本のAIインフルエンサー20名（YouTube/X）から過去1ヶ月の投稿を収集
- 各投稿を Category A〜E に分類
- 出力: `{{CURRENT_PROJECT_DIR}}/step1_influencer_data.json`

**Step 1.2: Trend Aggregation**
- `mentioned_tools` からツールを抽出し、言及インフルエンサー数でランキング
- 出力: `{{CURRENT_PROJECT_DIR}}/step1_trend_ranking.json`

### Step 2: Deep Dive Research
- `step1_influencer_data.json` を1つのプールとして扱う
- 各カテゴリ（A/B/C/D/E）から Top 2 動画を選出（計10件）
- 選出した10件の動画を文字起こし・要約し、Knowledge Base を作成
- 出力: `{{CURRENT_PROJECT_DIR}}/step2_knowledge_base.json`

### Step 3: Content Expansion
- Step 1, 2 の成果物を**参考資料として**使用
- カテゴリ配分（目標: A:8, B:6, C:6, D:6, E:6 = 32件）で投稿案を生成
- 不足情報は**最新の情報を検索して補完**すること
- **事実と異なる情報、捏造は絶対禁止**
- **Category A は実際に比較されている組み合わせのみ使用**
- 32件に満たない場合は、未使用投稿から言及数上位を補完（カテゴリ偏りは許容）
- 出力: `{{CURRENT_PROJECT_DIR}}/instagram_ideas.json`

### Step 4: Quality Assurance
- 生成された32件を品質基準に基づいて検証
- PRE-CHECK → CRITICAL → HIGH → MEDIUM → カテゴリ別チェック の順で実施
- 出力: `{{CURRENT_PROJECT_DIR}}/quality_check_report.json`
- REJECT があれば Step 3 に戻って該当投稿のみ再生成

---

## Language Requirements
- リサーチ対象: 日本のAIインフルエンサー（YouTube/X）
- 出力言語: 自然な日本語（翻訳調禁止）

開始してください。
```

---

**最終更新**: 2025-12-11
