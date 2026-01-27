# Stripe完全決済システム設計【30万円商材対応・Discord連携自動化】

---

## 全体アーキテクチャ図

```
【決済フロー全体像】

顧客（LP訪問）
    ↓
Stripe Checkout（決済ページ）
    ↓
決済完了
    ↓
Stripe Webhook発火
    ↓
Make.com（中継・自動化）
    ├→ Discord（ロール自動付与）
    ├→ メール配信（Brevo）
    ├→ 顧客管理DB（Notion/Airtable）
    └→ Slack通知（運営チーム）
    ↓
自動請求書発行（Stripe Invoice）
    ↓
完了通知（顧客・運営）
```

---

## 商品ラインナップ設計

### 完全商品リスト

| 商品名 | 価格（税込） | 決済タイプ | 分割対応 | Discord権限 |
|-------|------------|----------|---------|-----------|
| **Layer 1: 入門コース** | 19,800円 | 一括のみ | なし | ブロンズ |
| **Layer 2: 実践コース** | 98,000円 | 一括/3回/6回 | あり | シルバー |
| **Layer 3: 完全マスター** | 298,000円 | 一括/6回/12回/24回 | あり | ダイヤモンド |
| **VIPプレミアム** | 49,800円/月 | サブスク | なし | VIP |
| **個別コンサル30分** | 9,800円 | 一括のみ | なし | なし |
| **個別コンサル90分** | 29,800円 | 一括のみ | なし | なし |

---

## Phase 1: Stripe初期設定【完全版】

### Step 1: Stripeアカウント作成・設定

#### 1-1: アカウント作成

```
1. https://stripe.com/jp にアクセス
2. 「今すぐ始める」をクリック
3. メールアドレス・パスワード入力
4. アカウント作成完了
```

#### 1-2: 事業者情報登録（必須）

```
【入力情報】
- 事業形態: 個人事業主 or 法人
- 氏名/屋号/会社名
- 住所
- 電話番号
- 事業内容: 「オンライン教育・コンサルティング」
- ウェブサイトURL
- 銀行口座情報（振込先）

【審査期間】
- 通常1-3営業日
- 審査完了前でもテストモードで開発可能
```

#### 1-3: 税務設定（インボイス対応）

```
【設定手順】

1. Stripeダッシュボード → 設定 → Billing
2. 「請求書のテンプレート」を選択
3. 「税務情報」セクションまでスクロール
4. 以下を入力：

税務情報の入力項目:
- 事業者登録番号（インボイス登録番号）
  例: T1234567890123
- 税率: 10%（日本の消費税）
- 税務情報の表示: 「適格請求書発行事業者」と表示
- 請求書に記載する情報:
  - 事業者名
  - 登録番号
  - 税率
  - 税込金額
```

---

## Phase 2: 商品・価格設定【完全版】

### 商品1: Layer 3（29.8万円・メイン商材）

#### Step 1: 商品作成

```
【Stripeダッシュボード操作】

1. 左メニュー → 商品カタログ → 「+商品を追加」
2. 以下を入力：

商品情報:
商品名: AI自動収益システム構築 完全マスタープログラム
説明: 6ヶ月で月収100万円を目指す完全オーダーメイド収益システム構築プログラム
画像: 商品サムネイル画像をアップロード
```

#### Step 2: 価格設定（一括払い）

```
【価格設定】

価格モデル: 標準の価格
価格: 298,000円
通貨: JPY（日本円）
請求期間: なし（1回限りの支払い）

税金の動作: 税込（10%消費税含む）

メタデータ（任意だが推奨）:
- product_type: layer3
- discord_role: ダイヤモンド
- program_duration: 6ヶ月
```

#### Step 3: 価格設定（分割払い）

##### 分割6回払い

```
価格モデル: 定期支払い
価格: 50,000円
請求期間: 毎月
請求回数: 6回

メタデータ:
- payment_plan: installment_6
- total_amount: 300,000
- discord_role: ダイヤモンド
```

