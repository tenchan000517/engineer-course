/**
 * ゆめスタパートナー管理シート - GAS
 *
 * 【機能】
 * - 新規月号シート作成（前月コピー＋初期化＋グレーアウト）
 * - 画像URL自動記載（ロゴ・QRコード）
 * - QRコード生成（URLからQRコード画像を生成）
 * - 全社確認チェック（onEdit自動実行）
 * - 報告フォーマット生成
 *
 * 【関連ドキュメント】
 * content/HANDOFF-yumesuta-partner.md
 */

// ===== 設定 =====
const CONFIG = {
  // DriveフォルダID
  driveFolders: {
    parent: '14Yp54Mxp9HUQFYUZkMoMtTBgkrZENblQ',  // P_パートナー一覧
    logo: '',      // ロゴフォルダID（後で設定）
    qrCode: ''     // QRコードフォルダID（後で設定）
  },

  // 列インデックス（1始まり）
  columns: {
    companyName: 1,      // A: 企業名
    position: 2,         // B: 役職
    displayName: 3,      // C: 掲載名
    url: 4,              // D: URL
    magazinePublish: 5,  // E: 掲載有無（雑誌）
    magazineEndDate: 6,  // F: 掲載終了時期（雑誌）
    hpPublish: 7,        // G: HP掲載有無
    hpEndDate: 8,        // H: HP掲載終了時期
    logoUrl: 9,          // I: ロゴURL
    qrCodeUrl: 10        // J: QRコードURL
  },

  // シート上部の固定行数（ヘッダー情報エリア）
  headerRows: 4,

  // 全社確認OKのセル位置
  allConfirmCell: 'B3',

  // 必須項目
  requiredFields: ['companyName', 'position', 'displayName', 'url'],

  // QRコード生成API（QR Server API - 無料）
  // サイズ: 200x200, フォーマット: png
  qrApiUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data='
};

// ===== メニュー =====

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('パートナー管理')
    .addItem('新規月号シート作成', 'showCreateMonthDialog')
    .addSeparator()
    .addItem('画像URL自動記載', 'updateImageUrls')
    .addItem('QRコード一括生成', 'generateQrCodes')
    .addSeparator()
    .addItem('全社確認チェック（手動）', 'runAllConfirmCheck')
    .addItem('不足項目一覧表示', 'showMissingItems')
    .addSeparator()
    .addItem('フォルダ設定', 'showFolderSettings')
    .addItem('フォルダ構造初期化', 'initializeFolderStructure')
    .addToUi();
}

// ===== 新規月号シート作成 =====

/**
 * 新規月号シート作成ダイアログを表示
 */
function showCreateMonthDialog() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '新規月号シート作成',
    '号数を入力してください（例: 202601）',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const issueYearMonth = response.getResponseText().trim();
    if (/^\d{6}$/.test(issueYearMonth)) {
      createNewMonthSheet(issueYearMonth);
    } else {
      ui.alert('形式が正しくありません。6桁の数字（例: 202601）で入力してください。');
    }
  }
}

/**
 * 新規月号シートを作成
 * - 前月シートをコピー
 * - E列（掲載有無）を全てFALSEに
 * - G列（HP掲載有無）を全てFALSEに
 * - 前月でFALSEだった行はグレーアウト
 */
