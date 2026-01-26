# HANDOFF完了状態マッピング

## 分類定義

- **完了A**: モジュール化されている（content/modules/配下に講座存在）
- **完了B**: ガイド化されている（content/guides/配下にガイド存在）
- **完了C**: A + B 両方完了 → **アーカイブ可能**

---

## マッピング結果

### 完了C（モジュール + ガイド両方あり）→ アーカイブ可能

| HANDOFF | モジュール | ガイド | 状態 |
|---------|----------|--------|------|
| `HANDOFF-premiere-pro-ranking-reel.md` | `premiere-pro-ranking-reel/` | `ranking-reel-script-guide.md` | **完了C** |

### 完了A（モジュールのみ）

| HANDOFF | モジュール | ガイド必要? | 状態 |
|---------|----------|------------|------|
| `HANDOFF-n8n.md` | `n8n/` | 不要 | **完了A** |
| `HANDOFF-n8n-advanced.md` | `n8n-advanced/` | 不要 | **完了A**（Module10-11除く） |
| `HANDOFF-n8n-x-auto-post.md` | `n8n-x-auto-post/` | 不要 | **完了A** |
| `HANDOFF-antigravity.md` | `antigravity/` | 不要 | 完了A（Module05以降残） |
| `HANDOFF-suno.md` | `suno/`, `suno-beginner/`, `suno-intermediate/` | 不要 | 完了A（一部検証残） |
| `HANDOFF-sora2.md` | `sora2/`, `sora2-basics/` | 不要 | **完了A** |
| `HANDOFF-sora2-advanced.md` | `sora2-advanced/` | 不要 | **完了A** |
| `HANDOFF-sora2-pv.md` | `sora2/` | 不要 | **完了A**（PV部分） |
| `HANDOFF-kling.md` | `kling/`, `kling-basics/` | 不要 | **完了A** |
| `HANDOFF-google-flow.md` | `google-flow/`, `google-flow-basics/` | 不要 | **完了A** |
| `HANDOFF-nanobanana-image-generation.md` | `nanobanana-image-generation/`, `nanobanana-beginner/` | 不要 | 完了A（Module04-06残） |
| `HANDOFF-instagram-dm-automation.md` | `instagram-dm-automation/` | 不要 | 完了A（スクショ待ち） |
| `HANDOFF-instagram-gift-post.md` | `instagram-gift-post/` | 不要 | 完了A（E2E残） |
| `HANDOFF-adobe-premiere-pro.md` | `adobe-premiere-pro/` | 不要 | 完了A（AI機能残） |
| `HANDOFF-post-research.md` | `post-research/` | 不要 | **完了A** |
| `HANDOFF-lineworks-calendar-sync.md` | （特典ページ） | 不要 | **完了A** |

### 完了B（ガイドのみ）

| HANDOFF | ガイド | モジュール必要? | 状態 |
|---------|--------|----------------|------|
| `HANDOFF-reel-kata.md` | `ranking-reel-script-guide.md` | 必要（アフレコ等） | 完了B |
| `HANDOFF-afreco-reel.md` | `scripts-voiceover-reels.md` | 必要 | 完了B（台本サンプル残） |
| `HANDOFF-gift-content-selection.md` | （参照ガイド） | 不要 | **完了B** |

### 未完了（モジュールもガイドもなし or 進行中）

| HANDOFF | 状況 | 次のアクション |
|---------|------|----------------|
| `HANDOFF-reel-patterns.md` | 定義のみ | アフレコリール講座実装 |
| `HANDOFF-sns-auto-gift.md` | 進行中 | Module03 + 台本11本 |
| `HANDOFF-MASTER.md` | 計画書 | Module10-11実装 |
| `HANDOFF-content-quality.md` | 進行中 | 品質検証 |
| `HANDOFF-category-k-rename.md` | 設定変更 | 実行待ち |
| `HANDOFF-flow-kling-comparison.md` | 待機 | 比較モジュール作成 |
| `HANDOFF-instagram-tokuten-research.md` | 継続収集 | ユーザー待ち |

### セッション記録（アーカイブ可能）

