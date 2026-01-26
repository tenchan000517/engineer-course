# HANDOFF: Premiere Pro ランキングリール制作

**このファイルを最初に読んでください。**

---

## クイックスタート（新規セッション用）

### このHANDOFFの使い方

1. **新しいランキングリールを作る場合** → 「新規ランキングリール制作フロー」セクションに従う
2. **初回セットアップが必要な場合** → 講座 Module 01 を参照
3. **講座を更新/追加する場合** → 「講座構成」セクションを確認

### 現在の状態

| 項目 | 状態 |
|------|------|
| プロダクション環境 | ✅ 構築済み |
| 自動配置スクリプト | ✅ 動作確認済み |
| 講座 | ✅ Module 01, 02 完成 |
| フロー | ✅ 確立済み |

---

## 新規ランキングリール制作フロー（毎回の手順）

### 前提条件

- Phase A（台本作成）が完了していること
- 以下のファイルが準備済み：
  - `subtitle.srt` - SRT字幕
  - `audio_trimmed/combined_all.mp3` - トルツメ済み音声
  - AIロゴ画像（共有素材フォルダ内）

### Step 1: 配置データ生成（Python）

```bash
python C:\engineer-course\scripts\generate_placement_json.py "{PROJECT_FOLDER}"
```

**例:**
```bash
python C:\engineer-course\scripts\generate_placement_json.py "C:\Instagramショート\Instagram_Reels_Production\ランキング_テーマ名_2026-01-24"
```

### Step 2: Premiere Proでプロジェクト作成

1. Premiere Pro起動 → ファイル → プロダクションを開く
2. `C:\Instagramショート\Instagram_Reels_Production\` を選択
3. `_SHARED_Resources` をダブルクリックして開く
4. ファイル → 新規 → プロジェクト（名前: `ランキング_テーマ名_日付`）
5. `_SHARED_Resources` → `00_テンプレート` → `テンプレート_ランキング` を新規プロジェクトにドラッグ

### Step 3: 自動配置実行（ExtendScript）

1. VSCodeで `C:\engineer-course` を開く
2. シーケンスをアクティブにした状態で **F5** を押す
3. 「完了!」ダイアログで成功件数を確認

### Step 4: SRT字幕読み込み

1. ファイル → 読み込み → `subtitle.srt`
2. 「キャプションとしてインポート」を選択
3. V12トラックに配置
4. テキストパネル → トラックスタイル → `リール_通常字幕` 適用
5. 「論外」部分は `リール_論外_赤字` を適用

### Step 5: 最終調整・書き出し

1. 再生して確認
2. 必要に応じて微調整
3. 書き出し（プリセット: `Instagram_Reels_1080x1920_30fps`）

---

## 関連ファイル（必読）

| ファイル | 内容 | 用途 |
|----------|------|------|
| `content/HANDOFF-reel-kata.md` | **リールの型定義** | 動画の型選択時に参照 |
| `docs/archive/ranking-reel-script-guide.md` | **台本作成ガイド（20ステップ）** | Phase A実行時に参照 |
| `docs/archive/ai-tool-name-list.md` | AIツール名表記リスト | SRT/ナレーション作成時 |
| `docs/archive/ai-logo-mapping.md` | AIロゴ対応表 | 新規ツール追加時 |
| `scripts/premiere/tool_image_mapping.json` | ツール名→画像マッピング | 新規ツール追加時に編集 |

---

## 全体フロー図

```
Phase A: 台本作成（ranking-reel-script-guide.md）
  1-4.   準備（テーマ選択、プロジェクトフォルダ作成）
  5-7.   台本作成プロンプト実行
  8-12.  特典作成・検証
  13.    キャプション作成（ツール名は英語表記）
  14.    ナレーション整形（ツール名はカタカナ表記）
  15-16. Fish Audio音声生成・修正
  17.    音声トルツメ（trim_with_margin.sh）
  18.    Whisperで文字起こし（タイミング取得）
  19.    SRT作成（generate_srt.py）
  20.    テロップ修正
        ↓
Phase B: Premiere Pro制作（このHANDOFF）
  1. 配置データ生成（generate_placement_json.py）
  2. Premiere Proでプロジェクト作成
  3. 自動配置実行（ExtendScript F5）
  4. SRT字幕読み込み・スタイル適用
  5. 最終調整・書き出し
