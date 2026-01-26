---
title: "企業PVを制作する"
order: 3
duration: "40分"
difficulty: "⭐⭐⭐☆☆"
---

# 企業PVを制作する

**所要時間**: 40分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- PV制作の企画・台本作成
- 複数シーンの動画生成
- Canvaでの動画連結
- BGMの追加

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 台本に沿って複数シーンを生成できる
- 動画を連結してPVを完成させられる
- BGMを追加して仕上げられる

---

## 目次

- [セクション1: PVの企画](#セクション1-pvの企画)
- [セクション2: 素材画像の準備](#セクション2-素材画像の準備)
- [セクション3: シーンごとの動画生成](#セクション3-シーンごとの動画生成)
- [セクション4: Canvaで連結](#セクション4-canvaで連結)
- [セクション5: BGMを追加して完成](#セクション5-bgmを追加して完成)
- [まとめ](#まとめ)

---

## 事前準備

### 必要なもの

- KLINGアカウント
- 素材画像（人物写真など）
- Canvaアカウント（無料でOK）
- クレジット残高（6シーン × 25クレジット = 約150クレジット）

---

## セクション1: PVの企画

### 台本を作成する

PV制作の第一歩は**台本**です。

今回は以下の6シーン構成で制作します：

| シーン | 内容 | 秒数 | 意図 |
|--------|------|------|------|
| 1 | 社長が走る | 5秒 | 仕事が楽しくて仕方ない |
| 2 | ミーティング（笑顔） | 5秒 | 仲間・一体感 |
| 3 | ミーティング（議論） | 5秒 | 熱量・本気 |
| 4 | 契約成立（握手） | 5秒 | 達成 |
| 5 | プレゼン | 5秒 | 成長 |
| 6 | チームで歩く→空へ | 5秒 | 次の挑戦へ |

**合計**: 30秒

### ストーリーの流れ

```
情熱 → 仲間 → 挑戦 → 達成 → 成長 → 未来
```

### チェックポイント

- [ ] 台本の構成を理解した
- [ ] 各シーンの意図を把握した

---

## セクション2: 素材画像の準備

### 必要な画像

各シーンに対応する画像を用意します。

| シーン | 必要な画像 |
|--------|-----------|
| 1 | 社長が走っている/歩いている画像 |
| 2 | チームミーティングの画像（笑顔） |
| 3 | チームミーティングの画像（真剣） |
| 4 | 握手している画像 |
| 5 | なし（Text-to-Videoで生成） |
| 6 | チームで歩いている画像 |

### 画像生成ツール

素材がない場合は、以下のツールで生成できます：

- **Nano Banana Pro**: 人物の一貫性を保った画像生成
- **Midjourney**: 高品質な画像生成
- **DALL-E 3**: ChatGPTから利用可能

### チェックポイント

- [ ] 各シーンの素材画像を用意した

---

## セクション3: シーンごとの動画生成

### 設定（全シーン共通）

| 項目 | 設定値 |
|------|--------|
| モデル | 動画 2.5 Turbo |
| 長さ | 5秒 |
| アスペクト比 | 16:9 |
| 品質 | 標準モード |

---

### シーン1: 社長が走る

**プロンプト**:
```
A Japanese businessman in navy blazer and white t-shirt running energetically through a modern glass corridor, big smile on his face, camera tracking shot following him, he runs past the camera and exits frame to the right, morning sunlight, cinematic motion blur
```

**ポイント**:
- 「exits frame to the right」で画面外へ走り去る動きを指定
- 「tracking shot」でカメラが追従

<video controls width="100%">
  <source src="/kling/pv-scene01-running.mp4" type="video/mp4">
</video>

---

### シーン2: ミーティング笑顔

**プロンプト**:
```
Four Japanese office workers sitting around a wooden meeting table, looking at documents and laptop, everyone smiling and laughing together, warm friendly atmosphere, one woman holds paper and shares good news, coffee cups on table, bright modern meeting room, natural lighting from window
```

**ポイント**:
- 「smiling and laughing together」で明るい雰囲気
- 「warm friendly atmosphere」で一体感を表現

<video controls width="100%">
  <source src="/kling/pv-scene02-meeting-smile.mp4" type="video/mp4">
</video>

---

### シーン3: ミーティング議論

**プロンプト**:
```
Four Japanese colleagues in intense discussion at meeting table, woman in green shirt gesturing passionately while explaining idea, others listening attentively and nodding, serious focused expressions, modern conference room with TV screen, dynamic hand movements, professional atmosphere
```

**ポイント**:
- 「intense discussion」で熱量を表現
- 「gesturing passionately」で身振り手振りを指定

<video controls width="100%">
  <source src="/kling/pv-scene03-discussion.mp4" type="video/mp4">
</video>

---

### シーン4: 契約成立（握手）

**プロンプト**:
```
Two Japanese businessmen shaking hands firmly in high-rise office, man in navy blazer smiling proudly, cityscape visible through large window behind them, moment of celebration and achievement, warm natural lighting, camera slowly zooms in on handshake, professional success
```

**ポイント**:
- 「shaking hands firmly」で力強い握手
- 「camera slowly zooms in」でドラマチックに

<video controls width="100%">
  <source src="/kling/pv-scene04-handshake.mp4" type="video/mp4">
</video>

---

### シーン5: プレゼン

**画像なし（Text-to-Videoで生成）**

**プロンプト**:
```
Japanese businessman in navy blazer confidently presenting to audience in modern conference room, pointing at presentation screen, professional posture, colleagues watching impressed, bright lighting, corporate setting, camera follows presenter's movement
```

**ポイント**:
- 画像がない場合はText-to-Videoで生成
- 他のシーンと服装（navy blazer）を合わせる

<video controls width="100%">
  <source src="/kling/pv-scene05-presentation.mp4" type="video/mp4">
</video>

---

### シーン6: チームで空へ

**プロンプト**:
```
Four Japanese business colleagues walking together through modern city plaza, man in navy blazer leading in center, three women beside him, all smiling confidently, tall glass skyscrapers in background, blue sky with white clouds, camera tilts up toward sky at end, inspirational feeling, morning sunlight
```

**ポイント**:
- 「camera tilts up toward sky at end」で希望を表現
- 「inspirational feeling」で前向きな印象

<video controls width="100%">
  <source src="/kling/pv-scene06-team-sky.mp4" type="video/mp4">
</video>

---

### チェックポイント

- [ ] 6シーンすべて生成できた
- [ ] 各動画をダウンロードした

---

## セクション4: Canvaで連結

### Step 1: Canvaにアクセス

https://www.canva.com にアクセスし、ログインします。

### Step 2: 新規プロジェクト作成

「動画」→「16:9」を選択して新規プロジェクトを作成します。

### Step 3: 動画をアップロード

左メニューの「アップロード」から、6本の動画をアップロードします。

### Step 4: タイムラインに配置

動画を順番にタイムラインにドラッグ＆ドロップします。

**配置順序**:
1. pv-scene01-running.mp4
2. pv-scene02-meeting-smile.mp4
3. pv-scene03-discussion.mp4
4. pv-scene04-handshake.mp4
5. pv-scene05-presentation.mp4
6. pv-scene06-team-sky.mp4

### Step 5: トランジションを追加（任意）

シーン間にフェードなどのトランジションを追加できます。

### チェックポイント

- [ ] Canvaで動画を連結できた

---

## セクション5: BGMを追加して完成

### BGMの選択肢

| 方法 | 特徴 |
|------|------|
| Canvaの音楽 | 無料で使える。商用利用は要確認 |
| Suno AI | AIで好みの曲を生成 |
| フリー音源サイト | DOVA-SYNDROME、魔王魂など |

### Canvaで音楽を追加

1. 左メニューの「オーディオ」をクリック
2. 好みの曲を検索
3. タイムラインにドラッグ
4. 長さを動画に合わせて調整

### 書き出し

1. 右上の「共有」→「ダウンロード」
2. ファイル形式: MP4
3. 品質: 1080p推奨
4. 「ダウンロード」をクリック

### チェックポイント

- [ ] BGMを追加できた
- [ ] PVを書き出せた

---

## 完成版PV

<video controls width="100%">
  <source src="/kling/pv-complete.mp4" type="video/mp4">
</video>

---

## まとめ

### このモジュールで学んだこと

- PV制作は台本（企画）が重要
- 各シーンをImage-to-Videoで生成
- 画像がないシーンはText-to-Videoで対応
- Canvaで連結してBGMを追加

### 制作フロー

```
台本作成 → 素材準備 → シーン生成 → 連結 → BGM追加 → 完成
```

### 応用

- シーン数を増やしてより長いPVに
- Elements機能で人物の一貫性を強化
- VIDEO 2.6 Audioで音声付き動画を生成

---

## 参考: 今回使用したプロンプト一覧

### シーン1
```
A Japanese businessman in navy blazer and white t-shirt running energetically through a modern glass corridor, big smile on his face, camera tracking shot following him, he runs past the camera and exits frame to the right, morning sunlight, cinematic motion blur
```

### シーン2
```
Four Japanese office workers sitting around a wooden meeting table, looking at documents and laptop, everyone smiling and laughing together, warm friendly atmosphere, one woman holds paper and shares good news, coffee cups on table, bright modern meeting room, natural lighting from window
```

### シーン3
```
Four Japanese colleagues in intense discussion at meeting table, woman in green shirt gesturing passionately while explaining idea, others listening attentively and nodding, serious focused expressions, modern conference room with TV screen, dynamic hand movements, professional atmosphere
```

### シーン4
```
Two Japanese businessmen shaking hands firmly in high-rise office, man in navy blazer smiling proudly, cityscape visible through large window behind them, moment of celebration and achievement, warm natural lighting, camera slowly zooms in on handshake, professional success
```

### シーン5
```
Japanese businessman in navy blazer confidently presenting to audience in modern conference room, pointing at presentation screen, professional posture, colleagues watching impressed, bright lighting, corporate setting, camera follows presenter's movement
```

### シーン6
```
Four Japanese business colleagues walking together through modern city plaza, man in navy blazer leading in center, three women beside him, all smiling confidently, tall glass skyscrapers in background, blue sky with white clouds, camera tilts up toward sky at end, inspirational feeling, morning sunlight
```
