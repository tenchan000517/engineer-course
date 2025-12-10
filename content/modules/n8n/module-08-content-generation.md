# AIコンテンツ自動生成ワークフロー

**所要時間**: 60分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- ideasシートから投稿企画を取得するワークフロー構築
- Switchノードによるカテゴリ分岐
- Geminiで台本を自動生成する方法
- Codeノードでのパース処理
- postsシートへの保存とideasシートの更新

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- ideasシートのNEW企画を取得し、カテゴリ別にGeminiへ振り分けできる
- Geminiで60秒リール台本をJSON形式で生成できる
- 生成した台本をpostsシートに保存し、ideasのstatusを更新できる

---

## 目次

- [セクション1: ワークフロー作成とideas取得](#セクション1-ワークフロー作成とideas取得)
- [セクション2: Switchノードでカテゴリ分岐](#セクション2-switchノードでカテゴリ分岐)
- [セクション3: Geminiで台本生成](#セクション3-geminiで台本生成)
- [セクション4: Codeノードでパース](#セクション4-codeノードでパース)
- [セクション5: postsシートへの保存とideas更新](#セクション5-postsシートへの保存とideas更新)
- [セクション6: 残り4カテゴリの追加](#セクション6-残り4カテゴリの追加)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 07で作成したideasシート（status=NEWのデータあり）
- Module 07で設定したGemini Credential
- Module 05で作成したpostsシート

### 前提知識

- Module 07: AIコンテンツ自動生成の準備

---

## セクション1: ワークフロー作成とideas取得

### 完成形

```
[Manual Trigger] → [Get row(s) in sheet] → [Switch] → [Gemini×5] → [Code] → [Append row] → [Update row]
```

### Step 1: 新規ワークフローを作成

1. n8nで新しいワークフローを作成
2. 名前を「Create posts」に設定
3. Manual Triggerを追加

### Step 2: Google Sheetsノードを追加

1. Manual Triggerの右の **+** をクリック
2. **Google Sheets** を検索して選択

![Google Sheets選択](/n8n-setup/102-new-workflow-sheets.png)

3. **Get row(s) in sheet** を選択

![Actions一覧](/n8n-setup/103-sheets-actions-list.png)

### Step 3: ideasシートからNEWデータを取得

以下の設定を行います。

| 項目 | 値 |
|------|-----|
| Credential | Google Sheets account |
| Resource | Sheet Within Document |
| Operation | Get Row(s) |
| Document | n8n-test |
| Sheet | ideas |

**Filters**:
| 項目 | 値 |
|------|-----|
| Column | status |
| Value | NEW |

**Options** → **Add option** をクリック:
| 項目 | 値 |
|------|-----|
| Return only First Matching Row | ON |

![Get row(s)設定](/n8n-setup/104-get-rows-ideas-config.png)

### Step 4: 実行して確認

**Execute step** をクリックして、ideasシートからNEWステータスのデータが取得できることを確認します。

![取得結果](/n8n-setup/105-get-rows-ideas-result.png)

### チェックポイント

- [ ] Create postsワークフローを作成できた
- [ ] Google Sheetsノードを追加できた
- [ ] ideasシートからstatus=NEWのデータを取得できた

---

## セクション2: Switchノードでカテゴリ分岐

### Step 1: Switchノードを追加

1. Get row(s) in sheetノードの右の **+** をクリック
2. 「Switch」を検索して選択

### Step 2: 5つのルールを設定

| 項目 | 値 |
|------|-----|
| Mode | Rules |

**Add Routing Rule** を5回クリックして、以下のルールを設定します。

| ルール | Value1 | Operator | Value2 | Output Name |
|-------|--------|----------|--------|-------------|
| 1 | `{{ $json.category }}` | is equal to | A | Category A |
| 2 | `{{ $json.category }}` | is equal to | B | Category B |
| 3 | `{{ $json.category }}` | is equal to | C | Category C |
| 4 | `{{ $json.category }}` | is equal to | D | Category D |
| 5 | `{{ $json.category }}` | is equal to | E | Category E |

各ルールで **Rename Output** を ON にして、Output Name を設定してください。

![Switch設定](/n8n-setup/107-switch-initial.png)

### Step 3: 実行して確認

ワークフローを実行すると、データのcategoryに応じて適切な出力に振り分けられます。

![Switch結果](/n8n-setup/108-switch-complete.png)

![ワークフロー全体](/n8n-setup/106-workflow-with-switch.png)

### チェックポイント

- [ ] Switchノードを追加できた
- [ ] 5つのルールを設定できた
- [ ] カテゴリに応じた分岐を確認できた

---

## セクション3: Geminiで台本生成

### Step 1: Geminiノードを追加

Category Cの出力から始めます。

1. Switchノードの **Category C** の **+** をクリック
2. 「Gemini」を検索

![Gemini検索](/n8n-setup/109-gemini-search.png)

3. **Message a model** を選択

![Gemini Actions](/n8n-setup/110-gemini-actions.png)

### Step 2: Geminiノードを設定

| 項目 | 値 |
|------|-----|
| Credential | Google Gemini(PaLM) Api account |
| Resource | Text |
| Operation | Message a Model |
| Model | models/gemini-2.5-flash |
| Simplify Output | ON |
| Output Content as JSON | ON |

![Gemini初期設定](/n8n-setup/111-gemini-initial.png)

### Step 3: プロンプトを設定

**Prompt** フィールドに以下を入力します（**fx** をクリックしてExpressionモードにしてから）。

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「裏技暴露型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 裏技暴露型の構成（secret_feature）
- Hook（0-5秒）: 「99%が知らない」「実は〇〇こう使うと化ける」形式で好奇心を刺激
- Problem（5-10秒）: 「普通に使ってるだけじゃもったいない」
- Solution（10-50秒）: 隠れた機能や意外な使い方を3ステップで紹介
- CTA（50-60秒）: 「忘れないように保存して試してみてください！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "secret_feature",
  "hook": "（0-5秒のセリフ）",
  "problem": "（5-10秒のセリフ）",
  "solution_steps": [
    "ステップ1の説明",
    "ステップ2の説明",
    "ステップ3の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

JSONのみ出力してください。
```

### Step 4: 実行して確認

**Execute step** をクリックして、Geminiが台本JSONを生成することを確認します。

![Gemini出力（Table）](/n8n-setup/112-gemini-output-table.png)

JSONタブで出力を確認できます。

![Gemini出力（JSON）](/n8n-setup/113-gemini-output-json.png)

### チェックポイント

- [ ] Geminiノードを追加できた
- [ ] プロンプトを設定できた
- [ ] 台本JSONが生成された

---

## セクション4: Codeノードでパース

Geminiの出力はテキスト形式のJSONなので、Codeノードでパースします。

### Step 1: Codeノードを追加

1. Geminiノードの右の **+** をクリック
2. 「Code」を検索

![Code選択](/n8n-setup/114-code-actions.png)

3. **Code in JavaScript** を選択

### Step 2: コードを入力

| 項目 | 値 |
|------|-----|
| Mode | Run Once for All Items |
| Language | JavaScript |

以下のコードを入力します。

```javascript
const text = $input.first().json.content.parts[0].text;
// ```json と ``` を除去（Geminiが付けることがある）
let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

// solution_stepsの閉じ括弧抜けを修復
cleanText = cleanText.replace(/",\s*\n\s*"cta"/g, '"],\n  "cta"');

const parsed = JSON.parse(cleanText);
return [{ json: parsed }];
```

### Step 3: 実行して確認

パースされたJSONがTableビューで確認できます。

![Code結果](/n8n-setup/115-code-result.png)

### チェックポイント

- [ ] Codeノードを追加できた
- [ ] コードを入力できた
- [ ] JSONがパースできた

---

## セクション5: postsシートへの保存とideas更新

### Step 1: Append row in sheetノードを追加

1. Code in JavaScriptノードの右の **+** をクリック
2. **Google Sheets** → **Append row in sheet** を選択

### Step 2: 設定

| 項目 | 値 |
|------|-----|
| Credential | Google Sheets account |
| Resource | Sheet Within Document |
| Operation | Append Row |
| Document | n8n-test |
| Sheet | posts |

**Columns to Send** で以下のフィールドを追加（**fx** をクリックしてExpressionモード）:

| 列名 | 値（Expression） |
|------|-----------------|
| post_id | `POST-{{ new Date().getTime() }}` |
| post_type | `{{ $json.post_type }}` |
| status | `DRAFT` |
| caption | `{{ $json.caption }}` |
| hashtags | `{{ $json.hashtags.join(',') }}` |
| content_json | `{{ JSON.stringify($json) }}` |
| created_at | `{{ new Date().toISOString() }}` |

![Append row設定](/n8n-setup/117-append-row-config.png)

### Step 3: 実行して確認

![Append row結果](/n8n-setup/118-append-row-result.png)

### Step 4: Update row in sheetノードを追加

ideasシートのstatusをADOPTEDに更新します。

1. Append row in sheetノードの右の **+** をクリック
2. **Google Sheets** → **Update row in sheet** を選択

### Step 5: 設定

| 項目 | 値 |
|------|-----|
| Credential | Google Sheets account |
| Resource | Sheet Within Document |
| Operation | Update Row |
| Document | n8n-test |
| Sheet | ideas |

**Column to Match On**:
| 項目 | 値 |
|------|-----|
| Column | idea_id |
| Value | `{{ $('Get row(s) in sheet').item.json.idea_id }}` |

**Values to Send**:
| 列名 | 値 |
|------|-----|
| status | ADOPTED |
| adopted_post_id | `{{ $('Append row in sheet').item.json.post_id }}` |

![Update row設定](/n8n-setup/119-update-row-config.png)

### Step 6: 実行して確認

![Update row結果](/n8n-setup/120-update-row-result.png)

ideasシートでstatusがADOPTEDに更新されていることを確認します。

![ideas更新確認](/n8n-setup/121-ideas-adopted.png)

postsシートにデータが追加されていることを確認します。

![postsシート確認](/n8n-setup/122-posts-sheet.png)

### チェックポイント

- [ ] Append row in sheetノードでpostsに保存できた
- [ ] Update row in sheetノードでideasを更新できた
- [ ] ideasのstatusがADOPTEDになった
- [ ] postsにcontent_jsonが保存された

---

## セクション6: 残り4カテゴリの追加

Category C以外の4カテゴリ（A/B/D/E）にもGeminiノードを追加します。

### 手順

各カテゴリで以下を行います：

1. Switchノードの該当カテゴリの **+** をクリック
2. **Google Gemini** → **Message a model** を選択
3. 設定はCategory Cと同じ（Model: gemini-2.5-flash、Simplify Output: ON、Output Content as JSON: ON）
4. プロンプトだけ変更
5. 出力を **Code in JavaScript** ノードに接続

### カテゴリ別プロンプト

#### Category A（比較・対決系）

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「VS対決型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## VS対決型の構成（versus）
- Hook（0-5秒）: 「〇〇 vs △△、どっちが優秀？」形式
- Problem（5-10秒）: 「似てるけど、実は決定的な違いがあります」
- Solution（10-50秒）: 画面分割で比較、3つの観点で勝敗を決める
- CTA（50-60秒）: 「あなたはどっち派？コメントで投票して！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "versus",
  "hook": "（0-5秒のセリフ）",
  "problem": "（5-10秒のセリフ）",
  "solution_steps": [
    "比較ポイント1の説明",
    "比較ポイント2の説明",
    "比較ポイント3の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

JSONのみ出力してください。
```

#### Category B（時短・効率化系）

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「即効ハック型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 即効ハック型の構成（instant_hack）
- Hook（0-3秒）: 「まだ手動で〇〇してるの？」「これ知らないと損」形式
- Problem（3-10秒）: 手作業の辛さ、非効率さを具体的に描写
- Solution（10-50秒）: ツールで解決する方法を3ステップで説明
- CTA（50-60秒）: 「ツールの詳細はプロフのリンクから！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "instant_hack",
  "hook": "（0-3秒のセリフ）",
  "problem": "（3-10秒のセリフ）",
  "solution_steps": [
    "ステップ1の説明",
    "ステップ2の説明",
    "ステップ3の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

JSONのみ出力してください。
```

#### Category D（警告系）

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「警告型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 警告型の構成（warning）
- Hook（0-3秒）: 「まだ〇〇してるの？」「このままだとヤバい」形式で危機感を煽る
- Problem（3-10秒）: そのまま放置するとどうなるか、リスクを具体的に描写
- Solution（10-50秒）: 今すぐやるべき対策を3ステップで説明
- CTA（50-60秒）: 「手遅れになる前に保存して実践して！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "warning",
  "hook": "（0-3秒のセリフ）",
  "problem": "（3-10秒のセリフ）",
  "solution_steps": [
    "対策ステップ1の説明",
    "対策ステップ2の説明",
    "対策ステップ3の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

JSONのみ出力してください。
```

#### Category E（ランキング系）

```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「ランキング型」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## ランキング型の構成（ranking）
- Hook（0-5秒）: 「2025年、知らないとヤバい〇〇 TOP3」形式
- Problem（5-10秒）: 「〇〇多すぎて何使えばいいかわからないですよね？」
- Solution（10-50秒）: 3位→2位→1位の順で紹介（各ツールのメリットを1文で）
- CTA（50-60秒）: 「あなたが使ってるのはどれ？コメントで教えて！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "ranking",
  "hook": "（0-5秒のセリフ）",
  "problem": "（5-10秒のセリフ）",
  "solution_steps": [
    "3位：〇〇の説明",
    "2位：△△の説明",
    "1位：××の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...5個"]
}

JSONのみ出力してください。
```

### 完成したワークフロー

5カテゴリすべてがCode in JavaScriptノードに接続されます。

![完成ワークフロー](/n8n-setup/123-workflow-complete.png)

### 動作確認

異なるカテゴリのideaで実行して、正しくルーティングされることを確認します。

![Category A実行結果](/n8n-setup/124-category-a-result.png)

### チェックポイント

- [ ] 5カテゴリすべてにGeminiノードを追加できた
- [ ] 各カテゴリで台本が生成される
- [ ] 全カテゴリがCode in JavaScriptに接続されている

---

## トラブルシューティング

### JSONパースエラー: Expected ',' or ']' after array element

**症状**: Code in JavaScriptで「Expected ',' or ']' after array element in JSON」エラー

**原因**: Geminiの出力でsolution_stepsの閉じ括弧 `]` が抜けている

**解決方法**:
Codeノードに修復ロジックを追加済み：
```javascript
cleanText = cleanText.replace(/",\s*\n\s*"cta"/g, '"],\n  "cta"');
```

### ノード参照エラー

**症状**: `$('Get row(s) in sheet')` でエラー

**解決方法**:
ノード名が正確かどうか確認してください。ノード名を変更した場合は参照も変更が必要です。

---

## まとめ

### このモジュールで学んだこと

- ideasシートからstatus=NEWのデータを取得する方法
- Switchノードでカテゴリ別に分岐する方法
- Geminiで台本パターンごとのプロンプトを設計する方法
- Codeノードでパースとエラー修復を行う方法
- postsシートへの保存とideasシートの更新

### 次のステップ

次のモジュールでは、生成されたcontent_jsonをCSV形式に変換し、Canvaでの一括作成フローを構築します。

---

## 参考資料

- [Switch node | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/)
- [Code node | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [Google Gemini node | n8n Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.googlegemini/)

---

## よくある質問

**Q: 1回の実行で複数のideaを処理できますか？**
A: 現在のワークフローは「Return only First Matching Row」で1件ずつ処理します。複数処理にはLoopノードの追加が必要です。

**Q: Geminiの出力が安定しません**
A: AIの出力には揺れがあります。Codeノードでエラー修復ロジックを入れることで対応しています。

**Q: ハッシュタグの数を変更できますか？**
A: プロンプト内の「...5個」を変更してください。現在のInstagramアルゴリズムでは3〜5個が推奨です。

**Q: post_idが大きな数字になります**
A: `new Date().getTime()` でミリ秒のタイムスタンプを使用しているため正常です。一意性が保証されます。

**Q: 台本のパターンを追加できますか？**
A: 新しいカテゴリをSwitchに追加し、対応するGeminiノードとプロンプトを作成すれば拡張可能です。
