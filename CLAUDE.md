# Engineer Course

## SNS×AI 専門ナレッジベース

SNS/Instagram/リール/特典/フック/台本/AIツール活用に関する質問を受けた場合、以下のRAGドキュメントを参照すること:

**参照ファイル**: `content/guides/sns-ai-professional-rag.md`

**自動参照トリガー**:
- 「リールを伸ばしたい」「バズりたい」
- 「AIで動画作りたい」「AIツールの使い分け」
- 「特典を作りたい」「CTAどうする」
- 「フォロワー増やしたい」「収益化したい」
- 「ネタが思いつかない」「企画がない」
- 「台本書きたい」「フックの作り方」
- 「顔出しなしで伸ばしたい」

## チュートリアル動画制作

「チュートリアル動画を作りたい」「解説リールを作りたい」等のトリガーで以下を参照し、F5実行まで一気通貫で制作する：

**参照ファイル（優先順）**:
1. `content/guides/tutorial-video-unified-guide.md` - 統合フロー（メインガイド）
2. `content/guides/engineer-mindset-rag.md` - 仕組み化のプロ・テーマ選定基準
3. `content/guides/sns-ai-trend-research-2026-02.md` - バズる法則
4. `content/guides/tutorial-reel-script-guide.md` - 台本ルール・ナレーション形式

**自動参照トリガー**:
- 「チュートリアル動画を作りたい」
- 「解説リールを作りたい」
- 「〇〇の作り方動画を作りたい」
- 「チュートリアルリールを作りたい」
- 「解説動画を作りたい」

**フロー概要**:
```
Phase 1: テーマ決定（得意ジャンル×バズる法則）
Phase 2: 台本生成（外部AI + 整形）
Phase 3: narration.txt作成（スラッシュ分割）
Phase 4: 素材準備（hook.mp4, ui_*.png等）
Phase 5: 音声生成 → SRT/JSON生成（自動）
Phase 6: Premiere Pro F5 → 一撃完成
```

## X API サーバー起動コマンド

```powershell
python C:\engineer-course\scripts\x_api_server_v3.py
```
