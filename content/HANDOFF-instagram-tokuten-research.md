# HANDOFF: Instagram特典例リサーチ

**このファイルを最初に読んでください。**

---

## 絶対ルール

### やってはいけないこと

1. **特典内容を改変しない** - 共有された内容をそのまま保存
2. **勝手に分析・評価しない** - 保存のみに徹する
3. **古い収集リストを参照しない** - 必ずこのHANDOFFの最新版を確認

### やるべきこと

1. **このHANDOFFを最初に読む**
2. **収集済みリストを確認する**
3. **新しい特典を指定フォーマットで保存する**
4. **収集後にこのHANDOFFを更新する**

---

## プロジェクト概要

### 目的

他のInstagramアカウントの特典例を収集・保存し、自分の特典設計の参考資料とする。

### 保存先

```
docs/reference/instagram-tokuten/
```

**注意**: このディレクトリは `.gitignore` に登録済み（他者の特典内容のため非公開）

### 表示URL

```
/reference/instagram-tokuten                     → アカウント一覧
/reference/instagram-tokuten/{account}           → 特典一覧
/reference/instagram-tokuten/{account}/{tokuten} → 特典詳細
```

---

## 量産フロー

### 入力パターン

ユーザーからの入力は以下の2パターン：

#### パターン1: テキスト + ローカル画像

1. テキスト内容が共有される
2. 画像ファイルパスが共有される（`C:\Users\...`形式）
3. 画像をローカルにコピーし、相対パスで参照

#### パターン2: HTMLエレメント

1. noteなどのHTMLエレメントが共有される
2. HTMLをパースしてマークダウンに変換
3. 画像はURLをそのまま使用

### 保存手順

1. **アカウントディレクトリ確認**
   ```
   docs/reference/instagram-tokuten/{AccountName}/
   docs/reference/instagram-tokuten/{AccountName}/images/
   ```
   なければ作成

2. **連番確認**
   既存ファイルを確認し、次の連番を決定（`tokuten-01`, `tokuten-02`, ...）

3. **マークダウンファイル作成**
   下記フォーマットで保存

4. **画像保存**
   - ローカル画像: `images/` にコピー
   - URL画像: そのままURLを使用

5. **HANDOFF更新**
   収集済みリストに追記

---

## 保存フォーマット

### ファイル命名規則

```
tokuten-{連番2桁}-{識別子}.md
```

例:
- `tokuten-01-reels-6patterns.md`
- `tokuten-02-ai-hook-patterns.md`

### マークダウンテンプレート

```markdown
# 特典例 {連番}: {タイトル}

## 基本情報

| 項目 | 内容 |
|------|------|
| 収集日 | YYYY-MM-DD |
| アカウント | {アカウント名} |
| ジャンル | {ジャンル} |
| 特典形式 | {形式} |

---

## 特典内容

{ここに特典の文章をそのまま記載}

{画像は本文中の適切な位置に配置}

![説明](./images/01-xxx.webp)  ← ローカル画像の場合
![説明](https://example.com/xxx.png)  ← URL画像の場合
```

**重要**:
- `## 基本情報` セクションと `---` 区切りは必須（ページ表示時に自動除去される）
- `## 特典内容` ヘッダーも必須（ページ表示時に自動除去される）

### 画像の保存先（ローカルの場合）

```
docs/reference/instagram-tokuten/{AccountName}/images/
```

命名規則: `{連番}-{識別子}.{拡張子}`

---

## HTMLエレメント変換ルール

noteなどのHTMLエレメントが共有された場合の変換ルール：

| HTML | Markdown |
|------|----------|
| `<p>テキスト</p>` | そのままテキスト |
| `<strong>テキスト</strong>` | `**テキスト**` |
| `<h2>見出し</h2>` | `## 見出し` |
| `<h3>見出し</h3>` | `### 見出し` |
| `<img src="URL">` | `![説明](URL)` |
| `<pre><code>コード</code></pre>` | ` ```コード``` ` |
| `<hr>` | `---` |
| `<a href="URL">テキスト</a>` | `> テキスト - URL` または そのままテキスト+URL |
| `<figure>` 内の画像 | `![説明](URL)` |

---

## 収集済みリスト

### SakiSNS

| # | ファイル名 | 内容 | 画像 |
|---|-----------|------|------|
| 01 | tokuten-01-reels-6patterns.md | 伸びるリールの型6選 | 10枚(ローカル) |
| 02 | tokuten-02-ai-hook-patterns.md | バズるAIフックのパターン | 12枚(URL) |
| 03 | tokuten-03-ideal-self-instagram.md | 理想の自分を作ってインスタを伸ばす方法 | 12枚(URL) |
| 04 | tokuten-04-reel-gpts.md | リール作成GPTs | 1枚(URL) |
| 05 | tokuten-05-reel-gpts-howto.md | リール台本作成GPTsの使い方 | 6枚(URL) |

**合計: 5件**

### NatsumiAI

