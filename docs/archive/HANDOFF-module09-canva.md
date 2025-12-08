# Module 09 Canva一括作成 引き継ぎ資料

**作成日**: 2025-12-07
**更新日**: 2025-12-07
**状態**: 講座ドキュメント・スクショ埋め込み完了。Canvaテンプレート作成手順が未確立。

---

## 要件

### 目的
postsシートのDRAFTデータをCanva Bulk Create（一括作成）で処理し、リール動画素材を量産する

### 最終フロー（確定版）

```
[n8n] postsシートからDRAFT取得
    ↓
[n8n] カテゴリ別にcanva_A〜Eシートに振り分けて書き込み
    ↓
[手動] Canvaでテンプレート開く → スプレッドシート直接接続 → 一括生成
    ↓
[手動] 動画ダウンロード → Google Driveにアップロード
```

### 重要な発見
- **Canva APIでの完全自動化は不可能**（Enterprise契約必須）
- **CanvaはGoogle スプレッドシートに直接接続可能**
- よってCSVダウンロード/アップロードは不要
- カテゴリごとに別シート・別テンプレートで管理するのが効率的

---

## 進捗状況

### 完了済み

| 項目 | 状態 | 備考 |
|------|------|------|
| Canva API調査 | ✅完了 | Enterprise必須と判明 |
| Canva Bulk Create調査 | ✅完了 | スプレッドシート直接連携可能 |
| canva_A〜Eシート作成 | ✅完了 | GASで作成済み |
| ワークフローJSON作成 | ✅完了 | category_workflow.json |
| n8nワークフロー動作確認 | ✅完了 | 正常に動作 |
| Module 09講座ドキュメント更新 | ✅完了 | 新フローに全面改訂済み |
| ダウンロード用JSON作成 | ✅完了 | public/n8n-setup/canva-category-workflow.json |
| スクショ整理・講座埋め込み | ✅完了 | 125〜132番、8枚 |
| カテゴリD修正 | ✅完了 | pattern: warning（Create posts.json、module-08講座） |

### 未着手

| 項目 | 状態 | 備考 |
|------|------|------|
| Canvaテンプレート作成手順 | ⏳未確立 | 講座セクション3が簡易記載のみ |
| Google Drive連携部分 | ⏳未着手 | 動画アップロード→mediaシート登録 |
| postsシートのstatus更新 | ⏳未着手 | DRAFT→READY |

---

## 次回セッションでやること

### 1. Canvaテンプレート作成手順の確立（最優先）

講座セクション3「Canvaテンプレートの作成」が簡易記載のみ。

**やること**:
1. Canvaで6ページリールテンプレートを実際に作成
2. 各ステップでスクショ撮影（133番台〜）
3. 講座セクション3を具体的な手順に更新

**テンプレート構成**:
| ページ | 役割 | 内容 |
|--------|------|------|
| 1 | Hook | 掴み（0-5秒） |
| 2 | Problem | 問題提起（5-10秒） |
| 3 | Step 1 | ステップ1（10-25秒） |
| 4 | Step 2 | ステップ2（25-40秒） |
| 5 | Step 3 | ステップ3（40-50秒） |
| 6 | CTA | 行動喚起（50-60秒） |

### 2. Google Drive連携部分の実装（後半）

1. Canvaでダウンロードした動画をGoogle Driveにアップロード
2. mediaシートに動画情報を登録
3. postsシートのstatusをDRAFT→READYに更新

---

## ファイル一覧

### 講座ドキュメント
- `content/modules/n8n/module-09-canva-bulk-create.md` - ✅更新済み（スクショ埋め込み済み）

### n8nワークフロー
- `content/modules/n8n/Create posts.json` - 正常動作するワークフロー実例（JSON構造の参考）
- `content/modules/n8n/category_workflow.json` - 開発用（実際のID入り）
- `public/n8n-setup/canva-category-workflow.json` - ダウンロード用（プレースホルダー入り）

### 調査ドキュメント
- `docs/archive/module-09-canva-research.md` - Canva API調査結果

