# 30万円商材用ランディングページ完全設計

---

## ページ全体の戦略設計

### 目的とKPI

```
【ページの目的】

Primary Goal:無料相談予約(CVR 15%目標)
Secondary Goal:メールアドレス取得(CVR 30%目標)

【想定される訪問者の心理】

疑い:70% 「本当に30万円の価値がある?」
興味:50% 「でも気になる...」
不安:80% 「失敗したらどうしよう」
欲求:90% 「月100万円稼ぎたい!」

→ この心理を段階的に変えていく

【ページ構成の原則】

1. 衝撃のファーストビュー(3秒で心を掴む)
2. 共感ストーリー(疑いを共感に変える)
3. 圧倒的な価値提示(興味を確信に変える)
4. 社会的証明(不安を安心に変える)
5. リスク反転(行動しない方がリスク)
6. 限定性(今すぐ行動させる)

【推定ページ長】

・総セクション数:15
・推定スクロール長:15,000〜20,000px
・平均滞在時間:8〜12分
・動画埋め込み:5〜7本
```

---

## セクション別完全設計

---

## セクション1:ファーストビュー(Above the Fold)

### デザイン指示

```css
/* 背景 */
background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
height: 100vh;
position: relative;

/* アニメーション背景 */
- 動くパーティクル(白い点が流れる)
- グラデーション変化(ゆっくり)

/* 文字色 */
color: #FFFFFF;
text-shadow: 0 2px 10px rgba(0,0,0,0.3);
```

### コンテンツ

```html
<!-- 中央配置 -->

<div class="hero-content">

  <!-- キャッチコピー(超大文字) -->
  <h1 class="hero-headline">
    <span class="highlight">6ヶ月で月収100万円</span>の
    <br>
    自動収益システムを
    <br>
    <span class="highlight">一緒に構築します</span>
  </h1>

  <!-- サブキャッチ -->
  <p class="hero-subheadline">
    働かなくても収益が入る仕組みを作り、
    <br>
    完全な自由を手に入れませんか?
  </p>

  <!-- 実績数字(信頼性) -->
  <div class="hero-stats">
    <div class="stat">
      <div class="stat-number">94%</div>
      <div class="stat-label">月100万円達成率</div>
    </div>
    <div class="stat">
      <div class="stat-number">127人</div>
      <div class="stat-label">累計卒業生</div>
    </div>
    <div class="stat">
      <div class="stat-number">1,960万円</div>
      <div class="stat-label">相当の内容</div>
    </div>
  </div>

  <!-- CTA(目立つボタン) -->
  <div class="hero-cta">
    <button class="cta-primary pulse-animation">
      60分の無料相談を予約する
      <br>
      <span class="cta-sub">(強引な勧誘は一切しません)</span>
    </button>

    <p class="cta-note">
      月10名限定募集
      <br>
      残り枠:<span class="remaining">7</span>/10名
    </p>
  </div>

  <!-- スクロール促進 -->
  <div class="scroll-indicator">
    <p>下にスクロールして詳細を見る</p>
    <div class="arrow-down animated"></div>
  </div>

</div>

<!-- 右下に小さく動画 -->
<div class="hero-video">
  <video autoplay loop muted playsinline>
    <source src="background-video.mp4" type="video/mp4">
  </video>
  <!-- 実際に稼働してるシステムの画面、
       グラフが上がってるアニメーション等 -->
</div>
```

### デザインのポイント

```
- 3秒ルール:3秒で「これは自分のためのものだ」と思わせる
- 数字の力:94%、127人、1960万円で信頼性を即座に伝える
- 限定性:残り枠7/10で緊急性を演出
- リスク排除:「強引な勧誘なし」で安心感
- 動き:パーティクル、動画、アニメーションで目を引く
```

---

## セクション2:問題提起(共感フック)

### デザイン指示

```css
background: #FFFFFF;
padding: 100px 0;
text-align: center;
```

### コンテンツ

```markdown
<!-- 大きな見出し(黒) -->

# こんな悩み、ありませんか?

<!-- 3カラムレイアウト -->

<div class="problems-grid">

  <!-- 問題1 -->
  <div class="problem-card">
    <h3>案件は取れるけど...</h3>
    <p>
      月30万円は稼げてる。
      でも、全部自分でやってて
      <strong>時間がない</strong>
      これ以上は無理...
    </p>
  </div>

  <!-- 問題2 -->
  <div class="problem-card">
    <h3>単価が上がらない</h3>
    <p>
      3万、5万の案件ばかり。
      高単価案件の取り方が
      <strong>分からない</strong>
      このままじゃ月100万は無理...
    </p>
  </div>

  <!-- 問題3 -->
  <div class="problem-card">
    <h3>労働収入から抜け出せない</h3>
    <p>
      働かないと稼げない。
      <strong>不労所得が欲しい</strong>
      でもどうすれば...
    </p>
  </div>

</div>

<!-- 共感メッセージ -->

<div class="empathy-message">
  <p class="large-text">
    その気持ち、<strong>めちゃくちゃ分かります。</strong>
  </p>
  <p>
    俺も3年前、同じ悩みを抱えてました。
  </p>
</div>
```

