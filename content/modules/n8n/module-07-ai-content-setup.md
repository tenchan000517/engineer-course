# AIコンテンツ自動生成の準備

**所要時間**: 45分
**難易度**: ⭐⭐☆☆☆

---

## このモジュールで学ぶこと

- AIリサーチ結果をスプレッドシートに自動反映するシステムの構築
- 投稿企画管理用シート（config/ideas/archive）の作成
- Google Gemini APIの設定
- n8nでのGemini Credential設定
- GASのWebアプリデプロイとn8nからの呼び出し

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

- AIリサーチ → ideasシートへの自動反映フローを構築できる
- GASをWebアプリとしてデプロイし、n8nから呼び出せる
- Gemini APIキーを取得し、n8nで使用できる状態にできる

---

## 事前準備

### 必要なもの

- Module 04で作成したn8n-testスプレッドシート
- Module 04で設定したGoogle Sheets認証情報
- Googleアカウント（Gemini API用）
- AIリサーチツール（Antigravity等）

### 前提知識

- Module 05: 投稿管理シート設計
- Module 06: シートからInstagram投稿

---

## セクション1: システム全体像の理解

### コンテンツ自動生成の流れ

AIを活用してInstagram投稿コンテンツを自動生成するシステムを構築します。

```
[AIリサーチ] Antigravity等でトレンド調査
    ↓
[JSON出力] 投稿企画を構造化データで出力
    ↓
[configシート] JSONを一時保存
    ↓
[n8n → GAS] JSONをパースしてideasシートに反映
    ↓
[ideasシート] 投稿企画を管理（87件程度/月）
    ↓
[追加リサーチ → 投稿作成] 次のモジュールで実装
    ↓
[postsシート → Instagram投稿] Module 06で構築済み
```

### 投稿企画のカテゴリ

投稿企画は5つのカテゴリに分類されます。

| カテゴリ | 記号 | 内容 |
|---------|------|------|
| 比較・対決系 | A | ツール同士の比較、どっちが良いか |
| 時短・効率化系 | B | 作業効率化、時間短縮テクニック |
| 先端トレンド・自動化系 | C | 最新ツール、自動化ノウハウ |
| ネガティブ・警告系 | D | 注意喚起、リスク情報 |
| まとめ・ランキング系 | E | ツールまとめ、ランキング |

### 投稿運用の設計

- 1日3投稿（異なるカテゴリから選択）
- カテゴリをローテーション（A→B→C→D→E→A...）
- 枯渇したカテゴリはスキップ
- 月1回リサーチを実行して企画を補充

### チェックポイント

- [ ] AIリサーチ → ideasシートの流れを理解した
- [ ] 5つのカテゴリを理解した
- [ ] 投稿運用の設計を理解した

---

## セクション2: 管理用シートの作成

### Step 1: Apps Scriptを開く

1. n8n-testスプレッドシートを開く
2. メニューから **拡張機能** → **Apps Script** を選択

### Step 2: シート作成スクリプトを貼り付け

以下のコードをエディタに貼り付けます。

```javascript
function setupResearchSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ===== configシート =====
  let configSheet = ss.getSheetByName('config');
  if (configSheet) ss.deleteSheet(configSheet);

  configSheet = ss.insertSheet('config');

  const configHeader = configSheet.getRange('A1');
  configHeader.setValue('json_data');
  configHeader.setBackground('#4a86e8');
  configHeader.setFontColor('#ffffff');
  configHeader.setFontWeight('bold');

  const jsonCell = configSheet.getRange('A2');
  jsonCell.setValue('');
  jsonCell.setBackground('#f3f3f3');
  jsonCell.setVerticalAlignment('top');
  jsonCell.setWrap(true);

  configSheet.setColumnWidth(1, 800);
  configSheet.setRowHeight(2, 400);

  // ===== ideasシート =====
  let ideasSheet = ss.getSheetByName('ideas');
  if (ideasSheet) ss.deleteSheet(ideasSheet);

  ideasSheet = ss.insertSheet('ideas');

  const ideasHeaders = [
    'idea_id', 'month', 'title', 'tools', 'content_type',
    'category', 'research_points', 'status', 'adopted_post_id', 'created_at'
  ];

  const ideasHeaderRange = ideasSheet.getRange(1, 1, 1, ideasHeaders.length);
  ideasHeaderRange.setValues([ideasHeaders]);
  ideasHeaderRange.setBackground('#34a853');
  ideasHeaderRange.setFontColor('#ffffff');
  ideasHeaderRange.setFontWeight('bold');

  ideasSheet.setFrozenRows(1);
  ideasSheet.setColumnWidth(3, 400); // title
  ideasSheet.setColumnWidth(7, 300); // research_points

  // ===== archiveシート =====
  let archiveSheet = ss.getSheetByName('archive');
  if (archiveSheet) ss.deleteSheet(archiveSheet);

  archiveSheet = ss.insertSheet('archive');

  // postsと同じヘッダー
  const archiveHeaders = [
    'post_id', 'post_type', 'status', 'caption', 'hashtags', 'media_ids',
    'scheduled_at', 'published_at', 'ig_post_id', 'share_to_feed',
    'thumb_offset_ms', 'error_message', 'retry_count', 'created_at',
    'updated_at', 'notes'
  ];

  const archiveHeaderRange = archiveSheet.getRange(1, 1, 1, archiveHeaders.length);
  archiveHeaderRange.setValues([archiveHeaders]);
  archiveHeaderRange.setBackground('#fbbc04');
  archiveHeaderRange.setFontColor('#000000');
  archiveHeaderRange.setFontWeight('bold');

  archiveSheet.setFrozenRows(1);

  Logger.log('config, ideas, archiveシート作成完了');
}
```

