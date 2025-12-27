/**
 * インサイトシート作成スクリプト
 *
 * 使用方法:
 * 1. Google Sheetsを開く
 * 2. 拡張機能 > Apps Script
 * 3. このコードを貼り付けて保存
 * 4. createInsightsSheets() を実行
 */

/**
 * メイン関数: insightsとmonthly_summaryシートを作成
 */
function createInsightsSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // insightsシート作成
  createInsightsSheet(ss);

  // monthly_summaryシート作成
  createMonthlySummarySheet(ss);

  SpreadsheetApp.getUi().alert('シート作成完了', 'insights と monthly_summary シートを作成しました。', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * insightsシートを作成
 */
function createInsightsSheet(ss) {
  // 既存シートがあれば削除
  let sheet = ss.getSheetByName('insights');
  if (sheet) {
    ss.deleteSheet(sheet);
  }

  // 新規シート作成
  sheet = ss.insertSheet('insights');

  // ヘッダー定義
  const headers = [
    'post_id',
    'ig_post_id',
    'fetched_at',
    'impressions',
    'reach',
    'likes',
    'comments',
    'saved',
    'shares',
    'plays',
    'follower_count',
    'engagement_rate'
  ];

  // ヘッダー設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // ヘッダースタイル
  headerRange
    .setBackground('#1a73e8')  // Googleブルー
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // ヘッダー行の高さ
  sheet.setRowHeight(1, 35);

  // 列幅設定
  const columnWidths = {
    1: 120,   // post_id
    2: 200,   // ig_post_id
    3: 180,   // fetched_at
    4: 100,   // impressions
    5: 100,   // reach
    6: 80,    // likes
    7: 80,    // comments
    8: 80,    // saved
    9: 80,    // shares
    10: 80,   // plays
    11: 120,  // follower_count
    12: 120   // engagement_rate
  };

  Object.keys(columnWidths).forEach(col => {
    sheet.setColumnWidth(parseInt(col), columnWidths[col]);
  });

  // データ範囲の書式設定（2行目以降、1000行分）
  const dataRange = sheet.getRange(2, 1, 1000, headers.length);

  // 交互の背景色
  const bandingTheme = SpreadsheetApp.BandingTheme.LIGHT_GREY;
  sheet.getRange(1, 1, 1001, headers.length).applyRowBanding(bandingTheme, true, false);

  // 数値列の書式設定
  sheet.getRange(2, 4, 1000, 7).setNumberFormat('#,##0');  // impressions〜plays
  sheet.getRange(2, 11, 1000, 1).setNumberFormat('#,##0'); // follower_count
  sheet.getRange(2, 12, 1000, 1).setNumberFormat('0.00"%"'); // engagement_rate

  // 日付列の書式
  sheet.getRange(2, 3, 1000, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

  // フィルター設定
  sheet.getRange(1, 1, 1, headers.length).createFilter();

  // 行固定
  sheet.setFrozenRows(1);

  // 条件付き書式: engagement_rate が 5% 以上なら緑
  const engagementColumn = sheet.getRange(2, 12, 1000, 1);
  const highEngagementRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(5)
    .setBackground('#b7e1cd')
    .setRanges([engagementColumn])
    .build();

  // 条件付き書式: engagement_rate が 2% 未満なら赤
  const lowEngagementRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(2)
    .setBackground('#f4c7c3')
    .setRanges([engagementColumn])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(highEngagementRule, lowEngagementRule);
  sheet.setConditionalFormatRules(rules);
}

/**
 * monthly_summaryシートを作成
 */
function createMonthlySummarySheet(ss) {
  // 既存シートがあれば削除
  let sheet = ss.getSheetByName('monthly_summary');
  if (sheet) {
    ss.deleteSheet(sheet);
  }

  // 新規シート作成
  sheet = ss.insertSheet('monthly_summary');

  // ヘッダー定義
  const headers = [
    'year_month',
    'total_posts',
    'total_reach',
    'total_impressions',
    'total_likes',
    'total_comments',
    'total_saved',
    'avg_engagement_rate',
    'follower_start',
    'follower_end',
    'follower_growth',
    'growth_rate'
  ];

  // ヘッダー設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // ヘッダースタイル
  headerRange
    .setBackground('#34a853')  // Googleグリーン
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // ヘッダー行の高さ
  sheet.setRowHeight(1, 35);

  // 列幅設定
  const columnWidths = {
    1: 100,   // year_month
    2: 100,   // total_posts
    3: 120,   // total_reach
    4: 130,   // total_impressions
    5: 100,   // total_likes
    6: 110,   // total_comments
    7: 100,   // total_saved
    8: 140,   // avg_engagement_rate
    9: 120,   // follower_start
    10: 120,  // follower_end
    11: 130,  // follower_growth
    12: 100   // growth_rate
  };

  Object.keys(columnWidths).forEach(col => {
    sheet.setColumnWidth(parseInt(col), columnWidths[col]);
  });

  // 交互の背景色
  const bandingTheme = SpreadsheetApp.BandingTheme.LIGHT_GREEN;
  sheet.getRange(1, 1, 101, headers.length).applyRowBanding(bandingTheme, true, false);

  // 数値列の書式設定
  sheet.getRange(2, 2, 100, 1).setNumberFormat('#,##0');  // total_posts
  sheet.getRange(2, 3, 100, 4).setNumberFormat('#,##0');  // total_reach〜total_saved
  sheet.getRange(2, 7, 100, 1).setNumberFormat('#,##0');  // total_saved
  sheet.getRange(2, 8, 100, 1).setNumberFormat('0.00"%"'); // avg_engagement_rate
  sheet.getRange(2, 9, 100, 3).setNumberFormat('#,##0');  // follower_start〜follower_growth
  sheet.getRange(2, 12, 100, 1).setNumberFormat('0.00"%"'); // growth_rate

  // フィルター設定
  sheet.getRange(1, 1, 1, headers.length).createFilter();

  // 行固定
  sheet.setFrozenRows(1);

  // 条件付き書式: follower_growth がプラスなら緑
  const growthColumn = sheet.getRange(2, 11, 100, 1);
  const positiveGrowthRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground('#b7e1cd')
    .setFontColor('#137333')
    .setRanges([growthColumn])
    .build();

  // 条件付き書式: follower_growth がマイナスなら赤
  const negativeGrowthRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground('#f4c7c3')
    .setFontColor('#a50e0e')
    .setRanges([growthColumn])
    .build();

  // growth_rate列にも同様の条件付き書式
  const growthRateColumn = sheet.getRange(2, 12, 100, 1);
  const positiveRateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground('#b7e1cd')
    .setFontColor('#137333')
    .setRanges([growthRateColumn])
    .build();

  const negativeRateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground('#f4c7c3')
    .setFontColor('#a50e0e')
    .setRanges([growthRateColumn])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(positiveGrowthRule, negativeGrowthRule, positiveRateRule, negativeRateRule);
  sheet.setConditionalFormatRules(rules);
}

/**
 * メニューに追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 インサイト管理')
    .addItem('シートを作成', 'createInsightsSheets')
    .addSeparator()
    .addItem('insightsシートのみ作成', 'createInsightsSheetOnly')
    .addItem('monthly_summaryシートのみ作成', 'createMonthlySummarySheetOnly')
    .addToUi();
}

function createInsightsSheetOnly() {
  createInsightsSheet(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getUi().alert('完了', 'insightsシートを作成しました。', SpreadsheetApp.getUi().ButtonSet.OK);
}

function createMonthlySummarySheetOnly() {
  createMonthlySummarySheet(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getUi().alert('完了', 'monthly_summaryシートを作成しました。', SpreadsheetApp.getUi().ButtonSet.OK);
}