##### 分割12回払い

```
価格モデル: 定期支払い
価格: 25,500円
請求期間: 毎月
請求回数: 12回

メタデータ:
- payment_plan: installment_12
- total_amount: 306,000
- discord_role: ダイヤモンド
```

##### 分割24回払い

```
価格モデル: 定期支払い
価格: 13,000円
請求期間: 毎月
請求回数: 24回

メタデータ:
- payment_plan: installment_24
- total_amount: 312,000
- discord_role: ダイヤモンド
```

---

### 商品2: VIPプレミアムサポート（月額課金）

```
【商品情報】

商品名: VIPプレミアムサポート
説明: 週1回の個別面談、案件営業代行、最新AIツール先行体験

【価格設定】

価格モデル: 定期支払い
価格: 49,800円
請求期間: 毎月
請求回数: 無制限（解約まで継続）

メタデータ:
- product_type: vip
- discord_role: VIP
- features: weekly_meeting,lead_gen,early_access
```

---

## Phase 3: Stripe Checkout完全設計

### Checkout方式の選択

| 方式 | 特徴 | おすすめ度 |
|-----|-----|-----------|
| **Hosted Checkout** | Stripe提供のページ、開発不要 | 最高 |
| **Embedded Checkout** | 自サイトに埋め込み、カスタマイズ可 | 高 |
| **Custom Checkout** | 完全カスタマイズ、開発必要 | 中 |

**推奨: Hosted Checkout（最も簡単・高CVR）**

---

### Hosted Checkout設定（完全版）

#### Step 1: Payment Linkの作成

```
【Stripeダッシュボード操作】

1. 左メニュー → Payment Links → 「+支払いリンクを作成」
2. 商品を選択: 「AI自動収益システム構築...」
3. 以下を設定：

基本設定:
- 数量: 固定（1個）
- 顧客情報の収集:
  - 氏名: 必須
  - メールアドレス: 必須
  - 電話番号: オプション
  - 住所: オプション
- 追加情報の収集:
  - カスタムフィールド1: Discord ID（任意）
  - カスタムフィールド2: 紹介者コード（任意）

支払いオプション:
- 決済手段:
  - カード決済
  - Apple Pay
  - Google Pay
  - 銀行振込（オプション）
- 価格オプション:
  - 一括払い: 298,000円
  - 分割6回: 50,000円/月
  - 分割12回: 25,500円/月
  - 分割24回: 13,000円/月
  → 顧客がチェックアウト時に選択可能

成功後のアクション:
- 決済成功ページにリダイレクト:
  https://yourdomain.com/thank-you?session_id={CHECKOUT_SESSION_ID}
- カスタムメッセージ:
  「ご購入ありがとうございます！
   キックオフ面談の予約リンクをメールで送信しました。
   Discordへのアクセス権も自動付与されます。」

詳細設定:
- 有効期限: なし（常時有効）
- 購入上限: なし
- 税金: 自動計算（10%消費税）
- 領収書: 自動送信
```

#### Step 2: 生成されたPayment Linkを取得

```
生成されたリンク例:
https://buy.stripe.com/test_xxxxxxxxxxxxx

このリンクを：
- LPの「今すぐ申し込む」ボタンに設定
- メールシーケンスの申し込みボタンに設定
- Discord #有料講座のご案内 に貼り付け
```

---

### カスタムThank Youページの設計

#### URL設定

```
リダイレクト先:
https://yourdomain.com/thank-you?session_id={CHECKOUT_SESSION_ID}

※ {CHECKOUT_SESSION_ID} はStripeが自動で置き換える
```

