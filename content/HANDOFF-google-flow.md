# HANDOFF: Google Flow 講座

## 概要

Google Flowを使った企業PV作成講座

**参照マニュアル**: `C:\Video_research\corporate_pv_workflow_final.md`

---

## 🚀 次セッションで即実行（ここから始める）

### 目標
Flowで実際に企業採用PVのサンプルシーンを1つ作成し、ワークフローを検証

### 準備確認
- [ ] Google AI Pro契約済み
- [ ] labs.google/flow にアクセス可能
- [ ] 作りたいPVの簡易台本

### Step 1: サンプル台本（採用PV 30秒版）

```
シーン1 (5秒): オフィス外観 - モダンなビル、朝の光
シーン2 (8秒): 社員インタビュー - 若手社員がカメラに向かって話す
シーン3 (8秒): チーム作業風景 - 会議室でディスカッション
シーン4 (5秒): 製品/サービス - ロゴと製品イメージ
シーン5 (4秒): エンディング - 企業ロゴ + キャッチコピー
```

### Step 2: 最初にやること（シーン1を作成）

1. **labs.google/flow** にアクセス
2. **新規プロジェクト作成**
3. モード: **「Text to Video」**
4. モデル: **Veo 2 Fast**（10cr、カメラ制御可能）
5. プロンプト入力:
```
Wide establishing shot, modern glass office building exterior,
early morning golden hour sunlight, clean corporate aesthetic,
slow dolly forward, professional atmosphere
```
6. **[Generate]** クリック
7. 結果確認 → 良ければ **[+ to Scene]**

**注意**: Camera機能は存在しない（2025-12-24確認）。カメラ動きはプロンプトで指定。

### Step 3: 次にやること（Ingredientsでキャラ統一）

1. モード: **「Ingredients to Video」**
2. 社員キャラクターを生成:
```
Professional young Japanese business person,
friendly smile, navy blue suit, modern office background
```
3. 気に入った画像を選択
4. シーン2・3で同じIngredientを使用 → **キャラ一貫性確保**

### Step 4: カスタムエキスパンダー作成

1. プロンプトボックスで **[Expand]**
2. **[Create New Expander]**
3. 名前: `採用PV_統一スタイル`
4. 内容:
```
Professional corporate aesthetic, clean modern lighting,
shallow depth of field, smooth camera movements,
warm color grading, cinematic quality, Japanese business environment
```
5. **[Save]** → 全シーンで適用

### Step 5: SceneBuilderで結合

1. 各シーンを **[+ to Scene]** で追加
2. **[Scenebuilder]** タブをクリック
3. タイムラインでドラッグ&ドロップして順序調整
4. 必要なら **[Extend]** でシーン延長

### Step 6: エクスポート

1. プレビュー確認
2. **三点メニュー** → **[Export Full Project]**
3. MP4ダウンロード

---

### 検証ポイント（メモしておく）

- [ ] Ingredientsでキャラ一貫性は保たれるか？
- [ ] カスタムエキスパンダーでスタイル統一できるか？
- [ ] SceneBuilderの使い勝手
- [ ] Jump to / Extendの挙動
- [ ] 実際のクレジット消費量
- [ ] 日本語プロンプトは使えるか？

---

## 方針（2025-12-24 訂正）

**PROプランで企業PV作成の全ワークフローが実行可能**

調査の結果、PRO vs Ultraの機能差は**クレジット量のみ**。
参照マニュアル（`corporate_pv_workflow_final.md`）に記載されていた一部機能（Brand Kit等）は**公式に存在確認できず**、講座には含めない。

---

## 次のタスク

### 完了（2025-12-24）

- [x] Module 03: AIと一緒に企業PVを企画する
- [x] Module 04: Nano Banana Proで素材画像を作る
- [x] Module 05: 動画生成からBGM追加・仕上げまで

### 今後の追加候補（上級編は `hidden: true` で非表示中）

