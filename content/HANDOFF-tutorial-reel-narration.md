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

### 1. JSXスクリプトを更新 ✅ 完了（2026-02-03）

**ファイル**: `scripts/premiere/place_ranking_images.jsx`

**追加したtype対応**:
- `avatar_video`（time/duration指定で配置、ループモードも維持）
- `hook_video` → placeMedia
- `ui` → placeMedia
- `completion` → placeMedia
- `trigger` → placeMedia
- `se` → placeSoundEffect（新規関数）
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
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro自動配置（**更新済み**） |
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

## 2026-02-07 セッションで実装した機能

### 動的切り替えロジック（3段階/2段階）

**実装ファイル**: `scripts/create_tutorial_srt.py`

ナレーションの発話タイミングに基づいて、画像切り替えを動的に制御：

| ステップ種類 | 段階 | トリガー | 切り替え |
|-------------|------|----------|----------|
| プロンプト系 | 3段階 | 「キャプション」「プロンプト」 | ツール名→プロンプトスクショ→UI/成果物 |
| 手順系（〜して検出） | 2段階 | 「して」「したら」「すると」等 | ツール名→UI |
| 手順系（検出なし） | 2段階 | デフォルト1.5秒 | ツール名→UI |

### 新機能・追加関数

```python
# Whisperワードレベルタイムスタンプ読み込み
load_whisper_words(json_path)

# トリガー検出（発話タイミング取得）
find_trigger_timestamps(words)
  → tool_end: 「〜で」の終了時間
  → prompt_start: 「キャプション」の開始時間
  → step_start: 「〜して」の終了時間

# ステップパターン拡張
detect_step_info(text, tool_mapping, prev_step_number)
  → 「ステップN」「まず」「次に」「そして」対応
```

### 新素材ファイル

| ファイル | 用途 | 表示タイミング |
|----------|------|---------------|
| `prompt_01.png` | ステップ1プロンプトスクショ | 「キャプションにある〜」発話時 |
| `prompt_02.png` | ステップ2プロンプトスクショ | 「キャプションにある〜」発話時 |

### JSX更新

`scripts/premiere/place_ranking_images.jsx` に `prompt` タイプ追加

---

## モンスターASMRプロジェクト 現在の状態

**パス**: `C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27\`

### 素材状況

| ファイル | 状態 | 備考 |
|----------|------|------|
| hook.mp4 | ✅ | フック動画 |
| completion.mp4 | ✅ | 完成動画 |
| ui_01.png | ✅ | ステップ1 UI |
| ui_02.png | ✅ | ステップ2 UI |
| ui_03.png | ✅ | ステップ3 UI |
| trigger.png | ✅ | トリガーワード |
| prompt_01.png | ✅ 新規追加 | ステップ1プロンプトスクショ |
| prompt_02.png | ✅ 新規追加 | ステップ2プロンプトスクショ |
| narration.txt | ✅ 更新済み | 3ステップ構成に変更 |
| audio/*.mp3 | ❌ 要再生成 | 古いナレーション |

### 更新後のナレーション（narration.txt）

```
これ、見たことありますか?海外でバズってるモンスターASMRなんですが、日本ではまだ誰もやってないんです。今やれば100万再生も狙えます。しかも作り方は超簡単です。今から30秒で解説します。
ステップ１ナノバナナで、キャプションにあるプロンプトを使って、手のひらサイズの果物に赤ちゃん顔がついた生き物の画像を作ります。
ステップ２クリングで、キャプションにあるプロンプトを使って、開始フレームにこの画像を入れます。
ステップ３ASMRモードをオンにして、キャプションの音声プロンプトでサクサク音を指定して動画を生成すれば完成です。
これだけで本格的なモンスターASMR動画ができます。
今日紹介したモンスターASMRの作り方をまとめました。ほしい人は
モンスターとコメントしてください。
```

---

## 音声パイプライン実行コマンド（Claude Code用）

**重要: WSLにffmpeg/Whisperがないため、powershell.exe経由で実行すること**

### 1. 音声再生成（WSLから直接実行可能）

```bash
python3 /mnt/c/engineer-course/scripts/generate_tutorial_narration.py "/mnt/c/Instagramショート/Instagram_Reels_Production/チュートリアル_モンスターASMR_2026-01-27"
```

### 2. 音声トルツメ（powershell.exe経由）

```bash
powershell.exe -Command "python C:\engineer-course\scripts\trim_audio.py 'C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27'"
```

### 3. Whisperタイムスタンプ再取得（powershell.exe経由）

```bash
powershell.exe -Command "C:\Users\tench\whisper-env\Scripts\python.exe C:\engineer-course\scripts\whisper_tutorial_timestamps.py 'C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27'"
```

### 4. SRT + placement.json 再生成（powershell.exe経由）

```bash
powershell.exe -Command "python C:\engineer-course\scripts\create_tutorial_srt.py 'C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27'"
```

### 5. Premiere Pro で確認

- JSX実行（placement.json選択）
- 3段階切り替えが正しく動作するか確認
  - ステップ1: ツール名→prompt_01.png→ui_01.png
  - ステップ2: ツール名→prompt_02.png→ui_02.png
  - ステップ3: UI→ui_03.png（手順系2段階）

---

## 期待される動作

### ステップ1（プロンプト系3段階）
```
「ステップ１ナノバナナで、キャプションにあるプロンプトを使って、...画像を作ります」
├─ ツール名画像 ─┤├─ prompt_01.png ─┤├─ ui_01.png ─────────┤
  「〜で」        「キャプション〜」    残り