```

**注意**: Phase Aが完了していない状態でPhase Bを始めない。

---

## 絶対ルール

### やってはいけないこと

1. **Phase A未完了でPhase Bを始めない**
2. **生データをそのまま講座にコピーしない** - 検証済みの内容のみ記載
3. **想定のトラブルシューティングを書かない** - 実際に発生した問題のみ

### やるべきこと

1. **このHANDOFFを最初に読む**
2. **現在の進捗状態を確認する**
3. **作業後はこのHANDOFFを更新する**

---

## 共有素材の場所

| 素材 | パス |
|------|------|
| プロダクション | `C:\Instagramショート\Instagram_Reels_Production\` |
| AIロゴ | `C:\Instagramショート\Instagram_Reels_Production\共有素材\AIロゴ\` |
| アバター動画 | `C:\Instagramショート\Instagram_Reels_Production\共有素材\アバター動画\` |
| BGM | `C:\Instagramショート\Instagram_Reels_Production\共有素材\BGM\` |
| トルツメスクリプト | `C:\engineer-course\scripts\trim_with_margin.sh` |
| Whisper | `C:\Users\tench\anaconda3\Scripts\whisper.exe` |

---

## 重要な発見（2026-01-21）

### テンプレート機能の制限

Premiere Proの「テンプレートとして保存」機能では、以下が新規プロジェクトにコピーされない：

| 項目 | 新規プロジェクトへのコピー |
|------|-------------------------|
| 字幕スタイル | ❌ |
| トラック名 | ❌（消える） |
| 書き出しプリセット | ❌ |
| シーケンス | ❌（空になる） |

**結論**: 「テンプレートとして保存」は使えない → **プロダクション機能を採用**

**詳細**: `content/research/premiere-pro-template-limitations.md`

---

## プロジェクト概要

### 目的

Premiere Proでランキングリール動画を効率的に制作するためのプロダクション環境を構築し、**再現性のある制作フローを講座化する**。

**ゴール**: 今後、誰でもこのガイドに従えば同じ品質のランキングリールを作成できるようにする。固有の手順ではなく、汎用的なワークフローとして確立する。

### 講座構成（確定版）

| モジュール | 内容 | ファイル | 状態 |
|-----------|------|----------|------|
| Module 01 | プロダクション機能でセットアップ（初回のみ） | `module-01-production-setup.md` | **講座化完了** |
| Module 02 | 実践編: ExtendScript自動配置（毎回の制作フロー） | `module-02-practical-workflow.md` | **講座化完了** |

**講座ディレクトリ**: `content/modules/premiere-pro-ranking-reel/`

**注記**: MOGRTモジュールは削除（After Effects不要のため）

### 生データファイル一覧

| ファイル | 内容 | 検証状態 |
|----------|------|----------|
| `content/research/premiere-pro-template-limitations.md` | テンプレート制限と解決策 | **検証済み** |
| `content/research/premiere-pro-template-research.md` | 概要調査・優先順位 | 参考 |
| `content/research/premiere-pro-template-guide-detailed.md` | プロジェクトテンプレート作成手順 | 非採用 |
| `content/research/premiere-pro-srt-import-guide.md` | SRT字幕読み込み手順 | 未検証 |
| `content/research/premiere-pro-mogrt-guide.md` | MOGRT作成手順（AE） | 未検証 |

---

## 現在の進捗

### 事前検証（テンプレート機能）- 完了

従来の「テンプレートとして保存」機能を検証し、制限があることを確認。

**完了した作業**:
- 新規プロジェクト作成
- シーケンス作成（1080x1920, 30fps）
- シーケンスプリセット保存
- トラック名設定（V1-V6, A1-A4）
- 字幕スタイル作成（リール_通常字幕、リール_論外_赤字）
- 書き出しプリセット保存（Instagram_Reels_1080x1920_30fps）
- テンプレートとして保存
- **問題発見**: 新規プロジェクトに設定が引き継がれない

**結論**: プロダクション機能に切り替え

---

### Module 01: プロダクション機能でセットアップ（完了）

#### Phase 1: プロダクション作成

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 1-1 | ファイル → 新規 → プロダクション | **完了** | - |
| 1-2 | プロダクション名入力（Instagram_Reels_Production） | **完了** | - |
| 1-3 | 保存場所選択（C:\Instagramショート\） | **完了** | - |
| 1-4 | プロダクション作成完了 | **完了** | - |

#### Phase 2: 共有プロジェクト作成

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 2-1 | プロダクションパネル → 名称未設定をリネーム | **完了** | - |
| 2-2 | プロジェクト名入力（_SHARED_Resources） | **完了** | - |
| 2-3 | ビン構造作成（00_テンプレート、01_共有素材、02_共有音声、03_字幕スタイル） | **完了** | - |

#### Phase 3: シーケンステンプレート作成

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 3-1 | 新規シーケンス作成（1080x1920, 30fps） | **完了** | - |
| 3-2 | トラック構造設定（V12, A4）※ランキング用 | **完了** | - |
| 3-3 | シーケンス名変更（テンプレート_ランキング） | **完了** | - |

**ランキング用トラック構造:**
- V13: テロップ背景
- V12: 字幕（SRT）
- V11: タイトル・テキスト
- V10: プロンプト・手順（手動配置）
- V9-V6: No1〜No4（順位アイコン）← 自動配置
- V5: ランキングボード/論外 ← 自動配置
- V4: アバター静止画 ← 自動配置（女性発言時）
- V3: アバター動画 ← 自動配置（ループ）
- V2: メイン動画
- V1: 背景・調整レイヤー
- A1: ナレーション ← 自動配置
- A2: 女性ナレーション
- A3: BGM ← 自動配置
- A4: 効果音・SE

#### Phase 4: 字幕スタイル作成

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 4-1 | 既存スタイル流用（事前検証で作成済み） | **完了** | - |
| 4-2 | 通常字幕スタイル（リール_通常字幕） | **完了** | - |
| 4-3 | 論外赤字スタイル（リール_論外_赤字） | **完了** | - |

#### Phase 5: 共有素材配置（オプション）

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 5-1 | 調整レイヤー作成 | 後回し | - |
| 5-2 | カラーマット作成 | 後回し | - |
| 5-3 | 共有素材インポート（任意） | 後回し | - |

#### Phase 6: 動作確認

| ステップ | 内容 | 状態 | スクショ |
|---------|------|------|----------|
| 6-1 | プロダクション内に新規プロジェクト作成 | **完了** | - |
| 6-2 | シーケンステンプレートをドラッグ | **完了** | - |
| 6-3 | 設定が引き継がれることを確認 | **完了** | - |

**Module 01 検証完了**

---

### 参考: MOGRTによるアニメーション再利用（検証済み・講座対象外）

<details>
<summary>クリックして展開</summary>

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | サンプルアニメーション作成（テキスト下からフェードイン） | **完了** |
| Phase 2 | エフェクトプリセットとして保存 | **不可と判明** |
| Phase 3 | MOGRTとして書き出し | **完了** |
| Phase 4 | MOGRTの呼び出しと編集 | **完了** |

**重要な発見:**
- グラフィッククリップ（テキスト）の「ベクトルモーション」はエフェクトプリセットとして保存**不可**（固有プロパティのため）
- テキストアニメーションの再利用は**MOGRT**を使用する
- Premiere Pro 2025では「エッセンシャルグラフィックス」→「**グラフィックテンプレート**」に名称変更

**検証済みワークフロー:**
1. テキストクリップにベクトルモーションでアニメーション設定
2. クリップを右クリック →「モーショングラフィックステンプレートとして書き出し」
3. 名前を付けて保存（保存先: ローカルテンプレートフォルダー）
4. グラフィックテンプレートパネル →「マイテンプレート」から再利用
5. テキスト内容を変更してもアニメーションは維持される

**用途**: 解説系リールのステップ表示、再利用可能なアニメーション
**注記**: After Effects不要、Premiere Pro単体で完結

</details>

---

### Module 02: 実践編（毎回の制作フロー）- 講座化完了

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | プロダクション内に新規プロジェクト作成 | **完了** |
| Phase 2 | シーケンステンプレート複製 | **完了** |
| Phase 3 | 配置データ生成（Python） | **完了** |
| Phase 4 | 素材自動配置（ExtendScript） | **完了** |
| Phase 5 | SRT字幕読み込みとスタイル適用 | **完了** |
| Phase 6 | 最終調整と書き出し | **完了** |

**講座ファイル**: `content/modules/premiere-pro-ranking-reel/module-02-practical-workflow.md`

#### 講座化状況

✅ **完了** - 全Phaseが講座化済み

#### 備考

V10（プロンプト・手順）レイヤーは手動で挿入する。自動配置の対象外。

---

### 残課題（効率化・調整が必要）

| # | 課題 | 詳細 | 解決案 | 状態 |
|---|------|------|--------|------|
| 1 | テロップの間隔精度 | SRTタイミング調整に時間がかかる | `generate_srt.py`（アンカー+按分） | ✅ 解決済み |
| 2 | ナレーションの間隔調整 | 息継ぎ・不要な間のトルツメに時間がかかる | 男性先頭保護ルール（論外2秒、他1秒） | ✅ 解決済み |
| 3 | ランキング画像のサイズ | 各AIツールアイコンのサイズ調整 | 共有フォルダに統一サイズで保存済み | ✅ 解決済み |
| 4 | ランキング画像の配置 | 手動配置に時間がかかる | ExtendScript自動配置 | ✅ 解決済み |
| 5 | メイン動画の配置調整 | 女性がしゃべってる間は静止画を入れる必要あり | V4にアバター静止画レイヤー追加 | ✅ 解決済み |

---

## 共有済みスクリーンショット

**記録ルール**: スクショが共有されるたびに必ず追記する

### Module 01用

| # | パス | 内容（詳細に記載） | Module/Phase/Step | 講座使用 | 備考 |
|---|------|-------------------|-------------------|----------|------|
| 1 | `public/premiere-pro-ranking-reel/module-01-step01-home-screen.png` | Premiere Proホーム画面 | 事前検証 | 可 | - |
| 2 | `public/premiere-pro-ranking-reel/module-01-step02-new-project-dialog.png` | 新規プロジェクトダイアログ | 事前検証 | 参考 | - |
| 3 | `public/premiere-pro-ranking-reel/module-01-step03-project-name-input.png` | プロジェクト名入力 | 事前検証 | 参考 | - |
| 4 | `public/premiere-pro-ranking-reel/module-01-step04-folder-structure.png` | フォルダ構造 | 事前検証 | 参考 | - |
| 5 | `public/premiere-pro-ranking-reel/module-01-step05-import-screen.jpg` | 読み込み画面 | 事前検証 | 不可 | - |
| 6 | `public/premiere-pro-ranking-reel/module-01-step06-empty-project.png` | 空のプロジェクト | 事前検証 | 参考 | - |
| 7 | `public/premiere-pro-ranking-reel/module-03-step01-shared-resources.png` | _SHARED_Resourcesプロジェクトパネル | Module 03/Phase 1/Step 1-1 | 可 | ビン構造確認 |

### Module 02用（2026-01-24追加）

| # | パス | 内容（詳細に記載） | Module/Phase/Step | 講座使用 |
|---|------|-------------------|-------------------|----------|
| 8 | `public/premiere-pro-ranking-reel/module-02-step01-extendscript-search.png` | VSCode拡張機能パネルでExtendScript Debugger検索 | Module 02/Section 4/Step 4-1 | **使用済み** |
| 9 | `public/premiere-pro-ranking-reel/module-02-step02-extendscript-installed.png` | ExtendScript Debugger詳細画面（インストール完了） | Module 02/Section 4/Step 4-1 | **使用済み** |
| 10 | `public/premiere-pro-ranking-reel/module-02-step03-run-debug-panel.png` | VSCode実行とデバッグパネル | Module 02/Section 4/Step 4-2 | **使用済み** |
| 11 | `public/premiere-pro-ranking-reel/module-02-step04-debugger-select.png` | デバッガー選択画面（ExtendScript選択） | Module 02/Section 4/Step 4-2 | **使用済み** |
| 12 | `public/premiere-pro-ranking-reel/module-02-step05-host-application.png` | ホストアプリケーション選択画面（Premiere Pro選択） | Module 02/Section 4/Step 4-2 | **使用済み** |
| 13 | `public/premiere-pro-ranking-reel/module-02-step06-complete-dialog.png` | スクリプト実行完了ダイアログ（成功:5件） | Module 02/Section 5/Step 5-3 | **使用済み** |
| 14 | `public/premiere-pro-ranking-reel/module-02-step07-timeline-result.png` | Premiere Proタイムライン配置結果 | Module 02/Section 5/Step 5-3 | **使用済み** |
| 15 | `public/premiere-pro-ranking-reel/module-02-error-unexpected-source.png` | 「Unexpected source request」エラー | Module 02/トラブルシューティング | **使用済み** |
| 16 | `public/premiere-pro-ranking-reel/module-02-error-debug-session-active.png` | 「debug session is already active」エラー | Module 02/トラブルシューティング | **使用済み** |

### 使用しないスクリーンショット

| パス（元ファイル） | 内容 | 理由 |
|-------------------|------|------|
| `9f47b6b82cd4f1223905222b646d25bb.png` | Premiere Pro「ウィンドウ→エクステンション」メニュー | 講座の文脈と合わない |
| `721d6d98a801b63adce716f783c1bd0d.png` | VSCode .NET SDK/CMake関連通知 | 講座と無関係 |

---

## 発生した問題・解決方法

| 発生箇所 | 問題 | 解決方法 | 講座記載 |
|---------|------|---------|---------|
| テンプレート機能 | 「テンプレートとして保存」で設定が引き継がれない | プロダクション機能を使用 | 要（冒頭で説明） |
| メニュー名 | 「プロジェクトテンプレートとして保存」→実際は「テンプレートとして保存」 | 正しいメニュー名を使用 | - |
| トラック名変更 | 変更方法が分かりにくい | 余白ダブルクリック→右クリック→名前変更 | 要 |
| 書き出しプリセット保存 | 設定変更しないと保存ボタンが有効にならない | 何か設定を変更してから保存 | 要 |
| ベクトルモーション | エフェクトプリセットとして保存できない | MOGRTとして書き出し | 要（重要） |
| パネル名変更 | 「エッセンシャルグラフィックス」が見つからない | Premiere Pro 2025では「グラフィックテンプレート」に名称変更 | 要 |
| ExtendScript実行 | Premiere Pro 2024以降で「ファイル→スクリプト」メニューがない | VSCode + ExtendScript Debugger拡張機能を使用 | 要（重要） |
| ExtendScriptエラー | 「Unexpected source request [object Object]」 | launch.jsonでscriptとhostAppSpecifierを明示的に指定 | 要 |
| デバッグセッション | 「debug session is already active」エラー | Shift+F5で前のセッションを停止してから再実行 | 要 |

---

## 検証時の設定値

### プロダクション構造

```
C:\Instagramショート\Instagram_Reels_Production\
├─ _SHARED_Resources.prproj          ← 共有プロジェクト（素材倉庫）
│  ├─ 📁 00_テンプレート
│  │  ├─ テンプレート_ランキング（V12+A4）
│  │  ├─ テンプレート_解説（今後作成）
│  │  └─ テンプレート_チュートリアル（今後作成）
│  ├─ 📁 01_共有素材
│  │  ├─ ランキングボード（順位板）
│  │  ├─ アバター
│  │  └─ ブランドロゴ
│  ├─ 📁 02_共有音声
│  │  ├─ BGM
│  │  └─ 効果音
│  └─ 📁 03_字幕スタイル（参考用）
│
├─ ランキング_[テーマ]_[日付].prproj  ← 個別プロジェクト
└─ ...
```

**プロダクション機能のポイント:**
- 同じプロダクション内のプロジェクト間で素材を**参照として共有**できる
- `_SHARED_Resources` の素材を更新すれば全プロジェクトに反映される
- 素材の実体は1箇所、重複しない

### シーケンス設定

| 項目 | 設定値 |
|------|--------|
| シーケンス名 | `テンプレート_ランキング` |
| フレームサイズ | 1080 x 1920 |
| フレームレート | 30 fps |
| ビデオトラック数 | 12 |
| オーディオトラック数 | 4 |

### トラック構造（ランキング用）

| トラック | 名前 | 用途 | 自動配置 |
|---------|------|------|----------|
| V13 | テロップ背景 | テロップ背景画像 | ✅ |
| V12 | 字幕 | SRT読み込み | - |
| V11 | タイトル・テキスト | 動画タイトル表示 | ✅ |
| V10 | プロンプト・手順 | ツール紹介時の情報表示 | **手動** |
| V9 | No1 | 1位アイコン（積み重ね） | ✅ |
| V8 | No2 | 2位アイコン（積み重ね） | ✅ |
| V7 | No3 | 3位アイコン（積み重ね） | ✅ |
| V6 | No4 | 4位アイコン（積み重ね） | ✅ |
| V5 | ランキングボード/論外 | 順位板 | ✅ |
| V4 | アバター静止画 | 女性発言時表示 | ✅ |
| V3 | アバター動画 | アバターアニメーション | ✅ |
| V2 | メイン動画 | ランキング説明動画 | - |
| V1 | 背景・調整レイヤー | 背景色、カラーグレーディング | - |
| A1 | ナレーション | 統合音声 | ✅ |
| A2 | 女性ナレーション | 質問・相づち（個別配置時） | - |
| A3 | BGM | 背景音楽 | ✅ |
| A4 | 効果音・SE | 効果音 | - |

**注記**: ランキングアイコンは順番に追加されて最後まで表示し続ける（積み重ね形式）

### 字幕スタイル設定

| スタイル名 | フォント | サイズ | 文字色 | アウトライン |
|-----------|---------|--------|--------|-------------|
| リール_通常字幕 | 源暎ゴシックN Bold | 110 | 白 (#FFFFFF) | 黒 5px |
| リール_論外_赤字 | 源暎ゴシックN Bold | 110 | 赤 (#FF0000) | 黒 5px |

### 書き出しプリセット設定

| 項目 | 値 |
|------|-----|
| プリセット名 | `Instagram_Reels_1080x1920_30fps` |
| 形式 | H.264 |
| サイズ | 1080 x 1920 |
| フレームレート | 30 fps |
| ビットレート | VBR, 2パス, 25/30 Mbps |
| オーディオ | AAC, 320 kbps, 48 kHz |

---

## 現在制作中のリール: 2026年SNSに使えるAIツールランキング

### Phase A（台本作成）- 完了 ✅

| Step | 内容 | 状態 |
|------|------|------|
| 1 | テーマ選択 | ✅ 「2026年SNSに使えるAIツールランキング」 |
| 2-5 | 台本作成 | ✅ Canva(論外)→Nano Banana Pro(2位)→Vrew(4位)→Fish Audio(3位)→Genspark AI(1位) |
| 6-8 | 特典プロンプト生成 | ✅ 2つのプロンプト作成済み |
| 9-10 | 検証 | ✅ Genspark出力例確認、Nano Banana Pro画像4枚確認 |
| 11 | 特典ページ作成 | ✅ `content/gifts/sns-ai-tools-ranking-2026.md` |
| 12 | キャプション作成 | ✅ |
| 13 | ナレーション整形・SRT作成 | ✅ |

### 作成済みファイル（プロジェクトフォルダ）

**プロジェクトフォルダ**: `C:\Instagramショート\Instagram_Reels_Production\ランキング_SNS_AIツール_2026-01-23\`

| ファイル | 内容 |
|----------|------|
| `script.txt` | 元の台本 |
| `narration.txt` | Fish Audio用フォーマット（女性/男性の後に空行） |
| `telop.txt` | テロップテキスト（130行） |
| `caption.txt` | 2026年アルゴリズム対応キャプション |
| `subtitle.srt` | SRT字幕（130エントリ、約82秒） |
| `audio_trimmed/combined_all.mp3` | トルツメ済み統合音声 |
| `audio_trimmed/combined_all.json` | Whisperタイムスタンプ |

### 関連ファイル（engineer-course内）

| ファイル | 内容 |
|----------|------|
| `content/gifts/sns-ai-tools-ranking-2026.md` | 特典ページ（2つのプロンプト収録） |
| `scripts/generate_srt.py` | SRT自動生成スクリプト |

### 音声ファイル一覧

| # | ファイル | 話者 | 内容 |
|---|----------|------|------|
| 01 | `01_female.mp3` | 女性 | Canva？ |
| 02 | `02_male.mp3` | 男性 | 論外説明 |
| 03 | `03_female.mp3` | 女性 | Nano Banana Pro。 |
| 04 | `04_male.mp3` | 男性 | 2位説明 |
| 05 | `05_female.mp3` | 女性 | Vrew。 |
| 06 | `06_male.mp3` | 男性 | 4位説明 |
| 07 | `07_female.mp3` | 女性 | Fish Audio。 |
| 08 | `08_male.mp3` | 男性 | 3位説明 |
| 09 | `09_female.mp3` | 女性 | Genspark AI。 |
| 10 | `10_male.mp3` | 男性 | 1位説明 + CTA |

**ルール**: 話者が切り替わるまでのセリフは1ファイルにまとめる

### 特典ページ情報

- **URL**: `/gift/sns-ai-tools-ranking-2026`
- **収録プロンプト**:
  1. Nano Banana Pro: 商品写真+参考画像でプロ級ビジュアル作成
  2. Genspark AI: 企画→構成→台本→撮影指示→投稿文まで一気通貫

### 台本概要

| 順位 | ツール | ポイント |
|------|--------|----------|
| 論外 | Canva | 無料版はAI画像生成1日3枚まで |
| 2位 | Nano Banana Pro | 完全無料・枚数無制限・テキスト精度99% |
| 4位 | Vrew | テロップ編集10秒、CapCutより精度高い |
| 3位 | Fish Audio | 声登録→自然なアフレコ、読み間違いなし |
| 1位 | Genspark AI | 企画〜投稿文まで一気通貫、出典付き |

---

## 2026-01-23 セッション成果

### 完成したフロー（再現性あり）

| 項目 | 内容 |
|------|------|
| Step 23 | `scripts/generate_srt.py` - アンカーポイント + 文字数按分アルゴリズム |
| Step 19 | 男性ファイル先頭保護ルール（論外2秒、他1秒） |
| キャプション | 2026年アルゴリズム対応 + 自動応答連携戦略 |

### SRT生成スクリプト使用方法

```bash
python C:\engineer-course\scripts\generate_srt.py "{PROJECT_FOLDER}"
```

**アルゴリズム:**
1. JSONセグメントとtelop行の先頭3文字が一致 → アンカーポイント（約67%）
2. アンカー間は文字数で按分
3. 累積ずれなし、ずれは0.1〜0.4秒程度

---

## Premiere Pro側の現在の状態

| 項目 | 値 |
|------|-----|
| プロダクション | `C:\Instagramショート\Instagram_Reels_Production\` |
| 共有プロジェクト | `_SHARED_Resources.prproj` |
| シーケンステンプレート | `テンプレート_ランキング`（V12+A4） |
| 字幕スタイル | `リール_通常字幕`、`リール_論外_赤字` |
| 書き出しプリセット | `Instagram_Reels_1080x1920_30fps` |

**注意**: プロジェクトパネルのビン内に古い同名ファイルが残っているとオフラインになる。スクリプト実行前に確認すること。

---

## Fish Audio 音声生成

### API情報

| 項目 | 値 |
|------|-----|
| Endpoint | `https://api.fish.audio/v1/tts` |
| 認証 | `Authorization: Bearer {API_KEY}` |
| 男性 Voice ID | `b756350f646543bdb0b7e8df76bae3fd` |
| 女性 Voice ID | `88a17a7e26be43209ac73c51544df368` |

