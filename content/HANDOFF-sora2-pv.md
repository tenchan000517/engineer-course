# HANDOFF: Sora 2 企業PV実践

## 概要

Sora 2を使って企業PV（スタートアップ採用PV）を作成する実践。
Google Flowで作成したPVと同じ内容をSora 2で再現し、両ツールの違いを比較する。

**参照**:
- `content/HANDOFF-google-flow.md`（Google Flow版の制作記録）
- `content/HANDOFF-sora2.md`（Sora 2基礎講座）

---

## 🚀 次セッションで即実行（ここから始める）

### 目標
Google Flowで作成した採用PV（48秒）をSora 2で再現

### 制作済み（Google Flow版）

| シーン | 内容 | 意図 |
|--------|------|------|
| 1 | 社長が走る→フレームアウト | 仕事が楽しくて仕方ない |
| 2 | ミーティング風景（笑顔） | 仲間・一体感 |
| 3 | ミーティング議論 | 熱量・本気 |
| 4 | 契約成立（握手→ハグ） | 達成 |
| 5 | プレゼン | 成長 |
| 6 | チームでオフィスから出ていく→空へ | 次の挑戦へ |

### Sora 2での制約確認

| 制約 | 詳細 | 対応策 |
|------|------|--------|
| 人物画像アップロードNG | OpenAI公式ポリシー | Characters機能 or プロンプトで作り込み |
| Storyboardで人物画像NG | 「we don't create videos from images that include people」 | プロンプトのみで生成 |
| 最大25秒/クリップ | Plusプランの上限 | 複数クリップ + Stitch |
| Stitch最大60秒 | 連結上限 | 十分（48秒PV） |

### 選択肢

#### A案: Characters機能を使う（リアルな人物）
- 主人公（社長）をCharacters機能で登録
- **メリット**: 人物の一貫性が保てる
- **デメリット**: 本人が録画・登録する必要あり

#### B案: プロンプトのみで人物を作り込む
- Text-to-Videoで全シーン生成
- **メリット**: 手軽
- **デメリット**: 人物の一貫性が難しい

#### C案: アニメスタイルで作る
- アニメキャラクターは人物NGに該当しない
- **メリット**: Storyboard機能が使える
- **デメリット**: リアルな採用PVとは異なる雰囲気

---

## Step 1: 方針決定

### 確認事項
- [ ] 社長のCharacters登録は可能か？（本人が録画できるか）
- [ ] リアル/アニメどちらのスタイルで作るか？

### 推奨方針
**Characters機能 + Storyboard**の組み合わせが最も一貫性を保てる

---

## Step 2: シーン1から生成

### Characters機能を使う場合

1. Soraアプリで社長本人がCharacter登録
2. 公開設定を「相互フォロワー」または「全員」に
3. sora.comでキャラクター選択 + プロンプト

**シーン1プロンプト案**:
```
@[character_name] running energetically on a Japanese city street,
side tracking shot, he accelerates with excitement,
morning sunlight, modern office buildings in background,
exits frame to the right, cinematic quality
```

### プロンプトのみの場合

**シーン1プロンプト案**:
```
Vertical 9:16, photorealistic, cinematic quality.
Side tracking shot of a young Japanese male CEO (20 years old)
wearing navy jacket and white t-shirt,
running energetically on a city street in Japanese business district.
He starts walking, then accelerates to running with excitement,
exits frame to the right.
Morning golden hour sunlight, modern office buildings in background.
Shallow depth of field, warm color grading.
```

---

## Step 3: クレジット計算

### Sora 2のクレジット消費

| 動画長 | 消費 |
|--------|------|
| 5秒 | 1動画分 |
| 10秒 | 2動画分 |
| 15秒 | 2動画分 |
| 20秒 | 4動画分 |
| 25秒 | 4動画分 |

### 48秒PVの場合（6シーン × 8秒）

| 方法 | 消費 |
|------|------|
| 6クリップ × 10秒 | 12動画分 |
| リテイク2倍 | 24動画分 |

---

## Google Flow vs Sora 2 比較（検証予定）

| 項目 | Google Flow | Sora 2 |
|------|-------------|--------|
| 人物画像使用 | フレームから動画で可能 | Characters機能必須 |
| 人物一貫性 | Nano Bananaで高精度 | Characters or プロンプト |
| 1クリップ最大長 | 8秒 | 25秒 |
| クレジット消費 | 10cr/回（Veo 2 Fast） | 2-4動画分/回 |
| 音声 | Veo 3で生成可能 | なし |
| 連結機能 | SceneBuilder | Stitch（最大60秒） |

---

## 進捗状況

### 完了
- [x] HANDOFF作成（2025-12-24）

### 次のタスク
- [ ] 方針決定（Characters or プロンプト or アニメ）
- [ ] シーン1生成
- [ ] 全シーン生成
- [ ] Stitchで連結
- [ ] BGM追加（Suno）
- [ ] Canvaで仕上げ
- [ ] Google Flow版との比較まとめ

---

## 素材（Google Flow版からの参照）

### 宣材写真
- `/mnt/c/Users/tench/Downloads/LINE WORKS/宣材写真　胸↑.jpg`

### Nano Banana生成画像
- `public/google-flow/module-03-running.jpeg`
- `public/google-flow/module-03-meeting-smile.jpeg`
- `public/google-flow/module-03-handshake.jpeg`
- `public/google-flow/module-03-meeting-discussion.jpeg`
- `public/google-flow/module-03-team-walking.jpeg`

### 完成品（Google Flow版）
- `public/google-flow/module-05-complete-pv.mp4`

---

## 参考リンク

- [Sora公式](https://sora.com/)
- [Creating videos with Sora | OpenAI Help Center](https://help.openai.com/en/articles/12460853-creating-videos-with-sora)
- [Generating content with characters | OpenAI Help Center](https://help.openai.com/en/articles/12435986-generating-content-with-characters)

---

**最終更新**: 2025-12-24 22:00