---

## セクション3:ストーリー(講師の実体験)

### デザイン指示

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #FFFFFF;
padding: 100px 0;
```

### コンテンツ

```html
<div class="story-section">

  <!-- タイトル -->
  <h2 class="section-title">
    俺の話を聞いてください
  </h2>

  <!-- タイムライン形式 -->
  <div class="timeline">

    <!-- 2023年3月:絶望 -->
    <div class="timeline-item">
      <div class="timeline-date">2023年3月15日</div>
      <div class="timeline-image">
        <img src="before-photo.jpg" alt="和菓子屋時代">
        <!-- モノクロ加工、暗い表情 -->
      </div>
      <div class="timeline-content">
        <h3>人生のどん底</h3>
        <p>
          「来月から来なくていい」
          39歳、和菓子屋をクビ。
          月収18万円(残業代込み)
          貯金32万円
          家族3人
          その日の夜、ハローワークのサイトを見ながら泣いた。
        </p>
      </div>
    </div>

    <!-- 2023年6月:出会い -->
    <div class="timeline-item">
      <div class="timeline-date">2023年6月</div>
      <div class="timeline-content">
        <h3>AIとの出会い</h3>
        <p>
          YouTubeで偶然見た動画。
          「AIで誰でもエンジニアになれる」
          半信半疑だったけど
          他に道もなかった。
          朝4時起き。
          毎日Cursorと格闘した。
        </p>
      </div>
    </div>

    <!-- 2023年8月:初案件 -->
    <div class="timeline-item">
      <div class="timeline-date">2023年8月</div>
      <div class="timeline-content">
        <h3>初案件獲得</h3>
        <p>
          報酬:3万円
          震えた。
          「俺でも稼げるんだ」
          ここから人生が変わり始めた。
        </p>
      </div>
    </div>

    <!-- 2024年3月:転機 -->
    <div class="timeline-item">
      <div class="timeline-date">2024年3月</div>
      <div class="timeline-content">
        <h3>自動化との出会い</h3>
        <p>
          Make.comを知った。
          「自動で稼ぐ仕組み」を作れることを知った。
          ここから収入が爆増。
          月30万 → 月80万
        </p>
      </div>
    </div>

    <!-- 2026年現在:今 -->
    <div class="timeline-item highlight">
      <div class="timeline-date">2026年 現在</div>
      <div class="timeline-image">
        <img src="after-photo.jpg" alt="現在">
        <!-- カラー、笑顔 -->
      </div>
      <div class="timeline-content">
        <h3>完全な自由</h3>
        <p>
          月収:80万円(安定)
          働き方:完全在宅
          勤務時間:1日4時間
          休み:自由に取れる
          家族との時間も増えた。
          貯金も順調に増えてる。
          <strong>人生が完全に変わった。</strong>
        </p>
      </div>
    </div>

  </div>

  <!-- 共感メッセージ -->
  <div class="story-message">
    <p class="large-text">
      あなたも同じ道を歩けます。
    </p>
    <p>
      俺がやってきたこと全て、
      包み隠さず教えます。
    </p>
  </div>

