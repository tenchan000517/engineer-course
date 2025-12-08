# n8n講座 引き継ぎ資料

**作成日**: 2025-12-02
**作成済み**:
- module-01-docker-setup.md（Dockerセットアップ編）
- module-02-instagram-api-setup.md（Instagram API設定編）
- module-03-instagram-post.md（Instagram投稿ワークフロー編）
- module-04-google-sheets.md（Google Sheets連携編）
- module-05-sheet-design.md（投稿管理シート設計編）
- module-06-post-from-sheet.md（シートからInstagram投稿編）
- module-07-ai-content-setup.md（AIコンテンツ自動生成の準備編）
- module-08-content-generation.md（AIコンテンツ自動生成ワークフロー編）
- module-09-canva-bulk-create.md（Canva一括作成でリール素材を量産）
- module-10-reel-post.md（Google DriveからInstagramリール投稿）
- module-11-schedule-post.md（スケジュール投稿の設定）

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
| 04 | module-04-google-sheets.md | 完了 |
| 05 | module-05-sheet-design.md | 完了 |
| 06 | module-06-post-from-sheet.md | 完了 |
| 07 | module-07-ai-content-setup.md | 完了（リサーチ→ideas反映まで） |
| 08 | module-08-content-generation.md | 完了 |
| 09 | module-09-canva-bulk-create.md | 完了 |
| 10 | module-10-reel-post.md | 完了 |
| 11 | module-11-schedule-post.md | 完了 |

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

**Module 04:**
- 45-api-library-search.png
- 46-sheets-api-result.png
- 47-sheets-api-detail.png
- 48-sheets-api-enabled.png
- 49-oauth-start.png
- 50-oauth-configured.png
- 51-client-type-select.png
- 52-client-settings.png
- 53-client-created.png
- 54-client-list.png
- 55-n8n-credentials.png
- 56-add-credential.png
- 57-credential-form.png
- 58-google-unverified.png
- 59-permission-select.png
- 60-account-connected.png
- 61-sheets-operations.png
- 62-create-spreadsheet.png
- 63-create-success.png
- 64-no-columns.png
- 65-columns-found.png
- 66-sheets-data.png
- 67-get-rows-setting.png
- 68-get-rows-success.png
- 69-update-success.png

**Module 05:**
- 70-apps-script-menu.png
- 71-gas-code.png
- 72-auth-required.png
- 73-unverified-app.png
- 74-permission-confirm.png
- 75-media-sheet-done.png
- 76-gas-log.png
- 77-posts-sheet.png
- 78-test-data-log.png
- 79-test-data-done.png

**Module 06:**
- 80-posts-get-result.png
- 81-media-get-result.png
- 82-userid-result.png
- 83-container-result.png
- 84-publish-result.png
- 85-edit-fields-result.png
- 86-append-update-result.png
- 87-workflow-complete.png

**Module 07:**
- 92-gemini-api-key.png
- 93-n8n-credential-search.png
- 94-n8n-credential-form.png
- 95-antigravity-research.png
- 96-antigravity-json-output.png
- 97-gas-deploy.png
- 98-n8n-sheets-actions.png
- 99-get-rows-config.png
- 100-config-get-success.png
- 101-http-request-success.png

**Module 08:**
- 102-new-workflow-sheets.png
- 103-sheets-actions-list.png
- 104-get-rows-ideas-config.png
- 105-get-rows-ideas-result.png
- 106-workflow-with-switch.png
- 107-switch-initial.png
- 108-switch-complete.png
- 109-gemini-search.png
- 110-gemini-actions.png
- 111-gemini-initial.png
- 112-gemini-output-table.png
- 113-gemini-output-json.png
- 114-code-actions.png
- 115-code-result.png
- 116-workflow-success.png
- 117-append-row-config.png
- 118-append-row-result.png
- 119-update-row-config.png
- 120-update-row-result.png
- 121-ideas-adopted.png
- 122-posts-sheet.png
- 123-workflow-complete.png
- 124-category-a-result.png

**Module 09:**
- 125-canva-sheets-created.png
- 126-canva-bulk-create-app.png
- 127-canva-spreadsheet-select.png
- 128-canva-permission.png
- 129-canva-sheet-connected.png
- 130-canva-data-connect.jpg
- 131-canva-advanced-options.png
- 132-canva-generated-designs.png
- 133-canva-editor-template.jpg
- 134-canva-app-menu.png
- 135-canva-bulk-create-step1.png
- 136-canva-spreadsheet-select.png
- 137-canva-sheet-list.png
- 138-canva-data-bind.jpg
- 139-canva-data-connect-menu.png
- 140-canva-data-field-list.png
- 141-canva-data-bound.png
- 142-canva-advanced-options.png
- 143-canva-generate-confirm.png

---

## 次に作成すべき講座

### 全体ビジョン

**スプレッドシートをコンテンツ管理の中心**に据える。

最終的なフローは未確定。以下の要素を組み合わせる可能性がある：
- 単一画像投稿 / カルーセル投稿 / リール動画投稿
- Canva連携（テンプレート一括生成）
- AI生成（キャプション、画像等）
- スケジュール投稿

Module 04でシートの基盤を固め、実践を通じて最適なフローを決定する。

---

### Module 04 完了記録

**テーマ**: n8nとGoogle Sheetsの連携設定と基本操作

**調査日**: 2025-12-04

**実践日**: 2025-12-04

**状態**: 完了（講座作成済み）

**調査・設計書**: `content/modules/n8n/module-04-research.md`

---

#### 実践結果

