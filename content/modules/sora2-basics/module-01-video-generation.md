# Sora 2で動画を作る

**所要時間**: 30分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Sora 2とNano Banana Proの概要と料金
- 効果的なプロンプトの基本構造
- Nano Banana Proで画像を生成する方法
- Sora 2で画像から動画を生成する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Sora 2とNano Banana Proにアクセスできる
- プロンプトの基本構造を理解し、自分で作成できる
- AI生成画像を元に動画を生成できる

---

## 目次

- [セクション1: ツールの概要と環境構築](#セクション1-ツールの概要と環境構築)
- [セクション2: プロンプトの基本構造](#セクション2-プロンプトの基本構造)
- [セクション3: Nano Banana Proで画像生成](#セクション3-nano-banana-proで画像生成)
- [セクション4: Sora 2で動画生成](#セクション4-sora-2で動画生成)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 詳細 |
|------|------|
| ChatGPT Plus | $20/月（Sora 2利用に必要） |
| Googleアカウント | Nano Banana Pro利用に必要 |
| ブラウザ | Chrome推奨 |

---

## セクション1: ツールの概要と環境構築

### Sora 2とは

Sora 2はOpenAIが提供するAI動画生成ツールです。テキストや画像から動画を生成できます。

| 項目 | ChatGPT Plus |
|------|-------------|
| 月額 | $20 |
| 解像度 | 最大720p |
| 動画長 | 最大10秒 |
| クレジット | 1,000/月 |

**アクセス方法**: https://sora.com にアクセスし、ChatGPTアカウントでログイン

### Nano Banana Proとは

Nano Banana Pro（Gemini 3 Pro Image）はGoogleが提供するAI画像生成ツールです。フォトリアリスティックな画像を生成できます。

| 項目 | 無料プラン |
|------|----------|
| 月額 | $0 |
| 1日の生成数 | 約50枚 |
| 解像度 | 1K |

**アクセス方法**: Google AI Studio（https://aistudio.google.com）にアクセス

### 環境構築手順

#### Step 1: Sora 2にアクセス

1. https://sora.com にアクセス
2. ChatGPT Plusアカウントでログイン
3. Exploreページが表示されることを確認

Sora 2のExploreページ:

![Sora 2 Explore](/sora2/module-01-sora-explore.jpg)

#### Step 2: Google AI Studioにアクセス

1. https://aistudio.google.com にアクセス
2. Googleアカウントでログイン
3. 左メニューから「Playground」を選択
4. 右側の「Run settings」で「Nano Banana Pro」が選択されていることを確認

Google AI Studio Nano Banana Pro:

![Nano Banana Pro](/sora2/module-01-nano-banana-pro.png)

### チェックポイント

- [ ] Sora 2（sora.com）にログインできた
- [ ] Google AI StudioでNano Banana Proにアクセスできた

---

## セクション2: プロンプトの基本構造

### プロンプトとは

プロンプトとは、AIに「何を生成してほしいか」を伝えるテキスト指示です。

### Sora 2プロンプトの基本構造

公式プロンプトを分析すると、以下の構造が効果的です：

```
[1. フォーマット・技術指定]
[2. カメラ設定]
[3. シーン・被写体の詳細]
[4. 動きの流れ]
[5. 照明・色調・ムード]
[6. 禁止事項（必要な場合）]
```

### 各要素の詳細

#### 1. フォーマット・技術指定

| 要素 | 例 |
|------|-----|
| アスペクト比 | vertical 9:16, 16:9 |
| スタイル | photorealistic, cinematic |
| 特殊指定 | seamlessly looping |

#### 2. カメラ設定

| 要素 | 例 |
|------|-----|
| 位置 | overhead shot, close-up, medium shot |
| 動き | fixed, slow handheld, no zoom |
| スタイル | iPhone-style, cinematic |

#### 3. シーン・被写体の詳細

| 要素 | 例 |
|------|-----|
| 場所 | modern office, café interior |
| 人物 | Japanese male in his 20s, wearing blazer |
| オブジェクト | laptop, coffee cup, notebooks |

#### 4. 動きの流れ

| パターン | 例 |
|---------|-----|
| 順序指定 | Begin with → Then → Finally |
| 動きの質 | subtle movements, gently reveal |

#### 5. 照明・色調・ムード

| 要素 | 例 |
|------|-----|
| 照明 | natural light, warm highlights |
| ムード | calm, professional, magical |

#### 6. 禁止事項

| 用途 | 例 |
|------|-----|
| ブランド保護 | No text, no logos |
| ループ用 | No camera movement |

### プロンプト例

```
Realistic 16:9 corporate video.

Camera: Medium shot, slow subtle push-in, cinematic style.

A Japanese male office worker in his late 20s with clean short
black hair, wearing a navy blazer over white shirt, sits at a
modern white desk. He types on a laptop, then looks up toward
the camera with a warm smile.

Begin with typing, then gradually shift attention to camera.

Lighting: Soft natural window light from the left.
The mood is professional and welcoming.

No text overlays, no logos.
```

### チェックポイント

- [ ] プロンプトの6つの構成要素を理解した
- [ ] 各要素の例を確認した

---

## セクション3: Nano Banana Proで画像生成

Sora 2で動画を生成する前に、元となる画像をNano Banana Proで作成します。

### Step 1: プロンプトを入力

Google AI Studioで以下のプロンプトを入力:

```
Portrait photograph of a Japanese male office worker,
28 years old, clean short black hair, friendly professional smile,
wearing a navy blue business casual blazer over white shirt,
neutral gray background,
shot with 85mm portrait lens, soft natural lighting from front-left,
high resolution, photorealistic style
```

### Step 2: 生成を実行

「Run」ボタンをクリックして画像を生成します。

生成結果の例:

![生成された画像](/sora2/module-01-generated-image.png)

### Step 3: 品質チェック

生成された画像を確認:

- [ ] 顔の造形が自然か
- [ ] 服装が指定通りか
- [ ] 背景に不自然な要素がないか

問題があれば、同じプロンプトで再生成してください。

### Step 4: 画像をダウンロード

1. 生成された画像をクリック
2. 右クリック →「名前を付けて画像を保存」
3. わかりやすい名前で保存（例: `character_01.png`）

### チェックポイント

- [ ] プロンプトを入力して画像を生成できた
- [ ] 品質チェックを行った
- [ ] 画像をダウンロードした

---

## セクション4: Sora 2で動画生成

### Step 1: 画像をアップロード

1. sora.com にアクセス
2. 入力欄左の「+」ボタンをクリック
3. 「Upload from device」を選択

アップロードメニュー:

![アップロードメニュー](/sora2/module-01-upload-menu.png)

### Step 2: 利用規約に同意

Media upload agreementが表示されます。4つの項目にチェックを入れて「Accept」をクリック:

![利用規約](/sora2/module-01-agreement.png)

| チェック項目 | 内容 |
|------------|------|
| 1 | 18歳未満や同意のない人物を含まない |
| 2 | 暴力や露骨なテーマを含まない |
| 3 | メディアの権利を持っている |
| 4 | 不正使用はアカウント停止の可能性 |

### Step 3: プロンプトを入力

画像がアップロードされたら、動きを指示するプロンプトを入力:

```
The person in the image types on an invisible keyboard,
then looks up toward the camera with a warm smile.

Camera: Static medium shot.
Duration: 5 seconds.
```

### Step 4: 設定を確認

| 設定 | 推奨値 |
|------|-------|
| Video/Image | Video |
| アスペクト比 | 16:9 |
| 解像度 | 480p（クレジット節約）または720p |
| 長さ | 5s |

### Step 5: 生成を実行

「Generate」ボタンをクリック。生成には2〜4分かかります。

### Step 6: 結果を確認・ダウンロード

1. 生成完了後、プレビューで確認
2. 満足できれば「Download」をクリック
3. 不満なら同じ設定で「Regenerate」

Image-to-Videoの生成結果例:

<video controls width="100%">
  <source src="/sora2/module-01-image-to-video.mp4" type="video/mp4">
</video>

### 参考: Text-to-Videoの例

画像なしでテキストのみから動画を生成することもできます。ただし、キャラクターの一貫性を維持するのが難しいため、Image-to-Videoの方が推奨されます。

Text-to-Videoの生成結果例:

<video controls width="100%">
  <source src="/sora2/module-01-text-to-video.mp4" type="video/mp4">
</video>

### チェックポイント

- [ ] 画像をアップロードできた
- [ ] 利用規約に同意した
- [ ] プロンプトを入力して動画を生成できた
- [ ] 動画をダウンロードできた

---

## トラブルシューティング

### 問題: プロンプト通りの動きにならない

**原因**: Sora 2は細かい動きの指示を完全には反映しない場合があります。

**対策**:
- 動きの指示をシンプルにする
- 「subtle」「slow」などの修飾語を追加
- 複数回生成して良いものを選ぶ

### 問題: Text-to-Videoでキャラクターが毎回変わる

**原因**: テキストのみでは一貫したキャラクター生成が難しい。

**対策**:
- Image-to-Videoを使用する（本モジュールの方法）
- Cameo機能で自分のキャラクターを登録する

---

## まとめ

### このモジュールで学んだこと

- Sora 2とNano Banana Proへのアクセス方法
- 効果的なプロンプトの6つの構成要素
- Nano Banana Proでの画像生成手順
- Sora 2でのImage-to-Video生成手順

### 次のステップ

- 様々なプロンプトで画像・動画を生成してみる
- Sora 2のStoryboard機能を試す
- 生成した動画を編集ソフトでつなげてみる

---

## 参考資料

- [Sora 公式ヘルプ](https://help.openai.com)
- [Google AI Studio](https://aistudio.google.com)
- [Sora 2 Prompting Guide](https://cookbook.openai.com/examples/sora/sora2_prompting_guide)

---

## よくある質問

**Q: ChatGPT Plusに加入していないとSora 2は使えませんか？**
A: はい、Sora 2の利用にはChatGPT Plus（$20/月）以上のプランが必要です。

**Q: Nano Banana Proは無料で使えますか？**
A: はい、Google AI Studioから無料で利用できます。1日の生成数に制限がありますが、学習には十分です。

**Q: 生成した動画は商用利用できますか？**
A: 各サービスの利用規約を確認してください。一般的に、AI生成コンテンツの商用利用には制限がある場合があります。

**Q: クレジットが足りなくなったらどうすればいいですか？**
A: ChatGPT Plusの場合、月初にクレジットがリセットされます。効率的に使うには、低解像度（480p）・短い動画（5秒）で生成することをおすすめします。

**Q: 実写の人物写真をアップロードできますか？**
A: 安全性ポリシーにより、実写の人物写真はエラーになる場合があります。AI生成画像を使用するか、Cameo機能で自分を登録してください。
