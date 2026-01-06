# HANDOFF: SNS特典自動配布システム

**このファイルを最初に読んでください。**

---

## 絶対ルール

### やってはいけないこと

1. **勝手な判断・解釈をしない** - 不明点は必ずユーザーに確認
2. **暴走しない** - 指示された範囲のみ作業
3. **余計な拡張をしない** - 「ついでに〜も」は禁止
4. **古い情報から憶測しない** - 必ず公式ドキュメントを確認
5. **「何から始めましょう？」と聞かない** - ロードマップに従う
6. **参照せずに作業開始しない** - 調査結果を先に確認

### やるべきこと

1. **このHANDOFFを最初に読む**
2. **現在のフェーズを確認する**
3. **調査項目を一つずつ完了させる**
4. **完了したらこのHANDOFFを更新する**

---

## プロジェクト概要

### 目的

SNS（Instagram / X）での特典自動配布システムを構築する。

1. **Instagram**: コメントをもらったら特典を自動DM送付
2. **X（Twitter）**: 条件達成（コメント・フォロー等）でDMで特典送付
3. **特典作成**: 投稿内容にふさわしい有益な特典を自動生成するフロー

### システム全体像（構想）

```
┌─────────────────────────────────────────────────────────────┐
│  ①投稿作成時                                                │
│  ├── 投稿内容を分析                                         │
│  └── 投稿に適した特典を自動生成・保存                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ②SNS投稿                                                   │
│  ├── Instagram / X に投稿                                   │
│  └── 「コメントで特典配布」などのCTAを含める                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ③トリガー検知                                               │
│  ├── Instagram: 特定コメント検知                             │
│  └── X: コメント or フォロー検知                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  ④自動DM送信                                                 │
│  ├── 特典（PDF/リンク/テキスト）をDMで送付                    │
│  └── 送信履歴を記録（重複防止）                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 現在の進捗

### フェーズ一覧

| # | フェーズ | 状態 | 備考 |
|---|----------|------|------|
| 1 | 設計・HANDOFF作成 | **完了** | 本ファイル |
| 2 | API調査 - Instagram | **完了** | Graph API、Webhook、エルグラム調査完了 |
| 3 | API調査 - X | **完了** | **X自動DM配布は非現実的と判明** |
| 4 | 特典作成フロー設計 | 一時停止 | 講座暫定版作成を優先 |
| 5 | プロトタイプ実装 | 一時停止 | 講座暫定版作成を優先 |
| 6 | 検証・テスト | **現在** | 講座内容を実践検証中 |
| 7 | 講座化 | **進行中** | 暫定版モジュール3つ作成完了 |

### 現在のフェーズ

```
██████████████████████████████████░░░░░░░░░░░░ フェーズ6&7: 検証・講座化
```

---

## API調査結論（フェーズ2&3完了）

### 重要な発見

| プラットフォーム | 自動DM配布 | 推奨度 | 理由 |
|------------------|------------|--------|------|
| **Instagram** | **実現可能** | ★★★★★ | ManyChat（Meta公式）で簡単実装 |
| **X（Twitter）** | **非現実的** | ★☆☆☆☆ | API制限・コスト面で講座向け不可 |

### Instagram推奨構成

```
┌─────────────────────────────────────────┐
│  ManyChat（Meta公式パートナー）          │
│  ├── Comment to DM 自動化               │
│  ├── Follow to DM（新機能）              │
│  └── AI自動返信                         │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  特典配布フロー                          │
│  ├── トリガーワード検知                  │
│  ├── 特典リンク/PDFをDM送信              │
│  └── Google Sheets連携（履歴管理）       │
└─────────────────────────────────────────┘
```

### X（Twitter）が非推奨な理由

1. **DM API制限** - Basic tierで1DM/日、Pro tierでも30メッセージ程度で12時間ブロック
2. **Webhook非対応** - Enterprise（$42,000+/月）以外はリアルタイム検知不可
3. **コスト** - 実用的な自動化にはEnterprise必須（年間$500,000+）
4. **不安定性** - API仕様が頻繁に変更、開発者コミュニティでトラブル報告多数

### 講座としての方針決定

```
【採用】Instagram + エルグラム
- 日本発のInstagram自動化ツール（株式会社ミショナ）
- Meta公式API使用（安全）
- 導入実績20,000件超
- 2025年12月末まで無料で配信無制限キャンペーン中
- 日本語UI・サポート対応

