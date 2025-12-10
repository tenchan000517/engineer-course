# Google DriveからInstagramリール投稿

**所要時間**: 60分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Cloudinaryを使った動画ホスティングの設定方法
- Google Driveから動画を検索してCloudinaryにアップロードする方法
- Instagram Graph APIでリール動画を投稿する方法
- 動画ファイルの存在確認とループ処理の実装方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Cloudinaryアカウントを作成し、Upload Presetを設定できる
- postsシートからDRAFT状態の投稿を取得し、対応する動画ファイルを検索できる
- Cloudinary経由でInstagramリールを自動投稿できる
- 投稿完了後にpostsシートのステータスを更新できる

---

## 目次

- [セクション1: なぜCloudinaryが必要なのか](#セクション1-なぜcloudinaryが必要なのか)
- [セクション2: Cloudinaryアカウントの設定](#セクション2-cloudinaryアカウントの設定)
- [セクション3: ワークフローの全体像](#セクション3-ワークフローの全体像)
- [セクション4: ワークフローの構築](#セクション4-ワークフローの構築)
- [セクション5: Cloudinaryアップロードの設定](#セクション5-cloudinaryアップロードの設定)
- [セクション6: Instagram投稿処理](#セクション6-instagram投稿処理)
- [セクション7: postsシートの更新](#セクション7-postsシートの更新)
- [セクション8: 動作確認](#セクション8-動作確認)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 09で作成した動画ファイルがGoogle Driveに保存されていること
- postsシートにDRAFT状態のデータがあること
- Instagram APIアクセストークン（Module 02で取得済み）

### 確認事項

Google Driveに以下のようなフォルダ構成があることを確認してください。

```
n8n-instagram/
├── 202512Instagram投稿A/
│   ├── POST-xxx.mp4
│   └── POST-yyy.mp4
├── 202512Instagram投稿B/
│   └── ...
└── ...
```

**重要**: 動画ファイル名は`POST-`で始まり、postsシートの`post_id`と一致している必要があります。

---

## セクション1: なぜCloudinaryが必要なのか

### Google DriveのURLは直接使えない

2025年1月以降、Instagram Graph APIではGoogle DriveのURLを直接使用できなくなりました。

**エラー例**:
```
Error in loading https://drive.google.com/uc?export=download&id=xxx
500 Internal Server Error
```

**原因**:
- Google DriveのURLはリダイレクトを含む
- 認証トークンが必要
- HTMLラッパーを含む場合がある

**解決策**: Cloudinaryを経由してアップロード

### Cloudinaryとは

Cloudinaryは画像・動画のホスティングサービスです。無料プランでも以下が利用可能です：

- 月25クレジット
- 1GBストレージ = 1クレジット
- 1GB帯域幅 = 1クレジット

Instagram投稿用には十分な容量です。

### チェックポイント

- [ ] Google DriveのURLが直接使えない理由を理解した
- [ ] Cloudinaryの役割を理解した

---

## セクション2: Cloudinaryアカウントの設定

### Step 1: Cloudinaryアカウント作成

1. [Cloudinary](https://cloudinary.com/)にアクセス
2. 「Sign Up For Free」をクリック
3. 必要情報を入力してアカウント作成

### Step 2: ダッシュボードの確認

ログインするとダッシュボードが表示されます。

![Cloudinaryダッシュボード](/n8n-setup/148-cloudinary-dashboard.jpg)

以下の情報を確認してください：
- **Cloud Name**: `あなたのCloud Name`（APIのURLで使用）
- 使用量の表示（Media files, Bandwidth, Transformations, AI Usage）

### Step 3: Upload Presetの作成

Upload Presetを使うと、API KeyなしでHTTP POSTでアップロードできます。

1. 左メニューから「Settings」をクリック
2. 「Upload」タブを選択
3. 「Upload presets」セクションを確認

![Upload Presets画面](/n8n-setup/149-cloudinary-upload-presets.png)

4. 「Add upload preset」をクリック
5. 以下の設定を入力：

| 設定項目 | 値 |
|---------|-----|
| Upload preset name | `instagram_reel` |
| Signing Mode | **Unsigned** |
| Folder | `instagram`（任意） |

![Upload Preset設定](/n8n-setup/151-cloudinary-preset-settings.png)

**重要**: Signing Modeは必ず「Unsigned」を選択してください。これにより、API Keyなしでアップロードできるようになります。

6. 「Save」をクリック

### Step 4: 設定の確認

Upload Preset一覧に作成したプリセットが表示されます。

![Upload Preset一覧](/n8n-setup/150-cloudinary-preset-list.png)

- `instagram_reel`がリストに表示されている
- Signing Modeが「Unsigned」になっている

### チェックポイント

- [ ] Cloudinaryアカウントを作成できた
- [ ] Cloud Nameを確認できた
- [ ] Upload Preset「instagram_reel」を作成できた
- [ ] Signing Modeが「Unsigned」になっている

---

## セクション3: ワークフローの全体像

### ワークフロー構成図

```
[Manual Trigger]
    ↓
[Get DRAFT Posts] ← postsシートからDRAFT全件取得
    ↓
[Loop] ← 1件ずつ処理
    ↓
[Get Category from Pattern] ← content_jsonからカテゴリ判定
    ↓
[Search Category Folder] ← Driveでカテゴリフォルダを検索
    ↓
[Search Video File] ← フォルダ内でpost_idの動画を検索
    ↓
[IF File Exists] ← 動画があるか確認
    ├── Yes → [Upload to Cloudinary] → [Instagram投稿処理] → 終了
    └── No → [Loop]へ戻る（次のDRAFTを試す）
```

### ポイント

1. **ループ処理**: postsシートに複数のDRAFTがある場合、動画ファイルがあるものを見つけるまで順番に試します
2. **alwaysOutputData**: フォルダやファイルが見つからない場合でもワークフローが停止しないよう設定します
3. **1件だけ投稿**: 動画が見つかったら1件だけ投稿して終了します

---

## セクション4: ワークフローの構築

### Step 1: 新しいワークフローを作成

1. n8nダッシュボードで「Create new workflow」をクリック
2. ワークフロー名を「Instagram Reel Post」に変更

### Step 2: Manual Triggerを追加

1. 「+」ボタンをクリック
2. 「Manual Trigger」を選択

### Step 3: Get DRAFT Postsノードを追加

1. 「+」ボタンをクリックして「Google Sheets」を検索
2. 以下の設定を行う：

| 設定項目 | 値 |
|---------|-----|
| Resource | Sheet |
| Operation | Get row(s) in sheet |
| Document | n8n-test（あなたのスプレッドシート） |
| Sheet | posts |
| Filter | status = DRAFT |

### Step 4: Loopノードを追加

1. 「+」ボタンをクリックして「Split In Batches」を検索
2. 以下の設定を行う：

| 設定項目 | 値 |
|---------|-----|
| Batch Size | 1 |

### Step 5: Get Category from Patternノードを追加

1. 「+」ボタンをクリックして「Code」を検索
2. 以下のコードを入力：

```javascript
const item = $input.first();
const contentJson = JSON.parse(item.json.content_json || '{}');
const pattern = contentJson.pattern || '';

// patternからカテゴリを判定
const patternToCategory = {
  'versus': 'A',
  'instant_hack': 'B',
  'secret_feature': 'C',
  'warning': 'D',
  'ranking': 'E'
};

const category = patternToCategory[pattern] || 'A';

// フォルダ名を生成（例: 202512Instagram投稿A）
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
const folderName = `${yearMonth}Instagram投稿${category}`;

return [{
  json: {
    ...item.json,
    category: category,
    folder_name: folderName,
    pattern: pattern
  }
}];
```

このコードは：
- postsシートの`content_json`から`pattern`を取得
- patternに応じてカテゴリ（A〜E）を判定
- 年月とカテゴリからフォルダ名を生成（例: `202512Instagram投稿A`）

### Step 6: Search Category Folderノードを追加

1. 「+」ボタンをクリックして「Google Drive」を検索
2. 以下の設定を行う：

| 設定項目 | 値 |
|---------|-----|
| Resource | File/Folder |
| Operation | Search files and folders |
| Query String | `{{ $json.folder_name }}` |
| Folder ID | あなたの親フォルダID（n8n-instagramフォルダ） |

3. **重要**: ノード設定で「Always Output Data」をONにする
   - 右上の「︙」メニューから「Settings」を開く
   - 「Always Output Data」のトグルをON

### Step 7: Search Video Fileノードを追加

1. 「+」ボタンをクリックして「Google Drive」を検索
2. 以下の設定を行う：

| 設定項目 | 値 |
|---------|-----|
| Resource | File/Folder |
| Operation | Search files and folders |
| Query String | `{{ $('Get Category from Pattern').item.json.post_id }}` |
| Folder ID | `{{ $json.id }}`（前のノードで取得したフォルダID） |

3. **重要**: 「Always Output Data」をONにする

### Step 8: IF File Existsノードを追加

1. 「+」ボタンをクリックして「IF」を検索
2. 以下の条件を設定：

| 設定項目 | 値 |
|---------|-----|
| Value 1 | `{{ $json.id }}` |
| Operation | is not empty |

**接続**:
- **True（ファイルあり）** → Upload to Cloudinary へ
- **False（ファイルなし）** → Loop へ戻る

### チェックポイント

- [ ] Get DRAFT Postsでpostsシートからデータを取得できた
- [ ] Loopノードで1件ずつ処理できた
- [ ] Get Category from Patternでカテゴリを判定できた
- [ ] Search Category FolderでDriveのフォルダを検索できた
- [ ] Search Video Fileで動画ファイルを検索できた
- [ ] IF File Existsで分岐できた

---

## セクション5: Cloudinaryアップロードの設定

### Step 1: Upload to Cloudinaryノードを追加

1. IF File Existsの「True」出力から「+」をクリック
2. 「HTTP Request」を検索して追加
3. 以下の設定を行う：

| 設定項目 | 値 |
|---------|-----|
| Method | POST |
| URL | `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload` |
| Body Content Type | Form-Data |

**YOUR_CLOUD_NAME**はCloudinaryダッシュボードで確認したCloud Nameに置き換えてください。

4. Body Parametersに以下を追加：

| Name | Value |
|------|-------|
| file | `https://drive.google.com/uc?export=download&id={{ $json.id }}` |
| upload_preset | `instagram_reel` |

![Cloudinaryアップロード設定](/n8n-setup/152-n8n-cloudinary-upload.png)

### Step 2: 動作確認

ノードをテスト実行すると、Cloudinaryにアップロードされ、以下のような結果が返ります：

```json
{
  "secure_url": "https://res.cloudinary.com/xxx/video/upload/v1234567890/xxx.mp4",
  "public_id": "xxx",
  "format": "mp4",
  ...
}
```

`secure_url`がInstagram APIに渡すURLになります。

### チェックポイント

- [ ] HTTP RequestノードでCloudinaryのURLを設定できた
- [ ] Body Parametersにfileとupload_presetを追加できた
- [ ] テスト実行でsecure_urlが取得できた

---

## セクション6: Instagram投稿処理

### Step 1: Get User IDノードを追加

1. Upload to Cloudinaryの出力から「+」をクリック
2. 「HTTP Request」を追加
3. 以下の設定：

| 設定項目 | 値 |
|---------|-----|
| Method | GET |
| URL | `https://graph.instagram.com/v20.0/me` |

4. Query Parametersに以下を追加：

| Name | Value |
|------|-------|
| fields | `user_id,username` |
| access_token | `YOUR_ACCESS_TOKEN` |

![Get User ID結果](/n8n-setup/155-get-user-id-result.png)

### Step 2: Create Reel Containerノードを追加

1. 「HTTP Request」を追加
2. 以下の設定：

| 設定項目 | 値 |
|---------|-----|
| Method | POST |
| URL | `https://graph.instagram.com/v20.0/{{ $json.user_id }}/media` |

3. Query Parametersに以下を追加：

| Name | Value |
|------|-------|
| media_type | `REELS` |
| video_url | `{{ $('Upload to Cloudinary').item.json.secure_url }}` |
| caption | `{{ $('Get Category from Pattern').item.json.caption }}\n\n{{ $('Get Category from Pattern').item.json.hashtags }}` |
| share_to_feed | `true` |
| access_token | `YOUR_ACCESS_TOKEN` |

![Create Reel Container設定](/n8n-setup/154-create-reel-container.png)

### Step 3: Wait 15sノードを追加

動画のアップロード処理には時間がかかるため、待機時間を設けます。

1. 「Wait」ノードを検索して追加
2. Amount: `15`（秒）

### Step 4: Check Container Statusノードを追加

1. 「HTTP Request」を追加
2. 以下の設定：

| 設定項目 | 値 |
|---------|-----|
| Method | GET |
| URL | `https://graph.instagram.com/{{ $('Create Reel Container').item.json.id }}` |

3. Query Parametersに以下を追加：

| Name | Value |
|------|-------|
| fields | `status_code` |
| access_token | `YOUR_ACCESS_TOKEN` |

![Container Status結果](/n8n-setup/156-container-status.png)

ステータスが`FINISHED`になれば投稿可能です。

### Step 5: Publish Reelノードを追加

1. 「HTTP Request」を追加
2. 以下の設定：

| 設定項目 | 値 |
|---------|-----|
| Method | POST |
| URL | `https://graph.instagram.com/v20.0/{{ $('Get User ID').item.json.user_id }}/media_publish` |

3. Query Parametersに以下を追加：

| Name | Value |
|------|-------|
| creation_id | `{{ $('Create Reel Container').item.json.id }}` |
| access_token | `YOUR_ACCESS_TOKEN` |

### チェックポイント

- [ ] Get User IDでuser_idを取得できた
- [ ] Create Reel Containerでcontainer_idを取得できた
- [ ] Wait 15sで待機時間を設けた
- [ ] Check Container StatusでFINISHEDを確認できた
- [ ] Publish Reelで投稿IDを取得できた

---

## セクション7: postsシートの更新

### Step 1: Edit Fieldsノードを追加

1. 「Edit Fields」を検索して追加
2. 以下のフィールドを設定：

| フィールド名 | 値 |
|-------------|-----|
| post_id | `{{ $('Get Category from Pattern').item.json.post_id }}` |
| status | `PUBLISHED` |
| ig_post_id | `{{ $json.id }}` |
| published_at | `{{ $now.toISO() }}` |

### Step 2: Update Posts Sheetノードを追加

1. 「Google Sheets」を追加
2. 以下の設定：

| 設定項目 | 値 |
|---------|-----|
| Resource | Sheet |
| Operation | Append or update row in sheet |
| Document | n8n-test |
| Sheet | posts |
| Matching Columns | post_id |

3. Values to Sendで以下を設定：
   - post_id: `{{ $json.post_id }}`
   - status: `{{ $json.status }}`
   - ig_post_id: `{{ $json.ig_post_id }}`
   - published_at: `{{ $json.published_at }}`

### チェックポイント

- [ ] Edit Fieldsで更新データを整形できた
- [ ] Update Posts Sheetでpostsシートを更新できた
- [ ] statusがPUBLISHEDに変更された
- [ ] ig_post_idとpublished_atが記録された

---

## セクション8: 動作確認

### Step 1: テストデータの準備

1. postsシートにDRAFT状態のレコードがあることを確認
2. Google Driveに対応する動画ファイルがあることを確認
   - ファイル名が`POST-xxx`形式
   - 対応するカテゴリフォルダに保存されている

### Step 2: ワークフロー全体図の確認

完成したワークフローは以下のようになります。

![ワークフロー全体図](/n8n-setup/153-workflow-overview.png)

### Step 3: 実行テスト

1. 「Execute Workflow」をクリック
2. 各ノードが順番に実行されることを確認
3. 最終的にInstagramに投稿されることを確認
4. postsシートのstatusがPUBLISHEDに更新されることを確認

### チェックポイント

- [ ] ワークフローがエラーなく完了した
- [ ] Instagramにリールが投稿された
- [ ] postsシートのstatusがPUBLISHEDになった

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[reel-post-workflow.json](/n8n/download/reel-post-workflow.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_SPREADSHEET_ID` | あなたのスプレッドシートID |
| `YOUR_POSTS_SHEET_GID` | postsシートのGID |
| `YOUR_PARENT_FOLDER_ID` | Google Driveの親フォルダID |
| `YOUR_CLOUD_NAME` | CloudinaryのCloud Name |
| `YOUR_UPLOAD_PRESET` | Cloudinaryのupload preset名 |
| `YOUR_INSTAGRAM_ACCESS_TOKEN` | Instagram APIアクセストークン |

また、Google SheetsとGoogle Driveのクレデンシャルを設定してください。

---

## トラブルシューティング

### 「Error in loading https://drive.google.com/...」エラー

**症状**: Create Reel Containerで500 Internal Server Errorが発生

**原因**: Google DriveのURLをInstagram APIに直接渡している

**解決方法**: Cloudinary経由でアップロードしてください（本モジュールの方法）

### 「RangeError: Invalid string length」エラー

**症状**: n8nで大きな動画をダウンロードしようとするとエラー

**原因**: n8nのメモリ制限

**解決方法**: Google DriveのURLをCloudinaryに直接渡して、Cloudinaryにダウンロードさせてください（本モジュールの方法）

### ループが途中で止まる

**症状**: 数件処理した後、ワークフローが「成功」で終了する

**原因**: Search Category FolderまたはSearch Video Fileの「Always Output Data」がOFFになっている

**解決方法**:
1. 両方のノードの設定を開く
2. 「Settings」で「Always Output Data」をONにする

### Container StatusがFINISHEDにならない

**症状**: Check Container StatusでIN_PROGRESSのまま

**原因**: 動画のアップロード処理に時間がかかっている

**解決方法**:
1. Wait時間を増やす（15秒→30秒）
2. またはリトライループを追加する

### アクセストークンが無効

**症状**: 「Invalid OAuth access token」エラー

**原因**: アクセストークンの有効期限切れ

**解決方法**: Module 02の手順でアクセストークンを再取得してください

---

## まとめ

### このモジュールで学んだこと

- Cloudinaryを使った動画ホスティングの設定方法
- Google DriveのURLをInstagram APIで直接使えない理由と解決策
- postsシートからDRAFTを取得し、対応する動画を検索する方法
- ループ処理と「Always Output Data」オプションの使い方
- Instagram Graph APIでリール動画を投稿する手順
- 投稿完了後のシート更新処理

### 次のステップ

これでn8n講座は完了です！

構築したシステムの全体像：
1. **Module 01-04**: 環境構築とAPI設定
2. **Module 05-06**: シートからInstagram投稿
3. **Module 07-08**: AIでコンテンツ自動生成
4. **Module 09**: Canvaで動画素材を一括生成
5. **Module 10**: 動画をInstagramリールとして投稿

これにより、AIによる企画生成から動画素材化、Instagram投稿まで、大部分の作業を自動化できるようになりました。

---

## 参考資料

- [Instagram Graph API - Reels Publishing](https://developers.facebook.com/docs/instagram-api/guides/reels-publishing)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [n8n Community - Google Drive links are no longer accepted](https://community.n8n.io/t/instagram-facebook-graph-api-google-drive-links-are-no-longer-accepted-resolved/165635)

---

## よくある質問

**Q: Cloudinary無料プランで足りますか？**
A: 月に数十件程度の投稿であれば十分です。動画1本あたり約10-50MBで、月25クレジット（約25GB相当）利用可能です。

**Q: Container StatusのチェックにIFノードを追加すべきですか？**
A: 動画が短い（15秒以下）場合は15秒の待機で通常は十分です。長い動画の場合はリトライループの追加を推奨します。

**Q: 複数投稿を一度に実行できますか？**
A: 現在のワークフローは1件ずつ投稿する設計です。Instagram APIのレート制限もあるため、複数投稿する場合は間隔を空けて実行してください。

**Q: 投稿がいつまでもFINISHEDにならない場合は？**
A: 動画のフォーマットや解像度に問題がある可能性があります。Instagram推奨の形式（MP4、H.264、1080x1920、9:16）を確認してください。
