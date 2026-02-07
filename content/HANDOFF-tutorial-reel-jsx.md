# HANDOFF: 解説リールJSX自動配置

**作成日**: 2026-02-03
**最終更新**: 2026-02-07
**ステータス**: 基本機能完成、サイズ・位置調整が次のタスク

---

## 背景

解説リール（チュートリアル形式）のPremiere Pro自動配置システムを構築中。
`create_tutorial_srt.py` で `placement.json` を生成し、`place_ranking_images.jsx` で配置する。

---

## 解決済みの問題

### ✅ 終了タイミング問題（2026-02-07解決）

**症状**: ナレーションが終わっていないのに、映像要素が先に終了

**原因**: placement.jsonの事前計算値（42.6秒）と実際のA1終了時間（43.23秒）に差があった

**解決方法**:
- JSXで全配置完了後、A1（ナレーション）の実際の終了時間を取得
- V1, V7, V14, A3の最後のクリップをその時間まで延長
- `extendTracksToEndTime()`関数を追加

```javascript
var actualEndTime = getTrackEndTime(seq.audioTracks[0]);  // A1
extendTracksToEndTime(seq, actualEndTime);
```

---

### ✅ 音量設定問題（2026-02-07解決）

**症状**: BGMが無音、SEが効かない

**原因**: Premiere Proの音量はdBではなくリニアスケール（1.0 = 0dB）

**解決方法**: dB→リニア変換関数を追加

```javascript
function dbToLinear(db) {
    return Math.pow(10, db / 20);
}
// -8dB → 0.398, -10dB → 0.316
```

---

### ✅ フック動画の重複（2026-02-07解決）

**症状**: hook_audio配置時に映像もV2に自動追加される

**解決方法**:
- `removeVideoClipAtTime()`で全ビデオトラックをチェック
- V3（意図的に配置したhook_video）は除外

```javascript
removeVideoClipAtTime(seq, startTime, VIDEO_TRACK_MAP["V3"]);
```

---

### ✅ フック動画の音声

**対応**: フック動画の音声をA2に配置（hook_audio type追加）

### ✅ BGMの開始タイミング

**対応**: BGMを5秒後（フック後）から開始

### ✅ CTAトリガー画像の終了

**対応**: trigger.pngのdurationをtotal_durationまで延長

### ✅ ui_03追加

**対応**: セグメント4にui_03.pngを追加（V8トラック）

### ✅ 完成動画の冒頭表示

**対応**: completion_introを5.0秒（フック後）〜18.2秒に配置

### ✅ ファイル選択ダイアログ

**対応**: JSX実行時にplacement.jsonを選択するダイアログを追加

---

## 未解決の問題

### ① サイズ・位置の設定

**症状**: 各要素のサイズと位置が未定義

**次のアクション**:
- 各要素（UI、trigger、completion等）のscale, x, yを定義
- placement.jsonに追加
- JSXで`setClipMotion()`を使用して適用

---

### ② BGMフェードイン・フェードアウト

**症状**: BGMの開始・終了が突然で不自然

**要望**:
- フェードイン（開始時に徐々に音量上げる）
- フェードアウト（終了時に徐々に音量下げる）

**次のアクション**:
- Premiere Pro ExtendScriptでキーフレームを追加する方法を調査

---

## 現在のファイル構成

### Python

| ファイル | 役割 |
|---------|------|
| `scripts/create_tutorial_srt.py` | SRT + placement.json生成 |

### JSX

| ファイル | 役割 |
|---------|------|
| `scripts/premiere/place_ranking_images.jsx` | Premiere Pro自動配置 |

### 対応type一覧

| type | 処理関数 | 用途 |
|------|----------|------|
| shared | placeMedia | 共有素材（BGM等） |
| hook_video | placeHookVideo | フック動画（音声削除） |
| hook_audio | placeHookAudio | フック音声（A2） |
| avatar_video | placeAvatarVideo | アバター動画 |
| completion | placeMedia | 完成動画 |
| ui | placeMedia | UI静止画 |
| trigger | placeMedia | トリガー静止画 |
| se | placeSoundEffect | 効果音 |
| narration | placeNarration | ナレーション |

---

## 配置順序

```
1. telop_back (V14)
2. hook_video (V3) + hook_audio (A2)
3. completion_intro (V6, 5.0秒〜)
4. avatar_videos (V1)
5. BGM (A3)
6. UI静止画・completion・trigger (V4-V8)
7. SE (A4)
8. narration (A1) ← 最後
9. ★ A1終了時間に基づいて V1, V7, V14, A3 を延長
```

---

## テストプロジェクト

**パス**: `C:\Instagramショート\Instagram_Reels_Production\チュートリアル_モンスターASMR_2026-01-27\`

**素材**:
- hook.mp4, completion.mp4
- ui_01.png, ui_02.png, ui_03.png
- trigger.png
- audio_trimmed/*.mp3

---

## 参考: ランキングリールとの違い

| 項目 | ランキングリール | 解説リール |
|------|-----------------|------------|
| アバター動画 | loop: true, loop_until方式 | time, duration方式 |
| フック | 「論外」テキスト | 動画（hook.mp4） |
| BGM開始 | 0秒から | 5秒から（フック後） |
| SE | なし | decision, complete, typing |
| 話者 | 2声 | 1声 |
| 終了時間基準 | total_duration計算値 | A1実測値 |

---

## 次のタスク

1. **優先**: 各要素のサイズ・位置を定義
2. **追加機能**: BGMフェードイン・アウト
