# n8n上級編講座 引き継ぎ資料

**作成日**: 2025-12-08
**前提講座**: n8n講座（Module 01-11）完了済み

---

## 講座概要

### 対象者

n8n基礎講座（Module 01-11）を完了し、Instagram自動投稿システムを構築済みのユーザー。

### 前提として構築済みのシステム

```
[AIリサーチ層]
  Antigravity → JSON出力
      ↓
[企画管理層]
  Google Sheets: config → ideas
      ↓
[コンテンツ生成層]
  Gemini API（5カテゴリ×プロンプト）
      ↓
[デザイン製作層]
  Canva Bulk Create（手動）
      ↓
[動画ホスティング層]
  Google Drive → Cloudinary
      ↓
[投稿実行層]
  n8n Schedule Trigger → Instagram Graph API
```

### 上級編で扱うトピック（確定）

| トピック | 概要 | 状態 |
|---------|------|------|
| 投稿内容の精度アップ | Geminiプロンプト改善、コンテンツ品質向上 | 未着手 |
| AI音声生成 | Fish Audio連携でナレーション自動生成 | **実装中**（残タスクあり） |
| インサイト取得 | Instagram Insights APIで分析データ取得 | 未着手 |

---

## 講座作成フロー

### 基本的な流れ

1. **ユーザーからのリクエスト**
   - ユーザーが「この手順を知りたい」とリクエスト

2. **徹底的な調査**
   - その手順について調査（公式ドキュメント、最新情報など）
   - 手順を整理して指示

3. **ユーザーによる実践**
   - ユーザーが手順を実際にやってみる
   - 各ステップでスクリーンショットを撮影

4. **確認とサポート**
   - 共有されたスクショを確認
   - 手順通りできているかチェック
   - 問題があれば解決策を提示
   - **止まった箇所・解決方法を記録**
   - 成功するまでサポート

5. **講座の作成**
   - 成功後、スクショを適切な箇所に添付
   - **止まった箇所をトラブルシューティングに記載**
   - 講座マークダウンを作成

6. **追加素材の埋め込み**
   - 画面録画があれば動画を埋め込み
   - 完成物（デプロイURL等）があれば記載

---

## 講座フォーマット仕様

### セクション順序（必須）

```markdown
# タイトル

**所要時間**: XX分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと
（箇条書き）

---

## 学習目標
（「このモジュールを終えると、以下のことができるようになります：」）

---

## 事前準備
### 必要なもの
### 推奨スペック

---

## セクション1: XXXX
（各セクションの最後に「チェックポイント」）

### チェックポイント
- [ ] 確認項目1
- [ ] 確認項目2

---

## セクション2: XXXX
...

---

## トラブルシューティング

記載できるもの：
- ユーザーが実践で実際に止まり、解決した内容
- 信頼できるソース（公式ドキュメント等）に記載されている内容

記載しない：
- 想定だけの内容（検証なし・ソースなし）

### 問題タイトル
**症状**: 何が起きたか
**解決方法**: どう解決したか

---

## まとめ

### このモジュールで学んだこと
### 次のステップ

---

## 参考資料

- [リンクタイトル](URL)

---

## よくある質問

**Q: 質問**
A: 回答
```

### フォーマットルール

| ルール | 説明 |
|--------|------|
| 絵文字禁止 | 見出しや本文に絵文字を使わない |
| チェックポイント | 各セクション末尾に設置 |
| トラブルシューティング | ユーザー実践で止まった箇所を必ず記載 |
| 参考資料 | 公式ドキュメント等のリンクを記載 |
| よくある質問 | 最低3-5個のQ&Aを記載 |

---

## 現在の状態

### 作成済みモジュール

| モジュール | ファイル | 状態 |
|-----------|---------|------|
| 01 AI音声生成の基本セットアップ | module-01-audio-setup.md | 完了 |
| 02【前編】音声合成ワークフローの構築 | module-02a-audio-workflow.md | 完了 |
| 02【中編】音声合成ワークフローの構築 | module-02b-audio-workflow.md | 完了 |
| 02【後編】全カテゴリ対応 | module-02c-audio-workflow.md | **完了** |

---

## 基礎講座からの引き継ぎ情報

### 構築済みリソース