function createNewMonthSheet(issueYearMonth) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // 既存シートチェック
  if (ss.getSheetByName(issueYearMonth)) {
    ui.alert(`${issueYearMonth} のシートは既に存在します。`);
    return;
  }

  // 前月の号数を計算
  const year = parseInt(issueYearMonth.slice(0, 4));
  const month = parseInt(issueYearMonth.slice(4, 6));
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  const prevIssue = `${prevYear}${String(prevMonth).padStart(2, '0')}`;

  // 前月シートを取得
  const prevSheet = ss.getSheetByName(prevIssue);
  if (!prevSheet) {
    // 前月シートがない場合はテンプレートを探す
    const template = ss.getSheetByName('テンプレート');
    if (!template) {
      ui.alert(`前月シート（${prevIssue}）もテンプレートも見つかりません。\n先にテンプレートを作成してください。`);
      return;
    }
    // テンプレートからコピー
    const newSheet = template.copyTo(ss);
    newSheet.setName(issueYearMonth);
    newSheet.setTabColor('#34a853');
    ui.alert(`${issueYearMonth} のシートをテンプレートから作成しました。`);
    return;
  }

  // 前月シートをコピー
  const newSheet = prevSheet.copyTo(ss);
  newSheet.setName(issueYearMonth);
  newSheet.setTabColor('#34a853');

  // データ範囲を取得（ヘッダー行以降）
  const lastRow = newSheet.getLastRow();
  const lastCol = newSheet.getLastColumn();

  if (lastRow <= CONFIG.headerRows) {
    ui.alert(`${issueYearMonth} のシートを作成しましたが、データがありません。`);
    return;
  }

  const dataStartRow = CONFIG.headerRows + 1;
  const dataRows = lastRow - CONFIG.headerRows;

  // 前月のE列（掲載有無）の値を記録
  const prevPublishRange = newSheet.getRange(dataStartRow, CONFIG.columns.magazinePublish, dataRows, 1);
  const prevPublishValues = prevPublishRange.getValues();

  // E列（掲載有無）を全てFALSEに
  const falseValues = prevPublishValues.map(() => [false]);
  prevPublishRange.setValues(falseValues);

  // G列（HP掲載有無）を全てFALSEに
  const hpPublishRange = newSheet.getRange(dataStartRow, CONFIG.columns.hpPublish, dataRows, 1);
  hpPublishRange.setValues(falseValues);

  // 全社確認OKをFALSEに
  newSheet.getRange(CONFIG.allConfirmCell).setValue(false);

  // 前月でFALSEだった行をグレーアウト
  for (let i = 0; i < dataRows; i++) {
    const rowNum = dataStartRow + i;
    const wasFalse = prevPublishValues[i][0] === false || prevPublishValues[i][0] === 'FALSE';

    if (wasFalse) {
      // 行全体をグレーアウト
      newSheet.getRange(rowNum, 1, 1, lastCol).setBackground('#e0e0e0');
    } else {
      // 通常表示（背景色をクリア）
      newSheet.getRange(rowNum, 1, 1, lastCol).setBackground(null);
    }
  }

  // シートタイトルを更新
  const titleCell = newSheet.getRange('A1');
  const titleYear = Math.floor(year + (month > 10 ? 1 : 0));
  const displayMonth = month;
  titleCell.setValue(`【${titleYear}年${String(displayMonth).padStart(2, '0')}月号】`);

  ui.alert(`${issueYearMonth} のシートを作成しました！\n\n前月（${prevIssue}）でFALSEだった行はグレーアウトされています。`);
}

// ===== 画像URL自動記載 =====

/**
 * ロゴ・QRコードのURLをシートに自動記載
 */
function updateImageUrls() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  // フォルダIDを取得
  const logoFolderId = getLogoFolderId();
  const qrFolderId = getQrCodeFolderId();

  if (!logoFolderId || !qrFolderId) {
    ui.alert('フォルダIDが設定されていません。\n「フォルダ設定」から設定してください。');
    return;
  }

  try {
    const logoFolder = DriveApp.getFolderById(logoFolderId);
    const qrFolder = DriveApp.getFolderById(qrFolderId);

    // ロゴフォルダ内のファイル一覧を取得
    const logoFiles = getFilesMap(logoFolder);
    const qrFiles = getFilesMap(qrFolder);

    // データ範囲を取得
    const lastRow = sheet.getLastRow();
    if (lastRow <= CONFIG.headerRows) {
      ui.alert('データがありません。');
      return;
    }

    const dataStartRow = CONFIG.headerRows + 1;
    const dataRows = lastRow - CONFIG.headerRows;

    // 企業名を取得
    const companyNames = sheet.getRange(dataStartRow, CONFIG.columns.companyName, dataRows, 1).getValues();

    let updatedCount = 0;

    for (let i = 0; i < dataRows; i++) {
      const rowNum = dataStartRow + i;
      const companyName = companyNames[i][0];

      if (!companyName) continue;

      // ロゴURLを検索・設定
      const logoFile = findFileByName(logoFiles, companyName);
      if (logoFile) {
        const logoUrlCell = sheet.getRange(rowNum, CONFIG.columns.logoUrl);
        if (!logoUrlCell.getValue()) {
          logoUrlCell.setValue(logoFile.url);
          updatedCount++;
        }
      }

      // QRコードURLを検索・設定
      const qrFile = findFileByName(qrFiles, companyName);
      if (qrFile) {
        const qrUrlCell = sheet.getRange(rowNum, CONFIG.columns.qrCodeUrl);
        if (!qrUrlCell.getValue()) {
          qrUrlCell.setValue(qrFile.url);
          updatedCount++;
        }
      }
    }

    ui.alert(`画像URL記載完了\n\n更新件数: ${updatedCount} 件`);

  } catch (e) {
    ui.alert(`エラーが発生しました: ${e.message}`);
  }
}

