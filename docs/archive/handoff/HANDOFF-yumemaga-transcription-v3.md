# ゆめマガ文字起こしワークフロー 引継ぎドキュメント v3

**作成日**: 2025-12-17
**ステータス**: テスト中（Whisper動作確認済み、Gemini以降未検証）

---

## 現在の状態

### 完了した作業

| 項目 | 状態 | 詳細 |
|------|------|------|
| Google Drive検索エラー修正 | ✅ 完了 | `operation: "search"` → `filter.folderId` に変更 |
| シート名指定エラー修正 | ✅ 完了 | `mode: "id"` → `mode: "name"` に変更 |
| Whisper WAV変換追加 | ✅ 完了 | ffmpegでM4A→WAV変換を追加 |
| Geminiモデル更新 | ✅ 完了 | 2.0-flash → 2.5-flash |
| 両方のテキスト保存 | ✅ 完了 | 生の文字起こし + 整理後を別フォルダに保存 |

### テスト状況

| 段階 | 状態 |
|------|------|
| シート読み込み | ✅ 動作確認済み |
| フォルダID抽出 | ✅ 動作確認済み |
| 音声ファイル取得 | ✅ 動作確認済み |
| 音声ダウンロード | ✅ 動作確認済み |
| ffmpeg WAV変換 | ✅ 動作確認済み |
| Whisper文字起こし | ✅ 動作確認済み |
| Gemini整理 | ⏳ 未検証 |
| Upload Raw | ⏳ 未検証 |
| Upload Organized | ⏳ 未検証 |

---

## 修正したファイル

### 1. ワークフロー JSON
**パス**: `/mnt/c/engineer-course/docs/archive/n8n-production/n8n-advanced/ゆめマガ文字起こし-v2.json`

### 2. n8n Dockerfile（元に戻した）
**パス**: `/mnt/c/n8n/Dockerfile`

---

## 修正内容の詳細

### 1. Get Audio Files ノード（line 103-125）

**問題**: `operation: "search"` + `queryString` が無効

**修正前**:
```json
{
  "resource": "fileFolder",
  "operation": "search",
  "queryString": "=\"{{ $json.recordingFolderId }}\" in parents"
}
```

**修正後**:
```json
{
  "resource": "fileFolder",
  "filter": {
    "folderId": {
      "__rl": true,
      "value": "={{ $json.recordingFolderId }}",
      "mode": "id"
    }
  }
}
```

### 2. Get Sheet Data ノード

**問題**: シート名を指定しているのに `mode: "id"` を使用

**修正前**:
```json
"sheetName": {
  "value": "={{ $json['月号'] }}",
  "mode": "id"
}
```

**修正後**:
```json
"sheetName": {
  "value": "={{ $json['月号'] }}",
  "mode": "name"
}
```

### 3. Execute Whisper ノード

**問題**: whisper.cppはWAVのみ対応、M4Aは読めない

**修正前**:
```
whisper-cli ... /tmp/{baseName}.audio
```

**修正後**:
```
ffmpeg -y -i /tmp/{baseName}.audio -ar 16000 -ac 1 -c:a pcm_s16le /tmp/{baseName}.wav && whisper-cli ... /tmp/{baseName}.wav
```

### 4. Gemini モデル

**修正前**: `models/gemini-2.0-flash`
**修正後**: `models/gemini-2.5-flash`

### 5. 両方のテキスト保存

**追加した項目**:
- `manuscriptFolderId` を Extract Folder IDs で取得
- `Prepare Upload` で両方のバイナリを準備（rawTextData, organizedTextData）
- `Upload Raw (文字起こし)` ノード追加 → transcriptionFolderId
- `Upload Organized (原稿)` ノード追加 → manuscriptFolderId

---

## 重要な発見・学び

### 1. whisper.cpp vs faster-whisper

| 項目 | whisper.cpp | faster-whisper |
|------|------------|----------------|
| 対応フォーマット | WAVのみ | M4A/MP3/WAVなど |
| 環境 | C++、Alpine対応 | Python、Alpine非対応 |
| n8n Docker | ✅ 動作 | ❌ ビルド失敗 |

**結論**: n8n DockerコンテナではAlpine Linux + Python 3.12の互換性問題でfaster-whisperがビルドできない。whisper.cpp + ffmpeg変換で対応。

### 2. n8n Google Drive ノードの正しい書き方

**稼働中ワークフローから学習**:
```json
{
  "resource": "fileFolder",
  "queryString": "={{ $json.folder_name }}",  // 名前検索用（任意）
  "filter": {
    "folderId": {
      "__rl": true,
      "value": "フォルダID",
      "mode": "id"
    }
  }
}
```

**ポイント**:
- `operation` は指定しない（デフォルト使用）
- `filter.folderId` で親フォルダを指定
- `queryString` は名前検索用（任意）

---

## 次にやるべきこと

### 1. テスト実行
1. n8nにワークフローをインポート
2. Form TriggerでActivate後、フォームURLにアクセス
3. 月号「202601」を入力して実行
4. 各ノードの出力を確認

### 2. 確認項目
- [ ] Geminiが正しく動作するか
- [ ] Upload Raw が文字起こしフォルダに保存されるか
- [ ] Upload Organized が原稿フォルダに保存されるか
- [ ] 原稿フォルダ（Z列）にURLが設定されているか確認

### 3. 原稿フォルダURLが未設定の場合
シートのZ列（原稿ステータス）のURL行に、原稿フォルダのURLを設定する必要あり

---

## 関連ファイル

| ファイル | 用途 |
|---------|------|
| `docs/archive/n8n-production/n8n-advanced/ゆめマガ文字起こし-v2.json` | ワークフロー（修正済み） |
| `scripts/gas/yumemaga-progress-sheet-generator.js` | GAS（本番反映済み） |
| `content/HANDOFF-yumemaga-automation.md` | 前回の引継ぎ |
| `content/HANDOFF-transcription-workflow-v2.md` | 詳細計画書 |
| `/mnt/c/n8n/Dockerfile` | n8n Docker設定 |

---

## n8n Docker 状態

**Dockerfile**:
- ffmpeg + 日本語フォント ✅
- whisper.cpp ✅
- faster-whisper ❌（Alpine + Python 3.12で失敗、削除済み）

**再ビルドが必要な場合**:
```powershell
cd C:\n8n
docker-compose build --no-cache
docker-compose up -d
```

---

## シート構造（CONFIG.columns）

```
A(1): カテゴリ
B(2): 対象名
C(3): 期限
D〜W(4〜23): 素材列（20列）- D列に「録音データ」
X(24): 素材ステータス
Y(25): 文字起こしステータス ← URL行にフォルダURL
Z(26): 原稿ステータス ← URL行にフォルダURL
AA(27): バリデーション
AB(28): 総合ステータス
AC(29): 制作ステータス
AD(30): 参考URL
AE(31): 備考
```

---

## トラブルシューティング

### Whisperが一瞬で終わる場合
- `/tmp/` に前回のファイルが残っている可能性
- `docker exec -it n8n ls -la /tmp/` で確認
- `docker exec -it n8n rm -f /tmp/*.audio /tmp/*.wav /tmp/*.txt` でクリア

### "No output data returned" エラー
- Whisperが `.txt` を出力していない
- WAV変換が失敗している可能性
- `docker exec -it n8n` でコンテナ内を確認

### Webhookエラー
- ワークフローがActivateされていない
- Form Triggerは「Execute」ボタンでは動かない
- Activate後、フォームURLにアクセスして実行

---

**作成者**: Claude Code
**次回更新**: テスト完了後
