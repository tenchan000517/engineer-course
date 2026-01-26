# Google Flowで動画を作る

**所要時間**: 30分
**難易度**: ⭐☆☆☆☆

---

## このモジュールで学ぶこと

- Google Flowの概要と特徴
- 環境構築とプランの選択
- Text-to-Videoで動画を生成する方法
- プロンプトの書き方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Google Flowにアクセスして動画生成を開始できる
- Veo 3.1を使ってText-to-Videoで動画を生成できる
- 適切なモデルと設定を選択できる

---

## 目次

- [セクション1: Google Flowとは](#セクション1-google-flowとは)
- [セクション2: 環境構築](#セクション2-環境構築)
- [セクション3: Text-to-Videoで動画生成](#セクション3-text-to-videoで動画生成)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Googleアカウント
- Webブラウザ（Chrome推奨）
- Google AI Pro または Ultra プラン（推奨）

### 料金プラン

| プラン | 月額料金 | 特徴 |
|--------|----------|------|
| Free | 無料 | 180クレジット/月 |
| Pro | $19.99 | Scenebuilder、1080p upscaling |
| Ultra | $249.99 | 最高の生成制限、Veo 3.1 Fast 10クレジット |

---

## セクション1: Google Flowとは

Google Flowは、Googleが提供するAI動画生成ツールです。2025年5月のGoogle I/Oで発表され、Veo 3.1という最新の動画生成AIを搭載しています。

### 主な特徴

- **Veo 3.1**: 最大60秒、1080p、ネイティブオーディオ対応
- **Nano Banana Pro**: 高品質な画像生成AI
- **Scenebuilder**: タイムライン形式の動画編集UI
- **連続動画作成**: 拡張機能で続きのシーンを生成

Google Flowのトップページ：

![Google Flowトップページ](/google-flow/module-01-flow-top.jpg)

「Where the next wave of storytelling happens with Veo」というキャッチコピーの通り、映像制作のためのツールです。

### チェックポイント

- [ ] Google Flowの特徴を理解した
- [ ] 料金プランを確認した

---

## セクション2: 環境構築

### Step 1: Google Flowにアクセス

1. ブラウザで [labs.google/flow/about](https://labs.google/flow/about) にアクセス
2. Googleアカウントでログイン
3. プライバシーポリシーを確認して同意

### Step 2: Scenebuilderを開く

ログイン後、「新しいプロジェクト」をクリックするとScenebuilderが開きます。

Nano Banana Proの案内画面：

![Nano Banana Pro Has Arrived](/google-flow/module-01-nano-banana-arrived.jpg)

Scenebuilder画面：

![Scenebuilder画面](/google-flow/module-01-scenebuilder.png)

画面下部にプロンプト入力欄があり、ここにテキストを入力して動画を生成します。

### チェックポイント

- [ ] labs.google/flow にアクセスできた
- [ ] Scenebuilder画面が表示された

---

## セクション3: Text-to-Videoで動画生成

### Step 1: モードを選択

プロンプト入力欄の左側にあるドロップダウンから「テキストから動画」を選択します。

モード選択メニュー：

![モード選択メニュー](/google-flow/module-01-menu.png)

- **テキストから動画**: テキストプロンプトから動画を生成
- **フレームから動画**: 画像から動画を生成
- **動画の素材**: 素材動画を追加
- **画像を作成**: Nano Banana Proで画像生成

### Step 2: モデルを選択

右側の設定ボタンからモデルを選択します。

モデル選択画面：

![モデル選択](/google-flow/module-01-model-select.png)

| モデル | オーディオ | 用途 |
|--------|----------|------|
| Veo 3.1 - Fast | Beta Audio | 高速生成（推奨） |
| Veo 3.1 - Quality | Beta Audio | 高品質生成 |
| Veo 2 - Fast | No Audio | 旧モデル（音声なし） |
| Veo 2 - Quality | No Audio | 旧モデル（音声なし） |

### Step 3: 設定を調整

出力数選択：

![出力数選択](/google-flow/module-01-output-count.png)

- **プロンプトごとの出力**: 1〜4個を選択可能
- **クレジット消費**: 設定により20クレジット/生成

縦横比選択：

![縦横比選択](/google-flow/module-01-aspect-ratio.png)

- **横向き (16:9)**: YouTube、PC向け
- **縦向き (9:16)**: TikTok、Instagram Reels向け

### Step 4: プロンプトを入力

プロンプト入力画面：

![プロンプト入力](/google-flow/module-01-prompt-input.png)

以下のような構造でプロンプトを入力すると、詳細な動画が生成されます。

```
## Scene: A Professional Japanese Businessman in a Modern Office

**Scene:** A sharply dressed Japanese businessman sits contemplatively
at a minimalist desk within a sleek, high-rise office overlooking
a vibrant metropolis at dusk.

**Visuals:** The subject is a middle-aged Japanese man, impeccably
dressed in a dark, tailored suit. The environment is a spacious,
modern corporate office featuring floor-to-ceiling windows.
The lighting style is cinematic and dramatic.

**Camera:** Medium close-up focusing on the businessman's face
and hands resting on the desk. Slow, imperceptible push-in.

**Audio:** Controlled, ambient, and subtly tense.

**Music:** Minimalist ambient synth, low in the mix.
```

### Step 5: 生成を実行

プロンプト入力後、送信ボタン（→）をクリックすると生成が始まります。

生成中の画面：

![生成中](/google-flow/module-01-generating.png)

- 進捗がパーセンテージで表示される
- 複数の動画を同時に生成可能
- 生成完了まで数分かかる場合がある

### チェックポイント

- [ ] Text-to-Videoモードを選択できた
- [ ] モデル（Veo 3.1 - Fast）を選択できた
- [ ] 縦横比と出力数を設定できた
- [ ] プロンプトを入力して動画を生成できた

---

## トラブルシューティング

### 「著名人の生成に関するポリシーに違反」エラー

**原因**: プロンプトに人物表現（hand, person等）が含まれていると発生することがある

**解決策**: シンプルなプロンプトに変更する

```
# NG例
A hand reaches in and picks up the coffee cup...

# OK例
The coffee cup rises from the table. Steam trails upward.
```

### 生成が完了しない

**原因**: サーバー負荷が高い、またはプロンプトが複雑すぎる

**解決策**:
1. しばらく待ってから再試行
2. プロンプトを短くシンプルにする
3. 出力数を1に減らす

---

## まとめ

### このモジュールで学んだこと

- Google Flowは labs.google/flow でアクセスできる
- Veo 3.1は最大60秒、1080p、オーディオ付きの動画を生成できる
- プロンプトは詳細に記述すると品質が向上する
- 人物表現を含むプロンプトはポリシー違反になる場合がある

### 次のステップ

次のモジュールでは、Scenebuilderを使って連続動画を作成する方法を学びます。拡張機能を使って続きのシーンを生成し、タイムライン上で動画を連結します。

---

## 参考資料

- [Google Flow 公式](https://labs.google/flow/about)
- [Veo 3.1 - Google DeepMind](https://deepmind.google/models/veo/)
- [Google AI Ultra for Business](https://workspace.google.com/products/ai-ultra/)

---

## よくある質問

**Q: 無料プランでどのくらい動画を作れますか？**
A: 180クレジット/月で、1回の生成に20クレジット消費するため、約9回の生成が可能です。

**Q: Veo 3.1 FastとQualityの違いは何ですか？**
A: Fastは生成速度が速く、Qualityはより高品質な動画を生成します。クレジット消費はQualityの方が多くなります。

**Q: 生成した動画の著作権はどうなりますか？**
A: Google のサービス利用規約に従います。商用利用については最新の利用規約を確認してください。

**Q: 日本語でプロンプトを書けますか？**
A: 英語でのプロンプトを推奨します。日本語でも生成できますが、英語の方が意図通りの結果が得られやすいです。

**Q: 動画の長さは最大何秒ですか？**
A: Veo 3.1では最大60秒の動画を生成できます。ただし、クレジット消費は長さに比例して増加します。