/**
 * フォルダ内のファイルをマップとして取得
 */
function getFilesMap(folder) {
  const files = {};
  const fileIterator = folder.getFiles();
  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    const name = file.getName();
    const nameWithoutExt = name.replace(/\.[^.]+$/, '');
    files[nameWithoutExt] = {
      name: name,
      id: file.getId(),
      url: file.getUrl()
    };
  }
  return files;
}

/**
 * 企業名でファイルを検索
 */
function findFileByName(filesMap, companyName) {
  // 完全一致
  if (filesMap[companyName]) {
    return filesMap[companyName];
  }
  // 部分一致
  for (const key in filesMap) {
    if (key.includes(companyName) || companyName.includes(key)) {
      return filesMap[key];
    }
  }
  return null;
}

// ===== QRコード生成 =====

/**
 * QRコードを一括生成
 */
function generateQrCodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  const qrFolderId = getQrCodeFolderId();
  if (!qrFolderId) {
    ui.alert('QRコードフォルダIDが設定されていません。\n「フォルダ設定」から設定してください。');
    return;
  }

  // 確認ダイアログ
  const response = ui.alert(
    'QRコード一括生成',
    '掲載有無=TRUEの企業のQRコードを生成します。\n既存のQRコードは上書きされません。\n\n続行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  try {
    const qrFolder = DriveApp.getFolderById(qrFolderId);

    // データ範囲を取得
    const lastRow = sheet.getLastRow();
    if (lastRow <= CONFIG.headerRows) {
      ui.alert('データがありません。');
      return;
    }

    const dataStartRow = CONFIG.headerRows + 1;
    const dataRows = lastRow - CONFIG.headerRows;

    // 必要なデータを取得
    const dataRange = sheet.getRange(dataStartRow, 1, dataRows, CONFIG.columns.qrCodeUrl);
    const data = dataRange.getValues();

    let generatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let i = 0; i < dataRows; i++) {
      const row = data[i];
      const companyName = row[CONFIG.columns.companyName - 1];
      const url = row[CONFIG.columns.url - 1];
      const publishFlag = row[CONFIG.columns.magazinePublish - 1];
      const existingQrUrl = row[CONFIG.columns.qrCodeUrl - 1];

      // 掲載有無=FALSE または URLが空 の場合はスキップ
      if (publishFlag !== true && publishFlag !== 'TRUE') {
        continue;
      }

      if (!url) {
        errors.push(`${companyName}: URLが空です`);
        continue;
      }

      if (!companyName) {
        continue;
      }

      // 既にQRコードがある場合はスキップ
      if (existingQrUrl) {
        skippedCount++;
        continue;
      }

      // QRコードを生成
      try {
        const qrFile = createQrCode(qrFolder, companyName, url);

        // URLをシートに記載
        const rowNum = dataStartRow + i;
        sheet.getRange(rowNum, CONFIG.columns.qrCodeUrl).setValue(qrFile.getUrl());

        generatedCount++;
      } catch (e) {
        errors.push(`${companyName}: ${e.message}`);
      }
    }

    let message = `QRコード生成完了\n\n`;
    message += `生成: ${generatedCount} 件\n`;
    message += `スキップ（既存）: ${skippedCount} 件\n`;

    if (errors.length > 0) {
      message += `\nエラー:\n${errors.join('\n')}`;
    }

    ui.alert(message);

  } catch (e) {
    ui.alert(`エラーが発生しました: ${e.message}`);
  }
}

/**
 * QRコードを生成してDriveに保存
 */
