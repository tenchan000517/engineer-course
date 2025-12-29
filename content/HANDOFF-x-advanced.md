# HANDOFF: X自動投稿 上級編

**このファイルを最初に読んでください。**

---

## 絶対ルール

### やってはいけないこと

1. **勝手な判断・解釈をしない** - 不明点は必ずユーザーに確認
2. **暴走しない** - 指示された範囲のみ作業
3. **余計な拡張をしない** - 「ついでに〜も」は禁止
4. **古い情報から憶測しない** - 必ず指定ファイルを読む
5. **「何から始めましょう？」と聞かない** - ロードマップに従う
6. **参照せずに作業開始しない** - 必読ファイルを先に読む
7. **投稿事例を省略しない** - 本HANDOFFに記載された事例は完全な形で扱う

### やるべきこと

1. **このHANDOFFを最初に読む**
2. **現在のフェーズを確認する**
3. **必読ファイルを全て読む**
4. **ロードマップに従って作業する**
5. **完了したらこのHANDOFFを更新する**

---

## プロジェクト概要

### 目的

X自動投稿の上級編を作成する。Instagramの運用フローを参考に、X向けの高品質スレッド投稿を自動化する。

### 全体フロー

```
┌─────────────────────────────────────────────────────────────┐
│  ①リサーチ                                                  │
│  ├── Antigravityワークフロー                                │
│  └── または Claude Codeで手動調査                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ②投稿作成                                                  │
│  ├── スプレッドシートに投稿データを保存                       │
│  └── GASで管理・振り分け                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ③画像生成（任意）                                           │
│  ├── 英語バナー                                             │
│  ├── フローチャート                                         │
│  └── ※日本語テキストは非推奨（精度低い）                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ④投稿                                                      │
│  ├── n8n → Python APIサーバー → X API                       │
│  └── スレッド投稿（Module 05で実装済み）                      │
└─────────────────────────────────────────────────────────────┘
```

### 重要な方針

| 項目 | 方針 |
|------|------|
| リサーチ | Antigravity or Claude Code（手動） |
| 投稿作成〜投稿 | n8n + スプレッドシート + GASで自動化 |
| 画像生成 | マストではない（テキストベースのXのため） |
| 画像を使う場合 | 英語のバナー・フローチャートなど |

---

## 現在の進捗

### フェーズ一覧

| # | フェーズ | 状態 | 備考 |
|---|----------|------|------|
| 1 | 設計・HANDOFF作成 | **完了** | 本ファイル |
| 2 | 投稿の型の定義 | **完了** | 下記に事例を完全記載 |
| 3 | 暫定講座作成 | **完了** | Module 01-05作成済み |
| 4 | 実証・検証 | **次のタスク** | ユーザーが実践して検証 |
| 5 | 講座完成 | 未着手 | スクショ追加、トラブルシューティング |
| 6 | リサーチワークフロー | **完了** | `x_research_workflow_v1.md`作成済み |
| 7 | 150投稿生成 | **完了** | `x_posts_month_202501.json`生成済み |

### 現在のフェーズ

```
██████████████████████████████████░░░░░░░░░░░░░ フェーズ7完了、フェーズ4（実証）へ
```

### 暫定講座モジュール一覧（n8n-x-advanced）

| Module | ファイル | 内容 |
|--------|----------|------|
| 01 | module-01-overview.md | 概要と投稿の型 |
| 02 | module-02-spreadsheet.md | スプレッドシート構築（12列: image_prompt対応） |
| 03 | module-03-gas-import.md | GAS実装（150投稿JSONインポート、image_prompt対応） |
| 04 | module-04-n8n-workflow.md | **n8nワークフロー（3パターン自動投稿）** ★更新済み |

※ 旧Module 04（投稿データ生成）はスキップ、Module 05を04にリネーム（`docs/archive/n8n-x-advanced/`にアーカイブ済み）

### X向けリサーチ講座（x-research）★再構築済み

| Module | ファイル | 内容 |
|--------|----------|------|
| 01 | module-01-overview.md | 概要と全体フロー |
| 02 | module-02-antigravity-workflow.md | Antigravityワークフロー（@呼び出し） |
| 03 | module-03-claude-code-generation.md | Claude Codeで150投稿生成（ガイド統合済み） |

---

## ★投稿の型（完全版事例）★

### 概要

Xのスレッド投稿は以下の構造を持つ：

```
【1ツイート目】フック
  ↓
【2〜5ツイート目】本文（解説）
  ↓
【最終ツイート】まとめ + CTA
```

### 型の詳細

| 要素 | 説明 | 文字数目安 |
|------|------|-----------|
| フック（1ツイート目） | 全文がタイムラインに表示（Show more非発生） | 280文字以内 |
| 本文（2〜5ツイート目） | 詳細解説、番号付き（1/5形式） | 制限なし |
| まとめ（最終ツイート） | 箇条書き要約 + CTA（フォロー誘導） | 制限なし |

### フック（1ツイート目）の構造

```
何が起こったか → 自分の業務がどう変わるか → スレッドで何を解説しているか
```

**例**:
> 「Gemに革命が起こりました。」→「毎回プロンプトや連携するNotebookLMを指示する作業がこの世から消える」→「一度作れば一生使える最強の活用法3選をプロンプト付きで解説します👇」

---

## ★完全事例（一切省略なし）★

### 【1ツイート目】フック

```
Gemに革命が起こりました。GeminiのカスタムAI機能「Gem」の知識に、ついにNotebookLMが追加できるようになりました。これ、「毎回プロンプトや連携するNotebookLMを指示する」という作業がこの世から消える神アップデートです。一度作れば一生使える最強の活用法3選をプロンプト付きで解説します👇
```

**設計ポイント**:
- この文字数でShow moreを発生させずに全文タイムラインに出るようにしている
- 何が起こったか → 具体的に自分（視聴者）の今の業務や作業がどのように変わるのか → スレッドで何を開設しているかの説明導線

