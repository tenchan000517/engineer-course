# Module 05: 投稿管理シート設計 調査・設計書

**調査日**: 2025-12-04
**状態**: 調査完了・設計案作成

---

## 調査目的

Module 05では、以下の5つの観点から徹底的な調査を行い、様々な用途に対応できるサステナブルなシート設計を導き出す。

1. Instagramカルーセル投稿の自動化
2. Instagramリール投稿の自動化
3. Canva連携
4. リサーチから投稿までの自動化
5. 複数投稿の一括作成

---

## 1. Instagramカルーセル投稿の自動化

### 1.1 APIフロー（3ステップ）

```
Step 1: 各画像のコンテナ作成（繰り返し）
  POST /{ig-user-id}/media
    - image_url: 画像URL（公開サーバー上）
    - is_carousel_item: true  ← 重要
    - access_token
  → container_id を取得

Step 2: カルーセルコンテナ作成
  POST /{ig-user-id}/media
    - media_type: CAROUSEL
    - children: container_id_1,container_id_2,...  ← カンマ区切り
    - caption: キャプション
    - access_token
  → carousel_container_id を取得

Step 3: 公開
  POST /{ig-user-id}/media_publish
    - creation_id: carousel_container_id
    - access_token
```

### 1.2 制限事項

| 項目 | 制限 |
|------|------|
| 最大枚数 | API経由は10枚（アプリネイティブは20枚） |
| 画像形式 | JPEGのみ |
| アスペクト比 | 1:1 〜 4:5 |
| 動画含有時 | カルーセル内動画はリールタブに非表示 |
| children | captionフィールド非対応（親コンテナのみ） |

### 1.3 n8n実装パターン

**推奨構成**（n8nコミュニティで多数実績あり）：

```
[Schedule Trigger]
    ↓
[Google Sheets: Get Rows] ← status=READY のカルーセル投稿を取得
    ↓
[Loop: 各画像処理]
    ↓
[Cloudinary: Upload] ← 公開URL生成
    ↓
[HTTP Request: Create Container] ← is_carousel_item=true
    ↓
[Aggregate: container_ids]
    ↓
[HTTP Request: Create Carousel Container]
    ↓
[HTTP Request: Publish]
    ↓
[Google Sheets: Update Row] ← status=PUBLISHED
```

### 1.4 参考ワークフロー

