# 【後編】音声合成ワークフローの構築 - 全カテゴリ対応

**所要時間**: 45分
**難易度**: 中級

---

## このモジュールで学ぶこと

- 複数のシート（canva_A〜E）を順番に処理するループ構造
- カテゴリに応じたフォルダ名の動的生成
- 処理完了後のステータス更新（GAS連携）
- ネストしたループ処理（シートループ → アイテムループ）

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Split In Batchesノードで複数シートを順次処理できる
- Codeノードでデータにカテゴリ情報を付与できる
- HTTP RequestノードでGASを呼び出してステータス更新できる
- 外側ループと内側ループのネスト構造を理解できる

---

## 事前準備

### 必要なもの

- Module 02（中編）完了済み
- 5つのシート（canva_A〜E）がスプレッドシートに存在
- audio_statusカラムがシートに追加済み

### 中編からの引き継ぎ

中編では単一カテゴリ（canva_A）のみを処理するワークフローを作成しました。後編では全カテゴリ（A〜E）に対応します。

---

## セクション1: 全カテゴリ対応の設計

### 処理フローの変更点

**中編までの構造**（単一カテゴリ）:
```
Manual Trigger → Get canva_A → Filter → Set Folder Names → フォルダ検索 → Prepare Loop Data → Loop Over Items → 音声合成処理
```

**後編の構造**（全カテゴリ対応）:
```
Manual Trigger → Sheet List → Loop Sheets → Get Sheet Data → Filter NORMAL and Add Category
    → If Has Items
        → true: Set Folder Names → フォルダ検索 → Prepare Loop Data → Loop Over Items → 音声合成処理 → Loop Sheetsに戻る
        → false: Skip to Next Sheet → Loop Sheetsに戻る
```

### ネストしたループ構造

| ループ | 対象 | 役割 |
|--------|------|------|
| 外側: Loop Sheets | カテゴリA〜E | シートごとに処理を分岐 |
| 内側: Loop Over Items | 各シートの行 | 1行ずつ音声合成処理 |

---

## セクション2: シートリストの生成

### Step 1: Sheet Listノードを追加

5つのシート情報を生成するCodeノードを追加します。

1. Manual Triggerから「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Sheet List」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Mode | Run Once for All Items |
| Language | JavaScript |

5. **JavaScript**:

```javascript
// 5つのシートからデータを取得するためのシート情報
const sheets = [
  { name: 'canva_A', category: 'A', gid: 1459009746 },
  { name: 'canva_B', category: 'B', gid: 1989446321 },
  { name: 'canva_C', category: 'C', gid: 10904001 },
  { name: 'canva_D', category: 'D', gid: 920483375 },
  { name: 'canva_E', category: 'E', gid: 1645982552 }
];

// シート情報を出力（後続のノードで使用）
return sheets.map(s => ({ json: s }));
```

**注意**: gidは自分のスプレッドシートの値に変更してください。各シートのgidはURLの`gid=`以降の数値です。

**テンプレートJSONを使用する場合**: このコードは既にテンプレートに含まれています。gidの値のみ自分のスプレッドシートに合わせて変更してください。

Sheet Listの設定画面と実行結果:

![Sheet List](/n8n-advanced/module-02c-sheet-list.png)

5件のシート情報が出力されればOKです。

### チェックポイント

- [ ] Sheet Listで5件のシート情報が出力された
- [ ] 各アイテムにname, category, gidが含まれている

---

## セクション3: シートごとのループ処理

### Step 2: Loop Sheetsノードを追加

シートを1つずつ順番に処理するループを作成します。

1. Sheet Listから「+」をクリック
2. 「Split In Batches」を検索して追加
3. ノード名を「Loop Sheets」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Batch Size | 1 |

### Step 3: Get Sheet Dataノードを追加

現在のシートからデータを取得します。

1. Loop Sheetsの「loop」出力から「+」をクリック
2. 「Google Sheets」を検索して追加
3. ノード名を「Get Sheet Data」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Get row(s) in sheet |
| Document | n8n-test（自分のスプレッドシート） |
| Sheet | By ID |
| Sheet ID | {{ $json.gid }}（Expressionモード） |

**ポイント**: Sheet IDにExpressionを使うことで、Loop Sheetsから渡されるgid値に基づいて動的にシートを選択します。

### Step 4: Filter NORMAL and Add Categoryノードを追加

audio_status=NORMALの行をフィルタし、カテゴリ情報を付与します。

1. Get Sheet Dataから「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Filter NORMAL and Add Category」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Mode | Run Once for All Items |
| Language | JavaScript |

5. **JavaScript**:

```javascript
// 現在のシート情報を取得
const sheetInfo = $('Loop Sheets').first().json;
const category = sheetInfo.category;

// シートデータを取得してcategoryを付与
const items = $input.all();

// audio_status === 'NORMAL' でフィルタしつつcategoryを付与
const filtered = items.filter(item => {
  const status = item.json.audio_status;
  return status === 'NORMAL';
});

return filtered.map(item => ({
  json: {
    ...item.json,
    category: category
  }
}));
```

Filter NORMAL and Add Categoryの設定画面と実行結果:

![Filter NORMAL and Add Category](/n8n-advanced/module-02c-filter-add-category.png)

### チェックポイント

- [ ] Loop Sheetsで5回ループが実行される
- [ ] Filter NORMAL and Add Categoryでcategoryカラムが付与される
- [ ] audio_status=NORMALの行のみがフィルタされる

---

## セクション4: 処理対象の有無で分岐

### Step 5: If Has Itemsノードを追加

フィルタ結果が0件の場合はスキップします。

1. Filter NORMAL and Add Categoryから「+」をクリック
2. 「If」を検索して追加
3. ノード名を「If Has Items」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Conditions | Number |
| Value 1 | {{ $input.all().length }}（Expressionモード） |
| Operation | is greater than |
| Value 2 | 0 |

5. **Options** > **Convert types where required**: ON

If Has Itemsの設定画面と実行結果:

![If Has Items](/n8n-advanced/module-02c-if-has-items.png)

### Step 6: Skip to Next Sheetノードを追加

処理対象がない場合に次のシートへスキップします。

1. If Has Itemsの「false」出力から「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Skip to Next Sheet」に変更
4. **JavaScript**:

```javascript
// このノードはLoop Sheetsに戻すためのダミー
// If Has Itemsのfalseブランチから来た場合に使用
return [{ json: { continue: true } }];
```

5. Skip to Next Sheetの出力を**Loop Sheets**の入力に接続

Skip to Next Sheetの設定画面:

![Skip to Next Sheet](/n8n-advanced/module-02c-skip-to-next-sheet.png)

### チェックポイント

- [ ] If Has Itemsでtrueとfalseに分岐する
- [ ] 処理対象が0件のシートはfalseブランチでスキップされる
- [ ] Skip to Next SheetからLoop Sheetsに戻る接続がある

---

## セクション5: フォルダ名の動的生成

### Step 7: Set Folder Namesノードを修正

カテゴリに応じてフォルダ名を動的に生成します。

1. If Has Itemsの「true」出力から「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Set Folder Names」に変更
4. **JavaScript**:

```javascript
// フィルタ済みデータを取得
const items = $('Filter NORMAL and Add Category').all();

if (items.length === 0) {
  return [];
}

// 最初のアイテムからcategoryを取得
const category = items[0].json.category;

// 年月を生成
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');

// フォルダ名を生成（1件だけ返す - フォルダ検索用）
const folderName = `${yearMonth}Instagram投稿${category}`;
const archiveFolderName = `${yearMonth}Instagram投稿${category}_archive`;

return [{
  json: {
    folder_name: folderName,
    archive_folder_name: archiveFolderName,
    category: category
  }
}];
```

Set Folder Namesの設定画面と実行結果:

![Set Folder Names](/n8n-advanced/module-02c-set-folder-names.png)

**ポイント**: categoryが「E」の場合、folder_nameは「202512Instagram投稿E」になります。

### チェックポイント

- [ ] Set Folder Namesでカテゴリに応じたフォルダ名が生成される
- [ ] folder_nameとarchive_folder_nameが正しい形式で出力される

---

## セクション6: Prepare Loop Dataの修正

### Step 8: Prepare Loop Dataノードを修正

archive_folder_idも取得するように修正します。

1. If Archive Existsの後にあるPrepare Loop Dataを開く
2. **JavaScript**を以下に変更:

```javascript
// Filter NORMAL and Add Categoryから元データを取得
const originalItems = $('Filter NORMAL and Add Category').all();
// Set Folder Namesからフォルダ名を取得
const folderNames = $('Set Folder Names').first().json;
// Search Category Folderから正確な名前でフィルタ
const categoryFolder = $('Search Category Folder').all()
  .find(item => item.json.name === folderNames.folder_name);
const categoryFolderId = categoryFolder ? categoryFolder.json.id : null;

// Search Archive Folderからアーカイブフォルダを取得（作成された場合も考慮）
let archiveFolderId = null;
const archiveFolders = $('Search Archive Folder').all();
const archiveFolder = archiveFolders.find(item => item.json.name === folderNames.archive_folder_name);
if (archiveFolder) {
  archiveFolderId = archiveFolder.json.id;
} else {
  // Create Archive Folderから取得を試みる
  try {
    const created = $('Create Archive Folder').first();
    if (created && created.json.id) {
      archiveFolderId = created.json.id;
    }
  } catch (e) {
    // 作成されていない場合は無視
  }
}

return originalItems.map(item => ({
  json: {
    ...item.json,
    folder_name: folderNames.folder_name,
    archive_folder_name: folderNames.archive_folder_name,
    category_folder_id: categoryFolderId,
    archive_folder_id: archiveFolderId
  }
}));
```

