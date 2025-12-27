# 引継ぎ: ゆめマガ業務フロー自動化

**作成日**: 2025-12-17
**最終更新**: 2025-12-17 19:50
**ステータス**: テスト中（Whisper動作確認済み、Gemini以降未検証）

> **最新の詳細な引継ぎは `HANDOFF-yumemaga-transcription-v3.md` を参照してください**

---

## 重要: 次のセッションで最初にやること

### 1. n8nワークフロー「ゆめマガ文字起こし」の完成

**現在のエラー**: Get Subfoldersノードで400 Bad Request（Invalid Value）

---

**このワークフローの目標・KGI**:
1. 月号を入力して実行（例: 2026_01）
2. 各カテゴリ（A, H, I, K, C）の録音データフォルダから音声ファイルを取得
3. Whisper.cppで文字起こし（生テキスト）
4. Geminiでインタビュー記事形式に整理
5. 文字起こしフォルダにテキストファイルをアップロード
6. 進捗シートの「文字起こしステータス」「原稿ステータス」を「完了」に更新

---

**スキップ条件**:
- 同名の.txtファイルが文字起こしフォルダに既に存在する場合はスキップ

---

**Driveフォルダ構造**:
```
{カテゴリフォルダ}/
  └─ {月号: 2026_01}/
      ├─ 録音データ/
      ├─ 文字起こし/
      └─ 原稿/
```

**フォルダIDの取得方法（重要）**:
1. **カテゴリフォルダID**: GAS `CONFIG.driveFolderIds`に固定で定義済み
2. **素材フォルダID（録音データ、文字起こし、原稿）**:
   - GAS「Driveフォルダ作成」実行時にシートのURL行にフォルダURLが記載される
   - URLにはフォルダIDが含まれる（例: `https://drive.google.com/drive/folders/{ID}`）
   - n8nワークフローでシートからURLを読み取り、IDを抽出して使用可能

---

**ステータス一覧**:
- 文字起こしステータス: `['未処理', '処理中', '完了', 'エラー', 'スキップ']`
- 原稿ステータス: `['未処理', '処理中', '完了', 'エラー', 'スキップ']`
- 制作ステータス: `['未着手', '制作中', '確認待ち', '確認OK', '修正対応中']`

---

**シートの列・行構造**:
GASファイル`scripts/gas/yumemaga-progress-sheet-generator.js`の`CONFIG.columns`と`CONFIG.categories`を参照
```
列構造（CONFIG.columns）:
- A(1): カテゴリ
- B(2): 対象名
- C(3): 期限
- D〜W(4〜23): 素材列（20列）
- X(24): 素材ステータス
- Y(25): 文字起こしステータス ← URL行にフォルダURL記載
- Z(26): 原稿ステータス ← URL行にフォルダURL記載
- AA(27): バリデーション
- AB(28): 総合ステータス
- AC(29): 制作ステータス
- AD(30): 参考URL
- AE(31): 備考

行構造: 2行/カテゴリ（CONFIG.categories参照）
- チェック行（偶数行）: チェックボックス、ステータス
- URL行（奇数行）: フォルダURL ← ここからIDを抽出
```

---

**やること**:
1. 稼働中のワークフローを全部読め（`/mnt/c/engineer-course/docs/archive/n8n-production/`）
2. 各ノードの書き方を学べ
3. エラーを修正して動作させろ

**重要**: Whisper呼び出し以外はすべて実績あり。できないはずがない。

### 2. GAS本番反映（完了済みの場合はスキップ）
`/mnt/c/engineer-course/scripts/gas/yumemaga-progress-sheet-generator.js`の内容を本番シートのGASにコピペ

**詳細計画書**: `HANDOFF-transcription-workflow-v2.md` を必読

---

## 現在の状態サマリー

| 項目 | 状態 |
|------|------|
| **GAS修正** | ✅ **完了**（本番反映済み、テンプレート再生成済み） |
| **n8nワークフローJSON** | ⚠️ **エラー調査待ち**（Google Drive queryStringエラー） |
| **Geminiノード修正** | ✅ **完了** |
| **ステータス更新ノード** | ✅ **完了** |
| n8nテスト実行 | ❌ **エラーで中断** |

---

## 本セッションでの実装内容（2025-12-17 後半）

### GAS修正

**ファイル**: `/mnt/c/engineer-course/scripts/gas/yumemaga-progress-sheet-generator.js`