#### Thank Youページの内容

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ご購入ありがとうございます</title>
</head>
<body>
    <div class="container">
        <div class="check-icon">完了</div>
        <h1>ご購入ありがとうございます！</h1>
        <p>
            あなたの人生を変える第一歩が、
            今、始まりました。
        </p>

        <div class="next-steps">
            <h2>次のステップ</h2>

            <div class="step">
                <strong>Step 1: メールを確認</strong>
                登録いただいたメールアドレスに、
                「購入完了」メールが届きます。
                （5分以内に届かない場合は迷惑メールフォルダをご確認ください）
            </div>

            <div class="step">
                <strong>Step 2: Discordにアクセス</strong>
                会員専用Discordへのアクセス権が
                自動で付与されました。
            </div>

            <a href="https://discord.gg/your-server" class="cta-button">
                Discord にアクセス
            </a>

            <div class="step">
                <strong>Step 3: キックオフ面談を予約</strong>
                3時間の個別面談で、
                あなた専用のロードマップを作成します。
            </div>

            <a href="https://calendly.com/your-link" class="cta-button">
                面談を予約する
            </a>

            <div class="step">
                <strong>Step 4: 事前アンケートに回答</strong>
                面談をより有意義にするため、
                事前アンケートにご回答ください。
            </div>

            <a href="https://forms.gle/your-form" class="cta-button">
                アンケートに答える
            </a>
        </div>

        <p>
            6ヶ月後、あなたが月100万円を達成する姿を
            楽しみにしています！
        </p>
    </div>

    <script>
        // Stripe Checkout Session IDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        // Google Analytics イベント送信
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                'transaction_id': sessionId,
                'value': 298000,
                'currency': 'JPY',
                'items': [{
                    'item_name': 'AI自動収益システム構築プログラム'
                }]
            });
        }

        // Facebook Pixel イベント送信
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: 298000,
                currency: 'JPY'
            });
        }
    </script>
</body>
</html>
```

---

## Phase 4: Webhook設定（完全自動化の核心）

### Webhookとは？

```
顧客が決済完了
    ↓
Stripeがイベントを検知
    ↓
Stripeが指定URLにPOSTリクエスト送信（Webhook）
    ↓
あなたのシステムが受信・処理
    ↓
Discord連携・メール送信などを自動実行
```

---

### Step 1: Webhook エンドポイントの作成（Make.com使用）

#### Make.comシナリオ設定

```
【シナリオ名】
Stripe決済完了 → Discord連携自動化

【トリガー】
Webhooks → Custom Webhook

1. Make.comにログイン
2. 新規シナリオ作成
3. トリガーに「Webhooks」を選択
4. 「Custom Webhook」を選択
5. 「Add」をクリック
6. Webhook名: stripe_checkout_completed
7. 「Create a webhook」をクリック

→ Webhook URLが生成される
例: https://hook.us1.make.com/xxxxxxxxxxxxx

このURLを控える（Step 2で使用）
```

---

### Step 2: Stripe側でWebhook設定

```
【Stripeダッシュボード操作】

1. 左メニュー → 開発者 → Webhook
2. 「+エンドポイントを追加」をクリック
3. 以下を入力：

Webhook設定:

エンドポイントURL:
https://hook.us1.make.com/xxxxxxxxxxxxx
（Step 1で取得したURL）

説明:
Discord連携・メール送信自動化

イベントを選択:
- checkout.session.completed
- payment_intent.succeeded
- payment_intent.payment_failed
- invoice.paid
- invoice.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

API version:
最新版を選択

4. 「エンドポイントを追加」をクリック
5. 「署名シークレット」をコピー
   例: whsec_xxxxxxxxxxxxxxxx
```

---

### Step 3: Make.comシナリオの完全構築

#### 完全フロー図

```
【Make.comシナリオ】

モジュール1: Webhook受信
    ↓
