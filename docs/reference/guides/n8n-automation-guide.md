# 完全無料で実現！Make.com完全自動化深掘りガイド【n8nセルフホスト版】

---

## 重要：無料での実現方法

Make.comの無料プランには以下の制限があります：

```
【Make.com無料プラン制限（2026年版）】

- 月間1,000オペレーション
- アクティブシナリオ: 2個まで
- 実行間隔: 最短15分
- データ転送: 制限あり
- 高度な機能制限あり
```

**結論: Make.comの無料プランでは月1000件販売の自動化は不可能**

---

## 完全無料の代替ソリューション: n8n（セルフホスト）

### n8nとは？

```
【n8nの特徴】

- 完全オープンソース（無料）
- 無制限のワークフロー実行
- 無制限のアクティブシナリオ
- Make.comと同等以上の機能
- 自分のサーバーで運用（完全制御）
- データプライバシー保護
- カスタマイズ自由
```

**推奨: n8n セルフホスト版（完全無料）**

---

## Phase 1: n8n完全無料セットアップ【詳細版】

### 必要なもの

| 項目 | 推奨 | コスト |
|-----|------|-------|
| **サーバー** | Oracle Cloud (Always Free) | **無料** |
| **ドメイン** | Freenom / DuckDNS | **無料** |
| **SSL証明書** | Let's Encrypt | **無料** |
| **データベース** | PostgreSQL（サーバー内） | **無料** |

---

### Step 1: Oracle Cloud Always Free登録

#### Oracle Cloudの無料枠（永久無料）

```
【Always Free枠】

- VM.Standard.E2.1.Micro（2個まで）
  - CPU: 1 OCPU
  - メモリ: 1GB
  - ストレージ: 50GB
  - 転送量: 10TB/月
- Block Volume: 200GB
- Object Storage: 20GB

→ n8n運用には十分すぎる性能！
```

---

#### 1-1: アカウント作成

```
1. https://www.oracle.com/jp/cloud/free/ にアクセス
2. 「無料で始める」をクリック
3. 必要情報を入力：
   - メールアドレス
   - 国: 日本
   - クレジットカード（無料枠超過防止のため必要、課金されない）
4. メール認証
5. アカウント作成完了
```

---

#### 1-2: VMインスタンス作成

```
【Oracle Cloud Console操作】

1. ログイン後、「インスタンスの作成」をクリック

2. 設定：

基本情報:
名前: n8n-server
コンパートメント: ルート

イメージとシェイプ:
イメージ: Ubuntu 22.04
シェイプ: VM.Standard.E2.1.Micro（Always Free対象）

ネットワーキング:
VCN: デフォルトのVCN
サブネット: パブリックサブネット
パブリックIPアドレス: 割り当て

SSHキーの追加:
SSHキーの生成: 「秘密キーの保存」をクリック
→ ダウンロードした秘密キーを保存

3. 「作成」をクリック
4. プロビジョニング完了まで数分待機
5. パブリックIPアドレスをメモ
   例: 150.230.XXX.XXX
```

---

#### 1-3: ファイアウォール設定

```
【セキュリティリスト設定】

1. VCN詳細 → セキュリティリスト → デフォルトセキュリティリスト
2. イングレスルールを追加：

ルール1: HTTP
- ソースCIDR: 0.0.0.0/0
- IPプロトコル: TCP
- 宛先ポート範囲: 80

ルール2: HTTPS
- ソースCIDR: 0.0.0.0/0
- IPプロトコル: TCP
- 宛先ポート範囲: 443

ルール3: n8n（開発時のみ）
- ソースCIDR: 0.0.0.0/0
- IPプロトコル: TCP
- 宛先ポート範囲: 5678
```

---

### Step 2: サーバーへの接続とセットアップ

#### 2-1: SSH接続

```bash
# Mac/Linux
chmod 400 /path/to/ssh-key-*.key
ssh -i /path/to/ssh-key-*.key ubuntu@150.230.XXX.XXX

# Windows (PowerShell)
ssh -i C:\path\to\ssh-key-*.key ubuntu@150.230.XXX.XXX
```