---

### 【2ツイート目】なぜNotebookLMなのか（1/5）

```
【なぜ、直接アップロードではなく「NotebookLM」なのか？】(1/5)

Gemを作る際、PDFなどを直接アップロードすることも可能ですが、「NotebookLM経由」にするのがおすすめです。

【理由1：圧倒的な「容量」と「管理」の差】
Gemへの直接アップロードはファイル数に制限がありますが、NotebookLMなら「最大50ソース × 1ソースあたり50万文字」という膨大な知識を格納可能です。
しかも、NotebookLM側で資料を差し替えれば、Gem側の知識も自動的に同期されます。
Gemの設定画面をいちいち開いてファイルを入れ替える手間がゼロになります。

【理由2：ハルシネーション（嘘）の抑制】
NotebookLMを経由することで、Gemの回答に対し「どの資料のどこに基づいているか」という引用元リンクを表示させることができます。
NotebookLMを噛ませることで、Geminiの創造性を保ちつつ、「事実に基づく回答」を担保できるようになります。

【理由3：情報の「一元化」】
プロジェクトごとの資料、マニュアル、議事録...これらをNotebookLMという「母艦」に整理しておけば、Gem（アプリ）から複数のノートブックを参照させることも可能です。
知識のサイロ化を防ぎ、「最強のデータベース」として機能します。

次に、GeminiとGemでNotebookLMを呼び出す違いについてです👇
```

**設計ポイント**:
- 3つの理由で説明している
- 【　】見出し形式で見やすい
- 「次に〜👇」で次ツイートへ誘導

---

### 【3ツイート目】なぜGemなのか（2/5）

```
【なぜ、Geminiではなく「Gem」なのか？】(2/5)

「普通のGeminiチャットでNotebookLMを呼び出せばよくない？」
この疑問を持つ方も多いですが、Gemを使うべき理由は「再現性」と「時短」の次元が違うからです。

【Gemini（チャット）は「毎回レシピを読む」】
通常のチャットは、新しいスレッドを立てるたびに「あなたは〇〇です。この資料の△△を参考にして、××の形式で出力して」と、毎回指示（プロンプト）を入力する必要があります。
少しでも指示がブレると、出力結果も変わってしまい、品質が安定しません。
これは「毎回シェフにレシピを読み聞かせている」のと同じです。

【Gem（カスタムAI）は「専属シェフを雇う」】
Gemは、複雑な命令文（システムプロンプト）を事前に「脳内」に固定できます。
あなたは座って「いつもの」と言うだけ。Gemは「あなたの好み」「禁止事項」「出力形式」「参照すべき資料の優先順位」を全て理解した上で、毎回100点満点の回答を即座に返します。

プロンプトをコピペして微調整する時間すら惜しい定型業務は、Gemで「アプリ化」するのが正解です。
ここからは、明日から即戦力になる「アプリ化」レシピ3選です👇
```

**設計ポイント**:
- 「毎回レシピを読む」vs「専属シェフを雇う」の比喩で分かりやすく
- 問題提起 → 解決策の流れ

---

### 【4ツイート目】活用法1（3/5）

```
活用法❶ 自分を完コピする「SNS専属ライターGem」 (3/5)

過去の自分の投稿を学習させ、テーマを投げるだけで「自分の文体」で投稿を作るアプリです。

【NotebookLMにストックする情報】
・過去にバズった自分のXポスト（50〜100件）
・noteやブログの記事全文（長文の思考回路を学習させるため）
・自分の「NGワード」や「大切にしている価値観」リスト

【Gemに登録するプロンプト】
ーーーーーーーーーー
あなたはプロのSNSライターです。以下の制約を守り、Knowledge（NotebookLM）にある過去の投稿スタイルを模倣してポストを作成してください。
# 制約条件
- **文体模倣**: Knowledgeにある著者の「断定的な口調」「改行のリズム」「絵文字の使い方」を完全に再現すること。
- **構成**: 「フック（問題提起）」→「インサイト（気付き）」→「アクション（解決策）」の順で構成すること。
- **禁止事項**: 「思います」「考えます」という自信のない表現は削除し、言い切ること。

# 出力プロセス
入力されたテーマに対し、Knowledgeにある過去の主張と矛盾しない視点で、140文字以内のポスト案を3パターン作成してください。
ーーーーーーーーーー

次は、報告書レビューアプリです👇
```

**設計ポイント**:
- 需要の高い実際のプロンプトを記述している
- 【NotebookLMにストックする情報】【Gemに登録するプロンプト】の2部構成

---

### 【5ツイート目】活用法2（4/5）

```
活用法❷ 上司を一発で黙らせる「報告書レビュアーGem」 (4/5)

書き上げた報告書の下書きを貼り付けるだけで、上司の視点と過去のルールに基づいて採点・修正してくれるアプリです。

【NotebookLMにストックする情報】
・過去に上司から「よく書けている」と褒められた報告書
・「わかりやすいビジネス文書の書き方」などがまとまったWeb記事のURL
・【重要】過去に上司から受けた「修正指示（赤入れ）のコメント集」 （例：「結論が遅い」「数字で語れ」「主語が抜けている」などのログ）

【Gemに登録するプロンプト】
ーーーーーーーーーー
あなたは、論理的で細部に厳しい「鬼上司」です。ユーザーが入力した報告書ドラフトを、Knowledge（NotebookLM）にある「過去の優良事例」および「過去の修正指摘事項」と照らし合わせ、厳しくレビューしてください。

# アクション
1. **採点**: 100点満点で採点（減点方式）。
2. **鬼チェック**: Knowledge内の「過去の修正指示」にあるミス（結論後回し、数字不足など）を犯していないか確認し、厳しく指摘すること。
3. **リライト案**: 指摘を踏まえ、上司が納得せざるを得ない「完璧な報告書」に書き直して提示すること。

# マインドセット
曖昧な表現は一切許さない。読み手の時間を奪わない、簡潔かつファクトベースの文章にすること。
ーーーーーーーーーー

最後は、総務・人事への問い合わせをゼロにするアプリです👇
```

