# HANDOFF: KLING 動画生成講座

## 概要

KLINGを使った企業PV作成の実現可能性調査。
Google Flowで作成したPVと同レベルの動画が作れるかを検証する。

**目標**: Google Flow版の採用PV（48秒）をKLINGで再現できるか調査

---

## 🚀 次セッションで即実行（ここから始める）

### 調査タスク（徹底調査）

#### 1. KLINGの基本情報調査
- [ ] 公式サイト・アクセス方法
- [ ] 料金プラン（無料枠・有料プラン）
- [ ] 日本からのアクセス可否
- [ ] アカウント作成方法

#### 2. UI・機能調査（2025-12-24時点）
- [ ] 利用可能なモード（Text-to-Video, Image-to-Video等）
- [ ] 画像アップロード機能の有無
- [ ] **人物画像のアップロード制限の有無**（重要）
- [ ] 動画の最大長さ
- [ ] 解像度オプション
- [ ] アスペクト比（16:9, 9:16等）

#### 3. 人物一貫性の調査（最重要）
- [ ] 画像から動画生成で人物を維持できるか
- [ ] キャラクター登録機能の有無
- [ ] 複数シーンでの人物一貫性の保ち方

#### 4. 連続動画作成の調査
- [ ] 延長（Extend）機能の有無
- [ ] 複数クリップの連結機能
- [ ] 最大動画長

#### 5. クレジット・料金調査
- [ ] 無料枠の量
- [ ] 有料プランの価格
- [ ] 1動画あたりのクレジット消費

---

## Google Flow版との比較ポイント

### 実現したい要件

| 要件 | Google Flowでの実現方法 | KLINGで可能か？ |
|------|------------------------|----------------|
| 人物画像からの動画生成 | フレームから動画 | ◎ Image-to-Video |
| 人物の一貫性 | Nano Bananaで素材作成 | ◎ Elements機能（4枚参照） |
| 48秒の動画 | SceneBuilderで連結 | ◎ Extend機能（最大3分） |
| 日本のオフィス風景 | プロンプトで指定 | ◎ プロンプトで指定 |
| BGM追加 | Suno + Canva | ◎ 同様に対応 |

### 必須機能

1. **人物画像から動画生成**できること
2. **人物の一貫性**が保てること
3. **複数シーンを連結**できること
4. **日本からアクセス**できること

---

## 制作予定の台本（Google Flow版と同じ）

| シーン | 内容 | 意図 |
|--------|------|------|
| 1 | 社長が走る→フレームアウト | 仕事が楽しくて仕方ない |
| 2 | ミーティング風景（笑顔） | 仲間・一体感 |
| 3 | ミーティング議論 | 熱量・本気 |
| 4 | 契約成立（握手→ハグ） | 達成 |
| 5 | プレゼン | 成長 |
| 6 | チームでオフィスから出ていく→空へ | 次の挑戦へ |

---

## 調査結果記録欄

### KLINGとは
- 開発元: Kuaishou（快手）- 中国
- リリース: 2024年
- 公式サイト: https://klingai.com / https://app.klingai.com
- 最新モデル: **VIDEO 2.6 Audio**（音声同時生成対応！）
- 特徴: Image-to-Video、Elements機能、Face Model機能、**音声と映像の同時生成**

### 実際のUI確認結果（2025-12-24）

**利用可能なモデル**:
- VIDEO 2.6 Audio（最新・音声同時生成）
- VIDEO 2.5 Turbo
- VIDEO 2.1 / 2.1 Master
- VIDEO 1.6 / 1.5

**重要な発見**:
- **166クレジット**が無料で付与された
- **VIDEO 2.6 Audio**: 音声と映像の同時生成が可能（Google Flowにはない機能）
- **Elements機能は12/29で提供終了** → Kling O1の新機能に移行
- **DeepSeek-R1連携**: プロンプトをAIがブラッシュアップ

**VIDEO 2.6 Audio料金**:
- 音画同期ON: **10クレジット/秒**
- 音画同期OFF: 5クレジット/秒（高品質）/ 3クレジット/秒（標準）
- 166クレジットで音声付き5秒動画 ≒ **約3本**生成可能