### スクリーンショット（保存済み）

| 番号 | ファイル名 | 内容 |
|------|-----------|------|
| 125 | canva-sheets-created.png | canva_A〜Eシート作成完了 |
| 126 | canva-bulk-create-app.png | Canva一括作成アプリ画面 |
| 127 | canva-spreadsheet-select.png | スプレッドシート選択画面 |
| 128 | canva-permission.png | Canva権限許可画面 |
| 129 | canva-sheet-connected.png | シート連携成功 |
| 130 | canva-data-connect.jpg | データ紐づけ画面 |
| 131 | canva-advanced-options.png | 高度なオプション設定 |
| 132 | canva-generated-designs.png | 一括生成結果 |

---

## 技術詳細

### カテゴリとパターンの対応

| カテゴリ | パターン名 | 内容 |
|---------|-----------|------|
| A | versus | 比較・対決系 |
| B | instant_hack | 時短・効率化系 |
| C | secret_feature | 先端トレンド・裏技系 |
| D | warning | 警告系 |
| E | ranking | ランキング系 |

### シート構造（canva_A〜E共通）

| 列名 | 内容 |
|------|------|
| post_id | 投稿ID |
| hook | ページ1テキスト |
| problem | ページ2テキスト |
| step1 | ページ3テキスト |
| step2 | ページ4テキスト |
| step3 | ページ5テキスト |
| cta | ページ6テキスト |

### n8nワークフロー構成

```
[Manual Trigger]
    ↓
[Google Sheets: Get Rows] ← postsシート status=DRAFT
    ↓
[Code: Parse JSON & Category] ← content_jsonをパース、カテゴリ判定
    ↓
[Switch Category] ← A/B/C/D/Eで分岐
    ↓
[Google Sheets: Append Row] × 5 ← 各canva_シートに書き込み
```

### Codeノードの処理内容

```javascript
// content_jsonからパターンを取得
const pattern = json.pattern || '';

// パターンからカテゴリを判定
switch (pattern) {
  case 'versus': category = 'A'; break;
  case 'instant_hack': category = 'B'; break;
  case 'secret_feature': category = 'C'; break;
  case 'warning': category = 'D'; break;
  case 'ranking': category = 'E'; break;
  default: category = 'C';
}

// solution_stepsを展開
const steps = json.solution_steps || [];
// step1, step2, step3に分解
```

---

## Canva Bulk Create 操作手順

### 重要な設定

1. **データソース**: Google スプレッドシートを直接選択（CSVアップロード不要）
2. **高度なオプション**: 「〇個のデザイン」を選択（「1つのデザインで複数ページ」ではない）
3. **データ紐づけ**: テキストボックスを右クリック → 「データを接続」

### トラブルシューティング

- **「データを接続」が出ない**: グループ解除（Ctrl+Shift+G）してから再試行
- **「追加されたデータフィールドはありません」**: まだ紐づけしていない状態。エラーではない

---

## 開発用gid一覧（参考）

このプロジェクト固有の値。受講者には関係ない。

| シート | gid |
|--------|-----|
| posts | 1340398352 |
| ideas | 2072779338 |
| canva_A | 178071259 |
| canva_B | 715847450 |
| canva_C | 924087630 |
| canva_D | 1012946509 |
| canva_E | 1593159234 |

---

## 参考資料

- [Canva Bulk Create Help](https://www.canva.com/help/bulk-create/)
- [Canva Connect API Docs](https://www.canva.dev/docs/connect/)（Enterprise必須）
- `docs/archive/module-09-canva-research.md` - 詳細な調査結果

---

## 注意事項

1. **Canva Proが必須** - Bulk Create機能はPro以上
2. **Autofill APIはEnterprise必須** - 個人利用では使用不可
3. **GASコード変更時は新しいデプロイが必要**
4. **カテゴリ別テンプレート** - 各カテゴリで異なるデザインテンプレートを使用予定

---

**最終更新**: 2025-12-07
