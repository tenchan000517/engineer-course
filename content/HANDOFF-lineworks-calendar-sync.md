# HANDOFF: LINE WORKSタスク→Googleカレンダー同期

## 概要

LINE WORKSのタスクをGoogleカレンダーに自動同期する特典ページの作成。GAS（Google Apps Script）を使用した実装。

## 現在のステータス

**進捗**: 95%完了（スクリーンショット追加のみ残り）

- [x] 特典ページ作成（`content/gifts/lineworks-calendar-sync.md`）
- [x] LINE WORKS Developer Console設定手順
- [x] GASコード実装（複数ユーザー対応版）
- [x] タスク取得の動作確認
- [x] カレンダー同期テスト
- [x] トリガー設定（1時間おき）
- [x] Vercelデプロイ完了
- [ ] **スクリーンショットを講座に追加**

## 今回のセッションで完了したこと

### 1. 複数ユーザー対応
- 各ユーザーが個別に認証する仕組み
- `manualAddUser()` / `manualRemoveUser()` でユーザー管理
- ウェブアプリで認証状態を確認可能

### 2. 重要な発見

#### 本人認証が必須
「認証する」ボタンは誰でもクリックできるが、**LINE WORKSログイン時に本人のアカウントでログインしないと正しく動作しない**。他人のアカウントでログインすると、その人のトークンが保存されてしまう。

#### 取得できるタスクの制限
- **自分が作成したタスク**のみ取得可能
- 他人から依頼されたタスクは取得できない

#### UI機能の制限
GASのサンドボックス制限により、UIからのユーザー追加・削除は機能しない。`manualAddUser()` / `manualRemoveUser()` 関数を使用する。

### 3. 本番用GASコード
`docs/archive/gas-production/lineworks-calendar-sync.js`
- 認証情報入り（gitignore済み）
- そのままGASエディタにコピペ可能

## 次のセッションでやること

### スクリーンショットを講座に追加

講座（`content/gifts/lineworks-calendar-sync.md`）に画像参照が一切ない状態。以下のスクショを適切な箇所に追加する。

#### 既存のスクリーンショット
```
public/gifts/lineworks-calendar-sync/
├── developer-console-top.png      # Developer Consoleトップ
├── app-list.png                   # アプリリスト
├── app-create-modal.png           # アプリ作成モーダル
├── app-settings.png               # アプリ設定画面
├── oauth-scopes.png               # OAuth Scope選択
├── gas-editor.png                 # GASエディタ
├── gas-deploy-menu.png            # GASデプロイメニュー
├── gas-deploy-type.png            # GASデプロイ種類選択
├── gas-deploy-complete.png        # GASデプロイ完了画面
├── redirect-url-setting.png       # Redirect URL設定画面
├── permission-required.png        # 承認が必要です
├── app-not-verified.png           # Googleで確認されていません
├── app-not-verified-detail.png    # 詳細表示
├── permission-select.png          # 権限選択
└── execution-log.png              # 実行ログ
```

#### 今回共有された新しいスクリーンショット（追加が必要）

以下のスクショが今回のセッションで共有された。必要に応じて`public/gifts/lineworks-calendar-sync/`に追加：

1. **トリガー設定画面**（5枚）
   - `C:\Users\tench\Downloads\812d824967a761af103b7466cd9b6232.png` - トリガー一覧
   - `C:\Users\tench\Downloads\c0cec86f8309221e02c9d1b369e0a05c.png`
   - `C:\Users\tench\Downloads\bafee944fabaa7ea00c987d55860f414.png`
   - `C:\Users\tench\Downloads\31e6801e2100bdf6d2ef982a3f76e979.png`
   - `C:\Users\tench\Downloads\5d3de43bf19795bc418ed69f21295eed.png`

2. **認証成功画面・管理画面**
   - `C:\Users\tench\Downloads\affb7ed928dff231da085643173df4f8.png` - 認証成功
   - `C:\Users\tench\Downloads\ec74da01eada686bcc044e93aefac2d4.png` - 管理画面（ユーザー一覧）

3. **カレンダー同期結果**
   - `C:\Users\tench\Downloads\dcf105bb012046ecc705b3020f99fe51.png` - LINE WORKSタスク
   - `C:\Users\tench\Downloads\ae1045337bb6243318cfb92286c3ec11.png` - Googleカレンダーに同期されたタスク

### スクショ追加の作業手順

1. 上記のダウンロードフォルダから必要なスクショを `public/gifts/lineworks-calendar-sync/` にコピー
2. ファイル名をわかりやすく変更（例: `trigger-settings.png`, `auth-success.png` など）
3. 講座の適切な箇所に `![説明](/gifts/lineworks-calendar-sync/ファイル名.png)` を追加
4. `vercel --prod` で再デプロイ

## ファイル構成

### 特典ページ
- `content/gifts/lineworks-calendar-sync.md`

### 本番用GASコード（認証情報入り）
- `docs/archive/gas-production/lineworks-calendar-sync.js`

### スクリーンショット
- `public/gifts/lineworks-calendar-sync/`

## 講座URL

https://engineer-course-odxxk7eth-tenchan000517s-projects.vercel.app/gift/lineworks-calendar-sync

## 参考リンク

- [LINE WORKS API 2.0 タスク](https://developers.worksmobile.com/jp/docs/task-list)
- [LINE WORKS Developer Console](https://dev.worksmobile.com/jp/console)
- [Google Apps Script](https://script.google.com/)

---

**最終更新**: 2026-01-24
