# Instagram投稿企画生成ガイド

## トリガー

「Instagram投稿企画を作成して」「今月の投稿ネタを生成して」

---

## 役割分担

- **Antigravity**: データ収集（タイトル、ツール名抽出、カテゴリ分類）
- **Claude Code**: 正規化、トレンドランキング、投稿生成、ブラッシュアップ、品質チェック

---

## Antigravity出力フォルダ

**場所**: `/mnt/c/Instagram_AI/YYYYMMDD_XX/`

**特定方法**:
- ユーザーから指定がある場合 → 指定のフォルダ
- 指定がない場合 → `/mnt/c/Instagram_AI/` 内の最新フォルダ
- 同じ日付で複数ある場合（_01, _02, _03...） → 連番が最も大きいもの

**ファイル構造**:

| ファイル名 | 生成 | 内容 |
|------------|------|------|
| step1_influencer_data.json | Antigravity | データ収集結果（入力） |
| step2_normalized_tools.json | Claude Code | 正規化ツール一覧（出力） |
| step2_trend_ranking.json | Claude Code | トレンドランキング（出力） |
| instagram_ideas.json | Claude Code | ブラッシュアップ済み投稿アイデア（出力） |

---

## フロー

### ステップ1: Antigravityでワークフロー実行

1. Antigravityのエージェントを開く
2. InstagramAIフォルダを開く
3. `@instagram_workflow_v10.md` をメンションし実行する
4. 出力: `step1_influencer_data.json`

---

### ステップ2: Claude Codeで正規化

`docs/workflows/step2_normalization.md` に従い実行

1. `step1_influencer_data.json` を読み込む
2. mentioned_tools の正規化（表記揺れ統一、社名削除、バージョン保持）
3. display_name の決定（インフルエンサー最多使用表記）
4. 出力: `step2_normalized_tools.json`, `step2_trend_ranking.json`

---

### ステップ3: Claude Codeで投稿生成・ブラッシュアップ

`docs/workflows/step3_brushup.md` に従い実行

**原則: 一括処理禁止、1アイデアずつ丁寧に**

1. step2のトレンドランキングを元に32件の投稿を生成
2. 各アイデアをリサーチ結果と照合
3. フォーマット制約・禁止ワードチェック
4. カテゴリ別ルールに従い修正
5. ID並び替え（カテゴリ分散）
6. 出力: `instagram_ideas.json`

---

### ステップ4: GASでスプレッドシートへ

1. JSONを分割してconfigシートに貼り付け
2. GASメニューで追加・振り分け実行

---

## 参照

- Antigravityワークフロー: `/mnt/c/Instagram_AI/.agent/workflows/instagram_workflow_v10.md`
- 正規化ルール: `docs/workflows/step2_normalization.md`
- ブラッシュアップルール: `docs/workflows/step3_brushup.md`
