# 月次AIトレンドリサーチ プロンプト

**目的**: Antigravityで実行し、スプレッドシートに直接貼り付けられる形式で出力させる

---

## 使い方

1. 以下のプロンプトをAntigravityにコピペ
2. `[ ]` の部分をその月に合わせて書き換え
3. 実行
4. 出力結果をスプレッドシートにコピペ

---

## プロンプト（ここからコピー）

```
目的: [ 202X年 X月 ] のAIトレンドをリサーチし、Instagram運用のための投稿戦略データを作成してください。

重要:
- 一般的な「時短ツール」だけでなく、「Antigravity」「n8n」のようなエンジニア界隈や先端層で話題の「次に来るトレンド」を必ず発掘してください
- 出力は全てスプレッドシートにコピペできるタブ区切り形式にしてください

出力言語: 全て日本語

---

## 手順1: 定量的なトレンド調査（ブラウザ使用必須）

### YouTube検索
以下のキーワードで検索し、再生数が急上昇している動画（特に直近1〜2週間）を特定:
- 「AI ツール 仕事」
- 「AI エージェント」
- 「AI 自動化」
- 「最新AIニュース」

### X (Twitter) 検索
site:x.com で以下のキーワードを組み合わせ、技術者層が盛り上がっている新ツールを探す:
- 「AI」+「開発」
- 「AI」+「エンジニア」
- 「AI」+「自動化」
- 「AI」+「神ツール」

### Instagram検索
リール動画で「AI」検索し、専門的な単語（n8n、ワークフロー等）を使っている投稿が伸びていないか確認

### 特定キーワード確認
先月から継続して注目すべきツールの最新動向をチェック:
- Antigravity
- Nanobanana
- n8n
- その他話題のツール

---

## 手順2: データ出力

### 出力1: トレンドサマリー（テキスト）

簡潔に以下をまとめる:
- YouTube: トップ動画の傾向、再生数ライン、注目キーワード
- X: バズっている話題、エンジニア界隈の動き
- Instagram: リール動画の傾向
- 注目トレンド: 新ツール、アップデート、事故・問題点

---

### 出力2: medium_categories（タブ区切り）

以下のヘッダーと形式で20件出力:

category_id	large_category_id	name	description	status	source

ルール:
- category_id: MEDIUM-001〜MEDIUM-020
- large_category_id: 全てLARGE-001（AI）
- name: ツール名またはノウハウ名
- description: 一言解説（30文字以内）
- status: 全てACTIVE
- source: 全てWORKFLOW

構成:
- 王道・必須ツール: 10件（ChatGPT, Claude, Gemini, Perplexity, Gamma, Canva, Midjourney, Notion AI, V0, Cursor等）
- 先端・急上昇: 10件（リサーチで発見した話題のツール）

例:
MEDIUM-001	LARGE-001	ChatGPT	執筆・コーディングの定番	ACTIVE	WORKFLOW
MEDIUM-011	LARGE-001	Antigravity	GoogleのAI IDE。エージェント型開発	ACTIVE	WORKFLOW

---

### 出力3: small_categories（タブ区切り）

以下のヘッダーと形式で50件出力:

category_id	medium_category_id	name	description	type	total_parts	current_part	has_digest	digest_posted	trend_score	status	source

ルール:
- category_id: SMALL-001〜SMALL-050
- medium_category_id: 対応するMEDIUM-XXX
- name: そのまま投稿タイトルとして使える具体的な企画案
- description: 内容種別（比較/使い方/設定/解説/警告/まとめ等）
- type: SINGLEまたはSERIES
- total_parts: SERIESの場合のみ数字（例: 5）、SINGLEは空欄
- current_part: 0
- has_digest: SERIESならTRUE、SINGLEならFALSE
- digest_posted: FALSE
- trend_score: 1-100の数値（トレンド度・需要予測）
- status: ACTIVE
- source: WORKFLOW

構成（各10件）:
A. 比較・対決系（どっちを使うべき？）
B. 時短・効率化系（楽をしたい心理）
C. 先端トレンド・自動化系（n8n等を活用）
D. ネガティブ・警告系（損失回避バイアス）
E. まとめ・ランキング系（保存数狙い）

タイトルのポイント:
- 「数字」「対立」「ネガティブ訴求」「時短」の要素を組み込む
- 「プログラミング不要で開発」「エンジニアの仕事が変わる」「完全自動化」等の先端フック
- 事故・脆弱性・炎上リスク等のネガティブ情報も含める

例:
SMALL-001	MEDIUM-011	【頂上決戦】Antigravity vs Cursor、選ぶべきは？	比較	SINGLE		0	FALSE	FALSE	85	ACTIVE	WORKFLOW
SMALL-031	MEDIUM-011	【閲覧注意】Antigravityでデータ消失事故多発	警告	SINGLE		0	FALSE	FALSE	95	ACTIVE	WORKFLOW

---

## 制約事項

1. 言語は日本語のみ
2. 「ChatGPTでメール作成」のようなありきたりなネタだけでなく、「一般層がまだ知らないが、見たら驚くような高度な活用」を掘り下げる
3. ブラウザを使って実際の検索結果を確認し、事実に基づいたデータを集める
4. タブ区切りデータは、スプレッドシートにそのままコピペできる形式で出力
5. ヘッダー行は1回だけ出力（データの上に）
```

---

## 出力例

### トレンドサマリー

```
## 2025年12月 トレンドサマリー

**YouTube**: AIエージェント・業務自動化の解説動画が増加。「AIで稼ぐ」「自動化」キーワードが強い。
**X**: 「AIエンジニアリング」「自動収益化」が話題。DataForge、Mabl等の開発効率化ツールに関心。
**Instagram**: n8nを活用した「完全自動化ワークフロー」系リールがエンジニア層で注目。
**注目トレンド**:
- Antigravity: Dドライブ削除事故、セキュリティ脆弱性が波紋
- Nanobanana Pro: Gemini 3 Pro搭載で画像生成能力向上、バイアス問題も
- n8n v2.0: AIノード70以上追加、AIファースト自動化ツールへ進化
```

### medium_categories

```
category_id	large_category_id	name	description	status	source
MEDIUM-001	LARGE-001	ChatGPT	執筆・コーディングの定番	ACTIVE	WORKFLOW
MEDIUM-002	LARGE-001	Claude 3.5 Sonnet	開発最強モデル	ACTIVE	WORKFLOW
...
```

### small_categories

```
category_id	medium_category_id	name	description	type	total_parts	current_part	has_digest	digest_posted	trend_score	status	source
SMALL-001	MEDIUM-011	【頂上決戦】Antigravity vs Cursor、選ぶべきは？	比較	SINGLE		0	FALSE	FALSE	85	ACTIVE	WORKFLOW
SMALL-002	MEDIUM-012	【画像生成】Midjourney vs Nanobanana Pro対決	比較	SINGLE		0	FALSE	FALSE	80	ACTIVE	WORKFLOW
...
```

---

## スプレッドシートへの貼り付け方

1. medium_categoriesシートのA1セルを選択
2. 出力されたmedium_categoriesデータをコピー
3. Ctrl+Shift+V（書式なし貼り付け）
4. small_categoriesも同様

※既存データがある場合は、2行目以降を選択してから貼り付け

---

**最終更新**: 2025-12-05