モジュール2: イベントタイプ判定（Router）
    ├→ checkout.session.completed の場合
    │   ↓
    │   モジュール3: Stripe - 顧客情報取得
    │   ↓
    │   モジュール4: Stripe - 商品情報取得
    │   ↓
    │   モジュール5: Discord - ユーザー検索
    │   ↓
    │   モジュール6: Discord - ロール付与
    │   ↓
    │   モジュール7: Discord - DM送信
    │   ↓
    │   モジュール8: Brevo - ウェルカムメール送信
    │   ↓
    │   モジュール9: Notion - 顧客DB追加
    │   ↓
    │   モジュール10: Slack - 運営チーム通知
    │
    └→ payment_intent.payment_failed の場合
        ↓
        モジュール11: Brevo - 決済失敗メール送信
        ↓
        モジュール12: Slack - エラー通知
```

---

#### 各モジュールの詳細設定

##### モジュール1: Webhook受信

```
タイプ: Webhooks → Custom Webhook
設定: すでに作成済み（Step 1）

出力データ例:
{
  "id": "evt_xxxxx",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxxxx",
      "customer": "cus_xxxxx",
      "customer_email": "customer@example.com",
      "customer_details": {
        "name": "田中太郎",
        "email": "customer@example.com"
      },
      "amount_total": 298000,
      "currency": "jpy",
      "metadata": {
        "discord_id": "user#1234",
        "product_type": "layer3"
      }
    }
  }
}
```

---

##### モジュール2: イベントタイプ判定（Router）

```
タイプ: Flow Control → Router

ルート1: checkout.session.completed
条件: {{1.type}} = "checkout.session.completed"

ルート2: payment_failed
条件: {{1.type}} contains "failed"
```

---

##### モジュール3: Stripe - 顧客情報取得

```
タイプ: Stripe → Get a Customer

設定:
Customer ID: {{1.data.object.customer}}

出力:
- 顧客名
- メールアドレス
- 作成日
- メタデータ
```

---

##### モジュール4: Stripe - 商品情報取得

```
タイプ: HTTP → Make a Request

設定:
URL: https://api.stripe.com/v1/checkout/sessions/{{1.data.object.id}}/line_items
Method: GET
Headers:
  Authorization: Bearer sk_live_xxxxx（StripeシークレットキーID）

出力:
- 商品名
- 価格
- 数量
- メタデータ
```

---

##### モジュール5: Discord - ユーザー検索

```
タイプ: Discord → Make an API Call

設定:
URL: https://discord.com/api/v10/guilds/YOUR_GUILD_ID/members/search
Method: GET
Query Parameters:
  query: {{1.data.object.customer_email}}
  limit: 1
Headers:
  Authorization: Bot YOUR_BOT_TOKEN

※ Discord IDがメタデータにある場合は直接使用
※ ない場合はメールアドレスで検索
```

---

##### モジュール6: Discord - ロール付与

```
タイプ: Discord → Add Role to Member

設定:
Server ID: YOUR_GUILD_ID
User ID: {{5.data[0].user.id}}
Role ID: DIAMOND_ROLE_ID（ダイヤモンドロールのID）

※ 商品タイプによってロールIDを変更
Layer 1 → ブロンズロール
Layer 2 → シルバーロール
Layer 3 → ダイヤモンドロール
VIP → VIPロール
```

**ロールIDの取得方法**:
```
1. Discord開発者モードをON
   （設定 → 詳細設定 → 開発者モード）
2. サーバー設定 → ロール → 対象ロールを右クリック
3. 「IDをコピー」
```

---

##### モジュール7: Discord - DM送信

```
タイプ: Discord → Create a Message

設定:
Channel Type: Direct Message
User ID: {{5.data[0].user.id}}

メッセージ内容:

ご購入ありがとうございます！

{{3.name}} さん

【AI自動収益システム構築
 完全マスタープログラム】

へのご参加、本当にありがとうございます！

次のステップ:

Step 1: キックオフ面談を予約
https://calendly.com/your-link

Step 2: 事前アンケートに回答
https://forms.gle/your-form

Step 3: 会員専用チャンネルを確認
<#CHANNEL_ID>

