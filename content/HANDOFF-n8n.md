# n8n講座 引き継ぎ資料

**作成日**: 2025-12-02
**作成済み**:
- module-01-docker-setup.md（Dockerセットアップ編）
- module-02-instagram-api-setup.md（Instagram API設定編）
- module-03-instagram-post.md（Instagram投稿ワークフロー編）

---

## 講座作成フロー

### 基本的な流れ

1. **ユーザーからのリクエスト**
   - ユーザーが「この手順を知りたい」とリクエスト

2. **徹底的な調査**
   - その手順について調査（公式ドキュメント、最新情報など）
   - 手順を整理して指示

3. **ユーザーによる実践**
   - ユーザーが手順を実際にやってみる
   - 各ステップでスクリーンショットを撮影

4. **確認とサポート**
   - 共有されたスクショを確認
   - 手順通りできているかチェック
   - 問題があれば解決策を提示
   - **止まった箇所・解決方法を記録**
   - 成功するまでサポート

5. **講座の作成**
   - 成功後、スクショを適切な箇所に添付
   - **止まった箇所をトラブルシューティングに記載**
   - 講座マークダウンを作成

6. **追加素材の埋め込み**
   - 画面録画があれば動画を埋め込み
   - 完成物（デプロイURL等）があれば記載

---

## 講座フォーマット仕様

### セクション順序（必須）

```markdown
# タイトル

**所要時間**: XX分
**難易度**: ⭐☆☆☆☆

---

## このモジュールで学ぶこと
（箇条書き）

---

## 学習目標
（「このモジュールを終えると、以下のことができるようになります：」）

---

## 事前準備
### 必要なもの
### 推奨スペック

---

## セクション1: XXXX
（各セクションの最後に「チェックポイント」）

### チェックポイント
- [ ] 確認項目1
- [ ] 確認項目2

---

## セクション2: XXXX
...

---

## トラブルシューティング

記載できるもの：
- ユーザーが実践で実際に止まり、解決した内容
- 信頼できるソース（公式ドキュメント等）に記載されている内容

記載しない：
- 想定だけの内容（検証なし・ソースなし）

### 問題タイトル
**症状**: 何が起きたか
**解決方法**: どう解決したか

---

## まとめ

### このモジュールで学んだこと
### 次のステップ

---

## 参考資料

- [リンクタイトル](URL)

---

## よくある質問

**Q: 質問**
A: 回答
```

### フォーマットルール

| ルール | 説明 |
|--------|------|
| 絵文字禁止 | 見出しや本文に絵文字を使わない |
| チェックポイント | 各セクション末尾に設置 |
| トラブルシューティング | ユーザー実践で止まった箇所を必ず記載 |
| 参考資料 | 公式ドキュメント等のリンクを記載 |
| よくある質問 | 最低3-5個のQ&Aを記載 |

---

## 現在の状態

### 作成済みモジュール

| モジュール | ファイル | 状態 |
|-----------|---------|------|
| 01 | module-01-docker-setup.md | 完了 |
| 02 | module-02-instagram-api-setup.md | 完了 |
| 03 | module-03-instagram-post.md | 完了 |

### Module 01の修正履歴

- [x] 絵文字を削除
- [x] トラブルシューティングをまとめの前に移動
- [x] 「参考リンク」→「参考資料」に変更
- [x] 「よくある質問」セクションをHTMLコメントで追加（内容は未記入）
- 実践で止まった箇所: なし

### Module 02 完了記録

**テーマ**: Instagram API設定とアクセストークン取得

**完了日**: 2025-12-03

**実践で止まった箇所（トラブルシューティングに記載済み）**:
1. developers.facebook.comで「アクセス権がありません」エラー
   - 原因: Business Suiteにログイン中のブラウザでリダイレクトされる
   - 解決: 別ブラウザで直接アクセス
2. 電話番号認証で「一時的なエラー」
   - 解決: クレジットカードで認証
3. アプリ名に「instagram」が使えない
   - 解決: 別の名前を使用
4. 「開発者の役割が不十分です」エラー
   - 原因: Instagramテスターが未追加
   - 解決: アプリの役割 → メンバーを追加 → Instagramテスター選択

**取得した情報**:
- Instagramアカウント: ten_urushibata
- アプリ名: social-post-workflow
- アクセストークン: 取得済み（ユーザーが保管）

### Module 03 実践完了

**テーマ**: n8nでInstagramに投稿するワークフロー構築

**調査日**: 2025-12-03

**実践日**: 2025-12-04

**状態**: 完了（講座作成済み）

---

#### 実践結果