【見送り】X（Twitter）自動DM配布
- API制限が厳しすぎて非現実的
- Enterprise tier（$42,000+/月）が必要
```

### エルグラムについて

| 項目 | 内容 |
|------|------|
| 公式サイト | https://lgram.jp/ |
| 運営 | 株式会社ミショナ（東京都渋谷区） |
| 導入実績 | 20,000件超（2025年8月） |
| API | Meta公式API使用 |
| セキュリティ | SOC2 TypeⅠ監査取得、AWS国内リージョン |
| 料金 | 無料〜（2025年12月末まで配信無制限） |

**主要機能：**
- コメント→自動DM返信
- ストーリーズメンション検知
- ライブ配信中のコメント検知
- セグメント配信（タグ・パーソナル情報で絞り込み）
- 予約投稿連携

---

## フェーズ2: API調査 - Instagram

### 調査項目

| # | 項目 | 状態 | 結果 |
|---|------|------|------|
| 2.1 | Instagram Messaging APIの概要 | **完了** | Graph API経由で実装可能 |
| 2.2 | コメント検知方法（Webhook） | **完了** | Webhook対応あり |
| 2.3 | DM送信API（制限・条件） | **完了** | 200DM/時間、24時間ウィンドウ |
| 2.4 | 必要な権限・審査プロセス | **完了** | 審査7-30日、複数権限必要 |
| 2.5 | n8nでの実装可否 | **完了** | 可能（複雑、テンプレートあり） |
| 2.6 | 代替手段（ManyChat等） | **完了** | ManyChat推奨（Meta公式パートナー） |

### 調査メモ

#### 2.1 Instagram Messaging APIの概要

```
【概要】
- Instagram Graph API経由でDM送信が可能
- 2024年12月にBasic Display APIが終了、全てGraph APIに移行
- Meta Developer AccountとFacebook Appの作成が必須

【アカウント要件】
- Business または Creator アカウント必須
- Facebookページとの連携が必須
- 個人アカウントはAPI非対応

【参考】
- https://elfsight.com/blog/instagram-graph-api-complete-developer-guide-for-2025/
- https://www.bot.space/blog/the-instagram-dm-api-your-ultimate-guide-to-automation-sales-and-customer-loyalty-svpt5
```

#### 2.2 コメント検知方法

```
【Webhook対応】
- Webhookでコメント通知を受信可能
- 登録可能フィールド: comments, mentions
- リアルタイム通知（ポーリング不要）

【設定方法】
- POST https://graph.facebook.com/v12.0/${APP_ID}/subscriptions
- object: 'instagram'
- fields: 'mentions', 'comments'
- Messenger > Instagram Settings で設定

【注意点】
- App Review必要
- HTTPS必須
- 非同期処理推奨（タイムアウト防止）

【参考】
- https://www.unipile.com/how-to-use-instagram-api-webhooks-for-real-time-notifications/
```

#### 2.3 DM送信API

```
【レート制限】（2024年10月改定）
- 200 DM/hour（以前は5,000から大幅削減）
- 全アカウント共通（フォロワー数に関係なく同じ制限）
- 制限超過時：1時間自動停止（アカウントBANではない）

【メッセージングウィンドウ】
- 24時間ウィンドウ制限
- ユーザーが最後にエンゲージメントしてから24時間以内のみ送信可能
- 1ユーザーあたり24時間で1自動メッセージまで

【重要な制限】
- 未承諾のメッセージは送信不可
- ユーザー起因のアクション（コメント、ストーリー返信、DM）からのみ自動メッセージ可能
- グループDMは非対応

