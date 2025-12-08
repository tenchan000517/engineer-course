# Module 10: Google DriveからInstagramリール投稿 - 引き継ぎ資料

**作成日**: 2025-12-08
**状態**: ワークフロー基本動作確認済み、最適化が必要

---

## 概要

Google Driveに保存した動画（Canvaで一括生成）をInstagramリールとして投稿するワークフロー。

---

## 現状

### 完了した内容

1. **Cloudinary経由のアップロードに変更**
   - Google DriveのURLは直接Instagram APIに渡せない（2025年1月からMeta側が制限）
   - 解決策: Google Drive → Cloudinary → Instagram API

2. **Cloudinary設定**
   - Cloud name: `doaf4wodr`
   - Upload preset: `instagram_reel`（Unsigned）
   - 無料プラン（月25クレジット）

3. **基本的な投稿フローは動作確認済み**
   - 1件の投稿は成功している

---

## 現在の問題点

### 問題1: 動画ファイルが存在しないDRAFTがあるとエラーで停止

**状況**:
- postsシートに51件のDRAFTがある
- Get DRAFT Postで最初の1件を取得
- その投稿のカテゴリ（例: C）に対応するフォルダを検索
- しかしそのフォルダに動画がない場合 → **エラーで停止**
- 2番目以降のDRAFT（動画がある）は処理されない

**条件スキップができない仕様になっている**

### 問題2: カテゴリフォルダの存在が前提

- A〜Eの全カテゴリフォルダが存在する必要がある
- フォルダがないとエラー

---

## 必要な改善（全体最適化）

### 方針案

**案1: DRAFTを複数取得 → 動画があるものを探す → 最初に見つかったものを処理**

```
[Get DRAFT Posts] ← 複数件取得
    ↓
[Loop/Filter] ← 各DRAFTに対してファイル存在確認
    ↓
[最初にファイルが見つかったもの] ← 1件だけ処理
    ↓
[Cloudinary → Instagram投稿]
```

**案2: 先にDrive内の全ファイルを取得 → postsシートと照合**

```
[Get all video files from Drive]
    ↓
[Get DRAFT Posts]
    ↓
[Match] ← 両方に存在するものだけ抽出
    ↓
[1件処理]
```

---

## 現在のワークフロー構成

### 最新JSONファイル

**ファイルパス**: `C:\Users\tench\Downloads\Instagram Reel from Drive (1).json`

### フロー

```
[Manual Trigger]
    ↓
[Get DRAFT Post] ← 1件取得
    ↓
[Get Category from Pattern] ← content_jsonからpattern取得→カテゴリ判定
    ↓
[Search Category Folder] ← 該当フォルダを検索
    ↓
[Search Video File] ← post_idでファイル検索 ← ★ここでファイルがないとエラー
    ↓
[Upload to Cloudinary]
    ↓
[Get User ID]
    ↓
[Create Reel Container]
    ↓
[Wait 30s]
    ↓
[Check Container Status]
    ↓
[If FINISHED]
    ├── Yes → [Publish Reel] → [Edit Fields] → [Update Posts Sheet]
    └── No → [Wait 15s Retry] → [Check Container Status]
```

---

## カテゴリとpatternの対応

| pattern | カテゴリ | フォルダ名例 |
|---------|---------|------------|
| versus | A | 202512Instagram投稿A |
| instant_hack | B | 202512Instagram投稿B |
| secret_feature | C | 202512Instagram投稿C |
| warning | D | 202512Instagram投稿D |
| ranking | E | 202512Instagram投稿E |

---

## 重要な技術的発見

### Google DriveのURLはInstagram APIで使えない（2025年以降）

**エラー**: `Error in loading https://drive.google.com/uc?export=download&id=xxx - 500 Internal Server Error`

**原因**:
- Google DriveのURLはリダイレクト、認証トークン、HTMLラッパーを含む
- Metaが2025年1月から直接URLのみを要求

**解決策**: Cloudinary経由でアップロード

### Cloudinaryの設定

```javascript
// Upload to Cloudinary ノード設定
Method: POST
URL: https://api.cloudinary.com/v1_1/doaf4wodr/video/upload
Body Content Type: Form-Data

Body Parameters:
- file: https://drive.google.com/uc?export=download&id={{ $json.file_id }}
- upload_preset: instagram_reel
```

### n8nでの大きなファイルのダウンロード

77MBの動画をn8nのメモリ経由でダウンロード→アップロードしようとすると:
```
RangeError: Invalid string length
```

**解決策**: CloudinaryにURLを渡して、Cloudinaryが直接Google Driveから取得

---

## 関連スクリーンショット（セッション中に共有）

