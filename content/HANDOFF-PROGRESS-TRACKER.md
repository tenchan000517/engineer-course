# 総合引き継ぎ書: n8n上級編 拡張計画

**作成日**: 2025-12-16
**最終更新**: 2025-12-16
**プロジェクト**: engineer-course / n8n-advanced

---

## 進捗サマリー

| フェーズ | 状態 | 完了率 |
|---------|------|--------|
| n8n上級編 Module 01-09 | ✅ 完了 | 100% |
| Module 10: ストーリーズ | ✅ 完了 | 100% |
| **Module 10.5: インサイトデータ取得** | 🔲 **次のタスク** | 0% |
| Module 11: クロスポスト | 🔲 未着手 | 0% |
| Nanobanana Pro講座 | 📋 計画中 | 0% |
| カルーセル投稿 | 📋 計画中 | 0% |

---

## 1. 完了済み: n8n上級編 Module 01-09

### 1.1 モジュール一覧

| # | モジュール | ファイル | 状態 |
|---|-----------|----------|------|
| 01 | AI音声生成の基本セットアップ | `module-01-audio-setup.md` | ✅ |
| 02a | 音声合成ワークフロー（前編） | `module-02a-audio-workflow.md` | ✅ |
| 02b | 音声合成ワークフロー（中編） | `module-02b-audio-workflow.md` | ✅ |
| 02c | 音声合成ワークフロー（後編） | `module-02c-audio-workflow.md` | ✅ |
| 03 | リサーチ精度向上 | `module-03-content-ideas-import.md` | ✅ |
| 04 | カテゴリシート構造の改善 | `module-04-canva-sheet-structure.md` | ✅ |
| 05 | Geminiプロンプト改善 | `module-05-gemini-prompt-improvement.md` | ✅ |
| 06 | ideas生成ワークフロー | `module-06-ideas-generation-workflow.md` | ✅ |
| 07 | ワークフロー最適化 | `module-07-workflow-optimization.md` | ✅ |
| 08 | 音声合成ワークフロー最適化 | `module-08-audio-workflow-optimization.md` | ✅ |
| 09 | 運用フローガイド | `module-09-operation-flow.md` | ✅ |
| 10 | ストーリーズ自動投稿 | `module-10-stories-auto-post.md` | ✅ |

### 1.2 ワークフローJSON

| ファイル | 用途 | 状態 |
|----------|------|------|
| `sns-post-advanced-workflow.json` | SNS投稿作成（Module 07で不要化） | ✅ |
| `audio-workflow-advanced.json` | 音声合成 | ✅ |
| `音声合成advanced.json` | 音声合成（最適化版） | ✅ |
| `stories-auto-post.json` | ストーリーズ自動投稿（スタンドアロン版） | ✅ |
| `reel-story-integrated.json` | リール+ストーリーズ統合版 | ✅ |

---

## 2. 完了: Module 10 ストーリーズ

### 2.1 概要

| 項目 | 内容 |
|------|------|
| 目的 | リール投稿後にストーリーズで自動告知 |
| ファイル名 | `module-10-instagram-stories.md` |
| 詳細仕様 | `HANDOFF-module-10-stories.md` |
| 想定所要時間 | 30分（受講者向け） |

### 2.2 実装チェックリスト

- [x] ユーザーに未確認事項を質問
  - [x] ストーリーズ画像生成方法 → リールサムネイル+テキスト
  - [x] 既存ワークフロー名とパス確認 → Instagram Reel from Drive v6.json
  - [x] postsシート列構成確認 → 17列
- [x] ワークフロー作成・動作確認
- [x] 日本語フォントインストール手順
- [x] トラブルシューティング執筆（実際に発生した問題のみ）
- [x] スクリーンショット作成（13枚 + 統合版9枚）
- [x] ワークフローJSON作成（stories-auto-post.json）
- [x] 講座執筆（module-10-stories-auto-post.md）
- [x] リール投稿フローとの統合セクション追加
- [x] 統合版ワークフローJSON作成（reel-story-integrated.json）
- [x] 無限ループ緊急停止トラブルシューティング追加

### 2.3 技術仕様（確定済み）

