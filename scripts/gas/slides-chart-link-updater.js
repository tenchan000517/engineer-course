/**
 * スライド グラフリンク一括更新スクリプト
 *
 * 概要:
 * Google スライドにリンクされたスプレッドシートのグラフを、
 * 別のスプレッドシートに一括で切り替えるツール
 *
 * 使用シーン:
 * - 原本スライド＋スプレッドシートをコピーして新規企業用に使う場合
 * - コピー後、スライドのグラフが原本スプレッドシートを参照したままになる問題を解決
 *
 * 使用方法:
 * 1. Google スライドを開く
 * 2. 拡張機能 > Apps Script
 * 3. このコードを貼り付けて保存
 * 4. スライドをリロード
 * 5. メニュー「🔗 リンク設定」→「新しいスプレッドシートにリンク」
 * 6. 新しいスプレッドシートのIDまたはURLを入力して実行
 *
 * 注意:
 * - コピー元とコピー先のスプレッドシートでチャートIDが同じである必要があります
 * - 通常、スプレッドシートをコピーするとチャートIDは保持されます
 */

// メニューを追加
function onOpen() {
  SlidesApp.getUi()
    .createMenu('🔗 リンク設定')
    .addItem('新しいスプレッドシートにリンク', 'showLinkDialog')
    .addItem('現状分析', 'analyzeChartLinks')
    .addToUi();
}

// 現状分析
function analyzeChartLinks() {
  var ui = SlidesApp.getUi();
  var presentation = SlidesApp.getActivePresentation();
  var slides = presentation.getSlides();

  var spreadsheetIds = {};
  var totalCharts = 0;

  slides.forEach(function(slide) {
    var charts = slide.getSheetsCharts();
    charts.forEach(function(chart) {
      var id = chart.getSpreadsheetId();
      spreadsheetIds[id] = (spreadsheetIds[id] || 0) + 1;
      totalCharts++;
    });
  });

  var idList = Object.keys(spreadsheetIds).map(function(id) {
    return id + ' (' + spreadsheetIds[id] + '個)';
  }).join('\n');

  ui.alert(
    '📊 分析結果',
    'グラフ総数: ' + totalCharts + ' 件\n\nリンク先スプレッドシートID:\n' + idList,
    ui.ButtonSet.OK
  );
}

