/**
 * ゆめマガ進捗管理シート - 運用用GAS
 *
 * 【機能】
 * - 素材チェック（Driveフォルダ確認）
 * - バリデーション実行
 * - 新しい号のシート作成
 * - n8n連携（Webhook）
 *
 * 【初期設定用コードの場所】
 * docs/archive/yumemaga-progress-sheet-generator-full.js
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

  // 全素材一覧（ヘッダー順）- 19素材
  // ※「文字起こし」「原稿」は素材列ではなくステータス列で管理
  allMaterials: [
    // インタビュー系
    '録音データ',
    // 縦長写真
    '縦長メイン写真',
    '縦長高解像度写真',
    // 横長ヒーロー写真
    '横長ヒーロー写真',
    // 人物写真（バストアップ写真とプロフィール写真を統合）
    'プロフィール写真',
    '対象者写真',
    '代表写真',
    // 横長写真（横長写真1/2と横長画像1/2を統合）
    '横長写真1',
    '横長写真2',
    '横長画像3',
    '横長画像4',
    // ドキュメント（大切にしている言葉はバリデーションへ移行）
    'アウトライン',
    'ワイヤーフレーム',
    '情報シート',  // 変更情報シートと統合
    // デザイン素材
    'ロゴ',
    'アイキャッチ',
    '事業内容画像',
    '差し替え写真',
    'パートナー写真'
    // SNS情報（企業名、SNS種類、SNS URLはバリデーションへ移行）
  ],

  // カテゴリ別必要素材（どの素材が必要か）
  // ※「文字起こし」「原稿」は素材列には存在しないが、フォルダ作成用に含める
  categoryMaterials: {
    'A': ['録音データ', '文字起こし', '原稿', '縦長メイン写真', 'プロフィール写真', '横長写真1', '横長写真2'],
    'D': ['縦長高解像度写真'],
    'H': ['録音データ', '文字起こし', '原稿', '横長ヒーロー写真', 'プロフィール写真'],
    'I': ['録音データ', '文字起こし', '原稿', '横長ヒーロー写真', 'プロフィール写真'],
    'K': ['録音データ', '文字起こし', '原稿', '横長ヒーロー写真', '対象者写真', '横長写真1', '横長写真2'],
    'L': ['横長ヒーロー写真', '横長写真1', '横長写真2', '横長画像3', '横長画像4', 'アウトライン', 'ワイヤーフレーム'],
    'C': ['情報シート', 'ロゴ', 'アイキャッチ', '事業内容画像', '代表写真'],
    'E': ['情報シート', '差し替え写真'],
    'P': ['パートナー写真'],
    'G': ['ロゴ']
  },

  // カテゴリ別フォルダタイプ
  // monthly: {カテゴリ}/{月号}/{素材名}/ - 月ごとに管理
  // company: {カテゴリ}/{企業名}/{素材名}/ - 企業ごとに管理
  // flat: {カテゴリ}/{素材名}/ - フラット管理（月号なし）
  categoryFolderType: {
    'A': 'monthly',
    'D': 'monthly',
    'H': 'monthly',
    'I': 'monthly',
    'K': 'monthly',
    'L': 'monthly',
    'C': 'company',
    'E': 'monthly',
    'P': 'monthly',
    'G': 'flat'
  },

  // 列インデックス（新構造）
  // A=カテゴリ, B=対象名, C=期限, D〜V=素材(19列), W=素材ステータス, X=文字起こしステータス, Y=原稿ステータス, Z=バリデーション, AA=総合ステータス, AB=制作ステータス, AC=参考URL, AD=備考
  columns: {
    category: 1,        // A
    targetName: 2,      // B
    deadline: 3,        // C
    materialsStart: 4,  // D (素材開始)
    materialsEnd: 22,   // V (素材終了: 4+19-1)
    materialStatus: 23, // W
    transcriptionStatus: 24, // X (文字起こしステータス)
    manuscriptStatus: 25,    // Y (原稿ステータス)
    validation: 26,     // Z
    totalStatus: 27,    // AA
    productionStatus: 28, // AB
    referenceUrl: 29,   // AC
    notes: 30           // AD
  },

  // n8nワークフローステータス定義
  workflowStatuses: {
    transcription: ['未処理', '処理中', '完了', 'エラー', 'スキップ'],
    manuscript: ['未処理', '処理中', '完了', 'エラー', 'スキップ']
  },

  // ステータス定義
  statuses: {
    production: ['未着手', '制作中', '確認待ち', '確認OK', '修正対応中']
  },

  // DriveフォルダID
  driveFolderIds: {
    'A': '1HsE6sqBk99FhnNRxsEehmSep6WoO0_UF',
    'D': '10dN6Uw7OL8H7y5rLxwIG4FZAjzAAAbYh',
    'K': '1nzhI66AcjdiysN-hcu4YHMXa4VMorQ6M',
    'H': '1Ed8ivWWXI2J579k1od6jFTMhG1R1VoT2',
    'I': '1g1c6BkO2X6J6FOIlweWO0PGxmoFPVP9i',
    'L': '1D4wHHHSwi2jm2do8NHc0oopdc2EPs0_z',
    'C': '1furJEw0OgurILPq0nVuRBELhcxv6392L',
    'E': '1PmV2wjm_UvFE0yAWw0Pkul5lGlVV0cUy',
    'P': '14Yp54Mxp9HUQFYUZkMoMtTBgkrZENblQ',
    'G': '176lGQwN5xiPhLvAGrZ1HuDqQvl8xquiw'
  },

  // Driveフォルダ名
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

  // バリデーションチェック種別
  validationTypes: ['文字数', '空欄チェック', '存在', 'URL形式', '選択肢']
};

// ===== メニュー =====

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ゆめマガ管理')
    .addItem('新しい号を作成', 'showCreateIssueDialog')
    .addItem('Driveフォルダ作成', 'createMonthlyFolders')
    .addItem('テンプレート再生成', 'regenerateTemplate')
    .addSeparator()
    .addItem('素材チェック（Drive確認）', 'checkMaterialsFromDrive')
    .addItem('文字起こし・原稿チェック', 'checkTranscriptionAndManuscript')
    .addSeparator()
    .addItem('バリデーション実行', 'runValidation')
    .addItem('バリデーション結果詳細', 'showValidationDetails')
    .addSeparator()
    .addItem('フォルダ構造確認（デバッグ）', 'debugFolderStructure')
    .addToUi();
}

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

function createNewIssueSheet(issueYearMonth) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const template = ss.getSheetByName('テンプレート');

  if (!template) {
    SpreadsheetApp.getUi().alert('テンプレートシートが見つかりません。\n「テンプレート再生成」を先に実行してください。');
    return;
  }

  const newSheet = template.copyTo(ss);
  newSheet.setName(issueYearMonth);
  newSheet.setTabColor('#34a853');

  // 2行構造: カテゴリ数 × 2 行
  const totalRows = CONFIG.categories.length * 2;
  const materialColCount = CONFIG.allMaterials.length;

  // 素材チェックボックスとURL行をリセット
  const dataRange = newSheet.getRange(2, CONFIG.columns.materialsStart, totalRows, materialColCount);
  const values = dataRange.getValues();
  const resetValues = values.map((row, rowIdx) => {
    const isCheckRow = rowIdx % 2 === 0;  // 偶数インデックス = チェック行
    return row.map(cell => {
      if (cell === '-') return '-';  // グレーアウトは維持
      if (isCheckRow) {
        return cell === true || cell === false ? false : cell;  // チェックボックスはfalseに
      } else {
        return '';  // URL行は空に
      }
    });
  });
  dataRange.setValues(resetValues);

  // 各カテゴリのチェック行をリセット
  for (let i = 0; i < CONFIG.categories.length; i++) {
    const checkRow = 2 + (i * 2);  // チェック行
    const urlRow = checkRow + 1;   // URL行

    // チェック行のリセット
    newSheet.getRange(checkRow, CONFIG.columns.targetName).clearContent();       // 対象名
    newSheet.getRange(checkRow, CONFIG.columns.deadline).clearContent();         // 期限
    newSheet.getRange(checkRow, CONFIG.columns.transcriptionStatus).setValue('未処理'); // 文字起こしステータス
    newSheet.getRange(checkRow, CONFIG.columns.manuscriptStatus).setValue('未処理');    // 原稿ステータス
    newSheet.getRange(checkRow, CONFIG.columns.validation).setValue('未実行');   // バリデーション
    newSheet.getRange(checkRow, CONFIG.columns.productionStatus).setValue('未着手'); // 制作ステータス
    newSheet.getRange(checkRow, CONFIG.columns.referenceUrl).clearContent();     // 参考URL
    newSheet.getRange(checkRow, CONFIG.columns.notes).clearContent();            // 備考

    // URL行のリセット（参考URL・備考以外は空のまま）
    newSheet.getRange(urlRow, CONFIG.columns.referenceUrl).clearContent();
    newSheet.getRange(urlRow, CONFIG.columns.notes).clearContent();
  }

  SpreadsheetApp.getUi().alert(`${issueYearMonth} のシートを作成しました！`);
}

// ===== テンプレート生成機能 =====

/**
 * テンプレートシートを再生成（2行構造：チェック行 + URL行）
 */
