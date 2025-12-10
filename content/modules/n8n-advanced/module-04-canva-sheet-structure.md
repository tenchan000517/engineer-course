# カテゴリシート構造の改善

**所要時間**: 20分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- カテゴリシート（canva_A〜E）の新しい13列構成
- GASを使ったヘッダー一括更新
- n8n「Canva用シート振り分け」ワークフローの更新

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 新しいスライド構造（6セット + CTA固定画像）に対応したシート設計を理解する
- GASで複数シートのヘッダーを一括更新する
- n8nのCodeノードとGoogle Sheetsノードのマッピングを更新する

---

## 目次

- [セクション1: 新しい列構成の理解](#セクション1-新しい列構成の理解)
- [セクション2: GASでヘッダーを一括更新](#セクション2-gasでヘッダーを一括更新)
- [セクション3: n8nワークフローの更新](#セクション3-n8nワークフローの更新)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 03まで完了していること
- スプレッドシートへのアクセス権限
- n8nへのアクセス

---

## セクション1: 新しい列構成の理解

### 旧構成の問題点

これまでのcanva_A〜Eシートは16列構成でした：

| 列名 | 用途 |
|------|------|
| post_id | ID |
| narration_1, narration_2 | ナレーション |
| hook | フック（11文字） |
| title_1, title_2, title_3 | タイトル |
| problems | 問題提起 |
| step1_title, step1_content | ステップ1 |
| step2_title, step2_content | ステップ2 |
| step3_title, step3_content | ステップ3 |
| cta | CTA |
| audio_status | 音声ステータス |

この構造には以下の問題がありました：

- ナレーションとスライドの対応関係が不明確
- 60秒動画に対してコンテンツ量が不足
- カテゴリ特性（A〜E）が活かされていない

### 新しい13列構成

新しい構成では、6セットのスライド構造に対応します：

| # | 列名 | 用途 |
|---|------|------|
| 1 | post_id | ID |
| 2 | narration_1 | 前半ナレーション |
| 3 | narration_2 | 後半ナレーション |
| 4 | thumb_main | サムネメイン（8文字） |
| 5 | thumb_sub | サムネサブ（6文字×3行改行区切り） |
| 6 | set_1 | フック（3行改行区切り） |
| 7 | set_2 | 展開前半 or 第5位 |
| 8 | set_3 | 展開後半 or 第4位 |
| 9 | set_4 | 核心前半 or 第3位 |
| 10 | set_5 | 核心後半 or 第2位 |
| 11 | set_6 | 結論 or 第1位 |
| 12 | audio_status | 音声ステータス |
| 13 | main_tool | メイン紹介ツール（なければ空欄） |

### 変更のポイント

| 変更点 | 旧（16列） | 新（13列） |
|--------|------------|------------|
| サムネイル | hook + title_1〜3（4列） | thumb_main + thumb_sub（2列） |
| スライド本文 | problems + step1〜3（7列） | set_1〜6（6列） |
| CTA | cta（1列） | 削除（固定画像化） |
| ツール情報 | なし | main_tool（1列追加） |

CTAは毎回同じ画像を使い回すため、Geminiで生成する必要がなくなりました。

### チェックポイント

- [ ] 新しい13列構成を理解した
- [ ] 旧構成との違いを把握した

---

## セクション2: GASでヘッダーを一括更新

### ステップ1: Apps Scriptを開く

スプレッドシートで「拡張機能」→「Apps Script」を開きます。

### ステップ2: コードを貼り付け

以下のコードを貼り付けます：

```javascript
/**
 * canva_A〜Eシートのヘッダーを新しい13列構成に変更
 * 1度だけ実行してください
 */
function updateCanvaSheetHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const newHeaders = [
    'post_id',
    'narration_1',
    'narration_2',
    'thumb_main',
    'thumb_sub',
    'set_1',
    'set_2',
    'set_3',
    'set_4',
    'set_5',
    'set_6',
    'audio_status',
    'main_tool'
  ];

  const canvaSheets = ['canva_A', 'canva_B', 'canva_C', 'canva_D', 'canva_E'];

  canvaSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(sheetName + ' が見つかりません');
      return;
    }

    // 既存データがあれば警告
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      Logger.log('警告: ' + sheetName + ' に既存データがあります（' + (lastRow - 1) + '行）');
    }

    // 1行目をクリアして新ヘッダーをセット
    const lastCol = sheet.getLastColumn();
    if (lastCol > 0) {
      sheet.getRange(1, 1, 1, lastCol).clearContent();
    }

    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);

    Logger.log(sheetName + ' のヘッダーを更新しました');
  });

  Logger.log('完了: 全シートのヘッダーを13列に更新しました');
}
```

### ステップ3: 実行

`updateCanvaSheetHeaders`を選択して実行します。

GAS実行結果：

![GASでヘッダーを更新した実行ログ](/n8n-advanced/module-04-gas-update-headers.png)

実行ログで以下を確認してください：
- 各シート（canva_A〜E）のヘッダーが更新されたこと
- 「完了: 全シートのヘッダーを13列に更新しました」と表示されること

### ステップ4: コードを削除

実行後、このコードは不要なので削除してください（1度限りの使用）。

### チェックポイント

- [ ] GASコードを貼り付けた
- [ ] 実行して全シートのヘッダーが更新された
- [ ] 使用後のコードを削除した

---

## セクション3: n8nワークフローの更新

### 概要

「Canva用シート振り分け」ワークフローを新しい13列構成に対応させます。

ワークフロー全体図：

![Canva用シート振り分けワークフロー全体図](/n8n-advanced/module-04-workflow-overview.png)

更新が必要なノード：
1. **Parse JSON & Category** - Codeノードの出力フィールド
2. **Append to canva_A〜E** - Google Sheetsノードのマッピング

### ステップ1: Parse JSON & Categoryノードを更新

Codeノードを開き、以下のコードに置き換えます：

```javascript
const results = [];

for (const item of $input.all()) {
  const postId = item.json.post_id;
  const contentJsonStr = item.json.content_json;

  if (!contentJsonStr) continue;

  try {
    const json = JSON.parse(contentJsonStr);
    const pattern = json.pattern || '';

    let category = '';
    switch (pattern) {
      case 'versus': category = 'A'; break;
      case 'instant_hack': category = 'B'; break;
      case 'secret_feature': category = 'C'; break;
      case 'warning': category = 'D'; break;
      case 'ranking': category = 'E'; break;
      default: category = 'C';
    }

    results.push({
      json: {
        post_id: postId,
        category: category,
        narration_1: json.narration_1 || '',
        narration_2: json.narration_2 || '',
        thumb_main: json.thumb_main || '',
        thumb_sub: json.thumb_sub || '',
        set_1: json.set_1 || '',
        set_2: json.set_2 || '',
        set_3: json.set_3 || '',
        set_4: json.set_4 || '',
        set_5: json.set_5 || '',
        set_6: json.set_6 || '',
        audio_status: 'NORMAL',
        main_tool: json.main_tool || ''
      }
    });
  } catch (e) {
    // skip invalid JSON
  }
}

return results;
```

Parse JSON & Categoryノードの設定：

![Parse JSON & Categoryノードのコード](/n8n-advanced/module-04-parse-json-code.png)

### ステップ2: Append to canva_Aノードを更新

Google Sheetsノードを開き、「Values to Send」を以下のように設定します：

| 列名 | Value |
|------|-------|
| post_id | `{{ $json.post_id }}` |
| narration_1 | `{{ $json.narration_1 }}` |
| narration_2 | `{{ $json.narration_2 }}` |
| thumb_main | `{{ $json.thumb_main }}` |
| thumb_sub | `{{ $json.thumb_sub }}` |
| set_1 | `{{ $json.set_1 }}` |
| set_2 | `{{ $json.set_2 }}` |
| set_3 | `{{ $json.set_3 }}` |
| set_4 | `{{ $json.set_4 }}` |
| set_5 | `{{ $json.set_5 }}` |
| set_6 | `{{ $json.set_6 }}` |
| audio_status | `{{ $json.audio_status }}` |
| main_tool | `{{ $json.main_tool }}` |

Append to canva_Aの設定画面：

![Append to canva_Aの設定](/n8n-advanced/module-04-append-canva-a.png)

### ステップ3: canva_B〜Eも同様に更新

残りの4つのノード（Append to canva_B〜E）も同じマッピングに更新します。

全カテゴリで同じ13列構成を使用するため、マッピング内容は同一です。

### チェックポイント

- [ ] Parse JSON & Categoryノードを更新した
- [ ] Append to canva_Aのマッピングを更新した
- [ ] Append to canva_B〜Eも同様に更新した

---

## トラブルシューティング

### GASで「シートが見つかりません」と表示される

**症状**: 実行ログに「canva_A が見つかりません」等と表示される

**解決方法**: スプレッドシートにcanva_A〜Eシートが存在するか確認してください。シート名が完全に一致している必要があります（大文字小文字も含む）。

### n8nでマッピングエラーが発生する

**症状**: 「Column not found」エラーが表示される

**解決方法**:
1. スプレッドシートのヘッダー行が正しく更新されているか確認
2. Google Sheetsノードで「Refresh」ボタンを押してスキーマを再取得

---

## まとめ

### このモジュールで学んだこと

- 新しい13列構成の設計理由と構造
- GASを使った複数シートのヘッダー一括更新
- n8nのCodeノードとGoogle Sheetsノードの更新方法

### 次のステップ

次のセクションでは、「SNS投稿作成」ワークフローのGeminiプロンプトを改善版に更新し、新しい13列構成でコンテンツを生成できるようにします。

---

## 参考資料

- [CONTENT-QUALITY.md](/content/CONTENT-QUALITY.md) - プロンプト設計、スライド構造の詳細

---

## よくある質問

**Q: なぜ16列から13列に減ったのですか？**
A: CTAを固定画像化したこと、サムネイルを改行区切りで圧縮したことで列数が減りました。一方でmain_tool列を追加し、メイン紹介ツールを明示的に管理できるようになりました。

**Q: 旧データとの互換性はありますか？**
A: ありません。このモジュールの変更は、今後生成するコンテンツに適用されます。既存データはarchiveシートに保存されており、旧構造のままです。

**Q: カテゴリEだけ構造が違うのでは？**
A: 列構成は全カテゴリ共通です。ただし、set_2〜set_6の「用途」がカテゴリによって異なります（A〜Dは展開/核心/結論、Eは第5位〜第1位）。

**Q: main_tool列は何に使いますか？**
A: そのコンテンツで紹介するメインツール名が入ります。比較系（カテゴリA）や紹介系（カテゴリB, C）で使用し、ランキング系（カテゴリE）では空欄になることがあります。

**Q: archiveAndCleanCanvaSheetsのGASは修正が必要ですか？**
A: いいえ、`sheet.getLastColumn()`で動的に列数を取得しているため、そのまま動作します。