**Google Sheets**:
- スプレッドシート: n8n-test
- シート: posts, media, ideas, config, archive, canva_A〜E

**Google Drive**:
- 親フォルダ: n8n-instagram (ID: 1EuAjadkn81zRxfPs1Im-jXoM5zsN2mfo)
- カテゴリフォルダ: 202512Instagram投稿A〜E

**外部サービス**:
- Cloudinary: Cloud name `doaf4wodr`, Preset `instagram_reel`
- Instagram Graph API: 認証済み
- Gemini API: 認証済み

**GASデプロイURL**:
```
https://script.google.com/macros/s/AKfycbyawBKuhvD34w60YGoFfyXsTe7OSUqKalR0MoagxIiNLMK85okHIGnggLuu06SiQHAN/exec
```

**GAS関数一覧**:
| 関数名 | 用途 |
|--------|------|
| doPost | メインエントリーポイント（action分岐） |
| archiveAndCleanCanvaSheets | canva_A〜Eをアーカイブしてクリア |
| updateAudioStatus | audio_statusを更新（postId, category, status） |

### 既存ワークフロー

| ファイル名 | 用途 |
|-----------|------|
| SNS投稿作成.json | AIコンテンツ生成（5カテゴリ） |
| Canva用シート振り分け2.json | postsからcanva_A〜Eへ振り分け |
| リール動画投稿.json | Drive→Cloudinary→Instagram投稿 |

### カテゴリとパターンの対応

| カテゴリ | パターン | 内容 |
|---------|---------|------|
| A | versus | 比較・対決型 |
| B | instant_hack | 時短・効率化型 |
| C | secret_feature | 先端トレンド・裏技型 |
| D | warning | ネガティブ・警告型 |
| E | ranking | まとめ・ランキング型 |

---

## 画像アセット

配置先: `public/n8n-setup/`

**上級編用**:
- （実践時に追加）

---

## 技術メモ

### n8nノード指示のルール（重要）

**Google Sheets / Google Drive ノードを指示する際は、必ずActionを明記すること。**

ノード追加時にAction選択画面が表示されるため、Actionの指定がないと受講者が迷う。

**Google Sheets Actions**:
| Action | 用途 |
|--------|------|
| Get row(s) in sheet | シートからデータ取得 |
| Append row in sheet | 行を追加 |
| Update row in sheet | 行を更新 |
| Append or update row in sheet | 行を追加または更新（upsert） |
| Clear sheet | シートをクリア |
| Delete rows or columns from sheet | 行/列を削除 |

**Google Drive Actions**:
| Action | 用途 |
|--------|------|
| Search files and folders | ファイル/フォルダを検索 |
| Download file | ファイルをダウンロード |
| Upload file | ファイルをアップロード |
| Move file | ファイルを移動 |
| Create folder | フォルダを作成 |
| Delete a file | ファイルを削除 |
| Copy file | ファイルをコピー |

**指示例**:
```
Google Sheetsノードを追加:
- Action: Get row(s) in sheet
- Document: n8n-test
- Sheet: canva_A
```

---

### n8nワークフローJSONのフォーマット仕様

**Google Sheetsノードの正しい構造**:

```json
{
  "documentId": {
    "__rl": true,
    "value": "スプレッドシートID",
    "mode": "list",
    "cachedResultName": "スプレッドシート名"
  },
  "sheetName": {
    "__rl": true,
    "value": 123456789,  // 数値のgid
    "mode": "list",
    "cachedResultName": "シート名"
  }
}
```

### 重要な制限事項

- Instagram API: 24時間で50投稿まで
- Google Drive URL: Instagram APIで直接使用不可（2025年1月〜）
- Canva Bulk Create: API自動化はEnterprise必須

---

## トピック詳細

### トピック1: 投稿内容の精度アップ

**目的**: 現在のGeminiプロンプトで生成されるコンテンツの品質を向上

**現状の課題**（想定）:
- 生成されるテキストが不自然
- hookが弱い / 視聴者を惹きつけない
- CTAが効果的でない
- カテゴリ別の差別化が不十分

**改善アプローチ**:
- 実際に生成された投稿の分析
- 成功している競合リールの研究
- プロンプトエンジニアリングの改善
- A/Bテスト用の複数バリエーション生成

**状態**: 未着手

