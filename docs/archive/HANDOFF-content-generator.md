# HANDOFF: Content Generator ワークフロー

**最終更新**: 2025-12-06
**ステータス**: Category C のGemini連携まで完了、JSONパース成功

---

## 概要

ideasシートから投稿企画を取得し、カテゴリに応じたGeminiプロンプトで台本を生成するn8nワークフロー。

---

## 現在のワークフロー構成

```
[Manual Trigger: "When clicking 'Execute workflow'"]
    ↓
[Google Sheets: "Get row(s) in sheet"] ← ideas シート、status=NEW、1件取得
    ↓
[Switch: mode=Rules] ← categoryで5分岐（A/B/C/D/E）
    ↓
[Google Gemini: "Message a model"] ← Category C のみ接続済み
    ↓
[Code in JavaScript] ← JSONパース
    ↓
（未実装）[Google Sheets: postsに追加]
    ↓
（未実装）[Google Sheets: ideas更新] ← status=ADOPTED
```

**ワークフロー名**: `Create posts`

---

## 完了しているノード設定

### 1. Manual Trigger
- 設定なし（デフォルト）

### 2. Google Sheets: Get row(s) in sheet
| 項目 | 値 |
|------|-----|
| Credential | Google Sheets account |
| Resource | Sheet Within Document |
| Operation | Get Row(s) |
| Document | n8n-test |
| Sheet | ideas |
| Filters | Column: `status`, Value: `NEW` |
| Options | Return only First Matching Row: ON |

### 3. Switch
| 項目 | 値 |
|------|-----|
| Mode | Rules |
| Routing Rules | 5つ |

**ルール設定（すべて同じ形式）**:
- Value1: `{{ $json.category }}` （Expression）
- Operator: is equal to
- Value2: `A` / `B` / `C` / `D` / `E` （Fixed）
- Output Name: `Category A` / `Category B` / `Category C` / `Category D` / `Category E`

### 4. Google Gemini: Message a model（Category C用）
| 項目 | 値 |
|------|-----|
| Credential | Google Gemini(PaLM) Api account |
| Resource | Text |
| Operation | Message a Model |
| Model | models/gemini-2.5-flash |
| Simplify Output | ON |
| Output Content as JSON | ON |

**Prompt（Expression）**:
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
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...12個"]
}