【参考】
- https://creatorflow.so/blog/instagram-api-rate-limits-explained/
```

#### 2.4 必要な権限・審査

```
【必要な権限】
- instagram_basic
- instagram_graph_user_profile
- instagram_manage_messages

【審査期間】
- 標準権限：7-14営業日
- メッセージング権限：最大30日
- リジェクト率：比較的高い（Instagram専用でFacebook権限申請時）

【審査要件】
- Business App verification必須
- プライバシーポリシー必須
- ユースケースの詳細説明

【法的注意】
- CAN-SPAM Act適用（商用メッセージ）
- TCPA保護適用
- 事前同意・自動化開示が必要

【参考】
- https://www.interakt.shop/instagram-automation/api-limitations-setup-tips/
```

#### 2.5 n8nでの実装可否

```
【結論】可能だが、設定は複雑

【利用可能なリソース】
1. 公式ワークフローテンプレート
   - Instagram Comment Auto-Reply with AI
   - Instagram DM & Comment Automation with Google Sheets
   - Multi-Platform Auto-Response（Instagram/Facebook/WhatsApp）

2. Community Node
   - n8n-nodes-instagram-automation-pro（npm）
   - Webhook受信、DM送信対応

【必要な知識】
- OAuth 2.0
- Webhook アーキテクチャ
- Facebook Graph API
- n8n 設定

【実装の複雑さ】
- Webhookハンドシェイクの実装
- ペイロードマッピング
- 自己コメントスキップ処理
- エラーハンドリング

【参考】
- https://flowgent.ai/blog/instagram-dm-automation-with-n8n
- https://n8n.io/workflows/5941-automated-instagram-comment-response-with-dms-and-google-sheets-tracking/
- https://medium.com/@j.a.alves/instagram-api-for-n8n-automations-to-handle-dm-comments-and-mentions-8d4aab89ecd5
```

#### 2.6 代替手段

```
【ManyChat】（推奨）
- Meta公式ビジネスパートナー
- 設定が簡単（コード不要）
- 実績豊富、安定性高い

【無料プラン】
- 1,000コンタクトまで
- Comment to DM: 4つまで作成可能
- 制限：User Input機能なし、インテグレーション制限あり

【有料プラン（Pro）】
- $15/月から
- 全機能解放
- User Input、インテグレーション、ブロードキャスト、シーケンス対応

【主要機能】
- Comment to DM（トリガーワードでDM送信）
- Follow to DM（新機能・2025年）
- AI自動返信（ManyChat AI）

【比較: n8n vs ManyChat】
| 項目 | n8n | ManyChat |
|------|-----|----------|
| 初期設定 | 複雑 | 簡単 |
| コスト | サーバー費のみ | 無料〜$15+/月 |
| 柔軟性 | 高い | 中程度 |
| サポート | コミュニティ | 公式サポート |
| Meta連携 | 自己設定 | 事前統合済み |

【結論】
- 講座向け：ManyChat推奨（設定簡単、安定）
- 高度なカスタマイズ：n8n（要技術力）

【参考】
- https://manychat.com/product/instagram
- https://chatimize.com/instagram-dm-automation/
```

---

## フェーズ3: API調査 - X（Twitter）

### 調査項目

| # | 項目 | 状態 | 結果 |
|---|------|------|------|
| 3.1 | X API v2 DM機能の概要 | **完了** | DM機能あり（制限厳しい） |
| 3.2 | メンション/リプライ検知方法 | **完了** | Enterprise必須（$42,000+/月） |
| 3.3 | フォロー検知方法 | **完了** | Enterprise必須（$42,000+/月） |
| 3.4 | DM送信API（制限・条件） | **完了** | **実質使用不可**（2024年5月〜） |
| 3.5 | 必要なAPIプラン（Free/Basic/Pro） | **完了** | DM自動化にはEnterprise必須 |
| 3.6 | n8nでの実装可否 | **完了** | 技術的には可能だが制限で実用困難 |

### 調査メモ

#### 3.1 X API v2 DM機能

```
【概要】
- X API v2でDM送信は技術的に可能
- ただし2024年以降、大幅な制限が導入
- Musk買収後、API料金が大幅値上げ

