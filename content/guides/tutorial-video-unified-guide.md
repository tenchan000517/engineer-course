# チュートリアル動画制作統合ガイド

「チュートリアル動画を作りたい」から**Premiere Pro F5実行**まで一気通貫で制作するための統合フロー。

```
リサーチRAG（バズる法則）× クセRAG（得意分野）
    ↓
台本 → 素材 → placement.json
    ↓
Premiere Pro F5 → 一撃完成
```

---

## クイックスタート

### トリガーフレーズ

以下のフレーズでこのガイドが自動参照される：
- 「チュートリアル動画を作りたい」
- 「解説リールを作りたい」
- 「チュートリアルリールを作りたい」
- 「〇〇の作り方動画を作りたい」

### 一撃制作フロー（概要）

```
Phase 1: テーマ決定      → 5分
Phase 2: 台本生成        → 10分
Phase 3: 素材準備        → 外部作業
Phase 4: 音声生成        → 自動（2分）
Phase 5: SRT/JSON生成    → 自動（1分）
Phase 6: Premiere Pro F5 → 自動（30秒）
```

---

## Phase 1: テーマ決定

### Step 1: テーマ選択肢の提示

Claude Codeが以下を確認する：

#### 1.1 得意ジャンルから選択

```
得意ジャンル（engineer-mindset-rag.md参照）:
1. AI動画自動生成（Sora 2, KLING, Nano Banana, 衝撃映像）
2. SNS自動運用（n8n, 自動投稿, ワークフロー）
3. 音声合成（Fish Audio, Whisper, ナレーション）
4. 複雑ワークフロー設計（API連携, 条件分岐）
5. 自分のテーマを入力
```

#### 1.2 使用ツールの確認

| 確認項目 | 入力例 |
|----------|--------|
| ツール名 | Nano Banana, KLING |
| 種類 | プロンプト系 or 手順系 |
| 用途 | モンスター画像生成, ASMR動画化 |

#### 1.3 訴求タイプの選択

```
訴求タイプ（sns-ai-trend-research-2026-02.md参照）:
1. バズ系 - 「海外でバズってる」「100万再生狙える」
2. 収益系 - 「月○万円稼げる」「副業で稼ぐ」
3. 効率化系 - 「作業時間90%削減」「自動化」
4. スキル系 - 「プロ級の〇〇が作れる」「誰でもできる」
```

#### 1.4 フック映像の確認

```
フックの型（tutorial-reel-script-guide.md参照）:
1. 物体衝突型（鉄球、車、巨大物体）- 最もバズりやすい
2. 壁崩壊型 - インパクト大
3. 煙で瞬間移動型 - ミステリアス
4. 衣装変身型 - 親しみやすい
5. 地球ズームアウト型 - スケール感
6. 絵の具着色型 - アート系
```

#### 1.5 トリガーワードの決定

```
トリガーワード例:
- コンテンツ関連: 「モンスター」「鉄球」「変身」
- 日常系: 「今日何食べたか」「好きな季節」
```

### Step 2: プロジェクトフォルダ作成

```
C:\Instagramショート\Instagram_Reels_Production_V26.0.0\チュートリアル_{テーマ}_{日付}\
```

例: `チュートリアル_モンスターASMR_2026-02-17`

---

## Phase 2: 台本生成

### Step 3: 台本作成プロンプト実行

**参照**: `tutorial-reel-script-guide.md` の「台本作成プロンプト」

Claude Codeが以下を埋めて出力：

```markdown
# 解説系リール台本作成プロンプト

## 入力

### テーマ
{Phase 1で決定したテーマ}

### 訴求タイプ
{Phase 1で選択した訴求タイプ}

### 使用ツール
| ツール名 | 種類 | 用途 |
|---------|------|------|
| {ツール1} | {プロンプト系 or 手順系} | {用途1} |
| {ツール2} | {プロンプト系 or 手順系} | {用途2} |

### フック映像
{Phase 1で決定したフックの型と内容}

### トリガーワード
{Phase 1で決定したトリガーワード}
```

### Step 4: 台本の保存

ユーザーがAIで生成した台本をClaude Codeに貼る → 保存

**保存先**: `{PROJECT_FOLDER}\script.txt`

---

## Phase 3: narration.txt作成

### Step 5: ナレーション整形

Claude Codeが`script.txt`を以下のルールで整形：

**参照**: `tutorial-reel-script-guide.md` の「ナレーション用フォーマット」「テロップ分割ルール」

#### 整形ルール

1. **1行 = 1セグメント = 1音声ファイル**
2. **スラッシュで10文字以内に分割**（テロップ用）
3. **句読点・スペース排除**（TTS用、ただしアルファベット前はスペース）
4. **ステップ番号はひらがな**（いち、に、さん）
5. **ツール名はカタカナ**（ナノバナナ、クリング）

#### 出力例

```
これ見たこと/ありますか/海外でバズってる/モンスターASMR/なんですが/日本ではまだ/誰もやってない/んです/今やれば/100万再生も/狙えます/しかも/作り方は超簡単です/今から30秒で/解説します
ステップいち/ナノバナナで/キャプションにある/プロンプトを使って/モンスターの画像を/作ります
ステップに/クリングで/ASMRモードを/オンにして/動画にすれば/完成です
これだけで/本格的な/ASMR動画が/できます
今日紹介した/モンスターASMRの/作り方を/まとめました/ほしい人は
モンスターと/コメントしてください
```

**保存先**: `{PROJECT_FOLDER}\narration.txt`

---

## Phase 4: 素材準備（ユーザー作業）

### Step 6: 必要素材の確認

Claude Codeが必要素材リストを提示：