| 項目 | 結果 |
|------|------|
| ワークフロー名 | Google Sheets Test |
| 作成したスプレッドシート | n8n-test |
| spreadsheetId | 1jnsUM1eNojeLmAGkZwEzLetBrB2CUjzRVoJ_3uKmKIQ |
| テストデータ | POST-001, DRAFT→READY, テスト投稿1 |

**完成したワークフロー構成**:
```
[Manual Trigger] → [Google Sheets] → [Google Sheets1] → [Google Sheets2] → [Google Sheets3]
  (実行開始)        (Create)          (Append Row)       (Get Rows)         (Update Row)
```

**実践で止まった箇所（トラブルシューティングに記載済み）**:
1. access_deniedエラー
   - 原因: テストユーザーが追加されていなかった
   - 解決: OAuth同意画面→対象→テストユーザー追加
2. No columns found in Google Sheets
   - 原因: スプレッドシートにヘッダー行がなかった
   - 解決: 1行目にpost_id, status, captionを入力

---

### Module 04: Google Sheets連携（基本）（計画との差分）

**当初計画**: 投稿管理用シート（posts/media）の構築まで

**実際の完了範囲**: 基本操作（Create/Append/Get/Update）まで

**残タスク**: Phase 3（投稿管理シートの本格構築）は次回以降

---

### Module 05: 投稿管理シート設計（シート作成完了）

**テーマ**: サステナブルな投稿管理システムの設計

**調査日**: 2025-12-04

**実践日**: 2025-12-04

**状態**: シート作成・テストデータ投入完了、投稿フロー未実装

**調査・設計書**: `content/modules/n8n/module-05-research.md`

**講座ファイル**: `content/modules/n8n/module-05-sheet-design.md`

---

#### 完了した内容

1. GASでpostsシート・mediaシートを作成
2. GASでテストデータを投入（POST-001, MEDIA-001）

#### 次回実装する内容

n8nで投稿フローを作成：
```
[Manual Trigger]
   ↓
[Google Sheets: Get Rows] ← status=READY
   ↓
[Instagram投稿処理]
   ↓
[Google Sheets: Update] ← status=PUBLISHED
```

#### 実践で止まった箇所

- なし（スムーズに完了）

---

### Module 06 実践記録

**テーマ**: postsシートからデータを取得してInstagramに投稿

**実践日**: 2025-12-05

**状態**: 完了

---

#### 完了した内容

1. postsシートからstatus=READYのデータ取得
2. mediaシートからpublic_url取得
3. Instagram User ID取得
4. メディアコンテナ作成
5. Waitノードで待機（5秒）
6. メディア公開 → Instagram投稿成功
7. Edit Fieldsでデータ整形
8. Append or update rowでシート更新 → 成功

#### 解決した問題

**シート更新が動作しない問題**

- 原因1: 「Update row」ではなく「**Append or update row**」を使用する必要があった
- 原因2: 式を入力する際に **fx** をクリックして **Expressionモード** にする必要があった（そうしないと式が文字列としてそのまま保存される）

#### 実践で止まった箇所（トラブルシューティングに記載済み）

1. API access blocked
   - 原因: 開発者ダッシュボードが「不正なアクティビティ」で制限されていた
   - 解決: ダッシュボードの復元

2. Media ID is not available
   - 原因: コンテナ作成から公開までの間隔が短すぎた
   - 解決: Waitノード（5秒）を追加

---

#### 調査結果サマリー

**1. Instagramカルーセル投稿**
- APIフロー: 各画像コンテナ作成（is_carousel_item=true）→ カルーセルコンテナ作成 → 公開
- 制限: API経由は最大10枚、JPEG形式のみ
- n8n実装: Google Sheets + Cloudinary + Graph API のワークフローが多数

**2. Instagramリール投稿**
- APIフロー: リールコンテナ作成 → ステータスポーリング（FINISHED確認）→ 公開
- 動画仕様: 3秒〜15分、MOV/MP4、H264/HEVC、9:16推奨
- 2025年更新: video_urlはダイレクト公開URL必須（Google Driveリンク不可）

**3. Canva連携**
- **採用方式: Canvaシート + 一括作成（Bulk Create）**
- 対応プラン: Pro / Teams（デスクトップブラウザのみ）
- できること: テキスト一括変更、画像/動画差し替え、一括ダウンロード
- n8nとの連携: 未実証（実装時に検証）
- 想定フロー: n8nでデータ管理 → Canva GUIで一括作成（手動）→ n8nで投稿

**4. リサーチから投稿まで**
- 一般的なフロー: リサーチ（Apify/Trends）→ AI生成（GPT/Gemini）→ 画像生成（DALL-E/Replicate）→ 投稿
- 全てn8nで自動化可能

**5. 複数投稿のバッチ処理**
- Google Sheetsをステータス管理の中心に
- Schedule Trigger（Cron）で定期実行
- API制限: 24時間で50投稿まで

---

#### シート設計（最終版）

**メインシート: `posts`（投稿管理）**

| 列名 | 型 | 説明 |
|------|-----|------|
| post_id | TEXT | 一意の投稿ID（POST-001） |
| post_type | TEXT | IMAGE / CAROUSEL / REELS |
| status | TEXT | DRAFT / READY / PROCESSING / PUBLISHED / FAILED |
| caption | TEXT | キャプション本文 |
| hashtags | TEXT | ハッシュタグ（カンマ区切り） |
| media_ids | TEXT | 参照するメディアID（カンマ区切り） |
| scheduled_at | DATETIME | 投稿予定日時 |
| published_at | DATETIME | 実際の投稿日時 |
| ig_post_id | TEXT | Instagram投稿ID |
| share_to_feed | BOOLEAN | リールをフィードにも表示 |
| thumb_offset_ms | NUMBER | サムネイル位置（ミリ秒） |
| error_message | TEXT | エラーメッセージ |
| retry_count | NUMBER | リトライ回数 |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |
| notes | TEXT | メモ |