---

### 【6ツイート目】活用法3（5/5）

```
活用法❸ 新人を即戦力にする「社内規定コンシェルジュGem」 (5/5)

総務や人事に最適。「これ経費になりますか？」「忌引は何日？」に即答するアプリです。

【NotebookLMにストックする情報】
・就業規則、経費精算規定、旅費規程（常に最新版PDF）
・社内システムの操作マニュアル
・過去に総務に来た「Q&Aリスト」

【Gemに登録するプロンプト】
ーーーーーーーーーー
あなたは弊社の優秀な総務担当AIです。社員からの質問に対し、Knowledge（NotebookLM）にある規定のみに基づいて回答してください。

# 行動指針
- **根拠の絶対提示**: 必ず「就業規則 第〇条に基づき」や「経費精算マニュアル P.12によると」と、情報の出所を明記すること。
- **推測の禁止**: Knowledgeに記載がない場合は、適当に答えず「規定に記載がないため、人事部（内線1234）へ直接お問い合わせください」と回答すること。
- **トーン**: 丁寧で、事務的になりすぎず、社員に寄り添った親切な口調。

# 出力プロセス
まず結論（Yes/No/条件付き）を述べ、その後に具体的な申請手順や注意点を箇条書きで案内してください。
ーーーーーーーーーー

最後にまとめです👇
```

---

### 【7ツイート目】まとめ

```
【まとめ】Gem × NotebookLMで「自分専用AIアプリ」を作る

【なぜNotebookLMを経由するのか？ 】
・容量無制限級のデータベース
・エビデンス（引用）による信頼性担保
資料の更新・管理が圧倒的に楽

【なぜGemを使うのか？】
・プロンプト入力の手間をゼロにする「アプリ化」
・毎回同じ品質を出す「再現性」

【活用レシピ3選】
❶ SNSライター：自分の文体と思考を完コピ
❷ 報告書レビュアー：過去の赤入れを学習した鬼添削
❸ 規定コンシェルジュ：マニュアルに基づく正確な案内

NotebookLMで「脳みそ（知識）」を整理し、Gemで「役割（プロンプト）」を固定する。 この組み合わせで多くの業務を改善させることが可能です。

毎回プロンプトをコピペしている人は、今すぐGemを作ってください！

僕のアカウントでは、AIで業務効率化や時短を加速させるノウハウを毎日発信しています。
NotebookLMの活用法について、誰よりも詳しく発信しているので、NotebookLMを使いこなしたい方は、ぜひフォローをお願いします！
@ai_jitan
```

**設計ポイント**:
- 活用法3選に対して正しく連動している
- しっかりとまとめでわかりやすく解説している
- CTA（フォロー誘導）を含む

---

## 投稿の型テンプレート

### スレッド構造

| # | 役割 | 内容 |
|---|------|------|
| 1 | フック | 何が起こった→どう変わる→スレッド内容予告 |
| 2 | 理由1 | 【見出し】形式、3つの理由を解説 |
| 3 | 理由2 | 比喩を使った分かりやすい説明 |
| 4-6 | 活用法 | 実際のプロンプト付きで解説 |
| 最終 | まとめ | 箇条書き要約 + CTA |

### 各ツイートの共通パターン

```markdown
【見出し】（番号/総数）

導入文

【サブ見出し1】
・ポイント1
・ポイント2
・ポイント3

【サブ見出し2】
解説文...

次に〜👇
```

---

## 画像生成の使いどころ

### 推奨するケース

| ケース | 例 |
|--------|-----|
| 英語バナー | "AI Workflow Automation 2025" |
| フローチャート | ワークフロー図（英語ラベル） |
| 比較表 | ツール比較（英語） |
| アイコン・イラスト | 抽象的なコンセプト図 |

### 推奨しないケース

| ケース | 理由 |
|--------|------|
| 日本語テキストを含む画像 | Nanobananaは日本語テキスト生成が不安定 |
| 複雑な情報図 | 精度が下がる |
| スクリーンショット的な画像 | 実際のスクショの方が信頼性高い |

---

## 技術スタック

### 既存講座からの流用

| 要素 | 参照元 | 用途 |
|------|--------|------|
| スプレッドシート設計 | n8n基礎講座 Module 05 | 投稿データ管理 |
| GASインポート | n8n-advanced Module 03 | JSONからシートへ |
| GAS振り分け | n8n-advanced Module 07 | カテゴリ別振り分け |
| Python APIサーバー | X自動投稿 Module 03-05 | X APIコール |
| スレッド投稿 | X自動投稿 Module 05 | `/thread`エンドポイント |
| 画像付き投稿 | X自動投稿 Module 06 | `/generate-and-post` |
| リサーチワークフロー | Instagram workflow v9 | Antigravityプロンプト |

### X上級編で新規作成

| 要素 | 内容 |
|------|------|
| X用スプレッドシート構造 | ideas, posts, thread_draft |
| X用GASコード | スレッド投稿データの生成 |
| X用リサーチプロンプト | Antigravity向けX版 |
| n8nワークフロー | シートからスレッド投稿 |

---

## スプレッドシート設計（確定版）

### シート構成

| シート名 | 用途 |
|---------|------|
| config | JSON一時保存 |
| ideas | 投稿アイデア管理 |
| posts | 投稿管理（status管理、12列） |
| thread_draft | スレッド下書き（7ツイート分） |

### ideas シート列

