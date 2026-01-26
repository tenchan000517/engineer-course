# ASMR動画の作り方：キウイスライムベッド編

リールでも紹介した「ASMR系バイラル動画」の作り方をまとめました。

---

## このASMR動画とは

キウイスライムのベッドに飛び込んで、ぐにゅっと沈み込む動画です。

見ているだけで気持ちいい「満足感」を与えるASMR系コンテンツで、海外で爆発的にバズっています。

---

## 使用するツール

| ツール | 用途 | アクセス |
|--------|------|----------|
| Nanobanana | 開始・終了フレームの画像生成 | aistudio.google.com |
| 動画生成AI | 画像から動画を生成 | 各種（Veo、Kling等） |
| Higgsfield | 変身エフェクト（オプション） | higgsfield.ai |

---

## Step 1：開始フレームを作成（Nanobanana）

### Google AI Studioを開く

URL: https://aistudio.google.com

### 開始フレーム用プロンプト

```
hyper-realistic photo, cinematic shot, view from behind, a young Japanese man with short dark hair wearing a navy blue t-shirt, standing next to a bed frame filled with thick, semi-solid green kiwi-fruit-textured gel, the surface is smooth and looks like a heavy gelatinous mattress, black seeds visible, soft cinematic lighting, bright colors, 8k, raw photo
```

### 完成例

![開始フレーム](/gifts/nanobanana-video-prompts/result-jumping.jpeg)

---

## Step 2：終了フレームを作成（Nanobanana）

### 終了フレーム用プロンプト

![プロンプト例](/gifts/nanobanana-video-prompts/prompt-lying.png)

```
hyper-realistic photo, cinematic shot, a young Japanese man with short dark hair wearing a navy blue t-shirt, lying buried in a bed filled with thick green kiwi-fruit-textured slime, a thick gelatinous layer of green slime covers his body like a heavy blanket, high viscosity, no splash, gooey but solid texture, comfy, cozy, black seeds, cinematic lighting, bright colors, 8k
```

### ネガティブプロンプト

```
(worst quality, low quality:1.4), (deformed, distorted, disfigured:1.3), bad anatomy, bad hands, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, watermark, text, signature, sketch, cartoon, illustration, painting, (female, woman, girl:1.2)
```

### 完成例

![終了フレーム](/gifts/nanobanana-video-prompts/result-lying.jpeg)

---

## Step 3：動画を生成

動画生成AI（Veo、Kling等）で、開始フレームと終了フレームを繋ぐ動画を作ります。

![ツール画面](/gifts/nanobanana-video-prompts/tool-interface.png)

### 設定

1. 「画像から動画へ」モードを選択
2. 開始フレーム（Step 1の画像）をアップロード
3. 終了フレーム（Step 2の画像）をアップロード
4. 以下のプロンプトを入力

### 動画用プロンプト

```
Vertical video (9:16). A hyper-realistic shot of a bed frame filled with thick, green kiwi-fruit-textured slime with black seeds. A man jumps onto the bed, sinking into the gooey slime with a satisfying splash and heavy liquid physics. The texture is glossy and wet. Cinematic lighting, bright colors, satisfying ASMR visual. --ar 9:16
```

---

## Step 4：編集して完成

CapCutなどの編集アプリで仕上げます。

1. 冒頭の不要な部分をカット
2. ループ再生できるように調整
3. 必要に応じてBGMを追加

---

## 応用：変身エフェクトを追加

HiggsfieldのAIR BENDINGを使うと、煙で変身する演出が追加できます。

### Higgsfieldを開く

URL: https://higgsfield.ai

### Videoメニューを選択

![Higgsfield HOME画面](/gifts/hook-robot/step3-higgsfield-home.png)

1. 上部メニューから「**Video**」をクリック

### Create Videoを選択

![Create Video画面](/gifts/hook-robot/step3-create-video.png)

1. 「**Create Video**」タブを選択
2. 左上の「**Change**」をクリックしてエフェクト一覧を開く

### AIR BENDINGエフェクトを選択

![エフェクト選択画面](/gifts/hook-robot/step3-effect-select.png)

1. 「**Start & End**」タブをクリック
2. 「**AIR BENDING**」エフェクトを選択

### 画像をアップロード

![画像アップロード画面](/gifts/hook-robot/step3-upload-frames.png)

- Start frame: 開始フレーム（Step 1の画像）
- End frame: 終了フレーム（Step 2の画像）

### 変身用プロンプト

```
The subject dissolves into a swirling vortex of white smoke and wind, moving rapidly. High quality, cinematic visual effects, motion blur, air distortion.
```

### 生成

「**Generate**」をクリック（6クレジット消費）

煙のエフェクトで変身する動画が生成されます。

---

## 番外編：他のASMRアイデア

同じ手順で以下のような動画も作れます。

### ガラスベッド

```
A surreal bedroom scene featuring a bed made entirely of clear, solid glass or ice. A woman in a white dress tries to pull a rigid sheet made of thin glass over herself. As she moves, the glass sheet cracks and clinks. Crystalline texture, cold atmosphere, sharp focus, transparency, fragile glass physics.
```

### 水ベッド（熱帯魚入り）

```
A dimly lit bedroom where the mattress is a pool of deep blue water containing colorful tropical fish swimming inside. A girl jumps onto the bed, creating a massive, realistic water splash as she submerges. Underwater lighting effects, liquid simulation, magical atmosphere, high definition.
```

### フルーツ階段

```
A low-angle shot of a staircase made of giant, juicy slices of citrus fruits (oranges, lemons, kiwis). A woman in a yellow dress walks barefoot up the stairs. Close-up on feet: every step squishes the fruit flesh, releasing fresh juice that drips down. vibrant colors, sunny outdoor lighting, hyper-realistic fruit texture, macro photography style.
```

---

## まとめ

1. Nanobananaで開始フレームを作成
2. Nanobananaで終了フレームを作成
3. 動画生成AIで2つのフレームを繋ぐ動画を生成
4. 編集して完成

この手順で、バズるASMR動画が作れます。
