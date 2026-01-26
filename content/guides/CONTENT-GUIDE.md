# コンテンツ作成ガイド

講座モジュールを作成する際の共通ルールです。全ての講座でこのガイドに従ってください。

---

## 講座作成フロー

### 1. ユーザーからのリクエスト
- ユーザーが「この手順を知りたい」とリクエスト

### 2. 徹底的な調査
- その手順について調査（公式ドキュメント、最新情報など）
- 手順を整理して指示

### 3. ユーザーによる実践
- ユーザーが手順を実際にやってみる
- **各ステップでスクリーンショットを撮影**

### 4. 確認とサポート
- 共有されたスクショを確認
- 手順通りできているかチェック
- 問題があれば解決策を提示
- **止まった箇所・解決方法を記録**
- 成功するまでサポート

### 5. 講座の作成
- 成功後、スクショを適切な箇所に添付
- **止まった箇所をトラブルシューティングに記載**
- 講座マークダウンを作成

### 6. 追加素材の埋め込み
- 画面録画があれば動画を埋め込み
- 完成物（デプロイURL等）があれば記載

---

## セッション引き継ぎルール

セッションが途中で変わる可能性がある場合、HANDOFFファイルに以下を記載すること：

### スクリーンショットの記録

共有されたスクショは以下の形式でHANDOFFに記録：

```markdown
### 共有済みスクリーンショット

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `/path/to/screenshot1.png` | Get canva_A実行結果 | Step 3 | 可 |
| `/path/to/screenshot2.png` | エラー画面 | Step 5 | 不可（トラブルシューティング用） |
| `/path/to/screenshot3.png` | 設定確認用（手順外） | - | 不可 |
```

**講座使用の判断基準**:
- `可`: 講座の手順説明に必要な画像
- `不可（トラブルシューティング用）`: エラー解決の参考として記録するが講座本文には不要
- `不可`: 確認用や重複など、講座には使用しない

---

## 講座フォーマット仕様

### 冒頭メタ情報

```markdown
# タイトル

**所要時間**: XX分
**難易度**: ⭐⭐⭐☆☆（白抜き星を使用、★は使わない）

※ダウンロードセクションがある場合のみ↓
このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---
```

### 構成順序（必須）

```markdown
## このモジュールで学ぶこと
（箇条書き）

---

## 学習目標
（「このモジュールを終えると、以下のことができるようになります：」）

---

## 目次
（学習目標の下、事前準備の上に配置）

---

## 事前準備
### 必要なもの
### 前提知識（任意）

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

## トラブルシューティング
（実際に発生した問題のみ記載）

---

## まとめ
### このモジュールで学んだこと
### 次のステップ

---

## ワークフローJSONダウンロード
（該当する場合のみ）

---

## 参考資料
- [リンクタイトル](URL)

---

## よくある質問
**Q: 質問**
A: 回答
```

---

## 目次フォーマット

```markdown
## 目次

- [セクション1: タイトル](#セクション1-タイトル)
- [セクション2: タイトル](#セクション2-タイトル)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)
```

**アンカーIDルール**:
- 小文字化
- スペースはハイフン（`-`）に変換
- コロン（`:`）は削除

---

## ワークフローダウンロードセクション

```markdown
## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[ファイル名.json](/カテゴリ/download/ファイル名.json)

**インポート後に変更が必要な箇所**:

| プレースホルダー | 変更内容 |
|----------------|---------|
| `YOUR_SPREADSHEET_ID` | あなたのスプレッドシートID |
| `YOUR_CREDENTIAL_ID` | クレデンシャルを再設定 |

また、〇〇のクレデンシャルを設定してください。
```

**ダウンロード用JSONファイル**:
- 配置先: `public/{カテゴリ}/download/`
- 個人情報はプレースホルダー化必須

---

## タイトル命名規則

### 形式

「**〜で〜する**」「**〜を〜する**」の動詞形式を使用する。

### 良い例

- `Google Flowで動画を作る`
- `スクリプトで素材を自動配置する`
- `プロダクション機能でセットアップ`
- `AIと一緒に企業PVを企画する`

### 悪い例

