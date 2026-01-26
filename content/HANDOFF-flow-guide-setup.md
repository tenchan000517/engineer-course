# HANDOFF: フロー整備・起動術式セットアップ

**作成日**: 2026-01-26
**目的**: 現存する6フロー全てにガイドを作成し、起動術式から呼び出せるようにする

---

## 背景

### 調査結果（2026-01-26）

- HANDOFF: 約60ファイル → アクティブ15件、アーカイブ候補30件
- モジュールから抽出したフロー: 約35個
- 実際に「現存するフロー」として確定: 7つ
- ガイドがあるフロー: 2つのみ

### 問題

- 6フロー全てにガイドがあれば → 起動術式から呼び出せる → 運用が楽になる
- 現状はガイドが2つしかない

---

## 現存するフロー（確定）

| # | フロー | 場所 | ガイド |
|---|--------|------|--------|
| 1 | Antigravityでインフルエンサー→X投稿作成 | `x-research/module-02-antigravity-workflow.md` | **なし** |
| 2 | インフルエンサー→Instagram投稿作成 | `instagram_workflow_v10.md` | `instagram-post-generation-guide.md` (検証待ち) |
| 3 | X自動投稿システム | `n8n-x-auto-post/` | **なし** |
| 4 | 文字起こしフロー | `n8n-transcription/` | **なし** |
| 5 | NanobananaAPIで画像生成 | `nanobanana-beginner/` + `nanobanana-image-generation/` | **なし** |
| 6 | ランキングリール投稿フロー | `premiere-pro-ranking-reel/` | `ranking-reel-script-guide.md` ✓ |
| 7 | 講座を作成する | - | `CONTENT-GUIDE.md` ✓ |

---

## 目標

**全7フローにガイドを作成し、起動術式に登録する**

### 完了条件

- [ ] フロー1: Antigravity→X投稿 ガイド作成
- [ ] フロー2: インフルエンサー→Instagram投稿 **ガイド作成済み・実行検証待ち**
- [ ] フロー3: X自動投稿 ガイド作成
- [ ] フロー4: 文字起こし ガイド作成
- [ ] フロー5: Nanobanana画像生成 ガイド作成
- [x] フロー6: ランキングリール ガイド完了
- [x] フロー7: 講座作成 ガイド完了

---

## ガイド作成方針

### ガイドとは

「〇〇をする」というトリガーで始まる作業手順書。
起動術式から呼び出して、Claude Codeがフローを実行できるようにする。

### ガイドの構成（推奨）

```markdown
# 〇〇ガイド

## トリガー
「〇〇を作成してください」「〇〇をしてください」

## 前提条件
- 必要なもの
- 事前準備

## フロー
1. ステップ1
2. ステップ2
3. ...

## 参照
- 関連モジュール
- 関連HANDOFF
```

### 保存先

`content/guides/` に保存

### 命名規則

`{フロー名}-guide.md`

例:
- `x-post-generation-guide.md`
- `instagram-post-generation-guide.md`
- `transcription-guide.md`
- `nanobanana-image-guide.md`

---

## 次のアクション

1. **フロー2の実行検証**
   - Antigravityでv10を実行
   - 出力された`step1_influencer_data.json`を使ってClaude Codeがブラッシュアップを実行
   - ガイドが正しく機能するか検証
   - 検証完了後、フロー2を完了とする

2. **フロー1, 3, 4, 5のガイド作成**
   - 各モジュールの内容を確認
   - トリガー、前提条件、フローをまとめる
   - `content/guides/` に保存

3. **起動術式に追記**
   - 作成したガイドを起動術式.mdに追加

---

## 関連ファイル

| ファイル | 内容 |
|----------|------|
| `/mnt/c/engineer-course/起動術式.md` | 起動術式一覧 |
| `/mnt/c/engineer-course/FLOW-LIST.md` | フロー一覧 |
| `/mnt/c/engineer-course/HANDOFF-LIST.md` | HANDOFF一覧 |
| `/mnt/c/engineer-course/HANDOFF-COMPLETION-STATUS.md` | 完了状態マッピング |
| `/mnt/c/engineer-course/content/guides/` | ガイド保存先 |

---

## 進捗

| 日付 | 作業内容 |
|------|----------|
| 2026-01-26 | 初期調査完了、現存フロー7つ特定、ガイド2つ確認 |
| 2026-01-26 | フロー2ガイド作成（`instagram-post-generation-guide.md`） |
| 2026-01-26 | Antigravityワークフローv10作成（データ収集に特化） |
| 2026-01-26 | v8, v9を`docs/workflows/`にアーカイブ |
| 2026-01-26 | 起動術式に追加済み |
| 2026-01-26 | Antigravityでデータ収集実行 → `20260126_02/` にデータあり |
| 2026-01-26 | **引き継ぎ**: データはあるがv10フォーマットと異なる |
| 2026-01-26 | rawデータからstep1_influencer_data.json, step2_trend_ranking.json作成 |
| 2026-01-26 | v10の問題特定: 「検索しない」指示がブラウザ操作を壊していた |
| 2026-01-26 | v10修正完了、次は「AI×副業」「AI×動画生成」テーマで調査 |

---

## 引き継ぎ状態

### Antigravity出力フォルダ
`/mnt/c/Instagram_AI/20260126_02/`

### 完了ファイル
- `step1_influencer_data.json` - 60本のデータ（v10フォーマット）
- `step2_trend_ranking.json` - ツールランキング（22ツール）

### トレンドランキングTOP10
| # | ツール | 言及数 |
|---|--------|--------|
| 1 | Gemini | 10 |
| 2 | NotebookLM | 6 |
| 3 | ChatGPT | 6 |
| 4 | Canva | 5 |
| 5 | Claude | 5 |
| 6 | Manus | 5 |
| 7 | NanoBanana Pro | 5 |
| 8 | GPT-Image 1.5 | 2 |
| 9 | Google AI Studio | 2 |
| 10 | Antigravity | 2 |

### v10ワークフロー修正済み（2026-01-26）
- 対象: チャエン、mikimiki、さき、木内翔大、さき-インスタの大学
- **問題**: 「検索しない」という余計な指示がAntigravityのブラウザ操作を壊していた
- **修正**: 余計な追加（`検索しない`、`URLを直接開く`）を削除
- v8の表現に戻した: 「YouTubeチャンネルにアクセス」のみ

### 次のアクション
1. ~~**「AI×副業」テーマで調査**~~ → **完了** `content/research/ai-fukugyo-youtube-influencers-top20.md`
2. ~~**「AI×動画生成」テーマで調査**~~ → **完了** `content/research/ai-video-generation-youtube-influencers-top20.md`
3. Antigravityでv10を再実行して動作確認

### AI関連インフルエンサー調査結果（2026-01-26）

| テーマ | ファイル |
|--------|----------|
| AI×副業 | `content/research/ai-fukugyo-youtube-influencers-top20.md` |
| AI×動画生成 | `content/research/ai-video-generation-youtube-influencers-top20.md` |
| AI×バズ（グローバル） | `content/research/ai-viral-content-global-influencers.md` |

**AI×副業トレンド**:
- ChatGPTでブログ/ライティング
- 動画生成AIでYouTubeショート量産
- 「自動化して不労所得に近づける」切り口が人気

**AI×バズ注目**:
- Palo AI（元MrBeaastスタッフ創業）- バイラル分析AI
- Lu do Magalu（710万フォロワー）- 世界最大バーチャルインフルエンサー
- MrBeast式3指標: CTR、AVD、AVP
