# Next.js App Router への GA4 実装

**所要時間**: 30-45分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Next.js公式の `@next/third-parties` パッケージを使ったGA4実装
- 環境変数による測定IDの安全な管理
- ページビュー計測の動作確認
- GA4リアルタイムレポートでの確認方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Next.js App Router にGA4を正しく実装できる
- 環境変数を使って測定IDを管理できる
- GA4でリアルタイムにアクセス計測ができる
- 本番環境とローカル環境で設定を分けられる

---

## 目次

- [セクション1: 事前準備](#セクション1-事前準備)
- [セクション2: パッケージのインストール](#セクション2-パッケージのインストール)
- [セクション3: 環境変数の設定](#セクション3-環境変数の設定)
- [セクション4: GA4コンポーネントの実装](#セクション4-ga4コンポーネントの実装)
- [セクション5: 動作確認](#セクション5-動作確認)
- [セクション6: 本番環境へのデプロイ](#セクション6-本番環境へのデプロイ)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [次のステップ](#次のステップ)

---

## 事前準備

### 必要なもの

- GA4の測定ID（G-XXXXXXXXXX形式）
- Next.js 14以上のプロジェクト（App Router使用）
- Node.js 18以上
- VSCode または お好みのエディタ

### 確認事項

```bash
# Next.jsのバージョン確認
npm list next
```

Next.js 14以上であることを確認してください。

---

## セクション1: 事前準備

### プロジェクト構造の確認

Next.js App Router のプロジェクトは以下の構造になっています：

```
your-project/
├── app/
│   ├── layout.tsx      ← GA4を設定するファイル
│   ├── page.tsx
│   └── ...
├── package.json
├── .env.local          ← 環境変数ファイル（作成します）
└── ...
```

### 測定IDの確認

前のモジュールで取得した測定IDを用意してください：

```
G-XXXXXXXXXX
```

---

## セクション2: パッケージのインストール

### @next/third-parties のインストール

Next.js公式が提供する `@next/third-parties` パッケージを使用します。

このパッケージは、サードパーティスクリプト（GA4、GTMなど）を最適化された形で読み込むためのコンポーネントを提供します。

### インストールコマンド

プロジェクトのルートディレクトリで以下を実行：

```bash
npm install @next/third-parties@latest
```

### インストール確認

```bash
npm list @next/third-parties
```

出力例：
```
your-project@0.1.0
└── @next/third-parties@15.x.x
```

---

## セクション3: 環境変数の設定

### 環境変数ファイルの作成

測定IDを直接コードに書くのではなく、環境変数で管理します。

これにより：
- セキュリティが向上
- 環境ごとに異なるIDを使い分けられる
- コードの変更なしにIDを更新できる

### .env.local ファイルの作成

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Windows (PowerShell)
New-Item -Path ".env.local" -ItemType File

# Mac/Linux
touch .env.local
```

### 環境変数の記述

`.env.local` ファイルを開き、以下を記述：

```env
# Google Analytics 4 測定ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **重要**: `G-XXXXXXXXXX` を実際の測定IDに置き換えてください

### NEXT_PUBLIC_ プレフィックスについて

`NEXT_PUBLIC_` で始まる環境変数は、ブラウザ側（クライアント）でも使用できます。

GA4はブラウザで動作するため、このプレフィックスが必要です。

| プレフィックス | サーバー | ブラウザ |
|---------------|---------|---------|
| なし | ✅ | ❌ |
| NEXT_PUBLIC_ | ✅ | ✅ |

### .gitignore の確認

`.env.local` がGitで管理されていないことを確認：

```bash
# .gitignore に以下が含まれているか確認
.env*.local
```

---

## セクション4: GA4コンポーネントの実装

### layout.tsx の編集

`app/layout.tsx` ファイルを開いて編集します。

### 実装コード

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        {/* GA4の設定 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
```

### コードの解説

#### 1. インポート

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'
```

`@next/third-parties` から `GoogleAnalytics` コンポーネントをインポートします。

#### 2. コンポーネントの配置

```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

- 環境変数が設定されている場合のみGA4を読み込む
- `gaId` プロパティに測定IDを渡す
- `</body>` タグの直前に配置

#### 3. 条件付きレンダリング

```tsx
{process.env.NEXT_PUBLIC_GA_ID && (...)}
```

この書き方により、開発環境で環境変数を設定していない場合でもエラーになりません。

---

## セクション5: 動作確認

### ローカルサーバーの起動

```bash
npm run dev
```

### ブラウザでの確認

1. http://localhost:3000 を開く
2. ブラウザの開発者ツールを開く（F12キー）
3. **Network** タブを選択
4. フィルターに `google` と入力
5. ページを再読み込み

以下のようなリクエストが表示されればOK：

```
collect?v=2&tid=G-XXXXXXXXXX&...
gtag/js?id=G-XXXXXXXXXX
```

### GA4リアルタイムレポートでの確認

1. [Google Analytics](https://analytics.google.com/) にアクセス

2. 左メニューから **「レポート」** をクリック

3. **「リアルタイム」** をクリック

4. 「過去30分間のユーザー」に **1** と表示されることを確認

```
┌─────────────────────────────────────────────┐
│  リアルタイムの概要                           │
├─────────────────────────────────────────────┤
│                                             │
│  過去30分間のユーザー                         │
│  ┌───────────────────┐                      │
│  │       1           │                      │
│  │                   │                      │
│  └───────────────────┘                      │
│                                             │
│  ユーザー（1分あたり）                        │
│  [グラフ表示]                                │
│                                             │
└─────────────────────────────────────────────┘
```

### ページ遷移の確認

1. サイト内の別のページに移動
2. GA4のリアルタイムレポートで「ページタイトルとスクリーン名」を確認
3. 遷移したページが表示されることを確認

---

## セクション6: 本番環境へのデプロイ

### Vercel での環境変数設定

Vercelを使用している場合：

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス

2. 対象プロジェクトを選択

3. **「Settings」** タブをクリック

4. 左メニューから **「Environment Variables」** をクリック

5. 以下を入力：
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`（実際の測定ID）
   - **Environment**: `Production` にチェック

6. **「Save」** をクリック

### 再デプロイ

環境変数を設定したら、再デプロイが必要です：

```bash
# Gitでpushすると自動デプロイ
git add .
git commit -m "Add GA4 configuration"
git push
```

または Vercel ダッシュボードから手動で再デプロイ。

### 本番環境での確認

1. 本番URLにアクセス
2. GA4リアルタイムレポートで計測を確認

---

## トラブルシューティング

### Q: リアルタイムレポートに表示されない

**A:** 以下を確認してください：

1. **環境変数の確認**
   ```bash
   # .env.local の内容確認
   cat .env.local
   ```

2. **サーバーの再起動**
   ```bash
   # 一度停止して再起動
   # Ctrl+C で停止後
   npm run dev
   ```

3. **ブラウザのキャッシュクリア**
   - 開発者ツール > Network > 「Disable cache」にチェック

4. **広告ブロッカーの無効化**
   - AdBlockなどの拡張機能がGA4をブロックしている可能性

### Q: 「NEXT_PUBLIC_GA_ID is not defined」エラー

**A:** 環境変数の設定を確認：

1. `.env.local` ファイルがプロジェクトルートにあるか
2. 変数名が正確か（`NEXT_PUBLIC_GA_ID`）
3. サーバーを再起動したか

### Q: 開発環境でGA4を無効にしたい

**A:** 本番環境のみで有効にする設定：

```tsx
// app/layout.tsx
{process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

### Q: ページビュー以外のイベントも計測したい

**A:** カスタムイベントの送信：

```tsx
// クライアントコンポーネントで使用
'use client'

import { sendGAEvent } from '@next/third-parties/google'

// ボタンクリック時など
<button onClick={() => sendGAEvent('event', 'button_click', {
  category: 'engagement',
  label: 'signup_button'
})}>
  サインアップ
</button>
```

---

## まとめ

このモジュールでは、以下のことを学びました：

- ✅ `@next/third-parties` パッケージのインストール
- ✅ 環境変数（.env.local）での測定ID管理
- ✅ layout.tsx への GoogleAnalytics コンポーネント実装
- ✅ 開発環境での動作確認方法
- ✅ Vercelでの本番環境設定
- ✅ GA4リアルタイムレポートでの確認

---

## 次のステップ

次のモジュールでは、**Google Search Console（サーチコンソール）の登録と設定** を行います。

以下の内容を学びます：
- サーチコンソールへのサイト登録
- 所有権の確認方法
- GA4との連携設定

---

## 参考リンク

- [Next.js公式: Google Analytics](https://nextjs.org/docs/messages/next-script-for-ga)
- [@next/third-parties ドキュメント](https://nextjs.org/docs/app/guides/analytics)
- [GA4イベント計測リファレンス](https://developers.google.com/analytics/devguides/collection/ga4)