### 音声生成コマンド例

```bash
curl -s -X POST "https://api.fish.audio/v1/tts" \
  -H "Authorization: Bearer $FISH_AUDIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "読み上げテキスト", "reference_id": "voice_id"}' \
  -o output.mp3
```

### テキスト整形ルール

| ルール | 内容 |
|--------|------|
| 句読点 | 入れない |
| 改行 | しない（1セグメント1行） |
| 息継ぎ・間隔 | 不要（AIが自然に処理） |
| **例外** | 「論外」の後だけ句読点を入れる（間が欲しいため） |

**詳細**: `docs/archive/ranking-reel-script-guide.md` の「Fish Audio用フォーマット」参照

### 音声生成フロー

1. `narration.txt` を解析して男女パートを分離
2. 句読点・改行を削除（論外の後は例外）
3. 各セグメントごとにFish Audio APIを呼び出し
4. `audio/` フォルダに連番で保存（`01_female.mp3`, `02_male.mp3`, ...）
5. Premiere Proのタイムラインに順番に配置

---

## 画像自動配置機能（ExtendScript）- 部分完成 🔄

### 概要

SRTからツール名の出現タイミングを抽出し、Premiere Proで画像を自動配置する機能。

### 作成したスクリプト

| ファイル | 内容 |
|----------|------|
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro用ExtendScript（画像自動配置） |
| `scripts/premiere/tool_image_mapping.json` | ツール名→画像ファイルのマスターマッピング |
| `scripts/premiere/placement.json` | 配置データ（generate_placement_json.pyで生成） |
| `scripts/generate_placement_json.py` | SRT→placement.json変換スクリプト |