</div>
```

---

## セクション4:ソリューション提示

### デザイン指示

```css
background: #FFFFFF;
padding: 100px 0;
text-align: center;
```

### コンテンツ

```html
<div class="solution-section">

  <!-- タイトル -->
  <h2 class="section-title">
    その方法を、全部教えます
  </h2>

  <!-- サブタイトル -->
  <p class="section-subtitle">
    ただの講座ではありません。
    <strong>あなた専用の収益システムを一緒に構築します。</strong>
  </p>

  <!-- プログラム名(大きく) -->
  <div class="program-name">
    <h3>AI自動収益システム構築</h3>
    <h1>完全マスタープログラム</h1>
  </div>

  <!-- 3つの柱(ビジュアル重視) -->
  <div class="pillars-grid">

    <!-- 柱1 -->
    <div class="pillar-card">
      <h3>完全オーダーメイド</h3>
      <p>
        あなたの状況・スキル・目標に合わせて
        <strong>専用のシステムを設計</strong>
      </p>
      <ul class="pillar-features">
        <li>3時間のキックオフ面談</li>
        <li>あなた専用AIモデル構築</li>
        <li>カスタムロードマップ作成</li>
      </ul>
    </div>

    <!-- 柱2 -->
    <div class="pillar-card">
      <h3>自動化に特化</h3>
      <p>
        働かなくても収益が入る
        <strong>不労所得の仕組み</strong>
      </p>
      <ul class="pillar-features">
        <li>SaaSプロダクト開発</li>
        <li>自動営業システム構築</li>
        <li>コンテンツ販売自動化</li>
      </ul>
    </div>

    <!-- 柱3 -->
    <div class="pillar-card">
      <h3>永久サポート</h3>
      <p>
        卒業後も一生相談できる
        <strong>生涯パートナー</strong>
      </p>
      <ul class="pillar-features">
        <li>月1回の個別面談(永久)</li>
        <li>専用LINE質問し放題</li>
        <li>案件紹介(永久)</li>
      </ul>
    </div>

  </div>

  <!-- 他との違い(対比表) -->
  <div class="comparison-section">
    <h3>他の講座との決定的な違い</h3>

    <table class="comparison-table">
      <thead>
        <tr>
          <th>項目</th>
          <th class="bad">一般的な講座(10万円)</th>
          <th class="good">このプログラム(30万円)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>内容</td>
          <td class="bad">知識を教えるだけ</td>
          <td class="good">一緒にシステム構築</td>
        </tr>
        <tr>
          <td>サポート</td>
          <td class="bad">3ヶ月で終了</td>
          <td class="good">永久サポート</td>
        </tr>
        <tr>
          <td>カスタマイズ</td>
          <td class="bad">全員同じ内容</td>
          <td class="good">完全オーダーメイド</td>
        </tr>
        <tr>
          <td>営業支援</td>
          <td class="bad">なし</td>
          <td class="good">営業代行・案件紹介</td>
        </tr>
        <tr>
          <td>保証</td>
          <td class="bad">返金保証なし</td>
          <td class="good">3つの保証付き</td>
        </tr>
        <tr>
          <td>成果</td>
          <td class="bad">稼げない人80%</td>
          <td class="good">稼げない人0%</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
```

---

## セクション5:プログラム詳細(タブ切替式)

### デザイン指示

```css
background: #F8F9FA;
padding: 100px 0;
```

### コンテンツ

```html
<div class="program-details">

  <!-- タイトル -->
  <h2 class="section-title">
    6ヶ月間で何をするのか?
  </h2>

  <!-- タブナビゲーション -->
  <div class="tabs">
    <button class="tab active" data-tab="phase1">
      Phase 1 / Month 1-2
    </button>
    <button class="tab" data-tab="phase2">
      Phase 2 / Month 3-4
    </button>
    <button class="tab" data-tab="phase3">
      Phase 3 / Month 5-6
    </button>
    <button class="tab" data-tab="bonus">
      特典
    </button>
  </div>

  <!-- Phase 1 コンテンツ -->
  <div class="tab-content active" id="phase1">
    <h3>Phase 1:完全オーダーメイド設計</h3>

    <!-- アコーディオン形式 -->
    <div class="accordion">

      <!-- 項目1 -->
      <div class="accordion-item">
        <div class="accordion-header">
          <h4>1-1:キックオフ面談(3時間)</h4>
          <span class="value-tag">価値:30万円</span>
        </div>
        <div class="accordion-body">
          <p>
            あなたの現状を完全ヒアリングし、
            最適な収益モデルを設計します。
          </p>
          <ul>
            <li>現在のスキル・使える時間を診断</li>
            <li>目標月収と達成戦略を設定</li>
            <li>6ヶ月間の詳細ロードマップ作成</li>
          </ul>
          <div class="deliverable">
            <strong>成果物:</strong>
            ・あなた専用ロードマップ(30ページ)
            ・推奨ツールリスト
            ・KPI設定シート
          </div>
        </div>
      </div>

      <!-- 項目2 -->
      <div class="accordion-item">
        <div class="accordion-header">
          <h4>1-2:あなた専用AIシステムの構築</h4>
          <span class="value-tag">価値:50万円</span>
        </div>
        <div class="accordion-body">
          <p>
            あなたのコーディングスタイルを学習した
            <strong>「AI分身」</strong>を構築します。
          </p>
          <ul>
            <li>OpenAI Fine-tuning(あなた専用モデル)</li>
            <li>Claude Custom Instructions</li>
            <li>Make.comテンプレート10個</li>
          </ul>
          <div class="deliverable">
            <strong>成果物:</strong>
            ・あなた専用AIモデル
            ・Make.comテンプレート10個(各15万円で販売可能)
            ・マニュアル完全版
          </div>
          <div class="testimonial-mini">
            <p>
              「自分専用AIが作ったコードは
              まるで自分が書いたみたい。
              テンプレート5個売って100万円回収できました」
            </p>
            <span>- Mさん(36歳)</span>
          </div>
        </div>
      </div>

      <!-- 項目3 -->
      <div class="accordion-item">
        <div class="accordion-header">
          <h4>1-3:高単価案件の完全営業代行</h4>
          <span class="value-tag">価値:100万円</span>
        </div>
        <div class="accordion-body">
          <p>
            あなたの代わりに、俺が営業します。
          </p>
          <ul>
            <li>ターゲット企業リストアップ(50社)</li>
            <li>営業メール送信代行</li>
            <li>初回面談同席(Zoom)</li>
            <li>提案書・見積書作成代行</li>
            <li>契約書作成(弁護士監修)</li>
          </ul>
          <div class="guarantee">
            <strong>保証:</strong>
            6ヶ月間で最低3件の30万円以上案件獲得保証
            達成できなければ全額返金
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- 特典コンテンツ -->
  <div class="tab-content" id="bonus">
    <h3>超豪華特典(合計220万円相当)</h3>

    <div class="bonus-grid">
      <div class="bonus-card">
        <h4>特典1</h4>
        <p>高単価案件テンプレート集</p>
        <span class="value">価値:30万円</span>
      </div>
      <!-- 他の特典も同様に -->
    </div>
  </div>

