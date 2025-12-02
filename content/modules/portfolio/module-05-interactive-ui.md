# モジュール5: インタラクティブUI実装

**所要時間**: 60-90分
**難易度**: ⭐⭐⭐⭐☆

---

## このモジュールで学ぶこと

- スライドショーの実装
- JavaScriptの基本（setInterval, useState）
- クリックイベントの処理
- モノトーン↔カラー切り替え機能
- スクロールアニメーション
- アンカーリンクとスムーススクロール
- CSSトランジション

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- ✅ ヒーローセクションにスライドショーを実装できる
- ✅ クリックイベントを処理できる
- ✅ Reactの状態管理（useState）を理解できる
- ✅ 画像のモノトーン↔カラー切り替えを実装できる
- ✅ スクロールアニメーションを追加できる
- ✅ アンカーリンクでセクション間をスムーズに移動できる
- ✅ トランジション効果で滑らかなUIを作れる

---

## 事前準備

以下が完了していることを確認してください：

- [ ] モジュール4が完了している
- [ ] Hero, About, Galleryセクションが実装されている
- [ ] 複数の画像が`public/img/`に配置されている
- [ ] 開発サーバーが起動している

---

## セクション1: スライドショーの基礎理解

### スライドショーとは？

**スライドショー**は、複数の画像を自動的に切り替えて表示する機能です。

**よく見かける場所:**
- ECサイトのトップページ
- ニュースサイトのヘッダー
- ポートフォリオサイトのヒーローセクション

**仕組み:**
```
画像1を表示 → 4秒待つ → 画像2を表示 → 4秒待つ → 画像3を表示 → ...
```

### 必要な知識

#### 1. **配列（Array）**

複数の画像パスをまとめて管理します。

```javascript
const images = [
  '/img/works/project-01.jpg',
  '/img/works/project-02.jpg',
  '/img/works/project-03.jpg'
];
```

#### 2. **useState（状態管理）**

Reactで「現在どの画像を表示しているか」を記録します。

```javascript
const [currentIndex, setCurrentIndex] = useState(0);
// currentIndex: 現在のインデックス（0, 1, 2, ...）
// setCurrentIndex: インデックスを変更する関数
```

#### 3. **setInterval（定期実行）**

一定時間ごとに処理を実行します。

```javascript
setInterval(() => {
  // この中の処理が4秒ごとに実行される
}, 4000); // 4000ミリ秒 = 4秒
```

#### 4. **useEffect（副作用）**

コンポーネントが表示されたときに1回だけ実行されます。

```javascript
useEffect(() => {
  // ここでsetIntervalを開始
}, []);
```

### 実装の流れ

```
1. 画像の配列を用意
2. 現在のインデックスを状態（useState）で管理
3. setIntervalで4秒ごとにインデックスを+1
4. 最後の画像まで行ったら0に戻る
5. 画像を表示
```

### ✅ チェックポイント

- [ ] スライドショーの仕組みを理解した
- [ ] 配列、useState、setIntervalの役割を理解した

---

## セクション2: ヒーローセクションにスライドショーを実装

### Claude Codeに指示を出す

Claude Codeパネルで以下のように指示してください：

```
ヒーローセクションに画像スライドショー機能を追加してください。

要件：
- public/img/works/ フォルダ内の画像を使用
- 4秒ごとに自動で切り替え
- フェードイン・フェードアウトのトランジション
- 画像の上にテキスト（Portfolio、名前）を重ねて表示
- 画像が暗く表示されるようにオーバーレイを追加
```

