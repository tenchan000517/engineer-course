# コンテンツ精度向上 引き継ぎ資料

**作成日**: 2025-12-09
**最終更新**: 2025-12-10（Module 05講座作成完了）
**前提講座**: n8n講座（Module 01-11）、n8n上級編（AI音声生成、リサーチ精度向上）完了済み

---

## 概要

### 目的

現在のGeminiプロンプトで生成されるInstagramリール投稿コンテンツの品質を向上させる。

### 対象システム

コンテンツ生成層（ideas → Gemini API → posts）のプロンプト改善

### 必読ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| CONTENT-QUALITY.md | プロンプト設計、スライド構造、60秒版台本サンプル |

**重要**: プロンプトの詳細、スライド構造、60秒版台本サンプルはCONTENT-QUALITY.mdに移動済み。本ドキュメントでは概要・設計判断・5分版サンプルを記載する。

---

## 現在の進捗

### 改善フロー

従来の月次リサーチプロンプトは「AI任せ・調べた結果任せ」で、意図しないニッチなトピックが生成される問題があった。これを解決するため、インフルエンサー起点のトレンド調査を先に行い、その結果を元に93件の投稿企画を生成するフローに改善中。

```
①トレンド調査（TOP20抽出）      ← 完了
    ↓
②投稿企画生成（93件）           ← 完了（93件確認済み）
    ↓
③GASインポート機能             ← 完了（講座作成済み）
    ↓
④カテゴリシート構造改善         ← 完了（講座作成済み）
    ↓
⑤SNS投稿作成ワークフロー改善    ← **完了（講座作成済み）**
    ↓
⑥品質検証                      ← 次にやること
```

### 完了したタスク

| フロー | ファイル | ステータス |
|--------|----------|------------|
| ①海外版プロンプト | PROMPT-01-trend-research.md | 暫定確定 |
| ①日本版プロンプト | PROMPT-01-trend-research-jp.md | 暫定確定 |
| ①海外版調査結果 | RESEARCH-01-result-global.json | 保存済み |
| ①日本版調査結果 | RESEARCH-01-result-jp.json | 保存済み |
| ②プロンプト生成用 | PROMPT-02-generate-ideas.md | 暫定確定 |
| ②93件生成結果 | 93件JSON | 確認済み |
| ③GASインポート | スプレッドシートメニュー追加 | 完了 |
| ③講座 | module-03-content-ideas-import.md | 作成済み |
| ④カテゴリシート13列化 | canva_A〜Eシートのヘッダー更新 | 完了 |
| ④Canva振り分けWF更新 | Canva用シート振り分けadvanced.json | 完了 |
| ④講座 | module-04-canva-sheet-structure.md | 作成済み |
| ⑤Geminiプロンプト（カテゴリA） | PROMPT-GEMINI-CATEGORY-A.md | **作成・検証完了** |
| ⑤Geminiプロンプト（カテゴリB） | PROMPT-GEMINI-CATEGORY-B.md | 作成完了 |
| ⑤Geminiプロンプト（カテゴリC） | PROMPT-GEMINI-CATEGORY-C.md | 作成完了 |
| ⑤Geminiプロンプト（カテゴリD） | PROMPT-GEMINI-CATEGORY-D.md | 作成完了 |
| ⑤Geminiプロンプト（カテゴリE） | PROMPT-GEMINI-CATEGORY-E.md | 作成完了 |
| ⑤n8nワークフロー更新 | SNS投稿作成advanced.json | **完了** |
| ⑤受講生用テンプレート | sns-post-advanced-workflow.json | **完了** |
| ⑤講座 | module-05-gemini-prompt-improvement.md | **作成済み** |

### 次にやること（優先順）

#### ⑥品質検証

**ステータス**: 未着手

**やること**:
1. ワークフローを実行して生成結果を確認
2. ツール名が維持されているか確認
3. 数値が捏造されていないか確認
4. 絵文字が含まれていないか確認
5. スライド文字数が14文字以内か確認
6. 問題があればプロンプトを微調整

---

## ⑤で完了した作業の詳細

### 作成したファイル

| 種類 | ファイル | パス |
|------|----------|------|
| 完成版ワークフロー | SNS投稿作成advanced.json | content/modules/n8n-advanced/ |
| 受講生用テンプレート | sns-post-advanced-workflow.json | public/n8n-advanced/download/ |
| 講座 | module-05-gemini-prompt-improvement.md | content/modules/n8n-advanced/ |
| スクショ | module-05-gemini-model-select.png | public/n8n-advanced/ |
| スクショ | module-05-gemini-prompt-input.png | public/n8n-advanced/ |
| スクショ | module-05-workflow-overview.png | public/n8n-advanced/ |

### ワークフロー変更点

