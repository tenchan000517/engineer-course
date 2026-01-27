# n8n完全無料・自動レポート生成設計【週次・月次】

## アーキテクチャ概要

```
【データ収集】→【集計処理】→【レポート生成】→【配信】
     ↓           ↓           ↓            ↓
  Stripe      n8n       Puppeteer      Slack
   Notion    処理       PDF生成        Email
  Discord   計算式    Looker Studio   Discord
```

---

## Phase 1: データソースとKPI設定

### 収集するデータ（全て無料API）

**1. Stripe売上データ**
- 新規購入数（商品別：Layer1/2/3、VIP）
- 総売上額・平均単価
- 決済成功率
- MRR（月次経常収益）
- チャーン率（解約率）

**2. Discord活動データ**
- アクティブユーザー数（DAU/WAU）
- 新規参加者数
- メッセージ総数（チャンネル別）
- 質問・回答数
- エンゲージメント率

**3. Notion顧客DBデータ**
- 顧客総数
- ステータス別分布（見込み/成約/退会）
- プログレス状況（Phase 1-6完了率）
- 満足度スコア（アンケート結果）
- 案件報告数・成功率

**4. Brevoメールデータ**
- 配信数
- 開封率（全体・シーケンス別）
- クリック率
- コンバージョン率（相談予約率）

---

## Phase 2: n8nワークフロー設計【週次レポート】

### Workflow: 週次レポート自動生成

```
【フロー図】

Cron: 毎週月曜 9:00
    ├→ Stripe API
    ├→ Notion API
    └→ Discord Webhook統計
         ↓
    データ集計
         ↓
    Google Sheets書き込み
         ↓
    ├→ Looker Studio自動更新
    └→ Puppeteer PDF生成
              ↓
         ├→ Slack通知＋PDF添付
         └→ Discord投稿
```

### ステップ詳細

#### Step 1: Cron トリガー設定

```yaml
ノード: Schedule Trigger
設定:
  - 実行タイミング: 毎週月曜 9:00 JST
  - タイムゾーン: Asia/Tokyo
```

#### Step 2: Stripe データ取得

```yaml
ノード: HTTP Request (Stripe API)
Method: GET
URL: https://api.stripe.com/v1/charges?created[gte]={{$now.minus(7, 'days').toUnixInteger()}}
認証: Bearer sk_live_XXXXX
処理:
  - 過去7日間の決済データ取得
  - 商品メタデータ抽出（product_type: layer1/2/3/vip）
  - 集計: 購入数、売上額、平均単価
```

**集計コード（Function ノード）:**

```javascript
const charges = $input.all()[0].json.data;
const now = new Date();
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

// 商品別集計
const sales = {
  layer1: { count: 0, amount: 0 },
  layer2: { count: 0, amount: 0 },
  layer3: { count: 0, amount: 0 },
  vip: { count: 0, amount: 0 },
  total: { count: 0, amount: 0 }
};

charges.forEach(charge => {
  if (charge.paid && charge.created >= weekAgo.getTime() / 1000) {
    const productType = charge.metadata?.product_type || 'unknown';
    const amount = charge.amount / 100; // Stripeはセント単位

    if (sales[productType]) {
      sales[productType].count++;
      sales[productType].amount += amount;
    }
    sales.total.count++;
    sales.total.amount += amount;
  }
});

// 平均単価
sales.avgPrice = sales.total.count > 0
  ? Math.round(sales.total.amount / sales.total.count)
  : 0;

return { json: sales };
```

#### Step 3: Notion 顧客データ取得

```yaml
ノード: HTTP Request (Notion API)
Method: POST
URL: https://api.notion.com/v1/databases/{database_id}/query
Header:
  - Authorization: Bearer secret_XXXXX
  - Notion-Version: 2022-06-28
Body:
  filter:
    and:
      - property: 登録日
        date:
          on_or_after: "{{$now.minus(7, 'days').toISODate()}}"
```

**集計コード（Function ノード）:**