---

### トピック2: AI音声生成（Fish Audio）

**目的**: リール動画にAIナレーションを自動追加

**状態**: **実装中**（残タスクあり - 詳細は「次にやること（緊急引き継ぎ）」参照）

**作成済みモジュール**:
- Module 01: AI音声生成の基本セットアップ（`module-01-audio-setup.md`）
- Module 02【前編】: 音声合成ワークフローの構築（`module-02a-audio-workflow.md`）
- Module 02【中編】: 音声合成ワークフローの構築（`module-02b-audio-workflow.md`）

**未作成モジュール**:
- Module 02【後編】: ループ完成、ステータス更新、全カテゴリ対応（`module-02c-audio-workflow.md`）- **実践待ち**

---

#### 調査完了項目

**Fish Audio API**:
| 項目 | 内容 |
|------|------|
| 料金 | 従量課金（1分≒600-625クレジット）、無料枠: 月1時間 |
| 日本語対応 | 対応済み（ネイティブレベルの品質） |
| レート制限 | 無料: 100リクエスト/分、有料: 500リクエスト/分〜 |
| レイテンシ | 約150ms（低遅延） |

**Canva一括作成での音声連携**:
- **結論: 不可能** - Bulk Createはテキストと画像のみ対応、音声ファイルはNG

**音声と動画の結合方法**:
- **採用方式: ffmpeg** - n8n Docker内で実行
- n8n標準イメージにはffmpegがないため、カスタムDockerfileで追加

---

#### ffmpeg追加手順（受講生向け）

**1. Dockerfileを作成**

`C:/n8n/Dockerfile` を以下の内容で新規作成:

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN apk add --no-cache ffmpeg
USER node
```

**2. docker-compose.ymlを修正**

`C:/n8n/docker-compose.yml` を編集:

```yaml
# 変更前
services:
  n8n:
    image: n8nio/n8n:latest

# 変更後
services:
  n8n:
    build: .
    # image: n8nio/n8n:latest  # ffmpeg追加のためカスタムビルドに変更
```

**3. 再ビルド・起動**

```bash
cd C:/n8n
docker-compose down
docker-compose build
docker-compose up -d
```

**4. ffmpeg確認**

```bash
docker exec n8n ffmpeg -version
```

バージョン情報が表示されればOK。

---

#### 音声合成フロー（設計）

```
[既存: SNS投稿作成]
  Gemini → narration_1（前半30秒）, narration_2（後半30秒）生成
       ↓
[新規: 音声生成ワークフロー]
  1. canva_Aシートからpost_id, narration_1, narration_2取得
  2. Fish Audio API × 2回（前半・後半）
  3. Google Driveにpost_id_1.mp3, post_id_2.mp3として保存
       ↓
[既存: Canva一括作成]（手動・変更なし）
  テキストのみのリール動画生成 → MP4
       ↓
[新規: 音声合成ワークフロー]
  1. DriveからMP4と音声2つをダウンロード
  2. ffmpegで合成（前半0秒〜、後半30秒〜）
  3. 合成済みMP4をDriveにアップロード
       ↓
[既存: Instagram投稿]
  合成済みMP4を投稿
```

---

#### ffmpegコマンド（音声合成）

```bash
# 前半音声を0秒から、後半音声を30秒から配置して動画に合成
ffmpeg -i video.mp4 -i narration_1.mp3 -i narration_2.mp3 \
  -filter_complex "[1:a]adelay=0|0[a1];[2:a]adelay=30000|30000[a2];[a1][a2]amix=inputs=2[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac output.mp4
```

---

#### 参考資料

- [Fish Audio Pricing](https://fish.audio/plan/)
- [Fish Audio API Rate Limits](https://docs.fish.audio/developer-platform/models-pricing/pricing-and-rate-limits)
- [Canva Bulk Create Help](https://www.canva.com/help/bulk-create/)
- [n8n-docker-ffmpeg](https://github.com/yigitkonur/n8n-docker-ffmpeg)
- [n8n-nodes-mediafx](https://github.com/dandacompany/n8n-nodes-mediafx)

---

### トピック3: インサイト取得

**目的**: Instagram Insights APIを使って投稿パフォーマンスを自動取得・分析

**取得したいデータ**:
- リーチ数
- インプレッション数
- エンゲージメント（いいね、コメント、保存、シェア）
- 再生回数（リール）
- フォロワー増減

**想定フロー**:
```
[Schedule Trigger]
    ↓
