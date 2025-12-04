# n8nでInstagramに投稿するワークフロー構築

**所要時間**: 30-45分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- n8nでワークフローを作成する方法
- HTTP Requestノードを使ったAPI呼び出し
- Instagram Graph APIを使った投稿の仕組み
- メディアコンテナ作成と公開の2ステップ投稿

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- n8nで新しいワークフローを作成できる
- HTTP Requestノードを設定してAPIを呼び出せる
- Instagram Graph APIを使って画像を投稿できる
- ワークフローを保存して再利用できる

---

## 事前準備

### 必要なもの

- n8nが起動している状態（Module 01で構築済み）
- Instagramアクセストークン（Module 02で取得済み）
- 公開サーバー上の画像URL（テスト用フリー画像でも可）

### 推奨環境

- PC（Windows/Mac/Linux）
- ブラウザ（Chrome推奨）

### 事前確認

- [ ] Dockerデスクトップでn8nコンテナが起動している
- [ ] Module 02で取得したアクセストークンを手元に用意している

---

## Instagram投稿の仕組み

n8nにはInstagram専用ノードがないため、**Instagram Graph API**を使って投稿します。

### 2ステップ投稿プロセス

Instagram Graph APIでは、投稿は以下の2ステップで行います：

| ステップ | 内容 | APIエンドポイント |
|----------|------|-------------------|
| Step 1 | メディアコンテナ作成 | `/{user-id}/media` |
| Step 2 | メディア公開 | `/{user-id}/media_publish` |

### 今回作成するワークフロー

```
[Manual Trigger] → [HTTP Request] → [Edit Fields] → [HTTP Request] → [HTTP Request]
  (実行開始)        (User ID取得)     (投稿設定)      (コンテナ作成)    (公開)
```

---

## セクション1: n8nでワークフローを作成

### n8nを開く

1. Dockerデスクトップを起動
2. n8nコンテナが「Running」になっていることを確認
3. ブラウザで `http://localhost:5678` にアクセス

### ダッシュボード画面

![n8nダッシュボード](/n8n-setup/23-n8n-dashboard.png)

n8nのホーム画面が表示されます。

### 新しいワークフローを作成

1. **「Start from scratch」** をクリック

### トリガーの選択

![トリガー選択パネル](/n8n-setup/24-trigger-panel.png)

ワークフロー編集画面が開き、トリガー選択パネルが表示されます。

2. **「Trigger manually」** をクリック

### Manual Triggerが追加される

![Manual Trigger追加後](/n8n-setup/25-manual-trigger-added.png)

「When clicking 'Execute workflow'」というノードが追加されます。これで手動でワークフローを実行できるようになりました。

### チェックポイント

- [ ] n8nダッシュボードが表示された
- [ ] 新しいワークフローを作成した
- [ ] Manual Triggerノードが追加された

---

## セクション2: Instagram User IDの取得

投稿するには、自分のInstagram User IDが必要です。最初のHTTP Requestノードでこれを取得します。

### HTTP Requestノードを追加

1. Manual Triggerノードの右側にある **「+」ボタン** をクリック

![ノード検索パネル](/n8n-setup/26-node-search.png)

2. 検索窓に **「HTTP」** と入力
3. **「HTTP Request」** をクリック

### HTTP Request設定画面

![HTTP Request設定画面](/n8n-setup/27-http-request-panel.png)

HTTP Requestノードの設定パネルが開きます。

### URLを設定

![HTTP Request URL設定](/n8n-setup/28-http-request-url.png)

以下の設定を行います：

| 項目 | 設定値 |
|------|--------|
| Method | GET（デフォルトのまま） |
| URL | `https://graph.instagram.com/v20.0/me?fields=user_id,username` |

URLフィールドに以下をコピーして貼り付けてください：

```
https://graph.instagram.com/v20.0/me?fields=user_id,username
```

### Query Parametersを設定

