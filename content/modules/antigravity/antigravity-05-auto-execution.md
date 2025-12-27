# Antigravity 自動実行設定

**所要時間**: 10分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- 確認なしでAgentを自動実行する方法
- 各種Auto Execution設定の意味
- セキュリティを保ちながら自動化する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Terminal / Browser / Artifact の自動実行設定を変更できる
- Deny List で危険なコマンドをブロックできる
- ワークフローを途中確認なしで実行できる

---

## 目次

- [セクション1: 自動実行の概要](#セクション1-自動実行の概要)
- [セクション2: 設定画面へのアクセス](#セクション2-設定画面へのアクセス)
- [セクション3: Terminal設定](#セクション3-terminal設定)
- [セクション4: Browser設定](#セクション4-browser設定)
- [セクション5: Artifact設定](#セクション5-artifact設定)
- [セクション6: セキュリティ設定](#セクション6-セキュリティ設定)
- [まとめ](#まとめ)

---

## セクション1: 自動実行の概要

### なぜ自動実行が必要か

Antigravityはデフォルトで、以下のアクションに確認を求めます：

- ターミナルコマンドの実行
- ブラウザでのJavaScript実行
- ファイルの作成・編集

長いワークフローを実行する場合、毎回確認していると時間がかかります。自動実行設定を変更することで、途中確認なしで最後まで実行できます。

### 3つの実行ポリシー

| ポリシー | 動作 |
|----------|------|
| **Always Proceed** | 確認なしで自動実行 |
| **Request Review** | 毎回確認を求める |
| **Agent Decides** | Agentが判断（一部のみ） |

---

## セクション2: 設定画面へのアクセス

### 手順

1. Antigravityを開く
2. **Settings**（歯車アイコン）をクリック
3. **Agent** セクションを選択

ここから各種自動実行設定を変更できます。

---

## セクション3: Terminal設定

### 設定項目

**Settings → Agent → Security → Terminal**

| 設定 | 説明 |
|------|------|
| **Terminal Command Auto Execution** | ターミナルコマンドの自動実行 |
| **Allow List** | 自動実行を許可するコマンド |
| **Deny List** | ブロックするコマンド |

### 推奨設定

```
Terminal Command Auto Execution: Always Proceed
```

### Allow List の例

自動実行を許可する安全なコマンド：

```
mkdir
cd
ls
cat
echo
touch
cp
mv
pwd
git status
git log
git diff
git add
git commit
```

### Deny List の例（重要）

**必ず設定してください：**

```
rm -rf
rm -r
git push --force
git reset --hard
git push origin main
git push origin master
sudo rm
del /f
rmdir /s
```

---

## セクション4: Browser設定

### 設定項目

**Settings → Agent → Browser**

| 設定 | 説明 |
|------|------|
| **Enable Browser Tools** | ブラウザツールの有効化 |
| **Browser Javascript Execution Policy** | JS実行の自動承認 |
| **Browser URL Allowlist** | アクセス可能なURLを制限 |

### 推奨設定

```
Enable Browser Tools: ON
Browser Javascript Execution Policy: Always Proceed
```

### 注意

`Always Proceed` にすると、Agentがブラウザ上で任意のJavaScriptを実行できます。信頼できるURLのみにアクセスするワークフローで使用してください。

---

## セクション5: Artifact設定

### 設定項目

**Settings → Agent → Artifact**

| 設定 | 説明 |
|------|------|
| **Review Policy** | ファイル作成・編集の確認 |

### 推奨設定

```
Review Policy: Always Proceed
```

---

## セクション6: セキュリティ設定

### 完全自動化 vs セキュリティ

| 設定 | 自動化レベル | セキュリティ |
|------|-------------|-------------|
| 全て Request Review | 低 | 高 |
| Terminal のみ Always Proceed | 中 | 中 |
| 全て Always Proceed | 高 | 低 |

### 推奨: バランス設定

```
Terminal Command Auto Execution: Always Proceed
  + Deny List で危険コマンドをブロック

Browser Javascript Execution Policy: Always Proceed
  + URL Allowlist で信頼サイトのみ許可

Artifact Review Policy: Always Proceed
```

### Deny List は必須

`Always Proceed` にする場合、**Deny List の設定は必須**です。

最低限ブロックすべきコマンド：

```
rm -rf
git push --force
git reset --hard
```

---

## まとめ

### 完全自動実行のための設定チェックリスト

```
[ ] Terminal Command Auto Execution → Always Proceed
[ ] Browser Javascript Execution Policy → Always Proceed
[ ] Artifact Review Policy → Always Proceed
[ ] Auto-Continue → ON
[ ] Deny List に危険コマンドを追加
```

### 設定変更の反映タイミング

設定変更は**新しいメッセージから適用**されます。進行中のタスクには反映されません。

### いつ使うか

- 長いワークフローを実行するとき
- 信頼できる操作のみを行うとき
- Deny List を適切に設定したとき

### 使わない方がいいとき

- 初めてのタスクを実行するとき
- 不明なコードを実行するとき
- セキュリティが重要な環境

---

## 参考リンク

- [Codecademy - How to Set Up and Use Google Antigravity](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [DEV Community - 15 Essential Google Antigravity Tips](https://dev.to/czmilo/15-essential-google-antigravity-tips-and-tricks-complete-guide-in-2025-3omj)
- [LogRocket - A developer's guide to Antigravity and Gemini 3](https://blog.logrocket.com/antigravity-and-gemini-3/)
