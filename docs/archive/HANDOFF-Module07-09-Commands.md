# 引き継ぎ: Module 07-09 コマンド検証

## タスク概要

Nanobanana画像生成講座の Module 07, 08, 09 を検証するために、各モジュールのジェネレータからコマンドを抽出して実行する。

## 現在の状況

- Module 07-09 のマークダウンファイルにジェネレータが追加済み
- コマンド一覧ドキュメント `/mnt/c/engineer-course/docs/archive/PROMPT-Nanobanana-Module07-09.md` が作成済み
- **問題**: 一括実行形式（`&&`連結）になっていない

## やるべきこと

1. `/mnt/c/engineer-course/docs/archive/PROMPT-Nanobanana-Module07-09.md` を修正
2. 以下のルールに従って一括実行可能な形式にする

## ルール

### 実行順序の制約

**事前準備**と**本番**は別々に実行する必要がある。
理由: 本番では事前準備で生成した画像を参照画像として使用するため。

### コマンド形式

- **参照画像なし**: `python generate_image.py "プロンプト" ファイル名.png アスペクト比`
- **参照画像あり**: `python generate_image.py "プロンプト" --ref 参照画像 --out ファイル名.png --ratio アスペクト比`

### 一括実行形式

同じステップ内のコマンドは `&&` で連結:

```
python generate_image.py "..." file1.png 16:9 && python generate_image.py "..." file2.png 1:1 && python generate_image.py "..." file3.png 3:4
```

### Module 07 の構成

**Step 1: 事前準備（参照画像なし）**
- sample_portrait.png (3:4)
- sample_outdoor.png (4:3)
- sample_formal.png (3:4)

**Step 2: ファイルコピー（Windows）**
```
copy sample_portrait.png selfie.jpg && copy sample_portrait.png original_photo.jpg && ...
```

**Step 3以降: 本番（参照画像あり）**
- セクション2-3, 4-1〜4-3, 5-1〜5-5 は参照画像を使用

### Module 08, 09 の構成

全て参照画像なしなので、セクションごとに一括実行可能。

## 参考ファイル

- Module 06 形式: `/mnt/c/engineer-course/docs/archive/PROMPT-Nanobanana.md`
- Module 07 ソース: `/mnt/c/engineer-course/content/modules/nanobanana-beginner/module-07-photo-text-editing.md`
- Module 08 ソース: `/mnt/c/engineer-course/content/modules/nanobanana-beginner/module-08-business-content.md`
- Module 09 ソース: `/mnt/c/engineer-course/content/modules/nanobanana-beginner/module-09-diagrams-infographics.md`

## 作業場所

`C:\nanobanana\` で実行

## コードブロック禁止

出力ドキュメントには ``` を使わない。コマンドは直接記述する。