// ダイアログを表示
function showLinkDialog() {
  // 現在のリンク先IDを取得
  var currentId = getCurrentSpreadsheetId();

  var html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box;
              font-size: 14px; border: 2px solid #ddd; border-radius: 4px; }
      input:focus { border-color: #4285f4; outline: none; }
      button { background-color: #4285f4; color: white; padding: 12px 20px;
               border: none; cursor: pointer; width: 100%; font-size: 16px;
               border-radius: 4px; margin-top: 10px; }
      button:hover { background-color: #3367d6; }
      button:disabled { background-color: #ccc; cursor: not-allowed; }
      .info { background-color: #e8f4fd; padding: 12px; border-radius: 4px;
              color: #333; font-size: 13px; margin: 15px 0; line-height: 1.6;
              border-left: 4px solid #4285f4; }
      .example { color: #666; font-size: 11px; font-family: monospace;
                 background: #f5f5f5; padding: 8px; margin-top: 8px;
                 border-radius: 3px; word-break: break-all; }
      h3 { color: #333; margin-top: 0; }
      label { font-weight: bold; color: #333; }
      #status { margin-top: 15px; padding: 12px; border-radius: 4px;
                font-weight: bold; display: none; }
      .success { background-color: #d4edda; color: #155724; display: block; }
      .error { background-color: #f8d7da; color: #721c24; display: block; }
      .processing { background-color: #fff3cd; color: #856404; display: block; }
      .current-info { background-color: #f8f9fa; padding: 10px; border-radius: 4px;
                      font-size: 12px; color: #666; margin-bottom: 15px; }
      .current-info code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; }

      /* スピナーアニメーション */
      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 3px solid #856404;
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        vertical-align: middle;
        margin-right: 8px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* オーバーレイ */
      #overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      #overlay.show { display: flex; }
      .overlay-content {
        text-align: center;
        padding: 30px;
      }
      .overlay-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #4285f4;
        border-top: 5px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      .overlay-text {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      .overlay-subtext {
        font-size: 14px;
        color: #666;
        margin-top: 10px;
      }
    </style>

    <!-- 処理中オーバーレイ -->
    <div id="overlay">
      <div class="overlay-content">
        <div class="overlay-spinner"></div>
        <div class="overlay-text">🔄 リンク更新中...</div>
        <div class="overlay-subtext">グラフを新しいスプレッドシートに接続しています<br>しばらくお待ちください</div>
      </div>
    </div>

    <h3>📊 新しいスプレッドシートにリンク</h3>

    <div class="current-info">
      📌 現在のリンク先: <code>${currentId || '取得できませんでした'}</code>
    </div>

    <div class="info">
      <strong>📝 使い方：</strong><br>
      1. コピーしたスプレッドシートのURLを開く<br>
      2. URLバーから以下の部分をコピー（またはURL全体でもOK）<br>
      <div class="example">
        https://docs.google.com/spreadsheets/d/<strong style="color: #d63031;">ここの英数字の部分</strong>/edit
      </div>
      3. 下のボックスに貼り付けて「リンク更新」ボタンをクリック
    </div>

    <label for="sheetId">新しいスプレッドシートID：</label>
    <input type="text" id="sheetId" placeholder="IDまたはURL全体を貼り付け">

    <button id="updateBtn" onclick="updateLinks()">🔗 リンク更新</button>

    <div id="status"></div>

    <script>
      var OLD_SPREADSHEET_ID = '${currentId}';

      function updateLinks() {
        var sheetId = document.getElementById('sheetId').value.trim();

        if (!sheetId) {
          showStatus('❌ スプレッドシートIDを入力してください', 'error');
          return;
        }

        // URLが貼り付けられた場合、IDを抽出
        if (sheetId.includes('docs.google.com') || sheetId.includes('/d/')) {
          var match = sheetId.match(/\\/d\\/([a-zA-Z0-9-_]+)/);
          if (match) {
            sheetId = match[1];
          } else {
            showStatus('❌ 正しいスプレッドシートURLではありません', 'error');
            return;
          }
        }

        if (sheetId === OLD_SPREADSHEET_ID) {
          showStatus('❌ 現在のリンク先と同じIDです', 'error');
          return;
        }

        // オーバーレイを表示
        document.getElementById('overlay').classList.add('show');
        document.getElementById('updateBtn').disabled = true;

        google.script.run
          .withSuccessHandler(onSuccess)
          .withFailureHandler(onFailure)
          .updateAllChartLinks(OLD_SPREADSHEET_ID, sheetId);
      }

      function onSuccess(result) {
        // オーバーレイを非表示
        document.getElementById('overlay').classList.remove('show');

        var successMatch = result.match(/成功: (\\d+)/);
        var skipMatch = result.match(/スキップ: (\\d+)/);
        var errorMatch = result.match(/エラー: (\\d+)/);

        var success = successMatch ? successMatch[1] : '0';
        var skip = skipMatch ? skipMatch[1] : '0';
        var errors = errorMatch ? errorMatch[1] : '0';

        var message = '✅ 完了！<br><br>' +
                     '📊 更新成功: ' + success + '個<br>' +
                     '⏭️ スキップ: ' + skip + '個<br>' +
                     '❌ エラー: ' + errors + '個';

        if (errors !== '0') {
          showStatus(message, 'error');
        } else {
          showStatus(message, 'success');
        }
        document.getElementById('updateBtn').disabled = false;
      }

      function onFailure(error) {
        // オーバーレイを非表示
        document.getElementById('overlay').classList.remove('show');

        var msg = error ? (error.message || String(error)) : '不明なエラー';
        showStatus('❌ エラーが発生しました:<br>' + msg, 'error');
        document.getElementById('updateBtn').disabled = false;
      }

      function showStatus(message, type) {
        var statusDiv = document.getElementById('status');
        statusDiv.innerHTML = message;
        statusDiv.className = type;
      }
    </script>
  `)
  .setWidth(500)
  .setHeight(500);

  SlidesApp.getUi().showModalDialog(html, 'スプレッドシートリンク更新');
}

// 現在のスプレッドシートIDを取得
function getCurrentSpreadsheetId() {
  var presentation = SlidesApp.getActivePresentation();
  var slides = presentation.getSlides();

  for (var i = 0; i < slides.length; i++) {
    var charts = slides[i].getSheetsCharts();
    if (charts.length > 0) {
      return charts[0].getSpreadsheetId();
    }
  }
  return null;
}

// 一括更新処理（メイン）
function updateAllChartLinks(oldSpreadsheetId, newSpreadsheetId) {
  console.log('=== 更新処理開始 ===');
  console.log('古いID: ' + oldSpreadsheetId);
  console.log('新しいID: ' + newSpreadsheetId);

  var presentation = SlidesApp.getActivePresentation();
  var slides = presentation.getSlides();

  // 新しいスプレッドシートからチャートを取得
  var newSpreadsheet = SpreadsheetApp.openById(newSpreadsheetId);
  var chartMap = {};

  newSpreadsheet.getSheets().forEach(function(sheet) {
    sheet.getCharts().forEach(function(chart) {
      chartMap[chart.getChartId()] = chart;
    });
  });

  console.log('新スプレッドシートのチャート数: ' + Object.keys(chartMap).length);

  var updatedCount = 0;
  var skippedCount = 0;
  var errorCount = 0;
  var errors = [];

  for (var slideIndex = 0; slideIndex < slides.length; slideIndex++) {
    var slide = slides[slideIndex];
    var charts = slide.getSheetsCharts();

    // 逆順で処理
    for (var i = charts.length - 1; i >= 0; i--) {
      var chart = charts[i];
      var currentSpreadsheetId = chart.getSpreadsheetId();

      if (currentSpreadsheetId === oldSpreadsheetId) {
        var chartId = chart.getChartId();
        var top = chart.getTop();
        var left = chart.getLeft();
        var width = chart.getWidth();
        var height = chart.getHeight();

        if (chartMap[chartId]) {
          try {
            chart.remove();
            slide.insertSheetsChart(chartMap[chartId], left, top, width, height);
            updatedCount++;
          } catch (e) {
            errorCount++;
            errors.push('スライド' + (slideIndex + 1) + ': ' + e.message);
          }
        } else {
          skippedCount++;
          errors.push('スライド' + (slideIndex + 1) + ': チャートID ' + chartId + ' が見つかりません');
        }
      }
    }
  }

  var result = '処理完了\n\n';
  result += '成功: ' + updatedCount + ' 件\n';
  result += 'スキップ: ' + skippedCount + ' 件\n';
  result += 'エラー: ' + errorCount + ' 件';

  if (errors.length > 0) {
    result += '\n\n--- 詳細 ---\n' + errors.slice(0, 10).join('\n');
  }

  console.log('=== 結果 ===');
  console.log(result);

  return result;
}

// テスト実行用（GASエディタから直接実行する場合）
// IDは実行時に書き換えてください
function testUpdate() {
  var OLD_SPREADSHEET_ID = 'YOUR_OLD_SPREADSHEET_ID_HERE';
  var NEW_SPREADSHEET_ID = 'YOUR_NEW_SPREADSHEET_ID_HERE';

  var result = updateAllChartLinks(OLD_SPREADSHEET_ID, NEW_SPREADSHEET_ID);
  console.log(result);
}
