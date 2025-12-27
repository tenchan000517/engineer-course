# インサイトデータ取得ワークフロー

**所要時間**: 30分
**難易度**: 中級（Module 10完了後）

---

## このモジュールで学ぶこと

- Instagram Graph APIでインサイトデータを取得する方法
- 投稿パフォーマンスの自動記録と分析
- フォロワー数の推移を追跡する仕組み
- 月次サマリーの自動生成

---

## 学習目標

このモジュールを完了すると、以下ができるようになります:

1. 各投稿のリーチ・エンゲージメントを自動取得できる
2. フォロワー数の推移を記録できる
3. 月次サマリーを自動生成できる

---

## 目次

- [ワークフロー全体図](#ワークフロー全体図)
- [事前準備: シートの作成](#事前準備-シートの作成)
- [ステップ1: インサイト取得ワークフロー](#ステップ1-インサイト取得ワークフロー)
- [ステップ2: 月次サマリー生成](#ステップ2-月次サマリー生成)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)

---

## ワークフロー全体図

### インサイト取得ワークフロー

```
┌─────────────────────────────────────────────────────────────────────┐
│                    インサイトデータ取得ワークフロー                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  Schedule Trigger │  毎日9:00に実行                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Get STORY_POSTED │  postsシートから投稿後48時間経過を取得        │
│  │  Posts           │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Loop Each Post  │  各投稿に対して                                │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Get Insights    │  Instagram APIでインサイト取得                 │
│  │  from Instagram  │  GET /{ig_post_id}/insights                   │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Get Follower    │  アカウントのフォロワー数を取得                 │
│  │  Count           │  GET /me?fields=followers_count               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Append to       │  insightsシートにデータを追加                  │
│  │  Insights Sheet  │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Update Status   │  postsシートをINSIGHTS_FETCHEDに更新          │
│  └──────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 月次サマリー生成ワークフロー

```
┌─────────────────────────────────────────────────────────────────────┐
│                    月次サマリー生成ワークフロー                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  Schedule Trigger │  毎月1日 9:00に実行                           │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Get Last Month  │  insightsシートから前月分のデータを取得        │
│  │  Insights        │                                               │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Calculate       │  集計値を計算                                  │
│  │  Summary         │  total_reach, avg_engagement_rate, etc.      │
│  └────────┬─────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Append to       │  monthly_summaryシートに追加                   │
│  │  Summary Sheet   │                                               │
│  └──────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 事前準備: シートの作成

シートは手動で作成するか、GASを使って自動作成できます。

### 方法A: GASで自動作成（推奨）

Google Apps Scriptを使うと、装飾付きのシートを簡単に作成できます。

1. Google Sheetsを開く
2. **拡張機能** > **Apps Script** を選択
3. 以下のコードを貼り付けて保存
4. `createInsightsSheets` を実行

```javascript
/**
 * メイン関数: insightsとmonthly_summaryシートを作成
 */
function createInsightsSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  createInsightsSheet(ss);
  createMonthlySummarySheet(ss);
  SpreadsheetApp.getUi().alert('シート作成完了', 'insights と monthly_summary シートを作成しました。', SpreadsheetApp.getUi().ButtonSet.OK);
}

function createInsightsSheet(ss) {
  let sheet = ss.getSheetByName('insights');
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet('insights');

  const headers = ['post_id', 'ig_post_id', 'fetched_at', 'impressions', 'reach', 'likes', 'comments', 'saved', 'shares', 'plays', 'follower_count', 'engagement_rate'];
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#1a73e8').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);

  // 列幅設定
  [120, 200, 180, 100, 100, 80, 80, 80, 80, 80, 120, 120].forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // 交互の背景色
  sheet.getRange(1, 1, 1001, headers.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  // 数値書式
  sheet.getRange(2, 4, 1000, 7).setNumberFormat('#,##0');
  sheet.getRange(2, 11, 1000, 1).setNumberFormat('#,##0');
  sheet.getRange(2, 12, 1000, 1).setNumberFormat('0.00"%"');
  sheet.getRange(2, 3, 1000, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

  // フィルター
  sheet.getRange(1, 1, 1, headers.length).createFilter();

  // 条件付き書式
  const engagementCol = sheet.getRange(2, 12, 1000, 1);
  const rules = sheet.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(5).setBackground('#b7e1cd').setRanges([engagementCol]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(2).setBackground('#f4c7c3').setRanges([engagementCol]).build());
  sheet.setConditionalFormatRules(rules);
}

function createMonthlySummarySheet(ss) {
  let sheet = ss.getSheetByName('monthly_summary');
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet('monthly_summary');

  const headers = ['year_month', 'total_posts', 'total_reach', 'total_impressions', 'total_likes', 'total_comments', 'total_saved', 'avg_engagement_rate', 'follower_start', 'follower_end', 'follower_growth', 'growth_rate'];
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#34a853').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);

  // 列幅設定
  [100, 100, 120, 130, 100, 110, 100, 140, 120, 120, 130, 100].forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // 交互の背景色
  sheet.getRange(1, 1, 101, headers.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, true, false);

  // 数値書式
  sheet.getRange(2, 2, 100, 6).setNumberFormat('#,##0');
  sheet.getRange(2, 8, 100, 1).setNumberFormat('0.00"%"');
  sheet.getRange(2, 9, 100, 3).setNumberFormat('#,##0');
  sheet.getRange(2, 12, 100, 1).setNumberFormat('0.00"%"');

  // フィルター
  sheet.getRange(1, 1, 1, headers.length).createFilter();

  // 条件付き書式（成長率）
  const growthCol = sheet.getRange(2, 11, 100, 1);
  const rateCol = sheet.getRange(2, 12, 100, 1);
  const rules = sheet.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0).setBackground('#b7e1cd').setFontColor('#137333').setRanges([growthCol, rateCol]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0).setBackground('#f4c7c3').setFontColor('#a50e0e').setRanges([growthCol, rateCol]).build());
  sheet.setConditionalFormatRules(rules);
}
```

**GASの機能:**
- ヘッダー: 色付き背景、白文字、太字
- 交互の行色（縞模様）
- 数値カンマ区切り、パーセント表示
- 条件付き書式（高エンゲージメント=緑、低=赤）
- フィルター、行固定

---

### 方法B: 手動で作成

#### 1. insightsシートの作成

Google Sheetsで新しいシート「insights」を作成し、以下のヘッダーを設定します。

| 列 | 項目 | 説明 |
|----|------|------|
| A | post_id | 投稿ID（postsシートと紐付け） |
| B | ig_post_id | InstagramのメディアID |
| C | fetched_at | インサイト取得日時 |
| D | impressions | 表示回数 |
| E | reach | リーチ数（ユニークアカウント） |
| F | likes | いいね数 |
| G | comments | コメント数 |
| H | saved | 保存数 |
| I | shares | シェア数（リールのみ） |
| J | plays | 再生回数 |
| K | follower_count | 取得時点のフォロワー数 |
| L | engagement_rate | エンゲージメント率 |

**ヘッダー行（1行目）にコピー**:
```
post_id	ig_post_id	fetched_at	impressions	reach	likes	comments	saved	shares	plays	follower_count	engagement_rate
```

#### 2. monthly_summaryシートの作成

新しいシート「monthly_summary」を作成し、以下のヘッダーを設定します。

| 列 | 項目 | 説明 |
|----|------|------|
| A | year_month | 年月（例: 2025-12） |
| B | total_posts | 投稿数 |
| C | total_reach | 合計リーチ |
| D | total_impressions | 合計表示回数 |
| E | total_likes | 合計いいね |
| F | total_comments | 合計コメント |
| G | total_saved | 合計保存 |
| H | avg_engagement_rate | 平均エンゲージメント率 |
| I | follower_start | 月初フォロワー数 |
| J | follower_end | 月末フォロワー数 |
| K | follower_growth | フォロワー増加数 |
| L | growth_rate | 成長率（%） |

**ヘッダー行（1行目）にコピー**:
```
year_month	total_posts	total_reach	total_impressions	total_likes	total_comments	total_saved	avg_engagement_rate	follower_start	follower_end	follower_growth	growth_rate
```

#### 3. postsシートの入力規則を更新

postsシートの`status`列に新しいステータス`INSIGHTS_FETCHED`を追加します。

1. Google Sheetsで`posts`シートを開く
2. `status`列（C列）を選択
3. **データ** > **データの入力規則** を開く
4. 既存のリストに`INSIGHTS_FETCHED`を追加
5. 保存

### チェックポイント

- [ ] insightsシートを作成し、12列のヘッダーを設定した
- [ ] monthly_summaryシートを作成し、12列のヘッダーを設定した
- [ ] postsシートの入力規則に`INSIGHTS_FETCHED`を追加した

---

## ステップ1: インサイト取得ワークフロー

### 1-1. Schedule Trigger

毎日9:00に自動実行するトリガーを設定します。

**設定内容**:
- Trigger: Schedule Trigger
- Trigger Times:
  - Mode: Every Day
  - Hour: 9
  - Minute: 0

### 1-2. Get STORY_POSTED Posts

投稿済みでまだインサイトを取得していない投稿を取得します。

**設定内容**:
- Node: Google Sheets
- Operation: Get Row(s)
- Document: n8n-test
- Sheet: posts
- Filters: status = STORY_POSTED

### 1-3. Filter 48h Old Posts

投稿後48時間以上経過した投稿のみをフィルタリングします（データが安定してから取得するため）。

**設定内容**:
- Node: Code
- Language: JavaScript

**コード**:

```javascript
const items = $input.all();
const now = new Date();
const threshold = 48 * 60 * 60 * 1000; // 48時間（ミリ秒）

const filtered = items.filter(item => {
  const publishedAt = new Date(item.json.published_at);
  return (now.getTime() - publishedAt.getTime()) >= threshold;
});

// 48時間経過した投稿がない場合も空配列を返す
return filtered.length > 0 ? filtered : [];
```

### 1-4. Loop Each Post

各投稿に対してインサイトを取得します。

**設定内容**:
- Node: Loop Over Items
- Batch Size: 1

### 1-5. Get Insights from Instagram

Instagram Graph APIでインサイトデータを取得します。

**設定内容**:
- Node: HTTP Request
- Method: GET
- URL: `https://graph.instagram.com/{{ $json.ig_post_id }}/insights`
- Query Parameters:
  - metric: `reach,likes,comments,saved,shares,total_interactions`
  - access_token: （Instagramアクセストークン）

> **注意**: リールでは`impressions`と`plays`メトリクスは使用できません。代わりに`total_interactions`を使用します。

**APIレスポンス例**:
```json
{
  "data": [
    {"name": "reach", "values": [{"value": 987}]},
    {"name": "likes", "values": [{"value": 56}]},
    {"name": "comments", "values": [{"value": 3}]},
    {"name": "saved", "values": [{"value": 12}]},
    {"name": "shares", "values": [{"value": 8}]},
    {"name": "total_interactions", "values": [{"value": 79}]}
  ]
}
```

### 1-6. Get Follower Count

アカウントの現在のフォロワー数を取得します。

**設定内容**:
- Node: HTTP Request
- Method: GET
- URL: `https://graph.instagram.com/me`
- Query Parameters:
  - fields: `followers_count`
  - access_token: （Instagramアクセストークン）

### 1-7. Parse Insights Data

インサイトデータを整形します。

**設定内容**:
- Node: Code
- Language: JavaScript

**コード**:

```javascript
const insights = $('Get Insights from Instagram').item.json.data || [];
const followerCount = $('Get Follower Count').item.json.followers_count || 0;
const post = $('Loop Each Post').item.json;

// インサイトデータをオブジェクトに変換
const metricsMap = {};
for (const metric of insights) {
  metricsMap[metric.name] = metric.values[0].value;
}

// エンゲージメント率を計算（いいね+コメント+保存）/ リーチ * 100
const engagement = (metricsMap.likes || 0) + (metricsMap.comments || 0) + (metricsMap.saved || 0);
const engagementRate = metricsMap.reach > 0
  ? ((engagement / metricsMap.reach) * 100).toFixed(2)
  : 0;

return [{
  json: {
    post_id: post.post_id,
    ig_post_id: post.ig_post_id,
    fetched_at: new Date().toISOString(),
    impressions: metricsMap.total_interactions || 0,  // リールではtotal_interactionsを使用
    reach: metricsMap.reach || 0,
    likes: metricsMap.likes || 0,
    comments: metricsMap.comments || 0,
    saved: metricsMap.saved || 0,
    shares: metricsMap.shares || 0,
    plays: metricsMap.total_interactions || 0,  // リールではtotal_interactionsを使用
    follower_count: followerCount,
    engagement_rate: engagementRate
  }
}];
```

### 1-8. Append to Insights Sheet

インサイトデータをシートに追加します。

**設定内容**:
- Node: Google Sheets
- Operation: Append Row
- Document: n8n-test
- Sheet: insights
- Mapping Column Mode: Map Automatically

### 1-9. Update Posts Status

postsシートのステータスを更新します。

**設定内容**:
- Node: Google Sheets
- Operation: Update Row
- Document: n8n-test
- Sheet: posts
- Column to match on: post_id
- Values to Send:
  - status: `INSIGHTS_FETCHED`

### チェックポイント

- [ ] Schedule Triggerで毎日9:00に実行される設定になっている
- [ ] Get Insights from Instagramでインサイトデータが取得できている
- [ ] insightsシートにデータが追加されている
- [ ] postsシートのstatusがINSIGHTS_FETCHEDに更新されている

---

## ステップ2: 月次サマリー生成

### 2-1. Schedule Trigger

毎月1日の9:00に実行するトリガーを設定します。

**設定内容**:
- Trigger: Schedule Trigger
- Trigger Times:
  - Mode: Custom (Cron)
  - Expression: `0 9 1 * *`（毎月1日9:00）

### 2-2. Calculate Last Month

前月の年月を計算します。

**設定内容**:
- Node: Code
- Language: JavaScript

**コード**:

```javascript
const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const yearMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

return [{
  json: {
    year_month: yearMonth,
    start_date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString(),
    end_date: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59).toISOString()
  }
}];
```

### 2-3. Get Last Month Insights

前月分のインサイトデータを取得します。

**設定内容**:
- Node: Google Sheets
- Operation: Get Row(s)
- Document: n8n-test
- Sheet: insights
- Options: Return All

### 2-4. Filter Last Month Data

前月のデータのみをフィルタリングします。

**設定内容**:
- Node: Code
- Language: JavaScript

**コード**:

```javascript
const items = $('Get Last Month Insights').all();
const yearMonth = $('Calculate Last Month').item.json.year_month;

return items.filter(item => {
  const fetchedAt = new Date(item.json.fetched_at);
  const itemYearMonth = `${fetchedAt.getFullYear()}-${String(fetchedAt.getMonth() + 1).padStart(2, '0')}`;
  return itemYearMonth === yearMonth;
});
```

### 2-5. Calculate Summary

サマリーを計算します。

**設定内容**:
- Node: Code
- Language: JavaScript

**コード**:

```javascript
const items = $input.all();
const yearMonth = $('Calculate Last Month').item.json.year_month;

if (items.length === 0) {
  return [{
    json: {
      year_month: yearMonth,
      total_posts: 0,
      total_reach: 0,
      total_impressions: 0,
      total_likes: 0,
      total_comments: 0,
      total_saved: 0,
      avg_engagement_rate: 0,
      follower_start: 0,
      follower_end: 0,
      follower_growth: 0,
      growth_rate: 0
    }
  }];
}

// 日付順にソート
const sorted = items.sort((a, b) => new Date(a.json.fetched_at) - new Date(b.json.fetched_at));

// 集計
const totalPosts = items.length;
const totalReach = items.reduce((sum, item) => sum + (item.json.reach || 0), 0);
const totalImpressions = items.reduce((sum, item) => sum + (item.json.impressions || 0), 0);
const totalLikes = items.reduce((sum, item) => sum + (item.json.likes || 0), 0);
const totalComments = items.reduce((sum, item) => sum + (item.json.comments || 0), 0);
const totalSaved = items.reduce((sum, item) => sum + (item.json.saved || 0), 0);

// 平均エンゲージメント率
const avgEngagementRate = items.reduce((sum, item) => sum + parseFloat(item.json.engagement_rate || 0), 0) / totalPosts;

// フォロワー推移
const followerStart = sorted[0].json.follower_count || 0;
const followerEnd = sorted[sorted.length - 1].json.follower_count || 0;
const followerGrowth = followerEnd - followerStart;
const growthRate = followerStart > 0 ? ((followerGrowth / followerStart) * 100).toFixed(2) : 0;

return [{
  json: {
    year_month: yearMonth,
    total_posts: totalPosts,
    total_reach: totalReach,
    total_impressions: totalImpressions,
    total_likes: totalLikes,
    total_comments: totalComments,
    total_saved: totalSaved,
    avg_engagement_rate: avgEngagementRate.toFixed(2),
    follower_start: followerStart,
    follower_end: followerEnd,
    follower_growth: followerGrowth,
    growth_rate: growthRate
  }
}];
```

### 2-6. Append to Summary Sheet

サマリーをシートに追加します。

**設定内容**:
- Node: Google Sheets
- Operation: Append Row
- Document: n8n-test
- Sheet: monthly_summary
- Mapping Column Mode: Map Automatically

### チェックポイント

- [ ] 毎月1日9:00にスケジュール実行される設定になっている
- [ ] 前月分のインサイトデータがフィルタリングされている
- [ ] サマリー計算結果が正しい
- [ ] monthly_summaryシートにデータが追加されている

---

## トラブルシューティング

### インサイトデータが取得できない

**原因1**: Instagram Business/Creatorアカウントでない

**解決策**: InstagramアカウントをBusiness（ビジネス）またはCreator（クリエイター）アカウントに切り替える。個人アカウントではインサイトAPIを利用できません。

**原因2**: アクセストークンの権限が不足

**解決策**: Meta Developerコンソールで以下の権限を追加:
- `instagram_basic`
- `instagram_manage_insights`

### "Unsupported get request" または "does not support the impressions, plays metric" エラー

**原因**: リクエストしたメトリクスがメディアタイプに対応していない

**解決策**: リールでは`impressions`と`plays`は使用できません。以下のメトリクスのみ使用してください。

**リールで利用可能なメトリクス**:
- `reach`, `likes`, `comments`, `saved`, `shares`, `total_interactions`

**ストーリーズで利用可能なメトリクス**:
- `impressions`, `reach`, `replies`, `taps_forward`, `taps_back`, `exits`

### "Could not get parameter columns.schema" エラー

**原因**: Google Sheetsノードのスキーマ情報が不足

**解決策**: n8n上でノードを開き、Document/Sheetを再選択してスキーマを自動取得させてください。

### ステータス更新でエラー

**原因**: postsシートの入力規則に`INSIGHTS_FETCHED`が登録されていない

**解決策**: Google Sheetsでpostsシートを開き、status列の入力規則に`INSIGHTS_FETCHED`を追加してください。

### フォロワー数が取得できない

**原因**: アクセストークンの権限が不足

**解決策**: `instagram_basic` 権限があることを確認してください。また、ユーザーIDが正しいことを確認してください。

### 月次サマリーが0件になる

**原因**: 日付フィルタリングが正しく機能していない

**解決策**:
1. insightsシートの`fetched_at`列のフォーマットを確認（ISO 8601形式であること）
2. タイムゾーンの問題がある場合は、Codeノードでタイムゾーンを明示的に設定

---

## まとめ

このモジュールでは、投稿パフォーマンスを自動追跡するインサイト取得ワークフローを構築しました。

**学んだこと**:
- Instagram Graph APIでのインサイトデータ取得
- 投稿時点でのフォロワー数記録
- 月次サマリーの自動生成

**記録されるデータ**:
- 各投稿: リーチ、インプレッション、いいね、コメント、保存、シェア、再生数
- フォロワー推移: 投稿ごとのフォロワー数
- 月次サマリー: 月間パフォーマンス、フォロワー成長率

**活用方法**:
- 投稿パフォーマンスの比較分析
- フォロワー成長の軌跡確認
- コンテンツ戦略の改善

---

## ワークフローJSONダウンロード

### インサイト取得ワークフロー

[insights-fetch.json](/n8n-advanced/download/insights-fetch.json)

**インポート後の設定**:
1. Google Sheetsのクレデンシャルを設定
2. Instagramアクセストークンを設定（2箇所）
3. Update Posts StatusノードでDocument/Sheetを再選択

### 月次サマリー生成ワークフロー

[monthly-summary.json](/n8n-advanced/download/monthly-summary.json)

**インポート後の設定**:
1. Google Sheetsのクレデンシャルを設定
2. 各シートノードでDocument/Sheetを再選択

---

## 次のステップ

Module 11では、Facebook/X/TikTokへのクロスポスト機能を実装します。
