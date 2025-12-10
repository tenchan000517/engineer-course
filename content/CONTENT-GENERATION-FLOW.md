# Instagram自動投稿システム - コンテンツ生成フロー詳細

このドキュメントでは、AIリサーチからInstagram投稿までのコンテンツ生成フローを詳細に言語化し、必要なシート構造を定義します。

---

## 全体フロー図

```
[Phase 1: AIリサーチ層]
Antigravity等でトレンド調査 → JSON出力（93件/月）
                ↓
[Phase 2: 企画管理層]
configシート（JSON一時保存）→ GAS → ideasシート（企画管理）
                ↓
[Phase 3: コンテンツ生成層]
ideasシート（status=NEW）→ n8n → Gemini API（5カテゴリ×プロンプト）→ postsシート
                ↓
[Phase 4: Canva振り分け層]
postsシート（status=DRAFT）→ n8n → canva_A〜Eシート（パターン別）
                ↓
[Phase 5: デザイン製作層]
Canva Bulk Create（手動）→ 動画ファイル（.mp4）→ Google Drive
                ↓
[Phase 6: 音声合成層]※上級編
canva_A〜E（audio_status=NORMAL）→ Fish Audio → ffmpeg合成 → Google Drive
                ↓
[Phase 7: 投稿実行層]
Google Drive → Cloudinary → Instagram Graph API
```

---

## Phase 1: AIリサーチ層

### 入力
- AIリサーチツール（Antigravity等）
- 月次リサーチプロンプト

### 処理
Antigravity等のAIツールでトレンドをリサーチし、投稿企画をJSON形式で出力する。

### 出力（JSON形式）
```json
{
  "month": "2025-12",
  "categories": {
    "small": [
      {
        "title": "ChatGPT vs Claude、どっちが仕事で使える？",
        "tools": ["ChatGPT", "Claude"],
        "content_type": "比較",
        "category": "A",
        "research_points": ["料金比較", "回答精度", "日本語対応", "API連携", "セキュリティ"]
      },
      // ...93件
    ]
  }
}
```

### カテゴリ定義

| 記号 | カテゴリ名 | 投稿パターン | 内容例 |
|------|-----------|-------------|--------|
| A | 比較・対決系 | versus | ChatGPT vs Claude、ツール比較 |
| B | 時短・効率化系 | instant_hack | 作業効率化、時間短縮テクニック |
| C | 先端トレンド・裏技系 | secret_feature | 最新ツール、隠し機能、自動化ノウハウ |
| D | ネガティブ・警告系 | warning | 注意喚起、リスク情報、やってはいけないこと |
| E | まとめ・ランキング系 | ranking | ツールまとめ、TOP3、ベスト5 |

### 月次リサーチプロンプト（Antigravity用）

```
目的: [ 202X年 X月 ] のAIトレンドをリサーチし、Instagram運用のための具体的な投稿戦略を立案してください。

重要: 一般的な「時短ツール」だけでなく、「Antigravity」や「n8n」のような、エンジニア界隈や先端層で話題になり始めている「次に来るトレンド」を必ず発掘してください。

出力言語: 全て日本語で出力してください。

---

## 手順

### 1. 定量的なトレンド調査 (ブラウザ使用必須)

- **YouTube**: 「AI ツール 仕事」に加え、「AI エージェント」「AI 自動化」「最新AIニュース」などのキーワードで検索し、再生数が急上昇している動画（特にここ1〜2週間のもの）を特定してください。
- **X (Twitter)**: site:x.com で「AI」に加え、「開発」「エンジニア」「自動化」「神ツール」などのキーワードを掛け合わせ、技術者層が盛り上がっている新しいツールを探してください。
- **Instagram**: リール動画で「AI」検索し、「n8n」「ワークフロー」といった少し専門的な単語を使っている投稿が伸びていないか確認してください。
- **特定キーワード確認**: 「Antigravity」「Nanobanana」「n8n」など、先月から継続して注目すべきツールの最新動向もチェックしてください。

### 2. 投稿戦略の策定

調査データに基づき、今月Instagramで投稿すべき内容を決定してください。

**小カテゴリ (93個)**:
- そのまま投稿タイトルとして使える具体的な企画案。
- 「プログラミング不要で開発」「エンジニアの仕事が変わる」「完全自動化」といった、先端ツールならではのフックを入れたタイトルを作成してください。
- 各タイトルには、追加リサーチに必要な調査項目（research_points）を3〜5個含めてください。
- **各カテゴリ（A〜E）の個数はトレンドの注目度に応じて配分してください。均等である必要はありません。**

---

## 出力形式

**必ず以下のJSONスキーマに厳密に従って出力してください。Markdown形式での出力は禁止です。**

{
  "month": "202X-XX",
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
3. 「ChatGPTでメール作成」のようなありきたりなネタだけでなく、「一般層がまだ知らないが、見たら驚くような高度な活用」を掘り下げてください。
4. ブラウザを使って実際の検索結果を確認し、空想ではなく事実に基づいたデータを集めてください。
5. 小カテゴリは**93個**を必ず出力してください。
```