[Get Published Posts] ← postsシートからPUBLISHED取得
    ↓
[Instagram Insights API] ← 各投稿のメトリクス取得
    ↓
[Google Sheets: Update] ← インサイトデータを記録
    ↓
[（オプション）分析・レポート生成]
```

**状態**: 未着手

---

## 次のセッションへの指示

### 現在の状態

**n8n環境**:
- ffmpegインストール済み（`docker exec n8n ffmpeg -version` で確認可能）
- Fish Audio Credential設定済み（Header Auth: `Fish Audio API`）
- テストワークフロー「Fish Audio テスト」で音声生成成功確認済み
- 音声合成ワークフロー全カテゴリ対応版: 動作確認済み

**講座用設定**:
- Voice ID（元気な女性）: `b756350f646543bdb0b7e8df76bae3fd`
- ユーザーは別途カスタムボイス（自分の声）を使用

**完了したモジュール**:
- Module 01: AI音声生成の基本セットアップ（`module-01-audio-setup.md`）
- Module 02【前編】: 音声合成ワークフロー構築（`module-02a-audio-workflow.md`）
- Module 02【中編】: 音声合成ワークフロー構築（`module-02b-audio-workflow.md`）
- Module 02【後編】: 全カテゴリ対応（`module-02c-audio-workflow.md`）

### 音声合成ワークフロー実装状況（2025-12-08 更新）

**ワークフローJSON**: `content/modules/n8n-advanced/音声合成.json`

**実装完了**: 全カテゴリ対応版（canva_A〜E）

---

#### ワークフロー全体構造

```
[Manual Trigger]
    ↓
[Sheet List] - 5つのシート情報を生成（A〜E）
    ↓
[Loop Sheets] - シートごとにループ
    ↓ (loop出力)
[Get Sheet Data] - 各シートからデータ取得
    ↓
[Add Category] - categoryカラムを付与
    ↓ (Loop Sheetsに戻る)

[Loop Sheets完了後]
    ↓
[Filter NORMAL] - audio_status=NORMALでフィルタ
    ↓
[Set Folder Names] - categoryからフォルダ名を動的生成
    ↓
[Loop Over Items] - 各アイテムをループ
    ↓
[Search Category Folder] - カテゴリフォルダ検索
    ↓
[Search Archive Folder] - アーカイブフォルダ検索
    ↓
[If Archive Exists] - なければ作成
    ↓
[Prepare Item Data] - フォルダIDを付与
    ↓
[Search Video File] - post_idで動画検索
    ↓
[If Video Exists]
    ├── true → 音声生成・合成フロー
    └── false → Loop Over Itemsに戻る
    ↓
[Download file] → [Generate Audio 1] → [Wait 5s] → [Generate Audio 2]
    ↓
[Save Video] → [Save Audio 1] → [Save Audio 2]
    ↓
[Execute Command] - ffmpeg合成
    ↓
[Read Output] - 合成済み動画読み込み
    ↓
[Move Original to Archive] / [Wait 5s1] → [Upload New Video]
    ↓
[Update audio_status] - GAS呼び出しでDONEに更新
    ↓