6ヶ月後、月100万円達成を
一緒に目指しましょう！

質問があれば、
<#SUPPORT_CHANNEL_ID> で
いつでも聞いてください。

[あなたの名前]
```

---

##### モジュール8: Brevo - ウェルカムメール送信

```
タイプ: Brevo → Send an Email

設定:
To: {{1.data.object.customer_email}}
From: support@yourdomain.com
From Name: [あなたの名前]
Subject: 【ご購入ありがとうございます】キックオフ面談のご案内

本文:（Day 13のメール内容を使用）
```

---

##### モジュール9: Notion - 顧客DB追加

```
タイプ: Notion → Create a Database Item

設定:
Database ID: YOUR_NOTION_DB_ID

プロパティ:
- 氏名: {{3.name}}
- メールアドレス: {{1.data.object.customer_email}}
- 購入日: {{1.created}}
- 商品: Layer 3
- 金額: {{1.data.object.amount_total}}
- 支払い方法: {{4.data.payment_method_types[0]}}
- Discord ID: {{5.data[0].user.id}}
- ステータス: 購入完了
- 面談予約: 未予約
```

**Notion DB構造例**:

| 項目 | タイプ | 必須 |
|-----|--------|-----|
| 氏名 | テキスト | はい |
| メールアドレス | メール | はい |
| 購入日 | 日付 | はい |
| 商品 | セレクト | はい |
| 金額 | 数値 | はい |
| 支払い方法 | セレクト | いいえ |
| Discord ID | テキスト | いいえ |
| ステータス | セレクト | はい |
| 面談予約 | チェックボックス | いいえ |
| 月収達成 | チェックボックス | いいえ |
| 備考 | テキスト | いいえ |

---

##### モジュール10: Slack - 運営チーム通知

```
タイプ: Slack → Create a Message

設定:
Channel: #新規購入通知

メッセージ:
**新規購入がありました！**

**顧客情報**
氏名: {{3.name}}
メール: {{1.data.object.customer_email}}
購入日: {{formatDate(1.created, "YYYY/MM/DD HH:mm")}}

**購入内容**
商品: AI自動収益システム構築プログラム
金額: ¥{{formatNumber(1.data.object.amount_total)}}
支払い: {{4.data.payment_method_types[0]}}

**Discord連携**
ロール付与: 完了
DM送信: 完了

**次のアクション**
- キックオフ面談の日程確認
- Notionで進捗管理

<https://notion.so/database-link|Notion顧客DB>
```

---

### Step 4: テスト実行

```
【テスト手順】

1. Stripeダッシュボードで「テストモード」に切り替え
2. テスト用Payment Linkを作成
3. テストカード番号で決済テスト
   カード番号: 4242 4242 4242 4242
   有効期限: 任意の未来日付
   CVC: 任意の3桁
4. Make.comのシナリオ実行ログを確認
5. Discordでロール付与を確認
6. DMが届くか確認
7. Notionにデータが追加されたか確認
8. Slackに通知が届いたか確認

全てOKなら本番環境に切り替え
```

---

## Phase 5: 自動請求書発行設定

### Stripe Invoice自動発行の設定

```
【目的】
- 決済完了後、自動で領収書/請求書を発行
- インボイス制度対応
- 経費精算に使用可能
```

---

### Step 1: Invoice設定

```
【Stripeダッシュボード操作】

1. 設定 → Billing → 請求書のテンプレート
2. 以下を設定：

基本情報:
事業者名: [あなたの屋号/会社名]
登録番号（インボイス）: T1234567890123
住所: 〒XXX-XXXX [あなたの住所]
電話番号: XXX-XXXX-XXXX
メールアドレス: support@yourdomain.com

カスタマイズ:
ロゴ: あなたのロゴ画像をアップロード
カラーテーマ: ブランドカラーを設定
フッター:
「お支払いいただき、ありがとうございます。
 ご不明点がございましたら、
 support@yourdomain.comまでご連絡ください。」