【APIバージョン】
- v2への移行推奨（公式）
- 2025年1月に新ドキュメントサイト公開（https://docs.x.com）

【参考】
- https://developer.twitter.com/en/docs/twitter-api
- https://twitterapi.io/blog/twitter-api-pricing-2025
```

#### 3.2 メンション/リプライ検知

```
【結論】Webhook（リアルタイム検知）はEnterprise限定

【Account Activity API】
- Webhookベースでリアルタイムイベント検知
- ポスト、DM、フォロー等のアカウントイベント受信可能
- **Enterprise tier専用**（$42,000+/月）

【代替手段：ポーリング】
- Search APIで定期的にメンション検索
- 制限：Basic $200/月で10,000リクエスト/月
- リアルタイム性なし

【API フィールド】
- in_reply_to_user_id
- referenced_tweets.id
- entities.mentions.username
- conversation_id

【参考】
- https://developer.twitter.com/en/docs/twitter-api/enterprise/account-activity-api/guides/getting-started-with-webhooks
```

#### 3.3 フォロー検知

```
【結論】リアルタイム検知はEnterprise限定

【Account Activity API】
- フォローイベントのWebhook受信が可能
- **Enterprise tier専用**

【代替手段】
- Followers APIで定期的にフォロワーリスト取得
- 差分比較で新規フォロワー検出
- API呼び出し制限が厳しい
- 実用性低い

【参考】
- https://developer.x.com/en/use-cases/build-for-businesses/track-events
```

#### 3.4 DM送信API

```
【重大な制限】2024年5月以降

⚠️ **実質使用不可能レベルの制限**

【Basic tier（$200/月）】
- 2024年5月28日以降、DM制限が1リクエスト/日に変更
- 「ほとんどのワークフローで不十分」と公式記載

【Pro tier（$5,000/月）】
- DM送信で問題報告多数
- 30メッセージ程度で12時間以上ブロック
- "You must wait before creating new DM events" エラー

【レート制限】
- 15リクエスト/15分（ユーザーあたり）
- 超過時：一時ブロック

【参考】
- https://creatorflow.so/blog/instagram-api-rate-limits-explained/
- https://devcommunity.x.com/t/twitter-dm-v2-rate-limiter-not-working-as-expected-pro-tier/194940
```

#### 3.5 必要なAPIプラン

```
【料金体系】2025年

| プラン | 月額 | 読み取り | 書き込み | DM | Webhook |
|--------|------|----------|----------|-----|---------|
| Free | $0 | 50ポスト/月 | 1,500ポスト/月 | × | × |
| Basic | $200 | 10,000/月 | 3,000/月 | △（1/日） | × |
| Pro | $5,000 | 100万/月 | 30万/月 | △（制限厳） | × |
| Enterprise | $42,000+ | カスタム | カスタム | ○ | ○ |

【新料金体系（2025年11月ベータ）】
- 従量課金制（AWS/GCP方式）
- 読み取り：$0.005/リクエスト
- 書き込み：$0.01/リクエスト
- クローズドベータ中

【結論】
DM自動化 + イベント検知 = Enterprise必須（$42,000+/月）
→ **講座向けとしては非現実的**

【参考】
- https://getlate.dev/blog/twitter-api-pricing
- https://twitterapi.io/blog/twitter-api-pricing-2025
```

#### 3.6 n8nでの実装可否

```
【結論】技術的には可能だが、API制限により実用困難

【n8n X(Twitter)ノード機能】
- DM作成：○
- 検索：○
- いいね/リツイート：○
- メンション検知：×（外部サービス必要）

【利用可能なワークフロー】
1. Twitter Reply Bot（Apify連携）
2. Twitter Content Automation with Gemini AI
3. Tweet Filtering and Replies with GPT

【メンション検知の代替】
- Mention.com などの外部サービス併用
- 追加コスト発生