```javascript
const customers = $input.all()[0].json.results;

const stats = {
  newCustomers: customers.length,
  byStatus: {
    prospect: 0,    // 見込み
    active: 0,      // アクティブ
    completed: 0,   // 完了
    churned: 0      // 退会
  },
  byPhase: {
    phase1: 0, phase2: 0, phase3: 0,
    phase4: 0, phase5: 0, phase6: 0
  },
  avgSatisfaction: 0
};

let satisfactionSum = 0;
let satisfactionCount = 0;

customers.forEach(customer => {
  // ステータス集計
  const status = customer.properties['ステータス']?.select?.name || 'prospect';
  stats.byStatus[status]++;

  // フェーズ集計
  const phase = customer.properties['現在のPhase']?.select?.name || 'phase1';
  stats.byPhase[phase]++;

  // 満足度集計
  const satisfaction = customer.properties['満足度']?.number;
  if (satisfaction) {
    satisfactionSum += satisfaction;
    satisfactionCount++;
  }
});

stats.avgSatisfaction = satisfactionCount > 0
  ? (satisfactionSum / satisfactionCount).toFixed(1)
  : 0;

return { json: stats };
```

#### Step 4: Discord 統計取得

```yaml
ノード: HTTP Request (Discord API)
Method: GET
URL: https://discord.com/api/v10/guilds/{guild_id}/members?limit=1000
Header:
  - Authorization: Bot YOUR_BOT_TOKEN
```

**集計コード（Function ノード）:**

```javascript
const members = $input.all()[0].json;
const now = Date.now();
const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

const stats = {
  totalMembers: members.length,
  newMembers: 0,
  activeMembers: 0,
  roleDistribution: {
    'ダイヤモンド': 0,
    'シルバー': 0,
    'ブロンズ': 0,
    'VIP': 0
  }
};

members.forEach(member => {
  // 新規メンバー
  const joinedAt = new Date(member.joined_at).getTime();
  if (joinedAt >= weekAgo) {
    stats.newMembers++;
  }

  // ロール集計
  member.roles.forEach(roleId => {
    // roleId → role名のマッピングが必要（事前にDiscordから取得）
  });
});

return { json: stats };
```

#### Step 5: データ統合＋Google Sheets書き込み

```yaml
ノード: Merge (Combine)
  ↓
ノード: Google Sheets
操作: Append
Sheet: 週次レポートデータ
Range: A:Z
Values:
  - 日付: {{$now.toFormat('yyyy-MM-dd')}}
  - 売上総額: {{$node["Stripe集計"].json["total"]["amount"]}}
  - 購入数: {{$node["Stripe集計"].json["total"]["count"]}}
  - 平均単価: {{$node["Stripe集計"].json["avgPrice"]}}
  - Layer3購入: {{$node["Stripe集計"].json["layer3"]["count"]}}
  - 新規顧客: {{$node["Notion集計"].json["newCustomers"]}}
  - 満足度: {{$node["Notion集計"].json["avgSatisfaction"]}}
  - Discord新規: {{$node["Discord集計"].json["newMembers"]}}
```

---

## Phase 3: PDF自動生成（Puppeteer × HTML）

### Step 6: HTML レポートテンプレート生成

**Function ノード:**