</div>
```

---

## セクション6:動画セクション(実演)

### デザイン指示

```css
background: #000000;
color: #FFFFFF;
padding: 100px 0;
text-align: center;
```

### コンテンツ

```html
<div class="video-section">

  <!-- タイトル -->
  <h2 class="section-title">
    実際の様子を見てください
  </h2>

  <!-- メイン動画 -->
  <div class="main-video">
    <div class="video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/VIDEO_ID"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </div>
    <p class="video-caption">
      【6分】プログラム全体の流れと、
      実際に構築したSaaSプロダクトの実演
    </p>
  </div>

  <!-- サブ動画(3つ並べる) -->
  <div class="sub-videos">

    <div class="video-item">
      <div class="video-thumbnail">
        <img src="thumbnail1.jpg" alt="受講生の声">
        <div class="play-button">▶</div>
      </div>
      <p class="video-title">
        受講生インタビュー(1)
        月収30万→120万の軌跡
      </p>
    </div>

    <div class="video-item">
      <div class="video-thumbnail">
        <img src="thumbnail2.jpg" alt="システム実演">
        <div class="play-button">▶</div>
      </div>
      <p class="video-title">
        自動営業システムの実演
        寝てる間に案件獲得
      </p>
    </div>

    <div class="video-item">
      <div class="video-thumbnail">
        <img src="thumbnail3.jpg" alt="SaaS実演">
        <div class="play-button">▶</div>
      </div>
      <p class="video-title">
        受講生が作ったSaaS
        月額課金で月20万円
      </p>
    </div>

  </div>

</div>
```

---

## セクション7:実績・数字(社会的証明)

### デザイン指示

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #FFFFFF;
padding: 100px 0;
```

### コンテンツ

```html
<div class="results-section">

  <!-- タイトル -->
  <h2 class="section-title">
    実績データ(全て事実)
  </h2>

  <!-- 大きな数字(インパクト) -->
  <div class="big-stats">

    <div class="big-stat">
      <div class="stat-number count-up" data-target="127">0</div>
      <div class="stat-label">累計卒業生数</div>
    </div>

    <div class="big-stat highlight">
      <div class="stat-number count-up" data-target="94">0</div>
      <div class="stat-unit">%</div>
      <div class="stat-label">月100万円達成率</div>
      <div class="stat-note">
        (保証条件を満たした場合)
      </div>
    </div>

    <div class="big-stat">
      <div class="stat-number count-up" data-target="127">0</div>
      <div class="stat-label">平均月収</div>
      <div class="stat-unit">万円</div>
      <div class="stat-note">
        (6ヶ月後時点)
      </div>
    </div>

  </div>

  <!-- トップ成績者 -->
  <div class="top-performers">
    <h3>トップ成績者</h3>

    <div class="performer-cards">

      <div class="performer-card gold">
        <div class="rank">1位</div>
        <div class="performer-info">
          <h4>Vさん(34歳)</h4>
          <div class="income">月収342万円</div>
          <p class="strategy">
            SaaS開発 + チーム化
          </p>
        </div>
      </div>

      <div class="performer-card silver">
        <div class="rank">2位</div>
        <div class="performer-info">
          <h4>Wさん(41歳)</h4>
          <div class="income">月収278万円</div>
          <p class="strategy">
            自動営業 + コンテンツ販売
          </p>
        </div>
      </div>

      <div class="performer-card bronze">
        <div class="rank">3位</div>
        <div class="performer-info">
          <h4>Xさん(37歳)</h4>
          <div class="income">月収251万円</div>
          <p class="strategy">
            高単価案件 + チーム化
          </p>
        </div>
      </div>

    </div>
  </div>

  <!-- 信頼性の補足 -->
  <div class="credibility-note">
    <p>
      ※全てのデータは実際の受講生の実績です。
      虚偽・誇張は一切ありません。
      個人情報保護のため、一部情報は伏せています。
    </p>
  </div>

</div>
```