### 料金プラン（2025-12-24時点）
| プラン | 月額 | 特徴 |
|--------|------|------|
| 無料 | $0 | 66クレジット/月、5秒動画まで、ウォーターマークあり |
| Standard | $6.99〜 | 初月割引、商用利用可、ウォーターマークなし |
| Pro | $92 | 8,000クレジット、高速生成 |
| Ultra | $127.99〜 | 26,000クレジット、最上位 |

### 機能一覧
| 機能 | 対応 | 詳細 |
|------|------|------|
| Text-to-Video | ◎ | プロンプトから動画生成 |
| Image-to-Video | ◎ | **画像から動画生成可能** |
| 人物画像アップロード | ◎ | **可能（有名人はNG）** |
| Elements機能 | ◎ | **最大4枚の画像参照で人物一貫性** |
| Face Model | ◎ | 10-30本の動画で顔を学習 |
| 延長機能 | ◎ | **最大3分まで（5秒単位）** |
| 連結機能 | △ | 外部ツール（Canva等）で対応 |

### 制約
| 制約 | 詳細 |
|------|------|
| 有名人の画像 | アップロード不可（顔認識でブロック） |
| 本人同意なしの人物 | 禁止（ディープフェイク防止） |
| 無料プラン | 5秒動画まで、ウォーターマークあり |
| KLING 2.0 | 100クレジット/動画（従来の3倍コスト） |

---

## 比較ツール一覧

| ツール | 人物画像 | 一貫性 | 連結 | 状況 |
|--------|---------|--------|------|------|
| **Google Flow** | ◎ | ◎ | ◎ | **採用・完成** |
| Sora 2 | × | △ | ○ | 断念（人物NG） |
| **KLING** | ◎ | ◎ | ◎ | **実現可能** |
| Runway | ? | ? | ? | 未調査 |
| Pika | ? | ? | ? | 未調査 |

---

## 素材（Google Flow版からの参照）

### 宣材写真（社長）
- `/mnt/c/Users/tench/Downloads/LINE WORKS/宣材写真　胸↑.jpg`

### Nano Banana生成画像
- `public/google-flow/module-03-running.jpeg`
- `public/google-flow/module-03-meeting-smile.jpeg`
- `public/google-flow/module-03-handshake.jpeg`
- `public/google-flow/module-03-meeting-discussion.jpeg`
- `public/google-flow/module-03-team-walking.jpeg`

### 完成品（Google Flow版・目標レベル）
- `public/google-flow/module-05-complete-pv.mp4`

---

## 進捗状況

### 完了
- [x] HANDOFF作成（2025-12-24）
- [x] KLINGの基本情報調査（2025-12-24）
- [x] UI・機能調査（2025-12-24）
- [x] 人物一貫性の調査（2025-12-24）
- [x] 実現可能性の判定 → **実現可能**（2025-12-24）
- [x] KLINGにアカウント作成・ログイン（2025-12-24）
- [x] 講座骨組み作成（2025-12-24）
  - `content/modules/kling/_category.json`
  - `app/category/kling/` ルーティング
  - `public/kling/` スクショ保存

### 次のタスク
- [x] Module 02: Image-to-Video講座作成 ✓
- [x] Module 03: PV制作実践講座作成 ✓
- [ ] 上級編（Elements機能、VIDEO 2.6 Audioなど）

---

## PV制作完了（2025-12-24）

### 生成した動画

| シーン | ファイル | 内容 |
|--------|----------|------|
| 1 | pv-scene01-running.mp4 | 社長が走る |
| 2 | pv-scene02-meeting-smile.mp4 | ミーティング笑顔 |
| 3 | pv-scene03-discussion.mp4 | ミーティング議論 |
| 4 | pv-scene04-handshake.mp4 | 契約成立（握手） |
| 5 | pv-scene05-presentation.mp4 | プレゼン |
| 6 | pv-scene06-team-sky.mp4 | チームで空へ |

### 完成品
- `public/kling/pv-complete.mp4`（26MB）

### 使用したプロンプト

**シーン1（走る）**:
```
A Japanese businessman in navy blazer and white t-shirt running energetically through a modern glass corridor, big smile on his face, camera tracking shot following him, he runs past the camera and exits frame to the right, morning sunlight, cinematic motion blur
```

**シーン2（ミーティング笑顔）**:
```
Four Japanese office workers sitting around a wooden meeting table, looking at documents and laptop, everyone smiling and laughing together, warm friendly atmosphere, one woman holds paper and shares good news, coffee cups on table, bright modern meeting room, natural lighting from window
```