```

### ステップ2（プロンプト系3段階）
```
「ステップ２クリングで、キャプションにあるプロンプトを使って、...入れます」
├─ ツール名画像 ─┤├─ prompt_02.png ─┤├─ ui_02.png ─────────┤
```

### ステップ3（手順系2段階）
```
「ステップ３ASMRモードをオンにして、...完成です」
├─ ui_03.png ───────────────────────────────────────────┤
  （ツール名なし、手順系）
```

---

## 2026-02-08 セッションで実装した修正

### 完了した作業

1. **音声再生成** ✅
2. **音声トルツメ** ✅
3. **Whisperタイムスタンプ** ✅
4. **SRT + placement.json再生成** ✅

### バグ修正

| 問題 | 修正内容 |
|------|----------|
| ツール名画像パス | `共有素材/ツール名/` → `共有素材/AIロゴ/` |
| ツール名ファイル名 | `nano_banana.png` → `Nanobanana.png`（PascalCase） |
| Whisperトリガー検出 | 文字単位分割対応（「キ」「ャ」「プ」→「キャプション」結合検索） |
| ツール名スケール | 100% → **60%** |
| CTAアバター開始 | セグメント7開始 → **セグメント6「今日紹介した」から** |
| アバター動画割り当て | 静的マッピング → **動的（セグメントタイプに基づく）** |
| タイミング精度 | 浮動小数点誤差 → **小数点2位で丸め** |
| 終了余白 | なし → **+0.5秒**（ブツ切れ防止） |

### 動的アバター割り当てロジック

```python
# セグメントタイプ → アバター動画
intro → normal.mp4
step（ステップ1,2,3） → random（ランダム動画）
completion → normal.mp4
cta_first → cta.mp4  # ★「今日紹介した」からCTA開始
cta_trigger → cta.mp4
```

### 新規追加素材

| ファイル | 状態 | 備考 |
|----------|------|------|
| prompt_03.png | ✅ 追加 | ステップ3プロンプトスクショ |

### モンスターASMRプロジェクト 現在の状態

**パス**: `C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27\`

| ファイル | 状態 | 備考 |
|----------|------|------|
| hook.mp4 | ✅ | フック動画 |
| completion.mp4 | ✅ | 完成動画 |
| ui_01.png | ✅ | ステップ1 UI |
| ui_02.png | ✅ | ステップ2 UI |
| ui_03.png | ✅ | ステップ3 UI |
| trigger.png | ✅ | トリガーワード |
| prompt_01.png | ✅ | ステップ1プロンプトスクショ |
| prompt_02.png | ✅ | ステップ2プロンプトスクショ |
| prompt_03.png | ✅ | ステップ3プロンプトスクショ |
| audio/*.mp3 | ✅ 再生成済み | 7セグメント |
| audio_trimmed/*.mp3 | ✅ | トルツメ済み |
| audio_trimmed/*.json | ✅ | Whisperタイムスタンプ |
| subtitle.srt | ✅ | 44エントリ |
| placement.json | ✅ | 36配置 |

### 期待される配置タイミング

| セグメント | 開始 | 終了 | アバター | 内容 |
|-----------|------|------|---------|------|
| 1 (intro) | 5.0秒 | 18.54秒 | normal | 導入 |
| 2 (step1) | 18.54秒 | 26.42秒 | random | Nanobanana→prompt_01→ui_01 |
| 3 (step2) | 26.42秒 | 32.22秒 | random | Kling→prompt_02→ui_02 |
| 4 (step3) | 32.22秒 | 39.54秒 | random | prompt_03→ui_03 |
| 5 (completion) | 39.54秒 | 42.54秒 | normal | 完成動画表示 |
| 6 (cta_first) | 42.54秒 | 47.3秒 | **cta** | 「今日紹介した...ほしい人は」 |
| 7 (cta_trigger) | 47.3秒 | 48.62秒 | cta | trigger.png表示 |
| 余白 | 48.62秒 | 49.12秒 | - | 終了余白0.5秒 |

---

## 次のアクション

### 1. Premiere Pro で動作確認（テスト中）

- JSX実行（placement.json選択）
- 確認項目:
  - [ ] 3段階切り替え（ツール名60%→prompt→ui）
  - [ ] アバター動画の動的切り替え
  - [ ] CTA開始タイミング（42.54秒「今日紹介した」から）
  - [ ] 字幕背景（V14）が全体表示されるか
  - [ ] 終了余白0.5秒でブツ切れ解消

---

## 2026-02-08 セッション（続き）で実装した修正

### タイミング誤差修正

| 問題 | 原因 | 修正内容 |
|------|------|----------|
| CTAタイミング0.5秒ズレ | `load_whisper_json()`がWhisper終了時間を使用 | **実際のMP3 duration**を優先使用 |

### 字幕背景修正

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| 開始時間 | 0秒 | **5秒**（フック後） |

### V4挿入画像設定変更

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| prompt/ui スケール | 100% | **90%** |
| ツール名画像パス | 混在パス問題 | **WSL両対応** |

### completion動画終了タイミング修正

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| 終了基準 | trigger開始 | **cta_first開始**（「今日紹介した」） |

### 導入トリガー機能追加（新規）

訴求タイプ別の導入イラストを自動配置:

| 訴求タイプ | トリガーフレーズ | 共有イラスト |
|-----------|-----------------|--------------|
| バズ系 | 「今やれば」 | intro_buzz.png |
| 収益系 | 「で月」 | intro_income.png |
| 効率化系 | 「削減」「効率」 | intro_efficiency.png |
| スキル系 | 「誰でもプロ級の」 | intro_skill.png |

**配置設定**:
- トラック: V4
- スケール: 60%
- 位置: x=540, y=1450
- 表示期間: トリガーフレーズ開始〜文終了（「ます」「です」）

**共有素材パス**: `共有素材/導入イラスト/`

### ガイド更新

`tutorial-reel-script-guide.md` Phase 6.5に追加:
- 0.png → intro.png マッピング
- 訴求タイプ別トリガー表

---

## 2026-02-08 セッション（BGM音量修正）

### 完了した作業

1. **BGM音量修正** ✅
   - -8dB (40%) → **-40dB (1%)** に変更
   - `create_tutorial_srt.py` line 773

2. **JSX setClipVolume関数修正** ✅
   - `setTimeVarying(false)` を追加（必須の呼び出し）
   - インデックス直接指定 `components[0].properties[1]` を優先（Adobe推奨）
   - デバッグログ強化

3. **ナレーション修正** ✅
   - 「ステップ１ナノバナナで」→「ステップ1、ナノバナナで」
   - 読点追加で数字を明確に発音させる

4. **ガイド更新** ✅
   - Phase 6に `powershell.exe -Command` 実行方法を明記
   - WSLからの実行パターンを追加

### 音量設定リファレンス

| dB | リニア値 | 用途 |
|----|---------|------|
| 0dB | 1.0 (100%) | 元音量 |
| -10dB | 0.316 (32%) | SE |
| -40dB | 0.01 (1%) | **BGM（現在）** |

---

## 2026-02-08 セッション（ナレーション最適化）

### 完了した作業

1. **トルツメ強化** ✅
   - 中間の無音も削除するように修正（`stop_periods=-1:stop_duration=0.3`）
   - `scripts/trim_audio.py` 更新

2. **ステップ番号をひらがなに変更** ✅
   - 数字（1,2,3）→ ひらがな（いち、に、さん）
   - TTSが数字を安定して読むため
   - `create_tutorial_srt.py` にひらがなパターン検出を追加

3. **漢字→アルファベット接続問題解決** ✅
   - 直接接続するとTTSが文字を飲み込む
   - スペースを入れることで解決（例: ステップさん ASMR）

4. **ガイド更新** ✅
   - ナレーション基本ルールにひらがな使用を明記
   - 例文をすべてひらがなに更新

### ナレーションルール（確定版）

- 句読点・スペースは排除
- ステップ番号はひらがな（いち、に、さん）
- 漢字/ひらがな→アルファベット直接接続時はスペースを入れる

---

## 次のアクション

### 1. SE音量調整（必要に応じて）

- 現在-10dB (32%)

---

**最終更新**: 2026-02-14
**現在のステータス**: ✅ 完了

---

## 2026-02-14 セッション

### 完了した作業

1. **Premiere Pro動作確認** ✅
   - BGM音量-40dB: OK
   - ナレーション最適化: OK
   - 全体の動作確認: OK

### 結果

解説リールナレーション改善プロジェクト **完了**。

- 音量調整（BGM -40dB）
- トルツメ強化
- ステップ番号ひらがな化
- 漢字→アルファベット接続のスペース挿入

すべて正常に動作することを確認。
