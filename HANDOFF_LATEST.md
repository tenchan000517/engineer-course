# Engineer Course アプリ 引き継ぎドキュメント（最新版）

**更新日**: 2025-10-25 11:00
**プロジェクト**: Next.js講座コンテンツのWebアプリ化
**プロジェクト名**: `engineer-course`
**場所**: `C:/portfolio-course/engineer-course/`
**開発サーバー**: `npm run dev` → http://localhost:3000

---

## 🎯 現在の状態

### ✅ 完了している機能

1. **基本実装（100%完了）**
   - ✅ Next.js プロジェクトセットアップ
   - ✅ トップページ（`app/page.tsx`）
   - ✅ モジュールページ（`app/module/[slug]/page.tsx`）
   - ✅ サイドバー（`components/Sidebar.tsx`）
   - ✅ マークダウンレンダラー（`components/MarkdownRenderer.tsx`）
   - ✅ 全8モジュール（Module 1-7 + Module 8応用編）

2. **レスポンシブ対応（完了）**
   - ✅ viewport設定追加
   - ✅ モバイル用ハンバーガーメニュー
   - ✅ 画面幅に応じたテキストサイズ調整
   - ✅ 横スクロール防止（`overflow-x: hidden`）
   - ✅ Flexbox対応（`min-w-0`）
   - ✅ テーブル・コードブロックの横スクロール対応

3. **Module 8: 応用編（新規作成完了）**
   - ✅ Python + FFMPEGによる動画圧縮
   - ✅ マークダウンファイル作成（`content/modules/module-08-advanced-video-compression.md`）
   - ✅ Pythonスクリプト作成（`scripts/compress_videos.py`、`scripts/check_sizes.py`）
   - ✅ requirements.txt作成

4. **Module 1: 内容更新（完了）**
   - ✅ Claude Code認証方法追加（ログイン認証推奨、MAXプラン推奨）
   - ✅ `claude`コマンドでの起動方法追加
   - ✅ WSL環境の推奨を追加
   - ✅ `code .`コマンドの説明追加
   - ✅ エクスプローラーからの開き方（右クリック → Code で開く）
   - ✅ よくある質問を更新

5. **タイトル重複問題（解決済み）**
   - ✅ `lib/markdown.ts`でマークダウンからタイトル・所要時間・難易度を削除
   - ✅ モジュールページのヘッダーにのみ表示

---

## ⚠️ 現在の問題・未解決事項

### 🔴 テキストコントラストの問題（未解決）

**問題の詳細:**

ユーザーからの報告：
> 「ディレクトリ構造のツリー（`├──`, `└──`など）のテキストが薄くて見づらい」
> 「コードブロックは元々見やすかったのに、修正後に見づらくなった」

**現在の状態:**
- 何度か修正を試みたが、逆に悪化させてしまった
- 元の状態に戻す必要がある

**修正が必要な箇所:**

1. **app/globals.css**
   - 現在、余計なスタイルが追加されている可能性
   - 以下のセクションを確認：
     ```css
     /* コードブロックのスタイリング改善 */
     pre code {
       background: transparent !important;
       padding: 0 !important;
       display: block;
       overflow-x: auto;
     }

     /* ここに余計なスタイルが追加されている可能性 */
     ```

2. **components/MarkdownRenderer.tsx**
   - コードブロックの色設定を確認
   - 現在のクラス名: `text-white ... font-normal`
   - 元のクラス名が不明

**推奨される対処法:**

1. **元の状態を確認**
   - gitで過去のコミットを確認（もしあれば）
   - または、Tailwind CSSのデフォルト設定を確認

2. **ターゲット:**
   - コードブロック（黒背景）のテキストが見やすい白色
   - ディレクトリ構造のツリー文字が見やすい
   - シンタックスハイライトは不要かもしれない（プレーンテキストで十分）

3. **具体的な修正案:**
   ```css
   /* globals.css */
   pre code {
     background: transparent !important;
     padding: 0 !important;
     color: #ffffff; /* 白 */
   }
   ```

---

## 📁 プロジェクト構造

```
engineer-course/
├── app/
│   ├── layout.tsx          # ルートレイアウト（viewport設定済み）
│   ├── page.tsx            # トップページ（完成）
│   ├── globals.css         # グローバルスタイル（レスポンシブ対応済み）
│   └── module/
│       └── [slug]/
│           └── page.tsx    # モジュールページ（完成）
│
├── components/
│   ├── Sidebar.tsx         # サイドバー（ハンバーガーメニュー付き）
│   └── MarkdownRenderer.tsx # マークダウンレンダラー
│
├── content/
│   └── modules/
│       ├── module-01-environment-setup.md           # 更新済み
│       ├── module-02-nextjs-project-init.md
│       ├── module-03-asset-preparation.md
│       ├── module-04-basic-ui.md
│       ├── module-05-interactive-ui.md
│       ├── module-06-ui-customization.md
│       ├── module-07-deployment.md
│       └── module-08-advanced-video-compression.md  # 新規作成
│
├── lib/
│   └── markdown.ts         # マークダウン処理（重複削除機能付き）
│
├── scripts/                # 新規作成
│   ├── compress_videos.py  # 動画圧縮スクリプト
│   ├── check_sizes.py      # サイズチェックスクリプト
│   ├── requirements.txt    # Python依存パッケージ
│   ├── README.md           # スクリプトの使い方
│   └── .gitignore          # venv/を除外
│
└── public/
    └── mov/                # 動画ファイル配置先（予定）
```

