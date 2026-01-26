---
title: "Hooksで会話ログを自動保存する"
order: 1
duration: "20分"
difficulty: "⭐⭐⭐☆☆"
---

# Hooksで会話ログを自動保存する

**所要時間**: 20分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Claude Codeの会話ログがどこに保存されているか
- Hooksを使った自動処理の設定方法
- JSONLファイルをMarkdownに変換するスクリプトの導入

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- セッション終了時に会話ログが自動でMarkdownファイルとして保存される
- プロジェクトごとにログが整理されて蓄積される
- 過去の会話を資産として活用できる

---

## 目次

- [セクション1: 仕組みの全体像](#セクション1-仕組みの全体像)
- [セクション2: スクリプトの配置](#セクション2-スクリプトの配置)
- [セクション3: Hooksの設定](#セクション3-hooksの設定)
- [セクション4: 動作確認](#セクション4-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Claude Code（インストール済み）
- Python 3.x
- テキストエディタ（VS Code推奨）

### 前提知識

- ターミナルの基本操作
- JSONの基本的な理解

---

## セクション1: 仕組みの全体像

### Claude Codeのログ保存場所

Claude Codeは、すべての会話履歴を自動的に保存しています。

| OS | 保存場所 |
|----|----------|
| Mac/Linux | `~/.claude/projects/` |
| Windows (WSL) | `~/.claude/projects/` |

プロジェクトごとにフォルダが作成され、中にJSONL形式のファイルが保存されています。

```
~/.claude/projects/
├── -mnt-c-my-project/          ← プロジェクトA
│   ├── abc12345-xxxx.jsonl     ← セッション1
│   ├── def67890-xxxx.jsonl     ← セッション2
│   └── ...
├── -mnt-c-another-project/     ← プロジェクトB
│   └── ...
└── ...
```

### 自動保存の仕組み

```
セッション終了（/clear、Ctrl+C、exit）
    ↓
Hooksの「Stop」イベント発火
    ↓
Pythonスクリプト実行
    ↓
JSONLをパース → Markdown変換
    ↓
指定フォルダに保存
```

### チェックポイント

- [ ] Claude Codeのログ保存場所を確認した
- [ ] 自動保存の流れを理解した

---

## セクション2: スクリプトの配置

### スクリプトの保存場所を決める

Claude Code関連のスクリプトは `~/.claude/scripts/` に配置することを推奨します。

ディレクトリを作成します（PowerShell、Git Bash共通）:

```bash
mkdir -p ~/.claude/scripts
```

### スクリプトを作成する

以下の内容で `~/.claude/scripts/extract_claude_logs.py` を作成してください。

```python
#!/usr/bin/env python3
"""
Claude Code会話ログ抽出スクリプト

出力先: {YOUR_OUTPUT_DIR}/{プロジェクト名}/

使用例:
  python extract_claude_logs.py --latest              # 最新セッションを自動出力
  python extract_claude_logs.py                       # 全セッションを出力
  python extract_claude_logs.py 2026-01-26            # 特定日のセッション
  python extract_claude_logs.py 2026-01-26 キーワード  # 日付＋キーワード検索
"""

DEFAULT_OUTPUT_BASE = "{YOUR_OUTPUT_DIR}"

import argparse
import json
import os
from datetime import datetime
from pathlib import Path


def get_claude_projects_dir():
    """Claude Codeのprojectsディレクトリを取得"""
    return Path.home() / ".claude" / "projects"


def get_current_project_folder():
    """現在のディレクトリに対応するプロジェクトフォルダ名を取得"""
    cwd = os.getcwd()
    folder_name = cwd.replace("/", "-")
    if folder_name.startswith("-"):
        pass
    else:
        folder_name = "-" + folder_name
    return folder_name


def get_project_name_from_folder(folder_name):
    """プロジェクトフォルダ名から読みやすいプロジェクト名を抽出

    例: -mnt-c-engineer-course → engineer-course
        -mnt-c-work-manual → work-manual
    """
    parts = folder_name.split("-")
    if len(parts) >= 4 and parts[1] == "mnt":
        return "-".join(parts[3:])
    return folder_name.strip("-")


def parse_jsonl_file(filepath):
    """JSONLファイルをパースして会話データを抽出"""
    messages = []
    metadata = {}

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                msg_type = data.get("type")

                if msg_type == "user":
                    content = data.get("message", {}).get("content", "")
                    timestamp = data.get("timestamp", "")
                    messages.append({
                        "type": "user",
                        "content": content,
                        "timestamp": timestamp
                    })
                    if not metadata:
                        metadata = {
                            "sessionId": data.get("sessionId", ""),
                            "cwd": data.get("cwd", ""),
                            "version": data.get("version", ""),
                            "gitBranch": data.get("gitBranch", "")
                        }

                elif msg_type == "assistant":
                    msg_content = data.get("message", {}).get("content", [])
                    timestamp = data.get("timestamp", "")

                    text_parts = []
                    for item in msg_content:
                        if isinstance(item, dict):
                            if item.get("type") == "text":
                                text_parts.append(item.get("text", ""))
                        elif isinstance(item, str):
                            text_parts.append(item)

                    if text_parts:
                        messages.append({
                            "type": "assistant",
                            "content": "\n".join(text_parts),
                            "timestamp": timestamp
                        })

            except json.JSONDecodeError:
                continue

    return messages, metadata


def format_timestamp(ts_str):
    """タイムスタンプをフォーマット"""
    if not ts_str:
        return ""
    try:
        dt = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except:
        return ts_str


def get_file_date(filepath):
    """ファイルの最終更新日を取得"""
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


def messages_to_markdown(messages, metadata):
    """メッセージをMarkdown形式に変換"""
    lines = []

    lines.append("# Claude Code 会話ログ\n")

    if metadata:
        lines.append("## セッション情報\n")
        lines.append(f"- **Session ID**: `{metadata.get('sessionId', 'N/A')}`")
        lines.append(f"- **ディレクトリ**: `{metadata.get('cwd', 'N/A')}`")
        lines.append(f"- **Claude Code Version**: `{metadata.get('version', 'N/A')}`")
        lines.append(f"- **Git Branch**: `{metadata.get('gitBranch', 'N/A')}`")
        lines.append("")

    lines.append("---\n")
    lines.append("## 会話内容\n")

    for msg in messages:
        timestamp = format_timestamp(msg.get("timestamp", ""))
        content = msg.get("content", "")

        if isinstance(content, list):
            text_parts = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    text_parts.append(item.get("text", ""))
                elif isinstance(item, str):
                    text_parts.append(item)
            content = "\n".join(text_parts)

        content = content.strip() if isinstance(content, str) else str(content)

        if not content:
            continue

        if msg["type"] == "user":
            lines.append(f"### User ({timestamp})\n")
            lines.append(content)
            lines.append("")
        else:
            lines.append(f"### Claude ({timestamp})\n")
            lines.append(content)
            lines.append("")

    return "\n".join(lines)


def filter_by_keyword(messages, keyword):
    """キーワードでメッセージをフィルタリング"""
    if not keyword:
        return messages

    filtered = []
    for msg in messages:
        if keyword.lower() in msg.get("content", "").lower():
            filtered.append(msg)
    return filtered


def main():
    parser = argparse.ArgumentParser(description="Claude Code会話ログ抽出")
    parser.add_argument("-o", "--output", help="出力先ディレクトリ（省略時: DEFAULT_OUTPUT_BASE/{プロジェクト名}/）")
    parser.add_argument("-n", "--name", default="session", help="出力ファイル名のプレフィックス")
    parser.add_argument("date", nargs="?", help="対象日 (YYYY-MM-DD)")
    parser.add_argument("keyword", nargs="?", help="検索キーワード")
    parser.add_argument("-p", "--project", help="プロジェクトフォルダ名（省略時は現在のディレクトリ）")
    parser.add_argument("-a", "--all", action="store_true", help="全セッションを出力")
    parser.add_argument("-l", "--latest", action="store_true", help="最新セッションのみ出力")

    args = parser.parse_args()

    projects_dir = get_claude_projects_dir()
    if args.project:
        project_folder = args.project
    else:
        project_folder = get_current_project_folder()

    project_path = projects_dir / project_folder

    if not project_path.exists():
        print(f"Error: プロジェクトフォルダが見つかりません: {project_path}")
        return 1

    project_name = get_project_name_from_folder(project_folder)

    if args.output:
        output_dir = Path(args.output)
    else:
        output_dir = Path(DEFAULT_OUTPUT_BASE) / project_name
    output_dir.mkdir(parents=True, exist_ok=True)

    jsonl_files = list(project_path.glob("*.jsonl"))

    if not jsonl_files:
        print(f"Warning: JSONLファイルが見つかりません: {project_path}")
        return 0

    if args.date:
        jsonl_files = [f for f in jsonl_files if get_file_date(f) == args.date]
        if not jsonl_files:
            print(f"Warning: 指定日のファイルが見つかりません: {args.date}")
            return 0

    if args.latest:
        jsonl_files = sorted(jsonl_files, key=os.path.getmtime, reverse=True)[:1]

    total_sessions = 0
    for jsonl_file in jsonl_files:
        messages, metadata = parse_jsonl_file(jsonl_file)

        if not messages:
            continue

        if args.keyword:
            messages = filter_by_keyword(messages, args.keyword)
            if not messages:
                continue

        markdown = messages_to_markdown(messages, metadata)

        file_date = get_file_date(jsonl_file)
        session_id = metadata.get("sessionId", jsonl_file.stem)[:8]
        output_name = f"{args.name}_{file_date}_{session_id}.md"
        output_path = output_dir / output_name

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(markdown)

        print(f"Exported: {output_path}")
        total_sessions += 1

    print(f"\n完了: {total_sessions} セッションをエクスポートしました")
    return 0


if __name__ == "__main__":
    exit(main())
```

### プレースホルダーの設定

スクリプト内の `{YOUR_OUTPUT_DIR}` を、ログを保存したいディレクトリに変更してください。

| OS | 設定例 |
|----|--------|
| Windows (WSL) | `/mnt/d/project_logs` |
| Mac | `/Users/yourname/Documents/claude_logs` |
| Linux | `/home/yourname/claude_logs` |

**例（Windows WSLの場合）**:

```python
DEFAULT_OUTPUT_BASE = "/mnt/d/project_logs"
```

これにより、以下のような構造でログが保存されます:

```
D:\project_logs\
├── my-project\
│   ├── session_2026-01-26_abc12345.md
│   └── session_2026-01-25_def67890.md
├── another-project\
│   └── ...
└── ...
```

### チェックポイント

- [ ] `~/.claude/scripts/` ディレクトリを作成した
- [ ] スクリプトファイルを配置した
- [ ] `DEFAULT_OUTPUT_BASE` を自分の環境に合わせて変更した

---

## セクション3: Hooksの設定

### settings.jsonを開く

Claude Codeの設定ファイルを開きます。

| OS | パス |
|----|------|
| Mac/Linux | `~/.claude/settings.json` |
| Windows (WSL) | `~/.claude/settings.json` |

ファイルが存在しない場合は新規作成してください。

### Hooks設定を追加する

以下の内容で `settings.json` を編集してください。

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/scripts/extract_claude_logs.py --latest"
          }
        ]
      }
    ]
  }
}
```

**既存の設定がある場合**は、`hooks` セクションを追加してください:

```json
{
  "既存の設定": "...",
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/scripts/extract_claude_logs.py --latest"
          }
        ]
      }
    ]
  }
}
```

### Hooks設定の解説

| 項目 | 説明 |
|------|------|
| `Stop` | セッション終了時のイベント（`/clear`、`Ctrl+C`、`exit`） |
| `matcher` | 空文字 = すべてのプロジェクトで発火 |
| `command` | 実行するコマンド |
| `--latest` | 最新のセッションのみをエクスポート |

### チェックポイント

- [ ] `settings.json` を編集した
- [ ] Hooks設定を追加した

---

## セクション4: 動作確認

### 手動でテスト実行

設定が正しいか確認するため、手動でスクリプトを実行します。

```bash
python3 ~/.claude/scripts/extract_claude_logs.py --latest
```

成功すると以下のような出力が表示されます:

```
Exported: /mnt/d/project_logs/my-project/session_2026-01-26_abc12345.md