| 悪い例 | 理由 |
|--------|------|
| `実践編: ExtendScript自動配置` | 「実践編:」などの接頭辞は不要 |
| `Module 01: セットアップ` | モジュール番号は含めない |
| `基礎編: 動画生成の基本` | 「基礎編:」などの接頭辞は不要 |
| `ExtendScript自動配置` | 動詞がない、何をするか不明確 |

---

## 禁止事項

| 項目 | 説明 |
|------|------|
| 絵文字 | 見出しや本文に絵文字を使わない |
| ★（黒星） | 難易度表記は⭐（白抜き星）のみ使用 |
| Module XX: | タイトルにモジュール番号を含めない |
| 実践編:/基礎編: | タイトルに接頭辞を付けない |
| 想定のトラブルシューティング | 実際に発生・検証した問題のみ記載 |
| 画像の連続配置 | 画像の前に必ず説明文を入れる |

---

## 必須事項

| 項目 | 説明 |
|------|------|
| チェックポイント | 各セクション末尾に設置 |
| 参考資料 | 公式ドキュメント等のリンクを記載 |
| よくある質問 | 最低3-5個のQ&Aを記載 |
| 画像の説明文 | 「○○の実行結果：」のような一文を画像の前に入れる |

---

## コマンド記述ルール

ターミナルコマンドを記載する際は、PowerShellとGit Bashの違いを明示する。

### コマンドが同じ場合

見出しに「（PowerShell、Git Bash共通）」を付けて1つのコードブロックにまとめる。

```markdown
### 使い方（PowerShell、Git Bash共通）

` ` `bash
pip install pillow
` ` `
```

### コマンドが異なる場合

それぞれ別のコードブロックで記載する。

```markdown
**PowerShellの場合**:
` ` `powershell
.\venv\Scripts\Activate
` ` `

**Git Bashの場合**:
` ` `bash
source venv/Scripts/activate
` ` `
```

---

## n8nノード指示ルール

Google Sheets / Google Drive ノードを指示する際は、**必ずActionを明記**すること。

ノード追加時にAction選択画面が表示されるため、Actionの指定がないと受講者が迷う。

**指示例**:
```markdown
Google Sheetsノードを追加:
- Action: Get row(s) in sheet
- Document: n8n-test
- Sheet: canva_A
```

### Google Sheets Actions

| Action | 用途 |
|--------|------|
| Get row(s) in sheet | シートからデータ取得 |
| Append row in sheet | 行を追加 |
| Update row in sheet | 行を更新 |
| Append or update row in sheet | 行を追加または更新（upsert） |
| Clear sheet | シートをクリア |
| Delete rows or columns from sheet | 行/列を削除 |

### Google Drive Actions

| Action | 用途 |
|--------|------|
| Search files and folders | ファイル/フォルダを検索 |
| Download file | ファイルをダウンロード |
| Upload file | ファイルをアップロード |
| Move file | ファイルを移動 |
| Create folder | フォルダを作成 |
| Delete a file | ファイルを削除 |
| Copy file | ファイルをコピー |

---

## 進捗管理

- 作業開始時にタスク一覧を作成（TodoWrite）
- 各タスク完了時に即座にcompletedに更新
- セッション終了時にHANDOFFを更新

---

## ファイル配置規則

```
content/
├── modules/
│   ├── {カテゴリ}/
│   │   ├── module-XX-slug.md
│   │   └── ...
│   └── ...
├── HANDOFF-{カテゴリ}.md
├── CONTENT-GUIDE.md（本ファイル）
└── ...

public/
├── {カテゴリ}/
│   ├── download/
│   │   └── workflow-name.json
│   ├── module-XX-image-name.png
│   └── ...
└── ...
```

---

## 講座構造（親カテゴリ + 子講座）

講座は必ず**親カテゴリ + 子講座**の構造にする。

### ディレクトリ構造

```
content/modules/
├── {親カテゴリ}/                    ← 親カテゴリ
│   └── _category.json
└── {子講座}/                        ← 子講座（モジュールはここ）
    ├── _category.json
    ├── module-01-xxx.md
    ├── module-02-xxx.md
    └── ...

app/category/
└── [categorySlug]/
    ├── page.tsx                     ← カテゴリ一覧（子講座リスト or モジュールリスト）
    └── [slug]/
        ├── page.tsx                 ← 子講座一覧 or モジュール詳細（自動判定）
        └── [moduleSlug]/
            └── page.tsx             ← 子講座内モジュール詳細
```

