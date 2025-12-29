# 環境構築

**所要時間**: 20分
**難易度**: ⭐⭐☆☆☆

このモジュールの最後に[スクリプトダウンロード](#スクリプトダウンロード)があります。

---

## このモジュールで学ぶこと

- Python仮想環境の作成
- google-genai SDKのインストール
- Gemini APIキーの取得
- 動作確認テスト

---

## 学習目標

このモジュールを終えると、以下のことができるようになります：

1. Nanobanana用のPython環境を構築できる
2. Gemini APIキーを取得できる
3. SDKの動作確認ができる

---

## 目次

- [事前準備](#事前準備)
- [セクション1: PowerShellを開く](#セクション1-powershellを開く)
- [セクション2: プロジェクト環境の構築](#セクション2-プロジェクト環境の構築)
- [セクション3: SDKのインストール](#セクション3-sdkのインストール)
- [セクション4: APIキーの取得](#セクション4-apiキーの取得)
- [セクション5: 動作確認](#セクション5-動作確認)
- [トラブルシューティング](#トラブルシューティング)
- [まとめ](#まとめ)
- [スクリプトダウンロード](#スクリプトダウンロード)
- [参考資料](#参考資料)
- [よくある質問](#よくある質問)

---

## 事前準備

### 必要なもの

| 項目 | 要件 |
|------|------|
| OS | Windows 10/11 |
| Python | 3.8以上 |
| Googleアカウント | APIキー取得用 |

---

## セクション1: PowerShellを開く

### 1-1. PowerShellを起動

Windowsキー + R → `powershell` と入力してEnter

以下のような画面が表示されます：

![PowerShellを開いた画面](/nanobanana-image-generation/images/module-02-powershell-open.png)

### チェックポイント

- [ ] PowerShellを開けた

---

## セクション2: プロジェクト環境の構築

### 2-1. Pythonバージョン確認

```powershell
python --version
```

**期待される出力**:
```
Python 3.10.9
```

Python 3.8以上であればOKです。

### 2-2. ディレクトリ作成

```powershell
mkdir C:\nanobanana
```

### 2-3. ディレクトリに移動

```powershell
cd C:\nanobanana
```

### 2-4. 仮想環境の作成

```powershell
python -m venv venv
```

ここまでの実行結果：

![環境構築の実行結果](/nanobanana-image-generation/images/module-02-setup-venv.png)

### 2-5. 仮想環境の有効化

**PowerShellの場合**:
```powershell
.\venv\Scripts\Activate
```

**Git Bashの場合**:
```bash
source venv/Scripts/activate
```

プロンプトの先頭に `(venv)` が表示されれば成功です。

仮想環境有効化の実行結果：

![仮想環境有効化](/nanobanana-image-generation/images/module-02-venv-activate.png)

### チェックポイント

- [ ] Python 3.8以上がインストールされている
- [ ] C:\nanobanana ディレクトリを作成した
- [ ] 仮想環境を有効化した（プロンプトに `(venv)` が表示されている）

---

## セクション3: SDKのインストール

### 3-1. google-genai SDKのインストール

```powershell
pip install google-genai
```

**期待される出力**:
```
Successfully installed google-genai-x.x.x ...
```

SDKインストールの実行結果：

![SDKインストール](/nanobanana-image-generation/images/module-02-sdk-install.png)

### 3-2. python-dotenvのインストール

環境変数を管理するためのライブラリをインストールします。

```powershell
pip install python-dotenv
```

### 3-3. インストール確認

```powershell
pip show google-genai
```

**期待される出力**:
```
Name: google-genai
Version: 1.x.x
...
```

インストール確認の実行結果：

![インストール確認](/nanobanana-image-generation/images/module-02-pip-show.png)

### 重要: SDK移行について

以前は `google-generativeai` というSDKが使われていましたが、現在はEOL（サポート終了）となっています。

| 項目 | 旧SDK（EOL） | 新SDK |
|------|-------------|-------|
| パッケージ名 | `google-generativeai` | `google-genai` |
| インポート | `import google.generativeai as genai` | `from google import genai` |

この講座では新SDK `google-genai` を使用します。

### チェックポイント

- [ ] google-genai をインストールした
- [ ] python-dotenv をインストールした
- [ ] pip show でバージョンを確認した

---

## セクション4: APIキーの取得

### 4-1. Google AI Studioにアクセス

ブラウザで以下のURLにアクセスします：

https://aistudio.google.com/

### 4-2. Googleアカウントでログイン

Googleアカウントでログインしてください。

### 4-3. APIキーの作成

1. 左メニューまたは画面上部の **「Get API key」** をクリック
2. **「Create API key」** をクリック
3. プロジェクトを選択（または新規作成）
4. 表示されたAPIキーをコピー

### 4-4. .envファイルの作成

PowerShellで以下を実行します：

```powershell
notepad .env
```

メモ帳が開いたら、以下を入力して保存します：

```
GOOGLE_API_KEY=YOUR_API_KEY
```

`YOUR_API_KEY` の部分を、取得したAPIキーに置き換えてください。

### 重要な注意事項

- **APIキーは絶対に公開しないでください**
- GitHubにプッシュする場合は `.gitignore` に `.env` を追加してください

### チェックポイント

- [ ] Google AI StudioでAPIキーを取得した
- [ ] .envファイルを作成してAPIキーを保存した

---

## セクション5: 動作確認

### 5-1. テストスクリプトの作成

PowerShellで以下を実行します：

```powershell
notepad test_nanobanana.py
```

メモ帳が開いたら、以下のコードを貼り付けて保存します：

```python
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents="A simple red apple on white background",
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE']
    )
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        image.save("test_output.png")
        print("画像を保存しました: test_output.png")
```

### 5-2. テスト実行

```powershell
python test_nanobanana.py
```

**期待される出力**:
```
画像を保存しました: test_output.png
```

テスト実行の結果：

![テスト実行成功](/nanobanana-image-generation/images/module-02-test-success.png)

### 5-3. 生成された画像の確認

`C:\nanobanana\test_output.png` を開いて、赤いリンゴの画像が生成されていることを確認します。

生成された画像の例：

![生成された画像](/nanobanana-image-generation/images/module-02-generated-image.png)

### チェックポイント

- [ ] テストスクリプトを作成した
- [ ] スクリプトを実行して「画像を保存しました」と表示された
- [ ] test_output.png が生成された

---

## トラブルシューティング

### ModuleNotFoundError: No module named 'dotenv'

**原因**: python-dotenvがインストールされていない

**解決策**:
```powershell
pip install python-dotenv
```

### IndentationError: unexpected indent

**原因**: スクリプトをコピペした際に、行頭に余分なスペースが入っている

**解決策**:
1. テストスクリプトをメモ帳で開く
2. 各行の先頭に余分なスペースがないか確認
3. 余分なスペースがあれば削除して保存

### APIキーが認識されない

**原因**: .envファイルが正しく作成されていない

**解決策**:
1. .envファイルがC:\nanobananディレクトリにあるか確認
2. ファイル名が `.env` であることを確認（`env.txt` ではない）
3. APIキーの前後に余分なスペースや引用符がないか確認

---

## まとめ

### このモジュールで学んだこと

- Python仮想環境の作成と有効化
- google-genai SDKのインストール
- Gemini APIキーの取得と.env設定
- テストスクリプトによる動作確認

### 作成したファイル

```
C:\nanobanana\
├── .env                    # APIキー
├── test_nanobanana.py      # テストスクリプト
├── test_output.png         # 生成された画像
└── venv/                   # 仮想環境
```

### 次のステップ

Module 03では、様々なプロンプトを使って画像を生成する方法を学びます。

---

## スクリプトダウンロード

以下のスクリプトをダウンロードして使用できます。

[test_nanobanana.py](/nanobanana-image-generation/download/test_nanobanana.py)

**ダウンロード後に変更が必要な箇所**:

| ファイル | 変更内容 |
|----------|---------|
| `.env` | `YOUR_API_KEY` をあなたのAPIキーに置き換え |

---

## 参考資料

- [Google AI Studio](https://aistudio.google.com/)
- [google-genai PyPI](https://pypi.org/project/google-genai/)
- [Gemini API ドキュメント](https://ai.google.dev/gemini-api/docs)

---

## よくある質問

**Q: 仮想環境は必須ですか？**
A: 必須ではありませんが、強く推奨します。プロジェクトごとに依存関係を分離でき、トラブルを防げます。

**Q: APIキーに料金はかかりますか？**
A: 無料枠があります。学習目的であれば通常は無料枠で十分です。詳細はGoogle AI Studioで確認してください。

**Q: 画像が生成されない場合は？**
A: APIキーが正しく設定されているか、インターネット接続があるか確認してください。また、APIの利用制限に達している可能性もあります。

**Q: 旧SDK（google-generativeai）を使っていますが、移行が必要ですか？**
A: はい、旧SDKはEOL（サポート終了）のため、新SDK（google-genai）への移行を推奨します。この講座の手順に従って新環境を構築してください。

**Q: Mac/Linuxでも同じ手順で動きますか？**
A: 基本的には同じですが、仮想環境の有効化コマンドが異なります。Mac/Linuxでは `source venv/bin/activate` を使用します。

**Q: WindowsでGit Bashを使っていますが、仮想環境の有効化コマンドが動きません**
A: Git BashはUnix系のシェルなので、PowerShellのコマンドは動きません。`source venv/Scripts/activate` を使用してください。パスの区切りも `/` を使います（例: `cd /c/nanobanana`）。