【必要な設定】
- Twitter Developer Account
- OAuth 2.0 認証
- API tier契約

【現実的な問題】
1. DM API制限が厳しすぎて自動配布は実用不可
2. Webhook非対応（Enterprise以外）でリアルタイム検知不可
3. ポーリングはAPI呼び出し制限で非効率

【参考】
- https://n8n.io/integrations/twitter/
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.twitter/
```

---

## フェーズ4: 特典作成フロー設計

### 調査・設計項目

| # | 項目 | 状態 | 結果 |
|---|------|------|------|
| 4.1 | 特典の種類（PDF/リンク/テキスト） | 未着手 | - |
| 4.2 | 投稿内容→特典の自動生成フロー | 未着手 | - |
| 4.3 | 特典の保存場所（GDrive/S3等） | 未着手 | - |
| 4.4 | 特典と投稿の紐付け方法 | 未着手 | - |
| 4.5 | AIによる特典コンテンツ生成 | 未着手 | - |

### 特典の種類（想定）

| 種類 | 例 | 生成方法 |
|------|-----|----------|
| PDFガイド | チェックリスト、ステップガイド | Claude + PDF生成 |
| Notionテンプレート | テンプレートリンク | 事前作成 |
| 動画リンク | 限定動画URL | 事前アップロード |
| テキスト情報 | 詳細解説、コード例 | Claude生成 |
| 画像素材 | テンプレート画像 | Nanobanana生成 |

---

## 技術スタック（想定）

| 項目 | 技術 | 備考 |
|------|------|------|
| ワークフロー | n8n | Webhook受信、API呼び出し |
| APIサーバー | Python (Flask) | SNS API連携 |
| 特典生成 | Claude API | テキスト・PDF生成 |
| 画像生成 | Nanobanana | 特典画像 |
| 特典保存 | Google Drive | PDF/画像保存 |
| 履歴管理 | Google Sheets | 送信履歴、重複防止 |

---

## 参考資料

### 公式ドキュメント

| プラットフォーム | URL | 備考 |
|------------------|-----|------|
| Instagram Graph API | https://developers.facebook.com/docs/instagram-api | ビジネスアカウント必須 |
| Instagram Messaging | https://developers.facebook.com/docs/messenger-platform/instagram | DM送信 |
| X API v2 | https://developer.twitter.com/en/docs/twitter-api | DM、イベント |

### 既存プロジェクト参照

| ファイル | 内容 |
|----------|------|
| HANDOFF-n8n-x-auto-post.md | X投稿の既存実装 |
| HANDOFF-x-advanced.md | X上級編 |
| content/modules/n8n-advanced/ | Instagram既存ワークフロー |

---

## 更新履歴

| 日付 | 更新内容 | 担当 |
|------|----------|------|
| 2025-12-29 | HANDOFF作成、フェーズ2開始 | AI Assistant |
| 2025-12-29 | フェーズ2完了（Instagram API調査）、フェーズ3開始 | AI Assistant |
| 2025-12-29 | フェーズ3完了（X API調査）、**X自動DM配布は非現実的と結論** | AI Assistant |
| 2025-12-29 | **講座暫定版作成完了**（Module 01-03）、エルグラム採用決定 | AI Assistant |
| 2025-12-29 | **Module 04追加**（投稿に合わせた特典の作成） | AI Assistant |
| 2025-12-29 | **特典調査完了** - 調査結果をresearch-gift-examples.mdに保存 | AI Assistant |
| 2025-12-30 | **エルグラムマニュアル調査反映** - 機能一覧(Module 02.5)追加、Module 02/03を詳細化 | AI Assistant |
| 2025-12-30 | **Module 02 スクショ反映完了** - 登録〜Instagram接続までの14枚を配置、講座内容を実フローに修正 | AI Assistant |
| 2025-12-30 | **Module 02 セクション4完了** - 自動応答設定のスクショ9枚追加、講座更新 | AI Assistant |
| 2025-12-30 | **Module 04（特典作成）のブラッシュアップ開始** | AI Assistant |
| 2025-12-30 | **番外編: ViralFindr競合リサーチ講座** - スクショ6枚収集、モジュール作成完了 | AI Assistant |
| 2026-01-05 | **抽出ロジック解決** - step1参照、ユースケース中心、出現頻度≠食いつく をガイドに追記 | AI Assistant |
| 2026-01-05 | **台本12本作成完了** - `content/guides/scripts-ranking-videos.md` に保存 | AI Assistant |
| 2026-01-05 | **ガイド修正** - 口調ルール追加、男女入れ替え、ですます調統一 | AI Assistant |
| 2026-01-05 | **バズるランキング動画講座作成開始** - Module 01-02作成（台本作成まで）、動画作成はModule 03以降で検証後に作成予定 | AI Assistant |
| 2026-01-06 | **Genspark特典ページ作成完了** - 3機能解説、プロンプト4種、スライド見本9枚、Nanobanana講座画像引用 | AI Assistant |
| 2026-01-06 | **Discord CTAフッターコンポーネント作成** - `components/GiftDiscordCTA.tsx`、全特典ページに自動表示 | AI Assistant |
| 2026-01-06 | **特典ページ作成ガイド作成** - `content/guides/gift-page-creation-guide.md` | AI Assistant |

---

## 現在のアクション

**エルグラムの具体的な設定の実証**

Genspark特典ページ（`/gift/genspark-guide`）が完成。次はエルグラムで実際にDM自動配布を設定して検証する。

### 完了した作業（2026-01-06）

1. **Genspark特典ページ作成**
   - 3機能解説（リサーチ・資料作成・動画生成）
   - プロンプト4種収録
   - スライド見本9枚追加
   - Nanobanana講座の画像を引用

2. **Discord CTAフッターコンポーネント作成**
   - `components/GiftDiscordCTA.tsx`
   - 全特典ページ（`/gift/[slug]`）に自動表示
   - Discord招待リンク: https://discord.gg/xQM6NgmwPk

### 次のステップ

1. **エルグラムでGenspark投稿の自動応答を設定**
   - トリガーワード: 好きな季節
   - DM内容: 特典URL（`/gift/genspark-guide`）
2. **実際に投稿してE2E確認**
3. **結果を記録**

### 参照すべきファイル

| ファイル | 内容 |
|----------|------|
| `content/guides/gift-page-creation-guide.md` | **特典ページ作成ガイド（必読）** |
| `content/guides/scripts-ranking-videos.md` | 台本12本（Genspark含む） |
| `content/modules/instagram-dm-automation/module-02-elgram-setup.md` | エルグラム設定講座 |

---

## 共有済みスクリーンショット

### Module 02: エルグラム登録〜Instagram接続（セクション2-3）

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `/instagram-dm-automation/module-02-step01-homepage.png` | エルグラム公式サイトトップ | セクション2 Step 1 | 可 |
| `/instagram-dm-automation/module-02-step02-email-register.png` | メールアドレス入力画面 | セクション2 Step 2 | 可 |
| `/instagram-dm-automation/module-02-step03-email-sent.png` | 認証メール送信完了 | セクション2 Step 3 | 可 |
| `/instagram-dm-automation/module-02-step04-email-confirm.png` | メール確認（ユーザー登録へ進む） | セクション2 Step 3 | 可 |
| `/instagram-dm-automation/module-02-step05-account-info.png` | アカウント情報登録 | セクション2 Step 4 | 可 |
| `/instagram-dm-automation/module-02-step06-register-complete.png` | 登録完了 | セクション2 Step 5 | 可 |
| `/instagram-dm-automation/module-02-step07-login.png` | ログイン画面 | セクション2 Step 6 | 可 |
| `/instagram-dm-automation/module-02-step08-welcome.png` | Welcome画面 | セクション3 Step 1 | 可 |
| `/instagram-dm-automation/module-02-step09-ig-connect-info.png` | Instagram接続説明 | セクション3 Step 2 | 可 |
| `/instagram-dm-automation/module-02-step10-ig-permission.png` | Instagram権限許可 | セクション3 Step 3 | 可 |
| `/instagram-dm-automation/module-02-step11-connect-confirm.png` | 接続確認画面 | セクション3 Step 4 | 可 |
| `/instagram-dm-automation/module-02-step12-connect-complete.png` | 接続完了 | セクション3 Step 5 | 可 |
| `/instagram-dm-automation/module-02-step13-terms-popup.png` | 利用規約改定ポップアップ | セクション3 Step 6 | 可 |
| `/instagram-dm-automation/module-02-step14-dashboard.png` | 管理画面（ダッシュボード） | セクション3 Step 7 | 可 |

### Module 02: 自動応答設定（セクション4）

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `/instagram-dm-automation/module-02-step15-auto-response-start.png` | 自動応答初期画面 | セクション4 開始 | 可 |
| `/instagram-dm-automation/module-02-step16-trigger-select.png` | トリガー選択画面 | セクション4 トリガー選択 | 可 |
| `/instagram-dm-automation/module-02-step17-new-create-modal.png` | 新規作成モーダル | セクション4 管理名設定 | 可 |
| `/instagram-dm-automation/module-02-step18-select-post.png` | 対象の投稿を選択 | セクション4 Step 1 | 可 |
| `/instagram-dm-automation/module-02-step19-keyword-setting.png` | キーワード設定 | セクション4 Step 2 | 可 |
| `/instagram-dm-automation/module-02-step20-filter-setting.png` | 絞り込み設定 | セクション4 Step 3 | 可 |
| `/instagram-dm-automation/module-02-step21-action-setting.png` | アクション設定 | セクション4 Step 4 | 可 |
| `/instagram-dm-automation/module-02-step22-comment-reply.png` | 投稿内コメント返信 | セクション4 Step 5 | 可 |
| `/instagram-dm-automation/module-02-step23-schedule-setting.png` | 稼働スケジュール | セクション4 Step 6 | 可 |

---

## 作成済み講座モジュール

### バズるランキング動画講座（viral-ranking-video）

| Module | タイトル | 状態 | 備考 |
|--------|----------|------|------|
| 01 | バズるランキング動画とは | **完了** | 概要、心理学、ターゲット分析 |
| 02 | 台本作成フロー | **完了** | リサーチ、特典設計、台本作成手順 |
| 03 | 動画作成 | **未着手** | 検証後、採用した方法のみ講座化 |

**ファイル配置**:
```
content/modules/viral-ranking-video/
├── _category.json
├── module-01-overview.md
└── module-02-script-creation.md
```

### Instagram DM自動配布講座

| Module | タイトル | 状態 | 備考 |
|--------|----------|------|------|
| 01 | コメント→DM自動配布の仕組みと概要 | **暫定完了** | スクショ待ち |
| 02 | エルグラムでコメント→DM自動配布を設定 | **完了** | スクショ23枚反映済み（セクション2-4完了） |
| 02a | エルグラム機能一覧（できること早見表） | **新規追加** | マニュアル調査結果反映 |
| 03 | 高度な自動応答設定と活用事例 | **暫定完了** | スクショ待ち、詳細化済み |
| 04 | 投稿に合わせた特典の作成 | **暫定完了** | スクショ待ち |

**ファイル配置**:
```
content/modules/instagram-dm-automation/
├── _category.json
├── module-01-overview.md
├── module-02-elgram-setup.md
├── module-02a-feature-list.md   ← 機能一覧（新規追加）
├── module-03-advanced-settings.md
├── module-04-gift-creation.md
└── research-gift-examples.md  ← 特典調査結果
```

### 特典調査結果（research-gift-examples.md）

インフルエンサーが実際に配布している特典を調査した結果：

**特典の種類**:
| 種類 | 具体例 |
|------|--------|
| PDFガイド | チェックリスト、ステップガイド |
| テンプレート | Canva、Notion、スプレッドシート |
| プロンプト集 | ChatGPT/Claude用プロンプト |
| 動画コンテンツ | ミニ講座、チュートリアル |

**効果的な特典の4条件**:
1. 関連性（投稿テーマと直結）
2. 消費しやすい（20ページ以内）
3. 実行可能（すぐ使える）
4. 具体的（抽象論ではなくツール/リスト）

**成功率**: DM配布のコンバージョン率は約50%（ランディングページの約5-10倍）

**参照**: `content/modules/instagram-dm-automation/research-gift-examples.md`

---

## 特典の方向性（確定）

### 採用する特典タイプ

| 優先度 | タイプ | 具体例 | 理由 |
|--------|--------|--------|------|
| **1位** | AI活用系 | プロンプト集、AI活用チェックリスト | メインターゲット |
| **2位** | 手順まとめ系 | ステップガイド、チェックリスト | **プロジェクトの強み** |
| **3位** | テンプレート系 | Canva/Notion/スプレッドシート | 可能な限り対応 |

### 除外するタイプ

- SNS運用系（投稿アイデア100選等）→ 対象外

### プロジェクトの強み

```
講座作成で培った「手順を簡潔にまとめる」技術
  ↓