**サブシート: `media`（メディア管理）**

| 列名 | 型 | 説明 |
|------|-----|------|
| media_id | TEXT | 一意のメディアID（MEDIA-001） |
| media_type | TEXT | IMAGE / VIDEO |
| source | TEXT | URL / CLOUDINARY / CANVA / AI_GENERATED / DRIVE |
| original_url | TEXT | 元のURL/パス |
| public_url | TEXT | 公開URL（Instagram投稿用） |
| cloudinary_id | TEXT | Cloudinary Public ID |
| canva_design_id | TEXT | CanvaデザインID |
| filename | TEXT | ファイル名 |
| width | NUMBER | 幅（px） |
| height | NUMBER | 高さ（px） |
| duration_sec | NUMBER | 動画の長さ（秒） |
| status | TEXT | PENDING / UPLOADING / READY / ERROR |
| ig_container_id | TEXT | Instagram Container ID |
| error_message | TEXT | エラーメッセージ |
| created_at | DATETIME | 作成日時 |

---

#### 次回セッションへの指示

**目的**: Module 05の講座作成

**実践内容**:
1. 設計したpostsシートとmediaシートをn8n-testスプレッドシートに作成
2. サンプルデータを投入
3. n8nから読み書きできることを確認
4. 各ステップでスクリーンショットを撮影

**既存リソース**:
- 調査・設計書: `content/modules/n8n/module-05-research.md`
- テスト用スプレッドシート: n8n-test (ID: 1jnsUM1eNojeLmAGkZwEzLetBrB2CUjzRVoJ_3uKmKIQ)

---

### Module 07 実践記録

**テーマ**: AIリサーチ → ideasシート自動反映システム構築

**実践日**: 2025-12-05

**状態**: 完了

---

#### 完了した内容

1. リサーチフロー設計（Antigravity → JSON → config → n8n → GAS → ideas）
2. シート作成（config/ideas/archive）
3. GAS作成（setupResearchSheets, doPost）
4. GASのWebアプリデプロイ
5. n8nワークフロー作成（Research to Ideas）
6. リサーチプロンプト完成（93件、カテゴリ配分はAI判断）
7. 投稿運用設計（1日3投稿、カテゴリローテーション）

#### 方針変更

当初設計していた大カテゴリ・中カテゴリ・小カテゴリの3層構造を廃止。

**変更前**:
- large_categories（大カテゴリ）
- medium_categories（中カテゴリ）
- small_categories（小カテゴリ）

**変更後**:
- config（JSON一時保存）
- ideas（投稿企画管理）← 旧small_categoriesを統合
- archive（投稿済み保管）

#### ideasシート構造

| 列名 | 説明 |
|------|------|
| idea_id | IDEA-001 |
| month | 2025-12 |
| title | 投稿タイトル |
| tools | ツール名（カンマ区切り） |
| content_type | 比較/使い方/解説等 |
| category | A〜E |
| research_points | 追加リサーチ項目 |
| status | NEW / ADOPTED / REJECTED |
| adopted_post_id | 採用時のpost_id |
| created_at | 作成日時 |

#### カテゴリ定義

| 記号 | 内容 |
|------|------|
| A | 比較・対決系 |
| B | 時短・効率化系 |
| C | 先端トレンド・自動化系 |
| D | ネガティブ・警告系 |
| E | まとめ・ランキング系 |

#### 投稿運用設計

- 1日3投稿（異なるカテゴリから選択）
- カテゴリローテーション（A→B→C→D→E→A...）
- 枯渇したカテゴリはスキップ
- 月1回リサーチ実行で企画補充

#### GASデプロイURL

```
https://script.google.com/macros/s/AKfycbxAEygT0YpriN3vU2rv0gJMSBU0qvXLHRX4o4EsT2g9erZOenm-hrVwVjgXdLYjOB8n/exec
```

#### 実践で止まった箇所（トラブルシューティングに記載済み）

1. スクリプト関数が見つかりません: doPost
   - 原因: doPost関数未追加、または古いデプロイ
   - 解決: 関数追加後、**新しいデプロイ**を作成

2. Cannot read properties of undefined (reading 'small')
   - 原因: HTTP Requestの設定ミス（Using Fields Below）
   - 解決: Specify Body を **Using JSON** に変更

---

### Module 08: 追加リサーチ→コンテンツ生成（計画中）

**テーマ**: ideasシートから追加リサーチを行い、投稿コンテンツを自動生成

**状態**: 調査中

**重要**: 1投稿につき1ワークフロー実行（Module 07のリサーチとは別ワークフロー）

---

#### 課題: postsシートの拡張が必要

**現状の問題**:
- 現在のpostsシートは `caption` と `hashtags` のみ
- カルーセル投稿・リール動画投稿には**台本（script）**が必要

**最終目標（投稿形式）**:
- カルーセル投稿（複数画像）
- リール動画投稿（ナレーション・テロップ付き）

**必要な生成物**:
| 要素 | 用途 |
|------|------|
| 台本（script） | リール動画のナレーション・テロップ用 |
| キャプション（caption） | 投稿に表示されるテキスト |
| ハッシュタグ（hashtags） | 発見性向上 |

---

#### 方針: postsシートにJSON列を追加

**案**: `content_json` 列を追加し、台本・キャプション・ハッシュタグをJSON形式で格納

