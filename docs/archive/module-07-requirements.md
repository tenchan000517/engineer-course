# Module 07: AI連携（コンテンツ自動生成）要件定義書

**作成日**: 2025-12-05

---

## 概要

Gemini APIを活用し、Instagram投稿コンテンツを自動生成するシステムを構築する。

### 目的

- リサーチからコンテンツ生成までを自動化
- トレンドに基づいた投稿ネタの継続的な供給
- スプレッドシートを中心としたコンテンツ管理

---

## カテゴリ階層構造

```
大カテゴリ（不変）
    └── 中カテゴリ（月1更新）
            └── 小カテゴリ（週1更新）
                    └── 投稿内容（毎日生成）
```

### 更新頻度と方法

| 階層 | 更新頻度 | 方法 |
|------|----------|------|
| 大カテゴリ | 不変 | 手動（GAS） |
| 中カテゴリ | 月1回 | ワークフロー（手動チューニング可） |
| 小カテゴリ | 週1回 | ワークフロー |
| 投稿内容 | 毎日 | ワークフロー |

---

## 大カテゴリ（固定）

Instagramアルゴリズムにおける「ジャンル」として認識される。

| ID | カテゴリ名 | ターゲット層 |
|----|-----------|-------------|
| LARGE-001 | AI | AI活用に興味のある人 |
| LARGE-002 | エンジニア | エンジニア/エンジニア志望 |
| LARGE-003 | スキル | スキルアップしたい人 |
| LARGE-004 | キャリア | キャリア形成を考える人 |
| LARGE-005 | 就活 | 就活生 |
| LARGE-006 | 転職 | 転職検討者 |
| LARGE-007 | 求人 | 求職者/採用担当 |
| LARGE-008 | SNS運用 | SNSマーケター/運用者 |

---

## シート設計

### large_categories（大カテゴリ）

| 列名 | 型 | 説明 |
|------|-----|------|
| category_id | TEXT | ID（LARGE-001） |
| name | TEXT | カテゴリ名 |
| description | TEXT | 説明 |
| target_audience | TEXT | ターゲット層 |

### medium_categories（中カテゴリ）

| 列名 | 型 | 説明 |
|------|-----|------|
| category_id | TEXT | ID（MEDIUM-001） |
| large_category_id | TEXT | 親の大カテゴリID |
| name | TEXT | カテゴリ名（ChatGPT、Claude等） |
| description | TEXT | 説明 |
| status | TEXT | ACTIVE / INACTIVE |
| last_updated | DATETIME | 最終更新日 |
| source | TEXT | WORKFLOW / MANUAL |

### small_categories（小カテゴリ）

| 列名 | 型 | 説明 |
|------|-----|------|
| category_id | TEXT | ID（SMALL-001） |
| medium_category_id | TEXT | 親の中カテゴリID |
| name | TEXT | トピック名 |
| description | TEXT | 説明 |
| type | TEXT | SINGLE / SERIES |
| total_parts | NUMBER | シリーズの場合の総数 |
| current_part | NUMBER | 投稿済み回数 |
| has_digest | BOOLEAN | ダイジェスト版あり |
| digest_posted | BOOLEAN | ダイジェスト投稿済み |
| trend_score | NUMBER | トレンド度（Gemini判定） |
| status | TEXT | ACTIVE / COMPLETED / DIGEST_READY |
| last_used_at | DATETIME | 最終使用日 |
| last_updated | DATETIME | 最終更新日 |
| source | TEXT | WORKFLOW / MANUAL |

---

## 小カテゴリの種類

### SINGLE（単発トピック）

- 1回の投稿で完結
- 例：特定のプロンプト術、ツール紹介

### SERIES（シリーズトピック）

- 複数回に分けて投稿
- 途中で止めない、最後まで投稿する
- 完了後にダイジェスト版を投稿
- 例：n8n「Instagram自動投稿システム」

### トレンドによる再利用

- statusがCOMPLETEDでもtrend_scoreが高ければ再利用可能
- 使用回数（current_part）と最終使用日（last_used_at）で管理
- 別の切り口で投稿できる

---

## オムニバス形式

### 原則

- **各投稿は単体で完結**する
- その投稿だけ見ても価値がある
- 「続きは次回」ではない

### シリーズの場合

- 連続性はあるが依存しない
- どこから見ても価値がある
- 全部見るとより深い理解が得られる
- 最後にダイジェスト版で全体像を提供

### 例：n8n Instagram自動投稿システム

| 投稿 | 内容 | 単体での価値 |
|------|------|-------------|
| 1 | Dockerセットアップ | n8n環境が作れる |
| 2 | Instagram API設定 | APIが使えるようになる |
| 3 | 投稿ワークフロー | 投稿できるようになる |
| 4 | Google Sheets連携 | シート連携できる |
| 5 | シート設計 | 管理システムが作れる |
| 6 | シートから投稿 | 自動投稿できる |
| ダイジェスト | 全体まとめ | 全体像がわかる |

---

## ワークフロー構成

### ワークフロー1: 中カテゴリ更新（月1回）

```
[Schedule Trigger]
    ↓
[Google Sheets: Get] ← 大カテゴリ取得
    ↓
[Gemini] ← 中カテゴリ提案
    ↓
[Google Sheets: Append/Update] ← medium_categories更新
```

### ワークフロー2: 小カテゴリ生成（週1回）

```
[Schedule Trigger]
    ↓
[Google Sheets: Get] ← 中カテゴリ取得
    ↓
[Gemini] ← トレンドリサーチ、小カテゴリ生成
    ↓
[Google Sheets: Append/Update] ← small_categories更新
```

### ワークフロー3: 投稿内容確定（毎日）

```
[Schedule Trigger / Manual Trigger]
    ↓
[Google Sheets: Get] ← 小カテゴリ取得（ACTIVE、優先度順）
    ↓
[Gemini] ← リサーチ、投稿内容生成
    ↓
[Google Sheets: Append] ← postsシートに記載
    ↓
[Google Sheets: Update] ← small_categories更新（使用回数等）
```

---

## 技術要件

### 使用AI

- Google Gemini API
- n8n専用ノードあり（n8n 1.103.1以上）

### Credential設定

| 項目 | 値 |
|------|-----|
| ノード名 | Google Gemini |
| Host | https://generativelanguage.googleapis.com |
| APIキー取得 | https://aistudio.google.com/apikey |

### 既存リソース

- テスト用スプレッドシート: n8n-test
- spreadsheetId: 1jnsUM1eNojeLmAGkZwEzLetBrB2CUjzRVoJ_3uKmKIQ
- postsシート: 作成済み（Module 05）
- mediaシート: 作成済み（Module 05）

---

## 実装順序

1. Gemini APIキー取得
2. n8nでCredential設定
3. カテゴリ用シート作成（GAS）
4. 大カテゴリデータ投入
5. ワークフロー1構築（中カテゴリ更新）
6. ワークフロー2構築（小カテゴリ生成）
7. ワークフロー3構築（投稿内容確定）
8. テスト実行
9. スケジュール設定

---

## 備考

- プロンプト設計は実践時に詳細化
- 投稿内容生成時は「オムニバス形式」を遵守
- 手動チューニングのUIは既存のスプレッドシートを使用

---

**最終更新**: 2025-12-05