| # | 列名 | 説明 |
|---|------|------|
| 1 | idea_id | IDEA-001形式 |
| 2 | month | 年月 |
| 3 | title | 投稿タイトル（フック要約） |
| 4 | topic | 主要トピック |
| 5 | category | A/B/C/D/E |
| 6 | status | NEW/ADOPTED/POSTED |
| 7 | created_at | 作成日 |

### posts シート列（12列）

| # | 列名 | 説明 |
|---|------|------|
| 1 | post_id | 20250101-001形式 |
| 2 | pattern | announcement/image/thread |
| 3 | tool_name | ツール名 |
| 4 | angle | 切り口 |
| 5 | scheduled_date | 投稿予定日 |
| 6 | content | 投稿本文 |
| 7 | **image_prompt** | **画像生成プロンプト（英語）** |
| 8 | reply_content | リプライ内容 |
| 9 | status | DRAFT/READY/POSTED |
| 10 | tweet_count | スレッドのツイート数 |
| 11 | posted_at | 投稿日時 |
| 12 | tweet_url | 投稿後のURL |

### thread_draft シート列

| # | 列名 | 説明 |
|---|------|------|
| 1 | post_id | 対象投稿ID |
| 2 | tweet_1 | 1ツイート目（フック） |
| 3 | tweet_2 | 2ツイート目 |
| 4 | tweet_3 | 3ツイート目 |
| 5 | tweet_4 | 4ツイート目 |
| 6 | tweet_5 | 5ツイート目 |
| 7 | tweet_6 | 6ツイート目 |
| 8 | tweet_7 | 7ツイート目（まとめ） |

---

## リサーチワークフロー設計（確定版）

**詳細**: `content/modules/x-research/x_research_workflow_v1.md`
**HANDOFF**: `content/HANDOFF-post-research.md`

### Instagram版との比較

| 項目 | Instagram版 | X版 |
|------|-------------|-----|
| 対象 | YouTube（5人） | YouTube（5人）※同じ |
| 収集物 | 動画タイトル100本 | 動画タイトル100本 + 切り口 |
| 分析 | ツール名抽出 | ツール名 + 切り口 + 根拠取得 |
| 出力 | 32件のInstagram投稿 | スレッド/画像付き/公式発表の3パターン |

### 投稿パターン（3種類）

| パターン | 頻度 | 内容 |
|----------|------|------|
| **スレッド投稿** | 1日1回 | Gem×NotebookLM型（慎重に作成） |
| **画像付き投稿** | 複数回/日 | Nanobanana Proで図解生成（英語のみ） |
| **公式発表・アップデート** | 適宜 | 権威性のある情報をシェア |

### 重要な方針

| 原則 | 内容 |
|------|------|
| 信頼度最重要 | 不確実な情報は絶対NG |
| 根拠必須 | 全情報に公式ソース |
| 1ツイート目リンクなし | Xアルゴリズム対策 |
| 画像は英語のみ | 日本語混入NG |
| 鮮度チェック | インフルエンサーの情報を「架空」と判断しない |

---

## 本番運用フロー

**詳細**: `content/modules/x-research/x_production_guide.md`

### 役割分担

| Phase | 担当 | 内容 |
|-------|------|------|
| 1 | Antigravity | トピック収集 → トレンドランキング → 叩き台生成 |
| 2 | Claude Code | 追加調査 → 150投稿/月を生成 |
| 3 | n8n + GAS | スプレッドシート → 自動投稿 |

### 150投稿の内訳

| パターン | 件数/月 | 件数/日 |
|----------|---------|---------|
| スレッド投稿 | 30件 | 1件 |
| 画像付き投稿 | 60件 | 2件 |
| 公式発表・アップデート | 60件 | 2件 |
| **合計** | **150件** | **5件** |

### X API制限（無料枠）

| 項目 | 無料枠 | 目標 | 判定 |
|------|--------|------|------|
| 投稿/24時間 | 17件 | 5件 | ✅ OK |
| 投稿/月 | 500件 | 150件 | ✅ OK |

---

## ロードマップ

### Phase 1: 設計・準備 ✅完了

- [x] HANDOFF作成
- [x] 投稿の型を定義
- [x] スプレッドシート構造を確定
- [x] GAS要件を定義

### Phase 2: 暫定講座作成 ✅完了

- [x] Module 01: 概要と投稿の型
- [x] Module 02: スプレッドシート構築
- [x] Module 03: GAS実装（アイデアインポート）
- [x] Module 04: GAS実装（投稿データ生成）
- [x] Module 05: n8nワークフロー（スレッド自動投稿）

### Phase 3: 実証・検証 ⬅️ 次のタスク

- [ ] ユーザーが暫定講座に沿って実践
- [ ] 各ステップでスクリーンショット撮影
- [ ] 問題点・改善点の記録
- [ ] トラブルシューティングの追加

### Phase 4: 講座完成

- [ ] スクリーンショットを講座に追加
- [ ] トラブルシューティングを実際の問題で更新
- [ ] ワークフローJSONダウンロードを追加

### Phase 5: リサーチワークフロー ✅完了

**詳細は別HANDOFF参照**: `content/HANDOFF-post-research.md`

- [x] X版ワークフロー作成（x_research_workflow_v1.md）
- [x] 投稿パターン3種類確定
- [x] 鮮度チェック基準確定
- [x] Xアルゴリズム対応
- [ ] Antigravityでテスト実行（Phase 4と並行）
- [ ] 結果をスプレッドシートにインポート

### Phase 6: 150投稿生成 ✅完了

- [x] 公式発表投稿 60件生成（X-POST-001〜060）
- [x] 画像付き投稿 60件生成（X-POST-061〜120）
- [x] スレッド投稿 30件生成（X-POST-121〜150）
- [x] 品質チェック（CRITICALルール）通過
- [x] 統合JSON出力（x_posts_month_202501.json）
- [ ] スプレッドシートへのインポート（Phase 4で実施）

---

## 必読ファイル

