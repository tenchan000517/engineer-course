---
title: "スクリプトで素材を自動配置する"
order: 2
duration: "20分"
difficulty: "⭐⭐⭐☆☆"
---

# スクリプトで素材を自動配置する

**所要時間**: 20分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- 毎回のランキングリール制作フロー
- PythonでSRTから配置データを生成する方法
- ExtendScriptで素材を自動配置する方法
- VSCode + ExtendScript Debuggerの使い方

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- プロダクション内で新規プロジェクトを作成し、テンプレートを活用できる
- `generate_placement_json.py` でSRTから配置データを生成できる
- `place_ranking_images.jsx` で素材を自動配置できる
- VSCodeからExtendScriptを実行できる

---

## 目次

- [セクション1: 事前準備](#セクション1-事前準備)
- [セクション2: 新規プロジェクト作成](#セクション2-新規プロジェクト作成)
- [セクション3: 配置データを生成する](#セクション3-配置データを生成する)
- [セクション4: ExtendScript実行環境セットアップ](#セクション4-extendscript実行環境セットアップ)
- [セクション5: 自動配置を実行する](#セクション5-自動配置を実行する)
- [セクション6: SRT字幕を読み込む](#セクション6-srt字幕を読み込む)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01で作成したプロダクション環境
- Python 3.x
- VSCode + ExtendScript Debugger拡張機能
- 以下のファイルが準備済み：
  - `subtitle.srt` - SRT字幕ファイル
  - `combined_all.mp3` - トルツメ済みナレーション音声
  - AIロゴ画像（共有素材フォルダ内）

### フォルダ構成

```
{YOUR_PRODUCTION_PATH}/
├── _SHARED_Resources.prproj      ← 共有プロジェクト
├── 共有素材/
│   ├── AIロゴ/                   ← ランキングアイコン
│   ├── ランキングボード/          ← 背景素材
│   ├── アバター動画/              ← アバターMP4
│   ├── アバター静止画/            ← アバターPNG
│   └── BGM/                      ← 背景音楽
└── {PROJECT_NAME}/               ← 個別プロジェクトフォルダ
    ├── subtitle.srt
    ├── audio_trimmed/
    │   └── combined_all.mp3
    └── ...
```

### アバター動画の音声削除（重要）

Premiere Proの `overwriteClip()` は動画配置時に音声も自動配置するため、BGMを上書きしてしまいます。

アバター動画から音声を削除してください（映像品質は維持されます）：

```bash
ffmpeg -i "{YOUR_AVATAR_VIDEO_PATH}/u---n.mp4" -c:v copy -an "{YOUR_AVATAR_VIDEO_PATH}/u---n_noaudio.mp4"
ffmpeg -i "{YOUR_AVATAR_VIDEO_PATH}/cta.mp4" -c:v copy -an "{YOUR_AVATAR_VIDEO_PATH}/cta_noaudio.mp4"
```

処理後、元ファイルをバックアップしてリネーム：

```powershell
cd "{YOUR_AVATAR_VIDEO_PATH}"
Rename-Item 'u---n.mp4' 'u---n_original.mp4'
Rename-Item 'cta.mp4' 'cta_original.mp4'
Rename-Item 'u---n_noaudio.mp4' 'u---n.mp4'
Rename-Item 'cta_noaudio.mp4' 'cta.mp4'
```

---

## セクション1: 事前準備

### Step 1-1: スクリプトファイルを確認

以下のスクリプトが必要です：

| ファイル | 用途 |
|----------|------|
| `scripts/generate_placement_json.py` | SRT→配置データ変換 |
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro自動配置 |
| `scripts/premiere/tool_image_mapping.json` | ツール名→画像マッピング |

### Step 1-2: ツール名マッピングを確認

`tool_image_mapping.json` にランキングで使用するツール名と画像ファイル名の対応を設定します：

```json
{
  "tools": {
    "Canva": "Canva.png",
    "Nano Banana": "Nanobanana.png",
    "Vrew": "Vrew.png",
    "Fish Audio": "FishAudio.png",
    "Genspark": "Genspark.png"
  }
}
```

新しいツールを追加する場合は、このファイルを編集してください。

### チェックポイント

- [ ] スクリプトファイルが存在する
- [ ] `tool_image_mapping.json` に使用するツールが登録されている

---

## セクション2: 新規プロジェクト作成

### Step 2-1: プロダクションを開く

1. Premiere Proを起動
2. **ファイル** → **プロダクションを開く** を選択
3. `{YOUR_PRODUCTION_PATH}` を選択

### Step 2-2: 共有プロジェクトを開く

1. プロダクションパネルで `_SHARED_Resources` をダブルクリック

_SHARED_Resourcesのプロジェクトパネル：

![_SHARED_Resourcesプロジェクトパネル](/premiere-pro-ranking-reel/module-03-step01-shared-resources.png)

### Step 2-3: 新規プロジェクトを作成

1. **ファイル** → **新規** → **プロジェクト** を選択
2. プロジェクト名を入力（例: `ランキング_SNS_AIツール_2026-01-24`）
3. 保存先はプロダクションフォルダ内（自動選択）

### Step 2-4: シーケンステンプレートを複製

1. `_SHARED_Resources` → `00_テンプレート` → `テンプレート_ランキング` を選択
2. 新規プロジェクトにドラッグ＆ドロップ
3. シーケンス名を変更（例: `SNS_AIツール_ランキング`）

### チェックポイント

- [ ] 新規プロジェクトがプロダクション内に作成された
- [ ] シーケンステンプレートが複製された

---

## セクション3: 配置データを生成する

### Step 3-1: placement.jsonを生成

Pythonスクリプトを実行してSRTから配置データを生成します。

```bash
python "{YOUR_SCRIPTS_PATH}/generate_placement_json.py" "{YOUR_PROJECT_FOLDER}"
```

**例:**
```bash
python C:\engineer-course\scripts\generate_placement_json.py "C:\Instagramショート\Instagram_Reels_Production\ランキング_SNS_AIツール_2026-01-24"
```

### Step 3-2: 生成された配置データを確認

`scripts/premiere/placement.json` が生成されます。内容を確認：

```json
[
  {
    "type": "ranking",
    "tool": "Canva",
    "rank": "論外",
    "path": "...",
    "time": 0.0,
    "duration": 74.54,
    "track": "V6",
    "scale": 28.5,
    "x": 320.5,
    "y": 1525.0
  },
  ...
]
```

### 配置される素材一覧

| カテゴリ | 素材 | トラック | 説明 |
|----------|------|----------|------|
| 共有素材 | telop_back.png | V13 | テロップ背景 |
| 共有素材 | rankingboard.png | V5 | ランキングボード |
| 共有素材 | title_back.png | V12 | タイトル背景 |
| アバター動画 | u---n.mp4 | V3 | イントロアバター |
| アバター動画 | normal.mp4 | V3 | 通常アバター（ループ） |
| アバター動画 | cta.mp4 | V3 | CTAアバター（ループ） |
| アバター静止画 | normal.png | V4 | 女性発言時表示 |
| ランキングアイコン | 各AIロゴ | V6〜V10 | ツール登場時〜CTA開始まで |
| ナレーション | combined_all.mp3 | A1 | 統合音声 |
| BGM | Rise_of_the_New_Team.mp3 | A3 | 背景音楽 |

### チェックポイント

- [ ] `placement.json` が生成された
- [ ] 検出されたツール数が正しい

---

## セクション4: ExtendScript実行環境セットアップ

Premiere Pro 2024以降では「ファイル → スクリプト」メニューが削除されました。VSCode + ExtendScript Debugger拡張機能を使用してスクリプトを実行します。

### Step 4-1: VSCode拡張機能をインストール

1. VSCodeを開く
2. 拡張機能パネル（Ctrl+Shift+X）を開く
3. 検索ボックスに「ExtendScript Debugger」と入力

拡張機能の検索結果：

![ExtendScript Debugger検索結果](/premiere-pro-ranking-reel/module-02-step01-extendscript-search.png)

4. **Adobe製**（130K以上ダウンロード）の「ExtendScript Debugger」を選択
5. 「インストール」ボタンをクリック

インストール完了後の画面：

![ExtendScript Debuggerインストール完了](/premiere-pro-ranking-reel/module-02-step02-extendscript-installed.png)

「無効にする」「アンインストール」ボタンが表示されていれば、インストール成功です。

### Step 4-2: launch.jsonを作成

1. VSCodeでスクリプトフォルダ（`C:\engineer-course`）を開く
2. 左サイドバーの「実行とデバッグ」アイコン（Ctrl+Shift+D）をクリック

実行とデバッグパネル：

![実行とデバッグパネル](/premiere-pro-ranking-reel/module-02-step03-run-debug-panel.png)

3. 「create a launch.json file」リンクをクリック
4. デバッガー選択で「**ExtendScript**」を選択

デバッガー選択画面：

![デバッガー選択](/premiere-pro-ranking-reel/module-02-step04-debugger-select.png)

5. ホストアプリケーション選択で「**Adobe Premiere Pro premierepro-25.0**」を選択

ホストアプリケーション選択画面：

![ホストアプリケーション選択](/premiere-pro-ranking-reel/module-02-step05-host-application.png)

### Step 4-3: launch.jsonを編集

自動生成された `.vscode/launch.json` を以下の内容に置き換えます。**script** パスを正しく設定することが重要です。

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

**hostAppSpecifier の値:**
| Premiere Proバージョン | 値 |
|----------------------|-----|
| Premiere Pro 2025 | `premierepro-25.0` |
| Premiere Pro 2024 | `premierepro-24.0` |

### チェックポイント

- [ ] ExtendScript Debugger拡張機能がインストールされている（「無効にする」ボタンが表示）
- [ ] launch.jsonが `.vscode` フォルダに作成されている
- [ ] `script` パスが正しいスクリプトファイルを指している

---

## セクション5: 自動配置を実行する

### Step 5-1: Premiere Proでシーケンスをアクティブにする

1. Premiere Proで新規プロジェクトを開く
2. 複製したシーケンスをダブルクリックしてアクティブにする
3. タイムラインパネルにシーケンスが表示されていることを確認

**重要**: シーケンスがアクティブでない状態でスクリプトを実行するとエラーになります。

### Step 5-2: ExtendScriptを実行

1. VSCodeでスクリプトフォルダ（`C:\engineer-course`）を開く
2. **F5** を押す（または「実行とデバッグ」→「Run in Premiere Pro」）
3. Premiere Proに接続され、スクリプトが実行される
4. 完了ダイアログが表示されるまで待つ（数秒〜十数秒）

### Step 5-3: 配置結果を確認

スクリプト実行完了ダイアログ：

![完了ダイアログ](/premiere-pro-ranking-reel/module-02-step06-complete-dialog.png)

「成功: 5件」と表示されれば、ランキングアイコン5件が正常に配置されています。

タイムラインの配置結果：

![タイムライン配置結果](/premiere-pro-ranking-reel/module-02-step07-timeline-result.png)

上記のように、各トラックに素材が配置されます：

| トラック | 内容 |
|----------|------|
| V9 (No1) | Genspark.png（1位） |
| V8 (No2) | FishAudio.png（2位相当） |
| V7 (No3) | Vrew.png（3位相当） |
| V6 (No4) | Nanobanana.png（4位相当） |
| V5 (論外) | Canva.png |
| V4 | ランキングボード |
| V3 | アバター動画 |
| A1 | ナレーション音声（波形が表示） |

### チェックポイント

- [ ] 「完了!」ダイアログで「成功: 5件」と表示された
- [ ] タイムラインにランキングアイコンが時系列順に配置されている
- [ ] ナレーション音声の波形がA1トラックに表示されている
- [ ] 再生してBGMが正常に聞こえる

---

## セクション6: SRT字幕を読み込む

### Step 6-1: SRTファイルをインポート

1. **ファイル** → **読み込み** を選択
2. `subtitle.srt` を選択
3. インポートオプションで「キャプションとしてインポート」を選択

### Step 6-2: 字幕トラックに配置

1. インポートされたキャプションをV12トラックにドラッグ
2. シーケンスの先頭に配置

### Step 6-3: 字幕スタイルを適用

1. キャプションを選択
2. テキストパネル → トラックスタイル → `リール_通常字幕` を選択
3. 「論外」など強調したい部分は `リール_論外_赤字` を適用

### チェックポイント

- [ ] SRT字幕がV12に配置されている
- [ ] 字幕スタイルが適用されている

---

## トラブルシューティング

### ExtendScript実行時に「Unexpected source request」エラー

**問題**: VSCodeでF5を押すと以下のエラーが表示される

エラー画面：

![Unexpected source requestエラー](/premiere-pro-ranking-reel/module-02-error-unexpected-source.png)

**原因**: launch.jsonで `script` パスまたは `hostAppSpecifier` が正しく設定されていない

**解決方法**: launch.jsonで `script` と `hostAppSpecifier` を明示的に指定する

```json
{
    "script": "${workspaceFolder}/scripts/premiere/place_ranking_images.jsx",
    "hostAppSpecifier": "premierepro-25.0"
}
```

### 「debug session is already active」エラー

**問題**: スクリプトを再実行しようとすると、以下のエラーダイアログが表示される

エラーダイアログ：

![debug session is already activeエラー](/premiere-pro-ranking-reel/module-02-error-debug-session-active.png)

**原因**: 前回のデバッグセッションが終了していない

**解決方法**:
1. **Shift+F5** を押して前のセッションを停止
2. 再度 **F5** を押してスクリプトを実行

### 素材が「オフライン」と表示される

**問題**: 配置した素材が「メディアオフライン」と表示される

**原因**: プロジェクトパネルのビン内に古い同名ファイルが残っている

**解決方法**:
1. プロジェクトパネルで同名ファイルが複数ないか確認
2. ビン内に古いファイルが残っている場合は削除
3. スクリプトを再実行

### BGMが聞こえない

**問題**: BGMが再生されない、または動画音声だけが聞こえる

**原因**: アバター動画の音声がBGMトラックを上書きしている

**解決方法**: アバター動画（u---n.mp4、cta.mp4）から音声を削除してください（事前準備セクション参照）

```bash
ffmpeg -i input.mp4 -c:v copy -an output.mp4
```

---

## まとめ

### このモジュールで学んだこと

- プロダクション内での新規プロジェクト作成フロー
- `generate_placement_json.py` でSRTから配置データを生成する方法
- VSCode + ExtendScript Debuggerの設定方法
- `place_ranking_images.jsx` で素材を自動配置する方法
- SRT字幕の読み込みとスタイル適用

### 毎回の制作フロー（まとめ）

```
1. プロダクションを開く
2. _SHARED_Resources を開く
3. ファイル → 新規 → プロジェクト
4. シーケンステンプレートをドラッグ
5. Python: generate_placement_json.py 実行
6. VSCode: F5 でExtendScript実行
7. SRT字幕を読み込み、スタイル適用
8. 最終調整 → 書き出し
```

---

## 参考資料

- [Adobe ExtendScript Debugger for VS Code](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug)
- [Premiere Pro ExtendScript API](https://ppro-scripting.docsforadobe.dev/)

---

## よくある質問

**Q: Premiere Pro 2024以降で「ファイル→スクリプト」メニューがありません**
A: Premiere Pro 2024以降では「ファイル→スクリプト」メニューが削除されました。VSCode + ExtendScript Debugger拡張機能を使用してください。

**Q: placement.jsonを手動で編集できますか？**
A: はい、JSONファイルなので手動編集可能です。配置時間、トラック、座標などを調整できます。

**Q: 新しいAIツールを追加するにはどうすればいいですか？**
A: `tool_image_mapping.json` にツール名と画像ファイル名の対応を追加し、画像ファイルを共有素材フォルダに配置してください。

**Q: ランキングの順位を変更したい場合は？**
A: SRTファイルの順位表記（「1位」「2位」など）を変更すると、`generate_placement_json.py` がY座標を自動計算します。

**Q: 自動配置後に手動で調整できますか？**
A: はい、自動配置は初期配置を行うだけなので、その後タイムライン上で自由に調整できます。