```json
{
  "script": {
    "scenes": [
      { "text": "AIツール比較してみた", "duration": 3 },
      { "text": "まずはChatGPT", "duration": 5 }
    ],
    "total_duration": 8
  },
  "caption": "AIツール徹底比較！",
  "hashtags": ["AI", "ChatGPT", "比較"]
}
```

**メリット**:
- 1セルで構造化データを管理できる
- 拡張しやすい（シーン情報、duration等）

**デメリット**:
- n8nでパースが必要
- シート上での直接編集がしづらい

---

#### 調査結果: Canva自動化の「壁」と「抜け道」（2025-12-05）

YouTube調査（「Canva bulk create automation n8n」等で検索）の結果：

**1. 「一括作成 (Bulk Create)」機能は自動化できない**
- YouTube上の「Canva Bulk Create」系動画の99%は「CSVアップロード→手動適用」の内容
- n8nから「一括作成ボタン」を直接押すAPIは存在しない

**2. 「Autofill」APIなら可能（ただし上級者向け）**
- Canva Developer APIを使えばテンプレートの文字・画像差し替えは可能
- デメリット: 設定が非常に複雑（Canvaでアプリ開発者登録が必要）
- 個人利用にはハードルが高い → **採用しない**

**3. Creatomateが現実的な代替ツール**
- 「Canvaのような操作感で、APIで完全自動化」が可能
- Canvaで作ったデザインを画像として書き出し、Creatomateで文字だけ乗せる「ハイブリッド手法」も推奨されている

---

#### 採用候補

**A案: 半自動（Canva一括作成を手動実行）**

```
[n8n] → CSV生成 → Google Driveに保存
                        ↓
              [手動] Canvaで読み込み→生成
                        ↓
              [手動 or n8n] Instagram投稿
```

- メリット: 簡単、デザイン自由度高い
- デメリット: 毎回「一括作成ボタン」を手動で押す必要あり
- 用途: カルーセル画像向け

**C案: ハイブリッド（Canva + Creatomate）**

```
[Canva] 背景デザイン作成（テンプレート）
           ↓
[n8n] → Creatomate API → 文字入れ・動画化
           ↓
[n8n] → Instagram投稿
```

- メリット: Canvaのデザイン力 + 完全自動化
- デメリット: ツール2つの学習コスト、Creatomate利用料
- 用途: リール動画向け

---

#### 方針

- **まずA案（半自動）で運用フローを確立**
- 手動部分は「Canvaで一括作成ボタンを押す」だけなら許容範囲
- 運用しながら「ここを自動化したい」というニーズが見えたらC案へ移行検討
- リール動画は別途検討（Creatomate、CapCut、手動編集など）

---

#### ワークフロー構成（想定）

```
[Manual Trigger or Schedule]
    ↓
[Google Sheets: Get ideas] ← status=NEW, category指定
    ↓
[Gemini: 追加リサーチ] ← research_pointsを元に調査
    ↓
[Gemini: コンテンツ生成] ← 台本・キャプション・ハッシュタグをJSON出力
    ↓
[Google Sheets: postsに追加] ← content_json列に格納
    ↓
[Google Sheets: ideas更新] ← status=ADOPTED
```

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
  "moduleCount": 4
}
```

※ moduleCountは講座追加時に更新する

---

## n8n ナレッジ

### データフロー

- 全てのデータはJSONオブジェクトの配列として渡される
- 各ノードは前のノードの出力を自動的に受け取る
- `$json` で前のノードのデータにアクセス

### トリガーの種類

| トリガー | 用途 |
|---------|------|
| Schedule Trigger | 定期実行（Cron） |
| Manual Trigger | 手動実行 |
| Webhook Trigger | 外部からのHTTPリクエスト |
| Form Trigger | フォーム入力 |

### Form Trigger

- n8nがフォームのWebページを自動生成する
- ユーザーがフォームに入力して送信 → 入力データがJSONとしてワークフローに流れる
- Test URL（デバッグ用）と Production URL（本番用）がある
- フィールドタイプ：Text, Textarea, Email, Number, Date, Dropdown, File, Hidden Field など

### 参考

- [Data flow within nodes](https://docs.n8n.io/data/data-flow-nodes/)
- [Data structure](https://docs.n8n.io/data/data-structure/)
- [Form Trigger node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger/)

### n8nワークフローJSONのフォーマット仕様

n8nワークフローをJSONで作成・修正する際の重要な仕様。

**Google Sheetsノードの正しい構造**:

```json
{
  "documentId": {
    "__rl": true,
    "value": "スプレッドシートID",
    "mode": "list",
    "cachedResultName": "スプレッドシート名",
    "cachedResultUrl": "https://docs.google.com/spreadsheets/d/..."
  },
  "sheetName": {
    "__rl": true,
    "value": 123456789,  // 数値のgid（文字列ではない）
    "mode": "list",
    "cachedResultName": "シート名",
    "cachedResultUrl": "https://...#gid=123456789"
  },
  "columns": {
    "mappingMode": "defineBelow",
    "value": { ... },
    "matchingColumns": [],
    "schema": [ ... ],  // 列のスキーマ定義が必須
    "attemptToConvertTypes": false,
    "convertFieldsToString": false
  }
}
```

**重要ポイント**:
- `documentId.mode`: 必ず `"list"`（`"id"` ではない）
- `sheetName.value`: 数値のgid（文字列のシート名ではない）
- `columns.schema`: 配列で列定義が必須
- `typeVersion`: `4.7`（古いバージョンだと動作しない場合あり）

**参照すべきファイル**:
- `content/modules/n8n/Create posts.json` - 正常動作するワークフローの実例

**受講者向けダウンロード用JSON**:
- プレースホルダー（`YOUR_SPREADSHEET_ID`等）を使用
- 受講者が自分の環境に合わせて置換して使用

---

**最終更新**: 2025-12-08（Module 11完了、n8n講座全11モジュール完成）

---

### Module 11 実践記録

**テーマ**: スケジュール投稿の設定

**実践日**: 2025-12-08

**状態**: 完了

---

#### 完了した内容

1. タイムゾーン設定確認（GENERIC_TIMEZONE=Asia/Tokyo）
2. Schedule Triggerの追加（Cron式: `0 0 6,12,18 * * *`）
3. リトライループの実装（status_code = FINISHEDまで待機）
4. ワークフローの有効化とテスト

#### 実践で止まった箇所（トラブルシューティングに記載済み）

1. Media ID is not available
   - 原因: 動画処理が完了していない（Wait 60秒でも不足）
   - 解決: リトライループを実装（IF status_code = FINISHED → Publish、else → Wait 30s → Check Status）

2. Google Drive API 500 Internal Error
   - 原因: Google API側の一時的な問題
   - 解決: しばらく時間を空けて再実行

#### ワークフロー構成（最終版）

```
[Schedule Trigger] ← 毎日6:00, 12:00, 18:00
    ↓
