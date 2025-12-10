# シートからInstagramに投稿する

**所要時間**: 30-40分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Google SheetsからステータスがREADYの投稿を取得する方法
- 複数のノードからデータを参照するワークフロー構築
- Instagram Graph APIでメディアを公開する流れ
- Edit Fieldsノードでデータを整形する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- postsシートとmediaシートを連携したワークフローを構築できる
- n8nのノード間データ参照を理解している
- シートのデータを使ってInstagramに自動投稿できる

---

## 目次

- [セクション1: ワークフローの全体像](#セクション1-ワークフローの全体像)
- [セクション2: postsシートからデータを取得](#セクション2-postsシートからデータを取得)
- [セクション3: mediaシートからURLを取得](#セクション3-mediaシートからurlを取得)
- [セクション4: Instagram User IDを取得](#セクション4-instagram-user-idを取得)
- [セクション5: メディアコンテナを作成](#セクション5-メディアコンテナを作成)
- [セクション6: 待機ノードを追加](#セクション6-待機ノードを追加)
- [セクション7: メディアを公開](#セクション7-メディアを公開)
- [セクション8: 更新データを整形](#セクション8-更新データを整形)
- [セクション9: シートを更新](#セクション9-シートを更新)
- [セクション10: ワークフローを保存](#セクション10-ワークフローを保存)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 04で設定したGoogle Sheets認証情報
- Module 05で作成したpostsシート・mediaシート（テストデータ投入済み）
- Module 02で取得したInstagramアクセストークン

### 前提知識

- Module 03: Instagram投稿ワークフローの基本
- Module 04: Google Sheets連携の基本操作
- Module 05: 投稿管理シートの構造

---

## セクション1: ワークフローの全体像

### 完成するワークフロー

```
[Trigger manually]
   ↓
[Get row(s) in sheet] ← postsシートからstatus=READYを取得
   ↓
[Get row(s) in sheet1] ← mediaシートからpublic_urlを取得
   ↓
[HTTP Request] ← Instagram User IDを取得
   ↓
[HTTP Request1] ← メディアコンテナを作成
   ↓
[Wait] ← 5秒待機
   ↓
[HTTP Request2] ← メディアを公開
   ↓
[Edit Fields] ← 更新データを整形
   ↓
[Append or update row in sheet] ← statusをPUBLISHEDに更新
```

### データの流れ

| ノード | 入力 | 出力 |
|--------|------|------|
| Get row(s) in sheet | - | post_id, caption, media_ids |
| Get row(s) in sheet1 | media_ids | public_url |
| HTTP Request | access_token | user_id |
| HTTP Request1 | user_id, public_url, caption | container_id |
| Wait | - | - |
| HTTP Request2 | user_id, container_id | ig_post_id |
| Edit Fields | 各ノードのデータ | post_id, status, ig_post_id, published_at |
| Append or update row in sheet | 整形されたデータ | 更新結果 |

### チェックポイント

- [ ] ワークフローの全体像を理解した
- [ ] 各ノードの役割を理解した

---

## セクション2: postsシートからデータを取得

### Step 1: 新規ワークフローを作成

1. n8nを開く
2. **+ Create Workflow** をクリック
3. ワークフロー名を **Instagram Post from Sheet** に変更

### Step 2: Trigger manuallyを追加

1. **+** ボタンをクリック
2. **Trigger manually** を選択

### Step 3: postsシートからREADY投稿を取得

1. **+** ボタンから **Google Sheets** → **Get row(s) in sheet** を選択
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Credential | Google Sheets account |
| Document | n8n-test |
| Sheet | posts |

3. **Filters** を追加:
   - **Column**: `status`
   - **Value**: `READY`

4. **Execute step** でテスト

### 確認ポイント

OUTPUTに以下のデータが表示されればOK：

- post_id: POST-001
- status: READY
- caption: n8n test from sheet
- media_ids: MEDIA-001

![posts取得結果](/n8n-setup/80-posts-get-result.png)

### チェックポイント

- [ ] postsシートからデータを取得できた
- [ ] status=READYでフィルターされている

---

## セクション3: mediaシートからURLを取得

### Step 1: mediaシートからデータを取得

1. **+** ボタンから **Google Sheets** → **Get row(s) in sheet** を追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Credential | Google Sheets account |
| Document | n8n-test |
| Sheet | media |

3. **Filters** を追加:
   - **Column**: `media_id`
   - **Value**: `{{ $json.media_ids }}`（Expression）

4. **Execute step** でテスト

### 確認ポイント

OUTPUTに以下のデータが表示されればOK：

- media_id: MEDIA-001
- public_url: https://images.unsplash.com/...

![media取得結果](/n8n-setup/81-media-get-result.png)

### チェックポイント

- [ ] mediaシートからデータを取得できた
- [ ] public_urlが取得できている

---

## セクション4: Instagram User IDを取得

### Step 1: HTTP Requestノードを追加

1. **+** ボタンから **HTTP Request** を追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Method | GET |
| URL | `https://graph.instagram.com/v20.0/me` |
| Send Query Parameters | ON |

3. **Query Parameters**:

| Name | Value |
|------|-------|
| fields | `user_id,username` |
| access_token | （アクセストークンを入力） |

4. **Execute step** でテスト

### 確認ポイント

OUTPUTに `user_id` が表示されればOK。

![User ID取得結果](/n8n-setup/82-userid-result.png)

### チェックポイント

- [ ] User IDを取得できた

---

## セクション5: メディアコンテナを作成

### Step 1: HTTP Requestノードを追加

1. **+** ボタンから **HTTP Request** を追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Method | POST |
| URL | `https://graph.instagram.com/v20.0/{{ $json.user_id }}/media` |
| Send Query Parameters | ON |

3. **Query Parameters**:

| Name | Value |
|------|-------|
| image_url | `{{ $('Get row(s) in sheet1').item.json.public_url }}` |
| caption | `{{ $('Get row(s) in sheet').item.json.caption }}` |
| access_token | （アクセストークンを入力） |

4. **Execute step** でテスト

### ノード参照について

- `$json.user_id` → 直前のノード（HTTP Request）の出力
- `$('Get row(s) in sheet1')` → mediaシートのノードを名前で参照
- `$('Get row(s) in sheet')` → postsシートのノードを名前で参照

> **重要**: ノード名はキャンバス上で確認してください。異なる名前の場合は適宜修正してください。

### 確認ポイント

OUTPUTに `id`（コンテナID）が表示されればOK。

![コンテナ作成結果](/n8n-setup/83-container-result.png)

### チェックポイント

- [ ] コンテナIDを取得できた

---

## セクション6: 待機ノードを追加

Instagram APIはコンテナ作成後、すぐに公開できない場合があります。Waitノードで待機します。

### Step 1: Waitノードを追加

1. **+** ボタンから **Wait** を検索して追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Wait Amount | 5 |
| Wait Unit | Seconds |

### チェックポイント

- [ ] Waitノードを追加した

---

## セクション7: メディアを公開

### Step 1: HTTP Requestノードを追加

1. **+** ボタンから **HTTP Request** を追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Method | POST |
| URL | `https://graph.instagram.com/v20.0/{{ $('HTTP Request').item.json.user_id }}/media_publish` |
| Send Query Parameters | ON |

3. **Query Parameters**:

| Name | Value |
|------|-------|
| creation_id | `{{ $json.id }}` |
| access_token | （アクセストークンを入力） |

4. **Execute step** でテスト

### 確認ポイント

OUTPUTに `id`（投稿ID）が表示されればOK。

Instagramアプリで投稿を確認してください。

![公開結果](/n8n-setup/84-publish-result.png)

### チェックポイント

- [ ] 投稿IDを取得できた
- [ ] Instagramに投稿が表示されている

---

## セクション8: 更新データを整形

Update row in sheetノードは、入力データに含まれるフィールドでマッチングします。複数のノードからデータを集めるため、Edit Fieldsノードでデータを整形します。

### Step 1: Edit Fieldsノードを追加

1. **+** ボタンから **Edit Fields** (または **Set**) を追加
2. 設定:
   - **Include Other Input Fields**: OFF

3. **Fields to Set** で以下を追加:

| Name | Value |
|------|-------|
| post_id | `{{ $('Get row(s) in sheet').item.json.post_id }}` |
| status | `PUBLISHED` |
| ig_post_id | `{{ $json.id }}` |
| published_at | `{{ $now.toISO() }}` |

4. **Execute step** でテスト

### 確認ポイント

OUTPUTに4つのフィールドが表示されればOK：

- post_id: POST-001
- status: PUBLISHED
- ig_post_id: （投稿ID）
- published_at: （日時）

![Edit Fields結果](/n8n-setup/85-edit-fields-result.png)

### チェックポイント

- [ ] 4つのフィールドが出力されている

---

## セクション9: シートを更新

### Step 1: Append or update row in sheetノードを追加

1. **+** ボタンから **Google Sheets** → **Append or update row in sheet** を追加
2. 設定:

| 項目 | 設定値 |
|------|--------|
| Credential | Google Sheets account |
| Document | n8n-test |
| Sheet | posts |
| Mapping Column Mode | Map Each Column Manually |
| Column to match on | post_id |

3. **Values to Send** で以下を設定:

各フィールドの入力欄の左側にある **fx** アイコンをクリックして **Expressionモード**（緑色の枠）にしてから式を入力してください。

| フィールド | Value |
|-----------|-------|
| post_id (using to match) | `{{ $('Get row(s) in sheet').item.json.post_id }}` |
| status | `{{ $json.status }}` |
| ig_post_id | `{{ $json.ig_post_id }}` |
| published_at | `{{ $json.published_at }}` |

![Append or update設定](/n8n-setup/86-append-update-result.png)

4. ワークフロー全体を実行してテスト

### 確認ポイント

postsシートを開いて、POST-001の以下が更新されていればOK：

- status: PUBLISHED
- ig_post_id: （投稿ID）
- published_at: （日時）

### チェックポイント

- [ ] postsシートが更新された

---

## セクション10: ワークフローを保存

### Step 1: ワークフローを保存

1. 右上の **Save** ボタンをクリック（または Ctrl+S）

### 完成したワークフロー

![ワークフロー完成](/n8n-setup/87-workflow-complete.png)

### チェックポイント

- [ ] ワークフローを保存した

---

## トラブルシューティング

### API access blocked

**症状**: HTTP Requestで「API access blocked」エラーが発生する

**原因**: アクセストークンが無効、またはMeta Developer Consoleでアプリが制限されている

**解決方法**:
1. Meta Developer Console (https://developers.facebook.com/) にアクセス
2. アプリの状態を確認
3. 必要に応じてトークンを再生成

---

### Media ID is not available

**症状**: メディア公開時に「Media ID is not available」「このメディアは公開する準備ができていません」エラーが発生する

**原因**: コンテナ作成から公開までの間隔が短すぎる

**解決方法**:
1. HTTP Request1（コンテナ作成）とHTTP Request2（公開）の間にWaitノードを追加
2. 5秒待機を設定（足りなければ10秒に増やす）

---

### Referenced node doesn't exist

**症状**: 式で `$('ノード名')` を使用すると「Referenced node doesn't exist」エラーが発生する

**原因**: ノード名が間違っている

**解決方法**:
1. キャンバス上でノードの正確な名前を確認
2. 式エディタ（fxアイコン）を開いて、左側のパネルから正しいノードを選択

---

### シートが更新されない

**症状**: Google Sheetsノードを実行してもシートが更新されない

**原因1**: 「Update row」ではなく「Append or update row」を使用する必要がある

**原因2**: 式がExpressionモードで入力されていない（文字列としてそのまま保存されている）

**解決方法**:
1. 「**Append or update row in sheet**」を使用する
2. 各フィールドの入力欄で **fx** アイコンをクリックして **Expressionモード**（緑色の枠）にしてから式を入力する

---

## まとめ

### このモジュールで学んだこと

- Google Sheetsからステータスでフィルターしてデータを取得する方法
- 複数のノードからデータを参照する式（`$('ノード名')`）
- Instagram Graph APIでのメディア公開フロー
- Edit Fieldsノードでデータを整形してから次のノードに渡す方法
- Waitノードで処理間隔を調整する方法

### 次のステップ

- スケジュール実行（Schedule Trigger）で定期的に投稿を処理
- カルーセル投稿への対応
- エラーハンドリングの強化

---

## 参考資料

- [n8n Google Sheets Node ドキュメント](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [n8n HTTP Request Node ドキュメント](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [n8n Expressions ドキュメント](https://docs.n8n.io/code/expressions/)
- [Instagram Content Publishing API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing)

---

## よくある質問

**Q: なぜEdit Fieldsノードが必要なのですか？**
A: Update row in sheetノードは「このノードへの入力データ」でマッチングします。複数のノードからデータを集める場合、Edit Fieldsで1つのJSONにまとめることで、Update rowが正しく動作します。

**Q: Waitノードの秒数はどのくらいが適切ですか？**
A: 通常は5秒で十分ですが、画像サイズが大きい場合や回線が遅い場合は10秒以上必要になることがあります。エラーが出る場合は秒数を増やしてください。

**Q: 複数の投稿を一度に処理できますか？**
A: Get row(s) in sheetで複数行が取得された場合、n8nは各行に対して後続のノードを実行します。ただし、Instagram APIには24時間で50投稿の制限があります。

**Q: ノード名を変更しても動作しますか？**
A: ノード名を変更した場合、`$('ノード名')` で参照している全ての箇所を新しい名前に更新する必要があります。
