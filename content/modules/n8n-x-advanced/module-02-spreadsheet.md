# スプレッドシート構築

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- X上級編用スプレッドシートの作成
- GASによる4シートの自動セットアップ
- 自動装飾・入力規則・列幅調整
- カスタムメニューの作成

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- X上級編用のスプレッドシートを新規作成できる
- 4つのシートを正しい列構造で作成できる
- 各シートの役割とデータの流れを説明できる

---

## 目次

- [セクション1: スプレッドシートの作成](#セクション1-スプレッドシートの作成)
- [セクション2: GASによる自動セットアップ](#セクション2-gasによる自動セットアップ)
- [セクション3: 手動でのシート作成（参考）](#セクション3-手動でのシート作成参考)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Googleアカウント
- Googleスプレッドシートへのアクセス

### 前提知識

- Googleスプレッドシートの基本操作（シートの追加、列の作成）

---

## セクション1: スプレッドシートの作成

### Step 1: 新規スプレッドシートを作成

1. [Google スプレッドシート](https://sheets.google.com)にアクセス
2. 「空白」をクリックして新規スプレッドシートを作成
3. タイトルを「x-auto-post-advanced」に変更

### Step 2: シート構成の確認

以下の4つのシートを作成します：

| シート名 | 用途 |
|---------|------|
| config | JSON一時保存（GASインポート用） |
| ideas | 投稿アイデア管理 |
| posts | 投稿管理（ステータス管理） |
| thread_draft | スレッド下書き（7ツイート分） |

### Step 3: シートのリネーム

1. デフォルトの「シート1」を右クリック
2. 「名前を変更」を選択
3. 「config」に変更

### チェックポイント

- [ ] 新規スプレッドシートを作成した
- [ ] タイトルを「x-auto-post-advanced」に変更した

---

## セクション2: GASによる自動セットアップ

手動でシートを作成する代わりに、GASを使って4つのシートを自動作成します。ヘッダー行の設定、装飾、列幅調整も全て自動で行われます。

### Step 1: GASエディタを開く

1. スプレッドシートのメニューから「拡張機能」→「Apps Script」をクリック

拡張機能メニューの表示：

![拡張機能メニュー](/n8n-x-advanced/images/gas-menu-open.png)

2. GASエディタが開きます

### Step 2: セットアップコードを貼り付け

既存のコードを全て削除し、以下のコードを貼り付けます：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('X投稿管理')
    .addItem('初期セットアップ', 'setupAllSheets')
    .addSeparator()
    .addItem('シートをリセット（注意）', 'resetAllSheets')
    .addToUi();
}

/**
 * 全シートを自動作成・設定
 */
function setupAllSheets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '初期セットアップ',
    '4つのシート（config, ideas, posts, thread_draft）を作成します。\n既存のシートがある場合はスキップされます。\n\n続行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 各シートをセットアップ
  setupConfigSheet(ss);
  setupIdeasSheet(ss);
  setupPostsSheet(ss);
  setupThreadDraftSheet(ss);

  // デフォルトの「シート1」があれば削除
  const defaultSheet = ss.getSheetByName('シート1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  ui.alert('セットアップ完了', '4つのシートを作成しました。', ui.ButtonSet.OK);
}

/**
 * configシートのセットアップ
 */
function setupConfigSheet(ss) {
  let sheet = ss.getSheetByName('config');
  if (!sheet) {
    sheet = ss.insertSheet('config');
  }

  // ヘッダー設定
  const headers = [['json_data']];
  sheet.getRange(1, 1, 1, 1).setValues(headers);

  // 装飾
  const headerRange = sheet.getRange(1, 1, 1, 1);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setHorizontalAlignment('center');

  // 列幅調整
  sheet.setColumnWidth(1, 500);

  // 1行目を固定
  sheet.setFrozenRows(1);
}

/**
 * ideasシートのセットアップ
 */
function setupIdeasSheet(ss) {
  let sheet = ss.getSheetByName('ideas');
  if (!sheet) {
    sheet = ss.insertSheet('ideas');
  }

  // ヘッダー設定
  const headers = [['idea_id', 'month', 'title', 'topic', 'category', 'status', 'created_at']];
  sheet.getRange(1, 1, 1, 7).setValues(headers);

  // 装飾
  const headerRange = sheet.getRange(1, 1, 1, 7);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setHorizontalAlignment('center');
  headerRange.setBorder(true, true, true, true, true, true, '#d1d5db', SpreadsheetApp.BorderStyle.SOLID);

  // 列幅調整
  sheet.setColumnWidth(1, 100);  // idea_id
  sheet.setColumnWidth(2, 80);   // month
  sheet.setColumnWidth(3, 300);  // title
  sheet.setColumnWidth(4, 150);  // topic
  sheet.setColumnWidth(5, 80);   // category
  sheet.setColumnWidth(6, 100);  // status
  sheet.setColumnWidth(7, 150);  // created_at

  // 1行目を固定
  sheet.setFrozenRows(1);

  // status列にデータ入力規則を設定
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['NEW', 'ADOPTED', 'POSTED', 'REJECTED'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('F2:F1000').setDataValidation(statusRule);

  // category列にデータ入力規則を設定
  const categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['A', 'B', 'C', 'D', 'E'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E1000').setDataValidation(categoryRule);
}

/**
 * postsシートのセットアップ
 */
function setupPostsSheet(ss) {
  let sheet = ss.getSheetByName('posts');
  if (!sheet) {
    sheet = ss.insertSheet('posts');
  }

  // ヘッダー設定（12列）
  const headers = [['post_id', 'pattern', 'tool_name', 'angle', 'scheduled_date', 'content', 'image_prompt', 'reply_content', 'status', 'tweet_count', 'posted_at', 'tweet_url']];
  sheet.getRange(1, 1, 1, 12).setValues(headers);

  // 装飾
  const headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setHorizontalAlignment('center');
  headerRange.setBorder(true, true, true, true, true, true, '#d1d5db', SpreadsheetApp.BorderStyle.SOLID);

  // 列幅調整
  sheet.setColumnWidth(1, 120);  // post_id
  sheet.setColumnWidth(2, 100);  // pattern
  sheet.setColumnWidth(3, 120);  // tool_name
  sheet.setColumnWidth(4, 100);  // angle
  sheet.setColumnWidth(5, 110);  // scheduled_date
  sheet.setColumnWidth(6, 400);  // content
  sheet.setColumnWidth(7, 400);  // image_prompt
  sheet.setColumnWidth(8, 300);  // reply_content
  sheet.setColumnWidth(9, 80);   // status
  sheet.setColumnWidth(10, 100); // tweet_count
  sheet.setColumnWidth(11, 150); // posted_at
  sheet.setColumnWidth(12, 300); // tweet_url

  // 1行目を固定
  sheet.setFrozenRows(1);

  // pattern列にデータ入力規則を設定
  const patternRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['announcement', 'image', 'thread'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('B2:B1000').setDataValidation(patternRule);

  // status列にデータ入力規則を設定（I列 = 9列目）
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['DRAFT', 'READY', 'POSTED', 'FAILED'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I2:I1000').setDataValidation(statusRule);

  // content, image_prompt, reply_content列のテキスト折り返し
  sheet.getRange('F:H').setWrap(true);
}

/**
 * thread_draftシートのセットアップ
 */
function setupThreadDraftSheet(ss) {
  let sheet = ss.getSheetByName('thread_draft');
  if (!sheet) {
    sheet = ss.insertSheet('thread_draft');
  }

  // ヘッダー設定
  const headers = [['post_id', 'tweet_1', 'tweet_2', 'tweet_3', 'tweet_4', 'tweet_5', 'tweet_6', 'tweet_7']];
  sheet.getRange(1, 1, 1, 8).setValues(headers);

  // 装飾
  const headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setHorizontalAlignment('center');
  headerRange.setBorder(true, true, true, true, true, true, '#d1d5db', SpreadsheetApp.BorderStyle.SOLID);

  // 列幅調整
  sheet.setColumnWidth(1, 100);  // post_id
  for (let i = 2; i <= 8; i++) {
    sheet.setColumnWidth(i, 300);  // tweet_1〜tweet_7
  }

  // 1行目を固定
  sheet.setFrozenRows(1);

  // テキスト折り返し設定
  sheet.getRange('B:H').setWrap(true);
}

/**
 * 全シートをリセット（データ削除）
 */
function resetAllSheets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '警告：シートをリセット',
    '全シートのデータを削除します。この操作は取り消せません。\n\n本当に続行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['config', 'ideas', 'posts', 'thread_draft'];

  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      }
    }
  });

  ui.alert('リセット完了', '全シートのデータを削除しました（ヘッダー行は保持）。', ui.ButtonSet.OK);
}
```

### Step 3: コードを保存

1. 保存ボタン（💾）をクリック、または Ctrl+S
2. プロジェクト名を「x-auto-post-advanced」に変更

GASエディタでコードを貼り付けた画面：

![GASコードエディタ](/n8n-x-advanced/images/gas-code-editor.png)

### Step 4: スプレッドシートを再読み込み

1. スプレッドシートのタブに戻る
2. ブラウザでページを再読み込み（F5）
3. メニューバーに「X投稿管理」が表示される

「X投稿管理」メニューが追加された画面：

![カスタムメニュー表示](/n8n-x-advanced/images/custom-menu-display.png)

### Step 5: 初期セットアップを実行

1. メニューの「X投稿管理」→「初期セットアップ」をクリック
2. 確認ダイアログで「OK」をクリック

初期セットアップの確認ダイアログ：

![初期セットアップ確認](/n8n-x-advanced/images/setup-confirm.png)

3. 初回実行時は承認が必要です

「認証が必要です」ダイアログで「OK」をクリック：

![認証が必要です](/n8n-x-advanced/images/auth-required.png)

4. Googleアカウントを選択

![アカウント選択](/n8n-x-advanced/images/account-select.png)

5. 「このアプリはGoogleで確認されていません」が表示されたら、「詳細」をクリック

![アプリ未確認警告](/n8n-x-advanced/images/app-not-verified.png)

6. 「無題のプロジェクト（安全ではないページ）に移動」をクリック

![詳細表示後](/n8n-x-advanced/images/app-not-verified-detail.png)

7. 「続行」をクリックしてアクセス権を付与

![アクセス権付与](/n8n-x-advanced/images/grant-access.png)

8. 「セットアップ完了」と表示されたら成功

セットアップ完了後のスプレッドシート（4シートが作成された状態）：

![セットアップ完了](/n8n-x-advanced/images/setup-complete.png)

### 自動セットアップで設定される内容

| 設定項目 | 内容 |
|----------|------|
| シート作成 | config, ideas, posts, thread_draft の4シート |
| ヘッダー行 | 太字、背景色グレー、中央揃え、罫線 |
| 列幅 | 各列に適切な幅を自動設定 |
| 1行目固定 | スクロールしてもヘッダーが見える |
| 入力規則 | status列、category列にドロップダウン設定 |
| テキスト折り返し | tweet_1〜tweet_7列は自動折り返し |

### カスタムメニューの機能

| メニュー項目 | 説明 |
|-------------|------|
| 初期セットアップ | 4シートを自動作成（既存シートはスキップ） |
| シートをリセット（注意） | 全シートのデータを削除（ヘッダー行は保持） |

### チェックポイント

- [ ] GASエディタを開いた
- [ ] セットアップコードを貼り付けて保存した
- [ ] スプレッドシートを再読み込みした
- [ ] 「X投稿管理」メニューが表示された
- [ ] 「初期セットアップ」を実行した
- [ ] 4つのシートが作成された

---

## セクション3: 手動でのシート作成（参考）

GASによる自動セットアップを使わず、手動でシートを作成する場合の手順です。**自動セットアップを実行した場合は、このセクションはスキップしてください。**

### 各シートの構造

#### configシート

| 列 | 列名 | 説明 |
|----|------|------|
| A | json_data | インポートするJSON文字列 |

#### ideasシート

| 列 | 列名 | 説明 | 例 |
|----|------|------|-----|
| A | idea_id | アイデアID | IDEA-001 |
| B | month | 年月 | 2025-01 |
| C | title | 投稿タイトル | （任意のタイトル） |
| D | topic | 主要トピック | AI |
| E | category | カテゴリ（A/B/C/D/E） | A |
| F | status | ステータス | NEW |
| G | created_at | 作成日 | 2025-01-15 |

#### postsシート

| 列 | 列名 | 説明 | 例 |
|----|------|------|-----|
| A | post_id | 投稿ID | 20250101-001 |
| B | pattern | 投稿パターン | announcement / image / thread |
| C | tool_name | ツール名 | ChatGPT |
| D | angle | 切り口 | 資料作成 |
| E | scheduled_date | 投稿予定日 | 2025-01-01 |
| F | content | 投稿本文 | （本文テキスト） |
| G | image_prompt | 画像生成プロンプト | Flowchart showing... |
| H | reply_content | リプライ内容 | 公式発表はこちら👉 |
| I | status | ステータス | READY |
| J | tweet_count | スレッドのツイート数 | 7 |
| K | posted_at | 投稿日時 | 2025-01-15 10:00:00 |
| L | tweet_url | 投稿後のURL | https://x.com/... |

#### thread_draftシート

| 列 | 列名 | 説明 |
|----|------|------|
| A | post_id | 対象投稿ID |
| B | tweet_1 | 1ツイート目（フック） |
| C | tweet_2 | 2ツイート目 |
| D | tweet_3 | 3ツイート目 |
| E | tweet_4 | 4ツイート目 |
| F | tweet_5 | 5ツイート目 |
| G | tweet_6 | 6ツイート目 |
| H | tweet_7 | 7ツイート目（まとめ） |

### ステータスの種類

#### ideasシートのstatus

| ステータス | 説明 |
|-----------|------|
| NEW | 新規アイデア（未レビュー） |
| ADOPTED | 採用済み（投稿作成に進む） |
| POSTED | 投稿完了 |
| REJECTED | 不採用 |

#### postsシートのstatus

| ステータス | 説明 |
|-----------|------|
| DRAFT | 下書き中 |
| READY | 投稿準備完了 |
| POSTED | 投稿完了 |
| FAILED | 投稿失敗 |

### カテゴリの種類

| カテゴリ | 説明 |
|---------|------|
| A | AI・生成AI |
| B | 自動化・効率化 |
| C | ツール紹介 |
| D | ノウハウ・Tips |
| E | その他 |

### 手動作成の手順

1. **シート追加**: 左下の「+」ボタンをクリックしてシートを追加
2. **シート名変更**: シートタブを右クリック→「名前を変更」
3. **ヘッダー入力**: 1行目に列名を入力
4. **装飾**: 1行目を選択→太字（Ctrl+B）→背景色グレー
5. **列幅調整**: 列を選択→右クリック→「列のサイズを変更」

---

## トラブルシューティング

### 「X投稿管理」メニューが表示されない

**原因**: onOpen関数がまだ実行されていない

**解決方法**: スプレッドシートを再読み込み（F5）してください。onOpen関数はスプレッドシートを開いた時に自動実行されます。

### 「承認が必要です」と表示される

**原因**: GASの初回実行時は権限の承認が必要

**解決方法**:
1. 「続行」をクリック
2. Googleアカウントを選択
3. 「詳細」→「（安全ではないページ）に移動」をクリック
4. 「許可」をクリック

### セットアップ実行時にエラーが発生する

**原因**: コードの貼り付けミス、または構文エラー

**解決方法**:
1. GASエディタでコードを全て削除
2. 本講座のコードをもう一度コピー&ペースト
3. 保存して再実行

### シート名が日本語になってしまう

**原因**: シート名を直接日本語で入力した

**解決方法**: シートタブを右クリック→「名前を変更」で英語名に修正してください。GASやn8nからアクセスする際、日本語名だと問題が起きる場合があります。

### ドロップダウンが表示されない

**原因**: データ入力規則が設定されていない（手動作成の場合）

**解決方法**: GASの「初期セットアップ」を実行するか、手動で「データ」→「データの入力規則」から設定してください。

---

## まとめ

### このモジュールで学んだこと

- **GASによる自動セットアップ**でシートを効率的に作成できる
- **4つのシート**の役割と構造を理解した
  - config: JSON一時保存
  - ideas: アイデア管理（ドロップダウン付き）
  - posts: 投稿管理（ドロップダウン付き）
  - thread_draft: スレッド下書き（自動折り返し）
- **装飾・入力規則・列幅調整**も自動化できる
- **カスタムメニュー**でワンクリック実行できる

### データフロー

```
config（JSONインポート）
    ↓
ideas（アイデア管理）
    ↓ status: ADOPTED
posts（投稿管理）+ thread_draft（下書き）
    ↓ status: READY
n8nで投稿
    ↓ status: POSTED
完了
```

### 次のステップ

次のモジュールでは、このGASに機能を追加し、JSONデータをideasシートにインポートする機能を実装します。

---

## よくある質問

**Q: GASを使わずに手動でシートを作成しても良いですか？**
A: はい、セクション3の手動作成手順を参考にしてください。ただし、ドロップダウンや装飾は手動で設定が必要です。

**Q: 既にシートがある状態で初期セットアップを実行するとどうなりますか？**
A: 既存のシートはスキップされ、不足しているシートのみ作成されます。既存データは削除されません。

**Q: シート名は英語でなければいけませんか？**
A: 必須ではありませんが、GASやn8nからアクセスする際の互換性を考慮して英語名を推奨しています。

**Q: 列の順番を変えても良いですか？**
A: GASやn8nのコードを修正すれば変更可能ですが、本講座の手順通りに進める場合は変更しないでください。

**Q: tweet_1〜tweet_7以外に列を追加しても良いですか？**
A: はい、image_urlなどの列を追加することは可能です。ただし、GASやn8nのコードも合わせて修正が必要です。

**Q: スプレッドシートIDはどこで確認できますか？**
A: スプレッドシートのURLから確認できます。`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`の`{SPREADSHEET_ID}`部分がIDです。

**Q: 「シートをリセット」を実行するとどうなりますか？**
A: 全シートの2行目以降のデータが削除されます。ヘッダー行（1行目）は保持されます。この操作は取り消せないので注意してください。

---

## 参考資料

- [Google スプレッドシート ヘルプ](https://support.google.com/docs/topic/9054603)
- [スプレッドシートの共有と共同編集](https://support.google.com/docs/answer/2494822)