**ワークフロー①: n8n経由でInstagramに投稿** - 成功

| 項目 | 結果 |
|------|------|
| ワークフロー名 | Instagram Post |
| 投稿ID | 18079484714149424 |
| テスト画像 | Unsplash山岳風景 |
| キャプション | n8n test post |

**完成したワークフロー構成**:
```
[Manual Trigger] → [HTTP Request] → [Edit Fields] → [HTTP Request1] → [HTTP Request2]
  (実行開始)        (User ID取得)     (投稿設定)      (コンテナ作成)      (公開)
```

**各ノードの設定**:

1. **When clicking 'Execute workflow'** (Manual Trigger)
   - 手動実行トリガー

2. **HTTP Request** (User ID取得)
   - Method: GET
   - URL: `https://graph.instagram.com/v20.0/me?fields=user_id,username`
   - Query Parameters: access_token

3. **Edit Fields** (投稿設定)
   - Include Other Input Fields: ON
   - image_url: 画像URL
   - caption: キャプション
   - access_token: アクセストークン

4. **HTTP Request1** (メディアコンテナ作成)
   - Method: POST
   - URL: `https://graph.instagram.com/v20.0/{{ $json.user_id }}/media`
   - Query Parameters: image_url, caption, access_token

5. **HTTP Request2** (メディア公開)
   - Method: POST
   - URL: `https://graph.instagram.com/v20.0/{{ $('Edit Fields').item.json.user_id }}/media_publish`
   - Query Parameters: creation_id, access_token

**実践で判明した重要事項**:
- トークンが`IG`で始まる場合（Instagram Login API）は`graph.instagram.com`を使用
- 調査資料の`graph.facebook.com`ではなく`graph.instagram.com`が正解

**実践で止まった箇所**:
- なし（スムーズに完了）

---

#### 調査結果サマリー

n8nにはInstagram専用ノードがないため、**Facebook Graph API**を使用してInstagramに投稿する。投稿は**2ステップのプロセス**で行う。

---

#### 前提条件

| 項目 | 状態 |
|------|------|
| Instagramプロフェッショナルアカウント | Module 02で確認済み |
| Facebookアプリ | Module 02で作成済み（social-post-workflow） |
| アクセストークン | Module 02で取得済み（ユーザー保管） |
| Instagram User ID | 未取得（実践で取得予定） |

---

#### Instagram投稿の2ステップAPI

**Step 1: メディアコンテナ作成**

```
POST https://graph.facebook.com/v20.0/{ig-user-id}/media
```

| パラメータ | 説明 | 必須 |
|-----------|------|------|
| `image_url` | 画像のURL（公開サーバー上に配置必須） | Yes |
| `caption` | 投稿キャプション（ハッシュタグは`%23`にエンコード） | No |
| `access_token` | アクセストークン | Yes |

**レスポンス**: `{ "id": "コンテナID" }`

**Step 2: メディア公開**

```
POST https://graph.facebook.com/v20.0/{ig-user-id}/media_publish
```

| パラメータ | 説明 | 必須 |
|-----------|------|------|
| `creation_id` | Step 1で取得したコンテナID | Yes |
| `access_token` | アクセストークン | Yes |

---

#### n8nワークフロー構成

```
[Manual Trigger] → [Set] → [HTTP Request: Container] → [HTTP Request: Publish]
```

**ノード1: Manual Trigger**
- 手動でワークフローを開始

**ノード2: Set**
- 投稿内容を設定
- `image_url`: テスト用画像URL
- `caption`: テスト投稿キャプション
- `ig_user_id`: Instagram User ID
- `access_token`: アクセストークン

**ノード3: HTTP Request（コンテナ作成）**
- Method: POST
- URL: `https://graph.facebook.com/v20.0/{{ $json.ig_user_id }}/media`
- Body Content Type: Form URL Encoded
- Parameters:
  - `image_url`: `{{ $json.image_url }}`
  - `caption`: `{{ $json.caption }}`
  - `access_token`: `{{ $json.access_token }}`

**ノード4: HTTP Request（公開）**
- Method: POST
- URL: `https://graph.facebook.com/v20.0/{{ $('Set').item.json.ig_user_id }}/media_publish`
- Body Content Type: Form URL Encoded
- Parameters:
  - `creation_id`: `{{ $json.id }}`
  - `access_token`: `{{ $('Set').item.json.access_token }}`

---

#### 制限事項