function createQrCode(folder, companyName, url) {
  const qrUrl = CONFIG.qrApiUrl + encodeURIComponent(url);
  const response = UrlFetchApp.fetch(qrUrl);
  const blob = response.getBlob().setName(`${companyName}.png`);

  // 既存ファイルをチェック
  const existingFiles = folder.getFilesByName(`${companyName}.png`);
  if (existingFiles.hasNext()) {
    // 既存ファイルを削除
    existingFiles.next().setTrashed(true);
  }

  return folder.createFile(blob);
}

// ===== 全社確認チェック =====

/**
 * onEditトリガー: 全社確認OKセルの変更を監視
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // 全社確認OKセルの変更をチェック
  if (range.getA1Notation() === CONFIG.allConfirmCell) {
    const newValue = range.getValue();

    if (newValue === true || newValue === 'TRUE') {
      // 全社確認チェックを実行
      const result = runAllConfirmCheckInternal(sheet);

      if (!result.success) {
        // 不足がある場合はFALSEに戻す
        range.setValue(false);
        showMissingItemsAlert(result.missing);
      } else {
        // 不足がない場合は報告フォーマットを表示
        showReportFormat(sheet);
      }
    }
  }
}

/**
 * 全社確認チェック（手動実行用）
 */
function runAllConfirmCheck() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  const result = runAllConfirmCheckInternal(sheet);

  if (!result.success) {
    showMissingItemsAlert(result.missing);
  } else {
    ui.alert('✅ 不足項目はありません。\n\n全社確認OKをTRUEにして報告フォーマットを生成してください。');
  }
}

/**
 * 全社確認チェック（内部処理）
 * チェック方法: シートのURL列に値があるかどうかで判定
 */
function runAllConfirmCheckInternal(sheet) {
  const result = {
    success: true,
    missing: [],
    publishedCount: 0
  };

  // データ範囲を取得
  const lastRow = sheet.getLastRow();
  if (lastRow <= CONFIG.headerRows) {
    return result;
  }

  const dataStartRow = CONFIG.headerRows + 1;
  const dataRows = lastRow - CONFIG.headerRows;

  // データを取得
  const dataRange = sheet.getRange(dataStartRow, 1, dataRows, CONFIG.columns.qrCodeUrl);
  const data = dataRange.getValues();

  for (let i = 0; i < dataRows; i++) {
    const row = data[i];
    const companyName = row[CONFIG.columns.companyName - 1];
    const position = row[CONFIG.columns.position - 1];
    const displayName = row[CONFIG.columns.displayName - 1];
    const url = row[CONFIG.columns.url - 1];
    const publishFlag = row[CONFIG.columns.magazinePublish - 1];
    const logoUrl = row[CONFIG.columns.logoUrl - 1];
    const qrCodeUrl = row[CONFIG.columns.qrCodeUrl - 1];

    // 掲載有無=FALSE の場合はスキップ
    if (publishFlag !== true && publishFlag !== 'TRUE') {
      continue;
    }

    result.publishedCount++;

    const missingItems = [];

    // 必須項目チェック
    if (!companyName || String(companyName).trim() === '') missingItems.push('企業名');
    if (!position || String(position).trim() === '') missingItems.push('役職');
    if (!displayName || String(displayName).trim() === '') missingItems.push('掲載名');
    if (!url || String(url).trim() === '') missingItems.push('URL');

    // ロゴチェック（I列にURLがあるか）
    if (!logoUrl || String(logoUrl).trim() === '') {
      missingItems.push('ロゴ未登録');
    }

    // QRコードチェック（J列にURLがあるか）
    if (!qrCodeUrl || String(qrCodeUrl).trim() === '') {
      missingItems.push('QRコード未生成');
    }

    if (missingItems.length > 0) {
      result.success = false;
      result.missing.push({
        company: companyName || '(企業名なし)',
        items: missingItems
      });
    }
  }

  return result;
}

/**
 * 不足項目一覧をアラート表示
 */
function showMissingItemsAlert(missing) {
  const ui = SpreadsheetApp.getUi();

  let message = '⚠️ 以下の項目が不足しています：\n\n';

  missing.forEach(m => {
    message += `・${m.company}: ${m.items.join(', ')}\n`;
  });

  message += '\n全社確認OKをFALSEに戻しました。\n不足項目を修正してから再度チェックしてください。';

  ui.alert(message);
}

/**
 * 不足項目一覧表示（手動実行用）
 */