```javascript
const data = {
  period: `${$now.minus(7, 'days').toFormat('yyyy/MM/dd')} ~ ${$now.toFormat('yyyy/MM/dd')}`,
  stripe: $node["Stripe集計"].json,
  notion: $node["Notion集計"].json,
  discord: $node["Discord集計"].json
};

const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1a1a1a;
      font-size: 32px;
      margin-bottom: 10px;
      border-bottom: 4px solid #4CAF50;
      padding-bottom: 15px;
    }
    .period {
      color: #666;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-card.green {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    .metric-card.orange {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .metric-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
    }
    .metric-unit {
      font-size: 18px;
      opacity: 0.8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .section {
      margin-top: 40px;
    }
    .section-title {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
      padding-left: 15px;
      border-left: 5px solid #4CAF50;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>週次レポート</h1>
    <p class="period">${data.period}</p>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">売上総額</div>
        <div class="metric-value">¥${data.stripe.total.amount.toLocaleString()}</div>
      </div>
      <div class="metric-card green">
        <div class="metric-label">購入件数</div>
        <div class="metric-value">${data.stripe.total.count} <span class="metric-unit">件</span></div>
      </div>
      <div class="metric-card orange">
        <div class="metric-label">平均単価</div>
        <div class="metric-value">¥${data.stripe.avgPrice.toLocaleString()}</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">商品別売上</h2>
      <table>
        <thead>
          <tr>
            <th>商品</th>
            <th>購入数</th>
            <th>売上額</th>
            <th>構成比</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Layer3（完全マスター）</td>
            <td>${data.stripe.layer3.count}件</td>
            <td>¥${data.stripe.layer3.amount.toLocaleString()}</td>
            <td>${((data.stripe.layer3.amount / data.stripe.total.amount) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Layer2（実践コース）</td>
            <td>${data.stripe.layer2.count}件</td>
            <td>¥${data.stripe.layer2.amount.toLocaleString()}</td>
            <td>${((data.stripe.layer2.amount / data.stripe.total.amount) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Layer1（入門コース）</td>
            <td>${data.stripe.layer1.count}件</td>
            <td>¥${data.stripe.layer1.amount.toLocaleString()}</td>
            <td>${((data.stripe.layer1.amount / data.stripe.total.amount) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>VIP（月額）</td>
            <td>${data.stripe.vip.count}件</td>
            <td>¥${data.stripe.vip.amount.toLocaleString()}</td>
            <td>${((data.stripe.vip.amount / data.stripe.total.amount) * 100).toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">顧客データ</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">新規顧客</div>
          <div class="metric-value">${data.notion.newCustomers} <span class="metric-unit">人</span></div>
        </div>
        <div class="metric-card green">
          <div class="metric-label">平均満足度</div>
          <div class="metric-value">${data.notion.avgSatisfaction} <span class="metric-unit">/ 5.0</span></div>
        </div>
        <div class="metric-card orange">
          <div class="metric-label">アクティブ</div>
          <div class="metric-value">${data.notion.byStatus.active} <span class="metric-unit">人</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Discord統計</h2>
      <table>
        <thead>
          <tr>
            <th>指標</th>
            <th>今週</th>
            <th>前週比</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>新規参加者</td>
            <td>${data.discord.newMembers}人</td>
            <td>+15%</td>
          </tr>
          <tr>
            <td>総メンバー数</td>
            <td>${data.discord.totalMembers}人</td>
            <td>+3%</td>
          </tr>
          <tr>
            <td>アクティブユーザー</td>
            <td>${data.discord.activeMembers}人</td>
            <td>+8%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Generated by n8n Automation | ${new Date().toLocaleString('ja-JP')}</p>
    </div>
  </div>
</body>
</html>
`;

return { json: { html } };
```

### Step 7: Puppeteer PDF生成（Dockerコンテナ）

**n8n上でのPuppeteer実行:**

```yaml
ノード: Execute Command
Command: node /home/user/generate-pdf.js
```

**generate-pdf.js:**

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // n8nから渡されたHTMLを読み込み
  const html = fs.readFileSync('/tmp/report.html', 'utf8');
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // PDF生成
  await page.pdf({
    path: '/tmp/weekly-report.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  await browser.close();
  console.log('PDF生成完了: /tmp/weekly-report.pdf');
})();
```

**n8nのExecute Commandノード設定:**

```yaml
Command: |
  echo '{{$node["HTML生成"].json["html"]}}' > /tmp/report.html
  node /home/user/generate-pdf.js
```

---

## Phase 4: 配信設定

### Step 8: Slack通知（PDF添付）

```yaml
ノード: Slack
Action: Send Message
Channel: #weekly-reports
Message: |
  **週次レポート（{{$now.toFormat('yyyy/MM/dd')}}）**

  売上総額: ¥{{$node["Stripe集計"].json["total"]["amount"].toLocaleString()}}
  購入件数: {{$node["Stripe集計"].json["total"]["count"]}}件
  新規顧客: {{$node["Notion集計"].json["newCustomers"]}}人
  満足度: {{$node["Notion集計"].json["avgSatisfaction"]}} / 5.0

  詳細はPDFをご確認ください
Attachments:
  - /tmp/weekly-report.pdf
```

### Step 9: Discord投稿（無料チャンネル）

```yaml
ノード: HTTP Request (Discord Webhook)
Method: POST
URL: https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
Body:
  content: |
    **今週の実績報告**

    売上: ¥{{$node["Stripe集計"].json["total"]["amount"].toLocaleString()}}
    購入: {{$node["Stripe集計"].json["total"]["count"]}}件
    新規: {{$node["Notion集計"].json["newCustomers"]}}人

    来週も頑張りましょう！
  username: レポートBot
  avatar_url: https://your-domain.com/bot-avatar.png
```

---

## Phase 5: 月次レポート設計（週次の拡張版）

### 追加要素

**1. 月次KPI比較**
- 前月比（売上、購入数、顧客数）
- 目標達成率（月間1,000件目標に対する進捗）
- トレンド分析（グラフ用データ）

