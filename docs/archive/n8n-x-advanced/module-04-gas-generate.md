# GAS実装 - 投稿データ生成

**所要時間**: 40分
**難易度**: ⭐⭐⭐☆☆

---

> **📌 このモジュールはスキップ可能です**
>
> Module 03で150投稿JSONを直接インポートした場合、このモジュールは不要です。
>
> **スキップする場合**: [Module 04: n8nワークフロー](/category/n8n-x-advanced/module-04-n8n-workflow)に進んでください。
>
> **このモジュールが必要なケース**:
> - ideasシートでアイデアを手動管理したい場合
> - 投稿内容を手動で入力したい場合
> - ステータスを段階的に管理したい場合

---

## このモジュールで学ぶこと

- ideasシートからpostsシートへの振り分け機能
- スレッド投稿データ（thread_draft）の構造
- AIで生成したスレッド内容をthread_draftに登録する方法
- ステータス管理のフロー

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- ideasシートのアイデアをpostsシートに登録できる
- スレッド内容をthread_draftシートに登録できる
- ステータスを更新してワークフローを管理できる

---

## 目次

- [セクション1: 振り分け機能の設計](#セクション1-振り分け機能の設計)
- [セクション2: 投稿登録機能の実装](#セクション2-投稿登録機能の実装)
- [セクション3: スレッド内容の登録](#セクション3-スレッド内容の登録)
- [セクション4: カスタムメニューの拡張](#セクション4-カスタムメニューの拡張)
- [セクション5: 動作確認](#セクション5-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 03で作成したGASコード
- ideasシートにテストデータが登録済み

### 前提知識

- Module 03で学んだGASの基本

---

## セクション1: 振り分け機能の設計

### データフロー

```
ideasシート（status: NEW）
    ↓ 採用
ideasシート（status: ADOPTED）
    ↓ 投稿登録
postsシート（status: DRAFT）+ thread_draftシート
    ↓ スレッド内容入力
postsシート（status: READY）
    ↓ n8nで投稿
postsシート（status: POSTED）
```

### 振り分けの流れ

1. **アイデア採用**: ideasのstatusをNEW→ADOPTEDに変更
2. **投稿登録**: ADOPTEDのアイデアをpostsとthread_draftに登録
3. **スレッド入力**: thread_draftに7ツイート分の内容を入力
4. **準備完了**: postsのstatusをDRAFT→READYに変更
5. **投稿**: n8nがREADYの投稿を取得して投稿

### 機能一覧

| 機能 | 説明 |
|------|------|
| adoptIdea | ideasのstatusをADOPTEDに変更 |
| createPost | ADOPTEDをposts/thread_draftに登録 |
| setReady | postsのstatusをREADYに変更 |

### チェックポイント

- [ ] データフローを理解した
- [ ] 3つの機能の役割を把握した

---

## セクション2: 投稿登録機能の実装

### Step 1: 投稿登録関数を追加

Module 03のコードに、以下の関数を追加します：

```javascript
/**
 * ADOPTEDのアイデアをpostsとthread_draftに登録
 */
function createPostFromAdopted() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ideasSheet = ss.getSheetByName('ideas');
  const postsSheet = ss.getSheetByName('posts');
  const threadDraftSheet = ss.getSheetByName('thread_draft');
  const ui = SpreadsheetApp.getUi();

  // ideasシートからADOPTEDのデータを取得
  const ideasData = ideasSheet.getDataRange().getValues();
  const ideasHeaders = ideasData[0];
  const statusCol = ideasHeaders.indexOf('status');
  const ideaIdCol = ideasHeaders.indexOf('idea_id');
  const titleCol = ideasHeaders.indexOf('title');

  // ADOPTEDのアイデアを抽出
  const adoptedIdeas = [];
  for (let i = 1; i < ideasData.length; i++) {
    if (ideasData[i][statusCol] === 'ADOPTED') {
      adoptedIdeas.push({
        row: i + 1,
        ideaId: ideasData[i][ideaIdCol],
        title: ideasData[i][titleCol]
      });
    }
  }

  if (adoptedIdeas.length === 0) {
    ui.alert('ADOPTEDのアイデアがありません');
    return;
  }

  // postsの最大IDを取得
  const postsLastRow = postsSheet.getLastRow();
  let maxPostId = 0;
  if (postsLastRow > 1) {
    const existingIds = postsSheet.getRange(2, 1, postsLastRow - 1, 1).getValues();
    existingIds.forEach(row => {
      const match = row[0].toString().match(/POST-(\d+)/);
      if (match) {
        maxPostId = Math.max(maxPostId, parseInt(match[1]));
      }
    });
  }

  // posts と thread_draft に登録
  const now = new Date();
  let createdCount = 0;

  adoptedIdeas.forEach((idea, index) => {
    const postId = 'POST-' + String(maxPostId + index + 1).padStart(3, '0');

    // postsに追加
    postsSheet.appendRow([
      postId,           // post_id
      idea.ideaId,      // idea_id
      'DRAFT',          // status
      7,                // tweet_count
      '',               // posted_at
      ''                // tweet_url
    ]);

    // thread_draftに追加（空のテンプレート）
    threadDraftSheet.appendRow([
      postId,           // post_id
      '',               // tweet_1
      '',               // tweet_2
      '',               // tweet_3
      '',               // tweet_4
      '',               // tweet_5
      '',               // tweet_6
      ''                // tweet_7
    ]);

    // ideasのstatusをPOSTEDに変更（登録済みマーク）
    ideasSheet.getRange(idea.row, statusCol + 1).setValue('POSTED');

    createdCount++;
  });

  ui.alert(createdCount + '件の投稿を作成しました。\nthread_draftシートにスレッド内容を入力してください。');
}
```

### コードの解説

| コード | 説明 |
|--------|------|
| `getDataRange().getValues()` | シートの全データを2次元配列で取得 |
| `indexOf('status')` | ヘッダー行からstatusの列番号を取得 |
| `appendRow([...])` | 行を末尾に追加 |
| `getRange(row, col).setValue()` | 特定のセルの値を更新 |

### チェックポイント

- [ ] createPostFromAdopted関数を追加した
- [ ] コードを保存した

---

## セクション3: スレッド内容の登録

### スレッド内容の入力方法

thread_draftシートに登録された行に、7ツイート分の内容を手動で入力します。

AIを使ってスレッド内容を生成する場合の推奨フロー：

1. **AIにプロンプトを送信**: タイトルとトピックを元にスレッド生成を依頼
2. **JSONで出力**: 7ツイート分を構造化データで受け取る
3. **thread_draftに貼り付け**: 各ツイートを対応する列に入力

### スレッド生成プロンプト例

```markdown
以下のトピックについて、Xのスレッド投稿（7ツイート構成）を作成してください。

## トピック
サンプルアイデア1

## 出力形式

以下のJSON形式で出力してください：

{
  "tweet_1": "フック（280文字以内、Show more非発生）",
  "tweet_2": "解説1（なぜこのツールなのか）(1/5)",
  "tweet_3": "解説2（従来との違い）(2/5)",
  "tweet_4": "活用法1（プロンプト付き）(3/5)",
  "tweet_5": "活用法2（プロンプト付き）(4/5)",
  "tweet_6": "活用法3（プロンプト付き）(5/5)",
  "tweet_7": "まとめ + CTA（フォロー誘導）"
}

## ルール
- tweet_1は280文字以内
- 【見出し】形式で視認性を高める
- 各ツイートの末尾に「次に〜👇」で誘導
- tweet_7の末尾にフォロー誘導を入れる
```

### スレッド内容の直接入力

thread_draftシートを開き、各列に内容を入力します：

| post_id | tweet_1 | tweet_2 | ... | tweet_7 |
|---------|---------|---------|-----|---------|
| POST-001 | （フック文） | （解説1） | ... | （まとめ） |

### チェックポイント

- [ ] スレッド内容の入力方法を理解した
- [ ] AIプロンプトの構造を把握した

---

## セクション4: カスタムメニューの拡張

### Step 1: onOpen関数を更新

既存のonOpen関数を以下のように更新します：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('X投稿管理')
    .addItem('JSONをideasに追加', 'importJsonToIdeas')
    .addSeparator()
    .addItem('ADOPTEDから投稿作成', 'createPostFromAdopted')
    .addItem('選択行をREADYに変更', 'setSelectedToReady')
    .addToUi();
}
```

### Step 2: ステータス変更関数を追加

```javascript
/**
 * 選択中のpostsの行をREADYに変更
 */
function setSelectedToReady() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const postsSheet = ss.getSheetByName('posts');
  const ui = SpreadsheetApp.getUi();

  // アクティブなシートがpostsでない場合はエラー
  if (ss.getActiveSheet().getName() !== 'posts') {
    ui.alert('postsシートで実行してください');
    return;
  }

  const selection = postsSheet.getActiveRange();
  const startRow = selection.getRow();
  const numRows = selection.getNumRows();

  // ヘッダー行を除外
  if (startRow === 1) {
    ui.alert('データ行を選択してください（ヘッダー行は除外）');
    return;
  }

  // status列を特定
  const headers = postsSheet.getRange(1, 1, 1, postsSheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf('status') + 1;

  if (statusCol === 0) {
    ui.alert('status列が見つかりません');
    return;
  }

  // 選択行のstatusをREADYに変更
  let updatedCount = 0;
  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const currentStatus = postsSheet.getRange(row, statusCol).getValue();
    if (currentStatus === 'DRAFT') {
      postsSheet.getRange(row, statusCol).setValue('READY');
      updatedCount++;
    }
  }

  ui.alert(updatedCount + '件をREADYに変更しました');
}
```

### 完成したコード全体

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('X投稿管理')
    .addItem('JSONをideasに追加', 'importJsonToIdeas')
    .addSeparator()
    .addItem('ADOPTEDから投稿作成', 'createPostFromAdopted')
    .addItem('選択行をREADYに変更', 'setSelectedToReady')
    .addToUi();
}

/**
 * configシートのA2にあるJSONをideasシートに追加
 */
function importJsonToIdeas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');

  const jsonStr = configSheet.getRange('A2').getValue();

  if (!jsonStr) {
    SpreadsheetApp.getUi().alert('configシートのA2にJSONがありません');
    return;
  }

  try {
    const data = JSON.parse(jsonStr);
    const month = data.month;
    const ideas = data.ideas;

    const lastRow = ideasSheet.getLastRow();
    let maxId = 0;
    if (lastRow > 1) {
      const existingIds = ideasSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      existingIds.forEach(row => {
        const match = row[0].toString().match(/IDEA-(\d+)/);
        if (match) {
          maxId = Math.max(maxId, parseInt(match[1]));
        }
      });
    }

    const now = new Date();
    const rows = ideas.map((item, index) => {
      const ideaId = 'IDEA-' + String(maxId + index + 1).padStart(3, '0');
      return [
        ideaId,
        month,
        item.title,
        item.topic,
        item.category,
        'NEW',
        now
      ];
    });

    if (rows.length > 0) {
      ideasSheet.getRange(lastRow + 1, 1, rows.length, 7).setValues(rows);
    }

    SpreadsheetApp.getUi().alert(rows.length + '件をideasシートに追加しました');

  } catch (error) {
    SpreadsheetApp.getUi().alert('エラー: ' + error.message);
  }
}

/**
 * ADOPTEDのアイデアをpostsとthread_draftに登録
 */
function createPostFromAdopted() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ideasSheet = ss.getSheetByName('ideas');
  const postsSheet = ss.getSheetByName('posts');
  const threadDraftSheet = ss.getSheetByName('thread_draft');
  const ui = SpreadsheetApp.getUi();

  const ideasData = ideasSheet.getDataRange().getValues();
  const ideasHeaders = ideasData[0];
  const statusCol = ideasHeaders.indexOf('status');
  const ideaIdCol = ideasHeaders.indexOf('idea_id');
  const titleCol = ideasHeaders.indexOf('title');

  const adoptedIdeas = [];
  for (let i = 1; i < ideasData.length; i++) {
    if (ideasData[i][statusCol] === 'ADOPTED') {
      adoptedIdeas.push({
        row: i + 1,
        ideaId: ideasData[i][ideaIdCol],
        title: ideasData[i][titleCol]
      });
    }
  }

  if (adoptedIdeas.length === 0) {
    ui.alert('ADOPTEDのアイデアがありません');
    return;
  }

  const postsLastRow = postsSheet.getLastRow();
  let maxPostId = 0;
  if (postsLastRow > 1) {
    const existingIds = postsSheet.getRange(2, 1, postsLastRow - 1, 1).getValues();
    existingIds.forEach(row => {
      const match = row[0].toString().match(/POST-(\d+)/);
      if (match) {
        maxPostId = Math.max(maxPostId, parseInt(match[1]));
      }
    });
  }

  const now = new Date();
  let createdCount = 0;

  adoptedIdeas.forEach((idea, index) => {
    const postId = 'POST-' + String(maxPostId + index + 1).padStart(3, '0');

    postsSheet.appendRow([
      postId,
      idea.ideaId,
      'DRAFT',
      7,
      '',
      ''
    ]);

    threadDraftSheet.appendRow([
      postId,
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]);

    ideasSheet.getRange(idea.row, statusCol + 1).setValue('POSTED');

    createdCount++;
  });

  ui.alert(createdCount + '件の投稿を作成しました。\nthread_draftシートにスレッド内容を入力してください。');
}

/**
 * 選択中のpostsの行をREADYに変更
 */
function setSelectedToReady() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const postsSheet = ss.getSheetByName('posts');
  const ui = SpreadsheetApp.getUi();

  if (ss.getActiveSheet().getName() !== 'posts') {
    ui.alert('postsシートで実行してください');
    return;
  }

  const selection = postsSheet.getActiveRange();
  const startRow = selection.getRow();
  const numRows = selection.getNumRows();

  if (startRow === 1) {
    ui.alert('データ行を選択してください（ヘッダー行は除外）');
    return;
  }

  const headers = postsSheet.getRange(1, 1, 1, postsSheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf('status') + 1;

  if (statusCol === 0) {
    ui.alert('status列が見つかりません');
    return;
  }

  let updatedCount = 0;
  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const currentStatus = postsSheet.getRange(row, statusCol).getValue();
    if (currentStatus === 'DRAFT') {
      postsSheet.getRange(row, statusCol).setValue('READY');
      updatedCount++;
    }
  }

  ui.alert(updatedCount + '件をREADYに変更しました');
}
```

### チェックポイント

- [ ] onOpen関数を更新した
- [ ] setSelectedToReady関数を追加した
- [ ] コードを保存した

---

## セクション5: 動作確認

### Step 1: アイデアのステータスをADOPTEDに変更

1. ideasシートを開く
2. 採用したいアイデアの行のstatus列を「ADOPTED」に変更

### Step 2: 投稿を作成

1. メニューの「X投稿管理」→「ADOPTEDから投稿作成」をクリック
2. 「X件の投稿を作成しました」と表示される

### Step 3: 結果を確認

**postsシート**:

| post_id | idea_id | status | tweet_count | posted_at | tweet_url |
|---------|---------|--------|-------------|-----------|-----------|
| POST-001 | IDEA-001 | DRAFT | 7 | | |

**thread_draftシート**:

| post_id | tweet_1 | tweet_2 | tweet_3 | tweet_4 | tweet_5 | tweet_6 | tweet_7 |
|---------|---------|---------|---------|---------|---------|---------|---------|
| POST-001 | | | | | | | |

### Step 4: スレッド内容を入力

thread_draftシートのtweet_1〜tweet_7に内容を入力します。

### Step 5: ステータスをREADYに変更

1. postsシートを開く
2. 準備完了した行を選択
3. メニューの「X投稿管理」→「選択行をREADYに変更」をクリック

### チェックポイント

- [ ] ideasのstatusをADOPTEDに変更した
- [ ] 「ADOPTEDから投稿作成」を実行した
- [ ] postsとthread_draftにデータが追加された
- [ ] thread_draftにスレッド内容を入力した
- [ ] postsのstatusをREADYに変更した

---

## トラブルシューティング

### 「ADOPTEDのアイデアがありません」と表示される

**原因**: ideasシートにstatus=ADOPTEDの行がない

**解決方法**: ideasシートでアイデアのstatus列を「ADOPTED」に変更してから実行してください。

### 「postsシートで実行してください」と表示される

**原因**: 別のシートでsetSelectedToReadyを実行した

**解決方法**: postsシートに移動してから実行してください。

### thread_draftにデータが追加されない

**原因**: thread_draftシートの名前が違う

**解決方法**: シート名が「thread_draft」（アンダースコア）になっているか確認してください。

---

## まとめ

### このモジュールで学んだこと

- ideasからposts/thread_draftへの振り分けフロー
- GASで複数シートを連携する方法
- カスタムメニューの拡張方法
- ステータス管理の実装

### 次のステップ

次のモジュールでは、n8nワークフローを作成し、READYのpostsをPython APIサーバー経由でXに投稿します。

---

## よくある質問

**Q: 7ツイート以外の構成にできますか？**
A: はい、tweet_count列とthread_draftの列を調整すれば対応できます。

**Q: スレッド内容をAIで自動生成できますか？**
A: GASからGemini APIを呼び出すことで可能です。ただし、品質を確認してからREADYにすることを推奨します。

**Q: 一度READYにしたものをDRAFTに戻せますか？**
A: はい、postsシートのstatus列を直接「DRAFT」に変更してください。

**Q: 複数のアイデアを一度に採用できますか？**
A: はい、ideasシートで複数行のstatusをADOPTEDに変更してから「ADOPTEDから投稿作成」を実行してください。

**Q: 投稿作成後にideasのstatusがPOSTEDになるのはなぜ？**
A: 同じアイデアから重複して投稿を作成しないためです。ADOPTEDのままだと再度「ADOPTEDから投稿作成」を実行した際に重複登録されます。

---

## 参考資料

- [Google Apps Script リファレンス - Range クラス](https://developers.google.com/apps-script/reference/spreadsheet/range)
- [Google Apps Script リファレンス - Sheet クラス](https://developers.google.com/apps-script/reference/spreadsheet/sheet)
