# 講座開発ガイドライン

このドキュメントは、Claude Codeを使ったチーム開発（セッション間の引き継ぎ）を可能にするためのガイドラインです。

---

## 開発フロー概要

```
┌─────────────────────────────────────────────────────────────┐
│                    講座開発サイクル                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. course-outline.md     →  講座の計画・構成を定義          │
│          ↓                                                  │
│  2. 各モジュール作成       →  content/modules/ に作成        │
│          ↓                                                  │
│  3. progress-report.md    →  進捗を記録                     │
│          ↓                                                  │
│  4. HANDOFF-[topic].md    →  次のセッションへ引き継ぎ        │
│          ↓                                                  │
│  5. 次のセッションで継続   →  HANDOFFを読んで作業再開        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 必須ドキュメント

### 1. `course-outline.md`（講座アウトライン）

**場所**: `docs/` または `content/`
**目的**: 講座全体の構成と各モジュールの詳細を定義

```markdown
# 講座名

## 全体進捗
**作成状況**: X/Y 完了 (Z%)

## モジュール構成

### モジュール1: タイトル (所要時間)
- [ ] セクション1
- [ ] セクション2
...
```

### 2. `progress-report-YYYY-MM-DD.md`（進捗レポート）

**場所**: `docs/`
**目的**: 作業完了状況と統計を記録

```markdown
# 作業完了報告

**作成日**: YYYY-MM-DD
**作成者**: Claude Code (N代目)

## 完成状況
- ✅ 完了項目
- ⏳ 進行中
- ❌ 未着手

## 次のアクション
1. ...
2. ...
```

### 3. `HANDOFF-[topic].md`（引き継ぎドキュメント）

**場所**: プロジェクトルート または `content/`
**目的**: セッション間でコンテキストを引き継ぐ

```markdown
# [トピック] 引き継ぎ資料

**作成日**: YYYY-MM-DD
**作成済み**: 完了したファイル一覧

## 次に作成すべき講座
...

## 重要な情報
...

## 参考リンク
...
```

---

## ディレクトリ構造

```
engineer-course/
├── CONTRIBUTING.md          # このファイル
├── HANDOFF-*.md             # 引き継ぎドキュメント（トピック別）
├── content/
│   ├── modules/
│   │   ├── [category]/      # カテゴリ別フォルダ
│   │   │   ├── _category.json
│   │   │   └── module-XX-*.md
│   │   └── ...
│   └── HANDOFF-*.md         # カテゴリ別の引き継ぎ
├── docs/
│   ├── course-outline.md    # 現在の計画書
│   ├── progress-report-*.md # 進捗レポート
│   └── archive/             # 過去のドキュメント
└── public/
    └── [category]/          # 画像アセット
```

---

## 新しい講座を追加する手順

### 1. カテゴリフォルダを作成

```bash
mkdir content/modules/[category-name]
```

### 2. `_category.json` を作成

```json
{
  "id": "category-name",
  "title": "講座タイトル",
  "description": "講座の説明",
  "icon": "rocket",
  "color": "purple",
  "order": 1,
  "tags": {
    "language": ["javascript"],
    "framework": ["nextjs"],
    "editor": ["vscode"],
    "platform": ["windows", "mac", "linux"],
    "level": "beginner",
    "topics": ["web-development"]
  },
  "moduleCount": 1
}
```

### 3. モジュールファイルを作成

```markdown
# モジュールタイトル

**所要時間**: XX-XX分
**難易度**: ⭐☆☆☆☆

---

## このモジュールで学ぶこと
...

## 学習目標
...

## セクション1: タイトル
...

## まとめ
...
```

### 4. 画像アセットを配置

```bash
mkdir public/[category-name]
# 画像を配置
```

### 5. 引き継ぎドキュメントを作成

```bash
# 作業途中で中断する場合
touch content/HANDOFF-[category-name].md
```

---

## セッション開始時のチェックリスト

新しいセッションを開始する際は、以下を確認してください：

1. [ ] `HANDOFF-*.md` を読んで現状を把握
2. [ ] `docs/progress-report-*.md` で進捗を確認
3. [ ] `content/modules/` の構造を確認
4. [ ] 作業開始前に `git status` で変更を確認

---

## セッション終了時のチェックリスト

セッションを終了する際は、以下を実行してください：

1. [ ] 作業内容を `HANDOFF-*.md` に記録
2. [ ] 必要に応じて `progress-report-*.md` を更新
3. [ ] `npx tsc --noEmit` で型チェック
4. [ ] `git add . && git commit` で変更をコミット
5. [ ] `git push` でリモートにプッシュ

---

## アイコン一覧

`_category.json` の `icon` フィールドで使用可能：

| icon | 用途 |
|------|------|
| `briefcase` | ポートフォリオ、ビジネス系 |
| `rocket` | AI、先進技術系 |
| `workflow` | 自動化、ワークフロー系 |

## カラー一覧

`_category.json` の `color` フィールドで使用可能：

| color | 用途 |
|-------|------|
| `blue` | メイン、Web開発 |
| `purple` | AI、先進技術 |
| `orange` | 自動化、ツール |
| `green` | 初心者向け |

---

## 過去のドキュメント

過去の計画書や進捗レポートは `docs/archive/` に保存されています。

---

**最終更新**: 2025-12-02