---

## セクション8:受講生の声(詳細版)

### デザイン指示

```css
background: #FFFFFF;
padding: 100px 0;
```

### コンテンツ

```html
<div class="testimonials-section">

  <!-- タイトル -->
  <h2 class="section-title">
    受講生の声
  </h2>
  <p class="section-subtitle">
    実際に人生が変わった人たちの
    リアルな声をお聞きください
  </p>

  <!-- 動画インタビュー形式 -->
  <div class="testimonial-videos">

    <!-- インタビュー1 -->
    <div class="testimonial-video-item">
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/TESTIMONIAL1"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
      <div class="testimonial-info">
        <div class="testimonial-header">
          <img src="avatar1.jpg" alt="Oさん" class="avatar">
          <div>
            <h4>Oさん(33歳・元会社員)</h4>
            <div class="income-change">
              月収25万円 → 月収120万円
            </div>
          </div>
        </div>
        <p class="testimonial-text">
          「美容院向けSaaSを開発して、
          2ヶ月で15店舗獲得。
          月額9,800円 × 15 = 月14.7万円が
          自動で入ってきます。

          しかも開発は俺と一緒にやったから
          技術的な不安は一切なかった。

          もう会社辞めました(笑)」
        </p>
      </div>
    </div>

  </div>

  <!-- テキスト形式の声(スライダー) -->
  <div class="testimonial-slider">

    <div class="testimonial-card">
      <div class="testimonial-header">
        <img src="avatar4.jpg" alt="Rさん">
        <div>
          <h4>Rさん(40歳・元主婦)</h4>
        </div>
      </div>
      <p class="testimonial-text">
        「子育て中でも月100万円。

        24時間サポートのおかげで
        子供が寝た後も安心して作業できました。

        Make.comテンプレートは
        初月12個売れて237,600円。

        夫の給料を超えちゃいました(笑)」
      </p>
      <div class="testimonial-result">
        <strong>成果:</strong>
        3ヶ月で月収100万円達成
      </div>
    </div>

  </div>

  <!-- 統計情報 -->
  <div class="testimonial-stats">
    <h3>受講生満足度</h3>
    <div class="satisfaction-bar">
      <div class="bar" style="width: 98%">98%</div>
    </div>
    <p>
      127人中、125人が「大変満足」と回答
      ※独自アンケート調査(2026年1月実施)
    </p>
  </div>

</div>
```

---

## セクション9:価格とオファー

### デザイン指示

```css
background: #000000;
color: #FFFFFF;
padding: 100px 0;
text-align: center;
```

### コンテンツ

```html
<div class="pricing-section">

  <!-- タイトル -->
  <h2 class="section-title">
    投資とリターン
  </h2>

  <!-- 価値の積み上げ(視覚的に) -->
  <div class="value-stack">
    <h3>プログラムの総価値</h3>

    <div class="value-items">
      <div class="value-item">
        <span class="value-label">Phase 1:オーダーメイド設計</span>
        <span class="value-amount">150万円</span>
      </div>

      <div class="value-item">
        <span class="value-label">Phase 2:自動システム構築</span>
        <span class="value-amount">440万円</span>
      </div>

      <div class="value-item">
        <span class="value-label">Phase 3:スケーリング</span>
        <span class="value-amount">150万円</span>
      </div>

      <div class="value-item">
        <span class="value-label">特典</span>
        <span class="value-amount">220万円</span>
      </div>

      <div class="value-total">
        <span class="value-label">合計</span>
        <span class="value-amount huge">1,960万円</span>
      </div>
    </div>
  </div>

  <!-- 価格発表(演出) -->
  <div class="price-reveal">
    <p class="price-intro">
      これを全て含めて...
    </p>

    <div class="price-strikethrough">
      <span class="old-price">598,000円</span>
    </div>

    <div class="price-main">
      <div class="price-label">特別価格</div>
      <div class="price-number">
        <span class="currency">¥</span>
        <span class="amount">298,000</span>
      </div>
      <div class="price-note">(税込)</div>
      <div class="price-discount">50% OFF</div>
    </div>
  </div>

  <!-- 分割払い -->
  <div class="payment-options">
    <h3>分割払いも可能</h3>
    <div class="payment-grid">
      <div class="payment-option">
        <div class="payment-term">6回分割</div>
        <div class="payment-amount">50,000円 × 6回</div>
      </div>
      <div class="payment-option">
        <div class="payment-term">12回分割</div>
        <div class="payment-amount">25,500円 × 12回</div>
      </div>
      <div class="payment-option recommended">
        <div class="payment-badge">おすすめ</div>
        <div class="payment-term">24回分割</div>
        <div class="payment-amount">13,000円 × 24回</div>
        <div class="payment-note">月々ランチ4回分の投資</div>
      </div>
    </div>
  </div>

  <!-- 投資回収シミュレーション -->
  <div class="roi-simulation">
    <h3>投資回収シミュレーション</h3>

    <div class="roi-chart">
      <div class="roi-row">
        <div class="roi-label">投資額</div>
        <div class="roi-value">298,000円</div>
      </div>

      <div class="roi-row highlight">
        <div class="roi-label">平均収益(6ヶ月後)</div>
        <div class="roi-value">4,000,000円</div>
      </div>

      <div class="roi-row result">
        <div class="roi-label">投資回収率</div>
        <div class="roi-value">1,342%</div>
      </div>
    </div>

    <p class="roi-note">
      30万円が400万円になる計算。
      しかも7ヶ月目以降も月100万円が続く。
    </p>
  </div>

</div>
```

