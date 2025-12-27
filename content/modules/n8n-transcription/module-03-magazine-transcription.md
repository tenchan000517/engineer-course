# 雑誌インタビュー文字起こしワークフロー

**所要時間**: 60分
**難易度**: ⭐⭐⭐⭐☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- Google Sheetsからフォルダ情報を取得してワークフローを動的に制御する方法
- シートURL行からフォルダIDを抽出する方法
- ffmpeg + Whisper.cppでM4Aファイルを文字起こしする方法
- Gemini AIで文字起こし結果を整形する方法
- 処理結果をGoogle Sheetsに書き戻す方法
- 躓きやすいポイントと正しい設定方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- シートベースで動的にフォルダを切り替えるワークフローを構築できる
- 複数カテゴリを順番に処理するループ処理を実装できる
- スキップ判定で既存ファイルを二重処理しない仕組みを作れる
- 処理完了後にシートのステータスを自動更新できる

---

## 目次

- [セクション1: ワークフローの全体設計](#セクション1-ワークフローの全体設計)
- [セクション2: シートからフォルダURLを取得](#セクション2-シートからフォルダurlを取得)
- [セクション3: 音声ファイルの取得とスキップ判定](#セクション3-音声ファイルの取得とスキップ判定)
- [セクション4: ffmpeg + Whisperで文字起こし](#セクション4-ffmpeg--whisperで文字起こし)
- [セクション5: Geminiで整形](#セクション5-geminiで整形)
- [セクション6: Google Driveアップロード](#セクション6-google-driveアップロード)
- [セクション7: Google Sheetsステータス更新](#セクション7-google-sheetsステータス更新)
- [セクション8: 全体テスト](#セクション8-全体テスト)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- [Whisper.cpp セットアップ](./module-01-whisper-setup.md)完了済み
- [文字起こしワークフローの構築](./module-02-transcription-workflow.md)完了済み（基本的な文字起こしワークフローの理解）
- Google Sheetsに進捗管理シートが存在
- 各カテゴリに「録音データ」「文字起こし」「原稿」フォルダが存在

### シート構造の確認

対象シートは以下の構造を持っています：

| 列 | 内容 |
|----|------|
| A列 | カテゴリ（例: A. メインインタビュー） |
| B列 | 対象名 |
| D列 | 録音データ（URL行にフォルダURL） |
| Y列 | 文字起こしステータス（URL行にフォルダURL） |
| Z列 | 原稿ステータス（URL行にフォルダURL） |

行構造（2行で1カテゴリ）:
- チェック行: カテゴリ名あり、ステータス値あり
- URL行: カテゴリ名なし、フォルダURLあり

---

## セクション1: ワークフローの全体設計

### 処理フロー

```
[Form Trigger] - 月号入力
    |
[Get Sheet Data] - シートからデータ取得
    |
[Extract Folder IDs] - URL行からフォルダID抽出
    |
[Loop Categories] - カテゴリごとに処理
    |
[Get Audio Files] - 録音フォルダから音声取得
    |
[Filter and Prepare] - 音声ファイルのフィルタ
    |
[Check Existing] - 既存ファイルチェック（スキップ判定）
    |
[Download Audio] - 音声ダウンロード
    |
[ffmpeg + Whisper] - WAV変換 + 文字起こし
    |
[Gemini] - AIで整形
    |
[Upload Raw] + [Upload Organized] - 2つのフォルダにアップロード
    |
[Update Status] - シートのステータス更新
    |
[Loop Categories] - 次のカテゴリへ
```

### チェックポイント

- [ ] ワークフローの全体像を理解した
- [ ] 2行で1カテゴリの構造を理解した

---

## セクション2: シートからフォルダURLを取得

### Step 1: Form Triggerを追加

1. 新規ワークフロー「雑誌インタビュー文字起こし」を作成
2. Form Triggerノードを追加
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Form Title | 文字起こし実行 |
| Form Fields | 月号（placeholder: 202601） |

### Step 2: Google Sheetsノードを追加

Google Sheetsノードを追加:
- Action: Get row(s) in sheet
- Document: By ID → シートID
- Sheet: By Name → `={{ $json['月号'] }}`

ノード名を「Get Sheet Data」に変更します。

### 躓きポイント1: シート名の指定モード

```
間違い: mode: "id"
正解: mode: "name"
```

シート名（タブ名）を動的に指定する場合は `mode: "name"` を使用します。

### Step 3: フォルダID抽出ノードを追加

Codeノードを追加し、ノード名を「Extract Folder IDs from URLs」に変更:

```javascript
// シートデータからインタビュー系カテゴリの情報を抽出
const rows = $input.all();
const monthCode = $('Form Trigger').first().json['月号'];
const categories = [];

// インタビュー系カテゴリのインデックス（0始まり）
const interviewCatIndices = [0, 2, 3, 4, 6]; // A, H, I, K, C
const catNames = ['A', 'H', 'I', 'K', 'C'];
const catLabels = ['A. メインインタビュー', 'H. STAR①', 'I. STAR②', 'K. ハイスクール企画', 'C. 新規企業'];

interviewCatIndices.forEach((catIdx, i) => {
  const checkRowIdx = catIdx * 2;      // チェック行
  const urlRowIdx = catIdx * 2 + 1;    // URL行

  if (urlRowIdx >= rows.length) return;

  const urlRow = rows[urlRowIdx].json;

  // URL行からフォルダURLを取得
  const recordingUrl = urlRow['録音データ'] || '';
  const transcriptionUrl = urlRow['文字起こしステータス'] || '';
  const manuscriptUrl = urlRow['原稿ステータス'] || '';

  // URLからフォルダIDを抽出
  const extractId = (url) => {
    if (!url) return null;
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const recordingFolderId = extractId(recordingUrl);
  const transcriptionFolderId = extractId(transcriptionUrl);
  const manuscriptFolderId = extractId(manuscriptUrl);

  // 必要な情報が揃っている場合のみ追加
  if (recordingFolderId && transcriptionFolderId) {
    categories.push({
      json: {
        category: catNames[i],
        categoryLabel: catLabels[i],
        recordingFolderId: recordingFolderId,
        transcriptionFolderId: transcriptionFolderId,
        manuscriptFolderId: manuscriptFolderId,
        monthCode: monthCode
      }
    });
  }
});

return categories;
```

### チェックポイント

- [ ] Form Triggerを追加した
- [ ] Get Sheet Dataを追加した（mode: "name" を確認）
- [ ] Extract Folder IDsを追加した

---

## セクション3: 音声ファイルの取得とスキップ判定

### Step 4: Loop Over Itemsを追加

1. Ifノードで `$input.all().length > 0` をチェック
2. Loop Over Items（Split In Batches）ノードを追加

### Step 5: Google Driveノードを追加

Google Driveノードを追加:
- Action: Search files and folders
- Folder: By ID → `={{ $json.recordingFolderId }}`

ノード名を「Get Audio Files」に変更します。

### 躓きポイント2: Google Driveのフォルダ内検索

```
間違い:
{
  "resource": "fileFolder",
  "operation": "search",
  "queryString": "=\"folderId\" in parents"
}

正解:
{
  "resource": "fileFolder",
  "filter": {
    "folderId": {
      "__rl": true,
      "value": "={{ $json.recordingFolderId }}",
      "mode": "id"
    }
  }
}
```

ポイント:
- `operation: "search"` は使わない
- `filter.folderId` でフォルダを指定する
- `queryString` は名前検索用（オプション）

### Step 6: Filter and Prepareノードを追加

Codeノードを追加し、ノード名を「Filter and Prepare」に変更:

```javascript
// 音声ファイルのフィルタ + ファイル名生成
const categoryInfo = $('Loop Categories').first().json;
const files = $input.all();

const audioExtensions = ['.m4a', '.mp3', '.wav', '.mp4', '.webm', '.ogg'];

const audioFiles = files.filter(item => {
  const name = (item.json.name || '').toLowerCase();
  return audioExtensions.some(ext => name.endsWith(ext));
});

if (audioFiles.length === 0) {
  return [];
}

const audioFile = audioFiles[0].json;
const baseName = audioFile.name.replace(/\.[^/.]+$/, '');
const txtFileName = baseName + '.txt';

return [{
  json: {
    id: audioFile.id,
    name: audioFile.name,
    category: categoryInfo.category,
    categoryLabel: categoryInfo.categoryLabel,
    transcriptionFolderId: categoryInfo.transcriptionFolderId,
    manuscriptFolderId: categoryInfo.manuscriptFolderId,
    monthCode: categoryInfo.monthCode,
    baseName: baseName,
    txtFileName: txtFileName
  }
}];
```

### Step 7: スキップ判定を追加

1. Google Driveノードを追加:
   - Action: Search files and folders
   - Query String: `={{ $json.txtFileName }}`
   - Folder: By ID → `={{ $json.transcriptionFolderId }}`

2. Codeノードで正確な名前一致を判定:

```javascript
// 存在チェック
const fileInfo = $('If Has Audio').first().json;
const searchResults = $input.all();

const exactMatch = searchResults.find(r => r.json.name === fileInfo.txtFileName);

return [{
  json: {
    ...fileInfo,
    alreadyExists: exactMatch ? true : false
  }
}];
```

3. Ifノードで `alreadyExists === true` ならスキップ

### チェックポイント

- [ ] Loop Categoriesを追加した
- [ ] Get Audio Filesを追加した（filter.folderId を使用）
- [ ] スキップ判定を追加した

---

## セクション4: ffmpeg + Whisperで文字起こし

### Step 8: Download Audioを追加

Google Driveノードを追加:
- Action: Download file
- File: By ID → `={{ $json.id }}`

ノード名を「Download Audio」に変更します。

### Step 9: Save Audioを追加

Read/Write Fileノードを追加:
- Operation: Write
- File Name: `/tmp/{{ $('If Already Exists').item.json.baseName }}.audio`
- Property Name: data

### Step 10: Execute Whisperを追加

Execute Commandノードを追加します。

### 躓きポイント3: Whisper.cppはWAVのみ対応

```
間違い: M4Aファイルを直接whisper-cliに渡す
→ 結果: エラーまたは無音として処理される

正解: ffmpegでWAVに変換してからwhisper-cliに渡す
```

正しいコマンド:

```bash
ffmpeg -y -i "/tmp/{{ baseName }}.audio" -ar 16000 -ac 1 -c:a pcm_s16le "/tmp/{{ baseName }}.wav" && /opt/whisper.cpp/build/bin/whisper-cli -m /opt/whisper.cpp/models/ggml-base.bin -l ja -otxt -of "/tmp/{{ baseName }}" "/tmp/{{ baseName }}.wav"
```

ffmpegオプションの説明:

| オプション | 説明 |
|-----------|------|
| `-y` | 上書き確認なし |
| `-ar 16000` | サンプルレート 16kHz（Whisper推奨） |
| `-ac 1` | モノラル |
| `-c:a pcm_s16le` | 16bit PCM（WAV標準） |

ファイル名にスペースが含まれる場合に備えて、パスは必ずダブルクォートで囲みます。

### チェックポイント

- [ ] Download Audioを追加した
- [ ] Save Audioを追加した
- [ ] Execute Whisperを追加した（ffmpeg変換込み）

---

## セクション5: Geminiで整形

### Step 11: Read Whisper Outputを追加

Read/Write Fileノードを追加:
- Operation: Read
- File Path: `/tmp/{{ $('If Already Exists').item.json.baseName }}.txt`

### Step 12: Prepare for Geminiを追加

Codeノードを追加:

```javascript
// Whisper出力をテキストに変換
const fileInfo = $('If Already Exists').item.json;
const whisperOutput = $input.first().json.data;

let rawText = '';
if (typeof whisperOutput === 'string') {
  rawText = whisperOutput;
} else if (Buffer.isBuffer(whisperOutput)) {
  rawText = whisperOutput.toString('utf-8');
} else {
  const binaryData = $input.first().binary?.data;
  if (binaryData) {
    rawText = Buffer.from(binaryData.data, 'base64').toString('utf-8');
  }
}

return [{
  json: {
    ...fileInfo,
    rawTranscription: rawText
  }
}];
```

### Step 13: Geminiノードを追加

Google Geminiノードを追加:
- Model: models/gemini-2.5-flash
- Message: 下記プロンプト

プロンプト例:

```
【基本指示】
あなたは雑誌記事の編集者です。以下の文字起こしテキストを、記事として読みやすく整理してください。

【必須ルール】
1. 捏造・追加の禁止: 文字起こしにない内容は絶対に追加しない
2. 削除・整理のみ可: 不要な部分の削除、順番の整理、表現の改善のみ実施
3. マークダウン記法の禁止: プレーンテキストで出力

【整理の要点】
・質問は「― 」で始める（全角ダッシュ + 半角スペース）
・回答は質問の後に改行して段落で記載（マーク不要）
・話し言葉→書き言葉への変換
・重複表現の削除
・固有名詞や専門用語で誤りがある場合は【要確認】マークを付ける

【文字起こしテキスト】
{{ $json.rawTranscription }}
```

### チェックポイント

- [ ] Read Whisper Outputを追加した
- [ ] Prepare for Geminiを追加した
- [ ] Geminiノードを追加した

---

## セクション6: Google Driveアップロード

### Step 14: Prepare Uploadを追加

Codeノードを追加:

```javascript
// 両方のテキストをバイナリに変換
const fileInfo = $input.first().json;
const rawText = fileInfo.rawTranscription;
const organizedText = fileInfo.organizedText;

const rawBuffer = Buffer.from(rawText, 'utf-8');
const organizedBuffer = Buffer.from(organizedText, 'utf-8');

return [{
  json: fileInfo,
  binary: {
    rawTextData: {
      data: rawBuffer.toString('base64'),
      mimeType: 'text/plain',
      fileName: fileInfo.txtFileName
    },
    organizedTextData: {
      data: organizedBuffer.toString('base64'),
      mimeType: 'text/plain',
      fileName: fileInfo.txtFileName
    }
  }
}];
```

### Step 15: Upload Raw（文字起こし）を追加

Google Driveノードを追加:
- Action: Upload file
- File Name: `={{ $json.txtFileName }}`
- Parent Folder: By ID → `={{ $json.transcriptionFolderId }}`
- Input Binary Field: rawTextData

### Step 16: Upload Organized（原稿）を追加

Google Driveノードを追加:
- Action: Upload file
- File Name: `={{ $json.txtFileName }}`
- Parent Folder: By ID → `={{ $json.manuscriptFolderId }}`
- Input Binary Field: organizedTextData

### チェックポイント

- [ ] Prepare Uploadを追加した
- [ ] Upload Raw（文字起こし）を追加した
- [ ] Upload Organized（原稿）を追加した

---

## セクション7: Google Sheetsステータス更新

### 躓きポイント4: Google Sheets Updateノードの設定

これが最も躓きやすいポイントです。

```
間違い:
{
  "columns": {
    "mappingMode": "defineBelow",
    "value": {...},
    "matchingColumns": ["カテゴリ"]
  }
}
→ エラー: "Could not get parameter columns.matchingColumns"
→ エラー: "No columns found in Google Sheets"

正解:
{
  "columns": {
    "mappingMode": "defineBelow",
    "value": {...},
    "matchingColumns": ["カテゴリ"],
    "schema": [...],  // ← これが必須
    "attemptToConvertTypes": false,
    "convertFieldsToString": true
  }
}
```

### Step 17: Log Completeを追加

Codeノードを追加:

```javascript
// 完了ログ + ステータス更新用データ準備
const fileInfo = $('Prepare for Gemini').first().json;
return [{
  json: {
    ...fileInfo,
    completed: true,
    statusToSet: '完了'
  }
}];
```

### Step 18: Update Status (Complete)を追加

Google Sheetsノードを追加:
- Action: Update row in sheet
- Document: By ID → シートID
- Sheet: By Name → `={{ $json.monthCode }}`

columns設定（JSON）:

```json
{
  "mappingMode": "defineBelow",
  "value": {
    "カテゴリ": "={{ $json.categoryLabel }}",
    "文字起こしステータス": "={{ $json.statusToSet }}",
    "原稿ステータス": "={{ $json.statusToSet }}"
  },
  "matchingColumns": ["カテゴリ"],
  "schema": [
    {
      "id": "カテゴリ",
      "displayName": "カテゴリ",
      "required": false,
      "defaultMatch": true,
      "display": true,
      "type": "string",
      "canBeUsedToMatch": true
    },
    {
      "id": "文字起こしステータス",
      "displayName": "文字起こしステータス",
      "required": false,
      "defaultMatch": false,
      "display": true,
      "type": "string",
      "canBeUsedToMatch": false
    },
    {
      "id": "原稿ステータス",
      "displayName": "原稿ステータス",
      "required": false,
      "defaultMatch": false,
      "display": true,
      "type": "string",
      "canBeUsedToMatch": false
    }
  ],
  "attemptToConvertTypes": false,
  "convertFieldsToString": true
}
```

### schemaフィールドの説明

| プロパティ | 説明 |
|-----------|------|
| `id` | 列名（シートの1行目のヘッダー） |
| `displayName` | 表示名 |
| `defaultMatch` | マッチングキーとしてデフォルト使用 |
| `canBeUsedToMatch` | マッチングに使用可能か |
| `type` | データ型（string, number等） |

n8n v4.7のGoogle Sheetsノードでは、UIからスキーマを取得する設計になっています。JSONで直接ワークフローを作成する場合、このスキーマ情報を手動で追加する必要があります。

### チェックポイント

- [ ] Log Completeを追加した
- [ ] Update Status (Complete)を追加した
- [ ] schema フィールドを追加した
- [ ] ループ接続を完成した

---

## セクション8: 全体テスト

### テスト手順

1. ワークフローを保存
2. ワークフローをActivate
3. Form TriggerのURLにアクセス
4. 月号（例: 202601）を入力して送信
5. 実行ログを確認

### チェックポイント

- [ ] シートデータが正しく読み込まれた
- [ ] フォルダIDが正しく抽出された
- [ ] 音声ファイルが取得された
- [ ] スキップ判定が正しく動作した
- [ ] ffmpeg + Whisperで文字起こしが成功した
- [ ] Geminiで整形された
- [ ] 2つのフォルダにアップロードされた
- [ ] シートのステータスが「完了」に更新された

---

## トラブルシューティング

### エラー: "Could not get parameter columns.matchingColumns"

**原因**: Google Sheets Updateノードに `schema` フィールドがない

**解決**: セクション7の完全なcolumns設定を使用

### エラー: "No columns found in Google Sheets"

**原因**: 同上、または列名がシートと一致していない

**解決**: シートの実際の列名を確認し、schemaの `id` と一致させる

### Whisperが一瞬で終わる / 出力が空

**原因**:
- M4AをWAVに変換していない
- 前回のファイルが残っている

**解決**:
```bash
docker exec -it n8n rm -f /tmp/*.audio /tmp/*.wav /tmp/*.txt
```

### ffmpegでエラーが出る

**原因**: ファイル名にスペースが含まれている

**解決**: パスをダブルクォートで囲む
```bash
ffmpeg -y -i "/tmp/file name.audio" ...
```

### Google Driveで "query is not valid"

**原因**: `operation: "search"` + `queryString` を使っている

**解決**: `filter.folderId` を使う（セクション3参照）

### シート名でエラーが出る

**原因**: `mode: "id"` を使っている

**解決**: `mode: "name"` に変更

---

## まとめ

### このモジュールで学んだこと

1. シートベースの動的ワークフロー: URL行からフォルダIDを抽出
2. n8n Google Driveの正しい使い方: `filter.folderId` を使う
3. Whisper.cppの制限: WAVのみ対応、ffmpegで変換が必要
4. Google Sheets Updateの正しい設定: schemaフィールドが必須

### 躓きポイント一覧

| 問題 | 原因 | 解決 |
|------|------|------|
| シート名エラー | mode: "id" | mode: "name" |
| Drive検索エラー | operation: "search" | filter.folderId |
| Whisper出力が空 | M4A非対応 | ffmpegでWAV変換 |
| Sheets Updateエラー | schemaがない | schema追加 |

### 次のステップ

- Schedule Triggerを追加して定期実行する
- 処理完了をSlackやメールで通知する
- 複数ファイル対応にループを拡張する

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[magazine-transcription.json](/n8n-transcription/download/magazine-transcription.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_GOOGLE_SHEET_ID` | 進捗管理シートのID |
| `YOUR_SHEETS_CREDENTIAL_ID` | Google Sheets認証情報を再設定 |
| `YOUR_DRIVE_CREDENTIAL_ID` | Google Drive認証情報を再設定 |
| `YOUR_GEMINI_CREDENTIAL_ID` | Gemini API認証情報を再設定 |

各ノードを開いて、Credential to connect withから自分の認証情報を選択してください。

---

## 参考資料

- [n8n Google Sheets Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [n8n Google Drive Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/)
- [Whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

---

## よくある質問

**Q: なぜfaster-whisperではなくwhisper.cppを使うのですか？**

A: n8nのDockerコンテナはAlpine Linuxベースで、faster-whisper（Python）はAlpine + Python 3.12環境でビルドに失敗します。whisper.cpp（C++）はAlpineで問題なく動作します。

**Q: schemaフィールドはUIから設定できないのですか？**

A: UIで一度シートに接続すると自動的に取得されます。JSONでインポートする場合は手動で追加が必要です。

**Q: 複数の音声ファイルがあるカテゴリはどう処理されますか？**

A: 現在の実装では最初の1ファイルのみ処理します。複数ファイル対応が必要な場合は、Filter and Prepareノードの `audioFiles[0]` を全ファイルループに変更してください。

**Q: 処理速度を上げるには？**

A: Whisperコマンドに `-t 8` を追加してスレッド数を増やす、またはより小さいモデル `ggml-tiny.bin` を使用します（精度は下がる）。

**Q: Google SheetsのUpdate操作で他の列が消えてしまいます**

A: schemaに指定した列のみが更新対象になります。更新したくない列はschemaに含めないでください。
