# ゆめマガ文字起こしワークフロー - 引継ぎ書 v2

**作成日**: 2025-12-17
**ステータス**: 実装中（テスト未実施）

---

## 現在の状態

### 完了済み
- [x] GAS修正（進捗シートに新ステータス列追加）
- [x] n8nワークフローJSON作成
- [x] Geminiノード修正（HTTP Request → 公式ノード）
- [x] ステータス更新ノード追加

### 未完了
- [ ] n8nでのインポート・動作テスト
- [ ] 実際の音声ファイルでのテスト実行
- [ ] エラーハンドリングの確認

---

## 重要ファイル

| ファイル | 用途 |
|---------|------|
| `/mnt/c/engineer-course/docs/archive/n8n-production/n8n-advanced/ゆめマガ文字起こし.json` | n8nワークフロー本番JSON |
| `/mnt/c/engineer-course/scripts/gas/yumemaga-progress-sheet-generator.js` | 進捗管理GAS（修正済み） |

---

## GAS修正内容

### 新しい列構造（CONFIG.columns）

```
Y (25): 素材ステータス
Z (26): 文字起こしステータス ← NEW
AA (27): 原稿ステータス ← NEW
AB (28): バリデーション
AC (29): 総合ステータス
AD (30): 制作ステータス
AE (31): 参考URL
AF (32): 備考
```

### 新しいステータス定義（workflowStatuses）

```javascript
workflowStatuses: {
  transcription: ['未処理', '処理中', '完了', 'エラー', 'スキップ'],
  manuscript: ['未処理', '処理中', '完了', 'エラー', 'スキップ']
}
```

### GAS修正箇所
1. CONFIG.columns - 列インデックス更新
2. CONFIG.workflowStatuses - 新規追加
3. regenerateTemplate() - ヘッダー、初期値、データ入力規則、条件付き書式、列幅
4. createNewIssueSheet() - 新列の初期値リセット
5. setTemplateConditionalFormatting() - 新列の条件付き書式

**注意**: GASを本番反映後、「テンプレート再生成」を実行して既存シートに反映させる必要あり

---

## n8nワークフロー構造

### フロー概要
```
Form Trigger（月号入力: 2026_01）
  ↓
カテゴリループ（A, H, I, K, C）
  ↓
Google Drive検索（operation: "search", queryString: "FOLDER_ID" in parents）
  ↓
録音データフォルダ内の音声ファイル取得
  ↓
各ファイルに対して:
  - 同名.txt存在チェック → あればスキップ
  - Whisper.cpp実行 → 生テキスト生成
  - Geminiノード → テキスト整理
  - Google Driveアップロード → 文字起こしフォルダに保存
  - Google Sheets更新 → 進捗シートのステータス更新
  ↓
次のファイルへループ
```

### 主要ノード

| ノード名 | 種類 | 役割 |
|---------|------|------|
| Form Trigger | formTrigger | 月号入力（例: 2026_01） |
| Get Subfolders | googleDrive | カテゴリ内フォルダ検索 |
| Execute Whisper | executeCommand | Whisper.cpp実行 |
| Gemini Organize Text | @n8n/n8n-nodes-langchain.googleGemini | テキスト整理 |
| Upload Transcription | googleDrive | 文字起こしファイルアップロード |
| Update Progress Status | googleSheets | 進捗シートステータス更新 |

### 認証情報ID

| サービス | Credential ID |
|---------|---------------|
| Google Drive | TfNZ8jSb3HyhfHWF |
| Google Sheets | 3KFmyH23tY8tVoe2 |
| Google Gemini | rdz0MVIRIHU5NIjD |

### 進捗シート更新

- シートID: `1nEH77Y9IcLqTth3QD8u5m4earVX8HEjLNbGB2We3l3Y`
- シート名: 月号形式（例: 202601）※アンダースコアなし
- マッチング列: カテゴリ（例: "A. メインインタビュー"）
- 更新列: 文字起こしステータス、原稿ステータス → "完了"

---

## セッション中の問題点（教訓）

1. **参考ワークフローの選択ミス**: プレースホルダーのJSONを参考にしてエラー。本番用は`n8n-production`フォルダを参照すべき
2. **公開フォルダへの認証情報保存**: 本番JSONは`docs/archive/n8n-production/`に保存。publicフォルダは禁止
3. **Google Drive operation指定ミス**: `operation: "list"`は存在しない。`operation: "search"`と`queryString`を使用
4. **Geminiノード形式**: HTTP Requestではなく公式ノード`@n8n/n8n-nodes-langchain.googleGemini`を使用
5. **ステータス列の位置**: 素材ステータス(Y列)の**直後**に追加。末尾ではない
6. **シート構造の理解不足**: GASを先に読んで構造を把握してから実装すべきだった

---

## 次のステップ

1. **GAS反映**: 本番の進捗管理シートにGASをコピペして保存
2. **テンプレート再生成**: GASメニューから「テンプレート再生成」を実行
3. **n8nインポート**: `ゆめマガ文字起こし.json`をn8nにインポート
4. **テスト実行**: 短い音声ファイルでテスト
5. **本番実行**: 1月号の音声ファイルで実行

---

## 関連ドキュメント

- `/mnt/c/engineer-course/content/HANDOFF-yumemaga-automation.md` - 全体計画
- `/mnt/c/engineer-course/content/HANDOFF-yumemaga-progress-system.md` - 進捗管理システム詳細
- `/mnt/c/engineer-course/content/HANDOFF-transcription-workflow.md` - 旧計画書（参考のみ）