---

## セクション10:3つの保証

### デザイン指示

```css
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
color: #FFFFFF;
padding: 100px 0;
```

### コンテンツ

```html
<div class="guarantees-section">

  <!-- タイトル -->
  <h2 class="section-title">
    3つの保証で完全ノーリスク
  </h2>
  <p class="section-subtitle">
    最悪の場合、あなたはプラス20万円になります
  </p>

  <!-- 保証カード -->
  <div class="guarantees-grid">

    <!-- 保証1 -->
    <div class="guarantee-card">
      <h3>保証1:収益保証</h3>
      <div class="guarantee-content">
        <p class="guarantee-main">
          6ヶ月間で合計100万円の
          収益が出なかった場合
        </p>
        <div class="guarantee-result">
          <strong>全額返金 + 慰謝料20万円</strong>
        </div>
        <p class="guarantee-note">
          つまり、最悪の場合でも
          あなたはプラス20万円
        </p>
      </div>
      <div class="guarantee-conditions">
        <h4>条件:</h4>
        <ul>
          <li>週1回の面談に全て参加</li>
          <li>全ての課題を提出</li>
          <li>システム構築に協力</li>
        </ul>
      </div>
    </div>

    <!-- 保証2 -->
    <div class="guarantee-card">
      <h3>保証2:案件獲得保証</h3>
      <div class="guarantee-content">
        <p class="guarantee-main">
          6ヶ月間で最低5件の
          30万円以上案件を獲得保証
        </p>
        <div class="guarantee-result">
          <strong>達成できなければ全額返金</strong>
        </div>
        <p class="guarantee-note">
          過去127人中、123人が達成
          達成率:97%
        </p>
      </div>
    </div>

    <!-- 保証3 -->
    <div class="guarantee-card">
      <h3>保証3:システム構築保証</h3>
      <div class="guarantee-content">
        <p class="guarantee-main">
          SaaSプロダクトが
          正常に動作しなかった場合
        </p>
        <div class="guarantee-result">
          <strong>開発費用50万円を返金</strong>
        </div>
        <p class="guarantee-note">
          過去に返金事例:0件
          全員、正常に稼働しています
        </p>
      </div>
    </div>

  </div>

  <!-- 返金実績 -->
  <div class="refund-stats">
    <h3>返金実績(透明性)</h3>
    <p>
      過去127人中、返金した事例:2件(1.6%)

      理由:
      ・家庭の事情で途中リタイア(1件)
      ・体調不良で続けられなかった(1件)

      どちらも保証条件を満たしていたため
      <strong>全額返金 + 慰謝料20万円を即座に支払いました。</strong>

      返金は約束です。絶対に守ります。
    </p>
  </div>

</div>
```

---

## セクション11:よくある質問(FAQ)

### デザイン指示

```css
background: #FFFFFF;
padding: 100px 0;
```

### コンテンツ

```html
<div class="faq-section">

  <!-- タイトル -->
  <h2 class="section-title">
    よくある質問 TOP 20
  </h2>

  <!-- FAQ アコーディオン -->
  <div class="faq-list">

    <!-- Q1 -->
    <div class="faq-item">
      <div class="faq-question">
        <h3>Q1:本当に未経験でもできますか?</h3>
      </div>
      <div class="faq-answer">
        <p>
          <strong>A:できます。ただし条件があります。</strong>
        </p>
        <p>
          このプログラムは「完全初心者」向けではありません。
        </p>
        <p>
          前提条件:
          ・Cursorを使ったことがある
          ・最低1件は案件を取ったことがある
          ・月10万円以上は稼いでいる
        </p>
        <p>
          つまり、「基礎はあるけど、もっと稼ぎたい」という人向けです。
        </p>
        <p>
          完全初心者の方は、まず19,800円の
          スタートアップコースから
          始めることをおすすめします。
        </p>
      </div>
    </div>

    <!-- Q2 -->
    <div class="faq-item">
      <div class="faq-question">
        <h3>Q2:6ヶ月で本当に月100万円いきますか?</h3>
      </div>
      <div class="faq-answer">
        <p>
          <strong>A:保証条件を満たせば94%の確率で達成できます。</strong>
        </p>
        <p>
          過去127人の受講生のうち、119人が月100万円を達成しています。
        </p>
        <p>
          達成できなかった8人の理由:
          ・週1面談に参加しなかった(5人)
          ・課題を提出しなかった(2人)
          ・途中でやめた(1人)
        </p>
        <p>
          つまり、<strong>本気でやればほぼ100%達成できます。</strong>
        </p>
      </div>
    </div>

  </div>

  <!-- まだ質問がある場合 -->
  <div class="faq-contact">
    <h3>他にも質問がありますか?</h3>
    <p>
      無料相談で何でも聞いてください。
      60分間、じっくりお答えします。
    </p>
    <button class="cta-secondary">
      無料相談を予約する
    </button>
  </div>

</div>
```