| 項目 | 変更内容 |
|------|----------|
| ワークフロー名 | `SNS投稿作成` → `SNS投稿作成advanced` |
| モデル | 全カテゴリ `models/gemini-2.5-pro` に統一 |
| プロンプト | カテゴリA〜E全て新プロンプトに更新 |
| キャプションテンプレート | 後半を固定化（コミュニティ紹介文） |

### プロンプト改善で解決した問題

| 問題 | 解決策 |
|------|--------|
| ツール名が勝手に変更される | 「入力データをそのまま使え」を最重要指示に |
| 数値が捏造される（ハルシネーション） | 「数値生成禁止」「リサーチ禁止」を明記 |
| 絵文字が出力される | 「絵文字禁止」を明記 |
| テンプレ感が強い（王者vs革命児） | 事例を削除、入力のresearch_points活用を指示 |

### 検証で判明したこと

**Geminiモデルの挙動**:
- Knowledge cutoff（2025年1月）以降のモデル名を入力すると、古いモデル名に置き換えようとする
- 「リサーチしろ」と指示すると、古い知識で補正しようとしてハルシネーションが発生
- 解決策: 「リサーチ禁止」「入力をそのまま使え」と明示

**推奨モデル**:
- Gemini 2.5 Pro: 指示遵守度が高い（月$3程度）
- Gemini 2.5 Flash: コスト低い（月$0.5程度）が指示を無視することがある

### 重要な設計決定（確定済み）

- **ナレーション分割**: 2分割（narration_1, narration_2）を維持（Fish Audio APIは文字数課金のため）
- **スライド構造**: 6セット + CTA固定画像（12セットから削減）
- **CTA**: 固定画像化（毎回同じ画像を使い回し、Gemini生成不要）
- **カテゴリE（ranking）**: 特別な時間配分（第1位に長い時間を割く）
- **スライド文字数**: 14文字制限（16文字程度のオーバーは許容）
- **ハッシュタグ**: hashtagsフィールドに出力、captionへの結合はパース処理で対応

---

## 重要な設計判断

### ①トレンド調査の設計

- **インフルエンサー起点**: キーワード検索ではなく、フォロワー数の多いインフルエンサーの投稿を収集
- **出現率でランキング**: エンゲージメント（再生数等）ではなく「何人のインフルエンサーが言及したか」でTOP20を決定
- **理由**: エンゲージメントはフォロワー数に比例してしまい、本当のトレンドが見えない

### ②投稿企画生成の設計

- **93件は全てTOP20から**: TOP20以外のトピックは生成しない（ニッチなものが混入しない）
- **出現頻度はmention_countに比例**: TOP1は多く、TOP20は少なく
- **mention_count 1は除外可**: 1人しか言及していないものは信頼性が低い
- **カテゴリA（比較）は両方TOP20内**: 比較対象が両方ともTOP20にあるものに限定（謎ツールとの比較を防ぐ）

### 日本版と海外版の違い

- **日本版**: YouTube（登録者5万人以上）、X（フォロワー1万人以上）、Redditなし
- **海外版**: YouTube（登録者10万人以上）、X（フォロワー5万人以上）、Reddit（メンバー10万人以上）
- **日本版のみ**: `how_presented`（誰向け・紹介形式・紹介内容）を記録

### 注意事項

- **既存プロンプトを変えすぎない**: ②は元のプロンプトの構造を維持し、固有名詞部分だけをTOP20で置き換える設計
- **Antigravityの能力を活かす**: ブラウザ直接操作、動画内容参照が可能。従来のWebリサーチとは異なる
- **X/Redditは`site:`クエリ**: アプリ内はログイン必要なため、Google検索で`site:x.com`等を使用

---

## 日本版TOP20（2025年12月）

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

---

## 講座作成フロー

### 基本的な流れ

1. **ユーザーからのリクエスト**
   - ユーザーが「この手順を知りたい」とリクエスト

2. **徹底的な調査**
   - その手順について調査（公式ドキュメント、最新情報など）
   - 手順を整理して指示

3. **ユーザーによる実践**
   - ユーザーが手順を実際にやってみる
   - 各ステップでスクリーンショットを撮影

4. **確認とサポート**
   - 共有されたスクショを確認
   - 手順通りできているかチェック
   - 問題があれば解決策を提示
   - **止まった箇所・解決方法を記録**
   - 成功するまでサポート

5. **講座の作成**
   - 成功後、スクショを適切な箇所に添付
   - **止まった箇所をトラブルシューティングに記載**
   - 講座マークダウンを作成

6. **追加素材の埋め込み**
   - 画面録画があれば動画を埋め込み
   - 完成物（デプロイURL等）があれば記載

---

## 講座フォーマット仕様

### セクション順序（必須）

