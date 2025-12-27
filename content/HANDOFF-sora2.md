# HANDOFF: Sora 2 講座作成

## 概要
Sora 2とNano Banana Proを使った動画生成講座の作成
**最終目標**: トップクリエイターレベルの採用PVを「台本どおり」に作成できる講座

## 参照マニュアル
`C:\Video_research\sora2_recruitment_pv_complete_manual.md`

---

## 次のタスク（最優先）

### 現在: 一時中断

**理由**: Google Flow講座の実現可能性調査を優先
**参照**: `content/HANDOFF-google-flow.md`

---

### 完了済み調査

- ~~Storyboardの人物NG問題の解決策を調査~~ → 調査完了
- ~~連続性のある動画の作成方法を調査~~ → 調査完了

---

## 進捗状況

### 完了
- [x] 環境構築確認（Sora 2, Google AI Studio）
- [x] Nano Banana Proで画像生成テスト
- [x] Sora 2でImage-to-Video生成テスト
- [x] Sora 2でText-to-Video生成テスト
- [x] 公式プロンプト分析・基本構造作成
- [x] Storyboard機能の検証・講座作成
- [x] **人物画像アップロード問題の調査**（2025-12-24）
- [x] **Characters機能の検証**（スマホ登録→WEB反映を確認）
- [x] **Module 03 Characters機能講座作成**（2025-12-24）
- [x] **連続動画の作成方法調査**（2025-12-24）
- [x] **Module 04 アニメキャラクター講座作成**（2025-12-24）
- [x] **連続動画作成の実証・Module 05作成**（2025-12-24）

### 未完了
- [ ] プロンプトによる人物一貫性のベストプラクティス検証

---

## サブコース構成（2025-12-24 設定）

```
sora2/                    ← 親カテゴリ
├── sora2-basics/         ← 基礎編（サブコースID）→ content/modules/sora2/
└── sora2-advanced/       ← 上級編（サブコースID）→ content/modules/sora2-advanced/
```

### ルーティング
- `app/category/sora2/[subcourseSlug]/page.tsx` - サブコース一覧
- `app/category/sora2/[subcourseSlug]/[moduleSlug]/page.tsx` - モジュールページ

### カード色
- 黒背景（`bg-gray-900`）・白テキスト（OpenAI風）
- `app/page.tsx` と `app/category/[categorySlug]/page.tsx` のcolorMapに設定済み

---

## 講座構成

**5モジュール構成**

```
Module 01: Sora 2で動画を作る（基礎）
├── ツールの概要と環境構築
├── プロンプトの基本構造
├── Nano Banana Proで画像生成
├── Sora 2で動画生成（Image-to-Video）
└── トラブルシューティング

Module 02: Storyboardで台本どおりの動画を作る
├── Storyboard機能とは
├── Storyboardの使い方
├── 実践 - 採用PVの冒頭を作る
├── 制約と注意点（人物画像NG等）
└── トラブルシューティング

Module 03: Characters機能で人物を登場させる
├── Characters機能とは
├── キャラクターの登録方法（スマホアプリ）
├── 公開設定（重要！設定ミスで他人に使われるリスク）
├── キャラクターを使って動画を作る
└── クライアントワークでの活用

Module 04: アニメキャラクターで動画を作る
├── アニメキャラは人物NGに該当しない（重要発見）
├── 画像の解像度要件（352p=15秒制限）
├── Nano Banana Proで解像度を上げる
├── アニメスタイル向けプロンプト
└── 実践結果

Module 05: 連続動画の作成方法 ← NEW
├── 最後のフレームを参照画像として使用（重要）
├── Stitch機能の使い方と限界
├── 全身を映すことの重要性（服装変化リスク回避）
├── 編集ソフトでの連結を推奨
└── ベストプラクティス
```

**作成済みファイル**:
- `content/modules/sora2/_category.json`
- `content/modules/sora2/module-01-video-generation.md`
- `content/modules/sora2/module-02-storyboard.md`
- `content/modules/sora2/module-03-characters.md`
- `content/modules/sora2/module-04-anime-character.md`
- `content/modules/sora2/module-05-continuous-video.md` ← NEW

---

## 配置済みファイル（public/sora2/）

