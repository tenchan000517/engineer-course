# HANDOFF: Nanobanana Pro × X投稿画像生成

**このファイルを最初に読んでください。**

---

## 目的

X投稿用の画像生成品質を向上させる。現在の基本実装をNanobanana Pro対応にアップグレードし、高品質なインフォグラフィック画像を生成できるようにする。

---

## 完了済み ✅

### フェーズ1: Nano Banana Pro対応

| タスク | 状況 | 詳細 |
|--------|------|------|
| x_api_server_v3.py モデル変更 | ✅ 完了 | `gemini-3-pro-image-preview` に変更 |
| x_production_guide.md 更新 | ✅ 完了 | 画像プロンプト例を詳細版に更新 |

### フェーズ2: プロンプト改善

| タスク | 状況 | 詳細 |
|--------|------|------|
| 改善版プロンプト作成 | ✅ 完了 | 57件のBefore/After形式で作成 |
| 保存先 | - | `docs/archive/improved-prompts.txt` |

### 変更前後の比較

**Before（シンプル版）:**
```
Comparison table with two columns. Left: GPT-5.2 with OpenAI logo. Right: Gemini 3 with Google logo. Rows: Coding, Creative, Speed, Reasoning. Checkmarks and ratings. Clean minimal design.
```

**After（詳細版）:**
```
Professional comparison infographic on white background. Two-column table with rounded corners and subtle drop shadow. Left column header: GPT-5.2 with green OpenAI logo on light gray. Right column header: Gemini 3 with blue/red/yellow/green Google logo on light gray. Four rows with icons: Coding (brackets icon), Creative (palette), Speed (lightning), Reasoning (brain). Green checkmarks for winners, gray for others. Consistent 24px padding, modern sans-serif typography. Sharp vector-style graphics.
```

### 画像比較結果

| 項目 | シンプル版 | 詳細版 |
|------|-----------|--------|
| サイズ | 小さい | 大きく見やすい |
| アイコン | なし | 各行にアイコン付き |
| 色彩 | モノトーン | カラフル |
| 背景 | グレー | 白背景でクリーン |

---

## 残タスク

### フェーズ3: 参照画像対応（将来）

1. ブランドガイドライン画像の設定
2. スタイル一貫性の維持

### スプレッドシート更新

GASで既存プロンプトを改善版に一括置換する場合：
- `docs/archive/improved-prompts.txt` のBEFORE/AFTERを使用
- 57件のマッピングが記載済み

---

## 関連ファイル

| ファイル | 用途 | 状況 |
|----------|------|------|
| `scripts/x_api_server_v3.py` | APIサーバー | ✅ 更新済み |
| `docs/archive/x-research/x_production_guide.md` | 投稿生成ガイド | ✅ 更新済み |
| `docs/archive/improved-prompts.txt` | プロンプト改善版一覧 | ✅ 新規作成 |
| `C:\nanobanana\generate_image_pro.py` | Pro版画像生成スクリプト | 参照用 |

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2025-01-02 | 初版作成、プロンプトテンプレート40件追加 |
| 2025-01-02 | フェーズ1・2完了、改善版プロンプト57件追加 |