[Get DRAFT Posts]
    ↓
[Loop] ← 1件ずつ処理
    ↓
[Get Category from Pattern]
    ↓
[Search Category Folder] → [Search Video File] → [IF File Exists]
    ↓                                                ├── True → 投稿処理
[Upload to Cloudinary]                               └── False → Loopへ戻る
    ↓
[Get User ID] → [Create Reel Container]
    ↓
[Wait 30s] ←──────────────┐
    ↓                     │
[Check Container Status]  │
    ↓                     │
[IF status_code = FINISHED]
    ├── True → [Publish Reel] → [Edit Fields] → [Update Posts Sheet]
    └── False ───────────────┘
```

#### 講座ファイル

- `content/modules/n8n/module-11-schedule-post.md`

#### ユーザー用ダウンロードJSON

- `content/modules/n8n/download/scheduled-reel-post-workflow.json`

---

## 確定: 生成するコンテンツ仕様

### 採用する投稿形式

**リール動画（60秒）**

YouTubeショート（1万〜30万再生クラス）の徹底調査に基づき、AI/自動化ツール紹介で鉄板の台本パターン5種類を採用。

---

### 台本パターン5選

#### パターン1: 即効ハック型「まだ〇〇で消耗してるの？」

視聴者の「損したくない」心理を突く王道パターン。

| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-3秒 | 「まだ手動で〇〇してるの？」「これ知ってたら残業ゼロだったのに...」 |
| Problem | 3-10秒 | 手作業でコピペしている辛い映像（Excel地獄など）を早回し |
| Solution | 10-50秒 | 「このAIツールを使えば一瞬。」→ 実際のツール画面でボタンを押し、爆速で完了する様子（BGMのドロップに合わせて完了） |
| CTA | 50-60秒 | 「ツールの詳細はプロフのリンクから！」 |

---

#### パターン2: ビフォーアフター型「劇的改善」

視覚的インパクトで惹きつける。デザイン系・動画生成系に強い。

| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | Before（ダサい資料）とAfter（プロ級デザイン）を並べて見せる。「これ、実はAIで30秒です」 |
| Problem | 5-10秒 | 「デザイナーに頼むと高いし、自分でやると時間がかかる...」 |
| Solution | 10-50秒 | ツール（Canva AIやCreatomate）にテキストを入力するだけで、Afterのクオリティが出来上がる過程を早回し |
| CTA | 50-60秒 | 「作り方はコメント欄で解説！」 |

---

#### パターン3: ランキング型「最強ツール3選」

保存率（後で見返す率）が高く、アルゴリズムに好かれやすい。

| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「2025年、知らないとヤバいAIツール TOP3」 |
| Problem | 5-10秒 | 「AIツール多すぎて何使えばいいかわからないですよね？」 |
| Solution | 10-50秒 | 3位：〇〇（一言でメリット）、2位：△△（意外な機能）、1位：××（圧倒的な機能を見せる） |
| CTA | 50-60秒 | 「あなたが使ってるのはどれ？コメントで教えて！」 |

---

#### パターン4: 裏技暴露型「99%が知らない機能」

優越感と好奇心を刺激。既存の有名ツールの知られざる機能紹介に最適。

| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「Canvaのこの機能、99%の人が知りません」「実は〇〇、こう使うと化けます」 |
| Problem | 5-10秒 | 「普通に使ってるだけじゃもったいない！」 |
| Solution | 10-50秒 | 隠れたメニューや、特定の組み合わせ（n8n × Canvaなど）で実現できる「魔法のような挙動」を実演 |
| CTA | 50-60秒 | 「忘れないように保存して試してみて！」 |

---

#### パターン5: VS対決型「どっちが優秀？」

比較検討層に刺さり、コメント欄での議論（エンゲージメント）を誘発。

| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「Canva vs Creatomate、自動化するならどっち？」 |
| Problem | 5-10秒 | 「似てるけど、実は決定的な違いがあります」 |
| Solution | 10-50秒 | 画面を分割して、同じ作業を同時にスタート。Canva：手動でポチポチ（遅い）、Creatomate：全自動で爆速完了（速い）。結論：「大量生産ならこっちの勝ち」 |
| CTA | 50-60秒 | 「あなたはどっち派？コメントで投票して！」 |

---

### 台本構造の共通フレーム

```
Hook（掴み）→ Problem（問題提起）→ Solution（解決策/デモ）→ CTA（行動喚起）
```

全パターン共通で60秒構成。

---

### postsシートのcontent_json構造（確定版）

```json
{
  "post_type": "REEL",
  "pattern": "instant_hack",
  "sections": {
    "hook": {
      "duration": "0-3秒",
      "text": "まだ手動でデータ入力してるの？"
    },
    "problem": {
      "duration": "3-10秒",
      "text": "Excel地獄で毎日残業...",
      "visual": "手作業でコピペしている辛い映像を早回し"
    },
    "solution": {
      "duration": "10-50秒",
      "text": "このAIツールを使えば一瞬",
      "demo_steps": [
        "n8nを開く",
        "Google Sheetsノードを追加",
        "ボタンを押すと一瞬で完了"
      ]
    },
    "cta": {
      "duration": "50-60秒",
      "text": "ツールの詳細はプロフのリンクから！"
    }
  },
  "caption": "[キャプション全文]",
  "hashtags": ["AI", "自動化", "n8n", "時短", "効率化", "AIツール", "ワークフロー", "業務効率化", "ノーコード", "仕事術", "残業ゼロ", "DX"]
}
```

### pattern値の対応

| pattern値 | 台本パターン |
|-----------|-------------|
| instant_hack | 即効ハック型 |
| before_after | ビフォーアフター型 |
| ranking | ランキング型 |
| secret_feature | 裏技暴露型 |
| versus | VS対決型 |

---

### 生成フロー（Module 08で実装）

```
[Manual Trigger]
    ↓