```
□ hook.mp4         - フック動画（AI生成）
□ completion.mp4   - 完成動画（AI生成）
□ intro.png        - 導入トリガー画像（Canva）
□ ui_01.png        - ステップ1 UI画面（Canva）
□ ui_02.png        - ステップ2 UI画面（Canva）
□ prompt_01.png    - プロンプトスクショ（プロンプト系のみ）
□ trigger.png      - トリガーワード画像（Canva）
```

### Step 7: Canvaテンプレート提示

**テンプレートURL**: https://www.canva.com/design/DAHAOpito_4/q4kafrXQb0nqYHDJiu_Vkg/edit

ユーザーが画像作成 → ダウンロード → Claude Codeがリネーム＆配置

---

## Phase 5: 音声生成 → SRT/JSON生成

### Step 8: Fish Audio音声生成

```bash
# Claude Codeが実行
python3 /mnt/c/engineer-course/scripts/generate_tutorial_narration.py "{PROJECT_FOLDER_WSL}"
```

**出力**: `{PROJECT_FOLDER}\audio\01.mp3, 02.mp3, ...`

### Step 9: 音声トルツメ

```bash
# Claude Codeが実行
powershell.exe -Command "python C:\engineer-course\scripts\trim_audio.py '{PROJECT_FOLDER}'"
```

**出力**: `{PROJECT_FOLDER}\audio_trimmed\01.mp3, 02.mp3, ...`

### Step 10: Whisperタイムスタンプ取得

```bash
# Claude Codeが実行
powershell.exe -Command "C:\Users\tench\whisper-env\Scripts\python.exe C:\engineer-course\scripts\whisper_tutorial_timestamps.py '{PROJECT_FOLDER}'"
```

**出力**: `{PROJECT_FOLDER}\audio_trimmed\01.json, 02.json, ...`

### Step 11: SRT + placement.json生成

```bash
# Claude Codeが実行
powershell.exe -Command "python C:\engineer-course\scripts\create_tutorial_srt.py '{PROJECT_FOLDER}'"
```

**出力**:
- `{PROJECT_FOLDER}\subtitle.srt`
- `{PROJECT_FOLDER}\placement.json`

---

## Phase 6: Premiere Pro自動配置

### Step 12: Premiere Pro起動

1. Premiere Proを起動
2. プロジェクトを開く
3. シーケンスをアクティブにする

### Step 13: F5実行

1. VS Codeで `scripts/premiere/place_ranking_images.jsx` を開く
2. **F5キー**を押す
3. ファイル選択ダイアログで **`placement.json`** を選択
4. 自動配置が実行される

### Step 14: 配置確認

| トラック | 内容 |
|---------|------|
| V1 | アバター動画 |
| V3 | フック動画（0〜5秒） |
| V4 | ツール名 → プロンプトスクショ → UI画像 |
| V6 | 完成動画プレビュー / 完成動画 |
| V7 | トリガーワード |
| V14 | 字幕背景 |
| A1 | ナレーション |
| A2 | フック音声 |
| A3 | BGM（-40dB） |
| A4 | SE |

---

## チェックリスト（一撃制作用）

### Phase 1完了チェック

- [ ] テーマ決定
- [ ] 使用ツール確認
- [ ] 訴求タイプ選択
- [ ] フック映像決定
- [ ] トリガーワード決定
- [ ] プロジェクトフォルダ作成

### Phase 2-3完了チェック

- [ ] 台本生成（外部AI）
- [ ] script.txt保存
- [ ] narration.txt整形・保存

### Phase 4完了チェック

- [ ] hook.mp4配置
- [ ] completion.mp4配置
- [ ] Canva画像作成・リネーム・配置

### Phase 5完了チェック

- [ ] Fish Audio音声生成
- [ ] 音声トルツメ
- [ ] Whisperタイムスタンプ
- [ ] SRT + placement.json生成

### Phase 6完了チェック

- [ ] Premiere Pro F5実行
- [ ] 配置確認
- [ ] 微調整

---

## RAG参照マップ

| フェーズ | 参照RAG | 参照内容 |
|---------|---------|----------|
| テーマ決定 | `engineer-mindset-rag.md` | 得意ジャンル、テーマ選定基準 |
| テーマ決定 | `sns-ai-trend-research-2026-02.md` | バズる法則、フックリスト |
| 台本生成 | `tutorial-reel-script-guide.md` | 台本作成プロンプト |
| 台本生成 | `sns-ai-professional-rag.md` | 構成テンプレート |
| narration整形 | `tutorial-reel-script-guide.md` | ナレーション用フォーマット、テロップ分割ルール |
| narration整形 | `ai-tool-name-list.md` | ツール名表記（カタカナ↔英語） |
| 素材準備 | `tutorial-reel-script-guide.md` | 画像ファイル名マッピング |
| Premiere配置 | `tutorial-reel-script-guide.md` | placement.jsonとJSXワークフロー |

---

## トラブルシューティング

### 音声が生成されない

1. Fish Audio APIキーを確認
2. narration.txtのエンコーディングをUTF-8に
3. 行数が0でないか確認

### タイムスタンプがずれる

1. audio_trimmed/*.jsonを直接確認
2. トルツメが正常に完了しているか確認
3. Whisperのword_timestampsがtrueか確認

### placement.jsonが空

1. narration.txtの形式を確認（1行1セグメント）
2. スラッシュ分割が正しいか確認
3. Whisper JSONが生成されているか確認

### Premiere Pro配置が崩れる

1. シーケンスがアクティブか確認
2. 素材パスが正しいか確認（placement.json内）
3. 共有素材フォルダにツール名画像があるか確認

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2026-02-17 | 初版作成。リサーチRAG + クセRAG + 既存ガイドを統合した一撃制作フロー |