Prepare Loop Dataの設定画面と実行結果:

![Prepare Loop Data](/n8n-advanced/module-02c-prepare-loop-data.png)

**注意**: フォルダが存在しない場合、category_folder_idはnullになります。これは正常な動作で、該当するカテゴリの処理はスキップされます。

### チェックポイント

- [ ] Prepare Loop Dataで各アイテムにcategory_folder_idとarchive_folder_idが付与される
- [ ] フォルダが存在する場合はIDが設定される
- [ ] フォルダが存在しない場合はnullが設定される

---

## セクション7: ループの接続を完成

### Step 9: Loop Over Itemsの「done」出力を接続

内側ループ（アイテムループ）が完了したら、外側ループ（シートループ）に戻ります。

1. Loop Over Itemsの「done」出力を**Loop Sheets**の入力に接続

Loop Over Itemsの完了後の流れ:

![Loop Over Items Done](/n8n-advanced/module-02c-loop-over-items-done.png)

### チェックポイント

- [ ] Loop Over Itemsの「done」出力がLoop Sheetsに接続されている
- [ ] アイテムループ完了後、次のシートの処理に進む

---

## セクション8: audio_statusの更新

### Step 10: Update audio_statusノードを追加

処理完了後、audio_statusを「DONE」に更新します。

1. Upload New Videoから「+」をクリック
2. 「HTTP Request」を検索して追加
3. ノード名を「Update audio_status」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Method | POST |
| URL | https://script.google.com/macros/s/YOUR_GAS_DEPLOY_URL/exec |
| Authentication | None |

5. **Send Body**: ON
6. **Body Content Type**: JSON
7. **Specify Body**: Using JSON
8. **JSON**:

```json
{
  "action": "updateAudioStatus",
  "postId": "{{ $('Loop Over Items').item.json.post_id }}",
  "category": "{{ $('Loop Over Items').item.json.category }}",
  "status": "DONE"
}
```

**注意**: URLは自分のGASデプロイURLに変更してください。

Update audio_statusの設定画面と実行結果:

![Update audio_status](/n8n-advanced/module-02c-update-audio-status.png)

### Step 11: Update audio_statusからLoop Over Itemsに接続

ステータス更新後、次のアイテムの処理に進みます。

1. Update audio_statusの出力を**Loop Over Items**の入力に接続

### チェックポイント

- [ ] Update audio_statusでGASが呼び出される
- [ ] レスポンスでsuccess: trueが返される
- [ ] Update audio_statusの出力がLoop Over Itemsに接続されている

---

## セクション9: 完成したワークフロー

すべてのノードが接続され、ワークフローが完成しました:

![ワークフロー完成図](/n8n-advanced/module-02c-workflow-complete.png)

### ワークフローの処理フロー

```
1. Sheet List: 5つのシート情報を生成
2. Loop Sheets: シートごとにループ
   2-1. Get Sheet Data: シートからデータ取得
   2-2. Filter NORMAL and Add Category: フィルタ＆カテゴリ付与
   2-3. If Has Items: 処理対象の有無で分岐
        → false: Skip to Next Sheet → Loop Sheetsに戻る
        → true: 以下を実行
   2-4. Set Folder Names: フォルダ名を動的生成
   2-5. Search Category Folder / Search Archive Folder: フォルダ検索
   2-6. If Archive Exists: アーカイブフォルダがなければ作成
   2-7. Prepare Loop Data: 全アイテムにフォルダIDを付与
   2-8. Loop Over Items: 各アイテムをループ
        → Search Video File → If Video Exists
        → true: 音声合成処理 → Update audio_status → Loop Over Itemsに戻る
        → false: Loop Over Itemsに戻る
   2-9. Loop Over Items完了 → Loop Sheetsに戻る
3. Loop Sheets完了 → 終了
```

### チェックポイント

- [ ] 全カテゴリ（A〜E）が順番に処理される
- [ ] フォルダが存在するカテゴリのみ音声合成が実行される
- [ ] 処理完了後、audio_statusがDONEに更新される

---

## トラブルシューティング

### Loop Sheetsで「$.item is only available in Run Once for Each Item mode」エラー

