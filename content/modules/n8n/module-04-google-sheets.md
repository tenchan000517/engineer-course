# n8nとGoogle Sheetsを連携する

**所要時間**: 45-60分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Google Cloud ConsoleでOAuth認証を設定する方法
- n8nでGoogle Sheets Credentialを作成する方法
- Google Sheetsノードを使った基本操作（作成・読み込み・追加・更新）
- スプレッドシートをn8nから操作する実践的なワークフロー

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Google Cloud ConsoleでOAuth 2.0クライアントを作成できる
- n8nからGoogle Sheetsに接続できる
- スプレッドシートの作成、データ追加、読み込み、更新ができる
- 投稿管理などに活用できるシート操作の基礎が身につく

---

## 目次

- [セクション1: Google Sheets APIを有効化](#セクション1-google-sheets-apiを有効化)
- [セクション2: OAuth認証の設定](#セクション2-oauth認証の設定)
- [セクション3: OAuthクライアントの作成](#セクション3-oauthクライアントの作成)
- [セクション4: n8nでCredentialを設定](#セクション4-n8nでcredentialを設定)
- [セクション5: スプレッドシートの作成](#セクション5-スプレッドシートの作成)
- [セクション6: データの追加（Append Row）](#セクション6-データの追加append-row)
- [セクション7: データの読み込み（Get Rows）](#セクション7-データの読み込みget-rows)
- [セクション8: データの更新（Update Row）](#セクション8-データの更新update-row)
- [セクション9: ワークフローの保存](#セクション9-ワークフローの保存)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- n8nが起動している状態（Module 01で構築済み）
- Googleアカウント
- ブラウザ（Chrome推奨）

### 事前確認

- [ ] Dockerデスクトップでn8nコンテナが起動している
- [ ] Googleアカウントにログインしている

---

## セクション1: Google Sheets APIを有効化

n8nからGoogle Sheetsにアクセスするには、Google Cloud ConsoleでAPIを有効化する必要があります。

### Google Cloud Consoleにアクセス

1. ブラウザで以下にアクセス：

```
https://console.cloud.google.com/
```

2. Googleアカウントでログイン

### プロジェクトを選択または作成

1. 左上の **「プロジェクトを選択」** をクリック
2. 既存のプロジェクトを選択、または **「新しいプロジェクト」** をクリック

> **ヒント**: プロジェクト数には上限があります。不要なプロジェクトは「IAMと管理」→「設定」→「シャットダウン」で削除できます。

### APIライブラリを開く

![APIライブラリ検索](/n8n-setup/45-api-library-search.png)

1. 左上のナビゲーションメニュー（三本線）をクリック
2. **「APIとサービス」** → **「ライブラリ」** を選択
3. 検索ボックスに **「Google Sheets API」** と入力

### Google Sheets APIを選択

![検索結果](/n8n-setup/46-sheets-api-result.png)

検索結果から **「Google Sheets API」** をクリックします。

### APIを有効化

![Sheets API詳細](/n8n-setup/47-sheets-api-detail.png)

**「有効にする」** ボタンをクリックします。

### 有効化を確認

![Sheets API有効](/n8n-setup/48-sheets-api-enabled.png)

ステータスが **「有効」** になっていれば成功です。

### Google Drive APIも有効化

n8nのGoogle SheetsノードはスプレッドシートのリストやIDを検索する際にGoogle Drive APIも使用します。同様の手順で有効化してください。

1. **「APIとサービス」** → **「ライブラリ」** を選択
2. 検索ボックスに **「Google Drive API」** と入力
3. 検索結果から **「Google Drive API」** をクリック
4. **「有効にする」** ボタンをクリック

![Google Drive API](/n8n-setup/48b-drive-api-detail.png)

> **重要**: Drive APIを有効化しないと、後のワークフロー構築時に「Drive API has not been used in project」エラーが発生します。

### チェックポイント

- [ ] Google Cloud Consoleにアクセスした
- [ ] プロジェクトを選択または作成した
- [ ] Google Sheets APIを有効化した
- [ ] Google Drive APIを有効化した

---

## セクション2: OAuth認証の設定

Google APIを使用するには、OAuth認証の設定が必要です。

### Google Auth Platformを開く

![OAuth開始](/n8n-setup/49-oauth-start.png)

1. 左メニューの **「OAuth 同意画面」** をクリック
2. 「Google Auth Platformはまだ構成されていません」と表示されたら **「開始」** をクリック

### OAuth同意画面を設定

以下の情報を入力します：

| 項目 | 入力値 |
|------|--------|
| アプリ名 | n8n-sheets（任意の名前） |
| ユーザーサポートメール | 自分のメールアドレスを選択 |
| デベロッパーの連絡先情報 | 自分のメールアドレスを入力 |
| User Type | 外部（個人Googleアカウントの場合） |

設定を保存すると、OAuthクライアントを作成できる状態になります。

![OAuth設定完了](/n8n-setup/50-oauth-configured.png)

### テストユーザーを追加

OAuth同意画面がテストモードの場合、テストユーザーの追加が必要です。

1. 左メニューの **「対象」** タブをクリック
2. **「テストユーザー」** セクションで **「+ Add users」** をクリック
3. 自分のメールアドレスを入力
4. **「保存」** をクリック

> **重要**: テストユーザーを追加しないと、後の認証で「access_denied」エラーが発生します。

### チェックポイント

- [ ] OAuth同意画面を設定した
- [ ] アプリ名とメールアドレスを入力した
- [ ] テストユーザーに自分のメールアドレスを追加した

---

## セクション3: OAuthクライアントの作成

n8nがGoogleにアクセスするための認証情報（クライアントID / シークレット）を作成します。

### クライアントを作成

![クライアント種類選択](/n8n-setup/51-client-type-select.png)

1. 左メニューの **「クライアント」** をクリック
2. **「+ クライアントを作成」** または **「OAuthクライアントを作成」** をクリック
3. アプリケーションの種類で **「ウェブ アプリケーション」** を選択

### クライアント設定を入力

![クライアント設定](/n8n-setup/52-client-settings.png)

以下の設定を行います：

| 項目 | 設定値 |
|------|--------|
| 名前 | n8n（任意） |
| 承認済みのリダイレクトURI | `http://localhost:5678/rest/oauth2-credential/callback` |

**「+ URIを追加」** をクリックしてリダイレクトURIを入力し、**「作成」** をクリックします。

### クライアントID / シークレットを保存

![クライアント作成完了](/n8n-setup/53-client-created.png)

作成が完了すると、以下の情報が表示されます：

- **クライアントID**
- **クライアントシークレット**

> **重要**: クライアントシークレットは2025年6月以降、再表示できなくなります。安全な場所に保存してください。

### クライアント一覧で確認

![クライアント一覧](/n8n-setup/54-client-list.png)

作成したクライアントが一覧に表示されます。

### チェックポイント

- [ ] OAuthクライアントIDを作成した
- [ ] リダイレクトURIを設定した
- [ ] クライアントIDとシークレットをメモした

---

## セクション4: n8nでCredentialを設定

Google Cloud Consoleの設定が完了したら、n8nで認証情報を設定します。

### n8nを開く

1. ブラウザで `http://localhost:5678` にアクセス
2. n8nのホーム画面が表示されることを確認

### Credentialsを開く

![n8n Credentials画面](/n8n-setup/55-n8n-credentials.png)

1. 左下の **ユーザーアイコン** をクリック
2. **「Personal」** を選択
3. **「Credentials」** タブをクリック
4. **「Add first credential」** または **「Create credential」** をクリック

### Google Sheets OAuth2を選択

![Add credential](/n8n-setup/56-add-credential.png)

1. 検索窓に **「Google S」** と入力
2. **「Google Sheets OAuth2 API」** を選択

### 認証情報を入力

![Credential設定フォーム](/n8n-setup/57-credential-form.png)

以下を入力します：

| 項目 | 入力値 |
|------|--------|
| Client ID | Google Cloudで取得したクライアントID |
| Client Secret | Google Cloudで取得したクライアントシークレット |

画面下部の注意書きに「Google Drive API, Google Sheets API」を有効にする必要があると表示されています。セクション1で有効化済みなので問題ありません。

### Googleアカウントと接続

1. 下にスクロールして **「Sign in with Google」** をクリック
2. Googleアカウント選択画面が表示される
3. 使用するアカウントを選択

### 未確認アプリの警告

![Googleで確認されていません](/n8n-setup/58-google-unverified.png)

「このアプリはGoogleで確認されていません」と表示されます。これはテストモードでは正常です。

**「続行」** をクリックして進みます。

### アクセス権限を許可

![権限選択](/n8n-setup/59-permission-select.png)

n8n-sheetsがアクセスできる情報を選択する画面が表示されます。

**「すべて選択」** にチェックを入れて、**「続行」** をクリックします。

### 接続完了

![Account connected](/n8n-setup/60-account-connected.png)

**「Account connected」** と表示されれば成功です。

**「Save」** をクリックして保存します。

### チェックポイント

- [ ] n8nのCredentials画面を開いた
- [ ] Google Sheets OAuth2 APIを選択した
- [ ] Client IDとSecretを入力した
- [ ] Googleアカウントと接続した
- [ ] 「Account connected」が表示された

---

## セクション5: スプレッドシートの作成

認証が完了したら、n8nからスプレッドシートを操作してみましょう。まずは新しいスプレッドシートを作成します。

### 新しいワークフローを作成

1. n8nホーム画面で **「Start from scratch」** をクリック
2. トリガー選択画面で **「Trigger manually」** を選択

### Google Sheetsノードを追加

![Google Sheets操作一覧](/n8n-setup/61-sheets-operations.png)

1. Manual Triggerノードの右側の **「+」** をクリック
2. 検索窓に **「Google Sheets」** と入力
3. **「Google Sheets」** を選択
4. 操作一覧が表示される：
   - **DOCUMENT ACTIONS**: Create spreadsheet, Delete spreadsheet
   - **SHEET WITHIN DOCUMENT ACTIONS**: Append row, Get row(s), Update row など
5. **「Create spreadsheet」** を選択

### スプレッドシート作成の設定

![Create spreadsheet設定](/n8n-setup/62-create-spreadsheet.png)

| 項目 | 設定値 |
|------|--------|
| Credential | Google Sheets account（先ほど作成した認証） |
| Resource | Document |
| Operation | Create |
| Title | n8n-test（任意の名前） |

### 実行してスプレッドシートを作成

1. 右上の **「Execute step」** をクリック

![Create spreadsheet成功](/n8n-setup/63-create-success.png)

成功すると、OUTPUTに以下の情報が表示されます：

| フィールド | 説明 |
|------------|------|
| spreadsheetId | スプレッドシートの一意のID |
| title | n8n-test |
| spreadsheetUrl | スプレッドシートのURL |

> **ヒント**: `spreadsheetUrl`をクリックすると、作成されたスプレッドシートをブラウザで確認できます。

### チェックポイント

- [ ] Google Sheetsノードを追加した
- [ ] Create spreadsheetを選択した
- [ ] 実行してスプレッドシートが作成された
- [ ] spreadsheetIdを確認した

---

## セクション6: データの追加（Append Row）

作成したスプレッドシートにデータを追加します。

### ヘッダー行を準備

n8nからデータを追加する前に、スプレッドシートにヘッダー行を作成します。

1. 作成したスプレッドシートをブラウザで開く
2. 1行目に以下のヘッダーを入力：

| A | B | C |
|---|---|---|
| post_id | status | caption |

### Append Rowノードを追加

1. キャンバスに戻って **「+」** をクリック
2. **「Google Sheets」** → **「Append row in sheet」** を選択

### ヘッダーがない場合のエラー

![No columns found](/n8n-setup/64-no-columns.png)

ヘッダー行がない状態だと「No columns found in Google Sheets」というエラーが表示されます。

スプレッドシートでヘッダーを追加してから **「Retry」** をクリックしてください。

### カラムが認識された状態

![カラム認識](/n8n-setup/65-columns-found.png)

ヘッダーを追加すると、カラム（post_id, status, caption）が認識されます。

### Append Row設定

| 項目 | 設定値 |
|------|--------|
| Document | By ID → 作成したspreadsheetIdを入力 |
| Sheet | シート1（またはSheet1） |

### 追加するデータを入力

**「Values to Send」** セクションで以下を入力：

| フィールド | 値 |
|------------|-----|
| post_id | POST-001 |
| status | DRAFT |
| caption | テスト投稿1 |

### 実行してデータを追加

1. **「Execute step」** をクリック

成功すると、スプレッドシートにデータが追加されます。

### スプレッドシートで確認

![Sheets実データ](/n8n-setup/66-sheets-data.png)

ブラウザでスプレッドシートを開くと、2行目にデータが追加されています：

| A | B | C |
|---|---|---|
| post_id | status | caption |
| POST-001 | DRAFT | テスト投稿1 |

### チェックポイント

- [ ] スプレッドシートにヘッダー行を作成した
- [ ] Append rowノードを追加した
- [ ] データを入力して実行した
- [ ] スプレッドシートにデータが追加された

---

## セクション7: データの読み込み（Get Rows）

スプレッドシートからデータを読み込みます。

### Get Rowsノードを追加

1. キャンバスで **「+」** をクリック
2. **「Google Sheets」** → **「Get row(s) in sheet」** を選択

### Get Rows設定

![Get rows設定](/n8n-setup/67-get-rows-setting.png)

| 項目 | 設定値 |
|------|--------|
| Document | By ID → 同じspreadsheetId |
| Sheet | シート1 |

### 実行してデータを読み込み

1. **「Execute step」** をクリック

![Get rows成功](/n8n-setup/68-get-rows-success.png)

成功すると、シート内のデータがOUTPUTに表示されます：

| フィールド | 値 |
|------------|-----|
| row_number | 2 |
| post_id | POST-001 |
| status | DRAFT |
| caption | テスト投稿1 |

> **ポイント**: `row_number`は実際のシート上の行番号です。ヘッダー行が1行目なので、データは2行目から始まります。

### チェックポイント

- [ ] Get rowsノードを追加した
- [ ] 実行してデータが読み込まれた
- [ ] row_number、post_id、status、captionが確認できた

---

## セクション8: データの更新（Update Row）

既存のデータを更新します。例として、statusを「DRAFT」から「READY」に変更します。

### Update Rowノードを追加

1. キャンバスで **「+」** をクリック
2. **「Google Sheets」** → **「Update row in sheet」** を選択

### Update Row設定

| 項目 | 設定値 |
|------|--------|
| Document | By ID → 同じspreadsheetId |
| Sheet | シート1 |
| Column to match on | post_id（どの列で行を特定するか） |

### 更新するデータを入力

**「Values to Update」** セクションで以下を入力：

| フィールド | 値 |
|------------|-----|
| post_id | POST-001（マッチ用） |
| status | READY（新しい値） |

> **ポイント**: `Column to match on`で指定した列（post_id）の値と一致する行が更新されます。

### 実行してデータを更新

1. **「Execute step」** をクリック

![Update成功](/n8n-setup/69-update-success.png)

成功すると、OUTPUTに更新後のデータが表示されます：

| post_id | status |
|---------|--------|
| POST-001 | **READY** |

スプレッドシートを確認すると、statusが「DRAFT」から「READY」に変更されています。

### チェックポイント

- [ ] Update rowノードを追加した
- [ ] Column to match onでpost_idを選択した
- [ ] statusをREADYに変更して実行した
- [ ] スプレッドシートでstatusが更新された

---

## セクション9: ワークフローの保存

作成したワークフローを保存します。

### ワークフロー名を設定

1. 画面左上の **「My workflow」** をクリック
2. ワークフロー名を **「Google Sheets Test」** などに変更

### 保存

1. **「Save」** ボタンをクリック（または Ctrl+S / Cmd+S）

### 完成したワークフロー構成

| ノード | 操作 | 説明 |
|--------|------|------|
| Manual Trigger | - | 手動実行 |
| Google Sheets | Create spreadsheet | スプレッドシート作成 |
| Google Sheets1 | Append row | データ追加 |
| Google Sheets2 | Get rows | データ読み込み |
| Google Sheets3 | Update row | データ更新 |

### チェックポイント

- [ ] ワークフローに名前を付けた
- [ ] ワークフローを保存した

---

## トラブルシューティング

### access_denied エラー

**症状**: 「アクセスをブロック: n8n-sheets は Google の審査プロセスを完了していません」というエラーが表示される

**原因**: OAuth同意画面がテストモードで、テストユーザーが追加されていない

**解決方法**:
1. Google Cloud Console → 「OAuth同意画面」→「対象」タブ
2. テストユーザーセクションで自分のメールアドレスを追加
3. n8nに戻って再度「Sign in with Google」をクリック

---

### No columns found in Google Sheets

**症状**: Append rowやUpdate row設定時に「No columns found」と表示される

**原因**: スプレッドシートにヘッダー行がない

**解決方法**:
1. スプレッドシートをブラウザで開く
2. 1行目にヘッダー（列名）を入力
3. n8nに戻って「Retry」をクリック

---

### リダイレクトURIの不一致

**症状**: 「redirect_uri_mismatch」エラーが表示される

**原因**: Google CloudのリダイレクトURIとn8nの設定が一致していない

**解決方法**:
1. Google Cloud Console → 認証情報 → 作成したOAuthクライアント
2. 「承認済みのリダイレクトURI」を確認
3. ローカル版: `http://localhost:5678/rest/oauth2-credential/callback`

---

## まとめ

### このモジュールで学んだこと

- Google Cloud ConsoleでOAuth認証を設定する手順
  - Google Sheets API / Drive APIの有効化
  - OAuth同意画面の設定
  - OAuthクライアントIDの作成
- n8nでGoogle Sheets Credentialを作成する方法
- Google Sheetsノードの4つの基本操作
  - Create spreadsheet（スプレッドシート作成）
  - Append row（データ追加）
  - Get rows（データ読み込み）
  - Update row（データ更新）

### 次のステップ

この基礎を活用して、以下のような発展的な自動化が可能です：

- 投稿管理用シートの設計と構築
- シートから投稿内容を取得してInstagramに投稿
- 投稿結果をシートに記録するステータス管理
- AI連携（キャプション自動生成など）

---

## 参考資料

- [n8n Google Sheets Node ドキュメント](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [n8n Google OAuth設定ガイド](https://docs.n8n.io/integrations/builtin/credentials/google/oauth-single-service/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [n8n Workflow Template: Get Started with Google Sheets](https://n8n.io/workflows/7156-get-started-with-google-sheets-in-n8n/)

---

## よくある質問

**Q: OAuth同意画面は「外部」と「内部」どちらを選ぶべきですか？**
A: 個人のGoogleアカウント（@gmail.com）を使用する場合は「外部」を選択してください。「内部」はGoogle Workspaceの組織アカウント専用です。

**Q: テストモードのままで問題ありませんか？**
A: 個人で使用する分には問題ありません。テストモードでは最大100人のテストユーザーが利用でき、トークンの有効期限は7日間です。本番環境で多数のユーザーに公開する場合はGoogleの審査が必要です。

**Q: クライアントシークレットを忘れた場合は？**
A: Google Cloud Console → 認証情報 → 該当のOAuthクライアント → 「クライアントシークレットをリセット」で新しいシークレットを発行できます。ただし、既存の接続は無効になります。

**Q: 既存のスプレッドシートを使用できますか？**
A: はい。ノード設定で「Document」を「By URL」または「From list」に変更し、既存のスプレッドシートを指定できます。

**Q: 複数のシートがあるスプレッドシートを操作できますか？**
A: はい。「Sheet」設定で操作対象のシートを選択できます。シート名またはSheet ID（gid）で指定します。