税金設定:
税率: 10%
税金の種類: 消費税
適格請求書発行事業者: はい
```

---

### Step 2: 自動発行の設定

```
【Stripeダッシュボード操作】

1. 設定 → Billing → 自動請求書
2. 以下を有効化：

- 決済完了時に自動で請求書を発行
- 顧客にメールで送信
- PDFをダウンロード可能にする
```

---

### Step 3: Make.comで請求書リンクを送信

```
【モジュールを追加】

タイプ: Stripe → Get an Invoice

設定:
Invoice ID: {{1.data.object.invoice}}

↓

タイプ: Brevo → Send an Email

設定:
To: {{1.data.object.customer_email}}
Subject: 【領収書】ご購入の領収書を送付いたします

本文:
{{顧客名}} 様

いつもお世話になっております。
[あなたの名前]です。

先ほどご購入いただいた商品の
領収書を送付いたします。

領収書ダウンロード:
以下のリンクからPDFをダウンロードできます。
{{invoiceモジュール.invoice_pdf}}

ご購入内容:
商品名: AI自動収益システム構築プログラム
金額: ¥298,000（税込）
お支払い日: {{formatDate(now, "YYYY年MM月DD日")}}

この領収書は、経費精算にご利用いただけます。

ご不明点がございましたら、
お気軽にご連絡ください。

[あなたの名前]
support@yourdomain.com
```

---

## Phase 6: サブスクリプション設定（VIP月額課金）

### サブスクリプション商品の設定

```
【Stripeダッシュボード操作】

1. 商品カタログ → +商品を追加
2. 以下を入力：

商品名: VIPプレミアムサポート
説明: 週1回の個別面談、案件営業代行、最新AIツール先行体験

3. 価格設定:
   価格モデル: 定期支払い
   価格: 49,800円
   請求期間: 毎月
   請求回数: 無制限

4. 詳細設定:
   無料トライアル: なし
   初回セットアップ料金: なし
   使用量ベースの料金: なし
```

---

### サブスクリプション専用Payment Link

```
1. Payment Links → +支払いリンクを作成
2. 商品: VIPプレミアムサポート
3. 設定:

   定期支払いのプレビュー:
   「月額¥49,800で自動更新されます」

   解約ポリシー:
   「いつでも解約可能です。
    解約は翌月から有効になります。」

   決済失敗時の動作:
   - リトライ回数: 3回
   - リトライ間隔: 3日ごと
   - 失敗後の措置: サブスクリプション停止
```

---

### サブスクリプション管理の自動化

#### Webhook追加イベント

```
- customer.subscription.created（新規登録）
- customer.subscription.updated（プラン変更）
- customer.subscription.deleted（解約）
- invoice.payment_succeeded（支払い成功）
- invoice.payment_failed（支払い失敗）
```

---

#### Make.comシナリオ追加

##### サブスク開始時

```
トリガー: customer.subscription.created

アクション:
1. Discord - VIPロール付与
2. Discord - VIP専用チャンネルアクセス許可
3. Brevo - VIPウェルカムメール送信
4. Notion - ステータス更新（VIP会員）
5. Calendly - 週次面談の自動予約設定
```

---

##### 支払い失敗時

```
トリガー: invoice.payment_failed

アクション:
1. Brevo - 支払い失敗メール送信
   件名: 【重要】お支払いが完了しておりません

   本文:
   {{顧客名}} 様

   VIPプレミアムサポートの
   月額料金のお支払いが
   完了しておりません。

   お支払い方法の更新:
   以下のリンクから、
   お支払い方法を更新してください。
   {{顧客ポータルURL}}

   ご注意:
   3日後に再度お支払いを試みます。
   3回失敗すると、
   VIPサービスが自動停止されます。

2. Discord - DMで支払い失敗通知
3. Slack - 運営チームに警告通知
```

---

##### サブスク解約時

```
トリガー: customer.subscription.deleted