---

#### 2-2: システムアップデート

```bash
# システムパッケージの更新
sudo apt update && sudo apt upgrade -y

# 必要なツールのインストール
sudo apt install -y curl git wget nano
```

---

### Step 3: Docker & Docker Compose インストール

```bash
# Dockerのインストール
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# Docker Composeのインストール
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# インストール確認
docker --version
docker-compose --version

# 再ログイン（グループ権限反映のため）
exit
# 再度SSH接続
```

---

### Step 4: n8n + PostgreSQL セットアップ

#### 4-1: ディレクトリ作成

```bash
mkdir -p ~/n8n
cd ~/n8n
```

---

#### 4-2: docker-compose.yml作成

```bash
nano docker-compose.yml
```

以下を貼り付け：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8n_password_change_me
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U n8n']
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment:
      # データベース設定
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: n8n_password_change_me

      # n8n基本設定
      N8N_BASIC_AUTH_ACTIVE: 'true'
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: change_this_password

      # Webhook設定
      WEBHOOK_URL: http://150.230.XXX.XXX:5678/

      # タイムゾーン
      GENERIC_TIMEZONE: Asia/Tokyo
      TZ: Asia/Tokyo

      # その他
      N8N_DIAGNOSTICS_ENABLED: 'false'
      N8N_PERSONALIZATION_ENABLED: 'false'
    ports:
      - '5678:5678'
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - n8n-network

volumes:
  postgres_data:
  n8n_data:

networks:
  n8n-network:
    driver: bridge
```

**Ctrl+O（保存）、Enter、Ctrl+X（終了）**

---

#### 4-3: 環境変数の変更

```bash
# docker-compose.ymlを編集
nano docker-compose.yml

# 以下を変更：
1. POSTGRES_PASSWORD: 強力なパスワードに変更
2. DB_POSTGRESDB_PASSWORD: 同じパスワード
3. N8N_BASIC_AUTH_PASSWORD: n8nログイン用パスワード
4. WEBHOOK_URL: あなたのパブリックIP
   例: http://150.230.XXX.XXX:5678/
```

---

#### 4-4: n8n起動

```bash
# コンテナ起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 以下が表示されればOK:
# n8n    | Editor is now accessible via:
# n8n    | http://150.230.XXX.XXX:5678/

# Ctrl+C でログ表示を終了
```

---

### Step 5: n8nへのアクセス

```
ブラウザで以下にアクセス:
http://150.230.XXX.XXX:5678/

ログイン情報:
ユーザー名: admin
パスワード: （docker-compose.ymlで設定したもの）
```

**n8nが起動しました！**

---

## Phase 2: SSL化（HTTPS対応）【完全無料】

### 無料ドメイン取得（DuckDNS）

```
【DuckDNS - 完全無料のダイナミックDNS】

1. https://www.duckdns.org/ にアクセス
2. Googleアカウントでログイン
3. ドメイン名を入力（例: your-n8n）
   → your-n8n.duckdns.org が取得できる