完了: 1 セッションをエクスポートしました
```

### 出力ファイルを確認

指定した出力先ディレクトリにMarkdownファイルが作成されていることを確認してください。

### 自動実行のテスト

Claude Codeで `/clear` を実行するか、`Ctrl+C` で終了して、自動的にログがエクスポートされることを確認してください。

### チェックポイント

- [ ] 手動実行でログがエクスポートされた
- [ ] 出力ファイルを確認した
- [ ] 自動実行をテストした

---

## トラブルシューティング

（実際に発生した問題があれば追記）

---

## まとめ

### このモジュールで学んだこと

- Claude Codeの会話ログは `~/.claude/projects/` にJSONL形式で保存されている
- Hooksの `Stop` イベントを使ってセッション終了時に自動処理を実行できる
- Pythonスクリプトでログを読みやすいMarkdown形式に変換できる

### 次のステップ

- エクスポートしたログを整理して、ナレッジベースとして活用
- スクリプトをカスタマイズして、必要な情報だけを抽出
- 他のHooksイベント（`PreToolUse`、`PostToolUse`など）を活用

---

## 参考資料

- [Claude Code Hooks公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/hooks)

---

## よくある質問

**Q: ログはどのくらいの期間保存されていますか？**
A: Claude Codeは直近約1ヶ月分のログを保持しています。古いログは自動的に削除される可能性があるため、重要な会話は早めにエクスポートしてください。

**Q: 特定のプロジェクトのログだけをエクスポートできますか？**
A: はい。`-p` オプションでプロジェクトフォルダを指定できます:
```bash
python3 ~/.claude/scripts/extract_claude_logs.py -p "-mnt-c-my-project" --latest
```

**Q: 全セッションをまとめてエクスポートしたい場合は？**
A: `--latest` オプションを外して実行してください:
```bash
python3 ~/.claude/scripts/extract_claude_logs.py
```

**Q: 特定の日付のログだけをエクスポートできますか？**
A: はい。日付を引数で指定できます:
```bash
python3 ~/.claude/scripts/extract_claude_logs.py 2026-01-26
```

**Q: キーワードで会話を検索できますか？**
A: はい。日付とキーワードを組み合わせて検索できます:
```bash
python3 ~/.claude/scripts/extract_claude_logs.py 2026-01-26 "エラー"
```
