# Module 04: Google Sheets連携 調査・設計書

**調査日**: 2025-12-04
**状態**: 調査完了・設計案作成

---

## 調査目的

Module 04の講座作成に向けて、以下を調査・設計する：

1. n8nとGoogle Sheetsの連携方法（認証・読み書き・更新）
2. 将来的な拡張（複数投稿、リール、Canva連携等）を見据えたシート設計

---

## 1. n8n × Google Sheets 連携

### 1.1 利用可能な操作

| 操作 | 説明 |
|------|------|
| Get Row(s) | 行データの読み込み |
| Append Row | 新規行の追加 |
| Update Row | 既存行の更新 |
| Append or Update Row | 存在すれば更新、なければ追加 |
| Delete Rows or Columns | 行・列の削除 |
| Create/Delete/Clear Sheet | シート管理 |

### 1.2 認証設定

**方式**: Google OAuth2

**設定手順**:
1. Google Cloud Consoleでプロジェクト作成
2. Google Sheets APIを有効化
3. OAuth同意画面を設定
4. OAuth 2.0クライアントIDを作成
5. n8nでGoogle Sheets Credentialを作成し、Client ID/Secretを入力
6. 認証フローを完了

**注意点**:
- 「Google hasn't verified this app」警告は開発中は正常
- スコープはGoogle Sheets API（読み書き）を含める

### 1.3 参考資料

