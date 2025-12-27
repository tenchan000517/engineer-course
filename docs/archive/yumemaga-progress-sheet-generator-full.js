/**
 * ゆめマガ進捗管理シート生成GAS
 *
 * 【使い方】
 * 1. Google スプレッドシートを新規作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付けて保存
 * 4. 関数「createYumeMagaProgressSheet」を実行
 *
 * 【機能】
 * - 設定シート（マスター）を作成
 * - バリデーション設定シートを作成（カスタマイズ可能）
 * - 月号テンプレートシートを作成
 * - 素材チェック → ステータス自動計算
 * - バリデーションチェック → 内容・文字数検証
 */

// ===== 設定 =====
const CONFIG = {
  // カテゴリ定義
  categories: [
    { id: 'A', name: 'メインインタビュー', page: 'P4-5' },
    { id: 'D', name: '表紙制作', page: 'P1' },
    { id: 'H', name: 'STAR①', page: 'P n+5〜n+6' },
    { id: 'I', name: 'STAR②', page: 'P n+7〜n+8' },
    { id: 'K', name: 'ハイスクール企画', page: 'P6-7' },
    { id: 'L', name: '専門校コラボ', page: 'P n+1〜n+2' },
    { id: 'C', name: '新規企業', page: 'P8〜' },
    { id: 'E', name: '既存企業変更', page: '-' },
    { id: 'P', name: 'パートナー', page: 'P n+11〜n+12' },
    { id: 'G', name: '企業SNS紹介', page: 'P n+14' }
  ],

  // カテゴリ別必要素材
  requiredMaterials: {
    'A': ['録音データ', '縦長メイン写真', 'バストアップ写真', '横長写真1', '横長写真2', '文字起こし'],
    'D': ['縦長高解像度写真'],
    'H': ['録音データ', '横長ヒーロー写真', 'プロフィール写真', '大切にしている言葉', '文字起こし'],
    'I': ['録音データ', '横長ヒーロー写真', 'プロフィール写真', '大切にしている言葉', '文字起こし'],
    'K': ['録音データ', '横長ヒーロー写真', '対象者写真', '横長写真1', '横長写真2', '文字起こし'],
    'L': ['横長ヒーロー写真', '横長画像1', '横長画像2', '横長画像3', '横長画像4', 'アウトライン', 'ワイヤーフレーム'],
    'C': ['情報シート', 'ロゴ', 'アイキャッチ', '事業内容画像', '代表写真'],
    'E': ['変更情報シート', '差し替え写真'],
    'P': ['パートナー写真'],
    'G': ['企業名', 'SNS種類', 'SNS URL', 'ロゴ']
  },

  // ステータス定義
  statuses: {
    material: ['素材収集中', '制作可能'],
    production: ['未着手', '制作中', '確認待ち', '確認OK', '修正対応中']
  },

  // 関連URL
  urls: {
    '素材保存先（親フォルダ）': 'https://drive.google.com/drive/folders/1kxpgg_NCL8RQdNRN7z0FrFrABE8sSyiY',
    '進捗管理シート（本番）': 'https://docs.google.com/spreadsheets/d/1nEH77Y9IcLqTth3QD8u5m4earVX8HEjLNbGB2We3l3Y/edit',
    '進捗管理シート（旧・チェックリスト）': 'https://docs.google.com/spreadsheets/d/1lkRpZITZXJPvtnYh_cfHjRQCOBX9lGGjQL_kGLDS5cc/edit',
    '企業情報シートテンプレート': 'https://docs.google.com/spreadsheets/d/1rUasdvgD0qLedWG3ddDmJQ8vvq1nHwUgJ2IA2iResic/edit',
    'パートナー管理シート': 'https://docs.google.com/spreadsheets/d/1FOdnfTEq5r4udTCYMhwn61CJPX6zDb4b3rkkXcWxGRw/edit'
  },

  // Driveフォルダ構造（フォルダ名）
  driveFolders: {
    'A': 'A_メインインタビュー',
    'D': 'D_表紙制作',
    'H': 'H_STAR①',
    'I': 'I_STAR②',
    'K': 'K_ハイスクール企画',
    'L': 'L_愛知県立高等技術専門校',
    'C': 'C_新規企業',
    'E': 'E_既存企業',
    'P': 'P_パートナー一覧',
    'G': 'G_企業SNS紹介'
  },

  // DriveフォルダID（n8n連携用）
  // マスター: https://docs.google.com/spreadsheets/d/1qC3cMSGv8kjt6aoK20IvbaFfD3oLfvTTrFKUU_gQXhw/edit
  driveFolderIds: {
    'A': '1HsE6sqBk99FhnNRxsEehmSep6WoO0_UF',  // メインインタビュー
    'D': '10dN6Uw7OL8H7y5rLxwIG4FZAjzAAAbYh',  // 表紙制作
    'K': '1nzhI66AcjdiysN-hcu4YHMXa4VMorQ6M',  // ハイスクール企画
    'H': '1Ed8ivWWXI2J579k1od6jFTMhG1R1VoT2',  // STAR①
    'I': '1g1c6BkO2X6J6FOIlweWO0PGxmoFPVP9i',  // STAR②
    'L': '1D4wHHHSwi2jm2do8NHc0oopdc2EPs0_z',  // 愛知県立高等技術専門校
    'C': '1furJEw0OgurILPq0nVuRBELhcxv6392L',  // 新規企業
    'E': '1PmV2wjm_UvFE0yAWw0Pkul5lGlVV0cUy',  // 既存企業
    'P': '14Yp54Mxp9HUQFYUZkMoMtTBgkrZENblQ',  // パートナー一覧
    'G': '176lGQwN5xiPhLvAGrZ1HuDqQvl8xquiw'   // 企業SNS紹介
  },

  // 素材チェック用: カテゴリ別のフォルダ構造と素材マッピング
  // folderType: 'monthly'（月号管理）, 'company'（企業ごと）, 'flat'（フラット）
  materialFolderMap: {
    'A': {
      folderType: 'monthly',
      subfolders: {
        '録音データ': '録音データ',
        '写真データ': '写真データ'
      },
      // 素材名 → どのサブフォルダで、どんなファイル種別か
      materials: {
        '録音データ': { subfolder: '録音データ', fileTypes: ['mp3', 'mp4', 'wav', 'm4a'] },
        '縦長メイン写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        'バストアップ写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長写真1': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長写真2': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '文字起こし': { subfolder: '録音データ', fileTypes: ['txt', 'docx', 'doc'] }
      }
    },
    'D': {
      folderType: 'monthly',
      subfolders: {
        '写真データ': '写真データ'
      },
      materials: {
        '縦長高解像度写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] }
      }
    },
    'H': {
      folderType: 'monthly',
      subfolders: {
        '録音データ': '録音データ',
        '写真データ': '写真データ'
      },
      materials: {
        '録音データ': { subfolder: '録音データ', fileTypes: ['mp3', 'mp4', 'wav', 'm4a'] },
        '横長ヒーロー写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        'プロフィール写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '大切にしている言葉': { subfolder: null, fileTypes: null },  // 手動入力
        '文字起こし': { subfolder: '録音データ', fileTypes: ['txt', 'docx', 'doc'] }
      }
    },
    'I': {
      folderType: 'monthly',
      subfolders: {
        '録音データ': '録音データ',
        '写真データ': '写真データ'
      },
      materials: {
        '録音データ': { subfolder: '録音データ', fileTypes: ['mp3', 'mp4', 'wav', 'm4a'] },
        '横長ヒーロー写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        'プロフィール写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '大切にしている言葉': { subfolder: null, fileTypes: null },  // 手動入力
        '文字起こし': { subfolder: '録音データ', fileTypes: ['txt', 'docx', 'doc'] }
      }
    },
    'K': {
      folderType: 'monthly',
      subfolders: {
        '録音データ': '録音データ',
        '写真データ': '写真データ'
      },
      materials: {
        '録音データ': { subfolder: '録音データ', fileTypes: ['mp3', 'mp4', 'wav', 'm4a'] },
        '横長ヒーロー写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '対象者写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長写真1': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長写真2': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '文字起こし': { subfolder: '録音データ', fileTypes: ['txt', 'docx', 'doc'] }
      }
    },
    'L': {
      folderType: 'monthly',
      subfolders: {
        '写真データ': '写真データ'
      },
      materials: {
        '横長ヒーロー写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長画像1': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長画像2': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長画像3': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '横長画像4': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        'アウトライン': { subfolder: null, fileTypes: null },  // Googleドキュメント（別管理）
        'ワイヤーフレーム': { subfolder: null, fileTypes: null }  // Canva（別管理）
      }
    },
    'C': {
      folderType: 'company',  // 企業名でフォルダが分かれる
      subfolders: {
        '情報シート': '情報シート',
        'ロゴ': 'ロゴ',
        'ヒーロー画像': 'ヒーロー画像',
        'サービス画像': 'サービス画像',
        '代表者写真': '代表者写真'
      },
      materials: {
        '情報シート': { subfolder: '情報シート', fileTypes: ['xlsx', 'xls'] },
        'ロゴ': { subfolder: 'ロゴ', fileTypes: ['png', 'jpg', 'jpeg', 'svg', 'ai'] },
        'アイキャッチ': { subfolder: 'ヒーロー画像', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '事業内容画像': { subfolder: 'サービス画像', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] },
        '代表写真': { subfolder: '代表者写真', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] }
      }
    },
    'E': {
      folderType: 'monthly',
      subfolders: {
        '情報シート': '情報シート',
        '写真データ': '写真データ'
      },
      materials: {
        '変更情報シート': { subfolder: '情報シート', fileTypes: ['xlsx', 'xls'] },
        '差し替え写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] }
      }
    },
    'P': {
      folderType: 'monthly',
      subfolders: {
        '写真データ': '写真データ'
      },
      materials: {
        'パートナー写真': { subfolder: '写真データ', fileTypes: ['jpg', 'jpeg', 'png', 'heic'] }
      }
    },
    'G': {
      folderType: 'flat',  // ロゴフォルダ直下
      subfolders: {
        'ロゴ': 'ロゴ'
      },
      materials: {
        '企業名': { subfolder: null, fileTypes: null },  // 手動入力
        'SNS種類': { subfolder: null, fileTypes: null },  // 手動入力
        'SNS URL': { subfolder: null, fileTypes: null },  // 手動入力
        'ロゴ': { subfolder: 'ロゴ', fileTypes: ['png', 'jpg', 'jpeg', 'svg'] }
      }
    }
  },

  // バリデーションチェック種別
  validationTypes: ['文字数', '空欄チェック', '存在', 'URL形式', '選択肢'],

  // デフォルトバリデーションルール（バリデーション設定シートの初期値）
  defaultValidationRules: [
    // A. メインインタビュー
    { category: 'A', item: '文字起こし', type: '文字数', condition: 2000, required: true, description: 'メイン記事用テキスト' },
    { category: 'A', item: '縦長メイン写真', type: '存在', condition: '', required: true, description: '' },
    { category: 'A', item: 'バストアップ写真', type: '存在', condition: '', required: true, description: '' },
    { category: 'A', item: '横長写真1', type: '存在', condition: '', required: true, description: '' },
    { category: 'A', item: '横長写真2', type: '存在', condition: '', required: true, description: '' },

    // D. 表紙制作
    { category: 'D', item: '縦長高解像度写真', type: '存在', condition: '', required: true, description: '' },

    // H. STAR①
    { category: 'H', item: '文字起こし', type: '文字数', condition: 1500, required: true, description: 'STAR記事用テキスト' },
    { category: 'H', item: '大切にしている言葉', type: '文字数', condition: 10, required: true, description: '' },
    { category: 'H', item: '横長ヒーロー写真', type: '存在', condition: '', required: true, description: '' },
    { category: 'H', item: 'プロフィール写真', type: '存在', condition: '', required: true, description: '' },

    // I. STAR②
    { category: 'I', item: '文字起こし', type: '文字数', condition: 1500, required: true, description: 'STAR記事用テキスト' },
    { category: 'I', item: '大切にしている言葉', type: '文字数', condition: 10, required: true, description: '' },
    { category: 'I', item: '横長ヒーロー写真', type: '存在', condition: '', required: true, description: '' },
    { category: 'I', item: 'プロフィール写真', type: '存在', condition: '', required: true, description: '' },

    // K. ハイスクール企画
    { category: 'K', item: '文字起こし', type: '文字数', condition: 2000, required: true, description: '' },
    { category: 'K', item: '横長ヒーロー写真', type: '存在', condition: '', required: true, description: '' },
    { category: 'K', item: '対象者写真', type: '存在', condition: '', required: true, description: '' },

    // L. 専門校コラボ
    { category: 'L', item: 'アウトライン', type: '文字数', condition: 500, required: true, description: 'Googleドキュメント' },
    { category: 'L', item: 'ワイヤーフレーム', type: '存在', condition: '', required: true, description: 'Canva' },
    { category: 'L', item: '横長ヒーロー写真', type: '存在', condition: '', required: true, description: '' },

    // C. 新規企業（情報シート内の項目）
    { category: 'C', item: '企業名', type: '空欄チェック', condition: '', required: true, description: '情報シート内' },
    { category: 'C', item: '代表者名', type: '空欄チェック', condition: '', required: true, description: '情報シート内' },
    { category: 'C', item: '事業内容', type: '文字数', condition: 100, required: true, description: '情報シート内' },
    { category: 'C', item: '代表メッセージ', type: '文字数', condition: 100, required: true, description: '情報シート内' },
    { category: 'C', item: '企業ロゴ', type: '存在', condition: '', required: true, description: '' },
    { category: 'C', item: 'アイキャッチ画像', type: '存在', condition: '', required: true, description: '' },
    { category: 'C', item: '代表写真', type: '存在', condition: '', required: true, description: '' },

    // E. 既存企業変更
    { category: 'E', item: '変更情報シート', type: '存在', condition: '', required: true, description: '' },

    // P. パートナー
    { category: 'P', item: 'パートナー写真', type: '存在', condition: '', required: true, description: '' },

    // G. 企業SNS紹介
    { category: 'G', item: '企業名', type: '空欄チェック', condition: '', required: true, description: '' },
    { category: 'G', item: 'SNS URL', type: 'URL形式', condition: '', required: true, description: '' },
    { category: 'G', item: 'ロゴ', type: '存在', condition: '', required: true, description: '' }
  ]
};