### Step 3: スクリプトを実行

1. **保存**（Ctrl+S）
2. 関数選択ドロップダウンで `setupResearchSheets` を選択
3. **実行** ボタンをクリック
4. 初回は承認を求められるので許可

### Step 4: 結果を確認

3つのシートが作成されます。

- **config**（青いヘッダー）: JSON一時保存用
- **ideas**（緑のヘッダー）: 投稿企画管理
- **archive**（黄色のヘッダー）: 投稿済みデータ保管

### ideasシート構造

| 列名 | 説明 |
|------|------|
| idea_id | 一意のID（IDEA-001） |
| month | リサーチ月（2025-12） |
| title | 投稿タイトル |
| tools | 対象ツール（カンマ区切り） |
| content_type | 内容種別（比較/使い方/解説等） |
| category | カテゴリ記号（A〜E） |
| research_points | 追加リサーチ項目（カンマ区切り） |
| status | NEW / ADOPTED / REJECTED |
| adopted_post_id | 採用時のpost_id |
| created_at | 作成日時 |

### チェックポイント

- [ ] Apps Scriptを開けた
- [ ] スクリプトを実行できた
- [ ] configシートが作成された（青いヘッダー）
- [ ] ideasシートが作成された（緑のヘッダー）
- [ ] archiveシートが作成された（黄色のヘッダー）

---

## セクション3: JSON→ideas変換GASの作成

### Step 1: doPost関数を追加

Apps Scriptに以下のコードを追加します。これはn8nからPOSTリクエストを受け取り、JSONをideasシートに変換する関数です。

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('config');
  const ideasSheet = ss.getSheetByName('ideas');

  // POSTされたJSONを取得
  const jsonStr = e.postData.contents;

  // configシートにも保存（履歴用）
  configSheet.getRange('A2').setValue(jsonStr);

  // JSONパース
  const data = JSON.parse(jsonStr);
  const month = data.month;
  const smallCategories = data.categories.small;

  // 既存データの最終行を取得
  const lastRow = ideasSheet.getLastRow();

  // 既存のidea_idから最大番号を取得
  let maxId = 0;
  if (lastRow > 1) {
    const existingIds = ideasSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    existingIds.forEach(row => {
      const match = row[0].toString().match(/IDEA-(\d+)/);
      if (match) {
        maxId = Math.max(maxId, parseInt(match[1]));
      }
    });
  }

  // 新しい行データを作成
  const now = new Date();
  const rows = smallCategories.map((item, index) => {
    const ideaId = 'IDEA-' + String(maxId + index + 1).padStart(3, '0');
    return [
      ideaId,
      month,
      item.title,
      item.tools.join(', '),
      item.content_type,
      item.category,
      item.research_points.join(', '),
      'NEW',
      '',
      now
    ];
  });

  // ideasシートに追加
  if (rows.length > 0) {
    const startRow = lastRow + 1;
    ideasSheet.getRange(startRow, 1, rows.length, 10).setValues(rows);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, count: rows.length })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### Step 2: Webアプリとしてデプロイ

1. **デプロイ** → **新しいデプロイ** をクリック
2. **種類の選択** で **ウェブアプリ** を選択
3. 設定：
   - **説明**: JSON to Ideas
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
4. **デプロイ** をクリック
5. 表示された **URL** をコピーして保存

![GASデプロイ](/n8n-setup/97-gas-deploy.png)

### チェックポイント

- [ ] doPost関数を追加できた
- [ ] Webアプリとしてデプロイできた
- [ ] URLをコピーした

---

## セクション4: Gemini APIキーの取得

AIコンテンツ生成にはGoogle Gemini APIを使用します。

### Step 1: Google AI Studioにアクセス

