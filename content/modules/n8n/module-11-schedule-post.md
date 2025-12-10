# スケジュール投稿の設定

**所要時間**: 30分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- n8n Schedule Triggerの使い方
- Cron式によるスケジュール設定
- タイムゾーンの確認方法
- 動画処理待機のリトライループ実装

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Manual TriggerをSchedule Triggerに変更できる
- 毎日決まった時刻に自動投稿するワークフローを構築できる
- Cron式を理解して自由にスケジュールを設定できる
- 動画処理の待機時間が不足した場合のリトライループを実装できる

---

## 目次

- [セクション1: タイムゾーンの確認](#セクション1-タイムゾーンの確認)
- [セクション2: Schedule Triggerの追加](#セクション2-schedule-triggerの追加)
- [セクション3: リトライループの実装](#セクション3-リトライループの実装)
- [セクション4: ワークフローの有効化](#セクション4-ワークフローの有効化)
- [セクション5: 実行結果の確認](#セクション5-実行結果の確認)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 10で作成した「Instagram Reel from Drive」ワークフロー
- n8nが起動している状態

### 確認事項

Module 01のdocker-compose.ymlでタイムゾーンが設定されていることを確認してください：

```yaml
environment:
  - TZ=Asia/Tokyo
  - GENERIC_TIMEZONE=Asia/Tokyo
```

---

## セクション1: タイムゾーンの確認

### なぜタイムゾーン設定が重要か

n8nのSchedule Triggerは、設定されたタイムゾーンに基づいて実行されます。タイムゾーンが正しく設定されていないと、意図した時刻に実行されません。

### 確認方法

1. Docker Desktopを開く
2. 「Containers」から「n8n」コンテナを選択
3. 右クリック → 「Open in terminal」
4. 以下のコマンドを実行：

```bash
env | grep TIMEZONE
```

以下が表示されればOK：

```
GENERIC_TIMEZONE=Asia/Tokyo
```

### チェックポイント

- [ ] タイムゾーンがAsia/Tokyoに設定されている

---

## セクション2: Schedule Triggerの追加

### Step 1: ワークフローを開く

1. n8nを開く（http://localhost:5678）
2. 「Instagram Reel from Drive」ワークフローを開く

### Step 2: Schedule Triggerを追加

1. キャンバスの空いている場所で「+」をクリック
2. 「On a schedule」を選択

![トリガー選択画面](/n8n-setup/157-trigger-select.png)

### Step 3: Cron式を設定

1. Trigger Intervalで「Custom (Cron)」を選択
2. Expression欄に以下を入力：

```
0 0 6,12,18 * * *
```

![Schedule Trigger設定](/n8n-setup/158-schedule-trigger-config.png)

### Cron式の説明

```
0 0 6,12,18 * * *
│ │ │      │ │ │
│ │ │      │ │ └── 曜日（* = 毎日）
│ │ │      │ └──── 月（* = 毎月）
│ │ │      └────── 日（* = 毎日）
│ │ └───────────── 時（6,12,18 = 6時、12時、18時）
│ └─────────────── 分（0 = 0分）
└───────────────── 秒（0 = 0秒）
```

**意味**: 毎日 6:00、12:00、18:00 に実行

### よく使うCron式

| スケジュール | Cron式 |
|-------------|--------|
| 毎日9時 | `0 0 9 * * *` |
| 毎日9時と21時 | `0 0 9,21 * * *` |
| 毎日6時、12時、18時 | `0 0 6,12,18 * * *` |
| 平日の9時 | `0 0 9 * * 1-5` |
| 毎時0分 | `0 0 * * * *` |
| 30分ごと | `0 */30 * * * *` |

### Step 4: Schedule TriggerをGet DRAFT Postsに接続

1. Schedule Triggerの右側の点をドラッグ
2. Get DRAFT Postsの左側に接続

### チェックポイント

- [ ] Schedule Triggerを追加できた
- [ ] Cron式を設定できた
- [ ] Get DRAFT Postsに接続できた

---

## セクション3: リトライループの実装

### なぜリトライループが必要か

Instagram APIで動画をアップロードすると、処理に時間がかかります。コンテナのステータスが「FINISHED」になるまで待機する必要がありますが、固定の待機時間（60秒など）では不十分な場合があります。

リトライループを実装することで、ステータスが「FINISHED」になるまで自動的に待機を繰り返します。

### 現在の構成

```
Create Reel Container → Wait → Check Container Status → Publish Reel
```

### 変更後の構成

```
Create Reel Container → Wait 30s → Check Container Status → IF FINISHED?
                           ↑                                    │
                           └────────── No（False）←─────────────┘
                                           │
                                           Yes（True）→ Publish Reel
```

### Step 1: IFノードを追加

1. Check Container Statusの後に「IF」ノードを追加
2. 以下の条件を設定：

| 設定項目 | 値 |
|---------|-----|
| Value 1 | `{{ $json.status_code }}` |
| Operation | equals |
| Value 2 | `FINISHED` |

### Step 2: 接続を変更

1. **IF の True（上）** → 「Publish Reel」に接続
2. **IF の False（下）** → 「Wait 30s」に接続（ループ）

### Step 3: Wait時間を調整

Wait時間を30秒に設定します。ループするので短くてOKです。

### 完成した構成

![リトライループ完成](/n8n-setup/159-retry-loop-complete.png)

### チェックポイント

- [ ] IFノードを追加できた
- [ ] status_code = FINISHEDの条件を設定できた
- [ ] FalseからWaitへのループを接続できた

---

## セクション4: ワークフローの有効化

### Step 1: 保存

Ctrl+S または右上の「Save」をクリック

### Step 2: 有効化

右上の「Inactive」トグルをクリックして「Active」に変更

### Step 3: 「Workflow activated」ダイアログ

有効化すると「Workflow activated」というダイアログが表示されます。

![ワークフロー有効化](/n8n-setup/160-workflow-active.png)

「Got it」をクリックして閉じてください。

**重要**: Activeにしないとスケジュール実行されません。

### Step 4: Production Checklistは無視

有効化後、「Production Checklist」というダイアログが表示される場合があります。

![Production Checklist](/n8n-setup/163-production-checklist.png)

これはオプションの設定案内です。今回は必要ないので「Ignore for all workflows」または右上の「×」をクリックして閉じてください。

### Step 5: 動作確認（オプション）

テスト用に2分後の時刻でCron式を設定して、実際に自動実行されることを確認できます。

例えば現在が14:35なら：

```
0 37 14 * * *
```

確認後、本番のスケジュール（`0 0 6,12,18 * * *`など）に戻してください。

### チェックポイント

- [ ] ワークフローを保存できた
- [ ] ワークフローをActiveにできた
- [ ] 「Workflow activated」ダイアログで「Got it」をクリックした
- [ ] 「Production Checklist」を閉じた

---

## セクション5: 実行結果の確認

### Executionsで確認

1. 左メニューの「Executions」をクリック
2. 実行履歴が表示される

![実行履歴](/n8n-setup/161-executions-list.png)

### 確認項目

- **Status**: Succeeded（成功）/ Failed（失敗）
- **Started at**: 実行開始時刻
- **Time**: 実行時間

### チェックポイント

- [ ] Executionsで実行履歴を確認できた

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[scheduled-reel-post-workflow.json](/n8n/download/scheduled-reel-post-workflow.json)

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

### スケジュール時刻がずれる

**症状**: 設定した時刻と異なる時刻に実行される

**原因**: タイムゾーンが正しく設定されていない

**解決方法**:
1. docker-compose.ymlで`GENERIC_TIMEZONE=Asia/Tokyo`を確認
2. n8nコンテナを再起動: `docker-compose restart`

### Media ID is not available

**症状**: Publish Reelで「Media ID is not available」エラー

**原因**: 動画の処理が完了していない

**解決方法**: 本モジュールのリトライループを実装してください

### ワークフローが実行されない

**症状**: 設定した時刻になっても実行されない

**原因**: ワークフローがInactiveになっている

**解決方法**: 右上のトグルをクリックしてActiveにしてください

### Google Drive API 500エラー

**症状**: Search Category FolderまたはSearch Video Fileで500 Internal Error

**原因**: Google API側の一時的な問題、またはレート制限

**解決方法**:
1. しばらく時間を空けて再実行
2. 短時間に何度も実行しない

---

## まとめ

### このモジュールで学んだこと

- n8n Schedule Triggerの設定方法
- Cron式によるスケジュール設定
- タイムゾーンの確認と重要性
- 動画処理待機のリトライループ実装
- ワークフローの有効化と実行履歴の確認

### 次のステップ

これでn8n講座は完了です！

構築したシステムの全体像：

1. **Module 01-04**: 環境構築とAPI設定
2. **Module 05-06**: シートからInstagram投稿
3. **Module 07-08**: AIでコンテンツ自動生成
4. **Module 09**: Canvaで動画素材を一括生成
5. **Module 10**: 動画をInstagramリールとして投稿
6. **Module 11**: スケジュール投稿で自動化

これにより、AIによる企画生成から動画素材化、Instagram投稿まで、完全に自動化されたワークフローが完成しました。

---

## 参考資料

- [n8n Schedule Trigger node documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/)
- [Crontab Guru - Cron式エディタ](https://crontab.guru/)
- [n8n Scheduling the workflow](https://docs.n8n.io/courses/level-one/chapter-5/chapter-5.7/)

---

## よくある質問

**Q: Manual Triggerは削除すべきですか？**
A: 残しておくことを推奨します。手動でテストしたい場合に便利です。Schedule TriggerとManual Triggerは両方残しておけます。

**Q: 複数の時刻を設定するにはどうすればいいですか？**
A: Cron式でカンマ区切りで指定します。例: `0 0 9,15,21 * * *`（9時、15時、21時）

**Q: スケジュールを変更したら即座に反映されますか？**
A: いいえ。ワークフローを一度Inactiveにしてから再度Activeにする必要があります。

**Q: 実行に失敗した場合、自動でリトライされますか？**
A: デフォルトではリトライされません。エラー時のリトライが必要な場合は、Error Triggerワークフローを別途作成してください。

**Q: 1日に何回まで投稿できますか？**
A: Instagram APIの制限により、24時間で25〜50投稿までです。通常の運用であれば問題ありません。