### 使い方（毎回の手順）

#### Step 1: placement.json生成（Python）

```bash
python C:\engineer-course\scripts\generate_placement_json.py "{PROJECT_FOLDER}"
```

例:
```bash
python C:\engineer-course\scripts\generate_placement_json.py "C:\Instagramショート\Instagram_Reels_Production\ランキング_SNS_AIツール_2026-01-23"
```

**処理内容:**
- SRTからツール名の出現タイミングを抽出（完全一致のみ）
- `tool_image_mapping.json`でツール名→画像をマッピング
- トラックは出現順で自動割り当て（V5, V6, V7...）
- `placement.json`を出力

#### Step 2: Premiere Proで実行（ExtendScript）

1. Premiere Proでプロジェクトを開く
2. シーケンスをアクティブにする
3. VSCodeで `C:\engineer-course` フォルダを開く
4. **F5** を押す（または「実行とデバッグ」→「Run in Premiere Pro」）
5. 完了ダイアログで成功件数を確認

### 検出ロジック

- SRT字幕テキストとツール名の**完全一致**のみ検出
- 初回出現のみ（重複除外）
- 例: 「Canva」→ 検出、「有料のCapCut」→ 検出しない

### マスターマッピングの更新

新しいAIツールを追加する場合は `scripts/premiere/tool_image_mapping.json` を編集:

```json
{
  "tools": {
    "ツール名（SRT表記）": "画像ファイル名.png",
    ...
  }
}
```

**参照:** `docs/archive/ai-tool-name-list.md`（SRT表記リスト）

### ExtendScript実行環境セットアップ（初回のみ）

Premiere Pro 2024以降では「ファイル → スクリプト」メニューが削除された。
VSCode + ExtendScript Debugger拡張機能が必要。

#### セットアップ手順

| Step | 内容 | 操作 |
|------|------|------|
| 1 | VSCode拡張機能インストール | 拡張機能パネル（Ctrl+Shift+X）→「ExtendScript Debugger」検索 → Adobe製をインストール |
| 2 | launch.json作成 | 実行とデバッグパネル（Ctrl+Shift+D）→「create a launch.json file」→「ExtendScript」選択 |
| 3 | launch.json編集 | 下記の内容に置き換え |

**launch.json（C:\engineer-course\.vscode\launch.json）:**
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "extendscript-debug",
            "request": "launch",
            "name": "Run in Premiere Pro",
            "script": "${workspaceFolder}/scripts/premiere/place_ranking_images.jsx",
            "hostAppSpecifier": "premierepro-25.0"
        }
    ]
}
```

#### セットアップ時のスクリーンショット

| Step | パス | 内容 |
|------|------|------|
| 1 | `C:\Users\tench\Downloads\9e5998bd9e7d8f995dfe8eb0870f74c5.png` | ExtendScript Debugger検索画面 |
| 2 | `C:\Users\tench\Downloads\bb85ebb01bfa3e8a34fd9a1c9ee06a91.png` | インストール完了画面 |
| 3 | `C:\Users\tench\Downloads\5cffccea5417177662647d7a4361c0c3.png` | 実行とデバッグパネル |
| 4 | `C:\Users\tench\Downloads\7e5a2ca9eec66bc4b8bbec7a807e844f.png` | デバッガー選択（ExtendScript） |
| 5 | `C:\Users\tench\Downloads\e6cd70ffdd123b465bd0ecf1a6889550.png` | ホストアプリケーション選択 |
| 6 | `C:\Users\tench\Downloads\6ff1c8669a7f78288e620d45028640ba.png` | 実行成功ダイアログ |
| 7 | `C:\Users\tench\Downloads\01f12ff8bb9d83ee25e42404ce941f72.png` | タイムラインに画像配置完了 |

### 検証結果

| 日付 | 内容 | 結果 |
|------|------|------|
| 2026-01-24 | Pythonスクリプト動作確認 | ✅ 5件正しく検出 |
| 2026-01-24 | ExtendScript Debuggerセットアップ | ✅ 完了 |
| 2026-01-24 | Premiere Proでの画像自動配置（タイミング） | ✅ 成功（5件配置） |
| 2026-01-24 | 順位検出・CTA開始時間検出 | ✅ 成功 |
| 2026-01-24 | 長さ設定（CTA開始まで） | ✅ 成功 |
| 2026-01-24 | スケール・座標設定 | ✅ **解決**（正規化値で設定） |
| 2026-01-24 | 共有素材配置（telop_back, rankingboard, title_back） | ✅ 成功 |
| 2026-01-24 | アバター静止画配置（V4, 各ツール名タイミング） | ✅ 成功 |
| 2026-01-24 | アバター動画ループ配置（V3） | ✅ 成功（ffmpegで音声削除済み） |
| 2026-01-24 | ナレーション配置（A1） | ✅ 成功 |
| 2026-01-24 | BGM配置（A3） | ✅ 成功（動画音声削除で解決） |

### 自動配置される素材一覧

| カテゴリ | 素材 | トラック | タイミング | 状態 |
|----------|------|----------|------------|------|
| 共有素材 | telop_back.png | V13 | 0s〜CTA | ✅ |
| 共有素材 | telop_cta_back.png | V13 | CTA〜終了 | ✅ |
| 共有素材 | rankingboard.png | V5 | 0s〜CTA | ✅ |
| 共有素材 | title_back.png | V12 | 0s〜終了 | ✅ |
| アバター動画 | u---n.mp4 | V3 | 0.01s〜（動画長） | ✅（音声削除済み） |
| アバター動画 | normal.mp4 | V3 | u---n終了〜CTA ループ | ✅（元々音声なし） |
| アバター動画 | cta.mp4 | V3 | CTA〜終了 ループ | ✅（音声削除済み） |
| アバター静止画 | normal.png | V4 | 各ツール名（5回） | ✅ |
| ランキングアイコン | 5件 | V6〜V10 | 各ツール〜CTA | ✅ |
| ナレーション | combined_all.mp3 | A1 | 0s〜終了 | ✅ |
| BGM | Rise_of_the_New_Team.mp3 | A3 | 0s〜終了 | ✅ |

### 配置結果（ランキングアイコン）

| トラック | 画像 | 時間 | 順位 | Y座標（ピクセル） | 長さ |
|----------|------|------|------|-----------------|------|
| V6 | Canva.png | 0.00s | 論外 | 1525.0 | 74.54s |
| V7 | Nanobanana.png | 15.13s | 2位 | 755.0 | 59.41s |
| V8 | Vrew.png | 34.73s | 4位 | 1265.5 | 39.81s |
| V9 | FishAudio.png | 41.84s | 3位 | 1008.0 | 32.70s |
| V10 | Genspark.png | 54.01s | 1位 | 494.5 | 20.53s |

### 座標設定の解決方法（重要）

**問題**: ExtendScriptで`setValue([x, y])`にピクセル値を渡すと32767.0になる

**原因**: Premiere Pro 2020以降、位置プロパティは正規化値（0〜1）を期待する

**解決**: ピクセル値を正規化値に変換してから設定
```javascript
var normalizedX = xPos / 1080;  // フレーム幅で割る
var normalizedY = yPos / 1920;  // フレーム高さで割る
prop.setValue([normalizedX, normalizedY], true);
```

**参考リンク:**
- [setValue fails in Position property - Adobe Community](https://community.adobe.com/t5/premiere-pro-discussions/setvalue-fails-in-position-property/td-p/10789155)

### 残課題

なし（全て解決済み）

### 解決済み課題: 動画音声のBGM上書き問題（2026-01-24）

**問題**: `overwriteClip()`でアバター動画を配置すると、動画の音声がA3（BGM）を上書きしてしまう。

**原因**: Premiere Proは動画配置時に音声を空いているオーディオトラックに自動配置する。

**解決策**: ffmpegで動画から音声を事前に削除（映像は再エンコードなし）

```bash
# 音声削除コマンド（映像品質100%維持）
ffmpeg -i input.mp4 -c:v copy -an output.mp4
```

**実施した作業:**
```bash
cd "C:\Instagramショート\Instagram_Reels_Production\共有素材\アバター動画"
# 元ファイルをバックアップ
Rename-Item 'u---n.mp4' 'u---n_original.mp4'
Rename-Item 'cta.mp4' 'cta_original.mp4'
# 音声なし版を元の名前にリネーム
Rename-Item 'u---n_noaudio.mp4' 'u---n.mp4'
Rename-Item 'cta_noaudio.mp4' 'cta.mp4'
```

**結果:**
| ファイル | 状態 |
|----------|------|
| u---n.mp4 | 音声なし（スクリプト用） |
| u---n_original.mp4 | バックアップ（音声あり） |
| cta.mp4 | 音声なし（スクリプト用） |
| cta_original.mp4 | バックアップ（音声あり） |
| normal.mp4 | 元々音声なし（変更不要） |

**注意点**: プロジェクトパネルのビン内に古い同名ファイルが残っていると、ExtendScriptがそちらを参照してオフラインになる。スクリプト実行前に同名ファイルがないか確認すること。

---

## 関連ファイル

| ファイル | 内容 | 優先度 |
|----------|------|--------|
| `content/HANDOFF-reel-kata.md` | **リールの型定義（親HANDOFF）** | **必読** |
| `docs/archive/ranking-reel-script-guide.md` | **台本作成フロー（13ステップ）** | **必読** |
| `content/scripts/ranking-sns-ai-tools-2026/` | **今回の台本・キャプション・SRT** | **Phase B用** |
| `content/gifts/sns-ai-tools-ranking-2026.md` | **今回の特典ページ** | 参考 |
| `content/research/premiere-pro-template-limitations.md` | テンプレート制限と解決策 | 参考 |
| `content/CONTENT-GUIDE.md` | 講座作成ルール | 参考 |

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2026-01-21 | 初版作成。生データ読み込み完了 |
| 2026-01-21 | テンプレート機能の検証完了。制限を発見 |
| 2026-01-21 | 講座構成をプロダクション機能ベースに変更 |
| 2026-01-21 | **Module 01（プロダクション機能セットアップ）検証完了** |
| 2026-01-21 | **Module 02（アニメーションプリセット）検証完了** - ベクトルモーションはプリセット不可、MOGRTで解決 |
| 2026-01-21 | **関連HANDOFFと必読ガイドセクション追加** - 親HANDOFF（reel-kata）と台本作成フロー（ranking-reel-script-guide）への参照を明記。全体フローを図示 |
| 2026-01-21 | **Phase A（台本作成）完了** - 「2026年SNSに使えるAIツールランキング」の台本・特典・キャプション・SRT作成完了 |
| 2026-01-22 | **Fish Audio音声生成追加** - 10セグメントの音声ファイル生成。API情報をHANDOFFに追記 |
| 2026-01-22 | **テキスト整形ルール追加** - 句読点なし・改行なし（論外のみ例外）。ガイドにも追記済み |
| 2026-01-22 | **Module 03進捗更新** - Phase 1〜6完了、V10レイヤー未着手。残課題4件を記載 |
| 2026-01-23 | **SRT生成フロー完成** - `scripts/generate_srt.py`作成。アンカーポイント+文字数按分アルゴリズム |
| 2026-01-23 | **トルツメルール追加** - 男性ファイル先頭保護（論外2秒、他1秒） |
| 2026-01-23 | **キャプション更新** - 2026年アルゴリズム対応、自動応答連携戦略 |
| 2026-01-23 | **プロジェクトフォルダ整理** - 全ファイルを正しい場所に配置 |
| 2026-01-24 | **画像自動配置機能追加** - SRT→placement.json変換、ExtendScript作成。Pythonスクリプト動作確認済み |
| 2026-01-24 | **ExtendScript実行環境セットアップ完了** - VSCode+ExtendScript Debugger。launch.json設定確定 |
| 2026-01-24 | **画像自動配置 タイミング・長さ検証完了** - 5件の画像を正しいタイミング・長さで配置成功 |
| 2026-01-24 | **順位検出・CTA検出追加** - SRTから順位を検出してY座標を設定、「今日紹介した」でCTA開始時間を取得 |
| 2026-01-24 | **台本ガイド更新** - CTAは必ず「今日紹介した」で始めるルール追加 |
| 2026-01-24 | **座標設定の問題発覚** - ExtendScriptでスケール・座標を設定すると32767.0になる問題。次セッションで調査 |
| 2026-01-24 | **座標設定問題を解決** - 位置を正規化値（0〜1）に変換することで解決。全5件が正しい位置に配置成功 |
| 2026-01-24 | **トラック構造更新** - V4にアバター静止画レイヤー追加、ランキングアイコンをV6〜V10に変更 |
| 2026-01-24 | **素材自動配置機能を大幅拡張** - 共有素材・アバター静止画・アバター動画・ナレーション・BGMに対応 |
| 2026-01-24 | **アバター動画ループ配置実装** - u---n.mp4（イントロ）→ normal.mp4（ループ）→ cta.mp4（ループ）の連続配置 |
| 2026-01-24 | **動画音声の上書き問題発覚** - overwriteClip()で動画配置時、音声がBGM（A3）を上書き。次セッションで対応 |
| 2026-01-24 | **動画音声の上書き問題を解決** - ffmpegで音声を事前削除（`-c:v copy -an`）。u---n.mp4とcta.mp4を音声なし版に差し替え |
| 2026-01-24 | **講座化完了** - Module 01（プロダクションセットアップ）、Module 02（実践編）を `content/modules/premiere-pro-ranking-reel/` に作成 |
| 2026-01-24 | **Module 02講座にスクショ追加** - CONTENT-GUIDEに従い、セクション4/5/トラブルシューティングに9枚のスクリーンショットを追加。実際の検証結果に基づいた内容に修正 |

---

**最終更新**: 2026-01-24
**状態**: フロー確立済み・講座化完了

**次に新しいランキングリールを作る場合**: 「新規ランキングリール制作フロー」セクションに従う
