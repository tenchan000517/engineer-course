# HANDOFF - Module 08 Session 9

## セッション概要

**日時**: 2025-12-13
**作業内容**: 音声合成ワークフロー v3 の修正（失敗）

---

## 現在の状況

### 動作確認済みバージョン
- **ファイル**: `C:\Users\tench\Downloads\音声合成advanced_v3_loop (1).json`
- **状態**: カテゴリAは正常に動作（Upload, Delete, Update全て成功）
- **問題**: Loop SheetsでカテゴリAが終わった後、無限ループ（同じカテゴリAを繰り返す）

### 私（Claude）が壊したバージョン
- **ファイル**: `content/modules/n8n-advanced/音声合成advanced_v3.json`
- **変更内容**: `Continue to Next Sheet` ノードを追加
- **結果**: カテゴリBでペアリングエラー発生

---

## 未解決の問題

### 問題1: 無限ループ（最優先）

**症状**:
- Loop Over Items が完了すると、5 items（Sheet List のデータ）を返す
- これが Loop Sheets に渡されると、Loop Sheets がリセットされて最初のシート（A）から再開
- 永遠にカテゴリAだけを処理し続ける

**試した解決策（失敗）**:
- `Continue to Next Sheet` ノードを追加して、データをクリア（1件のダミーデータを返す）
- 結果: カテゴリB以降でペアリングエラー発生

**考えられる解決策（未検証）**:
1. Split In Batches ノードの「Reset」オプションを確認・無効化
2. Loop Over Items から Loop Sheets への接続方法を変更
3. Loop Over Items の完了出力で空配列を返す方法を探す

### 問題2: ペアリングエラー

**症状**:
```
Paired item data for item from node 'Merge Narrations' is unavailable.
```

**発生箇所**: Upload New Video ノードの `folderId` パラメータ
- 式: `{{ $('Loop Over Items').item.json.category_folder_id }}`

**原因**:
- `Continue to Next Sheet` が返すデータにペアリング情報がない
- カテゴリB以降でn8nがアイテムの追跡を失う

**注意**:
- `.item` を `.first()` に変更する必要は**ない**
- v2では `.item` で正常に動作していた

---

## 重要なファイル

| ファイル | 状態 | 説明 |
|---------|------|------|
| `Downloads/音声合成advanced_v3_loop (1).json` | 動作（A成功、B以降未到達） | n8nからエクスポートした動作版 |
| `content/modules/n8n-advanced/音声合成advanced_v3.json` | 壊れている | Claudeが修正して壊した版 |
| `Downloads/音声合成advanced_v2 (4).json` | 参考 | 元のv2（アーカイブ関連以外は動作） |

---

## 正常に動作している部分

1. **5シートからのデータ取得** - 全カテゴリのシートを順番に取得
2. **NORMALフィルタ** - audio_status=NORMALのみ抽出
3. **空カテゴリのスキップ** - post_idが空なら Skip to Next Sheet
4. **フォルダ検索** - カテゴリフォルダを正しく検索
5. **動画処理** - Download → Audio生成 → ffmpeg → Upload → Delete → Update
6. **BGMとナレーションのミックス** - ffmpegコマンド修正済み

---

## ffmpegコマンド（修正済み）

```bash
ffmpeg -y -i /tmp/video.mp4 -i /tmp/audio.mp3 \
  -filter_complex '[1:a]adelay=3000|3000[delayed];[0:a][delayed]amix=inputs=2:duration=first[aout]' \
  -map 0:v -map '[aout]' \
  -c:v copy -c:a aac /tmp/output.mp4
```

- ナレーションを3秒遅延
- BGMとナレーションをミックス（BGMが消えない）

---

## 次セッションでの作業

1. **動作版に戻す**: `Downloads/音声合成advanced_v3_loop (1).json` をベースにする
2. **無限ループの原因調査**: Split In Batches の動作を詳しく調べる
3. **別のアプローチを検討**:
   - Loop Over Items の完了時に何も返さない方法
   - Split In Batches の Reset 設定
   - ワークフロー構造の根本的な見直し

---

## 参考: ワークフロー構造

```
Manual Trigger → Sheet List → Loop Sheets ←───────────────────────┐
                                  ↓                               │
                            Get Sheet Data                        │
                                  ↓                               │
                      Filter NORMAL and Add Category              │
                                  ↓                               │
                            If Has Items                          │
                           ↓         ↓                            │
                         true      false                          │
                           ↓         └── Skip to Next Sheet ──────┤
                    Search Category Folder                        │
                           ↓                                      │
                    Prepare Items with Folder ID                  │
                           ↓                                      │
                    Loop Over Items ←──────────────────┐          │
                           ↓                           │          │
                    [アイテム処理]                      │          │
                           ↓                           │          │
                    Update audio_status ───────────────┘          │
                           ↓ (完了)                               │
                    ??? ──────────────────────────────────────────┘
                    ↑ ここの接続が問題
```

---

**最終更新**: 2025-12-13 18:55
