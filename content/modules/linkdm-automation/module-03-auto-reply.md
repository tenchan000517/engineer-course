---
title: "コメント→DM自動配布の設定"
order: 3
duration: "40分"
difficulty: "⭐⭐☆☆☆"
---

# コメント→DM自動配布の設定

**所要時間**: 40分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- Setup DM Automationモーダルの使い方
- 3つのタブ（DM Setup / Trigger Setup / Settings）の設定
- トリガー（キーワード / 全コメント）の設定
- ボタン付きDMの作成

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 投稿に対してAutoDMを設定できる
- キーワードトリガーを設定できる
- Button Template（ボタン付きDM）を作成できる

---

## 目次

- [セクション1: 投稿を選択してSetupを開始](#セクション1-投稿を選択してsetupを開始)
- [セクション2: DM Setupタブの設定](#セクション2-dm-setupタブの設定)
- [セクション3: Trigger Setupタブの設定](#セクション3-trigger-setupタブの設定)
- [セクション4: Settingsタブの設定](#セクション4-settingsタブの設定)
- [セクション5: テストと動作確認](#セクション5-テストと動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 説明 |
|------|------|
| Module 02完了 | LinkDMにInstagramアカウントを接続済み |
| 対象の投稿 | 自動応答を設定する投稿/リール |
| 特典URL | DMで送信する特典ページのURL |

---

## セクション1: 投稿を選択してSetupを開始

### ダッシュボードで投稿を選択

ダッシュボードには、AutoDMが未設定の投稿が「Ready to Setup」として表示されます。

![投稿一覧](/linkdm-automation/module-03-step01-posts.png)

**All Posts**セクションでは、すべての投稿の状態を確認できます：

| STATUS | 説明 |
|--------|------|
| **Setup LinkDM** | AutoDMが未設定 |
| **Active** | AutoDMが有効 |

### Setup DM Automationを開く

設定したい投稿の「Setup LinkDM」ボタンをクリックすると、**Setup DM Automation**モーダルが表示されます。

このモーダルには3つのタブがあります：

| タブ | 内容 |
|------|------|
| **DM Setup** | DMの内容（メッセージ、ボタン、画像）を設定 |
| **Trigger Setup** | いつDMを送るか（トリガー）を設定 |
| **Settings** | 追加オプション（遅延、Pro機能）を設定 |

### チェックポイント

- [ ] ダッシュボードで投稿一覧を確認した
- [ ] Setup LinkDMボタンをクリックした
- [ ] Setup DM Automationモーダルが表示された

---

## セクション2: DM Setupタブの設定

### DM Setupタブの概要

DM Setupタブでは、送信するDMの内容を設定します。

![DM Setup - 入力済み](/linkdm-automation/module-04-step02-button-filled.png)

### DM Type（DMのタイプ）

**Button Template**を選択します（デフォルト）。

これにより、テキスト + ボタンの組み合わせでDMを送信できます。

### Carousel Slider（カルーセル）

複数のスライドを追加できます。通常は1スライドでOKです。

「+ Add Slide」で追加できます。

### Button Destination（ボタンのリンク先）

| 項目 | 設定内容 |
|------|----------|
| タイプ | URL |
| URL | 特典ページのURL（例: `https://since-around4.com`） |

### Button Name（ボタンのラベル）

ボタンに表示されるテキストを入力します。

**例**:
- 特典を受取る
- 詳細を見る
- 今すぐ申し込む

### Headline（見出しテキスト）

DMの本文に表示されるテキストを入力します。

**例**:
```
コメントいただきありがとうございます！
こちらに今回の投稿の内容をまとめたので
お受け取りください！
```

### Image（画像）

「Upload」ボタンで画像をアップロードできます（任意）。

プレビュー画面に「Drop Image Here」と表示されている部分に画像が表示されます。

### Description（説明文）

追加の説明文を入力できます。

**注意**: 無料プランでは「Sent with LinkDM」と表示されます。これを変更するにはPro以上が必要です。

### Add additional button（追加ボタン）

「Add additional button」で2つ目、3つ目のボタンを追加できます（最大3つ）。

### プレビューの確認

右側にDMのプレビューが表示されます。実際にユーザーに届くイメージを確認できます。

### Pro機能（無料版では利用不可）

| 機能 | 説明 |
|------|------|
| Save as template | テンプレートとして保存 |
| Send DMs to previous comments | 過去のコメントにもDMを送信 |

### チェックポイント

- [ ] DM Typeで「Button Template」を選択した
- [ ] Button DestinationにURLを入力した
- [ ] Button Nameにボタンラベルを入力した
- [ ] Headlineにメッセージを入力した
- [ ] プレビューで確認した

---

## セクション3: Trigger Setupタブの設定

### Trigger Setupタブの概要

Trigger Setupタブでは、いつDMを送信するかを設定します。

![Trigger Setup](/linkdm-automation/module-03-step02-trigger.png)

### Trigger Type（トリガータイプ）

ドロップダウンからトリガータイプを選択します。

| トリガー | 説明 | 用途 |
|----------|------|------|
| **Keywords** | 特定のキーワードを含むコメントに反応 | 「欲しい」「プレゼント」など |
| **All comments** | すべてのコメントに反応 | 全員にDM送信 |
| **Emoji's only** | 絵文字のみのコメントに反応 | 簡単なリアクション |
| **@Mentions only** | メンションを含むコメントに反応 | メンション企画 |
| **Share to Inbox** | 受信トレイに共有 | 手動確認用 |
| **Share to Inbox + Keywords** | キーワード + 受信トレイに共有 | - |
| **Share to Inbox + All Comments** | 全コメント + 受信トレイに共有 | - |

### Keyword Triggers（キーワード）

「Keywords」を選択した場合、キーワードを設定します。

1. キーワードを入力（例: `LinkDM`）
2. **ENTERキー**を押して確定

複数のキーワードを追加できます。いずれかに該当すればDMが送信されます。

**表記ゆれ対策**:
```
欲しい
ほしい
ホシイ
```

### Settings（オプション設定）

| 設定 | 説明 |
|------|------|
| **Exclude Keywords** | 除外キーワード（例: Bad, Horrible, Disappointed） |
| **Send once** | 同じユーザーに1度のみ送信（**推奨**） |
| **Exclude @Mentions** | メンションを含むコメントを除外 |

**Send once**にチェックを入れることで、同じユーザーが何度コメントしても1回だけDMが送られます。

### チェックポイント

- [ ] Trigger Typeを選択した
- [ ] キーワードを入力した（Keywordsの場合）
- [ ] Send onceにチェックを入れた
- [ ] 必要に応じてExclude Keywordsを設定した

---

## セクション4: Settingsタブの設定

### Settingsタブの概要

Settingsタブでは、追加のオプションを設定します。

![Settings](/linkdm-automation/module-03-step03-settings.png)

### Send Delay（送信遅延）

| 設定 | 説明 |
|------|------|
| Delay Message | チェックを入れると、送信を遅延させる |

遅延させることで、手動で返信している感を演出できます。

### Trigger Controls

| 設定 | 説明 | 利用可否 |
|------|------|----------|
| Disable Universal Triggers | ユニバーサルトリガーを無効化 | 無料 |
| **Comment Auto-Reply** | コメント欄への公開返信 | **Pro以上** |

### Flow Logic

| 設定 | 説明 | 利用可否 |
|------|------|----------|
| **Flow Automation** | 複雑な自動化フロー | **Pro以上** |

### 無料版の制限

無料版では「Comment Auto-Reply」と「Flow Automation」は利用できません。

これらを使いたい場合は「Upgrade to Pro」をクリックしてアップグレードしてください。

### 設定を保存

すべての設定が完了したら、**「Save」**ボタンをクリックして保存します。

### チェックポイント

- [ ] Send Delayを確認した（必要に応じて設定）
- [ ] Pro機能の制限を理解した
- [ ] Saveボタンをクリックして保存した

---

## セクション5: テストと動作確認

### テスト方法

1. **別のInstagramアカウント**を用意（テスト用）
2. 対象の投稿にテストアカウントからキーワードをコメント
3. 自動でDMが届くことを確認

### 確認ポイント

| 確認項目 | 期待される動作 |
|----------|----------------|
| コメント検知 | キーワード含むコメントを検知 |
| DM送信 | コメント後すぐにDMが届く |
| ボタン表示 | ボタンが正しく表示される |
| ボタンタップ | URLに遷移する |
| 非該当コメント | キーワードなしは反応しない |

### 統計の確認

ダッシュボードの「All Posts」で統計を確認できます：

| 項目 | 説明 |
|------|------|
| SENT | 送信されたDM数 |
| OPEN | 開封数 |
| CLICKS | リンククリック数 |
| CTR | クリック率 |

### AutoDMの一時停止

設定済みのAutoDMを一時停止するには、投稿の「Pause」ボタンをクリックします。

![一時停止確認](/linkdm-automation/module-03-step04-pause.png)

「Pause」をクリックすると一時停止されます。「Cancel」でキャンセルできます。

### チェックポイント

- [ ] テストアカウントからコメントした
- [ ] 自動でDMが届いた
- [ ] ボタンをタップしてURLに遷移した
- [ ] 統計を確認した

---

## トラブルシューティング

### DMが送信されない

**原因1**: Saveしていない

**対処法**: 設定後に「Save」ボタンをクリックしたか確認

**原因2**: キーワードが一致していない

**対処法**:
- キーワードをENTERで確定したか確認
- 表記ゆれを追加（「欲しい」「ほしい」など）

**原因3**: 月間DM上限に達している

**対処法**:
- ダッシュボードの「MONTHLY DM USAGE」を確認
- 無料プランは月1,000DMまで

### ボタンが表示されない

**原因**: DM TypeがButton Template以外

**対処法**: DM Setupタブで「Button Template」が選択されているか確認

### 自分のコメントにも反応してしまう

**原因**: デフォルトでは自分のコメントにも反応する可能性あり

**対処法**: Configuration設定でExcludeオプションを確認

---

## まとめ

### このモジュールで学んだこと

- Setup DM Automationモーダルの3つのタブの使い方
- DM Setup: Button Template、URL、メッセージの設定
- Trigger Setup: キーワード、All comments、オプション設定
- Settings: 遅延、Pro機能の確認
- テストと統計の確認方法

### 次のステップ

このモジュールでButton Template（ボタン付きDM）の設定ができました。

次のモジュールでは、ボタンのさらなる活用方法を学びます。

- **Module 04**: ボタン付きDMの応用

---

## 参考資料

- [LinkDMヘルプ - How to Link a Post](https://www.linkdm.com/help/how-to-link-a-post)
- [LinkDMヘルプ - Setup Auto DM on an Instagram Post](https://www.linkdm.com/help/setup-auto-dm-on-an-instagram-post)
- [LinkDMヘルプ - Trigger Types](https://www.linkdm.com/help/trigger-types)

---

## よくある質問

**Q: 無料版でAll commentsトリガーは使えますか？**
A: **はい、使えます**。Trigger Typeのドロップダウンから「All comments」を選択できます。

**Q: 1つの投稿に複数のキーワードを設定できますか？**
A: はい。キーワードを入力してENTERを押すことで、複数追加できます。いずれかに該当すればDMが送信されます。

**Q: 同じユーザーに何度もDMが送られますか？**
A: Trigger Setupの「Send once」にチェックを入れることで、同じユーザーには1回だけ送信されます。

**Q: コメント欄にも自動返信できますか？**
A: コメント欄への公開返信（Comment Auto-Reply）は**Pro以上**のプランで利用可能です。無料プランではDM送信のみです。

**Q: 「Sent with LinkDM」の表記を消せますか？**
A: 無料プランでは表示されます。Pro（$19/月）以上にアップグレードすると削除できます。