/**
 * メイン関数: シート全体を生成
 */
function createYumeMagaProgressSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 既存シートを削除（初期のSheet1など）
  const sheets = ss.getSheets();

  // 設定シートを作成
  createSettingsSheet(ss);

  // バリデーション設定シートを作成
  createValidationSettingsSheet(ss);

  // テンプレートシートを作成
  createTemplateSheet(ss);

  // 初期のSheet1を削除
  sheets.forEach(sheet => {
    if (sheet.getName() === 'Sheet1' || sheet.getName() === 'シート1') {
      ss.deleteSheet(sheet);
    }
  });

  SpreadsheetApp.getUi().alert('ゆめマガ進捗管理シートを作成しました！\n\n「テンプレート」シートをコピーして各号の管理にお使いください。\n\n※バリデーションルールは「バリデーション設定」シートでカスタマイズできます。');
}

/**
 * 設定シートを作成
 */
function createSettingsSheet(ss) {
  let sheet = ss.getSheetByName('設定');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet('設定');

  let row = 1;

  // === カテゴリ定義セクション ===
  sheet.getRange(row, 1).setValue('■ カテゴリ定義').setFontWeight('bold').setBackground('#4a86e8').setFontColor('white');
  sheet.getRange(row, 1, 1, 4).merge();
  row++;

  sheet.getRange(row, 1, 1, 4).setValues([['ID', 'カテゴリ名', '掲載ページ', 'Driveフォルダ']]).setFontWeight('bold').setBackground('#cfe2f3');
  row++;

  CONFIG.categories.forEach(cat => {
    sheet.getRange(row, 1, 1, 4).setValues([[cat.id, cat.name, cat.page, CONFIG.driveFolders[cat.id] || '']]);
    row++;
  });

  row++;

  // === 必要素材セクション ===
  sheet.getRange(row, 1).setValue('■ カテゴリ別必要素材').setFontWeight('bold').setBackground('#4a86e8').setFontColor('white');
  sheet.getRange(row, 1, 1, 10).merge();
  row++;

  sheet.getRange(row, 1).setValue('カテゴリ').setFontWeight('bold').setBackground('#cfe2f3');
  sheet.getRange(row, 2).setValue('必要素材（チェック項目）').setFontWeight('bold').setBackground('#cfe2f3');
  sheet.getRange(row, 2, 1, 9).merge();
  row++;

  Object.keys(CONFIG.requiredMaterials).forEach(catId => {
    const materials = CONFIG.requiredMaterials[catId];
    const catName = CONFIG.categories.find(c => c.id === catId)?.name || catId;
    sheet.getRange(row, 1).setValue(`${catId}. ${catName}`);
    materials.forEach((mat, idx) => {
      sheet.getRange(row, 2 + idx).setValue(mat);
    });
    row++;
  });

  row++;

  // === ステータス定義セクション ===
  sheet.getRange(row, 1).setValue('■ ステータス定義').setFontWeight('bold').setBackground('#4a86e8').setFontColor('white');
  sheet.getRange(row, 1, 1, 6).merge();
  row++;

  sheet.getRange(row, 1).setValue('素材ステータス').setFontWeight('bold').setBackground('#cfe2f3');
  CONFIG.statuses.material.forEach((status, idx) => {
    sheet.getRange(row, 2 + idx).setValue(status);
  });
  row++;

  sheet.getRange(row, 1).setValue('制作ステータス').setFontWeight('bold').setBackground('#cfe2f3');
  CONFIG.statuses.production.forEach((status, idx) => {
    sheet.getRange(row, 2 + idx).setValue(status);
  });
  row++;

  row++;

  // === URL一覧セクション ===
  sheet.getRange(row, 1).setValue('■ 関連URL一覧').setFontWeight('bold').setBackground('#4a86e8').setFontColor('white');
  sheet.getRange(row, 1, 1, 6).merge();
  row++;

  sheet.getRange(row, 1, 1, 2).setValues([['名称', 'URL']]).setFontWeight('bold').setBackground('#cfe2f3');
  row++;

  Object.keys(CONFIG.urls).forEach(name => {
    sheet.getRange(row, 1).setValue(name);
    sheet.getRange(row, 2).setValue(CONFIG.urls[name]);
    row++;
  });

  // 列幅調整
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 400);
  for (let i = 3; i <= 10; i++) {
    sheet.setColumnWidth(i, 120);
  }

  // シートを左端に移動
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);
}