---

## Phase 2: 企画管理層

### ワークフロー: Research to Ideas

```
[Manual Trigger]
    ↓
[Google Sheets: Get row(s)] ← config!A2からJSON取得
    ↓
[HTTP Request: POST] → GAS WebApp
    ↓
GASがJSONをパースしてideasシートに追加
```

### 処理詳細

1. configシートのA2セルにAIリサーチ結果のJSONを貼り付け
2. n8nワークフローを実行
3. GASがJSONをパースし、ideasシートに1行ずつ追加
4. 各行にIDEA-001形式のidea_idを自動採番

---

## Phase 3: コンテンツ生成層

### ワークフロー: SNS投稿作成

```
[Manual Trigger]
    ↓
[Google Sheets: Get row(s)] ← ideas（status=NEW）を取得
    ↓
[Code: Limit 5 per Category] ← カテゴリごとに5件制限
    ↓
[Split In Batches] ← 1件ずつループ
    ↓
[Switch] ← categoryでA〜Eに分岐
    ├── Category A → [Gemini A (versus)]
    ├── Category B → [Gemini B (instant_hack)]
    ├── Category C → [Gemini C (secret_feature)]
    ├── Category D → [Gemini D (warning)]
    └── Category E → [Gemini E (ranking)]
    ↓
[Code: Parse JSON] ← Gemini出力をパース
    ↓
[Google Sheets: Append to posts] ← postsシートに追加
    ↓
[Google Sheets: Update ideas] ← status=ADOPTED に更新
    ↓
[Wait 5s] ← API制限対策
    ↓
[Loop] に戻る
```

### カテゴリ別コンテンツ作成プロンプト

各カテゴリに対応したGeminiプロンプトを以下に記載する。n8nのGeminiノードで使用する。

---

#### Category A: versus（比較・対決型）プロンプト

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「VS対決型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## VS対決型の構成
- hook: 視聴者の注目を引く煽りワード
- title_1〜3: 対決の構図を示す（ツールA VS ツールB）
- problems: 視聴者が抱える悩み・混乱（3行、改行区切り）
- step1〜3: 比較ポイント（タイトル＋内容3行）
- cta: 行動喚起

## hookの良い例（必ずこのような形式で）
- 「知らないと損する！」
- 「結論すごいのはどっち？」
- 「徹底比較してみた」
- 「どっちを選ぶべき？」
- 「勝者はこっちでした」

## 文字数制限（厳守）
- hook: 全角11文字以内
- title_1, title_2, title_3: 各全角11文字以内
- step1_title, step2_title, step3_title: 各全角11文字以内
- problems内の各行: 全角14文字以内
- step内容の各行: 全角14文字以内

## step内容の良い例
- 「コードを書かずに自動化」
- 「初心者でもすぐ使える」
- 「無料プランで十分」
- 「設定は3分で完了」

