# X（Twitter）自動DM設定【完全自動化】

## アーキテクチャ概要

```
【投稿監視】→【リプライ検知】→【DM送信】→【特典配布】→【Notion記録】
     ↓           ↓             ↓          ↓           ↓
  X API     条件判定      自動返信    リンク生成   リード管理
  n8n       キーワード    テンプレ   Brevo連携   セグメント
```

---

## 重要な前提：X API制約と代替手段

### X API料金体系（2026年1月現在）

| プラン | 月額 | DM送信上限 | API制限 | 推奨用途 |
|--------|------|-----------|---------|---------|
| **Free** | $0 | DM不可 | 読み取り極小 | 使用不可 |
| **Basic** | $100 | 50 DM/日 | 3,000投稿読取/月 | 小規模テスト |
| **Pro** | $5,000 | 500 DM/日 | 100万投稿/月 | 本格運用 |

### 問題点：月1000件販売には不可能
- 月1000件 = 日33件のDM必要
- Basic（$100/月）でも50件/日まで
- しかし月100ドル = 15,000円のコストが発生

---

## 解決策：完全無料の代替アプローチ

### 戦略A：無料ツール組み合わせ（推奨）

```
X投稿
  ↓
Zapier/IFTTT 無料監視
  ↓
キーワード検知
  ↓
Google Forms自動リンク返信
  ↓
ユーザーがフォーム入力
  ↓
n8n Webhook受信
  ↓
├→ Brevo自動メール送信 → 特典リンク配布
├→ Notion顧客DB登録
└→ Discord招待送信
```

### 戦略B：セミ自動化（完全無料）

```
X投稿 → 手動リプライ（テンプレ使用） → 特典ページURL →
自動メール → Discord自動招待
```

---

## Phase 1: 無料ツールでの自動化設計

### 方式1：Zapier無料プラン活用

**制限:**
- 月100タスク（Zap実行）
- 15分間隔のチェック
- 2ステップまで

**設定:**

#### Step 1: Zapierトリガー設定

```yaml
アプリ: Twitter (X)
トリガー: New Mention
条件:
  - ツイート本文に「AI副業」「ChatGPT」「稼ぐ」などを含む
  - @your_accountへのリプライ
間隔: 15分ごと
```

#### Step 2: 自動リプライ（Google Formsリンク）

```yaml
アプリ: Twitter (X)
アクション: Create Tweet (Reply)
内容: |
  無料プレゼントをお受け取りください！

  以下のフォームから登録すると、
  - AI副業完全ガイド（PDF 80ページ）
  - ChatGPT活用テンプレ100選
  - 無料個別相談（60分）

  {{google_forms_url}}

  ※3分で登録完了します
```

---

### 方式2：IFTTT無料プラン活用

**制限:**
- 無制限のアプレット数
- 2ステップまで（Pro不要）
- リアルタイム検知

**設定:**

#### IFTTTアプレット作成

```yaml
IF:
  サービス: Twitter
  トリガー: New tweet from search
  検索クエリ: "@your_account (AI副業 OR ChatGPT OR 稼ぐ)"

THEN:
  サービス: Webhooks
  アクション: Make a web request
  URL: https://your-n8n.duckdns.org/webhook/twitter-mention
  Method: POST
  Content Type: application/json
  Body:
    {
      "tweet_id": "{{TweetId}}",
      "user_name": "{{UserName}}",
      "user_id": "{{UserId}}",
      "text": "{{Text}}",
      "created_at": "{{CreatedAt}}"
    }
```

---

## Phase 2: n8n完全自動化ワークフロー

### Workflow: X自動応答システム

```yaml
【Webhook受信】→【キーワード判定】→【返信生成】→【特典配布】
                    ↓
                【Notion記録】→【Brevoメール】→【Discord招待】
```

### ステップ詳細

#### Step 1: Webhook Trigger（IFTTT/Zapierから受信）

```yaml
ノード: Webhook
Path: /webhook/twitter-mention
Method: POST
認証: なし（または Bearer Token）
```

#### Step 2: キーワード分析＋意図判定