/**
 * バリデーション設定シートを作成
 * ユーザーがカスタマイズ可能な検証ルールを定義
 */
function createValidationSettingsSheet(ss) {
  let sheet = ss.getSheetByName('バリデーション設定');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet('バリデーション設定');

  // ヘッダー行
  const headers = ['カテゴリ', 'チェック項目', 'チェック種別', '条件値', '必須', '説明', '有効'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#6aa84f')
    .setFontColor('white');

  // デフォルトルールを追加
  let row = 2;
  CONFIG.defaultValidationRules.forEach(rule => {
    const catName = CONFIG.categories.find(c => c.id === rule.category)?.name || rule.category;
    sheet.getRange(row, 1, 1, 7).setValues([[
      `${rule.category}. ${catName}`,
      rule.item,
      rule.type,
      rule.condition,
      rule.required,
      rule.description,
      true  // 有効フラグ
    ]]);
    row++;
  });

  // チェック種別のプルダウン
  const typeValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.validationTypes)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C2:C200').setDataValidation(typeValidation);

  // 必須・有効列にチェックボックス
  sheet.getRange(2, 5, CONFIG.defaultValidationRules.length, 1).insertCheckboxes();
  sheet.getRange(2, 7, CONFIG.defaultValidationRules.length, 1).insertCheckboxes();

  // 条件付き書式: 無効な行はグレーアウト
  const dataRange = sheet.getRange('A2:G200');
  const grayOutRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2=FALSE')
    .setBackground('#e0e0e0')
    .setFontColor('#999999')
    .setRanges([dataRange])
    .build();
  sheet.setConditionalFormatRules([grayOutRule]);

  // 列幅調整
  sheet.setColumnWidth(1, 180);  // カテゴリ
  sheet.setColumnWidth(2, 150);  // チェック項目
  sheet.setColumnWidth(3, 100);  // チェック種別
  sheet.setColumnWidth(4, 80);   // 条件値
  sheet.setColumnWidth(5, 50);   // 必須
  sheet.setColumnWidth(6, 200);  // 説明
  sheet.setColumnWidth(7, 50);   // 有効

  // 行の固定
  sheet.setFrozenRows(1);

  // シートタブの色
  sheet.setTabColor('#6aa84f');

  // 説明テキストを追加
  const noteRow = row + 2;
  sheet.getRange(noteRow, 1).setValue('【使い方】').setFontWeight('bold');
  sheet.getRange(noteRow + 1, 1).setValue('・行を追加/削除してルールをカスタマイズできます');
  sheet.getRange(noteRow + 2, 1).setValue('・「有効」のチェックを外すとそのルールはスキップされます');
  sheet.getRange(noteRow + 3, 1).setValue('・チェック種別: 文字数（指定文字数以上）、空欄チェック、存在（ファイル有無）、URL形式');
  sheet.getRange(noteRow + 4, 1).setValue('・条件値: 文字数の場合は最低文字数を入力');
}

