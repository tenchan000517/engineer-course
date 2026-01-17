# 冒頭フックの作り方：ロボットダンス→イラスト変身

リールでも紹介した「冒頭フック」の作り方をまとめました。

---

## この冒頭フックとは

ロボットがダンスしている映像から、イラストキャラクターに変身するエフェクト。

視聴者の手を止める「冒頭フック」として使えます。

---

## 使用するツール

| ツール | 用途 | アクセス |
|--------|------|----------|
| Gemini（Veo 3.1） | ロボットダンス動画の生成 | gemini.google.com |
| Nano Banana Pro | イラストキャラクター画像の生成 | Google AI Studio |
| Higgsfield | 変身エフェクトの適用 | higgsfield.ai |

---

## Step 1：イラストキャラクター画像を作成（Nano Banana Pro）

### Google AI Studioを開く

URL: https://aistudio.google.com

![Google AI Studio HOME画面](/gifts/hook-robot/step1-aistudio-home.png)

### Nano Banana Proを選択

1. 「What's new」セクションから「**Explore Nano Banana Pro**」をクリック

### キャラクターシートを作成

プロンプト例：

```
アニメ風のキャラクターイラスト。
ポップで明るい雰囲気。
カラフルな服装。
正面を向いている。
シンプルな背景。
上半身のバストアップ構図。
高解像度、イラスト風。
```

### 完成例

![完成したキャラクターシート](/gifts/hook-robot/step1-character-sheet.png)

気に入った画像ができるまで何度か試してください。

---

## Step 2：ロボットダンス動画を作成（Gemini / Veo 3.1）

### Geminiを開く

URL: https://gemini.google.com

![Gemini画面](/gifts/hook-robot/step2-gemini.png)

### 画像を共有してプロンプトを入力

1. Step 1で作成したキャラクター画像をGeminiに共有（アップロード）
2. 以下のプロンプトをコピペ：

```
Humanoid robot with sleek metallic chrome body performing fluid street dance moves. Robot executes perfect popping and locking with mechanical precision. LED lights on its body pulse with the rhythm. Urban warehouse setting with industrial atmosphere. Contrast between robotic nature and organic dance movement.
```

### 生成

送信してロボットダンス動画を生成。

数分で完成します。

※Google FLOWでも同様に作成可能です

---

## Step 3：Higgsfieldで変身エフェクトを作成

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

| 項目 | アップロードする画像 |
|------|---------------------|
| Start frame | ロボットダンス動画から切り出した1フレーム（またはロボット画像） |
| End frame | Step 1で作成したイラストキャラクター画像 |

### 設定を確認

- Model: **Kling 2.5 Turbo**
- Duration: **5s**
- Resolution: **1080p**

### 生成

「**Generate**」をクリック（6クレジット消費）

煙のエフェクトで変身する動画が生成されます。

---

## Step 4：動画を繋げる

CapCutなどの編集アプリで以下を繋げます：

1. ロボットダンス動画（Step 2）
2. 変身エフェクト動画（Step 3）

これで冒頭フックの完成。

### 応用テクニック

最終フレームやつなげたい箇所のフレームを切り出して、追加の変身エフェクトを作成することも可能です。

---

## 無料枠について

### Gemini（Veo 3.1）

| プラン | 動画生成 |
|--------|----------|
| Free | 制限あり |
| Pro/Ultra | 十分に使える |

### Nano Banana Pro

**クレジット消費なし**（Google AI Pro/Ultraプラン内で無制限）

### Higgsfield

- 毎日ログインで10クレジット付与
- 5秒動画1回分 = 6クレジット
- 翌日への繰り越しなし

---

## 応用パターン

同じ手順で以下のような変身も作れます：

| Start frame | End frame | 効果 |
|-------------|-----------|------|
| 実写の自分 | アニメ風アバター | 身バレ防止 |
| 普段着 | 派手な衣装 | 衣装チェンジ |
| ロボット | イラスト | ギャップ演出 |

---

## よくある質問

### Q: 無料でできる？

A: Geminiは無料枠あり。Higgsfieldは毎日6クレジット以上もらえるので無料で試せます。

### Q: スマホだけでできる？

A: Higgsfieldはスマホアプリあり。Geminiもブラウザで操作可能。
   編集はCapCutアプリで完結します。

### Q: 生成に失敗したら？

A: プロンプトを微調整するか、別の画像で試してください。
   同じ設定でも結果は毎回異なります。

---

## まとめ

1. Nano Banana Proでイラストキャラクター画像を作成
2. Gemini（Veo 3.1）でロボットダンス動画を作成
3. Higgsfieldで変身エフェクトを作成（AIR BENDING）
4. 2つの動画を繋げて完成

この手順で、手が止まる冒頭フックが作れます。

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2026-01-17 | 初版作成 |
