# 2026-01-23 セッション引き継ぎ（更新版）

**公式HANDOFFはこちら**: `content/HANDOFF-reel-kata.md`

---

## 現在の状態

### 完了したステップ

| ステップ | 内容 | 状態 |
|---------|------|------|
| Step 1-7 | 台本作成・保存 | ✅ 完了（前セッション） |
| Step 14 | キャプション作成 | 未実施 |
| Step 15 | ナレーション整形 | ✅ 完了 |
| Step 16 | ナレーション手動修正 | ✅ 確認済み |

### 次のステップ

**Step 21: テロップテキスト作成**
- 入力: `narration.txt`
- 出力: `telop.txt`
- ルール: 1行8文字前後、最大2行

---

## プロジェクトフォルダ

```
C:\Instagramショート\Instagram_Reels_Production\ランキング_SNS_AIツール_2026-01-23\
├── script.txt      ← 台本（完了）
├── narration.txt   ← ナレーションテキスト（完了）
├── telop.txt       ← テロップテキスト（次のステップ）
└── subtitle.srt    ← SRTファイル（未作成）
```

---

## 今回のセッションで行った変更

### 1. narration.txtを作成

Fish Audio用フォーマットでナレーションテキストを作成済み。

ツール名変換：
- Canva → キャンバ
- Nano Banana Pro → ナノバナナ
- Vrew → ブリュー
- CapCut → キャップカット
- Fish Audio → フィッシュオーディオ
- Genspark AI → ジェンスパーク

### 2. ai-tool-name-list.mdにルールを追記

**使い方セクションに追加したルール**:
- バージョン番号: リストにバージョンが入っている場合は、そのバージョンを必ず入れる（例: Veo 3.1とVeo 3は別物）
- リストにないツール名: 変換せずにユーザーに報告する。正しい表記が確定したらリストに追記する

**備考欄に追加した表記揺れ例**:
- Genspark: 「Genspark AI」等でも「ジェンスパーク」
- Antigravity: 「Google Antigravity」等でも「アンチグラビティ」
- Nano Banana: 「Nano Banana Pro」等でも「ナノバナナ」
- Comet: 「Perplexity Comet」等でも「コメット」
- Flow: 「Google Flow」等でも「フロー」
- Kling: 「KLING AI」「Kling AI」等でも「クリング」
- Sora: 「OpenAI Sora」等でも「ソラ」
- Suno: 「Suno AI」「SUNO AI」等でも「スノー」
- GPT5.2: 「ChatGPT 5.2」等でも「ジーピーティーゴーテンニ」

### 3. ranking-reel-script-guide.mdに追記

Step 14、Step 15、Step 21に「備考欄も確認」を追記。

### 4. 共有素材にSUNO.pngを追加

`C:\Instagramショート\Instagram_Reels_Production\共有素材\AIロゴ\SUNO.png`

---

## 解決済みの問題

### テロップの分割ルール → 確定

**7つの鉄則**:
1. 1行最大8文字厳守
2. 1行1テロップ
3. 音読完全一致（一字一句変えない）
4. セマンティック・チャンク（助詞で終わる）
5. 高速スタッカート演出（重要単語は1行独立）
6. 3行禁止・原則1行
7. 句読点排除

**心理学的根拠**: 認知的不協和（音と文字のズレ）は離脱に直結

**ガイドに追記済み**: `ranking-reel-script-guide.md` Step 21

---

## 参照すべきファイル

| ファイル | 用途 |
|----------|------|
| `docs/archive/ranking-reel-script-guide.md` | ガイド本体（Step 21-23参照） |
| `docs/archive/ai-tool-name-list.md` | ツール名変換リスト |
| `content/HANDOFF-reel-kata.md` | 公式HANDOFF |

---

**最終更新**: 2026-01-23
**次のアクション**: Step 21 テロップテキスト作成
