# HANDOFF - Module 08 Session 8

## セッション概要

**日時**: 2025-12-13
**作業内容**: 音声合成ワークフローの最適化（v2）

---

## 完了したタスク

### 1. ワークフロー最適化

| 項目 | 変更内容 |
|------|----------|
| ナレーション統合 | narration_1 + '\n' + narration_2 を連結して1回のAPI呼び出し |
| フォルダ名形式 | `202512Instagram投稿A` → `20251213投稿A`（年月日形式） |
| ffmpegコマンド | 2音声配置 → 1音声3秒遅延のみ |
| 不要ノード削除 | Wait 5s, Generate Audio 2, Save Audio 2 |

### 2. 作成したファイル

| ファイル | パス | 説明 |
|---------|------|------|
| Module 08本文 | `content/modules/n8n-advanced/module-08-audio-workflow-optimization.md` | 講座モジュール |
| ダウンロード用JSON | `public/n8n-advanced/download/音声合成advanced.json` | プレースホルダー化済み |
| Canva設定スクショ | `public/n8n-advanced/module-08-canva-download-settings.png` | ダウンロード時の重要設定 |
| 実働用JSON | `content/modules/n8n-advanced/音声合成advanced.json` | ユーザー環境で動作確認済み |

### 3. Canvaダウンロード設定（重要）

講座に追加済み。以下の設定が必須：

| 設定項目 | 値 |
|---------|-----|
| 出力 | 6個のデザイン（個別デザイン） |
| 各デザインの名前 | post_id列のデータ |
| フォルダ名 | 20251213投稿A（年月日+投稿+カテゴリ） |

---

## 未解決の問題

### 問題1: アーカイブ保存の失敗

**症状**: Move Original to Archiveノードで失敗

**原因**: Read Outputの後に並列実行されているため、順序の問題が発生

**対応案**:
- アーカイブなしバージョンを作成済み: `C:\Users\tench\Downloads\音声合成advanced_no_archive.json`
- 元ファイルは削除（Delete Original）に変更

### 問題2: カテゴリAがDONEだと他カテゴリがループしない

**症状**: カテゴリAが全てaudio_status=DONEの場合、B〜Eのループが実行されない

**原因**: Filter NORMAL and Add Categoryが0件を返すと、If Has Itemsに入力が渡されずノードが実行されない

**解決策**: Filter NORMAL and Add Categoryノードの設定で「**Always Output Data**」をONにする

**手順**:
1. Filter NORMAL and Add Category ノードをダブルクリック
2. Settings（歯車アイコン）をクリック
3. Always Output Data を ON にする

### 問題3: Download fileで403エラー

**症状**:
```
Forbidden - perhaps check your credentials?
Export only supports Docs Editors files.
```

**エラーコード**: 403 / fileNotExportable

**原因（推測）**:
- Google DriveのDownloadノードの設定が間違っている可能性
- MP4ファイルを「Export」形式でダウンロードしようとしている
- または、ファイルIDが実際のMP4ではなくGoogle形式のファイルを指している

**確認事項**:
1. Search Video Fileで見つかったファイルのmimeTypeを確認
2. Download fileノードの設定（Download File vs Export File）を確認
3. ファイルが本当にMP4かどうかを確認

---

## 次セッションでの作業

1. **問題2の修正適用**: Always Output Data を ON にする
2. **問題3の調査**: Download fileノードの設定確認、mimeType確認
3. **テスト実行**: 修正後のワークフローで全カテゴリが正常にループするか確認
4. **Module 08の完成**: 問題解決後、講座に追記

---

## 参考: 現在のワークフロー構造

```
Manual Trigger
    ↓
Sheet List (A〜Eのシート情報)
    ↓
Loop Sheets ←──────────────────────────────────┐
    ↓                                           │
Get Sheet Data                                  │
    ↓                                           │
Filter NORMAL and Add Category ★Always Output Data必要│
    ↓                                           │
If Has Items                                    │
    ├── true: Set Folder Names → ...            │
    └── false: Skip to Next Sheet ──────────────┘
```

---

## ワークフローJSONの場所

| バージョン | パス |
|-----------|------|
| v2（アーカイブあり） | `content/modules/n8n-advanced/音声合成advanced.json` |
| v2（アーカイブなし） | `C:\Users\tench\Downloads\音声合成advanced_no_archive.json` |
| ダウンロード用 | `public/n8n-advanced/download/音声合成advanced.json` |

---

**最終更新**: 2025-12-13 16:40
