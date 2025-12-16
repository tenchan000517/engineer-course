# ストーリーズ自動投稿ワークフロー

**所要時間**: 45分
**難易度**: 中級（Module 09完了後）

---

## このモジュールで学ぶこと

- リール投稿後にストーリーズで自動告知する仕組み
- ffmpegを使った動画サムネイル抽出とテキスト合成
- Instagram Graph APIによるストーリーズ投稿
- 日本語フォントのインストール方法

---

## 学習目標

このモジュールを完了すると、以下ができるようになります:

1. 投稿済みリールから自動でストーリーズ告知画像を生成できる
2. ffmpegでテキスト付き画像を作成できる
3. Instagram Graph APIでストーリーズを投稿できる

---

## 目次

- [ワークフロー全体図](#ワークフロー全体図)
- [事前準備: 日本語フォントのインストール](#事前準備-日本語フォントのインストール)
- [ステップ1: 投稿済みリールの取得](#ステップ1-投稿済みリールの取得)
- [ステップ2: 動画ファイルの検索](#ステップ2-動画ファイルの検索)
- [ステップ3: ストーリーズ画像の生成](#ステップ3-ストーリーズ画像の生成)
- [ステップ4: Cloudinaryへのアップロード](#ステップ4-cloudinaryへのアップロード)
- [ステップ5: ストーリーズの投稿](#ステップ5-ストーリーズの投稿)
- [ステップ6: ステータスの更新](#ステップ6-ステータスの更新)
- [トラブルシューティング](#トラブルシューティング)
- [リール投稿フローとの統合](#リール投稿フローとの統合)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)

---

## ワークフロー全体図

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ストーリーズ自動投稿ワークフロー                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  Get PUBLISHED   │  postsシートからPUBLISHEDを取得               │
│  │  Posts           │  → published_atで最新を選択                   │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Search Video    │  Google Driveから動画ファイルを検索            │
│  │  File            │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  ffmpeg          │  動画1秒目のサムネイル抽出                     │
│  │  Extract + Text  │  → 白背景 + テキスト合成                      │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Upload to       │  画像をCloudinaryにアップロード                │
│  │  Cloudinary      │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Instagram API   │  ストーリーズコンテナ作成 → 公開               │
│  │  Stories Post    │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Update Status   │  postsシートをSTORY_POSTEDに更新              │
│  └──────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 事前準備: 日本語フォントのインストール

ストーリーズ画像に日本語テキストを表示するため、n8nコンテナに日本語フォントをインストールします。

PowerShellで以下のコマンドを実行:

```bash
docker exec -u root -it n8n apk add --no-cache font-noto-cjk
```

成功すると以下のような出力が表示されます:

```
(1/1) Installing font-noto-cjk (0_git20220127-r1)
Executing fontconfig-2.15.0-r3.trigger
OK: 245 MiB in 160 packages
```

### チェックポイント

- [ ] `docker exec -u root -it n8n apk add --no-cache font-noto-cjk` を実行した
- [ ] 「Installing font-noto-cjk」のメッセージが表示された

---

## ステップ1: 投稿済みリールの取得

### 1-1. Get PUBLISHED Posts

postsシートから`status=PUBLISHED`のレコードを取得します。

![Get PUBLISHED Posts](/n8n-advanced/images/module-10/01-get-published-posts.png)

**設定内容**:
- Resource: Sheet Within Document
- Operation: Get Row(s)
- Document: n8n-test
- Sheet: posts
- Filters: status = PUBLISHED

### 1-2. Get Category from Pattern

取得したレコードから最新のものを選択し、カテゴリとフォルダ名を生成します。

![Get Category from Pattern](/n8n-advanced/images/module-10/02-get-category.png)

**コード内容**:

```javascript
const items = $input.all();
const sorted = items.sort((a, b) => new Date(b.json.published_at) - new Date(a.json.published_at));
const item = sorted[0];
const contentJson = JSON.parse(item.json.content_json || '{}');
const pattern = contentJson.pattern || '';
const patternToCategory = {'versus': 'A', 'instant_hack': 'B', 'secret_feature': 'C', 'warning': 'D', 'ranking': 'E'};
const category = patternToCategory[pattern] || 'A';
const publishedAt = new Date(item.json.published_at);
const yearMonthDay = publishedAt.getFullYear().toString() + String(publishedAt.getMonth() + 1).padStart(2, '0') + String(publishedAt.getDate()).padStart(2, '0');
const folderName = `${yearMonthDay}投稿${category}`;
return [{json: {...item.json, category, folder_name: folderName, pattern}}];
```

**処理内容**:
- `published_at`でソートして最新のレコードを選択
- `pattern`からカテゴリ（A〜E）を判定
- `published_at`の日付からフォルダ名を生成（例: `20251215投稿A`）

### チェックポイント

- [ ] Get PUBLISHED PostsでPUBLISHEDのレコードが取得できている
- [ ] Get Category from Patternで`folder_name`が生成されている

---

## ステップ2: 動画ファイルの検索

### 2-1. Search Category Folder

カテゴリフォルダを検索します。

![Search Category Folder](/n8n-advanced/images/module-10/03-search-folder.png)

**設定内容**:
- Resource: File/Folder
- Operation: Search
- Search Query: `{{ $json.folder_name }}`
- Filter - Folder: By ID（Instagram投稿フォルダのID）

### 2-2. Search Video File

動画ファイルを検索します。

![Search Video File](/n8n-advanced/images/module-10/04-search-video.png)

**設定内容**:
- Resource: File/Folder
- Operation: Search
- Search Query: `{{ $('Get Category from Pattern').item.json.post_id }}`
- Filter - Folder: `{{ $json.id }}`（前のノードで見つかったフォルダID）

### チェックポイント

- [ ] Search Category Folderでフォルダが見つかっている
- [ ] Search Video Fileで動画ファイル（.mp4）が見つかっている

---

## ステップ3: ストーリーズ画像の生成

### 3-1. Extract and Create Story Image

ffmpegを使って動画からサムネイルを抽出し、テキスト付きのストーリーズ画像を生成します。

![Extract and Create Story Image](/n8n-advanced/images/module-10/05-extract-create.png)

**コマンド**:

```bash
ffmpeg -y -i "https://drive.google.com/uc?export=download&id={{ $json.id }}" -ss 00:00:01 -frames:v 1 -q:v 2 /tmp/thumbnail.jpg 2>&1 && ffmpeg -y -i /tmp/thumbnail.jpg -vf "scale=810:-1,pad=1080:1920:(ow-iw)/2:600:white,drawtext=text='新しい動画を投稿しました！':fontfile=/usr/share/fonts/noto/NotoSansCJK-Regular.ttc:fontsize=72:fontcolor=black:x=(w-text_w)/2:y=120" /tmp/story.jpg 2>&1
```

**処理内容**:
1. Google DriveのURLから動画を読み込み
2. 1秒目のフレームをサムネイルとして抽出
3. 画像を1080x1920（9:16）にリサイズ・パディング
4. 「新しい動画を投稿しました！」のテキストを上部に追加

### 3-2. Read Story Image

生成した画像をbase64エンコードします。

![Read Story Image](/n8n-advanced/images/module-10/06-read-image.png)

**コマンド**:

```bash
base64 /tmp/story.jpg | tr -d '\n'
```

### チェックポイント

- [ ] Extract and Create Story Imageの`exitCode`が0
- [ ] Read Story Imageの`stdout`にbase64データが出力されている

---

## ステップ4: Cloudinaryへのアップロード

### 4-1. Upload to Cloudinary

base64エンコードした画像をCloudinaryにアップロードします。

![Upload to Cloudinary](/n8n-advanced/images/module-10/07-upload-cloudinary.png)

**設定内容**:
- Method: POST
- URL: `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
- Body Content Type: Form-Data
- Body Parameters:
  - file: `data:image/jpeg;base64,{{ $json.stdout }}`
  - upload_preset: `instagram_reel`

**出力確認**:
- `secure_url`: アップロードされた画像のURL
- `width`: 1080
- `height`: 1920

### チェックポイント

- [ ] `secure_url`が返ってきている
- [ ] サイズが1080x1920になっている

---

## ステップ5: ストーリーズの投稿

### 5-1. Get User ID

Instagram Graph APIでユーザーIDを取得します。

![Get User ID](/n8n-advanced/images/module-10/08-get-user-id.png)

**設定内容**:
- Method: GET
- URL: `https://graph.instagram.com/v20.0/me`
- Query Parameters:
  - fields: `user_id,username`
  - access_token: （Instagramアクセストークン）

### 5-2. Create Story Container

ストーリーズ用のメディアコンテナを作成します。

![Create Story Container](/n8n-advanced/images/module-10/09-create-container.png)

**設定内容**:
- Method: POST
- URL: `https://graph.instagram.com/v20.0/{{ $json.user_id }}/media`
- Query Parameters:
  - media_type: `STORIES`
  - image_url: `{{ $('Upload to Cloudinary').item.json.secure_url }}`
  - access_token: （Instagramアクセストークン）

### 5-3. Check Status

コンテナの処理状態を確認します。

![Check Status](/n8n-advanced/images/module-10/10-check-status.png)

**設定内容**:
- Method: GET
- URL: `https://graph.instagram.com/{{ $('Create Story Container').item.json.id }}`
- Query Parameters:
  - fields: `status_code`
  - access_token: （Instagramアクセストークン）

### 5-4. If Finished

ステータスが`FINISHED`かどうかを判定します。

![If Finished](/n8n-advanced/images/module-10/11-if-finished.png)

**条件**:
- `{{ $json.status_code }}` is equal to `FINISHED`

FINISHEDでない場合は、Wait 10sに戻ってリトライします。

### 5-5. Publish Story

ストーリーズを公開します。

![Publish Story](/n8n-advanced/images/module-10/12-publish-story.png)

**設定内容**:
- Method: POST
- URL: `https://graph.instagram.com/v20.0/{{ $('Get User ID').item.json.user_id }}/media_publish`
- Query Parameters:
  - creation_id: `{{ $('Create Story Container').item.json.id }}`
  - access_token: （Instagramアクセストークン）

### チェックポイント

- [ ] Create Story Containerで`id`が返ってきている
- [ ] Check Statusで`status_code: FINISHED`になっている
- [ ] Publish Storyで`id`が返ってきている

---

## ステップ6: ステータスの更新

### 6-1. Update Status

postsシートのステータスを`STORY_POSTED`に更新します。

![Update Status](/n8n-advanced/images/module-10/13-update-status.png)

**設定内容**:
- Operation: Append or Update Row
- Document: n8n-test
- Sheet: posts
- Mapping Column Mode: Map Each Column Manually
- Column to match on: post_id
- Values to Send:
  - post_id: `{{ $('Get Category from Pattern').item.json.post_id }}`
  - status: `STORY_POSTED`

### チェックポイント

- [ ] postsシートのstatusが`STORY_POSTED`に更新されている

---

## トラブルシューティング

### 日本語テキストが表示されない

**原因**: n8nコンテナに日本語フォントがインストールされていない

**解決策**:
```bash
docker exec -u root -it n8n apk add --no-cache font-noto-cjk
```

### Permission denied エラー（フォントインストール時）

**原因**: rootユーザーで実行していない

**解決策**: `-u root`オプションを追加
```bash
docker exec -u root -it n8n apk add --no-cache font-noto-cjk
```

### Google Sheetsのschemaエラー

**原因**: JSONインポート時にschema情報が不足している

**解決策**: n8n上でUpdate Statusノードを開き、Document/Sheetを再選択してschemaを自動取得させる

### ワークフローが無限ループして止まらない

**原因**: Loopノードへの接続が誤って追加されている、または条件分岐が正しく設定されていない

**緊急停止方法**:

1. **n8n UIから停止**（推奨）
   - 左側メニューの「Executions」をクリック
   - 実行中のワークフローを選択
   - 「Stop」ボタンをクリック

2. **Dockerコンテナを再起動**
   ```bash
   docker restart n8n
   ```

3. **最終手段: Dockerコンテナを停止**
   ```bash
   docker stop n8n
   ```

**予防策**: ワークフローの最終ノードからLoopノードへの接続がないことを確認する

---

## リール投稿フローとの統合

ストーリーズ投稿をリール投稿フローに統合することで、リール投稿後に自動でストーリーズ告知ができます。

### 統合版ワークフロー全体図

![統合版ワークフロー](/n8n-advanced/images/module-10/integrated-workflow-overview.png)

### 統合のポイント

既存のリール投稿フローの`Update Posts Sheet`の後に、ストーリーズ投稿ノードを接続します。

```
[既存のリール投稿フロー]
Update Posts Sheet (status=PUBLISHED)
    ↓
Extract Story Image ← ここから追加
    ↓
Read Story Image
    ↓
Upload Story to Cloudinary
    ↓
Create Story Container
    ↓
Wait 10s → Check Story Status → If Story Ready
    ↓
Publish Story
    ↓
Update Story Status (status=STORY_POSTED)
    ↓
（終了）← Loopへ戻らない！
```

### 追加するノード（9個）

#### 1. Extract Story Image

動画からサムネイルを抽出し、ストーリーズ画像を生成します。

![Extract Story Image](/n8n-advanced/images/module-10/integrated-extract-story-image.png)

**コマンド**:
```bash
ffmpeg -y -i "https://drive.google.com/uc?export=download&id={{ $('Search Video File').item.json.id }}" -ss 00:00:01 -frames:v 1 -q:v 2 /tmp/thumbnail.jpg 2>&1 && ffmpeg -y -i /tmp/thumbnail.jpg -vf "scale=810:-1,pad=1080:1920:(ow-iw)/2:600:white,drawtext=text='新しい動画を投稿しました！':fontfile=/usr/share/fonts/noto/NotoSansCJK-Regular.ttc:fontsize=72:fontcolor=black:x=(w-text_w)/2:y=120" /tmp/story.jpg 2>&1
```

**重要**: 動画ファイルIDは`$('Search Video File').item.json.id`で参照（リール投稿フローのノードを再利用）

#### 2. Read Story Image

生成した画像をbase64エンコードします。

![Read Story Image](/n8n-advanced/images/module-10/integrated-read-story-image.png)

**コマンド**:
```bash
base64 /tmp/story.jpg | tr -d '\n'
```

#### 3. Upload Story to Cloudinary

画像をCloudinaryにアップロードします。

![Upload Story to Cloudinary](/n8n-advanced/images/module-10/integrated-upload-story-cloudinary.png)

**設定内容**:
- Method: POST
- URL: `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
- Body Content Type: Form-Data
- Body Parameters:
  - file: `data:image/jpeg;base64,{{ $json.stdout }}`
  - upload_preset: `instagram_reel`

#### 4. Create Story Container

ストーリーズコンテナを作成します。

![Create Story Container](/n8n-advanced/images/module-10/integrated-create-story-container.png)

**設定内容**:
- Method: POST
- URL: `https://graph.instagram.com/v20.0/{{ $('Get User ID').item.json.user_id }}/media`
- Query Parameters:
  - media_type: `STORIES`
  - image_url: `{{ $json.secure_url }}`
  - access_token: （Instagramアクセストークン）

**重要**: User IDは`$('Get User ID').item.json.user_id`で参照（リール投稿フローのノードを再利用）

#### 5. Wait 10s

ストーリーズの処理完了を待機します。

#### 6. Check Story Status

コンテナの処理状態を確認します。

![Check Story Status](/n8n-advanced/images/module-10/integrated-check-story-status.png)

**設定内容**:
- Method: GET
- URL: `https://graph.instagram.com/{{ $('Create Story Container').item.json.id }}`
- Query Parameters:
  - fields: `status_code`
  - access_token: （Instagramアクセストークン）

#### 7. If Story Ready

ステータスが`FINISHED`かどうかを判定します。

![If Story Ready](/n8n-advanced/images/module-10/integrated-if-story-ready.png)

**条件**:
- `{{ $json.status_code }}` is equal to `FINISHED`

FINISHEDでない場合は`Wait 10s`に戻ってリトライします。

#### 8. Publish Story

ストーリーズを公開します。

![Publish Story](/n8n-advanced/images/module-10/integrated-publish-story.png)

**設定内容**:
- Method: POST
- URL: `https://graph.instagram.com/v20.0/{{ $('Get User ID').item.json.user_id }}/media_publish`
- Query Parameters:
  - creation_id: `{{ $('Create Story Container').item.json.id }}`
  - access_token: （Instagramアクセストークン）

#### 9. Update Story Status

postsシートのステータスを`STORY_POSTED`に更新します。

![Update Story Status](/n8n-advanced/images/module-10/integrated-update-story-status.png)

**設定内容**:
- Operation: Append or Update Row
- Document: n8n-test
- Sheet: posts
- Column to match on: post_id
- Values to Send:
  - post_id: `{{ $('Get Category from Pattern').item.json.post_id }}`
  - status: `STORY_POSTED`

### 重要な注意点

**Update Story Statusの後はLoopへ接続しない！**

統合版では1件のリール投稿につき1件のストーリーズ投稿を行い、そこで終了します。

誤ってLoopへ接続すると、CANVA_READY状態の投稿がすべて一気に処理され、無限ループのような状態になる可能性があります。

### チェックポイント

- [ ] Update Posts SheetからExtract Story Imageへ接続されている
- [ ] 9個のノードがすべて順番に接続されている
- [ ] Update Story Statusの後に接続がない（終了）
- [ ] Loopへの接続がないことを確認

---

## まとめ

このモジュールでは、リール投稿後にストーリーズで自動告知するワークフローを構築しました。

**学んだこと**:
- ffmpegによる動画サムネイル抽出とテキスト合成
- Instagram Graph APIによるストーリーズ投稿（2段階プロセス）
- n8nコンテナへの日本語フォントインストール

**ワークフローの流れ**:
1. PUBLISHEDのリールを取得
2. Google Driveから動画を検索
3. ffmpegでサムネイル抽出 + テキスト合成
4. Cloudinaryにアップロード
5. Instagram APIでストーリーズ投稿
6. ステータスをSTORY_POSTEDに更新

---

## ワークフローJSONダウンロード

### スタンドアロン版（ストーリーズのみ）

[stories-auto-post.json](/n8n-advanced/download/stories-auto-post.json)

**インポート後の設定**:
1. Google Sheets / Google Driveのクレデンシャルを設定
2. Instagramアクセストークンを設定
3. CloudinaryのCloud名とupload_presetを確認

### 統合版（リール + ストーリーズ）

[reel-story-integrated.json](/n8n-advanced/download/reel-story-integrated.json)

**インポート後の設定**:
1. Google Sheets / Google Driveのクレデンシャルを設定
2. Instagramアクセストークンを設定（複数箇所）
3. CloudinaryのCloud名とupload_presetを確認（2箇所: 動画用・画像用）
4. Google DriveのフォルダIDを設定
5. Update Posts Sheet / Update Story Statusノードを開き、Document/Sheetを再選択してschemaを自動取得

---

## 次のステップ

Module 11では、Facebook/X/TikTokへのクロスポスト機能を実装します。
