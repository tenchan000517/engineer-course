# n8n自動投稿ワークフロー（特典用）

**所要時間**: 60分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 特典付き投稿専用のワークフロー構築
- 通常投稿とは別スケジュールで運用する方法
- スプレッドシート構造の変更に対応できる設計

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 特典用の音声合成ワークフローを構築できる
- 特典用の投稿ワークフローを構築できる
- 通常投稿と独立したスケジュールで運用できる

---

## 目次

- [セクション1: 設計方針](#セクション1-設計方針)
- [セクション2: 音声合成ワークフロー（特典用）](#セクション2-音声合成ワークフロー特典用)
- [セクション3: 投稿ワークフロー（特典用）](#セクション3-投稿ワークフロー特典用)
- [セクション4: 運用フロー](#セクション4-運用フロー)
- [セクション5: スプレッドシート構造の調整](#セクション5-スプレッドシート構造の調整)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 説明 |
|------|------|
| n8n環境 | セルフホストまたはクラウド |
| 既存の音声合成ワークフロー理解 | n8n上級編 Module 02a-c完了 |
| canva_giftシート | Module 05で構造確認済み |
| posts_giftシート | 投稿管理用（後述） |

### 前提知識

以下の講座を完了している必要があります：

- n8n上級編 Module 02a（音声合成前編）
- n8n上級編 Module 02b（音声合成中編）
- n8n上級編 Module 02c（音声合成後編）
- n8n上級編 Module 09（運用フロー）

---

## セクション1: 設計方針

### なぜ別ワークフローが必要か

| 項目 | 通常投稿 | 特典付き投稿 |
|------|----------|--------------|
| 頻度 | 日次（6時/12時/18時） | 月数回（任意タイミング） |
| 対象シート | canva_A〜E / posts | canva_gift / posts_gift |
| スケジュール | 固定 | **手動または週次** |
| 後工程 | なし | エルグラム設定必須 |

**結論**: スケジュールと運用フローが異なるため、**専用ワークフローを作成**する。

### ワークフロー構成

```
【音声合成ワークフロー（特典用）】
音声合成Gift
├── Manual Trigger（手動実行）
├── Get canva_gift（シートからデータ取得）
├── Filter NORMAL（audio_status=NORMALをフィルタ）
├── Set Folder Names（GIFTフォルダ名生成）
├── フォルダ検索・作成
├── Loop Over Items（1件ずつ処理）
│   ├── 動画ダウンロード
│   ├── Fish Audio API × 2
│   ├── ffmpeg合成
│   ├── アップロード
│   └── audio_status更新
└── 完了

【投稿ワークフロー（特典用）】
Instagram投稿Gift
├── Manual Trigger（手動実行）
├── Get posts_gift（CANVA_READYを取得）
├── Loop Over Items
│   ├── 動画検索・ダウンロード
│   ├── Cloudinaryアップロード
│   ├── Instagram API投稿
│   └── status更新
└── 完了（→ エルグラム設定へ）
```

### 柔軟性の確保

スプレッドシート構造が調整される可能性があるため、以下を変数化：

| 項目 | 設定箇所 | 変更しやすさ |
|------|---------|-------------|
| シート名 | Codeノード先頭 | ◎ |
| 列名 | Codeノード内 | ◎ |
| フォルダ名パターン | Set Folder Names | ◎ |
| GID | 設定変数 | ◎ |

### チェックポイント

- [ ] 通常投稿と特典投稿が別スケジュールで運用される理由を理解した
- [ ] 2つのワークフローを作成する必要があることを把握した

---

## セクション2: 音声合成ワークフロー（特典用）

### Step 1: 新規ワークフローを作成

1. n8nで「Create new workflow」をクリック
2. ワークフロー名を「音声合成Gift」に変更

### Step 2: Manual Triggerを追加

特典投稿は月数回なので、手動実行とします。

### Step 3: 設定変数ノードを追加

スプレッドシート構造の変更に対応できるよう、設定を変数化します。

1. 「+」をクリック → 「Code」を検索して追加
2. ノード名を「Config」に変更
3. 以下のコードを入力：

```javascript
// ========================================
// 設定変数（ここを変更すればOK）
// ========================================
const CONFIG = {
  // シート設定
  sheet: {
    name: 'canva_gift',
    gid: 'YOUR_CANVA_GIFT_GID'  // ← 自分のGIDに変更
  },

  // フォルダ設定
  folder: {
    // フォルダ名のパターン（{yearMonth}は自動置換）
    pattern: '{yearMonth}Instagram投稿GIFT',
    archivePattern: '{yearMonth}Instagram投稿GIFT_archive',
    // 親フォルダID
    parentFolderId: 'YOUR_PARENT_FOLDER_ID'  // ← 自分のIDに変更
  },

  // 列名設定（スプレッドシート構造が変わったらここを変更）
  columns: {
    postId: 'post_id',
    narration1: 'narration_1',
    narration2: 'narration_2',
    audioStatus: 'audio_status'
  },

  // ステータス値
  status: {
    pending: 'NORMAL',
    done: 'DONE'
  },

  // Fish Audio設定
  fishAudio: {
    voiceId: 'YOUR_VOICE_ID'  // ← 自分のVoice IDに変更
  },

  // GAS設定
  gas: {
    deployUrl: 'YOUR_GAS_DEPLOY_URL'  // ← 自分のURLに変更
  }
};

// 年月を生成
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');

// フォルダ名を生成
const folderName = CONFIG.folder.pattern.replace('{yearMonth}', yearMonth);
const archiveFolderName = CONFIG.folder.archivePattern.replace('{yearMonth}', yearMonth);

return [{
  json: {
    ...CONFIG,
    yearMonth,
    folderName,
    archiveFolderName
  }
}];
```

### Step 4: Get canva_giftノードを追加

1. 「+」をクリック → 「Google Sheets」を検索して追加
2. ノード名を「Get canva_gift」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Get row(s) in sheet |
| Document | あなたのスプレッドシート |
| Sheet | canva_gift |

### Step 5: Filter NORMALノードを追加

1. 「+」をクリック → 「Code」を検索して追加
2. ノード名を「Filter NORMAL」に変更
3. 以下のコードを入力：

```javascript
// 設定を取得
const config = $('Config').first().json;
const audioStatusCol = config.columns.audioStatus;
const pendingStatus = config.status.pending;

// audio_status=NORMALの行のみフィルタ
return $input.all().filter(item => {
  const status = item.json[audioStatusCol];
  return status === pendingStatus;
});
```

### Step 6: If Has Itemsノードを追加

処理対象が0件の場合は終了します。

1. 「+」をクリック → 「If」を検索して追加
2. ノード名を「If Has Items」に変更
3. 設定：
   - Value 1: `{{ $input.all().length }}`（Expressionモード）
   - Operation: is greater than
   - Value 2: 0

### Step 7: Set Folder Namesノードを追加

1. If Has Itemsの「true」出力から「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Set Folder Names」に変更
4. 以下のコードを入力：

```javascript
// 設定を取得
const config = $('Config').first().json;

return [{
  json: {
    folder_name: config.folderName,
    archive_folder_name: config.archiveFolderName,
    parent_folder_id: config.folder.parentFolderId
  }
}];
```

### Step 8: 以降のノード

フォルダ検索、アーカイブフォルダ作成、Loop Over Items、音声合成処理は、**n8n上級編 Module 02a-c**と同じ構造です。

異なる点：
- シートが`canva_gift`固定（ループなし）
- フォルダ名が`GIFT`パターン
- 列名は`config.columns`を参照

### 音声合成処理部分の参照

| ノード | 参照先 |
|--------|--------|
| Search Category Folder | Module 02a Step 6 |
| Search Archive Folder | Module 02a Step 7 |
| If Archive Exists | Module 02a Step 8 |
| Create Archive Folder | Module 02a Step 9 |
| Prepare Loop Data | Module 02c Step 8（修正版） |
| Loop Over Items | Module 02a Step 11 |
| Search Video File | Module 02a Step 12 |
| Download file | Module 02b Step 1 |
| Generate Audio 1/2 | Module 02b Step 2-4 |
| Save Video/Audio | Module 02b Step 5-7 |
| Execute Command (ffmpeg) | Module 02b Step 8 |
| Read Output | Module 02b Step 9 |
| Move Original to Archive | Module 02b Step 10 |
| Upload New Video | Module 02b Step 12 |
| Update audio_status | Module 02c Step 10 |

### Step 9: Update audio_statusの修正

特典用はカテゴリが固定なので、GAS呼び出しを簡略化できます。

```json
{
  "action": "updateAudioStatusGift",
  "postId": "{{ $('Loop Over Items').item.json.post_id }}",
  "status": "DONE"
}
```

**GAS側に`updateAudioStatusGift`関数を追加する必要があります**（後述）。

### チェックポイント

- [ ] 音声合成Giftワークフローを作成した
- [ ] Configノードで設定を変数化した
- [ ] canva_giftからデータを取得できた
- [ ] フィルタリングが動作した

---

## セクション3: 投稿ワークフロー（特典用）

### Step 1: 新規ワークフローを作成

1. n8nで「Create new workflow」をクリック
2. ワークフロー名を「Instagram投稿Gift」に変更

### Step 2: Manual Triggerを追加

特典投稿は任意タイミングで手動実行します。

### Step 3: 設定変数ノードを追加

```javascript
// ========================================
// 設定変数（ここを変更すればOK）
// ========================================
const CONFIG = {
  // シート設定
  sheet: {
    name: 'posts_gift',
    gid: 'YOUR_POSTS_GIFT_GID'  // ← 自分のGIDに変更
  },

  // フォルダ設定
  folder: {
    pattern: '{yearMonth}Instagram投稿GIFT',
    parentFolderId: 'YOUR_PARENT_FOLDER_ID'
  },

  // 列名設定
  columns: {
    postId: 'post_id',
    status: 'status',
    caption: 'caption',
    hashtags: 'hashtags'
  },

  // ステータス値
  status: {
    ready: 'CANVA_READY',
    published: 'PUBLISHED'
  },

  // Instagram設定
  instagram: {
    accountId: 'YOUR_INSTAGRAM_ACCOUNT_ID'
  },

  // Cloudinary設定
  cloudinary: {
    uploadPreset: 'YOUR_UPLOAD_PRESET'
  },

  // GAS設定
  gas: {
    deployUrl: 'YOUR_GAS_DEPLOY_URL'
  }
};

// 年月を生成
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
const folderName = CONFIG.folder.pattern.replace('{yearMonth}', yearMonth);

return [{
  json: {
    ...CONFIG,
    yearMonth,
    folderName
  }
}];
```

### Step 4: Get posts_giftノードを追加

1. 「+」をクリック → 「Google Sheets」を検索して追加
2. ノード名を「Get posts_gift」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Action | Get row(s) in sheet |
| Document | あなたのスプレッドシート |
| Sheet | posts_gift |

### Step 5: Filter CANVA_READYノードを追加

```javascript
// 設定を取得
const config = $('Config').first().json;
const statusCol = config.columns.status;
const readyStatus = config.status.ready;

// status=CANVA_READYの行のみフィルタ
return $input.all().filter(item => {
  const status = item.json[statusCol];
  return status === readyStatus;
});
```

### Step 6: Loop Over Itemsノードを追加

1. 「+」をクリック → 「Split In Batches」を検索して追加
2. Batch Size: 1

### Step 7: Search Video Fileノードを追加

Google Driveで動画を検索します。

| 設定項目 | 値 |
|---------|-----|
| Action | Search files and folders |
| Search Query | `{{ $json.post_id }}`（Expressionモード） |
| Filter > Folder | By ID → `{{ $('Config').first().json.folder.parentFolderId }}` |

### Step 8: Download fileノードを追加

| 設定項目 | 値 |
|---------|-----|
| Action | Download file |
| File ID | `{{ $json.id }}`（Expressionモード） |

### Step 9: Upload to Cloudinaryノードを追加

1. 「+」をクリック → 「HTTP Request」を検索して追加
2. ノード名を「Upload to Cloudinary」に変更
3. 設定は通常投稿ワークフローと同じ

### Step 10: Create Reel Containerノードを追加

Instagram Graph APIでReelコンテナを作成します。

```
POST https://graph.facebook.com/v18.0/{{ $('Config').first().json.instagram.accountId }}/media

Body:
{
  "media_type": "REELS",
  "video_url": "{{ $json.secure_url }}",
  "caption": "{{ $('Loop Over Items').item.json.caption }}\n\n{{ $('Loop Over Items').item.json.hashtags }}"
}
```

### Step 11: Publish Reelノードを追加

```
POST https://graph.facebook.com/v18.0/{{ $('Config').first().json.instagram.accountId }}/media_publish

Body:
{
  "creation_id": "{{ $json.id }}"
}
```

### Step 12: Update statusノードを追加

GASを呼び出してステータスを更新します。

```json
{
  "action": "updatePostStatusGift",
  "postId": "{{ $('Loop Over Items').item.json.post_id }}",
  "status": "PUBLISHED"
}
```

### Step 13: Loop Over Itemsに戻る

Update statusの出力をLoop Over Itemsの入力に接続します。

### チェックポイント

- [ ] Instagram投稿Giftワークフローを作成した
- [ ] posts_giftからデータを取得できた
- [ ] 動画のアップロードと投稿が動作した

---

## セクション4: 運用フロー

### 特典付き投稿の運用フロー

```
┌─────────────────────────────────────────────────────────────┐
│  ステップ1: 投稿データ準備                                    │
│  ├── canva_giftシートにデータ登録（Module 05参照）            │
│  └── audio_status: NORMAL                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ステップ2: Canva動画生成                                     │
│  ├── Canvaで一括作成                                        │
│  ├── ダウンロード → 解凍                                    │
│  └── Google DriveのGIFTフォルダにアップロード                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ステップ3: 音声合成（n8n）                                   │
│  ├── 「音声合成Gift」ワークフローを手動実行                   │
│  └── audio_status: NORMAL → DONE                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ステップ4: posts_giftに登録                                  │
│  ├── post_id, caption, hashtags, trigger_word, gift_urlを登録│
│  └── status: CANVA_READY                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ステップ5: Instagram投稿（n8n）                              │
│  ├── 「Instagram投稿Gift」ワークフローを手動実行              │
│  └── status: CANVA_READY → PUBLISHED                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ステップ6: エルグラム設定（手動）                             │
│  └── → Module 07                                            │
└─────────────────────────────────────────────────────────────┘
```

### 通常投稿との比較

| 項目 | 通常投稿 | 特典付き投稿 |
|------|----------|--------------|
| 音声合成 | 自動（スケジュール） | **手動実行** |
| 投稿 | 自動（6時/12時/18時） | **手動実行** |
| 後工程 | なし | **エルグラム設定** |

### チェックポイント

- [ ] 運用フローの全体像を理解した
- [ ] 手動実行のタイミングを把握した

---

## セクション5: スプレッドシート構造の調整

### 調整が必要な場合

スプレッドシート構造を変更した場合、Configノードの以下を更新します：

```javascript
// 列名設定（スプレッドシート構造が変わったらここを変更）
columns: {
  postId: 'post_id',        // ← 列名を変更
  narration1: 'narration_1',
  narration2: 'narration_2',
  audioStatus: 'audio_status'
}
```

### GAS関数の追加

特典用のステータス更新関数をGASに追加します。

**追加する関数**（`docs/archive/gas-production/gift.gs`に追加済み）:

```javascript
function updateAudioStatusGift(postId, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('canva_gift');
  // ... 実装
}

function updatePostStatusGift(postId, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('posts_gift');
  // ... 実装
}
```

### posts_giftシートの構造

| 列名 | 説明 |
|------|------|
| post_id | 投稿ID（canva_giftと同じ） |
| caption | キャプション |
| hashtags | ハッシュタグ |
| trigger_word | エルグラムトリガーワード |
| gift_url | 特典ページURL |
| status | DRAFT / CANVA_READY / PUBLISHED |
| published_at | 投稿日時 |
| instagram_post_id | Instagram投稿ID |

### チェックポイント

- [ ] Configノードの設定変更方法を理解した
- [ ] posts_giftシートの構造を把握した

---

## まとめ

### このモジュールで学んだこと

- 特典付き投稿専用のワークフロー構築方法
- 設定を変数化して柔軟性を確保する方法
- 通常投稿と独立した運用フロー

### 作成したワークフロー

| ワークフロー名 | 対象シート | 実行方法 |
|--------------|-----------|---------|
| 音声合成Gift | canva_gift | 手動 |
| Instagram投稿Gift | posts_gift | 手動 |

### 次のステップ

Module 07でエルグラムの設定方法を学びます。

---

## よくある質問

**Q: 通常投稿のワークフローにcanva_giftを追加してはダメですか？**
A: スケジュールが異なるためおすすめしません。通常投稿は日次自動実行ですが、特典投稿は月数回の手動実行です。混在させると運用が複雑になります。

**Q: スプレッドシートの列を追加した場合はどうすればいいですか？**
A: Configノードのcolumns設定に新しい列を追加し、使用する箇所でconfig.columns.新列名を参照してください。

**Q: 特典投稿をスケジュール実行したい場合は？**
A: Manual TriggerをSchedule Triggerに変更してください。ただし、投稿後にエルグラム設定が必要なので、事前にエルグラム側でトリガーを設定しておく必要があります。

**Q: posts_giftシートはどこで作成しますか？**
A: スプレッドシートに手動で作成してください。列構造はセクション5を参照してください。GASでの自動登録機能は今後追加予定です。

**Q: エルグラム設定を忘れると何が起きますか？**
A: 投稿は公開されますが、コメントしても特典が配布されません。投稿直後にエルグラム設定を行ってください。