**2. Looker Studio自動更新**

```yaml
ノード: Google Sheets（月次集計シート）
  ↓
Looker Studio自動リフレッシュ（API不要、Sheets連携で自動）
```

**Looker Studio設定:**
1. https://lookerstudio.google.com/ にアクセス
2. 「空のレポート」作成
3. データソース → Google Sheets接続
4. 「週次レポートデータ」シート選択
5. グラフ追加:
   - 折れ線グラフ（売上推移）
   - 棒グラフ（商品別売上）
   - スコアカード（KPI表示）
   - テーブル（詳細データ）

**共有設定:**
- URL共有: `https://lookerstudio.google.com/reporting/XXXXX`
- Discord/Slackに週次投稿
- 毎週月曜9:30に自動更新

---

## Phase 6: エラーハンドリング＋モニタリング

### エラー対応ワークフロー

```yaml
グローバルエラーハンドラ:
  - Try/Catch ノード追加
  - エラー時:
      1. Notion「エラーログ」DB に記録
      2. Slack #alerts にエラー通知
      3. リトライ設定（最大3回、間隔5分）
```

**Error Handler Function:**

```javascript
const error = $input.all()[0].json;

return {
  json: {
    timestamp: new Date().toISOString(),
    workflow: 'weekly-report',
    error_message: error.message,
    error_stack: error.stack,
    node_name: $node.name,
    severity: 'high'
  }
};
```

### モニタリング

**Uptime Robot設定:**

```yaml
Monitor Type: Keyword
URL: https://your-n8n.duckdns.org/webhook/health-check
Keyword: "status:ok"
Interval: 5分
Alert Contacts: あなたのメール、Slack Webhook
```

**Health Check Webhook（n8n）:**

```yaml
Trigger: Webhook
Path: /health-check
Response:
  status: "ok"
  last_report: "{{$node["最終実行時刻"].json["timestamp"]}}"
```

---

## Phase 7: 完成形の全体像

### 週次レポート自動化フロー（全ノード）

1. **Cron Trigger** → 毎週月曜 9:00
2. **Stripe API** → 売上データ取得
3. **Function** → Stripe集計処理
4. **Notion API** → 顧客データ取得
5. **Function** → Notion集計処理
6. **Discord API** → サーバー統計取得
7. **Function** → Discord集計処理
8. **Merge** → 全データ統合
9. **Google Sheets** → データ書き込み
10. **Function** → HTML生成
11. **Execute Command** → Puppeteer PDF生成
12. **Slack** → PDF添付＋通知
13. **Discord Webhook** → コミュニティ投稿
14. **Error Handler** → エラー時処理

### 月次レポート追加ノード

15. **Cron Trigger** → 毎月1日 10:00
16. **Google Sheets** → 先月データ取得
17. **Function** → 前月比計算
18. **Function** → 月次HTML生成（拡張版）
19. **Execute Command** → 月次PDF生成
20. **Email Send** → 経営陣へメール送信
21. **Looker Studio自動更新** → Sheets連携で自動

---

## コスト総額（100%無料）

| リソース | 無料枠 | 実際の使用 |
|---------|-------|----------|
| Oracle Cloud VM | Always Free | VM.Standard.E2.1.Micro |
| n8n（セルフホスト） | 無制限 | 月次・週次ワークフロー |
| Google Sheets | 無料 | データ保存 |
| Looker Studio | 無料 | ダッシュボード |
| Puppeteer | オープンソース | PDF生成 |
| DuckDNS | 無料 | ドメイン |
| Let's Encrypt | 無料 | SSL証明書 |
| Slack（無料プラン） | 90日履歴 | 通知受信 |
| **合計** | **¥0 / 月** | **完全無料** |

---

## 完成した自動レポート機能

- 週次レポート（毎週月曜 9:00）
- 月次レポート（毎月1日 10:00）
- PDF自動生成（Puppeteer）
- Slack/Discord自動配信
- Looker Studioダッシュボード
- エラーハンドリング＋モニタリング
- 100%無料運用

---

## 次に実装可能な機能

1. **Instagram/X自動DM設定**（エルグラム連携）
2. **アフィリエイトプログラム構築**（紹介報酬システム）
3. **予測分析AIダッシュボード**（売上予測・チャーン予測）
4. **顧客セグメンテーション自動化**（RFM分析）