- [ ] 上級編: 高度なプロンプト技法
- [ ] 上級編: 複数人物の一貫性を保つ方法
- [ ] 上級編: 長尺動画（3分以上）の制作

**表示するには**: `_category.json` の `"hidden": true` を削除

### ~~Ultra限定機能~~ → 不要

Ultra限定機能は確認できず。PROで全ワークフロー実行可能。

参照マニュアル `corporate_pv_workflow_final.md` の一部機能（Brand Kit, Consistency Strength等）は**公式に存在確認できず**、講座には含めない。

---

## 調査結果（2025-12-24 確認済み）

### ツール実在確認

| 項目 | 確認結果 | 詳細 |
|------|----------|------|
| Google Flow | **実在** | 2025年5月 Google I/Oで発表。500M+動画作成済み |
| Nano Banana Pro | **実在** | Gemini 3 Pro Imageとも呼ばれる。Flowに統合 |
| Google Veo 3.1 | **実在** | 2025年10月14日リリース。1080p、最大60秒、native audio |
| AI Ultra for Business | **実在** | $249.99/月、2025年6月26日から提供開始 |

### 参考リンク
- [Veo 3.1 - Google DeepMind](https://deepmind.google/models/veo/)
- [Google Flow Overview](https://www.imagine.art/blogs/google-flow-overview)
- [Google AI Ultra for Business](https://workspace.google.com/products/ai-ultra/)
- [Veo 3.1 updates in Flow](https://blog.google/technology/ai/veo-updates-flow/)

### PROプランUI確認（2025-12-24）

| 機能 | 詳細 |
|------|------|
| URL | labs.google/flow |
| モデル | Veo 3.1 Fast/Quality (Beta Audio)、Veo 2 Fast/Quality (No Audio) |
| 縦横比 | 16:9（横向き）/ 9:16（縦向き） |
| 出力数 | 1〜4個/プロンプト |
| プリセット | Cinematic、Film Noir、Action Figure |
| モード | テキストから動画、フレームから動画、動画の素材、画像を作成 |

### クレジット体系（公式ヘルプより）

| プラン | 月間クレジット | チャージ |
|--------|---------------|---------|
| **Pro** | 1,000 | 可（ただし**日本は不可**） |
| **Ultra** | 25,000 | 可（ただし**日本は不可**） |

### モデル別クレジット消費

| モデル | Pro（1生成あたり） | Ultra（1生成あたり） |
|--------|-------------------|---------------------|
| Veo 2 Fast | 10 | 10 |
| Veo 2 Quality | 100 | 100 |
| Veo 3.1 Fast | 20 | 10 |
| Veo 3.1 Quality | 100 | 100 |
| 動画の編集 | 20 | 20 |

### モデル別対応機能（公式・重要）

| 機能 | Veo 2 Fast | Veo 2 Quality | Veo 3.1 Fast | Veo 3.1 Quality |
|------|:----------:|:-------------:|:------------:|:---------------:|
| テキストから動画 | ○ | ○ | ○（音声付き） | ○（音声付き） |
| 最初のフレームから動画 | ○ | ○ | ○（音声付き） | ○（音声付き） |
| **最初と最後のフレーム** | **○** | × | × | × |
| **カメラ制御** | **×（存在しない）** | × | × | × |
| **延長** | **○** | × | × | × |
| ジャンプ | ○ | ○ | × | ○ |
| 動画素材 | ○ | ○ | × | × |

**重要な発見**:
- First/Last Frame、カメラ制御、延長は**Veo 2 Fastのみ**対応
- Veo 3.1は音声生成に優れるが、高度な制御機能は非対応
- 音声生成は**Veo 3のみ**の試験運用版機能

### ~~Ultra限定と思われる機能~~ → 訂正（2025-12-24）

以下の機能は参照マニュアルに記載されていたが、**公式に確認できず**:
- Corporate Brand Kit → **存在未確認**
- Asset Studio → **存在未確認**
- Consistency Strength スライダー → **存在未確認**
- Loop Mode → **存在未確認**

**結論**: PRO vs Ultraの差は主に**クレジット量のみ**。機能差はほぼない。

---

## 進捗状況

### 完了
- [x] Google Flowの実在確認調査（2025-12-24）
- [x] Text-to-Video生成テスト（2025-12-24）
  - Veo 3.1 Fast で8秒動画を生成
  - 詳細プロンプト（Scene/Visuals/Camera/Audio/SFX/Music）が反映される
  - 2本同時生成可能
  - 拡張（Video extension）機能あり

### 完了（講座作成）
- [x] 画像アップロード・切り抜き機能テスト
- [x] フレームから動画テスト
- [x] 連続動画作成テスト（3シーン完成）
- [x] 講座構成決定
- [x] 講座マークダウン作成（2025-12-24）
- [x] Module 02 UIに合わせて修正（2025-12-24）
  - Schedule（タイムライン）の説明追加
  - 延長/ジャンプ先モードの説明追加
  - 配置編集の説明追加
  - エクスポート/ダウンロードの手順修正

### 完了（企業PV制作実践 2025-12-24）
- [x] 企業PV企画（ターゲット・メッセージ・ストーリー設計）
- [x] Nano Bananaで素材画像生成（5枚）
- [x] フレームから動画で各シーン生成
- [x] Sunoで48秒BGM作成
- [x] Canvaで仕上げ編集
- [x] 完成品出力（IIDAPV.mp4）

### 未検証
- [ ] 動画の素材（Ingredients）機能 ※Veo 3のみ対応と判明

---

## 企業PV制作実践（2025-12-24）

### 制作した動画
- **ファイル**: IIDAPV.mp4
- **長さ**: 48秒
- **内容**: スタートアップ企業の採用PV

### ターゲット・メッセージ設計

| 項目 | 内容 |
|------|------|
| ターゲット | 挑戦的・アクティブな若者 |
| 伝えたいこと | 可能性。企業との繋がりで夢を叶えられる |
| 視聴後のアクション | 「なんとなく就職」ではなく、挑戦・成長・夢を叶える選択を勇気をもって取る |

### 台本（感情の流れで構成）

| # | 内容 | 意図 |
|---|------|------|
| 1 | 社長が走る→フレームアウト | 仕事が楽しくて仕方ない |
| 2 | ミーティング風景 | 仲間・一体感 |
| 3 | ミーティング議論 | 熱量・本気 |
| 4 | 契約成立（握手→ハグ） | 達成 |
| 5 | プレゼン | 成長 |
| 6 | チームでオフィスから出ていく→空へ | 次の挑戦へ |

### 使用素材（Nano Banana生成）

| ファイル | 内容 |
|----------|------|
| 4_08PM.jpeg | 主人公が走っている |
| 4_29PM.jpeg | ミーティング風景（笑顔） |
| 4_50PM.jpeg | 握手シーン（契約成立） |
| 5_01PM.jpeg | ミーティング風景（議論） |
| 5_22PM.jpeg | チームでオフィスから出ていく |

### 重要な発見（講座に必須）

#### プロンプトのコツ
- **人物の指定はしない**（画像を共有しても無視される）
- 動き・カメラワークだけを指示する
- 例: `Running faster, accelerates, exits frame right, side tracking shot`

#### Nano Banana Tips
- 背景変更は精度高い
- **人物の違うポーズは精度落ちる**
- 対策: **同じ人物の複数ポーズ写真を用意**
  - 左右 / 前後 / 斜め のアングル

#### 動画の素材機能
- **Veo 3のみ対応**（HANDOFFの情報と逆だった）
- 画像は3枚まで

#### 仕上げはCanvaで
- Flowの音声は期待しない → **Sunoで別作成**
- トランジション・フェードはCanvaで
- 作業内容:
  1. 最初のホワイトイン
  2. 最後のフェードアウト
  3. BGMの挿入・フェードアウト
  4. Flowの動画音声を0に

#### BGM作成（Suno）
- 無料枠で作成可能
- プロンプト文字数制限あり
- 使用プロンプト:
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

### 企業PV制作のNG事項

| NG | 理由 |
|----|------|
| 夜のオフィス | ブラック企業に見える |
| ロゴ・テキストを動画で生成 | AI動画では崩れる |
| 主人公が迷う演出 | 社長が迷ったらダメ |
| 神目線の演出 | 「カメラに向かって微笑む」は意味不明 |

---

## 調査結果: Nano Banana Pro（2025-12-24）

### 概要
Gemini 3 Pro Imageベースの画像生成・編集モデル。Flow内で**クレジット消費なし**で使用可能。

### 主要機能

| 機能 | 説明 | PRO | Ultra |
|------|------|:---:|:-----:|
| 画像生成 | 2K/4Kで生成、クレジット不要 | ○ | ○ |
| ポイント・アンド・エディット | 矩形選択→部分編集（例：「make eyes green」） | ○ | ○ |
| テキストレンダリング | 多言語対応の正確なテキスト描画 | ○ | ○ |
| **フォーカスシフト** | 背景→前景へのフォーカス移動 | △ | ○ |
| **天気制御** | "make it rain"で雨追加、物理演算対応 | △ | ○ |
| **被写体一貫性** | 最大5人の顔一貫性、14画像ブレンド | △ | ○ |
| カラーグレーディング | 高度な色調調整 | ○ | ○ |
| 照明変更 | 日中→夜間、ボケ効果など | ○ | ○ |

### Ultra限定の高度な制御（Twitterの例）
Ultraでは以下のシネマティック制御が可能:
- **フォーカスシフト**: 光学的な被写界深度変更（フィルターではない）
- **天気物理演算**: 泥、濡れた布、光の変化まで自然に再現
- **被写体ロック**: 天気・照明を変えても人物が変形しない

### Flow内での使い方
1. モード選択で「画像を作成」を選択
2. アスペクト比設定（16:9/9:16）
3. 出力数設定（1〜4）
4. プロンプト入力（例：`hyper-cinematic bear, 4K, hyper-realistic`）
5. 生成（クレジット消費なし）
6. 編集：画像上で領域選択→指示入力
7. 「Add to Prompt」でVeo 3.1に移行→動画化

---

## 調査結果: プリセット機能 - Prompt Expanders（2025-12-24）

### 概要
Geminiがプロンプトを自動強化し、特定のビジュアルスタイルを適用する機能。

### 標準プリセット

| プリセット | 効果 |
|-----------|------|
| **Cinematic** | シネマティック映画調（照明・構図・色調を自動調整） |
| **Film Noir** | フィルム・ノワール調（モノクロ/ハイコントラスト/影の強調） |
| **Action Figure** | アクションフィギュア風（プラスチック質感・ポーズ強調） |

### 使い方
1. プロンプト入力欄の横にあるプリセットメニューを開く
2. 使いたいプリセットを選択
3. Geminiがプロンプトを自動拡張してスタイル適用
4. 生成実行

### カスタムエキスパンダー
独自のプリセットを作成可能。クライアントへのスタイル提案時に「Noir vs Cinematic」を瞬時に切り替えて比較できる。

---

## 調査結果: Veo 3.1 高度な機能（2025-12-24）

### First Frame / Last Frame（フレーム間トランジション）
開始フレームと終了フレームを指定し、間の動きを自動生成。

**使い方**:
1. Nano Banana Proで開始・終了フレームを生成
2. 「フレームから動画」で両フレームをアップロード
3. トランジションと音声のプロンプトを入力
4. Veo 3.1がシームレスな動画を生成

### プロンプト構造（推奨）
```
[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
```

**例**:
```
Medium shot, a tired corporate worker, rubbing his temples in exhaustion,
in front of a bulky 1980s computer in a cluttered office late at night.
Retro aesthetic, shot as if on 1980s color film, slightly grainy.
```

### カメラ・レンズ設定
- **動き**: Dolly shot, Tracking shot, Crane shot, POV shot, Slow pan
- **構図**: Wide shot, Close-up, Extreme close-up, Low angle
- **レンズ**: Shallow depth of field, Wide-angle, Macro lens, Deep focus

### 音声プロンプト
- **台詞**: `"A woman says, 'We have to leave now.'"`
- **効果音**: `SFX: thunder cracks in the distance`
- **環境音**: `Ambient noise: the quiet hum of a starship bridge`

### タイムスタンプ構造（マルチショット）
```
[00:00-00:02] Medium shot from behind...
[00:02-00:04] Reverse shot of the explorer's face...
[00:04-00:06] Tracking shot following...
[00:06-00:08] Wide, high-angle crane shot...
```

---

## PRO vs Ultra 機能比較（2025-12-24 訂正版）

### 機能差（ほぼなし）

| 機能 | PRO ($20/月) | Ultra ($250/月) |
|------|:------------:|:---------------:|
| Veo 2 Fast/Quality | ○ | ○ |
| Veo 3.1 Fast/Quality | ○ | ○ |
| Nano Banana Pro | ○ | ○ |
| Ingredients to Video | ○ | ○ |
| Frames to Video | ○ | ○ |
| Text to Video | ○ | ○ |
| プリセット（Prompt Expanders） | ○ | ○ |
| First/Last Frame（Veo 2 Fastのみ） | ○ | ○ |
| 延長（Veo 2 Fastのみ） | ○ | ○ |
| カメラ制御（Veo 2 Fastのみ） | ○ | ○ |
| SceneBuilder | ○ | ○ |
| Jump to / Extend | ○ | ○ |
| 1080p出力 | ○ | ○ |

### 実際の差（クレジット量のみ）

| 項目 | PRO | Ultra |
|------|-----|-------|
| **月間クレジット** | **1,000** | **12,500〜25,000** |
| Veo 3.1 Fast消費 | 20cr | 10cr |
| **クレジットチャージ（日本）** | **不可** | **不可** |

### 月間生成可能数の計算

| モデル | PRO (1,000cr) | Ultra (12,500cr) |
|--------|--------------|------------------|
| Veo 2 Fast (10cr) | **最大100本** | 最大1,250本 |
| Veo 2 Quality (100cr) | 最大10本 | 最大125本 |
| Veo 3.1 Fast | 最大50本 (20cr) | 最大1,250本 (10cr) |
| Veo 3.1 Quality (100cr) | 最大10本 | 最大125本 |

### 参照マニュアルの誤情報（注意）

`corporate_pv_workflow_final.md` に記載されていた以下の機能は**公式に存在確認できず**:
- Corporate Brand Kit
- Asset Studio
- Consistency Strength 0.92
- Loop Mode
- Color Locking
- Logo Embedding

→ これらは**想像上の機能**または**将来機能**の可能性あり

---

## 企業採用PV作成の具体的ワークフロー（2025-12-24 確定）

### 全体フロー

```
1. 台本作成 → 2. Ingredients作成 → 3. シーン生成 → 4. SceneBuilder構築 → 5. エクスポート
```

---

### Step 1: 台本をシーン分割

```
シーン1: オフィス外観（5秒）
シーン2: 社員インタビュー（10秒）
シーン3: チーム作業風景（8秒）
シーン4: 製品・サービス紹介（10秒）
シーン5: エンディング・ロゴ（5秒）
```

---

### Step 2: Ingredients（素材）の作成 ★重要

**Ingredientsとは**: キャラクター、オブジェクト、スタイルの一貫した視覚要素

#### UI操作手順
1. モード選択: **「Ingredients to Video」**（Veo 2のみ対応）
2. 素材の作成方法:
   - **テキストから生成**: Imagenで画像生成
   - **アップロード**: 既存画像を使用
3. **最大3つのIngredients**を1つのプロンプトに追加可能

#### 企業PV用Ingredients例
```
Ingredient 1: 主要キャラクター（社員）
Ingredient 2: 製品/ロゴ
Ingredient 3: オフィス環境
```

**注意**: Ingredients to VideoはVeo 2のみ対応。Veo 3は今後対応予定。

---

### Step 3: プロンプト作成（公式推奨構造）

#### 必須要素
| 要素 | 説明 | 例 |
|------|------|-----|
| **Subject & Action** | キャラクターと動作 | 「A Japanese business professional reviewing documents」 |
| **Composition** | 構図 | 「Medium shot」「Close-up」「Wide shot」 |
| **Camera Motion** | カメラ動き | 「Tracking shot」「Dolly in」「Aerial view」 |
| **Location & Lighting** | 場所と照明 | 「Modern office, morning sunlight through windows」 |
| **Style** | スタイル | 「Cinematic」「Corporate aesthetic」 |
| **Audio**（Veo 3のみ） | 音声 | 「Ambient office sounds, professional tone」 |

#### Geminiプロンプトテンプレート（公式推奨）
```
You are the world's most intuitive visual communicator and expert prompt engineer.
You possess a deep understanding of cinematic language, narrative structure,
emotional resonance, the critical concept of filmic coverage and the specific
capabilities of Google's Veo AI model. Your mission is to transform my conceptual
ideas into meticulously crafted, narrative-style text-to-video prompts that are
visually breathtaking and technically precise for Veo.
```

---

### Step 4: Prompt Expanders（プリセット）の使用

#### UI操作手順
1. プロンプトボックスで **「Text to Video」** 選択
2. プロンプト入力
3. **[Expand]** ボタンをクリック
4. プリセット選択:
   - **Cinematic**: 企業PV向け（推奨）
   - **Film Noir**: ドラマチック演出
   - **Action Figure**: 製品紹介向け
5. [Generate]

#### カスタムエキスパンダー作成
1. [Expand] → **[Create New Expander]**
2. 名前: `Corporate_PV_Style`
3. 内容:
```
Professional corporate aesthetic, clean modern lighting,
shallow depth of field, smooth camera movements,
warm color grading, cinematic quality,
Japanese business environment
```
4. [Save]

→ 全シーンでこのスタイルを適用して**一貫性を確保**

---

### ~~Step 5: カメラ制御の追加（Veo 2 Fastのみ）~~ → 存在しない

**2025-12-24 検証結果**: Camera機能は**存在しない**ことを確認。
参照マニュアルの誤情報。カメラ動きはプロンプトで指定する。

**プロンプトでカメラ動きを指定する例**:
```
slow dolly forward
tracking shot following the subject
slow pan left
aerial view descending
```

---

### Step 6: SceneBuilder でシーン構築

#### UI操作手順
1. 生成した動画の **[+ to Scene]** をクリック
2. 上部の **[Scenebuilder]** タブをクリック
3. タイムラインにクリップが配置される

#### シーン接続

**「Jump to」機能**:
1. タイムラインで接続元クリップを選択
2. **[Add]** → **[Jump to...]**
3. 次シーンのプロンプトを入力

**「Extend」機能**:
1. タイムラインで延長したいクリップを選択
2. **[Add]** → **[Extend...]**
3. 続きのプロンプトを入力

#### クリップ編集
- **ドラッグ＆ドロップ**: 順序変更
- **ハンドル**: 開始/終了のトリム

**注意**: SceneBuilderのタイムラインは現在プロジェクト離脱時にリセットされる（保存機能は近日追加予定）

---

### Step 7: エクスポート

1. プレビューを **100%** にズーム
2. **三点メニュー（⋮）** → **[Export Full Project]**
3. MP4でダウンロード

---

### モデル選択の判断基準

| 目的 | 推奨モデル | 理由 |
|------|-----------|------|
| **Ingredients使用** | **Veo 2** | Veo 3は未対応 |
| 音声・BGM付き | Veo 3.1 | ネイティブ音声生成 |
| カメラ制御 | Veo 2 Fast | Camera機能対応 |
| シーン延長 | Veo 2 Fast | Extend機能対応 |
| First/Last Frame | Veo 2 Fast | 唯一対応 |

### 企業PV推奨ワークフロー

```
┌─────────────────────────────────────────────────┐
│ Phase 1: 準備                                   │
├─────────────────────────────────────────────────┤
│ ・台本作成（シーン分割）                         │
│ ・カスタムエキスパンダー作成                     │
│ ・Ingredients作成（キャラ・製品・環境）          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Phase 2: 各シーン生成                           │
├─────────────────────────────────────────────────┤
│ ・Veo 2 + Ingredients to Video で一貫性確保     │
│ ・カスタムエキスパンダー適用                     │
│ ・Camera機能でカメラ動き追加                     │
│ ・[+ to Scene] でSceneBuilderに追加             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Phase 3: シーン接続                             │
├─────────────────────────────────────────────────┤
│ ・Jump to でシーン間トランジション               │
│ ・Extend で必要なシーンを延長                    │
│ ・タイムラインで順序調整・トリム                 │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Phase 4: 音声追加（オプション）                 │
├─────────────────────────────────────────────────┤
│ ・完成動画をVeo 3.1で音声付き再生成             │
│ ・または外部ツールで音声追加                     │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Phase 5: エクスポート                           │
├─────────────────────────────────────────────────┤
│ ・Export Full Project                           │
│ ・MP4ダウンロード                               │
└─────────────────────────────────────────────────┘
```

---

## 企業採用PV作成の結論（2025-12-24 訂正版）

### PROプランで可能なこと（全機能使える）
- Ingredients to Video（キャラ一貫性）
- プリセット（Prompt Expanders）によるスタイル統一
- First/Last Frame、延長、カメラ制御（Veo 2 Fast）
- SceneBuilder でシーン構築
- Jump to / Extend でシーン接続
- Veo 3.1で音声付き動画生成
- 1080p出力

### PROプランでの5分PV制作（計算）

| 条件 | 必要カット | 必要クレジット | 結果 |
|------|-----------|---------------|------|
| Veo 2 Fast（8秒×38カット） | 38本 | 380 | **○ 余裕** |
| Veo 2 Fast + リテイク2倍 | 76本 | 760 | **○ 可能** |
| Veo 3.1 Fast（8秒×38カット） | 38本 | 760 | ○ 可能（音声付き） |
| Veo 3.1 Fast + リテイク2倍 | 76本 | 1,520 | × 超過 |

**結論**: **Veo 2 Fastならリテイク込みでもPROで5分PV作成可能**

### PROプランの実際の限界
- **日本ではクレジットチャージ不可**（月1,000クレジット固定）
- Veo 3.1を多用するとクレジット不足になりやすい
- 複数PV/月は厳しい

### 推奨事項（訂正）

| 目的 | 推奨プラン |
|------|-----------|
| **5分PV 1本/月** | **PRO ($20) で十分** |
| リテイク多め | PRO（Veo 2 Fast使用） |
| 音声必須で複数PV | Ultra推奨 |
| 大量生成（月10本以上） | Ultra必須 |

### 講座の方針（訂正）
1. **基礎編（PRO対応）**: 全ワークフローをPROで実行可能
2. ~~上級編（Ultra対応）~~: **Ultra限定機能は確認できず、不要**

---

## 検証結果: Text-to-Video（2025-12-24）

### 使用プロンプト構造
```
## Scene: タイトル
**Scene:** シーン説明
**Visuals:** 被写体、環境、照明、色調、美学
**Camera:** アングル、動き
**Audio:** 音響全体の説明
**SFX:** 効果音リスト
**Music:** BGM説明
```

### 生成結果
- 日本人ビジネスマンがモダンオフィスで書類を書いている動画
- 盆栽、夜景、シネマティックライティングが正確に反映
- 8秒、1080p品質

---

## 検証結果: 連続動画作成（2025-12-24）

### 作成した連続動画

| Scene | 内容 | 長さ |
|-------|------|------|
| 1 | コーヒーメーカー登場 | 8秒 |
| 2 | コーヒーが注がれる | 結合で23秒 |
| 3 | カップがリフトアップ | 31秒 |

### 連続動画の作成方法
1. 動画の最終フレームを抽出（ffmpeg）
2. 「フレームから動画」でアップロード
3. 続きのプロンプトを入力

---

## 重要な制約（2025-12-24 発見）

### プロンプトのポリシー違反

| プロンプトタイプ | 結果 |
|-----------------|------|
| 詳細構造（Scene/Visuals/Camera等） | 「著名人ポリシー違反」エラーになる場合あり |
| 人物表現（hand, person等） | ポリシー違反で弾かれやすい |
| **シンプルなプロンプト** | **安定して生成できる** |

### 推奨プロンプト形式

**NG例（詳細すぎる）**:
```
## Scene: Enjoying the Coffee
**Scene:** A hand reaches in and picks up...
**Visuals:** A well-groomed hand enters...
```

**OK例（シンプル）**:
```
The espresso cup with golden crema rises from the futuristic coffee maker. Steam trails upward. Studio lighting, product photography style. Smooth upward camera movement.
```

### 結論
- 詳細プロンプトは最初のText-to-Videoでは有効
- フレームから動画（連続作成）では**シンプルなプロンプトが安定**

---

## サブコース構成

```
google-flow/              ← 親カテゴリ
├── google-flow-basics/   ← 基礎編（2モジュール完成）
└── google-flow-advanced/ ← 上級編（未着手）
```

**カード色**: 紫（Googleブランド）

---

## 作成済みファイル（2025-12-24）

### 講座コンテンツ
```
content/modules/google-flow/
├── _category.json
├── module-01-video-generation.md
├── module-02-scenebuilder.md
├── module-03-pv-planning.md      ← NEW
├── module-04-nanobanana.md       ← NEW
└── module-05-video-export.md     ← NEW
```

### 素材
```
public/google-flow/
├── module-01-flow-top.jpg
├── module-01-nano-banana-arrived.jpg
├── module-01-scenebuilder.png
├── module-01-menu.png
├── module-01-model-select.png
├── module-01-output-count.png
├── module-01-aspect-ratio.png
├── module-01-prompt-input.png
├── module-01-generating.png
├── module-02-timeline-complete.png
├── module-02-extend-button.png
├── module-02-crop-material.png
├── module-02-scenebuilder-multi.png
├── module-02-coffee-frame.jpg
├── module-02-scene1.mp4
├── module-02-scene-complete.mp4
├── module-03-running.jpeg           ← NEW（Nano Banana生成）
├── module-03-meeting-smile.jpeg     ← NEW（Nano Banana生成）
├── module-03-handshake.jpeg         ← NEW（Nano Banana生成）
├── module-03-meeting-discussion.jpeg← NEW（Nano Banana生成）
├── module-03-team-walking.jpeg      ← NEW（Nano Banana生成）
├── module-05-suno-ui.png            ← NEW（Suno画面）
├── module-05-bgm.mp3                ← NEW（BGM）
└── module-05-complete-pv.mp4        ← NEW（完成動画）
```

### ルーティング
```
app/category/google-flow/
├── [subcourseSlug]/page.tsx
└── [subcourseSlug]/[moduleSlug]/page.tsx
```

---

## マニュアル記載の手順（検証対象）

### Step 1: ブランドキット設定
- Corporate Brand Kit でロゴ・カラー登録
- Lock Color (固定) スイッチ

### Step 2: 固定アセット作成（NanoBanana Pro）
- Asset Studio でプロンプト入力
- Set as Master Reference で固定

### Step 3: タイムライン動画生成（Veo 3.1）
- Consistency Strength: 0.92
- 5秒クリップ生成

### Step 4: ループと結合
- Loop Mode で背景ループ
- タイムラインで延長

### Step 5: 書き出し
- 4K Upscaled エクスポート

---

## 講座作成ルール

`content/CONTENT-GUIDE.md` に従う

---

**最終更新**: 2025-12-24 21:00（Module 03-05作成完了、企業PV制作実践記録追加）
