# 画像付き投稿

**所要時間**: 25分
**難易度**: ⭐⭐⭐⭐☆

このモジュールの最後に[ワークフローJSONダウンロード](#ワークフローjsonダウンロード)があります。

---

## このモジュールで学ぶこと

- Nanobanana（Gemini）を使った画像生成とX投稿の統合
- X Media Upload APIの仕組み
- n8nから画像付きツイートを自動投稿する方法

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. Nanobananaで生成した画像をXに投稿できる
2. tweepyでMedia Upload APIを使用できる
3. 画像生成から投稿までを一括で自動化できる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: 画像付き投稿の仕組み](#セクション1-画像付き投稿の仕組み)
- [セクション2: Python APIサーバーの更新](#セクション2-python-apiサーバーの更新)
- [セクション3: n8nワークフローの作成](#セクション3-n8nワークフローの作成)
- [セクション4: テスト投稿の実行](#セクション4-テスト投稿の実行)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [ワークフローJSONダウンロード](#ワークフローjsonダウンロード)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

- Module 01〜05が完了していること
- [Nanobanana画像生成講座](/category/nanobanana-image-generation/nanobanana-beginner)のModule 02（環境構築）が完了していること
- Google AI StudioのAPIキー（GOOGLE_API_KEY）
- Python環境に `google-genai` がインストール済み

### 前提知識

- Module 04で学んだHTTP Requestノードの基本設定
- Nanobanana講座で学んだ画像生成の基本

### 追加パッケージのインストール

まだインストールしていない場合は、以下を実行します。

**PowerShell、Git Bash共通**:

```bash
pip install google-genai
```

---

## セクション1: 画像付き投稿の仕組み

### 1-1. システム全体像

Nanobanana画像生成とX投稿を統合するシステムの流れです。

```
n8n (Docker)
    ↓ HTTP Request
Python APIサーバー
    ├── Gemini API → 画像生成
    ├── X Media Upload API → 画像アップロード
    └── X API v2 → 画像付きツイート投稿
```

### 1-2. X Media Upload APIとは

Xに画像付きツイートを投稿するには、2段階のプロセスが必要です。

| ステップ | API | 説明 |
|---------|-----|------|
| 1 | Media Upload API (v1.1) | 画像をXにアップロードし、media_idを取得 |
| 2 | Tweets API (v2) | media_idを指定してツイートを投稿 |

tweepyでは以下のように実装します。

```python
# 1. 画像アップロード（API v1.1）
media = api_v1.media_upload(filename="image.png")
media_id = media.media_id

# 2. 画像付きツイート投稿（API v2）
client.create_tweet(text="投稿内容", media_ids=[media_id])
```

### 1-3. 新しいエンドポイント

Python APIサーバーに追加する3つのエンドポイントです。

| エンドポイント | メソッド | 用途 |
|---------------|----------|------|
| `/generate-image` | POST | Nanobananaで画像生成 |
| `/post-with-image` | POST | 既存画像で画像付き投稿 |
| `/generate-and-post` | POST | 画像生成+投稿を一括実行 |

### チェックポイント

- [ ] 画像付き投稿には2段階のAPIコールが必要なことを理解した
- [ ] 3つの新エンドポイントの役割を理解した

---

## セクション2: Python APIサーバーの更新

### 2-1. x_api_server_v3.pyの作成

既存のv2に画像生成機能を追加した新バージョンを作成します。

主な追加ポイント:

1. **Google Genai クライアントの追加**
2. **API v1.1クライアントの追加**（Media Upload用）
3. **3つの新エンドポイント**

### 2-2. 環境変数の設定

v3では、認証情報を`.env`ファイルで管理します。X APIの認証情報に加えてGoogle APIキーが必要です。

#### Step 1: .envファイルの作成

`x_api_server_v3.py`と同じディレクトリに`.env`ファイルを作成します。

```
X_API_KEY=あなたのAPI_KEY
X_API_SECRET=あなたのAPI_SECRET
X_ACCESS_TOKEN=あなたのACCESS_TOKEN
X_ACCESS_TOKEN_SECRET=あなたのACCESS_TOKEN_SECRET
GOOGLE_API_KEY=あなたのGOOGLE_API_KEY
```

#### Step 2: 認証情報の取得場所

| 環境変数 | 取得場所 |
|----------|----------|
| X_API_KEY | X Developer Portal → Keys and tokens → API Key |
| X_API_SECRET | X Developer Portal → Keys and tokens → API Secret |
| X_ACCESS_TOKEN | X Developer Portal → Keys and tokens → Access Token |
| X_ACCESS_TOKEN_SECRET | X Developer Portal → Keys and tokens → Access Token Secret |
| GOOGLE_API_KEY | [Google AI Studio](https://aistudio.google.com/apikey) |

#### Step 3: python-dotenvのインストール

まだインストールしていない場合：

```bash
pip install python-dotenv
```

### 2-3. 画像生成エンドポイント

`/generate-image` エンドポイントはNanobananaで画像を生成し、Base64エンコードされた画像データを返します。

```python
@app.route('/generate-image', methods=['POST'])
def generate_image():
    """Nanobanana（Gemini）で画像生成"""
    data = request.get_json()
    prompt = data.get('prompt', '')
    aspect_ratio = data.get('aspect_ratio', '1:1')

    # Nanobanana（Gemini）で画像生成
    response = genai_client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['IMAGE'],
            image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
        )
    )

    # 画像データをBase64エンコードして返す
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    return jsonify({
        'success': True,
        'image_base64': image_base64
    })
```

### 2-4. 画像付き投稿エンドポイント

`/post-with-image` エンドポイントはBase64画像を受け取り、Xに投稿します。

```python
@app.route('/post-with-image', methods=['POST'])
def post_with_image():
    """画像付きツイート投稿"""
    data = request.get_json()
    text = data.get('text', '')
    image_base64 = data.get('image_base64', '')

    # Base64デコードして一時ファイルに保存
    image_data = base64.b64decode(image_base64)
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
        tmp_file.write(image_data)
        tmp_path = tmp_file.name

    # 画像をアップロード（API v1.1）
    media = api_v1.media_upload(filename=tmp_path)

    # 画像付きツイートを投稿（API v2）
    response = client.create_tweet(text=text, media_ids=[media.media_id])
```

### 2-5. 一括実行エンドポイント

`/generate-and-post` は画像生成と投稿を一度のAPIコールで実行します。これがn8nから使用する主要エンドポイントです。

リクエストパラメータ:

| パラメータ | 必須 | 説明 | 例 |
|-----------|------|------|-----|
| `text` | Yes | ツイート本文 | `"今日の一枚"` |
| `prompt` | Yes | 画像生成プロンプト | `"A cute cat"` |
| `aspect_ratio` | No | アスペクト比（デフォルト: 1:1） | `"16:9"` |

レスポンス:

```json
{
  "success": true,
  "tweet_id": "1234567890",
  "text": "今日の一枚",
  "prompt": "A cute cat",
  "aspect_ratio": "16:9",
  "media_id": "9876543210"
}
```

### 2-6. サーバーの起動

更新したスクリプトを起動します。

**PowerShellの場合**:

```powershell
python C:\engineer-course\scripts\x_api_server_v3.py
```

**Git Bashの場合**:

```bash
python /c/engineer-course/scripts/x_api_server_v3.py
```

起動時の表示:

![サーバー起動画面](/n8n-x-auto-post/images/server-v3-startup.png)

### チェックポイント

- [ ] `x_api_server_v3.py`を作成した
- [ ] 5つの認証情報を設定した（X API 4つ + Google API 1つ）
- [ ] サーバーを起動して6つのエンドポイントが表示された

---

## セクション3: n8nワークフローの作成

### 3-1. 新規ワークフロー作成

1. n8nを開く
2. 「Add Workflow」をクリック
3. ワークフロー名を「X Image Post」に変更

新規ワークフロー画面:

![新規ワークフロー](/n8n-x-auto-post/images/n8n-new-workflow.png)

### 3-2. Manual Triggerの追加

1. 「+」ボタンをクリック
2. 「Trigger manually」を選択

トリガー選択画面:

![トリガー選択](/n8n-x-auto-post/images/n8n-trigger-select.png)

### 3-3. HTTP Requestノードの追加

1. Manual Triggerの「+」をクリック
2. 「HTTP Request」を検索して追加

HTTP Request検索画面:

![HTTP Request検索](/n8n-x-auto-post/images/n8n-http-search.png)

### 3-4. HTTP Request設定

以下の設定を行います。

| 項目 | 設定値 |
|------|--------|
| **Method** | POST |
| **URL** | `http://host.docker.internal:5000/generate-and-post` |
| **Authentication** | None |
| **Send Body** | ON |
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON |

### 3-5. JSONボディの入力

「Specify Body」を「Using JSON」に変更し、以下のJSONを入力します。

```json
{
  "text": "Nanobananaで生成した画像をn8nから自動投稿！",
  "prompt": "A cute orange cat sitting on a desk with a laptop, digital art style, warm lighting",
  "aspect_ratio": "16:9"
}
```

HTTP Request設定画面:

![HTTP Request設定](/n8n-x-auto-post/images/n8n-image-post-settings.png)

### 3-6. パラメータの説明

| パラメータ | 説明 |
|-----------|------|
| `text` | Xに投稿するツイート本文 |
| `prompt` | Nanobananaに渡す画像生成プロンプト |
| `aspect_ratio` | 画像のアスペクト比（16:9は横長、9:16は縦長） |

### チェックポイント

- [ ] HTTP Requestノードを追加した
- [ ] URLを `/generate-and-post` に設定した
- [ ] JSON形式でtext, prompt, aspect_ratioを設定した

---

## セクション4: テスト投稿の実行

### 4-1. 事前確認

テスト実行前に以下を確認してください。

- [ ] Python APIサーバー（v3）が起動している
- [ ] n8n（Docker版）が起動している
- [ ] Free tierの投稿制限（17回/24時間）に余裕がある

### 4-2. ワークフローの実行

1. 「Execute step」または「Execute workflow」ボタンをクリック
2. 画像生成には10〜20秒かかることがあります
3. 実行結果を確認

### 4-3. 成功時のレスポンス

成功すると、以下のようなレスポンスが返ります。

n8n実行成功画面:

![実行成功](/n8n-x-auto-post/images/n8n-image-post-success.png)

### 4-4. Xでの確認

Xを開いて、画像付きツイートが正しく投稿されていることを確認します。

- ツイート本文が表示されている
- 生成された画像が添付されている
- アスペクト比が指定通り（16:9なら横長）

X上での投稿結果:

![X投稿結果](/n8n-x-auto-post/images/x-image-post-result.jpg)

### チェックポイント

- [ ] ワークフローを実行した
- [ ] `success: true` が返ってきた
- [ ] Xで画像付きツイートを確認した

---

## トラブルシューティング

### GOOGLE_API_KEY関連エラー

**エラーメッセージ**: `API key not valid` または `genai_client` 関連エラー

**原因**: Google API Keyが正しく設定されていない

**解決策**:
- [Google AI Studio](https://aistudio.google.com/apikey)でAPIキーを確認
- `x_api_server_v3.py`の`GOOGLE_API_KEY`を正しく設定
- サーバーを再起動

### Media Uploadエラー

**エラーメッセージ**: `media upload failed` または403エラー

**原因**: X Developer Portalの権限設定が不足

**解決策**:
- App permissionsが「Read and write」になっているか確認
- Access Tokenを再生成（権限変更後は再生成が必要）

### 画像生成が失敗する

**エラーメッセージ**: `No image generated`

**原因**: プロンプトがセーフティフィルターに引っかかった可能性

**解決策**:
- プロンプトを変更して再試行
- 人物の描写を避ける、または抽象的な表現にする

### タイムアウトエラー

**原因**: 画像生成に時間がかかりすぎている

**解決策**:
- n8nのHTTP Requestノードで「Timeout」を30秒以上に設定
- Optionsセクション → Timeout（ms）を`30000`に設定

---

## まとめ

### このモジュールで学んだこと

- Nanobanana（Gemini）とX APIを統合する方法
- tweepyでMedia Upload API（v1.1）とTweets API（v2）を組み合わせる方法
- n8nから画像生成と投稿を一括で自動化する方法

### 次のステップ

- Google Sheetsからプロンプトを取得して定期投稿
- スレッド内の各ツイートに画像を添付
- 投稿テンプレートとの組み合わせ

---

## ワークフローJSONダウンロード

以下のJSONファイルをダウンロードしてn8nにインポートできます。

[x-image-post-workflow.json](/n8n-x-auto-post/download/x-image-post-workflow.json)

**インポート後に変更が必要な箇所**:

| 項目 | 変更内容 |
|------|---------|
| text | 投稿内容を変更 |
| prompt | 画像生成プロンプトを変更 |
| aspect_ratio | 必要に応じてアスペクト比を変更 |

Python APIサーバーの更新版:

[x_api_server_v3.py](/n8n-x-auto-post/download/x_api_server_v3.py)

**APIサーバーの設定**:

スクリプトと同じディレクトリに`.env`ファイルを作成してください。

```
X_API_KEY=あなたのAPI_KEY
X_API_SECRET=あなたのAPI_SECRET
X_ACCESS_TOKEN=あなたのACCESS_TOKEN
X_ACCESS_TOKEN_SECRET=あなたのACCESS_TOKEN_SECRET
GOOGLE_API_KEY=あなたのGOOGLE_API_KEY
```

---

## 参考資料

- [Tweepy Client Documentation](https://docs.tweepy.org/en/stable/client.html)
- [Tweepy API Documentation - media_upload](https://docs.tweepy.org/en/stable/api.html#tweepy.API.media_upload)
- [Google Genai SDK](https://pypi.org/project/google-genai/)
- [Nanobanana画像生成講座](/category/nanobanana-image-generation/nanobanana-beginner)

---

## よくある質問

**Q: 画像生成にはどのくらい時間がかかりますか？**
A: 通常10〜20秒程度です。プロンプトの複雑さやサーバーの負荷によって変動します。n8nのタイムアウト設定を30秒以上にしておくと安心です。

**Q: 使用できるアスペクト比は？**
A: 以下のアスペクト比が使用できます。

| アスペクト比 | 向き | 用途 |
|-------------|------|------|
| `1:1` | 正方形 | SNS投稿（推奨） |
| `16:9` | 横長 | X投稿（推奨） |
| `9:16` | 縦長 | ストーリーズ |
| `4:3` | 横長 | 一般的な写真 |
| `3:4` | 縦長 | ポートレート |
| `3:2` | 横長 | 一眼レフ比率 |
| `2:3` | 縦長 | 一眼レフ比率 |
| `4:5` | 縦長 | Instagram |
| `5:4` | 横長 | - |
| `21:9` | ウルトラワイド | シネマ |

**Q: 画像のファイルサイズに制限はありますか？**
A: X APIは最大5MB（静止画）まで対応しています。Nanobananaで生成される画像は通常1MB以下なので問題ありません。

**Q: 複数の画像を1ツイートに添付できますか？**
A: X APIは最大4枚まで対応していますが、本講座のコードは1枚のみです。複数画像対応は`media_ids`配列を拡張することで実装可能です。

**Q: スレッドの各ツイートに異なる画像を付けられますか？**
A: 本講座のコードでは対応していませんが、`/thread`エンドポイントを拡張して各ツイートにmedia_idを指定することで実装可能です。
