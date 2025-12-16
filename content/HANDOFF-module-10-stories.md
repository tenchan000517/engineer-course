# HANDOFF: Module 10 Instagramストーリーズ自動投稿

**作成日**: 2025-12-16
**前提**: n8n上級編 Module 01-09 完成済み
**次の実装者への引き継ぎドキュメント**

---

## 1. プロジェクト概要

### 1.1 現在の状態

n8n上級編は Module 01-09 まで完成している。

**既存モジュール一覧**:
| Module | ファイル名 | 内容 |
|--------|-----------|------|
| 01 | module-01-audio-setup.md | ffmpegインストール、Fish Audio API設定 |
| 02a | module-02a-audio-workflow.md | 音声合成ワークフロー（前編）: シート取得、フォルダ検索 |
| 02b | module-02b-audio-workflow.md | 音声合成ワークフロー（中編）: 音声生成、ffmpeg合成 |
| 02c | module-02c-audio-workflow.md | 音声合成ワークフロー（後編）: 全カテゴリA〜E対応 |
| 03 | module-03-content-ideas-import.md | インフルエンサー起点トレンド調査、GASインポート |
| 04 | module-04-canva-sheet-structure.md | 13列構成への変更 |
| 05 | module-05-gemini-prompt-improvement.md | カテゴリA〜E別プロンプト設計 |
| 06 | module-06-ideas-generation-workflow.md | Antigravityによる3ステップideas生成 |
| 07 | module-07-workflow-optimization.md | GAS統合、n8n簡略化（Gemini不要） |
| 08 | module-08-audio-workflow-optimization.md | ナレーション統合、API呼び出し削減 |
| 09 | module-09-operation-flow.md | 運用フローガイド |

**ファイル配置**:
- Markdownファイル: `/mnt/c/engineer-course/content/modules/n8n-advanced/`
- ワークフローJSON: `/mnt/c/engineer-course/public/n8n-advanced/download/`

### 1.2 現在のワークフロー構成

```
【月次コンテンツ生成】
Antigravity → JSON → GAS(ideas+posts追加) → GAS(Canva振り分け)
    ↓
【日次コンテンツ制作】
Canva一括作成 → ダウンロード → Google Drive → n8n音声合成advanced
    ↓
【Instagram投稿】
n8n(Instagram Reel from Drive) → リール投稿完了
```

### 1.3 Module 10の目標

**リール投稿後にInstagramストーリーズで自動告知する機能を追加する**

---

## 2. Module 10 設計仕様

### 2.1 機能要件

1. リール投稿が成功した後、5分待機
2. ストーリーズ用画像を生成（DALL-E or 静的テンプレート）
3. Instagram Graph APIでストーリーズを投稿
4. 投稿成功をシートに記録

### 2.2 技術仕様

**Instagram Graph API ストーリーズ投稿フロー**:

```
Step 1: ストーリーズコンテナ作成
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
Body: {
  "media_type": "STORIES",
  "image_url": "{画像URL}"  // または "video_url": "{動画URL}"
}
Response: { "id": "story_container_id" }

Step 2: ステータス確認（ループ）
GET https://graph.facebook.com/v22.0/{story_container_id}?fields=status_code
→ status_code が "FINISHED" になるまで待機

Step 3: ストーリーズ公開
POST https://graph.facebook.com/v22.0/{ig-user-id}/media_publish
Body: {
  "creation_id": "{story_container_id}"
}
```

**必要な権限**:
- `instagram_basic`
- `instagram_content_publish`

**制限事項**:
- ストーリーズは24時間で自動削除
- キャプションは表示されない（投稿時に含めても反映されない）
- 1日25投稿まで（すべてのメディアタイプ合計）

### 2.3 ワークフロー変更点

**既存ワークフロー「Instagram Reel from Drive」への追加**:

```
（既存フロー）
Get DRAFT Posts → ... → Publish Reel → Update Posts Sheet
                                ↓
                        （追加フロー）
                        Wait 5min
                                ↓
                        Generate Story Image (DALL-E or 静的)
                                ↓
                        Upload to Cloudinary
                                ↓
                        Create Story Container
                                ↓
                        Wait for Processing (Loop Until status=FINISHED)
                                ↓
                        Publish Story
                                ↓
                        Update Posts Sheet (story_id追加)
```

### 2.4 シート変更

**postsシートに追加するカラム**:
- `story_id`: ストーリーズのメディアID
- `story_published_at`: ストーリーズ投稿日時

---

## 3. ユーザーからの調査結果（そのまま保存）

ユーザーが事前に調査した「Instagramストーリーズ自動化」の情報:

### 3.1 重要な背景情報

- **2023年5月以降、Instagram Graph APIでストーリーズ投稿が可能になった**
- フィード投稿、リール、ストーリーズすべてがContent Publishing APIでサポート

### 3.2 前提条件

1. Instagramビジネスアカウント（個人アカウントは不可）
2. Facebookページ（InstagramビジネスアカウントをFacebookページに接続）
3. Meta開発者アカウント（アプリを作成してAPI権限を取得）
4. 動画・画像のホスティング（直接アクセス可能なURL必須）
   - 推奨: Amazon S3、Shopifyストレージ、SSL対応のWordPressサイト、Cloudinary
   - 不可: Google DriveやDropboxの共有リンク（直接リンクではないため）