```javascript
// Function ノード
const tweet = $input.all()[0].json;
const text = tweet.text.toLowerCase();

// キーワードカテゴリ分類
const intent = {
  type: 'unknown',
  score: 0,
  keywords: []
};

// 高関心度キーワード（即座に特典案内）
const highIntent = ['稼ぎたい', '副業始めたい', '教えて', '知りたい', 'DMください'];
if (highIntent.some(kw => text.includes(kw))) {
  intent.type = 'high_interest';
  intent.score = 10;
  intent.keywords = highIntent.filter(kw => text.includes(kw));
}

// 中関心度キーワード（質問系）
const mediumIntent = ['どうやって', 'どのように', '方法', '手順', '初心者'];
if (intent.type === 'unknown' && mediumIntent.some(kw => text.includes(kw))) {
  intent.type = 'medium_interest';
  intent.score = 7;
}

// 低関心度キーワード（情報収集のみ）
const lowIntent = ['気になる', '興味ある', 'すごい', 'いいね'];
if (intent.type === 'unknown' && lowIntent.some(kw => text.includes(kw))) {
  intent.type = 'low_interest';
  intent.score = 4;
}

return {
  json: {
    ...tweet,
    intent: intent
  }
};
```

#### Step 3: Switch（意図別分岐）

```yaml
ノード: Switch
条件:
  ルート1: {{$json["intent"]["type"]}} = "high_interest"
  ルート2: {{$json["intent"]["type"]}} = "medium_interest"
  ルート3: {{$json["intent"]["type"]}} = "low_interest"
  デフォルト: 処理スキップ
```

#### Step 4: 返信テンプレート生成（高関心度用）

```javascript
// Function ノード（高関心度）
const user = $json.user_name;
const formUrl = 'https://forms.gle/YOUR_GOOGLE_FORM';

const reply = {
  tweet_id: $json.tweet_id,
  user_id: $json.user_id,
  message: `@${user} さん、ありがとうございます！

【今だけ限定】3大特典を無料プレゼント

- AI副業完全ガイド（80ページ）
- ChatGPT実践テンプレ100選
- 無料個別相談（60分）

こちらから受け取る
${formUrl}

※登録後、すぐにメールで届きます`
};

return { json: reply };
```

**中関心度用テンプレート:**

```javascript
const reply = {
  message: `@${user} さん、いい質問ですね！

初心者でも月10万円を目指せる
具体的なロードマップをまとめました

- Step1: 環境構築（無料ツール）
- Step2: 案件獲得（未経験OK）
- Step3: 単価アップの秘訣

詳細ガイドはこちら
${formUrl}`
};
```

**低関心度用テンプレート:**

```javascript
const reply = {
  message: `@${user} さん、ありがとうございます！

もし具体的に知りたいことがあれば、
いつでもお気軽にご質問ください

参考情報はプロフィールのリンクから
チェックできます @your_account`
};
```

#### Step 5: Notion「返信待ち」DBに保存

```yaml
ノード: Notion - Create Database Item
Database ID: 返信待ちDB
プロパティ:
  - ツイートID: {{$json["tweet_id"]}}
  - ユーザー名: @{{$json["user_name"]}}
  - 返信文: {{$json["message"]}}
  - 意図スコア: {{$json["intent"]["score"]}}
  - ステータス: 未送信
  - 作成日時: {{$now.toISO()}}
  - ツイートURL: https://twitter.com/{{$json["user_name"]}}/status/{{$json["tweet_id"]}}
```

**→ 毎朝Notionを確認し、ワンクリックでコピペ返信**

---

## Phase 3: Google Forms → 自動メール配信

### Google Form設計

**フォーム項目:**
1. お名前（必須）
2. メールアドレス（必須）
3. Xアカウント名（任意）
4. 現在の状況（選択式）
   - 完全未経験
   - 学習中
   - 副業実践中
   - 本格的に取り組みたい
5. 興味のある分野（複数選択）
   - ChatGPT活用
   - AI画像生成
   - 自動化ツール
   - 案件獲得ノウハウ

**フォーム送信後の処理:**

#### n8n Webhook連携

