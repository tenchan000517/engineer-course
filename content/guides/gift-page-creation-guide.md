# 特典ページ作成ガイド

特典付きInstagram投稿の特典ページを作成するためのガイド。

---

## 前提知識

### 特典ページとは

Instagram投稿を見たユーザーがコメントすると、DMで自動送信されるリンク先のページ。

```
投稿を見る → コメントする → DMで特典URLが届く → 特典ページを閲覧
```

### ファイル構成

```
content/gifts/
├── genspark-guide.md      # 特典ページ（マークダウン）
├── ai-image-7-elements.md
└── ...

public/images/genspark/    # 画像（特典ごとにディレクトリ）
├── slide-01-cover.png
└── ...
```

### URL形式

```
/gift/{slug}
例: /gift/genspark-guide
```

`slug`はファイル名から`.md`を除いたもの。

---

## 作成手順

### Step 1: 特典内容を決める

投稿の台本（`content/guides/scripts-ranking-videos.md`など）を確認し、何を特典にするか決める。

**確認事項**:
- 投稿で何を紹介しているか
- ユーザーが欲しいと思うものは何か
- 既存の講座から流用できる素材はあるか

### Step 2: 既存素材を確認する

特典に関連する既存の講座・画像を確認する。一から作るより、既存素材を活用する。

**確認場所**:

| 用途 | 場所 |
|------|------|
| 講座テキスト | `content/modules/` |
| 画像 | `public/` 配下の各ディレクトリ |
| 参考台本 | `content/guides/` |

**例: NanoBanana関連**
```
content/modules/nanobanana-beginner/
public/nanobanana-image-generation/images/
```

### Step 3: 特典ページを作成

`content/gifts/` にマークダウンファイルを作成。

#### ファイル名

```
{ツール名}-{内容}.md
例: genspark-guide.md
例: nanobanana-quick-start.md
```

#### 基本構成

```markdown
# タイトル

導入文（1-2文）

---

## 目次

1. [セクション1](#セクション1)
2. [セクション2](#セクション2)
...

---

## セクション1: 概要

### 基本的な使い方

1. 手順1
2. 手順2
3. 手順3

![スクリーンショット](/images/xxx/screenshot.png)

---

## セクション2: 詳細

...

---

## 参考リンク

- [公式サイト](https://example.com)
```

### Step 4: 画像を配置

特典専用の画像がある場合:

```bash
# ディレクトリ作成
mkdir -p public/images/{特典名}/

# 画像コピー
cp /path/to/image.png public/images/{特典名}/
```

既存講座の画像を使う場合:

```markdown
![説明](/nanobanana-image-generation/images/module-03-sample-cat.png)
```

画像パスは `/` から始める（publicディレクトリからの相対パス）。

### Step 5: デプロイ

```bash
git add content/gifts/{特典名}.md public/images/{特典名}/
git commit -m "feat: {特典名}特典ページを追加"
git push origin master
vercel --prod
```

---

## 作成時のルール

### 初心者向けに書く

| NG | OK |
|----|-----|
| Python環境を構築して... | ブラウザからアクセスして... |
| APIキーを取得して... | Googleアカウントでログインして... |
| コードを実行して... | ボタンをクリックして... |

**原則**: プログラミング不要で使える方法があれば、そちらを優先する。

### 実用的な例を使う

| NG | OK |
|----|-----|
| すっぴん美女の画像 | ビジネス用プロフィール画像 |
| 抽象的な風景 | SNS投稿用のおしゃれな画像 |
| 意味不明な例 | ユーザーが実際に使いたい例 |

**原則**: ユーザーが「これ作りたい」と思える例を使う。

### 既存画像を活用する

新規画像を作成する前に、既存講座の画像を確認する。

```bash
# 画像を探す
ls public/nanobanana-image-generation/images/
ls public/instagram-dm-automation/
```

同じ内容の画像が既にあれば、そのパスを使う。

### ツール説明のコツ

**Gensparkの場合**:
- リサーチ機能は「出典付き」が強み
- 資料作成は「リサーチしてから作成」を指示する
- データがない場合は「空欄にする」のではなく「リサーチさせる」

**プロンプトテンプレートの場合**:
- `★ここを書き換えてください` で入力箇所を明示
- 汎用的な例にする（特定の会社・業種に依存しない）
- 必須項目と任意項目を分ける

### 禁止事項

| 禁止 | 理由 |
|------|------|
| 絵文字の使用 | デザイン統一のため。lucide-reactアイコンを使う |
| インラインスタイル | コンポーネント化する |
| 透過背景のカード | 見えにくい。白背景を使う |

---

## Discord CTAについて

### 自動表示される

`components/GiftDiscordCTA.tsx` が全特典ページのフッターに自動表示される。

マークダウン内に Discord CTA を書く必要はない。

### カスタマイズしたい場合

`app/gift/[slug]/page.tsx` を編集:

```tsx
import GiftDiscordCTA from '@/components/GiftDiscordCTA';

// 表示しない場合
// <GiftDiscordCTA /> を削除

// 条件付き表示
{slug !== 'some-slug' && <GiftDiscordCTA />}
```

---

## 投稿一覧への登録

特典ページ作成後、`docs/archive/gift-post-list.md` に追加:

```markdown
| # | タイトル | 型 | トリガーワード | 特典ページ slug | 状態 |
|---|----------|-----|----------------|-----------------|------|
| 0 | AIツールランキング（Genspark） | 型C | 好きな季節 | genspark-guide | ✅ |
```

---

## チェックリスト

特典ページ作成時に確認:

- [ ] 初心者でも迷わず使える説明になっているか
- [ ] 実用的な例を使っているか
- [ ] 既存の画像を最大限活用したか
- [ ] プロンプトテンプレートは汎用的か
- [ ] 入力箇所が明示されているか
- [ ] 絵文字を使っていないか
- [ ] インラインスタイルを使っていないか
- [ ] 投稿一覧に登録したか

---

## 参考: 既存特典ページ

| ファイル | 内容 | 参考ポイント |
|----------|------|-------------|
| `genspark-guide.md` | Genspark初心者ガイド | 複数ツール解説、スライド見本、講座画像引用 |
| `nanobanana-quick-start.md` | NanoBanana簡易ガイド | シンプルな構成 |
| `ai-image-7-elements.md` | 画像生成の7要素 | プロンプト解説 |

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-06 | 初版作成 |