| 項目 | 制限 |
|------|------|
| 画像形式 | JPEGのみ |
| 投稿制限 | 24時間で25〜50投稿まで |
| 画像URL | 公開サーバー上に配置必須（ローカルファイル不可） |
| 動画投稿時 | コンテナ作成後、ステータスが`FINISHED`になるまで待機が必要 |
| ハッシュタグ | URLエンコード必須（`#` → `%23`） |

---

#### Instagram User IDの取得方法

```
GET https://graph.facebook.com/v20.0/me/accounts?access_token={access_token}
```
→ Facebook Page IDを取得

```
GET https://graph.facebook.com/v20.0/{page-id}?fields=instagram_business_account&access_token={access_token}
```
→ Instagram Business Account IDを取得

---

#### 長期トークン関連

**短期→長期トークン交換**:
```
GET https://graph.facebook.com/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={app-id}
  &client_secret={app-secret}
  &fb_exchange_token={short-lived-token}
```

- 長期トークン有効期限: 60日
- リフレッシュ: 発行から24時間後〜期限切れ前まで可能

---

#### 実践ステップ（ユーザー向け）

1. [ ] n8nを開く
2. [ ] 新しいワークフローを作成
3. [ ] Instagram User IDを取得
4. [ ] テスト用画像URLを準備（公開サーバー上、JPEG形式）
5. [ ] Manual Triggerノードを追加
6. [ ] Setノードを追加（投稿内容設定）
7. [ ] HTTP Requestノードを追加（コンテナ作成）
8. [ ] HTTP Requestノードを追加（公開）
9. [ ] ワークフローを実行
10. [ ] Instagramで投稿を確認
11. [ ] 各ステップでスクリーンショットを撮影

---

#### 参考資料

- [n8n Community: Step-by-Step Guide](https://community.n8n.io/t/step-by-step-guide-how-to-post-to-instagram-via-n8n-automations/61665)
- [WebSensePro: How To Post To Instagram Via N8N](https://websensepro.com/blog/how-to-post-to-instagram-via-n8n-ai-automation/)
- [n8n Workflow Template: Instagram Single Image Post](https://n8n.io/workflows/2537-simple-social-instagram-single-image-post-with-facebook-api/)
- [n8n Workflow Template: Meta Graph API & System User Tokens](https://n8n.io/workflows/5457-automate-instagram-and-facebook-posting-with-meta-graph-api-and-system-user-tokens/)
- [GitHub: Instagram Graph API posting example (PHP)](https://github.com/jstolpe/blog_code/blob/master/instagram_graph_api/posting_content.php)
- [Stack Overflow: Instagram Content Publishing API](https://stackoverflow.com/questions/78826092/how-to-publish-on-instagram-using-graph-api)

### 画像アセット

配置先: `public/n8n-setup/`

**Module 01:**
- 01-customize-screen.png
- 02-license-offer.png
- 03-activation-key.png

**Module 02:**
- 04-developer-register.png
- 05-phone-verify.png
- 06-developer-dashboard.png
- 07-app-create-details.png
- 08-usecase-content.png
- 09-business-portfolio.png
- 10-app-summary.png
- 11-app-dashboard.png
- 12-usecase-list.png
- 13-instagram-api-customize.png
- 14-add-account-popup.png
- 15-app-roles.png
- 16-add-instagram-tester.png
- 17-tester-added.png
- 18-token-generate-ready.png
- 19-instagram-permissions.png
- 20-token-generated.png
- 21-error-no-access.jpg
- 22-error-insufficient-role.png

**Module 03:**
- 23-n8n-dashboard.png
- 24-trigger-panel.png
- 25-manual-trigger-added.png
- 26-node-search.png
- 27-http-request-panel.png
- 28-http-request-url.png
- 29-query-params-on.png
- 30-user-id-result.png
- 31-canvas-after-userid.png
- 32-edit-fields-select.png
- 33-edit-fields-panel.png
- 34-include-input-on.png
- 35-edit-fields-complete.png
- 36-workflow-success.png
- 37-container-request.png
- 38-container-id-result.png
- 39-canvas-after-container.png
- 40-publish-request.png
- 41-post-id-result.png
- 42-instagram-profile.png
- 43-instagram-post.png
- 44-workflow-complete.png

---

## 次に作成すべき講座

**Module 03: n8nワークフロー構築編**

---

## カテゴリ設定

`content/modules/n8n/_category.json`:

```json
{
  "id": "n8n",
  "title": "n8n自動化講座",
  "description": "ノーコードでワークフロー自動化を実現する",
  "icon": "workflow",
  "color": "orange",
  "order": 3,
  "moduleCount": 3
}
```

※ moduleCountは講座追加時に更新する

---

**最終更新**: 2025-12-04 （Module 03 完了）