| HANDOFF | 状態 |
|---------|------|
| `HANDOFF-module-06-session*.md` (7ファイル) | セッション記録→アーカイブ可 |
| `HANDOFF-module-08-session*.md` (3ファイル) | セッション記録→アーカイブ可 |
| `HANDOFF-reel-kata-session-20260123.md` | セッション記録→アーカイブ可 |

### マスター/進捗管理系（保持推奨）

| HANDOFF | 状態 |
|---------|------|
| `HANDOFF-MASTER.md` | マスター計画書→保持 |
| `HANDOFF-PROGRESS-TRACKER.md` | 進捗管理→保持（または統合） |

### その他完了/保留

| HANDOFF | 状態 |
|---------|------|
| `HANDOFF-n8n-loop-issue.md` | 解決済み→アーカイブ可 |
| `HANDOFF-nanobanana-carousel-future.md` | 将来計画→保持 or アーカイブ |
| `HANDOFF-nanobanana-pro-x-images.md` | 完了→アーカイブ可 |
| `HANDOFF-nanobanana-x-master.md` | 完了→アーカイブ可 |
| `HANDOFF-x-advanced.md` | 保留→アーカイブ可 |
| `HANDOFF-yumemaga-automation.md` | 完了→アーカイブ可 |
| `HANDOFF-yumemaga-progress-system.md` | ほぼ完了→アーカイブ可 |
| `HANDOFF-yumesuta-partner.md` | 保留→アーカイブ可 |
| `HANDOFF-module-10-stories.md` | MASTER統合→アーカイブ可 |
| `HANDOFF-module-11-crosspost.md` | MASTER統合→アーカイブ可 |
| `HANDOFF-module-insights.md` | 完了→アーカイブ可 |

---

## アーカイブ対象リスト（確定）

以下は **完了C** または **セッション記録** または **完全完了** のためアーカイブ可能:

```
# 完了C
HANDOFF-premiere-pro-ranking-reel.md  ※ただし運用中のため起動術式から参照

# 完了A（モジュール完成・追加タスクなし）
HANDOFF-n8n.md
HANDOFF-n8n-x-auto-post.md
HANDOFF-sora2.md
HANDOFF-sora2-advanced.md
HANDOFF-sora2-pv.md
HANDOFF-kling.md
HANDOFF-google-flow.md
HANDOFF-post-research.md
HANDOFF-lineworks-calendar-sync.md

# 完了B
HANDOFF-gift-content-selection.md

# セッション記録
HANDOFF-module-06-session.md
HANDOFF-module-06-session2.md
HANDOFF-module-06-session3.md
HANDOFF-module-06-session4.md
HANDOFF-module-06-session5.md
HANDOFF-module-06-session6.md
HANDOFF-module-06-session7.md
HANDOFF-module-08-session8.md
HANDOFF-module-08-session9.md
HANDOFF-module-08-session10.md
HANDOFF-reel-kata-session-20260123.md

# 解決済み/統合済み
HANDOFF-n8n-loop-issue.md
HANDOFF-module-10-stories.md
HANDOFF-module-11-crosspost.md
HANDOFF-module-insights.md
HANDOFF-nanobanana-pro-x-images.md
HANDOFF-nanobanana-x-master.md
HANDOFF-yumemaga-automation.md
HANDOFF-yumemaga-progress-system.md

# 保留（やる予定なし）
HANDOFF-x-advanced.md
HANDOFF-yumesuta-partner.md
HANDOFF-nanobanana-carousel-future.md
HANDOFF-flow-kling-comparison.md
```

**合計: 約30ファイル**

---

## アクティブとして残すもの

```
# 起動術式登録済み（運用中）
HANDOFF-premiere-pro-ranking-reel.md
HANDOFF-reel-kata.md
HANDOFF-instagram-tokuten-research.md

# 進行中（次アクションあり）
HANDOFF-afreco-reel.md
HANDOFF-reel-patterns.md
HANDOFF-sns-auto-gift.md
HANDOFF-suno.md
HANDOFF-adobe-premiere-pro.md
HANDOFF-content-quality.md
HANDOFF-nanobanana-image-generation.md
HANDOFF-antigravity.md
HANDOFF-category-k-rename.md
HANDOFF-instagram-dm-automation.md
HANDOFF-instagram-gift-post.md

# マスター/計画
HANDOFF-MASTER.md
HANDOFF-n8n-advanced.md（Module10-11へのポインタとして）
```
