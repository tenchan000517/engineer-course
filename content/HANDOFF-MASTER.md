# MASTER HANDOFF: n8n上級編 Module 10以降の実装

**作成日**: 2025-12-16
**作成者**: Claude Opus 4.5
**目的**: 次世代セッションへの完全な引き継ぎ

---

## 0. 読み方

このドキュメントを最初に読み、全体像を把握してから個別のHANDOFFドキュメントを参照してください。

**関連ドキュメント**:
1. `HANDOFF-MASTER.md` ← **今読んでいるファイル（入り口）**
2. `HANDOFF-module-10-stories.md` ← Module 10の詳細仕様
3. `HANDOFF-module-11-crosspost.md` ← Module 11の詳細仕様
4. `HANDOFF-nanobanana-carousel-future.md` ← 将来計画

---

## 1. プロジェクト概要

### 1.1 現在の状態

**n8n上級編**: Module 01〜09 完成済み

**ファイル配置**:
```
/mnt/c/engineer-course/
├── content/
│   └── modules/
│       └── n8n-advanced/
│           ├── module-01-audio-setup.md
│           ├── module-02a-audio-workflow.md
│           ├── module-02b-audio-workflow.md
│           ├── module-02c-audio-workflow.md
│           ├── module-03-content-ideas-import.md
│           ├── module-04-canva-sheet-structure.md
│           ├── module-05-gemini-prompt-improvement.md
│           ├── module-06-ideas-generation-workflow.md
│           ├── module-07-workflow-optimization.md
│           ├── module-08-audio-workflow-optimization.md
│           └── module-09-operation-flow.md
└── public/
    └── n8n-advanced/
        └── download/
            ├── sns-post-advanced-workflow.json
            ├── audio-workflow-advanced.json
            └── 音声合成advanced.json
```

### 1.2 現在のワークフロー全体図

```
【月次コンテンツ生成】
Antigravity
    ↓ JSON（約45-80件のideas）
GAS「configA2からideas+postsに追加」
    ↓ ideasシート(ADOPTED) + postsシート(DRAFT)
GAS「postsからCanvaシートに振り分け」
    ↓ canva_A〜Eシート + postsシート(CANVA_READY)

【日次コンテンツ制作】
Canva一括作成
    ↓ MP4ファイル（POST-xxx.mp4）
Google Driveにアップロード
    ↓ 20251213投稿A フォルダ
n8n「音声合成advanced」
    ↓ canva_Xシート(audio_status: DONE)

【Instagram投稿】
n8n「Instagram Reel from Drive」
    ↓ フィルタ: status=CANVA_READY
投稿完了
    ↓ postsシート(status: PUBLISHED)
```

### 1.3 statusの流れ

**postsシート**:
```
DRAFT → CANVA_READY → PUBLISHED
```

**canva_Xシート**:
```
NORMAL → DONE
```

---

## 2. ユーザーからの確定方針

2025-12-16のセッションでユーザーと確認した内容:

### 2.1 実装順序

```
【今すぐ実装】
1. Module 10: Instagramストーリーズ自動投稿
2. Module 11: クロスポスト（Facebook / X / TikTok）

【将来実装（AI画像生成講座完成後）】
3. 【別大カテゴリ】Nanobanana Pro AI画像生成講座
4. n8n上級編 続き: カルーセル投稿ワークフロー
```

### 2.2 ユーザーの明確な指示

1. **Module 10**: リール投稿後にストーリーズで自動告知 → **OK**
2. **カルーセル投稿**: 大規模モジュールになる
   - AI画像生成は1つのモジュール
   - カルーセル投稿は別のモジュール
   - AI画像生成は**n8nの外側**で作成
   - **Nanobanana Pro**を元にした講座を**大カテゴリ**として作成
   - カルーセル投稿はNanobanana Pro講座**完成後**
3. **クロスポスト（Module 11）**: → **OK**
4. **参考フォルダ**: `C:\instagram-manga-generator` にベース概念がある

---

## 3. 次のセッションでやること

### 3.1 最優先: Module 10の実装

**ファイル名**: `module-10-instagram-stories.md`

