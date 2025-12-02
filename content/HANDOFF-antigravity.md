# Antigravity講座 引き継ぎ資料

**作成日**: 2025-12-02
**作成済み**:
- antigravity-01-setup.md（セットアップ編）
- antigravity-02-browser-extension.md（Chrome拡張機能編）
- antigravity-03-agent-manager.md（Agent Managerとマルチエージェント編）
- antigravity-04-web-app.md（実践：Webアプリ開発編）

---

## 次に作成すべき講座

### antigravity-05: 実践：Web自動化

以下の内容を講座化する：
- スクレイピング、データ抽出
- ブラウザ操作を伴うタスク

### 参考情報（03で講座化済み）
- Workspace作成・管理
- マルチエージェント（並列実行）
- モデル選択
- Inbox管理

---

## 1. Chrome拡張機能の設定（重要）

### Antigravityの最大の利点
**エージェントがブラウザを直接操作できる**

従来のAIツールはコードを書くだけだが、Antigravityは：
- 実際にWebサイトにアクセス
- クリック、スクロール、入力操作
- スクリーンショット撮影
- 動作検証まで自動実行

### Chrome拡張機能のインストール
- Antigravity専用のChromium拡張機能が必要
- エージェントがブラウザを制御するために使用
- 設定方法の詳細は公式ドキュメント参照

### Browser統合の3つのサーフェス
1. **Agent Manager**: エージェントの管理ダッシュボード
2. **Editor**: VS Codeベースのコードエディタ
3. **Browser**: エージェントが操作する専用ブラウザ

---

## 2. Agent Managerの詳細設定

### ターミナル実行ポリシー
| 設定 | 動作 |
|------|------|
| Off | 明示的に許可した場合のみ実行 |
| Auto | エージェントが判断して実行 |
| Turbo | 明示的に拒否しない限り実行 |

### レビューポリシー
- 常時確認
- エージェント判断
- 要求時のみ

### JavaScript実行ポリシー
- ブラウザ内でのJS実行制御

---

## 3. ワークフローとルール

### Rules（カスタムルール）
- エージェントの動作を統制するルールを設定
- プロジェクト固有の制約を定義

### Workflows（保存済みプロンプト）
- よく使うプロンプトを保存
- 再利用可能なタスクテンプレート

---

## 4. 主要ユースケース（講座ネタ）

### 4.1 Webアプリケーション開発
```
例: 「Next.jsとTailwind CSSでポートフォリオサイトを作成して」
```
- エージェントが計画→コード作成→テスト→ブラウザ検証まで自動実行

### 4.2 ユニットテスト自動生成
- 既存コードのテストケース生成
- Mock実装の自動作成
- テスト実行と結果確認

### 4.3 Web自動化・スクレイピング
```
例: 「Google Newsから最新記事を10件抽出して」
```
- ブラウザ操作を伴うタスク
- データ抽出と整形

### 4.4 ゲーム・アプリ開発
```
例: 「Pygameでスネークゲームを作成」
```
- 複数ファイルの生成
- 依存関係の管理

### 4.5 並列バグ修正
- 5つのバグを5つのエージェントで同時処理
- スループット向上

### 4.6 財務ダッシュボード
- ポートフォリオ表示
- 資産配分分析
- リスク評価機能

---

## 5. Artifactsシステム

エージェントが生成する成果物：
- タスクリスト
- 実装計画
- スクリーンショット
- ブラウザ録画
- コード差分
- テスト結果

### 特徴
- 作業履歴を可視化
- フィードバックを直接Artifactに記入可能
- エージェントが実行を止めずにフィードバックを反映

---

## 6. マルチエージェント機能

### 並列実行
- 複数エージェントが同時に異なるタスクを処理
- 開発速度を3倍に加速（公式発表）

### 例
- Agent 1: コード作成
- Agent 2: テスト作成
- Agent 3: ドキュメント作成

---

## 7. MCP（Model Context Protocol）統合

### 機能
- データベースやクラウドサービスへの直接アクセス
- スキーマ手動入力の手間を削減
- 外部ツールとの連携

---

## 8. セキュリティ注意点（重要）

### 報告されている脆弱性

| リスク | 詳細 |
|--------|------|
| バックドア攻撃 | 悪意あるリポジトリを開くとシステムが永続的に侵害される可能性 |
| プロンプトインジェクション | 外部Webコンテンツに悪意あるXMLタグを埋め込み、エージェントが不正な指示を実行 |
| ユーザー確認バイパス | 最も制限的なモードでも確認なしに攻撃実行される可能性 |