| # | ファイル | 理由 |
|---|----------|------|
| 1 | 本HANDOFF | 現在地の確認 |
| 2 | `content/modules/x-research/module-02-antigravity-workflow.md` | **Antigravityワークフロー（講座に統合済み）** |
| 3 | `content/modules/x-research/module-03-claude-code-generation.md` | **150投稿生成ガイド（講座に統合済み）** |
| 4 | `content/modules/n8n-x-advanced/module-03-gas-import.md` | **GASインポート（150投稿JSON対応）** |
| 5 | `content/HANDOFF-post-research.md` | リサーチ講座の進捗管理 |
| 6 | `content/HANDOFF-nanobanana-x-master.md` | 初級編〜Module 06の状況 |
| 7 | `content/modules/n8n-x-auto-post/module-05-thread-posting.md` | スレッド投稿の実装 |
| 8 | `content/CONTENT-GUIDE.md` | 講座フォーマット仕様 |

### アーカイブ（参考用）

| ファイル | 内容 |
|----------|------|
| `docs/archive/x-research/x_research_workflow_v1.md` | 旧Antigravityワークフロー |
| `docs/archive/x-research/x_production_guide.md` | 旧Claude Codeガイド |
| `docs/archive/x-research/thread-sample-*.md` | スレッドサンプル（10個） |

---

## 関連ファイル一覧

### 既存モジュール

```
content/modules/n8n-x-auto-post/
├── module-01-overview.md
├── module-02-developer-setup.md
├── module-03-python-api-server.md
├── module-04-n8n-workflow.md
├── module-05-thread-posting.md       ← スレッド投稿
└── module-06-image-posting.md        ← 画像付き投稿

scripts/
├── x_api_server.py
├── x_api_server_v2.py               ← スレッド対応
└── x_api_server_v3.py               ← 画像付き対応
```

### 参考になるInstagram advanced

```
content/modules/n8n-advanced/
├── module-03-content-ideas-import.md   ← GASインポート
├── module-06-ideas-generation-workflow.md ← Antigravityワークフロー
├── module-07-workflow-optimization.md
└── module-09-operation-flow.md         ← 運用フロー

docs/archive/n8n-production/稼働中/
├── workflows/instagram_workflow_v9.md  ← リサーチワークフロー
└── guidelines/
    ├── step2_normalization.md
    └── step3_brushup.md
```

---

## 共有済みスクリーンショット

### Module 02: スプレッドシート構築

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `/n8n-x-advanced/images/gas-menu-open.png` | 拡張機能→Apps Scriptメニュー | Step 1 | 可 |
| `/n8n-x-advanced/images/gas-code-editor.png` | GASエディタでコード貼り付け | Step 3 | 可 |
| `/n8n-x-advanced/images/custom-menu-display.png` | 「X投稿管理」メニュー表示 | Step 4 | 可 |
| `/n8n-x-advanced/images/auth-required.png` | 「認証が必要です」ダイアログ | Step 5 | 可 |
| `/n8n-x-advanced/images/account-select.png` | アカウント選択画面 | Step 5 | 可 |
| `/n8n-x-advanced/images/app-not-verified.png` | 「Googleで確認されていません」警告 | Step 5 | 可 |
| `/n8n-x-advanced/images/app-not-verified-detail.png` | 詳細クリック後の警告 | Step 5 | 可 |
| `/n8n-x-advanced/images/grant-access.png` | アクセス権付与確認 | Step 5 | 可 |
| `/n8n-x-advanced/images/setup-confirm.png` | 初期セットアップ確認ダイアログ | Step 5 | 可 |
| `/n8n-x-advanced/images/setup-complete.png` | セットアップ完了後のシート | Step 5 | 可 |

### Module 03: GAS実装（アイデアインポート）

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `/n8n-x-advanced/images/config-json-import-menu.png` | configシートにJSON貼り付け + インポートメニュー | Step 3 | 可 |
| `/n8n-x-advanced/images/posts-imported.png` | postsシート（11列）インポート結果 | Step 4 | 可 |
| `/n8n-x-advanced/images/thread-draft-imported.png` | thread_draftシートインポート結果 | Step 4 | 可 |

---

## 更新履歴

| 日付 | 更新内容 | 担当 |
|------|----------|------|
| 2025-12-28 | 初版作成、投稿の型を完全記載 | AI Assistant |
| 2025-12-28 | 暫定講座 Module 01-05 作成完了 | AI Assistant |
| 2025-12-29 | Module 02 スクリーンショット追加（10枚） | User + AI |
| 2025-12-29 | 講座サンプルからオリジナル事例の改変版を削除 | AI Assistant |
| 2025-12-29 | リサーチ講座HANDOFF作成、参照追加 | AI Assistant |
| 2025-12-29 | X版リサーチワークフロー v1 作成 | User + AI |
| 2025-12-29 | 投稿パターン3種類・鮮度チェック基準確定 | User |
| 2025-12-29 | Xアルゴリズム対応追加 | User |
| 2025-12-29 | x_production_guide.md作成（Claude Code用） | AI Assistant |
| 2025-12-29 | 本番運用フロー追加（150投稿/月） | User + AI |
| 2025-12-29 | 150投稿生成完了（x_posts_month_202501.json） | AI Assistant |
| 2025-12-29 | x-research講座を3モジュールに再構築（ガイド統合） | AI Assistant |
| 2025-12-29 | Module 03を150投稿JSON形式に対応（整合性修正） | AI Assistant |
| 2025-12-29 | 旧ガイド・サンプルをアーカイブに移動 | AI Assistant |
| 2025-12-29 | 150投稿を5分割＋ID/順序変更（transform_posts.py） | AI Assistant |
| 2025-12-29 | Module 02: postsシートを11列構造に更新 | AI Assistant |
| 2025-12-29 | Module 03: インポートスクリーンショット追加（3枚） | User + AI |
| 2025-12-29 | Module 04をアーカイブに移動（不要のため） | AI Assistant |
| 2025-12-29 | 次世代セッション引き継ぎ更新（画像生成タスク追加） | AI Assistant |
| 2025-12-29 | **Module 02: postsシートを12列に更新（image_prompt追加）** | AI Assistant |
| 2025-12-29 | **Module 03: GASインポートでimage_prompt保存対応** | AI Assistant |
| 2025-12-29 | **Module 05: 3パターン自動投稿ワークフロー実装** | AI Assistant |
| 2025-12-29 | **n8nワークフローJSON作成**（docs/archive/に保存） | AI Assistant |
| 2025-12-29 | 次のタスク更新: ワークフロー検証へ | AI Assistant |
| 2025-12-29 | **URL修正完了**: Batch 1-6全45件調査、41件修正 | AI Assistant |
| 2025-12-29 | `apply_url_corrections.py` で一括修正実行 | AI Assistant |
| 2025-12-29 | `docs/url_corrections.json` をリポジトリにコミット | AI Assistant |
| 2025-12-29 | リサーチワークフローURL検証セクション追加 | AI Assistant |