## step内容の悪い例（絶対に使わない）
- 「導入のし易さ差」← 日本語として不自然
- 「機能性の違い」← 抽象的すぎる
- 「コスト面での優位」← 硬すぎる

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "versus",
  "narration_1": "（前半30秒のナレーション全文）",
  "narration_2": "（後半30秒のナレーション全文）",
  "hook": "（煽りワード、11文字以内）",
  "title_1": "（対決の左側、11文字以内）",
  "title_2": "VS",
  "title_3": "（対決の右側、11文字以内）",
  "problems": "（悩み1行目）\n（悩み2行目）\n（悩み3行目）",
  "step1_title": "（比較ポイント1、11文字以内）",
  "step1_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step2_title": "（比較ポイント2、11文字以内）",
  "step2_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step3_title": "（比較ポイント3、11文字以内）",
  "step3_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "cta": "コメントで教えて！",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

重要:
- JSONのみ出力してください
- 絵文字の使用は禁止です
- 自然な日本語を使ってください（硬い表現・不自然な造語は禁止）
```

---

#### Category B: instant_hack（即効ハック型）プロンプト

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「即効ハック型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 即効ハック型の構成
- hook: 視聴者の注目を引く煽りワード
- title_1〜3: 解決できることをインパクトある形で
- problems: 手作業の辛さ・非効率さ（3行、改行区切り）
- step1〜3: 解決ステップ（タイトル＋内容3行）
- cta: 行動喚起

## hookの良い例（必ずこのような形式で）
- 「まだ手動でやってるの？」
- 「これ知らないと損！」
- 「作業時間が半分に！」
- 「今すぐ使って！」
- 「神ツール発見した」

## 文字数制限（厳守）
- hook: 全角11文字以内
- title_1, title_2, title_3: 各全角11文字以内
- step1_title, step2_title, step3_title: 各全角11文字以内
- problems内の各行: 全角14文字以内
- step内容の各行: 全角14文字以内

## step内容の良い例
- 「ボタン1つで完了」
- 「設定は3分だけ」
- 「無料で使える」
- 「コード不要で簡単」

## step内容の悪い例（絶対に使わない）
- 「効率性の向上」← 抽象的すぎる
- 「時間短縮効果」← 硬すぎる
- 「自動化の実現」← 具体性がない

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "instant_hack",
  "narration_1": "（前半30秒のナレーション全文）",
  "narration_2": "（後半30秒のナレーション全文）",
  "hook": "（煽りワード、11文字以内）",
  "title_1": "（11文字以内）",
  "title_2": "（11文字以内）",
  "title_3": "（11文字以内、不要なら空文字）",
  "problems": "（悩み1行目）\n（悩み2行目）\n（悩み3行目）",
  "step1_title": "（ステップ1タイトル、11文字以内）",
  "step1_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step2_title": "（ステップ2タイトル、11文字以内）",
  "step2_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step3_title": "（ステップ3タイトル、11文字以内）",
  "step3_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "cta": "プロフのリンクから！",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

重要:
- JSONのみ出力してください
- 絵文字の使用は禁止です
- 自然な日本語を使ってください（硬い表現・不自然な造語は禁止）
```

---

#### Category C: secret_feature（裏技暴露型）プロンプト

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「裏技暴露型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 裏技暴露型の構成
- hook: 視聴者の注目を引く煽りワード
- title_1〜3: 暴露する裏技・隠し機能をインパクトある形で
- problems: 普通の使い方では損している状況（3行、改行区切り）
- step1〜3: 裏技ステップ（タイトル＋内容3行）
- cta: 行動喚起

## hookの良い例（必ずこのような形式で）
- 「99%が知らない！」
- 「隠し機能を発見！」
- 「これ気づいてた？」
- 「裏技教えます」
- 「公式も言わない」

## 文字数制限（厳守）
- hook: 全角11文字以内
- title_1, title_2, title_3: 各全角11文字以内
- step1_title, step2_title, step3_title: 各全角11文字以内
- problems内の各行: 全角14文字以内
- step内容の各行: 全角14文字以内

