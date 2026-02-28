# Next.js サイトマップの作成とサーチコンソールへの送信

**所要時間**: 30-45分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- サイトマップ（sitemap.xml）の役割と重要性
- Next.js App Router での sitemap.ts 作成方法
- 動的サイトマップの生成（ブログ記事など）
- サーチコンソールへのサイトマップ送信

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- sitemap.xml の構造を理解できる
- Next.js で静的・動的サイトマップを生成できる
- サーチコンソールにサイトマップを送信できる
- サイトマップの更新と管理ができる

---

## 目次

- [セクション1: サイトマップとは](#セクション1-サイトマップとは)
- [セクション2: 静的サイトマップの作成](#セクション2-静的サイトマップの作成)
- [セクション3: 動的サイトマップの作成](#セクション3-動的サイトマップの作成)
- [セクション4: サイトマップの確認](#セクション4-サイトマップの確認)
- [セクション5: サーチコンソールへの送信](#セクション5-サーチコンソールへの送信)
- [セクション6: robots.txt の設定](#セクション6-robotstxt-の設定)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [次のステップ](#次のステップ)

---

## 事前準備

### 必要なもの

- Next.js 14以上のプロジェクト（App Router使用）
- サーチコンソールに登録済みのサイト
- VSCode または お好みのエディタ

### 推奨

- 本番環境にデプロイ可能な状態

---

## セクション1: サイトマップとは

### 概要

**サイトマップ（sitemap.xml）** は、Webサイト内のページ一覧をXML形式で記述したファイルです。

検索エンジンのクローラー（Googlebot など）がサイトを効率的に巡回するために使用されます。

### サイトマップの役割

```
┌─────────────────────────────────────────────┐
│  Googlebot                                  │
│     │                                       │
│     ▼                                       │
│  sitemap.xml を読み込む                      │
│     │                                       │
│     ├── /                                   │
│     ├── /about                              │
│     ├── /blog/post-1                        │
│     ├── /blog/post-2                        │
│     └── /contact                            │
│     │                                       │
│     ▼                                       │
│  各ページを効率的にクロール                   │
└─────────────────────────────────────────────┘
```

### なぜサイトマップが重要か

1. **クロール効率の向上** - 重要なページを見逃さない
2. **新規ページの発見** - 内部リンクがなくても発見される
3. **更新情報の通知** - 最終更新日でページの鮮度を伝える
4. **SEO対策** - インデックス登録を促進

### サイトマップのXML構造

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-02-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 各タグの説明

| タグ | 必須 | 説明 |
|------|------|------|
| `<loc>` | ✅ | ページのURL |
| `<lastmod>` | ❌ | 最終更新日（YYYY-MM-DD形式） |
| `<changefreq>` | ❌ | 更新頻度（daily, weekly, monthlyなど） |
| `<priority>` | ❌ | 重要度（0.0〜1.0） |

> **注意**: Googleは `changefreq` と `priority` を無視すると公式に発表しています。`loc` と `lastmod` のみで十分です。

---

## セクション2: 静的サイトマップの作成

### 方法1: 静的XMLファイル（シンプル）

小規模サイトの場合、`public` フォルダに直接XMLファイルを配置できます。

#### ファイルの作成

`public/sitemap.xml` を作成：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.vercel.app</loc>
    <lastmod>2026-02-15</lastmod>
  </url>
  <url>
    <loc>https://your-site.vercel.app/about</loc>
    <lastmod>2026-02-10</lastmod>
  </url>
  <url>
    <loc>https://your-site.vercel.app/contact</loc>
    <lastmod>2026-02-01</lastmod>
  </url>
</urlset>
```

#### メリット・デメリット

- ✅ シンプルで分かりやすい
- ❌ ページ追加時に手動更新が必要
- ❌ 動的なページに対応できない

### 方法2: sitemap.ts を使用（推奨）

Next.js App Router の機能を使って、TypeScriptで動的にサイトマップを生成します。

#### ファイルの作成

`app/sitemap.ts` を作成：

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-site.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
```

#### コードの解説

```typescript
import { MetadataRoute } from 'next'
```
Next.jsが提供する型定義をインポート

```typescript
export default function sitemap(): MetadataRoute.Sitemap
```
関数名は必ず `sitemap` とする

```typescript
const baseUrl = 'https://your-site.vercel.app'
```
サイトのベースURLを定義

```typescript
return [...]
```
URLオブジェクトの配列を返す

---

## セクション3: 動的サイトマップの作成

### ブログや商品ページがある場合

データベースやCMSから記事一覧を取得してサイトマップを生成します。

#### 例: ブログ記事を含むサイトマップ

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

// 記事データを取得する関数（例）
async function getAllPosts() {
  // 実際はデータベースやCMSから取得
  return [
    { slug: 'first-post', updatedAt: '2026-02-10' },
    { slug: 'second-post', updatedAt: '2026-02-12' },
    { slug: 'third-post', updatedAt: '2026-02-15' },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-site.vercel.app'

  // 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ブログ記事を取得
  const posts = await getAllPosts()

  // 記事ページのサイトマップエントリ
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // 固定ページと記事ページを結合
  return [...staticPages, ...blogPages]
}
```

### 環境変数でベースURLを管理

本番と開発環境でURLが異なる場合：

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-site.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    // ...
  ]
}
```

`.env.local` に追加：

```env
NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app
```

### 大規模サイト向け: 複数サイトマップ

50,000URL以上ある場合は、サイトマップを分割します：

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // 記事の総数を取得
  const totalPosts = 150000
  const postsPerSitemap = 50000
  const numberOfSitemaps = Math.ceil(totalPosts / postsPerSitemap)

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const end = start + 50000
  const posts = await getPostsRange(start, end)

  return posts.map((post) => ({
    url: `https://your-site.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))
}
```

生成されるURL:
- `/sitemap/0.xml`
- `/sitemap/1.xml`
- `/sitemap/2.xml`

---

## セクション4: サイトマップの確認

### ローカルでの確認

開発サーバーを起動：

```bash
npm run dev
```

ブラウザで確認：

```
http://localhost:3000/sitemap.xml
```

### 期待される出力

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.vercel.app</loc>
    <lastmod>2026-02-15T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://your-site.vercel.app/about</loc>
    <lastmod>2026-02-15T12:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- 他のURL -->
</urlset>
```

### 本番環境での確認

デプロイ後、以下のURLで確認：

```
https://your-site.vercel.app/sitemap.xml
```

---

## セクション5: サーチコンソールへの送信

### ステップ1: サーチコンソールにアクセス

1. [Google Search Console](https://search.google.com/search-console/) にアクセス

2. 対象のプロパティを選択

### ステップ2: サイトマップページを開く

1. 左メニューから **「インデックス作成」** を展開

2. **「サイトマップ」** をクリック

### ステップ3: サイトマップURLの入力

1. **「新しいサイトマップの追加」** に以下を入力：
   ```
   sitemap.xml
   ```

2. **「送信」** をクリック

```
┌─────────────────────────────────────────────────────────────┐
│  サイトマップ                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  新しいサイトマップの追加                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │ https://your-site.vercel.app/  sitemap.xml      │ [送信] │
│  └─────────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### ステップ4: 送信結果の確認

送信後、以下のステータスが表示されます：

| ステータス | 意味 |
|-----------|------|
| **成功** | サイトマップが正常に処理された |
| **取得できませんでした** | URLにアクセスできない |
| **解析エラー** | XMLの形式に問題がある |

### 成功時の表示

```
┌─────────────────────────────────────────────────────────────┐
│  送信されたサイトマップ                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  サイトマップ        タイプ      送信日       ステータス       │
│  ─────────────────────────────────────────────────────      │
│  sitemap.xml        サイトマップ  2026/02/15    ✅ 成功      │
│                                                             │
│  検出されたURL: 10                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## セクション6: robots.txt の設定

### robots.txt とは

クローラーに対して、クロールの許可・禁止を指示するファイルです。

サイトマップの場所を通知する役割もあります。

### Next.js での robots.txt 作成

`app/robots.ts` を作成：

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-site.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### 生成される robots.txt

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://your-site.vercel.app/sitemap.xml
```

### 確認

```
http://localhost:3000/robots.txt
```

### robots.txt の設定オプション

```typescript
// 複数のルールを設定
return {
  rules: [
    {
      userAgent: 'Googlebot',
      allow: ['/'],
      disallow: ['/private/'],
    },
    {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/api/', '/admin/', '/private/'],
    },
  ],
  sitemap: `${baseUrl}/sitemap.xml`,
}
```

---

## トラブルシューティング

### Q: サイトマップが404エラーになる

**A:** 以下を確認してください：

1. ファイル名が正確か（`sitemap.ts` または `sitemap.xml`）
2. `app` ディレクトリ直下に配置されているか
3. 開発サーバーを再起動したか

### Q: サーチコンソールで「取得できませんでした」エラー

**A:** 以下を確認してください：

1. 本番環境にデプロイされているか
2. URLが正しいか（https と http の違い）
3. サイトが公開されているか（認証がかかっていないか）

### Q: 「解析エラー」が表示される

**A:** XMLの形式に問題があります：

1. ブラウザでサイトマップを開いてエラーを確認
2. XML Validatorでチェック
3. TypeScriptの型エラーがないか確認

### Q: URLが検出されない

**A:** 以下を確認してください：

1. `<loc>` タグのURLが正しいか
2. HTTPSで指定しているか
3. 実際にアクセス可能なURLか

### Q: 最終更新日が反映されない

**A:** `lastModified` の値を確認：

```typescript
// 正しい形式
lastModified: new Date('2026-02-15')
lastModified: new Date()
lastModified: '2026-02-15'

// エラーになる形式
lastModified: '2026/02/15' // スラッシュ区切りは非推奨
```

---

## まとめ

このモジュールでは、以下のことを学びました：

- ✅ サイトマップの役割と構造の理解
- ✅ Next.js App Router での sitemap.ts 作成
- ✅ 静的ページと動的ページのサイトマップ生成
- ✅ サーチコンソールへのサイトマップ送信
- ✅ robots.txt の設定

---

## 次のステップ

次のモジュールでは、**URL検査とインデックス登録リクエスト** を行います。

以下の内容を学びます：
- URL検査ツールの使い方
- インデックス登録のリクエスト方法
- インデックスされない場合の対処法
- ページの問題の診断

---

## 参考リンク

- [Next.js公式: Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google: サイトマップについて](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [sitemaps.org プロトコル仕様](https://www.sitemaps.org/protocol.html)
