# 投稿管理シートを設計する

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Google Apps Script（GAS）でスプレッドシートにシートを自動作成する方法
- 投稿管理に必要なデータ構造（posts/mediaシート）
- ドロップダウン（データの入力規則）の設定
- n8nのデータフローの基本

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- GASを使ってスプレッドシートにシートを作成できる
- 投稿管理に必要な列構造を理解している
- n8nでデータがどのように流れるか理解している

---

## 目次

- [セクション1: シート設計の理解](#セクション1-シート設計の理解)
- [セクション2: GASでシートを作成](#セクション2-gasでシートを作成)
- [セクション3: テストデータの投入](#セクション3-テストデータの投入)
- [セクション4: n8nデータフローの理解](#セクション4-n8nデータフローの理解)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 04で作成したn8n-testスプレッドシート
- Module 04で設定したGoogle Sheets認証情報

### 前提知識

- Module 04: Google Sheets連携の基本操作

---

## セクション1: シート設計の理解

### 投稿管理システムの構成

Instagram投稿を管理するために、2つのシートを作成します。

| シート | 役割 |
|--------|------|
| posts | 投稿の管理（キャプション、ステータス、投稿日時など） |
| media | メディアファイルの管理（画像URL、サイズなど） |

### postsシートの列構造

| 列名 | 型 | 説明 |
|------|-----|------|
| post_id | TEXT | 一意の投稿ID（POST-001） |
| post_type | TEXT | IMAGE / CAROUSEL / REELS |
| status | TEXT | DRAFT / READY / PROCESSING / PUBLISHED / FAILED |
| caption | TEXT | キャプション本文 |
| hashtags | TEXT | ハッシュタグ（カンマ区切り） |
| media_ids | TEXT | 参照するメディアID（カンマ区切り） |
| scheduled_at | DATETIME | 投稿予定日時 |
| published_at | DATETIME | 実際の投稿日時 |
| ig_post_id | TEXT | Instagram投稿ID |
| share_to_feed | BOOLEAN | リールをフィードにも表示 |
| thumb_offset_ms | NUMBER | サムネイル位置（ミリ秒） |
| error_message | TEXT | エラーメッセージ |
| retry_count | NUMBER | リトライ回数 |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |
| notes | TEXT | メモ |

### mediaシートの列構造

| 列名 | 型 | 説明 |
|------|-----|------|
| media_id | TEXT | 一意のメディアID（MEDIA-001） |
| media_type | TEXT | IMAGE / VIDEO |
| source | TEXT | URL / CLOUDINARY / CANVA / AI_GENERATED / DRIVE |
| original_url | TEXT | 元のURL/パス |
| public_url | TEXT | 公開URL（Instagram投稿用） |
| cloudinary_id | TEXT | Cloudinary Public ID |
| canva_design_id | TEXT | CanvaデザインID |
| filename | TEXT | ファイル名 |
| width | NUMBER | 幅（px） |
| height | NUMBER | 高さ（px） |
| duration_sec | NUMBER | 動画の長さ（秒） |
| file_size_mb | NUMBER | ファイルサイズ（MB） |
| status | TEXT | PENDING / UPLOADING / READY / ERROR |
| ig_container_id | TEXT | Instagram Container ID |
| error_message | TEXT | エラーメッセージ |
| created_at | DATETIME | 作成日時 |

### ステータスフロー

```
[DRAFT] → [READY] → [PROCESSING] → [PUBLISHED]
              ↓           ↓
           (手動変更)   [FAILED] → (リトライ) → [READY]
```

| ステータス | 説明 |
|------------|------|
| DRAFT | 下書き（編集中） |
| READY | 投稿準備完了（n8nが自動で取得） |
| PROCESSING | 投稿処理中 |
| PUBLISHED | 投稿完了 |
| FAILED | 投稿失敗 |

### チェックポイント

- [ ] postsシートの列構造を理解した
- [ ] mediaシートの列構造を理解した
- [ ] ステータスフローを理解した

---

## セクション2: GASでシートを作成

### Step 1: Apps Scriptを開く

1. n8n-testスプレッドシートを開く
2. メニューから **拡張機能** → **Apps Script** を選択

![Apps Scriptを開く](/n8n-setup/70-apps-script-menu.png)

### Step 2: シート作成スクリプトを貼り付け

以下のコードをエディタに貼り付けます。

![GASコード貼り付け](/n8n-setup/71-gas-code.png)

```javascript
function setupPostManagementSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // === postsシート作成 ===
  let postsSheet = ss.getSheetByName('posts');
  if (!postsSheet) {
    postsSheet = ss.insertSheet('posts');
  } else {
    postsSheet.clear();
  }

  const postsHeaders = [
    'post_id', 'post_type', 'status', 'caption', 'hashtags',
    'media_ids', 'scheduled_at', 'published_at', 'ig_post_id',
    'share_to_feed', 'thumb_offset_ms', 'error_message',
    'retry_count', 'created_at', 'updated_at', 'notes'
  ];

  postsSheet.getRange(1, 1, 1, postsHeaders.length).setValues([postsHeaders]);

  // ヘッダー行の書式設定
  const postsHeaderRange = postsSheet.getRange(1, 1, 1, postsHeaders.length);
  postsHeaderRange.setBackground('#4a86e8');
  postsHeaderRange.setFontColor('#ffffff');
  postsHeaderRange.setFontWeight('bold');
  postsSheet.setFrozenRows(1);

  // 列幅設定
  const postsWidths = [100, 100, 100, 300, 200, 150, 150, 150, 150, 100, 120, 200, 80, 150, 150, 200];
  postsWidths.forEach((w, i) => postsSheet.setColumnWidth(i + 1, w));

  // post_type ドロップダウン（B2:B100）
  const postTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['IMAGE', 'CAROUSEL', 'REELS'], true)
    .build();
  postsSheet.getRange('B2:B100').setDataValidation(postTypeRule);

  // status ドロップダウン（C2:C100）
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['DRAFT', 'READY', 'PROCESSING', 'PUBLISHED', 'FAILED'], true)
    .build();
  postsSheet.getRange('C2:C100').setDataValidation(statusRule);

  // share_to_feed ドロップダウン（J2:J100）
  const boolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'], true)
    .build();
  postsSheet.getRange('J2:J100').setDataValidation(boolRule);

  // === mediaシート作成 ===
  let mediaSheet = ss.getSheetByName('media');
  if (!mediaSheet) {
    mediaSheet = ss.insertSheet('media');
  } else {
    mediaSheet.clear();
  }

  const mediaHeaders = [
    'media_id', 'media_type', 'source', 'original_url', 'public_url',
    'cloudinary_id', 'canva_design_id', 'filename', 'width', 'height',
    'duration_sec', 'file_size_mb', 'status', 'ig_container_id',
    'error_message', 'created_at'
  ];

  mediaSheet.getRange(1, 1, 1, mediaHeaders.length).setValues([mediaHeaders]);

  // ヘッダー行の書式設定
  const mediaHeaderRange = mediaSheet.getRange(1, 1, 1, mediaHeaders.length);
  mediaHeaderRange.setBackground('#6aa84f');
  mediaHeaderRange.setFontColor('#ffffff');
  mediaHeaderRange.setFontWeight('bold');
  mediaSheet.setFrozenRows(1);

  // 列幅設定
  const mediaWidths = [100, 100, 120, 250, 250, 150, 150, 150, 80, 80, 100, 100, 100, 150, 200, 150];
  mediaWidths.forEach((w, i) => mediaSheet.setColumnWidth(i + 1, w));

  // media_type ドロップダウン（B2:B100）
  const mediaTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['IMAGE', 'VIDEO'], true)
    .build();
  mediaSheet.getRange('B2:B100').setDataValidation(mediaTypeRule);

  // source ドロップダウン（C2:C100）
  const sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['URL', 'CLOUDINARY', 'CANVA', 'AI_GENERATED', 'DRIVE'], true)
    .build();
  mediaSheet.getRange('C2:C100').setDataValidation(sourceRule);

  // media status ドロップダウン（M2:M100）
  const mediaStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PENDING', 'UPLOADING', 'READY', 'ERROR'], true)
    .build();
  mediaSheet.getRange('M2:M100').setDataValidation(mediaStatusRule);

  // シートを先頭に移動
  ss.setActiveSheet(postsSheet);
  ss.moveActiveSheet(1);
  ss.setActiveSheet(mediaSheet);
  ss.moveActiveSheet(2);

  SpreadsheetApp.getUi().alert('posts / media シートを作成しました');
}
```

### Step 3: スクリプトを実行

1. **保存**（Ctrl+S）
2. 関数選択ドロップダウンで `setupPostManagementSheets` を選択
3. **実行** ボタンをクリック
4. 初回は承認を求められるので許可

「承認が必要です」と表示されたら **権限を確認** をクリック。

![承認が必要です](/n8n-setup/72-auth-required.png)

「このアプリは Google で確認されていません」と表示されたら、左下の **詳細** をクリックし、**（安全ではないページ）に移動** をクリック。

![Googleで確認されていません](/n8n-setup/73-unverified-app.png)

アクセス権限の確認画面で **続行** をクリック。

![アクセス権限確認](/n8n-setup/74-permission-confirm.png)

実行が完了すると、実行ログに「実行完了」と表示されます。

![GAS実行ログ](/n8n-setup/76-gas-log.png)

### Step 4: 結果を確認

- postsシート（青いヘッダー）が作成される
- mediaシート（緑のヘッダー）が作成される
- 各列にドロップダウンが設定される

![postsシート](/n8n-setup/77-posts-sheet.png)

![mediaシート完成](/n8n-setup/75-media-sheet-done.png)

### チェックポイント

- [ ] Apps Scriptを開けた
- [ ] スクリプトを実行できた
- [ ] postsシートが作成された（青いヘッダー）
- [ ] mediaシートが作成された（緑のヘッダー）
- [ ] ドロップダウンが設定されている

---

## セクション3: テストデータの投入

### Step 1: テストデータ投入スクリプト

Apps Scriptに以下のコードを追加します。

```javascript
function insertTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // mediaシートにテストデータ
  const mediaSheet = ss.getSheetByName('media');
  const mediaData = [
    'MEDIA-001',                          // media_id
    'IMAGE',                              // media_type
    'URL',                                // source
    '',                                   // original_url
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080', // public_url
    '',                                   // cloudinary_id
    '',                                   // canva_design_id
    'test-image.jpg',                     // filename
    1080,                                 // width
    1350,                                 // height
    '',                                   // duration_sec
    '',                                   // file_size_mb
    'READY',                              // status
    '',                                   // ig_container_id
    '',                                   // error_message
    new Date()                            // created_at
  ];
  mediaSheet.getRange(2, 1, 1, mediaData.length).setValues([mediaData]);

  // postsシートにテストデータ
  const postsSheet = ss.getSheetByName('posts');
  const postsData = [
    'POST-001',                           // post_id
    'IMAGE',                              // post_type
    'READY',                              // status
    'n8n test from sheet',                // caption
    '#n8n,#automation',                   // hashtags
    'MEDIA-001',                          // media_ids
    '',                                   // scheduled_at
    '',                                   // published_at
    '',                                   // ig_post_id
    'FALSE',                              // share_to_feed
    '',                                   // thumb_offset_ms
    '',                                   // error_message
    0,                                    // retry_count
    new Date(),                           // created_at
    new Date(),                           // updated_at
    ''                                    // notes
  ];
  postsSheet.getRange(2, 1, 1, postsData.length).setValues([postsData]);

  SpreadsheetApp.getUi().alert('テストデータを投入しました');
}
```

### Step 2: 実行して確認

1. 関数選択で `insertTestData` を選択
2. **実行** をクリック
3. シートにテストデータが投入される

![テストデータ投入ログ](/n8n-setup/78-test-data-log.png)

![テストデータ投入後](/n8n-setup/79-test-data-done.png)

### チェックポイント

- [ ] テストデータ投入スクリプトを実行できた
- [ ] postsシートにPOST-001が追加された
- [ ] mediaシートにMEDIA-001が追加された
- [ ] statusがREADYになっている

---

## セクション4: n8nデータフローの理解

### n8nのデータ構造

n8nでは、全てのデータはJSONオブジェクトの配列として渡されます。

```javascript
// 例: Google Sheetsから取得したデータ
[
  {
    "post_id": "POST-001",
    "post_type": "IMAGE",
    "status": "READY",
    "caption": "n8n test from sheet",
    ...
  }
]
```

### ノード間のデータフロー

```
[トリガー] → JSONデータ出力 → [次のノード] → JSONデータ出力 → [次のノード]
```

- 各ノードは前のノードの出力を自動的に受け取る
- `$json` で前のノードのデータにアクセス
- 例: `$json.caption` で前のノードのcaptionフィールドを取得

### トリガーの種類

| トリガー | 用途 |
|---------|------|
| Schedule Trigger | 定期実行（Cron） |
| Manual Trigger | 手動実行 |
| Webhook Trigger | 外部からのHTTPリクエスト |
| Form Trigger | フォーム入力 |

### 投稿ワークフローの構成

```
[Manual Trigger / Schedule Trigger]
   ↓
[Google Sheets: Get Rows] ← status=READYを取得
   ↓
[Instagram投稿処理]
   ↓
[Google Sheets: Update] ← status=PUBLISHEDに更新
```

### チェックポイント

- [ ] n8nのデータがJSON形式であることを理解した
- [ ] ノード間でデータが自動的に流れることを理解した
- [ ] トリガーの種類を理解した

---

## トラブルシューティング

（実践で止まった箇所があれば追記）

---

## まとめ

### このモジュールで学んだこと

- GASを使ってスプレッドシートにシートを自動作成する方法
- 投稿管理に必要なデータ構造（posts/mediaシート）
- n8nのデータフローの基本

### 次のステップ

次のモジュールでは、このシートを使ってn8nからInstagramに投稿するワークフローを作成します。

---

## 参考資料

- [Data flow within nodes | n8n Docs](https://docs.n8n.io/data/data-flow-nodes/)
- [Data structure | n8n Docs](https://docs.n8n.io/data/data-structure/)
- [Google Apps Script リファレンス](https://developers.google.com/apps-script/reference/spreadsheet)

---

## よくある質問

**Q: なぜ手動でシートを作らずGASを使うのですか？**
A: 列数が多く、ドロップダウンの設定も複雑なため、GASで一括作成した方が効率的です。また、同じ構造のシートを別のスプレッドシートに作る際にも再利用できます。

**Q: statusがREADYのデータだけを取得するのはなぜですか？**
A: 投稿準備が完了したデータのみを処理するためです。DRAFTは編集中、PUBLISHEDは投稿済みなので、処理対象から除外します。

**Q: posts と media を分けているのはなぜですか？**
A: 1つの投稿に複数のメディア（カルーセル投稿など）を紐づけられるようにするためです。postsのmedia_ids列でmediaシートの複数行を参照できます。

**Q: テストデータのpublic_urlはなぜUnsplashの画像ですか？**
A: Instagram APIは公開URLからアクセス可能な画像が必要です。Unsplashの画像は直接リンクで公開されているため、テストに適しています。