```markdown
# タイトル

**所要時間**: XX分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと
（箇条書き）

---

## 学習目標
（「このモジュールを終えると、以下のことができるようになります：」）

---

## 事前準備
### 必要なもの
### 推奨スペック

---

## セクション1: XXXX
（各セクションの最後に「チェックポイント」）

### チェックポイント
- [ ] 確認項目1
- [ ] 確認項目2

---

## セクション2: XXXX
...

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[ファイル名.json](/n8n-advanced/download/ファイル名.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_SPREADSHEET_ID` | あなたのスプレッドシートID |
...

---

## トラブルシューティング

記載できるもの：
- ユーザーが実践で実際に止まり、解決した内容
- 信頼できるソース（公式ドキュメント等）に記載されている内容

記載しない：
- 想定だけの内容（検証なし・ソースなし）

### 問題タイトル
**症状**: 何が起きたか
**解決方法**: どう解決したか

---

## まとめ

### このモジュールで学んだこと
### 次のステップ

---

## 参考資料

- [リンクタイトル](URL)

---

## よくある質問

**Q: 質問**
A: 回答
```

### フォーマットルール

| ルール | 説明 |
|--------|------|
| 絵文字禁止 | 見出しや本文に絵文字を使わない（難易度の⭐のみ例外） |
| チェックポイント | 各セクション末尾に設置 |
| トラブルシューティング | ユーザー実践で止まった箇所を必ず記載 |
| 参考資料 | 公式ドキュメント等のリンクを記載 |
| よくある質問 | 最低3-5個のQ&Aを記載 |
| ワークフローダウンロード | `/n8n-advanced/download/` に配置 |

### 画像配置ルール

- **画像には必ず説明文を追加**
- 「○○の実行結果：」のような一文を画像の前に入れる
- 画像だけ連続させない
- 配置先: `public/n8n-advanced/`
- ダウンロード用JSON: `public/n8n-advanced/download/`

---

## 関連ファイル

### プロンプト関連

| ファイル | パス |
|---------|------|
| ①海外版プロンプト | content/PROMPT-01-trend-research.md |
| ①日本版プロンプト | content/PROMPT-01-trend-research-jp.md |
| ①海外版調査結果 | content/RESEARCH-01-result-global.json |
| ①日本版調査結果 | content/RESEARCH-01-result-jp.json |
| ②プロンプト生成用 | content/PROMPT-02-generate-ideas.md |
| ③講座 | content/modules/n8n-advanced/module-03-content-ideas-import.md |
| プロンプト＆サンプル集 | content/CONTENT-QUALITY.md |
| 事例作成用プロンプト | content/PROMPT-SAMPLE-CREATION.md |
| 理想形サンプル（6セット版） | content/SAMPLE-OUTPUTS.md |
| ⑤Geminiプロンプト（カテゴリA） | content/PROMPT-GEMINI-CATEGORY-A.md |
| ⑤Geminiプロンプト（カテゴリB） | content/PROMPT-GEMINI-CATEGORY-B.md |
| ⑤Geminiプロンプト（カテゴリC） | content/PROMPT-GEMINI-CATEGORY-C.md |
| ⑤Geminiプロンプト（カテゴリD） | content/PROMPT-GEMINI-CATEGORY-D.md |
| ⑤Geminiプロンプト（カテゴリE） | content/PROMPT-GEMINI-CATEGORY-E.md |

### ワークフローJSON

| ファイル | パス |
|---------|------|
| SNS投稿作成.json（旧版） | content/modules/n8n/SNS投稿作成.json |
| **SNS投稿作成advanced.json（完成版）** | content/modules/n8n-advanced/SNS投稿作成advanced.json |
| **sns-post-advanced-workflow.json（受講生用テンプレート）** | public/n8n-advanced/download/sns-post-advanced-workflow.json |
| Canva用シート振り分け2.json | content/modules/n8n/Canva用シート振り分け2.json |
| Canva用シート振り分けadvanced.json | content/modules/n8n-advanced/Canva用シート振り分けadvanced.json |

### 講座

| ファイル | パス |
|---------|------|
| ③リサーチ精度向上 | content/modules/n8n-advanced/module-03-content-ideas-import.md |
| ④カテゴリシート構造改善 | content/modules/n8n-advanced/module-04-canva-sheet-structure.md |
| **⑤Geminiプロンプト改善** | content/modules/n8n-advanced/module-05-gemini-prompt-improvement.md |

### スクリーンショット（Module 05）

| ファイル | パス |
|---------|------|
| module-05-gemini-model-select.png | public/n8n-advanced/ |
| module-05-gemini-prompt-input.png | public/n8n-advanced/ |
| module-05-workflow-overview.png | public/n8n-advanced/ |

---

**最終更新**: 2025-12-10