![Query Parameters ON](/n8n-setup/29-query-params-on.png)

1. **「Send Query Parameters」** のトグルを **ON** にする
2. 以下を入力：

| Name | Value |
|------|-------|
| access_token | Module 02で取得したアクセストークン |

### 実行してUser IDを取得

1. 右上の **「Execute step」**（オレンジ色のボタン）をクリック

![User ID取得結果](/n8n-setup/30-user-id-result.png)

成功すると、OUTPUTに以下のような結果が表示されます：

| フィールド | 値 |
|------------|-----|
| user_id | あなたのInstagram User ID（数字） |
| username | あなたのInstagramユーザー名 |

> **重要**: この`user_id`が投稿に必要なIDです。

### キャンバスに戻る

1. **「Back to canvas」** をクリック

![キャンバス表示](/n8n-setup/31-canvas-after-userid.png)

ワークフローキャンバスに戻ります。ノードが緑色のチェックマークで表示されていれば成功です。

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] URLを正しく設定した
- [ ] アクセストークンをQuery Parametersに設定した
- [ ] Execute stepで実行してuser_idを取得できた

---

## セクション3: 投稿内容の設定

次に、投稿に必要な情報（画像URL、キャプション、アクセストークン）を設定するノードを追加します。

### Edit Fieldsノードを追加

1. HTTP Requestノードの右側にある **「+」ボタン** をクリック

![Edit Fields選択](/n8n-setup/32-edit-fields-select.png)

2. **「Edit Fields (Set)」** をクリック

### Edit Fields設定画面

![Edit Fields設定画面](/n8n-setup/33-edit-fields-panel.png)

Edit Fieldsノードの設定パネルが開きます。左側に前のノードからのデータ（user_id, username）が表示されています。

### Include Other Input Fieldsを有効にする

![Include Other Input ON](/n8n-setup/34-include-input-on.png)

1. 画面下部の **「Include Other Input Fields」** のトグルを **ON** にする

これで前のノードからのuser_idが引き継がれます。

### フィールドを追加

**「Add Field」** をクリックして、以下の3つのフィールドを追加します：

#### フィールド1: image_url

| 項目 | 値 |
|------|-----|
| Name | image_url |
| Value | 公開サーバー上の画像URL |

テスト用に以下のフリー画像URLを使用できます：

```
https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080
```

#### フィールド2: caption

| 項目 | 値 |
|------|-----|
| Name | caption |
| Value | 投稿のキャプション（例: n8n test post） |

#### フィールド3: access_token

| 項目 | 値 |
|------|-----|
| Name | access_token |
| Value | Module 02で取得したアクセストークン |

### 設定完了後の画面

![Edit Fields完了](/n8n-setup/35-edit-fields-complete.png)

3つのフィールドが追加され、前のノードからのuser_idも引き継がれています。

### 実行して確認

1. **「Execute step」** をクリック
2. OUTPUTに4つのフィールド（user_id, image_url, caption, access_token）が表示されることを確認
3. **「Back to canvas」** をクリック

![ワークフロー実行成功](/n8n-setup/36-workflow-success.png)

すべてのノードが緑色のチェックマークで表示されます。

### チェックポイント

- [ ] Edit Fieldsノードを追加した
- [ ] Include Other Input FieldsをONにした
- [ ] image_url、caption、access_tokenの3つのフィールドを追加した
- [ ] Execute stepで実行して4つのフィールドが確認できた

---

## セクション4: メディアコンテナの作成

Instagram Graph APIの最初のステップとして、メディアコンテナを作成します。

### HTTP Requestノードを追加

1. Edit Fieldsノードの右側にある **「+」ボタン** をクリック
2. **「HTTP Request」** を検索して追加

### メディアコンテナ作成の設定

![メディアコンテナ作成設定](/n8n-setup/37-container-request.png)

以下の設定を行います：

#### Method

| 項目 | 設定値 |
|------|--------|
| Method | **POST**（ドロップダウンから選択） |