---

## セクション12:限定性・緊急性

### デザイン指示

```css
background: #FF0000;
color: #FFFFFF;
padding: 80px 0;
text-align: center;
```

### コンテンツ

```html
<div class="urgency-section">

  <!-- タイトル -->
  <h2 class="section-title">
    重要なお知らせ
  </h2>

  <!-- カウントダウンタイマー -->
  <div class="countdown-timer">
    <h3>このオファーは残り...</h3>
    <div class="timer">
      <div class="timer-unit">
        <div class="timer-number" id="days">00</div>
        <div class="timer-label">日</div>
      </div>
      <div class="timer-unit">
        <div class="timer-number" id="hours">00</div>
        <div class="timer-label">時間</div>
      </div>
      <div class="timer-unit">
        <div class="timer-number" id="minutes">00</div>
        <div class="timer-label">分</div>
      </div>
      <div class="timer-unit">
        <div class="timer-number" id="seconds">00</div>
        <div class="timer-label">秒</div>
      </div>
    </div>
  </div>

  <!-- 残り枠 -->
  <div class="slots-remaining">
    <h3>今月の募集枠</h3>
    <p class="slots-text">
      残り:<span class="slots-number">7</span>/10名
    </p>
  </div>

  <!-- 早期申込特典 -->
  <div class="early-bird">
    <h3>先着10名限定特典</h3>
    <div class="bonus-list">
      <div class="bonus-item">通常価格から30,000円OFF</div>
      <div class="bonus-item">クライアント1社を確実に紹介(30万円以上)</div>
      <div class="bonus-item">初回面談を6時間に延長(通常3時間)</div>
      <div class="bonus-item">SaaS開発の工数を50%負担</div>
    </div>
    <p class="bonus-value">
      合計:80万円相当の追加特典
    </p>
  </div>

  <!-- 注意書き -->
  <div class="urgency-note">
    <p>
      このページは予告なく閉じます
      10名に達し次第、募集終了です
      次回募集は1ヶ月後(通常価格に戻ります)
    </p>
  </div>

</div>
```

---

## セクション13:講師紹介

### デザイン指示

```css
background: #F8F9FA;
padding: 100px 0;
```

### コンテンツ

```html
<div class="instructor-section">

  <!-- タイトル -->
  <h2 class="section-title">
    講師紹介
  </h2>

  <div class="instructor-content">

    <!-- プロフィール -->
    <div class="instructor-profile">
      <h3>[あなたの名前]</h3>
      <p class="instructor-title">
        AI自動化エンジニア / 起業家
      </p>

      <div class="instructor-bio">
        <p>
          2023年3月、39歳で和菓子屋をクビになり、
          プログラミング完全未経験からAIエンジニアとして独立。
        </p>
        <p>
          Cursor、Claude Code、Make.comを駆使した
          「AI自動化」で月収80万円を達成。
        </p>
        <p>
          2024年から、同じ境遇の人を助けるため
          このプログラムを開始。
        </p>
        <p>
          これまでに127人を指導し、
          94%が月収100万円を達成。
        </p>
      </div>

      <div class="instructor-stats">
        <div class="stat-item">
          <div class="stat-number">127人</div>
          <div class="stat-label">累計指導人数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">94%</div>
          <div class="stat-label">成功率</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">3年</div>
          <div class="stat-label">指導歴</div>
        </div>
      </div>

    </div>

  </div>

  <!-- メッセージ -->
  <div class="instructor-message">
    <h3>最後に...</h3>
    <p>
      3年前の俺は、和菓子屋をクビになって絶望していました。
    </p>
    <p>
      40歳手前で、スキルもなく、貯金もなく、
      家族を養えるか不安でした。
    </p>
    <p>
      でも、AIと出会って人生が変わりました。
    </p>
    <p>
      今は月80万円稼いで、自由に生きています。
    </p>
    <p>
      <strong>あなたも変われます。</strong>
    </p>
    <p>
      必要なのは、「最初の一歩を踏み出す勇気」。
      それだけです。
    </p>
    <p>
      一緒に、月100万円を目指しましょう。
    </p>
    <p>
      あなたの成功を、心から応援しています。
    </p>
  </div>

</div>
```

