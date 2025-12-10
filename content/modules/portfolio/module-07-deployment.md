# デプロイと公開

**所要時間**: 75分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- Gitの基本操作（add/commit/push）
- GitHubリポジトリの作成と管理
- FFMPEGによる動画最適化
- Vercelでのデプロイ（公開）
- メタデータ設定（favicon、OGP、タイトル）
- サイト更新の運用フロー

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- Gitの基本概念を理解し、バージョン管理ができる
- GitHubにリポジトリを作成し、コードをプッシュできる
- FFMPEGで動画を最適化できる
- Vercelでサイトを公開できる
- favicon、OGP、タイトルなどのメタデータを設定できる
- サイトを更新し、自動的に再デプロイできる

---

## 目次

- [セクション1: Gitの基本](#セクション1-gitの基本20分)
- [セクション2: GitHubリポジトリ作成](#セクション2-githubリポジトリ作成15分)
- [セクション3: 動画最適化](#セクション3-動画最適化15分)
- [セクション4: Vercelでデプロイ](#セクション4-vercelでデプロイ20分)
- [セクション5: メタデータ設定](#セクション5-メタデータ設定10分)
- [セクション6: 更新フロー](#セクション6-更新フロー10分)
- [セクション7: 演習](#セクション7-演習20分)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

以下が完了していることを確認してください：

- [ ] モジュール6が完了している
- [ ] ポートフォリオサイトが完成している
- [ ] VSCodeでプロジェクトが開いている
- [ ] GitHubアカウントがある（モジュール1で作成済み）

---

## セクション1: Gitの基本

### Gitとは？

**Git**（ギット）は、**バージョン管理システム**です。

**例え話:**
- Gitなし = Wordで「最終版.docx」「最終版2.docx」「本当の最終版.docx」を作る
- Gitあり = ファイルの変更履歴が自動で記録され、いつでも過去の状態に戻せる

**メリット:**
- 過去のバージョンに戻せる
- 複数人で同じファイルを編集できる
- 「いつ・誰が・何を変更したか」が記録される

---

### Git用語の基礎

| 用語 | 意味 |
|------|------|
| **リポジトリ** | プロジェクト全体を管理する場所（データベースのようなもの） |
| **コミット** | 変更を記録すること（セーブポイントを作る） |
| **プッシュ** | ローカルの変更をリモート（GitHub）にアップロードすること |
| **リモート** | インターネット上のリポジトリ（GitHubなど） |
| **ローカル** | 自分のパソコン上のリポジトリ |

---

### Gitの基本的な流れ

```
1. ファイルを編集
   ↓
2. git add（ステージングエリアに追加）
   ↓
3. git commit（変更を記録）
   ↓
4. git push（GitHubにアップロード）
```

**重要な概念:**

- **ステージングエリア**: コミットする前の「準備エリア」
- **コミットメッセージ**: 何を変更したかを説明する短い文章

---

### Claude Codeでコミットする

Claude Codeは、Gitコマンドを自動で実行してくれます。

**手順:**

1. **Claude Codeパネルで指示を出す**

```
現在の変更をコミットしてください。
```

2. **Claude Codeが以下を自動実行**
   - 変更されたファイルを確認（`git status`）
   - ファイルをステージング（`git add`）
   - コミットメッセージを生成（`git commit`）
   - GitHubにプッシュ（`git push`）※リポジトリ接続後

**コミットメッセージの例:**
```
Add hero section slideshow feature
Update about section layout
Fix responsive design issues
```

**ポイント:**
- コミットメッセージは英語が一般的
- 「何を追加/修正したか」を簡潔に書く
- Claude Codeが自動で適切なメッセージを生成してくれる

---

### .gitignoreとは？

**.gitignore**は、Gitで管理しないファイルを指定するファイルです。

**なぜ必要？**
- `node_modules/`（大量のライブラリファイル）は管理不要
- `.env`（秘密の情報）はGitHubにアップロードすべきでない

**Next.jsプロジェクトのデフォルト.gitignore:**
```
node_modules/
.next/
.env.local
.DS_Store
```

**通常は触る必要なし:**
- `create-next-app`で自動生成される
- 基本的にそのまま使ってOK

---

### チェックポイント

- [ ] Gitがバージョン管理システムであることを理解した
- [ ] コミット、プッシュの概念を理解した
- [ ] Claude Codeでコミットできることを理解した

---

## セクション2: GitHubリポジトリ作成

### GitHubとは？

**GitHub**（ギットハブ）は、Gitリポジトリを**インターネット上で管理できるサービス**です。

**例え話:**
- Git = 家計簿をつける仕組み
- GitHub = 家計簿をクラウド（Googleドライブのようなもの）に保存するサービス

**メリット:**
- パソコンが壊れてもコードが残る
- 複数のパソコンから同じプロジェクトを編集できる
- Vercelなどのデプロイサービスと連携できる

---

### リポジトリを作成する

**手順:**

#### 1. GitHubにログイン

ブラウザで https://github.com を開き、ログインします。

#### 2. 新規リポジトリを作成

1. 右上の「+」マークをクリック → 「New repository」
2. 以下を入力：

| 項目 | 設定 |
|------|------|
| Repository name | `portfolio-site` |
| Description（任意） | 「My portfolio website」など |
| Public / Private | **Private**を推奨 ※後で変更可 |
| Initialize this repository with | **チェックなし** |

3. 「Create repository」をクリック

#### 3. リポジトリURLをコピー

作成後、以下のような画面が表示されます：

```
Quick setup — if you've done this kind of thing before

HTTPS  SSH

https://github.com/username/portfolio-site.git
```

**HTTPSのURLをコピー**してください。

---

### Claude Codeでリポジトリに接続する

**手順:**

1. **Claude Codeパネルで指示**

```
以下のGitHubリポジトリに接続してください：
https://github.com/username/portfolio-site.git

現在のプロジェクトをこのリポジトリにプッシュしてください。
```

2. **Claude Codeが自動実行**
   - リモートリポジトリを設定（`git remote add origin ...`）
   - ブランチ名を確認/変更（`main`または`master`）
   - 初回プッシュ（`git push -u origin main`）

**注意:**
- 初回プッシュは少し時間がかかります（1-2分）
- すべてのファイルがアップロードされます

---

### Public vs Private リポジトリ

| 設定 | メリット | デメリット |
|------|---------|-----------|
| **Public** | 誰でも閲覧可能、ポートフォリオとしてアピールできる | コードが全公開される |
| **Private** | 自分だけが閲覧可能、コードが非公開 | 他の人に見せられない |

**推奨:**
- 開発中は**Private**
- 完成したら**Public**に変更してもOK

**Publicに変更する方法:**
1. GitHubのリポジトリページを開く
2. 「Settings」タブ
3. 一番下の「Danger Zone」→「Change repository visibility」
4. 「Change to public」

---

### チェックポイント

- [ ] GitHubリポジトリを作成できた
- [ ] リポジトリURLをコピーできた
- [ ] Claude Codeでリポジトリに接続できた
- [ ] 初回プッシュが成功した

---

## セクション3: 動画最適化

### なぜ動画を最適化するのか？

**問題:**
- 動画ファイルは**容量が大きい**（数百MB〜数GB）
- Vercelには**100MBのファイルサイズ制限**がある
- 大きいファイルはデプロイ時にエラーになる

**解決策:**
- **FFMPEG**で動画を圧縮する

---

### FFMPEGとは？

**FFMPEG**（エフエフエムペグ）は、動画・音声を変換・圧縮するツールです。

**できること:**
- 動画の圧縮（ファイルサイズを小さくする）
- フォーマット変換（MP4、WebMなど）
- 動画のトリミング、結合

**注意:**
- FFMPEGは奥が深いツール
- このモジュールでは「動画を圧縮する」だけに集中
- 沼にハマらないように注意！

---

### Claude CodeでFFMPEGをインストール

**手順:**

1. **Claude Codeパネルで指示**

```
FFMPEGをインストールしてください。
```

2. **Claude Codeが自動実行**

**Windows:**
```bash
winget install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

3. **インストール確認**

```bash
ffmpeg -version
```

バージョン情報が表示されればOKです。

---

### 動画を圧縮する

**手順:**

1. **圧縮したい動画を確認**

`public/mov/` フォルダ内の動画ファイルを確認します。

**例:**
```
public/mov/demo-video.mp4 (150MB)
```

2. **Claude Codeに指示**

```
public/mov/フォルダ内のすべての動画を、
100MB以下になるように圧縮してください。

元のファイルは残し、圧縮後のファイルは
同じフォルダに「-compressed」を付けて保存してください。
```

3. **Claude Codeが自動実行**

```bash
ffmpeg -i demo-video.mp4 -vcodec libx264 -crf 28 demo-video-compressed.mp4
```

**パラメータの意味:**
- `-i`: 入力ファイル
- `-vcodec libx264`: H.264コーデック（高品質）
- `-crf 28`: 圧縮率（18〜28が推奨、数字が大きいほど圧縮）
- 最後: 出力ファイル名

4. **ファイルサイズを確認**

**Windows:**
```bash
dir public/mov/
```

**Mac/Linux:**
```bash
ls -lh public/mov/
```

圧縮後のファイルが100MB以下になっていればOKです。

---

### 圧縮率の調整

**ファイルサイズが大きすぎる場合:**

```
さらに圧縮してください。CRF値を32に変更してください。
```

**画質が悪すぎる場合:**

```
CRF値を24に下げてください。
```

**目安:**
- CRF 18: ほぼ無劣化（ファイルサイズ大）
- CRF 23: 高品質（推奨）
- CRF 28: 標準品質
- CRF 32: 低品質（ファイルサイズ小）

---

### 圧縮後の対応

**元のファイルと差し替え:**

```
圧縮後のファイルを元のファイル名にリネームしてください。
元のファイルは削除してください。
```

**コードの更新:**

動画のパスが変わった場合、コードも更新します。

```
page.tsx内の動画パスを、圧縮後のファイル名に更新してください。
```

---

### チェックポイント

- [ ] FFMPEGをインストールできた
- [ ] 動画を圧縮できた
- [ ] ファイルサイズが100MB以下になった

---

## セクション4: Vercelでデプロイ

### Vercelとは？

**Vercel**（ヴァーセル）は、Next.jsアプリケーションを**無料で公開できるサービス**です。

**特徴:**
- Next.jsを開発している会社が運営
- GitHubと連携して**自動デプロイ**
- 無料プランでも十分使える
- 独自ドメインも設定可能（任意）

---

### Vercelアカウントを作成

**手順:**

1. **Vercelにアクセス**
   https://vercel.com/

2. **「Sign Up」をクリック**

3. **「Continue with GitHub」を選択**
   - GitHubアカウントでログイン
   - Vercelに権限を許可

4. **完了**
   - ダッシュボードが表示されます

---

### プロジェクトをデプロイ

#### 方法1: Claude Codeで自動デプロイ（推奨）

**手順:**

1. **Claude Codeパネルで指示**

```
Vercelにデプロイしてください。
```

2. **Claude Codeが自動実行**

**初回のみ:**
```bash
npm install -g vercel
vercel login
```

**デプロイ:**
```bash
vercel --prod
```

3. **対話形式の質問に答える**

Claude Codeが自動で答えますが、手動の場合は以下：

| 質問 | 回答 |
|------|------|
| Set up and deploy? | `Y`（Enter） |
| Which scope? | そのまま（Enter） |
| Link to existing project? | `N`（Enter） |
| What's your project's name? | `portfolio-site`（Enter） |
| In which directory is your code? | `./`（Enter） |
| Want to override settings? | `N`（Enter） |

4. **デプロイ完了**

以下のようなURLが表示されます：
```
https://portfolio-site-xxxxx.vercel.app
```

このURLをブラウザで開くと、公開されたサイトが見られます！

---

#### 方法2: Vercelダッシュボードから手動デプロイ

**手順:**

1. **Vercelダッシュボードを開く**
   https://vercel.com/dashboard

2. **「Add New」→「Project」**

3. **「Import Git Repository」**
   - GitHubのリポジトリ一覧が表示される
   - `portfolio-site`を探して「Import」

4. **設定を確認**
   - Framework Preset: `Next.js`（自動検出）
   - Root Directory: `./`
   - Build Command: `npm run build`（自動設定）
   - Output Directory: `.next`（自動設定）

5. **「Deploy」をクリック**

6. **デプロイ完了**
   - 1-2分で完了
   - URLが表示される

---

### デプロイエラーの対処

#### エラー1: ファイルサイズが大きすぎる

**エラーメッセージ:**
```
Error: File size exceeds 100 MB limit
```

**対処法:**
- セクション3に戻り、動画を圧縮する
- または、動画を外部ホスティング（YouTube、Vimeo等）に移す

---

#### エラー2: ビルドエラー

**エラーメッセージ:**
```
Error: Build failed
```

**対処法:**

1. **ローカルでビルドを試す**

```bash
npm run build
```

2. **エラーメッセージを確認**

3. **Claude Codeに報告**

```
ビルドエラーが発生しました。以下のエラーメッセージを確認して修正してください：

[エラーメッセージをコピペ]
```

---

### チェックポイント

- [ ] Vercelアカウントを作成できた
- [ ] プロジェクトをデプロイできた
- [ ] デプロイ後のURLにアクセスできた
- [ ] サイトが正しく表示されている

---

## セクション5: メタデータ設定

### メタデータとは？

**メタデータ**は、Webサイトの「情報」を示すデータです。

**主なメタデータ:**
- **favicon**: ブラウザタブに表示される小さなアイコン
- **タイトル**: ブラウザタブに表示されるテキスト
- **OGP**: SNSでシェアされたときのサムネイル・説明

---

### faviconを変更する

**faviconとは？**

ブラウザのタブに表示される小さなアイコンです。

```
[🌐] ポートフォリオサイト
 ↑
favicon
```

**手順:**

#### 1. favicon画像を用意

- **サイズ**: 512x512px 推奨
- **フォーマット**: PNG または ICO
- **デザイン**: シンプルなロゴ、イニシャル、顔写真など

**無料ツール:**
- Canva: https://www.canva.com/
- Favicon Generator: https://favicon.io/

#### 2. PNGをICOに変換

**変換ツール:**
https://convertio.co/ja/png-ico/

1. PNG画像をアップロード
2. ICOに変換
3. ダウンロード

#### 3. faviconを配置

**手順:**

1. ダウンロードしたICOファイルを`public/`フォルダに配置
2. ファイル名を確認（例: `my-favicon.ico`）
3. Claude Codeに指示

```
public/my-favicon.ico を、
src/app/favicon.ico に移動して上書きしてください。
```

4. **ブラウザで確認**
   - 開発サーバーを再起動（`npm run dev`）
   - ブラウザをリロード（強制リロード: `Ctrl+Shift+R` / `Cmd+Shift+R`）
   - タブのアイコンが変わっていればOK

---

### タイトルを変更する

**タイトルとは？**

ブラウザのタブに表示されるテキストです。

**デフォルト:**
```
Create Next App
```

**変更後:**
```
山田太郎 - ポートフォリオ
```

**手順:**

1. **Claude Codeに指示**

```
src/app/layout.tsx のメタデータを以下に変更してください：

タイトル: 「山田太郎 - ポートフォリオ」
説明: 「クリエイティブデザイナー・山田太郎のポートフォリオサイトです。」
```

2. **Claude Codeが自動編集**

`src/app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: '山田太郎 - ポートフォリオ',
  description: 'クリエイティブデザイナー・山田太郎のポートフォリオサイトです。',
};
```

3. **確認**
   - ブラウザをリロード
   - タブのテキストが変わっていればOK

---

### OGP設定

**OGPとは？**

**Open Graph Protocol**の略で、SNS（Twitter、Facebook等）でシェアされたときに表示される情報です。

**OGPがないとき:**
```
https://portfolio-site.vercel.app
（サムネイル画像なし、説明なし）
```

**OGPがあるとき:**
```
┌─────────────────┐
│  [サムネイル]   │
│  山田太郎 - ポートフォリオ
│  クリエイティブデザイナー...
└─────────────────┘
```

**手順:**

#### 1. OGP画像を用意

- **サイズ**: 1200x630px（推奨）
- **フォーマット**: JPEG または PNG
- **内容**: 自分の写真、ロゴ、作品画像など

#### 2. OGP画像を配置

```
public/ogp-image.jpg
```

#### 3. Claude Codeに指示

```
OGP設定を追加してください。

OGP画像: /ogp-image.jpg
タイトル: 山田太郎 - ポートフォリオ
説明: クリエイティブデザイナー・山田太郎のポートフォリオサイトです。
URL: https://portfolio-site.vercel.app
```

4. **Claude Codeが自動編集**

`src/app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: '山田太郎 - ポートフォリオ',
  description: 'クリエイティブデザイナー・山田太郎のポートフォリオサイトです。',
  openGraph: {
    title: '山田太郎 - ポートフォリオ',
    description: 'クリエイティブデザイナー・山田太郎のポートフォリオサイトです。',
    url: 'https://portfolio-site.vercel.app',
    images: ['/ogp-image.jpg'],
  },
};
```

---

### チェックポイント

- [ ] faviconを変更できた
- [ ] タイトルを変更できた
- [ ] OGP設定を追加できた

---

## セクション6: 更新フロー

### サイトを更新する流れ

Vercelにデプロイした後、サイトを更新したい場合の手順です。

**流れ:**
```
1. ローカルで編集
   ↓
2. 開発サーバーで確認
   ↓
3. Claude Codeでコミット
   ↓
4. GitHubにプッシュ
   ↓
5. Vercelが自動でデプロイ（1-2分）
```

**重要:**
- GitHubにプッシュするだけで、Vercelが**自動的に**再デプロイします
- 手動で`vercel --prod`を実行する必要はありません

---

### 更新の実例

**例: ヒーローセクションの見出しを変更する**

#### 1. ローカルで編集

`src/app/page.tsx`:
```tsx
<h1>Portfolio</h1>
```
↓
```tsx
<h1>Welcome to My Portfolio</h1>
```

#### 2. 開発サーバーで確認

```bash
npm run dev
```

ブラウザ（http://localhost:3000）で確認。

#### 3. Claude Codeでコミット

```
変更をコミットしてGitHubにプッシュしてください。
```

Claude Codeが自動実行：
```bash
git add .
git commit -m "Update hero section heading"
git push
```

#### 4. Vercelで自動デプロイ

1. Vercelダッシュボードを開く: https://vercel.com/dashboard
2. プロジェクト（portfolio-site）をクリック
3. 「Deployments」タブで、新しいデプロイが進行中なのが確認できる
4. 1-2分待つ
5. デプロイ完了後、本番URL（https://portfolio-site.vercel.app）で確認

---

### デプロイ履歴の確認

**Vercelダッシュボード:**
- すべてのデプロイ履歴が残る
- 過去のバージョンにロールバック可能

**手順:**
1. Vercelダッシュボード → プロジェクト
2. 「Deployments」タブ
3. 過去のデプロイをクリック → 「Promote to Production」で復元

---

### 緊急時のロールバック

**問題が発生した場合:**

**方法1: Vercelダッシュボードから**
1. 前回の正常なデプロイを選択
2. 「Promote to Production」

**方法2: Gitで過去のコミットに戻す**

```
直前のコミットに戻してください。
```

Claude Codeが実行：
```bash
git revert HEAD
git push
```

---

### チェックポイント

- [ ] 更新フローを理解した
- [ ] ローカルで編集 → プッシュ → 自動デプロイの流れを確認した
- [ ] デプロイ履歴を確認できた

---

## セクション7: 演習

### 演習の目的

実際にサイトを更新して、デプロイの流れを体験します。

---

### 演習1: 簡単な変更をデプロイ（10分）

**やること:**
ヒーローセクションの見出しを変更してデプロイします。

**手順:**

1. **`src/app/page.tsx`を開く**

2. **ヒーローセクションの見出しを変更**
   - 例: 「Portfolio」→「Welcome」

3. **ローカルで確認**
   ```bash
   npm run dev
   ```
   http://localhost:3000 で確認

4. **Claude Codeでコミット&プッシュ**
   ```
   変更をコミットしてGitHubにプッシュしてください。
   ```

5. **Vercelで自動デプロイを確認**
   - Vercelダッシュボードを開く
   - 新しいデプロイが進行中
   - 完了後、本番URLで確認

---

### 演習2: メタデータの最終調整（10分）

**やること:**
favicon、タイトル、OGPを自分の情報に変更します。

**手順:**

1. **favicon画像を用意**
   - Canvaなどで作成（512x512px）
   - ICOに変換
   - `src/app/favicon.ico`に配置

2. **タイトル・説明を変更**
   ```
   メタデータを以下に変更してください：

   タイトル: [あなたの名前] - ポートフォリオ
   説明: [あなたの職業・説明文]
   ```

3. **OGP画像を用意**
   - 1200x630pxの画像を作成
   - `public/ogp-image.jpg`に配置

4. **OGP設定を追加**
   ```
   OGP設定を追加してください。
   OGP画像: /ogp-image.jpg
   URL: [あなたのVercel URL]
   ```

5. **コミット&プッシュ**

6. **デプロイ後、確認**
   - ブラウザタブのfaviconとタイトル
   - OGPはTwitter Card Validatorで確認: https://cards-dev.twitter.com/validator

---

### 演習のゴール

- ✅ ローカルで変更 → プッシュ → 自動デプロイの流れができた
- ✅ favicon、タイトル、OGPが自分のものになった
- ✅ 本番URLで正しく表示されている

---

## まとめ

### このモジュールで学んだこと

- Gitの基本（バージョン管理の概念、コミット、プッシュの流れ、Claude Codeでの自動化）
- GitHubリポジトリ（リポジトリの作成、リモート接続、Public/Privateの選択）
- 動画最適化（FFMPEGのインストール、動画の圧縮方法、ファイルサイズ制限への対処）
- Vercelデプロイ（アカウント作成、プロジェクトのデプロイ、自動デプロイの仕組み）
- メタデータ設定（faviconの変更、タイトル・説明の設定、OGPの設定）
- 更新フロー（ローカル編集 → プッシュ → 自動デプロイ、デプロイ履歴の確認、ロールバック方法）

---

### 次のステップ

**おめでとうございます！**

あなたのポートフォリオサイトが、インターネット上に公開されました。

**これからできること:**

1. **SNSでシェア**
   - Twitter、Instagram、LinkedInなどでURLをシェア
   - OGPが設定されているので、見栄えの良いプレビューが表示される

2. **継続的に更新**
   - 新しい作品ができたら追加
   - デザインを改善
   - プッシュするだけで自動デプロイ

3. **独自ドメイン設定（任意）**
   - `yourname.com`のような独自ドメインを取得
   - Vercelで設定可能

4. **さらに学ぶ**
   - アニメーションを追加
   - お問い合わせフォームを実装
   - ブログ機能を追加

---

### 重要なマインドセット

**講師のコメント（講義ログより）:**
> 「何回か作っていくと、俺の癖だったらこうなるなみたいなのが見えてくるって感じ。」

**つまり:**
- 最初の1個目ができました
- これから2個目、3個目を作っていくと、どんどん早く、上手になります
- **量をこなすこと**が上達の近道

**目安:**
- **3ヶ月**: ポートフォリオサイトを8-10個作る
- **6ヶ月**: ホームページが作れるようになる
- **1年**: Webアプリケーションに挑戦できる

---

## 参考資料

### Git関連

- **Git公式ドキュメント**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **サルでもわかるGit入門**: https://backlog.com/ja/git-tutorial/

### FFMPEG関連

- **FFMPEG公式サイト**: https://ffmpeg.org/
- **FFMPEGコマンド例**: https://ostechnix.com/20-ffmpeg-commands-beginners/

### Vercel関連

- **Vercel公式ドキュメント**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs

### メタデータ関連

- **Favicon Generator**: https://favicon.io/
- **OG Image Generator**: https://www.opengraph.xyz/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/

---

## よくある質問

### Q1: Vercelのデプロイが失敗します

**A**: 以下を確認してください。

**原因1: ファイルサイズが大きい**
```
Error: File size exceeds 100 MB limit
```
→ セクション3に戻り、動画を圧縮してください。

**原因2: ビルドエラー**
```
Error: Build failed
```
→ ローカルで`npm run build`を実行し、エラーを確認してください。

**原因3: 環境変数が不足**
→ このモジュールでは環境変数は不要ですが、今後APIキーなどを使う場合は設定が必要です。

---

### Q2: GitHubにプッシュしたのに、Vercelが更新されません

**A**: 以下を確認してください。

1. **Vercelダッシュボードで確認**
   - 「Deployments」タブで新しいデプロイが始まっているか
   - エラーが出ていないか

2. **GitHubとVercelの接続を確認**
   - Vercelダッシュボード → プロジェクト → Settings → Git
   - 正しいリポジトリ・ブランチが接続されているか

3. **ブランチ名を確認**
   - Vercelは`main`ブランチを監視（デフォルト）
   - `master`ブランチの場合、Vercel設定で変更が必要

---

### Q3: faviconが変わりません

**A**: ブラウザのキャッシュが原因です。

**対処法:**
1. **強制リロード**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **ブラウザのキャッシュをクリア**
   - Chrome: 設定 → プライバシーとセキュリティ → 閲覧履歴データの削除

3. **別のブラウザで確認**
   - シークレットモード（プライベートモード）で開く

---

### Q4: 動画を圧縮しすぎて画質が悪くなりました

**A**: CRF値を下げてください。

**手順:**
```
CRF値を23に下げて、再度圧縮してください。
```

**CRF値の目安:**
- 18: ほぼ無劣化（ファイルサイズ大）
- 23: 高品質（推奨）
- 28: 標準品質
- 32: 低品質（ファイルサイズ小）

**別の方法:**
- 動画をYouTubeにアップロード
- YouTubeの埋め込みコードを使う

---

### Q5: 独自ドメインを設定したいです

**A**: Vercelで簡単に設定できます。

**手順:**

1. **ドメインを取得**
   - お名前.com: https://www.onamae.com/
   - Google Domains: https://domains.google/

2. **Vercelで設定**
   - Vercelダッシュボード → プロジェクト → Settings → Domains
   - 取得したドメインを入力
   - DNS設定の指示に従う

**費用:**
- ドメイン代: 年間1,000円〜2,000円程度
- Vercelの利用: 無料

---

### Q6: デプロイ後、サイトが遅いです

**A**: 以下を確認してください。

**原因1: 画像が大きい**
→ 画像を圧縮してください（TinyPNG: https://tinypng.com/）

**原因2: 動画が重い**
→ セクション3の動画圧縮を再度実行

**原因3: Next.js Imageの最適化が効いていない**
→ Claude Codeに以下を依頼：
```
<img>タグをNext.jsの<Image>コンポーネントに変更してください。
```

---

### Q7: GitHubのリポジトリを間違えて削除してしまいました

**A**: ローカルにコードが残っていれば復旧できます。

**手順:**

1. **GitHubで新しいリポジトリを作成**
   - 同じ名前で作成

2. **Claude Codeに指示**
   ```
   GitHubリポジトリを以下に再接続してください：
   https://github.com/username/portfolio-site.git
   ```

3. **プッシュ**
   ```
   すべてのファイルをプッシュしてください。
   ```

**重要:** ローカルのファイルを削除しないでください。

---

### Q8: FFMPEGのインストールが失敗します

**A**: 手動でインストールしてください。

**Windows:**
1. https://ffmpeg.org/download.html
2. 「Windows builds from gyan.dev」をクリック
3. `ffmpeg-release-essentials.zip`をダウンロード
4. 解凍して、`bin/ffmpeg.exe`をシステムパスに追加

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

---

**お疲れ様でした！モジュール7はこれで終了です。**

あなたのポートフォリオサイトは、もうインターネット上に公開されています。
URLをシェアして、世界中の人に見てもらいましょう！
