# Google Antigravityのセットアップ

**所要時間**: 15-20分
**難易度**: ⭐☆☆☆☆

---

## このモジュールで学ぶこと

- Google Antigravityとは何か
- Windowsへのインストール方法
- 初期セットアップの手順
- 基本的な画面構成の理解

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Google Antigravityをインストールできる
- 初期設定を完了できる
- エディタ画面とAgent Managerの違いを理解している
- AIエージェントに簡単な指示を出せる

---

## 事前準備

### 必要なもの
- パソコン（Windows 10 64bit以降 / macOS / Linux）
- Googleアカウント
- Chromeブラウザ（推奨）
- 安定したインターネット接続

### 推奨スペック
- メモリ: 8GB以上
- ストレージ: 5GB以上の空き容量

---

## セクション1: Google Antigravityとは？

### 概要

**Google Antigravity**は、2025年11月にGoogleがリリースした**エージェント・ファーストの開発プラットフォーム**です。

従来のAIコード補完ツール（GitHub Copilotなど）とは異なり、**自律的なAIエージェント**がタスクの計画から実行、検証まで一貫して行います。

### 従来のツールとの違い

| 従来のAIツール | Google Antigravity |
|---------------|-------------------|
| コードの補完・提案 | タスク全体を自律的に実行 |
| 1行ずつサポート | 複数ファイルを横断して作業 |
| 人間が主導 | エージェントが主導（人間は監督） |

### 主な特徴

1. **Agent Manager**: 複数のAIエージェントを同時管理
2. **Artifacts**: スクリーンショットや実行結果を自動記録
3. **ブラウザ統合**: エージェントがWebサイトを操作・検証
4. **複数モデル対応**: Gemini 3 Pro、Claude Sonnet 4.5、GPT-OSSから選択可能

### チェックポイント

- [ ] Antigravityが「エージェント・ファースト」のツールであることを理解した
- [ ] 従来のAIツールとの違いを理解した

---

## セクション2: ダウンロードとインストール

### 2.1 公式サイトにアクセス

1. ブラウザで **https://antigravity.google/** にアクセス

2. ダウンロードページが表示されます

![ダウンロードページ](/antigravity/ant1.png)

### 2.2 インストーラーをダウンロード

**Windowsの場合:**
- 「Windows」セクションの「**Download for x64**」をクリック
- `Antigravity_Setup_x64.exe` がダウンロードされます

**Macの場合:**
- Apple Silicon（M1/M2/M3）: 「Download for Apple Silicon」
- Intel Mac: 「Download for Intel」

### 2.3 インストーラーを実行

1. ダウンロードした `Antigravity_Setup_x64.exe` をダブルクリック
2. インストールが自動的に進行します
3. 完了後、Antigravityが自動的に起動します

### チェックポイント

- [ ] 公式サイトからインストーラーをダウンロードした
- [ ] インストールが完了した
- [ ] Antigravityが起動した

---

## セクション3: 初期セットアップ

Antigravityを初めて起動すると、セットアップウィザードが表示されます。

### 3.1 セットアップフローの選択

![セットアップフロー選択](/antigravity/ant2.png)

| オプション | 説明 | おすすめ |
|-----------|------|---------|
| **Start fresh** | 新規で始める | 初心者向け |
| **Import from VS Code** | VS Codeの設定を引き継ぐ | VS Codeユーザー向け |
| **Import from Cursor** | Cursorの設定を引き継ぐ | Cursorユーザー向け |

**推奨**: 初めての方は「**Start fresh**」を選択して「Next」をクリック

### 3.2 エージェントモードの選択

![エージェントモード選択](/antigravity/ant3.png)

| モード | 説明 | おすすめ |
|--------|------|---------|
| **Agent-driven** | エージェントが全て自動実行 | 上級者向け |
| **Agent-assisted** | バランス型（時々確認を求める） | **推奨** |
| **Review-driven** | 全操作前に確認を求める | 慎重派向け |
| **Custom** | 細かくカスタマイズ | 上級者向け |

**推奨**: 「**Agent-assisted development**」（RECOMMENDED表示あり）を選択

右側の詳細設定はデフォルトのままでOKです：
- Terminal execution policy: Auto
- Review policy: Agent Decides
- JavaScript execution policy: Auto

「Next」をクリックして次へ進みます。

### 3.3 エディタの設定

![エディタ設定](/antigravity/ant4.png)

**Keybindings（キーバインド）:**
- **Normal**: 通常のキー操作（推奨）
- **Vim**: Vimスタイルのキー操作