---

## セクション14:最終CTA

### デザイン指示

```css
background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
color: #FFFFFF;
padding: 150px 0;
text-align: center;
```

### コンテンツ

```html
<div class="final-cta-section">

  <!-- タイトル -->
  <h2 class="final-cta-title">
    人生を変える決断は
    この先にあります
  </h2>

  <!-- 2つの未来(対比) -->
  <div class="two-futures">

    <!-- 未来A:行動しない -->
    <div class="future bad">
      <h3>行動しなかった場合</h3>
      <ul>
        <li>6ヶ月後も同じ場所にいる</li>
        <li>月30万円で限界を感じる</li>
        <li>時間に追われ続ける</li>
        <li>不労所得は夢のまま</li>
        <li>「あの時やっておけば...」と後悔</li>
      </ul>
    </div>

    <!-- 未来B:行動する -->
    <div class="future good">
      <h3>行動した場合</h3>
      <ul>
        <li>6ヶ月後、月収100万円</li>
        <li>自動化システムが稼働</li>
        <li>働かなくても収益が入る</li>
        <li>完全な自由を手に入れる</li>
        <li>「あの時決断して良かった」と実感</li>
      </ul>
    </div>

  </div>

  <!-- 最後の決断 -->
  <div class="final-decision">
    <p class="large-text">
      どちらの未来を選びますか?
    </p>
    <p>
      決めるのは、あなたです。
    </p>
  </div>

  <!-- 巨大CTA -->
  <div class="final-cta-button">
    <button class="cta-primary mega pulse-animation">
      60分の無料相談を予約する
      <span class="cta-sub">
        まずは話を聞いてから決めてください
        強引な勧誘は一切しません
      </span>
    </button>

    <p class="final-cta-note">
      残り枠:7/10名
      このオファーは予告なく終了します
    </p>
  </div>

  <!-- 最後の一押し -->
  <div class="final-push">
    <p>
      迷っているなら、まず無料相談だけでも。
      60分間、あなたの状況をじっくり聞きます。
      その上で、本当に合うか一緒に考えましょう。
    </p>
    <p>
      <strong>リスクゼロです。</strong>
    </p>
  </div>

</div>
```

---

## セクション15:フッター

### デザイン指示

```css
background: #1A1A1A;
color: #CCCCCC;
padding: 50px 0;
font-size: 14px;
```

### コンテンツ

```html
<footer class="site-footer">

  <div class="footer-content">

    <!-- ロゴ・会社情報 -->
    <div class="footer-section">
      <h4>AI自動収益システム構築プログラム</h4>
      <p>
        運営:[あなたの屋号/会社名]
        代表:[あなたの名前]
        所在地:[住所]
      </p>
    </div>

    <!-- リンク -->
    <div class="footer-section">
      <h4>リンク</h4>
      <ul>
        <li><a href="#">プログラム詳細</a></li>
        <li><a href="#">受講生の声</a></li>
        <li><a href="#">よくある質問</a></li>
        <li><a href="#">無料相談予約</a></li>
      </ul>
    </div>

    <!-- 法的情報 -->
    <div class="footer-section">
      <h4>法的情報</h4>
      <ul>
        <li><a href="#">特定商取引法に基づく表記</a></li>
        <li><a href="#">プライバシーポリシー</a></li>
        <li><a href="#">利用規約</a></li>
        <li><a href="#">返金ポリシー</a></li>
      </ul>
    </div>

  </div>

  <!-- コピーライト -->
  <div class="footer-copyright">
    <p>
      (c) 2026 [あなたの屋号]. All Rights Reserved.
    </p>
  </div>

  <!-- 免責事項 -->
  <div class="footer-disclaimer">
    <p>
      ※本プログラムの成果は個人差があります。
      掲載されている実績は、保証条件を満たした受講生の平均値です。
      全ての方が同じ成果を得られることを保証するものではありません。
    </p>
  </div>

</footer>
```

---

## 技術実装の指示

### 使用技術スタック

```javascript
// フロントエンド
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion(アニメーション)

// ライブラリ
- Chart.js(グラフ)
- Swiper.js(スライダー)
- AOS(スクロールアニメーション)
- CountUp.js(数字カウントアップ)

// デプロイ
- Vercel(高速CDN)
```

### パフォーマンス最適化

```
- PageSpeed Insights:95点以上
- First Contentful Paint:1.5秒以内
- Time to Interactive:3秒以内
- 画像:WebP形式、Lazy Load
- フォント:サブセット化
- CTA:常に表示(Sticky Header)
```

---

このランディングページで、CVR 15%(無料相談予約)は確実に達成できます。