function regenerateTemplate() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'テンプレート再生成',
    '新しい構造（2行/カテゴリ：チェック行+URL行）でテンプレートを再生成します。\n既存のテンプレートは上書きされます。\n\n続行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 既存テンプレートを削除
  let template = ss.getSheetByName('テンプレート');
  if (template) {
    ss.deleteSheet(template);
  }

  // 新しいテンプレートを作成
  template = ss.insertSheet('テンプレート');

  // ヘッダー行を作成
  const headers = [
    'カテゴリ',      // A (1)
    '対象名',        // B (2)
    '期限',          // C (3)
    ...CONFIG.allMaterials, // D〜V (4〜22) - 19素材
    '素材ステータス', // W (23)
    '文字起こしステータス', // X (24)
    '原稿ステータス', // Y (25)
    'バリデーション', // Z (26)
    '総合ステータス', // AA (27)
    '制作ステータス', // AB (28)
    '参考URL',       // AC (29)
    '備考'           // AD (30)
  ];

  // ヘッダーを設定
  template.getRange(1, 1, 1, headers.length).setValues([headers]);
  template.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4a86e8')
    .setFontColor('white')
    .setWrap(true);

  // 各カテゴリの行を追加（2行構造：チェック行 + URL行）
  let row = 2;
  CONFIG.categories.forEach(cat => {
    const categoryMaterials = CONFIG.categoryMaterials[cat.id] || [];
    const checkRow = row;      // チェック行
    const urlRow = row + 1;    // URL行

    // === チェック行 ===
    template.getRange(checkRow, CONFIG.columns.category).setValue(`${cat.id}. ${cat.name}`);
    template.getRange(checkRow, CONFIG.columns.transcriptionStatus).setValue('未処理'); // 文字起こしステータス
    template.getRange(checkRow, CONFIG.columns.manuscriptStatus).setValue('未処理');    // 原稿ステータス
    template.getRange(checkRow, CONFIG.columns.productionStatus).setValue('未着手');
    template.getRange(checkRow, CONFIG.columns.validation).setValue('未実行');

    // 各素材列にチェックボックスまたはグレーアウト
    CONFIG.allMaterials.forEach((material, idx) => {
      const colNum = CONFIG.columns.materialsStart + idx;
      const checkCell = template.getRange(checkRow, colNum);
      const urlCell = template.getRange(urlRow, colNum);

      if (categoryMaterials.includes(material)) {
        // 該当素材：チェックボックス
        checkCell.insertCheckboxes();
        checkCell.setValue(false);
        // URL行：空（フォルダ作成時にURL記載）
        urlCell.setFontSize(8);
        urlCell.setFontColor('#1a73e8');
      } else {
        // 非該当：グレーアウト
        checkCell.setBackground('#9e9e9e');
        checkCell.setValue('-');
        urlCell.setBackground('#9e9e9e');
        urlCell.setValue('-');
      }
    });

    // === URL行 ===
    template.getRange(urlRow, CONFIG.columns.category).setValue('');  // 空白
    template.getRange(urlRow, CONFIG.columns.targetName).setValue(''); // 空白
    template.getRange(urlRow, 1, 1, 3).setBackground('#f8f9fa');  // 薄いグレー背景

    // 素材ステータスの数式を設定（チェック行のみ）
    const materialCols = [];
    CONFIG.allMaterials.forEach((material, idx) => {
      if (categoryMaterials.includes(material)) {
        const colLetter = columnToLetter(CONFIG.columns.materialsStart + idx);
        materialCols.push(colLetter + checkRow);
      }
    });

    if (materialCols.length > 0) {
      const countParts = materialCols.map(col => `IF(${col}=TRUE,1,0)`);
      const countFormula = `=IF((${countParts.join('+')})>=${materialCols.length},"素材OK","素材収集中")`;
      template.getRange(checkRow, CONFIG.columns.materialStatus).setFormula(countFormula);
    } else {
      template.getRange(checkRow, CONFIG.columns.materialStatus).setValue('N/A');
    }

    // 総合ステータスの数式を設定（チェック行のみ）
    const msCol = columnToLetter(CONFIG.columns.materialStatus);
    const vCol = columnToLetter(CONFIG.columns.validation);
    const totalFormula = `=IF(AND(${msCol}${checkRow}="素材OK",${vCol}${checkRow}="OK"),"制作可能",IF(OR(${msCol}${checkRow}="素材収集中",${vCol}${checkRow}="未実行"),"準備中","要確認"))`;
    template.getRange(checkRow, CONFIG.columns.totalStatus).setFormula(totalFormula);

    row += 2;  // 2行進める
  });

  // 列幅調整
  template.setColumnWidth(1, 160);  // カテゴリ
  template.setColumnWidth(2, 120);  // 対象名
  template.setColumnWidth(3, 80);   // 期限

  // 素材列は少し広めに（URLが入るため）
  for (let i = 0; i < CONFIG.allMaterials.length; i++) {
    template.setColumnWidth(CONFIG.columns.materialsStart + i, 80);
  }

  template.setColumnWidth(CONFIG.columns.materialStatus, 90);
  template.setColumnWidth(CONFIG.columns.transcriptionStatus, 100);  // 文字起こしステータス
  template.setColumnWidth(CONFIG.columns.manuscriptStatus, 90);      // 原稿ステータス
  template.setColumnWidth(CONFIG.columns.validation, 90);
  template.setColumnWidth(CONFIG.columns.totalStatus, 90);
  template.setColumnWidth(CONFIG.columns.productionStatus, 100);
  template.setColumnWidth(CONFIG.columns.referenceUrl, 150);
  template.setColumnWidth(CONFIG.columns.notes, 150);

  // 条件付き書式を設定
  setTemplateConditionalFormatting(template);

  // 文字起こしステータスのプルダウン（チェック行のみ）
  const transcriptionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.workflowStatuses.transcription)
    .setAllowInvalid(false)
    .build();

  // 原稿ステータスのプルダウン（チェック行のみ）
  const manuscriptValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.workflowStatuses.manuscript)
    .setAllowInvalid(false)
    .build();

  // 制作ステータスのプルダウン（チェック行のみ）
  const productionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.statuses.production)
    .setAllowInvalid(false)
    .build();

  for (let i = 0; i < CONFIG.categories.length; i++) {
    const checkRow = 2 + (i * 2);
    template.getRange(checkRow, CONFIG.columns.transcriptionStatus).setDataValidation(transcriptionValidation);
    template.getRange(checkRow, CONFIG.columns.manuscriptStatus).setDataValidation(manuscriptValidation);
    template.getRange(checkRow, CONFIG.columns.productionStatus).setDataValidation(productionValidation);
  }

  // 行の固定
  template.setFrozenRows(1);
  template.setFrozenColumns(2);

  // シートタブの色
  template.setTabColor('#ff9900');

  ui.alert('テンプレートを再生成しました！\n\n「新しい号を作成」から号数シートを作成してください。');
}