- [n8n Google Sheets Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [n8n Google OAuth設定](https://docs.n8n.io/integrations/builtin/credentials/google/oauth-single-service/)

---

## 2. Instagram投稿タイプ別API仕様

### 2.1 単一画像投稿（Module 03で実装済み）

```
Step 1: POST /{ig-user-id}/media
  - image_url: 画像URL（公開サーバー上、JPEG）
  - caption: キャプション
  - access_token

Step 2: POST /{ig-user-id}/media_publish
  - creation_id: Step 1で取得したID
  - access_token
```

### 2.2 カルーセル投稿（複数画像）

**概要**: 最大10枚の画像/動画を1投稿にまとめる

**APIフロー**:
```
Step 1: 各画像のコンテナ作成（繰り返し）
  POST /{ig-user-id}/media
    - image_url: 画像URL
    - is_carousel_item: true
    - access_token
  → container_id を取得

Step 2: カルーセルコンテナ作成
  POST /{ig-user-id}/media
    - media_type: CAROUSEL
    - children: [container_id_1, container_id_2, ...]
    - caption: キャプション
    - access_token
  → carousel_container_id を取得

Step 3: 公開
  POST /{ig-user-id}/media_publish
    - creation_id: carousel_container_id
    - access_token
```

**制限事項**:
- API経由は最大10枚（アプリネイティブは20枚）
- カルーセル内の動画はリールタブに表示されない
- 画像はJPEG形式のみ

### 2.3 リール動画投稿

**概要**: 縦型ショート動画をリールタブに投稿

**APIフロー**:
```
Step 1: リールコンテナ作成
  POST /{ig-user-id}/media
    - media_type: REELS
    - video_url: 動画URL
    - caption: キャプション
    - share_to_feed: true/false（フィードにも表示するか）
    - thumb_offset: サムネイル位置（ms）
    - access_token
  → container_id を取得

Step 2: 処理完了を待機
  GET /{container_id}?fields=status_code
  → status_code が "FINISHED" になるまでポーリング

Step 3: 公開
  POST /{ig-user-id}/media_publish
    - creation_id: container_id
    - access_token
```

**動画仕様**:
| 項目 | 要件 |
|------|------|
| 長さ | 5-90秒（リールタブ対象） |
| アスペクト比 | 9:16（推奨） |
| フォーマット | MOV / MP4 |
| コーデック | H264 / HEVC |
| フレームレート | 23-60 FPS |
| オーディオ | AAC, 48kHz以下 |

**制限事項**:
- 動画処理に時間がかかる（ステータス確認必須）
- 一部アカウントは60秒制限あり

### 2.4 共通制限

| 項目 | 制限 |
|------|------|
| 投稿数 | 24時間で25投稿まで |
| 画像形式 | JPEGのみ |
| 画像URL | 公開サーバー上に配置必須 |
| カルーセル | 1投稿としてカウント |

### 2.5 参考資料

- [Instagram Content Publishing API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing)
- [n8n Instagram Carousel Workflow](https://n8n.io/workflows/3693-create-and-publish-instagram-carousel-posts-with-gpt-41-mini-imgur-and-graph-api/)
- [Phyllo - Instagram Reels API Guide](https://www.getphyllo.com/post/a-complete-guide-to-the-instagram-reels-api)
- [Ayrshare - Instagram Reels API](https://www.ayrshare.com/instagram-reels-api-how-to-post-videos-to-reels-using-a-social-media-api/)

---

## 3. Canva連携

### 3.1 連携方式の比較

| 方式 | 対象プラン | 自動化 | 用途 |
|------|-----------|--------|------|
| Bulk Create（GUI） | Pro/Teams | 手動 | CSV/XLSXからテンプレート一括生成 |
| Google Sheets連携 | 全プラン | 部分的 | グラフ作成、データ更新反映 |
| Autofill API | **Enterprise限定** | 完全自動 | プログラム的テンプレート自動入力 |
| Connect API | 要確認 | 完全自動 | デザイン作成・エクスポート |

### 3.2 Bulk Create（一括作成）機能

**概要**: テンプレート × データで複数デザインを一括生成

**対応プラン**: Canva Pro / Teams

**データソース**:
- CSV（UTF-8）
- XLSX
- TSV
- Canva Sheets（2025年新機能）

**制限**:
- 最大300行 × 150列
- Webブラウザ版のみ対応（アプリ不可）
- 画像はフレーム素材を使用

**活用例**:
- SNS投稿画像の大量生成
- 商品紹介テンプレートの量産
- YouTubeサムネイルの一括作成

### 3.3 Canva Connect API

**概要**: 外部アプリケーションからCanvaを操作するREST API

**主要機能**:
- アセットアップロード
- デザイン作成
- テンプレートAutofill
- デザインエクスポート（非同期）

**認証**: OAuth2 with PKCE

**n8n連携**:
- HTTP Requestノードで呼び出し
- OAuth2 Credentialで認証設定

**エクスポート**:
- 非同期ジョブ（完了をポーリング）
- ダウンロードURL有効期限: 24時間

### 3.4 Autofill API（Enterprise限定）

**対象**: Canva Enterprise（30人以上組織）

**機能**: ブランドテンプレートにデータを自動入力してデザイン生成

**一般ユーザーの代替案**:
1. Bulk Create（GUI）で手動一括生成
2. Connect APIでデザイン作成・エクスポート
3. Zapier/Make経由での連携

### 3.5 参考資料

- [Canva Bulk Create Help](https://www.canva.com/help/bulk-create/)
- [Canva Connect API Docs](https://www.canva.dev/docs/connect/)
- [Canva Autofill Guide](https://www.canva.dev/docs/connect/autofill-guide/)
- [n8n Canva Integration Guide](https://www.shantilink.com/canva-n8n-integration.html)
- [Canva Japan - Bulk Create](https://note.com/canvajapan/n/n7904867a2393)

---

## 4. シート設計

### 4.1 設計方針

**目的**: 様々な投稿フローに柔軟に対応できる構造

**対応すべきユースケース**:
- 単一画像投稿
- カルーセル投稿（複数画像）
- リール動画投稿
- Canva連携（画像生成・エクスポート）
- 投稿ステータス管理
- 将来的な拡張（AI生成、スケジュール投稿等）

### 4.2 シート構成案

#### メインシート: `posts`（投稿管理）

| 列名 | 型 | 説明 |
|------|-----|------|
| post_id | TEXT | 一意の投稿ID（例: POST-001） |
| post_type | TEXT | `IMAGE` / `CAROUSEL` / `REELS` |
| status | TEXT | `DRAFT` / `READY` / `PROCESSING` / `PUBLISHED` / `FAILED` |
| caption | TEXT | キャプション |
| hashtags | TEXT | ハッシュタグ（カンマ区切り） |
| media_ids | TEXT | 参照するメディアID（カンマ区切り） |
| scheduled_at | DATETIME | 投稿予定日時（空欄は即時） |
| published_at | DATETIME | 実際の投稿日時 |
| ig_post_id | TEXT | Instagram投稿ID（投稿後に記録） |
| error_message | TEXT | エラー時のメッセージ |
| created_at | DATETIME | レコード作成日時 |
| updated_at | DATETIME | レコード更新日時 |

#### サブシート: `media`（メディア管理）

| 列名 | 型 | 説明 |
|------|-----|------|
| media_id | TEXT | 一意のメディアID（例: MEDIA-001） |
| media_type | TEXT | `IMAGE` / `VIDEO` |
| source | TEXT | `URL` / `CANVA` / `UPLOAD` |
| url | TEXT | 画像/動画のURL |
| canva_design_id | TEXT | Canvaデザイン ID（Canva連携時） |
| filename | TEXT | ファイル名（参考用） |
| width | NUMBER | 幅（px） |
| height | NUMBER | 高さ（px） |
| duration | NUMBER | 動画の長さ（秒、動画のみ） |
| status | TEXT | `PENDING` / `READY` / `ERROR` |
| created_at | DATETIME | レコード作成日時 |

#### サブシート: `templates`（Canvaテンプレート管理）※オプション

| 列名 | 型 | 説明 |
|------|-----|------|
| template_id | TEXT | 一意のテンプレートID |
| template_name | TEXT | テンプレート名 |
| canva_template_id | TEXT | CanvaテンプレートID |
| post_type | TEXT | 対応する投稿タイプ |
| description | TEXT | 説明 |

### 4.3 シート間の関係

```
posts.media_ids → media.media_id（1対多）
media.canva_design_id → Canvaデザイン（外部参照）
```

**例**: カルーセル投稿の場合
```
posts:
  post_id: POST-001
  post_type: CAROUSEL
  media_ids: MEDIA-001,MEDIA-002,MEDIA-003
  caption: "今日のおすすめ3選"

media:
  MEDIA-001: { url: "https://...", source: "CANVA" }
  MEDIA-002: { url: "https://...", source: "CANVA" }
  MEDIA-003: { url: "https://...", source: "URL" }
```

### 4.4 ステータスフロー

```
[DRAFT] → [READY] → [PROCESSING] → [PUBLISHED]
                          ↓
                       [FAILED]
```

| ステータス | 説明 |
|------------|------|
| DRAFT | 下書き（編集中） |
| READY | 投稿準備完了 |
| PROCESSING | 投稿処理中 |
| PUBLISHED | 投稿完了 |
| FAILED | 投稿失敗（error_messageに詳細） |

### 4.5 n8nワークフローとの連携イメージ

```
[Schedule/Manual Trigger]
       ↓
[Google Sheets: Get Rows] ← status=READY のレコードを取得
       ↓
[Switch: post_type判定]
       ↓
  ┌────┼────┐
  ↓    ↓    ↓
IMAGE CAROUSEL REELS
  ↓    ↓    ↓
[Instagram投稿処理]
       ↓
[Google Sheets: Update Row] → status, ig_post_id, published_at を更新
```

---

## 5. 実践ステップ（Module 04 講座用）

### Phase 1: Google Sheets認証設定
1. [ ] Google Cloud Consoleでプロジェクト作成
2. [ ] Google Sheets APIを有効化
3. [ ] OAuth同意画面を設定
4. [ ] OAuth 2.0クライアントIDを作成
5. [ ] n8nでCredentialを作成・認証

### Phase 2: 基本操作の確認
1. [ ] テスト用スプレッドシートを作成
2. [ ] Get Rows: データ読み込みテスト
3. [ ] Append Row: データ追加テスト
4. [ ] Update Row: データ更新テスト

### Phase 3: 投稿管理シートの構築
1. [ ] postsシートを作成
2. [ ] mediaシートを作成
3. [ ] サンプルデータを投入
4. [ ] n8nから読み書きできることを確認

---

## 6. 未確定事項

以下は実践時に確認・決定する：

1. **Canva連携の範囲**:
   - Bulk Create（手動）のみか、Connect API連携も行うか
   - Enterpriseプランの利用可否

2. **画像ホスティング**:
   - Canvaエクスポート後の画像配置先
   - Imgur、Cloudinary、自前サーバー等の選択

3. **スケジュール投稿**:
   - n8nのSchedule Triggerで実装するか
   - 投稿間隔の制御方法

4. **エラーハンドリング**:
   - リトライ処理の実装有無
   - 通知方法（Slack、メール等）

---

**最終更新**: 2025-12-04