/**
 * テンプレートシートを作成
 */
function createTemplateSheet(ss) {
  let sheet = ss.getSheetByName('テンプレート');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet('テンプレート');

  // ヘッダー行を作成
  const headers = [
    'カテゴリ',           // A
    '対象名',             // B
    '期限',               // C
    '素材1', '素材2', '素材3', '素材4', '素材5', '素材6', '素材7',  // D-J
    '素材ステータス',     // K (自動計算)
    'バリデーション',     // L (バリデーション実行で更新)
    '総合ステータス',     // M (自動計算: 素材OK + バリデーションOK)
    '制作ステータス',     // N
    '参考URL',            // O
    'Driveフォルダ',      // P
    '備考'                // Q
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#4a86e8').setFontColor('white');

  // 各カテゴリの行を追加（サンプル）
  let row = 2;
  CONFIG.categories.forEach(cat => {
    const materials = CONFIG.requiredMaterials[cat.id] || [];
    const rowData = [
      `${cat.id}. ${cat.name}`,  // カテゴリ
      '',                         // 対象名
      '',                         // 期限
    ];

    // 素材チェック列（最大7つ）- 初期値はfalse
    for (let i = 0; i < 7; i++) {
      rowData.push(materials[i] ? false : '');
    }

    rowData.push('');       // 素材ステータス（数式で自動計算）
    rowData.push('未実行'); // バリデーション
    rowData.push('');       // 総合ステータス（数式で自動計算）
    rowData.push('未着手'); // 制作ステータス
    rowData.push('');       // 参考URL
    rowData.push(CONFIG.driveFolders[cat.id] || '');  // Driveフォルダ
    rowData.push('');       // 備考

    sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);

    // 素材チェック列にチェックボックスとノートを設定
    materials.forEach((material, idx) => {
      const cell = sheet.getRange(row, 4 + idx);
      cell.insertCheckboxes();
      cell.setNote(material);  // 素材名をノート（ホバーで表示）として設定
    });

    // 素材ステータスの自動計算数式を設定 (K列)
    // D〜J列のチェックボックスがすべてTRUEなら「素材OK」
    const materialCount = materials.length;
    const materialFormula = `=IF(COUNTIF(D${row}:J${row},TRUE)>=${materialCount},"素材OK","素材収集中")`;
    sheet.getRange(row, 11).setFormula(materialFormula);

    // 総合ステータスの自動計算数式を設定 (M列)
    // 素材OK + バリデーションOK → 制作可能
    const totalFormula = `=IF(AND(K${row}="素材OK",L${row}="OK"),"制作可能",IF(OR(K${row}="素材収集中",L${row}="未実行"),"準備中","要確認"))`;
    sheet.getRange(row, 13).setFormula(totalFormula);

    row++;
  });

  // 列幅調整
  sheet.setColumnWidth(1, 180);  // A: カテゴリ
  sheet.setColumnWidth(2, 150);  // B: 対象名
  sheet.setColumnWidth(3, 100);  // C: 期限
  for (let i = 4; i <= 10; i++) {
    sheet.setColumnWidth(i, 80);  // D-J: 素材チェック
  }
  sheet.setColumnWidth(11, 90);   // K: 素材ステータス
  sheet.setColumnWidth(12, 90);   // L: バリデーション
  sheet.setColumnWidth(13, 90);   // M: 総合ステータス
  sheet.setColumnWidth(14, 100);  // N: 制作ステータス
  sheet.setColumnWidth(15, 200);  // O: 参考URL
  sheet.setColumnWidth(16, 180);  // P: Driveフォルダ
  sheet.setColumnWidth(17, 200);  // Q: 備考

  // 条件付き書式: 素材ステータス (K列)
  const materialStatusRange = sheet.getRange('K2:K100');
  const rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('素材OK')
    .setBackground('#b7e1cd')
    .setRanges([materialStatusRange])
    .build();
  const rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('素材収集中')
    .setBackground('#fce8b2')
    .setRanges([materialStatusRange])
    .build();

  // 条件付き書式: バリデーション (L列)
  const validationRange = sheet.getRange('L2:L100');
  const rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('OK')
    .setBackground('#b7e1cd')
    .setRanges([validationRange])
    .build();
  const rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('NG')
    .setBackground('#f4cccc')
    .setRanges([validationRange])
    .build();
  const rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('未実行')
    .setBackground('#e0e0e0')
    .setRanges([validationRange])
    .build();

  // 条件付き書式: 総合ステータス (M列)
  const totalStatusRange = sheet.getRange('M2:M100');
  const rule6 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('制作可能')
    .setBackground('#b7e1cd')
    .setFontColor('#006400')
    .setRanges([totalStatusRange])
    .build();
  const rule7 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('準備中')
    .setBackground('#fce8b2')
    .setRanges([totalStatusRange])
    .build();
  const rule8 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('要確認')
    .setBackground('#f4cccc')
    .setRanges([totalStatusRange])
    .build();

  // 条件付き書式: 制作ステータス (N列)
  const productionStatusRange = sheet.getRange('N2:N100');
  const rule9 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('確認OK')
    .setBackground('#b7e1cd')
    .setRanges([productionStatusRange])
    .build();
  const rule10 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('確認待ち')
    .setBackground('#c9daf8')
    .setRanges([productionStatusRange])
    .build();
  const rule11 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('制作中')
    .setBackground('#fff2cc')
    .setRanges([productionStatusRange])
    .build();
  const rule12 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('修正対応中')
    .setBackground('#f4cccc')
    .setRanges([productionStatusRange])
    .build();

  sheet.setConditionalFormatRules([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, rule10, rule11, rule12]);

  // 制作ステータスのプルダウンを設定 (N列)
  const productionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.statuses.production)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('N2:N100').setDataValidation(productionValidation);

  // 行の固定
  sheet.setFrozenRows(1);

  // シートタブの色
  sheet.setTabColor('#ff9900');
}