JSONのみ出力してください。
※絵文字の使用は禁止です
```

### 5. Code in JavaScript
| 項目 | 値 |
|------|-----|
| Mode | Run Once for All Items |
| Language | JavaScript |

**コード**:
```javascript
const text = $input.first().json.content.parts[0].text;
// ```json と ``` を除去（Geminiが付けることがある）
const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
const parsed = JSON.parse(cleanText);
return [{ json: parsed }];
```

---

## 出力結果（JSONパース後）

```json
{
  "pattern": "secret_feature",
  "hook": "99%が知らない！Googleの新AI「Antigravity」が、実はプログラミング不要でアプリ開発できる裏技がヤバい！",
  "problem": "もしあなたがまだ手作業でコードを書いてるなら、ハッキリ言ってもったいないです。",
  "solution_steps": [
    "ステップ1：Antigravity AIの「プロンプト入力だけでアプリ骨格生成」の秘密。...",
    "ステップ2：Gemini連携で「UI/UXの最適化と機能追加」を自動化する裏ワザ。...",
    "ステップ3：本当にプログラミング不要？利用者の声と「デプロイまで自動化」の衝撃。..."
  ],
  "cta": "この最先端のAI、今のうちに使いこなしてライバルに差をつけましょう。忘れないように保存して、ぜひ試してみてください！",
  "caption": "【衝撃】Googleの新AI「Antigravity」がヤバすぎる！...",
  "hashtags": ["AntigravityAI", "GoogleAI", "アプリ開発", "ノーコード", "プログラミング不要", "Gemini", "裏技", "未来技術", "AIツール", "時短術", "ビジネス効率化", "最新情報"]
}
```

---

## 次にやるべきこと（優先順）

### 1. 残り4カテゴリのGeminiノードを追加

| カテゴリ | 台本パターン | プロンプトのポイント |
|---------|-------------|---------------------|
| A（比較） | versus | 「〇〇 vs △△」「どっちが優秀？」形式 |
| B（時短） | instant_hack | 「まだ〇〇してるの？」形式 |
| D（警告） | instant_hack（警告版） | 「このままだとヤバい」形式 |
| E（ランキング） | ranking | 「TOP3」「〜選」形式 |

### 2. Google Sheets: postsに追加するノード
- Operation: Append row in sheet
- Sheet: posts
- 列マッピング:
  - post_id: `POST-XXX`（自動生成）
  - post_type: `REEL`
  - status: `DRAFT`
  - caption: `{{ $json.caption }}`
  - hashtags: `{{ $json.hashtags.join(',') }}`
  - content_json: `{{ JSON.stringify($json) }}`
  - created_at: `{{ new Date().toISOString() }}`

### 3. Google Sheets: ideas更新するノード
- Operation: Update row in sheet
- Sheet: ideas
- Filters: idea_id = 元のidea_id
- 更新内容: status = `ADOPTED`

### 4. 5つのGeminiノードを1つのpostsシート追加ノードに統合
- Merge ノードを使用してCategory A〜Eの出力を統合

---

## カテゴリと台本パターンの対応（確定）

| カテゴリ | 内容 | 台本パターン | pattern値 |
|---------|------|-------------|-----------|
| A | 比較・対決系 | VS対決型 | versus |
| B | 時短・効率化系 | 即効ハック型 | instant_hack |
| C | 先端トレンド・自動化系 | 裏技暴露型 | secret_feature |
| D | ネガティブ・警告系 | 即効ハック型（警告版） | instant_hack |
| E | まとめ・ランキング系 | ランキング型 | ranking |

---

## 台本パターン5選（HANDOFFより転記）

### パターン1: 即効ハック型（instant_hack）
| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-3秒 | 「まだ手動で〇〇してるの？」「これ知らないと損」 |
| Problem | 3-10秒 | 手作業の辛さ、非効率さを描写 |
| Solution | 10-50秒 | ツールで解決する方法を3ステップで |
| CTA | 50-60秒 | 「プロフのリンクから！」 |

### パターン2: ビフォーアフター型（before_after）
| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | Before/Afterを並べて見せる |
| Problem | 5-10秒 | 「デザイナーに頼むと高い」 |
| Solution | 10-50秒 | ツールで変換する過程を早回し |
| CTA | 50-60秒 | 「作り方はコメント欄で！」 |

### パターン3: ランキング型（ranking）
| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「知らないとヤバいツール TOP3」 |
| Problem | 5-10秒 | 「多すぎて何使えばいいか」 |
| Solution | 10-50秒 | 3位→2位→1位 |
| CTA | 50-60秒 | 「どれ使ってる？コメントで！」 |

### パターン4: 裏技暴露型（secret_feature）
| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「99%が知らない」「こう使うと化ける」 |
| Problem | 5-10秒 | 「普通に使ってるだけじゃもったいない」 |
| Solution | 10-50秒 | 隠れ機能を3ステップで紹介 |
| CTA | 50-60秒 | 「保存して試してみて！」 |

### パターン5: VS対決型（versus）
| セクション | 秒数 | 内容 |
|-----------|------|------|
| Hook | 0-5秒 | 「〇〇 vs △△、どっち？」 |
| Problem | 5-10秒 | 「似てるけど決定的な違いが」 |
| Solution | 10-50秒 | 画面分割で同時比較 |
| CTA | 50-60秒 | 「どっち派？コメントで投票！」 |

---

## シート構造

### ideasシート
| 列名 | 説明 |
|------|------|
| idea_id | IDEA-001形式 |
| month | 2025-12 |
| title | 投稿タイトル |
| tools | 使用ツール（カンマ区切り） |
| content_type | 解説/比較/設定方法/使い方/警告/ランキング/まとめ |
| category | A/B/C/D/E |
| research_points | リサーチポイント（カンマ区切り） |
| status | NEW/ADOPTED/REJECTED |
| adopted_post_id | 採用されたpost_id |
| created_at | 作成日時 |

### postsシート
| 列名 | 説明 |
|------|------|
| post_id | POST-001形式 |
| post_type | IMAGE/CAROUSEL/REELS |
| status | DRAFT/READY/PROCESSING/PUBLISHED/FAILED |
| caption | キャプション本文 |
| hashtags | ハッシュタグ（カンマ区切り） |
| media_ids | 参照するメディアID |
| scheduled_at | 投稿予定日時 |
| published_at | 実際の投稿日時 |
| ig_post_id | Instagram投稿ID |
| share_to_feed | リールをフィードにも表示 |
| thumb_offset_ms | サムネイル位置 |
| error_message | エラーメッセージ |
| retry_count | リトライ回数 |
| created_at | 作成日時 |
| updated_at | 更新日時 |
| notes | メモ |
| **content_json** | **Gemini生成の台本JSON（新規追加済み）** |

---

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `/mnt/c/engineer-course/content/HANDOFF-n8n.md` | n8n講座全体のHANDOFF |
| `/mnt/c/engineer-course/content/modules/n8n/module-05-sheet-design.md` | posts/mediaシート設計 |
| `/mnt/c/engineer-course/content/modules/n8n/module-07-research-prompt.md` | Antigravityリサーチプロンプト |

---

## 全体フロー（最終形）

```
[Antigravity] 月次リサーチ
    ↓
