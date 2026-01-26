# HANDOFF: バズるショート動画講座の整理

**このファイルを最初に読んでください。**

**緊急度**: 高
**前セッションの問題**: Claude が指示を正しく理解せず、何度も間違った方向に進んだ

---

## 本筋のHANDOFF（必読）

このファイルを読む前に、以下の本筋HANDOFFを先に読むこと：

1. **`content/HANDOFF-reel-kata.md`** - リールの型定義（動画の型と台本の型）
2. **`content/HANDOFF-premiere-pro-ranking-reel.md`** - Premiere Proランキングリール制作（Phase A + Phase Bの全体フロー）
3. **`docs/archive/ranking-reel-script-guide.md`** - ランキングリール台本作成ガイド（22ステップ）

---

## 現在の問題（未解決）

### 問題1: カテゴリ構造がごちゃごちゃ

`premiere-pro-ranking-reel` が2箇所に登録されている：

1. `adobe-premiere-pro/_category.json` の subcourses（正しい場所）
2. `short-video-creation/_category.json` の subcourses（間違って追加された）

### 問題2: モジュール内容がランキングリールに限定されている

`premiere-pro-ranking-reel` の子講座名を「爆速で動画を作成する時短術」に変更したが、**モジュールの実際の内容**はランキングリール専用のまま：

- Module 01: プロダクション機能でセットアップ
  - トラック構造が完全にランキングリール用（V9: No1, V8: No2... V5: 論外）
  - 字幕スタイル名「リール_論外_赤字」
  - シーケンス名「テンプレート_ランキング」

- Module 02: スクリプトで素材を自動配置する
  - `place_ranking_images.jsx`（ランキング専用スクリプト）
  - `generate_placement_json.py`（SRT→ランキング配置データ）
  - 「毎回のランキングリール制作フロー」

→ **Adobe Premiere Pro講座の「時短術」として破綻している**

### 問題3: 比較が未完了

ユーザーの指示（①〜④のケース分類）に基づく比較ができていない：

```
①完全にAdobePremiaPro講座にある講座の内容と一致している → 唯一この場合のみ削除可能
②AdobePremiaPro講座と多少重複している部分がある → どこがどのように差分があったりギャップがあるのか正確に確実に把握 その上でどうするか検討する
③どちらかが虚偽内容、劣化版 → どちらをどう残すか検討
④全く違う内容 → どうするかからもはや検討
```

**やるべきだったこと**:
- viral-ranking-video のモジュール内容
- premiere-pro-ranking-reel のモジュール内容

これらを比較して、重複・差分・ギャップを正確に把握する

---

## 現在のファイル構造

### カテゴリ構造

```
バズるショート動画講座（short-video-creation）← 新規作成した親カテゴリ
└── subcourses:
    ├── viral-ranking-video（ランキングリール）← 正しい
    └── premiere-pro-ranking-reel ← 間違い、削除すべき（ただし内容比較後）

Adobe Premiere Pro講座（adobe-premiere-pro）
└── subcourses:
    └── premiere-pro-ranking-reel（爆速で動画を作成する時短術）← 正しい場所
```

### 関連ファイル

| ファイル | 内容 |
|----------|------|
| `content/modules/short-video-creation/_category.json` | 新規作成した親カテゴリ |
| `content/modules/viral-ranking-video/_category.json` | ランキングリール講座（parentCategory: short-video-creation） |
| `content/modules/viral-ranking-video/module-01-overview.md` | 概要（frontmatter追加済み） |
| `content/modules/viral-ranking-video/module-02-script-creation.md` | 台本作成フロー（frontmatter追加済み） |
| `content/modules/premiere-pro-ranking-reel/_category.json` | 時短術（parentCategory: adobe-premiere-pro） |
| `content/modules/premiere-pro-ranking-reel/module-01-production-setup.md` | プロダクション機能セットアップ（frontmatter追加済み） |
| `content/modules/premiere-pro-ranking-reel/module-02-practical-workflow.md` | スクリプト自動配置（frontmatter追加済み） |
| `content/modules/adobe-premiere-pro/_category.json` | Adobe Premiere Pro講座 |

---

## このセッションで完了したこと

1. ✅ 新しい親カテゴリ `short-video-creation`（バズるショート動画講座）を作成
2. ✅ `viral-ranking-video` の parentCategory を `short-video-creation` に変更
3. ✅ 4つのモジュールに frontmatter を追加（★★★表示問題の修正）
4. ✅ `premiere-pro-ranking-reel` のタイトルを「爆速で動画を作成する時短術」に変更
5. ✅ description を「動画制作のワークフローを効率化し、制作時間を大幅に短縮する」に変更

---

## 次のセッションでやるべきこと

### 1. モジュール内容の比較（最優先）

以下のファイルを読んで比較する：

**viral-ranking-video のモジュール:**
- `content/modules/viral-ranking-video/module-01-overview.md`
- `content/modules/viral-ranking-video/module-02-script-creation.md`

**premiere-pro-ranking-reel のモジュール:**
- `content/modules/premiere-pro-ranking-reel/module-01-production-setup.md`
- `content/modules/premiere-pro-ranking-reel/module-02-practical-workflow.md`

→ 重複・差分・ギャップを正確に把握し、①〜④のどのケースに該当するか判断

### 2. short-video-creation から premiere-pro-ranking-reel を削除（比較後）

`content/modules/short-video-creation/_category.json` の subcourses から削除

### 3. モジュール内容の汎用化を検討

premiere-pro-ranking-reel のモジュールがランキングリール専用になっている問題を解決：
- 汎用化する
- または、ランキングリール専用部分を viral-ranking-video に移動

### 4. 講座構成を設計（22ステップをモジュール化）

`docs/archive/ranking-reel-script-guide.md` の22ステップを viral-ranking-video のモジュールとして講座化

---

## 元々やりたかったこと

ランキングリール制作の講座を完成させる：

1. **Phase A: 台本作成**（22ステップ）→ viral-ranking-video で講座化
2. **Phase B: Premiere Pro制作** → viral-ranking-video の最終モジュールで「参照」しつつフローを説明

詳細は以下を参照：
- `content/HANDOFF-premiere-pro-ranking-reel.md`
- `content/HANDOFF-reel-kata.md`
- `docs/archive/ranking-reel-script-guide.md`

---

## 絶対ルール

### やってはいけないこと

1. **脳死で削除しない** - 内容を確認してから判断
2. **メタデータだけ見て判断しない** - 実際のモジュール内容（.mdファイル）を読む
3. **刹那的に反応しない** - ユーザーの指示の本質を理解してから行動

### やるべきこと

1. **このHANDOFFを最初に読む**
2. **モジュールの実際の内容を比較する**（①〜④のケース分類に従う）
3. **作業後はこのHANDOFFを更新する**

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2026-01-24 | 初版作成（緊急引き継ぎ） |

---

**最終更新**: 2026-01-24
**状態**: 未解決の問題あり、次セッションで継続
