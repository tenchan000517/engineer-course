# Agent Managerとマルチエージェント

**所要時間**: 20-25分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Workspaceの作成と管理
- エージェントへのタスク指示
- マルチエージェント（並列実行）の基本
- Inbox画面での会話管理

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 新しいWorkspaceを作成できる
- エージェントにタスクを指示して実行させられる
- 複数のエージェントを同時に動かせる
- 会話履歴をInboxで管理できる

---

## 目次

- [セクション1: Workspaceの作成](#セクション1-workspaceの作成)
- [セクション2: モデルの選択](#セクション2-モデルの選択)
- [セクション3: エージェントへのタスク指示](#セクション3-エージェントへのタスク指示)
- [セクション4: マルチエージェント（並列実行）](#セクション4-マルチエージェント並列実行)
- [セクション5: Inboxでの会話管理](#セクション5-inboxでの会話管理)
- [セクション6: Knowledge（ナレッジベース）](#セクション6-knowledgeナレッジベース)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの
- Google Antigravityがインストール済み（モジュール01完了）
- Googleアカウントでサインイン済み

---

## セクション1: Workspaceの作成

Workspaceは、エージェントが作業するプロジェクトフォルダです。VS Codeの「フォルダを開く」と同じ概念です。

### 1.1 Agent Managerを開く

Antigravityを起動し、Agent Managerの画面を表示します。

![Agent Manager メイン画面](/antigravity/am-main.png)

### 1.2 画面構成の確認

| 項目 | 説明 |
|------|------|
| **Inbox** | 会話履歴の一覧 |
| **Start conversation** | 新しい会話を開始 |
| **Workspaces** | プロジェクトフォルダ |
| **Playground** | 実験用の隔離環境 |

下部には以下のメニューがあります：
- **Knowledge**: ナレッジベース
- **Browser**: ブラウザ統合
- **Settings**: 各種設定

### 1.3 新しいWorkspaceを作成

1. 「**+ Open Workspace**」をクリック

![Workspace選択画面](/antigravity/am-workspace-select.png)

2. 以下の選択肢が表示されます：

| オプション | 説明 |
|-----------|------|
| **Open New Workspace** | ローカルフォルダを開く |
| **Open New Remote Workspace** | SSH経由でリモートに接続 |

3. 「**Open New Workspace**」を選択

4. フォルダ選択ダイアログで、新しいフォルダを作成または既存フォルダを選択

### 1.4 セキュリティ確認

フォルダを開くと、セキュリティ確認のダイアログが表示されます。

![セキュリティ確認1](/antigravity/am-trust-folder-1.png)

**重要**: この確認は、エージェントがフォルダ内のファイルを実行する可能性があるためです。

| リスク | 説明 |
|--------|------|
| データ漏洩 | 悪意あるファイルが機密データを外部に送信 |
| データ損失 | ファイルの削除や上書き |
| コード実行 | 予期しないコマンドの実行 |

**対処方法:**
- 自分で作成したフォルダ → 「**Trust Folder & Continue**」
- 信頼できないリポジトリ → 「Manage」で制限モードを選択

![セキュリティ確認2](/antigravity/am-trust-folder-2.png)

チェックボックス「Trust the authors of all files in the parent folder」は、**通常はオフのまま**でOKです。

「**Yes, I trust the authors**」をクリックして続行します。

### 1.5 Workspaceが開いた状態

![Workspace準備完了](/antigravity/am-workspace-ready.png)

- 左サイドバーの「Workspaces」に作成したフォルダが表示
- 「Start new conversation in [フォルダ名]」と表示される
- 下部に「Open editor」「Use Playground」のリンク

### チェックポイント

- [ ] 新しいWorkspaceを作成できた
- [ ] セキュリティ確認の意味を理解した
- [ ] Workspace画面が表示された

---

## セクション2: モデルの選択

### 2.1 利用可能なモデル

プロンプト入力欄の下にあるモデル名をクリックすると、選択画面が表示されます。

![モデル選択](/antigravity/am-model-select.png)

**2025年12月時点で利用可能なモデル:**

| モデル | 提供元 | 特徴 |
|--------|--------|------|
| **Gemini 3 Pro (High)** | Google | 高品質、Antigravity最適化 |
| **Gemini 3 Pro (Low)** | Google | 軽量版 |
| **Claude Sonnet 4.5** | Anthropic | 高品質な推論 |
| **Claude Sonnet 4.5 (Thinking)** | Anthropic | 推論プロセスを表示 |
| **GPT-OSS 120B (Medium)** | OpenAI | オープンウェイトモデル |

### 2.2 モデル選択のポイント

| 目的 | おすすめモデル |
|------|---------------|
| 初心者・汎用 | Gemini 3 Pro (High) |
| コスト重視 | Gemini 3 Pro (Low) / Claude Sonnet 4.5 |
| 複雑な推論 | Claude Sonnet 4.5 (Thinking) |

### チェックポイント

- [ ] モデル選択画面を開けた
- [ ] 各モデルの違いを理解した

---

## セクション3: エージェントへのタスク指示

### 3.1 最初のタスクを指示

プロンプト入力欄に以下を入力してEnterを押します：

```
Create a simple HTML page with "Hello Antigravity" as the title and a welcome message
```

### 3.2 エージェントの実行

![エージェント完了](/antigravity/am-agent-complete.png)

エージェントが以下を自動実行します：

1. **タスクの理解**: 指示内容を解析
2. **計画の作成**: 実行計画を立てる
3. **コード作成**: HTMLファイルを生成
4. **完了報告**: 結果を報告

### 3.3 実行結果の確認

エージェントの応答には以下が含まれます：

| 項目 | 説明 |
|------|------|
| **Created [ファイル名]** | 作成されたファイル（+追加行数 / -削除行数） |
| **Open diff** | 変更差分を確認 |
| **Content** | 作成内容の説明 |
| **Good / Bad** | フィードバックボタン |

### 3.4 エディター画面での確認

「**Open Editor**」（右上）をクリックするとエディター画面に切り替わります。

![エディター画面](/antigravity/am-editor-view.png)

**3つの領域が同時に表示されます:**

| 領域 | 内容 |
|------|------|
| **左** | Agent Manager（会話履歴） |
| **中央** | Editor（VS Codeライクなコードエディター） |
| **右** | Agentパネル（エージェントの応答） |

**重要なボタン:**
- **Accept / Reject**: 変更を承認または拒否
- **Accept Changes (Ctrl+D)**: 変更を一括承認

### チェックポイント

- [ ] エージェントにタスクを指示できた
- [ ] ファイルが作成されたことを確認した
- [ ] エディター画面で3つの領域を確認した

---

## セクション4: マルチエージェント（並列実行）

Antigravityの最大の特徴は、**複数のエージェントを同時に動かせる**ことです。

### 4.1 2つ目のエージェントを起動

1. 左サイドバーのWorkspace名の横にある「**+**」をクリック
2. または画面上部の「**+**」をクリック

### 4.2 別のタスクを指示

2つ目のエージェントに以下を指示します：

```
Add a CSS file called styles.css and move all styles from index.html to it
```

### 4.3 マルチエージェントの結果

![マルチエージェント完了](/antigravity/am-multiagent.png)

**2つのエージェントが同じWorkspace内で作業:**

| エージェント | タスク | 結果 |
|-------------|--------|------|
| 1つ目 | HTMLページ作成 | index.html (+97行) |
| 2つ目 | CSSを分離 | styles.css作成、index.html更新 |

### 4.4 並列実行のユースケース

| シナリオ | エージェントの役割分担 |
|---------|---------------------|
| フルスタック開発 | フロントエンド / バックエンド / テスト |
| バグ修正 | 5つのバグを5つのエージェントで同時処理 |
| リファクタリング | コード修正 / ドキュメント更新 / テスト作成 |

### チェックポイント

- [ ] 2つ目のエージェントを起動できた
- [ ] 複数のエージェントが同時に作業することを確認した
- [ ] 並列実行のメリットを理解した

---

## セクション5: Inboxでの会話管理

### 5.1 Inbox画面

左サイドバーの「**Inbox**」をクリックすると、すべての会話が一覧表示されます。

![Inbox画面](/antigravity/am-inbox.png)

### 5.2 会話の情報

| 項目 | 説明 |
|------|------|
| **会話タイトル** | 自動生成（タスク内容から） |
| **時間** | 最終更新からの経過時間 |
| **Workspace** | 会話が属するWorkspace |
| **Status** | Idle（待機中）/ Running（実行中） |

### 5.3 会話の管理

- **クリック**: 会話を開く
- **検索**: 「Search for conversations (Ctrl+K)」で検索
- **フィルター**: 「Pending」トグルで未完了のみ表示

### チェックポイント

- [ ] Inbox画面を開けた
- [ ] 会話一覧が表示されることを確認した

---

## セクション6: Knowledge（ナレッジベース）

### 6.1 Knowledgeとは

エージェントが学習した内容や、よく使うコンテキストを保存する機能です。

![Knowledge画面](/antigravity/am-knowledge.png)

### 6.2 現在の状態

「Open an artifact from the left pane to view its content here.」

現時点ではartifact（成果物）が保存されていない状態です。

### 6.3 Knowledgeの活用（将来的に）

| 機能 | 説明 |
|------|------|
| **Rules** | エージェントの動作ルールを定義 |
| **Workflows** | よく使うプロンプトを保存 |
| **Artifacts** | 成果物（計画、スクリーンショット等）の閲覧 |

> **注意**: Knowledge機能の詳細は将来のモジュールで扱います。

### チェックポイント

- [ ] Knowledge画面を開けた
- [ ] Knowledgeの目的を理解した

---

## まとめ

お疲れ様でした！Agent Managerとマルチエージェント機能を学びました。

### このモジュールで学んだこと

- Workspaceの作成とセキュリティ確認
- モデル選択（Gemini 3 Pro, Claude Sonnet 4.5など）
- エージェントへのタスク指示と結果確認
- マルチエージェント（並列実行）の基本
- Inboxでの会話管理

### 次のステップ

次のモジュールでは、実際にWebアプリケーションをエージェントで開発する実践編に進みます。

---

## 参考資料

- [Google Antigravity 公式サイト](https://antigravity.google/)
- [Google Codelabs - Getting Started](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Developers Blog](https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/)

---

## よくある質問

**Q: Workspaceは何個まで作成できますか？**
A: 制限はありません。プロジェクトごとにWorkspaceを分けることを推奨します。

**Q: エージェントは同時に何個まで動かせますか？**
A: 明確な制限は公開されていませんが、リソースとレート制限の範囲内で複数同時実行が可能です。

**Q: セキュリティ確認で「信頼しない」を選ぶとどうなりますか？**
A: 制限モードで動作し、エージェントの一部機能が制限されます。信頼できないリポジトリでは推奨される選択です。

**Q: 会話を削除できますか？**
A: はい、Inbox画面で会話を右クリックして削除できます。

**Q: モデルを途中で変更できますか？**
A: はい、新しい会話を開始する際に別のモデルを選択できます。進行中の会話では変更できません。