[Loop Over Itemsに戻る]
```

---

#### audio_statusの仕様

| 状態 | 意味 |
|------|------|
| NORMAL | Canva用シート振り分けで設定。音声合成対象 |
| DONE | 音声合成完了。投稿可能 |
| （空） | 旧データ。音声合成対象外 |

**設定タイミング**:
- `NORMAL`: Canva用シート振り分けワークフローでcanva_A〜Eに書き込む際に設定
- `DONE`: 音声合成ワークフローでUpload New Video成功後にGAS経由で更新

---

#### 重要な修正点（トラブルシューティング用）

1. **Google Drive検索で部分一致問題**
   - Search Category Folderで「202512Instagram投稿A」を検索すると「202512Instagram投稿A_archive」も返る
   - 解決: Prepare Item Dataで正確な名前でフィルタする
   ```javascript
   const categoryFolder = categoryFolders.find(item => item.json.name === currentItem.folder_name);
   ```

2. **Google DriveノードのFolder ID指定でエラー**
   - 「File not found: .」エラーが発生することがある
   - ExpressionでIDを渡す場合、前のノードのデータが正しく参照できているか確認

3. **GASでのステータス更新**
   - Google Sheetsノードでは動的にシートを選択できない
   - GAS（updateAudioStatus関数）を使用してcategoryに応じたシートを更新

**講座用スクショ（配置済み）**:

Module 02【前編】で使用した画像（`public/n8n-advanced/`に配置済み）:

| ファイル名 | 内容 |
|-----------|------|
| `get-canva-a-success.png` | Get canva_A - 5件取得成功 |
| `filter-pending-success.png` | Filter Pending - フィルタ成功 |
| `loop-over-items-setup.png` | Loop Over Items - Batch Size 1設定 |
| `search-category-folder-success.png` | Search Category Folder - フォルダ検索成功 |
| `if-archive-exists-true.png` | If Archive Exists - True Branch成功 |
| `create-archive-folder-success.png` | Create Archive Folder - フォルダ作成成功 |
| `google-drive-video-exists.png` | Google Drive - 動画ファイル存在確認 |
| `if-video-exists-success.png` | If Video Exists - True Branch成功 |
| `workflow-overview.png` | ワークフロー全体図（Step 1-9完了時点） |

Module 02【中編】で使用した画像（`public/n8n-advanced/`に配置済み）:

| ファイル名 | 内容 |
|-----------|------|
| `download-file-success.png` | Download file - 動画ダウンロード成功 |
| `generate-audio-1-success.png` | Generate Audio 1 - 音声生成成功 |
| `generate-audio-2-success.png` | Generate Audio 2 - 音声生成成功 |
| `save-video-setup.png` | Save Video - 設定画面 |
| `execute-command-success.png` | Execute Command - ffmpeg合成成功（exitCode: 0） |
| `read-output-success.png` | Read Output - 合成済み動画読み込み成功 |
| `move-original-to-archive-success.png` | Move Original to Archive - 元動画移動成功 |
| `upload-new-video-success.png` | Upload New Video - 新動画アップロード成功 |
| `workflow-complete.png` | ワークフロー完成図 |

**受講者用ワークフローJSON**:
| ファイル名 | 内容 |
|-----------|------|
| `audio-workflow-template.json` | 音声合成ワークフロー（機密情報プレースホルダー化済み） |

---

### 次にやること

**投稿内容の精度アップトピック**: 未着手 → 開始

---

#### AI音声生成トピック（完了）

- [x] Module 01: AI音声生成の基本セットアップ
- [x] Module 02【前編】: 音声合成ワークフローの構築
- [x] Module 02【中編】: 音声合成ワークフローの構築
- [x] Module 02【後編】: 全カテゴリ対応
- [x] 受講者用テンプレートJSON（中編用: `audio-workflow-template.json`）
- [x] 受講者用テンプレートJSON（後編用: `audio-workflow-all-categories-template.json`）

---

#### 投稿内容の精度アップ - やること

1. **現状分析**
   - 現在のGeminiプロンプトを確認
   - 実際に生成された投稿内容を確認
   - 課題を特定

2. **改善**
   - プロンプトエンジニアリングの改善
   - 必要に応じてワークフロー修正

3. **講座作成**
   - Module構成を決定
   - 講座を作成

---

#### 重要な注意事項

1. **講座フォーマットルール**（本HANDOFF内「講座フォーマット仕様」参照）
   - 絵文字禁止
   - 各セクション末尾にチェックポイント
   - トラブルシューティングは実際に発生した問題のみ記載
   - 参考資料・よくある質問を必ず記載

2. **n8nノード指示ルール**（本HANDOFF内「n8nノード指示のルール」参照）
   - Google Sheets/Google Driveノードは必ずActionを明記

3. **画像には必ず説明文を追加**
   - 「○○の実行結果：」のような一文を画像の前に入れる
   - 画像だけ連続させない

4. **進捗はTodoWriteで管理**
   - 作業開始時にタスク一覧を作成
   - 各タスク完了時に即座にcompletedに更新

---

---

**最終更新**: 2025-12-09（Module 02 全編完了、音声合成ワークフロー動作確認済み）
