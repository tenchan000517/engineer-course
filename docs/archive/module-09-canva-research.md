# Module 09 調査結果: Canva連携とn8n自動化

**調査日**: 2025-12-06

**目的**: n8nからCanvaを自動化できるか調査し、実現可能なフローを設計する

---

## 調査結論（サマリー）

### Canva API自動化は「Enterprise契約必須」

**結論: n8nのHTTPリクエストでCanvaを完全自動化することは、個人利用では不可能**

| 機能 | API対応 | 必要プラン |
|------|---------|-----------|
| Design Autofill（テンプレート自動入力） | あり | **Enterprise必須** |
| Brand Template操作 | あり | **Enterprise必須** |
| Design作成（空白から） | あり | 全プラン（制限あり） |
| Bulk Create（一括作成） | **なし** | Pro以上（GUI手動のみ） |

**重要**: Canva Autofill APIはEnterprise契約（30人以上の組織向け、価格非公開）が必須。個人・小規模チームでは利用不可。

---

## 採用フロー

### 推奨案: 半自動フロー（n8n + 手動Canva + n8n）

```
[n8n] postsシートからデータ取得
    ↓
[n8n] CSV生成 → Google Driveに保存
    ↓
[手動] Google DriveからCSVダウンロード
    ↓
[手動] Canvaで一括作成（Bulk Create）実行
    ↓
[手動] 生成画像をダウンロード
    ↓
[手動] 所定のGoogle Driveフォルダにアップロード
    ↓
[n8n] DriveからURL取得 → Instagramに投稿
```

**メリット**:
- 追加コストなし（Canva Proのみ）
- デザインの自由度が高い
- 実装が比較的シンプル

**デメリット**:
- 手動作業が4ステップある
- 画像のアップロード・ダウンロードが手間

---

## 調査詳細

### 1. Canva Connect API

**公式ドキュメント**: https://www.canva.dev/docs/connect/

#### 利用可能なエンドポイント

| エンドポイント | 機能 | 必要プラン |
|--------------|------|-----------|
| `POST /designs` | 空白デザイン作成 | 全プラン |
| `GET /brand-templates/{id}/dataset` | テンプレートのフィールド取得 | Enterprise |
| `POST /autofills` | テンプレートにデータ入力 | Enterprise |
| `GET /autofills/{job-id}` | Autofillジョブのステータス確認 | Enterprise |

#### 認証方法

- OAuth 2.0 with PKCE
- `Authorization: Bearer {token}` ヘッダー必須
- スコープ: `design:content:write` など

#### 制限事項

- Design作成: ユーザーあたり毎分20リクエスト
- 空白デザインは編集されないと7日で自動削除
- 編集用・表示用URLは30日間有効

#### Enterprise要件の詳細

> "To use the Autofill APIs, your integration must act on behalf of a user that's a member of a Canva Enterprise organization."

- 開発者はDeveloper Portalからテスト用アクセスをリクエスト可能
- ただし、エンドユーザーはEnterprise契約が必須
- Enterprise: 30人以上の組織向け、価格非公開（要営業連絡）