## step内容の良い例
- 「設定画面の奥にある」
- 「長押しで出てくる」
- 「この組み合わせが最強」
- 「知ってる人だけ得する」

## step内容の悪い例（絶対に使わない）
- 「機能の活用方法」← 抽象的すぎる
- 「設定変更の効果」← 硬すぎる
- 「利便性の向上」← 具体性がない

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "secret_feature",
  "narration_1": "（前半30秒のナレーション全文）",
  "narration_2": "（後半30秒のナレーション全文）",
  "hook": "（煽りワード、11文字以内）",
  "title_1": "（11文字以内）",
  "title_2": "（11文字以内）",
  "title_3": "（11文字以内、不要なら空文字）",
  "problems": "（悩み1行目）\n（悩み2行目）\n（悩み3行目）",
  "step1_title": "（裏技1タイトル、11文字以内）",
  "step1_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step2_title": "（裏技2タイトル、11文字以内）",
  "step2_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step3_title": "（裏技3タイトル、11文字以内）",
  "step3_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "cta": "保存して試してみて！",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

重要:
- JSONのみ出力してください
- 絵文字の使用は禁止です
- 自然な日本語を使ってください（硬い表現・不自然な造語は禁止）
```

---

#### Category D: warning（警告型）プロンプト

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「警告型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 警告型の構成
- hook: 視聴者の注目を引く煽りワード
- title_1〜3: 警告内容をインパクトある形で
- problems: 放置するとどうなるか（3行、改行区切り）
- step1〜3: 対策ステップ（タイトル＋内容3行）
- cta: 行動喚起

## hookの良い例（必ずこのような形式で）
- 「今すぐやめて！」
- 「これやってたら危険」
- 「知らないとヤバい」
- 「要注意です」
- 「警告します」

## 文字数制限（厳守）
- hook: 全角11文字以内
- title_1, title_2, title_3: 各全角11文字以内
- step1_title, step2_title, step3_title: 各全角11文字以内
- problems内の各行: 全角14文字以内
- step内容の各行: 全角14文字以内

## step内容の良い例
- 「まずこれを確認して」
- 「設定を今すぐ変更」
- 「これだけは絶対やる」
- 「放置すると大変なことに」

## step内容の悪い例（絶対に使わない）
- 「リスク回避の方法」← 抽象的すぎる
- 「対策の実施」← 硬すぎる
- 「注意点の確認」← 具体性がない

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "warning",
  "narration_1": "（前半30秒のナレーション全文）",
  "narration_2": "（後半30秒のナレーション全文）",
  "hook": "（煽りワード、11文字以内）",
  "title_1": "（11文字以内）",
  "title_2": "（11文字以内）",
  "title_3": "（11文字以内、不要なら空文字）",
  "problems": "（リスク1行目）\n（リスク2行目）\n（リスク3行目）",
  "step1_title": "（対策1タイトル、11文字以内）",
  "step1_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step2_title": "（対策2タイトル、11文字以内）",
  "step2_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step3_title": "（対策3タイトル、11文字以内）",
  "step3_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "cta": "保存して実践して！",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

重要:
- JSONのみ出力してください
- 絵文字の使用は禁止です
- 自然な日本語を使ってください（硬い表現・不自然な造語は禁止）
```

---

#### Category E: ranking（ランキング型）プロンプト

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「ランキング型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## ランキング型の構成
- hook: 視聴者の注目を引く煽りワード
- title_1〜3: ランキングテーマをインパクトある形で
- problems: 選択肢が多すぎて困っている状況（3行、改行区切り）
- step1: 第3位（タイトル＋内容3行）
- step2: 第2位（タイトル＋内容3行）
- step3: 第1位（タイトル＋内容3行）
- cta: 行動喚起

## hookの良い例（必ずこのような形式で）
- 「2025年最新！」
- 「TOP3発表！」
- 「ベスト3はこれ！」
- 「ランキング作った」
- 「おすすめ3選！」