**Extensions（拡張機能）:**
- 「**Install 7 Extensions**」にチェックを入れたままにする
- これらの拡張機能はエージェント機能に必要です

「Next」をクリックして次へ進みます。

### 3.4 Googleアカウントでサインイン

![サインイン画面](/antigravity/ant5.png)

1. 「**Sign in with Google**」ボタンをクリック
2. ブラウザが開き、Googleアカウントの選択画面が表示されます
3. 使用するGoogleアカウントを選択してログイン

### 3.5 利用規約への同意

![利用規約](/antigravity/ant6.png)

1. 利用規約を確認します
2. 「Yes, I agree to allow Google to collect and use my interactions data...」にチェック
3. 「Next」をクリック

> **注意**: セキュリティに関する警告が表示されています。Antigravityは実験的なツールであり、機密性の高いデータの処理は避けることが推奨されています。

### 3.6 認証完了

![認証成功](/antigravity/ant8.png)

ブラウザに「You have successfully authenticated.」と表示されたら認証成功です。

「**Antigravityを開く**」をクリックしてアプリに戻ります。

### チェックポイント

- [ ] セットアップフローで「Start fresh」を選択した
- [ ] エージェントモードで「Agent-assisted」を選択した
- [ ] Googleアカウントでサインインした
- [ ] 利用規約に同意した

---

## セクション4: メイン画面の確認

セットアップが完了すると、メイン画面が表示されます。

![メイン画面](/antigravity/ant7.png)

### 4.1 画面構成

Antigravityは主に3つの領域で構成されています：

#### 左側: サイドバー
- ファイルエクスプローラー
- 検索
- ソース管理（Git）
- 拡張機能

#### 中央: エディタ / スタート画面
- **Open Folder**: プロジェクトフォルダを開く
- **Open Agent Manager**: エージェント管理画面を開く
- **Clone Repository**: GitHubからリポジトリをクローン
- **Workspaces**: 最近使ったプロジェクト一覧

#### 右側: Agent パネル
- AIエージェントとの対話画面
- プロンプト入力欄
- モデル選択（Gemini 3 Pro など）

### 4.2 簡単な動作確認

右側のAgentパネルで、入力欄に以下のように入力してEnterを押してみましょう：

```
こんにちは。あなたは何ができますか？
```

エージェントが応答すれば、セットアップは完了です！

### チェックポイント

- [ ] メイン画面が表示された
- [ ] 画面構成（左・中央・右）を理解した
- [ ] エージェントに話しかけて応答があった

---

## トラブルシューティング

### 「Setting up your account」で止まる場合

これは最も多い問題です。

**解決方法:**
1. デフォルトブラウザを**一時的にChrome**に変更
2. Antigravityを再起動
3. サインインを再試行

Edge や Brave だと認証トークンがハングする問題が報告されています。

### サインイン後にアプリに戻れない場合

ブラウザの認証成功画面で「Antigravityを開く」ボタンが反応しない場合：

1. Antigravityアプリを手動でフォーカス（タスクバーからクリック）
2. それでもダメな場合はAntigravityを再起動

### エージェントが応答しない場合

1. インターネット接続を確認
2. 右側パネルでモデルが選択されているか確認（Gemini 3 Pro推奨）
3. Antigravityを再起動

---

## まとめ

お疲れ様でした！Google Antigravityのセットアップが完了しました。

### このモジュールで学んだこと

- Google Antigravityは「エージェント・ファースト」の開発プラットフォーム
- Windowsへのインストール方法
- 初期セットアップ（モード選択、サインイン）
- 基本的な画面構成

### 次のステップ

次のモジュールでは、実際にAntigravityを使ってプロジェクトを作成する方法を学びます。

---

## 参考資料

- [Google Antigravity 公式サイト](https://antigravity.google/)
- [Google Developers Blog - Antigravity発表](https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/)
- [Google Codelabs - チュートリアル](https://codelabs.developers.google.com/getting-started-google-antigravity)

---

## よくある質問

**Q: 無料で使えますか？**
A: はい、パブリックプレビュー期間中は無料で使用できます。

**Q: VS Codeの代わりに使えますか？**
A: はい。AntigravityはVS Codeをベースにしているため、同様のコーディング体験に加えてエージェント機能が使えます。

**Q: どのモデルがおすすめですか？**
A: 初心者には「Gemini 3 Pro」がおすすめです。Googleが最適化しているため、Antigravityとの相性が良いです。

**Q: セキュリティは大丈夫ですか？**
A: 実験的なツールのため、機密データや本番環境での使用は推奨されません。学習や個人プロジェクトでの使用に留めることをおすすめします。
