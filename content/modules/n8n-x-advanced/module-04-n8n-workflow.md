# n8nワークフロー - 3パターン自動投稿

**所要時間**: 60分
**難易度**: ⭐⭐⭐⭐☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- スプレッドシートからREADYの投稿データを取得する方法
- patternによる分岐処理（announcement/image/thread）
- 画像生成付き投稿の自動化（Nanobanana連携）
- n8nでスレッド投稿を自動実行するワークフローの構築
- 投稿後のステータス更新とURL記録

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Google Sheetsノードでデータを取得できる
- Switchノードでpatternによる分岐を実装できる
- Mergeノードで複数データを結合できる
- 画像生成付き投稿を自動化できる
- 投稿後にスプレッドシートを更新できる
- ワークフローをスケジュール実行できる

---

## 目次

- [セクション1: ワークフロー設計](#セクション1-ワークフロー設計)
- [セクション2: READYデータの取得](#セクション2-readyデータの取得)
- [セクション3: patternによる分岐](#セクション3-patternによる分岐)
- [セクション4: announcement投稿の実装](#セクション4-announcement投稿の実装)
- [セクション5: 画像付き投稿の実装](#セクション5-画像付き投稿の実装)
- [セクション6: スレッド投稿の実装](#セクション6-スレッド投稿の実装)
- [セクション7: ステータス更新](#セクション7-ステータス更新)
- [セクション8: スケジュール実行](#セクション8-スケジュール実行)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01-03が完了していること
- 初級編 Module 05「スレッド投稿」を完了していること
- 初級編 Module 06「画像付き投稿」を完了していること（画像生成機能を使用する場合）
- Python APIサーバー（**v3**）が起動している
- n8nにGoogle Sheetsクレデンシャルが設定済み

### 前提知識

- 初級編で学んだn8nの基本操作
- スプレッドシートのシート構造（posts 12列、thread_draft）

---

## セクション1: ワークフロー設計

### ワークフロー全体像

```
[Schedule Trigger]
       ↓
[Google Sheets: Get posts (READY)]
       ↓
[Switch: pattern分岐]
       ├─ announcement ─→ [HTTP Request: /post] ────────────────┐
       ├─ image ────────→ [HTTP Request: /generate-and-post] ──┤
       └─ thread ───────→ [Google Sheets: Get thread_draft] ───┤
                                    ↓                           │
                              [Merge: posts + thread_draft]     │
                                    ↓                           │
                          [HTTP Request: /thread] ──────────────┤
                                                                ↓
                                                [Google Sheets: Update status]
```

### 各ノードの役割

| ノード | 役割 |
|--------|------|
| Schedule Trigger | 定期実行（例: 毎日10:00） |
| Google Sheets (1) | postsシートからREADYのデータを取得 |
| **Switch** | **patternで3パターンに分岐** |
| HTTP Request (/post) | 通常ツイート投稿（announcement用） |
| HTTP Request (/generate-and-post) | **画像生成+投稿（image用）** |
| Google Sheets (2) | thread_draftシートから内容を取得 |
| Merge | posts と thread_draft を結合（thread用） |
| HTTP Request (/thread) | スレッド投稿（thread用） |
| Google Sheets (3) | postsのstatusをPOSTEDに更新 |

### 投稿パターン別の処理

| pattern | エンドポイント | 処理内容 |
|---------|---------------|----------|
| announcement | `/post` | contentをそのまま投稿 |
| image | `/generate-and-post` | image_promptで画像生成→content付きで投稿 |
| thread | `/thread` | thread_draftの7ツイートを順次投稿 |

### チェックポイント

- [ ] ワークフローの全体像を理解した
- [ ] 3つのパターンの処理を把握した
- [ ] 各ノードの役割を把握した

---

## セクション2: READYデータの取得

### Step 1: 新規ワークフロー作成

1. n8nを開く
2. 「Add Workflow」をクリック
3. ワークフロー名を「X Thread Auto Post (Advanced)」に変更

### Step 2: Manual Triggerの追加

開発・テスト時は手動実行できるように、まずManual Triggerを追加します。

1. 「+」ボタンをクリック
2. 「Manual Trigger」を検索して追加

### Step 3: Google Sheetsノードの追加（posts取得）

1. Manual Triggerの「+」をクリック
2. 「Google Sheets」を検索して追加

### Step 4: Google Sheets設定（posts取得）

| 項目 | 設定値 |
|------|--------|
| **Credential** | （事前に設定したGoogle Sheetsクレデンシャル） |
| **Resource** | Sheet Within Document |
| **Operation** | Get rows |
| **Document** | x-auto-post-advanced |
| **Sheet** | posts |

### Step 5: フィルター条件の追加

「Options」を展開し、以下を設定します：

| 項目 | 設定値 |
|------|--------|
| **Filters** | 追加 |
| **Column** | status |
| **Value** | READY |

これにより、statusが「READY」の行のみ取得されます。

### チェックポイント

- [ ] Google Sheetsノードを追加した
- [ ] postsシートを選択した
- [ ] フィルターでstatus=READYを設定した

---

## セクション3: patternによる分岐

### Step 1: Switchノードの追加

pattern（announcement/image/thread）によってワークフローを分岐します。

1. Google Sheetsノード（posts取得）の「+」をクリック
2. 「Switch」を検索して追加

### Step 2: Switch設定

| 項目 | 設定値 |
|------|--------|
| **Mode** | Rules |
| **Data Type** | String |
| **Value 1** | {{ $json.pattern }} |

### Step 3: ルールの追加

3つのルールを追加します：

**ルール1（Output 0）**:
| 項目 | 設定値 |
|------|--------|
| **Operation** | Equals |
| **Value 2** | announcement |
| **Output** | 0 |

**ルール2（Output 1）**:
| 項目 | 設定値 |
|------|--------|
| **Operation** | Equals |
| **Value 2** | image |
| **Output** | 1 |

**ルール3（Output 2）**:
| 項目 | 設定値 |
|------|--------|
| **Operation** | Equals |
| **Value 2** | thread |
| **Output** | 2 |

### チェックポイント

- [ ] Switchノードを追加した
- [ ] patternでの3パターン分岐を設定した
- [ ] 各Outputが正しく設定されている

---

## セクション4: announcement投稿の実装

### Step 1: HTTP Requestノードの追加

SwitchのOutput 0（announcement）に接続します。

1. Switchノードの「Output 0」をクリック
2. 「HTTP Request」を検索して追加
3. ノード名を「Post Announcement」に変更

### Step 2: HTTP Request設定

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/post` |
| **Authentication** | None |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON |

### Step 3: JSONボディの入力

```json
{
  "text": "{{ $json.content }}"
}
```

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] SwitchのOutput 0に接続した
- [ ] URLを `/post` に設定した
- [ ] contentを投稿本文として設定した

---

## セクション5: 画像付き投稿の実装

### Step 1: HTTP Requestノードの追加

SwitchのOutput 1（image）に接続します。

1. Switchノードの「Output 1」をクリック
2. 「HTTP Request」を検索して追加
3. ノード名を「Post with Image」に変更

### Step 2: HTTP Request設定

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/generate-and-post` |
| **Authentication** | None |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON |
| **Timeout** | 60000 |

タイムアウトは画像生成に時間がかかるため60秒に設定します。「Options」→「Timeout」で設定できます。

### Step 3: JSONボディの入力

```json
{
  "text": "{{ $json.content }}",
  "prompt": "{{ $json.image_prompt }}",
  "aspect_ratio": "16:9"
}
```

| パラメータ | 説明 |
|-----------|------|
| text | postsシートのcontent列（投稿本文） |
| prompt | postsシートのimage_prompt列（画像生成プロンプト） |
| aspect_ratio | X向けは16:9推奨 |

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] SwitchのOutput 1に接続した
- [ ] URLを `/generate-and-post` に設定した
- [ ] image_promptを画像生成プロンプトとして設定した
- [ ] タイムアウトを60秒に設定した

---

## セクション6: スレッド投稿の実装

### Step 1: thread_draft取得ノードの追加

SwitchのOutput 2（thread）に接続します。

1. Switchノードの「Output 2」をクリック
2. 「Google Sheets」を検索して追加
3. ノード名を「Get Thread Draft」に変更

### Step 2: Google Sheets設定（thread_draft取得）

| 項目 | 設定値 |
|------|--------|
| **Credential** | （同じクレデンシャル） |
| **Resource** | Sheet Within Document |
| **Operation** | Get rows |
| **Document** | x-auto-post-advanced |
| **Sheet** | thread_draft |

### Step 3: Mergeノードの追加

postsとthread_draftを結合します。

1. 「Merge」を検索して追加
2. **Input 1**: Switchノードからの接続
3. **Input 2**: Get Thread Draftからの接続

Mergeノードには2つの入力が必要です。SwitchからのpostデータとGoogle Sheetsからのthread_draftデータを結合します。

### Step 4: Merge設定

| 項目 | 設定値 |
|------|--------|
| **Mode** | Combine |
| **Combine By** | Matching Fields |
| **Field 1** | post_id |
| **Field 2** | post_id |
| **Output Type** | All Matches |

### Step 5: HTTP Requestノードの追加

1. Mergeノードの「+」をクリック
2. 「HTTP Request」を検索して追加
3. ノード名を「Post Thread」に変更

### Step 6: HTTP Request設定

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/thread` |
| **Authentication** | None |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using Fields Below |

### Step 7: Bodyフィールドの設定

「Body Parameters」で以下を追加：

| Name | Value |
|------|-------|
| tweets | （下記参照） |

「Value」にはExpressionモードで以下を入力：

```javascript
{{ [
  $json.tweet_1,
  $json.tweet_2,
  $json.tweet_3,
  $json.tweet_4,
  $json.tweet_5,
  $json.tweet_6,
  $json.tweet_7
].filter(t => t && t.trim() !== '') }}
```

### チェックポイント

- [ ] Get Thread Draftノードを追加した
- [ ] Mergeノードでpost_idで結合を設定した
- [ ] Post Threadノードを追加した
- [ ] tweets配列をExpressionで設定した

---

## セクション7: ステータス更新

### Step 1: 3つのHTTP Requestを1つのUpdateに接続

3つのパターン（announcement/image/thread）の出力を1つのGoogle Sheets Updateノードに接続します。

1. 「Google Sheets」を追加
2. ノード名を「Update Status」に変更
3. 以下の3つのノードを接続：
   - Post Announcement
   - Post with Image
   - Post Thread

### Step 2: Google Sheets設定（ステータス更新）

| 項目 | 設定値 |
|------|--------|
| **Credential** | （同じクレデンシャル） |
| **Resource** | Sheet Within Document |
| **Operation** | Update row |
| **Document** | x-auto-post-advanced |
| **Sheet** | posts |

### Step 3: Matching Columnsの設定

| 項目 | 設定値 |
|------|--------|
| **Matching Columns** | post_id |

### Step 4: 更新するカラムの設定

「Columns to Update」で以下を設定：

| Column | Value |
|--------|-------|
| status | POSTED |
| posted_at | {{ $now.toISO() }} |
| tweet_url | {{ 'https://x.com/i/web/status/' + $json.tweet_id }} |

### ワークフロー完成図

```
[Manual Trigger]
       ↓
[Google Sheets: Get posts (READY)]
       ↓
[Switch: pattern]
       ├─ Output 0 (announcement)
       │        ↓
       │   [Post Announcement: /post] ─────────────┐
       │                                           │
       ├─ Output 1 (image)                         │
       │        ↓                                  │
       │   [Post with Image: /generate-and-post] ──┤
       │                                           │
       └─ Output 2 (thread)                        │
                ↓                                  │
         [Get Thread Draft]                        │
                ↓                                  │
           [Merge]                                 │
                ↓                                  │
         [Post Thread: /thread] ───────────────────┤
                                                   ↓
                                    [Update Status: posts]
```

### チェックポイント

- [ ] Update Statusノードを追加した
- [ ] 3つのHTTP Requestノードを接続した
- [ ] post_idでマッチングを設定した
- [ ] status、posted_at、tweet_urlを更新設定した

---

## セクション8: スケジュール実行

### Step 1: Schedule Triggerに変更

本番運用では、Manual TriggerをSchedule Triggerに変更します。

1. Manual Triggerをクリック
2. 「Delete」で削除
3. ワークフローの最初に「Schedule Trigger」を追加

### Step 2: Schedule Trigger設定

| 項目 | 設定値 |
|------|--------|
| **Trigger Times** | Custom (Cron) |
| **Expression** | `0 10 * * *` |

この設定で毎日10:00に実行されます。

### Cron式の例

| 式 | 意味 |
|----|------|
| `0 10 * * *` | 毎日10:00 |
| `0 10,18 * * *` | 毎日10:00と18:00 |
| `0 10 * * 1-5` | 平日10:00 |
| `*/30 * * * *` | 30分ごと |

### Step 3: ワークフローを有効化

1. 右上の「Inactive」スイッチをクリック
2. 「Active」に変更

### チェックポイント

- [ ] Schedule Triggerに変更した
- [ ] 実行時刻を設定した
- [ ] ワークフローを有効化した

---

## トラブルシューティング

### 「No data found」が返される

**原因**: postsシートにstatus=READYの行がない

**解決方法**: postsシートでstatusをREADYに変更してから実行してください。

### Switchノードで分岐されない

**原因**: pattern列の値が正しくない

**解決方法**:
- postsシートのpattern列が「announcement」「image」「thread」のいずれかになっているか確認
- 大文字・小文字が一致しているか確認
- 余分なスペースがないか確認

### 画像生成でタイムアウトエラー

**原因**: 画像生成に時間がかかりすぎている

**解決方法**:
- HTTP Requestノードの「Options」→「Timeout」を60000ms（60秒）以上に設定
- Python APIサーバー（v3）が起動しているか確認
- GOOGLE_API_KEYが正しく設定されているか確認

### 「No image generated」エラー

**原因**: image_promptがセーフティフィルターに引っかかった

**解決方法**:
- image_prompt列のプロンプトを確認
- 人物の描写を避けるか抽象的な表現に変更
- 英語で記述されているか確認（日本語は精度が下がる）

### Mergeノードで結合されない

**原因**: post_idが一致していない

**解決方法**:
- postsとthread_draftのpost_id列の値が完全に一致しているか確認
- 空白や余分なスペースがないか確認

### tweet_urlが正しく生成されない

**原因**: HTTP Requestのレスポンス構造が想定と異なる

**解決方法**:
- HTTP Requestノードの出力を確認
- パターンによってレスポンス構造が異なるため、Expressionを調整

### 投稿は成功するがステータスが更新されない

**原因**: Update RowのMatching Columnsが正しく設定されていない

**解決方法**:
- 「Matching Columns」にpost_idが設定されているか確認
- 「Columns to Update」にstatus等が設定されているか確認
- 3つのHTTP Requestノードが全てUpdate Statusノードに接続されているか確認

---

## まとめ

### このモジュールで学んだこと

- Google Sheetsノードでフィルター付きのデータ取得
- **Switchノードでpatternによる3パターン分岐**
- **announcement投稿（/post）の実装**
- **画像生成付き投稿（/generate-and-post）の実装**
- Mergeノードで複数シートのデータを結合
- Expressionを使ったtweets配列の動的生成
- 投稿後のステータス更新とURL記録
- Schedule Triggerによる定期実行

### 投稿パターンまとめ

| パターン | エンドポイント | 必要な列 |
|----------|---------------|----------|
| announcement | /post | content |
| image | /generate-and-post | content, image_prompt |
| thread | /thread | tweet_1〜tweet_7（thread_draft） |

### 次のステップ

これでX自動投稿 上級編の全システムが完成しました。150投稿/月の自動投稿が可能になりました。

さらに発展させる場合:
- AIを使ったスレッド内容の自動生成
- 画像付きスレッド投稿（各ツイートに画像を添付）
- エラー時の通知（Slack、Email等）
- 投稿結果の分析・レポート生成

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[x-auto-post-advanced.json](/n8n-x-advanced/download/x-auto-post-advanced.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| Google Sheetsクレデンシャル | 再設定が必要 |
| Document ID | 自分のスプレッドシートを選択 |
| URL | 必要に応じてホスト名を変更 |

**必要なPython APIサーバー**:

- `x_api_server_v3.py`が必要です（画像生成機能を含む）
- [ダウンロードはこちら](/n8n-x-auto-post/download/x_api_server_v3.py)

---

## 参考資料

- [n8n Google Sheets Documentation](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [n8n Merge Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/)
- [n8n Expressions Documentation](https://docs.n8n.io/code-examples/expressions/)

---

## よくある質問

**Q: 複数のREADY投稿がある場合はどうなりますか？**
A: 全てのREADY投稿が順次処理されます。API制限（17回/24時間）に注意してください。

**Q: 3つのパターンを混在させて投稿できますか？**
A: はい、Switchノードで自動的に分岐されるため、postsシートにannouncementとimageとthreadが混在していても問題ありません。

**Q: 画像生成にはどのくらい時間がかかりますか？**
A: 通常10〜20秒程度です。タイムアウトは60秒に設定しておくと安心です。

**Q: image_promptは日本語でも良いですか？**
A: 英語を推奨します。日本語は画像生成の精度が下がる場合があります。

**Q: 7ツイート未満のスレッドも投稿できますか？**
A: はい、Expressionで空の値をフィルタしているため、tweet_1〜tweet_3だけ入力しても3ツイートのスレッドとして投稿されます。

**Q: 投稿に失敗した場合はどうなりますか？**
A: HTTP Requestでエラーが発生すると、後続のUpdate処理は実行されません。postsのstatusはREADYのまま残ります。

**Q: Schedule Triggerとは別に手動実行もしたい場合は？**
A: 別途Manual Trigger付きのワークフローを作成するか、n8nの「Execute Workflow」機能を使用してください。

**Q: スプレッドシートIDはどこで確認できますか？**
A: スプレッドシートのURLから確認できます。`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`の`{SPREADSHEET_ID}`部分がIDです。

**Q: 画像付き投稿のアスペクト比を変えたいです**
A: HTTP RequestノードのJSONボディで`"aspect_ratio": "16:9"`を変更してください。使用可能な値: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`など。
