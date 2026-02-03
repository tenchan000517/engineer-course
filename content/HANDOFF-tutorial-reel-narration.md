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
    ↓ Claude Code
telop.txt（テロップ分割）
    ↓ スクリプト（オフセット計算）
subtitle.srt（字幕ファイル）
    ↓ + 画像パスマッピング
placement.json（Premiere Pro配置データ）
    ↓ ExtendScript JSX
Premiere Pro タイムライン自動構築
```

---

## Premiere Pro レイヤー構造（ランキングリール参考）

### ビデオトラック（14トラック）

| トラック | 用途 |
|---------|------|
| V1 | アバター動画 |
| V2 | 調整レイヤー |
| V3 | アバター静止画 |
| V4 | ランキングボード |
| V5 | 論外 |
| V6-V9 | No.4〜No.1 |
| V10-V12 | プロンプト・手順スクリーンショット |
| V13 | タイトル背景 |
| V14 | 字幕背景 |

### オーディオトラック（4トラック）

| トラック | 用途 |
|---------|------|
| A1 | 男性ナレーション |
| A2 | 女性ナレーション |
| A3 | BGM |
| A4 | 効果音 |

### 解説リール用トラック構造（要定義）

解説リールはランキングリールと異なるトラック構造が必要。以下は想定案：

| トラック | 用途 |
|---------|------|
| V1 | フック動画（ASMR動画等） |
| V2 | 制作物静止画 |
| V3 | UI静止画（ツール操作画面） |
| V4 | 完成動画ウィンドウ |
| V5 | トリガーワード静止画 |
| V6 | 字幕背景 |
| A1 | 男性ナレーション |
| A2 | BGM |
| A3 | 効果音 |

---

## placement.json の構造

### JSXスクリプト

`scripts/premiere/place_ranking_images.jsx` がplacement.jsonを読み込んで自動配置する。

### 素材タイプ

| type | 処理 | 設定項目 |
|------|------|----------|
| `shared` | 共有素材配置 | path, time, track, duration, volume |
| `avatar_still` | アバター静止画 | path, time, track, duration |
| `ranking` | ランキングアイコン | path, time, track, duration, scale, x, y |
| `narration` | ナレーション音声（連続配置） | path, track |
| `avatar_video` | アバター動画（ループ対応） | path, track, time, loop, loop_until |
| `prompt_screenshot` | プロンプトスクリーンショット | path, time, track, duration, scale, x, y |

### 解説リール用に必要な新type（要定義）

| type | 処理 | 設定項目 |
|------|------|----------|
| `hook_video` | フック動画 | path, track, time, duration |
| `product_image` | 制作物静止画 | path, track, time, duration |
| `ui_screenshot` | UI静止画 | path, track, time, duration, scale, x, y |
| `completion_video` | 完成動画 | path, track, time, duration |
| `trigger_image` | トリガーワード静止画 | path, track, time, duration |

---

## 現在のガイドの問題点

### 1. script.txt → narration.txt の変換ルールが不十分

**現状**: 「セクションごとに1行にまとめる」「句読点は自然さを保つ」としか書いていない

**必要なこと**: 台本のどの部分がどの編集点に対応するかの判断基準を明確にする

**具体的に不足しているルール**:
- 台本のどのセクション見出し（【冒頭フック】【ステップ1】等）がどの編集点になるか
- 同一セクション内でさらに分割が必要な場合の基準（映像が変わるタイミング）
- フックにナレーションを入れない理由と、その代わりに何を入れるか

### 2. 編集点と映像の対応表がテンプレート化されていない

**現状**: モンスターASMRの具体例のみ記載

**必要なこと**: 汎用的なテンプレート（テーマやステップ数が変わっても適用できる）

### 3. placement.json生成フローが存在しない

**現状**: narration.txt → SRTまでのフローはあるが、placement.json生成のフローがない

**必要なこと**: SRTのタイムスタンプを元にplacement.jsonを生成するスクリプトまたはルール

---

## 今回のセッションで完了した作業

### モンスターASMR Phase 6（全完了）

| Step | 内容 | 状態 |
|------|------|------|
| 24 | Fish Audio音声生成 | 完了（7セグメント） |
| 25 | 音声部分修正 | スキップ（問題なし） |
| 26 | 音声トルツメ | 完了 |
| 27 | Whisperタイムスタンプ | 完了（個別処理） |
| 28 | テロップテキスト作成 | 完了（51行） |
| 29 | テロップ修正 | 完了 |
| 30 | SRT作成 | 完了（45エントリ） |

### 作成したスクリプト

| スクリプト | パス | 用途 |
|-----------|------|------|
| `generate_tutorial_narration.py` | `scripts/` | 解説リール音声生成（男性単一話者、行ごとにセグメント） |
| `trim_audio.py` | `scripts/` | 音声トルツメ（前後無音削除） |
| `whisper_tutorial_timestamps.py` | `scripts/` | 個別Whisperタイムスタンプ取得 |

### ガイド更新

| セクション | 変更内容 |
|-----------|----------|
| Phase 6 | ランキングリール参照を削除。独自フローに書き換え |
| ナレーション用フォーマット | 完全刷新（編集点の概念、セクション構造表、例、ポイント、重要性の説明） |
| テロップ分割ルール | 新規追加（7つの鉄則、解説リール固有ポイント、分割プロンプト） |
| ランキングリールとの違い | 話者を「1声（男性）」に修正 |

---

## 今回のセッションで得た教訓

### 原則

1. **ガイドファースト**: ガイドに書いてからコマンド実行。ガイドに書いていないことは実行しない
2. **スタンドアローン**: 解説リールガイドは独自のフローを持つ。ランキングリールガイドを参照しない
3. **既存スクリプトを壊さない**: 解説リール用は新規スクリプトを作成（whisper_timestamps.py → whisper_tutorial_timestamps.py）
4. **環境の確認**: WSL環境ではWindowsコマンド（ffmpeg.exe）やwhisper-env仮想環境を使用

### ランキングリールとの差異

| 項目 | ランキングリール | 解説リール |
|------|-----------------|------------|
| 話者 | 2声（女性+男性） | 1声（男性） |
| narration.txt形式 | 話者指定行あり（「女性」「男性」） | 話者指定行なし |
| 音声結合 | combined_all.mp3に結合 | **結合不要**（個別処理） |
| Whisper処理 | 結合ファイル1つを処理 | 各ファイルを**個別に処理** |
| SRTタイムスタンプ | 結合音声の絶対時間 | 各セグメントのオフセット計算 |
| 音声生成スクリプト | `generate_narration_audio.py` | `generate_tutorial_narration.py` |
| Whisperスクリプト | `whisper_timestamps.py` | `whisper_tutorial_timestamps.py` |
| 編集点 | 話者切り替え | セクション切り替え（映像変化） |

---

## 次のアクション

### 優先度高

1. **script.txt → narration.txt 変換ルールの定義**
   - 台本のセクション見出しと編集点の対応表
   - 同一セクション内の分割基準
   - 汎用テンプレート化

2. **解説リール用placement.json生成フロー**
   - SRTタイムスタンプ + 画像パスマッピング → placement.json
   - 解説リール用JSXスクリプト（または既存スクリプトの拡張）

3. **解説リール用Premiere Proトラック構造の確定**
   - ランキングリールの14トラックを参考に定義

### 優先度中

4. **テロップ分割の短すぎ問題への対策**
   - 2文字テロップが一瞬で消える問題（「これ」「まず」等）
   - 最小表示時間ルールの追加検討

5. **SRT作成スクリプト化**（`create_tutorial_srt.py`）
   - 現在は手動計算。スクリプト化して自動化

---

## 関連ファイル

| ファイル | 内容 |
|----------|------|
| `content/guides/tutorial-reel-script-guide.md` | 解説リール台本作成ガイド |
| `scripts/generate_tutorial_narration.py` | 解説リール音声生成 |
| `scripts/trim_audio.py` | 音声トルツメ |
| `scripts/whisper_tutorial_timestamps.py` | 個別Whisperタイムスタンプ |
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro自動配置（ランキングリール用） |
| `docs/archive/premiere-pro-ranking-reel-workflow.md` | Premiere Proワークフロー |
| `content/guides/scripts-ranking-videos.md` | ランキング動画台本集（12本） |

---

## プロジェクトフォルダ

`C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27\`

### ファイル一覧

| ファイル | 状態 |
|----------|------|
| `hook_prompts.txt` | 完了 |
| `script.txt` | 完了 |
| `tokuten_draft.md` | 完了 |
| `caption.txt` | 完了 |
| `narration.txt` | 完了（7行、編集点付き） |
| `audio/01.mp3`〜`07.mp3` | 完了（Fish Audio生成） |
| `audio_trimmed/01.mp3`〜`07.mp3` | 完了（トルツメ済み） |
| `audio_trimmed/01.json`〜`07.json` | 完了（Whisperタイムスタンプ） |
| `telop.txt` | 完了（51行） |
| `subtitle.srt` | 完了（45エントリ） |

---

**最終更新**: 2026-01-28