**変更内容**:
1. 非該当セルのグレーアウト色を暗め（#9e9e9e）に変更
2. allMaterialsから「文字起こし」を削除（21素材→20素材）
3. 列インデックス更新（全て1減らした）
4. createMonthlyFoldersに「文字起こし」フォルダ作成・Y列URL記載処理を追加
5. checkTranscriptionAndManuscript関数を新規追加
6. メニュー順序変更（Driveフォルダ作成を上に移動）

**新しい列構造（20素材版）**:
```
D〜W: 素材列（20列）
X (24): 素材ステータス
Y (25): 文字起こしステータス
Z (26): 原稿ステータス
AA (27): バリデーション
AB (28): 総合ステータス
AC (29): 制作ステータス
AD (30): 参考URL
AE (31): 備考
```

**ステータス値**: `['未処理', '処理中', '完了', 'エラー', 'スキップ']`

### n8nワークフロー

**ファイル**: `/mnt/c/engineer-course/docs/archive/n8n-production/n8n-advanced/ゆめマガ文字起こし.json`

**問題**: Get Subfoldersノードで400 Bad Request
- queryStringの形式が不正
- `"folderId" in parents` の書き方を調査する必要あり

**変更内容**:
1. Google Drive検索: `operation: "search"` + `queryString: "FOLDER_ID" in parents`
2. Geminiノード: HTTP Request → `@n8n/n8n-nodes-langchain.googleGemini`
3. ステータス更新: Prepare Status Update + Update Progress Status ノード追加

---

## 本セッションでの問題点（次回への教訓）

1. **参考ワークフロー選択ミス**: プレースホルダーのJSONを参照してエラー → `n8n-production`フォルダを参照すべき
2. **公開フォルダへの認証情報保存**: publicフォルダに認証情報入りJSON保存 → `docs/archive/n8n-production/`に保存
3. **Google Drive operation**: `operation: "list"`は存在しない → `operation: "search"` + `queryString`使用
4. **Geminiノード形式**: HTTP Requestで実装 → 公式ノード`@n8n/n8n-nodes-langchain.googleGemini`使用
5. **ステータス列の位置**: 末尾に追加しようとした → 素材ステータスの直後に追加
6. **シート構造理解不足**: GASを先に読んで構造把握してから実装すべき

---

## 重要ファイル一覧

| ファイル | 用途 |
|---------|------|
| `/mnt/c/engineer-course/docs/archive/n8n-production/n8n-advanced/ゆめマガ文字起こし.json` | n8nワークフロー本番JSON |
| `/mnt/c/engineer-course/scripts/gas/yumemaga-progress-sheet-generator.js` | 進捗管理GAS（修正済み） |
| `/mnt/c/engineer-course/content/HANDOFF-transcription-workflow-v2.md` | 詳細計画書 |

---

## 認証情報ID

| サービス | Credential ID |
|---------|---------------|
| Google Drive | TfNZ8jSb3HyhfHWF |
| Google Sheets | 3KFmyH23tY8tVoe2 |
| Google Gemini | rdz0MVIRIHU5NIjD |

---

## 緊急タスク

- [ ] **さとう建設素材のダウンロード（期限: 2025-12-18 23:59）** ⚠️
  - URL: https://dtbn.jp/kCpStFte
  - パスワード: `rwh97uj4`

---

## 次のステップ

1. [ ] GAS本番反映
2. [ ] テンプレート再生成
3. [ ] n8nワークフローインポート
4. [ ] テスト実行（短い音声ファイル）
5. [ ] 本番実行（1月号音声ファイル）

---

## 主要リンク

| 名称 | URL |
|-----|-----|
| 進捗管理シート（本番） | https://docs.google.com/spreadsheets/d/1nEH77Y9IcLqTth3QD8u5m4earVX8HEjLNbGB2We3l3Y/edit |
| 素材保存先（親フォルダ） | https://drive.google.com/drive/folders/1kxpgg_NCL8RQdNRN7z0FrFrABE8sSyiY |
| n8nアクセス | http://localhost:5678 |

---

## n8n環境情報

- **パス**: `/mnt/c/n8n/`
- **Whisper.cppパス**: `/opt/whisper.cpp/build/bin/whisper-cli`
- **モデル**: `ggml-base.bin`

---

## 関連HANDOFF

| ファイル | 内容 |
|---------|------|
| **`HANDOFF-transcription-workflow-v2.md`** | **詳細計画書（必読）** |
| `HANDOFF-yumemaga-progress-system.md` | 進捗管理システム詳細 |

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2025-12-17 | 初版作成 |
| 2025-12-17 | 文字起こしワークフロー計画確定 |
| 2025-12-17 | GAS修正完了、n8nワークフロー実装完了（テスト待ち） |
