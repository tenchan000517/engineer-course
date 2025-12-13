# ワークフロー最適化 - GAS統合とn8n簡略化

**所要時間**: 30分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Module 06のAntigravity出力をスプレッドシートに取り込む方法
- GASによるideas + posts + canva振り分けの一括処理
- n8nワークフローの簡略化（Gemini不要）
- statusフローの整理

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- GASメニューからAntigravity出力を一括インポートできる
- Canvaシートへの振り分けをGASで実行できる
- n8nワークフローの役割分担を理解できる

---

## 目次

- [セクション1: なぜ最適化が必要か](#セクション1-なぜ最適化が必要か)
- [セクション2: 新しいフロー構成](#セクション2-新しいフロー構成)
- [セクション3: GASの更新](#セクション3-gasの更新)
- [セクション4: スプレッドシートの準備](#セクション4-スプレッドシートの準備)
- [セクション5: n8nワークフローの修正](#セクション5-n8nワークフローの修正)
- [セクション6: 動作確認](#セクション6-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 06完了（Antigravityでideas生成済み）
- スプレッドシートへのアクセス権限
- GASエディタへのアクセス権限

### 前提知識

- Module 03のGASインポート機能を理解している
- n8nのワークフロー構造を理解している

---

## セクション1: なぜ最適化が必要か

### 従来のフロー（Module 03-05）

```
Antigravity → 93件の骨格JSON → configシートA2 → GAS → ideasシート
    ↓
n8n「SNS投稿作成advanced」
    ↓
ideasシート(NEW) → Gemini API → 完成品生成 → postsシート(DRAFT)
    ↓
n8n「Canva用シート振り分けadvanced」
    ↓
postsシート(DRAFT) → カテゴリ判定 → canva_A〜Eシート
```

### 問題点

| 問題 | 詳細 |
|------|------|
| Gemini APIの制限 | 5件ずつの処理、API料金、レート制限 |
| 二重処理 | Antigravityで調査済みの内容をGeminiが再生成 |
| ハルシネーション | Geminiが架空のツール名や機能を生成するリスク |
| 複雑なフロー | n8nワークフローが2つ必要 |

### 解決策

**Antigravityで完成品を生成し、GASで一括処理する**

Module 06でAntigravityが完成品（narration, set_1〜6等含む）を出力するようになったため、Gemini APIは不要になりました。

### チェックポイント

- [ ] 従来フローの問題点を理解した
- [ ] Gemini APIが不要になった理由を理解した

---

## セクション2: 新しいフロー構成

### 新フロー

```
Antigravity → 完成品JSON → configシートA2
    ↓
GASメニュー「configA2からideas+postsに追加」
    ↓
ideasシート(ADOPTED) + postsシート(DRAFT)
    ↓
GASメニュー「postsからCanvaシートに振り分け」
    ↓
canva_A〜Eシート + postsシート(CANVA_READY)
    ↓
Canvaで一括生成 → 動画ファイル
    ↓
n8n「音声合成advanced」（変更なし）
    ↓
n8n「Instagram Reel from Drive v5」（フィルタ変更のみ）
```

### statusの流れ

| status | 意味 | 次のアクション |
|--------|------|---------------|
| DRAFT | postsに追加済み、Canva振り分け前 | GASでCanva振り分け |
| CANVA_READY | Canva振り分け済み | Instagram投稿待ち |
| PUBLISHED | Instagram投稿完了 | 完了 |

### メリット

| 項目 | 改善内容 |
|------|----------|
| API料金 | Gemini API不要で削減 |
| 処理時間 | GASで一括処理、数秒で完了 |
| 品質 | Antigravityの事実ベースコンテンツをそのまま使用 |
| シンプル | n8nワークフロー2つが不要に |

### チェックポイント

- [ ] 新フローの全体像を理解した
- [ ] statusの流れを理解した

---

## セクション3: GASの更新

### GASエディタを開く

1. スプレッドシートを開く
2. **[拡張機能] > [Apps Script]** をクリック

### コード全文

以下のコードで既存のGASを**全て置き換え**てください：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('コンテンツ管理')
    .addItem('configA2からideas+postsに追加', 'importAndProcess')
    .addItem('postsからCanvaシートに振り分け', 'distributeToCanva')
    .addToUi();
}

/**
 * configシートのA2にあるJSONをideas+postsシートに追加
 * メニューから呼び出し用
 */
function importAndProcess() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');
  const postsSheet = ss.getSheetByName('posts');

  const jsonStr = configSheet.getRange('A2').getValue();
  if (!jsonStr) {
    SpreadsheetApp.getUi().alert('configシートのA2にJSONがありません');
    return;
  }

  const items = JSON.parse(jsonStr);
  if (!Array.isArray(items)) {
    SpreadsheetApp.getUi().alert('JSONは配列形式である必要があります');
    return;
  }

  const now = new Date();

  // 既存のpost_idを取得
  const postsLastRow = postsSheet.getLastRow();
  const existingPostIds = postsLastRow > 1
    ? postsSheet.getRange(2, 1, postsLastRow - 1, 1).getValues().flat()
    : [];

  const ideasRows = [];
  const postsRows = [];

  items.forEach(item => {
    const ideaId = item.idea_id;  // Antigravityで一意のIDを振る
    const postId = ideaId.replace('IDEA-', 'POST-');

    // ideasに追加する行
    ideasRows.push([
      ideaId,
      item.month || '',
      item.title || '',
      item.main_tool || '',
      '',
      item.category || '',
      '',
      'ADOPTED',
      '',
      now,
      JSON.stringify(item)
    ]);

    // 重複チェック
    if (!existingPostIds.includes(postId)) {
      postsRows.push([
        postId,
        'REEL',
        'DRAFT',
        item.caption || '',
        item.hashtags ? item.hashtags.join(',') : '',
        '', '', '', '', '', '', '', '',
        now,
        '',
        '',
        JSON.stringify(item)
      ]);
    }
  });

  // ideas追加
  if (ideasRows.length > 0) {
    const ideasLastRow = ideasSheet.getLastRow();
    ideasSheet.getRange(ideasLastRow + 1, 1, ideasRows.length, 11).setValues(ideasRows);
  }

  // posts追加
  if (postsRows.length > 0) {
    const postsLastRow2 = postsSheet.getLastRow();
    postsSheet.getRange(postsLastRow2 + 1, 1, postsRows.length, 17).setValues(postsRows);
  }

  SpreadsheetApp.getUi().alert(
    'ideas: ' + ideasRows.length + '件追加\n' +
    'posts: ' + postsRows.length + '件追加（重複スキップ: ' + (ideasRows.length - postsRows.length) + '件）'
  );
}

/**
 * postsシートのDRAFTをcanva_A〜Eに振り分け
 * メニューから呼び出し用
 */
function distributeToCanva() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Canvaシート振り分け',
    'canva_A〜Eシートをクリアして、DRAFTのpostsを振り分けます。\n既存のCanvaデータは削除されます。続行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const postsSheet = ss.getSheetByName('posts');

  // canvaシートをクリア
  const canvaSheets = ['canva_A', 'canva_B', 'canva_C', 'canva_D', 'canva_E'];
  canvaSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
  });

  // postsからDRAFTを取得
  const postsData = postsSheet.getDataRange().getValues();
  const headers = postsData[0];
  const statusCol = headers.indexOf('status');
  const contentJsonCol = headers.indexOf('content_json');
  const postIdCol = headers.indexOf('post_id');

  const canvaRows = { A: [], B: [], C: [], D: [], E: [] };
  const updatedRows = [];

  for (let i = 1; i < postsData.length; i++) {
    if (postsData[i][statusCol] !== 'DRAFT') continue;

    const postId = postsData[i][postIdCol];
    const contentJsonStr = postsData[i][contentJsonCol];
    if (!contentJsonStr) continue;

    try {
      const json = JSON.parse(contentJsonStr);
      const category = json.category || 'C';

      const row = [
        postId,
        json.narration_1 || '',
        json.narration_2 || '',
        json.thumb_main || '',
        json.thumb_sub || '',
        json.set_1 || '',
        json.set_2 || '',
        json.set_3 || '',
        json.set_4 || '',
        json.set_5 || '',
        json.set_6 || '',
        'NORMAL',
        json.main_tool || ''
      ];

      if (canvaRows[category]) {
        canvaRows[category].push(row);
        updatedRows.push(i + 1);
      }
    } catch (e) {
      // skip invalid JSON
    }
  }

  // canvaシートに追加
  let totalAdded = 0;
  Object.keys(canvaRows).forEach(cat => {
    if (canvaRows[cat].length > 0) {
      const sheet = ss.getSheetByName('canva_' + cat);
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, canvaRows[cat].length, 13).setValues(canvaRows[cat]);
      totalAdded += canvaRows[cat].length;
    }
  });

  // postsのstatusを更新
  updatedRows.forEach(rowNum => {
    postsSheet.getRange(rowNum, statusCol + 1).setValue('CANVA_READY');
  });

  ui.alert(
    '振り分け完了',
    'canva_A〜Eに ' + totalAdded + ' 件追加しました。\n' +
    'A: ' + canvaRows.A.length + '件\n' +
    'B: ' + canvaRows.B.length + '件\n' +
    'C: ' + canvaRows.C.length + '件\n' +
    'D: ' + canvaRows.D.length + '件\n' +
    'E: ' + canvaRows.E.length + '件',
    ui.ButtonSet.OK
  );
}