### 推奨対策
- 信頼できるリポジトリのみを開く
- 不審な外部サイトへのアクセスを避ける
- Review-drivenモードで重要な操作を確認
- 機密データ・本番環境での使用は避ける

---

## 9. モデル選択

### 利用可能なモデル
| モデル | 特徴 |
|--------|------|
| Gemini 3 Pro | Google製、Antigravityに最適化（推奨） |
| Claude Sonnet 4.5 | Anthropic製、高品質な推論 |
| GPT-OSS | OpenAI製オープンウェイトモデル |

---

## 10. ベストプラクティス

1. **プロンプトは小分けに** - 大規模な指示より反復的改善アプローチが効果的
2. **フォルダを分ける** - タスクごとに別のワークスペースを作成
3. **計画を確認** - 大きな変更前にエージェントの計画をレビュー
4. **混ぜない** - 無関係なタスクを1つのプロンプトに含めない
5. **Planningモード活用** - 複雑なタスクは計画モードで実行

---

## 参考リンク

- [公式サイト](https://antigravity.google/)
- [Google Developers Blog](https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/)
- [Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Codecademy ガイド](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [セキュリティ警告（InfoWorld）](https://www.infoworld.com/article/4097714/security-researchers-caution-app-developers-about-risks-in-using-google-antigravity-2.html)

---

## 講座構成案

| モジュール | タイトル | 内容 |
|-----------|---------|------|
| 01 | セットアップ | ✅ 作成済み |
| 02 | Chrome拡張機能とブラウザ操作 | ✅ 作成済み |
| 03 | Agent Managerとマルチエージェント | ✅ 作成済み |
| 04 | 実践：Webアプリ開発 | ✅ 作成済み |
| 05 | 実践：Web自動化 | スクレイピング、データ抽出 |
| 06 | ワークフローとルール | カスタマイズ、効率化 |
| 07 | セキュリティとベストプラクティス | 安全な使い方 |

---

## 画像アセット

配置済み: `public/antigravity/`

### 01: セットアップ編
- ant1.png 〜 ant8.png

### 02: Chrome拡張機能編（新規追加）
- agent-manager.png - Agent Manager画面
- settings-agent.png - Agent設定
- settings-browser.png - Browser設定
- settings-editor.png - Editor設定
- settings-tab.png - Tab設定
- settings-notifications.png - Notifications設定
- browser-request.png - ブラウザ操作リクエスト
- browser-setup.png - Browser Setup画面
- chrome-webstore.png - Chrome Web Store
- browser-success.png - 操作成功画面
- browser-control.png - Browser Control画面
- browser-demo.mp4 - ブラウザ操作デモ動画（10MB, 3840x2080, 下80pxクロップ済み）

### 03: Agent Managerとマルチエージェント編（新規追加）
- am-main.png - Agent Managerメイン画面
- am-workspace-select.png - Workspace選択画面
- am-trust-folder-1.png - セキュリティ確認ダイアログ1
- am-trust-folder-2.png - セキュリティ確認ダイアログ2
- am-workspace-ready.png - Workspace準備完了画面
- am-model-select.png - モデル選択ドロップダウン
- am-agent-complete.png - エージェントタスク完了画面
- am-editor-view.png - エディター画面（3サーフェス同時表示）
- am-multiagent.png - マルチエージェント完了画面
- am-inbox.png - Inbox画面
- am-knowledge.png - Knowledge画面

### 04: 実践：Webアプリ開発編（新規追加）
- 04-workspace-ready.png - Workspace準備画面
- 04-dual-screen.png - 2画面構成（Agent Manager + Editor）
- 04-prompt-start.png - 指示入力、計画開始
- 04-plan-accept.png - 計画完了、Accept待ち
- 04-creating-project.png - プロジェクト作成中
- 04-project-structure.png - プロジェクト構造表示
- 04-css-error.png - CSSエラー検出（ブラウザ）
- 04-game-running.png - ゲーム動作画面
- 04-walkthrough.png - Walkthrough生成、完成報告
- 04-self-fix.png - 自己修正の試み
- 04-gemini-fix.png - Gemini 3 Proでの修正
- 04-typing-game-demo.mp4 - 完成版タイピングゲームのデモ動画（65秒、2640x1920）

### 追加で必要な画像（05以降）
- Rules/Workflows設定画面
- スクレイピング実行画面

---

**最終更新**: 2025-12-02
