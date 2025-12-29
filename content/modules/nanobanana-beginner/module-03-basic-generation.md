# 基本的な画像生成

**所要時間**: 25分
**難易度**: ⭐⭐☆☆☆

このモジュールの最後に[スクリプトダウンロード](#スクリプトダウンロード)があります。

---

## このモジュールで学ぶこと

- 様々なプロンプトで画像を生成する方法
- 効果的なプロンプトの書き方
- レスポンスの処理方法
- 生成結果の保存と管理

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. 自由なプロンプトで画像を生成できる
2. 効果的なプロンプトを作成できる
3. 生成した画像を適切に保存できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: プロンプトの基本](#セクション1-プロンプトの基本)
- [セクション2: 様々な画像を生成する](#セクション2-様々な画像を生成する)
- [セクション3: 効果的なプロンプトの書き方](#セクション3-効果的なプロンプトの書き方)
- [セクション4: 汎用スクリプトの作成](#セクション4-汎用スクリプトの作成)
- [まとめ](#まとめ)
- [スクリプトダウンロード](#スクリプトダウンロード)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- [環境構築](/category/nanobanana-image-generation/nanobanana-beginner/module-02-setup)で構築した環境（C:\nanobanana）
- 仮想環境が有効化されていること

### 環境の確認

ターミナルで以下を実行して、仮想環境を有効化します。

**PowerShellの場合**:
```powershell
cd C:\nanobanana
.\venv\Scripts\Activate
```

**Git Bashの場合**:
```bash
cd /c/nanobanana
source venv/Scripts/activate
```

プロンプトに `(venv)` が表示されていることを確認してください。

---

## セクション1: プロンプトの基本

### 1-1. プロンプトとは

プロンプトは、AIに「どんな画像を生成してほしいか」を伝えるテキストです。

[環境構築](/category/nanobanana-image-generation/nanobanana-beginner/module-02-setup)のテストスクリプトでは、以下のプロンプトを使用しました：

```
A simple red apple on white background
```

このプロンプトから、赤いリンゴの画像が生成されました。

### 1-2. 基本的な構造

効果的なプロンプトは以下の要素を含みます：

| 要素 | 説明 | 例 |
|------|------|-----|
| 主題 | 何を描くか | apple, cat, landscape |
| 属性 | 主題の特徴 | red, cute, beautiful |
| 背景 | 背景の指定 | white background, in a forest |
| スタイル | 画風の指定 | realistic, anime style, watercolor |

### 1-3. 日本語 vs 英語

Nanobananaは日本語プロンプトにも対応していますが、一般的に英語の方が精度が高い傾向があります。

| 言語 | メリット | デメリット |
|------|---------|-----------|
| 英語 | 精度が高い、情報が豊富 | 英語力が必要 |
| 日本語 | 直感的に書ける | 精度がやや下がる場合あり |

### チェックポイント

- [ ] プロンプトの基本構造を理解した
- [ ] 日本語/英語の違いを理解した

---

## セクション2: 様々な画像を生成する

このセクションでは、様々なプロンプトを試して画像を生成します。

### 実行方法

[環境構築](/category/nanobanana-image-generation/nanobanana-beginner/module-02-setup)で作成した `test_nanobanana.py` を開き、プロンプト部分を変更して実行します。

```powershell
notepad test_nanobanana.py
```

以下のような画面が開きます：

![スクリプトをメモ帳で開いた画面](/nanobanana-image-generation/images/module-03-notepad-script.png)

`contents=` の行を見つけて、プロンプトを変更します：

```python
contents="A simple red apple on white background",  # ← ここを変更
```

変更後、保存してスクリプトを実行します：

```powershell
python test_nanobanana.py
```

生成された画像は `test_output.png` に保存されます。

---

### 2-1. シンプルなオブジェクト

プロンプトを以下に変更して実行してみましょう：

```
A cute orange cat sitting on a cushion
```

生成例：

![シンプルなオブジェクトの生成例](/nanobanana-image-generation/images/module-03-sample-cat.png)

### 2-2. 風景

プロンプトを以下に変更して実行してみましょう：

```
A peaceful mountain landscape at sunset with a calm lake in the foreground
```

生成例：

![風景の生成例](/nanobanana-image-generation/images/module-03-sample-landscape.png)

### 2-3. 人物（イラスト風）

プロンプトを以下に変更して実行してみましょう：

```
An anime-style girl with blue hair holding a book, simple background
```

生成例：

![人物イラストの生成例](/nanobanana-image-generation/images/module-03-sample-anime.png)

### 2-4. 抽象的なイメージ

プロンプトを以下に変更して実行してみましょう：

```
Abstract colorful geometric shapes floating in space
```

生成例：

![抽象的なイメージの生成例](/nanobanana-image-generation/images/module-03-sample-abstract.png)

### 2-5. 日本語プロンプトの例

プロンプトを以下に変更して実行してみましょう：

```
桜の木の下で本を読む女の子、アニメ風イラスト
```

生成例：

![日本語プロンプトの生成例](/nanobanana-image-generation/images/module-03-sample-sakura.png)

### 2-6. 実写人物（ビジネス）

プロンプトを以下に変更して実行してみましょう：

```
A professional photo of a young businessman in a suit, office background, natural lighting
```

生成例：

![実写人物（ビジネス）の生成例](/nanobanana-image-generation/images/module-03-sample-businessman.png)

### 2-7. 実写人物（ポートレート）

プロンプトを以下に変更して実行してみましょう：

```
A portrait of a woman with long brown hair, smiling, outdoor setting, soft natural light
```

生成例：

![実写人物（ポートレート）の生成例](/nanobanana-image-generation/images/module-03-sample-portrait.png)

### 2-8. 実写人物（日本人男性）

プロンプトを以下に変更して実行してみましょう：

```
A professional photo of a young Japanese businessman in a suit, modern office background, natural lighting
```

生成例：

![実写人物（日本人男性）の生成例](/nanobanana-image-generation/images/module-03-sample-japanese-man.png)

### 2-9. 実写人物（日本人女性）

プロンプトを以下に変更して実行してみましょう：

```
A portrait of a Japanese woman with black hair, gentle smile, cherry blossom background, soft natural light
```

生成例：

![実写人物（日本人女性）の生成例](/nanobanana-image-generation/images/module-03-sample-japanese-woman.png)

### チェックポイント

- [ ] 2-1〜2-9のうち、少なくとも3つのプロンプトで画像を生成した
- [ ] 英語と日本語で結果の違いを確認した
- [ ] イラストと実写の違いを確認した

---

## セクション3: 効果的なプロンプトの書き方

### 3-1. 具体的に書く

**悪い例**:
```
A dog
```

![悪い例の生成結果](/nanobanana-image-generation/images/module-03-prompt-bad.png)

犬は生成されましたが、背景や状況はAI任せになります。

**良い例**:
```
A golden retriever puppy playing with a red ball in a sunny park
```

![良い例の生成結果](/nanobanana-image-generation/images/module-03-prompt-good.png)

具体的な情報（犬種、行動、場所、天気）を追加することで、イメージ通りの画像が生成されやすくなります。

### 3-2. スタイルを指定する

画風を指定することで、生成結果をコントロールできます。

| スタイル指定 | 効果 |
|-------------|------|
| realistic | 写実的 |
| anime style | アニメ風 |
| watercolor | 水彩画風 |
| oil painting | 油絵風 |
| digital art | デジタルアート風 |
| minimalist | ミニマリスト風 |

**例**:
```
A castle on a hill, watercolor style, soft colors
```

![水彩画風の城](/nanobanana-image-generation/images/module-03-style-watercolor.png)

### 3-3. 構図を指定する

| 構図指定 | 効果 |
|---------|------|
| close-up | アップ |
| wide shot | 広角 |
| bird's eye view | 俯瞰 |
| side view | 横から |
| centered | 中央配置 |

**例**:
```
Close-up of a butterfly on a flower, macro photography style
```

![蝶のマクロ撮影](/nanobanana-image-generation/images/module-03-composition-macro.png)

### 3-4. 品質指定

以下のキーワードを追加すると、品質が向上する場合があります：

- `high quality`
- `detailed`
- `professional`
- `4k`

**例**:
```
A professional photograph of sushi, high quality, detailed, studio lighting
```

![寿司のプロ写真](/nanobanana-image-generation/images/module-03-quality-sushi.png)

### チェックポイント

- [ ] 具体的なプロンプトの書き方を理解した
- [ ] スタイル指定の方法を理解した
- [ ] 構図指定の方法を理解した

---

## セクション4: 汎用スクリプトの作成

### 4-1. コマンドライン引数対応スクリプト

プロンプトをコマンドラインから指定できるスクリプトを作成します。

PowerShellで以下を実行：

```powershell
notepad generate_image.py
```

以下のコードを貼り付けて保存：

```python
import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

def generate_image(prompt, output_filename=None):
    """プロンプトから画像を生成する"""

    load_dotenv()
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

    print(f"プロンプト: {prompt}")
    print("生成中...")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['IMAGE']
        )
    )

    for part in response.parts:
        if part.inline_data is not None:
            image = part.as_image()

            # ファイル名が指定されていなければタイムスタンプで生成
            if output_filename is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_filename = f"generated_{timestamp}.png"

            image.save(output_filename)
            print(f"画像を保存しました: {output_filename}")
            return output_filename

    print("画像の生成に失敗しました")
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python generate_image.py \"プロンプト\" [出力ファイル名]")
        print("例: python generate_image.py \"A cute cat\" cat.png")
        sys.exit(1)

    prompt = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None

    generate_image(prompt, output)
```

### 4-2. スクリプトの使い方

**基本的な使い方**:
```powershell
python generate_image.py "A cute orange cat"
```

生成例（ファイル名は自動でタイムスタンプ付きになります）：

![基本的な使い方の生成例](/nanobanana-image-generation/images/module-03-script-basic.png)

**ファイル名を指定**:
```powershell
python generate_image.py "A cute orange cat" cat.png
```

生成例：

![ファイル名指定の生成例](/nanobanana-image-generation/images/module-03-script-cat.png)

**日本語プロンプト**:
```powershell
python generate_image.py "かわいい猫のイラスト"
```

生成例：

![日本語プロンプトの生成例](/nanobanana-image-generation/images/module-03-script-japanese.png)

### 4-3. 複数の画像を生成する

異なるプロンプトで複数の画像を生成してみましょう：

```powershell
python generate_image.py "A red apple on white background" apple.png
python generate_image.py "A blue ocean with sunset" ocean.png
python generate_image.py "An anime-style cat girl" catgirl.png
```

生成例：

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">

![apple.png](/nanobanana-image-generation/images/module-03-multi-apple.png)

![ocean.png](/nanobanana-image-generation/images/module-03-multi-ocean.png)

![catgirl.png](/nanobanana-image-generation/images/module-03-multi-catgirl.png)

</div>

### チェックポイント

- [ ] generate_image.py を作成した
- [ ] コマンドラインからプロンプトを指定して実行できた
- [ ] 複数の画像を生成してみた

---

## まとめ

### このモジュールで学んだこと

- プロンプトの基本構造（主題、属性、背景、スタイル）
- 効果的なプロンプトの書き方
- スタイル・構図・品質の指定方法
- コマンドライン対応の汎用スクリプト作成

### 作成したファイル

```
C:\nanobanana\
├── generate_image.py       # 汎用画像生成スクリプト
├── generated_*.png         # 生成した画像
└── ...
```

### 次のステップ

Module 04では、アスペクト比の指定や参照画像を使った応用的な画像生成を学びます。

---

## スクリプトダウンロード

以下のスクリプトをダウンロードして使用できます。

[generate_image.py](/nanobanana-image-generation/download/generate_image.py)

**使用前の準備**:
- [環境構築](/category/nanobanana-image-generation/nanobanana-beginner/module-02-setup)で作成した `.env` ファイルが同じディレクトリにあること

---

## 参考資料

- [Gemini API - Image Generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Prompt Engineering Guide](https://ai.google.dev/gemini-api/docs/prompting-strategies)

---

## よくある質問

**Q: 同じプロンプトで毎回同じ画像が生成されますか？**
A: いいえ、同じプロンプトでも毎回異なる画像が生成されます。これはAIの特性によるものです。

**Q: 生成できない内容はありますか？**
A: はい、暴力的・性的・違法なコンテンツなどは生成できません。安全フィルターによってブロックされます。

**Q: 日本語と英語を混ぜたプロンプトは使えますか？**
A: 使えますが、一般的には言語を統一した方が良い結果が得られます。

**Q: プロンプトの長さに制限はありますか？**
A: 極端に長いプロンプトは処理できない場合があります。通常は数百文字程度で十分です。

**Q: 生成された画像の解像度は？**
A: Nano Banana（gemini-2.5-flash-image）では最大1024pxです。より高解像度が必要な場合はNano Banana Proを使用します。