**シーン3（議論）**:
```
Four Japanese colleagues in intense discussion at meeting table, woman in green shirt gesturing passionately while explaining idea, others listening attentively and nodding, serious focused expressions, modern conference room with TV screen, dynamic hand movements, professional atmosphere
```

**シーン4（握手）**:
```
Two Japanese businessmen shaking hands firmly in high-rise office, man in navy blazer smiling proudly, cityscape visible through large window behind them, moment of celebration and achievement, warm natural lighting, camera slowly zooms in on handshake, professional success
```

**シーン5（プレゼン）**:
```
Japanese businessman in navy blazer confidently presenting to audience in modern conference room, pointing at presentation screen, professional posture, colleagues watching impressed, bright lighting, corporate setting, camera follows presenter's movement
```

**シーン6（チームで空へ）**:
```
Four Japanese business colleagues walking together through modern city plaza, man in navy blazer leading in center, three women beside him, all smiling confidently, tall glass skyscrapers in background, blue sky with white clouds, camera tilts up toward sky at end, inspirational feeling, morning sunlight
```

---

## 共有済みスクリーンショット

| パス | 内容 | 手順 | 講座使用 |
|------|------|------|----------|
| `public/kling/module-01-top-page.jpg` | トップページ（Kling O1新登場） | Step 1 | 可 |
| `public/kling/module-01-login-screen.png` | ログイン画面 | Step 2 | 可 |
| `public/kling/module-01-credits-received.png` | 166クレジット受け取り | Step 3 | 可 |
| `public/kling/module-01-dashboard.jpg` | ダッシュボード全体 | Step 4 | 可 |
| `public/kling/module-01-dashboard-login.jpg` | ダッシュボード（ログイン時） | Step 4 | 可 |
| `public/kling/module-01-video-generation.png` | 動画生成画面（モデル選択） | UI確認 | 可 |
| `public/kling/module-01-elements.png` | エレメンツ機能（12/29終了警告） | UI確認 | 可 |
| `public/kling/module-01-prompt-presets.png` | プロンプト辞書（カメラワーク） | UI確認 | 可 |
| `public/kling/module-01-my-presets.png` | マイプリセット | UI確認 | 可 |
| `public/kling/module-01-asset-management.png` | アセット管理 | UI確認 | 可 |
| `public/kling/module-01-deepseek.png` | DeepSeek-R1プロンプト支援 | UI確認 | 可 |

---

## 調査時の注意点

### 調査優先順位

1. **人物画像から動画生成できるか**（これがNGなら即断念）
2. 人物の一貫性を保てるか
3. 複数シーン連結できるか
4. 日本からアクセス・利用可能か
5. 料金が現実的か

### 断念基準

以下のいずれかに該当したら断念：
- 人物画像からの動画生成が不可能
- 日本からアクセス不可
- 料金が高すぎる（月$50以上等）

---

## 参考リンク

- KLING公式サイト: https://klingai.com
- KLINGアプリ: https://app.klingai.com
- Elements機能: https://app.klingai.com/global/quickstart/ai-video-character-consistency

### 調査で参照した記事
- [動画生成AI「Kling」とは？](https://shift-ai.co.jp/blog/5053/) - SHIFT AI TIMES
- [Kling AI料金プラン完全比較](https://note.com/th1980/n/n37024c6bff08) - note
- [KLING AI キャラクター参照！Elements機能](https://ai-henoheno-mohero.com/kling-ai-elements/)
- [Kling Extend完全解説](https://note.com/reex_japan/n/nba550ca71f2e) - ReeX Japan

---

## 結論

**KLINGはGoogle Flow版PVの代替として実現可能**

| 判定項目 | 結果 |
|----------|------|
| 人物画像から動画生成 | ◎ 可能 |
| 人物一貫性 | ◎ Elements機能で対応 |
| 48秒以上の動画 | ◎ Extend機能で最大3分 |
| 日本からアクセス | ◎ 可能 |
| 料金 | ◎ Standard $6.99/月〜 |

**Sora 2との違い**: Sora 2は人物画像アップロードがNGだったが、KLINGは**人物画像から動画生成が可能**。

---

**最終更新**: 2025-12-24（講座3モジュール完成）