### Module 01
| ファイル名 | 内容 |
|-----------|------|
| `module-01-sora-explore.jpg` | Sora 2 Exploreページ |
| `module-01-nano-banana-pro.png` | Google AI Studio Nano Banana Pro |
| `module-01-generated-image.png` | Nano Banana Pro 画像生成結果 |
| `module-01-upload-menu.png` | Sora 2 アップロードメニュー |
| `module-01-agreement.png` | Sora 2 Media upload agreement |
| `module-01-image-to-video.mp4` | Image-to-Video生成結果 |
| `module-01-text-to-video.mp4` | Text-to-Video生成結果 |

### Module 02
| ファイル名 | 内容 |
|-----------|------|
| `module-02-storyboard-ui.png` | Storyboard画面 |
| `module-02-duration-select.png` | Duration選択 |
| `module-02-orientation-select.png` | Orientation選択 |
| `module-02-fit-scenes.png` | Fit scenes to duration |
| `module-02-drafts.png` | Drafts画面 |
| `module-02-people-restriction.png` | 人物画像制限エラー |
| `module-02-storyboard-result-1.mp4` | Storyboard生成結果1 |
| `module-02-storyboard-result-2.mp4` | Storyboard生成結果2 |
| `module-02-storyboard-result-3.mp4` | Storyboard生成結果3 |

### Module 03
| ファイル名 | 内容 |
|-----------|------|
| `module-03-character-permission.jpg` | キャラクター公開設定画面 |
| `module-03-create-with-character.jpg` | キャラクター選択して動画作成 |
| `module-03-credits.jpg` | クレジット残量画面 |
| `module-03-message-permission.jpg` | メッセージ送信権限設定 |
| `module-03-data-export.jpg` | データエクスポート設定 |

### Module 04
| ファイル名 | 内容 |
|-----------|------|
| `module-04-original-character.jpg` | 元のアニメキャラクター |
| `module-04-character-hd.jpg` | Nano Banana ProでHD化した画像 |
| `module-04-storyboard-ui.png` | Storyboard設定画面 |
| `module-04-anime-result.mp4` | アニメーション生成結果 |

### Module 05
| ファイル名 | 内容 |
|-----------|------|
| `module-05-drafts.png` | Drafts画面（動画選択） |
| `module-05-stitch-ui.png` | Stitch機能UI |
| `module-05-continued-result.mp4` | 続きの動画生成結果 |

---

## 判明した重要な制約

| 制約 | 詳細 |
|------|------|
| Storyboardで人物画像NG | 「For safety, we don't create videos from images that include people.」 |
| **アニメ/イラストはOK** | 人物として検出されない（検証済み） |
| 最大25秒 | Plusプランでの上限 |
| **352p動画は15秒まで** | 低解像度画像使用時の制限 |
| 同時生成3本まで | 「You can only generate 3 videos at a time」 |
| 第三者コンテンツ類似NG | 既存コンテンツに似すぎるとエラー |
| **Stitch最大60秒** | 複数クリップ連結の上限 |
| **全身が映っていないと服装変化** | 続きの動画で半ズボンになる等のリスク（検証済み） |

---

## 調査結果: 人物画像アップロード問題（2025-12-24）

### 結論
**人物画像のアップロードは不可能**（OpenAI公式ポリシー）

> "At launch, generating videos based on uploaded images that include real people is blocked."
> "Uploading images with depictions of real people is blocked."

### Characters機能（人物を登場させる唯一の方法）

| 項目 | 詳細 |
|------|------|
| 登録方法 | **Soraアプリ内で本人が録画**（写真アップロード不可） |
| 必要なもの | 短いビデオ+音声の録画（本人確認・同意プロセス） |
| 対象 | 自分自身 or 承認した人物のみ |
| 公開設定 | 自分のみ / 相互フォロワー / 全員に公開 から選択可能 |
| WEB版への反映 | **スマホで登録 → WEB版(sora.com)に反映される**（検証済み） |

### 公開キャラクターの活用

- 他ユーザーが**公開設定**にしたキャラクターは誰でも使用可能
- アプリの「キャラクター」タブから選択できる
- @メンションでプロンプトに指定（例: `@username`）

### クライアントワークでの活用方法

**クライアント本人に登録してもらえば、その人物での動画作成は可能**

1. クライアントにSoraアプリをインストールしてもらう
2. Characters機能で本人が録画・登録
3. 公開設定を「全員」または「相互フォロワー」に設定してもらう
4. こちらでキャラクターを指定して動画作成

