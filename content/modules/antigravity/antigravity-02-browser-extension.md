# Chrome拡張機能とブラウザ統合

**所要時間**: 15-20分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Agent Managerの画面構成
- Settings（設定）の詳細
- Chrome拡張機能のインストール方法
- ブラウザ統合の動作確認

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Agent Managerの各機能を理解している
- 設定項目の意味を理解し、必要に応じて変更できる
- Chrome拡張機能をインストールできる
- エージェントにブラウザ操作を指示できる

---

## 事前準備

### 必要なもの
- Google Antigravityがインストール済み（モジュール01完了）
- Googleアカウントでサインイン済み

---

## セクション1: Agent Managerの画面構成

### 1.1 Agent Managerを開く

エディタ画面の中央にある「**Open Agent Manager**」ボタンをクリックします。

![Agent Manager画面](/antigravity/agent-manager.png)

### 1.2 画面構成

Agent Managerは以下の要素で構成されています：

#### 左サイドバー

| 項目 | 説明 |
|------|------|
| **Inbox** | 会話履歴の一覧。進行中・完了したタスクを管理 |
| **Start conversation** | 新しい会話を開始 |
| **Workspaces** | プロジェクトフォルダの管理 |
| **Playground** | 実験用の隔離環境。ファイルに影響を与えずにテスト可能 |

#### 下部メニュー

| 項目 | 説明 |
|------|------|
| **Knowledge** | ナレッジベース（再利用可能なコンテキスト） |
| **Browser** | ブラウザ統合機能 |
| **Settings** | 各種設定 |
| **Provide Feedback** | フィードバック送信 |

### 1.3 画面切り替え

- **Ctrl + E**（Windows）/ **Cmd + E**（Mac）でAgent Manager ↔ Editor を切り替え

### チェックポイント

- [ ] Agent Manager画面を開けた
- [ ] 左サイドバーの各項目を確認した

---

## セクション2: Settings（設定）の詳細

左下の「**Settings**」をクリックして設定画面を開きます。

### 2.1 Agent設定

![Agent設定](/antigravity/settings-agent.png)

#### ARTIFACT（成果物）

| 設定 | オプション | 説明 |
|------|-----------|------|
| **Review Policy** | Always Proceed | エージェントがレビューを求めない |
| | Agent Decides | エージェントが判断（推奨） |
| | Request Review | 常にレビューを求める |

#### TERMINAL（ターミナル）

| 設定 | オプション | 説明 |
|------|-----------|------|
| **Terminal Command Auto Execution** | Off | 許可リスト以外は実行しない |
| | Auto | エージェントが判断（推奨） |
| | Turbo | 拒否リスト以外は全て実行 |
| **Allow List** | - | 自動実行を許可するコマンド |
| **Deny List** | - | 実行前に確認を求めるコマンド |

#### FILE ACCESS（ファイルアクセス）

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Agent Gitignore Access** | .gitignoreファイルへのアクセス | OFF |
| **Agent Non-Workspace File Access** | ワークスペース外ファイルへのアクセス | OFF |
| **Auto-Open Edited Files** | 編集ファイルを自動で開く | ON |

#### AUTOMATION（自動化）

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Agent Auto-Fix Lints** | Lintエラーを自動修正 | ON |
| **Auto-Continue** | 応答制限時に自動継続 | OFF |

#### GENERAL（一般）

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Enable Agent Web Tools** | Web検索・URL読み取り | ON |
| **Open Agent on Reload** | 再読み込み時にAgentパネル表示 | ON |

### 2.2 Browser設定

![Browser設定](/antigravity/settings-browser.png)

#### GENERAL

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Enable Browser Tools** | ブラウザ操作機能の有効化 | ON |
| **Browser Javascript Execution Policy** | JS実行ポリシー | Model Decides |

#### ALLOWLIST

| 設定 | 説明 |
|------|------|
| **Browser URL Allowlist** | アクセス許可URLをファイルで管理 |

#### ADVANCED

| 設定 | 説明 | デフォルト |
|------|------|-----------|
| **Chrome Binary Path** | Chromeの実行ファイルパス | 空（自動検出） |
| **Browser User Profile Path** | ブラウザプロファイルの保存先 | `~/.gemini/antigravity-browser-profile` |
| **Browser CDP Port** | Chrome DevTools Protocolのポート | 9222 |

### 2.3 Editor設定

![Editor設定](/antigravity/settings-editor.png)

| 設定 | 説明 |
|------|------|
| **Marketplace Item URL** | 拡張機能のURL |
| **Marketplace Gallery URL** | 拡張機能ギャラリーのURL |
| **Editor Settings** | VS Codeスタイルの詳細設定 |

### 2.4 Tab設定（コード補完）

![Tab設定](/antigravity/settings-tab.png)

#### SUGGESTIONS

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Suggestions in Editor** | 入力時に補完を表示 | ON |
| **Tab Speed** | 補完の速度 | Fast |
| **Highlight After Accept** | 補完後にハイライト | ON |
| **Tab to Import** | Tabキーでインポート追加 | ON |

#### NAVIGATION

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Tab to Jump** | 次の編集位置に移動 | ON |

#### CONTEXT

| 設定 | 説明 | 推奨 |
|------|------|------|
| **Clipboard Context** | クリップボードをコンテキストに使用 | OFF |
| **Tab Gitignore Access** | .gitignoreへのアクセス | OFF |

### 2.5 Notifications設定

![Notifications設定](/antigravity/settings-notifications.png)

| 設定 | 説明 |
|------|------|
| **Notification Settings** | OSのシステム設定で管理 |

### チェックポイント

- [ ] Settings画面を開けた
- [ ] Agent設定の項目を確認した
- [ ] Browser設定で「Enable Browser Tools」がONになっている