## 文字数制限（厳守）
- hook: 全角11文字以内
- title_1, title_2, title_3: 各全角11文字以内
- step1_title, step2_title, step3_title: 各全角11文字以内
- problems内の各行: 全角14文字以内
- step内容の各行: 全角14文字以内

## step内容の良い例
- 「無料で使えるのが最高」
- 「初心者でも簡単」
- 「これがあれば完璧」
- 「迷ったらこれ一択」

## step内容の悪い例（絶対に使わない）
- 「機能面での評価」← 抽象的すぎる
- 「総合的な優位性」← 硬すぎる
- 「選定理由の説明」← 具体性がない

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "ranking",
  "narration_1": "（前半30秒のナレーション全文）",
  "narration_2": "（後半30秒のナレーション全文）",
  "hook": "（煽りワード、11文字以内）",
  "title_1": "（11文字以内）",
  "title_2": "（11文字以内）",
  "title_3": "（11文字以内、不要なら空文字）",
  "problems": "（悩み1行目）\n（悩み2行目）\n（悩み3行目）",
  "step1_title": "（第3位、11文字以内）",
  "step1_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step2_title": "（第2位、11文字以内）",
  "step2_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "step3_title": "（第1位、11文字以内）",
  "step3_content": "（内容1行目）\n（内容2行目）\n（内容3行目）",
  "cta": "コメントで教えて！",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

重要:
- JSONのみ出力してください
- 絵文字の使用は禁止です
- 自然な日本語を使ってください（硬い表現・不自然な造語は禁止）
```

---

### プロンプト共通ルール

| ルール | 説明 |
|--------|------|
| 出力形式 | JSON形式のみ（Markdownコードブロック不要） |
| 絵文字 | 使用禁止 |
| 日本語 | 自然な口語体を使用（硬い表現・不自然な造語は禁止） |
| 文字数制限 | hook/title: 11文字、content各行: 14文字 |
| ナレーション | 前半30秒（narration_1）と後半30秒（narration_2）に分割 |
| ハッシュタグ | 5個（配列形式） |
| キャプション | 300文字程度 |

### Gemini出力のパース（Code: Parse JSON）

```javascript
let text;
const input = $input.first().json;

if (input.text) {
  text = input.text;
} else if (input.content && input.content.parts) {
  text = input.content.parts[0].text;
} else if (typeof input === 'string') {
  text = input;
} else {
  return [{ json: input }];
}

// ```json と ``` を除去
let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

// 末尾のカンマ除去
cleanText = cleanText.replace(/,(\s*[\]}])/g, '$1');

try {
  const parsed = JSON.parse(cleanText);
  return [{ json: parsed }];
} catch (e) {
  return [{ json: { error: e.message, rawText: cleanText.substring(0, 500) } }];
}
```

---

## Phase 4: Canva振り分け層

### ワークフロー: Canva用シート振り分け

```
[Manual Trigger]
    ↓
[HTTP Request: Archive & Clean] → GAS（既存データをアーカイブ）
    ↓
[Google Sheets: Get DRAFT Posts] ← posts（status=DRAFT）を取得
    ↓
[Code: Parse JSON & Category] ← content_jsonからpatternを抽出しカテゴリ判定
    ↓
[Switch Category] ← patternでA〜Eに分岐
    ├── Category A (versus) → [Append to canva_A]
    ├── Category B (instant_hack) → [Append to canva_B]
    ├── Category C (secret_feature) → [Append to canva_C]
    ├── Category D (warning) → [Append to canva_D]
    └── Category E (ranking) → [Append to canva_E]
```

### Parse JSON & Category コード

```javascript
const results = [];