以下のURLにアクセスします。

https://aistudio.google.com/apikey

### Step 2: APIキーを作成

1. **Create API Key** をクリック
2. プロジェクトを選択（新規または既存）
3. キーが生成される
4. **コピーして安全な場所に保存**

![Gemini APIキー作成](/n8n-setup/92-gemini-api-key.png)

### 注意事項

- APIキーは一度しか表示されない場合があります
- 安全な場所に保管してください
- 公開リポジトリには絶対に含めないでください

### チェックポイント

- [ ] Google AI Studioにアクセスできた
- [ ] APIキーを作成/確認できた
- [ ] APIキーを安全な場所に保存した

---

## セクション5: n8nでGemini Credentialを設定

### Step 1: n8nを開く

ブラウザでn8nにアクセスします。

### Step 2: Credentialを追加

1. 左メニューから **Credentials** を選択
2. **Add Credential** をクリック
3. 検索欄に「Gemini」と入力
4. **Google Gemini(PaLM) Api** を選択

![Credential検索](/n8n-setup/93-n8n-credential-search.png)

### Step 3: APIキーを設定

1. **Host** はそのまま（`https://generativelanguage.googleapis.com`）
2. **API Key** に取得したAPIキーを入力
3. 右上の **Save** をクリック

![Credential設定](/n8n-setup/94-n8n-credential-form.png)

### チェックポイント

- [ ] n8nでCredential画面を開けた
- [ ] Google Gemini(PaLM) Apiを選択できた
- [ ] APIキーを入力して保存できた

---

## セクション6: n8nワークフローの作成

AIリサーチ結果（JSON）をideasシートに反映するワークフローを作成します。

### 完成形

```
[Manual Trigger] → [Google Sheets: Get row(s)] → [HTTP Request: POST to GAS]
```

### Step 1: ワークフロー作成

1. n8nで新しいワークフローを作成
2. 名前を「Research to Ideas」に設定

### Step 2: Manual Triggerを追加

手動実行トリガーを追加します。

### Step 3: Google Sheetsノードを追加

configシートからJSONを取得します。

| 項目 | 値 |
|------|-----|
| Action | Get row(s) in sheet |
| Credential | Google Sheets account |
| Document | n8n-test |
| Sheet | config |
| Options > Data Location on Sheet > Range Definition | Fixed |

![Google Sheets設定](/n8n-setup/99-get-rows-config.png)

実行すると、config!A2のJSONデータが取得できます。

![config取得成功](/n8n-setup/100-config-get-success.png)

### Step 4: HTTP Requestノードを追加

GASにJSONをPOSTします。

| 項目 | 値 |
|------|-----|
| Method | POST |
| URL | （デプロイしたGASのURL） |
| Body Content Type | JSON |
| Specify Body | Using JSON |
| JSON | `={{ $json.json_data }}` |

### Step 5: 実行テスト

1. configシートのA2にリサーチ結果のJSONを貼り付け
2. ワークフローを実行
3. 成功すると `{ success: true, count: XX }` が返る

![HTTP Request成功](/n8n-setup/101-http-request-success.png)

4. ideasシートにデータが追加されていることを確認

### チェックポイント

- [ ] ワークフローを作成できた
- [ ] Google Sheetsでconfig!A2を取得できた
- [ ] HTTP RequestでGASを呼び出せた
- [ ] ideasシートにデータが追加された

---

## セクション7: AIリサーチプロンプト

Antigravity等のAIツールでトレンドリサーチを行う際のプロンプトです。

### リサーチプロンプト

