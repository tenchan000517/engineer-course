---
title: "画像から動画を生成する"
order: 2
duration: "20分"
difficulty: "⭐⭐☆☆☆"
---

# 画像から動画を生成する

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Image-to-Video機能の使い方
- 効果的なプロンプトの書き方
- カメラワークの指定方法
- 動画生成のコツ

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 画像をアップロードして動画を生成できる
- 動きを指示するプロンプトを書ける
- カメラワークを指定できる

---

## 目次

- [セクション1: Image-to-Videoとは](#セクション1-image-to-videoとは)
- [セクション2: 画像をアップロードする](#セクション2-画像をアップロードする)
- [セクション3: プロンプトの書き方](#セクション3-プロンプトの書き方)
- [セクション4: カメラワークの指定](#セクション4-カメラワークの指定)
- [セクション5: 実践演習](#セクション5-実践演習)
- [まとめ](#まとめ)

---

## 事前準備

### 必要なもの

- KLINGアカウント（Module 01で作成済み）
- アップロードする画像（人物写真など）
- クレジット残高（5秒動画で約25クレジット）

---

## セクション1: Image-to-Videoとは

Image-to-Videoは、静止画像を元に動画を生成する機能です。

### Text-to-Videoとの違い

| 機能 | 特徴 | 用途 |
|------|------|------|
| Text-to-Video | テキストのみで生成 | アイデアを形にしたい時 |
| **Image-to-Video** | 画像を元に生成 | 特定の人物・背景を使いたい時 |

### メリット

- **人物の外見を維持**できる
- **背景や構図を指定**できる
- **より意図した動画**が作れる

### チェックポイント

- [ ] Image-to-Videoの特徴を理解した

---

## セクション2: 画像をアップロードする

### Step 1: 動画生成画面を開く

左サイドバーの「動画生成」をクリックします。

### Step 2: 「画像から動画へ」を選択

上部タブで「**画像から動画へ**」を選択します。

![動画生成画面](/kling/module-01-video-generation.png)

### Step 3: 画像をアップロード

「**開始フレーム画像を追加**」をクリックして、画像をアップロードします。

![画像アップロード](/kling/pv-scene01-upload.png)

### 画像の推奨仕様

| 項目 | 推奨値 |
|------|--------|
| 解像度 | 1024×1024以上 |
| アスペクト比 | 16:9 または 9:16 |
| ファイル形式 | JPG, PNG |
| ファイルサイズ | 10MB以下 |

### チェックポイント

- [ ] 「画像から動画へ」タブを選択できた
- [ ] 画像をアップロードできた

---

## セクション3: プロンプトの書き方

Image-to-Videoでは、**動き**を指示するプロンプトが重要です。

### プロンプトの基本構造

```
[主体の説明] + [動作] + [背景・環境] + [カメラワーク] + [雰囲気]
```

### 良いプロンプトの例

**シンプルな動き**:
```
A Japanese businessman walking confidently, morning sunlight
```

**詳細な動き**:
```
A Japanese businessman in navy blazer and white t-shirt running energetically through a modern glass corridor, big smile on his face, camera tracking shot following him, morning sunlight, cinematic motion blur
```

### 動作を表す英単語

| 動作 | 英単語 |
|------|--------|
| 歩く | walking |
| 走る | running |
| 話す | talking, speaking |
| 笑う | smiling, laughing |
| 振り向く | turning around |
| 手を振る | waving hand |
| うなずく | nodding |
| 立ち上がる | standing up |

### 避けるべきプロンプト

- ❌ 抽象的すぎる: 「動く」「いい感じに」
- ❌ 複雑すぎる: 一度に多くの動作を指定
- ❌ 画像と矛盾: 座っている画像に「走る」を指定

### チェックポイント

- [ ] プロンプトの基本構造を理解した
- [ ] 動作を表す英単語を確認した

---

## セクション4: カメラワークの指定

KLINGでは、プロンプト辞書からカメラワークを選択できます。

### プロンプト辞書を開く

プロンプト入力欄の近くにある辞書アイコンをクリックします。

![プロンプト辞書](/kling/module-01-prompt-presets.png)

### 主なカメラワーク

| カメラワーク | 英語 | 効果 |
|-------------|------|------|
| パン（左右） | pan left/right | 横方向の動き |
| チルト（上下） | tilt up/down | 縦方向の動き |
| ズームイン | zoom in | 被写体に寄る |
| ズームアウト | zoom out | 被写体から離れる |
| トラッキング | tracking shot | 被写体を追う |
| 固定 | static shot | カメラ固定 |

### プロンプトでの指定例

```
camera slowly zooms in on handshake
```

```
camera tracking shot following him
```

```
camera tilts up toward sky at end
```

### チェックポイント

- [ ] プロンプト辞書の場所を確認した
- [ ] カメラワークの種類を理解した

---

## セクション5: 実践演習

実際に画像から動画を生成してみましょう。

### 演習: 人物が歩く動画

**使用する画像**: 人物が立っている写真

**プロンプト**:
```
A person walking forward confidently, natural movement, soft lighting, camera follows the movement
```

**設定**:
- モデル: 動画 2.5 Turbo
- 長さ: 5秒
- アスペクト比: 16:9

### 生成のコツ

1. **シンプルな動きから始める**: 最初は「歩く」「振り向く」など単純な動作で試す
2. **画像と動作を合わせる**: 立っている画像には立った状態での動作を指定
3. **英語で書く**: 日本語より英語の方が精度が高い
4. **DeepSeekを活用**: プロンプトをAIがブラッシュアップしてくれる

![DeepSeek連携](/kling/module-01-deepseek.png)

### チェックポイント

- [ ] 画像から動画を生成できた
- [ ] プロンプトの書き方を実践した

---

## まとめ

### このモジュールで学んだこと

- Image-to-Videoは画像を元に動画を生成する機能
- プロンプトは「主体 + 動作 + 環境 + カメラ」で構成
- カメラワークはプロンプト辞書から選択可能
- 英語でシンプルに書くのがコツ

### 次のステップ

次のモジュールでは、学んだ技術を使って**企業PVを制作**します。

---

## 参考: プロンプトテンプレート

### 人物が歩く
```
[人物の説明] walking [方向] through [場所], [表情], [lighting], [camera movement]
```

### 人物が話す
```
[人物の説明] talking [to whom], [gesture], [expression], [background], natural movement
```

### グループシーン
```
[人数] [people description] [action] together, [atmosphere], [setting], [camera angle]
```