/**
 * 新しい号のシートを作成
 * @param {string} issueYearMonth - 号数（例: "202601"）
 */
function createNewIssueSheet(issueYearMonth) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const template = ss.getSheetByName('テンプレート');

  if (!template) {
    SpreadsheetApp.getUi().alert('テンプレートシートが見つかりません。先にcreateYumeMagaProgressSheetを実行してください。');
    return;
  }

  // シートをコピー
  const newSheet = template.copyTo(ss);
  newSheet.setName(issueYearMonth);
  newSheet.setTabColor('#34a853');

  // 素材チェック列をリセット（チェックボックスをfalseに）
  const checkboxRange = newSheet.getRange(2, 4, CONFIG.categories.length, 7);
  const values = checkboxRange.getValues();
  const resetValues = values.map(row => row.map(cell => cell === true || cell === false ? false : cell));
  checkboxRange.setValues(resetValues);

  // 対象名・期限・バリデーション・制作ステータス・参考URL・備考をクリア/リセット
  for (let i = 2; i <= CONFIG.categories.length + 1; i++) {
    newSheet.getRange(i, 2).clearContent();   // B: 対象名
    newSheet.getRange(i, 3).clearContent();   // C: 期限
    newSheet.getRange(i, 12).setValue('未実行');  // L: バリデーションをリセット
    newSheet.getRange(i, 14).setValue('未着手');  // N: 制作ステータスをリセット
    newSheet.getRange(i, 15).clearContent();  // O: 参考URL
    newSheet.getRange(i, 17).clearContent();  // Q: 備考
  }

  SpreadsheetApp.getUi().alert(`${issueYearMonth} のシートを作成しました！`);
}

/**
 * カスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('ゆめマガ管理')
    .addItem('初期設定（シート生成）', 'createYumeMagaProgressSheet')
    .addItem('新しい号を作成', 'showCreateIssueDialog')
    .addSeparator()
    .addItem('素材チェック（Drive確認）', 'checkMaterialsFromDrive')
    .addItem('バリデーション実行', 'runValidation')
    .addItem('バリデーション結果詳細', 'showValidationDetails')
    .addToUi();
}

/**
 * 号作成ダイアログを表示
 */
function showCreateIssueDialog() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '新しい号を作成',
    '号数を入力してください（例: 202601）',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const issueYearMonth = response.getResponseText().trim();
    if (/^\d{6}$/.test(issueYearMonth)) {
      createNewIssueSheet(issueYearMonth);
    } else {
      ui.alert('形式が正しくありません。6桁の数字（例: 202601）で入力してください。');
    }
  }
}