| # | ファイル名 | 内容 | 画像 |
|---|-----------|------|------|
| 01 | tokuten-01-ideal-self-instagram.md | 理想の自分でインスタを伸ばすヒミツ | 18枚(URL) |
| 02 | tokuten-02-ai-hook-patterns.md | バズるAIフックのパターンとその作り方 | 20枚(URL) |

**合計: 2件**

### pigu_gpt

| # | ファイル名 | 内容 | 画像 |
|---|-----------|------|------|
| 01 | tokuten-01-threads-affiliate-manual.md | AI×Threads完全解説マニュアル | 10枚(Notion内) |

**合計: 1件**

### mio_ai_insta

| # | ファイル名 | 内容 | 画像 |
|---|-----------|------|------|
| 01 | tokuten-01-akool-face-swap-guide.md | Akool完全ガイド（顔出しなしでインスタ発信） | 59枚+1動画(ローカル)+URL |
| 02 | tokuten-02-chatgpt-reel-script.md | 5ステップでできる！バズリール台本の作り方ガイド | 12枚(ローカル) |
| 03 | tokuten-03-stories-psychology.md | AI×心理学でバズる"5大テク"完全ガイド | 6枚+1動画(ローカル) |
| 04 | tokuten-04-overseas-ai-reel.md | 海外AI編集テク完全ガイド（ChatGPT×Genspark） | 13枚+2動画(ローカル) |
| 05 | tokuten-05-ai-reel-5steps.md | AI初心者向け！リールを最短で伸ばす5ステップ | 28枚(ローカル) |
| 06 | tokuten-06-reel-analysis-prompt.md | AIでリール構成をまるごと分析できる神プロンプト | 6枚(ローカル) |
| 07 | tokuten-07-dreamina-avatar.md | しゃべる"分身"が作れる！Dreamina完全ガイド | 10枚+1動画(ローカル) |
| 08 | tokuten-08-hedra-avatar.md | Hedraで作る超リアルな本格アバター動画完全ガイド | 18枚(ローカル) |
| 09 | tokuten-09-overseas-influencers.md | みおも参考にしてる海外インフルエンサー7選 | 9枚(ローカル) |
| 10 | tokuten-10-reel-layout-guide.md | バズりまくってる私が使うリールの構図ガイド | 3枚+1動画(ローカル) |

**合計: 10件**

---

## ファイル構造

```
docs/reference/instagram-tokuten/
├── SakiSNS/
│   ├── images/
│   │   ├── 01-intro.webp
│   │   ├── 01-ranking.webp
│   │   └── ...
│   ├── tokuten-01-reels-6patterns.md
│   └── tokuten-02-ai-hook-patterns.md
├── NatsumiAI/
│   ├── images/
│   └── tokuten-01-ideal-self-instagram.md
├── pigu_gpt/
│   ├── images/
│   └── tokuten-01-threads-affiliate-manual.md
└── mio_ai_insta/
    ├── images/
    ├── tokuten-01-akool-face-swap-guide.md
    ├── tokuten-02-chatgpt-reel-script.md
    ├── tokuten-03-stories-psychology.md
    ├── tokuten-04-overseas-ai-reel.md
    ├── tokuten-05-ai-reel-5steps.md
    ├── tokuten-06-reel-analysis-prompt.md
    ├── tokuten-07-dreamina-avatar.md
    ├── tokuten-08-hedra-avatar.md
    ├── tokuten-09-overseas-influencers.md
    └── tokuten-10-reel-layout-guide.md
```

---

## ページ実装ファイル

| ファイル | 役割 |
|----------|------|
| `lib/tokuten.ts` | 特典データ読み取りユーティリティ |
| `app/reference/instagram-tokuten/page.tsx` | アカウント一覧ページ |
| `app/reference/instagram-tokuten/[accountSlug]/page.tsx` | 特典一覧ページ |
| `app/reference/instagram-tokuten/[accountSlug]/[tokutenSlug]/page.tsx` | 特典詳細ページ |

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2025-01-20 | 初版作成 |
| 2025-01-20 | 量産フロー・HTMLエレメント変換ルール追加 |
| 2026-01-20 | mio_ai_insta追加（Akool完全ガイド） |
| 2026-01-20 | mio_ai_insta追加（バズリール台本の作り方ガイド） |
| 2026-01-20 | mio_ai_insta追加（AI×心理学5大テク） |
| 2026-01-20 | mio_ai_insta追加（海外AI編集テク） |
| 2026-01-20 | mio_ai_insta追加（AI初心者向け5ステップ） |
| 2026-01-20 | mio_ai_insta追加（リール構成分析プロンプト） |
| 2026-01-20 | mio_ai_insta追加（Dreamina分身ガイド） |
| 2026-01-20 | mio_ai_insta追加（Hedraアバターガイド） |
| 2026-01-20 | mio_ai_insta追加（海外インフルエンサー7選） |
| 2026-01-20 | mio_ai_insta追加（リールの構図ガイド） |

---

**最終更新**: 2026-01-20
**次のアクション**: ユーザーからの特典例共有を待つ