[Google Sheets: Get ideas] ← status=NEW, 1件取得
    ↓
[Gemini: 追加リサーチ] ← research_pointsを元に調査
    ↓
[Gemini: コンテンツ生成] ← 9ページ構造をJSON出力
    ↓
[Google Sheets: postsに追加] ← content_json列に格納, status=DRAFT
    ↓
[Google Sheets: ideas更新] ← status=ADOPTED
```

---

### Module 09 Canva一括作成（講座作成完了）

**テーマ**: Canva Bulk Create（一括作成）でリール素材を量産

**状態**: 講座作成完了

**実践日**: 2025-12-07

**講座ファイル**: `content/modules/n8n/module-09-canva-bulk-create.md`

---

#### 2025-12-07 講座作成完了

**完了した内容**:

1. Canvaテンプレート作成（カテゴリA: VS対決型）
2. Googleスプレッドシート直接接続
3. データ紐づけ（hook, title_1〜3, step3_1〜3など）
4. 高度なオプション設定（デザイン名、保存先フォルダ）
5. 5件のデザイン一括生成

**実践で止まった箇所**: なし（スムーズに完了）

---

#### 将来的な改善案（メモ）

**デザイン名の整理**: 現在は`title_1`列のデータをデザイン名に使用しているが、以下のように改善可能。

- スプレッドシートに`design_name`列を追加
- 数式で「カテゴリ + 日付 + タイトル」を結合
  - 例: `=category & "_" & TEXT(created_at, "YYYYMMDD") & "_" & title_1`
  - 結果: `A_20251207_Antigravity`
- 一括作成時に`design_name`列をデザイン名に指定

これにより、Canvaのプロジェクト一覧で整理しやすくなる。

---

#### 2025-12-07 列構造の簡素化（Canvaエラー対策）

**問題**: Canva一括作成でテキストフィールドが多すぎてエラー

**対策**: 列数を23列→15列に削減（改行区切りで統合）

**旧構造（23列）**:
```
post_id, narration_1, narration_2, hook, title_1, title_2, title_3,
problem_1, problem_2, problem_3,
step1_title, step1_1, step1_2, step1_3,
step2_title, step2_1, step2_2, step2_3,
step3_title, step3_1, step3_2, step3_3, cta
```

**新構造（15列）**:
```
post_id, narration_1, narration_2, hook, title_1, title_2, title_3,
problems, step1_title, step1_content, step2_title, step2_content, step3_title, step3_content, cta
```

**変更点**:
- `problem_1〜3` → `problems`（改行区切り）
- `step1_1〜3` → `step1_content`（改行区切り）
- `step2_1〜3` → `step2_content`（改行区切り）
- `step3_1〜3` → `step3_content`（改行区切り）

**修正したファイル**:
1. `SNS投稿作成.json` - Geminiプロンプト（全5カテゴリ）を新JSON出力形式に変更
2. `Canva用シート振り分け2.json` - Parse JSONノードと各Appendノードを新列構造に対応

**Geminiプロンプト改善**:
- hookの良い例を追加（「知らないと損する！」「結論すごいのはどっち？」等）
- step内容の悪い例を明示（「導入のし易さ差」等の不自然な日本語を禁止）
- 自然な日本語を使用するよう指示

**手動で必要な作業**:
- canva_A〜Eシートのヘッダーを新構造に変更
- archiveシートのヘッダーも新構造に変更（必要に応じて）

---

#### 2025-12-07 ワークフロー修正

**完了した内容**:

1. **SNS投稿作成ワークフロー（`SNS投稿作成.json`）**
   - シンプルな構造に書き直し（Create posts.jsonベース）
   - ループ構造: SplitInBatches（batchSize=1）で1件ずつ処理
   - 各カテゴリ5件制限: Codeノードで制限
   - Wait 5秒: API制限対策
   - **重要**: Loopノードの接続は `main[1]`（Loop Branch）をSwitchへ接続

2. **Canva用シート振り分けワークフロー（`Canva用シート振り分け2.json`）**
   - 冒頭にHTTP Requestノード追加（GAS呼び出し）
   - archiveシートへコピー → canva_A〜Eクリア → 振り分け処理

3. **GAS追加**
   - `setupArchiveSheet()`: archiveシートを新構造で作成（一度きり使用）
   - `archiveAndCleanCanvaSheets()`: canva_A〜E → archive へコピー後クリア
   - doPostに `action: archiveAndCleanCanvaSheets` 分岐を追加

4. **archiveシート（旧構造、25列 - 要更新）**
   - gid: `1297112052`
   - 列: 新構造に合わせて更新が必要

---

#### canva_A〜Eシートのgid（固定）

```
canva_A: 1459009746
canva_B: 1989446321
canva_C: 10904001
canva_D: 920483375
canva_E: 1645982552
archive: 1835489622
```

**注意**: `recreateCanvaSheets()`はシートを削除→作成するためgidが変わる。
運用中は `archiveAndCleanCanvaSheets()` でクリアのみ行い、gidを維持する。

---

#### GASデプロイURL

```
https://script.google.com/macros/s/AKfycbzKG2-JfMU9wcuF9r8jC5JJoAU-P26qiqmFnWURQyVgxxVdvGzeB8gsP3xJy9_3hqEp/exec
```

---

#### ワークフロー構造

**SNS投稿作成（`SNS投稿作成.json`）**:
```
[Manual Trigger]
    ↓