// ===== 素材チェック機能 =====

/**
 * Google Driveの素材フォルダをスキャンしてチェックボックスを更新
 * メニューから「素材チェック」で実行
 */
function checkMaterialsFromDrive() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  // 対象外シートのチェック
  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  // 号数からフォルダ名形式を取得（202601 → 2026_01）
  const issueYearMonth = sheetName;
  const folderName = issueYearMonth.slice(0, 4) + '_' + issueYearMonth.slice(4, 6);

  const ui = SpreadsheetApp.getUi();
  const data = activeSheet.getDataRange().getValues();

  let checkedCount = 0;
  let skippedCount = 0;
  const results = [];

  // 各カテゴリ行を処理
  for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    if (!row[0]) continue;  // 空行スキップ

    const categoryId = row[0].split('.')[0].trim();
    const targetName = row[1] || '';  // 対象名（企業名など）
    const folderConfig = CONFIG.materialFolderMap[categoryId];

    if (!folderConfig) {
      results.push({ category: categoryId, message: 'マッピング未定義' });
      continue;
    }

    const folderId = CONFIG.driveFolderIds[categoryId];
    if (!folderId) {
      results.push({ category: categoryId, message: 'フォルダID未定義' });
      continue;
    }

    try {
      const categoryFolder = DriveApp.getFolderById(folderId);
      const checkResult = checkCategoryMaterials(
        activeSheet,
        rowIdx + 1,  // シートは1-indexed
        categoryId,
        categoryFolder,
        folderConfig,
        folderName,
        targetName
      );

      checkedCount += checkResult.checked;
      skippedCount += checkResult.skipped;
      results.push({
        category: categoryId,
        targetName: targetName,
        checked: checkResult.checked,
        skipped: checkResult.skipped,
        details: checkResult.details
      });

    } catch (e) {
      results.push({ category: categoryId, message: 'エラー: ' + e.message });
    }
  }

  // 結果表示
  showMaterialCheckResults(results, checkedCount, skippedCount);
}

/**
 * カテゴリ別の素材チェックを実行
 */
function checkCategoryMaterials(sheet, rowNum, categoryId, categoryFolder, folderConfig, folderName, targetName) {
  const result = { checked: 0, skipped: 0, details: [] };
  const materials = CONFIG.requiredMaterials[categoryId] || [];
  const materialConfig = folderConfig.materials || {};

  // サブフォルダ内のファイル一覧を取得
  const filesInSubfolders = {};

  if (folderConfig.folderType === 'monthly') {
    // 月号管理: サブフォルダ/月号フォルダ/ の構造
    Object.keys(folderConfig.subfolders).forEach(subKey => {
      const subfolderName = folderConfig.subfolders[subKey];
      const files = getFilesInMonthlyFolder(categoryFolder, subfolderName, folderName);
      filesInSubfolders[subfolderName] = files;
    });
  } else if (folderConfig.folderType === 'company' && targetName) {
    // 企業ごと管理: 企業名フォルダ/サブフォルダ/ の構造
    const companyFolder = findFolderByName(categoryFolder, targetName);
    if (companyFolder) {
      Object.keys(folderConfig.subfolders).forEach(subKey => {
        const subfolderName = folderConfig.subfolders[subKey];
        const files = getFilesInFolder(companyFolder, subfolderName);
        filesInSubfolders[subfolderName] = files;
      });
    }
  } else if (folderConfig.folderType === 'flat') {
    // フラット: サブフォルダ直下
    Object.keys(folderConfig.subfolders).forEach(subKey => {
      const subfolderName = folderConfig.subfolders[subKey];
      const files = getFilesInFolder(categoryFolder, subfolderName);
      filesInSubfolders[subfolderName] = files;
    });
  }

  // 各素材をチェック
  materials.forEach((materialName, idx) => {
    const matConfig = materialConfig[materialName];

    // 手動入力項目（subfolder が null）はスキップ
    if (!matConfig || matConfig.subfolder === null) {
      result.skipped++;
      result.details.push({ material: materialName, status: 'スキップ（手動入力）' });
      return;
    }

    const targetSubfolder = matConfig.subfolder;
    const targetFileTypes = matConfig.fileTypes || [];
    const filesInTarget = filesInSubfolders[targetSubfolder] || [];

    // ファイルタイプでフィルタリング
    const matchingFiles = filesInTarget.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return targetFileTypes.includes(ext);
    });

    // D〜J列（idx 0〜6 → 列 4〜10）のチェックボックスを更新
    const colNum = 4 + idx;
    const cell = sheet.getRange(rowNum, colNum);

    // チェックボックスかどうか確認
    const validation = cell.getDataValidation();
    const isCheckbox = validation && validation.getCriteriaType() === SpreadsheetApp.DataValidationCriteria.CHECKBOX;

    if (!isCheckbox) {
      result.skipped++;
      result.details.push({ material: materialName, status: 'チェックボックスなし' });
      return;
    }

    if (matchingFiles.length > 0) {
      cell.setValue(true);
      // ノートにファイル名を追記
      const currentNote = cell.getNote() || materialName;
      const fileNames = matchingFiles.map(f => f.name).join(', ');
      const newNote = materialName + '\n---\n' + fileNames;
      cell.setNote(newNote);

      result.checked++;
      result.details.push({ material: materialName, status: '✓ ' + fileNames });
    } else {
      result.details.push({ material: materialName, status: '✗ ファイルなし' });
    }
  });

  return result;
}

/**
 * 月号管理フォルダのファイル一覧を取得
 * カテゴリフォルダ/サブフォルダ/月号フォルダ/ の構造
 */