/**
 * 列番号をアルファベットに変換
 */
function columnToLetter(column) {
  let letter = '';
  while (column > 0) {
    const remainder = (column - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

/**
 * テンプレートに条件付き書式を設定（2行構造対応）
 */
function setTemplateConditionalFormatting(sheet) {
  // 2行構造: カテゴリ数 × 2 行
  const totalRows = CONFIG.categories.length * 2;
  const rules = [];

  // 素材ステータス列
  const msRange = sheet.getRange(2, CONFIG.columns.materialStatus, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('素材OK')
    .setBackground('#b7e1cd')
    .setRanges([msRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('素材収集中')
    .setBackground('#fce8b2')
    .setRanges([msRange])
    .build());

  // バリデーション列
  const vRange = sheet.getRange(2, CONFIG.columns.validation, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('OK')
    .setBackground('#b7e1cd')
    .setRanges([vRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('NG')
    .setBackground('#f4cccc')
    .setRanges([vRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('未実行')
    .setBackground('#e0e0e0')
    .setRanges([vRange])
    .build());

  // 総合ステータス列
  const tsRange = sheet.getRange(2, CONFIG.columns.totalStatus, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('制作可能')
    .setBackground('#b7e1cd')
    .setFontColor('#006400')
    .setRanges([tsRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('準備中')
    .setBackground('#fce8b2')
    .setRanges([tsRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('要確認')
    .setBackground('#f4cccc')
    .setRanges([tsRange])
    .build());

  // 文字起こしステータス列
  const trRange = sheet.getRange(2, CONFIG.columns.transcriptionStatus, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('完了')
    .setBackground('#b7e1cd')
    .setRanges([trRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('処理中')
    .setBackground('#c9daf8')
    .setRanges([trRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('未処理')
    .setBackground('#e0e0e0')
    .setRanges([trRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('エラー')
    .setBackground('#f4cccc')
    .setRanges([trRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('スキップ')
    .setBackground('#fce8b2')
    .setRanges([trRange])
    .build());

  // 原稿ステータス列
  const msRange2 = sheet.getRange(2, CONFIG.columns.manuscriptStatus, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('完了')
    .setBackground('#b7e1cd')
    .setRanges([msRange2])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('処理中')
    .setBackground('#c9daf8')
    .setRanges([msRange2])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('未処理')
    .setBackground('#e0e0e0')
    .setRanges([msRange2])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('エラー')
    .setBackground('#f4cccc')
    .setRanges([msRange2])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('スキップ')
    .setBackground('#fce8b2')
    .setRanges([msRange2])
    .build());

  // 制作ステータス列
  const psRange = sheet.getRange(2, CONFIG.columns.productionStatus, totalRows, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('確認OK')
    .setBackground('#b7e1cd')
    .setRanges([psRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('確認待ち')
    .setBackground('#c9daf8')
    .setRanges([psRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('制作中')
    .setBackground('#fff2cc')
    .setRanges([psRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('修正対応中')
    .setBackground('#f4cccc')
    .setRanges([psRange])
    .build());

  sheet.setConditionalFormatRules(rules);
}

// ===== 素材チェック機能 =====

/**
 * Driveフォルダから素材をチェック
 * 新構造: {カテゴリ}/{月号}/{素材名}/ にファイルがあるか確認
 */
function checkMaterialsFromDrive() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  const monthFolderName = sheetName.slice(0, 4) + '_' + sheetName.slice(4, 6);

  let checkedCount = 0;
  let notFoundCount = 0;
  const results = [];

  // 各カテゴリを処理（2行構造）
  CONFIG.categories.forEach((cat, catIdx) => {
    const categoryId = cat.id;
    const folderId = CONFIG.driveFolderIds[categoryId];
    const folderType = CONFIG.categoryFolderType[categoryId];
    const categoryMaterials = CONFIG.categoryMaterials[categoryId] || [];

    const checkRow = 2 + (catIdx * 2);  // チェック行
    const targetName = activeSheet.getRange(checkRow, CONFIG.columns.targetName).getValue();

    const categoryResult = {
      category: categoryId,
      name: cat.name,
      targetName: targetName,
      details: []
    };

    if (!folderId) {
      categoryResult.message = 'フォルダID未設定';
      results.push(categoryResult);
      return;
    }

    // company タイプで対象名が未入力の場合はスキップ
    if (folderType === 'company' && !targetName) {
      categoryResult.message = '対象名未入力';
      results.push(categoryResult);
      return;
    }

    try {
      const categoryFolder = DriveApp.getFolderById(folderId);
      let parentFolder = null;

      // フォルダタイプに応じて親フォルダを特定
      if (folderType === 'monthly') {
        parentFolder = findFolderByName(categoryFolder, monthFolderName);
      } else if (folderType === 'company') {
        parentFolder = findFolderByName(categoryFolder, targetName);
      } else if (folderType === 'flat') {
        parentFolder = categoryFolder;
      }

      if (!parentFolder && folderType !== 'flat') {
        categoryResult.message = `親フォルダ未作成（${folderType === 'monthly' ? monthFolderName : targetName}）`;
        results.push(categoryResult);
        return;
      }

      // 各素材フォルダをチェック
      categoryMaterials.forEach(materialName => {
        const materialIdx = CONFIG.allMaterials.indexOf(materialName);
        if (materialIdx === -1) return;

        const colNum = CONFIG.columns.materialsStart + materialIdx;
        const cell = activeSheet.getRange(checkRow, colNum);

        // チェックボックスか確認
        const validation = cell.getDataValidation();
        const isCheckbox = validation && validation.getCriteriaType() === SpreadsheetApp.DataValidationCriteria.CHECKBOX;

        if (!isCheckbox) {
          categoryResult.details.push({ material: materialName, status: 'スキップ' });
          return;
        }

        // 素材フォルダを探す
        const materialFolder = findFolderByName(parentFolder, materialName);

        if (materialFolder) {
          // フォルダ内のファイルをチェック
          const files = getFilesInFolderDirect(materialFolder);

          if (files.length > 0) {
            cell.setValue(true);
            const fileNames = files.map(f => f.name).join(', ');
            cell.setNote(fileNames);
            checkedCount++;
            categoryResult.details.push({ material: materialName, status: '✓ ' + fileNames });
          } else {
            cell.setValue(false);
            cell.clearNote();
            notFoundCount++;
            categoryResult.details.push({ material: materialName, status: '✗ ファイルなし' });
          }
        } else {
          cell.setValue(false);
          cell.clearNote();
          notFoundCount++;
          categoryResult.details.push({ material: materialName, status: '✗ フォルダなし' });
        }
      });

    } catch (e) {
      categoryResult.message = 'エラー: ' + e.message;
    }

    results.push(categoryResult);
  });

  showMaterialCheckResults(results, checkedCount, notFoundCount);
}

/**
 * フォルダ内のファイルを直接取得
 */
function getFilesInFolderDirect(folder) {
  const files = [];
  try {
    const fileIterator = folder.getFiles();
    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      files.push({ name: file.getName(), id: file.getId() });
    }
  } catch (e) {}
  return files;
}

/**
 * 名前でフォルダを検索
 */
function findFolderByName(parentFolder, folderName) {
  if (!folderName || !parentFolder) return null;
  try {
    const folders = parentFolder.getFoldersByName(folderName);
    if (folders.hasNext()) return folders.next();

    const allFolders = parentFolder.getFolders();
    while (allFolders.hasNext()) {
      const folder = allFolders.next();
      if (folder.getName().includes(folderName)) return folder;
    }
  } catch (e) {}
  return null;
}

function showMaterialCheckResults(results, checkedCount, notFoundCount) {
  let message = '【素材チェック完了】\n\n';
  message += `✓ 素材あり: ${checkedCount} 件\n`;
  message += `✗ 未収集: ${notFoundCount} 件\n\n`;
  message += '【カテゴリ別結果】\n';

  results.forEach(r => {
    message += `\n[${r.category}. ${r.name || r.category}]`;
    if (r.targetName) message += ` - ${r.targetName}`;
    message += '\n';

    if (r.message) {
      message += `  ${r.message}\n`;
    } else if (r.details && r.details.length > 0) {
      r.details.forEach(d => {
        message += `  ・${d.material}: ${d.status}\n`;
      });
    }
  });

  // 結果をログに出力
  console.log(message);

  // アラートで表示（長い場合は切り詰め）
  if (message.length > 3000) {
    message = message.substring(0, 3000) + '\n\n... (続きはログを確認)';
  }
  SpreadsheetApp.getUi().alert(message);
}

/**
 * 文字起こし・原稿フォルダのファイル有無をチェックしてステータス更新
 */
function checkTranscriptionAndManuscript() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  const monthFolderName = sheetName.slice(0, 4) + '_' + sheetName.slice(4, 6);
  let report = `【文字起こし・原稿チェック】\n月号: ${monthFolderName}\n\n`;

  // インタビュー系カテゴリ（文字起こし・原稿が必要なカテゴリ）
  const interviewCategories = ['A', 'H', 'I', 'K'];

  CONFIG.categories.forEach((cat, catIdx) => {
    if (!interviewCategories.includes(cat.id)) return;

    const categoryId = cat.id;
    const folderId = CONFIG.driveFolderIds[categoryId];
    const folderType = CONFIG.categoryFolderType[categoryId];

    const checkRow = 2 + (catIdx * 2);
    const targetName = activeSheet.getRange(checkRow, CONFIG.columns.targetName).getValue();

    report += `[${categoryId}. ${cat.name}]`;
    if (targetName) report += ` - ${targetName}`;
    report += '\n';

    if (!folderId) {
      report += `  ⚠ フォルダID未設定\n\n`;
      return;
    }

    try {
      const categoryFolder = DriveApp.getFolderById(folderId);
      let parentFolder = null;

      if (folderType === 'monthly') {
        parentFolder = findFolderByName(categoryFolder, monthFolderName);
      } else if (folderType === 'company') {
        parentFolder = findFolderByName(categoryFolder, targetName);
      }

      if (!parentFolder) {
        report += `  ⚠ 親フォルダ未作成\n\n`;
        return;
      }

      // 文字起こしフォルダをチェック
      const transcriptionFolder = findFolderByName(parentFolder, '文字起こし');
      const transcriptionCell = activeSheet.getRange(checkRow, CONFIG.columns.transcriptionStatus);
      const currentTranscriptionStatus = transcriptionCell.getValue();

      if (transcriptionFolder) {
        const files = getFilesInFolderDirect(transcriptionFolder);
        if (files.length > 0) {
          const fileNames = files.map(f => f.name).join(', ');
          report += `  文字起こし: ✓ ${fileNames}\n`;
          // ステータスが「未処理」なら「完了」に更新
          if (currentTranscriptionStatus === '未処理') {
            transcriptionCell.setValue('完了');
            report += `    → ステータス更新: 完了\n`;
          }
        } else {
          report += `  文字起こし: ✗ ファイルなし\n`;
        }
      } else {
        report += `  文字起こし: ✗ フォルダなし\n`;
      }

      // 原稿フォルダをチェック
      const manuscriptFolder = findFolderByName(parentFolder, '原稿');
      const manuscriptCell = activeSheet.getRange(checkRow, CONFIG.columns.manuscriptStatus);
      const currentManuscriptStatus = manuscriptCell.getValue();

      if (manuscriptFolder) {
        const files = getFilesInFolderDirect(manuscriptFolder);
        if (files.length > 0) {
          const fileNames = files.map(f => f.name).join(', ');
          report += `  原稿: ✓ ${fileNames}\n`;
          // ステータスが「未処理」なら「完了」に更新
          if (currentManuscriptStatus === '未処理') {
            manuscriptCell.setValue('完了');
            report += `    → ステータス更新: 完了\n`;
          }
        } else {
          report += `  原稿: ✗ ファイルなし\n`;
        }
      } else {
        report += `  原稿: ✗ フォルダなし\n`;
      }

    } catch (e) {
      report += `  エラー: ${e.message}\n`;
    }

    report += '\n';
  });

  console.log(report);
  if (report.length > 3000) {
    report = report.substring(0, 3000) + '\n\n... (続きはログを確認)';
  }
  SpreadsheetApp.getUi().alert(report);
}

// ===== バリデーション機能 =====

function runValidation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  const validationSheet = ss.getSheetByName('バリデーション設定');
  if (!validationSheet) {
    SpreadsheetApp.getUi().alert('バリデーション設定シートが見つかりません。');
    return;
  }

  const validationData = validationSheet.getDataRange().getValues();
  const validationRules = [];

  for (let i = 1; i < validationData.length; i++) {
    const row = validationData[i];
    if (row[0] && row[6] === true) {
      validationRules.push({
        category: row[0].split('.')[0].trim(),
        item: row[1],
        type: row[2],
        condition: row[3],
        required: row[4],
        description: row[5]
      });
    }
  }

  const progressData = activeSheet.getDataRange().getValues();
  const results = [];
  let allPassed = true;

  for (let rowIdx = 1; rowIdx < progressData.length; rowIdx++) {
    const row = progressData[rowIdx];
    if (!row[0]) continue;

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

    const validationCell = activeSheet.getRange(rowIdx + 1, 12);
    if (categoryRules.length === 0) {
      validationCell.setValue('N/A');
    } else if (categoryPassed) {
      validationCell.setValue('OK');
    } else {
      validationCell.setValue('NG');
    }

    results.push(...categoryResults);
  }

  const cache = CacheService.getScriptCache();
  cache.put('lastValidationResults', JSON.stringify(results), 600);

  const ngCount = results.filter(r => !r.passed).length;
  const okCount = results.filter(r => r.passed).length;

  if (allPassed) {
    SpreadsheetApp.getUi().alert(`✅ バリデーション完了\n\n全 ${okCount} 項目がOKです。`);
  } else {
    SpreadsheetApp.getUi().alert(`⚠️ バリデーション完了\n\nOK: ${okCount} 項目\nNG: ${ngCount} 項目\n\n詳細は「バリデーション結果詳細」で確認してください。`);
  }
}

function executeValidation(rule, rowData, rowIdx, sheet) {
  const result = { passed: true, message: 'OK', actualValue: '' };

  switch (rule.type) {
    case '文字数':
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

function getTextValueForValidation(itemName, rowData, sheet, rowIdx) {
  const materialIdx = getMaterialIndex(itemName, rowData[0]);
  if (materialIdx >= 0) {
    const cell = sheet.getRange(rowIdx + 1, 4 + materialIdx);
    const note = cell.getNote();
    if (note && note.includes('\n---\n')) {
      return note.split('\n---\n')[1];
    }
  }

  if (itemName === '企業名' || itemName === '対象名') {
    return rowData[1];
  }

  return rowData[16] || '';
}

function getMaterialIndex(itemName, categoryCell) {
  const categoryId = categoryCell.split('.')[0].trim();
  const materials = CONFIG.requiredMaterials[categoryId] || [];
  return materials.indexOf(itemName);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

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

  let detailText = '⚠️ バリデーションNG項目:\n\n';
  const groupedByCategory = {};

  ngResults.forEach(r => {
    const key = `${r.category}. ${r.targetName}`;
    if (!groupedByCategory[key]) groupedByCategory[key] = [];
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

// ===== n8n連携用関数 =====

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

    const materialCol = 4 + materialIndex;
    sheet.getRange(targetRow, materialCol).setValue(checked ? 'TRUE' : 'FALSE');

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

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

// ===== デバッグ・ユーティリティ =====

/**
 * フォルダ構造を確認（デバッグ用）
 * 各カテゴリフォルダの直下のサブフォルダとファイルを一覧表示
 */
function debugFolderStructure() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  const folderName = sheetName.slice(0, 4) + '_' + sheetName.slice(4, 6);
  let report = `【フォルダ構造確認】\n対象月号: ${folderName}\n\n`;

  Object.keys(CONFIG.driveFolderIds).forEach(categoryId => {
    const folderId = CONFIG.driveFolderIds[categoryId];
    const catName = CONFIG.categories.find(c => c.id === categoryId)?.name || categoryId;
    report += `━━━ ${categoryId}. ${catName} ━━━\n`;

    try {
      const folder = DriveApp.getFolderById(folderId);
      report += `フォルダ名: ${folder.getName()}\n`;

      // サブフォルダ一覧
      report += `\n[サブフォルダ]\n`;
      const subFolders = folder.getFolders();
      let subFolderCount = 0;
      while (subFolders.hasNext()) {
        const sub = subFolders.next();
        report += `  📁 ${sub.getName()}\n`;

        // さらにその中のフォルダ（月号フォルダなど）
        const innerFolders = sub.getFolders();
        while (innerFolders.hasNext()) {
          const inner = innerFolders.next();
          const fileCount = countFilesInFolder(inner);
          report += `     └─ 📁 ${inner.getName()} (${fileCount}ファイル)\n`;
        }

        // 直下のファイル数
        const directFiles = countFilesInFolder(sub);
        if (directFiles > 0) {
          report += `     └─ (直下に${directFiles}ファイル)\n`;
        }
        subFolderCount++;
      }
      if (subFolderCount === 0) {
        report += `  (サブフォルダなし)\n`;
      }

      // 直下のファイル
      report += `\n[直下のファイル]\n`;
      const files = folder.getFiles();
      let fileCount = 0;
      while (files.hasNext() && fileCount < 5) {
        const file = files.next();
        report += `  📄 ${file.getName()}\n`;
        fileCount++;
      }
      if (fileCount === 0) {
        report += `  (ファイルなし)\n`;
      } else if (fileCount >= 5) {
        report += `  ... (他にもファイルあり)\n`;
      }

    } catch (e) {
      report += `エラー: ${e.message}\n`;
    }

    report += `\n`;
  });

  // 結果をログに出力（長すぎてalertに収まらない場合のため）
  console.log(report);

  // アラートで表示（長い場合は切り詰め）
  if (report.length > 3000) {
    report = report.substring(0, 3000) + '\n\n... (続きはログを確認)';
  }
  SpreadsheetApp.getUi().alert(report);
}

/**
 * フォルダ内のファイル数をカウント
 */
function countFilesInFolder(folder) {
  let count = 0;
  const files = folder.getFiles();
  while (files.hasNext()) {
    files.next();
    count++;
  }
  return count;
}

/**
 * 素材フォルダを作成してURLをシートに記載
 * 新構造: {カテゴリ}/{月号}/{素材名}/ または {カテゴリ}/{企業名}/{素材名}/
 */
function createMonthlyFolders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (['設定', 'バリデーション設定', 'テンプレート'].includes(sheetName)) {
    SpreadsheetApp.getUi().alert('号数シート（例: 202601）を選択してから実行してください。');
    return;
  }

  const monthFolderName = sheetName.slice(0, 4) + '_' + sheetName.slice(4, 6);
  const ui = SpreadsheetApp.getUi();

  // 確認ダイアログ
  const response = ui.alert(
    'Driveフォルダ作成',
    `各カテゴリの素材フォルダを作成し、URLをシートに記載します。\n\n月号: ${monthFolderName}\n\n続行しますか？`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  let createdCount = 0;
  let skippedCount = 0;
  let urlSetCount = 0;
  let report = `【フォルダ作成結果】\n月号: ${monthFolderName}\n\n`;

  // 各カテゴリを処理（2行構造）
  CONFIG.categories.forEach((cat, catIdx) => {
    const categoryId = cat.id;
    const folderId = CONFIG.driveFolderIds[categoryId];
    const folderType = CONFIG.categoryFolderType[categoryId];
    const categoryMaterials = CONFIG.categoryMaterials[categoryId] || [];

    const checkRow = 2 + (catIdx * 2);  // チェック行
    const urlRow = checkRow + 1;         // URL行

    // 対象名を取得（company タイプで使用）
    const targetName = activeSheet.getRange(checkRow, CONFIG.columns.targetName).getValue();

    report += `[${categoryId}. ${cat.name}]`;
    if (folderType === 'company' && targetName) {
      report += ` - ${targetName}`;
    }
    report += `\n`;

    if (!folderId) {
      report += `  ⚠ フォルダID未設定\n\n`;
      return;
    }

    // company タイプで対象名が未入力の場合はスキップ
    if (folderType === 'company' && !targetName) {
      report += `  ⚠ 対象名（企業名）を入力してから実行してください\n\n`;
      return;
    }

    try {
      const categoryFolder = DriveApp.getFolderById(folderId);
      let parentFolder;

      // フォルダタイプに応じて親フォルダを決定
      if (folderType === 'monthly') {
        // monthly: カテゴリ/月号/素材名
        parentFolder = getOrCreateFolder(categoryFolder, monthFolderName);
      } else if (folderType === 'company') {
        // company: カテゴリ/企業名/素材名
        parentFolder = getOrCreateFolder(categoryFolder, targetName);
      } else if (folderType === 'flat') {
        // flat: カテゴリ/素材名（月号フォルダなし）
        parentFolder = categoryFolder;
      }

      // 各素材フォルダを作成してURLを記載
      categoryMaterials.forEach(materialName => {
        const materialIdx = CONFIG.allMaterials.indexOf(materialName);
        if (materialIdx === -1) return;

        const colNum = CONFIG.columns.materialsStart + materialIdx;

        try {
          // 素材フォルダを取得または作成
          const materialFolder = getOrCreateFolder(parentFolder, materialName);
          const folderUrl = materialFolder.getUrl();

          // URL行にURLを記載
          const urlCell = activeSheet.getRange(urlRow, colNum);
          const currentUrl = urlCell.getValue();

          if (!currentUrl || currentUrl === '') {
            urlCell.setValue(folderUrl);
            urlSetCount++;
            report += `  ✓ ${materialName} (URL設定)\n`;
          } else {
            report += `  - ${materialName} (URL既存)\n`;
          }

          // フォルダが新規作成されたかチェック（getOrCreateFolderの戻り値で判定）
          if (materialFolder.newlyCreated) {
            createdCount++;
          } else {
            skippedCount++;
          }
        } catch (e) {
          report += `  ✗ ${materialName}: ${e.message}\n`;
        }
      });

      // 「文字起こし」フォルダの処理（素材列にはないがフォルダは必要）
      if (categoryMaterials.includes('文字起こし')) {
        try {
          const transcriptionFolder = getOrCreateFolder(parentFolder, '文字起こし');
          const folderUrl = transcriptionFolder.getUrl();

          // X列（文字起こしステータス）のURL行に記載
          const statusUrlCell = activeSheet.getRange(urlRow, CONFIG.columns.transcriptionStatus);
          const statusCurrentUrl = statusUrlCell.getValue();
          if (!statusCurrentUrl || statusCurrentUrl === '' || statusCurrentUrl === '-') {
            statusUrlCell.setValue(folderUrl);
            statusUrlCell.setFontSize(8);
            statusUrlCell.setFontColor('#1a73e8');
            statusUrlCell.setBackground(null);
            urlSetCount++;
            report += `  ✓ 文字起こし → X列 (URL設定)\n`;
          } else {
            report += `  - 文字起こし → X列 (URL既存)\n`;
          }

          if (transcriptionFolder.newlyCreated) {
            createdCount++;
          } else {
            skippedCount++;
          }
        } catch (e) {
          report += `  ✗ 文字起こし: ${e.message}\n`;
        }
      }

      // 「原稿」フォルダの処理（素材列にはないがフォルダは必要）
      if (categoryMaterials.includes('原稿')) {
        try {
          const manuscriptFolder = getOrCreateFolder(parentFolder, '原稿');
          const folderUrl = manuscriptFolder.getUrl();

          // Y列（原稿ステータス）のURL行に記載
          const statusUrlCell = activeSheet.getRange(urlRow, CONFIG.columns.manuscriptStatus);
          const statusCurrentUrl = statusUrlCell.getValue();
          if (!statusCurrentUrl || statusCurrentUrl === '' || statusCurrentUrl === '-') {
            statusUrlCell.setValue(folderUrl);
            statusUrlCell.setFontSize(8);
            statusUrlCell.setFontColor('#1a73e8');
            statusUrlCell.setBackground(null);
            urlSetCount++;
            report += `  ✓ 原稿 → Y列 (URL設定)\n`;
          } else {
            report += `  - 原稿 → Y列 (URL既存)\n`;
          }

          if (manuscriptFolder.newlyCreated) {
            createdCount++;
          } else {
            skippedCount++;
          }
        } catch (e) {
          report += `  ✗ 原稿: ${e.message}\n`;
        }
      }

    } catch (e) {
      report += `  エラー: ${e.message}\n`;
    }

    report += `\n`;
  });

  report += `━━━━━━━━━━━━━━━━\n`;
  report += `新規フォルダ: ${createdCount}\n`;
  report += `既存フォルダ: ${skippedCount}\n`;
  report += `URL設定: ${urlSetCount}\n`;

  // 結果をログに出力
  console.log(report);

  // アラートで表示（長い場合は切り詰め）
  if (report.length > 3000) {
    report = report.substring(0, 3000) + '\n\n... (続きはログを確認)';
  }
  ui.alert(report);
}

/**
 * フォルダを取得または作成
 * @param {Folder} parentFolder 親フォルダ
 * @param {string} folderName 作成するフォルダ名
 * @returns {Folder} フォルダオブジェクト（newlyCreatedプロパティ付き）
 */
function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    const folder = folders.next();
    folder.newlyCreated = false;
    return folder;
  }
  const newFolder = parentFolder.createFolder(folderName);
  newFolder.newlyCreated = true;
  return newFolder;
}
