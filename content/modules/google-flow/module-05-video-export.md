# 動画生成からBGM追加・仕上げまで

**所要時間**: 60分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 素材画像から動画を生成する方法
- Sunoを使ったBGM作成
- Canvaでの仕上げ編集（トランジション・音声調整）

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- フレームから動画モードで一貫性のある動画を生成できる
- Sunoで動画に合ったBGMを作成できる
- Canvaで動画の仕上げ編集ができる

---

## 目次

- [セクション1: フレームから動画で生成する](#セクション1-フレームから動画で生成する)
- [セクション2: SunoでBGMを作成する](#セクション2-sunoでbgmを作成する)
- [セクション3: Canvaで仕上げ編集する](#セクション3-canvaで仕上げ編集する)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Google AI Pro または Ultra プラン
- Module 04で作成した素材画像
- Sunoアカウント（無料プランでOK）
- Canvaアカウント（無料プランでOK）

### 前提知識

- Module 01〜04を完了していること

---

## セクション1: フレームから動画で生成する

素材画像を使って、各シーンの動画を生成します。

### Step 1: フレームから動画モードを選択

1. labs.google/flow にアクセス
2. モード選択 → **「フレームから動画」**
3. モデル → **Veo 2 Fast**（10クレジット/回）

### Step 2: 画像をアップロード

Module 04で作成した素材画像をアップロードします。

### Step 3: プロンプトを入力

**重要**: 人物の特徴は書かない。動きとカメラワークだけを指示。

#### 各シーンのプロンプト例

**シーン1（走る）**:
```
Running faster, accelerates, exits frame right, side tracking shot
```

**シーン2（ミーティング笑顔）**:
```
Discussion continues, pointing at documents, engaged conversation, slight camera movement
```

**シーン3（議論）**:
```
Heated discussion continues, energetic debate, slight camera movement
```

**シーン4（握手→ハグ）**:
```
Handshake, then transitions to celebratory hug, joyful moment
```

**シーン5（プレゼン）**:
```
Presenting continues, confident gestures, slight camera push in
```

**シーン6（外へ出る）**:
```
Walking forward, afternoon sunlight, confident stride, camera tilts up to bright sky, fades to white
```

### Step 4: 生成・確認

1. Generateをクリック
2. 生成完了まで待機
3. 結果を確認
4. 良ければダウンロード、または再生成

### Step 5: 全シーンを生成

同様の手順で全シーンの動画を生成します。

### クレジット消費の目安

| モデル | 消費 | 6シーン合計 |
|--------|------|------------|
| Veo 2 Fast | 10cr/回 | 60cr |
| リテイク2倍 | - | 120cr |

### チェックポイント

- [ ] 全シーンの動画を生成した
- [ ] 各動画をダウンロードした

---

## セクション2: SunoでBGMを作成する

動画に合ったBGMをSunoで作成します。

### Step 1: Sunoにアクセス

1. [suno.com](https://suno.com/) にアクセス
2. アカウントを作成（またはログイン）

### Step 2: 曲を作成

1. 「Create」をクリック
2. 「Custom」モードを選択
3. 以下を設定:
   - **Style**: 曲のスタイル
   - **Instrumental**: チェックを入れる（ボーカルなし）

### Step 3: プロンプトを入力

動画の長さと雰囲気に合わせたプロンプトを入力します。

Suno の画面:

![Suno UI](/google-flow/module-05-suno-ui.png)

#### 48秒の企業PV用BGMの例

```
48 seconds, no vocals
Energetic and inspiring corporate track for startup recruitment video
Structure:
0:00-0:10 - Building energy, anticipation, forward momentum
0:10-0:25 - Uplifting main theme, teamwork feeling, bright and hopeful
0:25-0:40 - Peak energy, achievement, celebration
0:40-0:48 - Emotional climax, soaring feeling, fade out to hope
Modern synths, driving beat, acoustic guitar touches, piano accents
Positive, ambitious, youthful energy
BPM: 110-120
```

**注意**: プロンプトが長すぎるとエラーになります。その場合は短縮してください。

#### 短縮版

```
48 sec instrumental, inspiring corporate pop, modern synths, driving beat, builds to emotional climax, hopeful ending, 115 BPM
```

### Step 4: 生成・ダウンロード

1. 生成ボタンをクリック
2. 複数の候補から選択
3. 気に入った曲をダウンロード

### チェックポイント

- [ ] Sunoでアカウントを作成した
- [ ] BGMを生成した
- [ ] 気に入った曲をダウンロードした

---

## セクション3: Canvaで仕上げ編集する

生成した動画とBGMを組み合わせ、仕上げ編集を行います。

### なぜCanvaを使うのか

Google Flowでできないこと：

| 作業 | Flowで可能？ |
|------|-------------|
| トランジション追加 | 限定的 |
| BGM追加 | 不可 |
| 音声調整 | 不可 |
| フェードイン/アウト | 不可 |

### Step 1: Canvaでプロジェクト作成

1. [canva.com](https://www.canva.com/) にアクセス
2. 「動画」→「カスタムサイズ」
3. 1920 x 1080（16:9）を選択
4. 「デザインを作成」

### Step 2: 動画を配置

1. 「アップロード」→ 各シーンの動画をアップロード
2. タイムラインに順番に配置
3. 必要に応じてトリミング

### Step 3: BGMを追加

1. 「アップロード」→ Sunoで作成したBGMをアップロード
2. タイムラインに配置
3. 動画の長さに合わせて調整

### Step 4: Flowの音声を消す

Google Flowで生成した動画には音声が含まれている場合があります。

1. 各動画クリップを選択
2. 音声アイコンをクリック
3. **音量を0に設定**

### Step 5: トランジション・フェードを追加

#### 最初にホワイトイン

1. 最初のクリップを選択
2. 「エフェクト」→「フェードイン」
3. または白い画像を配置してフェードアウト

#### 最後にフェードアウト

1. 最後のクリップを選択
2. 「エフェクト」→「フェードアウト」

#### BGMのフェードアウト

1. BGMトラックを選択
2. 終了部分を選択
3. 「フェードアウト」を適用

### Step 6: エクスポート

1. 右上の「共有」→「ダウンロード」
2. **MP4形式**を選択
3. 品質を選択（推奨: 1080p）
4. ダウンロード

### 完成動画の例

実際にこのワークフローで作成した企業PV（48秒）:

<video controls width="100%">
  <source src="/google-flow/module-05-complete-pv.mp4" type="video/mp4">
</video>

### チェックポイント

- [ ] Canvaで動画を配置した
- [ ] BGMを追加した
- [ ] Flowの動画音声を0にした
- [ ] トランジション・フェードを追加した
- [ ] 完成動画をエクスポートした

---

## トラブルシューティング

### Flowの音声が消えない

**原因**: 音量設定が適用されていない

**解決策**:
1. クリップを選択
2. 音声アイコンを確認
3. 音量スライダーを0に

### BGMと動画の長さが合わない

**原因**: BGMが動画より長い/短い

**解決策**:
- BGMが長い場合: トリミングしてフェードアウト
- BGMが短い場合: Sunoで長めに再生成

### 書き出しに時間がかかる

**原因**: 動画が長い、または高解像度

**解決策**:
- しばらく待つ
- 品質を下げる（1080p → 720p）

---

## まとめ

### このモジュールで学んだこと

- フレームから動画モードで一貫性のある動画を生成できる
- Sunoで動画に合ったBGMを無料で作成できる
- Canvaで仕上げ編集（トランジション・音声調整）ができる

### 制作フローの全体像

```
1. 企画（Module 03）
   ↓
2. 素材画像作成（Module 04）
   ↓
3. 動画生成（本モジュール）
   ↓
4. BGM作成（本モジュール）
   ↓
5. 仕上げ編集（本モジュール）
   ↓
6. 完成・エクスポート
```

### 次のステップ

これでGoogle Flow基礎編は完了です。実際に自分のプロジェクトでPVを作成してみましょう。

---

## 参考資料

- [Google Flow 公式](https://labs.google/flow/about)
- [Suno](https://suno.com/)
- [Canva](https://www.canva.com/)

---

## よくある質問

**Q: Sunoの無料枠で足りますか？**
A: 無料枠でも1日に数曲生成できます。企業PV 1本分のBGMなら十分です。

**Q: Canva以外のソフトでも仕上げできますか？**
A: はい、CapCut、DaVinci Resolve、Adobe Premiere Proなど、動画編集ソフトなら何でも可能です。Canvaは無料で使いやすいため推奨しています。

**Q: ロゴやテロップはどこで追加しますか？**
A: Canvaでの仕上げ編集時に追加します。テキストツールでテロップを、画像アップロードでロゴを追加できます。

**Q: 完成動画の解像度は？**
A: Google Flowは1080pで出力されます。Canvaでの書き出し時も1080pを推奨します。

**Q: 商用利用できますか？**
A: Google Flow、Suno、Canvaそれぞれの利用規約を確認してください。有料プランでは商用利用が許可されている場合が多いです。