for (const item of $input.all()) {
  const postId = item.json.post_id;
  const contentJsonStr = item.json.content_json;

  if (!contentJsonStr) continue;

  try {
    const json = JSON.parse(contentJsonStr);
    const pattern = json.pattern || '';

    let category = '';
    switch (pattern) {
      case 'versus': category = 'A'; break;
      case 'instant_hack': category = 'B'; break;
      case 'secret_feature': category = 'C'; break;
      case 'warning': category = 'D'; break;
      case 'ranking': category = 'E'; break;
      default: category = 'C';
    }

    results.push({
      json: {
        post_id: postId,
        category: category,
        narration_1: json.narration_1 || '',
        narration_2: json.narration_2 || '',
        hook: json.hook || '',
        title_1: json.title_1 || '',
        title_2: json.title_2 || '',
        title_3: json.title_3 || '',
        problems: json.problems || '',
        step1_title: json.step1_title || '',
        step1_content: json.step1_content || '',
        step2_title: json.step2_title || '',
        step2_content: json.step2_content || '',
        step3_title: json.step3_title || '',
        step3_content: json.step3_content || '',
        cta: json.cta || '',
        audio_status: 'NORMAL'
      }
    });
  } catch (e) {
    // skip invalid JSON
  }
}

return results;
```

---

## 必要なシート一覧と構造

### 1. configシート

**目的**: AIリサーチ結果のJSON一時保存

| 列名 | 型 | 説明 |
|------|-----|------|
| json_data | TEXT | AIリサーチ結果のJSON全文 |

**備考**: A2セルに大きなJSONを貼り付ける。列幅800px、行高さ400px推奨。

---

### 2. ideasシート

**目的**: 投稿企画の管理（月93件程度）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| idea_id | TEXT | 一意のID | IDEA-001 |
| month | TEXT | リサーチ月 | 2025-12 |
| title | TEXT | 投稿タイトル | ChatGPT vs Claude比較 |
| tools | TEXT | 対象ツール（カンマ区切り） | ChatGPT, Claude |
| content_type | TEXT | 内容種別 | 比較 / 使い方 / 設定方法 / 解説 / 警告 / まとめ |
| category | TEXT | カテゴリ記号 | A / B / C / D / E |
| research_points | TEXT | 追加リサーチ項目（カンマ区切り） | 料金比較, 回答精度, API連携 |
| status | TEXT | 状態 | NEW / ADOPTED / REJECTED |
| adopted_post_id | TEXT | 採用時のpost_id | POST-1733000000000 |
| created_at | DATETIME | 作成日時 | 2025-12-01T10:00:00Z |

**ステータスフロー**:
```
[NEW] → [ADOPTED] → postsシートに移行
         ↓
      [REJECTED] → 採用しない
```

---

### 3. postsシート

**目的**: 投稿の管理（キャプション、ステータス、Instagram投稿ID等）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| post_id | TEXT | 一意の投稿ID | POST-1733000000000 |
| post_type | TEXT | 投稿種別 | IMAGE / CAROUSEL / REELS |
| status | TEXT | 状態 | DRAFT / READY / PROCESSING / PUBLISHED / FAILED |
| caption | TEXT | キャプション本文 | AI時代の必須スキル... |
| hashtags | TEXT | ハッシュタグ（カンマ区切り） | #AI,#自動化,#n8n |
| media_ids | TEXT | 参照するメディアID（カンマ区切り） | MEDIA-001,MEDIA-002 |
| scheduled_at | DATETIME | 投稿予定日時 | 2025-12-10T18:00:00Z |
| published_at | DATETIME | 実際の投稿日時 | 2025-12-10T18:01:23Z |
| ig_post_id | TEXT | Instagram投稿ID | 18123456789012345 |
| share_to_feed | BOOLEAN | リールをフィードにも表示 | TRUE / FALSE |
| thumb_offset_ms | NUMBER | サムネイル位置（ミリ秒） | 1000 |
| error_message | TEXT | エラーメッセージ | Invalid OAuth token |
| retry_count | NUMBER | リトライ回数 | 0 |
| created_at | DATETIME | 作成日時 | 2025-12-01T10:00:00Z |
| updated_at | DATETIME | 更新日時 | 2025-12-01T10:05:00Z |
| notes | TEXT | メモ | テスト投稿 |
| content_json | TEXT | Gemini生成コンテンツJSON全文 | {"pattern":"versus",...} |

**ステータスフロー**:
```
[DRAFT] → [READY] → [PROCESSING] → [PUBLISHED]
              ↓           ↓
           (手動変更)   [FAILED] → リトライ → [READY]