### 生成されるコードの例

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const images = [
    '/img/works/project-01.jpg',
    '/img/works/project-02.jpg',
    '/img/works/project-03.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section with Slideshow */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        ))}

        {/* Text Content */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Portfolio</h1>
          <p className="text-2xl">山田太郎</p>
        </div>
      </div>

      {/* About Section */}
      {/* ... */}
    </>
  );
}
```

### コードの詳細解説

#### 'use client' ディレクティブ

```tsx
'use client';
```

- Next.js App Routerでクライアントコンポーネントを使うための宣言
- `useState`, `useEffect`などのReact Hooksを使う場合に必要

#### 画像配列

```tsx
const images = [
  '/img/works/project-01.jpg',
  '/img/works/project-02.jpg',
  '/img/works/project-03.jpg',
];
```

- スライドショーで表示する画像のパスを配列で管理
- 画像を追加・削除する場合はここを編集

#### useState（現在のインデックス）

```tsx
const [currentIndex, setCurrentIndex] = useState(0);
```

- `currentIndex`: 現在表示している画像のインデックス（0から始まる）
- `setCurrentIndex`: インデックスを変更する関数
- `useState(0)`: 初期値は0（最初の画像）

#### useEffect（自動切り替え）

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, 4000);

  return () => clearInterval(interval);
}, []);
```

**処理の流れ:**

1. **setInterval開始**: 4秒ごとに実行
2. **インデックス更新**:
   - 最後の画像なら0に戻る
   - そうでなければ+1
3. **クリーンアップ**: コンポーネントが削除されたらタイマーを停止

**三項演算子の説明:**
```javascript
prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     条件               ? 真の場合 : 偽の場合
```

- `images.length - 1`: 配列の最後のインデックス（3枚なら2）
- 最後の画像なら0、そうでなければ次の画像

#### 画像の表示とフェード効果

```tsx
{images.map((img, index) => (
  <div
    key={index}
    className={`absolute inset-0 transition-opacity duration-1000 ${
      index === currentIndex ? 'opacity-100' : 'opacity-0'
    }`}
  >
```

**処理の流れ:**

1. **全ての画像を重ねて配置**（`absolute inset-0`）
2. **現在のインデックスと一致する画像だけ不透明に**（`opacity-100`）
3. **他の画像は透明に**（`opacity-0`）
4. **トランジションで滑らかに切り替え**（`transition-opacity duration-1000`）

**Tailwindクラスの意味:**

| クラス | 意味 |
|--------|------|
| `absolute inset-0` | 親要素いっぱいに広がる |
| `transition-opacity` | 透明度の変化をアニメーション |
| `duration-1000` | 1秒かけて変化 |
| `opacity-100` | 完全に不透明 |
| `opacity-0` | 完全に透明 |

### ブラウザで確認

保存すると、ヒーローセクションで画像が自動的に切り替わるはずです。

**確認ポイント:**
- [ ] 4秒ごとに画像が切り替わる
- [ ] フェードイン・フェードアウトで滑らかに切り替わる
- [ ] 最後の画像の次は最初の画像に戻る
- [ ] テキストが画像の上に表示されている

### よくある問題と対処法

#### 問題1: 画像が切り替わらない

**原因:** 画像のパスが間違っている

**確認方法:**
```tsx
console.log(images); // ブラウザのコンソールで確認
```

#### 問題2: 画像がチラつく

**原因:** トランジション時間が短い

**解決策:**
```tsx
className="transition-opacity duration-1000"
// duration-1000 を duration-1500 に変更
```

#### 問題3: 切り替えが速すぎる/遅すぎる

**解決策:**
```tsx
setInterval(() => { ... }, 4000);
// 4000（4秒）を変更（例: 3000 = 3秒、5000 = 5秒）
```

### ✅ チェックポイント

- [ ] スライドショーが動作している
- [ ] コードの仕組みを理解した
- [ ] 画像の切り替え間隔を調整できる

---

## セクション3: クリックイベントの実装

### クリックイベントとは？

ユーザーが要素をクリックしたときに、何か処理を実行する機能です。

**例:**
- ボタンをクリック → フォーム送信
- 画像をクリック → 拡大表示
- リンクをクリック → ページ遷移

### 実装する機能: 画像クリックでモノトーン↔カラー切り替え

ギャラリーの画像を以下のように動作させます：

```
初期状態: モノトーン（グレースケール）
↓ クリック
カラー表示
↓ もう一度クリック
モノトーンに戻る
```