```javascript
// Google Apps Script（Google Forms）
function onFormSubmit(e) {
  const responses = e.values;
  const payload = {
    timestamp: responses[0],
    name: responses[1],
    email: responses[2],
    twitter: responses[3],
    status: responses[4],
    interests: responses[5]
  };

  // n8n Webhookに送信
  UrlFetchApp.fetch('https://your-n8n.duckdns.org/webhook/form-submit', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}
```

#### n8n処理フロー

```yaml
Webhook受信 → Notion顧客DB登録 → Brevoメール送信 → Discord招待
```

**Notion登録（Function）:**

```javascript
return {
  json: {
    name: $json.name,
    email: $json.email,
    twitter: $json.twitter,
    status: $json.status,
    interests: $json.interests.split(','),
    lead_source: 'X自動化',
    lead_score: 5, // 初期スコア
    created_at: new Date().toISOString(),
    tags: ['未接触', 'フォーム登録']
  }
};
```

**Brevo自動メール（即時）:**

```yaml
ノード: HTTP Request (Brevo API)
Method: POST
URL: https://api.brevo.com/v3/smtp/email
Headers:
  api-key: YOUR_BREVO_API_KEY
Body:
  {
    "to": [{"email": "{{$json["email"]}}", "name": "{{$json["name"]}}"}],
    "templateId": 1,
    "params": {
      "NAME": "{{$json["name"]}}",
      "DOWNLOAD_LINK": "https://your-domain.com/downloads/ai-guide.pdf",
      "TEMPLATE_LINK": "https://your-domain.com/downloads/templates.zip",
      "CALENDAR_LINK": "https://calendly.com/your-link"
    }
  }
```