---

**最終更新**: 2025-12-29

---

## 次世代セッションへの引き継ぎ

### 完了済みタスク（2025-12-29）

| タスク | 状態 |
|--------|------|
| 150投稿生成 | ✅ 完了 |
| 5分割＋ID/順序変更 | ✅ 完了 |
| スプレッドシートインポート | ✅ 完了（150件） |
| Module 02更新（postsシート11列化） | ✅ 完了 |
| Module 03スクリーンショット追加 | ✅ 完了 |
| Module 04アーカイブ移動 | ✅ 完了 |

### 生成済みファイル（5分割版）

```
C:\Instagram_AI\X_Research\20251229_01\split\
├── x_posts_part1.json  （30件、1/1〜1/6）
├── x_posts_part2.json  （30件、1/7〜1/12）
├── x_posts_part3.json  （30件、1/13〜1/18）
├── x_posts_part4.json  （30件、1/19〜1/24）
└── x_posts_part5.json  （30件、1/25〜1/30）
```

### 新しいID形式・投稿順序

```
20250101-001: announcement（公開情報）
20250101-002: image（画像付き）
20250101-003: announcement（公開情報）
20250101-004: image（画像付き）
20250101-005: thread（スレッド）
↓ 繰り返し ↓
```

### スプレッドシート

- **postsシート**: 12列構造に更新済み（image_prompt列追加）
- **thread_draftシート**: スレッド30件インポート済み
- **GASコード**: 最新版（setupPostsSheet 12列対応、image_prompt保存対応）

### n8nワークフロー

- **3パターン自動投稿**: Switch分岐による実装完了
  - announcement → `/post`
  - image → `/generate-and-post`
  - thread → `/thread`

---

## ★画像生成フローの組み込み: 完了★

### 実装内容（2025-12-29）

3パターン（announcement/image/thread）の自動投稿フローを完成。

### 現状

| パターン | 投稿可能 | 画像生成 |
|----------|---------|---------|
| announcement | ✅ | 不要 |
| thread | ✅ | 不要 |
| **image** | ✅ | **実装済み** |

### 更新したファイル

| ファイル | 更新内容 |
|----------|----------|
| module-02-spreadsheet.md | postsシート12列化（image_prompt列追加） |
| module-03-gas-import.md | GASインポートでimage_prompt保存 |
| module-04-n8n-workflow.md | 3パターン自動投稿ワークフロー |

### ワークフロー全体像

```
[Schedule Trigger]
       ↓
[Google Sheets: Get posts (READY)]
       ↓
[Switch: pattern]
       ├─ announcement → [HTTP Request: /post]
       ├─ image ────────→ [HTTP Request: /generate-and-post]
       └─ thread ───────→ [Get thread_draft] → [Merge] → [HTTP Request: /thread]
                                                          ↓
                                          [Update Status: posts]
```

---

## ★次のタスク: n8nワークフロー検証★

### 完了済み

- [x] GASセットアップ（12列版）
- [x] 150投稿JSONインポート
- [x] n8nワークフローJSON作成

### ワークフローファイル

```
docs/archive/n8n-x-advanced/x-auto-post-advanced-production.json
```

### スプレッドシート情報

| 項目 | 値 |
|------|-----|
| Document ID | `1ZAxg-H-SH0eQs3iOi_-lA3MupdC-e6yoyW_k6IL1Kbo` |
| posts gid | `1626660346` |
| thread_draft gid | `1681576108` |
| Credential | `Google Sheets account` (id: 3KFmyH23tY8tVoe2) |

### やるべきこと

1. **ワークフローをn8nにインポート**
   - 上記JSONファイルをインポート
   - 接続が正しいか確認（特にMergeノード）

2. **Python APIサーバー起動**
   ```powershell
   python C:\engineer-course\scripts\x_api_server_v3.py
   ```

3. **各パターンのテスト投稿**
   - [ ] announcement: postsシートの1件をREADYにしてテスト
   - [ ] image: image_prompt列にプロンプトがある投稿でテスト
   - [ ] thread: thread_draftにデータがある投稿でテスト

4. **問題があれば修正**
   - ワークフローの接続
   - Expressionの記述
   - ステータス更新のマッピング

### 検証ポイント

| 項目 | 確認内容 |
|------|----------|
| Switch分岐 | patternで正しく分岐するか |
| 画像生成 | タイムアウト60秒で成功するか |
| Merge | post_idで正しく結合するか |
| スレッド投稿 | tweets配列が正しく生成されるか |
| ステータス更新 | POSTED、posted_at、tweet_urlが更新されるか |

---

## 注意事項

### サンプル例について