```
目的: [ 202X年 X月 ] のAIトレンドをリサーチし、Instagram運用のための具体的な投稿戦略を立案してください。

重要: 一般的な「時短ツール」だけでなく、「Antigravity」や「n8n」のような、エンジニア界隈や先端層で話題になり始めている「次に来るトレンド」を必ず発掘してください。

出力言語: 全て日本語で出力してください。

---

## 手順

### 1. 定量的なトレンド調査 (ブラウザ使用必須)

- **YouTube**: 「AI ツール 仕事」に加え、「AI エージェント」「AI 自動化」「最新AIニュース」などのキーワードで検索し、再生数が急上昇している動画（特にここ1〜2週間のもの）を特定してください。
- **X (Twitter)**: site:x.com で「AI」に加え、「開発」「エンジニア」「自動化」「神ツール」などのキーワードを掛け合わせ、技術者層が盛り上がっている新しいツールを探してください。
- **Instagram**: リール動画で「AI」検索し、「n8n」「ワークフロー」といった少し専門的な単語を使っている投稿が伸びていないか確認してください。
- **特定キーワード確認**: 「Antigravity」「Nanobanana」「n8n」など、先月から継続して注目すべきツールの最新動向もチェックしてください。

### 2. 投稿戦略の策定

調査データに基づき、今月Instagramで投稿すべき内容を決定してください。

**小カテゴリ (93個)**:
- そのまま投稿タイトルとして使える具体的な企画案。
- 「プログラミング不要で開発」「エンジニアの仕事が変わる」「完全自動化」といった、先端ツールならではのフックを入れたタイトルを作成してください。
- 各タイトルには、追加リサーチに必要な調査項目（research_points）を3〜5個含めてください。
- **各カテゴリ（A〜E）の個数はトレンドの注目度に応じて配分してください。均等である必要はありません。**

---

## 出力形式

**必ず以下のJSONスキーマに厳密に従って出力してください。Markdown形式での出力は禁止です。**

{
  "month": "202X-XX",
  "categories": {
    "small": [
      {
        "title": "投稿タイトル",
        "tools": ["ツール名1", "ツール名2"],
        "content_type": "比較 / 使い方 / 設定方法 / 解説 / 警告 / まとめ など",
        "category": "A / B / C / D / E",
        "research_points": ["調査項目1", "調査項目2", "調査項目3"]
      }
    ]
  }
}

### カテゴリ記号の定義
- **A**: 比較・対決系
- **B**: 時短・効率化系
- **C**: 先端トレンド・自動化系
- **D**: ネガティブ・警告系
- **E**: まとめ・ランキング系

---

## 制約事項

1. **出力はJSON形式のみ**。Markdownや説明文は不要です。
2. 言語は日本語のみを使用してください。
3. 「ChatGPTでメール作成」のようなありきたりなネタだけでなく、「一般層がまだ知らないが、見たら驚くような高度な活用」を掘り下げてください。
4. ブラウザを使って実際の検索結果を確認し、空想ではなく事実に基づいたデータを集めてください。
5. 小カテゴリは**93個**を必ず出力してください。
```

### 運用フロー

1. 月1回、上記プロンプトでAIリサーチを実行
2. 出力されたJSONをconfig!A2に貼り付け
3. n8nワークフローを実行
4. ideasシートに企画が追加される

### チェックポイント

- [ ] リサーチプロンプトを理解した
- [ ] JSONスキーマを理解した
- [ ] 運用フローを理解した

---

## トラブルシューティング

### スクリプト関数が見つかりません: doPost

**症状**: n8nからGASを呼び出すと「スクリプト関数が見つかりません: doPost」エラー

**解決方法**:
1. doPost関数がGASに追加されていることを確認
2. **新しいデプロイ**を作成する（既存デプロイの更新ではなく）
3. 新しいURLを使用する

### Cannot read properties of undefined (reading 'small')

**症状**: GAS実行時に「Cannot read properties of undefined (reading 'small')」エラー

**解決方法**:
HTTP Requestノードの設定を確認：
- Specify Body: **Using JSON**（Using Fields Belowではなく）
- JSON: `={{ $json.json_data }}`

---

## まとめ

### このモジュールで学んだこと

- AIリサーチ結果をスプレッドシートに自動反映するシステム設計
- config/ideas/archiveシートの作成と役割
- GASのWebアプリデプロイとn8nからの呼び出し
- Gemini APIキーの取得とn8nでの設定
- AIリサーチプロンプトの構造

### 次のステップ

次のモジュールでは、ideasシートの企画を元に追加リサーチを行い、投稿内容を自動生成するワークフローを構築します。

---

## 参考資料

- [Google AI Studio](https://aistudio.google.com/apikey)
- [Google Gemini node documentation | n8n Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.googlegemini/)
- [Google Gemini(PaLM) credentials | n8n Docs](https://docs.n8n.io/integrations/builtin/credentials/googleai/)
- [Web Apps | Apps Script](https://developers.google.com/apps-script/guides/web)

---

## よくある質問

**Q: ideasシートの企画は全部投稿しますか？**
A: いいえ。statusをADOPTEDに変更したものだけがpostsシートに移行され、投稿されます。不要な企画はREJECTEDにできます。

**Q: リサーチは毎月実行する必要がありますか？**
A: 推奨です。AIトレンドは変化が早いため、月1回のリサーチで最新情報を取り入れることをお勧めします。

**Q: Gemini APIは無料ですか？**
A: 無料枠があります。詳細はGoogle AI Studioで確認してください。

**Q: 93件全部出力されないことがあります**
A: AIの出力には揺れがあるため、多少の誤差は許容してください。月の運用に支障がなければ問題ありません。

**Q: カテゴリの配分が偏っています**
A: トレンドに応じた配分をAIに任せているため、偏りは想定内です。枯渇したカテゴリはスキップする運用で対応します。