[Get Ideas (status=NEW)] ← 全件取得
    ↓
[Limit 5 per Category] ← Codeノードで各カテゴリ5件に制限
    ↓
[Loop] (SplitInBatches batchSize=1)
    ├── Loop Branch (main[1]) → [Switch] → Gemini A/B/C/D/E
    │                              ↓
    │                          [Parse JSON]
    │                              ↓
    │                          [Append to posts]
    │                              ↓
    │                          [Update ideas ADOPTED]
    │                              ↓
    │                          [Wait 5s] → Loopへ戻る
    └── Done Branch (main[0]) → 終了
```

**Canva用シート振り分け（`Canva用シート振り分け2.json`）**:
```
[Manual Trigger]
    ↓
[Archive & Clean Canva Sheets] ← HTTP POST → GAS
    ↓
[Get DRAFT Posts]
    ↓
[Parse JSON & Category]
    ↓
[Switch Category] → Append to canva_A/B/C/D/E
```

---

#### VS対決型（カテゴリA）のtitle仕様

Geminiプロンプトで以下のように指定：
- `title_1`: 対決の左側（ツール名など）例: 「Antigravity」
- `title_2`: 「VS」（固定）
- `title_3`: 対決の右側（比較対象）例: 「従来の開発」

---

#### 2025-12-08 Module 09 実践完了

**完了した内容**:

1. Canvaテンプレートのコピーを作成（エラー回避）
2. スプレッドシート接続・データ紐づけ
3. 5件のデザイン一括生成
4. MP4形式で一括ダウンロード
5. Google Driveにアップロード（`n8n-instagram/202512Instagram投稿A`）

**実践で止まった箇所（トラブルシューティングに記載済み）**:
- 一括作成で「技術的なエラー」（400 Bad Request）
  - 原因: テンプレートの内部状態の問題
  - 解決: テンプレートの「コピーを作成」で新しいコピーを使用

**Google DriveフォルダURL**:
```
https://drive.google.com/drive/folders/1fNld8ykqqtTtpt44EHdojgT7taTPrLDp
```

**画像アセット追加**:
- 144-canva-generated-results.png（生成結果一覧）
- 145-canva-download-mp4.png（MP4ダウンロード画面）
- 146-drive-uploaded-videos.png（Driveアップロード完了）

---

### Module 10: Google DriveからInstagramリール投稿（完了）

**テーマ**: Google Driveに保存した動画をInstagramリールとして投稿

**状態**: 完了（講座作成済み）

**実践日**: 2025-12-08

**講座ファイル**: `content/modules/n8n/module-10-reel-post.md`

**ワークフローJSON**: `content/modules/n8n/リール動画投稿.json`

**ユーザー用JSON**: `content/modules/n8n/download/reel-post-workflow.json`

---

#### 重要な技術的発見（2025-12-08）

**Google DriveのURLはInstagram APIで使用不可**

2025年1月からMetaの要件が変更され、Google DriveのURLは直接Instagram APIに渡せなくなった。

- **問題**: Google DriveのURLはリダイレクト、認証トークンを含む
- **解決策**: Cloudinary経由でアップロード

**Cloudinary設定**:
- Cloud name: `doaf4wodr`
- Upload preset: `instagram_reel`（Unsigned）
- 無料プラン（月25クレジット）

---

#### 完成したワークフロー構成

```
[Manual Trigger]
    ↓
[Get DRAFT Posts] ← 全件取得
    ↓
[Loop] ← 1件ずつ処理
    ↓
[Get Category from Pattern] ← content_jsonからpattern取得→カテゴリ判定
    ↓
[Search Category Folder] ← 該当フォルダを検索（alwaysOutputData: true）
    ↓
[Search Video File] ← post_idでファイル検索（alwaysOutputData: true）
    ↓
[IF File Exists]
    ├── Yes → [Upload to Cloudinary] → [Get User ID] → [Create Reel Container]
    │              ↓
    │         [Wait 15s] → [Check Container Status] → [Publish Reel]
    │              ↓
    │         [Edit Fields] → [Update Posts Sheet] → 終了
    └── No → [Loop]へ戻る（次のDRAFTを試す）
