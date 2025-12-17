# 文字起こしワークフローの構築

**所要時間**: 45分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Google Driveから音声ファイルをダウンロードする方法
- Execute Commandノードでwhisper-cliを実行する方法
- 文字起こし結果をGoogle Driveに保存する方法
- ループ処理で複数ファイルを一括処理する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Google Drive内の音声ファイルを自動で文字起こしできる
- 結果をテキストファイルとしてDriveに保存できる
- 複数ファイルを一括で処理できる

---

## 目次

- [セクション1: ワークフローの全体設計](#セクション1-ワークフローの全体設計)
- [セクション2: 新規ワークフローの作成](#セクション2-新規ワークフローの作成)
- [セクション3: Google Driveから音声ファイルを検索](#セクション3-google-driveから音声ファイルを検索)
- [セクション4: ループ処理の設定](#セクション4-ループ処理の設定)
- [セクション5: 音声ファイルのダウンロード](#セクション5-音声ファイルのダウンロード)
- [セクション6: Whisper.cppで文字起こし](#セクション6-whispercppで文字起こし)
- [セクション7: 結果の読み込みとアップロード](#セクション7-結果の読み込みとアップロード)
- [セクション8: 一時ファイルの削除](#セクション8-一時ファイルの削除)
- [セクション9: 全体テスト](#セクション9-全体テスト)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- [Whisper.cpp セットアップ](./module-01-whisper-setup.md)完了済み
- Google Driveに音声ファイル（mp3, wav, m4a等）がアップロード済み
- n8nでGoogle Drive認証が設定済み

### テスト用音声ファイルの準備

Google Driveに「文字起こしテスト」フォルダを作成し、短い音声ファイル（30秒〜1分程度）をアップロードしておいてください。

---

## セクション1: ワークフローの全体設計

### 処理フロー

```
[Manual Trigger]
    |
[Search Audio Files] - Driveから音声ファイルを検索
    |
[Loop Over Items] - 1ファイルずつ処理
    |
[Download File] - 音声ファイルをダウンロード
    |
[Save to Temp] - 一時ファイルとして保存
    |
[Execute Whisper] - whisper-cliで文字起こし
    |
[Read Result] - 結果テキストを読み込み
    |
[Upload to Drive] - テキストファイルをDriveにアップロード
    |
[Clean Up] - 一時ファイルを削除
```

### チェックポイント

- [ ] ワークフローの全体像を理解した

---

## セクション2: 新規ワークフローの作成

### Step 1: ワークフローを作成

1. n8n（http://localhost:5678）を開く
2. 「Create new workflow」をクリック
3. ワークフロー名を「音声文字起こし」に変更

### Step 2: Manual Triggerを追加

キャンバスをクリックして「Manual Trigger」を追加します。

### チェックポイント

- [ ] 新規ワークフロー「音声文字起こし」を作成した
- [ ] Manual Triggerを追加した

---

## セクション3: Google Driveから音声ファイルを検索

### Step 3: Google Driveノードを追加

1. 「+」をクリック → 「Google Drive」を検索して追加
2. ノード名を「Search Audio Files」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Credential | Google Drive account |
| Resource | File |
| Operation | Search |
| Query String | mimeType contains 'audio' |
| Folder | By ID → 対象フォルダのIDを入力 |

### フォルダIDの取得方法

Google DriveでフォルダをA開き、URLからIDをコピー：

```
https://drive.google.com/drive/folders/【このIDをコピー】
```

### Step 4: テスト実行

「Execute step」をクリックして、音声ファイルが検索されることを確認します。

### チェックポイント

- [ ] Search Audio Filesノードを追加した
- [ ] テスト実行で音声ファイルが取得できた

---

## セクション4: ループ処理の設定

### Step 5: Loop Over Itemsノードを追加

複数の音声ファイルを1つずつ処理するためのループを設定します。

1. 「+」をクリック → 「Loop Over Items」を検索して追加
2. 設定：

| 設定項目 | 値 |
|---------|-----|
| Batch Size | 1 |

### チェックポイント

- [ ] Loop Over Itemsを追加した

---

## セクション5: 音声ファイルのダウンロード

### Step 6: Google Driveノードを追加（ダウンロード用）

1. Loop Over Itemsの「loop」出力から「+」をクリック
2. 「Google Drive」を検索して追加
3. ノード名を「Download Audio」に変更
4. 設定：

| 設定項目 | 値 |
|---------|-----|
| Credential | Google Drive account |
| Resource | File |
| Operation | Download |
| File | By ID → {{ $json.id }}（Expressionモード） |

### Step 7: 一時ファイルとして保存

1. 「+」をクリック → 「Write Binary File」を検索して追加
2. ノード名を「Save to Temp」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| File Name | /tmp/{{ $json.name }}（Expressionモード） |
| Property Name | data |

### チェックポイント

- [ ] Download Audioノードを追加した
- [ ] Save to Tempノードを追加した

---

## セクション6: Whisper.cppで文字起こし

### Step 8: Execute Commandノードを追加

1. 「+」をクリック → 「Execute Command」を検索して追加
2. ノード名を「Execute Whisper」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Command | 下記参照 |

**Command（コピー用）**:

```
/opt/whisper.cpp/build/bin/whisper-cli -m /opt/whisper.cpp/models/ggml-base.bin -l ja -otxt -of /tmp/output /tmp/{{ $('Save to Temp').item.json.fileName }}
```

### コマンドオプションの説明

| オプション | 説明 |
|-----------|------|
| `-m ...` | 使用するモデルファイル |
| `-l ja` | 言語を日本語に指定 |
| `-otxt` | テキストファイルとして出力 |
| `-of /tmp/output` | 出力ファイル名（.txtが自動付与） |

### Step 9: テスト実行

ここまでのノードをテスト実行し、`/tmp/output.txt` が生成されることを確認します。

### チェックポイント

- [ ] Execute Whisperノードを追加した
- [ ] テスト実行で文字起こしが成功した

---

## セクション7: 結果の読み込みとアップロード

### Step 10: Read Binary Fileノードを追加

1. 「+」をクリック → 「Read Binary File」を検索して追加
2. ノード名を「Read Result」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| File Path | /tmp/output.txt |

### Step 11: Google Driveノードを追加（アップロード用）

1. 「+」をクリック → 「Google Drive」を検索して追加
2. ノード名を「Upload to Drive」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Credential | Google Drive account |
| Resource | File |
| Operation | Upload |
| File Name | {{ $('Download Audio').item.json.name }}.txt（Expressionモード） |
| Parent Folder | By ID → 出力先フォルダのID |
| Binary Property | data |

### チェックポイント

- [ ] Read Resultノードを追加した
- [ ] Upload to Driveノードを追加した

---

## セクション8: 一時ファイルの削除

### Step 12: Execute Commandノードを追加（クリーンアップ用）

1. 「+」をクリック → 「Execute Command」を検索して追加
2. ノード名を「Clean Up」に変更
3. 設定：

| 設定項目 | 値 |
|---------|-----|
| Command | rm -f /tmp/output.txt /tmp/*.mp3 /tmp/*.wav /tmp/*.m4a |

### Step 13: ループを完成させる

Clean Upノードの出力を「Loop Over Items」ノードに接続し、ループを完成させます。

### チェックポイント

- [ ] Clean Upノードを追加した
- [ ] ループが完成した

---

## セクション9: 全体テスト

### Step 14: ワークフロー全体をテスト

1. Manual Triggerの「Execute Workflow」をクリック
2. 全ノードが順番に実行されることを確認
3. Google Driveに文字起こし結果（.txtファイル）がアップロードされていることを確認

### 成功の確認ポイント

- [ ] 音声ファイルが検索された
- [ ] 音声ファイルがダウンロードされた
- [ ] Whisper.cppで文字起こしが実行された
- [ ] 結果がGoogle Driveにアップロードされた

---

## トラブルシューティング

### Execute Whisperでエラーが出る

**症状**: `whisper-cli: not found` エラー

**解決方法**: パスが正しいか確認。フルパスで指定：

```
/opt/whisper.cpp/build/bin/whisper-cli
```

### 日本語が文字化けする

**症状**: 文字起こし結果が文字化けしている

**解決方法**: `-l ja` オプションが指定されているか確認。モデルが日本語対応（ggml-base.bin）か確認。

### 大きなファイルで処理が遅い

**症状**: 長時間の音声で処理に時間がかかる

**解決方法**:
- CPUスレッド数を増やす: `-t 8`
- より小さいモデルを使う: `ggml-tiny.bin`

### 一時ファイルが残る

**症状**: /tmp にファイルが溜まる

**解決方法**: Clean Upノードが正しく実行されているか確認。必要に応じて手動でクリア：

```bash
docker exec n8n rm -f /tmp/*.mp3 /tmp/*.wav /tmp/*.txt
```

---

## まとめ

### このモジュールで学んだこと

- Google DriveとWhisper.cppを連携させる方法
- Execute Commandノードでコマンドラインツールを実行する方法
- バイナリファイルの読み書きと一時ファイルの管理
- ループ処理で複数ファイルを一括処理する方法

### 次のステップ

- Schedule Triggerで定期実行する
- 処理完了をSlack/Emailで通知する
- 文字起こし結果をGoogle Sheetsに保存する

---

## 参考資料

- [n8n Execute Command Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/)
- [n8n Google Drive Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/)
- [Whisper.cpp Usage](https://github.com/ggerganov/whisper.cpp#quick-start)

---

## よくある質問

**Q: 対応している音声フォーマットは？**
A: flac, mp3, ogg, wav に対応しています。m4aの場合は事前にffmpegで変換が必要です。

**Q: 処理時間の目安は？**
A: baseモデルの場合、1分の音声で約30秒〜1分程度です。CPUスペックにより変動します。

**Q: 複数ファイルを並列処理できますか？**
A: Batch Sizeを増やすことで可能ですが、メモリ使用量に注意が必要です。

**Q: 話者分離（誰が話したか）はできますか？**
A: Whisper.cpp単体では対応していません。話者分離が必要な場合はAssemblyAI等のクラウドAPIを検討してください。

**Q: より高精度なモデルを使いたい場合は？**
A: Dockerfileで `ggml-small.bin`（466MB）や `ggml-medium.bin`（1.5GB）をダウンロードし、コマンドの `-m` オプションを変更してください。