**参考資料**:
- [Canva Connect APIs](https://www.canva.dev/docs/connect/)
- [Autofill Guide](https://www.canva.dev/docs/connect/autofill-guide/)
- [Create Design API](https://www.canva.dev/docs/connect/api-reference/designs/create-design/)

---

### 2. Canva Bulk Create（一括作成）機能

**公式ヘルプ**: https://www.canva.com/help/bulk-create/

#### 仕様

| 項目 | 内容 |
|------|------|
| 対応プラン | Canva Pro以上 |
| 入力形式 | CSV, XLSX, TSV |
| ファイルサイズ上限 | 25MB |
| 画像の扱い | **外部URL不可**、Canvaにアップロード必須 |

#### 重要な制限

**画像URLは使用不可**:
> "Image URLs such as those from cloud photo storage are not supported when bulk creating designs. To use images, you must first upload them directly to Canva."

つまり、CSVに画像URLを入れても自動で読み込まれない。画像を使う場合は：
1. 事前にCanvaにアップロード
2. Canvaのメディアライブラリから選択

#### 一括作成の手順

1. テンプレートを開く
2. Apps → Bulk Create を選択
3. CSVをアップロード
4. 各列をデザイン要素に紐づけ（Connect Data）
5. 「Generate designs」をクリック
6. 全デザインを一括ダウンロード

**参考資料**:
- [Create designs in bulk](https://www.canva.com/help/bulk-create/)
- [Canva Tips for CSV](https://createstimulate.com/blogs/news/canva-tips-for-uploading-csv-files-using-bulk-create)

---

### 3. n8nとCanva連携の既存事例

#### 技術的には可能（Enterprise限定）

n8n CommunityやShantiLink等で、OAuth2 with PKCEを使ったCanva API連携の事例が報告されている。

**設定手順**:
1. Canva Developer Portalでアプリ作成
2. OAuth2 with PKCEを設定
3. n8nでHTTP Requestノード + OAuth2認証
4. Autofill APIを呼び出し

**ただし**、これはEnterprise契約がある場合のみ動作する。

**参考資料**:
- [n8n Community: Workflow/connection with canva.com](https://community.n8n.io/t/workflow-connection-with-canva-com/72151)

---

### 4. 代替ツール: Creatomate

**公式サイト**: https://creatomate.com/

#### 概要

- 動画・画像生成API
- n8nとの連携が豊富（公式テンプレート多数）
- Enterprise不要で個人利用可能

#### 料金プラン

| プラン | 月額 | クレジット | 生成可能数 |
|--------|------|-----------|-----------|
| Free Trial | $0 | 50 | 約10動画 or 50画像 |
| Essential | $41 | 2,000 | 約200動画 or 2,000画像 |
| Growth | $99 | 10,000 | 約1,000動画 or 10,000画像 |
| Beyond | $249 | 50,000 | 約5,000動画 or 50,000画像 |

**クレジット計算**:
- 画像1枚 = 1クレジット
- 動画1分（720p/25fps）= 約14クレジット

#### n8nとの連携

```
[Manual Trigger]
    ↓
[Set] テンプレートIDとデータを設定
    ↓
[HTTP Request] POST https://api.creatomate.com/v1/renders
    ↓
[Wait] レンダリング完了を待機
    ↓
[HTTP Request] GET https://api.creatomate.com/v1/renders/{id}
    ↓
[Google Drive] 生成動画をアップロード
```

**参考資料**:
- [Creatomate: How to Automate Video Creation with n8n](https://creatomate.com/blog/how-to-automate-video-creation-with-n8n)
- [n8n Templates: Creatomate](https://n8n.io/workflows/?q=creatomate)
- [Creatomate Pricing](https://creatomate.com/pricing)

---

### 5. n8nでのCSV生成 → Google Drive保存

#### 使用ノード

1. **Convert to File** ノード
   - JSONデータをCSV形式に変換
   - バイナリデータとして出力

2. **Google Drive** ノード
   - Operation: Upload
   - Input Data Field Name: `data`（バイナリプロパティ名）
   - File Name: 任意
   - Parent Folder: フォルダID指定

#### 実装例

```
[Google Sheets: Get Rows] ← postsシートからDRAFT取得
    ↓
[Code] content_jsonをCSV形式に整形
    ↓
[Convert to File] JSONをCSVに変換
    ↓
[Google Drive: Upload] 指定フォルダに保存
```

**参考資料**:
- [Google Drive File operations](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/file-operations/)
- [Convert to File](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.converttofile/)
- [Binary data](https://docs.n8n.io/data/binary-data/)

---

## 実装方針の比較

### 案A: 半自動（推奨・低コスト）

```
n8n → CSV → Drive → [手動Canva] → Drive → n8n → Instagram
```

| 項目 | 内容 |
|------|------|
| 追加コスト | なし |
| 手動作業 | CSV取得、Canva操作、画像アップロード |
| 実装難易度 | 低 |
| デザイン自由度 | 高 |

### 案B: Creatomate全自動（追加コストあり）

```
n8n → Creatomate API → Drive → n8n → Instagram
```

| 項目 | 内容 |
|------|------|
| 追加コスト | $41〜/月 |
| 手動作業 | なし |
| 実装難易度 | 中 |
| デザイン自由度 | 中（Creatomateエディタ依存） |

### 案C: ハイブリッド（Canva + Creatomate）

```
Canva（背景テンプレート作成）→ 画像Export
    ↓
n8n → Creatomate（文字入れ・動画化）→ Instagram
```

| 項目 | 内容 |
|------|------|
| 追加コスト | $41〜/月 |
| 手動作業 | Canvaでベーステンプレート作成のみ |
| 実装難易度 | 高 |
| デザイン自由度 | 最高（Canva + Creatomate） |

---

## 次のアクション

### Module 09で実装すべき内容

**案Aを採用する場合**:

1. postsシートからDRAFTデータを取得
2. content_jsonをCSV形式に変換するCodeノード作成
3. Convert to FileでCSVバイナリ化
4. Google DriveにCSVアップロード
5. 手動フローのドキュメント作成（Canva操作手順）
6. Google Drive → Instagram投稿ワークフロー作成

**案Bを採用する場合**:

1. Creatomateアカウント作成
2. テンプレート作成
3. n8n → Creatomate連携ワークフロー構築
4. 生成動画のDrive保存
5. Drive → Instagram投稿

---

## まとめ

| 方式 | Canva API (Autofill) | Canva Bulk Create | Creatomate |
|------|---------------------|-------------------|------------|
| 自動化 | 完全自動 | **手動のみ** | 完全自動 |
| 必要プラン | Enterprise | Pro | Essential〜 |
| 月額コスト | 非公開（高額） | $15 | $41〜 |
| n8n連携 | HTTP Request | 不可 | HTTP Request |
| 個人利用 | **不可** | 可 | 可 |

**結論**:
- Canva APIでの完全自動化は**Enterprise契約必須**のため個人利用では不可能
- Canva Bulk Createは**APIが存在しない**ため手動操作が必須
- 完全自動化が必要な場合は**Creatomate**が現実的な選択肢
- コストを抑えたい場合は**半自動フロー（案A）**を推奨

---

**最終更新**: 2025-12-06