```

---

### 4. mediaシート

**目的**: メディアファイルの管理（画像・動画）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| media_id | TEXT | 一意のメディアID | MEDIA-001 |
| media_type | TEXT | メディア種別 | IMAGE / VIDEO |
| source | TEXT | ソース種別 | URL / CLOUDINARY / CANVA / AI_GENERATED / DRIVE |
| original_url | TEXT | 元のURL/パス | https://drive.google.com/... |
| public_url | TEXT | 公開URL（Instagram投稿用） | https://res.cloudinary.com/... |
| cloudinary_id | TEXT | Cloudinary Public ID | instagram/abc123 |
| canva_design_id | TEXT | CanvaデザインID | DAF1234567890 |
| filename | TEXT | ファイル名 | POST-1733000000000.mp4 |
| width | NUMBER | 幅（px） | 1080 |
| height | NUMBER | 高さ（px） | 1920 |
| duration_sec | NUMBER | 動画の長さ（秒） | 60 |
| file_size_mb | NUMBER | ファイルサイズ（MB） | 45.2 |
| status | TEXT | 状態 | PENDING / UPLOADING / READY / ERROR |
| ig_container_id | TEXT | Instagram Container ID | 17987654321098765 |
| error_message | TEXT | エラーメッセージ | Upload failed |
| created_at | DATETIME | 作成日時 | 2025-12-01T10:00:00Z |

---

### 5. archiveシート

**目的**: 投稿済みデータの保管（postsと同じ構造）

| 列名 | 型 | 説明 |
|------|-----|------|
| （postsシートと同一構造） | | |

**備考**: 月次でPUBLISHED状態の投稿をarchiveに移動し、postsシートをクリーンに保つ。

---

### 6. canva_A〜Eシート（5シート）

**目的**: Canva Bulk Create用のデータ（カテゴリ別）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| post_id | TEXT | postsシートのpost_id | POST-1733000000000 |
| narration_1 | TEXT | 前半30秒ナレーション | こんにちは、今日は... |
| narration_2 | TEXT | 後半30秒ナレーション | さらに詳しく見ていくと... |
| hook | TEXT | 煽りワード（11文字以内） | 知らないと損する！ |
| title_1 | TEXT | タイトル1（11文字以内） | ChatGPT |
| title_2 | TEXT | タイトル2（11文字以内） | VS |
| title_3 | TEXT | タイトル3（11文字以内） | Claude |
| problems | TEXT | 悩み（改行区切り3行） | 選び方がわからない\n違いが不明\n両方試すのは大変 |
| step1_title | TEXT | ステップ1タイトル（11文字以内） | 料金を比較 |
| step1_content | TEXT | ステップ1内容（改行区切り3行） | ChatGPTは月20ドル\nClaudeは月20ドル\n無料枠にも差がある |
| step2_title | TEXT | ステップ2タイトル（11文字以内） | 回答精度を比較 |
| step2_content | TEXT | ステップ2内容（改行区切り3行） | 論理的推論はClaude\nコード生成はGPT\n日本語は互角 |
| step3_title | TEXT | ステップ3タイトル（11文字以内） | 結論はこれ |
| step3_content | TEXT | ステップ3内容（改行区切り3行） | 用途で選ぶのがベスト\n両方使い分けが最強\n無料枠で試そう |
| cta | TEXT | 行動喚起 | コメントで教えて！ |
| audio_status | TEXT | 音声合成状態 | NORMAL / DONE |

**シート別対応表**:

| シート名 | カテゴリ | パターン |
|---------|---------|---------|
| canva_A | A | versus（比較・対決型） |
| canva_B | B | instant_hack（即効ハック型） |
| canva_C | C | secret_feature（裏技暴露型） |
| canva_D | D | warning（警告型） |
| canva_E | E | ranking（ランキング型） |

---

## データフロー詳細

### ideas → posts への変換

```
ideas.title         → Geminiプロンプトの入力
ideas.tools         → Geminiプロンプトの入力
ideas.research_points → Geminiプロンプトの入力
ideas.category      → Geminiプロンプト選択（A〜E）
                    ↓
              [Gemini API]
                    ↓
