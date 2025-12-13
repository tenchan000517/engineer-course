# 音声合成ワークフロー最適化 - ナレーション統合とフォルダ名対応

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- ナレーション1と2を統合して1回のAPI呼び出しで音声生成する方法
- フォルダ名の命名規則をカスタマイズする方法
- ffmpegコマンドの簡略化
- API呼び出し回数削減によるコスト最適化

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Codeノードで複数のテキストを連結できる
- Set Folder Namesノードのフォルダ名生成ロジックを変更できる
- ffmpegコマンドのadelayパラメータを理解できる
- Fish Audio APIの呼び出し回数を最適化できる

---

## 目次

- [セクション1: 最適化の概要](#セクション1-最適化の概要)
- [セクション2: ナレーション統合ノードの追加](#セクション2-ナレーション統合ノードの追加)
- [セクション3: Generate Audioノードの修正](#セクション3-generate-audioノードの修正)
- [セクション4: フォルダ名の形式変更](#セクション4-フォルダ名の形式変更)
- [セクション5: ffmpegコマンドの簡略化](#セクション5-ffmpegコマンドの簡略化)
- [セクション6: 不要ノードの削除](#セクション6-不要ノードの削除)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 02（後編）完了済み
- 音声合成advancedワークフローが動作している状態
- 投稿用BGM（Sunoで作成推奨）

### BGMの準備（Suno）

動画には投稿内容に合ったBGMを用意します。[Suno](https://suno.com/)を使うと、プロンプトを入力するだけでオリジナルBGMを生成できます。

**Sunoでの作成手順**:

1. [Suno](https://suno.com/)にアクセス
2. 「Create」をクリック
3. **Instrumental をオンにする**（重要：ボーカルなしのBGMにする）
4. プロンプトを入力して生成

**プロンプト例**（AIツール比較・テック系投稿向け）:

```
Lo-fi tech background music,
soft electronic beats,
educational and informative tone,
calm but engaging,
modern startup vibe,
60 seconds
```

別パターン（より落ち着いた雰囲気）:

```
Chill electronic background,
gentle synth melody,
tech tutorial atmosphere,
approachable and warm,
not too energetic,
60 seconds
```

**ポイント**:
- Instrumental を必ずオンにする（ナレーションと被らないように）
- 教育系・情報提供型なので落ち着いた雰囲気が合う
- 60秒程度の長さを指定すると使いやすい
- 複数パターン生成して、一番合うものを選ぶ

### 前提知識

- n8nのCodeノードの基本的な使い方
- ffmpegのadelayパラメータの概念

### Canvaダウンロード設定（重要）

Canvaから動画をダウンロードする際、以下の設定を正確に行わないとワークフローが動作しません。

ダウンロード時に「高度なオプション」を開き、以下を設定:

| 設定項目 | 値 | 説明 |
|---------|-----|------|
| 出力 | **6個のデザイン**（個別デザイン） | 「1つのデザインで複数ページを作成」ではなく個別にする |
| 各デザインの名前を選択 | **post_id列のデータ** | ファイル名がPOST-2025121108-015のような形式になる |
| 新しいフォルダーの名前 | **20251213投稿A**（年月日+投稿+カテゴリ） | ワークフローのフォルダ検索と一致させる |

Canvaダウンロード設定画面:

![Canvaダウンロード設定](/n8n-advanced/module-08-canva-download-settings.png)

**注意**: これらの設定を間違えると、ワークフローで動画が検索できません。

- 「1つのデザインで複数ページを作成」を選ぶと、ファイル名が連番になる
- post_id列以外を選ぶと、ファイル名がワークフローで検索できない形式になる
- フォルダ名がSet Folder Namesの出力と異なると、フォルダが見つからない

---

## セクション1: 最適化の概要

### 現在のワークフローの問題点

Module 02で作成した音声合成ワークフローには、以下の非効率な点があります：

| 問題 | 詳細 |
|------|------|
| API呼び出し2回 | narration_1とnarration_2を別々に音声生成 |
| Wait 5sが必要 | API呼び出し間の待機時間 |
| ffmpegが複雑 | 2つの音声を別々の位置に配置 |
| 継ぎ目の問題 | 前半30秒固定で後半開始位置を決定 |

### 最適化後の改善点

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| Fish Audio API | 2回呼び出し | 1回呼び出し |
| Wait 5s | 必要 | 不要 |
| ffmpegコマンド | 2音声を別位置に配置 | 1音声を3秒後に配置 |
| 音声の継ぎ目 | 固定位置で継ぎ目あり | 自然に連結 |

### チェックポイント

- [ ] 現在のワークフローの問題点を理解した
- [ ] 最適化による改善内容を理解した

---

## セクション2: ナレーション統合ノードの追加

### Step 1: Merge Narrationsノードを追加

Download fileとGenerate Audioの間に、ナレーションを統合するCodeノードを追加します。

1. Download fileノードの出力から「+」をクリック
2. 「Code」を検索して追加
3. ノード名を「Merge Narrations」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Mode | Run Once for Each Item |
| Language | JavaScript |

5. **JavaScript**:

```javascript
// narration_1とnarration_2を改行で連結
const item = $('Loop Over Items').item.json;
const narration1 = item.narration_1 || '';
const narration2 = item.narration_2 || '';
const mergedNarration = narration1 + '\n' + narration2;

return [{
  json: {
    ...item,
    narration: mergedNarration
  },
  pairedItem: { item: 0 }
}];
```

**ポイント**:
- 改行（`\n`）で連結することで、Fish Audioが自然な間を入れて読み上げます
- `pairedItem: { item: 0 }` は後続ノードが `$('Loop Over Items').item` を参照できるようにするために必須です

### チェックポイント

- [ ] Merge Narrationsノードを追加した
- [ ] narration_1とnarration_2が改行で連結される

---

## セクション3: Generate Audioノードの修正

### Step 2: Generate Audioノードを修正

統合されたナレーションを使用するように修正します。

1. Generate Audio 1ノードをダブルクリック
2. ノード名を「Generate Audio」に変更
3. **JSON Body**を以下に変更:

```json
={{ JSON.stringify({ text: $('Merge Narrations').item.json.narration, reference_id: 'YOUR_VOICE_ID' }) }}
```

**変更点**:
- `$('Loop Over Items').item.json.narration_1` → `$('Merge Narrations').item.json.narration`

### Step 3: Save Audioノードを修正

ファイル名を変更します。

1. Save Audio 1ノードをダブルクリック
2. ノード名を「Save Audio」に変更
3. **File Name**を変更:

| 設定項目 | 変更前 | 変更後 |
|---------|--------|--------|
| File Name | `/tmp/audio1.mp3` | `/tmp/audio.mp3` |

4. **Data Property Name**を変更:

```
={{ $('Generate Audio').first().binary.data }}
```

### チェックポイント

- [ ] Generate AudioがMerge Narrationsのnarrationを参照している
- [ ] Save Audioのファイル名が`/tmp/audio.mp3`になっている

---

## セクション4: フォルダ名の形式変更

### Step 4: Set Folder Namesノードを修正

Google Driveのフォルダ名の命名規則に合わせて修正します。

1. Set Folder Namesノードをダブルクリック
2. **JavaScript**を以下に変更:

```javascript
// フィルタ済みデータを取得
const items = $('Filter NORMAL and Add Category').all();

if (items.length === 0) {
  return [];
}

// 最初のアイテムからcategoryを取得
const category = items[0].json.category;

// 年月日を生成
const now = new Date();
const yearMonthDay = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');

// フォルダ名を生成（1件だけ返す - フォルダ検索用）
const folderName = `${yearMonthDay}投稿${category}`;
const archiveFolderName = `${yearMonthDay}投稿${category}_archive`;

return [{
  json: {
    folder_name: folderName,
    archive_folder_name: archiveFolderName,
    category: category
  }
}];
```

### 変更点の詳細

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| 日付形式 | `yearMonth`（202512） | `yearMonthDay`（20251213） |
| フォルダ名 | `202512Instagram投稿A` | `20251213投稿A` |
| アーカイブ | `202512Instagram投稿A_archive` | `20251213投稿A_archive` |

**注意**: Google Driveに作成するフォルダ名もこの形式に合わせてください。

### チェックポイント

- [ ] 年月日形式（YYYYMMDD）でフォルダ名が生成される
- [ ] Google Driveのフォルダ名と一致している

### Instagram投稿ワークフローでの設定

Instagram Reel投稿ワークフロー（Instagram Reel from Drive）を使用している場合は、**Get Category from Pattern** ノードでも同じフォルダ名形式に変更してください。

1. Get Category from Patternノードをダブルクリック
2. **JavaScript**の以下の部分を変更:

**変更前**:
```javascript
// フォルダ名を生成（例: 202512Instagram投稿A）
const now = new Date();
const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
const folderName = `${yearMonth}Instagram投稿${category}`;
```

**変更後**:
```javascript
// フォルダ名を生成（例: 20251213投稿A）
const now = new Date();
const yearMonthDay = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
const folderName = `${yearMonthDay}投稿${category}`;
```

Get Category from Pattern ノードの設定画面:

![Get Category from Pattern設定](/n8n-advanced/module-08-get-category-pattern.png)

**重要**: 音声合成ワークフローとInstagram投稿ワークフローの両方で、フォルダ名の形式を統一してください。

---

## セクション5: ffmpegコマンドの簡略化

### Step 5: Execute Commandノードを修正

2つの音声を配置する複雑なコマンドから、1つの音声を3秒後に配置するシンプルなコマンドに変更します。

1. Execute Commandノードをダブルクリック
2. **Command**を以下に変更:

```
=ffmpeg -y -i /tmp/video.mp4 -i /tmp/audio.mp3 -filter_complex '[1:a]adelay=3000|3000[aout]' -map 0:v -map '[aout]' -c:v copy -c:a aac /tmp/output.mp4
```

### コマンドの解説

| パラメータ | 説明 |
|-----------|------|
| `-i /tmp/video.mp4` | 入力動画 |
| `-i /tmp/audio.mp3` | 入力音声（統合済み） |
| `adelay=3000\|3000` | 3秒（3000ms）遅延で開始 |
| `-c:v copy` | 動画は再エンコードなし |
| `-c:a aac` | 音声はAAC形式 |

### 変更前後の比較

**変更前**（2音声を別位置に配置）:
```
ffmpeg -y -i /tmp/video.mp4 -i /tmp/audio1.mp3 -i /tmp/audio2.mp3 -filter_complex '[1:a]adelay=0|0[a1];[2:a]adelay=30000|30000[a2];[a1][a2]amix=inputs=2[aout]' -map 0:v -map '[aout]' -c:v copy -c:a aac /tmp/output.mp4
```

**変更後**（1音声を3秒後に配置）:
```
ffmpeg -y -i /tmp/video.mp4 -i /tmp/audio.mp3 -filter_complex '[1:a]adelay=3000|3000[aout]' -map 0:v -map '[aout]' -c:v copy -c:a aac /tmp/output.mp4
```

### チェックポイント

- [ ] ffmpegコマンドが1音声入力に変更された
- [ ] adelayが3000（3秒）に設定されている

---

## セクション6: 不要ノードの削除

### Step 6: 不要になったノードを削除

以下のノードは不要になったため削除します。

| 削除するノード | 理由 |
|---------------|------|
| Wait 5s | API呼び出しが1回になったため不要 |
| Generate Audio 2 | ナレーション統合により不要 |
| Save Audio 2 | 音声ファイルが1つになったため不要 |

### 削除手順

1. 各ノードを選択
2. Deleteキーまたは右クリック → Delete

### 接続の修正

削除後、以下の順序で接続されていることを確認:

```
Download file → Merge Narrations → Generate Audio → Save Video → Save Audio → Execute Command
```

### チェックポイント

- [ ] Wait 5s、Generate Audio 2、Save Audio 2を削除した
- [ ] ノードの接続が正しく修正されている

---

## トラブルシューティング

### フォルダが見つからない

**症状**: Search Category Folderで動画が見つからず、全てスキップされる

**原因**: ワークフローが検索するフォルダ名とGoogle Driveのフォルダ名が一致していない

**解決方法**:
1. Set Folder Namesノードの出力を確認
2. Google Driveのフォルダ名と完全一致しているか確認
3. 不一致の場合、どちらかを修正

例:
- ワークフロー: `202512Instagram投稿A`
- Google Drive: `20251213投稿A`
- → フォルダ名の形式を統一する

### カテゴリEが選択されて終了する

**症状**: カテゴリA〜Dに処理対象があるのに、カテゴリEのみ処理されて終了

**原因**: カテゴリA〜Dのシートに`audio_status = NORMAL`のレコードがない

**解決方法**:
1. 各シート（canva_A〜E）の`audio_status`カラムを確認
2. 処理したいレコードが`NORMAL`になっているか確認
3. 既に`DONE`になっている場合は再処理されない

### Paired item data is unavailable エラー

**症状**: 以下のようなエラーが表示される
```
Paired item data for item from node 'Merge Narrations' is unavailable.
Ensure 'Merge Narrations' is providing the required output.
```

**原因**: Codeノード（Merge Narrations）が新しいアイテムを生成する際に、n8nの「Paired Item」情報を保持していない。これにより、後続のノードが `$('Loop Over Items').item` でアイテムを追跡できなくなる。

**解決方法**: Merge Narrationsノードのコードに `pairedItem: { item: 0 }` を追加する

**修正前**:
```javascript
return [{
  json: {
    ...item,
    narration: mergedNarration
  }
}];
```

**修正後**:
```javascript
return [{
  json: {
    ...item,
    narration: mergedNarration
  },
  pairedItem: { item: 0 }
}];
```

**解説**: `pairedItem: { item: 0 }` は「この出力アイテムは入力アイテム0から派生した」ことをn8nに伝えます。Split In Batchesは1件ずつ処理するため、常に `item: 0` で問題ありません。

### ネストされたループの注意点

このワークフローはLoop Sheets（外部ループ）とLoop Over Items（内部ループ）のネストされた構造です。

**重要**: 内部ループ（Loop Over Items）の「done」出力を外部ループ（Loop Sheets）の入力に接続**しない**でください。接続すると無限ループが発生します。

**正しい構造**:
```
Loop Over Items
├─ Output 0 (done): 何も接続しない
└─ Output 1 (loop): Search Video File に接続
```

内部ループが完了すると、n8nの実行モデルが自動的に外部ループに制御を戻し、次のシートを処理します

---

## まとめ

### このモジュールで学んだこと

- Codeノードで`narration_1 + '\n' + narration_2`を連結する方法
- Set Folder Namesで年月日形式のフォルダ名を生成する方法
- ffmpegのadelayパラメータで音声開始位置を調整する方法
- 不要なノードを削除してワークフローを簡略化する方法

### 最適化の効果

| 項目 | 効果 |
|------|------|
| API呼び出し | 2回 → 1回（50%削減） |
| 処理時間 | Wait 5sが不要に |
| 音声品質 | 継ぎ目なしで自然に |
| 保守性 | ノード数削減で見やすく |

### 次のステップ

- 運用に合わせてフォルダ名の形式をカスタマイズ
- ナレーション開始位置（adelay）を調整

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[音声合成advanced.json](/n8n-advanced/download/音声合成advanced.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_SPREADSHEET_ID` | あなたのスプレッドシートID |
| `YOUR_CANVA_A_GID` 〜 `YOUR_CANVA_E_GID` | 各シートのgID（Sheet ListノードのCodeを編集） |
| `YOUR_PARENT_FOLDER_ID` | Google Driveの親フォルダID |
| `YOUR_VOICE_ID` | Fish AudioのVoice ID |
| `YOUR_GAS_DEPLOY_URL` | GASのデプロイURL |

また、Google Sheets、Google Drive、Fish Audio APIのクレデンシャルを設定してください。

---

## 参考資料

- [Fish Audio API Documentation](https://docs.fish.audio/)
- [FFmpeg Documentation - adelay filter](https://ffmpeg.org/ffmpeg-filters.html#adelay)
- [n8n Code Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)

---

## よくある質問

**Q: ナレーションの間に長い間を入れたい場合はどうすればいいですか？**
A: Merge Narrationsノードで改行を複数入れることで間を調整できます。例: `narration1 + '\n\n\n' + narration2`で3行分の間が入ります。

**Q: 音声開始位置を3秒以外に変更したい場合は？**
A: Execute Commandのadelayパラメータを変更します。例えば5秒後に開始したい場合は`adelay=5000|5000`にします。

**Q: フォルダ名の形式は必ず年月日にする必要がありますか？**
A: いいえ。Google Driveの実際のフォルダ名と一致していれば、任意の形式で構いません。Set Folder Namesノードのロジックを運用に合わせて変更してください。

**Q: 元のワークフロー（2回API呼び出し）に戻したい場合は？**
A: Module 02で作成した元のワークフローをインポートし直してください。または、Merge Narrationsノードを削除してGenerate Audio 1、Generate Audio 2の構成に戻すこともできます。

**Q: BGMと音声を同時に入れたい場合はどうすればいいですか？**
A: ffmpegコマンドを拡張して、動画のBGMを残しつつナレーションを追加できます。ただし、音量バランスの調整が必要になるため、別途モジュールで解説予定です。