**内容**:
- Instagram Graph APIでストーリーズを投稿する方法
- 既存の「Instagram Reel from Drive」ワークフローへのノード追加
- ストーリーズ用画像生成（DALL-E or 静的テンプレート）

**詳細仕様**: `HANDOFF-module-10-stories.md` を参照

### 3.2 次: Module 11の実装

**ファイル名**: `module-11-crosspost.md`

**内容**:
- Facebook / X (Twitter) / TikTokへのクロスポスト
- プラットフォーム別キャプション最適化

**詳細仕様**: `HANDOFF-module-11-crosspost.md` を参照

---

## 4. 技術的な詳細（Instagram Graph API）

### 4.1 ストーリーズ投稿API

```bash
# Step 1: コンテナ作成
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
?media_type=STORIES
&image_url={IMAGE_URL}
&access_token={TOKEN}

# Step 2: ステータス確認（FINISHED待ち）
GET https://graph.facebook.com/v22.0/{container_id}?fields=status_code

# Step 3: 公開
POST https://graph.facebook.com/v22.0/{ig-user-id}/media_publish
?creation_id={container_id}
&access_token={TOKEN}
```

### 4.2 カルーセル投稿API（将来用）

```bash
# Step 1: 各画像のコンテナ作成
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
?image_url={IMAGE_URL}
&is_carousel_item=true

# Step 2: カルーセルコンテナ作成
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
?media_type=CAROUSEL
&children={CONTAINER_IDS}
&caption={CAPTION}

# Step 3: 公開
POST https://graph.facebook.com/v22.0/{ig-user-id}/media_publish
?creation_id={carousel_container_id}
```

### 4.3 必要な権限

- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`

---

## 5. 講座スタイルガイド

### 5.1 Markdownテンプレート

```markdown
# モジュールタイトル

**所要時間**: XX分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 項目1
- 項目2
- 項目3

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 目標1
- 目標2
- 目標3

---

## 目次

- [セクション1: タイトル](#セクション1-タイトル)
- [セクション2: タイトル](#セクション2-タイトル)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- 項目1
- 項目2

### 前提知識

- 知識1
- 知識2

---

## セクション1: タイトル

### 説明

...

### チェックポイント

- [ ] 確認項目1
- [ ] 確認項目2

---

## トラブルシューティング

### エラー1

**症状**: ...

**解決方法**: ...

---

## まとめ

### このモジュールで学んだこと

- 学び1
- 学び2

### 次のステップ

...

---

## 参考資料

- [リンク1](URL)
- [リンク2](URL)

---

## よくある質問

**Q: 質問1**
A: 回答1

**Q: 質問2**
A: 回答2
```

### 5.2 画像の命名規則

```
/n8n-advanced/module-XX-セクション名.png
例: /n8n-advanced/module-10-story-container-success.png
```

### 5.3 ワークフローJSONの配置

```
/public/n8n-advanced/download/ワークフロー名.json
```

---

## 6. 未確認事項リスト

次のセッションでユーザーに確認が必要:

### 6.1 Module 10関連

1. ストーリーズ画像は静的テンプレート or DALL-E毎回生成？
2. 既存「Instagram Reel from Drive」ワークフローの正式名称とパス
3. postsシートの現在の列構成（story_id追加位置）

### 6.2 将来計画関連

1. `C:\instagram-manga-generator` フォルダの内容確認
2. Nanobanana Pro講座の大カテゴリ名
3. Kie.ai APIの契約状況

---

## 7. ファイル一覧

このセッションで作成したファイル:

| ファイル名 | 用途 |
|-----------|------|
| `HANDOFF-MASTER.md` | 総合引き継ぎ（入り口） |
| `HANDOFF-module-10-stories.md` | Module 10詳細仕様 |
| `HANDOFF-module-11-crosspost.md` | Module 11詳細仕様 |
| `HANDOFF-nanobanana-carousel-future.md` | 将来計画 |

---

## 8. 次のセッション開始手順

```
1. このファイル（HANDOFF-MASTER.md）を読む
2. HANDOFF-module-10-stories.md を読む
3. /content/modules/n8n-advanced/ の既存モジュールを1つ読んでスタイル確認
4. ユーザーに未確認事項を質問
5. module-10-instagram-stories.md を作成開始
```

---

**以上で引き継ぎ完了**