Gemini出力          → posts.content_json（JSON全文を保存）
Gemini出力.caption  → posts.caption
Gemini出力.hashtags → posts.hashtags（配列→カンマ区切り）
Gemini出力.post_type → posts.post_type
自動生成            → posts.post_id（POST-{timestamp}）
固定値              → posts.status = "DRAFT"
現在日時            → posts.created_at
```

### posts → canva_* への変換

```
posts.post_id                  → canva_*.post_id
posts.content_json.narration_1 → canva_*.narration_1
posts.content_json.narration_2 → canva_*.narration_2
posts.content_json.hook        → canva_*.hook
posts.content_json.title_1     → canva_*.title_1
posts.content_json.title_2     → canva_*.title_2
posts.content_json.title_3     → canva_*.title_3
posts.content_json.problems    → canva_*.problems
posts.content_json.step1_title → canva_*.step1_title
posts.content_json.step1_content → canva_*.step1_content
（以下同様）
posts.content_json.pattern     → 振り分け先シート決定（versus→A, instant_hack→B, ...）
固定値                         → canva_*.audio_status = "NORMAL"
```

---

## 運用フロー

### 月次運用

1. **月1回**: Antigravityでトレンドリサーチ（93件のJSON出力）
2. **月1回**: configシートにJSON貼り付け → n8n「Research to Ideas」実行
3. **随時**: n8n「SNS投稿作成」実行（ideas → posts）
4. **随時**: n8n「Canva用シート振り分け」実行（posts → canva_*）
5. **随時**: Canva Bulk Createで動画作成 → Google Driveにアップロード
6. **随時**: n8n「音声合成」実行（動画に音声追加）※上級編
7. **毎日**: n8n「Instagram Reel Post」がスケジュール実行（6:00, 12:00, 18:00）

### 投稿頻度設計

- 1日3投稿（異なるカテゴリから選択）
- カテゴリをローテーション（A→B→C→D→E→A...）
- 月93件 ÷ 3投稿/日 = 約31日分

---

## 関連ワークフローJSON

| ワークフロー | ファイル | 目的 |
|-------------|---------|------|
| Research to Ideas | - | config → ideas |
| SNS投稿作成 | SNS投稿作成.json | ideas → posts |
| Canva用シート振り分け | Canva用シート振り分け.json | posts → canva_* |
| 音声合成 | 音声合成.json | canva_* → 動画合成 |
| Instagram Reel Post | Instagram Reel from Drive.json | 動画 → Instagram |

---

## 文字数制限ルール

Canvaテンプレートとの連携のため、以下の文字数制限を厳守する：

| フィールド | 制限 | 備考 |
|-----------|------|------|
| hook | 全角11文字以内 | 視聴者の注目を引く煽りワード |
| title_1, title_2, title_3 | 各全角11文字以内 | タイトル構成要素 |
| step1_title, step2_title, step3_title | 各全角11文字以内 | ステップタイトル |
| problems（各行） | 全角14文字以内 | 3行、改行区切り |
| step*_content（各行） | 全角14文字以内 | 3行、改行区切り |

---

## 参考資料

- Module 05: 投稿管理シートを設計する
- Module 07: AIコンテンツ自動生成の準備
- Module 08: AIコンテンツ自動生成ワークフロー
- Module 09: Canva一括作成
- HANDOFF-n8n-advanced.md: 上級編引き継ぎ資料