/**
 * n8nからのHTTPリクエストを処理
 */
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const jsonStr = e.postData.contents;
  const data = JSON.parse(jsonStr);

  // === action分岐 ===
  if (data.action === 'archiveAndCleanCanvaSheets') {
    try {
      const result = archiveAndCleanCanvaSheets();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // === updateAudioStatus ===
  if (data.action === 'updateAudioStatus') {
    try {
      const result = updateAudioStatus(data.postId, data.category, data.status);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: false, error: 'Unknown action' })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 指定したカテゴリのcanvaシートでaudio_statusを更新
 */
function updateAudioStatus(postId, category, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'canva_' + category;
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return { success: false, error: 'Sheet not found: ' + sheetName };
  }

  const sheetData = sheet.getDataRange().getValues();
  const headers = sheetData[0];
  const postIdCol = headers.indexOf('post_id');
  const audioStatusCol = headers.indexOf('audio_status');

  if (postIdCol === -1 || audioStatusCol === -1) {
    return { success: false, error: 'Required columns not found' };
  }

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][postIdCol] === postId) {
      sheet.getRange(i + 1, audioStatusCol + 1).setValue(status);
      return { success: true, postId: postId, category: category, status: status };
    }
  }

  return { success: false, error: 'Post not found: ' + postId };
}

