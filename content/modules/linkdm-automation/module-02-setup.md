---
title: "LinkDMの初期設定（登録〜Instagram接続）"
order: 2
duration: "30分"
difficulty: "⭐⭐☆☆☆"
---

# LinkDMの初期設定（登録〜Instagram接続）

**所要時間**: 30分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- LinkDMへの新規登録方法
- InstagramアカウントとFacebookページの連携
- ダッシュボードの基本的な使い方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- LinkDMにアカウント登録できる
- InstagramアカウントをLinkDMに接続できる
- ダッシュボードの基本操作ができる

---

## 目次

- [セクション1: 事前準備](#セクション1-事前準備)
- [セクション2: LinkDMに登録](#セクション2-linkdmに登録)
- [セクション3: Instagramアカウントを接続](#セクション3-instagramアカウントを接続)
- [セクション4: ダッシュボードの確認](#セクション4-ダッシュボードの確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 説明 |
|------|------|
| Instagramプロアカウント | ビジネスまたはクリエイターアカウント |
| Facebookページ | Instagramと連携済み |
| メールアドレス | LinkDM登録用 |
| PC | 初期設定に推奨（スマホも可） |

### 前提条件の確認

以下が完了していることを確認してください：

- [ ] Instagramがプロアカウント（ビジネス/クリエイター）になっている
- [ ] Facebookページを作成済み
- [ ] InstagramとFacebookページが連携済み

上記が未完了の場合は、[n8n自動化講座 Module 02: Instagram API セットアップガイド](/category/n8n/n8n-instagram/module-02-instagram-api-setup)のセクション1-2を参照してください。

---

## セクション1: 事前準備

### Instagramプロアカウントの確認

1. Instagramアプリを開く
2. プロフィール画面で「プロフェッショナルダッシュボード」が表示されていればOK
3. 表示されていない場合：設定 → アカウント → プロアカウントに切り替え

### FacebookページとInstagramの連携確認

1. [Meta Business Suite](https://business.facebook.com/) にアクセス
2. 左メニューの「設定」→「リンク済みアカウント」
3. Instagramアカウントが表示されていればOK

### チェックポイント

- [ ] Instagramがプロアカウントになっている
- [ ] FacebookページとInstagramが連携されている

---

## セクション2: LinkDMに登録

### Step 1: LinkDM公式サイトにアクセス

ブラウザで [https://www.linkdm.com/](https://www.linkdm.com/) にアクセスします。

![LinkDM公式サイトトップページ](/linkdm-automation/module-02-step01-homepage.png)

「Create Account - It's Free!」ボタンをクリックします。

**LinkDMの実績**:
- 40,000+ ユーザー
- 250 Million+ DM送信
- Meta Business Partner認定

### Step 2: アカウント作成

サインアップ画面が表示されます。

![アカウント作成画面](/linkdm-automation/module-02-step02-signup.png)

以下の情報を入力します：

| 項目 | 説明 |
|------|------|
| First Name / Last Name | 名前 |
| Email | メールアドレス |
| Business or Creator Name | ビジネス名またはクリエイター名 |
| Country | 国（Japan） |
| Account Type | アカウントタイプを選択 |
| Password | パスワード |

「I accept the Terms & Conditions and Privacy Policy」にチェックを入れ、「Get Started」をクリックします。

### Step 3: プランの選択

料金プラン選択画面が表示されます。

![料金プラン選択画面](/linkdm-automation/module-02-step03-pricing.png)

| プラン | 料金 | DM数/月 | アカウント数 |
|--------|------|---------|--------------|
| **Free** | $0 | 1,000 | 1 |
| Pro | $19/月 | 25,000 | 3 |
| Platinum+ | $99/月 | 300,000 | 10 |

**Freeプランの主な機能**:
- Post, Reels & Story DM Auto-Reply
- **Button Template（ボタン付きDM）**
- Instagram Automation
- Facebook Automation
- Next Post Feature
- Inbox Starters

まずは**Free**プランで始めることをおすすめします。「Selected」となっているFreeプランのままで進みます。

### チェックポイント

- [ ] LinkDM公式サイトにアクセスした
- [ ] アカウントを作成した
- [ ] プランを選択した

---

## セクション3: Instagramアカウントを接続

### Step 1: Instagram接続画面へ

登録後、またはダッシュボードから「Connect Instagram」をクリックします。

![Instagram接続画面](/linkdm-automation/module-02-step04-connect.png)

「Connect Instagram」ボタンをクリックします。

> **Note**: 「See alternative login methods」から他の接続方法も選択できます。

### Step 2: 権限を許可・アカウント確認

LinkDMに接続するアカウントを確認します。

![権限確認画面](/linkdm-automation/module-02-step05-permission.png)

表示されているInstagramアカウントに間違いがなければ「Connect to LinkDM」をクリックします。

### Step 3: 接続完了・ダッシュボード確認

接続が完了すると、ダッシュボードが表示されます。

![ダッシュボード](/linkdm-automation/module-02-step06-dashboard.png)

**ダッシュボードの見方**:

| 項目 | 説明 |
|------|------|
| MONTHLY DM USAGE | 今月のDM使用量（例: 1/1,000） |
| Check for new posts | 新しい投稿をチェック |
| Ready to Setup | AutoDMが未設定の投稿 |
| Setup LinkDM | 投稿にAutoDMを設定 |
| Skip | この投稿はスキップ |

**注意**: 上部に「We sent a verification email...」と表示されている場合は、メールを確認して認証を完了してください。

### チェックポイント

- [ ] Instagram接続画面を開いた
- [ ] アカウントを確認して接続した
- [ ] ダッシュボードが表示された

---

## セクション4: ダッシュボードの確認

### ダッシュボードの構成

LinkDMのダッシュボードはシンプルな構成です。

**Ready to Setup**: AutoDMが未設定の投稿が表示されます。「Setup LinkDM」をクリックすると、その投稿に対してAutoDMを設定できます。

**All Posts**: 下部にスクロールすると、すべての投稿の一覧と統計が表示されます。

| カラム | 説明 |
|--------|------|
| POST | 投稿のサムネイルとキャプション |
| STATUS | Active（有効）/ Setup LinkDM（未設定） |
| SENT | 送信されたDM数 |
| OPEN | 開封数 |
| CLICKS | リンククリック数 |
| CTR | クリック率 |

### 主要な操作

#### Setup LinkDM（投稿に自動DMを設定）

1. 「Ready to Setup」から投稿を選択
2. 「Setup LinkDM」をクリック
3. DMの設定画面が表示される

#### Check for new posts

新しい投稿がある場合、「Check for new posts」ボタンで最新の投稿を取得できます。

### チェックポイント

- [ ] ダッシュボードにアクセスできた
- [ ] 投稿一覧が表示された
- [ ] MONTHLY DM USAGEを確認した

---

## トラブルシューティング

### 接続できない場合

**原因1**: Instagramがプロアカウントでない

**対処法**:
1. Instagramアプリで設定 → アカウント → プロアカウントに切り替え
2. LinkDMで再度接続を試みる

**原因2**: Facebookページと連携されていない

**対処法**:
1. Meta Business Suiteでinstagramアカウントとfacebookページを連携
2. LinkDMで再度接続を試みる

### 権限許可画面が表示されない

**原因**: ブラウザのポップアップブロック

**対処法**:
1. ブラウザの設定でlinkdm.comのポップアップを許可
2. 再度接続を試みる

### Facebookページが表示されない

**原因**: Facebookページの管理者権限がない

**対処法**:
1. Facebookページの管理者であることを確認
2. Meta Business Suiteで権限を確認

---

## まとめ

### このモジュールで学んだこと

- LinkDMへの登録方法
- InstagramアカウントとFacebookページの連携方法
- ダッシュボードの基本的な構成

### 次のステップ

次のモジュールでは、実際にコメント→DM自動配布を設定します。

- **Module 03**: コメント→DM自動配布の設定
- **Module 04**: ボタン付きDMの設定

---

## 参考資料

- [LinkDMヘルプ - How to Link a Post](https://www.linkdm.com/help/how-to-link-a-post)
- [LinkDMヘルプ - Trigger Types](https://www.linkdm.com/help/trigger-types)
- [Meta Business Suite](https://business.facebook.com/)

---

## よくある質問

**Q: 無料プランで何アカウントまで接続できますか？**
A: 無料プランでは1アカウントのみ接続可能です。複数アカウントを管理したい場合はPro（$19/月）以上にアップグレードしてください。

**Q: クレジットカードの登録は必要ですか？**
A: 無料プランの場合、クレジットカードの登録は不要です。

**Q: 接続を解除したい場合はどうすればいいですか？**
A: Settings → Connected Accounts から接続を解除できます。Meta側からも解除可能です（Instagram設定 → アプリとウェブサイト）。

**Q: 英語が苦手なのですが、使えますか？**
A: LinkDMのUIは英語のみですが、基本的な操作は直感的です。ブラウザの翻訳機能を使うことも可能です。日本語で使いたい場合はエルグラムをおすすめします。
