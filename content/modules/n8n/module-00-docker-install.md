# Docker Desktop インストールガイド

**所要時間**: 15-20分
**難易度**: ⭐☆☆☆☆

---

## このモジュールで学ぶこと

- Docker Desktopとは何か
- Windows/Mac向けインストール手順
- 正常にインストールされたかの確認方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Docker Desktopがインストールされている
- ターミナルでDockerコマンドが実行できる
- Docker Desktopを起動・停止できる

---

## 目次

- [セクション1: Docker Desktopとは](#セクション1-docker-desktopとは)
- [セクション2: システム要件](#セクション2-システム要件)
- [セクション3: ダウンロード](#セクション3-ダウンロード)
- [セクション4: インストール（Windows）](#セクション4-インストールwindows)
- [セクション5: インストール（Mac）](#セクション5-インストールmac)
- [セクション6: 初回起動と設定](#セクション6-初回起動と設定)
- [セクション7: 動作確認](#セクション7-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)

---

## セクション1: Docker Desktopとは

### Dockerの概要

**Docker**（ドッカー）は、アプリケーションを「コンテナ」という単位で動かす技術です。

### なぜDockerを使うのか

| 従来の方法 | Dockerを使う方法 |
|-----------|-----------------|
| 複雑な環境構築が必要 | コマンド1つで起動 |
| 環境差異でエラーが起きる | どのPCでも同じ動作 |
| アンインストールが大変 | コンテナ削除で完了 |

### Docker Desktopとは

**Docker Desktop**は、WindowsやMacでDockerを簡単に使えるようにするアプリケーションです。

- **GUI（画面）** でコンテナを管理できる
- **自動起動** でDockerを常に使える状態に
- **無料** で個人利用可能

---

## セクション2: システム要件

### Windows

| 項目 | 要件 |
|------|------|
| OS | Windows 10 64bit (Build 19041以降) / Windows 11 |
| メモリ | 4GB以上（8GB推奨） |
| CPU | 64bit、仮想化対応 |
| ストレージ | 20GB以上の空き容量 |

### Mac

| 項目 | 要件 |
|------|------|
| OS | macOS 12 (Monterey) 以降 |
| メモリ | 4GB以上（8GB推奨） |
| CPU | Apple Silicon (M1/M2/M3) または Intel |
| ストレージ | 20GB以上の空き容量 |

### 確認方法

#### Windowsの場合

1. `Windowsキー + I` で設定を開く
2. 「システム」→「バージョン情報」
3. Windowsのバージョンとビルド番号を確認

#### Macの場合

1. 左上のリンゴマーク →「このMacについて」
2. macOSのバージョンを確認

---

## セクション3: ダウンロード

### 公式サイトにアクセス

以下のURLからDocker Desktopをダウンロードします：

```
https://www.docker.com/products/docker-desktop/
```

### ダウンロード手順

1. 上記URLにアクセス
2. 「Download for Windows」または「Download for Mac」をクリック

![Docker Desktop ダウンロードページ](/n8n-setup/docker-download-page.png)

### どちらをダウンロードする？

#### Windowsの場合

**AMD64（x86_64）** を選択してください。ほとんどのWindows PCはこちらです。

#### Macの場合

Macには2種類のダウンロードがあります：

| チップ | 選択 | 対象 |
|--------|------|------|
| M1, M2, M3, M4 | **ARM64（Apple Silicon）** | 2020年以降のMac |
| Intel | **AMD64（Intel chip）** | 2020年以前のMac |

#### 自分のMacを確認する方法

1. 左上の **リンゴマーク** をクリック
2. **「このMacについて」** を選択
3. 表示を確認：
   - 「チップ」に **Apple M1/M2/M3/M4** と書いてあれば → **ARM64**
   - 「プロセッサ」に **Intel** と書いてあれば → **AMD64**

![Macのチップ確認](/n8n-setup/mac-chip-check.png)

### チェックポイント

- [ ] Docker Desktopのインストーラーがダウンロードされた
- [ ] ファイル名: `Docker Desktop Installer.exe`（Windows）または `Docker.dmg`（Mac）

---

## セクション4: インストール（Windows）

### インストール手順

#### 1. インストーラーを実行

ダウンロードした `Docker Desktop Installer.exe` をダブルクリック

#### 2. 設定画面

以下のオプションが表示されます：

| オプション | 推奨 | 説明 |
|-----------|------|------|
| Use WSL 2 instead of Hyper-V | **チェック入れる** | Linuxコンテナ用（n8nはこれで動く） |
| Add shortcut to desktop | お好みで | デスクトップにショートカット作成 |
| Allow Windows containers | **チェック不要** | Windows専用アプリ開発用（n8nには不要） |

![Docker インストール設定](/n8n-setup/docker-install-options.png)

「OK」をクリックしてインストール開始

#### 3. インストール完了

インストールが完了すると「Close and restart」ボタンが表示されます。

**PCを再起動** してください。

### WSL 2について

**WSL 2**（Windows Subsystem for Linux 2）は、Windows上でLinuxを動かす仕組みです。

Docker DesktopはWSL 2を使うことで、より高速に動作します。

#### WSL 2のインストール手順

インストール中または起動時に「WSL 2のインストールが必要」「コマンドラインが無効」などと表示された場合、以下の手順でWSL 2をセットアップします。

##### 手順1: PowerShellを管理者権限で開く

1. スタートメニューで「**PowerShell**」を検索
2. **右クリック** →「**管理者として実行**」

##### 手順2: WSLをインストール

```powershell
wsl --install
```

このコマンドでインストールできれば、PCを再起動して完了です。

##### 「無効」エラーが出た場合

`wsl --install`で「無効」などのエラーが出た場合、Windowsの機能を手動で有効にする必要があります。

**方法A: コマンドで有効化（推奨）**

PowerShell（管理者）で以下を順番に実行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

その後PCを再起動し、再度 `wsl --install` を実行。

**コマンドの意味:**

| 部分 | 意味 |
|------|------|
| `dism.exe` | Windows機能を管理するMicrosoft公式ツール |
| `/online` | 今動いているWindowsに対して実行 |
| `/enable-feature` | 機能を有効化する |
| `/featurename:...` | 有効にする機能の名前 |
| `/norestart` | 自動で再起動しない |

> **安全性**: これはMicrosoft公式の手順です。Windowsに元々含まれている機能をONにするだけで、何かをインストールするわけではありません。

**方法B: 画面操作で有効化**

コマンドが不安な場合は、画面操作でも同じことができます：

1. スタートメニューで「**Windows の機能の有効化または無効化**」を検索して開く
2. 以下の2つにチェックを入れる：
   - **Linux 用 Windows サブシステム**
   - **仮想マシン プラットフォーム**
3. 「OK」をクリック
4. PCを再起動
5. 再起動後、PowerShell（管理者）で `wsl --install` を実行

##### 「カーネルファイルが見つかりません」エラーが出た場合

WSLの状態確認（`wsl --status`）で以下のようなメッセージが表示された場合：

```
WSL 2 カーネル ファイルが見つかりません。カーネルを更新または復元するには、'wsl.exe --update' を実行してください。
```

以下のコマンドでカーネルをインストールします：

```powershell
wsl --update
```

これでWSL 2カーネルがダウンロード・インストールされます。

##### WSLの状態確認方法

現在のWSLの状態を確認するには：

```powershell
wsl --status
```

正常な場合、以下のように表示されます：

```
既定のバージョン: 2
```

### チェックポイント

- [ ] Docker Desktopのインストールが完了した
- [ ] WSL 2がセットアップされた（必要な場合）
- [ ] PCを再起動した

---

## セクション5: インストール（Mac）

### インストール手順

#### 1. DMGファイルを開く

ダウンロードした `Docker.dmg` をダブルクリック

#### 2. アプリケーションフォルダにドラッグ

表示されたウィンドウで、DockerアイコンをApplicationsフォルダにドラッグ＆ドロップ

![Docker Mac インストール](/n8n-setup/docker-mac-install.png)

#### 3. Docker Desktopを起動

Launchpadまたはアプリケーションフォルダから「Docker」を起動

#### 4. セキュリティ許可

初回起動時、以下の許可を求められます：

- 「"Docker"はインターネットからダウンロードされたアプリケーションです」→「開く」
- システム拡張機能の許可 →「許可」
- ネットワークアクセスの許可 →「許可」

### チェックポイント

- [ ] Docker DesktopがApplicationsフォルダにインストールされた
- [ ] 初回起動の許可を完了した

---

## セクション6: 初回起動と設定

### Docker Desktopの起動

#### Windows

- スタートメニューから「Docker Desktop」を検索して起動
- またはデスクトップのショートカットをダブルクリック

#### Mac

- Launchpadから「Docker」を起動
- またはアプリケーションフォルダから起動

### 初回起動時の画面

初回起動時、いくつかの画面が順番に表示されます。

#### 画面1: 利用規約（Docker Subscription Service Agreement）

「Accept」をクリックしてください。

| 利用形態 | 料金 |
|---------|------|
| 個人利用 | **無料** |
| 教育・学習目的 | **無料** |
| 小規模企業（従業員250人未満） | **無料** |
| 大企業 | 有料 |

n8nの学習・個人利用なら無料で使えます。

#### 画面2: アカウント登録（Welcome to Docker Desktop）

**スキップしてOKです。**

メールアドレスの登録やDocker Hubアカウントの作成を求められますが、**n8nには不要**です。

以下のいずれかをクリックしてスキップ：
- 「**Skip**」
- 「**Continue without signing in**」
- 「**Skip for now**」

#### 画面3: アンケート（Survey）

これも**スキップでOK**です。

「Skip」をクリックして進んでください。

### 起動完了の確認

Docker Desktopが正常に起動すると：

- **Windows**: タスクバー（右下）にクジラのアイコンが表示
- **Mac**: メニューバー（右上）にクジラのアイコンが表示

クジラのアイコンが**静止**していれば起動完了です。

> **注意**: アイコンがアニメーション中は起動処理中です。静止するまで待ってください。

### 推奨設定

Docker Desktopの設定画面（歯車アイコン）で以下を確認：

#### General

- **Start Docker Desktop when you sign in** → チェックを入れる（PC起動時に自動起動）

#### Resources（リソース）

- **Memory**: 4GB以上（8GB推奨）
- **CPUs**: 2以上

### チェックポイント

- [ ] Docker Desktopが起動した
- [ ] タスクバー/メニューバーにクジラアイコンが表示された
- [ ] アイコンが静止している（起動完了）

---

## セクション7: 動作確認

### ターミナルを開く

#### Windows

1. スタートメニューで「cmd」または「PowerShell」を検索
2. 「コマンドプロンプト」または「PowerShell」を起動

#### Mac

1. Spotlight（`Command + Space`）で「Terminal」を検索
2. ターミナルを起動

### Dockerバージョン確認

以下のコマンドを実行：

```bash
docker --version
```

#### 正常な出力例

```
Docker version 28.1.1, build 4eba377
```

バージョン番号が表示されればOK。

### Docker Composeバージョン確認

```bash
docker-compose --version
```

#### 正常な出力例

```
Docker Compose version v2.35.1-desktop.1
```

### テストコンテナの実行

Dockerが正常に動作するか確認：

```bash
docker run hello-world
```

#### 正常な出力例

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

「Hello from Docker!」と表示されれば成功です。

### チェックポイント

- [ ] `docker --version` でバージョンが表示された
- [ ] `docker-compose --version` でバージョンが表示された
- [ ] `docker run hello-world` が成功した

---

## トラブルシューティング

### 「docker: command not found」エラー

**原因**: Docker Desktopが起動していない、またはパスが通っていない

**解決方法**:
1. Docker Desktopを起動する
2. クジラアイコンが静止するまで待つ
3. ターミナルを**新しく開き直す**

### 「Cannot connect to the Docker daemon」エラー

**原因**: Docker Desktopが完全に起動していない

**解決方法**:
1. Docker Desktopを再起動
2. 1-2分待ってから再度コマンドを実行

### Windows: 「WSL 2 installation is incomplete」エラー

**解決方法**:
1. 管理者権限でPowerShellを開く
2. 以下を実行：

```powershell
wsl --update
```

3. PCを再起動

### Windows: 「Hyper-V is not enabled」エラー

**解決方法**:
1. 「Windows の機能の有効化または無効化」を開く
2. 「Hyper-V」にチェックを入れる
3. 「Windows ハイパーバイザー プラットフォーム」にチェックを入れる
4. PCを再起動

### Windows: 「Virtualization support not detected」エラー

**原因**: BIOSで仮想化機能が無効になっている

#### 仮想化技術とは？

**仮想化技術**（Virtualization Technology）とは、1台のPCの中で「仮想的なPC」を動かすための技術です。

| 項目 | 説明 |
|------|------|
| Intel VT-x | Intel製CPUの仮想化機能 |
| AMD-V / SVM | AMD製CPUの仮想化機能 |
| 用途 | Docker、仮想マシン、エミュレーターなど |

Dockerは「コンテナ」という軽量な仮想環境を使うため、この機能が必要です。

#### 解決方法: BIOSで仮想化を有効にする

##### 手順1: PCを再起動してBIOSに入る

再起動中に以下のキーを連打（メーカーによって異なる）：

| メーカー | キー |
|---------|------|
| HP | **F10** または **Esc** |
| Dell | F2 |
| Lenovo | F1 または F2 |
| ASUS | F2 または Del |
| Acer | F2 または Del |
| 自作PC | Del |

##### 手順2: 仮想化設定を探す

BIOS画面で以下のような項目を探してください：

- **Virtualization Technology** / **仮想化技術**
- **Intel VT-x**
- **AMD-V** / **SVM Mode**

場所の例：
- 「Advanced」→「CPU Configuration」
- 「Security」→「Virtualization」
- 「System Configuration」

> **HP の場合**: 「Security」または「Advanced」タブ内に「**セットアップ仮想化技術**」または「**Virtualization Technology**」があります。

##### 手順3: 有効化（Enable）

該当の項目を **Enabled**（有効）に変更

##### 手順4: 保存して終了

**F10キー** を押す →「Save and Exit」→ **Yes**

PCが自動的に再起動されます。

##### 手順5: Docker Desktopを起動

再起動後、Docker Desktopを起動して正常に動作するか確認してください。

### Mac: 「Docker Desktop requires a newer macOS version」エラー

**原因**: macOSのバージョンが古い

**解決方法**:
1. システム設定 →「ソフトウェアアップデート」
2. macOSを最新版にアップデート

### 起動が遅い

**原因**: リソース不足またはウイルス対策ソフトの干渉

**解決方法**:
1. Docker Desktop設定でメモリを増やす
2. ウイルス対策ソフトでDockerを除外設定にする

---

## まとめ

### このモジュールで学んだこと

- Docker Desktopをインストールできた
- ターミナルでDockerコマンドが実行できる
- Docker Desktopの起動・停止ができる

### 次のステップ

Docker Desktopのインストールが完了したら、次のモジュール「n8n Docker セットアップガイド」に進んでください。

n8nをDockerで起動し、ワークフロー自動化を始めましょう。

---

## 参考資料

- [Docker Desktop 公式ドキュメント](https://docs.docker.com/desktop/)
- [Docker Hub](https://hub.docker.com/)
- [WSL 2 インストールガイド（Microsoft公式）](https://learn.microsoft.com/ja-jp/windows/wsl/install)
