# Storyboardで台本どおりの動画を作る

**所要時間**: 20分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Storyboard機能の基本的な使い方
- 複数シーンを1本の動画にまとめる方法
- Storyboard機能の制約と注意点

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Storyboard機能でシーンを構成できる
- 台本に沿った動画を生成できる
- 制約を理解した上で効果的に活用できる

---

## 目次

- [セクション1: Storyboard機能とは](#セクション1-storyboard機能とは)
- [セクション2: Storyboardの使い方](#セクション2-storyboardの使い方)
- [セクション3: 実践 - 採用PVの冒頭を作る](#セクション3-実践---採用pvの冒頭を作る)
- [セクション4: 制約と注意点](#セクション4-制約と注意点)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 詳細 |
|------|------|
| ChatGPT Plus | $20/月 |
| Sora 2へのアクセス | sora.com |

### 前提知識

- Module 01を完了していること
- プロンプトの基本構造を理解していること

---

## セクション1: Storyboard機能とは

### 概要

Storyboard機能は、複数のシーンを1つのタイムラインで構成し、**台本どおりの動画**を生成するための機能です。

### 通常の動画生成との違い

| 項目 | 通常の生成 | Storyboard |
|------|-----------|------------|
| シーン数 | 1シーン | 複数シーン |
| 構成 | 単発 | 台本ベース |
| 制御性 | 低い | 高い |

### Storyboardが有効な場面

- 採用PVなど**ストーリー性のある動画**を作りたい
- **シーンの流れを指定**したい
- **台本どおり**に動画を作りたい

### チェックポイント

- [ ] Storyboard機能の目的を理解した

---

## セクション2: Storyboardの使い方

### Step 1: Storyboardモードに入る

1. sora.com にアクセス
2. 画面下部の「Storyboard」ボタンをクリック

Storyboard画面:

![Storyboard UI](/sora2/module-02-storyboard-ui.png)

### Step 2: シーンを追加する

デフォルトでScene 1とScene 2が表示されています。

- 「+」ボタンでシーンを追加
- 各シーンに「who, where, what happens?」を記述

### Step 3: Duration（尺）を設定

画面右下のボタンから設定：

![Duration設定](/sora2/module-02-duration-select.png)

| 選択肢 | 用途 |
|-------|------|
| 10 seconds | 短いクリップ |
| 15 seconds | 標準的な長さ |
| 25 seconds | 長めの動画 |

シーン数に応じて均等に割り振られます。

### Step 4: Orientation（向き）を設定

![Orientation設定](/sora2/module-02-orientation-select.png)

| 選択肢 | 用途 |
|-------|------|
| Portrait | 縦型（9:16）、SNS向け |
| Landscape | 横型（16:9）、YouTube/Web向け |

### Step 5: Fit scenes to duration

![Fit scenes](/sora2/module-02-fit-scenes.png)

「Fit scenes to duration」をクリックすると、シーンを指定秒数に自動フィットします。

各シーンの秒数は個別にカスタマイズも可能です。

### Step 6: Createで生成

1. 「Create」ボタンをクリック
2. 生成がバックグラウンドで開始
3. 完了後、Draftsに保存される

Drafts画面:

![Drafts](/sora2/module-02-drafts.png)

### チェックポイント

- [ ] Storyboard画面を開けた
- [ ] シーンの追加方法を理解した
- [ ] Duration/Orientationの設定方法を理解した

---

## セクション3: 実践 - 採用PVの冒頭を作る

### 台本例（15秒 × 4シーン）

採用PVの冒頭部分を作成します。

| シーン | 内容 |
|-------|------|
| 1 | オフィスビル外観（朝） |
| 2 | 社員が入口から入る |
| 3 | デスクで仕事 |
| 4 | カメラに向かって笑顔 |

### 各シーンのプロンプト

**Scene 1:**
```
Establishing shot of a modern Japanese corporate office building,
glass and steel architecture, morning sunlight,
camera slowly tilts upward, cinematic style
```

**Scene 2:**
```
A Japanese male office worker in his late 20s,
navy blazer over white shirt,
walks through glass entrance doors into bright lobby,
confident stride, medium shot
```

**Scene 3:**
```
Same man sitting at modern white desk in open office,
typing on silver laptop, focused expression,
soft natural window light from left
```

**Scene 4:**
```
Same man looks up from laptop toward camera,
warm confident smile, professional office background,
welcoming atmosphere
```

### 設定

- **Duration**: 15 seconds
- **Orientation**: Landscape

### 生成結果例

<video controls width="100%">
  <source src="/sora2/module-02-storyboard-result-1.mp4" type="video/mp4">
</video>

<video controls width="100%">
  <source src="/sora2/module-02-storyboard-result-2.mp4" type="video/mp4">
</video>

<video controls width="100%">
  <source src="/sora2/module-02-storyboard-result-3.mp4" type="video/mp4">
</video>

### チェックポイント

- [ ] 4シーンの台本を作成できた
- [ ] Storyboardで動画を生成できた

---

## セクション4: 制約と注意点

### 制約1: 人物画像は使用できない

![人物制限](/sora2/module-02-people-restriction.png)

```
For safety, we don't create videos from images that include people.
```

Storyboard機能では、**人物を含む参照画像をアップロードできません**。

**対策**:
- テキストプロンプトのみで人物を記述
- 全シーンで同じ特徴を記述して一貫性を保つ（例: 「Same man, navy blazer...」）

### 制約2: 同時生成は3本まで

```
You can only generate 3 videos at a time
```

同時に生成できるのは3本まで。生成完了を待ってから次を生成してください。

### 制約3: Duration（尺）の上限

| プラン | 最大尺 |
|-------|-------|
| Plus | 25秒 |

25秒を超える動画を作りたい場合は、複数の動画を生成して編集ソフトでつなげる必要があります。

### 制約4: 第三者コンテンツとの類似性

```
This content may violate our guardrails concerning similarity to third-party content.
```

生成内容が既存のコンテンツに似すぎていると判断された場合、エラーになることがあります。

**対策**: プロンプトをより具体的・ユニークにする

### チェックポイント

- [ ] 人物画像が使用できない制約を理解した
- [ ] その他の制約を理解した

---

## トラブルシューティング

### 問題: 人物の一貫性が保てない

**原因**: Storyboardでは参照画像が使えないため、テキストのみで一貫性を保つ必要がある

**対策**:
- 全シーンで同じ人物の特徴を詳細に記述
- 例: 「Japanese male, late 20s, short black hair, navy blazer, white shirt」を全シーンに含める
- 複数回生成して、最も一貫性のあるものを選ぶ

### 問題: 生成が始まらない

**原因**: 同時生成の上限（3本）に達している

**対策**: Draftsを確認し、生成完了を待つ

---

## まとめ

### このモジュールで学んだこと

- Storyboard機能の基本的な使い方
- 複数シーンを構成して台本どおりの動画を作る方法
- 人物画像が使えないなどの制約

### 次のステップ

- 25秒を超える動画は複数生成して編集でつなげる
- 人物の一貫性を保つためのプロンプト技術を磨く
- 実際の採用PV台本を作成して全編を生成する

---

## 参考資料

- [Sora 公式ヘルプ](https://help.openai.com)

---

## よくある質問

**Q: Storyboardで人物の参照画像を使えますか？**
A: いいえ、安全性の理由で人物を含む画像は使用できません。テキストプロンプトのみで人物を記述してください。

**Q: 25秒より長い動画は作れますか？**
A: Storyboard単体では最大25秒です。それ以上の長さが必要な場合は、複数の動画を生成して編集ソフトでつなげてください。

**Q: シーンごとに秒数を変えられますか？**
A: はい、各シーンの秒数は個別にカスタマイズできます。「Fit scenes to duration」で自動調整も可能です。

**Q: 生成した動画の「続き」を作るには？**
A: 現時点では、前の動画から直接続きを生成する機能はありません。新しいStoryboardで続きのシーンを作成し、編集でつなげてください。