本HANDOFFに記載された「★完全事例（一切省略なし）★」は、ユーザーが作成したオリジナルのフック・スレッド構成です。

**禁止事項**:
- 講座のサンプルとして改変・要約して使用しない
- オリジナルの品質を損なう形で引用しない

**講座サンプル**:
- 「サンプルアイデア1」「（フック文）」等の汎用的な表現を使用
- 具体例が必要な場合は、ユーザーに確認してから作成

---

## ★緊急タスク: Announcement投稿のURL修正★

### 背景・経緯

1. **問題発見**: Announcementの`reply_content`に含まれるURLが「汎用トップページ」になっているものが多数あった
2. **ルール違反**: URLルール（`content/modules/x-research/module-03-claude-code-generation.md` セクション3）に違反
3. **原因**: 150投稿生成時に具体的な公式発表記事ではなくトップページURLを使用してしまった

### URLルール（原文）

```
## URLルール

**URLは必須ではない。価値があるものだけ掲載する。**

### 掲載する価値があるURL

全ての条件を満たす場合のみ：

| 条件 | 説明 |
|------|------|
| 読者にとって価値がある | 「これ見たい！」と思うリソース |
| 正確に取得できる | URLが確実に存在・動作する |
| 信頼性がある | よく読まれている、確かな情報源 |

### 掲載しないURL

- ただの公式トップページ  ← ★これに該当するものが多数あった★
- 根拠のためだけのURL
- 取得できないURL
```

### 作業内容

60件のAnnouncement投稿について、`reply_content`のURLを以下の基準で修正：
- ❌ 汎用トップページ（`https://suno.com/`など）
- ✅ 具体的な公式発表記事（`https://suno.com/blog/suno-studio`など）

### 作業手順

1. **WebSearchで公式発表を調査**: `[ツール名] announcement blog 2025`
2. **公式ブログ記事のURLを特定**: 投稿内容と一致する具体記事
3. **修正リストに保存**: `url_corrections.json`に追記
4. **全件完了後、スクリプトで一括修正**: JSONファイルの`reply_content`を更新
5. **スプレッドシートに再インポート**: GASで再取り込み

### 進捗状況

| Batch | 対象 | 件数 | 状態 |
|-------|------|------|------|
| 1 | Google AI Studio (Antigravity, Opal, Gemini CLI) | 8件 | ✅完了 |
| 2 | Suno | 4件 | ✅完了 |
| 3 | Manus | 4件 | ✅完了 |
| 4 | NotebookLM | 3件 | ✅完了 |
| 5 | Canva | 4件 | ✅完了 |
| 6 | その他（Claude, Perplexity, Copilot, Stitch, イルシル, Grok, Skywork, Seedream, Readdy等） | 22件 | ✅完了 |

### 修正完了サマリー（2025-12-29）

- **修正対象**: 41件（4件はNO_CHANGEでスキップ）
- **スクリプト実行**: `apply_url_corrections.py` で一括修正完了
- **修正リスト**: `docs/url_corrections.json` にコミット済み

### 修正リスト保存先

```
C:\Instagram_AI\X_Research\20251229_01\url_corrections.json
engineer-course/docs/url_corrections.json（バックアップ・コミット済み）
```

全45件の修正情報を保存済み（41件修正、4件NO_CHANGE）。

### Announcement全60件一覧

**凡例**: ✅=修正済み、⚠️=要修正（トップページ）、✓=問題なし（具体記事）

