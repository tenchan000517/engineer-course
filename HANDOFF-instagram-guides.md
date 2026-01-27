# セッション引き継ぎ: Instagramガイド整備

## 作成日
2026-01-27

---

## 今回のセッションで作成・整理したもの

### 保存先
`docs/reference/instagram-tokuten/`

### 新規作成ファイル（4件）

| ファイル名 | 内容 | 備考 |
|------------|------|------|
| `instagram-master-prompt-harm.md` | HARM法則対応マスタープロンプト | 投稿一括作成用の完全版プロンプト |
| `instagram-batch-content-harm-example.md` | 投稿一括作成の実例 | リール5本+特典1本の完全台本（一部未完成） |
| `instagram-ai-hook-100-guide.md` | AI冒頭フック100選（テキスト系） | 7カテゴリ、作り方ガイド付き |
| `instagram-visual-hook-100-guide.md` | 映像フック100選（ビジュアル系） | AIツール別、組み合わせテクニック付き |

### 既存の分析ファイル（参照用）

| ファイル名 | 内容 |
|------------|------|
| `ANALYSIS-tokuten-types.md` | 28サンプルから抽出した33型の分析 |
| `ANALYSIS-meta-prompt-output.md` | メタプロンプト形式の分析結果+6プロンプト |
| `PROMPTS-content-creation.md` | コンテンツ作成プロンプト8種 |
| `META-PROMPT-analyzer.md` | サンプル分析用メタプロンプト |

---

## 次回セッションでの推奨タスク

### 1. 未完成部分の完成
`instagram-batch-content-harm-example.md` の以下が未完成:
- 特典コンテンツ1のSTEP3〜STEP7
- 特典コンテンツ2/3（匿名副業マニュアル）
- 特典コンテンツ3/3

### 2. ガイドの統合・整理
現在、類似のガイドが複数存在:
- `ANALYSIS-tokuten-types.md` と `ANALYSIS-meta-prompt-output.md` の統合検討
- `PROMPTS-content-creation.md` と新規プロンプトの整理

### 3. 実践ワークフローの作成
フック100選を実際に使うためのワークフロー:
- テーマ選定 → フック選択 → 台本作成 → 映像生成 のフロー図
- ツール連携ガイド（ChatGPT → Higgsfield → CapCut）

### 4. サンプルディレクトリの更新
`docs/reference/instagram-tokuten/` に14アカウント分のサンプルあり:
- SakiSNS, NatsumiAI, mio_ai_insta, pigu_gpt, waigo_ai, headhome, calix_kr, miyu_ai, sakura_kossori, nextpiece, saki_aideai, ayane_insta, timkoda_, reelda_

---

## 関連ファイル

### ガイド系
- `content/guides/instagram-tokuten-sample-guide.md` - サンプル保存ガイド

### HARM法則関連
- フック100選にHARM要素を追加する場合は `instagram-master-prompt-harm.md` のHARM定義を参照

---

## コマンドメモ

### サンプル一覧表示
```bash
ls docs/reference/instagram-tokuten/*/
```

### 新規ガイド一覧
```bash
ls docs/reference/instagram-tokuten/*.md
```

---

## 注意事項

- `docs/reference/instagram-tokuten/` は `.gitignore` に登録されている（非公開）
- サンプルには他アカウントのコンテンツが含まれるため公開禁止
- 分析結果とプロンプトは再利用可能
