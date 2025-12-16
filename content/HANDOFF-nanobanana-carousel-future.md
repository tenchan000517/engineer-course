# HANDOFF: Nanobanana Pro講座 & カルーセル投稿（将来計画）

**作成日**: 2025-12-16
**状態**: 計画段階（Module 10, 11完成後に着手）
**次の実装者への引き継ぎドキュメント**

---

## 1. 計画概要

### 1.1 ユーザーの方針

1. **Nanobanana Pro AI画像生成講座**を**別の大カテゴリ**として作成
2. AI画像生成はn8nの**外側**で行う
3. カルーセル投稿ワークフローはAI画像生成講座**完成後**にn8nで自動化
4. 「C:\instagram-manga-generator」にベースの概念がほぼ完成している

### 1.2 実装順序

```
現在
  ↓
Module 10: Instagramストーリーズ自動投稿 ← 次に実装
  ↓
Module 11: クロスポスト（Facebook / X / TikTok）
  ↓
【別大カテゴリ】Nanobanana Pro AI画像生成講座
  ↓
n8n上級編 続き: カルーセル投稿ワークフロー
```

---

## 2. Nanobanana Pro講座の計画

### 2.1 Nanobanana Proとは

Googleが2025年11月に発表した「Gemini 3 Pro Image」（別名Nanobanana Pro）の特徴:

| 特徴 | 説明 |
|------|------|
| **完璧なテキスト描画** | 従来AIの最大の弱点だった「テキスト表示」が完璧 |
| **キャラクター統一** | 最大14枚の画像で同一キャラクターを維持 |
| **多言語対応** | 日本語、英語、中国語、ドイツ語など |
| **高解像度出力** | 2K/4K対応、商用印刷レベル |
| **ストーリー理解** | 漫画のコマ割りとストーリー構成を理解 |

### 2.2 従来AIとの比較

```
❌ 従来のAI（DALL-E、Midjourney等）
- テキストが読めない/文字化け
- キャラクターが毎回変わる
- 漫画のコマ割りを理解できない

✅ Nanobanana Pro
- 完璧な日本語テキスト描画
- 14枚まで同一キャラ維持
- 4コマ漫画・ストーリー漫画に最適
```

### 2.3 講座構成案（仮）

```
【大カテゴリ】Nanobanana Pro AI画像生成講座

Module 01: Nanobanana Proの基本
  - アカウント設定
  - 基本的な画像生成
  - プロンプトの書き方

Module 02: 漫画スタイル画像生成
  - 4コマ漫画の生成
  - キャラクター統一テクニック
  - 日本語テキストの配置

Module 03: インフォグラフィック生成
  - データビジュアライゼーション
  - コンサルタント風スライド
  - カルーセル用画像セット生成

Module 04: Instagramカルーセル用画像生成
  - 10枚セットの生成
  - ブランディング統一
  - 出力形式の最適化
```

### 2.4 関連リソース

**ユーザーが言及したフォルダ**:
- パス: `C:\instagram-manga-generator`
- 内容: ベースの概念的なものがほぼ完成
- 次セッションで確認が必要

---

## 3. カルーセル投稿ワークフローの計画

### 3.1 技術仕様

**Instagram Graph API カルーセル投稿フロー**:

```
Step 1: 各画像のコンテナ作成（最大10枚）
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
Body: {
  "image_url": "{IMAGE_URL}",
  "is_carousel_item": true
}
→ 各画像のcontainer_idを取得

Step 2: カルーセルコンテナ作成
POST https://graph.facebook.com/v22.0/{ig-user-id}/media
Body: {
  "media_type": "CAROUSEL",
  "children": "{CONTAINER_IDS_COMMA_SEPARATED}",
  "caption": "{CAPTION}"
}
→ carousel_container_idを取得

Step 3: カルーセル公開
POST https://graph.facebook.com/v22.0/{ig-user-id}/media_publish
Body: {
  "creation_id": "{CAROUSEL_CONTAINER_ID}"
}
```

### 3.2 制限事項

- 画像数: 2〜10枚
- 画像サイズ: 1080×1080px (1:1) または 1080×1350px (4:5)
- 対応形式: JPEG のみ
- キャプション: 2,200文字まで
- API制限: 50投稿/24時間

### 3.3 ワークフロー設計案

```
トリガー（Manual or Schedule）
    ↓
Get Carousel Items from Sheet
    ↓
Loop: 各画像をCloudinaryにアップロード
    ↓
Loop: 各画像のコンテナ作成（Wait 2s between）
    ↓
Create Carousel Container
    ↓
Wait for Processing (Loop Until status=FINISHED)
    ↓
Publish Carousel
    ↓
Update Sheet
```

---

## 4. ユーザーからの調査結果（カルーセル関連）

### 4.1 画像生成オプション

**オプション A: ContentDrips API（月額$39〜）**
```javascript
POST https://generate.contentdrips.com/generate
Body: {
  "tool": "carousel-maker",
  "template_id": "modern_tech_carousel_v2",
  "export_format": "png",
  "slides": [...],
  "branding": {
    "name": "Your Brand",
    "handle": "@yourhandle",
    "logo_url": "https://..."
  }
}
```

**オプション B: DALL-E 3（カスタム画像）**
```javascript
POST https://api.openai.com/v1/images/generations
Body: {
  "model": "dall-e-3",
  "prompt": "...",
  "size": "1024x1024",
  "quality": "hd"
}
```

**オプション C: Nanobanana Pro（推奨）**
- Kie.ai API経由でアクセス
- 完璧なテキスト描画
- キャラクター統一
- 詳細はNanobanana Pro講座で解説

### 4.2 画像ホスティング

カルーセル投稿にはCloudinaryを使用（既存ワークフローと同じ）:

```javascript
POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
FormData: {
  "file": "{IMAGE_URL}",
  "upload_preset": "instagram_carousel",
  "folder": "instagram_carousels",
  "transformation": "c_fill,w_1080,h_1080,q_auto:best"
}
```

---

## 5. 次のセッションへの指示

### 5.1 Module 10, 11が完了したら

1. `C:\instagram-manga-generator` フォルダの内容を確認
2. ユーザーにNanobanana Pro講座の詳細構成を相談
3. 別大カテゴリとして講座ディレクトリを作成

### 5.2 Nanobanana Pro講座完成後

1. カルーセル投稿ワークフローをn8n上級編の続きとして追加
2. Module 12（仮）として実装

---

## 6. 重要な確認事項（未確定）

以下はユーザーへの確認が必要:

1. Nanobanana Pro講座の大カテゴリ名
2. `C:\instagram-manga-generator` の内容と活用方法
3. カルーセル投稿のコンテンツ種類（漫画 or インフォグラフィック or 両方）
4. Kie.ai APIの契約状況