| post_id | トピック | 現在URL | 状態 |
|---------|----------|---------|------|
| 20250101-001 | GPT-5.2 | openai.com/index/introducing-gpt-5-2/ | ✓ |
| 20250101-003 | GPT-5.2-Codex | openai.com/index/introducing-gpt-5-2-codex/ | ✓ |
| 20250102-001 | GPT-5.2 Thinking | openai.com/index/introducing-gpt-5-2/ | ✓ |
| 20250102-003 | ChatGPT Tasks | chatgpt.com/ | ⚠️要修正 |
| 20250103-001 | Gemini 3 Pro | blog.google/products/gemini/gemini-3/ | ✓ |
| 20250103-003 | Gemini 3 Flash | blog.google/products/gemini/gemini-3/ | ✓ |
| 20250104-001 | Gemini Gems | gemini.google.com/ | ⚠️要修正 |
| 20250104-003 | Gemini Deep Think | blog.google/products/gemini/gemini-3/ | ✓ |
| 20250105-001 | NanoBanana Pro | blog.google/technology/ai/nano-banana-pro/ | ✓ |
| 20250105-003 | NanoBanana Slides | workspaceupdates.googleblog.com/2025/11/... | ✓ |
| 20250106-001 | NanoBanana キャラ | blog.google/technology/ai/nano-banana-pro/ | ✓ |
| 20250106-003 | NanoBanana 図解 | blog.google/technology/ai/nano-banana-pro/ | ✓ |
| 20250107-001 | NotebookLM Audio | blog.google/technology/ai/notebooklm-audio-overviews/ | ✓ |
| 20250107-003 | NotebookLM Lecture | notebooklm.google/ | ✅修正済み |
| 20250108-001 | NotebookLM スライド | notebooklm.google/ | ✅修正済み |
| 20250108-003 | NotebookLM データ | notebooklm.google/ | ✅修正済み |
| 20250109-001 | Canva Affinity | www.canva.com/ | ✅修正済み |
| 20250109-003 | Canva Magic Studio | www.canva.com/magic/ | ✅修正済み |
| 20250110-001 | Canva ChatGPT | www.canva.com/ | ✅修正済み |
| 20250110-003 | Canva Code | www.canva.com/ | ✅修正済み |
| 20250111-001 | Workspace Flows | workspaceupdates.googleblog.com/2025/12/... | ✓ |
| 20250111-003 | Workspace Gems連携 | workspaceupdates.googleblog.com/2025/12/... | ✓ |
| 20250112-001 | Workspace ノーコード | workspaceupdates.googleblog.com/2025/12/... | ✓ |
| 20250112-003 | Workspace 企業向け | workspaceupdates.googleblog.com/2025/12/... | ✓ |
| 20250113-001 | Antigravity | aistudio.google.com/ | ✅修正済み |
| 20250113-003 | Antigravity バイブ | aistudio.google.com/ | ✅修正済み |
| 20250114-001 | Antigravity NanoBanana | aistudio.google.com/ | ✅修正済み |
| 20250114-003 | Gemini CLI | developers.googleblog.com/ | ✅修正済み |
| 20250115-001 | Manus 1.6 Max | manus.im/ | ✅修正済み |
| 20250115-003 | Manus エージェント | manus.im/ | ✅修正済み |
| 20250116-001 | Manus LINE連携 | manus.im/ | ✅修正済み |
| 20250116-003 | Manus 資料作成 | manus.im/ | ✅修正済み |
| 20250117-001 | Claude Opus 4.5 | www.anthropic.com/ | ⚠️要修正 |
| 20250117-003 | Claude Code | www.anthropic.com/ | ⚠️要修正 |
| 20250118-001 | Claude Code Web | claude.ai/ | ⚠️要修正 |
| 20250118-003 | Claude 執筆AI | claude.ai/ | ⚠️要修正 |
| 20250119-001 | Suno 音楽AI | suno.com/ | ✅修正済み |
| 20250119-003 | Suno Spotify | suno.com/ | ✅修正済み |
| 20250120-001 | Suno BGM | suno.com/ | ✅修正済み |
| 20250120-003 | Suno プロンプト | suno.com/ | ✅修正済み |
| 20250121-001 | AI Studio Opal | aistudio.google.com/ | ✅修正済み |
| 20250121-003 | AI Studio 画像編集 | aistudio.google.com/ | ✅修正済み |
| 20250122-001 | Perplexity Comet | www.perplexity.ai/ | ⚠️要修正 |
| 20250122-003 | Perplexity 初心者 | www.perplexity.ai/ | ⚠️要修正 |
| 20250123-001 | Copilot Excel | copilot.microsoft.com/ | ⚠️要修正 |
| 20250123-003 | Copilot Word | copilot.microsoft.com/ | ⚠️要修正 |
| 20250124-001 | Stitch リリース | labs.google/ | ⚠️要修正 |
| 20250124-003 | Stitch デザイン | labs.google/ | ⚠️要修正 |
| 20250125-001 | イルシル スライド | irusiru.jp/ | ⚠️要修正 |
| 20250125-003 | イルシル 差別化 | irusiru.jp/ | ⚠️要修正 |
| 20250126-001 | Grok 4.1 | x.ai/ | ⚠️要修正 |
| 20250126-003 | Grok コンテンツ | x.ai/ | ⚠️要修正 |
| 20250127-001 | Skywork | skywork.ai/ | ⚠️要修正 |
| 20250127-003 | Skywork 業務 | skywork.ai/ | ⚠️要修正 |
| 20250128-001 | Seedream | seedream.ai/ | ⚠️要修正 |
| 20250128-003 | Seedream 初心者 | seedream.ai/ | ⚠️要修正 |
| 20250129-001 | Opal 無料 | aistudio.google.com/ | ✅修正済み |
| 20250129-003 | Opal 活用 | aistudio.google.com/ | ✅修正済み |
| 20250130-001 | Readdy Web | readdy.ai/ | ⚠️要修正 |
| 20250130-003 | Readdy サイト | readdy.ai/ | ⚠️要修正 |

### ✅ 完了済みタスク（2025-12-29）

1. ~~**Batch 6の残りURL調査**~~ → 完了
2. ~~**url_corrections.jsonに追加保存**~~ → 完了（45件）
3. ~~**一括変更スクリプト作成・実行**~~ → `apply_url_corrections.py` で41件修正
4. **スプレッドシートに再インポート** ⬅️ 次のタスク

### 次のタスク

1. **スプレッドシートに再インポート**
   - postsシートをクリア
   - 修正済みJSONを再インポート

2. **リサーチワークフローにURL検証ステップ追加**
   - 投稿生成時に「公式発表記事URL」を必須チェック
   - トップページURLは警告を出す
   - 詳細: 下記「★リサーチワークフローURL検証★」セクション参照

### 重要な注意事項

- **知識カットオフ問題**: Claude/AIアシスタントの知識は古い可能性がある。「このツールは存在しない」と判断する前に必ずWebSearchで確認すること
- **URLの実在確認**: WebFetchでURLにアクセスできるか確認
- **投稿内容との一致**: URLが投稿内容（機能・発表日など）と一致しているか確認

---

## ★リサーチワークフローURL検証★

### 背景

150投稿生成時に、AnnouncementのURLが「汎用トップページ」になってしまった。
今後同じ問題を防ぐため、リサーチワークフローにURL検証ステップを追加する。

### 追加するチェックポイント

投稿生成（Claude Code）のワークフローに以下を追加：

```
1. ツール情報収集
   ↓
2. 投稿本文生成
   ↓
3. ★URL検証ステップ（新規）★
   ├── WebSearchで公式発表記事を検索
   ├── URLがトップページでないか確認
   └── 具体的な発表記事URLを取得
   ↓
4. reply_content生成（検証済みURL使用）
```

### URL検証ルール

| チェック項目 | OK例 | NG例 |
|--------------|------|------|
| パス有無 | `/blog/xxx`, `/news/xxx` | `/` のみ |
| 具体性 | 記事タイトルや日付が含まれる | 汎用ページ |
| 発表内容との一致 | 投稿で紹介する機能の発表記事 | 関係ない記事 |

### 実装場所

`content/modules/x-research/module-03-claude-code-generation.md` の「URLルール」セクションを強化

---
