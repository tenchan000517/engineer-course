# HANDOFF: 解説リールナレーション改善

**このファイルは `HANDOFF-reel-kata.md` から参照される詳細ドキュメントです。**

---

## 目的

解説リールのナレーション作成ガイド（`tutorial-reel-script-guide.md`）を改善し、**script.txtからnarration.txtへの変換を暗黙知なしで自動化可能にする**。

---

## 核心の理解: 編集点とは何か

### 本質

**narration.txtの1行 = 1編集点 = 1画像切り替えタイミング = placement.jsonの1エントリ**

ナレーション作成は「読み上げテキストを作る」作業ではない。**Premiere Proの画像自動配置のためのタイミングデータを生成する**作業である。

### 自動化パイプライン

```
script.txt（台本）
    ↓ 変換（Claude Code）
narration.txt（編集点付きナレーション）
    ↓ Fish Audio API
audio/01.mp3, 02.mp3, ...（各セグメント音声）
    ↓ ffmpeg
audio_trimmed/01.mp3, 02.mp3, ...（トルツメ済み）
    ↓ faster-whisper
audio_trimmed/01.json, 02.json, ...（単語タイムスタンプ）
    ↓ create_tutorial_srt.py ★完成★
subtitle.srt + placement.json（同時生成）
    ↓ ExtendScript JSX
Premiere Pro タイムライン自動構築
```

---

## 解説リール用トラック構造（確定）

| トラック | 用途 | 備考 |
|---------|------|------|
| V1 | アバター動画 | シーンごとに切り替え＆ループ |
| V3 | フック動画（Window） | 0-5秒 |
| V4 | UI静止画① | ステップ1 |
| V5 | UI静止画② | ステップ2 |
| V6 | 完成動画（Window） | completion.mp4 |
| V7 | トリガーワード静止画 | CTA |
| V14 | 字幕背景 | 全体 |
| A1 | ナレーション | 連続配置 |
| A3 | BGM | 全体 |
| A4 | 効果音・SE | 各タイミング |

---

## アバター動画のシーン切り替え

### シーン→アバター動画マッピング

| セグメント | アバター動画 | 長さ |
|-----------|-------------|------|
| 行1（導入） | normal.mp4（5秒） | ループ |
| 行2（ステップ1） | ランダム（10秒） | 切り捨て |
| 行3（ステップ2） | ランダム（10秒） | 切り捨て |
| 行4（ステップ2続き） | ランダム（10秒） | 切り捨て |
| 行5（完成） | normal.mp4（5秒） | 切り捨て |
| 行6-7（CTA） | cta.mp4（5秒） | ループ |

### ランダム動画プール

毎回シャッフルして選択（重複なし）:
- pc_back.mp4（パソコン・バックショット）
- bench_reading.mp4（公園ベンチで雑誌）
- sofa_reading.mp4（ソファーで本）
- cooking.mp4（料理）
- cleaning.mp4（お掃除）

---

## placement.json の新type

### 解説リール用type（実装済み）

| type | 処理 | 設定項目 |
|------|------|----------|
| `avatar_video` | アバター動画配置（time指定） | path, track, time, duration |
| `hook_video` | フック動画（Window） | path, track, time, duration |
| `ui` | UI静止画 | path, track, time, duration |
| `completion` | 完成動画 | path, track, time, duration |
| `trigger` | トリガーワード静止画 | path, track, time, duration |
| `se` | 効果音 | path, track, time |
| `narration` | ナレーション（time指定対応） | path, track, time |

---

## 2026-02-03 セッションで完了した作業

### create_tutorial_srt.py（完成）

**パス**: `scripts/create_tutorial_srt.py`

**機能**:
- SRT + placement.json を同時生成
- アバター動画のシーン切り替え＆ループ配置
- ランダム動画の自動選択
- SE自動配置
- フック動画5秒固定

**使用方法**:
```bash
python create_tutorial_srt.py "C:\path\to\project_folder"
```

**出力**:
- `subtitle.srt`（44エントリ）
- `placement.json`（27配置）

### SE素材を共有フォルダに配置

**パス**: `C:\Instagramショート\Instagram_Reels_Production\共有素材\SE\`

| ファイル | 用途 | トリガー |
|----------|------|----------|
| decision.mp3 | UI静止画表示時 | ステップ切り替え |
| complete.mp3 | 完成動画表示時 | 完成演出 |
| typing.mp3 | トリガーワード表示時 | CTA |

### アバター動画を共有フォルダに追加

**パス**: `C:\Instagramショート\Instagram_Reels_Production\共有素材\アバター動画\`

| ファイル | 内容 | 長さ |
|----------|------|------|
| normal.mp4 | ノーマル | 5秒 |
| cta.mp4 | CTA用 | 5秒 |
| work.mp4 | パソコン（横アングル） | 5秒 |
| pc_back.mp4 | パソコン（バックショット） | 10秒 |
| bench_reading.mp4 | 公園ベンチで雑誌 | 10秒 |
| sofa_reading.mp4 | ソファーで本 | 10秒 |
| cooking.mp4 | 料理 | 10秒 |
| cleaning.mp4 | お掃除 | 10秒 |

### モンスターASMRプロジェクト素材

**パス**: `C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27\`

| ファイル | 状態 |
|----------|------|
| hook.mp4 | ✅ 配置済み |
| completion.mp4 | ✅ 配置済み |
| ui_01.png | ✅ 配置済み |
| ui_02.png | ✅ 配置済み |
| trigger.png | ✅ 配置済み |
| subtitle.srt | ✅ 生成済み（44エントリ） |
| placement.json | ✅ 生成済み（27配置） |

---

## 次のアクション（最優先）

### 1. JSXスクリプトを更新

**ファイル**: `scripts/premiere/place_ranking_images.jsx`

**追加が必要なtype対応**:
- `avatar_video`（time指定で配置、ループなし）
- `hook_video`
- `ui`
- `completion`
- `trigger`
- `se`
- `narration`（time指定がある場合はその時間から開始）

### 2. Premiere Proで動作検証

モンスターASMRプロジェクトでJSXを実行し、正しく配置されるか確認。

---

## 関連ファイル

| ファイル | 内容 |
|----------|------|
| `scripts/create_tutorial_srt.py` | **SRT + placement.json生成（完成）** |
| `scripts/generate_tutorial_narration.py` | 解説リール音声生成 |
| `scripts/trim_audio.py` | 音声トルツメ |
| `scripts/whisper_tutorial_timestamps.py` | 個別Whisperタイムスタンプ |
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro自動配置（**要更新**） |
| `content/guides/tutorial-reel-script-guide.md` | 解説リール台本作成ガイド |

---

## ランキングリールとの差異

| 項目 | ランキングリール | 解説リール |
|------|-----------------|------------|
| 話者 | 2声（女性+男性） | 1声（男性） |
| アバター動画 | 1種類をループ | **シーンごとに切り替え** |
| ランダム動画 | なし | **5種類からランダム選択** |
| フック | 「論外」で開始 | **5秒動画** |
| SE | なし | **3種類（decision/complete/typing）** |
| SRT+placement生成 | 手動 | **create_tutorial_srt.pyで自動** |

---

**最終更新**: 2026-02-03
**次のアクション**: JSXスクリプト更新 → Premiere Pro動作検証
