# HANDOFF: カテゴリK名称変更

## 概要

カテゴリKを「レジェンドインタビュー」から「ハイスクール企画」に変更する。

## 変更内容

| 項目 | Before | After |
|------|--------|-------|
| カテゴリ名 | レジェンドインタビュー | ハイスクール企画 |
| フォルダ名 | K_レジェンドインタビュー | K_ハイスクール企画 |
| ラベル | K. レジェンドインタビュー | K. ハイスクール企画 |

---

## 影響ファイル一覧

### 1. GAS（運用版）- 必須

**ファイル**: `scripts/gas/yumemaga-progress-sheet-generator.js`

| 行 | 箇所 | 変更内容 |
|----|------|----------|
| 22 | `categories` | `name: 'レジェンドインタビュー'` → `name: 'ハイスクール企画'` |
| 143 | `driveFolders` | `'K': 'K_レジェンドインタビュー'` → `'K': 'K_ハイスクール企画'` |

### 2. GAS（アーカイブ版）- 任意

**ファイル**: `docs/archive/yumemaga-progress-sheet-generator-full.js`

| 行 | 箇所 | 変更内容 |
|----|------|----------|
| 26 | `categories` | `name: 'レジェンドインタビュー'` → `name: 'ハイスクール企画'` |
| 69 | `driveFolders` | `'K': 'K_レジェンドインタビュー'` → `'K': 'K_ハイスクール企画'` |
| 82 | コメント | `// レジェンドインタビュー` → `// ハイスクール企画` |

### 3. n8nワークフローJSON

**ファイル**: `public/n8n-transcription/download/magazine-transcription.json`

| 箇所 | 変更内容 |
|------|----------|
| `catLabels`配列 | `'K. レジェンドインタビュー'` → `'K. ハイスクール企画'` |

**該当コード（Extract Folder IDs from URLs ノード内）:**
```javascript
const catLabels = ['A. メインインタビュー', 'H. STAR①', 'I. STAR②', 'K. レジェンドインタビュー', 'C. 新規企業'];
```
↓
```javascript
const catLabels = ['A. メインインタビュー', 'H. STAR①', 'I. STAR②', 'K. ハイスクール企画', 'C. 新規企業'];
```

### 4. 講座ドキュメント

**ファイル**: `content/modules/n8n-transcription/module-03-magazine-transcription.md`

| 行 | 箇所 | 変更内容 |
|----|------|----------|
| 160 | `catLabels`配列 | `'K. レジェンドインタビュー'` → `'K. ハイスクール企画'` |

---

## 手動作業（Google Drive）

### フォルダ名変更

Google Drive上で以下のフォルダ名を変更する必要がある：

- **フォルダID**: `1nzhI66AcjdiysN-hcu4YHMXa4VMorQ6M`
- **現在の名前**: `K_レジェンドインタビュー`
- **新しい名前**: `K_ハイスクール企画`

**注意**: フォルダIDは変わらないため、`driveFolderIds`の変更は不要。

---

## 確認済み事項

| 項目 | 結果 |
|------|------|
| 素材構成 | 現在のKと同じでOK（変更不要） |
| ページ番号 | `P6-7`のままでOK（変更不要） |
| 既存シート | **変更する**（下記参照） |

---

## 既存シートのカテゴリ名変更

### 影響分析

**結論: 低リスク - 処理への影響なし**

GASの処理はすべて**カテゴリID（K）**で判定しており、名前部分は表示用のみ。

```javascript
// 実際のコード（919行目）
const categoryId = row[0].split('.')[0].trim();  // "K. レジェンドインタビュー" → "K"
```

| 処理 | 判定に使う値 | 名前変更の影響 |
|------|-------------|---------------|
| 素材チェック | `cat.id` | なし |
| フォルダ作成 | `categoryId` | なし |
| バリデーション | `categoryId` | なし |
| n8nワークフロー | `category` (K) | なし |

### 変更方法

**方法1: スプレッドシートの検索置換（推奨）**

1. 対象シートを開く（例: 202601）
2. `Ctrl + H` で検索と置換を開く
3. 検索: `K. レジェンドインタビュー`
4. 置換: `K. ハイスクール企画`
5. 「すべて置換」

**方法2: GASで一括変更（複数シート対応）**

```javascript
function renameKCategory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  sheets.forEach(sheet => {
    const name = sheet.getName();
    // 号数シートのみ対象（6桁数字）
    if (!/^\d{6}$/.test(name)) return;

    const range = sheet.getRange('A:A');
    const values = range.getValues();

    values.forEach((row, i) => {
      if (row[0] === 'K. レジェンドインタビュー') {
        sheet.getRange(i + 1, 1).setValue('K. ハイスクール企画');
      }
    });
  });
}
```

---

## 作業手順（更新版）

### Step 1: GAS修正

```javascript
// scripts/gas/yumemaga-progress-sheet-generator.js

// 22行目
{ id: 'K', name: 'ハイスクール企画', page: 'P6-7' },

// 143行目
'K': 'K_ハイスクール企画',
```

### Step 2: n8nワークフローJSON修正

`public/n8n-transcription/download/magazine-transcription.json` 内の該当コードを検索置換。

### Step 3: 講座ドキュメント修正

`content/modules/n8n-transcription/module-03-magazine-transcription.md` 内の該当コードを検索置換。

### Step 4: Google Driveフォルダ名変更（手動）

1. https://drive.google.com/drive/folders/1nzhI66AcjdiysN-hcu4YHMXa4VMorQ6M にアクセス
2. フォルダ名を「K_ハイスクール企画」に変更

### Step 5: 既存シートのカテゴリ名変更

スプレッドシートの検索置換で `K. レジェンドインタビュー` → `K. ハイスクール企画`

### Step 6: GASデプロイ

1. Google Apps Script エディタを開く
2. コードを更新
3. 「デプロイ」→「デプロイを管理」→「新しいバージョン」

### Step 7: テンプレート再生成

スプレッドシートで「ゆめマガ管理」→「テンプレート再生成」を実行

---

## 検証項目

- [ ] GASコードが正しく更新されている
- [ ] テンプレート再生成でカテゴリ名が「K. ハイスクール企画」になっている
- [ ] 新しい号を作成してカテゴリ名が正しい
- [ ] Driveフォルダ作成でフォルダ名が正しい
- [ ] n8nワークフローのcatLabelsが正しい
- [ ] 講座ドキュメントのサンプルコードが正しい
- [ ] 既存シート（202601等）のカテゴリ名が変更されている

---

## 備考

- フォルダIDは変わらないため、既存データへの影響はない
- `categoryFolderType`は`'K': 'monthly'`のまま（月ごとに管理）
- 素材構成・ページ番号は変更不要

---

**作成日**: 2025-12-18
**更新日**: 2025-12-18
**前提タスク**: E列「原稿」削除対応完了済み