function showMissingItems() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  const result = runAllConfirmCheckInternal(sheet);

  if (result.missing.length === 0) {
    ui.alert('✅ 不足項目はありません。');
  } else {
    showMissingItemsAlert(result.missing);
  }
}

// ===== 報告フォーマット生成 =====

/**
 * 報告フォーマットを表示
 */
function showReportFormat(sheet) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = sheet ? sheet.getName() : ss.getActiveSheet().getName();

  // 掲載企業数をカウント
  const result = runAllConfirmCheckInternal(sheet || ss.getActiveSheet());

  // 日付フォーマット
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy/MM/dd');

  // 月号を整形
  let displayIssue = sheetName;
  if (/^\d{6}$/.test(sheetName)) {
    const year = sheetName.slice(0, 4);
    const month = sheetName.slice(4, 6);
    displayIssue = `${year}年${month}月号`;
  }

  const message = `✅ 不足はありませんでした

指定のフォーマットに沿って担当者に報告してください

━━━ 報告フォーマット ━━━
【${displayIssue} パートナー確認完了】
掲載企業数: ${result.publishedCount}社
確認日: ${dateStr}
確認者: ○○

制作開始OKです。
━━━━━━━━━━━━━━━━`;

  ui.alert(message);
}

// ===== フォルダ設定 =====

/**
 * フォルダ設定ダイアログを表示
 */
function showFolderSettings() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();

  const currentLogoId = props.getProperty('logoFolderId') || '(未設定)';
  const currentQrId = props.getProperty('qrCodeFolderId') || '(未設定)';

  const response = ui.alert(
    'フォルダ設定',
    `現在の設定:\nロゴフォルダID: ${currentLogoId}\nQRコードフォルダID: ${currentQrId}\n\n変更しますか？`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  // ロゴフォルダID入力
  const logoResponse = ui.prompt('ロゴフォルダのIDを入力してください（空欄でスキップ）');
  if (logoResponse.getSelectedButton() === ui.Button.OK) {
    const logoId = logoResponse.getResponseText().trim();
    if (logoId) {
      props.setProperty('logoFolderId', logoId);
    }
  }

  // QRコードフォルダID入力
  const qrResponse = ui.prompt('QRコードフォルダのIDを入力してください（空欄でスキップ）');
  if (qrResponse.getSelectedButton() === ui.Button.OK) {
    const qrId = qrResponse.getResponseText().trim();
    if (qrId) {
      props.setProperty('qrCodeFolderId', qrId);
    }
  }

  ui.alert('フォルダ設定を更新しました。');
}

/**
 * フォルダ構造を初期化（ロゴ・QRコードフォルダを作成）
 */
function initializeFolderStructure() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();

  const response = ui.alert(
    'フォルダ構造初期化',
    `P_パートナー一覧フォルダ内に「ロゴ」「QRコード」フォルダを作成します。\n\n続行しますか？`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  try {
    const parentFolder = DriveApp.getFolderById(CONFIG.driveFolders.parent);

    // ロゴフォルダを作成または取得
    let logoFolder;
    const logoFolders = parentFolder.getFoldersByName('ロゴ');
    if (logoFolders.hasNext()) {
      logoFolder = logoFolders.next();
    } else {
      logoFolder = parentFolder.createFolder('ロゴ');
    }
    props.setProperty('logoFolderId', logoFolder.getId());

    // QRコードフォルダを作成または取得
    let qrFolder;
    const qrFolders = parentFolder.getFoldersByName('QRコード');
    if (qrFolders.hasNext()) {
      qrFolder = qrFolders.next();
    } else {
      qrFolder = parentFolder.createFolder('QRコード');
    }
    props.setProperty('qrCodeFolderId', qrFolder.getId());

    ui.alert(`フォルダ構造を初期化しました。\n\nロゴフォルダ: ${logoFolder.getUrl()}\nQRコードフォルダ: ${qrFolder.getUrl()}`);

  } catch (e) {
    ui.alert(`エラーが発生しました: ${e.message}`);
  }
}

/**
 * ロゴフォルダIDを取得
 */
function getLogoFolderId() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('logoFolderId') || CONFIG.driveFolders.logo;
}

/**
 * QRコードフォルダIDを取得
 */
function getQrCodeFolderId() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('qrCodeFolderId') || CONFIG.driveFolders.qrCode;
}