```
Instagram Graph API ストーリーズ投稿:
1. POST /{ig-user-id}/media (media_type=STORIES)
2. GET /{container_id}?fields=status_code (FINISHED待ち)
3. POST /{ig-user-id}/media_publish

必要権限: instagram_basic, instagram_content_publish
```

---

## 3. 次のタスク: Module 10.5 インサイトデータ取得

### 3.1 概要

| 項目 | 内容 |
|------|------|
| 目的 | Instagram投稿のパフォーマンスデータを自動取得 |
| ファイル名 | `module-10.5-insights.md`（仮） |
| 詳細仕様 | `HANDOFF-module-insights.md` |
| 前提 | Module 10完了 |

### 3.2 ユーザー確認事項（未確認）

| # | 質問 | 回答 |
|---|------|------|
| 1 | 取得したいインサイトデータは？ | 未確認 |
| 2 | データの保存先は？ | 未確認 |
| 3 | 取得タイミングは？ | 未確認 |
| 4 | 分析・可視化は必要？ | 未確認 |
| 5 | 過去投稿も取得したい？ | 未確認 |

### 3.3 実装チェックリスト

- [ ] ユーザー確認事項を質問
- [ ] Instagram Graph API インサイト権限の確認
- [ ] シート構造の設計
- [ ] ワークフロー作成
- [ ] 動作確認
- [ ] スクリーンショット作成
- [ ] 講座執筆
- [ ] ワークフローJSON作成

---

## 4. その次: Module 11 クロスポスト

### 4.1 概要

| 項目 | 内容 |
|------|------|
| 目的 | Facebook / X / TikTokへ同時投稿 |
| ファイル名 | `module-11-crosspost.md` |
| 詳細仕様 | `HANDOFF-module-11-crosspost.md` |
| 前提 | Module 10.5（インサイト）完了 |

### 4.2 実装チェックリスト

- [ ] Facebook投稿セクション
  - [ ] API設定解説
  - [ ] ノード追加手順
- [ ] X (Twitter)投稿セクション
  - [ ] Developer Account取得手順
  - [ ] メディアアップロード + ツイート
- [ ] TikTok投稿セクション
  - [ ] Upload-Post.com設定
  - [ ] API呼び出し手順
- [ ] キャプション最適化セクション
- [ ] 動作確認セクション
- [ ] ワークフローJSON更新/作成

### 4.3 プラットフォーム別制限（確定済み）

| プラットフォーム | 文字数 | 画像枚数 | API |
|-----------------|--------|----------|-----|
| Instagram | 2,200 | 10 | Graph API |
| Facebook | 63,206 | 無制限 | Graph API |
| X (Twitter) | 280 | 4 | X API v2 |
| TikTok | 150 | - | Upload-Post |

---

## 5. 将来計画: Nanobanana Pro講座

### 5.1 概要

| 項目 | 内容 |
|------|------|
| 位置づけ | **別の大カテゴリ**として作成 |
| 目的 | AI画像生成（漫画/インフォグラフィック） |
| 詳細仕様 | `HANDOFF-nanobanana-carousel-future.md` |
| 前提 | Module 10, 11完了 |
| 参考資料 | `C:\instagram-manga-generator` |

### 5.2 計画チェックリスト

- [ ] `C:\instagram-manga-generator` の内容確認
- [ ] 大カテゴリ名の決定
- [ ] ディレクトリ構造の設計
- [ ] Module構成の詳細化
- [ ] 各Moduleの執筆

### 5.3 想定Module構成（仮）

```
【大カテゴリ】Nanobanana Pro AI画像生成講座
├── Module 01: 基本セットアップ
├── Module 02: 漫画スタイル画像生成
├── Module 03: インフォグラフィック生成
└── Module 04: Instagramカルーセル用画像生成
```

---

## 6. 将来計画: カルーセル投稿ワークフロー

### 6.1 概要

| 項目 | 内容 |
|------|------|
| 位置づけ | n8n上級編の続き（Module 12以降） |
| 目的 | AI生成画像をInstagramカルーセルとして投稿 |
| 前提 | **Nanobanana Pro講座完了** |

### 6.2 計画チェックリスト

- [ ] Nanobanana Pro講座の完了を待つ
- [ ] カルーセル投稿APIのテスト
- [ ] ワークフロー設計
- [ ] Module執筆

