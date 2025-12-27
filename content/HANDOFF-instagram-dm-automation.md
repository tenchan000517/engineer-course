# HANDOFF: Instagram コメント→DM自動配布講座

## 概要

Instagramのコメントをトリガーにして自動でDMを送信する仕組みの講座。

**進行方針**:
1. まずエルグラム（無料・BANリスクなし）で実践
2. その後n8nでの構築をじっくり検証

## 現在のステータス

| 項目 | 状態 |
|------|------|
| 調査 | 完了 |
| カテゴリ作成 | 完了 |
| Module 01（概要） | 仮版作成済み |
| Module 02（エルグラム設定） | 仮版作成済み |
| Module 03（n8n構築） | 未着手（後から追加） |
| スクリーンショット | 未取得 |
| 実践検証 | 未実施 |

## 作成済みファイル

```
content/
├── modules/
│   ├── instagram/
│   │   └── _category.json              # 親カテゴリ
│   └── instagram-dm-automation/
│       ├── _category.json              # 子カテゴリ
│       ├── module-01-overview.md       # 仮版
│       └── module-02-elgram-setup.md   # 仮版（NEW）
│
app/
└── category/
    └── instagram/
        └── [subcourseSlug]/
            ├── page.tsx                # サブコース一覧
            └── [moduleSlug]/
                └── page.tsx            # モジュール詳細
│
public/
└── instagram-dm-automation/            # 画像用（空）
```

## 次のアクション

### ユーザー側

1. **エルグラムで実践開始**
   - [https://lgram.jp/](https://lgram.jp/) にアクセス
   - Module 02の手順に従って設定

2. **各ステップでスクショを撮影**
   - エルグラム新規登録画面
   - Instagram接続画面（Facebookログイン）
   - 自動応答設定画面
   - キーワード設定画面
   - DM内容設定画面
   - テスト実行結果（DMが届いた画面）

3. **スクショを共有**
   - エラーが発生した場合もスクショを共有
   - 設定中に迷った箇所があれば報告

### AI側

1. スクショを確認し、手順が正しいかチェック
2. エラーがあれば解決策を提示
3. 成功後、スクショを講座に埋め込み
4. トラブルシューティングセクションを実際の問題で更新
5. エルグラム版完成後、n8n版の構築を検討

## n8n構築の調査結果

エルグラム完了後、n8nでの構築を検討する際の参考情報：

### n8nでの構築に必要なもの

| 項目 | 説明 |
|------|------|
| Facebook Trigger | Webhookでコメント/DMを検知 |
| SSL証明書 | Webhook受信に必須 |
| 権限 | `instagram_manage_comments`, `instagram_manage_messages` |
| トークン更新 | 60日ごと更新が必要 |

### 技術的制約

| 制限 | 内容 |
|------|------|
| メッセージ送信 | 200件/時間 |
| レスポンスウィンドウ | ユーザーアクション後24時間以内 |
| テストモード | Instagramテスターからのみトリガー |

### 参考ワークフロー

- [Auto-Respond to Instagram with Llama 3.2](https://n8n.io/workflows/6632-auto-respond-to-instagram-facebook-and-whatsapp-with-llama-32/)
- [Automate Instagram Comment Responses with Google Sheets](https://n8n.io/workflows/6205-automate-instagram-comment-responses-with-google-sheets-and-crm-tracking/)

## 調査結果サマリー

### 仕組み

- Meta公式Instagram Graph APIを使用
- コメント検知 → DM自動送信
- 2024年12月4日にInstagram Basic Display API廃止

### ツール選定

| ツール | 採用 | 理由 |
|--------|------|------|
| エルグラム | 採用 | 無料・Meta公式API・BANリスクなし |
| ManyChat | 保留 | 英語UI・有料プランが本格運用向け |
| iステップ | 保留 | 月額22,000円と高額 |
| n8n | 後から検討 | 技術的に複雑だが柔軟性高い |

### 規約注意点

- 現金・商品券の提供は禁止
- 自社製品・デジタルコンテンツは許可
- 公式APIツールのみ使用（BAN防止）

## 共有済みスクリーンショット

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| - | （実践後に追加） | - | - |

## 参考リンク

- [エルグラム公式](https://lgram.jp/)
- [エルグラム公式マニュアル](https://lgram.jp/manual/)
- [エルグラム新規登録ガイド](https://lgram.jp/manual/register/)
- [自動応答機能の使い方](https://lgram.jp/manual/automatic_response/)
- [n8n Facebook Trigger (Instagram)](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.facebooktrigger/instagram/)

---

**最終更新**: 2024-12-24
**担当**: AI Assistant