そのまま特典（チェックリスト、ステップガイド）作成に活用
  ↓
高品質な特典を効率的に量産可能
```

### 特典作成フロー（確定版）

```
Step 1: 投稿テーマを決める
Step 2: 関連するAI活用 or 手順をピックアップ
Step 3: Claude/ChatGPTでコンテンツ生成
Step 4: 講座フォーマットで整理（チェックポイント形式）
Step 5: Canvaでデザイン（PDF化）
Step 6: Google Driveで共有リンク発行
Step 7: エルグラムで自動応答設定
```

---

## 参照資料

### バズるランキング動画 台本作成ガイド【完全版】

**パス**: `content/guides/viral-ranking-video-guide.md`

**これを読めば台本が作れる**完全ガイド。暗黙知なしで台本作成が可能。

**内容**:
1. この型とは何か
2. ターゲット分析（ペルソナ、リテラシー、悩み、求めているもの）
3. なぜバズるのか（心理学的背景）
4. 台本作成フロー
   - この型の本質（再現性、数字の扱い方、マーケティングの本質）
   - パターン選択（副業系 or ツール系）
   - リサーチ方法
   - 特典設計（プロンプト + 作り方）
5. 台本作成手順（Step by Step）
6. 言葉選びのルール
7. 完成前チェックリスト
8. よくある失敗と対策
9. サンプル台本（2本）
10. 講座別ランキング設計例

---

### バズ投稿テンプレート（詳細分析）

**パス**: `content/research/viral-ranking-video-template.md`

Instagram/TikTokでバズっているランキング形式動画を**心理学的に深層分析**した設計図。

**8つの設計要素**:
1. **認知的不協和設計** - なぜ「論外」で始めると離脱できないのか
2. **役割設計** - 男女掛け合いの本質（自己投影と権威）
3. **期待値設計** - ツァイガルニク効果で1位まで見せる構造
4. **数字の心理別使い分け** - 目標・証拠・障壁除去の3種類
5. **簡単さの演出** - 自己効力感を与える5パターン
6. **CTA行動設計** - 思考コスト0でコメントさせる技術
7. **特典の欲求喚起** - 動画内で「欲しい」を先に作る方法
8. **断定設計** - 人は「決めてもらいたい」心理

**再現のためのチェックリスト**:
- 投稿作成前の確認項目
- 冒頭3秒の設計確認
- 各ランク紹介の構造確認
- CTA・言葉選びの確認

**収録内容**:
- 5本の投稿サンプル（台本全文）
- 講座別ランキング設計例（Suno、エルグラム）
- 完全版台本テンプレート

**活用シーン**:
- SNS投稿の台本作成時（この通りに作れば再現可能）
- 特典配布用投稿の設計時
- CTAキーワードの選定時

---

## 質問事項（ユーザー確認待ち）

現時点での確認事項はありません。