function getFilesInMonthlyFolder(categoryFolder, subfolderName, monthFolderName) {
  const files = [];

  try {
    // サブフォルダを探す（例: 録音データ、写真データ）
    const subFolders = categoryFolder.getFoldersByName(subfolderName);
    if (!subFolders.hasNext()) return files;

    const subFolder = subFolders.next();

    // 月号フォルダを探す（例: 2026_01）
    const monthFolders = subFolder.getFoldersByName(monthFolderName);
    if (!monthFolders.hasNext()) return files;

    const monthFolder = monthFolders.next();

    // ファイル一覧を取得
    const fileIterator = monthFolder.getFiles();
    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      files.push({ name: file.getName(), id: file.getId() });
    }
  } catch (e) {
    // フォルダが見つからない場合は空配列を返す
  }

  return files;
}

/**
 * フォルダ内のファイル一覧を取得
 */
function getFilesInFolder(parentFolder, subfolderName) {
  const files = [];

  try {
    const subFolders = parentFolder.getFoldersByName(subfolderName);
    if (!subFolders.hasNext()) return files;

    const subFolder = subFolders.next();
    const fileIterator = subFolder.getFiles();

    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      files.push({ name: file.getName(), id: file.getId() });
    }
  } catch (e) {
    // フォルダが見つからない場合は空配列を返す
  }

  return files;
}

/**
 * 名前でフォルダを検索
 */
function findFolderByName(parentFolder, folderName) {
  if (!folderName) return null;

  try {
    const folders = parentFolder.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next();
    }

    // 完全一致しない場合、部分一致で検索
    const allFolders = parentFolder.getFolders();
    while (allFolders.hasNext()) {
      const folder = allFolders.next();
      if (folder.getName().includes(folderName)) {
        return folder;
      }
    }
  } catch (e) {
    // エラー時はnullを返す
  }

  return null;
}

/**
 * 素材チェック結果を表示
 */
function showMaterialCheckResults(results, checkedCount, skippedCount) {
  let message = '【素材チェック完了】\n\n';
  message += `✓ チェック更新: ${checkedCount} 件\n`;
  message += `- スキップ: ${skippedCount} 件\n\n`;

  message += '【カテゴリ別結果】\n';
  results.forEach(r => {
    const catName = CONFIG.categories.find(c => c.id === r.category)?.name || r.category;
    message += `\n[${r.category}. ${catName}]`;
    if (r.targetName) message += ` - ${r.targetName}`;
    message += '\n';

    if (r.message) {
      message += `  ${r.message}\n`;
    } else if (r.details) {
      r.details.forEach(d => {
        message += `  ・${d.material}: ${d.status}\n`;
      });
    }
  });

  SpreadsheetApp.getUi().alert(message);
}

// ===== n8n連携用関数 =====

/**
 * n8nからWebhookで呼び出される関数
 * 素材ステータスを更新
 *
 * @param {Object} e - リクエストパラメータ
 * @returns {Object} - 結果
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { issueYearMonth, category, materialIndex, checked } = data;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(issueYearMonth);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // カテゴリの行を探す
    const categoryCol = sheet.getRange('A:A').getValues();
    let targetRow = -1;
    for (let i = 1; i < categoryCol.length; i++) {
      if (categoryCol[i][0] && categoryCol[i][0].startsWith(category + '.')) {
        targetRow = i + 1;
        break;
      }
    }

    if (targetRow === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Category not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 素材チェックを更新（D列から）
    const materialCol = 4 + materialIndex;
    sheet.getRange(targetRow, materialCol).setValue(checked ? 'TRUE' : 'FALSE');

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * n8nから現在のステータスを取得
 */
function doGet(e) {
  try {
    const issueYearMonth = e.parameter.issue;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(issueYearMonth);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const result = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = data[i][idx];
        });
        result.push(row);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== バリデーション機能 =====

// バリデーション結果を一時保存（詳細表示用）
let lastValidationResults = [];

/**
 * バリデーション実行
 * 現在のシートに対してバリデーション設定に基づいたチェックを実行
 */
function runValidation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  // 設定シート、バリデーション設定シート、テンプレートは対象外
  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  // バリデーション設定を読み込み
  const validationSheet = ss.getSheetByName('バリデーション設定');
  if (!validationSheet) {
    SpreadsheetApp.getUi().alert('バリデーション設定シートが見つかりません。初期設定を実行してください。');
    return;
  }

  const validationData = validationSheet.getDataRange().getValues();
  const validationRules = [];

  // ヘッダー行をスキップして読み込み
  for (let i = 1; i < validationData.length; i++) {
    const row = validationData[i];
    if (row[0] && row[6] === true) {  // カテゴリがあり、有効フラグがtrue
      validationRules.push({
        category: row[0].split('.')[0].trim(),  // "A. メインインタビュー" → "A"
        item: row[1],
        type: row[2],
        condition: row[3],
        required: row[4],
        description: row[5]
      });
    }
  }

  // 進捗シートのデータを取得
  const progressData = activeSheet.getDataRange().getValues();
  const results = [];
  let allPassed = true;

  // 各カテゴリ行をチェック
  for (let rowIdx = 1; rowIdx < progressData.length; rowIdx++) {
    const row = progressData[rowIdx];
    if (!row[0]) continue;  // 空行スキップ

    const categoryId = row[0].split('.')[0].trim();
    const targetName = row[1] || '(未入力)';
    const categoryRules = validationRules.filter(r => r.category === categoryId);

    let categoryPassed = true;
    const categoryResults = [];

    categoryRules.forEach(rule => {
      const result = executeValidation(rule, row, rowIdx, activeSheet);
      categoryResults.push({
        category: categoryId,
        targetName: targetName,
        item: rule.item,
        type: rule.type,
        condition: rule.condition,
        passed: result.passed,
        message: result.message,
        actualValue: result.actualValue
      });

      if (!result.passed && rule.required) {
        categoryPassed = false;
        allPassed = false;
      }
    });

    // バリデーション結果をL列に設定
    const validationCell = activeSheet.getRange(rowIdx + 1, 12);  // L列
    if (categoryRules.length === 0) {
      validationCell.setValue('N/A');
    } else if (categoryPassed) {
      validationCell.setValue('OK');
    } else {
      validationCell.setValue('NG');
    }

    results.push(...categoryResults);
  }

  // 結果を保存（詳細表示用）
  const cache = CacheService.getScriptCache();
  cache.put('lastValidationResults', JSON.stringify(results), 600);  // 10分間保持

  // 結果メッセージ
  const ngCount = results.filter(r => !r.passed).length;
  const okCount = results.filter(r => r.passed).length;

  if (allPassed) {
    SpreadsheetApp.getUi().alert(`✅ バリデーション完了\n\n全 ${okCount} 項目がOKです。`);
  } else {
    SpreadsheetApp.getUi().alert(`⚠️ バリデーション完了\n\nOK: ${okCount} 項目\nNG: ${ngCount} 項目\n\n詳細は「バリデーション結果詳細」で確認してください。`);
  }
}

