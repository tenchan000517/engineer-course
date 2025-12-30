---
title: "GASセットアップ"
order: 3
duration: "30分"
difficulty: "⭐⭐⭐☆☆"
---

# GASセットアップ

**所要時間**: 30分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 特典付き投稿用のスプレッドシート構成
- GASコードの追加方法
- 初期セットアップの実行
- メニューからの操作方法

---

## 事前準備

### 必要なもの

| 項目 | 説明 |
|------|------|
| Googleアカウント | スプレッドシート・GAS用 |
| 既存のInstagram管理シート | 通常投稿で使用中のもの |

---

## セクション1: スプレッドシート構成

### 追加されるシート

| シート名 | 用途 |
|----------|------|
| `posts_gift` | 特典付き投稿の管理 |
| `canva_gift` | Canva用データ（音声合成等） |

### posts_giftシートの列構成

| 列 | 内容 |
|----|------|
| post_id | 投稿ID（GIFT-yyyyMMddHHmmss-001形式） |
| post_type | 投稿タイプ（REEL） |
| status | ステータス（DRAFT→CANVA_READY→PUBLISHED） |
| caption | キャプション |
| hashtags | ハッシュタグ |
| scheduled_date | 投稿予定日 |
| scheduled_time | 投稿予定時刻 |
| published_at | 実際の投稿日時 |
| instagram_id | Instagram投稿ID |
| permalink | 投稿URL |
| insights_fetched | インサイト取得済みフラグ |
| reach | リーチ数 |
| engagement | エンゲージメント数 |
| created_at | 作成日時 |
| gift_url | 特典ページURL |
| trigger_word | エルグラム用トリガーワード |
| content_json | 投稿内容JSON |

### canva_giftシートの列構成

| 列 | 内容 |
|----|------|
| post_id | 投稿ID |
| narration_1 | ナレーション1 |
| narration_2 | ナレーション2 |
| thumb_main | サムネイルメイン |
| thumb_sub | サムネイルサブ |
| set_1〜6 | セット1〜6 |
| audio_status | 音声合成ステータス |
| gift_url | 特典ページURL |

---

## セクション2: GASコードの追加

### Step 1: GASエディタを開く

1. スプレッドシートを開く
2. メニュー「拡張機能」→「Apps Script」

### Step 2: 新規ファイルを追加

1. 左側の「ファイル」の横にある「＋」をクリック
2. 「スクリプト」を選択
3. ファイル名を「gift」に変更

### Step 3: コードを貼り付け

以下のコードを`gift.gs`に貼り付けます：

```javascript
/**
 * 特典付き投稿システム（gift.gs）
 */

const GIFT_CONFIG = {
  PARENT_FOLDER_ID: 'あなたのフォルダID',  // ← 変更必須
  GIFT_FOLDER_NAME: 'Gift',
  POSTS_GIFT_SHEET: 'posts_gift',
  CANVA_GIFT_SHEET: 'canva_gift',
};

const POSTS_GIFT_HEADERS = [
  'post_id', 'post_type', 'status', 'caption', 'hashtags',
  'scheduled_date', 'scheduled_time', 'published_at',
  'instagram_id', 'permalink', 'insights_fetched',
  'reach', 'engagement', 'created_at',
  'gift_url', 'trigger_word', 'content_json'
];

const CANVA_GIFT_HEADERS = [
  'post_id', 'narration_1', 'narration_2',
  'thumb_main', 'thumb_sub',
  'set_1', 'set_2', 'set_3', 'set_4', 'set_5', 'set_6',
  'audio_status', 'gift_url'
];
```

**重要**: `PARENT_FOLDER_ID`はあなたのGoogle DriveのフォルダIDに変更してください。

### Step 4: onOpen関数を更新

既存の`onOpen`関数を以下に置き換えます：

```javascript
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('コンテンツ管理')
    .addItem('configA2〜からideas+postsに追加', 'importAndProcess')
    .addSeparator()
    .addItem('postsからCanvaシートに振り分け（上書き）', 'distributeToCanva')
    .addItem('postsからCanvaシートに追加（既存保持）', 'appendToCanva')
    .addSeparator()
    .addItem('【特典】初期セットアップ', 'setupGiftSystem')
    .addItem('【特典】posts_giftに追加', 'importToPostsGift')
    .addItem('【特典】canva_giftに振り分け', 'distributeToCanvaGift')
    .addToUi();
}
```

### Step 5: 保存

1. Ctrl+S（Mac: Cmd+S）で保存
2. スプレッドシートを再読み込み

---

## セクション3: 初期セットアップの実行

### Step 1: メニューから実行

1. スプレッドシートのメニュー「コンテンツ管理」をクリック
2. 「【特典】初期セットアップ」をクリック

### Step 2: 権限を許可

初回実行時は権限の許可が必要です：

1. 「承認が必要です」ダイアログで「権限を確認」
2. Googleアカウントを選択
3. 「詳細」→「〇〇（安全ではないページ）に移動」
4. 「許可」をクリック

### Step 3: 結果を確認

セットアップ完了後、以下が作成されます：

- `posts_gift`シート（青いヘッダー行付き）
- `canva_gift`シート（青いヘッダー行付き）
- Google DriveにGiftフォルダ

---

## セクション4: 操作方法

### 投稿データの追加

1. `config`シートのA2にJSONを貼り付け
2. メニュー「コンテンツ管理」→「【特典】posts_giftに追加」

### Canvaシートへの振り分け

1. `posts_gift`にDRAFTステータスのデータがある状態で
2. メニュー「コンテンツ管理」→「【特典】canva_giftに振り分け」

---

## トラブルシューティング

### 「Giftフォルダ: エラー」が表示される

`GIFT_CONFIG.PARENT_FOLDER_ID`が正しくない可能性があります。

**フォルダIDの確認方法**:
1. Google Driveで親フォルダを開く
2. URLの`folders/`以降の文字列がフォルダID

```
https://drive.google.com/drive/folders/1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo
                                        ↑ここがフォルダID
```

### シートが作成されない

GASエディタでエラーログを確認：
1. 「実行」→「実行ログを表示」

---

## まとめ

### このモジュールで学んだこと

- 特典付き投稿用のシート構成
- GASコードの追加方法
- 初期セットアップの実行
- メニューからの操作

### 次のステップ

Module 04で投稿の台本テンプレートを学びます。