**Brevoメールテンプレート（ID: 1）:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.8; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; }
    .button { display: inline-block; background: #4CAF50; color: white;
              padding: 15px 30px; text-decoration: none; border-radius: 5px;
              margin: 10px 5px; font-weight: bold; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>登録ありがとうございます！</h1>
    </div>
    <div class="content">
      <p>{{NAME}}さん、こんにちは！</p>

      <p>特典の受け取りが完了しました</p>

      <h2>今すぐ受け取れる3大特典</h2>

      <p><strong>特典1：AI副業完全ガイド（PDF 80ページ）</strong><br>
      <a href="{{DOWNLOAD_LINK}}" class="button">ダウンロード</a></p>

      <p><strong>特典2：ChatGPT実践テンプレ100選</strong><br>
      <a href="{{TEMPLATE_LINK}}" class="button">ダウンロード</a></p>

      <p><strong>特典3：無料個別相談（60分）</strong><br>
      <a href="{{CALENDAR_LINK}}" class="button">日程を選ぶ</a></p>

      <hr style="margin: 30px 0;">

      <h2>次のステップ</h2>
      <ol>
        <li>特典PDFをダウンロードして熟読</li>
        <li>テンプレートを実際に試す</li>
        <li>わからないことがあれば個別相談を予約</li>
      </ol>

      <p>明日から、実践的なメールが届きます<br>
      毎日1通、7日間で基礎を完全マスターできる内容です。</p>

      <p>それでは、AI副業の世界へようこそ！</p>
    </div>
    <div class="footer">
      <p>このメールに返信すると、直接質問できます</p>
      <p>配信停止は<a href="{{unsubscribe}}">こちら</a></p>
    </div>
  </div>
</body>
</html>
```

---

## Phase 4: Twitter投稿テンプレート（エンゲージメント最大化）

### 投稿パターンA：実績アピール型

```
【月100万円達成までのロードマップ】

僕が副業で月100万円を達成した
具体的な5ステップを公開します

Step1: ChatGPT基礎（1週間）
Step2: 初案件獲得（2週間）
Step3: 単価アップ（1ヶ月）
Step4: 自動化構築（2ヶ月）
Step5: 月100万達成（3ヶ月）

詳しく知りたい方は「知りたい」と
リプください

※先着30名限定で完全ガイドをプレゼント

#AI副業 #ChatGPT #副業
```

### 投稿パターンB：Before/After型

```
【1年前の僕 → 今の僕】

Before:
- 和菓子屋でバイト（時給1,000円）
- 貯金ゼロ
- 将来が不安

After:
- AI副業で月収150万円
- 完全在宅ワーク
- 時間も場所も自由

変わったきっかけは、
たった1つのスキルでした。

そのスキルを無料で公開中
気になる方は「詳細」とリプ

#副業 #AI #稼ぐ方法
```

### 投稿パターンC：ギブ＆テイク型

```
【無料配布】ChatGPT副業テンプレ

今日からすぐ使える
実践テンプレート10選を無料配布

- 営業メール生成
- 提案書作成
- 記事執筆
- SNS投稿文
- LP作成
... 他5つ

欲しい方は「欲しい」とリプください
DMで送ります

※リプから3分以内に送信します

#ChatGPT #AI #副業
```

---

## Phase 5: データ分析＋改善サイクル

### Notion「X自動化分析」DB

**トラッキング項目:**

```yaml
データベース名: X自動化分析
プロパティ:
  - 日付（Date）
  - 投稿内容（Text）
  - 投稿URL（URL）
  - インプレッション数（Number）
  - エンゲージメント数（Number）
  - リプライ数（Number）
  - フォーム登録数（Number）
  - CVR（Formula）: フォーム登録数 / リプライ数 × 100
  - メール開封率（Number）
  - 相談予約数（Number）
  - 購入数（Number）
  - 売上額（Number）
  - ROAS（Formula）: 売上額 / 広告費
```

### n8n自動データ収集

```yaml
Workflow: X Analytics収集（日次）

Cron: 毎日23:00
  ↓
Google Sheets「投稿一覧」読み込み
  ↓
各投稿のAnalytics取得（X API Basic）
  ↓
Notion DB更新
  ↓
週次レポートに統合
```

**Analyticsコード（Function）:**

```javascript
// X API Basic（$100/月）での取得
const tweetIds = $json.tweet_ids; // 今日の投稿ID配列

const analytics = [];

for (const tweetId of tweetIds) {
  const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`, {
    headers: {
      'Authorization': 'Bearer YOUR_BEARER_TOKEN'
    }
  });

  const data = await response.json();

  analytics.push({
    tweet_id: tweetId,
    impressions: data.data.public_metrics.impression_count,
    engagements: data.data.public_metrics.like_count +
                 data.data.public_metrics.retweet_count +
                 data.data.public_metrics.reply_count,
    replies: data.data.public_metrics.reply_count
  });
}

return { json: analytics };
```

---

## Phase 6: 完全自動化の最終形態

### 理想のフロー（セミ自動）

```
1. 朝9:00: Notionで「返信待ち」リストを確認
2. ワンクリックで返信文をコピー
3. X公式アプリから手動返信（5分）
4. 以降は完全自動:
   → ユーザーがフォーム入力
   → n8nが自動処理
   → Brevoメール送信
   → Discord招待
   → Notion記録
   → 相談予約自動化
   → 決済自動化
   → Discord自動オンボーディング
```

### Chrome拡張機能で効率化

**自作Chrome拡張（返信1クリック化）:**

```javascript
// manifest.json
{
  "name": "X Auto Reply Helper",
  "version": "1.0",
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "content_scripts": [{
    "matches": ["https://twitter.com/*", "https://x.com/*"],
    "js": ["content.js"]
  }]
}

// content.js
// Notionから取得した返信文を右クリックで自動入力
document.addEventListener('contextmenu', (e) => {
  if (e.target.matches('div[data-testid="tweetTextarea_0"]')) {
    // Notionからコピーした返信文を取得
    chrome.storage.local.get(['replyText'], (result) => {
      if (result.replyText) {
        e.target.textContent = result.replyText;
        // 送信ボタンを自動クリック（オプション）
      }
    });
  }
});
```

**使い方:**
1. Notion「返信待ち」DBで返信文をコピー
2. 拡張機能に保存
3. Xの返信欄を右クリック
4. 自動入力 → 送信ボタンをクリック

---

## コスト比較＋推奨プラン

### 方式1：完全無料（推奨）

| ツール | 費用 | 制限 |
|--------|------|------|
| IFTTT | $0 | 無制限アプレット |
| Google Forms | $0 | 無制限 |
| n8n（セルフホスト） | $0 | 無制限 |
| Brevo | $0 | 300通/日 |
| Notion | $0 | 個人用無料 |
| **合計** | **$0/月** | **手動返信のみ** |

**作業時間:** 毎朝5-10分（Notion確認＋手動返信）

---

### 方式2：X API Basic（低コスト半自動）

| ツール | 費用 | 制限 |
|--------|------|------|
| X API Basic | $100 | 50 DM/日、3,000投稿読取/月 |
| その他（無料） | $0 | 上記と同じ |
| **合計** | **$100/月（約15,000円）** | **半自動化** |

**メリット:** DM自動送信可能（APIから）
**デメリット:** 月15,000円のコスト

---

### 方式3：X API Pro（完全自動）

| ツール | 費用 | 制限 |
|--------|------|------|
| X API Pro | $5,000 | 500 DM/日、100万投稿/月 |
| **合計** | **$5,000/月（約75万円）** | **完全自動化** |

**メリット:** 大規模運用可能
**デメリット:** コストが高すぎる

---

## 推奨：完全無料プラン実装手順

### 実装チェックリスト

#### Phase 1: 基盤構築（1日）
- [ ] Google Form作成（特典登録用）
- [ ] Google Apps Script設定（Webhook送信）
- [ ] n8n Webhook受信設定
- [ ] Notion「返信待ち」DB作成
- [ ] Notion「顧客リスト」DB作成

#### Phase 2: 自動化設定（1日）
- [ ] IFTTT アプレット作成（メンション監視）
- [ ] n8n キーワード判定ワークフロー
- [ ] n8n 返信テンプレート生成
- [ ] n8n → Notion自動保存
- [ ] Brevoメールテンプレート作成

#### Phase 3: 配布物準備（2日）
- [ ] AI副業ガイドPDF作成（80ページ）
- [ ] テンプレート100選作成（Notion/PDF）
- [ ] 特典ダウンロードページ作成
- [ ] Calendly個別相談設定

#### Phase 4: テスト＋改善（1日）
- [ ] 自分のアカウントでテスト投稿
- [ ] フォーム登録テスト
- [ ] メール受信テスト
- [ ] Discord招待テスト
- [ ] 全体フロー確認

#### Phase 5: 本番運用（継続）
- [ ] 毎朝9:00 Notion確認（5分）
- [ ] 手動返信実施（5分）
- [ ] 週次分析レポート確認
- [ ] 投稿テンプレート改善

---

## 期待される成果

### 月間KPI（完全無料プランの場合）

| 指標 | 目標値 | 計算根拠 |
|------|--------|----------|
| X投稿数 | 90投稿/月（3/日） | 毎日3投稿 |
| インプレッション | 450,000 | 1投稿5,000×90 |
| リプライ数 | 450 | インプレッションの0.1% |
| フォーム登録 | 135人 | リプライの30% CVR |
| メール開封 | 81人 | 登録者の60% |
| 個別相談予約 | 27人 | 開封者の33% |
| 商材購入（Layer3） | 14人 | 相談の50% CVR |
| 売上額 | **¥4,172,000** | 14人×298,000円 |
| 作業時間 | 10分/日（月5時間） | Notion確認＋返信 |
| **時給換算** | **¥834,400/時間** | 売上÷作業時間 |

---

## 完成したX自動化システム

- IFTTT自動メンション監視
- n8nキーワード判定＋返信生成
- Notion返信待ちDB（手動実行）
- Google Forms自動特典配布
- Brevo自動メールシーケンス
- Discord自動招待
- 完全無料運用（月0円）

---

## 次に実装可能な機能

1. **Instagram自動DM**（Meta APIまたはManyChat）
2. **アフィリエイトプログラム構築**（紹介報酬30%）
3. **顧客セグメンテーション自動化**（RFM分析＋パーソナライズ）
4. **予測分析AIダッシュボード**（売上予測・チャーン率予測）
5. **ウェビナー自動化**（Zoom連携・録画配信）