[手動] スプレッドシートにコピペ（categories + ideas）
    ↓
[n8n] Content Generator ワークフロー ← 今ここを構築中
    ↓
[n8n] ideas → Gemini → posts（content_json）
    ↓
[n8n] content_json → CSV形式に変換 → Google Driveに保存
    ↓
[手動] Canvaで読み込み → 一括作成
    ↓
[手動] 画像をCloudinaryにアップロード → mediaシートに登録
    ↓
[n8n] postsシートからREADY取得 → Instagram投稿
```

---

## 注意事項

1. **Geminiの出力に絵文字が混入する問題**
   - プロンプトに「※絵文字の使用は禁止です」を追加済み
   - 完全には防げない場合がある

2. **Geminiの出力がJSON文字列として返る**
   - `Output Content as JSON: ON` でも `text` フィールドにJSON文字列が入る
   - Codeノードでパースが必要

3. **ideas_idの引き継ぎ**
   - Geminiノード通過後、元のidea_idが失われる
   - postsシート追加時とideas更新時に必要
   - Switchノードの前でidea_idを保持する工夫が必要

---

## 次回セッションへの指示

1. **このHANDOFFを最初に読む**
2. **n8nの「Create posts」ワークフローを開く**
3. **残り4カテゴリ（A/B/D/E）のGeminiノードを追加**
4. **postsシート追加ノードを作成**
5. **ideasシート更新ノードを作成**
6. **テスト実行して動作確認**

---

## 参考: Geminiプロンプトテンプレート

### Category A（比較・対決系）用
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
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...12個"]
}

JSONのみ出力してください。
※絵文字の使用は禁止です
```

### Category B（時短・効率化系）用
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
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...12個"]
}

JSONのみ出力してください。
※絵文字の使用は禁止です
```

### Category D（警告系）用
```
あなたはInstagramリール動画の台本ライターです。

以下の投稿企画を「即効ハック型（警告版）」の60秒リール台本に変換してください。

## 投稿企画
タイトル: {{ $json.title }}
ツール: {{ $json.tools }}
リサーチポイント: {{ $json.research_points }}

## 即効ハック型・警告版の構成（instant_hack）
- Hook（0-3秒）: 「まだ〇〇してるの？」「このままだとヤバい」形式で危機感を煽る
- Problem（3-10秒）: そのまま放置するとどうなるか、リスクを具体的に描写
- Solution（10-50秒）: 今すぐやるべき対策を3ステップで説明
- CTA（50-60秒）: 「手遅れになる前に保存して実践して！」

## 出力形式（JSON）
{
  "post_type": "REEL",
  "pattern": "instant_hack",
  "hook": "（0-3秒のセリフ）",
  "problem": "（3-10秒のセリフ）",
  "solution_steps": [
    "対策ステップ1の説明",
    "対策ステップ2の説明",
    "対策ステップ3の説明"
  ],
  "cta": "（50-60秒のセリフ）",
  "caption": "（Instagram投稿用キャプション 300文字程度）",
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...12個"]
}

JSONのみ出力してください。
※絵文字の使用は禁止です
```

### Category E（ランキング系）用
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
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "...12個"]
}

JSONのみ出力してください。
※絵文字の使用は禁止です
```

---

**以上がContent Generatorワークフローの現状と次回への引き継ぎ情報です。**