/**
 * canva_A〜Eのデータをarchiveへコピーし、canvaシートをクリア
 */
function archiveAndCleanCanvaSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const archiveSheet = ss.getSheetByName('archive');

  if (!archiveSheet) {
    throw new Error('archiveシートが見つかりません。');
  }

  const canvaSheets = ['canva_A', 'canva_B', 'canva_C', 'canva_D', 'canva_E'];
  const now = new Date().toISOString();
  let totalArchived = 0;

  canvaSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return;

    const lastCol = sheet.getLastColumn();
    const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    data.forEach(row => {
      if (!row[0]) return;
      archiveSheet.appendRow([...row, now, sheetName]);
      totalArchived++;
    });

    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  });

  return {
    success: true,
    archivedCount: totalArchived,
    timestamp: now
  };
}
```

### コードの保存とデプロイ

1. **Ctrl + S** で保存
2. スプレッドシートを**再読み込み**（F5）
3. 数秒待つと「コンテンツ管理」メニューが表示される

### チェックポイント

- [ ] GASコードを全て置き換えた
- [ ] 保存してスプレッドシートを再読み込みした
- [ ] 「コンテンツ管理」メニューが表示された

---

## セクション4: スプレッドシートの準備

### ideasシートの列構成

ideasシートに11列目「content_json」を追加してください：

| # | 列名 |
|---|------|
| 1 | idea_id |
| 2 | month |
| 3 | title |
| 4 | main_tool |
| 5 | content_type |
| 6 | category |
| 7 | research_points |
| 8 | status |
| 9 | adopted_post |
| 10 | created_at |
| 11 | **content_json**（新規追加） |

### Antigravityのidea_id形式

重複を防ぐため、Antigravityで生成するidea_idは**一意のID**にしてください：

```
IDEA-YYYYMMDDHHMM-001
```

例：`IDEA-202512111600-001`（2025年12月11日16時00分の1件目）

### チェックポイント

- [ ] ideasシートに11列目「content_json」を追加した
- [ ] Antigravityのidea_id形式を理解した

---

## セクション5: n8nワークフローの修正

### 不要になったワークフロー

以下のワークフローは**実行不要**になりました：

| ワークフロー | 理由 |
|-------------|------|
| SNS投稿作成advanced | GASのimportAndProcessで代替 |
| Canva用シート振り分けadvanced | GASのdistributeToCanvaで代替 |

### 修正が必要なワークフロー

**Instagram Reel from Drive v5** の「Get DRAFT Posts」ノードを修正：

1. ノードをダブルクリックして開く
2. Filters セクションを確認
3. Value を `DRAFT` → `CANVA_READY` に変更

修正後の設定画面：

![Get DRAFT Postsの修正](/n8n-advanced/module-07-canva-ready-filter.png)

### 変更なしのワークフロー

以下のワークフローは**変更不要**です：

| ワークフロー | 理由 |
|-------------|------|
| 音声合成advanced | canvaシートのaudio_statusを見ているため影響なし |

### チェックポイント

- [ ] SNS投稿作成advancedが不要になったことを理解した
- [ ] Canva用シート振り分けadvancedが不要になったことを理解した
- [ ] Instagram Reel from Drive v5のフィルタを修正した

---

## セクション6: 動作確認

### ステップ1: Antigravity出力のインポート

1. Module 06で生成したJSONをコピー
2. configシートのA2セルに貼り付け
3. **[コンテンツ管理] > [configA2からideas+postsに追加]** を実行

期待される結果：
- ideasシートに行が追加される（status: ADOPTED）
- postsシートに行が追加される（status: DRAFT）

### ステップ2: Canva振り分け

1. **[コンテンツ管理] > [postsからCanvaシートに振り分け]** を実行
2. 確認ダイアログで「はい」を選択

期待される結果：
- canva_A〜Eシートにデータが振り分けられる
- postsシートのstatusが「CANVA_READY」に更新される

### ステップ3: 後続フローの確認

1. Canvaで一括生成を実行
2. n8n「音声合成advanced」を実行
3. n8n「Instagram Reel from Drive v5」を実行（フィルタ: CANVA_READY）

### チェックポイント

- [ ] ideas + postsへのインポートが成功した
- [ ] Canva振り分けが成功した
- [ ] postsのstatusがCANVA_READYに更新された

---

## トラブルシューティング

### 「コンテンツ管理」メニューが表示されない

**原因**: onOpen関数が実行されていない

**解決方法**:
1. スプレッドシートを完全に閉じる
2. 再度開く
3. 数秒待つ

### 「JSONは配列形式である必要があります」エラー

**原因**: Antigravityの出力形式が間違っている

**解決方法**: 出力が `[{...}, {...}]` の配列形式になっているか確認

### 重複スキップが多すぎる

**原因**: 同じJSONを複数回インポートしている

**解決方法**: idea_idが一意になるようAntigravityの出力を確認

---

## まとめ

### このモジュールで学んだこと

- GASによるideas + posts + canva振り分けの一括処理
- n8nワークフローの簡略化（2つが不要に）
- statusフロー（DRAFT → CANVA_READY → PUBLISHED）

### 新旧フロー比較

| 項目 | 旧フロー | 新フロー |
|------|----------|----------|
| Gemini API | 必要 | 不要 |
| n8nワークフロー | 4つ | 2つ |
| GASメニュー | 1つ | 2つ |
| 処理時間 | 数分〜数十分 | 数秒 |

### 次のステップ

- Antigravityワークフローのidea_id形式を統一する
- 運用フローを確立する

---

## 参考資料

- [Google Apps Script リファレンス](https://developers.google.com/apps-script/reference)

---

## よくある質問

**Q: 従来のGASコードは残しておく必要がありますか？**
A: いいえ。新しいコードで完全に置き換えてください。doPost関数は音声合成ワークフローで使用するため残っています。

**Q: SNS投稿作成advancedは削除してもいいですか？**
A: はい。ただし、念のためエクスポートしてバックアップを取っておくことをお勧めします。

**Q: Canva振り分けを実行すると既存データが消えますか？**
A: はい。確認ダイアログが表示され、「はい」を選択するとcanva_A〜Eシートの既存データはクリアされます。CSVダウンロード済みであれば問題ありません。

**Q: statusがDRAFTのままのデータはどうなりますか？**
A: Canva振り分けを実行するまでDRAFTのままです。Instagram投稿ワークフローはCANVA_READYのみを対象とするため、投稿されません。

**Q: idea_idの形式は必ず守る必要がありますか？**
A: 一意であれば形式は自由です。ただし、POST-に変換されるため、IDEA-プレフィックスを推奨します。