### 講座での対応方針

**人物はプロンプトで作り込む方式を採用**
- Storyboard機能は優秀なので活用
- 人物の一貫性はプロンプトの詳細記述で対応
- Characters機能は「上級者向けTips」として紹介

### 参考リンク（公式）
- [Generating content with characters | OpenAI Help Center](https://help.openai.com/en/articles/12435986-generating-content-with-characters)
- [Creating videos with Sora | OpenAI Help Center](https://help.openai.com/en/articles/12460853-creating-videos-with-sora)

---

## 調査結果: 連続動画の作成方法（2025-12-24）

### 結論
**公式のStitch機能で最大60秒まで作成可能**

### 方法1: Stitch機能（公式・推奨）

| 項目 | 詳細 |
|------|------|
| 機能 | 複数クリップを1本の動画に連結 |
| **最大尺** | **60秒まで可能** |
| 利用場所 | iOSアプリ、sora.com |
| Android | **未対応** |

**手順**:
1. Draftsで連結したい動画を選択
2. 「Stitch」をタップ
3. プレビュー確認後、再度「Stitch」
4. 完成した動画がDraftsに表示

### 方法2: Extend機能（公式）

| 種類 | 説明 |
|------|------|
| Forward Extend | クリップの**続き**を生成 |
| Backward Extend | クリップの**前**を生成（フラッシュバック等） |

Video Editorの「Re-cut」機能で操作可能。

### 方法3: 最後のフレームを参照画像に

1. クリップの**最後のフレーム**を画像として保存
2. その画像をアップロードして次のクリップを生成
3. プロンプトで「前のクリップの終わり方」を記述

### クレジット消費

| 動画長 | カウント |
|--------|---------|
| 15秒 | 2動画分 |
| 25秒 | 4動画分 |

### ベストプラクティス

- プロンプトで連続性を記述する
- キャラクターのポーズ・位置を一貫させる
- 事前にストーリー全体を計画する

### 参考リンク（公式）
- [Sora Release Notes | OpenAI Help Center](https://help.openai.com/en/articles/12593142-sora-release-notes)
- [Creating videos with Sora | OpenAI Help Center](https://help.openai.com/en/articles/12460853-creating-videos-with-sora)

---

## 古いSora vs 新しいSora

- 今回検証したのは**新しいSora（Storyboard機能付き）**
- 人物画像の制約は新しいSoraで確認
- 古いSoraとの違いは要整理

---

## マニュアルとの差異・修正ポイント

| 項目 | マニュアル記載 | 実際 |
|------|--------------|------|
| Plus動画長 | 最大5秒 | **最大10秒** |
| Nano Banana Proアクセス | gemini.google.com | **Google AI Studioからも可能** |
| プロンプト推奨長 | 25単語以下 | **公式は100単語以上が普通** |
| Image-to-Video動き | プロンプト通り | **細かい動き指示は反映されにくい** |
| Text-to-Video | - | **キャラクター一貫性の維持が難しい** |

---

## 公式プロンプト基本構造

### 構造テンプレート
```
[1. フォーマット・技術指定]
[2. カメラ設定]
[3. シーン・被写体の詳細]
[4. 動きの流れ]
[5. 照明・色調・ムード]
[6. 禁止事項（必要な場合）]
```

### 各要素
1. **フォーマット**: vertical 9:16, photorealistic, seamlessly looping
2. **カメラ**: overhead shot, fixed, slow handheld, iPhone-style
3. **シーン**: 場所、人物、オブジェクト、配置
4. **動き**: Begin with → Then → Finally, subtle movements
5. **照明・ムード**: cinematic, warm tones, calm, focused
6. **禁止事項**: No text, no logos, No zoom (ループ用)

---

## 実践で得られた知見

### 成功した点
- Nano Banana Pro: プロンプト通りの画像生成OK
- Sora 2: 動画生成自体は成功
- Media upload agreementの同意フロー確認

### 課題・注意点
- Plusプランはクレジット制限あり
- 動きの細かい指示は反映されにくい（うなずき指示→動かず）
- キャラクター一貫性にはImage-to-VideoまたはCameo必須
- 詳細なプロンプトが必要（公式例を参考に）

---

## 次のタスク
1. 講座構成を決定
2. 講座マークダウン作成開始

---

**最終更新**: 2025-12-24 17:30