### Cloudinary設定
- `C:\Users\tench\Downloads\b6af20e6161712b1c295cf5b86f2c7d4.jpg` - ダッシュボード
- `C:\Users\tench\Downloads\73ee87669105be69cbc841a0b582f85c.png` - API Keys画面
- `C:\Users\tench\Downloads\d3dbda4015f6c3428e8448af160ec165.png` - API Keys一覧
- `C:\Users\tench\Downloads\ed21135dbf7d95d457d5562044025a53.png` - API Key作成
- `C:\Users\tench\Downloads\dbed90210aae94569e21c22962fb2ab8.png` - API Key詳細
- `C:\Users\tench\Downloads\0c1a32e815c47ab4837cb8e773e91f07.png` - Instagram REEL Key
- `C:\Users\tench\Downloads\87e97dcbdcdfae294cde6d4099fbd100.png` - Upload Presets画面
- `C:\Users\tench\Downloads\3b12a8ebf83c21f65a4ef07b31050471.png` - Upload Preset一覧
- `C:\Users\tench\Downloads\b9fd7683fbc346f327d335f5fc4d5e81.png` - Upload Preset設定

### n8nワークフロー
- `C:\Users\tench\Downloads\c65776179ec9bf47eef25bce3621c864.png` - Upload to Cloudinary設定
- `C:\Users\tench\Downloads\b623edfbbbe84de9d3b100ad6858264a.jpg` - Cloudinary動画一覧
- `C:\Users\tench\Downloads\6d4d175cefebf5f3b8a90d45a8ddb7cd.png` - ワークフロー全体図
- `C:\Users\tench\Downloads\7c77986296cd951f86d3a3c5d0e6dbea.png` - Create Reel Container設定
- `C:\Users\tench\Downloads\4346e3f516a8b59bf0ded292c665f7f4.png` - Get User ID結果
- `C:\Users\tench\Downloads\c049bb36ef44d4bfad093701056c57ba.png` - Container Status結果

### エラー画面
- セッション中に発生したエラー（テキストで記録済み）

---

## 関連JSONファイル

| ファイル | 説明 |
|---------|------|
| `C:\Users\tench\Downloads\Instagram Reel from Drive (1).json` | **最新版**（基本動作確認済み） |
| `C:\Users\tench\Downloads\Instagram-Reel-from-Drive-v4.json` | カテゴリ判定追加版 |
| `C:\Users\tench\Downloads\Instagram-Reel-from-Drive-v3.json` | 2段階検索版 |
| `C:\Users\tench\Downloads\Instagram-Reel-from-Drive-v2.json` | 1段階検索版（動作せず） |
| `C:\Users\tench\Downloads\cloudinary-upload-nodes.json` | Cloudinaryノードのみ |

---

## postsシートの構造

```
post_id | post_type | status | caption | hashtags | ... | content_json
```

- `status`: DRAFT / PROCESSING / PUBLISHED / FAILED
- `content_json`: JSON文字列（patternフィールドを含む）

### content_json内のpattern

```json
{
  "pattern": "secret_feature",
  "narration_1": "...",
  ...
}
```

---

## 次のセッションでやるべきこと

### 1. ワークフローの全体最適化

**目的**: 動画ファイルが存在するDRAFTだけを確実に処理

**方針**:
1. postsシートからDRAFT全件取得
2. 各DRAFTのカテゴリを判定
3. 対応するフォルダに動画があるか確認
4. 動画があるDRAFTの中から1件を選択
5. 投稿処理

### 2. エラーハンドリングの追加

- フォルダが存在しない場合のスキップ
- ファイルが存在しない場合のスキップ
- Cloudinaryエラー時のリトライ/スキップ

### 3. 講座作成

講座作成時に必要な内容:
- Cloudinaryアカウント作成手順
- Upload Preset設定手順
- ワークフロー構築手順
- トラブルシューティング（Google Drive URL問題、メモリ問題）

---

## 参考資料

### n8n公式テンプレート
- [Automated Instagram Reels Posting Using Google Drive, Cloudinary & Sheets](https://n8n.io/workflows/6217-automated-instagram-reels-posting-using-google-drive-cloudinary-and-sheets/)

### n8nコミュニティ
- [Google Drive links are no longer accepted](https://community.n8n.io/t/instagram-facebook-graph-api-google-drive-links-are-no-longer-accepted-resolved/165635)

### Cloudinary
- 無料プラン: 月25クレジット
- 1GB ストレージ = 1クレジット
- 1GB 帯域幅 = 1クレジット

---

## アクセストークン（参考）

Instagram API用のアクセストークンは既存のワークフローJSONに記載済み。
期限切れの場合はModule 02の手順で再取得。

---

**最終更新**: 2025-12-08