---

## セクション3: Chrome拡張機能のインストール

### 3.1 ブラウザ操作をリクエスト

1. Agent Managerの左サイドバーで「**Playground**」の横にある **+** をクリック
2. 新しい会話で以下を入力：

```
Open a browser and go to google.com
```

3. エージェントが処理を開始します

![ブラウザ操作リクエスト](/antigravity/browser-request.png)

### 3.2 Browser Setupの開始

エージェントがブラウザを使用しようとすると、以下のメッセージが表示されます：

> **"Antigravity would like to use the browser."**

「**Setup**」ボタンをクリックします。

### 3.3 Browser Setup画面

![Browser Setup](/antigravity/browser-setup.png)

説明文：
> "Bring the Antigravity agent into your browser to see and interact with websites. It empowers the agent to test features, intelligently monitor dashboards, and seamlessly handle routine browser tasks."

「**Install extension →**」ボタンをクリックします。

### 3.4 Chrome Web Storeでインストール

![Chrome Web Store](/antigravity/chrome-webstore.png)

**Antigravity Browser Extension**のページが開きます：

- 評価: 4.0 ★（268件の評価）
- カテゴリ: 拡張機能、デベロッパー ツール
- ユーザー数: 400,000+

「**Chrome に追加**」ボタンをクリックしてインストールします。

### 3.5 インストール完了

インストールが完了すると、Antigravityに戻り、エージェントがブラウザ操作を実行します。

![ブラウザ操作成功](/antigravity/browser-success.png)

成功すると以下が表示されます：
- **Goal**: 実行したタスクの目標
- **Opened URL in Browser**: 開いたURL
- **Playback available**: 操作の録画（Viewで確認可能）

### チェックポイント

- [ ] Playgroundで会話を開始できた
- [ ] Browser Setup画面が表示された
- [ ] Chrome拡張機能をインストールした
- [ ] ブラウザ操作が成功した

---

## セクション4: ブラウザ統合の確認

### 4.1 Browser Control画面

左下の「**Browser**」をクリックすると、Browser Controlの説明画面が表示されます。

![Browser Control](/antigravity/browser-control.png)

#### エージェントができること

- **クリック**: ボタン、リンクをクリック
- **スクロール**: ページをスクロール
- **入力**: フォームにテキスト入力
- **ナビゲーション**: ページ間の移動

#### ユースケース例

| 用途 | 説明 |
|------|------|
| **Webサイトデザインの反復** | 開発中のサイトをリアルタイムで確認・修正 |
| **QAテスト** | フォーム送信、エラーハンドリングの検証 |
| **ダッシュボード監視** | 定期的なデータ確認 |
| **ルーティンタスク自動化** | CI再実行などの定型作業 |

### 4.2 ブラウザ操作のテスト

より複雑な操作をテストしてみましょう。Playgroundで以下を入力：

```
Go to google.com, search for "Antigravity Google", and take a screenshot of the results
```

これにより以下が確認できます：
- ページ移動
- テキスト入力
- ボタンクリック（検索実行）
- スクリーンショット撮影

### 4.3 デモ動画

以下の動画で実際のブラウザ操作の様子を確認できます：

<video controls width="100%">
  <source src="/antigravity/browser-demo.mp4" type="video/mp4">
  お使いのブラウザは動画タグをサポートしていません。
</video>

### チェックポイント

- [ ] Browser Control画面を確認した
- [ ] ブラウザ操作のテストを実行できた
- [ ] スクリーンショットが生成された

---

## 注意事項

### 拡張機能のインストール先

Chrome拡張機能は**Antigravity専用のブラウザプロファイル**にインストールされます：

```
~/.gemini/antigravity-browser-profile
```

普段使いのChromeブラウザには影響しません。

### Windows環境での注意

Windowsでは、ブラウザ操作時に普段使いのChromeが表示される場合があります。これは既知の問題ですが、タスク自体は正常に実行されます。

### セキュリティ上の注意

| リスク | 対策 |
|--------|------|
| 悪意あるWebサイトへのアクセス | 信頼できるサイトのみアクセス |
| プロンプトインジェクション | 不審なサイトを避ける |
| 機密データの漏洩 | 本番環境・機密データでの使用は避ける |

---

## まとめ

お疲れ様でした！Chrome拡張機能のインストールとブラウザ統合の設定が完了しました。

### このモジュールで学んだこと

- Agent Managerの画面構成（Inbox, Workspaces, Playground）
- Settings（設定）の各項目の意味
- Chrome拡張機能のインストール方法
- ブラウザ操作のテスト方法

### 次のステップ

次のモジュールでは、Agent Managerのマルチエージェント機能と並列実行について学びます。

---

## 参考資料

- [Google Antigravity 公式サイト](https://antigravity.google/)
- [Google Codelabs - Getting Started](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [GitHub Issue - ブラウザ関連の問題](https://github.com/googlecodelabs/feedback/issues/1556)

---

## よくある質問

**Q: 拡張機能がインストールできない場合は？**
A: Chrome以外のブラウザがデフォルトになっている場合、URLを手動でChromeにコピーしてインストールしてください。

**Q: 「Setup」ボタンが表示されない場合は？**
A: Settings > Browser > 「Enable Browser Tools」がONになっているか確認してください。

**Q: ブラウザ操作が失敗する場合は？**
A: Antigravityを再起動してから再試行してください。また、ファイアウォールがポート9222をブロックしていないか確認してください。

**Q: 普段使いのChromeに影響はありますか？**
A: いいえ。Antigravityは専用のブラウザプロファイル（`~/.gemini/antigravity-browser-profile`）を使用するため、普段使いのChromeには影響しません。