アクション:
1. Discord - VIPロール剥奪
2. Discord - VIP専用チャンネルアクセス削除
3. Brevo - 解約確認メール送信
4. Notion - ステータス更新（解約済み）
5. Calendly - 週次面談の自動キャンセル

解約確認メール:
{{顧客名}} 様

VIPプレミアムサポートの
解約が完了しました。

最終利用日:
{{サブスク終了日}}まで
サービスをご利用いただけます。

ご利用ありがとうございました

また機会がございましたら、
ぜひご検討ください。

通常会員としては、
引き続きコミュニティを
ご利用いただけます。

[あなたの名前]
```

---

## Phase 7: 分析・レポート設定

### Stripe Dashboard活用

```
【確認すべき指標】

1. 日次売上
   - 今日の売上
   - 昨日との比較
   - 目標達成率

2. 商品別売上
   - Layer 1 売上
   - Layer 2 売上
   - Layer 3 売上
   - VIP売上

3. 決済成功率
   - 全体の成功率
   - 失敗理由の分析
   - カード種別の傾向

4. MRR（月次経常収益）
   - VIPサブスクの合計
   - 分割払いの月次入金
   - 成長率

5. チャーンレート（解約率）
   - 月次解約率
   - 解約理由
```

---

### Google Sheets自動レポート

#### Make.comシナリオ

```
【スケジュール実行】
毎日午前9時に自動実行

モジュール1: Stripe - 売上データ取得
期間: 過去24時間

モジュール2: Stripe - 顧客数取得
期間: 過去24時間

モジュール3: Google Sheets - データ追加
シート: 日次売上レポート

追加データ:
- 日付
- 売上合計
- 新規顧客数
- Layer 1 売上
- Layer 2 売上
- Layer 3 売上
- VIP売上
- 決済成功率

モジュール4: Slack - レポート通知
チャンネル: #日次レポート

メッセージ:
**日次売上レポート**

**{{formatDate(now, "YYYY/MM/DD")}} の結果**

売上合計: ¥{{formatNumber(売上)}}
新規顧客: {{新規顧客数}}人
成功率: {{決済成功率}}%

**商品別内訳**
Layer 1: ¥{{formatNumber(layer1)}}
Layer 2: ¥{{formatNumber(layer2)}}
Layer 3: ¥{{formatNumber(layer3)}}
VIP: ¥{{formatNumber(vip)}}

<https://sheets.google.com/your-sheet|詳細を見る>
```

---

## Phase 8: セキュリティ・本番移行

### 本番環境移行チェックリスト

```
□ Stripeアカウント審査完了
□ 銀行口座登録完了
□ インボイス登録番号設定
□ テストモードで全フロー確認
□ Webhook署名検証実装
□ SSL証明書導入（HTTPS必須）
□ 特定商取引法表記ページ作成
□ プライバシーポリシー作成
□ 利用規約作成
□ 返金ポリシー明記
□ キャンセルポリシー明記
□ 本番APIキーに切り替え
□ 決済テスト（少額で）
□ 顧客サポート体制確立
□ エラー通知設定
```

---

### Webhook署名検証（セキュリティ必須）

```javascript
// Node.js例（Make.comでも応用可能）

const stripe = require('stripe')('sk_live_xxxxx');
const endpointSecret = 'whsec_xxxxx';