#### URL

```
https://graph.instagram.com/v20.0/{{ $json.user_id }}/media
```

> **ポイント**: `{{ $json.user_id }}` は前のノードからのデータを参照する式です。

#### Query Parameters

**「Send Query Parameters」** をONにして、以下の3つを追加：

| Name | Value |
|------|-------|
| image_url | `{{ $json.image_url }}` |
| caption | `{{ $json.caption }}` |
| access_token | `{{ $json.access_token }}` |

### 実行してコンテナIDを取得

1. **「Execute step」** をクリック

![コンテナID取得結果](/n8n-setup/38-container-id-result.png)

成功すると、OUTPUTに `id`（コンテナID）が表示されます。

```json
{
  "id": "17846059578619138"
}
```

> **重要**: このコンテナIDを次のステップで使用します。

2. **「Back to canvas」** をクリック

![コンテナ作成後のキャンバス](/n8n-setup/39-canvas-after-container.png)

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] MethodをPOSTに変更した
- [ ] URLにuser_idを含む式を設定した
- [ ] 3つのQuery Parametersを設定した
- [ ] Execute stepでコンテナIDを取得できた

---

## セクション5: メディアの公開

最後のステップとして、作成したメディアコンテナを公開します。

### HTTP Requestノードを追加

1. 前のHTTP Requestノード（コンテナ作成）の右側にある **「+」ボタン** をクリック
2. **「HTTP Request」** を検索して追加

### メディア公開の設定

![メディア公開設定](/n8n-setup/40-publish-request.png)

以下の設定を行います：

#### Method

| 項目 | 設定値 |
|------|--------|
| Method | **POST** |

#### URL

```
https://graph.instagram.com/v20.0/{{ $('Edit Fields').item.json.user_id }}/media_publish
```

> **ポイント**: `$('Edit Fields')` は「Edit Fields」という名前のノードを参照する式です。直前のノードではなく、Edit Fieldsノードからuser_idを取得します。

#### Query Parameters

**「Send Query Parameters」** をONにして、以下の2つを追加：

| Name | Value |
|------|-------|
| creation_id | `{{ $json.id }}` |
| access_token | `{{ $('Edit Fields').item.json.access_token }}` |

> **ポイント**:
> - `creation_id` は直前のノード（コンテナ作成）から取得したコンテナID
> - `access_token` はEdit Fieldsノードから参照

### 実行して投稿を公開

1. **「Execute step」** をクリック

![投稿ID取得結果](/n8n-setup/41-post-id-result.png)

成功すると、OUTPUTに投稿ID（`id`）が表示されます。

```json
{
  "id": "18079484714149424"
}
```

**これでInstagramへの投稿が完了しました。**

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] MethodをPOSTに変更した
- [ ] URLにmedia_publishエンドポイントを設定した
- [ ] creation_idとaccess_tokenを設定した
- [ ] Execute stepで投稿IDを取得できた

---

## セクション6: 投稿の確認とワークフローの保存

### Instagramで投稿を確認

Instagramアプリまたはウェブサイトを開いて、投稿が公開されていることを確認します。

![Instagramプロフィール](/n8n-setup/42-instagram-profile.png)

プロフィール画面に新しい投稿が表示されます。

![Instagram投稿詳細](/n8n-setup/43-instagram-post.png)

投稿をタップすると、設定したキャプションと画像が表示されます。

### ワークフローを保存

1. 画面左上の **「My workflow」** をクリック
2. ワークフロー名を **「Instagram Post」** などに変更
3. **「Save」** ボタンをクリック（または Ctrl+S / Cmd+S）

### 完成したワークフロー

![完成したワークフロー](/n8n-setup/44-workflow-complete.png)

完成したワークフローは以下の5つのノードで構成されています：

