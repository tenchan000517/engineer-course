# 基本UIの構築

**所要時間**: 90分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- セクション設計の考え方
- ヒーローセクションの実装
- Aboutセクションの作成
- ギャラリーセクションの構築
- Tailwind CSSの基本
- レスポンシブデザインの実装
- Claude Codeへの効果的な指示の出し方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- ポートフォリオサイトの基本構造を理解できる
- ヒーロー、About、Galleryの各セクションを実装できる
- Tailwind CSSを使ってスタイリングできる
- レスポンシブデザインを実装できる
- Claude Codeに適切な指示を出してUIを構築できる
- 開発者ツールでモバイル表示を確認できる

---

## 目次

- [セクション1: セクション設計の基本](#セクション1-セクション設計の基本)
- [セクション2: Claude Codeでの開発準備](#セクション2-claude-codeでの開発準備)
- [セクション3: ヒーローセクションの実装](#セクション3-ヒーローセクションの実装)
- [セクション4: Aboutセクションの実装](#セクション4-aboutセクションの実装)
- [セクション5: ギャラリーセクションの実装](#セクション5-ギャラリーセクションの実装)
- [セクション6: レスポンシブデザインの確認](#セクション6-レスポンシブデザインの確認)
- [セクション7: デザインの微調整](#セクション7-デザインの微調整)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

以下が完了していることを確認してください：

- [ ] モジュール3が完了している
- [ ] 画像・動画素材が`public`フォルダに配置されている
- [ ] 開発サーバーが起動できる（`npm run dev`）
- [ ] ブラウザで`http://localhost:3000`にアクセスできる

---

## セクション1: セクション設計の基本

### Webサイトの「セクション」とは？

**セクション**とは、ページを構成する**意味のあるまとまり**です。

1ページのポートフォリオサイト（シングルページ）は、通常以下のようなセクションで構成されます：

```
┌─────────────────────┐
│  Hero Section       │ ← 最初に目に入る大きなビジュアル
├─────────────────────┤
│  About Section      │ ← 自己紹介
├─────────────────────┤
│  Gallery Section    │ ← 作品ギャラリー
├─────────────────────┤
│  Contact Section    │ ← 連絡先
└─────────────────────┘
```

### 各セクションの役割

#### 1. **ヒーローセクション（Hero Section）**

**役割**: 訪問者が最初に見る部分。第一印象を決める最重要セクション。

**典型的な内容:**
- 大きな背景画像または動画
- キャッチコピー（自分を一言で表す）
- 名前・職業
- CTAボタン（例: 「作品を見る」）

**例:**
```
┌────────────────────────────────┐
│                                │
│      クリエイティブデザイナー    │
│         山田太郎               │
│                                │
│       [ 作品を見る ]           │
│                                │
└────────────────────────────────┘
```

#### 2. **Aboutセクション**

**役割**: 自分のことを知ってもらう。

**典型的な内容:**
- プロフィール写真
- 経歴・スキル
- 得意分野
- 実績

#### 3. **ギャラリーセクション（Gallery/Works/Portfolio）**

**役割**: 作品を見せる。最も重要なセクション。

**典型的な内容:**
- 作品のサムネイル画像
- グリッドレイアウト（2列、3列、4列など）
- 画像または動画
- 作品タイトル・説明（任意）

#### 4. **コンタクトセクション（Contact）**

**役割**: 連絡を取ってもらう。

**典型的な内容:**
- メールアドレス
- SNSリンク（Twitter、Instagram、GitHubなど）
- お問い合わせフォーム（任意）

### 一般的なセクション構成パターン

**パターン1: ミニマル**
```
Hero → Gallery → Contact
```

**パターン2: スタンダード**
```
Hero → About → Gallery → Contact
```

**パターン3: 詳細**
```
Hero → About → Skills → Gallery → Testimonials → Contact
```

**このモジュールでの方針:**
スタンダードな構成（Hero → About → Gallery）を採用します。

### セクション分けの重要性

**メリット:**
- **視覚的に整理される**: 情報が見やすくなる
- **コードが管理しやすい**: 各セクションを独立して編集できる
- **SEO対策**: セマンティックHTML（意味のあるタグ）を使える
- **アンカーリンク**: 「Aboutへジャンプ」などのナビゲーションが可能

### チェックポイント

- [ ] セクションの概念を理解した
- [ ] Hero、About、Galleryの役割を理解した
- [ ] セクション構成のパターンを知った

---

## セクション2: Claude Codeでの開発準備

### 作業の進め方

このモジュールでは、**Claude Code**を使ってUIを構築していきます。

**従来の方法:**
1. HTMLを手書き
2. CSSを手書き
3. ブラウザで確認
4. 修正を繰り返す

**Claude Codeを使う方法:**
1. Claude Codeに「こんなセクションを作りたい」と伝える
2. Claude Codeがコードを生成
3. ブラウザで確認
4. 気になる点をClaude Codeに伝えて修正

→ **圧倒的に効率的！**

### Claude Codeへの指示のコツ

#### ❌ 悪い指示例

```
ヒーローセクションを作って
```

→ 抽象的すぎて、思った通りにならない可能性が高い

#### ✅ 良い指示例

```
src/app/page.tsxに、以下の内容のヒーローセクションを作成してください：

- 全画面表示（高さ100vh）
- 背景は黒（#000000）
- 中央に白文字で「クリエイティブデザイナー」と表示
- その下に「山田太郎」と表示
- シンプルでモダンなデザイン
```

→ 具体的なので、イメージに近いものができる

#### 指示に含めるべき要素

1. **場所**: どのファイルを編集するか（`src/app/page.tsx`など）
2. **内容**: 何を表示するか（テキスト、画像など）
3. **デザイン**: 色、サイズ、レイアウト
4. **雰囲気**: モダン、シンプル、かっこいい、などのキーワード

### 事前確認: 開発サーバーの起動

ターミナルで開発サーバーを起動してください：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いておきます。

### VSCodeの画面配置

**推奨レイアウト:**
- 左: ファイルエクスプローラー + Claude Codeパネル
- 右: コードエディタ
- 下: ターミナル

**ターミナルを右側に配置する方法:**
1. ターミナルタブを右クリック
2. 「パネルの位置を移動」→ 「右」

これで、Claude Codeとターミナルを同時に見ながら作業できます。

### チェックポイント

- [ ] 開発サーバーが起動している
- [ ] ブラウザで`localhost:3000`を開いている
- [ ] Claude Codeパネルを開いている
- [ ] 効果的な指示の出し方を理解した

---

## セクション3: ヒーローセクションの実装

### ヒーローセクションとは（復習）

サイトの**第一印象**を決める、最も目立つセクションです。

**今回作るヒーローセクション:**
- 全画面表示
- 中央にテキスト（キャッチコピー + 名前）
- シンプルでモダンなデザイン

### Claude Codeに指示を出す

Claude Codeパネルを開いて、以下のように指示してください：

```
src/app/page.tsxを編集して、ポートフォリオサイトのヒーローセクションを作成してください。

要件：
- 全画面表示（高さ100vh）
- 背景色は黒（#000000）
- 中央に以下のテキストを白色で表示：
  - 「Portfolio」（大きめのフォント）
  - 「あなたの名前」（中くらいのフォント）
- シンプルでモダンなデザイン
- Tailwind CSSを使用
```

**ポイント:**
- 「あなたの名前」の部分は、実際の名前に置き換えてください
- 職業名（例: Web Designer, Photographer）を入れてもOK

### Claude Codeの応答を確認

Claude Codeが`page.tsx`を編集する提案をしてくれます。

**提案内容の例:**
```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Portfolio</h1>
        <p className="text-2xl">山田太郎</p>
      </div>
    </div>
  );
}
```

内容を確認して、良さそうであれば**承認**してください。

### ブラウザで確認

保存されると、ブラウザが自動的にリロードされて、新しいヒーローセクションが表示されます。

**確認ポイント:**
- [ ] 背景が黒になっている
- [ ] テキストが中央に表示されている
- [ ] テキストが白色で見やすい
- [ ] 全画面表示になっている

### Tailwind CSSのクラスを理解する

Claude Codeが生成したコードには、Tailwind CSSのクラスが含まれています。

```tsx
className="min-h-screen bg-black text-white flex items-center justify-center"
```

**各クラスの意味:**

| クラス | 意味 |
|--------|------|
| `min-h-screen` | 最小高さを画面全体（100vh）にする |
| `bg-black` | 背景色を黒にする |
| `text-white` | 文字色を白にする |
| `flex` | Flexboxレイアウトを使用 |
| `items-center` | 垂直方向中央揃え |
| `justify-center` | 水平方向中央揃え |

```tsx
className="text-6xl font-bold mb-4"
```

| クラス | 意味 |
|--------|------|
| `text-6xl` | フォントサイズを非常に大きく |
| `font-bold` | 太字 |
| `mb-4` | 下マージン（margin-bottom）を4単位 |

**Tailwind CSSの特徴:**
- クラス名だけでスタイリングが完結
- CSSファイルを書かなくていい
- クラス名から直感的にスタイルがわかる

### 背景画像を追加する（任意）

シンプルな黒背景も良いですが、背景画像を追加することもできます。

**Claude Codeへの指示例:**

```
ヒーローセクションに背景画像を追加してください。
画像は /img/works/project-01.jpg を使用します。
画像の上にテキストが見やすいように、暗いオーバーレイを追加してください。
```

Claude Codeが以下のようなコードを生成します：

```tsx
<div className="min-h-screen bg-black text-white flex items-center justify-center relative">
  <div className="absolute inset-0 bg-cover bg-center opacity-30"
       style={{ backgroundImage: "url('/img/works/project-01.jpg')" }}>
  </div>
  <div className="relative z-10 text-center">
    <h1 className="text-6xl font-bold mb-4">Portfolio</h1>
    <p className="text-2xl">山田太郎</p>
  </div>
</div>
```

**ポイント:**
- `opacity-30`: 画像を30%の透明度にして、テキストが読みやすくする
- `relative z-10`: テキストを画像の上に表示

### チェックポイント

- [ ] ヒーローセクションが表示されている
- [ ] 全画面表示になっている
- [ ] テキストが中央に配置されている
- [ ] Tailwind CSSのクラスの意味を理解した

---

## セクション4: Aboutセクションの実装

### Aboutセクションの設計

**表示内容:**
- セクションタイトル（"About"）
- プロフィール写真
- 自己紹介文
- スキルや経歴（任意）

**レイアウト:**
- 左: プロフィール写真
- 右: テキスト

### Claude Codeに指示を出す

```
page.tsxのヒーローセクションの下に、Aboutセクションを追加してください。

要件：
- セクションタイトル「About」を中央に表示
- 背景色は白
- プロフィール写真（/img/profile/profile-photo.jpg）を左側に表示
- 右側に自己紹介文を表示：
  「Webデザイナーとして5年の経験があります。ユーザー体験を重視したデザインを得意としています。」
- 2カラムレイアウト（PC表示時）
- スマホでは1カラム（縦並び）
- 適度なパディングとマージン
```

**ポイント:**
- 自己紹介文は自分の内容に変更してください
- プロフィール写真のパスは、実際に配置した画像に合わせてください

### 生成されたコードの例

```tsx
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Portfolio</h1>
          <p className="text-2xl">山田太郎</p>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">About</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/img/profile/profile-photo.jpg"
            alt="プロフィール写真"
            className="rounded-lg w-full"
          />
          <div>
            <p className="text-lg leading-relaxed">
              Webデザイナーとして5年の経験があります。
              ユーザー体験を重視したデザインを得意としています。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
```

### コードの解説

#### セクションタグとID

```tsx
<section id="about" className="...">
```

- `<section>`: セマンティックHTML。意味のあるまとまりを示す
- `id="about"`: アンカーリンク用のID（後で「Aboutセクションへジャンプ」機能で使う）

#### レスポンシブグリッド

```tsx
className="grid md:grid-cols-2 gap-8"
```

- `grid`: CSSグリッドレイアウトを使用
- `md:grid-cols-2`: 中サイズ以上の画面で2カラムにする
  - `md:`（768px以上）で2カラム
  - それ以下（スマホ）では1カラム（デフォルト）
- `gap-8`: カラム間のスペース

#### max-widthとセンタリング

```tsx
className="max-w-6xl mx-auto"
```

- `max-w-6xl`: 最大幅を制限（大きすぎる画面で横に広がりすぎない）
- `mx-auto`: 左右マージンを自動（中央揃え）

### 画像の最適化（Next.js Image コンポーネント）

通常の`<img>`タグではなく、Next.jsの`<Image>`コンポーネントを使うとさらに最適化されます。

**Claude Codeに依頼:**

```
Aboutセクションのプロフィール写真を、Next.jsのImageコンポーネントに変更してください。
```

**変更後:**

```tsx
import Image from 'next/image';

// ...

<Image
  src="/img/profile/profile-photo.jpg"
  alt="プロフィール写真"
  width={500}
  height={500}
  className="rounded-lg"
/>
```

**メリット:**
- 自動で画像を最適化（WebPに変換など）
- 遅延読み込み（Lazy Loading）
- レスポンシブ対応

### ブラウザで確認

スクロールして、Aboutセクションが表示されることを確認してください。

**確認ポイント:**
- [ ] ヒーローセクションの下にAboutセクションがある
- [ ] タイトル「About」が表示されている
- [ ] プロフィール写真が表示されている
- [ ] 自己紹介文が表示されている

### チェックポイント

- [ ] Aboutセクションを実装できた
- [ ] 2カラムレイアウトを理解した
- [ ] Next.jsのImageコンポーネントを知った
- [ ] レスポンシブクラス（`md:`）を理解した

---

## セクション5: ギャラリーセクションの実装

### ギャラリーセクションの設計

**表示内容:**
- セクションタイトル（"Gallery" または "Works"）
- 作品画像をグリッドレイアウトで表示
- PC: 3列または4列
- スマホ: 1列または2列

### Claude Codeに指示を出す

```
Aboutセクションの下に、Galleryセクションを追加してください。

要件：
- セクションタイトル「Gallery」を中央に表示
- 背景色はグレー（#f5f5f5）
- public/img/works/ フォルダ内の画像を確認して、グリッドレイアウトで表示
- PC表示: 3列
- タブレット表示: 2列
- スマホ表示: 1列
- 画像の間に適度なスペース
- 画像はアスペクト比を保ったまま表示
```

### 生成されたコードの例

```tsx
{/* Gallery Section */}
<section id="gallery" className="py-20 px-8 bg-gray-100">
  <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <img
      src="/img/works/project-01.jpg"
      alt="作品1"
      className="w-full h-64 object-cover rounded-lg"
    />
    <img
      src="/img/works/project-02.jpg"
      alt="作品2"
      className="w-full h-64 object-cover rounded-lg"
    />
    <img
      src="/img/works/project-03.jpg"
      alt="作品3"
      className="w-full h-64 object-cover rounded-lg"
    />
  </div>
</section>
```

### レスポンシブグリッドの理解

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**ブレークポイント別の表示:**

| 画面サイズ | ブレークポイント | カラム数 |
|----------|---------------|---------|
| スマホ（〜767px） | デフォルト | 1列 |
| タブレット（768px〜1023px） | `md:` | 2列 |
| PC（1024px〜） | `lg:` | 3列 |

これにより、画面サイズに応じて自動的にレイアウトが変わります。

### object-coverの役割

```tsx
className="w-full h-64 object-cover"
```

- `w-full`: 幅100%
- `h-64`: 高さ固定（16rem = 256px）
- `object-cover`: アスペクト比を保ったまま、枠全体を埋める（はみ出た部分はトリミング）

**object-coverの効果:**

```
元の画像（縦長）:        object-cover適用後:
┌────┐                   ┌──────────┐
│    │                   │          │
│    │        →          │          │（中央部分を切り取り）
│    │                   └──────────┘
│    │
└────┘
```

**他の選択肢:**
- `object-contain`: 全体を表示（余白ができる場合がある）
- `object-fill`: 引き伸ばして埋める（アスペクト比が崩れる）

ギャラリーでは`object-cover`が推奨です。

### 画像の枚数を増やす

もっと画像を追加したい場合、Claude Codeに依頼：

```
public/img/works/ 内の全ての画像をギャラリーに表示してください。
```

または、配列を使って動的に生成：

```tsx
const works = [
  '/img/works/project-01.jpg',
  '/img/works/project-02.jpg',
  '/img/works/project-03.jpg',
  '/img/works/project-04.jpg',
  '/img/works/project-05.jpg',
  '/img/works/project-06.jpg',
];

{works.map((src, index) => (
  <img
    key={index}
    src={src}
    alt={`作品${index + 1}`}
    className="w-full h-64 object-cover rounded-lg"
  />
))}
```

### チェックポイント

- [ ] Galleryセクションが表示されている
- [ ] 画像がグリッドレイアウトで並んでいる
- [ ] レスポンシブグリッド（1列→2列→3列）を理解した
- [ ] `object-cover`の役割を理解した

---

## セクション6: レスポンシブデザインの確認

### レスポンシブデザインとは？

**レスポンシブデザイン**とは、画面サイズに応じてレイアウトが自動的に変わるデザインのことです。

- PC、タブレット、スマホ、すべてで見やすい
- 1つのHTMLで全デバイスに対応

### 開発者ツールでモバイル表示を確認

#### 1. 開発者ツールを開く

**Windows:**
- `F12`キー
- または右クリック →「検証」

**Mac:**
- `Cmd + Option + I`
- または右クリック →「検証」

#### 2. デバイスモードに切り替え

開発者ツールの左上にある**デバイスアイコン**をクリック。

または:
- Windows: `Ctrl + Shift + M`
- Mac: `Cmd + Shift + M`

#### 3. デバイスを選択

上部のドロップダウンから確認したいデバイスを選択：

- **iPhone 12 Pro** (390 x 844)
- **iPad** (768 x 1024)
- **Responsive** (自由にサイズ変更可能)

#### 4. 表示を確認

各デバイスで以下を確認してください：

**スマホ表示（〜767px）:**
- [ ] ヒーローセクションが全画面表示
- [ ] Aboutセクションが1カラム（画像とテキストが縦並び）
- [ ] Galleryが1列で表示

**タブレット表示（768px〜1023px）:**
- [ ] Aboutセクションが2カラム
- [ ] Galleryが2列で表示

**PC表示（1024px〜）:**
- [ ] Aboutセクションが2カラム
- [ ] Galleryが3列で表示

### よくある問題と対処法

#### 問題1: スマホでテキストが小さすぎる

**原因:** フォントサイズが固定されている

**解決策:**
```tsx
// 悪い例
<h1 className="text-6xl">Portfolio</h1>

// 良い例（レスポンシブ）
<h1 className="text-4xl md:text-6xl">Portfolio</h1>
```

スマホでは`text-4xl`、PC（md以上）では`text-6xl`になります。

#### 問題2: 画像がはみ出る

**原因:** 幅が固定されている

**解決策:**
```tsx
className="w-full"  // 親要素の幅に合わせる
```

#### 問題3: 余白が狭すぎる/広すぎる

**解決策:**
```tsx
// レスポンシブなパディング
className="px-4 md:px-8 lg:px-16"
```

### モバイルファーストとは？

Tailwind CSSは**モバイルファースト**の設計です。

```tsx
className="text-sm md:text-base lg:text-lg"
```

1. **デフォルト（プレフィックスなし）**: スマホ向け（〜767px）
2. **md:**（768px〜）: タブレット・PC向け
3. **lg:**（1024px〜）: 大画面PC向け

**基本方針:**
- まずスマホで見やすいスタイルを設定
- 画面が大きくなるにつれて調整

### チェックポイント

- [ ] 開発者ツールでデバイスモードを開けた
- [ ] スマホ、タブレット、PCで表示を確認した
- [ ] レスポンシブデザインの動作を理解した
- [ ] モバイルファーストの考え方を理解した

---

## セクション7: デザインの微調整

### Claude Codeで微調整する

現在のデザインで気になる点があれば、Claude Codeに伝えて修正しましょう。

**微調整の例:**

#### 例1: 余白を調整

```
Aboutセクションの上下の余白をもっと広くしてください。
```

#### 例2: フォントを変更

```
ヒーローセクションのフォントをもっと細く（font-light）してください。
```

#### 例3: 色を変更

```
Galleryセクションの背景色を白（#ffffff）に変更してください。
```

#### 例4: 画像の角を丸くする

```
Galleryの画像の角をもっと丸く（rounded-xl）してください。
```

### カラースキームの統一

**現在の配色:**
- Hero: 黒背景、白文字
- About: 白背景、黒文字
- Gallery: グレー背景、黒文字

**他の配色例:**

**モノトーン:**
```
Hero: 黒
About: 白
Gallery: 薄いグレー
```

**アクセントカラー付き:**
```
Hero: ネイビー (#1e293b)
About: 白
Gallery: 薄いブルー (#f0f9ff)
セクションタイトル: ブルー (#3b82f6)
```

Claude Codeに依頼すれば、一括で色を変更できます：

```
全体のカラースキームを以下に変更してください：
- プライマリーカラー: ネイビー (#1e293b)
- アクセントカラー: ブルー (#3b82f6)
- 背景色: 白とライトブルー (#f0f9ff) を交互に
```

### ホバーエフェクトの追加（任意）

ギャラリーの画像にマウスを乗せたときの効果を追加：

```
Galleryの画像にホバーエフェクトを追加してください：
- マウスを乗せると少し拡大（scale-105）
- スムーズなトランジション
```

**生成されるコード:**
```tsx
<img
  className="w-full h-64 object-cover rounded-lg transition-transform hover:scale-105"
  ...
/>
```

### チェックポイント

- [ ] デザインの微調整方法を理解した
- [ ] カラースキームの変更方法を知った
- [ ] ホバーエフェクトを追加できた

---

## まとめ

### このモジュールで学んだこと

- セクション設計の考え方（Hero, About, Gallery）
- Claude Codeへの効果的な指示の出し方
- ヒーローセクションの実装
- Aboutセクションの実装（2カラムレイアウト）
- Galleryセクションの実装（レスポンシブグリッド）
- Tailwind CSSの基本的なクラス
- レスポンシブデザインの確認方法
- 開発者ツールの使い方

### 重要ポイントの復習

| 項目 | 内容 |
|------|------|
| セクション構成 | Hero → About → Gallery |
| レスポンシブグリッド | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| 画像表示 | `object-cover`でアスペクト比を保つ |
| モバイルファースト | デフォルト=スマホ、`md:`=タブレット以上 |
| 開発者ツール | F12 → デバイスモードで確認 |

### 作成したページの構造

```tsx
<>
  {/* Hero Section */}
  <div className="min-h-screen ...">...</div>

  {/* About Section */}
  <section id="about" className="...">...</section>

  {/* Gallery Section */}
  <section id="gallery" className="...">...</section>
</>
```

### 次のステップ

基本的なUIができたので、次は**動きのあるUI**（インタラクティブUI）を実装します。

- スライドショー
- クリックイベント
- スクロールアニメーション

**[モジュール5: インタラクティブUI実装](./module-05-interactive-ui.md)** に進んでください。

---

## 参考資料

### Tailwind CSS
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### Next.js
- [Next.js Image最適化](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js App Router](https://nextjs.org/docs/app)

### レスポンシブデザイン
- [レスポンシブデザインの基礎（MDN）](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## よくある質問

**Q: Tailwind CSSのクラス名を覚えないといけませんか？**
A: いいえ。Claude Codeが自動で書いてくれます。よく使うもの（`flex`, `text-center`など）は自然に覚えますが、暗記は不要です。

**Q: セクションの順番を変えたい**
A: Claude Codeに「AboutとGalleryの順番を入れ替えてください」と指示すればOKです。

**Q: 4カラムのギャラリーにしたい**
A: `lg:grid-cols-3` を `lg:grid-cols-4` に変更するようClaude Codeに依頼してください。

**Q: 画像が表示されない**
A: ファイルパスが正しいか確認してください。`public/img/works/image.jpg` → `/img/works/image.jpg`（publicは省略）

**Q: スマホで見ると崩れている**
A: レスポンシブクラス（`md:`, `lg:`）が適切に設定されているか確認してください。Claude Codeに「スマホ表示を最適化してください」と依頼してもOKです。

**Q: もっと複雑なレイアウトは作れますか？**
A: もちろん可能です。Claude Codeに具体的なイメージを伝えれば、複雑なレイアウトも生成してくれます。

---

**前へ**: [モジュール3: 素材の準備とファイル管理](./module-03-asset-preparation.md)
**次へ**: [モジュール5: インタラクティブUI実装](./module-05-interactive-ui.md)
