# 引継ぎ: n8nワークフロー「ゆめマガ文字起こし v2」ループ問題

**作成日**: 2025-12-17
**ステータス**: 未解決

---

## ワークフロー概要

**目的**: 音声ファイルをWhisperで文字起こし → Geminiで整形 → Google Driveにアップロード

**ファイル**: `/mnt/c/Users/tench/Downloads/ゆめマガ文字起こし v2.json`

---

## 成功している部分

- Whisperでの文字起こし
- Geminiの呼び出し
- Google Driveへの保存（文字起こしフォルダ、原稿フォルダ両方）
- カテゴリAの処理は正常に完了

---

## 問題の症状

1. カテゴリAのファイルは正常に処理された
2. カテゴリIのファイルが処理されない
3. If Already Exists が常に True になる（本来はFalseになるべき）
4. カテゴリIの文字起こしフォルダには該当ファイルが存在しない（つまりスキップされるべきではない）

---

## ワークフローの構造

```
Form Trigger
    ↓
Get Sheet Data (20 items)
    ↓
Extract Folder IDs from URLs (4 items: A, H, I, K)
    ↓
If Has Data
    ↓
Loop Categories ←──────────────────────────────────────┐
    ↓                                                  │
Get Audio Files                                        │
    ↓                                                  │
Filter Audio Files                                     │
    ↓                                                  │
If Has Audio ─── false ────────────────────────────────┤
    │ true                                             │
    ↓                                                  │
Loop Audio Files ←─────────────────────────┐           │
    │ done ────────────────────────────────│───────────┘
    │ loop                                 │
    ↓                                      │
Prepare File Names                         │
    ↓                                      │
Check Existing (Google Drive検索)          │
    ↓                                      │
Check If Exists                            │
    ↓                                      │
If Already Exists ─── true ───→ Skip File ─┤
    │ false                                │
    ↓                                      │
Download Audio                             │
    ↓                                      │
Save Audio                                 │
    ↓                                      │
Execute Whisper                            │
    ↓                                      │
Read Whisper Output                        │
    ↓                                      │
Prepare for Gemini                         │
    ↓                                      │
Gemini                                     │
    ↓                                      │
Extract Gemini Result                      │
    ↓                                      │
Prepare Upload                             │
    ↓                                      │
Upload Raw (文字起こし) ──┬                │
Upload Organized (原稿) ──┘                │
    ↓                                      │
Log Complete ──────────────────────────────┘
```

---

## データフローの事実

### 各ノードのアイテム数

| ノード | アイテム数 |
|--------|-----------|
| Get Sheet Data | 20 items |
| Extract Folder IDs from URLs | 4 items (A, H, I, K) |
| Filter Audio Files | 4 items total |
| If Has Audio | 3 items total |
| Loop Audio Files | 入力時3アイテム → 出力時1アイテムずつ |

### 抽出されたカテゴリ情報

```
A: recordingFolderId=1Hf4opCqTnEQhPL2ga8IPHyNVFOqCxF4w, transcriptionFolderId=1s5qnRSrFSbfK4N_kKNAzKfzoRmNlECY0
H: recordingFolderId=1ZRxgVn3_UJkMOcNghzGlPqJ_PIoFvRgf, transcriptionFolderId=1tv4UY0Ww77Nb_9gJbu1CCCzNXmSpkQ6e
I: recordingFolderId=1gFNPjr9kqly6_Z2Inm7RwPDJasfRn4xq, transcriptionFolderId=1wRXgUkKZKyGZ5UJ3Uf1NjNCdqLKXK11l
K: recordingFolderId=1Cw8zIvD5jB17_2eLEfkZD-UopHHLDyLJ, transcriptionFolderId=1rsDKGl9iyLiRMY48Qe4uT7HLL88uiG6R
```

### 音声ファイル

- カテゴリA: 東海樟風インタビュー20251211.m4a（1ファイル）
- カテゴリH: なし
- カテゴリI: 西枇工業 対談 20251203.m4a（1ファイル）
- カテゴリK: なし

---

## 問題の特定経緯

### ユーザーの分析

1. 「If Has Audioの時点では3アイテムが渡っている」
2. 「Loop Audio Filesで3アイテムが1アイテムになる」（Split in Batchesが1つずつ処理）
3. 「一生この1アイテムを参照し続けている事が問題」
4. 「コードの問題ではなくループの接続箇所が違うのでは？」

### 確認された事実

- Check If Existsで `$('Prepare File Names').first()` を使用している
- この `.first()` は、現在のイテレーションではなく、ワークフロー全体で最初に実行されたPrepare File Namesの結果を返す
- カテゴリIの処理時も、カテゴリAのtxtFileName（東海樟風インタビュー20251211.txt）で検索してしまう
- カテゴリAのファイルは既に存在するので、alreadyExists: true になる

---

## ユーザーからの最後の問い（未回答）

「Loop Audio Filesのdone時点で失われている情報とは？」

- Loop Audio Filesのdone = If Has Audioから渡された3アイテム全ての処理が完了した状態
- この時点で何の情報が失われているかは特定できていない

---

## 試行済みの解決策（全て失敗）

1. Check If Existsで `$('Prepare File Names').first()` → `$('Prepare File Names').item` に変更
   - 結果: 「Run Once for All Items」モードでは `.item` は使用不可

2. Check If Existsを「Run Once for Each Item」モードに変更し `.item` を使用
   - 結果: `$input.all()` が使用不可になる

3. `$execution.customData` でデータを保存・参照
   - 結果: 動作せず

4. `$('Loop Audio Files').first()` で直接参照
   - 結果: 動作せず

---

## 接続情報（JSONより抽出）

### Loop Audio Filesの接続

```json
"Loop Audio Files": {
  "main": [
    [{ "node": "Loop Categories", "type": "main", "index": 0 }],  // Output 0 (Done)
    [{ "node": "Prepare File Names", "type": "main", "index": 0 }]  // Output 1 (Loop)
  ]
}
```

### If Has Audioの接続

```json
"If Has Audio": {
  "main": [
    [{ "node": "Loop Audio Files", "type": "main", "index": 0 }],  // True branch
    [{ "node": "Loop Categories", "type": "main", "index": 0 }]   // False branch
  ]
}
```

### Skip Fileの接続

```json
"Skip File": {
  "main": [
    [{ "node": "Loop Audio Files", "type": "main", "index": 0 }]
  ]
}
```

### Log Completeの接続

```json
"Log Complete": {
  "main": [
    [{ "node": "Loop Audio Files", "type": "main", "index": 0 }]
  ]
}
```

---

## 関連ファイル

| ファイル | 内容 |
|---------|------|
| `/mnt/c/Users/tench/Downloads/ゆめマガ文字起こし v2.json` | 現在のワークフローJSON |
| `/mnt/c/engineer-course/content/HANDOFF-yumemaga-automation.md` | 全体の引継ぎドキュメント |

---

## 認証情報ID

| サービス | Credential ID |
|---------|---------------|
| Google Drive | TfNZ8jSb3HyhfHWF |
| Google Sheets | 3KFmyH23tY8tVoe2 |
| Google Gemini | rdz0MVIRIHU5NIjD |

---

## 次のセッションへの指示

1. 「Loop Audio Filesのdone時点で失われている情報」を特定すること
2. ユーザーは「接続箇所が違う」と指摘している（コードの問題ではない）
3. 仮説や憶測ではなく、事実に基づいて問題を分析すること