| ノード | 役割 |
|--------|------|
| When clicking 'Execute workflow' | 手動実行トリガー |
| HTTP Request | Instagram User IDの取得 |
| Edit Fields | 投稿内容の設定 |
| HTTP Request1 | メディアコンテナの作成 |
| HTTP Request2 | メディアの公開 |

### チェックポイント

- [ ] Instagramで投稿が表示された
- [ ] ワークフローに名前を付けた
- [ ] ワークフローを保存した

---

## トラブルシューティング

### Invalid OAuth access token エラー

**症状**: 「Invalid OAuth access token - Cannot parse access token」というエラーが表示される

**原因**: アクセストークンが正しくない、または期限切れ

**解決方法**:
1. Module 02の手順でアクセストークンを再生成
2. 新しいトークンをEdit Fieldsノードに設定

---

### 画像がアップロードできない

**症状**: メディアコンテナ作成でエラーが発生する

**原因**: 画像URLが以下の要件を満たしていない可能性

**要件**:
- 公開サーバー上にある（ローカルファイル不可）
- JPEG形式
- HTTPSでアクセス可能

**解決方法**:
- テスト用にUnsplashなどのフリー画像URLを使用
- 画像をImgurやGoogle Driveにアップロードして公開URLを取得

---

### graph.facebook.com と graph.instagram.com の違い

**症状**: URLをどちらにすべきか迷う

**解決方法**:
- トークンが `IG` で始まる場合 → `graph.instagram.com` を使用
- トークンが `EAA` で始まる場合 → `graph.facebook.com` を使用

本モジュールではInstagram Login APIトークン（`IG`で始まる）を使用しているため、`graph.instagram.com`を使用しています。

---

## まとめ

### このモジュールで学んだこと

- n8nでワークフローを新規作成する方法
- HTTP Requestノードを使ったAPI呼び出し
- Instagram Graph APIの2ステップ投稿プロセス
  - Step 1: メディアコンテナ作成
  - Step 2: メディア公開
- n8nの式 `{{ $json.xxx }}` を使ったデータ参照

### 次のステップ

このワークフローを拡張して、以下のような自動化が可能です：

- スケジュール投稿（Scheduleトリガーを使用）
- AIによるキャプション自動生成
- Google Sheetsから投稿内容を読み込み
- 複数画像のカルーセル投稿

---

## 参考資料

- [n8n HTTP Request Node ドキュメント](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Instagram Graph API - Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [n8n Community: Step-by-Step Guide to Post to Instagram](https://community.n8n.io/t/step-by-step-guide-how-to-post-to-instagram-via-n8n-automations/61665)
- [n8n Workflow Template: Instagram Single Image Post](https://n8n.io/workflows/2537-simple-social-instagram-single-image-post-with-facebook-api/)

---

## よくある質問

**Q: 画像はどこにアップロードすればいいですか？**
A: Instagram Graph APIでは、公開サーバー上にある画像URLが必要です。以下のサービスが使用できます：
- Imgur（無料）
- Google Drive（共有リンクを公開設定に）
- AWS S3やCloudflare R2などのオブジェクトストレージ
- 自分のWebサーバー

**Q: 動画は投稿できますか？**
A: はい、可能です。ただし、動画の場合はコンテナ作成後にステータスが`FINISHED`になるまで待機する必要があります。Waitノードを追加して処理を待つワークフローに修正が必要です。

**Q: ハッシュタグはどう入れますか？**
A: captionフィールドに直接ハッシュタグを含めることができます。ただし、`#`はURLエンコードが必要な場合があるため、`%23`に置き換えるか、n8nの式で処理することを推奨します。

**Q: 1日に何回投稿できますか？**
A: Instagram Graph APIには投稿制限があります。24時間で25〜50投稿が目安です。過度な投稿はアカウント制限の原因になる可能性があります。

**Q: アクセストークンの有効期限はありますか？**
A: Instagram Login APIで取得したトークンは約60日間有効です。期限が近づいたら再生成するか、長期トークンに交換することを推奨します。