/**
 * 個別のバリデーションを実行
 */
function executeValidation(rule, rowData, rowIdx, sheet) {
  const result = {
    passed: true,
    message: 'OK',
    actualValue: ''
  };

  switch (rule.type) {
    case '文字数':
      // 対象のテキストを取得（実際の実装では対象セルや外部データを参照）
      // ここでは備考列(Q列, index 16)やノートから取得するサンプル
      const textValue = getTextValueForValidation(rule.item, rowData, sheet, rowIdx);
      const charCount = textValue ? textValue.length : 0;
      result.actualValue = `${charCount}文字`;

      if (charCount < rule.condition) {
        result.passed = false;
        result.message = `${rule.condition}文字以上必要（現在: ${charCount}文字）`;
      }
      break;

    case '空欄チェック':
      const value = getTextValueForValidation(rule.item, rowData, sheet, rowIdx);
      result.actualValue = value || '(空欄)';

      if (!value || value.trim() === '') {
        result.passed = false;
        result.message = '入力が必要です';
      }
      break;

    case '存在':
      // ファイル存在チェック（素材チェック列のチェックボックス状態で判定）
      const materialIdx = getMaterialIndex(rule.item, rowData[0]);
      if (materialIdx >= 0) {
        const isChecked = rowData[3 + materialIdx] === true;
        result.actualValue = isChecked ? '✓ 確認済み' : '✗ 未確認';

        if (!isChecked) {
          result.passed = false;
          result.message = 'ファイルが未確認です';
        }
      } else {
        result.actualValue = '(対象外)';
        result.message = '該当素材なし';
      }
      break;

    case 'URL形式':
      const urlValue = getTextValueForValidation(rule.item, rowData, sheet, rowIdx);
      result.actualValue = urlValue || '(空欄)';

      if (!urlValue || !isValidUrl(urlValue)) {
        result.passed = false;
        result.message = '有効なURLを入力してください';
      }
      break;

    default:
      result.message = '不明なチェック種別';
  }

  return result;
}

/**
 * バリデーション用のテキスト値を取得
 */
function getTextValueForValidation(itemName, rowData, sheet, rowIdx) {
  // 備考列（Q列, index 16）から取得を試みる
  // または対象名列（B列）から取得
  // 実際の運用では、外部シートやDriveファイルから取得する拡張が可能

  // 素材チェック列のノートから取得を試みる
  const materialIdx = getMaterialIndex(itemName, rowData[0]);
  if (materialIdx >= 0) {
    const cell = sheet.getRange(rowIdx + 1, 4 + materialIdx);
    const note = cell.getNote();
    // ノートに値が保存されている場合（素材名以外の情報がある場合）
    if (note && note.includes('\n---\n')) {
      return note.split('\n---\n')[1];
    }
  }

  // 対象名や備考から部分一致で探す
  if (itemName === '企業名' || itemName === '対象名') {
    return rowData[1];  // B列
  }

  // その他は備考列を参照
  return rowData[16] || '';
}

/**
 * 素材名からインデックスを取得
 */
function getMaterialIndex(itemName, categoryCell) {
  const categoryId = categoryCell.split('.')[0].trim();
  const materials = CONFIG.requiredMaterials[categoryId] || [];
  return materials.indexOf(itemName);
}

/**
 * URL形式チェック
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * バリデーション結果詳細を表示
 */
function showValidationDetails() {
  const cache = CacheService.getScriptCache();
  const cachedResults = cache.get('lastValidationResults');

  if (!cachedResults) {
    SpreadsheetApp.getUi().alert('バリデーション結果がありません。\n先に「バリデーション実行」を行ってください。');
    return;
  }

  const results = JSON.parse(cachedResults);
  const ngResults = results.filter(r => !r.passed);

  if (ngResults.length === 0) {
    SpreadsheetApp.getUi().alert('✅ すべてのバリデーションがOKです。');
    return;
  }

  // NG項目の詳細を作成
  let detailText = '⚠️ バリデーションNG項目:\n\n';

  const groupedByCategory = {};
  ngResults.forEach(r => {
    const key = `${r.category}. ${r.targetName}`;
    if (!groupedByCategory[key]) {
      groupedByCategory[key] = [];
    }
    groupedByCategory[key].push(r);
  });

  Object.keys(groupedByCategory).forEach(key => {
    detailText += `【${key}】\n`;
    groupedByCategory[key].forEach(r => {
      detailText += `  ・${r.item}: ${r.message}\n`;
      detailText += `    現在値: ${r.actualValue}\n`;
    });
    detailText += '\n';
  });

  SpreadsheetApp.getUi().alert(detailText);
}

/**
 * n8nからバリデーション用データを更新
 * 外部からテキストデータを受け取って保存
 */
function updateValidationData(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { issueYearMonth, category, item, value } = data;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(issueYearMonth);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // カテゴリの行を探してバリデーションデータを保存
    const categoryCol = sheet.getRange('A:A').getValues();
    for (let i = 1; i < categoryCol.length; i++) {
      if (categoryCol[i][0] && categoryCol[i][0].startsWith(category + '.')) {
        // 素材インデックスを取得
        const materials = CONFIG.requiredMaterials[category] || [];
        const materialIdx = materials.indexOf(item);

        if (materialIdx >= 0) {
          // 素材チェック列のノートに値を保存
          const cell = sheet.getRange(i + 1, 4 + materialIdx);
          cell.setNote(`${item}\n---\n${value}`);  // 素材名と値を保存
        }
        break;
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