**症状**: Filter NORMAL and Add CategoryでLoop Sheetsの参照エラー

**原因**: Codeノードで`$('Loop Sheets').item.json`を使用している

**解決方法**: `.item`を`.first()`に変更
```javascript
// 修正前
const sheetInfo = $('Loop Sheets').item.json;

// 修正後
const sheetInfo = $('Loop Sheets').first().json;
```

### category_folder_idがnullになる

**症状**: Prepare Loop Dataの出力でcategory_folder_idがnull

**原因**: Google Driveにそのカテゴリのフォルダが存在しない

**解決方法**: これは正常な動作です。フォルダが存在しないカテゴリは、If Video Existsでfalseブランチに流れてスキップされます。

### Update audio_statusでエラーが発生する

**症状**: GAS呼び出しでエラーが返される

**原因**: GASのupdateAudioStatus関数が存在しない、またはデプロイURLが間違っている

**解決方法**:
1. GASにupdateAudioStatus関数が存在するか確認
2. GASが最新版でデプロイされているか確認
3. デプロイURLが正しいか確認

---

## まとめ

### このモジュールで学んだこと

- Split In Batchesノードを使った複数シートの順次処理
- Codeノードでの動的なカテゴリ情報の付与
- ネストしたループ構造（外側: シート、内側: アイテム）
- 処理対象の有無による条件分岐
- HTTP RequestノードによるGAS連携でのステータス更新

### 完成した音声合成システム

```
[Canva用シート振り分け]
  posts → canva_A〜E（audio_status: NORMAL）
      ↓
[音声合成ワークフロー]
  全カテゴリを順次処理
  → 動画ダウンロード
  → Fish Audio API（前半・後半）
  → ffmpeg合成
  → 元動画をアーカイブ
  → 新動画をアップロード
  → audio_status: DONE
      ↓
[既存: Instagram投稿ワークフロー]
  audio_status=DONEの動画を投稿
```

### 次のステップ

- Canva用シート振り分けワークフローにaudio_status: NORMALを追加
- Instagram投稿ワークフローでaudio_status=DONEの動画のみを対象にする

---

## ワークフローのダウンロード

このモジュールで作成した全カテゴリ対応版ワークフローのテンプレートをダウンロードできます：

[音声合成ワークフロー（全カテゴリ対応版）](/n8n-advanced/audio-workflow-all-categories-template.json)

**使用方法**:
1. ファイルをダウンロード
2. n8nで「Import from File」からインポート
3. 以下のプレースホルダーを自分の値に置換：

| プレースホルダー | 説明 | 例 |
|-----------------|------|-----|
| `YOUR_SPREADSHEET_ID` | Google SheetsのスプレッドシートID | `1jnsUM1e...` |
| `YOUR_CANVA_A_GID` 〜 `YOUR_CANVA_E_GID` | 各シートのgID | `1459009746` |
| `YOUR_PARENT_FOLDER_ID` | Google Driveの親フォルダID | `1EuAjad...` |
| `YOUR_VOICE_ID` | Fish AudioのVoice ID | `b756350f...` |
| `YOUR_GAS_DEPLOY_URL` | GASのデプロイURL | `https://script.google.com/macros/s/...` |
| `YOUR_CREDENTIAL_ID` | 各Credentialを再設定 | （n8nで選択） |

4. 各ノードのCredentialを自分のアカウントで再設定

---

## 参考資料

- [n8n Split In Batches Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/)
- [n8n Code Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [n8n If Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/)
- [Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)

---

## よくある質問

**Q: なぜ外側と内側でループを分けるのですか？**
A: カテゴリごとにフォルダ検索を1回だけ実行するためです。フォルダ検索をアイテムごとに実行すると、同じ検索を何度も繰り返すことになり非効率です。

**Q: フォルダが存在しないカテゴリはどうなりますか？**
A: category_folder_idがnullになり、Search Video Fileで動画が見つからないため、If Video Existsのfalseブランチでスキップされます。エラーにはなりません。

**Q: audio_statusがNORMAL以外の行はどうなりますか？**
A: Filter NORMAL and Add Categoryでフィルタされ、処理対象から除外されます。既にDONEの行や、空の行は処理されません。

**Q: GASを使わずにGoogle Sheetsノードでステータス更新できませんか？**
A: Google Sheetsノードでは動的にシートを選択して更新することが難しいため、GASを使用しています。GASならcategoryパラメータに基づいて適切なシートを更新できます。

**Q: 処理中にエラーが発生した場合、途中から再開できますか？**
A: audio_status=NORMALの行のみが処理対象なので、エラー発生後に再実行すれば、未処理の行のみが処理されます。既にDONEの行は再処理されません。