4. IPアドレスに Oracle CloudのパブリックIPを入力
5. 「add domain」をクリック
6. トークンをコピー（後で使用）
```

---

### Nginx + Let's Encrypt設定

#### Step 1: Nginxインストール

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

#### Step 2: Nginx設定ファイル作成

```bash
sudo nano /etc/nginx/sites-available/n8n
```

以下を貼り付け（ドメインを変更）：

```nginx
server {
    listen 80;
    server_name your-n8n.duckdns.org;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Webhook用の設定
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

#### Step 3: Nginx有効化

```bash
# シンボリックリンク作成
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# デフォルト設定を無効化
sudo rm /etc/nginx/sites-enabled/default

# 設定テスト
sudo nginx -t

# Nginx再起動
sudo systemctl restart nginx
```

---

#### Step 4: SSL証明書取得（Let's Encrypt）

```bash
# SSL証明書の自動取得・設定
sudo certbot --nginx -d your-n8n.duckdns.org

# 質問に答える:
# Email: あなたのメールアドレス
# Terms: Agree
# Share email: No
# Redirect: Yes (HTTPSへ自動リダイレクト)

# 証明書の自動更新設定
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

#### Step 5: docker-compose.yml更新

```bash
cd ~/n8n
nano docker-compose.yml

# WEBHOOK_URLを変更:
WEBHOOK_URL: https://your-n8n.duckdns.org/
```

```bash
# n8n再起動
docker-compose down
docker-compose up -d
```

---

**HTTPS対応完了！**

```
新しいアクセスURL:
https://your-n8n.duckdns.org/
```

---

## Phase 3: Stripe → n8n → Discord 完全自動化

### n8nでの自動化シナリオ構築

---

### Step 1: Webhook受信ノード作成

```
【n8n操作】

1. 左上の「+」→ 新規ワークフロー作成
2. 「+」ボタン → 「Webhook」を検索
3. Webhookノードを追加
4. 設定:
   - HTTP Method: POST
   - Path: stripe-webhook
   - Authentication: None（Stripe署名で検証）

5. 「Test URL」をコピー
   例: https://your-n8n.duckdns.org/webhook-test/stripe-webhook

6. 「Listen for Test Event」をクリック
```

---

### Step 2: Stripeにwebhook URL登録

```
【Stripeダッシュボード操作】

1. 開発者 → Webhook
2. エンドポイントを追加
3. URL: https://your-n8n.duckdns.org/webhook/stripe-webhook
   （本番用URL、/webhook-test/ を /webhook/ に変更）
4. イベント選択:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - invoice.paid
   - invoice.payment_failed
   - customer.subscription.created
   - customer.subscription.deleted
5. エンドポイントを追加
6. 「署名シークレット」をコピー
```

---

### Step 3: 完全ワークフロー構築

#### ワークフロー全体図

```
【n8nワークフロー】

1. Webhook（Stripe）
    ↓
2. Switch（イベントタイプ判定）
    ├→ checkout.session.completed
    │   ↓
    │   3. HTTP Request（Stripe顧客情報取得）
    │   ↓
    │   4. HTTP Request（Discord検索）
    │   ↓
    │   5. HTTP Request（Discordロール付与）
    │   ↓
    │   6. HTTP Request（Discord DM送信）
    │   ↓
    │   7. HTTP Request（Brevoメール送信）
    │   ↓
    │   8. Notion（顧客DB追加）
    │   ↓
    │   9. HTTP Request（Slack通知）
    │
    └→ payment_intent.payment_failed
        ↓
        10. HTTP Request（Brevo失敗メール）
        ↓
        11. HTTP Request（Slack警告）
```

---

#### ノード詳細設定

##### ノード1: Webhook

```
すでに作成済み
```

---

##### ノード2: Switch（イベントタイプ判定）

```
【n8n操作】

1. 「+」→「Switch」を検索して追加
2. Mode: Rules
3. ルール1:
   - Property Name: {{ $json.type }}
   - Operation: Equal
   - Value: checkout.session.completed
4. ルール2:
   - Property Name: {{ $json.type }}
   - Operation: Contains
   - Value: failed
```

---

##### ノード3: HTTP Request（Stripe顧客情報取得）

```
【設定】

Method: GET
URL: https://api.stripe.com/v1/customers/{{ $json.data.object.customer }}

Authentication: Header Auth
Header:
  Name: Authorization
  Value: Bearer sk_live_YOUR_STRIPE_SECRET_KEY

Options:
  Response Format: JSON
```

---

##### ノード4: HTTP Request（Discord検索）

```
【設定】

Method: GET
URL: https://discord.com/api/v10/guilds/YOUR_GUILD_ID/members/search
Query Parameters:
  query: {{ $node["HTTP Request"].json["email"] }}
  limit: 1

Authentication: Header Auth
Header:
  Name: Authorization
  Value: Bot YOUR_BOT_TOKEN
```

---

##### ノード5: HTTP Request（Discordロール付与）

```
【設定】

Method: PUT
URL: https://discord.com/api/v10/guilds/YOUR_GUILD_ID/members/{{ $json[0].user.id }}/roles/DIAMOND_ROLE_ID

Authentication: Header Auth
Header:
  Name: Authorization
  Value: Bot YOUR_BOT_TOKEN

Body:
  Content-Type: application/json
  Body: {}
```

---

##### ノード6: HTTP Request（Discord DM送信）

```
【設定】

Method: POST
URL: https://discord.com/api/v10/users/@me/channels

Authentication: Header Auth
Header:
  Name: Authorization
  Value: Bot YOUR_BOT_TOKEN

Body:
  Content-Type: application/json
  Body:
  {
    "recipient_id": "{{ $node["HTTP Request 1"].json[0].user.id }}"
  }

↓ 次にメッセージ送信ノードを追加

Method: POST
URL: https://discord.com/api/v10/channels/{{ $json.id }}/messages

Body:
{
  "content": "ご購入ありがとうございます！\n\n{{ $node[\"HTTP Request\"].json[\"name\"] }} さん\n\n【AI自動収益システム構築\n 完全マスタープログラム】\n\nへのご参加、本当にありがとうございます！\n\n次のステップ:\n\nStep 1: キックオフ面談を予約\nhttps://calendly.com/your-link\n\nStep 2: 事前アンケートに回答\nhttps://forms.gle/your-form\n\nStep 3: 会員専用チャンネルを確認\n<#CHANNEL_ID>\n\n6ヶ月後、月100万円達成を\n一緒に目指しましょう！"
}
```

---

##### ノード7: HTTP Request（Brevoメール送信）

```
【設定】

Method: POST
URL: https://api.brevo.com/v3/smtp/email

Authentication: Header Auth
Header:
  Name: api-key
  Value: YOUR_BREVO_API_KEY

Body:
  Content-Type: application/json
  Body:
  {
    "sender": {
      "name": "あなたの名前",
      "email": "support@yourdomain.com"
    },
    "to": [
      {
        "email": "{{ $node[\"Webhook\"].json[\"data\"][\"object\"][\"customer_email\"] }}",
        "name": "{{ $node[\"HTTP Request\"].json[\"name\"] }}"
      }
    ],
    "subject": "【ご購入ありがとうございます】キックオフ面談のご案内",
    "htmlContent": "<html>...（メール内容）...</html>"
  }
```

---

##### ノード8: Notion（顧客DB追加）

```
【設定】

1. 「+」→「Notion」を検索
2. 「Create Database Page」を選択
3. Notionに接続（OAuth認証）
4. Database: 顧客管理DB
5. プロパティマッピング:
   - 氏名: {{ $node["HTTP Request"].json["name"] }}
   - メール: {{ $node["Webhook"].json["data"]["object"]["customer_email"] }}
   - 購入日: {{ $node["Webhook"].json["created"] }}
   - 商品: Layer 3
   - 金額: {{ $node["Webhook"].json["data"]["object"]["amount_total"] }}
   - Discord ID: {{ $node["HTTP Request 1"].json[0].user.id }}
   - ステータス: 購入完了
```

---

##### ノード9: HTTP Request（Slack通知）

```
【設定】

Method: POST
URL: https://slack.com/api/chat.postMessage

Authentication: Header Auth
Header:
  Name: Authorization
  Value: Bearer YOUR_SLACK_BOT_TOKEN

Body:
  Content-Type: application/json
  Body:
  {
    "channel": "C0XXXXXXXXX",
    "text": "*新規購入がありました！*",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*顧客情報*\n氏名: {{ $node[\"HTTP Request\"].json[\"name\"] }}\nメール: {{ $node[\"Webhook\"].json[\"data\"][\"object\"][\"customer_email\"] }}"
        }
      }
    ]
  }
```

---

### Step 4: エラーハンドリング追加

#### 各ノードにエラーハンドラーを設定

```
【n8n操作】

1. 任意のノードをクリック
2. 右上の「設定」→「Settings」
3. 「On Error」セクション:
   - Error Workflow: Create New Error Workflow
4. エラー用ワークフローが開く
5. 以下を追加:

エラーワークフロー:

ノード1: Error Trigger（自動追加済み）
   ↓
ノード2: Set（エラー情報整形）
   ↓
ノード3: HTTP Request（Slack通知）
   URL: Slack Webhook URL
   Method: POST
   Body:
   {
     "text": "n8nエラー発生",
     "blocks": [
       {
         "type": "section",
         "text": {
           "type": "mrkdwn",
           "text": "*エラー詳細*\nワークフロー: {{ $json.workflow.name }}\nノード: {{ $json.node.name }}\nエラー: {{ $json.error.message }}"
         }
       }
     ]
   }
```

---

### Step 5: リトライ設定

```
【各ノードの設定】

1. ノードをクリック
2. 右上「設定」→「Settings」
3. 「Retry On Fail」を有効化
4. 設定:
   - Max Tries: 3
   - Wait Between Tries: 5秒
```

---

## Phase 4: A/Bテスト自動化【完全無料】

### A/Bテストの設計

```
【テスト対象例】

テストA: メール件名
- パターン1: 【残り7枠】あなたのために60分の無料相談
- パターン2: 【限定】月100万円への第一歩を踏み出しませんか？

テストB: ウェルカムメールのCTA
- パターン1: キックオフ面談を予約する
- パターン2: 今すぐ始める

テストC: Discord DM内容
- パターン1: 短文（50文字）
- パターン2: 長文（200文字）
```

---

### n8nでのA/Bテスト実装

#### ワークフロー

```
1. Webhook（Stripe決済完了）
    ↓
2. Function（ランダムAB振り分け）
    ↓
3. Switch（AかBか判定）
    ├→ A: パターンA実行
    │   ↓
    │   4A. Brevo（メールA送信）
    │   ↓
    │   5A. Notion（結果記録: variant=A）
    │
    └→ B: パターンB実行
        ↓
        4B. Brevo（メールB送信）
        ↓
        5B. Notion（結果記録: variant=B）
```

---

#### ノード2: Function（AB振り分け）

```javascript
// n8n Function ノード

// 入力データを取得
const inputData = $input.all();

// ランダムにA/Bを割り当て（50%ずつ）
const variant = Math.random() < 0.5 ? 'A' : 'B';

// 元のデータに variant を追加
const outputData = inputData.map(item => {
  return {
    json: {
      ...item.json,
      ab_test_variant: variant,
      ab_test_timestamp: new Date().toISOString()
    }
  };
});

return outputData;
```

---

#### ノード3: Switch（variant判定）

```
Mode: Rules

ルール1:
- Property: {{ $json.ab_test_variant }}
- Operation: Equal
- Value: A

ルール2:
- Property: {{ $json.ab_test_variant }}
- Operation: Equal
- Value: B
```

---

#### ノード4A/4B: メール送信（パターン別）

```
【4A: パターンA】

Method: POST
URL: https://api.brevo.com/v3/smtp/email
Body:
{
  "subject": "【残り7枠】あなたのために60分の無料相談",
  ...
}

【4B: パターンB】

Method: POST
URL: https://api.brevo.com/v3/smtp/email
Body:
{
  "subject": "【限定】月100万円への第一歩を踏み出しませんか？",
  ...
}
```

---

#### ノード5A/5B: Notion記録

```
【Notion DBに追加】

プロパティ:
- 顧客ID: {{ $json.customer_id }}
- AB variant: {{ $json.ab_test_variant }}
- テスト開始日: {{ $json.ab_test_timestamp }}
- 件名: {{ $json.subject }}
- 開封: 未（後で更新）
- クリック: 未（後で更新）
- 購入: 未（後で更新）
```

---

### A/Bテスト結果の計測

#### メール開封・クリックの追跡

```
【Brevoの自動トラッキング】

Brevoは自動で以下を計測:
- 開封率
- クリック率
- バウンス率
- 配信解除率

→ Notion DBを手動更新 or Brevo APIで自動取得
```

---

#### 結果集計ワークフロー

```
【n8n定期実行ワークフロー】

1. Schedule Trigger（毎日1回実行）
    ↓
2. HTTP Request（Brevo API - 統計取得）
    ↓
3. Function（データ整形）
    ↓
4. Notion（DBアップデート）
    ↓
5. Function（統計計算）
    - パターンA開封率
    - パターンB開封率
    - 統計的有意差の計算
    ↓
6. Slack（結果通知）
```

---

#### Function: 統計計算

```javascript
// n8n Function ノード

const items = $input.all();

// パターンA/Bのデータを分離
const patternA = items.filter(item => item.json.ab_test_variant === 'A');
const patternB = items.filter(item => item.json.ab_test_variant === 'B');

// 開封率計算
const openRateA = patternA.filter(item => item.json.opened).length / patternA.length;
const openRateB = patternB.filter(item => item.json.opened).length / patternB.length;

// クリック率計算
const clickRateA = patternA.filter(item => item.json.clicked).length / patternA.length;
const clickRateB = patternB.filter(item => item.json.clicked).length / patternB.length;

// 購入率計算
const conversionRateA = patternA.filter(item => item.json.purchased).length / patternA.length;
const conversionRateB = patternB.filter(item => item.json.purchased).length / patternB.length;

// 結果
const result = {
  pattern_a: {
    count: patternA.length,
    open_rate: (openRateA * 100).toFixed(2) + '%',
    click_rate: (clickRateA * 100).toFixed(2) + '%',
    conversion_rate: (conversionRateA * 100).toFixed(2) + '%'
  },
  pattern_b: {
    count: patternB.length,
    open_rate: (openRateB * 100).toFixed(2) + '%',
    click_rate: (clickRateB * 100).toFixed(2) + '%',
    conversion_rate: (conversionRateB * 100).toFixed(2) + '%'
  },
  winner: conversionRateA > conversionRateB ? 'A' : 'B',
  improvement: Math.abs(((conversionRateA - conversionRateB) / conversionRateB) * 100).toFixed(2) + '%'
};

return [{ json: result }];
```

---

## Phase 5: 高度なエラーハンドリング

### エラーの種類別対応

```
【エラータイプ】

1. ネットワークエラー（一時的）
   → 自動リトライ（3回）

2. 認証エラー（永続的）
   → 即座にSlack通知 + 処理停止

3. データ不正エラー（永続的）
   → エラーログ記録 + 代替処理

4. レート制限エラー（一時的）
   → 待機してリトライ
```

---

### グローバルエラーハンドラー

```
【n8n設定】

1. 左メニュー → Workflows
2. 「Create Error Workflow」
3. 以下のワークフローを作成:

グローバルエラーワークフロー:

ノード1: Error Trigger
   ↓
ノード2: Switch（エラータイプ判定）
   ├→ 認証エラー
   │   ↓
   │   ノード3A: Slack（緊急通知）
   │   ↓
   │   ノード4A: Stop and Error
   │
   ├→ レート制限
   │   ↓
   │   ノード3B: Wait（60秒）
   │   ↓
   │   ノード4B: Resume（リトライ）
   │
   └→ その他
       ↓
       ノード3C: Notion（エラーログ記録）
       ↓
       ノード4C: Slack（通常通知）
```

---

### Notion エラーログDB

```
【Notion DB構造】

テーブル名: エラーログ

カラム:
- 発生日時: 日付
- ワークフロー名: テキスト
- ノード名: テキスト
- エラータイプ: セレクト
- エラーメッセージ: テキスト
- 入力データ: テキスト
- スタックトレース: テキスト
- ステータス: セレクト（未対応/対応中/解決済み）
- 担当者: ユーザー
```

---

## Phase 6: モニタリング・ダッシュボード

### 無料モニタリングツール: Uptime Robot

```
【Uptime Robot設定】

1. https://uptimerobot.com/ でアカウント作成（無料）
2. 「Add New Monitor」
3. 設定:
   - Monitor Type: HTTP(s)
   - Friendly Name: n8n Webhook
   - URL: https://your-n8n.duckdns.org/webhook/health-check
   - Monitoring Interval: 5分
4. Alert Contacts: メールアドレス追加

→ n8nがダウンしたら即座に通知
```

---

### n8n Health Check Webhook

```
【n8nワークフロー作成】

1. Webhook（/health-check）
    ↓
2. Respond to Webhook
    Status Code: 200
    Body:
    {
      "status": "ok",
      "timestamp": "{{ $now.toISO() }}"
    }
```

---

### Notion ダッシュボード

```
【Notion ページ構成】

ページ: 自動化システムダッシュボード

今日の統計:
（Notionデータベースのリンクビューを埋め込み）

- 今日の決済数: 5件
- 今日の売上: ¥1,490,000
- Discord連携成功率: 100%
- エラー発生数: 0件

最新のアクティビティ:
（顧客DBのタイムラインビュー）

- 14:23 田中太郎さんが購入
- 14:22 Discord連携完了
- 14:22 ウェルカムメール送信
- 14:15 山田花子さんが購入

エラーログ（未解決）:
（エラーログDBのフィルタビュー）

現在: 0件

A/Bテスト結果:
パターンA: 開封率 42.3%
パターンB: 開封率 38.7%

勝者: パターンA（+9.3%改善）
```

---

## Phase 7: バックアップ・復旧

### 自動バックアップ設定

```bash
# バックアップスクリプト作成
nano ~/backup-n8n.sh
```

以下を貼り付け：

```bash
#!/bin/bash

# バックアップディレクトリ
BACKUP_DIR="/home/ubuntu/n8n-backups"
DATE=$(date +%Y%m%d-%H%M%S)

# ディレクトリ作成
mkdir -p $BACKUP_DIR

# PostgreSQLバックアップ
docker exec n8n-postgres-1 pg_dump -U n8n n8n > $BACKUP_DIR/n8n-db-$DATE.sql

# n8nデータバックアップ
docker cp n8n-n8n-1:/home/node/.n8n $BACKUP_DIR/n8n-data-$DATE

# 古いバックアップ削除（7日以上前）
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "n8n-data-*" -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $DATE"
```

```bash
# 実行権限付与
chmod +x ~/backup-n8n.sh

# Cron設定（毎日午前3時に実行）
crontab -e

# 以下を追加:
0 3 * * * /home/ubuntu/backup-n8n.sh >> /home/ubuntu/backup.log 2>&1
```

---

## コスト比較: n8n vs Make.com

| 項目 | n8n（セルフホスト） | Make.com有料プラン |
|-----|---------------------|-------------------|
| **月額費用** | **¥0（完全無料）** | ¥1,200〜¥12,000 |
| **実行回数** | **無制限** | 1,000〜10,000回 |
| **アクティブシナリオ** | **無制限** | 2〜無制限 |
| **データ保持** | **永久** | 制限あり |
| **カスタマイズ** | **完全自由** | 制限あり |
| **プライバシー** | **完全制御** | サービス依存 |

**年間節約額: ¥14,400〜¥144,000**

---

## 完成！次のステップ

完全無料のn8n自動化システムが完成しました！

---

### 実装完了した機能

```
- n8nセルフホスト（完全無料）
- HTTPS対応（Let's Encrypt）
- Stripe → Discord 完全自動化
- エラーハンドリング
- A/Bテスト自動化
- モニタリング（Uptime Robot）
- 自動バックアップ
- Notionダッシュボード
- 無制限のワークフロー実行
```

---

### 次に実装すべき機能（オプション）

1. **Instagram自動DM（エルグラム連携）**
2. **アフィリエイトシステム（紹介コード自動発行）**
3. **高度なセグメンテーション（顧客行動分析）**
4. **予測分析（購入確率予測）**
5. **自動レポート生成（週次・月次）**