### 3.3 API呼び出しの詳細

**画像ストーリーの投稿**:

```bash
# ステップ1: コンテナ作成
POST https://graph.facebook.com/{ig-user-id}/media
?image_url={IMAGE_URL}
&media_type=STORIES
&access_token={LONG_LIVED_TOKEN}

# レスポンス例:
{
  "id": "17889455560051444"
}

# ステップ2: 公開
POST https://graph.facebook.com/{ig-user-id}/media_publish
?creation_id=17889455560051444
&access_token={LONG_LIVED_TOKEN}
```

**動画ストーリーの投稿**:

```bash
POST https://graph.facebook.com/{ig-user-id}/media
?video_url={VIDEO_URL}
&media_type=STORIES
&access_token={LONG_LIVED_TOKEN}
```

### 3.4 よくあるエラーと解決方法

| エラー | 原因 | 解決方法 |
|--------|------|----------|
| `(#10) This endpoint requires the 'instagram_content_publish' permission` | 権限不足 | Meta開発者ダッシュボードで権限追加、ユーザーに再認証 |
| `Unsupported post request` または `Video Processing Fails` | メディアURL問題 | URLが直接リンクか確認、ブラウザで即座に再生されるか確認 |

### 3.5 技術要件

- **対応フォーマット**:
  - 画像: JPEG のみ
  - 動画: MP4推奨
  - アスペクト比: 9:16（縦型）
- **ファイルサイズ**:
  - 動画: 最大100MB
  - 画像: 最大8MB

---

## 4. Module 10 講座構成案

### 4.1 目次案

```markdown
# Instagramストーリーズ自動投稿

**所要時間**: 30分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Instagram Graph APIでストーリーズを投稿する方法
- リール投稿後に自動でストーリーズ告知を行うワークフロー
- ストーリーズ用画像の生成方法

---

## 目次

- [セクション1: Instagram Graph API ストーリーズの仕組み](#セクション1-instagram-graph-api-ストーリーズの仕組み)
- [セクション2: ワークフローへのストーリーズ追加](#セクション2-ワークフローへのストーリーズ追加)
- [セクション3: ストーリーズ画像の生成](#セクション3-ストーリーズ画像の生成)
- [セクション4: 動作確認](#セクション4-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)
```

### 4.2 セクション詳細

**セクション1**: API仕組みの解説（2段階プロセス: コンテナ作成→公開）
**セクション2**: 既存ワークフローへの5つのノード追加
**セクション3**: DALL-E or 静的テンプレートでストーリーズ画像生成
**セクション4**: テスト実行と確認

---

## 5. 関連ファイル・パス

### 5.1 既存ファイル

| 用途 | パス |
|------|------|
| モジュールMarkdown | `/mnt/c/engineer-course/content/modules/n8n-advanced/module-XX-YYY.md` |
| ワークフローJSON | `/mnt/c/engineer-course/public/n8n-advanced/download/*.json` |
| 画像（スクリーンショット） | `/mnt/c/engineer-course/public/n8n-advanced/*.png` |

### 5.2 未確認ファイル

ユーザーが言及した「C:\instagram-manga-generator」フォルダ:
- Nanobanana Pro講座のベース概念が含まれている
- Module 10では使用しない（将来のカルーセル投稿用）

---

## 6. 今後のモジュール計画

| Module | テーマ | 状態 |
|--------|--------|------|
| **10** | **Instagramストーリーズ自動投稿** | **次に実装** |
| 11 | クロスポスト（Facebook / X / TikTok） | 計画中 |
| - | Nanobanana Pro AI画像生成講座（別大カテゴリ） | 計画中 |
| - | カルーセル投稿ワークフロー（AI画像生成完成後） | 計画中 |

---

## 7. 実装時の注意事項

### 7.1 講座スタイルの維持

- 各セクションは「## セクションX: タイトル」形式
- チェックポイント（`- [ ]`形式）を各セクション末尾に配置
- トラブルシューティングセクションを必ず含める
- よくある質問セクションを必ず含める

### 7.2 コードスタイル

- n8nのCodeノードはJavaScript
- GASもJavaScript
- JSONは整形して表示

### 7.3 画像の命名規則

- `module-XX-セクション名.png` 形式
- 例: `module-10-story-container-success.png`

---

## 8. 次のセッションへの指示

1. このHANDOFFドキュメントを最初に読む
2. `/mnt/c/engineer-course/content/modules/n8n-advanced/` の既存モジュールを参照してスタイルを確認
3. Module 10のMarkdownファイルを `module-10-instagram-stories.md` として作成
4. 必要に応じてワークフローJSONを更新/作成

---

## 9. ユーザーとの確認事項（未確定）

以下は次セッションでユーザーに確認が必要:

1. ストーリーズ画像は静的テンプレートを使用するか、DALL-Eで毎回生成するか
2. 既存の「Instagram Reel from Drive」ワークフローの正式名称とファイルパス
3. postsシートの現在の列構成（story_idカラムを追加する位置）
