# 運用フローガイド - Antigravityから投稿まで

**所要時間**: 読み物（15分）
**難易度**: 全モジュール完了後

---

## このモジュールで学ぶこと

- Antigravityからinstagram投稿までの全体フロー
- 各ステップで使用するツールとアクション
- statusの流れと意味
- トラブル発生時の対処箇所の特定

---

## 目次

- [運用フロー全体図](#運用フロー全体図)
- [ステップ1: Antigravityでアイデア生成](#ステップ1-antigravityでアイデア生成)
- [ステップ2: GASでideas + postsに追加](#ステップ2-gasでideas--postsに追加)
- [ステップ3: GASでCanvaシートに振り分け](#ステップ3-gasでcanvaシートに振り分け)
- [ステップ4: Canvaで動画生成〜Driveにアップロード](#ステップ4-canvaで動画生成driveにアップロード)
- [ステップ5: 音声合成ワークフロー実行](#ステップ5-音声合成ワークフロー実行)
- [ステップ6: Instagram投稿](#ステップ6-instagram投稿)
- [statusの流れ](#statusの流れ)
- [モジュール対応表](#モジュール対応表)
- [トラブルシューティング](#トラブルシューティング)

---

## 運用フロー全体図

```
┌─────────────────────────────────────────────────────────────────────┐
│                        月次コンテンツ生成                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  Antigravity     │  ← Module 06                                  │
│  │  アイデア生成     │                                               │
│  └────────┬─────────┘                                               │
│           │ JSON（約45-80件）                                        │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  GAS             │  ← Module 07                                  │
│  │  ideas+posts追加 │                                               │
│  └────────┬─────────┘                                               │
│           │ ideasシート(ADOPTED) + postsシート(DRAFT)               │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  GAS             │  ← Module 07                                  │
│  │  Canva振り分け   │                                               │
│  └────────┬─────────┘                                               │
│           │ canva_A〜Eシート + postsシート(CANVA_READY)             │
│           ▼                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        日次コンテンツ制作（手動作業）                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  Canva           │  一括作成 → ダウンロード → 解凍                │
│  │  動画一括生成    │                                               │
│  └────────┬─────────┘                                               │
│           │ MP4ファイル（POST-xxx.mp4）                              │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  Google Drive    │  フォルダ作成 → アップロード                   │
│  │  アップロード    │                                               │
│  └────────┬─────────┘                                               │
│           │ 20251213投稿A フォルダ                                   │
│           ▼                                                         │
│  ┌──────────────────┐                                               │
│  │  n8n             │  ← Module 02c, 08                             │
│  │  音声合成advanced│                                               │
│  └────────┬─────────┘                                               │
│           │ canva_Xシート(audio_status: DONE)                       │
│           ▼                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        Instagram投稿                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐                                               │
│  │  n8n             │  スケジュール: 6時, 12時, 18時                 │
│  │  Instagram Reel  │                                               │
│  │  from Drive      │                                               │
│  └────────┬─────────┘                                               │
│           │ postsシート(PUBLISHED)                                  │
│           ▼                                                         │
│       【完了】                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ステップ1: Antigravityでアイデア生成

**使用ツール**: Google Antigravity
**所要時間**: 約60分
**参照モジュール**: Module 06

### 手順

1. Antigravityを起動
2. `C:\Instagram_AI` フォルダを開く
3. ワークフロープロンプトを送信
4. Implementation Planを確認
5. 「Proceed」ボタンで実行開始

### 出力ファイル

| Phase | 出力ファイル | 内容 |
|-------|-------------|------|
| Phase 1 | `step1_trend_list.json` | TOP 20ツール + YouTube URL |
| Phase 2 | `step2_knowledge_base_batch_1〜4.json` | 各ツールの事実情報 |
| Phase 3 | `instagram_ideas_batch_1〜4.json` | Instagram投稿案 |

### 生成件数の目安

- 各ツールから4-5件のアイデア生成
- 20ツール × 4-5件 = **約45-80件**

---

## ステップ2: GASでideas + postsに追加

**使用ツール**: Google Apps Script（スプレッドシートメニュー）
**所要時間**: 数秒
**参照モジュール**: Module 07

### 手順

1. Antigravityの出力JSON（`instagram_ideas_batch_X.json`）をコピー
2. スプレッドシートの**configシート**を開く
3. **A2セル**にJSONを貼り付け
4. メニュー **[コンテンツ管理] > [configA2からideas+postsに追加]** を実行
5. 完了ダイアログを確認

### 結果

| シート | 変化 |
|--------|------|
| ideas | 行が追加される（status: ADOPTED） |
| posts | 行が追加される（status: DRAFT） |

### 複数バッチの場合

Phase 3の出力が4バッチある場合、各バッチを順番に貼り付けて実行します。重複チェック機能があるため、同じアイデアは追加されません。

---

## ステップ3: GASでCanvaシートに振り分け

**使用ツール**: Google Apps Script（スプレッドシートメニュー）
**所要時間**: 数秒
**参照モジュール**: Module 07

### 手順

1. メニュー **[コンテンツ管理] > [postsからCanvaシートに振り分け]** を実行
2. 確認ダイアログで「はい」を選択
3. 完了ダイアログでカテゴリ別件数を確認

### 結果

| シート | 変化 |
|--------|------|
| canva_A | カテゴリAのデータが追加（audio_status: NORMAL） |
| canva_B | カテゴリBのデータが追加 |
| canva_C | カテゴリCのデータが追加 |
| canva_D | カテゴリDのデータが追加 |
| canva_E | カテゴリEのデータが追加 |
| posts | statusがDRAFT → CANVA_READYに更新 |

### 注意

- 既存のcanva_A〜Eのデータは**クリア**されます
- クリア前にCSVダウンロード済みであることを確認してください

---

## ステップ4: Canvaで動画生成〜Driveにアップロード

**使用ツール**: Canva, Google Drive
**所要時間**: カテゴリあたり10-15分
**参照モジュール**: Module 08（Canvaダウンロード設定）

### 手順

1. **Canvaでアプリ > 一括作成を選択**
2. **スプレッドシートを連携** → 該当カテゴリ（canva_A〜E）を選択
3. **オプションを変更**:
   - 出力: 個別デザイン
   - 各デザインの名前: post_id列のデータ
4. **フォルダを作成** → フォルダ名を指定（例: `20251213投稿A`）
5. **動画を生成**
6. **ダウンロード** → ZIPファイル取得
7. **解凍**
8. **Google Drive** に該当フォルダを作成（`20251213投稿A`）
9. **解凍した動画をアップロード**

### フォルダ名の形式

```
{年月日}投稿{カテゴリ}
例: 20251213投稿A
```

### フォルダ構造

```
Instagram投稿/（親フォルダ）
├── 20251213投稿A/
│   ├── POST-2025121308-001.mp4
│   ├── POST-2025121308-002.mp4
│   └── ...
├── 20251213投稿B/
├── 20251213投稿C/
├── 20251213投稿D/
└── 20251213投稿E/
```

### 重要

- フォルダ名はワークフローの`Set Folder Names`ノードの出力と**完全一致**させる
- ファイル名は`post_id.mp4`の形式（Canvaダウンロード設定で自動）
- BGMはテンプレートに含まれているため別途作成不要

---

## ステップ5: 音声合成ワークフロー実行

**使用ツール**: n8n
**所要時間**: 1カテゴリあたり5-10分
**参照モジュール**: Module 02c, Module 08

### 手順

1. n8nを開く
2. 「音声合成advanced」ワークフローを開く
3. 「Execute Workflow」をクリック

### 処理内容

1. Sheet List: 5つのシート情報を生成
2. Loop Sheets: シートごとにループ
3. Filter NORMAL: audio_status=NORMALの行を抽出
4. フォルダ検索: Google Driveで動画を検索
5. Loop Over Items: 各アイテムをループ処理
   - Download: 動画ダウンロード
   - Merge Narrations: narration_1 + narration_2を統合
   - Generate Audio: Fish Audio APIで音声生成
   - ffmpeg: 動画と音声を合成
   - Upload: Google Driveにアップロード
   - Update: audio_status=DONEに更新

### 結果

| シート | 変化 |
|--------|------|
| canva_A〜E | 処理済み行のaudio_statusがNORMAL → DONEに更新 |
| Google Drive | 音声合成済み動画がアップロード、元動画はarchiveフォルダに移動 |

---

## ステップ6: Instagram投稿

**使用ツール**: n8n
**実行タイミング**: スケジュール（6時, 12時, 18時）または手動
**参照モジュール**: Module 07

### 手順（手動実行の場合）

1. n8nを開く
2. 「Instagram Reel from Drive」ワークフローを開く
3. 「Execute Workflow」をクリック

### 処理内容

1. Get DRAFT Posts: status=CANVA_READYのpostsを取得
2. Get Category from Pattern: カテゴリとフォルダ名を判定
3. Search Video File: Google Driveで動画を検索
4. Upload to Cloudinary: 動画をCloudinaryにアップロード
5. Create Reel Container: Instagram APIでReel作成
6. Publish Reel: 実際に公開
7. Update Posts Sheet: status=PUBLISHEDに更新

### スケジュール設定

```
0 0 6,12,18 * * *
（毎日6時、12時、18時に実行）
```

### 結果

| シート | 変化 |
|--------|------|
| posts | 投稿済み行のstatusがCANVA_READY → PUBLISHEDに更新 |

---

## statusの流れ

### postsシートのstatus

```
DRAFT → CANVA_READY → PUBLISHED
```

| status | 意味 | 次のアクション |
|--------|------|---------------|
| DRAFT | postsに追加済み、Canva振り分け前 | GASでCanva振り分け |
| CANVA_READY | Canva振り分け済み、投稿待ち | Instagram投稿ワークフロー |
| PUBLISHED | Instagram投稿完了 | 完了 |

### canva_Xシートのaudio_status

```
NORMAL → DONE
```

| audio_status | 意味 | 次のアクション |
|--------------|------|---------------|
| NORMAL | 音声合成待ち | 音声合成ワークフロー実行 |
| DONE | 音声合成完了 | 投稿準備完了 |

---

## モジュール対応表

| 手順 | モジュール | 内容 |
|------|----------|------|
| 環境構築 | Module 01 | ffmpeg, Fish Audio設定 |
| 音声合成ワークフロー構築 | Module 02a | 前編: シートからデータ取得、フォルダ検索 |
| 音声合成ワークフロー構築 | Module 02b | 中編: 音声生成、ffmpeg合成、アップロード |
| 音声合成ワークフロー構築 | Module 02c | 後編: 全カテゴリ対応、ループ完成 |
| リサーチ手法 | Module 03 | インフルエンサー起点のトレンド調査 |
| シート構造変更 | Module 04 | 13列構成への変更 |
| Geminiプロンプト改善 | Module 05 | カテゴリ別プロンプト設計 |
| Antigravityワークフロー | Module 06 | 3ステップideas生成 |
| GAS統合とn8n簡略化 | Module 07 | GASメニュー追加、n8n不要化 |
| 音声合成最適化 | Module 08 | ナレーション統合、フォルダ名対応 |
| 運用フロー | Module 09 | 本ドキュメント |

---

## トラブルシューティング

### 問題が発生した場合の確認順序

#### 1. Antigravityの出力がおかしい

**確認箇所**: Module 06のワークフロープロンプト
**よくある原因**:
- JSONスキーマが正しく指定されていない
- バッチ処理がタイムアウトした

#### 2. GASインポートでエラー

**確認箇所**: Module 07のGASコード
**よくある原因**:
- JSONが配列形式でない
- configシートのA2が空
- 必須フィールドが欠けている

#### 3. Canvaシート振り分けで0件

**確認箇所**: postsシート
**よくある原因**:
- postsシートにDRAFTのレコードがない
- content_jsonカラムが空

#### 4. 音声合成ワークフローでフォルダが見つからない

**確認箇所**: Module 08のSet Folder Namesノード
**よくある原因**:
- ワークフローのフォルダ名形式とGoogle Driveのフォルダ名が不一致
- Google Driveにフォルダが存在しない

#### 5. 音声合成ワークフローで動画が見つからない

**確認箇所**: Canvaダウンロード設定
**よくある原因**:
- ファイル名がpost_idと異なる
- フォルダにファイルがアップロードされていない

#### 6. Instagram投稿で動画が投稿されない

**確認箇所**: Module 07のInstagram Reel from Driveワークフロー
**よくある原因**:
- postsシートにCANVA_READYのレコードがない
- フォルダ名形式が不一致
- Cloudinary/Instagram APIの認証エラー

---

## 日次運用チェックリスト

### 毎日やること（手動作業）

- [ ] Canvaでアプリ > 一括作成 > スプレッドシート連携
- [ ] 該当カテゴリを選択してオプション変更
- [ ] 動画生成 → ダウンロード → 解凍
- [ ] Google Driveにフォルダ作成 → アップロード
- [ ] 音声合成ワークフローを実行
- [ ] Instagram投稿結果を確認

### 月次やること

- [ ] Antigravityで新しいアイデアを生成
- [ ] GASでideas + postsに追加
- [ ] GASでCanvaシートに振り分け

---

## 参考資料

- [Module 01: AI音声生成の基本セットアップ](/content/modules/n8n-advanced/module-01-audio-setup.md)
- [Module 02a: 音声合成ワークフロー（前編）](/content/modules/n8n-advanced/module-02a-audio-workflow.md)
- [Module 02b: 音声合成ワークフロー（中編）](/content/modules/n8n-advanced/module-02b-audio-workflow.md)
- [Module 02c: 音声合成ワークフロー（後編）](/content/modules/n8n-advanced/module-02c-audio-workflow.md)
- [Module 03: リサーチ精度向上](/content/modules/n8n-advanced/module-03-content-ideas-import.md)
- [Module 04: カテゴリシート構造の改善](/content/modules/n8n-advanced/module-04-canva-sheet-structure.md)
- [Module 05: Geminiプロンプト改善](/content/modules/n8n-advanced/module-05-gemini-prompt-improvement.md)
- [Module 06: ideas生成ワークフロー](/content/modules/n8n-advanced/module-06-ideas-generation-workflow.md)
- [Module 07: ワークフロー最適化](/content/modules/n8n-advanced/module-07-workflow-optimization.md)
- [Module 08: 音声合成ワークフロー最適化](/content/modules/n8n-advanced/module-08-audio-workflow-optimization.md)
