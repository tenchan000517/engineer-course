# 実践：Webアプリ開発

**所要時間**: 30-40分
**難易度**: ⭐⭐⭐☆☆

---

## このモジュールで学ぶこと

- エージェントへの効果的な指示の書き方
- Planningモードでの計画確認
- エージェントの自律的な開発サイクル
- エラーの自己検出と修正
- フィードバックによる改善

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- 具体的で明確な指示を書ける
- Planningモードで計画をレビューできる
- エージェントの自律的な検証サイクルを理解できる
- 効果的なフィードバックで改善を促せる

---

## 目次

- [セクション1: 効果的な指示の書き方](#セクション1-効果的な指示の書き方)
- [セクション2: Planningモードでの計画確認](#セクション2-planningモードでの計画確認)
- [セクション3: エージェントの自律的開発サイクル](#セクション3-エージェントの自律的開発サイクル)
- [セクション4: エラーの自己検出と修正](#セクション4-エラーの自己検出と修正)
- [セクション5: フィードバックと改善](#セクション5-フィードバックと改善)
- [セクション6: エージェントの限界と人間による仕上げ](#セクション6-エージェントの限界と人間による仕上げ)
- [まとめ](#まとめ)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの
- Google Antigravityがインストール済み（モジュール01完了）
- Workspaceの作成方法を理解している（モジュール03完了）
- Node.js がインストール済み

### 作成するもの
今回は**タイピングゲーム**を作成します。寿司打のようなゲーム性を持ちつつ、Apple風のミニマルなデザインで実装します。

---

## セクション1: 効果的な指示の書き方

エージェントに「いい感じに作って」では良い結果は得られません。**具体的で構造化された指示**が重要です。

### 1.1 Workspaceを準備

1. 新しいフォルダを作成（例: `typing-game`）
2. Antigravityでそのフォルダを開く

![Workspace準備画面](/antigravity/04-workspace-ready.png)

「Start new conversation in typing-game」と表示されればOKです。

### 1.2 2画面構成での作業

効率的な作業のため、**Agent ManagerとEditorを並べて表示**することを推奨します。

![2画面構成](/antigravity/04-dual-screen.png)

| 画面 | 役割 |
|------|------|
| **左モニター** | Agent Manager（会話・指示） |
| **右モニター** | Editor（コード確認） |

### 1.3 良い指示の構造

以下の要素を含めると、エージェントが正確に理解できます：

```
[何を作るか]

【機能仕様】
- 具体的な機能をリストアップ

【デザイン】
- デザインの方向性
- 使わないもの（制約）

【技術】
- 使用する技術スタック
```

### 1.4 実際の指示文

今回使用する指示文：

```
タイピングゲームをNext.js（TypeScript）で作成してください。

【ゲーム仕様】
- 日本語のテキストが画面右から左に流れてくる
- 画面外に出る前にローマ字でタイプすると消える
- 制限時間あり（60秒）
- スコア、正確率、残り時間を表示
- 難易度選択（かんたん/ふつう/むずかしい）

【デザイン】
- Apple風のミニマルなUI
- 白/ライトグレー基調
- 画像素材は使わない（CSS onlyで完結）
- 余白を十分に取る
- 影は薄く、ぼかし多め
- 滑らかなアニメーション

【技術】
- Next.js + TypeScript
- Tailwind CSS
- 追加ライブラリは最小限に
```

**ポイント:**
- 「Apple風」のように具体的なイメージを伝える
- 「画像素材は使わない」のように**制約**を明記
- 技術スタックを指定して意図しないライブラリの導入を防ぐ

### チェックポイント

- [ ] Workspaceを準備できた
- [ ] 指示文の構造を理解した
- [ ] 制約を明記する重要性を理解した

---

## セクション2: Planningモードでの計画確認

### 2.1 指示を送信

プロンプト入力欄に指示文を入力し、送信します。

![指示入力、計画開始](/antigravity/04-prompt-start.png)

エージェントが「Let me start by planning this project.」と応答し、計画フェーズに入ります。

### 2.2 計画の確認

エージェントは実装前に**計画書（Proposed Changes）**を作成します。

![計画完了、Accept待ち](/antigravity/04-plan-accept.png)

**計画書に含まれる内容:**

| セクション | 内容 |
|-----------|------|
| **概要** | 何を作るかの説明 |
| **Proposed Changes** | 作成・変更するファイル一覧 |
| **Verification Plan** | 検証方法 |

**ファイル一覧の例:**

```
Core Game Logic
├── romaji.ts (NEW) - ひらがな→ローマ字変換
├── gameData.ts (NEW) - 難易度別フレーズデータ
└── types.ts (NEW) - TypeScript型定義

UI Components
├── FallingText.tsx (NEW) - 流れるテキスト
├── GameStats.tsx (NEW) - スコア表示
└── DifficultySelector.tsx (NEW) - 難易度選択

Styling
├── globals.css (MODIFY) - グローバルスタイル
└── tailwind.config.ts (MODIFY) - Tailwind設定
```

### 2.3 ターミナル操作の許可

エージェントがターミナルコマンドを実行する際、**許可を求めるダイアログ**が表示されます。

```
npx create-next-app@latest
Need to install the following packages:
create-next-app@16.0.6
Ok to proceed? (y)

Send command input?  [Reject] [Accept]
```

**「Accept」をクリック**すると、エージェントが `y` を入力してコマンドが実行されます。

### 2.4 Planningモードのメリット

| メリット | 説明 |
|---------|------|
| **事前確認** | 実装前に全体像を把握できる |
| **リスク軽減** | 意図しない変更を防げる |
| **学習機会** | エージェントの設計思想を学べる |

### チェックポイント

- [ ] 計画書が作成されることを確認した
- [ ] ファイル構成を事前に確認できた
- [ ] ターミナル許可のフローを理解した

---

## セクション3: エージェントの自律的開発サイクル

### 3.1 プロジェクト作成

エージェントが計画に従ってプロジェクトを作成します。

![プロジェクト作成中](/antigravity/04-creating-project.png)

「Agent is running terminal commands」と表示され、以下が自動実行されます：

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --app --eslint --use-npm
```

### 3.2 Editorでの確認

右側のEditorにプロジェクト構造が表示されます。

![プロジェクト構造](/antigravity/04-project-structure.png)

```
typing-game/
├── node_modules/
├── public/
├── src/
│   └── app/
│       ├── components/
│       ├── utils/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

右側のパネルには**タスクリスト（Artifacts）**が表示され、進捗を追跡できます。

### 3.3 自律的な検証サイクル

**Antigravityの最大の特徴**: エージェントが自分でブラウザを開いて検証する

1. **コードを書く** → ファイルを生成・編集
2. **サーバーを起動** → `npm run dev`
3. **ブラウザを開く** → localhost:3003 にアクセス
4. **動作確認** → 画面をスクリーンショット
5. **問題を検出** → エラーを発見
6. **自己修正** → コードを修正

この**計画→実装→検証のサイクル**を人間の介入なしに繰り返します。

### チェックポイント

- [ ] プロジェクトが自動作成されることを確認した
- [ ] Editorでファイル構造を確認した
- [ ] 自律的な検証サイクルを理解した

---

## セクション4: エラーの自己検出と修正

### 4.1 ブラウザでのエラー検出

エージェントがブラウザを開くと、エラーが検出されることがあります。

![CSSエラー検出](/antigravity/04-css-error.png)

**例: CSSのパースエラー**

```
Build Error
Parsing CSS source code failed

./src/app/globals.css (523:8)
@import rules must precede all rules aside from @charset and @layer statements
```

### 4.2 自動修正

エージェントはエラーを**自分で理解し、修正**します：

1. エラーメッセージを解析
2. 原因を特定（`@import` がファイルの途中にある）
3. 修正を実施（`@import` を先頭に移動）
4. 再度ブラウザで確認

**人間がエラーを報告しなくても、エージェントが自分で気づいて直す**のがポイントです。

### 4.3 ゲームの動作確認

修正後、ゲームが正常に動作します。

![ゲーム動作画面](/antigravity/04-game-running.png)

- タイトル「タイピングゲーム」
- スコア、正確率、残り時間の表示
- 日本語テキストが流れている
- 入力欄がある
- **Apple風のミニマルデザイン**（白基調、余白たっぷり）

### 4.4 Walkthroughの自動生成

タスク完了後、エージェントは**ウォークスルー（walkthrough.md）**を自動生成します。

![Walkthrough生成](/antigravity/04-walkthrough.png)

```
タイピングゲームが完成しました！
http://localhost:3003 で動作しています。
ウォークスルーをご確認ください。

📄 walkthrough.md  [Open]
```

**Walkthroughに含まれる内容:**
- 実装した機能の一覧
- 技術的なハイライト（コードスニペット）
- 起動方法
- 検証結果

### チェックポイント

- [ ] エージェントがエラーを自己検出することを確認した
- [ ] 自動修正のフローを理解した
- [ ] Walkthroughが生成されることを確認した

---

## セクション5: フィードバックと改善

### 5.1 不具合の発見

最初の実装が完璧とは限りません。動作確認で問題を発見したら、**具体的なフィードバック**を送ります。

![自己修正の試み](/antigravity/04-self-fix.png)

エージェントが自ら問題を検出して修正を試みることもあります：

```
「問題を理解しました。入力の検証ロジックに問題があります。修正します」
↓
FallingText.tsx を編集
↓
「ファイルが壊れてしまいました。完全に書き直します」
```

### 5.2 効果的なフィードバックの書き方

**悪い例:**
```
動かない
```

**良い例:**
```
寿司打はいっぺんにテキストが流れてくるのではなく、ひとつ一つ流れてきます
当然入力テキストも一つクリアしたら次って感じで同時に流れてくることはありません
あと、基本的に同じラインから流れてきます
今みたいに画面の下部から流れてくるだったり、上部から流れてくるようなUIではないです
確実に入力に反応できるようにしたいですね
```

**ポイント:**
- 何が問題かを具体的に説明
- 期待する動作を明確に伝える
- 参考となる例（寿司打）を示す

### 5.3 モデルの切り替え

うまくいかない場合、**別のモデルで試す**ことも有効です。

![Gemini 3 Proで修正](/antigravity/04-gemini-fix.png)

```
Refactoring Game Mechanics to Sushi-Da Style
User requested changes to match 'Sushi Da' style:
single text stream, fixed vertical position, and sequential input focus.
```

**Gemini 3 Proの特徴:**
- 「Thought Process」で思考過程を表示
- Antigravityに最適化されている

### 5.4 現実的な期待値

**重要**: エージェントは万能ではありません。

| 期待できること | 期待しすぎないこと |
|---------------|------------------|
| 基本的な実装を素早く作成 | 複雑なロジックの完璧な実装 |
| 一般的なエラーの自己修正 | すべてのバグを自動で解消 |
| 計画と構造の提案 | 細かいUXの調整 |

**エージェントは「出発点」を提供する**と考え、人間が仕上げる姿勢が重要です。

### チェックポイント

- [ ] 具体的なフィードバックの書き方を理解した
- [ ] モデル切り替えの選択肢を知った
- [ ] エージェントの限界を理解した

---

## セクション6: エージェントの限界と人間による仕上げ

エージェントが作った「出発点」を、人間（またはより高性能なAIツール）が仕上げるプロセスを解説します。

**完成版デモ**: https://typing-game-one-taupe.vercel.app/

<video controls width="100%">
  <source src="/antigravity/04-typing-game-demo.mp4" type="video/mp4">
</video>

### 6.1 エージェントが作ったコードの評価

今回のタイピングゲームでエージェントが作成したコード：

| 項目 | 評価 | コメント |
|------|------|----------|
| **プロジェクト構造** | ◎ | コンポーネント分離、utils/types整理 |
| **基本機能** | ○ | 動作はするが細部に問題あり |
| **UX** | △ | アニメーション、入力検証に不具合 |
| **デザイン** | △ | シンプルすぎる、工夫が足りない |

### 6.2 発見された問題点

実際に動かしてみると、以下の問題が見つかりました：

**アニメーションの問題**
```
症状: テキストが途中で止まる、入力していないのに消える
原因: useEffectの依存配列にonCompleteが含まれ、再レンダリングでアニメーションがリセット
```

**ローマ字入力パターンの問題**
```
症状: 「し」を "shi" で入力できない（"si" のみ対応）
原因: 単一のローマ字パターンしか定義されていない
```

**Tailwind CSSの設定問題**
```
症状: スタイル（余白、flexbox等）が効かない
原因: Tailwind v4の設定方法が間違っていた（:rootで変数定義→@theme inlineで直接定義が正解）
```

**デザインの問題**
```
症状: ただテキストが流れるだけで見づらい、シンプルすぎる
改善案: モニターフレーム、キーボードビジュアル等のリッチなUI
```

### 6.3 人間による修正ポイント

#### FallingText.tsx - アニメーション修正

cancelledフラグでアニメーションを適切に制御：

```typescript
// Before（エージェント作成）
useEffect(() => {
  // onCompleteが依存配列に入っていてアニメーションがリセットされる
}, [item.speed, onComplete]);

// After（人間が修正）
const onCompleteRef = useRef(onComplete);
useEffect(() => {
  onCompleteRef.current = onComplete;
}, [onComplete]);

useEffect(() => {
  let cancelled = false;
  const animate = () => {
    if (cancelled) return;
    // ...アニメーション処理
  };
  return () => { cancelled = true; };
}, [item.speed, item.id]);
```

#### romaji.ts - 複数パターン対応

複数のローマ字入力パターンに対応：

```typescript
// Before（エージェント作成）
'し': 'si',  // 単一パターンのみ

// After（人間が修正）
const hiraganaPatterns: { [key: string]: string[] } = {
  'し': ['si', 'shi', 'ci'],
  'ち': ['ti', 'chi'],
  'つ': ['tu', 'tsu'],
  'ふ': ['hu', 'fu'],
  'じょ': ['jo', 'zyo', 'jyo'],
  // ...
};
```

#### globals.css - Tailwind v4対応

Tailwind v4の正しい設定方法：

```css
/* Before（エージェント作成）*/
:root {
  --background: #ffffff;
}
@theme inline {
  --color-background: var(--background);  /* varで参照 - 動かない */
}

/* After（人間が修正）*/
@import 'tailwindcss';
@theme inline {
  --color-background: #f5f5f7;  /* 直接値を指定 */
  --color-blue: #0071e3;
}
@layer base {
  body {
    @apply bg-background;
  }
}
```

### 6.4 デザインの大幅改善

エージェントが作った「ただテキストが流れるだけ」のUIを、リッチなデザインに改善：

#### Monitor.tsx - モニターフレーム追加

```typescript
// macOS風のモニターフレームコンポーネント
<div className="bg-[#1d1d1f] rounded-2xl p-3">
  <div className="bg-white rounded-lg w-[600px] h-[300px]">
    {/* 信号ボタン */}
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
    {children}
  </div>
</div>
```

#### Keyboard.tsx - キーボードビジュアル追加

```typescript
// QWERTYキーボードの視覚的表示
// 正解キー → 青く光る
// 不正解キー → 赤く光る
const getKeyClass = (key: string) => {
  if (activeKey === key && keyState === 'correct') {
    return 'bg-blue text-white shadow-lg shadow-blue/30';
  }
  if (activeKey === key && keyState === 'wrong') {
    return 'bg-red text-white shadow-lg shadow-red/30';
  }
  return 'bg-white text-gray-600 border border-gray-200';
};
```

#### 時間経過によるスピードアップ

```typescript
// 残り時間が少ないほど速くなる
const getSpeed = (diff: Difficulty, remainingTime: number): number => {
  const baseSpeed = getBaseSpeed(diff);
  const speedMultiplier = 0.6 + (remainingTime / 60) * 0.4;
  return Math.floor(baseSpeed * speedMultiplier);
};
```

### 6.5 教訓

| エージェントの強み | 人間が補うべき点 |
|------------------|-----------------|
| 素早くプロジェクト構造を作成 | アニメーション等の細かいバグ修正 |
| 基本的なUIコンポーネント生成 | リッチなUI/UXの設計・実装 |
| 一般的なパターンの実装 | エッジケース（複数ローマ字パターン等）の処理 |
| 技術スタックの設定 | フレームワーク固有の設定問題の解決 |

**結論**: エージェントは「60-70%の出発点」を作るのに優秀。残りの仕上げ（特にUX/デザイン）は人間のセンスが重要。

### チェックポイント

- [ ] エージェントの限界を具体的に理解した
- [ ] 人間が修正すべきポイントを把握した
- [ ] 「出発点」として活用する姿勢を理解した
- [ ] [完成版デモ](https://typing-game-one-taupe.vercel.app/)を試してみた

---

## まとめ

お疲れ様でした！エージェントを使った実践的なWebアプリ開発を学びました。

**完成したタイピングゲーム**: https://typing-game-one-taupe.vercel.app/

### このモジュールで学んだこと

- **効果的な指示**: 仕様・デザイン・技術・制約を明記する
- **Planningモード**: 実装前に計画をレビュー
- **自律的サイクル**: 計画→実装→検証を自動で繰り返す
- **エラー自己修正**: ブラウザでエラーを検出し自分で直す
- **フィードバック**: 具体的に問題と期待を伝える
- **限界の理解**: エージェントは60-70%の出発点、残りは人間のセンスで仕上げる
- **デザインの重要性**: モニターフレーム、キーボードビジュアル等、独自のアイデアがUXを大きく向上させる

### ベストプラクティス

1. **指示は具体的に** - 曖昧な指示は曖昧な結果を生む
2. **制約を明記** - 使わないもの、避けたいことも伝える
3. **計画を確認** - 実装前にProposed Changesをレビュー
4. **小さく始める** - 大きな機能は分割して指示
5. **フィードバックは具体的に** - 何が問題で何を期待するか

### 次のステップ

次のモジュールでは、Web自動化・スクレイピングなど、ブラウザ操作を活用したタスクに挑戦します。

---

## 参考資料

- [Google Antigravity 公式サイト](https://antigravity.google/)
- [Google Codelabs - Getting Started](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)

---

## よくある質問

**Q: 英語と日本語、どちらで指示すべき？**
A: どちらでも動作します。日本語で指示しても問題なく理解されます。ただし、技術用語は英語のままの方が正確に伝わることがあります。

**Q: Planningモードをスキップできますか？**
A: はい、入力欄の下で「Planning」を無効にするとスキップできます。ただし、複雑なタスクでは計画を確認することを推奨します。

**Q: エージェントが間違った方向に進んだ場合は？**
A: 「Stop」ボタンで停止し、フィードバックを送ってください。または新しい会話を開始することもできます。

**Q: 生成されたコードの品質は？**
A: 基本的な実装としては十分ですが、本番環境に使う場合は人間によるレビューと調整を推奨します。特にセキュリティ面は確認が必要です。

**Q: モデルによって結果は変わりますか？**
A: はい、モデルによって得意分野や応答スタイルが異なります。うまくいかない場合は別のモデルを試してみてください。

**Q: 使用制限（リミット）に達したらどうする？**
A: 一定時間待つか、翌日に再試行してください。有料プランではより多くの利用が可能です。
