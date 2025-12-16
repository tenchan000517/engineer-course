# HANDOFF: Module 11 クロスポスト（Facebook / X / TikTok）

**作成日**: 2025-12-16
**前提**: Module 10（ストーリーズ）完成後に実装
**次の実装者への引き継ぎドキュメント**

---

## 1. Module 11の目標

**Instagram投稿と同時に、Facebook / X (Twitter) / TikTokへクロスポストする機能を追加する**

---

## 2. 設計仕様

### 2.1 クロスポストの基本フロー

```
Instagram投稿成功
    ↓
┌───────────────────┼───────────────────┐
↓                   ↓                   ↓
Facebook投稿      X投稿            TikTok投稿
```

### 2.2 プラットフォーム別仕様

#### Facebook

- **API**: Facebook Graph API（Instagramと同じCredential使用可能）
- **投稿形式**: 画像/動画投稿
- **必要な権限**: `pages_manage_posts`, `pages_read_engagement`

```bash
# 画像投稿
POST https://graph.facebook.com/v22.0/{page-id}/photos
Body: {
  "url": "{IMAGE_URL}",
  "caption": "{CAPTION}"
}

# 動画投稿
POST https://graph.facebook.com/v22.0/{page-id}/videos
Body: {
  "file_url": "{VIDEO_URL}",
  "description": "{CAPTION}"
}
```

#### X (Twitter)

- **API**: X API v2
- **投稿形式**: 画像付きツイート（最大4枚）
- **必要なCredential**: Twitter OAuth2 API
- **キャプション制限**: 280文字

```javascript
// メディアアップロード
POST https://upload.twitter.com/1.1/media/upload.json
FormData: {
  "media_data": "{BASE64_IMAGE}"
}

// ツイート投稿
POST https://api.twitter.com/2/tweets
Body: {
  "text": "{CAPTION_280CHARS}",
  "media": {
    "media_ids": ["{MEDIA_ID}"]
  }
}
```

#### TikTok

- **推奨API**: Upload-Post.com（サードパーティ）
- **理由**: TikTok公式APIは承認プロセスが厳しく時間がかかる
- **料金**: 月額$29〜

```bash
POST https://api.upload-post.com/v1/upload
Headers: {
  "Authorization": "Bearer {API_KEY}"
}
Body: {
  "platform": "tiktok",
  "account": "{TIKTOK_USERNAME}",
  "media": ["{VIDEO_URL}"],
  "caption": "{CAPTION_150CHARS}",
  "auto_add_music": true,
  "privacy_level": "PUBLIC_TO_EVERYONE"
}
```

### 2.3 キャプション最適化

プラットフォームごとにキャプション形式を最適化する必要がある:

| プラットフォーム | 最大文字数 | ハッシュタグ数 |
|-----------------|-----------|---------------|
| Instagram | 2,200 | 最大30個 |
| Facebook | 63,206 | 最大10個推奨 |
| X (Twitter) | 280 | 最大5個推奨 |
| TikTok | 150 | 最大5個推奨 |

**キャプション最適化関数（n8n Codeノード用）**:

```javascript
function optimizeCaptionForPlatform(baseCaption, hashtags, platform) {
  const configs = {
    instagram: { maxLength: 2200, maxTags: 30 },
    facebook: { maxLength: 500, maxTags: 10 },
    twitter: { maxLength: 250, maxTags: 5 },
    tiktok: { maxLength: 130, maxTags: 5 }
  };

  const config = configs[platform];
  const truncatedCaption = baseCaption.substring(0, config.maxLength);
  const truncatedTags = hashtags.slice(0, config.maxTags);

  return truncatedCaption + '\n\n' + truncatedTags.join(' ');
}
```

---

## 3. ワークフロー設計

### 3.1 追加ノード構成

```
Instagram Publish成功
    ↓
Switch (enabled platforms)
    ├─ Facebook enabled → Facebook Post
    ├─ Twitter enabled → Upload Media → Tweet
    └─ TikTok enabled → Upload-Post API
    ↓
Merge Results
    ↓
Update Posts Sheet (fb_id, x_id, tiktok_id)
```

### 3.2 シート変更

**postsシートに追加するカラム**:
- `fb_post_id`: FacebookのポストID
- `x_post_id`: XのツイートID
- `tiktok_post_id`: TikTokのビデオID

---

## 4. 講座構成案

```markdown
## 目次

- [セクション1: クロスポストの概要](#セクション1-クロスポストの概要)
- [セクション2: Facebook投稿の設定](#セクション2-facebook投稿の設定)
- [セクション3: X (Twitter)投稿の設定](#セクション3-x-twitter投稿の設定)
- [セクション4: TikTok投稿の設定（Upload-Post）](#セクション4-tiktok投稿の設定upload-post)
- [セクション5: キャプション最適化](#セクション5-キャプション最適化)
- [セクション6: 動作確認](#セクション6-動作確認)
```

---

## 5. 必要なCredential一覧

| プラットフォーム | Credential種類 | 取得方法 |
|-----------------|---------------|----------|
| Facebook | Facebook Graph API（Instagram共用） | Meta Developer Console |
| X (Twitter) | Twitter OAuth2 API | Twitter Developer Portal |
| TikTok | Upload-Post API Key | upload-post.com |

---

## 6. ユーザーからの調査結果（要点）

- X Developer Accountは承認に1〜3日かかる
- TikTok公式APIは承認プロセスが厳しいためUpload-Post.comを推奨
- Upload-Post.comは月額$29で複数プラットフォーム対応

---

## 7. 実装時の注意事項

1. 各プラットフォームは**オプション**として実装（有効/無効を切り替え可能）
2. 1つのプラットフォームが失敗しても他は継続
3. エラー時はSlack/Telegram通知を送信
4. 投稿IDは必ずシートに記録

---

## 8. 優先度

- **Module 10（ストーリーズ）を先に完成させる**
- Module 11はユーザーが各プラットフォームのAPIキーを準備してから実装