// Webhookハンドラー
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // 署名を検証
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    // 署名が無効な場合は拒否
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // イベント処理
  switch (event.type) {
    case 'checkout.session.completed':
      // 決済完了処理
      break;
    case 'payment_intent.payment_failed':
      // 決済失敗処理
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

**Make.comでの実装**:
```
モジュール1: Webhook受信

モジュール2: HTTP - 署名検証
URL: https://your-server.com/verify-signature
Method: POST
Body: {{1.raw}}
Headers:
  Stripe-Signature: {{1.headers.stripe-signature}}

条件分岐:
検証成功 → 処理続行
検証失敗 → エラー通知
```

---

## Phase 9: 顧客ポータル設定

### 顧客セルフサービスポータル

```
【目的】
顧客が自分で以下を管理できる：
- 支払い方法の更新
- 請求書のダウンロード
- サブスクリプションの解約
- プラン変更
```

---

### 設定手順

```
【Stripeダッシュボード操作】

1. 設定 → Billing → 顧客ポータル
2. 「顧客ポータルを有効にする」
3. カスタマイズ：

デザイン:
ロゴ: あなたのロゴ画像
カラー: ブランドカラー

機能:
- 支払い方法の更新
- 請求書のダウンロード
- サブスクリプションのキャンセル
- サブスクリプションの一時停止
- プランのアップグレード（手動対応）

キャンセルポリシー:
即座にキャンセル: 有効
期間終了時にキャンセル: 有効
キャンセル前のアンケート: 有効
質問: 「解約理由を教えてください」

4. ポータルURLを取得
   例: https://billing.stripe.com/p/login/xxxxx
```

---

### ポータルリンクの埋め込み

```
【Discord #よくある質問 に固定投稿】

支払い方法の変更・解約について

支払い方法の変更や
サブスクリプションの解約は、
顧客ポータルから可能です。

▼ 顧客ポータルにアクセス
https://billing.stripe.com/p/login/xxxxx

ログイン方法:
登録したメールアドレスを入力すると、
ログインリンクが送信されます。

できること:
- 支払い方法の更新
- 請求書のダウンロード
- サブスクリプションの解約
- 請求履歴の確認

不明点があれば、
#技術質問 で聞いてください！
```

---

## 完成！次のステップ

Stripe完全決済システムの構築が完了しました。

---

### 最終確認チェックリスト

```
- Stripeアカウント設定完了
- 商品・価格設定完了（Layer 1-3, VIP）
- Payment Link作成完了
- Thank Youページ作成完了
- Webhook設定完了
- Make.com自動化シナリオ完成
- Discord連携動作確認
- メール配信連携確認
- Notion/Airtable連携確認
- 自動請求書発行設定
- サブスクリプション設定
- 顧客ポータル設定
- 本番環境移行完了
- 決済テスト完了
```

---

### 実装されたシステムの全貌

```
【実装完了した機能】

決済機能:
- 一括払い（Layer 1-3）
- 分割払い（6/12/24回）
- サブスク課金（VIP）
- カード/Apple Pay/Google Pay

自動化機能:
- Discord ロール自動付与
- Discord DM自動送信
- ウェルカムメール自動送信
- 顧客DB自動登録（Notion）
- 運営チーム通知（Slack）
- 自動請求書発行
- 支払い失敗時の自動リトライ
- 支払い失敗通知
- サブスク解約時の自動処理

管理機能:
- 日次売上レポート自動生成
- Google Sheets自動記録
- Slack自動通知
- 顧客ポータル（セルフサービス）

セキュリティ:
- Webhook署名検証
- HTTPS必須
- Stripe標準セキュリティ
```

---

### 月1000件販売達成の準備完了

```
【システムの処理能力】

決済処理: 無制限（Stripe標準）
Discord連携: 瞬時（自動）
メール送信: 無制限（Brevo）
DB記録: 瞬時（Notion）

→ 月1000件どころか、
  月10,000件でも対応可能！
```

---

### 次に進むべきは？

1. **エルグラム自動DM設定**
   - Instagram連携
   - コメント自動検知
   - 自動DM送信
   - 特典ページリンク

2. **Make.com完全自動化深掘り**
   - より高度な分岐処理
   - エラーハンドリング強化
   - A/Bテスト自動化

3. **アフィリエイトシステム構築**
   - 紹介コード発行
   - 報酬自動計算
   - 支払い自動化