### 6.3 技術仕様（確定済み）

```
Instagram Graph API カルーセル投稿:
1. POST /{ig-user-id}/media (is_carousel_item=true) × 最大10枚
2. POST /{ig-user-id}/media (media_type=CAROUSEL, children=IDs)
3. POST /{ig-user-id}/media_publish

制限: 2-10枚、1080×1080 or 1080×1350、JPEG only
```

---

## 7. 引き継ぎドキュメント一覧

| ファイル | 用途 | パス |
|----------|------|------|
| **HANDOFF-PROGRESS-TRACKER.md** | **総合進捗管理（このファイル）** | `content/` |
| HANDOFF-MASTER.md | 全体概要、次セッション開始手順 | `content/` |
| HANDOFF-module-10-stories.md | Module 10詳細仕様 | `content/` |
| **HANDOFF-module-insights.md** | **Module 10.5詳細仕様（次のタスク）** | `content/` |
| HANDOFF-module-11-crosspost.md | Module 11詳細仕様 | `content/` |
| HANDOFF-nanobanana-carousel-future.md | 将来計画詳細 | `content/` |

---

## 8. ユーザー確認事項（未解決）

### 8.1 Module 10関連

| # | 質問 | 回答 |
|---|------|------|
| 1 | ストーリーズ画像はDALL-E毎回生成 or 静的テンプレート？ | 未確認 |
| 2 | 既存「Instagram Reel from Drive」ワークフローの正式名称とパス？ | 未確認 |
| 3 | postsシートの現在の列構成は？story_idの追加位置は？ | 未確認 |

### 8.2 将来計画関連

| # | 質問 | 回答 |
|---|------|------|
| 4 | `C:\instagram-manga-generator` の内容は？ | 未確認 |
| 5 | Nanobanana Pro講座の大カテゴリ名は？ | 未確認 |
| 6 | Kie.ai APIの契約状況は？ | 未確認 |

---

## 9. 次のセッション開始手順

```
1. このファイル（HANDOFF-PROGRESS-TRACKER.md）で進捗確認
2. HANDOFF-module-insights.md で次のタスク詳細確認
3. ユーザーにインサイト関連の確認事項を質問
4. 回答に基づいてワークフロー設計・実装
5. 完了したらこのファイルのチェックリストを更新
```

---

## 10. 変更履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| 2025-12-16 | 初版作成、Module 01-09完了確認、Module 10-11計画策定 | Claude Opus 4.5 |
| 2025-12-16 | Module 10完了（ストーリーズ自動投稿） | Claude Opus 4.5 |
| 2025-12-16 | Module 10統合セクション追加、統合版JSON作成、緊急停止トラブルシューティング追加 | Claude Opus 4.5 |
| 2025-12-16 | Module 10.5（インサイトデータ取得）を次のタスクとして追加 | Claude Opus 4.5 |

---

## 11. 技術スタック（参照用）

### 11.1 使用サービス

| サービス | 用途 | 備考 |
|----------|------|------|
| n8n | ワークフロー自動化 | Docker + ffmpeg |
| Google Sheets | データ管理 | GAS連携 |
| Google Drive | ファイルストレージ | 動画保存 |
| Instagram Graph API | 投稿API | Meta Developer |
| Fish Audio | 音声生成 | TTS API |
| Cloudinary | 画像/動画ホスティング | Instagram投稿用 |
| Canva | 動画一括生成 | 手動作業 |
| Antigravity | ideas生成 | Browser Agent |

### 11.2 シート構成（現在）

**ideasシート**: 11列
```
idea_id, month, title, main_tool, content_type, category,
research_points, status, adopted_post, created_at, content_json
```

**postsシート**: 17列
```
post_id, post_type, status, caption, hashtags, media_ids,
scheduled_at, published_at, ig_post_id, share_to_feed,
thumb_offset_ms, error_message, retry_count, created_at,
updated_at, notes, content_json
```

**canva_A〜Eシート**: 13列
```
post_id, narration_1, narration_2, thumb_main, thumb_sub,
set_1, set_2, set_3, set_4, set_5, set_6, audio_status, main_tool
```

---

**このドキュメントは進捗に応じて更新してください**
