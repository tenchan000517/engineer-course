# Instagramガイド保存ガイド

## 概要

Instagramリール関連のガイド（プロンプト・自動化・フック集・分析など）を保存するフロー。

---

## 保存先

```
docs/reference/guides/
├── index.md                              # 一覧ページ（自動生成されるため編集不要）
├── instagram-automation-guide.md         # 自動化系
├── instagram-master-prompt-harm.md       # プロンプト系
├── instagram-ai-hook-100-guide.md        # フック系
├── ANALYSIS-tokuten-types.md             # 分析系
└── ...
```

**表示URL:** `/reference/guides`

---

## ファイル命名規則

| カテゴリ | 命名パターン | 例 |
|----------|--------------|-----|
| 自動化 | `*automation*.md` | `instagram-automation-guide.md` |
| プロンプト | `*-prompt*.md` / `PROMPTS-*.md` | `instagram-master-prompt-harm.md` |
| フック | `*-hook-*.md` | `instagram-ai-hook-100-guide.md` |
| 台本 | `*script*.md` / `*viral*.md` | `viral-script-100-guide.md` |
| 分析 | `ANALYSIS-*.md` | `ANALYSIS-tokuten-types.md` |

---

## カテゴリ自動判定

`lib/guides.ts` でファイル名からカテゴリを自動判定:

| ファイル名に含む文字列 | カテゴリ | 表示色 |
|------------------------|----------|--------|
| `automation` | 自動化・ワークフロー | 青 |
| `prompt` / `PROMPT` / `batch` | プロンプト・テンプレート | 紫 |
| `hook` | フック集 | オレンジ |
| `script` / `viral` | 台本集 | ピンク |
| `ANALYSIS` | 分析・リサーチ | 緑 |
| その他 | その他 | グレー |

---

## ファイル構成

### 基本テンプレート

```markdown
# タイトル

## 概要

このガイドの説明（1-2文）

---

## セクション1

内容...

---

## セクション2

内容...
```

### 注意事項

- 最初の `# タイトル` が一覧ページに表示される
- 概要セクションがあれば説明文として抽出される
- 絵文字は使用しない（Lucide Reactアイコンを使用）

---

## 新規ガイド追加手順

### 1. ファイル作成

```bash
# 例: 自動化ガイドの場合
touch docs/reference/guides/instagram-new-automation-guide.md
```

### 2. 内容を記述

上記テンプレートに従って記述。

### 3. 確認

```bash
# 開発サーバーで確認
npm run dev
# /reference/guides にアクセス
```

### 4. コミット

```bash
git add docs/reference/guides/instagram-new-automation-guide.md
git commit -m "docs: 新規自動化ガイド追加"
git push
```

---

## 既存ガイド一覧

| ファイル名 | カテゴリ | 内容 |
|------------|----------|------|
| `instagram-automation-guide.md` | 自動化 | フック→台本→動画生成の自動化完全ガイド |
| `instagram-master-prompt-harm.md` | プロンプト | HARM法則対応マスタープロンプト |
| `instagram-batch-content-harm-example.md` | プロンプト | 投稿一括作成の実例 |
| `PROMPTS-content-creation.md` | プロンプト | コンテンツ作成プロンプト8種 |
| `META-PROMPT-analyzer.md` | プロンプト | サンプル分析用メタプロンプト |
| `instagram-ai-hook-100-guide.md` | フック | AI冒頭フック100選（テキスト系） |
| `instagram-visual-hook-100-guide.md` | フック | 映像フック100選（ビジュアル系） |
| `viral-script-100-guide.md` | 台本 | バズった投稿台本100選 |
| `ANALYSIS-tokuten-types.md` | 分析 | 28サンプルから抽出した33型の分析 |
| `ANALYSIS-meta-prompt-output.md` | 分析 | メタプロンプト形式の分析結果 |

---

## 関連ファイル

| ファイル | 内容 |
|----------|------|
| `lib/guides.ts` | ガイド読み込み・カテゴリ判定ロジック |
| `app/reference/guides/page.tsx` | 一覧ページコンポーネント |
| `app/reference/guides/[slug]/page.tsx` | 個別ページコンポーネント |