- [Automate Instagram Carousel Posts with Google Sheets, Drive & Cloudinary](https://n8n.io/workflows/5833-automate-instagram-carousel-posts-with-google-sheets-drive-and-cloudinary/)
- [Create & Publish Instagram Carousel Posts with GPT-4.1-mini, Imgur & Graph API](https://n8n.io/workflows/3693-create-and-publish-instagram-carousel-posts-with-gpt-41-mini-imgur-and-graph-api/)

---

## 2. Instagramリール投稿の自動化

### 2.1 APIフロー（3ステップ + ポーリング）

```
Step 1: リールコンテナ作成
  POST /{ig-user-id}/media
    - media_type: REELS
    - video_url: 動画URL（公開サーバー上、ダイレクトリンク必須）
    - caption: キャプション
    - share_to_feed: true/false（フィードにも表示するか）
    - thumb_offset: サムネイル位置（ms）
    - access_token
  → container_id を取得

Step 2: 処理完了を待機（ポーリング）
  GET /{container_id}?fields=status_code
  → status_code が "FINISHED" になるまで繰り返し
  （通常数秒〜数分）

Step 3: 公開
  POST /{ig-user-id}/media_publish
    - creation_id: container_id
    - access_token
```

### 2.2 動画仕様（2025年最新）

| 項目 | 要件 |
|------|------|
| 長さ | 3秒〜15分（リールタブ対象は90秒まで） |
| アスペクト比 | 9:16（縦型推奨） |
| 解像度 | 最大1920px横幅（1080x1920推奨） |
| コンテナ | MOV / MP4（MPEG-4 Part 14） |
| ビデオコーデック | H264 / HEVC |
| フレームレート | 23-60 FPS |
| ビデオビットレート | VBR、最大25Mbps |
| オーディオコーデック | AAC |
| オーディオサンプルレート | 最大48kHz |
| オーディオチャンネル | モノラル or ステレオ |
| オーディオビットレート | 128kbps |
| ファイルサイズ | 最大300MB |

### 2.3 2025年の重要な変更点

- **video_url要件強化**: ダイレクト公開URLが必須（リダイレクトなし、認証なし）
- **Google Driveリンク不可**: 以前は使えたが2025年初頭に制限強化
- **ファイル名制限**: スペースを含むファイル名はエラー
- **拡張子確認**: .mp4等の既知拡張子がない場合は`isVideo`パラメータ必要

### 2.4 n8n実装パターン

```
[Schedule Trigger]
    ↓
[Google Sheets: Get Rows] ← status=READY, post_type=REELS
    ↓
[Cloudinary: Upload Video] ← 公開URL生成
    ↓
[HTTP Request: Create Reel Container]
    ↓
[Wait: 5秒]
    ↓
[Loop: Status Polling]
  ├─ [HTTP Request: Get Status]
  └─ [IF: status_code != FINISHED] → Wait → Retry
    ↓
[HTTP Request: Publish]
    ↓
[Google Sheets: Update Row]
```

### 2.5 参考ワークフロー

- [Automated Instagram Reels Workflow](https://n8n.io/workflows/5139-automated-instagram-reels-workflow/)
- [Auto-Generate and Post Instagram Reels with Veo3, OpenAI, and Blotato](https://n8n.io/workflows/5910-auto-generate-and-post-instagram-reels-with-veo3-openai-and-blotato/)
- [From Idea to Instagram Reel — Fully Automated with n8n](https://gowtamsingulur.medium.com/from-idea-to-instagram-reel-fully-automated-with-n8n-image-video-music-post-92f69728ab5b)

---

## 3. Canva連携

### 3.1 採用方式: Canvaシート + 一括作成（Bulk Create）

**対象プラン**: Pro / Teams / Education / Nonprofits（デスクトップブラウザのみ）

**概要**: Canva内蔵のスプレッドシート機能（Canvaシート）とデザインテンプレートを連携し、複数デザインを一括生成する。

### 3.2 一括作成のフロー

```
[Canvaシートにデータ入力]
    ↓
[デザインテンプレートを準備]
  - テキスト要素に余白を確保
  - 画像/動画差し込み箇所にフレーム素材を配置
    ↓
[シートでセル範囲を選択]
    ↓
[アクション → 一括作成]
    ↓
[各要素に「データを接続」でフィールド紐づけ]
  - テキスト → テキストフィールド
  - フレーム → 画像/動画フィールド
    ↓
[出力オプション選択]
  - 個別ファイル or 1ファイル複数ページ
    ↓
[デザインを作成]
    ↓
[微調整・ダウンロード]
```

### 3.3 できること

| 機能 | 対応 | 備考 |
|------|-----|------|
| テキスト一括変更 | ○ | 「データを接続」で紐づけ |
| 画像差し替え | ○ | フレーム素材を使用 |
| 動画差し替え | ○ | フレーム素材を使用 |
| AI文章生成 | ○ | 空白セルにAI生成可能 |
| 色のシャッフル | ○ | テンプレートからカラー適用 |
| 一括ダウンロード | ○ | |

### 3.4 Canvaシートの特徴

| 項目 | 内容 |
|------|------|
| 画像挿入 | 素材からクリックでセルに直接挿入可能 |
| AI機能 | 空白セルにキャッチコピー等を自動生成 |
| 最大サイズ | 300行 × 150列 |
| データ形式 | 直接入力 / CSV / XLSX インポート可 |

### 3.5 n8nとの連携（未実証・実装時に検証）

**想定フロー**:

```
[n8n: Google Sheetsでデータ管理]
    ↓
[n8n: CSV/XLSXエクスポート or Canvaシートに直接書き込み]
    ↓
[Canva GUI: 一括作成実行（手動）]
    ↓
[Canva GUI: ダウンロード]
    ↓
[n8n: Cloudinaryにアップロード]
    ↓
[n8n: Instagram投稿]
```

**検証が必要な点**:

1. n8nからCanvaシートへの直接書き込みは可能か（Connect API経由）
2. 一括作成の自動トリガーは可能か
3. 生成されたデザインの自動ダウンロードは可能か

**現時点の結論**: 一括作成自体はCanva GUI内での手動操作が必要。n8nは前後の工程（データ準備・画像アップロード・投稿）を自動化する形で連携。

### 3.6 参考情報

- [Canva一括作成ヘルプ](https://www.canva.com/help/bulk-create/)
- [Canvaシートで一瞬で大量のデザインを作る（YouTube）](https://www.youtube.com/watch?v=...) ※Canva公式クリエイター動画

### 3.7 その他の連携オプション（参考）

| 方式 | 対象プラン | 自動化レベル | 備考 |
|------|-----------|-------------|------|
| Connect API | 全プラン | 部分自動 | OAuth2、n8n HTTPリクエストで呼び出し可 |
| Autofill API | Enterprise限定 | 完全自動 | 30人以上組織のみ |
| Blotato/ContentDrips | 各種 | 完全自動 | 代替サービス、n8n対応 |

---

## 4. リサーチから投稿までの自動化

### 4.1 一般的なフロー

```
[リサーチ・アイデア生成]
    ↓
[コンテンツ生成（AI）]
    ↓
[画像/動画生成]
    ↓
[レビュー・承認（オプション）]
    ↓
[投稿]
    ↓
[結果記録]
```

### 4.2 各ステップの選択肢

#### リサーチ・アイデア生成

| ツール | 用途 | n8n対応 |
|-------|------|---------|
| Google Trends | トレンドキーワード取得 | ○ |
| Perplexity AI | トピックリサーチ | ○ |
| Apify | 競合Instagram分析 | ○ |
| RSS/Webhooks | ニュース・更新監視 | ○ |

#### コンテンツ生成（AI）

| サービス | 用途 | n8n対応 |
|---------|------|---------|
| OpenAI GPT-4/4o | キャプション・スクリプト生成 | ○（公式ノード） |
| Claude | 長文・戦略的コンテンツ | ○（HTTPリクエスト） |
| Google Gemini | 画像理解・マルチモーダル | ○（公式ノード） |

#### 画像/動画生成

| サービス | 用途 | n8n対応 |
|---------|------|---------|
| DALL-E 3 | AI画像生成 | ○ |
| Replicate | Stable Diffusion等 | ○ |
| Blotato | テンプレート画像生成 | ○ |
| Veo 3 | AI動画生成（リール用） | ○ |
| Heygen | AIアバター動画 | ○ |

### 4.3 参考ワークフロー

- [AI-Powered Multi-Social Media Post Automation: Google Trends & Perplexity AI](https://n8n.io/workflows/4352-ai-powered-multi-social-media-post-automation-google-trends-and-perplexity-ai/)
- [Automate Multi-Platform Social Media Content Creation with AI](https://n8n.io/workflows/3066-automate-multi-platform-social-media-content-creation-with-ai/)
- [Automated Social Media Content Publishing Factory + System Prompt Composition](https://n8n.io/workflows/3135-automated-social-media-content-publishing-factory-system-prompt-composition/)

---

## 5. 複数投稿の一括作成（バッチ処理）

### 5.1 スケジュール実行パターン

| パターン | 用途 | n8n実装 |
|---------|------|---------|
| 定期実行 | 毎日9時に1投稿 | Schedule Trigger（Cron） |
| キュー処理 | status=READY を順次処理 | Schedule + Filter |
| Webhook | 外部トリガー（Zapier等）から起動 | Webhook Trigger |
| 手動一括 | 複数投稿を一度に処理 | Manual Trigger + Loop |

### 5.2 API制限への対応

| 制限 | 値 | 対策 |
|------|-----|------|
| 投稿数/24時間 | 50投稿 | カウンター管理、分散投稿 |
| カルーセル | 1投稿としてカウント | 複数画像は1カルーセルに |
| レート制限 | 200コール/時間 | 適切なWait挿入 |

### 5.3 ベストプラクティス

1. **バッファ時間**: 投稿間に10-15分のバッファ
2. **時間分散**: 1日の投稿を複数時間帯に分散
3. **エラーハンドリング**: 失敗時はstatus=FAILEDに更新、リトライロジック
4. **通知**: Slack/メール等でエラー通知
5. **ログ記録**: 全API呼び出しの結果をシートに記録

### 5.4 参考ワークフロー

- [Automated AI Content Creation & Instagram Publishing from Google Sheets](https://n8n.io/workflows/3840-automated-ai-content-creation-and-instagram-publishing-from-google-sheets/)
- [Schedule & Publish All Instagram Content Types with Facebook Graph API](https://n8n.io/workflows/4498-schedule-and-publish-all-instagram-content-types-with-facebook-graph-api/)

---

## 6. 画像ホスティング

### 6.1 Instagram APIの要件

Instagram Graph APIは、画像/動画の公開URLを要求する。以下の条件を満たす必要がある：

- **公開アクセス可能**: 認証なしでアクセス可能
- **ダイレクトリンク**: リダイレクトなし
- **HTTPS**: セキュア接続必須
- **適切なContent-Type**: image/jpeg等

### 6.2 ホスティングオプション

| サービス | 特徴 | n8n対応 | 無料枠 |
|---------|------|---------|--------|
| **Cloudinary** | n8n公式ノード、変換機能 | ○ | 25GB帯域/月 |
| Imgur | シンプル、匿名アップロード | ○ | 制限あり |
| AWS S3 | 高信頼性、従量課金 | ○ | 12ヶ月無料枠 |
| Google Cloud Storage | 高信頼性 | ○ | 5GB無料 |
| Supabase Storage | シンプル、無料枠大 | ○ | 1GB無料 |

### 6.3 Cloudinary推奨理由

1. **n8n公式ノード**: 設定が簡単
2. **変換機能**: リサイズ、フォーマット変換がURL指定で可能
3. **信頼性**: CDN配信、高可用性
4. **無料枠**: 月25GBの帯域、十分な容量

---

## 7. シート設計（最終版）

### 7.1 設計方針

以下の全ユースケースに対応できる柔軟な構造を採用：

- 単一画像投稿
- カルーセル投稿（複数画像）
- リール動画投稿
- 画像ソースの多様性（URL直接/Cloudinary/Canva/AI生成）
- スケジュール投稿
- AI連携（キャプション/画像生成）
- ステータス管理・エラーハンドリング

### 7.2 シート構成

#### メインシート: `posts`（投稿管理）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| post_id | TEXT | 一意の投稿ID | POST-001 |
| post_type | TEXT | `IMAGE` / `CAROUSEL` / `REELS` | CAROUSEL |
| status | TEXT | `DRAFT` / `READY` / `PROCESSING` / `PUBLISHED` / `FAILED` | READY |
| caption | TEXT | キャプション本文 | 今日のおすすめ3選 |
| hashtags | TEXT | ハッシュタグ（カンマ区切り） | #n8n,#automation |
| media_ids | TEXT | 参照するメディアID（カンマ区切り） | MEDIA-001,MEDIA-002 |
| scheduled_at | DATETIME | 投稿予定日時（空欄は次回実行時） | 2025-12-05 09:00 |
| published_at | DATETIME | 実際の投稿日時 | |
| ig_post_id | TEXT | Instagram投稿ID（投稿後に記録） | |
| share_to_feed | BOOLEAN | リールをフィードにも表示（REELS用） | TRUE |
| thumb_offset_ms | NUMBER | サムネイル位置（REELS用、ミリ秒） | 3000 |
| error_message | TEXT | エラー時のメッセージ | |
| retry_count | NUMBER | リトライ回数 | 0 |
| created_at | DATETIME | レコード作成日時 | |
| updated_at | DATETIME | レコード更新日時 | |
| notes | TEXT | メモ・備考 | |

#### サブシート: `media`（メディア管理）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| media_id | TEXT | 一意のメディアID | MEDIA-001 |
| media_type | TEXT | `IMAGE` / `VIDEO` | IMAGE |
| source | TEXT | `URL` / `CLOUDINARY` / `CANVA` / `AI_GENERATED` / `DRIVE` | CLOUDINARY |
| original_url | TEXT | 元のURL/パス（Drive ID等） | |
| public_url | TEXT | 公開URL（Instagram投稿用） | https://res.cloudinary.com/... |
| cloudinary_id | TEXT | Cloudinary Public ID | folder/image001 |
| canva_design_id | TEXT | CanvaデザインID | |
| filename | TEXT | ファイル名 | post-image-001.jpg |
| width | NUMBER | 幅（px） | 1080 |
| height | NUMBER | 高さ（px） | 1350 |
| duration_sec | NUMBER | 動画の長さ（秒、動画のみ） | 30 |
| file_size_mb | NUMBER | ファイルサイズ（MB） | 2.5 |
| status | TEXT | `PENDING` / `UPLOADING` / `READY` / `ERROR` | READY |
| ig_container_id | TEXT | Instagram Container ID（投稿処理中） | |
| error_message | TEXT | エラー時のメッセージ | |
| created_at | DATETIME | レコード作成日時 | |

#### オプションシート: `templates`（テンプレート管理）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| template_id | TEXT | 一意のテンプレートID | TMPL-001 |
| template_name | TEXT | テンプレート名 | 商品紹介カルーセル |
| service | TEXT | `CANVA` / `BLOTATO` / `CONTENTDRIPS` | CANVA |
| external_id | TEXT | 外部サービスのテンプレートID | |
| post_type | TEXT | 対応する投稿タイプ | CAROUSEL |
| slide_count | NUMBER | スライド枚数 | 5 |
| variables | TEXT | 変数一覧（JSON） | {"title":"","price":""} |
| description | TEXT | 説明 | |

#### オプションシート: `content_ideas`（コンテンツアイデア管理）

| 列名 | 型 | 説明 | 例 |
|------|-----|------|-----|
| idea_id | TEXT | 一意のアイデアID | IDEA-001 |
| topic | TEXT | トピック/テーマ | 冬のコーディネート |
| source | TEXT | `MANUAL` / `TREND` / `COMPETITOR` / `AI` | TREND |
| source_url | TEXT | 参照元URL | |
| status | TEXT | `NEW` / `APPROVED` / `REJECTED` / `USED` | NEW |
| target_post_type | TEXT | 想定する投稿タイプ | CAROUSEL |
| notes | TEXT | メモ | |
| created_at | DATETIME | 作成日時 | |

### 7.3 シート間の関係

```
content_ideas (1) → posts (多)
    アイデアから複数の投稿を生成可能

posts.media_ids → media.media_id (1対多)
    1投稿に複数メディア（カルーセル用）

templates → posts
    テンプレートから投稿生成（将来的）
```

### 7.4 ステータスフロー

#### posts.status

```
[DRAFT] → [READY] → [PROCESSING] → [PUBLISHED]
              ↓           ↓
           (手動変更)   [FAILED] → (リトライ) → [READY]
```

| ステータス | 説明 | 次のアクション |
|------------|------|---------------|
| DRAFT | 下書き（編集中） | 完成後にREADYに変更 |
| READY | 投稿準備完了 | n8nが自動で取得・投稿 |
| PROCESSING | 投稿処理中 | 完了を待つ |
| PUBLISHED | 投稿完了 | ig_post_id記録済み |
| FAILED | 投稿失敗 | error_message確認、修正後READY |

#### media.status

```
[PENDING] → [UPLOADING] → [READY]
                 ↓
              [ERROR]
```

### 7.5 ワークフロー連携イメージ

#### 基本投稿ワークフロー

```
[Schedule Trigger: 毎時]
    ↓
[Google Sheets: Get Rows]
  - Filter: status = READY
  - Filter: scheduled_at <= NOW() OR scheduled_at = ""
  - Sort: scheduled_at ASC
  - Limit: 1
    ↓
[Google Sheets: Update Row] → status = PROCESSING
    ↓
[Switch: post_type]
    ↓
┌─────────────┬─────────────┬─────────────┐
↓             ↓             ↓
IMAGE      CAROUSEL       REELS
↓             ↓             ↓
[Single     [Loop:        [Upload Video]
 Image       Images]           ↓
 Post]           ↓        [Wait for
    ↓        [Upload to    Processing]
    ↓         Cloudinary]      ↓
    ↓             ↓        [Publish Reel]
    ↓        [Create
    ↓         Container]
    ↓             ↓
    ↓        [Create
    ↓         Carousel]
    ↓             ↓
    └─────────────┴─────────────┘
                  ↓
          [Instagram Publish]
                  ↓
          [Google Sheets: Update Row]
            - status = PUBLISHED
            - ig_post_id = result.id
            - published_at = NOW()
```

#### AI連携ワークフロー

```
[Manual Trigger / Webhook]
    ↓
[Google Sheets: Get content_ideas] ← status = APPROVED
    ↓
[OpenAI: Generate Caption]
    ↓
[OpenAI: Generate Image Prompt]
    ↓
[DALL-E / Replicate: Generate Image]
    ↓
[Cloudinary: Upload]
    ↓
[Google Sheets: Append media row]
    ↓
[Google Sheets: Append posts row] ← status = DRAFT or READY
```

---

## 8. 未確定事項・次回確認事項

### 実践時に決定

1. **Canva連携の範囲**
   - Enterpriseプランの利用可否
   - 利用不可の場合、Blotato等の代替採用

2. **画像ホスティング**
   - Cloudinaryを第一候補とする
   - 無料枠で十分か、有料プラン必要か

3. **AI連携**
   - OpenAI / Claude / Gemini の選択
   - 画像生成サービスの選択

4. **スケジュール投稿**
   - 投稿頻度（1日1回？複数回？）
   - 投稿時間帯

5. **承認フロー**
   - DRAFT→READYの手動承認は必要か
   - 自動投稿か半自動か

---

## 9. 参考資料

### 公式ドキュメント

- [Instagram Content Publishing API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing)
- [Canva Connect API Documentation](https://www.canva.dev/docs/connect/)
- [Canva Autofill Guide](https://www.canva.dev/docs/connect/autofill-guide/)
- [Cloudinary n8n Integration](https://cloudinary.com/documentation/n8n_integration)

### n8nワークフロー

- [n8n Social Media Workflows (414+)](https://n8n.io/workflows/categories/social-media/)
- [Instagram Carousel with Google Sheets & Cloudinary](https://n8n.io/workflows/5833-automate-instagram-carousel-posts-with-google-sheets-drive-and-cloudinary/)
- [Instagram Reels Automation](https://n8n.io/workflows/5139-automated-instagram-reels-workflow/)
- [AI-Powered Multi-Social Media Post Automation](https://n8n.io/workflows/4352-ai-powered-multi-social-media-post-automation-google-trends-and-perplexity-ai/)

### 記事・ガイド

- [Canva & n8n Integration Guide](https://www.shantilink.com/canva-n8n-integration.html)
- [A Complete Guide To the Instagram Reels API](https://www.getphyllo.com/post/a-complete-guide-to-the-instagram-reels-api)
- [How to Use n8n to Plan, Create, and Schedule Instagram Posts](https://www.stgnx.com/post/how-to-use-n8n-to-plan-create-and-schedule-instagram-posts-automatically)

---

**最終更新**: 2025-12-04
