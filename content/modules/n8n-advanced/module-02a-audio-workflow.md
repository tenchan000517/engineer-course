# 【前編】音声合成ワークフローの構築

**所要時間**: 45分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Google Sheetsからナレーションデータを取得する方法
- Google Driveでフォルダ・ファイルを検索する方法
- ループ処理で複数データを1件ずつ処理する方法
- 条件分岐でフォルダの存在確認と自動作成を行う方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- canva_Aシートからaudio_statusが空の行を抽出できる
- Google Driveでフォルダ名から動的にフォルダIDを取得できる
- アーカイブフォルダの存在確認と自動作成ができる
- ループ処理で各投稿の動画ファイルを検索できる

---

## 目次

- [セクション1: ワークフローの全体設計](#セクション1-ワークフローの全体設計)
- [セクション2: シートからデータを取得](#セクション2-シートからデータを取得)
- [セクション3: フォルダ検索の設定](#セクション3-フォルダ検索の設定)
- [セクション4: アーカイブフォルダの自動作成](#セクション4-アーカイブフォルダの自動作成)
- [セクション5: ループ処理の設定](#セクション5-ループ処理の設定)
- [セクション6: 動画ファイルの検索](#セクション6-動画ファイルの検索)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01完了済み（ffmpeg、Fish Audio設定済み）
- canva_Aシートにnarration_1、narration_2カラムがあること
- Google Driveにカテゴリフォルダ（例: 202512Instagram投稿A）があること
- カテゴリフォルダ内にPOST-xxx.mp4形式の動画ファイルがあること

### 確認事項

canva_Aシートに以下のカラムが存在することを確認してください：

| カラム名 | 説明 |
|---------|------|
| post_id | 投稿ID（例: POST-1765117928575） |
| narration_1 | 前半30秒のナレーション |
| narration_2 | 後半30秒のナレーション |
| audio_status | 音声合成の処理状態（空欄 or PENDING or DONE） |

---

## セクション1: ワークフローの全体設計

### 音声合成ワークフローの流れ

```
[Manual Trigger]
    |
[Get canva_A] - シートから全行取得
    |
[Filter Pending] - audio_statusが空の行を抽出
    |
[Set Folder Names] - フォルダ名を動的生成
    |
[Search Category Folder] - カテゴリフォルダを検索
    |
[Search Archive Folder] - アーカイブフォルダを検索
    |
[If Archive Exists] - フォルダが存在するか？
    |-- true（存在しない）--> [Create Archive Folder]
    |-- false（存在する）--> 次へ
    |
[Prepare Loop Data] - ループ用にデータを準備
    |
[Loop Over Items] - 1件ずつ処理
    |
[Search Video File] - 動画ファイルを検索
    |
[If Video Exists] - 動画が存在するか？
    |-- true --> （後編で実装: 音声生成・合成）
    |-- false --> スキップ
```

### 完成イメージ

このモジュールで作成するワークフローの全体像です：

![ワークフロー全体図](/n8n-advanced/workflow-overview.png)

### チェックポイント

- [ ] ワークフローの全体像を理解した
- [ ] 各ノードの役割を把握した

---

## セクション2: シートからデータを取得

### Step 1: 新規ワークフローを作成

1. n8nで「Create new workflow」をクリック
2. ワークフロー名を「音声合成」に変更

### Step 2: Manual Triggerを追加

キャンバスをクリックして「Manual Trigger」を追加します。

### Step 3: Google Sheetsノードを追加

1. 「+」をクリック → 「Google Sheets」を検索して追加
2. ノード名を「Get canva_A」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Get row(s) in sheet |
| Credential | Google Sheets account |
| Document | n8n-test |
| Sheet | canva_A |

4. 「Execute step」をクリックしてテスト

![Get canva_A成功](/n8n-advanced/get-canva-a-success.png)

5件のデータが取得できればOKです。

### Step 4: Filter Pendingノードを追加

audio_statusが空またはPENDINGの行だけを抽出します。

1. 「+」をクリック → 「Code」を検索して追加
2. ノード名を「Filter Pending」に変更
3. 以下のコードを入力：

```javascript
return $input.all().filter(item => {
  const status = item.json.audio_status;
  return !status || status === '' || status === 'PENDING';
});
```

4. 「Execute step」をクリックしてテスト

![Filter Pending成功](/n8n-advanced/filter-pending-success.png)

audio_statusが空の行だけが抽出されます。

### チェックポイント

- [ ] Get canva_Aでデータが取得できた
- [ ] Filter Pendingでフィルタリングできた

---

## セクション3: フォルダ検索の設定

### Step 5: Set Folder Namesノードを追加

フォルダ名を動的に生成します（年月 + カテゴリ）。

1. 「+」をクリック → 「Code」を検索して追加
2. ノード名を「Set Folder Names」に変更
3. 以下のコードを入力：

```javascript
// フォルダ名を生成（カテゴリAは固定）
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
const folderName = `${yearMonth}Instagram投稿A`;
const archiveFolderName = `${yearMonth}Instagram投稿A_archive`;

// 最初の1件だけ返す（フォルダ検索用）
return [{
  json: {
    folder_name: folderName,
    archive_folder_name: archiveFolderName
  }
}];
```

このノードは1件だけ返します。フォルダ検索は1回だけ実行すれば十分だからです。

### Step 6: Search Category Folderノードを追加

カテゴリフォルダ（例: 202512Instagram投稿A）を検索してフォルダIDを取得します。

1. 「+」をクリック → 「Google Drive」を検索して追加
2. ノード名を「Search Category Folder」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Search files and folders |
| Credential | Google Drive account |
| Resource | File/Folder |
| Operation | Search |
| Search Method | Search File/Folder Name |
| Search Query | {{ $json.folder_name }}（Expressionモード） |
| Filter > Folder | By ID → 1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo |

4. Settingsタブで「Always Output Data」をONにする
5. 「Execute step」をクリックしてテスト

![Search Category Folder成功](/n8n-advanced/search-category-folder-success.png)

フォルダが見つかり、IDが取得できればOKです。

### Step 7: Search Archive Folderノードを追加

アーカイブフォルダ（例: 202512Instagram投稿A_archive）を検索します。

1. 「+」をクリック → 「Google Drive」を検索して追加
2. ノード名を「Search Archive Folder」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Search files and folders |
| Search Query | {{ $('Set Folder Names').first().json.archive_folder_name }}（Expressionモード） |
| Filter > Folder | By ID → 1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo |

4. Settingsタブで「Always Output Data」をONにする

### チェックポイント

- [ ] Set Folder Namesでフォルダ名が生成された
- [ ] Search Category Folderでフォルダが見つかった
- [ ] Search Archive Folderが設定できた

---

## セクション4: アーカイブフォルダの自動作成

### Step 8: If Archive Existsノードを追加

アーカイブフォルダが存在するかどうかで分岐します。

1. 「+」をクリック → 「IF」を検索して追加
2. ノード名を「If Archive Exists」に変更
3. 条件設定：
   - Value 1: {{ $json.id }}（Expressionモード）
   - Operation: is empty

![If Archive Exists成功](/n8n-advanced/if-archive-exists-true.png)

フォルダがない場合は「True Branch」に、ある場合は「False Branch」に流れます。

### Step 9: Create Archive Folderノードを追加

アーカイブフォルダがない場合に作成します。

1. IFの「true」出力から「+」をクリック
2. 「Google Drive」を検索して追加
3. ノード名を「Create Archive Folder」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Create folder |
| Credential | Google Drive account |
| Folder Name | {{ $('Set Folder Names').first().json.archive_folder_name }}（Expressionモード） |
| Parent Folder | By ID → 1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo |

![Create Archive Folder成功](/n8n-advanced/create-archive-folder-success.png)

Google Driveにアーカイブフォルダが作成されます。

### チェックポイント

- [ ] If Archive Existsで条件分岐ができた
- [ ] Create Archive Folderでフォルダが作成された

---

## セクション5: ループ処理の設定

### Step 10: Prepare Loop Dataノードを追加

Filter Pendingの全データを復元し、カテゴリフォルダIDを付与します。

1. Create Archive FolderとIf Archive Existsのfalse出力の両方から接続
2. 「+」をクリック → 「Code」を検索して追加
3. ノード名を「Prepare Loop Data」に変更
4. 以下のコードを入力：

```javascript
// Filter Pendingから元データを取得
const originalItems = $('Filter Pending').all();
// Set Folder Namesからフォルダ名を取得
const folderNames = $('Set Folder Names').first().json;
// Search Category Folderから正確な名前でフィルタ
const categoryFolder = $('Search Category Folder').all()
  .find(item => item.json.name === folderNames.folder_name);
const categoryFolderId = categoryFolder ? categoryFolder.json.id : null;

return originalItems.map(item => ({
  json: {
    ...item.json,
    folder_name: folderNames.folder_name,
    archive_folder_name: folderNames.archive_folder_name,
    category_folder_id: categoryFolderId
  }
}));
```

**重要**: Search Category Folderは部分一致で検索するため、「202512Instagram投稿A」を検索すると「202512Instagram投稿A_archive」も返ってきます。そのため、正確な名前でフィルタする必要があります。

### Step 11: Loop Over Itemsノードを追加

1件ずつ処理するためのループノードを追加します。

1. 「+」をクリック → 「Split In Batches」を検索して追加
2. ノード名を「Loop Over Items」に変更（自動で変わる場合もあります）
3. 設定：
   - Batch Size: 1

![Loop Over Items設定](/n8n-advanced/loop-over-items-setup.png)

### チェックポイント

- [ ] Prepare Loop Dataで全データにcategory_folder_idが付与された
- [ ] Loop Over Itemsが設定できた

---

## セクション6: 動画ファイルの検索

### Step 12: Search Video Fileノードを追加

各投稿のpost_idで動画ファイルを検索します。

1. Loop Over Itemsの「loop」出力から「+」をクリック
2. 「Google Drive」を検索して追加
3. ノード名を「Search Video File」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Search files and folders |
| Search Query | {{ $json.post_id }}（Expressionモード） |
| Filter > Folder | By ID → {{ $json.category_folder_id }}（Expressionモード） |

5. Settingsタブで「Always Output Data」をONにする

### Step 13: If Video Existsノードを追加

動画が見つかったかどうかで分岐します。

1. 「+」をクリック → 「IF」を検索して追加
2. ノード名を「If Video Exists」に変更
3. 条件設定：
   - Value 1: {{ $json.id }}（Expressionモード）
   - Operation: is not empty

![If Video Exists成功](/n8n-advanced/if-video-exists-success.png)

動画が見つかった場合は「True Branch」に流れます。

### Google Driveでの動画ファイル確認

![Google Drive動画確認](/n8n-advanced/google-drive-video-exists.png)

カテゴリフォルダ内にPOST-xxx.mp4形式の動画ファイルが存在することを確認してください。

### チェックポイント

- [ ] Search Video Fileで動画ファイルが見つかった
- [ ] If Video ExistsでTrue Branchに流れた

---

## トラブルシューティング

### Google Drive検索で「File not found: .」エラーが出る

**症状**: Search Video FileでFolder IDを指定すると「File not found: .」エラーが発生する

**原因**: ExpressionでFolder IDを渡す際に、前のノードのデータが正しく参照できていない

**解決方法**:
1. 前のノード（Loop Over Items）の出力でcategory_folder_idが正しい値になっているか確認
2. Expressionが正しく解決されているか確認（フィールド下に表示される値をチェック）

### Search Category Folderで複数のフォルダが返ってくる

**症状**: 「202512Instagram投稿A」を検索すると「202512Instagram投稿A_archive」も返ってくる

**原因**: Google Driveの検索は部分一致のため

**解決方法**: Prepare Loop Dataで正確な名前でフィルタする（本講座のコードで対応済み）

---

## まとめ

### このモジュールで学んだこと

- Google Sheetsからデータを取得し、Codeノードでフィルタリングする方法
- Google Driveでフォルダ名からフォルダIDを動的に取得する方法
- IF分岐でフォルダの存在確認と自動作成を行う方法
- Split In Batchesでループ処理を実装する方法
- 複数ノード間でデータを参照する方法（$('ノード名').first()など）

### 次のステップ

Module 02（後編）では、以下を実装します：

1. 動画ファイルのダウンロード
2. Fish Audio APIで音声生成
3. ffmpegで動画と音声を合成
4. 合成済み動画のアップロード
5. シートのaudio_status更新

---

## 参考資料

- [n8n Google Drive Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/)
- [n8n Split In Batches Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/)
- [n8n Code Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)

---

## よくある質問

**Q: なぜSet Folder Namesで1件だけ返すのですか？**
A: フォルダ検索は1回だけ実行すれば十分です。5件のデータがあっても、検索するフォルダは同じなので、1件だけ返してフォルダ検索を1回だけ実行し、その後Prepare Loop Dataで元の5件を復元します。

**Q: category_folder_idがnullになる場合はどうすればいいですか？**
A: Search Category Folderでフォルダが見つからなかった場合にnullになります。Google Driveにカテゴリフォルダ（例: 202512Instagram投稿A）が存在するか確認してください。

**Q: Loop Over Itemsの「done」出力は何に使いますか？**
A: 全件の処理が完了した後に実行したい処理がある場合に接続します。今回は使用しません。

**Q: アーカイブフォルダは何のために作成しますか？**
A: 音声合成済みの動画ファイルを保存するためのフォルダです。元の動画と区別するために別フォルダに保存します。

**Q: 動画ファイルが見つからない場合はどうなりますか？**
A: If Video Existsで「False Branch」に流れ、その投稿はスキップされます。動画がない投稿は音声合成できないためです。
