# アニメキャラクターで動画を作る

**所要時間**: 20分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- アニメ/イラストキャラクターでStoryboard動画を作る方法
- 画像の解像度要件
- アニメスタイル向けプロンプトの書き方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 自作のアニメキャラクターをStoryboardで動かせる
- 適切な解像度で画像を準備できる
- アニメスタイルを維持したプロンプトが書ける

---

## 目次

- [セクション1: アニメキャラクターは使える？](#セクション1-アニメキャラクターは使える)
- [セクション2: 画像の準備](#セクション2-画像の準備)
- [セクション3: Storyboardでアニメーション作成](#セクション3-storyboardでアニメーション作成)
- [セクション4: 実践結果](#セクション4-実践結果)
- [まとめ](#まとめ)

---

## 事前準備

### 必要なもの

| 項目 | 詳細 |
|------|------|
| ChatGPT Plus | $20/月 |
| Sora 2へのアクセス | sora.com |
| アニメキャラクター画像 | 自作またはAI生成 |
| Nano Banana Pro | 解像度調整用（オプション） |

### 前提知識

- Module 01〜02を完了していること
- Storyboard機能の基本操作

---

## セクション1: アニメキャラクターは使える？

### 重要な発見

Module 02で学んだように、Sora 2のStoryboard機能では**実写の人物画像はアップロードできません**。

しかし、**アニメ/イラストスタイルのキャラクターは「人物」として検出されない**ことが検証で判明しました。

### 検証結果

| 画像タイプ | Storyboardアップロード |
|-----------|----------------------|
| 実写人物 | NG（ブロックされる） |
| **アニメ/ちびキャラ** | **OK（使用可能）** |
| 風景・建物 | OK |
| 物体・製品 | OK |

### つまり

自作のイラストやAI生成のアニメキャラクターであれば、Storyboard機能で画像をアップロードして動画を作成できます。

### チェックポイント

- [ ] アニメキャラクターがStoryboardで使えることを理解した

---

## セクション2: 画像の準備

### 解像度の要件

Sora 2には解像度による制限があります。

| 解像度 | 最大動画長 |
|--------|----------|
| 352p（低解像度） | **15秒まで** |
| 720p以上 | 25秒まで |

### 推奨解像度

| 向き | 推奨サイズ | アスペクト比 |
|------|-----------|-------------|
| 横型（Landscape） | 1920×1080 | 16:9 |
| 縦型（Portrait） | 1080×1920 | 9:16 |
| 最低ライン | 768×1376程度 | 約9:16 |

### Nano Banana Proで解像度を上げる

元の画像が低解像度の場合、Nano Banana Proで高解像度版を生成できます。

**プロンプト例:**
```
このキャラクターを1080×1920ピクセル、9:16のアスペクト比で
再描画してください。
背景は明るいカラフルな部屋にしてください。
キャラクターの特徴はそのまま維持してください。
```

### 元画像とHD版の比較

**元画像:**

![元のキャラクター](/sora2/module-04-original-character.jpg)

**HD版（Nano Banana Pro）:**

![HD版キャラクター](/sora2/module-04-character-hd.jpg)

### チェックポイント

- [ ] 解像度による制限を理解した
- [ ] 推奨解像度を把握した

---

## セクション3: Storyboardでアニメーション作成

### Step 1: Storyboardを開く

1. sora.com にアクセス
2. 「Storyboard」を選択

### Step 2: 画像をアップロード

1. Scene 1に画像をアップロード
2. アニメキャラクターは「人物」としてブロックされない

### Step 3: 各シーンのプロンプトを記述

**アニメスタイル向けプロンプトのポイント:**

1. **スタイルを明示**: `Chibi anime style, 2D animation`
2. **キャラクター特徴を毎回記述**: 一貫性のため
3. **動きはシンプルに**: `subtle animation`, `smooth movement`

### プロンプト例（5シーン構成）

**Scene 1: 登場**
```
Chibi anime style, 2D animation.
Cute chibi boy with messy black hair, VR goggles on head,
black glasses, black t-shirt, blue jacket tied around waist.
Standing, looking around curiously, subtle idle animation.
Bright colorful background, cheerful mood.
```

**Scene 2: VRゴーグル装着**
```
Same chibi character reaches up, pulls VR goggles down over eyes.
Excited expression, smooth animation.
Anticipation before action.
```

**Scene 3: VR世界に入る**
```
Same chibi character wearing VR goggles,
surrounded by digital particles and glowing effects.
Arms spread wide in amazement.
Camera zooms out, magical atmosphere.
```

**Scene 4: VR世界で冒険**
```
Same chibi character running through virtual landscape,
floating platforms and glowing trees.
Joyful running animation, energetic pace.
Vibrant neon colors.
```

**Scene 5: 終了・笑顔**
```
Same chibi character pushes VR goggles back up,
big happy smile, thumbs up gesture.
Sparkle effects, warm lighting, happy ending.
```

### Step 4: 設定

![Storyboard UI](/sora2/module-04-storyboard-ui.png)

| 設定 | 値 |
|------|-----|
| Duration | 15秒（768p画像の場合） |
| Orientation | Portrait（縦）or Landscape（横） |

### Step 5: Create

「Create」ボタンをクリックして生成開始。

### チェックポイント

- [ ] アニメスタイルのプロンプト構造を理解した
- [ ] 各シーンでキャラクター特徴を記述する重要性を理解した

---

## セクション4: 実践結果

### 生成された動画

<video controls width="100%">
  <source src="/sora2/module-04-anime-result.mp4" type="video/mp4">
</video>

### 結果の評価

| 項目 | 評価 |
|------|------|
| キャラクターの再現 | アニメスタイル維持 |
| 動きの滑らかさ | 自然なアニメーション |
| シーン間の一貫性 | プロンプトで維持 |

### 注意点

- 完全に同じキャラクターにはならない場合がある
- 複数回生成して良いものを選ぶ
- 細かいディテール（服の柄など）は変わりやすい

---

## まとめ

### このモジュールで学んだこと

- **アニメ/イラストキャラクターはStoryboardで使用可能**
- 解像度は768p以上を推奨（352pは15秒制限）
- プロンプトで「Chibi anime style, 2D animation」を明示
- 各シーンでキャラクター特徴を繰り返し記述

### 重要なポイント

| 項目 | 内容 |
|------|------|
| 実写人物 | NG（ブロック） |
| アニメキャラ | **OK** |
| 解像度 | 768p以上推奨 |
| スタイル維持 | プロンプトで明示 |

### 次のステップ

- 自分のオリジナルキャラクターで試す
- より長いストーリーをStitch機能で連結
- Characters機能と組み合わせて実写+アニメのハイブリッド

---

## よくある質問

**Q: どんなアニメスタイルでも使えますか？**
A: ちびキャラ、一般的なアニメスタイル、イラスト風など幅広く対応しています。ただし、実写に近いリアルなイラストは「人物」として検出される可能性があります。

**Q: 生成されたキャラクターが元と違う場合は？**
A: 複数回生成して選ぶか、プロンプトでより詳細にキャラクター特徴を記述してください。

**Q: 解像度が352pになってしまう場合は？**
A: Nano Banana Proで高解像度版を生成するか、画像編集ソフトでリサイズしてください。