---

## 🔧 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **マークダウン処理**:
  - `react-markdown`
  - `remark-gfm` (GitHub Flavored Markdown)
  - `rehype-highlight` (シンタックスハイライト)
  - `rehype-raw` (HTML in Markdown)
  - `gray-matter` (フロントマター解析)
- **Python**: 動画圧縮スクリプト用
  - `ffmpeg-python`

---

## 🎨 デザイン仕様

### カラーパレット（単色のみ、グラデーション禁止）

**プライマリカラー:**
- 青: `bg-blue-500` (#3B82F6), `bg-blue-600`, `bg-blue-700`
- 紫: `bg-purple-500`
- 緑: `bg-green-500`
- オレンジ: `bg-orange-500`

**背景:**
- メイン: `bg-gray-50`
- カード: `bg-white`
- コードブロック: `bg-gray-900`（黒）

**テキスト:**
- メイン: `text-gray-900`
- サブ: `text-gray-700`, `text-gray-600`
- リンク: `text-blue-600`
- コードブロック内: `text-white`（白） ← **ここが問題の可能性**

---

## 🚀 次のステップ（優先順位順）

### 1. **テキストコントラストの修正（最優先）**

**問題:**
- ディレクトリ構造のテキストが薄い
- コードブロックが見づらくなった

**対処:**
1. `app/globals.css`の余計なスタイルを削除
2. `components/MarkdownRenderer.tsx`のコードブロック色を確認
3. 元の見やすい状態に戻す

**確認方法:**
```bash
npm run dev
```
- http://localhost:3000/module/module-01-environment-setup
- ディレクトリ構造部分を確認

### 2. **ビルドテスト**

```bash
npm run build
```

エラーがないか確認。

### 3. **デプロイ準備（オプション）**

Vercelへのデプロイ:
```bash
vercel --prod
```

---

## 🐛 既知の問題

### 解決済み
- ✅ タイトル重複（解決済み - `lib/markdown.ts`で削除処理）
- ✅ レスポンシブ対応（解決済み - viewport設定、min-w-0追加）
- ✅ 横スクロール（解決済み - overflow-x: hidden）

### 未解決
- ⚠️ **テキストコントラスト** - コードブロック内のテキストが見づらい
  - 原因: 複数回の修正で状態が不明瞭
  - 対処: 元の状態に戻す必要あり

---

## 📝 重要な技術的注意点

### 1. Next.js 15のparams

`app/module/[slug]/page.tsx`で、`params`はPromiseになっています：

```typescript
export default async function ModulePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; // ← 必須
  // ...
}
```

### 2. viewport設定

`app/layout.tsx`で設定済み：

```typescript
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

これがないとレスポンシブが効きません。

### 3. Flexboxの`min-w-0`

Flexboxの子要素には`min-w-0`が必要：

```tsx
<main className="flex-1 md:ml-64 w-full overflow-x-hidden min-w-0">
```

これがないと、内容が親要素を超えてはみ出します。

### 4. マークダウン処理

`lib/markdown.ts`で以下を削除：
- 最初のh1タイトル
- 所要時間の行
- 難易度の行
- 最初の区切り線

これにより、モジュールページで重複しません。

---

## 🔍 デバッグ方法

### コントラスト確認

1. ブラウザの開発者ツールを開く（F12）
2. コードブロックを右クリック → 検証
3. Computed Stylesタブで`color`を確認
4. 期待値: `#ffffff`（白）

### モバイルビュー確認

1. 開発者ツール（F12）
2. デバイスツールバー（Ctrl+Shift+M / Cmd+Shift+M）
3. iPhone 12 Pro / Pixel 5などで確認
4. 横スクロールしないか確認

---

## 📞 次のClaude Codeへの指示例

```
以下の問題を修正してください：

【問題】
コードブロック内のディレクトリ構造（ツリー）のテキストが薄くて見づらい。

【対処】
1. app/globals.cssを確認
   - 余計なスタイルが追加されていないか
   - pre code のcolor設定を確認

2. components/MarkdownRenderer.tsxを確認
   - コードブロックのクラス名を確認
   - text-whiteになっているか

3. 目標
   - コードブロック（黒背景）に白いテキスト
   - ディレクトリ構造が見やすい
   - シンプルに

【確認方法】
npm run dev
http://localhost:3000/module/module-01-environment-setup
ディレクトリ構造部分を確認
```

---

## 📚 参考情報

### 講座の内容
- 全8モジュール（Module 1-7 + Module 8応用編）
- 合計約5,990行のマークダウン
- 非エンジニア向けのNext.jsポートフォリオ制作講座

### Module 8の特徴
- Python + FFMPEGでの動画圧縮
- 仮想環境（venv）の使い方
- 100MB以下に圧縮する方法
- WSL環境での実行推奨

---

**引き継ぎ完了。次のセッションで修正を進めてください。**
