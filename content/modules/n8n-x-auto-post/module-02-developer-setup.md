# X Developer Portal設定

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- X Developer Portalでのアプリ作成
- APIキーの取得方法
- アプリ権限の設定（Read and Write）

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. X Developer Portalでアプリを作成できる
2. 必要なAPIキー（4種類）を取得できる
3. アプリ権限を正しく設定できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: Developer Portalへのアクセス](#セクション1-developer-portalへのアクセス)
- [セクション2: プロジェクトとアプリの作成](#セクション2-プロジェクトとアプリの作成)
- [セクション3: APIキーの取得](#セクション3-apiキーの取得)
- [セクション4: アプリ権限の設定](#セクション4-アプリ権限の設定)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Xアカウント（投稿に使用するアカウント）
- メールアドレス（Developer登録用）
- 電話番号（アカウント認証用）

### 注意事項

- Developer登録には電話番号認証が必要な場合があります
- 無料プラン（Free tier）で十分です

---

## セクション1: Developer Portalへのアクセス

### 1-1. Developer Portalにアクセス

[developer.x.com](https://developer.x.com/) にアクセスします。

### 1-2. サインイン

右上の「Sign in」をクリックし、Xアカウントでログインします。

### 1-3. Developer登録

初めての場合は、Developer登録が必要です。

1. 利用目的を選択（「Building tools for personal use」など）
2. 利用規約に同意
3. 登録完了

### チェックポイント

- [ ] Developer Portalにログインできた
- [ ] Dashboardが表示された

---

## セクション2: プロジェクトとアプリの作成

### 2-1. プロジェクト作成

Dashboardで「Projects & Apps」をクリックし、プロジェクトを作成します。

1. 「+ Add Project」または「Create Project」をクリック
2. プロジェクト名を入力（例: `n8n-auto-post`）
3. 利用目的を選択
4. プロジェクト説明を入力

### 2-2. アプリ作成

プロジェクト内でアプリを作成します。

1. 「+ Add App」をクリック
2. アプリ名を入力（例: `n8n-x-poster`）
3. 「Complete」をクリック

### チェックポイント

- [ ] プロジェクトが作成された
- [ ] アプリが作成された

---

## セクション3: APIキーの取得

### 必要なキー（4種類）

投稿に必要なキーは以下の4つです。

| キー | 説明 |
|------|------|
| API Key | アプリ識別子（Consumer Key） |
| API Secret | アプリの秘密鍵（Consumer Secret） |
| Access Token | ユーザー認証トークン |
| Access Token Secret | ユーザー認証秘密鍵 |

### 3-1. API KeyとAPI Secretの取得

1. アプリの「Keys and tokens」タブをクリック
2. 「Consumer Keys」セクションで「Regenerate」をクリック
3. 表示された「API Key」と「API Secret」をメモ帳に保存

### 3-2. Access TokenとAccess Token Secretの取得

1. 同じページの「Access Token and Secret」セクションを探す
2. 「Generate」または「Regenerate」をクリック
3. 表示された「Access Token」と「Access Token Secret」をメモ帳に保存

### 重要な注意事項

- **キーは一度しか表示されません** - 必ずすぐにメモしてください
- キーを紛失した場合は「Regenerate」で再生成できます
- **キーは絶対に他人に共有しないでください**

### チェックポイント

- [ ] API Keyをメモした
- [ ] API Secretをメモした
- [ ] Access Tokenをメモした
- [ ] Access Token Secretをメモした

---

## セクション4: アプリ権限の設定

### 4-1. User authentication settingsへ移動

1. アプリの「Settings」タブをクリック
2. 「User authentication settings」セクションを探す
3. 「Set up」または「Edit」をクリック

App details画面の例：

![App details画面](/n8n-x-auto-post/images/developer-portal-app-details.png)

### 4-2. App permissionsの設定

**重要**: 投稿するには「Read and write」権限が必要です。

1. 「App permissions」で **「Read and write」** を選択
2. 「Read」のみだと投稿できません

User authentication settings画面：

![User authentication settings](/n8n-x-auto-post/images/developer-portal-auth-settings.png)

App permissionsで「Read and write」を選択：

![App permissions設定](/n8n-x-auto-post/images/developer-portal-permissions.png)

### 4-3. Type of Appの設定

1. 「Type of App」で **「Web App, Automated App or Bot」** を選択

### 4-4. App infoの設定

以下の必須項目を入力します。

| 項目 | 入力値 |
|------|--------|
| Callback URI / Redirect URL | `http://localhost:5678/rest/oauth1-credential/callback` |
| Website URL | `https://example.com`（任意のURL） |

「Organization name」以下の項目は空欄でOKです。

App info設定画面：

![App info設定](/n8n-x-auto-post/images/developer-portal-app-info.png)

### 4-5. 保存

「Save」をクリックして設定を保存します。

### 4-6. Access Tokenの再生成（重要）

**権限を変更した後は、Access TokenとAccess Token Secretを再生成する必要があります。**

1. 「Keys and tokens」タブに戻る
2. 「Access Token and Secret」セクションで「Regenerate」をクリック
3. 新しいトークンをメモ帳に保存

### チェックポイント

- [ ] App permissionsが「Read and write」になっている
- [ ] Type of Appが「Web App, Automated App or Bot」になっている
- [ ] 権限変更後にAccess Tokenを再生成した

---

## トラブルシューティング

### 403 Forbidden エラーが発生する

**原因**: App permissionsが「Read」のみになっている

**解決策**:
1. 「Settings」→「User authentication settings」→「Edit」
2. 「Read and write」を選択して保存
3. 「Keys and tokens」でAccess Tokenを再生成

### Access Tokenが生成できない

**原因**: User authentication settingsが設定されていない

**解決策**:
1. 「Settings」タブで「User authentication settings」を「Set up」
2. 必須項目を入力して保存
3. 再度「Keys and tokens」タブでトークンを生成

---

## まとめ

### このモジュールで学んだこと

- X Developer Portalでアプリを作成する方法
- 4種類のAPIキーの取得方法
- 「Read and write」権限の設定方法

### 取得したキーの確認

以下の4つのキーが取得できていることを確認してください。

| キー | 取得状況 |
|------|----------|
| API Key | ✅ |
| API Secret | ✅ |
| Access Token | ✅ |
| Access Token Secret | ✅ |

### 次のステップ

Module 03では、取得したAPIキーを使ってPython APIサーバーを構築します。

---

## 参考資料

- [X Developer Portal](https://developer.x.com/)
- [X API 認証ガイド](https://developer.x.com/en/docs/authentication/overview)
- [X API レート制限](https://developer.x.com/en/docs/twitter-api/rate-limits)

---

## よくある質問

**Q: Free tierでいくつのアプリを作れますか？**
A: Free tierでは1プロジェクト、1アプリまで作成できます。

**Q: APIキーを紛失したらどうすればいいですか？**
A: 「Keys and tokens」タブで「Regenerate」をクリックすると、新しいキーを生成できます。古いキーは無効になります。

**Q: 電話番号認証が求められますが、必須ですか？**
A: はい、Developer登録には電話番号認証が必要な場合があります。

**Q: Basic tierにアップグレードする方法は？**
A: Developer Portalの「Products」→「Twitter API v2」から有料プランを選択できます。

**Q: アプリを削除したい場合は？**
A: 「Settings」タブの最下部に「Delete App」ボタンがあります。
