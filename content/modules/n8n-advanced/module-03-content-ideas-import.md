# リサーチ精度向上 - インフルエンサー起点のトレンド調査

**所要時間**: 45分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 従来のリサーチ手法の問題点と改善アプローチ
- インフルエンサー起点のトレンド調査プロンプト設計
- リサーチ結果から投稿企画生成プロンプトを作るメタプロンプト
- GASによるスプレッドシートへのワンクリックインポート

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 出現率ベースのトレンドランキング手法を理解できる
- 海外版・日本版それぞれのリサーチプロンプトを使い分けられる
- リサーチ結果を元に93件の投稿企画を生成できる
- GASメニューからideasシートにデータをインポートできる

---

## 目次

- [セクション1: 従来手法の問題点](#セクション1-従来手法の問題点)
- [セクション2: 海外版トレンドリサーチ](#セクション2-海外版トレンドリサーチ)
- [セクション3: 日本版トレンドリサーチ](#セクション3-日本版トレンドリサーチ)
- [セクション4: 投稿企画生成プロンプトを作るプロンプト](#セクション4-投稿企画生成プロンプトを作るプロンプト)
- [セクション5: GASでideasシートにインポート](#セクション5-gasでideasシートにインポート)
- [セクション6: GASコード全文](#セクション6-gasコード全文)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- n8n基礎講座（Module 01-11）完了済み
- Antigravity（またはClaude等のAIツール）へのアクセス
- Google Apps Scriptの基本的な知識

### スプレッドシートの構造

以下のシートが必要です（n8n基礎講座で作成済み）：

| シート名 | 用途 |
|---------|------|
| config | JSONの一時保存場所 |
| ideas | 投稿企画の管理 |

---

## セクション1: 従来手法の問題点

### AI任せのリサーチの限界

従来の月次リサーチプロンプトには以下の問題がありました：

```
従来のプロンプト例:
「今月のAIトレンドを調査して、Instagram投稿に使える93件の企画を生成してください」
```

**問題点**:

| 問題 | 具体例 |
|------|--------|
| AI任せ | 調べた結果をそのまま出力、意図しないトピックが混入 |
| ニッチすぎる | 「○○大学の研究」など一般層に刺さらないネタ |
| 根拠が不明 | なぜそのトピックが選ばれたか分からない |
| 再現性がない | 毎回違う基準で選定される |

### 新しいアプローチ: インフルエンサー起点

改善後のフローでは、**インフルエンサーが実際に取り上げているトピック**を先に調査し、その結果を元に企画を生成します。

```
【改善後のフロー】

①トレンド調査（海外）→ TOP20抽出
②トレンド調査（日本）→ TOP20抽出
③リサーチ結果 → 投稿企画生成プロンプトを作るプロンプト
④生成されたプロンプトで93件生成
⑤GASでideasシートにインポート
```

### 出現率ベースのランキング

**従来**: エンゲージメント（再生数等）でランキング
- 問題: フォロワー数に比例してしまい、本当のトレンドが見えない

**改善後**: 出現率（何人のインフルエンサーが言及したか）でランキング
- メリット: 複数の発信者が取り上げている = 本当に注目されているトピック

### チェックポイント

- [ ] 従来手法の問題点を理解した
- [ ] インフルエンサー起点のアプローチを理解した
- [ ] 出現率ベースのランキングの意味を理解した

---

## セクション2: 海外版トレンドリサーチ

### プロンプトの設計思想

海外版リサーチでは、YouTube、X、Redditの3プラットフォームから情報を収集します。

**調査対象の基準**:

| プラットフォーム | 基準 |
|-----------------|------|
| YouTube | 登録者10万人以上のチャンネル20個 |
| X（Twitter） | フォロワー5万人以上のアカウント20個 |
| Reddit | メンバー数10万人以上のサブレディット10個 |

### 海外版リサーチプロンプト

以下のプロンプトをAntigravity等のAIツールで実行します：

```markdown
# AI・自動化トレンド TOP20 調査プロンプト（海外版）

## 目的

AI・自動化系インフルエンサーが直近1ヶ月に投稿したコンテンツを網羅的に収集し、
**複数のインフルエンサーが取り上げているAI/ツール/テーマ**をTOP20として抽出する。

## 調査対象

### YouTube
- AI・自動化に関する投稿をしている**登録者10万人以上**のチャンネルを20個特定
- 各チャンネルの**直近1ヶ月の投稿を全て**収集

### X（Twitter）
- Google検索で `site:x.com` を使用して調査
- 例: `site:x.com AI agent`
- AI・自動化に関する投稿をしている**フォロワー5万人以上**のアカウントを20個特定
- 各アカウントの**直近1ヶ月の投稿を全て**収集

### Reddit
- Google検索で `site:reddit.com` を使用して調査
- 例: `site:reddit.com AI automation`
- AI・自動化関連で**メンバー数10万人以上**のサブレディットを10個特定
- 各サブレディットの**直近1ヶ月のTop投稿を全て**収集

## 抽出してほしい情報

各コンテンツから以下を抽出:
- ソース（YouTube/X/Reddit）
- 投稿者/チャンネル/サブレディット名
- タイトルまたは投稿内容
- 投稿日
- **取り上げているAI/ツール名**
- **何の自動化か**
- **何を実現するか**

## 出力形式

{
  "research_date": "YYYY-MM-DD",
  "sources": {
    "youtube_channels": ["チャンネル名と登録者数のリスト"],
    "x_accounts": ["アカウント名とフォロワー数のリスト"],
    "subreddits": ["サブレディット名とメンバー数のリスト"]
  },
  "top_20_trends": [
    {
      "rank": 1,
      "topic": "AI/ツール名またはテーマ",
      "mention_count": "何人のインフルエンサーが言及したか",
      "mentioned_by": ["言及したインフルエンサー名のリスト"],
      "automation_type": "何の自動化か",
      "outcome": "何を実現するか",
      "why_trending": "なぜ注目されているかの分析"
    }
  ],
  "all_mentions": [
    {
      "source": "YouTube / X / Reddit",
      "creator": "投稿者名",
      "title": "タイトルまたは投稿内容",
      "post_date": "YYYY-MM-DD",
      "ai_tools": ["ツール名"],
      "automation_type": "何の自動化か",
      "outcome": "何を実現するか"
    }
  ]
}

## 重要事項

- 直近1ヶ月の投稿のみ対象
- **TOP20は出現率（何人のインフルエンサーが言及したか）の高い順**
- X、Redditは `site:x.com` `site:reddit.com` でGoogle検索を使用すること
- 全てのデータは実際にブラウザで確認した事実に基づくこと
```

### 実行結果の例

海外版リサーチの実行画面：

![海外版リサーチの実行画面](/n8n-advanced/module-03-antigravity-global-research.png)

### チェックポイント

- [ ] 海外版リサーチの調査対象を理解した
- [ ] プロンプトの構造を把握した

---

## セクション3: 日本版トレンドリサーチ

### 海外版との違い

日本版リサーチでは、以下の点が異なります：

| 項目 | 海外版 | 日本版 |
|------|--------|--------|
| YouTube基準 | 登録者10万人以上 | 登録者5万人以上 |
| X基準 | フォロワー5万人以上 | フォロワー1万人以上 |
| Reddit | あり | なし |
| how_presented | なし | あり（紹介の仕方を記録） |

### 日本版リサーチプロンプト

```markdown
# AI・自動化トレンド TOP20 調査プロンプト（日本版）

## 目的

日本のAI・自動化系インフルエンサーが直近1ヶ月に投稿したコンテンツを網羅的に収集し、
**複数のインフルエンサーが取り上げているAI/ツール/テーマ**をTOP20として抽出する。
また、**どのような切り口・訴求ポイントで紹介しているか**も記録する。

## 調査対象

### YouTube
- AI・自動化に関する投稿をしている**登録者5万人以上**の日本語チャンネルを20個特定
- 各チャンネルの**直近1ヶ月の投稿を全て**収集

### X（Twitter）
- Google検索で `site:x.com` を使用して調査
- 例: `site:x.com AIツール`
- AI・自動化に関する投稿をしている**フォロワー1万人以上**の日本語アカウントを20個特定
- 各アカウントの**直近1ヶ月の投稿を全て**収集

## 抽出してほしい情報

各コンテンツから以下を抽出:
- ソース（YouTube/X）
- 投稿者/チャンネル名
- タイトルまたは投稿内容
- 投稿日
- **取り上げているAI/ツール名**
- **何の自動化か**
- **何を実現するか**
- **紹介の仕方**（以下の3点を含む）
  - **対象者**: 誰向けか（例: 初心者向け、エンジニア向け、経営者向け）
  - **紹介形式**: どのような形式か（例: ハウツー、比較レビュー、ニュース解説、実演デモ、事例紹介）
  - **紹介内容**: 何を紹介しているか（例: 導入の仕方、活用事例、他ツールとの比較、新機能の解説）

## 出力形式

{
  "research_date": "YYYY-MM-DD",
  "sources": {
    "youtube_channels": ["チャンネル名と登録者数のリスト"],
    "x_accounts": ["アカウント名とフォロワー数のリスト"]
  },
  "top_20_trends": [
    {
      "rank": 1,
      "topic": "AI/ツール名またはテーマ",
      "mention_count": "何人のインフルエンサーが言及したか",
      "mentioned_by": ["言及したインフルエンサー名のリスト"],
      "automation_type": "何の自動化か",
      "outcome": "何を実現するか",
      "how_presented": [
        {
          "creator": "インフルエンサー名",
          "target_audience": "初心者向け",
          "format": "ハウツー",
          "content": "導入の仕方"
        }
      ],
      "why_trending": "なぜ注目されているかの分析"
    }
  ],
  "all_mentions": [
    {
      "source": "YouTube / X",
      "creator": "投稿者名",
      "title": "タイトルまたは投稿内容",
      "post_date": "YYYY-MM-DD",
      "ai_tools": ["ツール名"],
      "automation_type": "何の自動化か",
      "outcome": "何を実現するか",
      "target_audience": "誰向けか",
      "format": "紹介形式",
      "content": "紹介内容"
    }
  ]
}

## 重要事項

- 直近1ヶ月の投稿対象
- **TOP20は出現率（何人のインフルエンサーが言及したか）の高い順**
- Xは `site:x.com` でGoogle検索を使用すること
- **紹介の仕方（how_presented）を必ず記録すること**
- 全てのデータは実際にブラウザで確認した事実に基づくこと
```

### 実行結果の例

日本版リサーチの実行画面：

![日本版リサーチの実行画面](/n8n-advanced/module-03-antigravity-jp-research.png)

### チェックポイント

- [ ] 日本版リサーチの調査対象を理解した
- [ ] how_presented（紹介の仕方）の意味を理解した

---

## セクション4: 投稿企画生成プロンプトを作るプロンプト

### メタプロンプトの設計思想

リサーチ結果のTOP20を元に、93件の投稿企画を生成します。ここで重要なのは、**プロンプトを作るためのプロンプト**を使うことです。

**なぜメタプロンプトを使うのか**:
- リサーチ結果のTOP20をプロンプトに埋め込む必要がある
- 毎月TOP20が変わるため、プロンプト自体を動的に生成する

### フロー②: 投稿企画生成プロンプトを作成するプロンプト

以下のプロンプトをAntigravity等のAIツールで実行します。

**実行手順**:
1. 下記のプロンプトをコピー
2. 「## 入力」セクションの「【ここにリサーチ結果JSONを貼り付け】」の部分を、フロー①で取得したリサーチ結果JSONに置き換え
3. AIツールに貼り付けて実行

```markdown
# 月次投稿企画生成プロンプトを作成するプロンプト

## 目的

フロー①の調査結果（TOP20 JSON）を入力として受け取り、
月次投稿企画生成プロンプト（93件生成用）を出力する。

## 入力

フロー①の調査結果JSON（top_20_trendsを含む）

【ここにリサーチ結果JSONを貼り付け】

## 出力

以下のテンプレートの【】部分を、上記の調査結果で埋めたプロンプトを出力してください。

## テンプレート

目的: 【調査年月】のAIトレンドをリサーチし、Instagram運用のための具体的な投稿戦略を立案してください。

重要: 一般的な「時短ツール」だけでなく、【TOP1】や【TOP2】【TOP3】【TOP4】のような、
エンジニア界隈や先端層で話題になり始めている「次に来るトレンド」を必ず発掘してください。

出力言語: 全て日本語で出力してください。

---

## 手順

### 1. 定量的なトレンド調査 (ブラウザ使用必須)

- **YouTube**: 「AI ツール 仕事」に加え、【TOP1】【TOP2】【TOP3】【TOP4】【TOP5】などのキーワードで検索し、
  再生数が急上昇している動画（特にここ1〜2週間のもの）を特定してください。
- **X (Twitter)**: site:x.com で「AI」に加え、【TOP6】【TOP7】【TOP8】【TOP9】【TOP10】などのキーワードを掛け合わせ、
  技術者層が盛り上がっている新しいツールを探してください。
- **Instagram**: リール動画で「AI」検索し、【TOP4】【TOP16】【TOP12】といった少し専門的な単語を使っている投稿が
  伸びていないか確認してください。
- **特定キーワード確認**: 【TOP1】【TOP2】【TOP3】【TOP4】【TOP5】など、今月特に注目すべきツールの最新動向も
  チェックしてください。

### 2. 投稿戦略の策定

調査データに基づき、今月Instagramで投稿すべき内容を決定してください。

**小カテゴリ (93個)**:
- そのまま投稿タイトルとして使える具体的な企画案。
- 「プログラミング不要で開発」「エンジニアの仕事が変わる」「完全自動化」といった、
  先端ツールならではのフックを入れたタイトルを作成してください。
- 各タイトルには、追加リサーチに必要な調査項目（research_points）を3〜5個含めてください。
- **各カテゴリ（A〜E）の個数はトレンドの注目度に応じて配分してください。均等である必要はありません。**

---

## 今月のトレンドTOP20（93件は全てここから作成すること）

| rank | topic | mention_count |
|------|-------|---------------|
【TOP20テーブル: rank, topic, mention_countを全件記載】

**ルール:**
- 93件は全てこのTOP20のいずれかに紐づけること
- 各トピックの出現頻度はmention_countに比例させること
- カテゴリA（比較・対決系）は、比較対象が両方ともTOP20内にあるものに限定すること

---

## 出力形式

**必ず以下のJSONスキーマに厳密に従って出力してください。Markdown形式での出力は禁止です。**

{
  "month": "【調査年月】",
  "categories": {
    "small": [
      {
        "title": "投稿タイトル",
        "tools": ["ツール名1", "ツール名2"],
        "content_type": "比較 / 使い方 / 設定方法 / 解説 / 警告 / まとめ など",
        "category": "A / B / C / D / E",
        "research_points": ["調査項目1", "調査項目2", "調査項目3"]
      }
    ]
  }
}

### カテゴリ記号の定義
- **A**: 比較・対決系
- **B**: 時短・効率化系
- **C**: 先端トレンド・自動化系
- **D**: ネガティブ・警告系
- **E**: まとめ・ランキング系

---

## 制約事項

1. **出力はJSON形式のみ**。Markdownや説明文は不要です。
2. 言語は日本語のみを使用してください。
3. 小カテゴリは**93個**を必ず出力してください。

---

## 埋め込みルール

- 【調査年月】: research_dateから取得（例: 2025-12）
- 【TOP1】〜【TOP20】: top_20_trends[rank-1].topic
- 【TOP20テーブル】: top_20_trendsの全件をテーブル形式で出力
```

### 重要な設計ポイント

| ルール | 理由 |
|--------|------|
| 93件は全てTOP20から | ニッチなトピックが混入しない |
| mention_countに比例 | 注目度が高いものほど多く生成 |
| カテゴリA（比較）は両方TOP20内 | 謎ツールとの比較を防ぐ |

### 実行結果の例

フロー②を実行すると、【】部分がTOP20の実際のツール名に置き換わったプロンプトが生成されます：

```
目的: 2025年12月のAIトレンドをリサーチし、Instagram運用のための具体的な投稿戦略を立案してください。

重要: 一般的な「時短ツール」だけでなく、「Google Antigravity」や「Gemini 3.0」「Manus
AI」「n8n」のような、エンジニア界隈や先端層で話題になり始めている「次に来るトレンド」を必ず発掘してください。

出力言語: 全て日本語で出力してください。

---

## 手順

### 1. 定量的なトレンド調査 (ブラウザ使用必須)

- **YouTube**: 「AI ツール 仕事」に加え、「Google Antigravity」「Gemini 3.0」「Manus AI」「n8n」「Runway
Gen-4」などのキーワードで検索し、再生数が急上昇している動画（特にここ1〜2週間のもの）を特定してください。
- **X (Twitter)**: site:x.com で「AI」に加え、「Cursor」「Claude
Opus」「Perplexity」「Bolt」「Lovable」などのキーワードを掛け合わせ、技術者層が盛り上がっている新しいツールを探してください。
- **Instagram**: リール動画で「AI」検索し、「n8n」「Canva
AI」「Gamma」といった少し専門的な単語を使っている投稿が伸びていないか確認してください。
- **特定キーワード確認**: 「Google Antigravity」「Gemini 3.0」「Manus AI」「n8n」「Runway
Gen-4」など、今月特に注目すべきツールの最新動向もチェックしてください。

### 2. 投稿戦略の策定

調査データに基づき、今月Instagramで投稿すべき内容を決定してください。

**小カテゴリ (93個)**:
- そのまま投稿タイトルとして使える具体的な企画案。
- 「プログラミング不要で開発」「エンジニアの仕事が変わる」「完全自動化」といった、先端ツールならではのフックを入れたタイトルを作成してください。
- 各タイトルには、追加リサーチに必要な調査項目（research_points）を3〜5個含めてください。
- **各カテゴリ（A〜E）の個数はトレンドの注目度に応じて配分してください。均等である必要はありません。**

---

## 今月のトレンドTOP20（93件は全てここから作成すること）

| rank | topic | mention_count |
|------|-------|---------------|
| 1 | Google Antigravity | 18 |
| 2 | Gemini 3.0 / Deep Think | 17 |
| 3 | Manus AI | 15 |
| 4 | n8n | 14 |
| 5 | Runway Gen-4 | 13 |
| 6 | ChatGPT 5.1 (OpenAI) | 12 |
| 7 | Claude Opus 4.5 | 11 |
| 8 | Perplexity AI | 10 |
| 9 | Cursor | 9 |
| 10 | Bolt / Lovable | 8 |
| 11 | Felo | 8 |
| 12 | Gamma | 7 |
| 13 | Genspark | 6 |
| 14 | Midjourney v7 | 6 |
| 15 | Suno / Udio | 5 |
| 16 | Canva AI | 5 |
| 17 | Notta | 4 |
| 18 | Dify | 4 |
| 19 | Vrew | 3 |
| 20 | Adobe Firefly | 3 |

**ルール:**
- 93件は全てこのTOP20のいずれかに紐づけること
- 各トピックの出現頻度はmention_countに比例させること
- カテゴリA（比較・対決系）は、比較対象が両方ともTOP20内にあるものに限定すること

---

## 出力形式

**必ず以下のJSONスキーマに厳密に従って出力してください。Markdown形式での出力は禁止です。**

{
  "month": "2025-12",
  "categories": {
    "small": [
      {
        "title": "投稿タイトル",
        "tools": ["ツール名1", "ツール名2"],
        "content_type": "比較 / 使い方 / 設定方法 / 解説 / 警告 / まとめ など",
        "category": "A / B / C / D / E",
        "research_points": ["調査項目1", "調査項目2", "調査項目3"]
      }
    ]
  }
}

### カテゴリ記号の定義
- **A**: 比較・対決系
- **B**: 時短・効率化系
- **C**: 先端トレンド・自動化系
- **D**: ネガティブ・警告系
- **E**: まとめ・ランキング系

---

## 制約事項

1. **出力はJSON形式のみ**。Markdownや説明文は不要です。
2. 言語は日本語のみを使用してください。
3. 小カテゴリは**93個**を必ず出力してください。
```

この生成されたプロンプトを実行すると、93件の投稿企画JSONが出力されます：

![93件の企画生成結果](/n8n-advanced/module-03-antigravity-93-ideas.png)

### チェックポイント

- [ ] メタプロンプトの意味を理解した
- [ ] 埋め込みルールを把握した
- [ ] 93件生成のルールを理解した

---

## セクション5: GASでideasシートにインポート

### GASにメニュー機能を追加

スプレッドシートのメニューから直接実行できるようにします。

GASエディタを開き、既存のコードの**先頭**に以下を追加します：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('コンテンツ管理')
    .addItem('JSONをideasに追加', 'importJsonToIdeas')
    .addToUi();
}

/**
 * configシートのA2にあるJSONをideasシートに追加
 * メニューから呼び出し用
 */
function importJsonToIdeas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');

  const jsonStr = configSheet.getRange('A2').getValue();

  if (!jsonStr) {
    SpreadsheetApp.getUi().alert('configシートのA2にJSONがありません');
    return;
  }

  try {
    const data = JSON.parse(jsonStr);
    const month = data.month;
    const smallCategories = data.categories.small;

    const lastRow = ideasSheet.getLastRow();
    let maxId = 0;
    if (lastRow > 1) {
      const existingIds = ideasSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      existingIds.forEach(row => {
        const match = row[0].toString().match(/IDEA-(\d+)/);
        if (match) {
          maxId = Math.max(maxId, parseInt(match[1]));
        }
      });
    }

    const now = new Date();
    const rows = smallCategories.map((item, index) => {
      const ideaId = 'IDEA-' + String(maxId + index + 1).padStart(3, '0');
      return [
        ideaId,
        month,
        item.title,
        item.tools.join(', '),
        item.content_type,
        item.category,
        item.research_points.join(', '),
        'NEW',
        '',
        now
      ];
    });

    if (rows.length > 0) {
      ideasSheet.getRange(lastRow + 1, 1, rows.length, 10).setValues(rows);
    }

    SpreadsheetApp.getUi().alert(rows.length + '件をideasシートに追加しました');

  } catch (error) {
    SpreadsheetApp.getUi().alert('エラー: ' + error.message);
  }
}
```

GASコードの実装画面：

![GASコードの実装](/n8n-advanced/module-03-gas-code.png)

### インポートの実行手順

1. **configシートにJSON貼り付け**: A2セルに93件のJSONを貼り付け
2. **メニューから実行**: 「コンテンツ管理」→「JSONをideasに追加」
3. **結果確認**: ideasシートに93件が追加される

ideasシートへの追加結果：

![ideasシートへの追加結果](/n8n-advanced/module-03-ideas-sheet-result.png)

### チェックポイント

- [ ] GASにonOpen関数とimportJsonToIdeas関数を追加した
- [ ] スプレッドシートを再読み込みしてメニューが表示された
- [ ] configシートにJSONを貼り付けた
- [ ] メニューから実行してideasシートに追加された

---

## セクション6: GASコード全文

既存のdoPost関数と統合した完全なコードを以下に示します：

```javascript
/**
 * スプレッドシート起動時にカスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('コンテンツ管理')
    .addItem('JSONをideasに追加', 'importJsonToIdeas')
    .addToUi();
}

/**
 * configシートのA2にあるJSONをideasシートに追加
 * メニューから呼び出し用
 */
function importJsonToIdeas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');

  const jsonStr = configSheet.getRange('A2').getValue();

  if (!jsonStr) {
    SpreadsheetApp.getUi().alert('configシートのA2にJSONがありません');
    return;
  }

  try {
    const data = JSON.parse(jsonStr);
    const month = data.month;
    const smallCategories = data.categories.small;

    const lastRow = ideasSheet.getLastRow();
    let maxId = 0;
    if (lastRow > 1) {
      const existingIds = ideasSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      existingIds.forEach(row => {
        const match = row[0].toString().match(/IDEA-(\d+)/);
        if (match) {
          maxId = Math.max(maxId, parseInt(match[1]));
        }
      });
    }

    const now = new Date();
    const rows = smallCategories.map((item, index) => {
      const ideaId = 'IDEA-' + String(maxId + index + 1).padStart(3, '0');
      return [
        ideaId,
        month,
        item.title,
        item.tools.join(', '),
        item.content_type,
        item.category,
        item.research_points.join(', '),
        'NEW',
        '',
        now
      ];
    });

    if (rows.length > 0) {
      ideasSheet.getRange(lastRow + 1, 1, rows.length, 10).setValues(rows);
    }

    SpreadsheetApp.getUi().alert(rows.length + '件をideasシートに追加しました');

  } catch (error) {
    SpreadsheetApp.getUi().alert('エラー: ' + error.message);
  }
}

/**
 * n8nからのHTTPリクエストを処理
 */
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const jsonStr = e.postData.contents;
  const data = JSON.parse(jsonStr);

  // === action分岐 ===
  if (data.action === 'archiveAndCleanCanvaSheets') {
    try {
      const result = archiveAndCleanCanvaSheets();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // === updateAudioStatus ===
  if (data.action === 'updateAudioStatus') {
    try {
      const result = updateAudioStatus(data.postId, data.category, data.status);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // === 従来処理（ideas追加） ===
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');

  configSheet.getRange('A2').setValue(jsonStr);

  const month = data.month;
  const smallCategories = data.categories.small;

  const lastRow = ideasSheet.getLastRow();

  let maxId = 0;
  if (lastRow > 1) {
    const existingIds = ideasSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    existingIds.forEach(row => {
      const match = row[0].toString().match(/IDEA-(\d+)/);
      if (match) {
        maxId = Math.max(maxId, parseInt(match[1]));
      }
    });
  }

  const now = new Date();
  const rows = smallCategories.map((item, index) => {
    const ideaId = 'IDEA-' + String(maxId + index + 1).padStart(3, '0');
    return [
      ideaId,
      month,
      item.title,
      item.tools.join(', '),
      item.content_type,
      item.category,
      item.research_points.join(', '),
      'NEW',
      '',
      now
    ];
  });

  if (rows.length > 0) {
    ideasSheet.getRange(lastRow + 1, 1, rows.length, 10).setValues(rows);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, count: rows.length })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 指定したカテゴリのcanvaシートでaudio_statusを更新
 * @param {string} postId - 更新対象のpost_id
 * @param {string} category - カテゴリ（A〜E）
 * @param {string} status - 新しいステータス（例: DONE）
 */
function updateAudioStatus(postId, category, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'canva_' + category;
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return { success: false, error: 'Sheet not found: ' + sheetName };
  }

  const sheetData = sheet.getDataRange().getValues();
  const headers = sheetData[0];
  const postIdCol = headers.indexOf('post_id');
  const audioStatusCol = headers.indexOf('audio_status');

  if (postIdCol === -1 || audioStatusCol === -1) {
    return { success: false, error: 'Required columns not found' };
  }

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][postIdCol] === postId) {
      sheet.getRange(i + 1, audioStatusCol + 1).setValue(status);
      return { success: true, postId: postId, category: category, status: status };
    }
  }

  return { success: false, error: 'Post not found: ' + postId };
}

/**
 * canva_A〜Eのデータをarchiveへコピーし、canvaシートをクリア
 * n8nからHTTP POSTで呼び出す
 */
function archiveAndCleanCanvaSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const archiveSheet = ss.getSheetByName('archive');

  if (!archiveSheet) {
    throw new Error('archiveシートが見つかりません。setupArchiveSheet()を実行してください。');
  }

  const canvaSheets = ['canva_A', 'canva_B', 'canva_C', 'canva_D', 'canva_E'];
  const now = new Date().toISOString();
  let totalArchived = 0;

  canvaSheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return;

    const lastCol = sheet.getLastColumn();
    const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    data.forEach(row => {
      if (!row[0]) return;
      archiveSheet.appendRow([...row, now, sheetName]);
      totalArchived++;
    });

    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();

    Logger.log(sheetName + ': ' + (lastRow - 1) + '件をアーカイブ');
  });

  return {
    success: true,
    archivedCount: totalArchived,
    timestamp: now
  };
}
```

### チェックポイント

- [ ] GASコード全文を確認した
- [ ] 既存のdoPost関数との統合を理解した

---

## トラブルシューティング

現時点でユーザー実践による問題は報告されていません。

---

## まとめ

### このモジュールで学んだこと

- 従来の「AI任せ」リサーチの問題点と改善アプローチ
- インフルエンサー起点・出現率ベースのトレンド調査手法
- 海外版・日本版リサーチプロンプトの違いと使い分け
- リサーチ結果から投稿企画生成プロンプトを作るメタプロンプト
- GASによるスプレッドシートメニューからのワンクリックインポート

### 次のステップ

次のモジュールでは、ideasシートのデータをn8nでGemini APIに送り、実際の投稿台本（hook、step_content、narration等）を生成します。

---

## 参考資料

- [Google Apps Script リファレンス - Ui クラス](https://developers.google.com/apps-script/reference/base/ui)
- [Google Apps Script リファレンス - SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)

---

## よくある質問

**Q: メニューが表示されない**
A: スプレッドシートを再読み込み（F5）してください。onOpen関数はスプレッドシートを開いた時に実行されます。

**Q: 海外版と日本版、どちらを使えばいい？**
A: 日本向けのInstagramアカウントなら日本版を使用してください。両方実行して結果をマージすることも可能です。

**Q: 93件より少なく生成したい場合は？**
A: プロンプトの「小カテゴリは93個を必ず出力」の部分を任意の数に変更してください。

**Q: カテゴリA（比較）で片方がTOP20外のツールと比較したい**
A: 設計上、両方TOP20内に限定しています。片方が不明なツールだと視聴者に刺さらないためです。どうしても必要な場合はルールを修正してください。

**Q: mention_countが1のトピックは使うべき？**
A: 1人しか言及していないものは信頼性が低いため、除外を推奨します。プロンプトに「mention_count 2以上のみ使用」と追記できます。
