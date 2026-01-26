# Premiere Pro プロジェクトテンプレート作成手順（完全版）

**調査日**: 2026-01-21
**対象**: Instagramリール動画制作（ランキング形式）
**用途**: 詳細手順の生データ保存（編集不可）

---

## 全体の流れ

1. **新規プロジェクト作成**（ベースとなるプロジェクト）
2. **シーケンス設定**（Instagram リール用 9:16）
3. **ビン（フォルダ）構造の作成**
4. **トラック構造の設定**
5. **テンプレートとして保存**
6. **次回以降の使用方法**

---

## ステップ1：新規プロジェクト作成

### 1-1. Premiere Proを起動

![](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_01.jpg)

ホーム画面で「**新規プロジェクト**」ボタンをクリックします。

### 1-2. プロジェクト設定

![](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_03.jpg)

**設定項目：**
- **プロジェクト名**：`Instagram_Reels_Template`（わかりやすい名前）
- **保存場所**：テンプレート用フォルダを指定
- **プロファイルテンプレート**：「Social Media Template Project.prproj」を選択
- 「**作成**」をクリック

---

## ステップ2：Instagram リール用シーケンス作成

### 2-1. 新規シーケンスを作成

![シーケンス設定](https://softcampus.co.jp/blog/wp-content/uploads/2024/11/image-66-1536x869.png)

**メニューバーから：**
```
ファイル → 新規 → シーケンス
```

### 2-2. シーケンス設定の詳細

![シーケンス設定詳細](https://softcampus.co.jp/blog/wp-content/uploads/2024/11/image-67-1536x868.png)

**設定タブ：**
- **シーケンス名**：`Instagram_Reels_Main`
- **プリセット**：カスタム設定

**ビデオ設定：**
- **フレームサイズ**：
  - 幅：`1080`
  - 高さ：`1920`（縦型 9:16）
- **フレームレート**：`30` fps
- **ピクセル縦横比**：正方形ピクセル (1.0)

**オーディオ設定：**
- **サンプルレート**：`48000` Hz
- **表示形式**：オーディオサンプル

「**OK**」をクリックしてシーケンスを作成。

---

## ステップ3：ビン（フォルダ）構造の作成

### 3-1. プロジェクトパネルでビンを作成

![ビンの作成](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_11.jpg)

**2つの方法：**

#### 方法1：アイコンから作成
プロジェクトパネル右下の「**フォルダーアイコン**」をクリック

#### 方法2：右クリックから作成
```
プロジェクトパネルの空白部分で右クリック → 新規ビン
```

### 3-2. Instagram リール用推奨フォルダ構造

以下のビンを作成します（番号付きで整理）：

```
プロジェクトパネル/
├── 01_素材_Raw_Footage
│   ├── メイン動画
│   ├── アバター素材
│   └── ツールアイコン
├── 02_音声_Audio
│   ├── 男性ナレーション
│   ├── 女性ナレーション
│   └── 効果音
├── 03_字幕_Subtitles
│   └── SRTファイル
├── 04_BGM_Music
├── 05_グラフィックス_Graphics
│   ├── タイトル
│   ├── 順位表示
│   └── トランジション
├── 06_完成シーケンス_Final_Sequences
└── Instagram_Reels_Main（シーケンス）
```

![ビン構造例](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_12.jpg)

**ポイント：**
- 番号を付けることで並び順を固定
- 日本語と英語を併記すると外国人との共同作業にも対応

---

## ステップ4：トラック構造の設定

### 4-1. シーケンスをダブルクリックしてタイムラインで開く

![タイムラインパネル](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_13.jpg)

### 4-2. トラックの追加と名前設定

#### ビデオトラックの追加

タイムラインパネル左側の空白部分で右クリック
```
トラックを追加
```

![トラック追加ダイアログ](https://helpx.adobe.com/content/dam/help/en/premiere-pro/using/bestpractices-projects/jcr_content/main-pars/image_1746960892/IBC2019_BestPractices_ProjectTemplates-22.png.img.png)

**設定：**
- **ビデオトラック数**：6
- **オーディオトラック数**：4（ステレオ）

「**OK**」をクリック

#### トラック名の設定

各トラックの名前部分をダブルクリックして名前を変更：

**ビデオトラック（上から順に）：**
```
V6: タイトル・テキスト
V5: 順位表示
V4: ツールアイコン
V3: アバター
V2: メイン動画
V1: 背景・調整レイヤー
```

**オーディオトラック：**
```
A1: 男性ナレーション
A2: 女性ナレーション
A3: BGM
A4: 効果音・SE
```

![トラック名設定完了](https://helpx.adobe.com/content/dam/help/en/premiere-pro/using/bestpractices-projects/jcr_content/main-pars/image_1916207091/IBC2019_BestPractices_ProjectTemplates-22.png.img.png)

---

## ステップ5：字幕スタイルの設定（オプション）

### 5-1. テキストスタイルを作成

```
ウィンドウ → テキスト
```

![テキストパネル](https://varietytelop.com/wp-content/uploads/2024/08/IMAG5488-1024x574.png)

### 5-2. 通常字幕用スタイル

**スタイル設定：**
- **フォント**：Noto Sans JP Bold
- **フォントサイズ**：80px
- **文字色**：白 (#FFFFFF)
- **アウトライン**：黒、5px
- **背景の塗り**：半透明黒（オプション）

**保存方法：**
```
テキストパネル → スタイル → 新規スタイル作成
→ スタイル名：「リール_通常字幕」
→ 「ローカルスタイルに保存」を選択
```

### 5-3. 「論外」用赤字スタイル

同様に赤字バージョンを作成：
- **文字色**：赤 (#FF0000)
- **スタイル名**：「リール_論外_赤字」

---

## ステップ6：テンプレートとして保存

### 6-1. 不要な素材を削除

タイムライン上のサンプル素材をすべて削除します（空のシーケンスにする）

### 6-2. プロジェクトを保存

```
ファイル → 保存
```

### 6-3. テンプレートとして登録

![テンプレート保存](https://community.adobe.com/t5/image/serverpage/image-id/510779i18D4F28002AB1997/image-size/large?v=v2&px=999)

```
ファイル → テンプレートとして保存
```

![テンプレート名入力](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_04.jpg)

**設定：**
- **テンプレート名**：`Instagram_Reels_Ranking`
- 「**保存**」をクリック

---

## ステップ7：テンプレートの使用方法

### 7-1. 新規プロジェクト作成時に使用

![テンプレート選択](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_05.jpg)

Premiere Pro起動 → 新規プロジェクト

**プロファイルテンプレート：**
ドロップダウンから「`Instagram_Reels_Ranking`」を選択

「**作成**」をクリック

### 7-2. テンプレートの内容が自動で展開

![テンプレート展開後](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_12.jpg)

- ビン構造が準備済み
- シーケンスが設定済み
- トラック名が設定済み
- 字幕スタイルが保存済み

---

## テンプレート管理

### テンプレートフォルダの場所

**Windows：**
```
C:\Users\[ユーザー名]\Documents\Adobe\Premiere Pro\テンプレート
```

**Mac：**
```
/Users/[ユーザー名]/Documents/Adobe/Premiere Pro/テンプレート
```

### テンプレートの削除方法

![テンプレートフォルダを開く](https://studypremiere.info/wp-content/uploads/2023/12/newprojecttemplatev24_06.jpg)

```
新規プロジェクト画面 → プロファイルテンプレート
→ 「テンプレートフォルダーを開く」
```

フォルダ内の`.prproj`ファイルを削除すればテンプレートが削除されます。

---

## テンプレート化のメリット

| 項目 | 効果 |
|------|------|
| **時間短縮** | プロジェクト作成が**10〜15分短縮** |
| **標準化** | 毎回同じ構造で作業可能 |
| **ミス防止** | シーケンス設定ミスがなくなる |
| **チーム作業** | メンバー全員が同じ構造で作業 |

---

## 実際の制作フロー（テンプレート使用後）

1. **テンプレートから新規プロジェクト作成**（5秒）
2. **素材を各ビンにドラッグ&ドロップ**（2分）
3. **SRTファイルをタイムラインに配置**（30秒）
4. **保存済みスタイルを字幕に適用**（30秒）
5. **編集作業開始**

**合計準備時間：約3分** ← テンプレートなしだと15〜20分

---

## 追加のカスタマイズ案

### 書き出しプリセットも保存

```
ファイル → 書き出し → メディア
→ 設定後「プリセットを保存」
→ プリセット名：「Instagram_Reels_Final」
```

**推奨設定：**
- 形式：H.264
- プリセット：YouTube 1080p HD
- サイズ：1080×1920
- ビットレート：VBR, 2パス、15Mbps
