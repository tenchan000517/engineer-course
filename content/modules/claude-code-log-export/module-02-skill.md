---
title: "スキルで過去ログを一括保存・検索する"
order: 2
duration: "15分"
difficulty: "⭐⭐⭐☆☆"
---

# スキルで過去ログを一括保存・検索する

**所要時間**: 15分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Claude Codeのスキル機能の仕組み
- 過去ログを一括でエクスポートする方法
- プロジェクトや日付を指定した検索・保存

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- スキルを導入してClaude Codeから呼び出せる
- 全プロジェクトのログを一括でバックアップできる
- 特定の日付やプロジェクトのログを検索・保存できる

---

## 目次

- [セクション1: なぜスキルが必要か](#セクション1-なぜスキルが必要か)
- [セクション2: スキルの導入](#セクション2-スキルの導入)
- [セクション3: スキルの使い方](#セクション3-スキルの使い方)
- [セクション4: 注意事項](#セクション4-注意事項)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01（Hooksで会話ログを自動保存する）を完了していること
- Python 3.8以上

### 前提知識

- Module 01の内容を理解していること

---

## セクション1: なぜスキルが必要か

### Hooksだけでは不十分なケース

Module 01でHooksを設定しましたが、以下のケースでは自動保存されません：

| ケース | Hooks発火 | 結果 |
|--------|----------|------|
| `/clear` で終了 | する | 保存される |
| `Ctrl+C` で終了 | する | 保存される |
| ターミナルを直接閉じる | **しない** | 保存されない |
| PCをシャットダウン | **しない** | 保存されない |

### スキルの役割

| 役割 | Hooks | スキル |
|------|-------|-------|
| 自動保存 | ◎ | - |
| Hooks未発火時のバックアップ | - | ◎ |
| 全プロジェクト一括保存 | - | ◎ |
| 過去ログの検索 | - | ◎ |

### 重要：ログの保持期間

Claude Codeの元データ（`~/.claude/projects/`）は**約1ヶ月で自動削除**されます。

定期的にスキルで一括バックアップしておくと安心です。

### チェックポイント

- [ ] Hooksが発火しないケースを理解した
- [ ] スキルの役割を理解した
- [ ] ログの保持期間（約1ヶ月）を理解した

---

## セクション2: スキルの導入

### スキルの配置場所

スキルは `~/.claude/skills/` に配置します。

```bash
mkdir -p ~/.claude/skills/claude-code-log-exporter/scripts
```

### ファイル構成

以下の構成でファイルを作成します：

```
~/.claude/skills/claude-code-log-exporter/
├── SKILL.md              # スキル定義
└── scripts/
    └── export_date_range_logs.py  # メインスクリプト
```

### SKILL.mdを作成

`~/.claude/skills/claude-code-log-exporter/SKILL.md` を以下の内容で作成してください：

```markdown
---
name: claude-code-log-exporter
description: Extract and export Claude Code project transcripts. Use when you need to export Claude Code conversation logs, extract transcripts by date, search projects, or generate markdown logs from projects.
allowed-tools: Bash
---

# Claude Code Log Exporter

会話ログを検索・エクスポートするスキルです。

## 使い方

全プロジェクト・全期間:
` ` `bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py
` ` `

特定の日付:
` ` `bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py 2026-01-26
` ` `

特定のプロジェクト:
` ` `bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py my-project
` ` `

日付 + プロジェクト:
` ` `bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py 2026-01-26 my-project
` ` `
```

### スクリプトを配置

Module 01で作成した `~/.claude/scripts/extract_claude_logs.py` をベースに、全プロジェクト対応版のスクリプトを `~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py` に配置してください。

スクリプトの主な機能：

- 全プロジェクト自動検出
- 日付・プロジェクト名でのフィルタリング
- セッション単位でファイル保存（Hooksと同じルール）
- 22パターンのシステムメッセージ自動除去

### 出力先の設定

スクリプト内の `DEFAULT_OUTPUT_BASE` をModule 01と同じ値に設定してください：

```python
DEFAULT_OUTPUT_BASE = "{YOUR_OUTPUT_DIR}"
```

### チェックポイント

- [ ] `~/.claude/skills/claude-code-log-exporter/` ディレクトリを作成した
- [ ] `SKILL.md` を配置した
- [ ] スクリプトを配置した
- [ ] `DEFAULT_OUTPUT_BASE` を設定した

---

## セクション3: スキルの使い方

### 基本的な使い方

| コマンド | 対象 |
|---------|------|
| `python3 ~/.claude/skills/.../export_date_range_logs.py` | 全プロジェクト・全期間 |
| `... 2026-01-26` | 全プロジェクト・特定日 |
| `... my-project` | 特定プロジェクト・全期間 |
| `... 2026-01-26 my-project` | 特定プロジェクト・特定日 |

### 実行例：全プロジェクト一括バックアップ

```bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py
```

出力例：
```
Found 8 projects
Target: All dates (全期間)
Output directory: /mnt/d/project_logs

Processing 8 projects

✓ engineer-course: 118 sessions saved
✓ work-manual: 97 sessions saved
✓ mnt-c: 14 sessions saved
...

✓ Total: 233 sessions saved to /mnt/d/project_logs
```

### 実行例：特定日のログを検索

```bash
python3 ~/.claude/skills/claude-code-log-exporter/scripts/export_date_range_logs.py 2026-01-26
```

### 保存されるファイル

Hooksと同じルールでセッション単位で保存されます：

```
{YOUR_OUTPUT_DIR}/
├── engineer-course/
│   ├── session_2026-01-25_abc12345.md
│   ├── session_2026-01-26_def67890.md
│   └── ...
├── work-manual/
│   └── ...
└── ...
```

同じセッションIDのファイルは上書きされるため、重複は発生しません。

### チェックポイント

- [ ] 全プロジェクト一括バックアップを実行した
- [ ] 特定日のログ検索を試した
- [ ] 保存されたファイルを確認した

---

## セクション4: 注意事項

### ログの保持期間

Claude Codeの元データ（`~/.claude/projects/`）は**約1ヶ月で自動削除**されます。

**推奨：**
- 初回セットアップ時に全プロジェクト一括バックアップを実行
- 定期的（週1回程度）にスキルで一括バックアップ

### Hooksが発火しないケース

以下のケースでは自動保存されません。スキルで手動バックアップしてください：

| ケース | 対処法 |
|--------|--------|
| ターミナルを直接閉じた | スキルで手動実行 |
| PCをシャットダウンした | スキルで手動実行 |
| 強制終了した | スキルで手動実行 |

### 日をまたいだセッション

セッションが日をまたいだ場合、ファイル名の日付は**終了日（ファイルの最終更新日）**になります。

これにより、同じセッションが異なる日付で重複保存される可能性はほぼありません。

### チェックポイント

- [ ] ログの保持期間を理解した
- [ ] Hooksが発火しないケースの対処法を理解した

---

## トラブルシューティング

### スクリプト実行時にエラーが出る

**症状**: `ModuleNotFoundError` や `SyntaxError` が表示される

**対処法**:
- Python 3.8以上がインストールされているか確認: `python3 --version`
- スクリプトのパスが正しいか確認

### プロジェクトが見つからない

**症状**: `Found 0 projects` と表示される

**対処法**:
- `~/.claude/projects/` ディレクトリが存在するか確認
- Claude Codeで一度でもセッションを開始しているか確認

---

## まとめ

### このモジュールで学んだこと

- Hooksが発火しないケースがあるため、スキルでのバックアップが重要
- Claude Codeの元データは約1ヶ月で自動削除される
- スキルで全プロジェクト一括バックアップ、日付・プロジェクト検索が可能
- HooksとスキルはセッションID単位で同じファイル名を使うため重複しない

### 運用の推奨

| 頻度 | 操作 |
|------|------|
| 常時 | Hooksで自動保存（設定済み） |
| 週1回 | スキルで全プロジェクト一括バックアップ |
| 必要時 | スキルで特定日・プロジェクトを検索 |

---

## 参考資料

- [Claude Code Skills公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/skills)

---

## よくある質問

**Q: HooksとスキルでログのA重複は発生しませんか？**
A: 発生しません。どちらも同じファイル名ルール（`session_YYYY-MM-DD_セッションID.md`）を使用するため、同じセッションは上書きされます。

**Q: 定期的に自動でスキルを実行できますか？**
A: はい。cronやタスクスケジューラでスクリプトを定期実行すれば可能です。ただし、Claude Codeが起動していない状態でも実行できます。

**Q: 特定のプロジェクトだけをバックアップしたい場合は？**
A: プロジェクト名をキーワードとして指定してください：
```bash
python3 ~/.claude/skills/.../export_date_range_logs.py my-project
```

**Q: 元データが1ヶ月で消えるなら、過去のログは取得できない？**
A: その通りです。約1ヶ月より前のログは元データが削除されているため取得できません。早めにバックアップを取ることが重要です。

**Q: スキルをClaude Codeから呼び出すにはどうすればいい？**
A: Claude Codeのセッション中に「ログをエクスポートして」などと依頼すると、スキルのSKILL.mdを参照して適切なコマンドを実行してくれます。
