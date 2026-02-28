# HANDOFF - Module 08 Session 10

## セッション概要

**日時**: 2025-12-13
**作業内容**: 音声合成ワークフロー v3 のデバッグ（継続中）

---

## 未解決の問題（2件）

### 問題1: カテゴリがループしない

**症状**:
- カテゴリAを処理 → ワークフロー完了
- カテゴリBを処理 → ワークフロー完了
- 5カテゴリ（A〜E）を順番に処理するはずが、1カテゴリで終了する

**原因の経緯**:

元々の問題は「無限ループ」だった：
- Loop Over Items の done出力 → Loop Sheets の入力に接続
- カテゴリAが終わると、Loop Sheets がリセットされてカテゴリAを再度処理
- 永遠にカテゴリAだけを繰り返す

Session 9-10 で試した修正：
- Loop Over Items の done出力 → **何も接続しない**
- 結果：無限ループは解消したが、カテゴリAが終わるとワークフロー自体が終了

**現状の接続**:
```
Loop Over Items
├─ Output 0 (done): 何も接続されていない ← ここが問題
└─ Output 1 (loop): Search Video File に接続
```

**未検証のアイデア**:
- Split In Batches の「Reset」オプションを確認・無効化
- ただしユーザー曰く「うーーーんなんか違うな」とのこと

**期待する動作**:
```
カテゴリA処理 → カテゴリB処理 → カテゴリC処理 → カテゴリD処理 → カテゴリE処理 → 完了
```

---

### 問題2: カテゴリDだけ処理できない

**症状**:
- カテゴリA, B, C, E は正常に処理できる
- カテゴリD だけ「If Video Exists」ノードで止まる

**発生箇所**: If Video Exists ノード

**原因**: 不明（未調査）

**調査すべき点**:
1. カテゴリDのGoogle Driveフォルダに動画ファイルが存在するか
2. フォルダ名が正しいか（`20251213投稿D` の形式）
3. Search Video File の出力を確認
4. post_id の形式がカテゴリDだけ異なっていないか
5. シートデータ（canva_D）に問題がないか

---

## 現在のワークフロー構造

```
Manual Trigger
    ↓
Sheet List (5件: A, B, C, D, E を返す)
    ↓
Loop Sheets [Split In Batches] ←─────────────────────────┐
    ├─ Output 0 (done): 何も接続なし                      │
    └─ Output 1 (loop): Get Sheet Data                   │
                            ↓                             │
                    Filter NORMAL and Add Category        │
                            ↓                             │
                    If Has Items                          │
                    ├─ true: Search Category Folder       │
                    │           ↓                         │
                    │   Prepare Items with Folder ID      │
                    │           ↓                         │
                    │   Loop Over Items ←──────────┐      │
                    │   ├─ Output 0 (done): なし   │      │
                    │   └─ Output 1: 動画処理 ─────┘      │
                    │                                     │
                    └─ false: Skip to Next Sheet ─────────┘
```

**重要**: Loop Over Items の Output 0 (done) が何も接続されていないため、内部ループ完了後にワークフローが終了する。

---

## 動作確認済みの部分

1. 5シートからのデータ取得 - OK
2. NORMALフィルタ - OK
3. 空カテゴリのスキップ（Skip to Next Sheet経由）- OK
4. フォルダ検索 - OK
5. 動画処理（Download → Audio生成 → ffmpeg → Upload → Delete → Update）- OK
6. BGMとナレーションのミックス - OK
7. Paired Item エラーの修正（Merge Narrations に `pairedItem: { item: 0 }` 追加）- OK

---

## 重要なファイル

| ファイル | 状態 | 説明 |
|---------|------|------|
| `Downloads/音声合成advanced_v3_fix1.json` | 動作するが問題あり | 実際のクレデンシャル入り、1カテゴリで終了 |
| `content/modules/n8n-advanced/音声合成advanced_v3.json` | 配布用 | プレースホルダー入り |
| `public/n8n-advanced/download/音声合成advanced.json` | v2配布用 | 触らないこと |

---

## Session 9-10 で行った修正

### 1. Loop Over Items → Loop Sheets の接続削除

**変更前**:
```json
"Loop Over Items": {
  "main": [
    [{ "node": "Loop Sheets", "type": "main", "index": 0 }],
    [{ "node": "Search Video File", "type": "main", "index": 0 }]
  ]
}
```

**変更後**:
```json
"Loop Over Items": {
  "main": [
    [],
    [{ "node": "Search Video File", "type": "main", "index": 0 }]
  ]
}
```

**結果**: 無限ループは解消したが、1カテゴリで終了するようになった

### 2. Merge Narrations に pairedItem 追加

**変更前**:
```javascript
return [{
  json: {
    ...item,
    narration: mergedNarration
  }
}];
```

**変更後**:
```javascript
return [{
  json: {
    ...item,
    narration: mergedNarration
  },
  pairedItem: { item: 0 }
}];
```

**結果**: Paired Item エラーは解消した

---

## 次セッションでやるべきこと

1. **問題1の調査・修正**: ネストされたSplit In Batchesで内部ループ完了後に外部ループを継続する方法を見つける
   - n8n公式ドキュメント確認
   - Split In Batches の全オプション確認
   - 代替アプローチ（サブワークフロー化など）の検討

2. **問題2の調査**: カテゴリDだけ If Video Exists で止まる原因を調査
   - Google Driveのフォルダ構造確認
   - シートデータ確認
   - Search Video File の出力確認

---

## 注意事項

- `public/n8n-advanced/download/音声合成advanced.json` は **v2用** なので上書きしないこと
- v3用は別ファイル（`音声合成advanced_v3.json`）として作成すること
- 実際のクレデンシャルが入っているのは `Downloads/` フォルダ内のファイルのみ

---

**最終更新**: 2025-12-13 20:30