**ルーティングの自動判定**:
- `[slug]` が子講座IDに一致 → 子講座のモジュール一覧を表示
- `[slug]` がモジュールスラッグに一致 → モジュール詳細を表示

### 親カテゴリの_category.json

```json
{
  "id": "{親カテゴリID}",
  "title": "講座タイトル",
  "description": "講座の説明",
  "icon": "image",
  "color": "amber",
  "order": 6,
  "tags": { ... },
  "moduleCount": 9,
  "hasSubcourses": true,
  "subcourses": [
    {
      "id": "{子講座ID}",
      "title": "子講座タイトル",
      "description": "子講座の説明",
      "moduleCount": 9,
      "level": "beginner"
    }
  ]
}
```

### 子講座の_category.json

```json
{
  "id": "{子講座ID}",
  "title": "子講座タイトル",
  "description": "子講座の説明",
  "icon": "image",
  "color": "amber",
  "order": 1,
  "tags": { ... },
  "moduleCount": 9,
  "isSubcourse": true,
  "parentCategory": "{親カテゴリID}"
}
```

### 子講座の命名規則

子講座の `title` は**何を達成できるかが明確**であること。

モジュールは、子講座を達成するためのステップ。順番にこなすと子講座のゴールに到達できる構成にする。

**良い例:**
- `ランキングリール制作`
- `X自動投稿 - 初級編`
- `コメント→DM自動配布`

**悪い例:**
- `基礎編`（何ができるようになるか不明）
- `実践編`（何ができるようになるか不明）

**注意**: モジュールタイトルには「〇〇編:」の接頭辞を付けない（タイトル命名規則を参照）

### ルーティング（共通化済み）

ルーティングは全カテゴリで共通化されているため、**新しい講座を追加する際にルーティングファイルの作成は不要**。

```
app/category/[categorySlug]/[slug]/page.tsx          ← 全カテゴリ共通
app/category/[categorySlug]/[slug]/[moduleSlug]/page.tsx  ← 全カテゴリ共通
```

`_category.json` を正しく設定すれば、自動的にルーティングされる。

---

## 新しい色の追加

新しい色を使用する場合、以下の**3ファイルすべて**にcolorMapを追加する：

| ファイル | 追加箇所 |
|----------|----------|
| `app/page.tsx` | `colorMap` |
| `app/category/[categorySlug]/page.tsx` | `colorMap` と `borderLeftColor` の条件分岐 |
| `components/CategorySidebar.tsx` | `colorMap` |

### 利用可能な色

| 色名 | Tailwind | Hex（border用） |
|------|----------|-----------------|
| blue | bg-blue-500 | #3b82f6 |
| purple | bg-purple-500 | #a855f7 |
| orange | bg-orange-500 | #f97316 |
| green | bg-green-500 | #22c55e |
| amber | bg-amber-500 | #f59e0b |
| yellow | bg-yellow-500 | #eab308 |
| pink | bg-pink-500 | #ec4899 |
| white | bg-gray-900 | #1f2937 |

---

## Pythonコマンドジェネレータ

Nanobanana講座など、Pythonコマンドを実行する講座では、**Pythonコマンドジェネレータ**を使用する。

### 概要

プロンプト例を示す際に、ユーザーが自由にプロンプト・ファイル名・アスペクト比を編集でき、実行可能なPythonコマンドを生成・コピーできるUIコンポーネント。

### UI構成