### Claude Codeに指示を出す

```
Galleryセクションの画像に以下の機能を追加してください：

- 初期状態: すべての画像をモノトーン（グレースケール）で表示
- クリック時: その画像だけカラー表示に切り替え
- 再度クリック: モノトーンに戻る
- スムーズなトランジション
```

### 生成されるコードの例

```tsx
'use client';

import { useState } from 'react';

export default function Home() {
  // スライドショーのコード...

  // カラー表示する画像のインデックスを管理
  const [coloredImage, setColoredImage] = useState<number | null>(null);

  const works = [
    '/img/works/project-01.jpg',
    '/img/works/project-02.jpg',
    '/img/works/project-03.jpg',
    '/img/works/project-04.jpg',
    '/img/works/project-05.jpg',
    '/img/works/project-06.jpg',
  ];

  const toggleImageColor = (index: number) => {
    if (coloredImage === index) {
      setColoredImage(null); // すでにカラーなら元に戻す
    } else {
      setColoredImage(index); // カラーにする
    }
  };

  return (
    <>
      {/* Hero Section */}
      {/* ... */}

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-8 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`作品${index + 1}`}
              onClick={() => toggleImageColor(index)}
              className={`w-full h-64 object-cover rounded-lg cursor-pointer transition-all duration-700 ${
                coloredImage === index ? '' : 'grayscale'
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
```

### コードの詳細解説

#### 状態管理（どの画像がカラーか）

```tsx
const [coloredImage, setColoredImage] = useState<number | null>(null);
```

- `coloredImage`: カラー表示する画像のインデックス
- `null`: どの画像もカラーではない（初期状態）
- `number | null`: TypeScriptの型注釈（数値またはnull）

#### クリックハンドラー関数

```tsx
const toggleImageColor = (index: number) => {
  if (coloredImage === index) {
    setColoredImage(null); // すでにカラーなら元に戻す
  } else {
    setColoredImage(index); // カラーにする
  }
};
```

**処理の流れ:**

1. クリックされた画像のインデックスを受け取る
2. すでにその画像がカラーなら → nullにしてモノトーンに戻す
3. そうでなければ → そのインデックスを設定してカラーにする

#### onClickイベント

```tsx
onClick={() => toggleImageColor(index)}
```

- 画像がクリックされたら`toggleImageColor`を実行
- `index`を引数として渡す

#### グレースケールフィルター

```tsx
className={`... ${
  coloredImage === index ? '' : 'grayscale'
}`}
```

- **現在のインデックスと一致**（カラー表示中）→ `grayscale`なし
- **一致しない**（他の画像）→ `grayscale`を適用

**grayscaleクラス:**
- Tailwind CSSのフィルタークラス
- 画像を白黒（グレースケール）にする

#### カーソルポインター

```tsx
className="cursor-pointer"
```

- マウスを乗せたときにポインター（手の形）に変わる
- クリックできることをユーザーに示す

#### トランジション

```tsx
className="transition-all duration-700"
```

- `transition-all`: すべてのプロパティをアニメーション
- `duration-700`: 0.7秒かけて変化

### ブラウザで確認

Galleryセクションの画像をクリックしてみてください。

**確認ポイント:**
- [ ] 初期状態で全ての画像がモノトーン
- [ ] クリックするとカラーになる
- [ ] もう一度クリックするとモノトーンに戻る
- [ ] 滑らかに切り替わる

### 応用: 複数画像を同時にカラー表示

1つだけでなく、複数の画像をカラーにしたい場合：

```tsx
// 配列で管理
const [coloredImages, setColoredImages] = useState<number[]>([]);

const toggleImageColor = (index: number) => {
  if (coloredImages.includes(index)) {
    // 配列から削除
    setColoredImages(coloredImages.filter(i => i !== index));
  } else {
    // 配列に追加
    setColoredImages([...coloredImages, index]);
  }
};

// 条件判定
coloredImages.includes(index) ? '' : 'grayscale'
```

### ✅ チェックポイント

- [ ] クリックイベントを実装できた
- [ ] 状態管理（useState）の使い方を理解した
- [ ] グレースケールフィルターを使えた
- [ ] トランジションで滑らかな切り替えができた

---

## セクション4: スクロールアニメーション

### スクロールアニメーションとは？

スクロールしてセクションが画面に入ったときに、要素をフェードインさせるアニメーションです。

**効果:**
- 動きが出て、サイトが魅力的になる
- ユーザーの注目を引く
- プロフェッショナルな印象

### IntersectionObserver API

画面に要素が表示されたかどうかを検出するブラウザAPI。

**仕組み:**
```
スクロール前: セクションが画面外
↓ スクロール
セクションが画面に入る → 検出！
↓
アニメーション開始（フェードイン）
```

### Claude Codeに指示を出す

```
About Galleryセクションにスクロールアニメーションを追加してください。

要件：
- 画面にセクションが入ったときにフェードインする
- 下から少し浮き上がるように表示
- 滑らかなトランジション
```

### 生成されるコードの例

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  // ... その他の状態管理

  const aboutRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === aboutRef.current && entry.isIntersecting) {
            setIsAboutVisible(true);
          }
          if (entry.target === galleryRef.current && entry.isIntersecting) {
            setIsGalleryVisible(true);
          }
        });
      },
      { threshold: 0.1 } // 10%見えたら発火
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      {/* ... */}

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        className={`py-20 px-8 bg-white transition-all duration-1000 ${
          isAboutVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* ... */}
      </section>

      {/* Gallery Section */}
      <section
        ref={galleryRef}
        id="gallery"
        className={`py-20 px-8 bg-gray-100 transition-all duration-1000 ${
          isGalleryVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* ... */}
      </section>
    </>
  );
}
```

### コードの詳細解説

#### useRef（要素への参照）

```tsx
const aboutRef = useRef<HTMLElement>(null);
```

- DOM要素への参照を保持
- IntersectionObserverで監視するために必要

```tsx
<section ref={aboutRef} ...>
```

- `ref`属性で要素を紐付け

#### IntersectionObserver

```tsx
const observer = new IntersectionObserver(
  (entries) => {
    // 画面に入ったときの処理
  },
  { threshold: 0.1 }
);
```

**threshold（しきい値）:**
- `0.1` = 10%見えたら検出
- `0.5` = 50%見えたら検出
- `1.0` = 100%見えたら検出

#### アニメーションクラス

```tsx
className={`transition-all duration-1000 ${
  isAboutVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10'
}`}
```

**初期状態（画面外）:**
- `opacity-0`: 透明
- `translate-y-10`: 下に40px（10 × 4px）ずれている

**表示状態（画面内）:**
- `opacity-100`: 不透明
- `translate-y-0`: 元の位置

**トランジション:**
- `transition-all duration-1000`: 1秒かけて滑らかに変化

### ブラウザで確認

ページをリロードして、ゆっくりスクロールしてください。

**確認ポイント:**
- [ ] Aboutセクションが画面に入るとフェードイン
- [ ] Galleryセクションが画面に入るとフェードイン
- [ ] 下から浮き上がるように表示される

### アニメーションのバリエーション

#### 左からスライドイン

```tsx
isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
```

#### 右からスライドイン

```tsx
isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
```

#### 拡大しながらフェードイン

```tsx
isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
```

### ✅ チェックポイント

- [ ] スクロールアニメーションを実装できた
- [ ] IntersectionObserverの仕組みを理解した
- [ ] useRefの使い方を理解した
- [ ] アニメーションのバリエーションを知った

---

## セクション5: アンカーリンクとスムーススクロール

### アンカーリンクとは？

ページ内の特定の場所にジャンプするリンクです。

**例:**
```
[Aboutへ] をクリック → Aboutセクションまでスクロール
```

### 実装する機能

ヒーローセクションに「作品を見る」ボタンを追加し、クリックするとGalleryセクションにスクロールします。

### Claude Codeに指示を出す

```
ヒーローセクションに以下を追加してください：

- 「作品を見る」ボタンを中央下部に配置
- クリックするとGalleryセクションまでスムーススクロール
- ボタンはシンプルでモダンなデザイン
```

### 生成されるコードの例

```tsx
{/* Hero Section */}
<div className="relative min-h-screen flex items-center justify-center">
  {/* スライドショー */}
  {/* ... */}

  {/* Text Content */}
  <div className="relative z-10 text-center text-white">
    <h1 className="text-6xl font-bold mb-4">Portfolio</h1>
    <p className="text-2xl mb-8">山田太郎</p>

    {/* View Works Button */}
    <a
      href="#gallery"
      className="inline-block px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
    >
      作品を見る
    </a>
  </div>
</div>
```

### スムーススクロールの設定

Next.jsでは、`globals.css`にスムーススクロールを追加します。

**Claude Codeに依頼:**

```
src/app/globals.css に、スムーススクロールの設定を追加してください。
```

**追加されるCSS:**

```css
html {
  scroll-behavior: smooth;
}
```

これだけで、アンカーリンクがスムーズにスクロールするようになります。

### ブラウザで確認

「作品を見る」ボタンをクリックしてください。

**確認ポイント:**
- [ ] Galleryセクションまでスクロールする
- [ ] 滑らかにスクロールする（カクカクしない）
- [ ] ボタンにホバーすると色が変わる

### ナビゲーションメニューの追加（応用）

複数のセクションへのリンクをヘッダーに配置：

```tsx
<nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 py-4">
  <div className="max-w-6xl mx-auto flex justify-center gap-8">
    <a href="#hero" className="hover:text-blue-500 transition-colors">
      Home
    </a>
    <a href="#about" className="hover:text-blue-500 transition-colors">
      About
    </a>
    <a href="#gallery" className="hover:text-blue-500 transition-colors">
      Gallery
    </a>
  </div>
</nav>
```

### ✅ チェックポイント

- [ ] アンカーリンクを実装できた
- [ ] スムーススクロールを設定できた
- [ ] ボタンのホバーエフェクトを追加できた

---

## セクション6: CSSトランジションとアニメーション

### トランジションとは？

**トランジション**: 状態の変化を滑らかにする

```
ホバー前: 青色
↓ マウスを乗せる
ホバー後: 赤色

トランジションなし → パッと変わる
トランジションあり → じわっと変わる（0.3秒かけて）
```

### Tailwindでのトランジション

#### 基本形

```tsx
className="transition-all duration-300"
```

- `transition-all`: すべてのプロパティをアニメーション
- `duration-300`: 0.3秒かけて変化

#### 特定のプロパティだけ

```tsx
className="transition-colors duration-300"  // 色だけ
className="transition-opacity duration-300" // 透明度だけ
className="transition-transform duration-300" // 変形だけ
```

#### イージング関数

```tsx
className="transition-all duration-300 ease-in-out"
```

| イージング | 効果 |
|----------|------|
| `ease-linear` | 一定速度 |
| `ease-in` | ゆっくり始まる |
| `ease-out` | ゆっくり終わる |
| `ease-in-out` | ゆっくり始まり、ゆっくり終わる |

### ホバーエフェクトの例

#### 1. 拡大

```tsx
<div className="transition-transform hover:scale-110">
  ホバーで拡大
</div>
```

#### 2. 影を追加

```tsx
<div className="transition-shadow hover:shadow-xl">
  ホバーで影
</div>
```

#### 3. 上に浮く

```tsx
<div className="transition-transform hover:-translate-y-2">
  ホバーで浮く
</div>
```

### Galleryにホバーエフェクトを追加

Claude Codeに依頼：

```
Galleryの画像にホバーエフェクトを追加してください：
- 少し拡大（scale-105）
- 影を追加
- スムーズなトランジション
```

**生成されるコード:**

```tsx
<img
  className="w-full h-64 object-cover rounded-lg cursor-pointer
             transition-all duration-300
             hover:scale-105 hover:shadow-2xl"
  ...
/>
```

### CSSアニメーション（キーフレーム）

繰り返しアニメーションを作る場合は、`@keyframes`を使います。

**例: 点滅**

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.blink {
  animation: blink 2s infinite;
}
```

Tailwindでは`animate-`クラスで提供されています：

```tsx
<div className="animate-pulse">点滅</div>
<div className="animate-bounce">跳ねる</div>
<div className="animate-spin">回転</div>
```

### ✅ チェックポイント

- [ ] トランジションとアニメーションの違いを理解した
- [ ] ホバーエフェクトを実装できた
- [ ] イージング関数を使い分けられる

---

## 🎓 まとめ

お疲れ様でした！モジュール5が完了しました。

### このモジュールで学んだこと

- ✅ スライドショーの実装（useState, useEffect, setInterval）
- ✅ クリックイベントの処理
- ✅ モノトーン↔カラー切り替え機能
- ✅ スクロールアニメーション（IntersectionObserver）
- ✅ アンカーリンクとスムーススクロール
- ✅ CSSトランジションとホバーエフェクト

### 重要ポイントの復習

| 機能 | 使用技術 |
|------|---------|
| スライドショー | useState, useEffect, setInterval |
| クリック処理 | onClick, useState |
| グレースケール | Tailwind `grayscale` |
| スクロールアニメーション | IntersectionObserver, useRef |
| スムーススクロール | `scroll-behavior: smooth` |
| トランジション | `transition-all duration-300` |

### 実装した機能まとめ

```tsx
- ✅ ヒーローセクション: 画像スライドショー（4秒間隔）
- ✅ ギャラリー: クリックでモノトーン↔カラー切り替え
- ✅ About/Gallery: スクロールでフェードイン
- ✅ アンカーリンク: 「作品を見る」ボタン
- ✅ ホバーエフェクト: 拡大・影
```

### 次のステップ

インタラクティブなUIができたので、次は**自分でUIをカスタマイズする力**を身につけます。

- デザインシステムの理解
- Claude Codeへの効果的なプロンプト
- ベンチマークサイトの分析

**[モジュール6: UI改善とカスタマイズ](./module-06-ui-customization.md)** に進んでください。

---

## 参考資料

### React Hooks
- [useState公式ドキュメント](https://react.dev/reference/react/useState)
- [useEffect公式ドキュメント](https://react.dev/reference/react/useEffect)
- [useRef公式ドキュメント](https://react.dev/reference/react/useRef)

### Web APIs
- [IntersectionObserver（MDN）](https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API)
- [setInterval（MDN）](https://developer.mozilla.org/ja/docs/Web/API/setInterval)

### CSS
- [CSSトランジション（MDN）](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
- [CSSアニメーション（MDN）](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

---

## ❓ よくある質問

**Q: スライドショーが動かない**
A: `'use client'`ディレクティブが先頭にあるか確認してください。また、ブラウザのコンソール（F12）でエラーが出ていないか確認してください。

**Q: 画像のパスが正しいのに表示されない**
A: 開発サーバーを再起動してみてください（`Ctrl+C` → `npm run dev`）。

**Q: スクロールアニメーションが発火しない**
A: `threshold`の値を下げてみてください（0.1 → 0.05）。

**Q: スムーススクロールが効かない**
A: `globals.css`に`scroll-behavior: smooth`が追加されているか確認してください。

**Q: ホバーエフェクトがスマホで使えない**
A: スマホにはマウスがないため、ホバーは機能しません。タップ時の動作を別途定義するか、ホバーエフェクトはPC専用と割り切ってください。

**Q: useEffectの依存配列とは？**
A: `useEffect(() => { ... }, [])`の`[]`部分です。空配列の場合、コンポーネントのマウント時に1回だけ実行されます。

---

**前へ**: [モジュール4: 基本UIの構築](./module-04-basic-ui.md)
**次へ**: [モジュール6: UI改善とカスタマイズ](./module-06-ui-customization.md)
