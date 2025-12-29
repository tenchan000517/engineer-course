# GAS実装 - アイデアインポート

**所要時間**: 30分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Google Apps Script（GAS）の基本的な使い方
- JSONデータをスプレッドシートにインポートする機能の実装
- カスタムメニューの作成方法
- X投稿アイデアのインポートフロー

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- GASエディタを開いてコードを記述できる
- JSONデータをideasシートにインポートできる
- スプレッドシートのカスタムメニューから機能を実行できる

---

## 目次

- [セクション1: GASエディタを開く](#セクション1-gasエディタを開く)
- [セクション2: インポート機能の実装](#セクション2-インポート機能の実装)
- [セクション3: カスタムメニューの作成](#セクション3-カスタムメニューの作成)
- [セクション4: インポートの実行](#セクション4-インポートの実行)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 02で作成したスプレッドシート（x-auto-post-advanced）
- Googleアカウント

### 前提知識

- スプレッドシートの基本操作
- プログラミングの基礎知識（あると理解が深まる）

---

## セクション1: GASエディタを開く

### Step 1: 拡張機能メニューからGASを開く

1. x-auto-post-advancedスプレッドシートを開く
2. メニューの「拡張機能」→「Apps Script」をクリック

### Step 2: プロジェクト名の変更

1. 左上の「無題のプロジェクト」をクリック
2. 「x-auto-post-advanced」に変更
3. 「名前を変更」をクリック

### GASエディタの画面構成

| 要素 | 説明 |
|------|------|
| コード.gs | メインのスクリプトファイル |
| 実行ボタン（▶） | 選択した関数を実行 |
| 保存ボタン（💾） | コードを保存 |
| ログを表示 | 実行ログを確認 |

### チェックポイント

- [ ] GASエディタを開いた
- [ ] プロジェクト名を変更した

---

## セクション2: インポート機能の実装

### データの作り方

configシートのA2セルに貼り付けるJSONデータは、X向けリサーチ講座で生成します：

[X向けリサーチ講座](/category/post-research/x-research/module-01-overview)

この講座で生成される`x_posts_month_YYYYMM.json`（150投稿）をインポートします。

### インポート機能の設計

configシートのA2セルに貼り付けた150投稿JSONを、postsシートとthread_draftシートにインポートします。

**入力（150投稿JSON形式）**:

```json
{
  "generated_at": "2025-12-29",
  "month": "2025-01",
  "total_posts": 150,
  "posts": [
    {
      "post_id": "X-POST-001",
      "pattern": "announcement",
      "tool_name": "Gemini 3.0",
      "angle": "資料作成",
      "scheduled_date": "2025-01-01",
      "content": "本文テキスト",
      "reply_content": "詳細はこちら",
      "source_urls": ["https://..."],
      "status": "READY"
    },
    {
      "post_id": "X-POST-121",
      "pattern": "thread",
      "tool_name": "NotebookLM",
      "tweets": [
        { "order": 1, "content": "フック文" },
        { "order": 2, "content": "理由1" },
        { "order": 3, "content": "理由2" },
        { "order": 4, "content": "活用法1" },
        { "order": 5, "content": "活用法2" },
        { "order": 6, "content": "活用法3" },
        { "order": 7, "content": "まとめ" }
      ],
      "status": "READY"
    }
  ]
}
```

**出力（postsシート 12列）**:

| post_id | pattern | tool_name | content | image_prompt | status | tweet_count |
|---------|---------|-----------|---------|--------------|--------|-------------|
| X-POST-001 | announcement | Gemini 3.0 | 本文テキスト | | READY | 1 |
| X-POST-002 | image | Nanobanana | 本文テキスト | Flowchart... | READY | 1 |
| X-POST-121 | thread | NotebookLM | | | READY | 7 |

**出力（thread_draftシート）** ※スレッド投稿のみ:

| post_id | tweet_1 | tweet_2 | tweet_3 | tweet_4 | tweet_5 | tweet_6 | tweet_7 |
|---------|---------|---------|---------|---------|---------|---------|---------|
| X-POST-121 | フック文 | 理由1 | 理由2 | 活用法1 | 活用法2 | 活用法3 | まとめ |

### Step 1: インポート関数を追加

Module 02で作成したGASコードの**末尾**に、以下の関数を追加します：

```javascript
/**
 * configシートのA2にある150投稿JSONをpostsとthread_draftにインポート
 */
function importPostsFromJson() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const postsSheet = ss.getSheetByName('posts');
  const threadDraftSheet = ss.getSheetByName('thread_draft');
  const ui = SpreadsheetApp.getUi();

  // configシートのA2からJSONを取得
  const jsonStr = configSheet.getRange('A2').getValue();

  if (!jsonStr) {
    ui.alert('エラー', 'configシートのA2にJSONがありません', ui.ButtonSet.OK);
    return;
  }

  try {
    const data = JSON.parse(jsonStr);
    const posts = data.posts;

    if (!posts || posts.length === 0) {
      ui.alert('エラー', 'JSONにposts配列がありません', ui.ButtonSet.OK);
      return;
    }

    // postsシートに追加するデータ
    const postRows = [];
    // thread_draftシートに追加するデータ
    const threadRows = [];

    posts.forEach(post => {
      const tweetCount = post.pattern === 'thread' ? (post.tweets ? post.tweets.length : 7) : 1;

      // postsシートの行（12列）
      postRows.push([
        post.post_id,              // post_id
        post.pattern,              // pattern
        post.tool_name || '',      // tool_name
        post.angle || '',          // angle
        post.scheduled_date || '', // scheduled_date
        post.content || '',        // content（非スレッド用）
        post.image_prompt || '',   // image_prompt（画像生成用）
        post.reply_content || '',  // reply_content
        post.status || 'READY',    // status
        tweetCount,                // tweet_count
        '',                        // posted_at（投稿後に更新）
        ''                         // tweet_url（投稿後に更新）
      ]);

      // スレッド投稿の場合、thread_draftにも追加
      if (post.pattern === 'thread' && post.tweets) {
        const tweets = post.tweets.sort((a, b) => a.order - b.order);
        const row = [post.post_id];
        for (let i = 0; i < 7; i++) {
          row.push(tweets[i] ? tweets[i].content : '');
        }
        threadRows.push(row);
      }
    });

    // postsシートに追加（12列）
    const postsLastRow = postsSheet.getLastRow();
    if (postRows.length > 0) {
      postsSheet.getRange(postsLastRow + 1, 1, postRows.length, 12).setValues(postRows);
    }

    // thread_draftシートに追加
    const threadLastRow = threadDraftSheet.getLastRow();
    if (threadRows.length > 0) {
      threadDraftSheet.getRange(threadLastRow + 1, 1, threadRows.length, 8).setValues(threadRows);
    }

    const message = postRows.length + '件をpostsシートに追加しました。\n' +
                    'うちスレッド投稿' + threadRows.length + '件をthread_draftにも追加しました。';
    ui.alert('インポート完了', message, ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('エラー', 'JSONのパースに失敗しました:\n' + error.message, ui.ButtonSet.OK);
  }
}
```

### Step 2: コードを保存

1. 保存ボタン（💾）をクリック
2. または Ctrl+S（Mac: Cmd+S）

### コードの解説

| コード | 説明 |
|--------|------|
| `SpreadsheetApp.getActiveSpreadsheet()` | 現在のスプレッドシートを取得 |
| `ss.getSheetByName('posts')` | 指定した名前のシートを取得 |
| `JSON.parse(jsonStr)` | JSON文字列をオブジェクトに変換 |
| `post.image_prompt \|\| ''` | image_promptがあれば取得、なければ空文字 |
| `post.pattern === 'thread'` | スレッド投稿かどうか判定 |
| `tweets.sort((a, b) => a.order - b.order)` | ツイートを順番にソート |
| `setValues(rows)` | 複数行を一括で書き込み |

### チェックポイント

- [ ] importPostsFromJson関数を実装した
- [ ] コードを保存した

---

## セクション3: カスタムメニューの更新

### onOpen関数にメニュー項目を追加

Module 02で作成したonOpen関数に、インポート機能のメニュー項目を追加します。

### Step 1: onOpen関数を更新

既存のonOpen関数を以下のように**置き換え**ます（メニュー項目を追加）：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('X投稿管理')
    .addItem('初期セットアップ', 'setupAllSheets')
    .addSeparator()
    .addItem('150投稿JSONをインポート', 'importPostsFromJson')
    .addSeparator()
    .addItem('シートをリセット（注意）', 'resetAllSheets')
    .addToUi();
}
```

### Step 2: コードを保存してスプレッドシートを再読み込み

1. コードを保存（Ctrl+S）
2. スプレッドシートのタブに戻る
3. ブラウザでページを再読み込み（F5）
4. 「X投稿管理」メニューに「150投稿JSONをインポート」が追加されていることを確認

### 更新後のメニュー構成

| メニュー項目 | 説明 |
|-------------|------|
| 初期セットアップ | 4シートを自動作成 |
| 150投稿JSONをインポート | configのJSONをposts/thread_draftにインポート |
| シートをリセット（注意） | 全データを削除 |

### チェックポイント

- [ ] onOpen関数を更新した
- [ ] コードを保存した
- [ ] スプレッドシートを再読み込みした
- [ ] メニューに「150投稿JSONをインポート」が表示された

---

## セクション4: インポートの実行

### Step 1: テスト用JSONを準備

以下のテスト用JSONをコピーします（本番では`x_posts_month_YYYYMM.json`を使用）：

```json
{
  "generated_at": "2025-01-15",
  "month": "2025-01",
  "total_posts": 3,
  "posts": [
    {
      "post_id": "X-POST-001",
      "pattern": "announcement",
      "tool_name": "Gemini 3.0",
      "angle": "資料作成",
      "scheduled_date": "2025-01-16",
      "content": "Googleの「Gemini 3.0」が業務効率化に役立つ。資料作成からデータ分析まで幅広く活用できます。詳細は👇",
      "reply_content": "公式サイトはこちら",
      "status": "READY"
    },
    {
      "post_id": "X-POST-002",
      "pattern": "image",
      "tool_name": "Nanobanana Pro",
      "angle": "画像生成",
      "scheduled_date": "2025-01-16",
      "content": "AIで図解を作成する方法。複雑な概念も視覚化できます。",
      "image_prompt": "Flowchart showing AI workflow. Labels: INPUT, PROCESS, OUTPUT.",
      "status": "READY"
    },
    {
      "post_id": "X-POST-003",
      "pattern": "thread",
      "tool_name": "NotebookLM",
      "angle": "資料作成",
      "scheduled_date": "2025-01-17",
      "tweets": [
        { "order": 1, "content": "NotebookLMが進化しました。これで資料作成の効率が劇的に向上します。活用法を3つ解説します👇" },
        { "order": 2, "content": "【なぜNotebookLMなのか？】(1/5)\n容量無制限のデータベースとして機能します。" },
        { "order": 3, "content": "【活用法1】(2/5)\n会議資料の要約に最適です。" },
        { "order": 4, "content": "【活用法2】(3/5)\nリサーチ結果の整理に使えます。" },
        { "order": 5, "content": "【活用法3】(4/5)\nナレッジベースの構築に活用できます。" },
        { "order": 6, "content": "【まとめ】(5/5)\n・容量無制限\n・要約機能\n・ナレッジベース" },
        { "order": 7, "content": "NotebookLMを使いこなしたい方は、ぜひフォローをお願いします！\n@ai_jitan" }
      ],
      "status": "READY"
    }
  ]
}
```

### Step 2: configシートにJSONを貼り付け

1. configシートを開く
2. A2セルにJSONを貼り付け

### Step 3: インポートを実行

1. メニューの「X投稿管理」→「150投稿JSONをインポート」をクリック

configシートにJSONを貼り付け、メニューからインポートを実行：

![configシートとインポートメニュー](/n8n-x-advanced/images/config-json-import-menu.png)

2. 初回実行時は承認ダイアログが表示されます

### 初回実行時の承認手順

1. 「承認が必要です」ダイアログで「続行」をクリック
2. Googleアカウントを選択
3. 「詳細」→「（安全ではないページ）に移動」をクリック
4. 「許可」をクリック

### Step 4: 結果の確認

1. 「30件をpostsシートに追加しました。うちスレッド投稿6件をthread_draftにも追加しました。」というダイアログが表示される
2. postsシートを開き、データが追加されていることを確認
3. thread_draftシートを開き、スレッド投稿のツイートが追加されていることを確認

### インポート結果

**postsシート**（12列構造）:

インポート後のpostsシート：

![postsシート](/n8n-x-advanced/images/posts-imported.png)

| post_id | pattern | tool_name | content | image_prompt | status | tweet_count |
|---------|---------|-----------|---------|--------------|--------|-------------|
| 20250101-001 | announcement | ChatGPT | 本文... | | READY | 1 |
| 20250101-002 | image | ChatGPT | 本文... | Flowchart... | READY | 1 |
| 20250101-003 | announcement | ChatGPT | 本文... | | READY | 1 |
| 20250101-004 | image | ChatGPT | 本文... | Diagram... | READY | 1 |
| 20250101-005 | thread | ChatGPT | | | READY | 7 |

**thread_draftシート**:

インポート後のthread_draftシート：

![thread_draftシート](/n8n-x-advanced/images/thread-draft-imported.png)

| post_id | tweet_1 | tweet_2 | ... | tweet_7 |
|---------|---------|---------|-----|---------|
| 20250101-005 | GPT-5.2のエージェント機能が... | 【なぜエージェント機能が... | ... | @ai_jitan |

### チェックポイント

- [ ] テスト用JSONをconfigシートのA2に貼り付けた
- [ ] メニューからインポートを実行した
- [ ] 初回承認を完了した
- [ ] postsシートに3件追加された
- [ ] thread_draftシートにスレッド投稿が追加された

---

## トラブルシューティング

### 「configシートのA2にJSONがありません」と表示される

**原因**: A2セルが空、またはA1セルにJSONを貼り付けている

**解決方法**: configシートの**A2セル**にJSONを貼り付けてください。A1はヘッダー行（json_data）です。

### 「JSONにposts配列がありません」と表示される

**原因**: JSONの形式が150投稿形式ではない（古いideas形式など）

**解決方法**: X向けリサーチ講座で生成した`x_posts_month_YYYYMM.json`を使用してください。

### 「エラー: Unexpected token...」と表示される

**原因**: JSONの形式が正しくない

**解決方法**:
- ダブルクォート（"）がシングルクォート（'）になっていないか確認
- カンマの過不足を確認
- [JSONLint](https://jsonlint.com/)でJSONを検証

### thread_draftにデータが追加されない

**原因**: スレッド投稿（pattern: "thread"）にtweets配列がない

**解決方法**: スレッド投稿には必ず`tweets`配列（7ツイート分）を含めてください。

### メニューが表示されない

**原因**: onOpen関数がまだ実行されていない

**解決方法**: スプレッドシートを再読み込み（F5）してください。

---

## まとめ

### このモジュールで学んだこと

- GASエディタの開き方とコードの保存方法
- 150投稿JSONをパースしてpostsとthread_draftに書き込む方法
- カスタムメニューの作成方法（onOpen関数）
- GAS関数の初回承認手順

### 次のステップ

次のモジュールでは、postsシートのデータをn8nワークフローで自動投稿する機能を実装します。

---

## よくある質問

**Q: 150投稿を一度にインポートできますか？**
A: はい、GASの実行時間制限（6分）内であれば問題ありません。通常の150件程度なら数秒で完了します。

**Q: 既存のデータを上書きせずに追加されますか？**
A: はい、常に最終行の下に追加されます。既存のデータは上書きされません。

**Q: post_idは自動で採番されますか？**
A: いいえ、JSONに含まれるpost_id（X-POST-001など）がそのまま使用されます。

**Q: スレッド以外の投稿もthread_draftに追加されますか？**
A: いいえ、pattern: "thread"の投稿のみがthread_draftに追加されます。

**Q: エラーが発生したらデータは追加されますか？**
A: いいえ、try-catch文でエラーをキャッチするため、エラー時はデータが追加されません。

**Q: JSONの形式を変更できますか？**
A: はい、GASコードを修正すれば任意のJSON形式に対応できます。ただし、X向けリサーチ講座の出力形式に合わせることを推奨します。

---

## 参考資料

- [Google Apps Script リファレンス - SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
- [Google Apps Script リファレンス - Ui クラス](https://developers.google.com/apps-script/reference/base/ui)
- [JSON.parse() - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