```
クリックしてPythonコマンドを生成    ← 説明文（折りたたみ時のみ表示）
[▼ ナラティブ記述（良い例）]        ← トグルボタン

↓ クリックで展開 ↓

┌─────────────────────────────────────────────────┐
│ プロンプト                                        │
│ ┌─────────────────────────────────────────────┐ │
│ │ A fluffy orange tabby cat sits...           │ │ ← 編集可能
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ファイル名                                        │
│ ┌──────────────────────────────┐┌─────┐        │
│ │ cat_narrative                ││.png │        │ ← 拡張子自動付与
│ └──────────────────────────────┘└─────┘        │
│                                                  │
│ アスペクト比        デフォルト                     │
│ ┌───────┐         ┌──────────┐                 │
│ │ 1:1 ▼ │         │↺ デフォルト│                │ ← リセットボタン
│ └───────┘         └──────────┘                 │
├─────────────────────────────────────────────────┤
│ python generate_image.py "A fluffy..." cat...  │📋│ ← コピーボタン
└─────────────────────────────────────────────────┘
```

### 使用場面

- プロンプトを指定してPythonスクリプトを実行する箇所
- ユーザーが自由にプロンプトやファイル名を変更できる箇所
- 比較用に複数のプロンプトを試す箇所

### マークダウンでの記述方法

**重要**: プロンプト例のコードブロックの**下**に設置する。コードブロックとジェネレータのプロンプトは**必ず同一**にすること。

```markdown
#### 良い例（ナラティブ記述）

` ` `
A fluffy orange tabby cat sits contentedly on a cushioned window sill,
watching raindrops trace paths down the glass. The warm glow of a
nearby lamp casts soft amber highlights on the cat's fur, while the
grey afternoon light filters through the rain-streaked window.
` ` `

<div data-prompt-command
     data-prompt="A fluffy orange tabby cat sits contentedly on a cushioned window sill, watching raindrops trace paths down the glass. The warm glow of a nearby lamp casts soft amber highlights on the cat's fur, while the grey afternoon light filters through the rain-streaked window."
     data-filename="cat_narrative"
     data-title="ナラティブ記述（良い例）">
</div>
```

### 属性一覧

| 属性 | 必須 | 説明 | 例 |
|------|------|------|-----|
| `data-prompt-command` | ○ | コンポーネントを有効化 | （値不要） |
| `data-prompt` | ○ | デフォルトプロンプト | `"A cute cat"` |
| `data-filename` | △ | デフォルトファイル名（.pngは不要） | `"cat_narrative"` |
| `data-ratio` | - | デフォルトアスペクト比（省略時は1:1） | `"16:9"` |
| `data-title` | - | ボタンのタイトル | `"キーワード列挙（悪い例）"` |

### 機能一覧

| 機能 | 説明 |
|------|------|
| 展開/折りたたみ | ボタンクリックでUI展開 |
| プロンプト編集 | テキストエリアで自由に編集可能 |
| ファイル名編集 | 入力ボックス + .png自動付与 |
| アスペクト比選択 | ドロップダウン（1:1, 16:9, 9:16, 3:4, 4:3） |
| デフォルトリセット | ボタンクリックで初期値に戻す |
| コマンドコピー | 生成されたコマンドをクリップボードにコピー |

### 注意事項

1. **一貫性**: 同じセクション内でプロンプト例を示す場合、コードブロックとジェネレータのプロンプトを**必ず統一**する
2. **テーマの統一**: セクションをまたいで同じテーマ（例：猫と窓）を扱う場合、プロンプトを一貫させる
3. **配置順序**: 必ずコードブロック → ジェネレータの順で配置
4. **ファイル名**: 拡張子（.png）は不要。コンポーネントが自動付与する

### 実装ファイル

- コンポーネント: `components/PromptCommand.tsx`
- マークダウン処理: `components/MarkdownRenderer.tsx`

---

## 新しい講座作成チェックリスト

新しい講座を作成する際は、以下を順番に実施する：

1. [ ] 親カテゴリディレクトリ作成: `content/modules/{親カテゴリ}/`
2. [ ] 親カテゴリ_category.json作成（hasSubcourses: true）
3. [ ] 子講座ディレクトリ作成: `content/modules/{子講座}/`
4. [ ] 子講座_category.json作成（isSubcourse: true）
5. [ ] モジュールファイル作成: `module-XX-xxx.md`
6. [ ] 新しい色を使う場合は3ファイルにcolorMap追加
7. [ ] publicディレクトリ作成: `public/{子講座}/`

**注意**: ルーティングファイルの作成は不要（共通化済み）

---

**最終更新**: 2025-01-20
