---
title: "Claude Codeをセットアップする"
order: 0
duration: "60分"
difficulty: "⭐⭐☆☆☆"
---

# Claude Codeをセットアップする

**所要時間**: 60分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- VS Codeのインストールと基本操作
- Git / GitHubのセットアップ
- WindowsでWSL2をセットアップする方法（BIOS設定含む）
- VS CodeでWSLターミナルを使えるようにする方法
- Claude Codeのネイティブインストール方法
- 認証設定と動作確認

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- VS Codeでフォルダを開き、ファイルを作成できる
- VS Codeのターミナルを開き、シェルを切り替えられる
- GitHubアカウントを作成し、VS CodeでGit操作ができる
- WSL2（Windows Subsystem for Linux 2）が使える状態になる
- VS Codeからコマンドパレットでwslターミナルを開ける
- Claude Codeが使える状態になる

---

## 目次

- [セクション1: WSL2のセットアップ](#セクション1-wsl2のセットアップ)
- [セクション2: VS Codeのインストールと基本操作](#セクション2-vs-codeのインストールと基本操作)
- [セクション3: Claude Codeのインストール](#セクション3-claude-codeのインストール)
- [セクション4: 認証と動作確認](#セクション4-認証と動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [参考資料](#参考資料)

---

## AIサポートを使う（任意）

作業中に困ったときにAIがサポートしてくれると便利です。
以下のプロンプトを**作業開始前に**Claude、ChatGPT、Geminiなどに貼り付けておくと、エラーが出たときにスムーズにサポートを受けられます。

### セットアップサポートプロンプト（コピペして使う）

```
あなたはWindows環境でのClaude Codeセットアップをサポートするアシスタントです。

私はこれから以下の作業を順番に行います：

【1. WSL2のインストール】
- タスクマネージャーで「仮想化: 有効」を確認
- 無効ならBIOS/UEFIで有効化が必要
- PowerShellを管理者で開いて `wsl --install` を実行
- 再起動後、Ubuntuのユーザー名とパスワードを設定
- `wsl --status` でバージョン2がデフォルトか確認
- よくあるエラー: 0x80370102（仮想化が無効）

【2. VS Codeのインストール】
- https://code.visualstudio.com/ からダウンロード
- インストール時「PATHへの追加」に必ずチェック
- インストール後、WSL拡張機能をインストール
- `Ctrl + Shift + P` →「WSL: Connect to WSL」で接続確認
- 左下に「WSL: Ubuntu」と表示されればOK

【3. Git for Windowsのインストール】
- https://gitforwindows.org/ からダウンロード
- 選択肢で重要なもの:
  - Default editor: 「Use Visual Studio Code」
  - Initial branch: 「main」に変更推奨
  - PATH: 「Git from the command line and also from 3rd-party software」必須
  - Credential helper: 「Git Credential Manager」必須
- インストール後、新しいターミナルで `git --version` で確認

【4. GitHubアカウントとGit初期設定】
- https://github.com/signup でアカウント作成
- Git初期設定:
  - `git config --global user.name "ユーザー名"`
  - `git config --global user.email "メールアドレス"`
- 設定確認: `git config --global --list`

【5. Claude Codeのインストール】
- VS CodeでWSLに接続した状態でターミナルを開く
- `curl -fsSL https://claude.ai/install.sh | sh` を実行
- `claude --version` でインストール確認
- `claude` で起動してブラウザ認証
- 認証後 `/status` で状態確認

【サポート方針】
- エラーが出たら原因と解決方法を教えてください
- 画面がモジュールと違ったらどうすればいいか教えてください
- コマンドが動かない場合は代替手段を提案してください
- 専門用語は簡単に説明してください
- PATHや環境変数の問題は確認方法から教えてください

それでは作業を開始します。順調に進んでいる間は報告しませんが、何かあったら質問します。
```

### 使い方

1. 上のプロンプトをコピー
2. Claude / ChatGPT / Gemini などに貼り付けて送信
3. AIが「了解しました」などと応答したら準備OK
4. このモジュールの手順を進める
5. エラーが出たら、エラーメッセージをそのままAIに貼り付ける
6. AIがサポートしてくれる

### エラーが出たときの伝え方

エラーが出たら、以下のように伝えるとスムーズです：

```
WSLのインストールで以下のエラーが出ました：

（エラーメッセージをここに貼り付け）
```

ポイント：
- **エラーメッセージは全文コピペ**（途中で切らない）
- **エラーコード**（0x80370102など）は特に重要
- 何の作業中だったかを一言添える

---

## 事前準備

### 必要なもの

- Windows 10（バージョン2004以降）またはWindows 11
- 管理者権限
- インターネット接続
- Anthropicアカウント（Claude Proまたはmax、もしくはAPIキー）

### システム要件

| 項目 | 要件 |
|------|------|
| OS | Windows 10 (Build 19041+) / Windows 11 |
| CPU | Intel VT-x または AMD-V 対応 |
| RAM | 8GB以上推奨 |
| ストレージ | 20GB以上の空き容量 |

---

## セクション1: WSL2のセットアップ

### 1.1 仮想化の有効化を確認する

WSL2を動作させるには、CPUの仮想化機能が有効になっている必要があります。

#### 現在の状態を確認する

1. `Ctrl + Shift + Esc` でタスクマネージャーを開く
2. 「パフォーマンス」タブをクリック
3. 「CPU」を選択
4. 右下の「仮想化」の項目を確認

```
仮想化: 有効    ← これが表示されていればOK
```

**「有効」と表示されている場合** → [1.3 WSL2をインストールする](#13-wsl2をインストールする) へ進む

**「無効」と表示されている場合** → 次の手順でBIOS/UEFIから有効化が必要

---

### 1.2 BIOS/UEFIで仮想化を有効にする

仮想化が無効の場合、BIOS/UEFIから設定を変更します。

#### Windows設定からUEFIに入る方法

1. Windowsの「設定」を開く（`Win + I`）
2. 「システム」→「回復」をクリック
3. 「PCの起動をカスタマイズする」の「今すぐ再起動」をクリック
4. 再起動後、「トラブルシューティング」を選択
5. 「詳細オプション」→「UEFIファームウェアの設定」を選択
6. 「再起動」をクリック

#### 起動時にBIOSに入る方法（上記がうまくいかない場合）

PCを再起動し、起動中に以下のキーを連打します：

| メーカー | キー |
|----------|------|
| Dell | F2 |
| HP | F10 または Esc |
| Lenovo | F1 または F2 |
| ASUS | F2 または Del |
| Acer | F2 または Del |
| MSI | Del |
| 自作PC | Del または F2 |

#### 仮想化を有効にする（メーカー別）

BIOS/UEFIに入ったら、仮想化設定を探して有効にします。

**ASUS マザーボード**:
```
Advanced → CPU Configuration → Intel Virtualization Technology → Enabled
```

**MSI マザーボード**:
```
OC（Overclocking） → CPU Features → SVM Mode（AMD）/ VT-d（Intel） → Enabled
```

**Gigabyte マザーボード**:
```
Advanced CPU Core Settings → SVM Mode（AMD）/ VT-d（Intel） → Enabled
```

**ASRock マザーボード**:
```
Advanced → CPU Configuration → Intel VT-x / SVM Mode → Enabled
```

**Dell**:
```
Advanced → Virtualization → Virtualization → Enabled
VT for Direct-IO → Enabled
```

**HP**:
```
Configuration → Virtualization Technology → Enabled
または
Security → System Security → Virtualization Technology (VTx) → Enabled
```

**Lenovo**:
```
Security → Virtualization → Intel (R) Virtualization Technology → Enabled
```

設定を変更したら、「Save & Exit」（F10キーが多い）で保存して再起動します。

#### 確認

再起動後、タスクマネージャーで「仮想化: 有効」になっていることを確認してください。

### チェックポイント

- [ ] タスクマネージャーで仮想化が「有効」になっている

---

### 1.3 WSL2をインストールする

#### PowerShellを管理者として開く

1. スタートメニューで「PowerShell」と検索
2. 「Windows PowerShell」を右クリック
3. 「管理者として実行」を選択

#### WSLをインストール

以下のコマンドを実行します：

```powershell
wsl --install
```

このコマンドは以下を自動で行います：
- WSL機能の有効化
- 仮想マシンプラットフォームの有効化
- Linuxカーネルのインストール
- Ubuntu（デフォルト）のインストール

インストールが完了したら、**PCを再起動**してください。

#### 再起動後の初期設定

再起動すると、Ubuntuのターミナルが自動で開きます。

1. ユーザー名を入力（小文字、英数字）
2. パスワードを設定（入力中は表示されません）
3. パスワードを再入力して確認

```
Enter new UNIX username: yourname
New password: ********
Retype new password: ********
```

これでWSL2のセットアップは完了です。

#### WSL2がデフォルトか確認

```powershell
wsl --status
```

以下のように表示されればOKです：

```
既定のバージョン: 2
```

もしWSL 1がデフォルトになっている場合：

```powershell
wsl --set-default-version 2
```

### チェックポイント

- [ ] `wsl --install` を実行した
- [ ] PCを再起動した
- [ ] Ubuntuのユーザー名とパスワードを設定した
- [ ] `wsl --status` でバージョン2がデフォルトになっている

---

## セクション2: VS Codeのインストールと基本操作

### 2.1 VS Codeをダウンロードする

1. ブラウザで [VS Code公式サイト](https://code.visualstudio.com/) を開く
2. 「Download for Windows」ボタンをクリック
3. ダウンロードが完了するまで待つ

### 2.2 VS Codeをインストールする

ダウンロードしたインストーラー（`VSCodeUserSetup-x64-x.xx.x.exe`）をダブルクリックして実行します。

#### インストール手順

1. **使用許諾契約書**
   - 「同意する」を選択して「次へ」

2. **インストール先の選択**
   - デフォルトのまま「次へ」

3. **スタートメニューフォルダの選択**
   - デフォルトのまま「次へ」

4. **追加タスクの選択**（重要）

   以下の項目に**すべてチェック**を入れてください：

   | チェック項目 | 説明 |
   |-------------|------|
   | ✅ デスクトップ上にアイコンを作成する | デスクトップにショートカットを作成 |
   | ✅ エクスプローラーのファイルコンテキストメニューに「Codeで開く」アクションを追加する | ファイルを右クリックでVS Codeで開ける |
   | ✅ エクスプローラーのディレクトリコンテキストメニューに「Codeで開く」アクションを追加する | フォルダを右クリックでVS Codeで開ける |
   | ✅ サポートされているファイルの種類のエディターとして、Codeを登録する | VS Codeをデフォルトエディタに |
   | ✅ **PATHへの追加**（再起動後に使用可能） | **必須** - ターミナルから`code`コマンドが使える |

5. **インストール準備完了**
   - 「インストール」をクリック

6. **完了**
   - 「Visual Studio Codeを実行する」にチェックを入れて「完了」

### 2.3 VS Codeの基本画面

VS Codeを起動すると、以下のような画面が表示されます：

```
┌─────────────────────────────────────────────────────────┐
│ ファイル  編集  選択  表示  移動  実行  ターミナル  ヘルプ │  ← メニューバー
├────┬────────────────────────────────────────────────────┤
│    │                                                    │
│ 📁 │                                                    │
│    │              ようこそタブ                          │
│ 🔍 │                                                    │
│    │                                                    │
│ 🔀 │                                                    │
│    │                                                    │
│ 🐛 │                                                    │
│    │                                                    │
│ 🧩 │                                                    │  ← 拡張機能
│    │                                                    │
├────┴────────────────────────────────────────────────────┤
│                    ターミナル領域                        │
└─────────────────────────────────────────────────────────┘
```

### 2.4 よく使うショートカットキー

| 操作 | ショートカット |
|------|---------------|
| コマンドパレットを開く | `Ctrl + Shift + P` |
| ターミナルを開く/閉じる | `` Ctrl + ` `` （バッククォート） |
| 新しいファイルを作成 | `Ctrl + N` |
| ファイルを保存 | `Ctrl + S` |
| フォルダを開く | `Ctrl + K` → `Ctrl + O` |
| 設定を開く | `Ctrl + ,` |
| サイドバーの表示/非表示 | `Ctrl + B` |

### 2.5 フォルダを開く

#### 方法1: メニューから

1. 「ファイル」→「フォルダーを開く」
2. 開きたいフォルダを選択
3. 「フォルダーの選択」をクリック

#### 方法2: エクスプローラーから（右クリック）

1. 開きたいフォルダを右クリック
2. 「Codeで開く」を選択

#### 方法3: ターミナルから

```bash
code C:/your-folder
```

または、フォルダ内で：

```bash
code .
```

### 2.6 ファイルを作成する

#### 方法1: エクスプローラーパネルから

1. 左サイドバーの📁アイコンをクリック
2. フォルダ名の右にある「新しいファイル」アイコン（📄+）をクリック
3. ファイル名を入力して `Enter`

#### 方法2: 右クリックから

1. エクスプローラーパネルで右クリック
2. 「新しいファイル」を選択
3. ファイル名を入力して `Enter`

#### 方法3: ショートカットから

1. `Ctrl + N` で新規ファイル
2. `Ctrl + S` で保存時にファイル名を指定

### 2.7 ターミナルの使い方

#### ターミナルを開く

`` Ctrl + ` ``（バッククォートキー）を押す

または：「ターミナル」メニュー →「新しいターミナル」

#### ターミナルの種類を切り替える

VS Codeでは複数のシェルが使えます：

| シェル | 用途 |
|--------|------|
| PowerShell | Windows標準、一般的なコマンド |
| Git Bash | Unix系コマンド、Git操作 |
| Command Prompt | 従来のWindowsコマンド |
| WSL (Ubuntu) | Linux環境、開発作業 |

**切り替え方法**:

1. ターミナル右上の **▼（ドロップダウン）** をクリック
2. 使いたいシェルを選択

または：

1. ターミナル右上の **＋** の横にある **▼** をクリック
2. 「Select Default Profile」で変更

#### どのターミナルを使うべき？

| 作業内容 | おすすめシェル |
|----------|---------------|
| Claude Code | WSL (Ubuntu) |
| Docker操作 | PowerShell または WSL |
| Git操作 | Git Bash または WSL |
| 一般的なWindows作業 | PowerShell |

### 2.8 WSL拡張機能をインストールする

Claude Codeを使うには、WSL拡張機能が必要です。

1. 左サイドバーの🧩（拡張機能）アイコンをクリック
2. 検索バーに「WSL」と入力
3. 「WSL」（Microsoft製、青いアイコン）の「インストール」をクリック

#### Remote Development拡張機能パック（推奨）

WSL以外にも便利な拡張機能がまとまったパックもあります：

1. 検索バーに「Remote Development」と入力
2. 「Remote Development」（Microsoft製）をインストール

これには以下が含まれます：
- WSL
- Remote - SSH
- Dev Containers

### 2.9 コマンドパレットからWSLに接続する

1. `Ctrl + Shift + P` でコマンドパレットを開く
2. 「WSL: Connect to WSL」と入力して選択
3. VS CodeがWSL環境で再起動される

接続すると、左下に「WSL: Ubuntu」と表示されます。

#### WSLでフォルダを開く

1. `Ctrl + Shift + P` でコマンドパレットを開く
2. 「WSL: Open Folder in WSL」と入力して選択
3. 開きたいフォルダを選択

#### WSLターミナルからVS Codeを開く

WSLターミナル内で、作業したいディレクトリに移動してから：

```bash
code .
```

これでそのフォルダがVS Codeで開きます。

### 2.10 デフォルトターミナルの設定（任意）

VS Code内のターミナルをデフォルトでWSLにする場合：

1. `Ctrl + Shift + P` でコマンドパレットを開く
2. 「Terminal: Select Default Profile」と入力
3. 「Ubuntu (WSL)」を選択

---

### 2.11 Git for Windowsのインストール

Git BashやVS CodeでGitを使うために、Git for Windowsをインストールします。

#### ダウンロード

1. [Git for Windows公式サイト](https://gitforwindows.org/) を開く
2. 「Download」ボタンをクリック
3. 最新版（2026年2月現在: Git 2.53.0）がダウンロードされる

#### インストール手順

ダウンロードした `Git-2.xx.x-64-bit.exe` を実行します。

1. **Select Components（コンポーネント選択）**
   - デフォルトのまま「Next」
   - 「Windows Explorer integration」にチェックが入っていることを確認

2. **Choosing the default editor（デフォルトエディタ）**
   - 「Use Visual Studio Code as Git's default editor」を選択
   - VS Codeがインストールされていない場合は後から変更可能

3. **Adjusting the name of the initial branch（初期ブランチ名）**
   - 「Override the default branch name」を選択
   - 「main」と入力（GitHubの標準に合わせる）

4. **Adjusting your PATH environment（重要）**
   - **「Git from the command line and also from 3rd-party software」を選択**
   - これでPowerShellやVS CodeからもGitが使える

5. **Choosing the SSH executable**
   - 「Use bundled OpenSSH」のまま「Next」

6. **Choosing HTTPS transport backend**
   - 「Use the native Windows Secure Channel library」を選択

7. **Configuring the line ending conversions**
   - 「Checkout Windows-style, commit Unix-style line endings」を選択（推奨）

8. **Configuring the terminal emulator**
   - 「Use MinTTY」を選択（Git Bash用）

9. **Choose the default behavior of `git pull`**
   - 「Default (fast-forward or merge)」のまま「Next」

10. **Choose a credential helper（重要）**
    - **「Git Credential Manager」を選択**
    - GitHubとの認証が簡単になる

11. **Configuring extra options**
    - デフォルトのまま「Next」

12. **Install**
    - 「Install」をクリックしてインストール開始

#### インストールの確認

PowerShellまたはコマンドプロンプトを**新しく開いて**：

```powershell
git --version
```

```
git version 2.53.0.windows.1
```

と表示されればOKです。

---

### 2.12 GitHubアカウントの作成

GitHubは無料でアカウントを作成できます。

#### アカウント作成手順

1. [GitHub公式サイト](https://github.com/signup) を開く

2. **メールアドレスを入力**
   - 普段使うメールアドレスを入力
   - 「Continue」をクリック

3. **パスワードを設定**
   - 15文字以上、または8文字以上で数字と小文字を含む
   - 「Continue」をクリック

4. **ユーザー名を設定**
   - 英数字とハイフンのみ使用可能
   - 他のユーザーと重複不可
   - **注意**: 後から変更可能だが、URLも変わるので慎重に
   - 「Continue」をクリック

5. **メール配信設定**
   - 製品アップデートを受け取るか選択（「n」で不要）
   - 「Continue」をクリック

6. **認証パズル**
   - 「検証する」をクリック
   - 表示される画像パズルを解く

7. **メール認証**
   - 入力したメールアドレスに認証コードが届く
   - 8桁のコードを入力

8. **プラン選択**
   - 「Free」を選択（個人利用には十分）
   - 「Skip personalization」をクリック

#### 無料プランでできること

| 機能 | Free（無料） |
|------|-------------|
| パブリックリポジトリ | 無制限 |
| プライベートリポジトリ | 無制限 |
| コラボレーター | 無制限 |
| GitHub Actions | 2,000分/月 |
| GitHub Copilot | 別途契約が必要 |

---

### 2.13 Gitの初期設定

Gitを使う前に、ユーザー名とメールアドレスを設定します。

#### PowerShellまたはGit Bashで実行

```bash
# ユーザー名を設定（GitHubと同じにする）
git config --global user.name "あなたのユーザー名"

# メールアドレスを設定（GitHubと同じにする）
git config --global user.email "your-email@example.com"
```

#### 設定の確認

```bash
git config --global --list
```

```
user.name=あなたのユーザー名
user.email=your-email@example.com
```

---

### 2.14 VS CodeでGitを使う

VS CodeはGitと統合されており、GUIでGit操作ができます。

#### ソース管理パネル

左サイドバーの🔀（ソース管理）アイコンをクリックすると、Gitの状態が表示されます。

```
ソース管理
├── 変更（Changes）     ← 変更されたファイル一覧
├── ステージング済み    ← コミット対象のファイル
└── コミットメッセージ  ← コミット時のメッセージ入力欄
```

#### 基本的なGit操作

| 操作 | VS Codeでの方法 |
|------|----------------|
| 変更を確認 | ソース管理パネルで変更ファイルをクリック |
| ステージング | ファイル横の「+」をクリック |
| コミット | メッセージ入力 → ✓ボタン |
| プッシュ | 「...」→「Push」または `Ctrl + Shift + P` →「Git: Push」 |
| プル | 「...」→「Pull」または `Ctrl + Shift + P` →「Git: Pull」 |

#### GitHubとの連携（初回のみ）

1. VS Codeでリポジトリをクローンまたはプッシュしようとする
2. ブラウザが開き、GitHubへのサインインを求められる
3. 「Authorize Visual-Studio-Code」をクリック
4. VS Codeに戻ると認証完了

#### リポジトリをクローンする

1. `Ctrl + Shift + P` でコマンドパレットを開く
2. 「Git: Clone」と入力して選択
3. GitHubのリポジトリURLを入力
4. 保存先フォルダを選択
5. 「Open」でプロジェクトを開く

#### 新しいリポジトリを作成する

1. VS Codeでフォルダを開く
2. ソース管理パネルで「リポジトリを初期化」をクリック
3. 変更をコミット
4. 「ブランチの発行」でGitHubにプッシュ

### チェックポイント

- [ ] VS Codeをインストールした
- [ ] PATHへの追加にチェックを入れた
- [ ] ターミナルを開ける（`` Ctrl + ` ``）
- [ ] Git for Windowsをインストールした
- [ ] `git --version` でバージョンが表示される
- [ ] GitHubアカウントを作成した
- [ ] Gitの初期設定（user.name, user.email）を完了した
- [ ] WSL拡張機能をインストールした
- [ ] コマンドパレットから「WSL: Connect to WSL」でWSLに接続できた
- [ ] VS Codeの左下に「WSL: Ubuntu」と表示されている

---

## セクション3: Claude Codeのインストール

### 3.1 ネイティブインストール（推奨）

2026年現在、Claude Codeはネイティブインストーラーが推奨されています。Node.jsは不要です。

#### WSLターミナルでインストール

VS CodeでWSLに接続した状態で、ターミナル（`` Ctrl + ` ``）を開き、以下を実行：

```bash
curl -fsSL https://claude.ai/install.sh | sh
```

インストールが完了すると、以下のように表示されます：

```
Claude Code has been installed successfully!
Run 'claude' to get started.
```

#### インストールの確認

```bash
claude --version
```

バージョン番号が表示されればOKです。

### 3.2 npmインストール（代替方法）

何らかの理由でネイティブインストールができない場合のみ使用してください。

```bash
# Node.js v18-v24が必要（v25以降は非対応）
npm install -g @anthropic-ai/claude-code
```

**注意**: npmインストールは将来的に非推奨となる予定です。可能な限りネイティブインストールを使用してください。

### 3.3 npmからネイティブへの移行

既にnpmでインストールしている場合：

```bash
claude install
```

これでネイティブ版に移行できます。

### チェックポイント

- [ ] `curl -fsSL https://claude.ai/install.sh | sh` を実行した
- [ ] `claude --version` でバージョンが表示される

---

## セクション4: 認証と動作確認

### 4.1 Claude Codeを起動する

```bash
claude
```

初回起動時は認証が必要です。

### 4.2 認証方法

Claude Codeはブラウザでの認証を使用します。

1. `claude` コマンドを実行
2. 表示されるURLをブラウザで開く（自動で開かない場合は `c` キーでコピー）
3. Anthropicアカウントでログイン
4. 認証コードを確認してターミナルに戻る

```
? How would you like to authenticate?
> Log in with Claude.ai (Pro/Max subscription)
  Use an API key
```

**Claude Pro/Maxサブスクリプションの場合**: 「Log in with Claude.ai」を選択

**APIキーを使用する場合**: 「Use an API key」を選択してキーを入力

### 4.3 認証状態の確認

認証が完了したら、Claude Code内で以下を実行：

```
/status
```

認証状態やアカウント情報が表示されます。

### 4.4 動作テスト

簡単なプロンプトで動作確認：

```
こんにちは、動作確認です
```

応答が返ってくれば、セットアップ完了です。

### チェックポイント

- [ ] `claude` コマンドで起動できた
- [ ] ブラウザ認証が完了した
- [ ] `/status` で認証状態を確認した
- [ ] 簡単なプロンプトに応答が返ってきた

---

## トラブルシューティング

### WSL関連

#### エラー: 0x80370102「仮想マシンを開始できませんでした」

**原因**: 仮想化が有効になっていない

**解決策**:
1. タスクマネージャーで仮想化が「有効」か確認
2. 無効の場合、[セクション1.2](#12-biosuefiで仮想化を有効にする)を参照してBIOSで有効化
3. それでも解決しない場合、以下を確認：
   - Windowsセキュリティ → デバイスセキュリティ → コア分離 → メモリ整合性を「オフ」にする
   - 再起動して再試行

#### エラー: WSLがインストールされていない

```powershell
# WSL機能を手動で有効化
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

再起動後、`wsl --install` を再実行。

#### WSLが起動しない・フリーズする

```powershell
# WSLをシャットダウン
wsl --shutdown

# WSLを更新
wsl --update

# 再度起動
wsl
```

#### Ubuntuの初期設定画面が出ない

スタートメニューから「Ubuntu」を検索して直接起動してください。

---

### VS Code関連

#### VS Codeのインストール後、`code`コマンドが使えない

**原因**: PATHへの追加がされていない、または再起動していない

**解決策**:
1. PCを再起動する
2. それでも使えない場合、VS Codeを再インストールし「PATHへの追加」にチェック

#### ターミナルが開かない / `` Ctrl + ` `` が効かない

**解決策**:
1. メニューから開く:「ターミナル」→「新しいターミナル」
2. キーボード設定を確認: `Ctrl + Shift + P` →「Preferences: Open Keyboard Shortcuts」→「terminal」で検索

#### ターミナルでGit Bashが選択肢にない

**原因**: Git for Windowsがインストールされていない

**解決策**:
1. [Git公式サイト](https://git-scm.com/download/win)からGit for Windowsをインストール
2. VS Codeを再起動
3. ターミナルのドロップダウンにGit Bashが表示される

#### ターミナルの文字化け

**解決策**:
1. `Ctrl + ,` で設定を開く
2. 検索バーに「terminal font」と入力
3. 「Terminal > Integrated: Font Family」を確認
4. 日本語対応フォント（例: `Consolas, 'MS Gothic'`）に変更

#### WSL拡張機能が動作しない

1. VS Codeを完全に終了
2. WSLをシャットダウン: `wsl --shutdown`
3. VS Codeを再起動
4. 「WSL: Connect to WSL」を再実行

#### 「WSL: Ubuntu」が表示されない

1. 拡張機能が正しくインストールされているか確認
2. WSL自体が正常に動作しているか確認: `wsl -l -v`
3. VS Codeを管理者として実行してみる

#### WSLでファイルが見えない / 保存できない

**原因**: Windowsのファイルシステムとの連携問題

**解決策**:
- Windowsのファイル（`C:\`など）を編集する場合: WSLから `/mnt/c/` でアクセス
- WSL内のファイルを編集する場合: `~` や `/home/` 以下で作業

```bash
# Windowsのファイルにアクセス
cd /mnt/c/Users/YourName/Documents

# WSL内で作業（推奨）
cd ~/projects
```

#### 右クリックで「Codeで開く」が表示されない

**解決策**:
VS Codeを再インストールし、以下のオプションにチェック:
- 「エクスプローラーのファイルコンテキストメニューに追加」
- 「エクスプローラーのディレクトリコンテキストメニューに追加」

---

### Git / GitHub関連

#### `git` コマンドが認識されない

**原因**: PATHが通っていない、または再起動していない

**解決策**:
1. PowerShell/コマンドプロンプトを**新しく開く**（再起動後でないとPATHが反映されない）
2. それでも使えない場合、Git for Windowsを再インストールし「Git from the command line and also from 3rd-party software」を選択

#### VS CodeでGitが認識されない

**解決策**:
1. VS Codeを完全に終了して再起動
2. それでもダメな場合、設定でGitのパスを指定:
   - `Ctrl + ,` で設定を開く
   - 「git.path」で検索
   - `C:\Program Files\Git\bin\git.exe` を入力

#### GitHubにプッシュできない（認証エラー）

**解決策**:
1. VS Codeで「Accounts」アイコン（左下の人マーク）をクリック
2. 「Sign in with GitHub」を選択
3. ブラウザで認証を完了

または、Git Credential Managerをリセット:
```powershell
git credential-manager github logout
```

#### 「fatal: not a git repository」エラー

**原因**: 現在のフォルダがGitリポジトリではない

**解決策**:
```bash
# 現在のフォルダをGitリポジトリにする
git init

# または、既存のリポジトリをクローンする
git clone https://github.com/username/repo.git
```

#### コミット時に「Author identity unknown」エラー

**原因**: Gitのユーザー設定がされていない

**解決策**:
```bash
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
```

#### プッシュ時に「Updates were rejected」エラー

**原因**: リモートに新しいコミットがある

**解決策**:
```bash
# まずプルしてマージ
git pull origin main

# コンフリクトがあれば解決してからプッシュ
git push origin main
```

#### 日本語ファイル名が文字化けする

**解決策**:
```bash
git config --global core.quotepath false
```

---

### Claude Code関連

#### インストールコマンドがエラーになる

**curl not found**:
```bash
sudo apt update && sudo apt install curl -y
```

**Permission denied**:
```bash
# sudoで実行（通常は不要）
curl -fsSL https://claude.ai/install.sh | sudo sh
```

#### 「Invalid API key」と表示される

1. `/login` コマンドで再認証
2. ブラウザが自動で開かない場合は `c` キーでURLをコピー
3. 環境変数 `ANTHROPIC_API_KEY` が設定されていないか確認

```bash
# 環境変数を確認
echo $ANTHROPIC_API_KEY

# 設定されている場合は削除（サブスクリプション使用時）
unset ANTHROPIC_API_KEY
```

#### 認証後も「Please run /login」と表示される

キーチェーンの問題の可能性があります：

```bash
# Claude Codeを再インストール
claude install

# 再認証
claude
```

#### APIキーでの認証に切り替えたい

1. [Anthropic Console](https://console.anthropic.com/)でAPIキーを取得
2. 環境変数を設定：

```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

永続化する場合は `~/.bashrc` に追加：

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.bashrc
source ~/.bashrc
```

#### Claude Codeが応答しない・タイムアウトする

1. ネットワーク接続を確認
2. Claude Codeを再起動: `Ctrl+C` で終了して `claude` で再起動
3. WSLを再起動: `wsl --shutdown` してから再度起動

---

### 環境変数とPATH

#### PATHとは？

PATHは「コマンドを探す場所」を指定する環境変数です。`git`や`code`などのコマンドを実行するとき、OSはPATHに登録されたフォルダからプログラムを探します。

#### PATHが通っているか確認する方法

**PowerShellの場合**:
```powershell
# 現在のPATHを確認
$env:PATH -split ';'

# 特定のコマンドがどこにあるか確認
Get-Command git
Get-Command code
```

**Git Bash / WSLの場合**:
```bash
# 現在のPATHを確認
echo $PATH | tr ':' '\n'

# 特定のコマンドがどこにあるか確認
which git
which code
which claude
```

#### WindowsでPATHを手動で設定する方法

インストーラーでPATH設定を忘れた場合、手動で追加できます。

1. `Win + I` で「設定」を開く
2. 「システム」→「バージョン情報」→「システムの詳細設定」
3. 「環境変数」ボタンをクリック
4. 「ユーザー環境変数」の「Path」を選択して「編集」
5. 「新規」をクリックして以下を追加：

| ツール | 追加するパス |
|--------|-------------|
| VS Code | `C:\Users\{ユーザー名}\AppData\Local\Programs\Microsoft VS Code\bin` |
| Git | `C:\Program Files\Git\bin` |
| Node.js | `C:\Program Files\nodejs` |

6. 「OK」で閉じる
7. **PowerShell/コマンドプロンプトを新しく開く**（既存のウィンドウには反映されない）

#### よくあるPATH問題

**症状**: インストール直後にコマンドが使えない

**原因**: 新しいターミナルを開いていない

**解決策**:
- 既存のターミナルを閉じて、新しく開く
- または、PCを再起動

---

**症状**: 「〇〇は内部コマンドまたは外部コマンド...として認識されていません」

**原因**: PATHが通っていない

**解決策**:
1. 上記の手動設定方法でPATHを追加
2. ターミナルを新しく開く

---

**症状**: WSLで `code` コマンドが使えない

**原因**: VS CodeのWSL拡張機能が正しくインストールされていない

**解決策**:
```bash
# WSL内でVS Codeサーバーを再インストール
rm -rf ~/.vscode-server
code .
```

#### WSLでのPATH設定

WSL内でPATHを追加する場合は `~/.bashrc` に追記します。

```bash
# .bashrcを編集
nano ~/.bashrc

# 以下を最後に追加
export PATH="$HOME/.local/bin:$PATH"

# 変更を反映
source ~/.bashrc
```

#### 環境変数の設定（APIキーなど）

**一時的に設定**（ターミナルを閉じると消える）:
```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

**永続的に設定**（WSL / Git Bash）:
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.bashrc
source ~/.bashrc
```

**Windowsで永続的に設定**:
1. 「環境変数」の設定画面を開く（上記参照）
2. 「ユーザー環境変数」の「新規」をクリック
3. 変数名と値を入力して「OK」

---

### その他

#### 「command not found: claude」

パスが通っていない可能性があります：

```bash
# パスを確認
echo $PATH

# claudeがどこにあるか確認
ls ~/.claude/bin/

# 手動でパスを追加（ネイティブインストールの場合）
export PATH="$HOME/.claude/bin:$PATH"

# 永続化
echo 'export PATH="$HOME/.claude/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Windows Defenderがブロックする

1. Windows セキュリティを開く
2. 「ウイルスと脅威の防止」→「設定の管理」
3. 「除外」→「除外の追加または削除」
4. WSLのパス（`\\wsl$\Ubuntu`）を除外に追加

#### ターミナルを再起動しても設定が反映されない

**PowerShellの場合**:
```powershell
# 環境変数をリロード
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**それでもダメな場合**: PCを再起動してください

---

## まとめ

### このモジュールで学んだこと

- VS Codeのインストールと基本操作（ファイル作成、ターミナル操作、シェル切り替え）
- Git for WindowsのインストールとGitHubアカウント作成
- VS CodeでのGit操作（ステージング、コミット、プッシュ）
- WSL2のセットアップ（BIOS仮想化設定を含む）
- VS CodeでWSL環境を使う方法
- Claude Codeのネイティブインストール
- 認証設定と基本的な使い方

### 次のステップ

- [Hooksで会話ログを自動保存する](./module-01-setup.md) - セッション終了時にログを自動エクスポート
- [スキルで過去ログを一括保存・検索する](./module-02-skill.md) - スキル機能でより高度なログ管理

---

## 参考資料

- [Claude Code公式ドキュメント](https://code.claude.com/docs/en/setup)
- [Microsoft WSL公式ドキュメント](https://learn.microsoft.com/ja-jp/windows/wsl/install)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/wsl)
- [Anthropic Console（APIキー取得）](https://console.anthropic.com/)

---

## よくある質問

**Q: WSL1とWSL2の違いは？**
A: WSL2は完全なLinuxカーネルを使用し、ファイルシステムのパフォーマンスが向上しています。Docker等の互換性もWSL2の方が優れています。常にWSL2を使用してください。

**Q: Claude Codeは無料で使えますか？**
A: Claude Pro（月額$20）またはMax（月額$100/$200）サブスクリプション、もしくはAPIキー（従量課金）が必要です。無料のClaudeアカウントでは使用できません。

**Q: npmインストールとネイティブインストールの違いは？**
A: ネイティブインストールはNode.jsが不要で、自動アップデートに対応しています。npmインストールは将来的に非推奨となる予定のため、ネイティブインストールを推奨します。

**Q: Mac/Linuxでも同じ手順ですか？**
A: Mac/LinuxではWSLのセットアップは不要です。ターミナルで直接 `curl -fsSL https://claude.ai/install.sh | sh` を実行してください。

**Q: 複数のPCで同じアカウントを使えますか？**
A: はい、同じAnthropicアカウントで複数のPCにClaude Codeをインストールして使用できます。

**Q: VS CodeのターミナルでPowerShell、Git Bash、WSLのどれを使うべき？**
A: Claude Codeを使う場合はWSL（Ubuntu）を使用してください。Dockerや一般的なWindows作業ではPowerShell、Git操作ではGit Bashも便利です。

**Q: VS Codeで日本語が文字化けします**
A: 設定（`Ctrl + ,`）で「encoding」を検索し、「Files: Encoding」を「utf8」に設定してください。ターミナルの文字化けは「terminal font」で日本語対応フォントを設定します。

**Q: GitHubは有料ですか？**
A: 個人利用は無料です。パブリック・プライベートリポジトリともに無制限で作成できます。チーム機能や高度なセキュリティ機能は有料プランで提供されています。

**Q: GitとGitHubの違いは？**
A: Gitはバージョン管理ツール（ソフトウェア）、GitHubはGitリポジトリをホスティングするWebサービスです。Gitはローカルで動作し、GitHubはクラウド上でコードを共有・管理するために使います。

**Q: Git BashとPowerShellのどちらを使うべき？**
A: どちらでもGitは使えます。Unix系コマンド（`ls`, `cat`, `grep`など）に慣れている場合はGit Bash、Windows標準で統一したい場合はPowerShellがおすすめです。