```

---

#### 解決した問題

**動画ファイルが存在しないDRAFTでエラー停止する問題**

- **原因**: Search Category FolderやSearch Video Fileで結果が0件の場合、次のノードにデータが渡らずLoopに戻れなかった
- **解決策**: 両ノードに`alwaysOutputData: true`を設定し、結果が0件でも空データを次に渡すように変更

---

#### 画像アセット

**Module 10:**
- 148-cloudinary-dashboard.jpg
- 149-cloudinary-upload-presets.png
- 150-cloudinary-preset-list.png
- 151-cloudinary-preset-settings.png
- 152-n8n-cloudinary-upload.png
- 153-workflow-overview.png
- 154-create-reel-container.png
- 155-get-user-id-result.png
- 156-container-status.png

**Module 11:**
- 157-trigger-select.png（トリガー選択画面）
- 158-schedule-trigger-config.png（Schedule Trigger設定）
- 159-retry-loop-complete.png（リトライループ完成図）
- 160-workflow-active.png（Workflow activatedダイアログ）
- 161-executions-list.png（実行履歴画面）
- 162-timezone-check.png（タイムゾーン確認）
- 163-production-checklist.png（Production Checklistダイアログ）

---

#### カテゴリとパターンの対応

| カテゴリ | パターン名 | 内容 | フォルダ名例 |
|---------|-----------|------|------------|
| A | versus | 比較・対決系 | 202512Instagram投稿A |
| B | instant_hack | 時短・効率化系 | 202512Instagram投稿B |
| C | secret_feature | 先端トレンド・裏技系 | 202512Instagram投稿C |
| D | warning | 警告系 | 202512Instagram投稿D |
| E | ranking | ランキング系 | 202512Instagram投稿E |

---

#### Google Drive フォルダ構造

```
n8n-instagram (ID: 1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo)
├── 202512Instagram投稿A (ID: 1fNld8ykqqtTtpt44EHdojgT7taTPrLDp)
│   ├── POST-xxx.mp4
│   └── ...
├── 202512Instagram投稿B/
├── 202512Instagram投稿C/
├── 202512Instagram投稿D/
├── 202512Instagram投稿E/
└── csv/
```

---

#### Canva Bulk Create 重要設定

1. **データソース**: Google スプレッドシートを直接選択
2. **高度なオプション**: 「〇個のデザイン」を選択（「1つのデザインで複数ページ」ではない）
3. **データ紐づけ**: テキストボックスを右クリック → 「データを接続」

---

#### 注意事項

- Canva Proが必須
- Canva APIでの完全自動化はEnterprise必須で不可能
- GASコード変更時は新しいデプロイが必要

---

### VEO2 口パク動画作成プロンプト（メモ）

**用途**: Google AI StudioでVEO2を使用し、立キャラクターの口パク動画を作成

**設定**:
| 項目 | 値 |
|------|-----|
| Model | Veo 2 |
| Aspect ratio | 9:16 |
| Video duration | 8s |
| Frame rate | 24 fps |
| Output resolution | 720p |

**プロンプト**:
```
ANIMATED STILL IMAGE - Frame is completely frozen, only character animates inside.
Camera: NONE (this is like an animated photograph)
Frame: Static wide shot, locked from first to last frame
Zoom: PROHIBITED - maintain exact same framing throughout
2D anime character idle animation in full-body view:
- Eye blinking (every 3-5 seconds)
- Mouth movement for lip-sync (closed/open alternating)
- Breathing motion (subtle chest movement)
- Light head bobbing (minimal)
The frame boundary does not move. The character animates within a fixed frame.
Like a living portrait - the portrait frame stays still, the subject inside moves.
Full body visible, centered composition, clean background, 24fps smooth animation.
```

**ネガティブプロンプト**:
```
camera zoom, camera pan, camera movement, cropped frame, close-up shot, changing composition, moving camera, dynamic angles, 3D render, realistic photo, distorted face, inconsistent art style, choppy animation, frozen expression, no eye movement, static mouth, unnatural blinking, morphing features, background clutter, low quality, blurry, artifacts, watermark, text overlay, multiple characters, walking, running, large body movement.
```

**参考画像**: 2Dアニメキャラクターの全身画像をアップロードして使用


Walkthrough: Automating Narration with n8n and Fish Audio
This guide explains how to use the provided n8n workflow template to generate narrations automatically.

Prerequisites
n8n installed (Cloud or Self-hosted).
Fish Audio Account & API Key.
Google Account (for Sheets and Drive).
Step 1: Import the Workflow
Download the attached 

n8n_fish_audio_workflow.json
 file.
Open your n8n dashboard.
Go to Workflows -> Import from File.
Select the JSON file.
Step 2: Configure Credentials
Fish Audio API
Open the Fish Audio TTS node.
Under Authentication, select Generic Credential Type -> Header Auth.
Create a new credential:
Name: Authorization
Value: Bearer YOUR_FISH_AUDIO_API_KEY (Ensure you include "Bearer " prefix).
Save the credential.
Google Services
Open the Read Scripts node and configure Google Sheets OAuth2.
Open the Upload to Drive node and configure Google Drive OAuth2.
Note: Ensure your Google Cloud Console project has both Sheets and Drive APIs enabled.
Step 3: Configure Nodes
Google Sheets Node
Document: Paste the URL of your scripts spreadsheet.
Sheet Name: Ensure it matches (default is Sheet1).
Data Structure: Ensure your sheet has columns named title and script. If your columns are named differently, update the expressions in the Fish Audio node.
Fish Audio Node
Voice ID: In the Body Parameters, find reference_id.
Replace YOUR_VOICE_ID_HERE with the ID of the voice you want to use from Fish Audio.
Expressions: Verify {{ $json.script }} and {{ $json.title }} match your sheet columns.
Step 4: Test and Run
Click Execute Workflow.
Verify:
The Google Sheet is read.
Audio is generated (check the output binary tab of the HTTP node).
The MP3 file appears in your Google Drive.