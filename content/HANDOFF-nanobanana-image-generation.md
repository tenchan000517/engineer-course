# HANDOFF: Nanobanana画像生成講座

**総合HANDOFF**: `content/HANDOFF-nanobanana-x-master.md` を先に読んでください。

---

## 概要

Gemini APIを使った画像生成（Nanobanana / Nano Banana Pro）の講座。

## 現在のステータス

| 項目 | 状態 | 備考 |
|------|------|------|
| Module 01（概要） | **完了** | 2025-12-27 |
| Module 02（環境構築） | **完了** | 2025-12-27、スクショ6枚 |
| Module 03（基本的な画像生成） | **完了** | 2025-12-27 |
| Module 04（応用編） | **次のタスク** | 検証が必要（アスペクト比、参照画像） |
| Module 05（マンガ生成システム） | 未着手 | - |
| Module 06（Nano Banana Pro） | 未着手 | 検証必要 |

## 講座構成

```
content/modules/nanobanana-image-generation/
├── _category.json
├── module-01-overview.md           # 概要・Nanobananaとは
├── module-02-setup.md              # 環境構築（google-genai SDK）
├── module-03-basic-generation.md   # 基本的な画像生成
├── module-04-advanced.md           # 応用（参照画像、アスペクト比）
├── module-05-manga-system.md       # マンガ生成システム
└── module-06-pro.md                # Nano Banana Pro（検証後追加）
```

| Module | 内容 | 備考 |
|--------|------|------|
| 01 | 概要・Nanobananaとは | モデル比較含む |
| 02 | 環境構築 | APIキー取得、SDK移行 |
| 03 | 基本的な画像生成 | シンプルなプロンプトから |
| 04 | 応用編 | 参照画像、パラメータ |
| 05 | マンガ生成システム | instagram-manga-generator統合 |
| 06 | Nano Banana Pro | 検証しながら作成 |

## 参照プロジェクト

**instagram-manga-generator** (`C:\instagram-manga-generator`)

### 技術スタック（現状）

| 項目 | 現状 | 備考 |
|------|------|------|
| SDK | `google-generativeai` | **※EOL済み → `google-genai` に移行必要** |
| モデル | `gemini-2.5-flash-image-preview` | Nano Banana |
| フレームワーク | なし（直接API呼び出し） | シンプルな構成 |

### システムフロー

```
簡易YAML → expand_story.py → 完全YAML → generate_from_yaml.py → Nanobanana API → 画像
                                                ↑
                                        参照画像（キャラ、レイアウト）
```

### 主要ファイル

| ファイル | 役割 | 行数 |
|----------|------|------|
| `scripts/generate_from_yaml.py` | 画像生成の核心 | 341行目: モデル指定 |
| `scripts/expand_story.py` | YAML展開 | - |
| `templates/character_templates.yaml` | キャラクター定義 | - |

## モデル比較

| 項目 | Nano Banana | Nano Banana Pro |
|------|-------------|-----------------|
| モデルID | `gemini-2.5-flash-image` | `gemini-3-pro-image-preview` |
| 最大解像度 | 1024px | 4096px (4K) |
| Thinking機能 | なし | あり |
| Search grounding | なし | あり |
| 価格 | ~$0.039/枚 | $0.134 (1K/2K), $0.24 (4K) |
| ステータス | Stable | Preview |

※ `gemini-2.5-flash-image-preview` は2025年10月31日で廃止済み

## SDK移行について

### 旧SDK（EOL）
```python
import google.generativeai as genai
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash-image")
response = model.generate_content([prompt])
```

### 新SDK
```python
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents="プロンプト",
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(aspect_ratio="1:1")
    )
)
```

## ImageConfigパラメータ

```python
types.ImageConfig(
    aspect_ratio="16:9",  # 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
    image_size="2K"       # 1K, 2K, 4K (Proのみ)
)
```

## 連携講座

- **X自動投稿講座**: Module 06で画像付き投稿を実装する際にこの講座を参照

## 次のアクション

1. [x] Module 01 概要の作成（2025-12-27完了）
2. [x] google-genai SDKでの動作検証（2025-12-27完了）
3. [x] Module 02 環境構築の作成（2025-12-27完了）
4. [x] Module 03 基本的な画像生成の作成（2025-12-27完了）
5. [ ] **Module 04 応用編の作成** ← 次のタスク（検証必要）
6. [ ] Nano Banana Proの検証
7. [ ] Module 05 マンガ生成システムの作成
8. [ ] Module 06 Proモジュールの作成

### Module 04作成前に必要な検証

**重要**: 応用編は「完全コントロール」と「再現性」が目的。表面的な応用編は不要。

**リサーチドキュメント**: `content/RESEARCH-nanobanana-pro-advanced.md`

**詳細な検証項目**: `content/HANDOFF-nanobanana-x-master.md` の「検証が必要なユースケース」を参照

**最重要: マンガ生成**

このプロジェクトは `C:\instagram-manga-generator` から始まった。マンガ生成が最重要ユースケース。

| カテゴリ | 参照ファイル |
|----------|-------------|
| マンガ生成 | `instagram-manga-generator/scripts/generate_from_yaml.py` |
| キャラクター一貫性 | `instagram-manga-generator/templates/character_templates.yaml` |
| レイアウト制御 | `instagram-manga-generator/templates/layout_patterns.yaml` |

**その他カテゴリ**:

| 分類 | カテゴリ |
|------|----------|
| 基本制御 | キャラクター制御、背景制御、部分編集、テキスト制御、人物生成 |
| コンテンツ種別 | バナー、サムネイル、広告クリエイティブ、ロゴ/アイコン、商品画像、SNS投稿画像 |
| 図解種別 | フローチャート、組織図、タイムライン、比較表、マインドマップ、インフォグラフィック、ステップバイステップ |
| その他 | UI/UXモックアップ、プレゼン資料用画像、地図/マップ表現、建築/インテリア、プロダクトデザイン |
| 統合 | 複合ユースケース |

## 参考リンク

- [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation)
- [Nano Banana Guide](https://ai.google.dev/gemini-api/docs/nanobanana)
- [Gemini 3 Pro Image - DeepMind](https://deepmind.google/models/gemini-image/pro/)
- [google-genai PyPI](https://pypi.org/project/google-genai/)

---

**最終更新**: 2025-12-27（Module 01-03完了、Module 04検証待ち）
**担当**: AI Assistant
