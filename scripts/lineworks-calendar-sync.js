// ===== 設定エリア（ここを編集） =====
const CONFIG = {
  // LINE WORKS API設定（Developer Consoleからコピー）
  CLIENT_ID: 'ここにClient IDを入力',
  CLIENT_SECRET: 'ここにClient Secretを入力',

  // Redirect URL（デプロイしたウェブアプリURL）
  REDIRECT_URI: 'ここにウェブアプリURLを入力',

  // タスクを取得するユーザー（複数指定可能）
  // 'me' は自分自身、それ以外はユーザーIDまたはメールアドレスを指定
  TARGET_USERS: [
    'me',                           // 自分自身
    // 'user001@yourcompany.works', // 他のメンバー（例）
    // 'user002@yourcompany.works', // 他のメンバー（例）
  ],

  // Googleカレンダー設定
  CALENDAR_ID: 'primary' // 'primary'はデフォルトカレンダー
};
// ===================================

// OAuth URLs
const AUTH_URL = 'https://auth.worksmobile.com/oauth2/v2.0/authorize';
const TOKEN_URL = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const API_BASE = 'https://www.worksapis.com/v1.0';


// ===========================================
// ウェブアプリエントリーポイント
// ===========================================

function doGet(e) {
  // 認可コードを受け取った場合
  if (e && e.parameter && e.parameter.code) {
    return handleCallback(e.parameter.code);
  }

  // 通常アクセス時は認証状態を表示
  const tokens = getStoredTokens();
  if (tokens && tokens.access_token) {
    return HtmlService.createHtmlOutput(
      '<h2>認証済みです</h2>' +
      '<p>LINE WORKSとの連携が完了しています。</p>' +
      '<p>GASエディタで <code>testFetchTasks</code> を実行してタスクを確認できます。</p>'
    );
  } else {
    const authUrl = getAuthorizationUrl();
    return HtmlService.createHtmlOutput(
      '<h2>LINE WORKS認証</h2>' +
      '<p><a href="' + authUrl + '" target="_blank">こちらをクリックしてLINE WORKSにログイン</a></p>'
    );
  }
}


// ===========================================
// 認証フロー
// ===========================================

// 認可URLを生成
function getAuthorizationUrl() {
  const state = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('oauth_state', state);

  const params = {
    client_id: CONFIG.CLIENT_ID,
    redirect_uri: CONFIG.REDIRECT_URI,
    scope: 'task task.read',
    response_type: 'code',
    state: state
  };

  const queryString = Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  return AUTH_URL + '?' + queryString;
}

// 認可コードをトークンに交換
function handleCallback(code) {
  try {
    const response = UrlFetchApp.fetch(TOKEN_URL, {
      method: 'post',
      payload: {
        grant_type: 'authorization_code',
        code: code,
        client_id: CONFIG.CLIENT_ID,
        client_secret: CONFIG.CLIENT_SECRET,
        redirect_uri: CONFIG.REDIRECT_URI
      },
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      return HtmlService.createHtmlOutput(
        '<h2>認証エラー</h2><p>' + result.error_description + '</p>'
      );
    }

    // トークンを保存
    saveTokens(result);

    return HtmlService.createHtmlOutput(
      '<h2>認証成功！</h2>' +
      '<p>LINE WORKSとの連携が完了しました。</p>' +
      '<p>このページを閉じて、GASエディタで <code>testFetchTasks</code> を実行してください。</p>'
    );

  } catch (e) {
    return HtmlService.createHtmlOutput(
      '<h2>エラー</h2><p>' + e.message + '</p>'
    );
  }
}

// トークンをリフレッシュ
function refreshAccessToken() {
  const tokens = getStoredTokens();
  if (!tokens || !tokens.refresh_token) {
    throw new Error('Refresh Tokenがありません。再認証が必要です。ウェブアプリURLにアクセスしてログインしてください。');
  }

  const response = UrlFetchApp.fetch(TOKEN_URL, {
    method: 'post',
    payload: {
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id: CONFIG.CLIENT_ID,
      client_secret: CONFIG.CLIENT_SECRET
    },
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());

  if (result.error) {
    // Refresh Tokenが無効な場合は再認証を促す
    PropertiesService.getScriptProperties().deleteProperty('lineworks_tokens');
    throw new Error('トークンの有効期限が切れました。ウェブアプリURLにアクセスして再認証してください。');
  }

  saveTokens(result);
  return result.access_token;
}


// ===========================================
// トークン管理
// ===========================================

function saveTokens(tokens) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('lineworks_tokens', JSON.stringify({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000)
  }));
}

function getStoredTokens() {
  const props = PropertiesService.getScriptProperties();
  const data = props.getProperty('lineworks_tokens');
  return data ? JSON.parse(data) : null;
}

function getValidAccessToken() {
  const tokens = getStoredTokens();

  if (!tokens) {
    throw new Error('認証が必要です。ウェブアプリURLにアクセスしてログインしてください。');
  }

  // 期限切れチェック（5分前にリフレッシュ）
  if (Date.now() > tokens.expires_at - 300000) {
    return refreshAccessToken();
  }

  return tokens.access_token;
}


// ===========================================
// LINE WORKSタスク取得
// ===========================================

function fetchLineWorksTasks() {
  const token = getValidAccessToken();
  let allTasks = [];

  // 設定された全ユーザーのタスクを取得
  CONFIG.TARGET_USERS.forEach(userId => {
    const userTasks = fetchTasksForUser(token, userId);
    allTasks = allTasks.concat(userTasks);
  });

  return allTasks;
}

// 特定ユーザーのタスクを取得
function fetchTasksForUser(token, userId) {
  // カテゴリー一覧を取得
  const categoriesUrl = API_BASE + '/users/' + userId + '/task-categories';
  const catResponse = UrlFetchApp.fetch(categoriesUrl, {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  if (catResponse.getResponseCode() !== 200) {
    Logger.log('ユーザー ' + userId + ' のカテゴリー取得失敗: ' + catResponse.getContentText());
    return [];
  }

  const catResult = JSON.parse(catResponse.getContentText());
  const categories = catResult.taskCategories || [];

  // 全カテゴリーのタスクを取得
  let userTasks = [];

  categories.forEach(category => {
    const url = API_BASE + '/users/' + userId + '/tasks?categoryId=' + encodeURIComponent(category.categoryId);

    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + token },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      const result = JSON.parse(response.getContentText());
      if (result.tasks) {
        // 各タスクにユーザーIDを追加（誰のタスクかわかるように）
        result.tasks.forEach(task => {
          task._userId = userId;
        });
        userTasks = userTasks.concat(result.tasks);
      }
    }
  });

  Logger.log('ユーザー ' + userId + ' のタスク: ' + userTasks.length + '件');
  return userTasks;
}


// ===========================================
// メイン処理: タスクをカレンダーに同期
// ===========================================

function syncLineWorksTasks() {
  try {
    const tasks = fetchLineWorksTasks();
    const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);

    if (!calendar) {
      throw new Error('カレンダーが見つかりません。CALENDAR_IDを確認してください。');
    }

    let syncedCount = 0;
    let skippedCount = 0;

    tasks.forEach(task => {
      // 期限がないタスクはスキップ
      if (!task.dueDate) {
        skippedCount++;
        return;
      }

      // すでに登録済みかチェック
      if (isAlreadyRegistered(calendar, task.taskId)) {
        // 完了状態の更新だけ行う
        if (task.status === 'DONE') {
          markEventAsCompleted(calendar, task.taskId);
        }
        skippedCount++;
        return;
      }

      // 新規登録
      createCalendarEvent(calendar, task);
      syncedCount++;
    });

    Logger.log('同期完了: 新規' + syncedCount + '件、スキップ' + skippedCount + '件');

  } catch (e) {
    Logger.log('エラー: ' + e.message);
    throw e;
  }
}


// ===========================================
// カレンダー操作
// ===========================================

function isAlreadyRegistered(calendar, taskId) {
  // 過去30日〜未来90日の範囲で検索
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const events = calendar.getEvents(startDate, endDate);

  for (const event of events) {
    const description = event.getDescription() || '';
    if (description.includes('LW_TASK_ID:' + taskId)) {
      return true;
    }
  }

  return false;
}

function createCalendarEvent(calendar, task) {
  const dueDate = new Date(task.dueDate);

  // 時間指定がない場合は終日予定として登録
  const hasTime = task.dueDate.includes('T');

  let event;

  if (hasTime) {
    // 時間指定あり: 1時間の予定として登録
    const endDate = new Date(dueDate.getTime() + 60 * 60 * 1000);
    event = calendar.createEvent(
      '[タスク] ' + task.title,
      dueDate,
      endDate,
      { description: buildDescription(task) }
    );
  } else {
    // 時間指定なし: 終日予定として登録
    event = calendar.createAllDayEvent(
      '[タスク] ' + task.title,
      dueDate,
      { description: buildDescription(task) }
    );
  }

  // タスクであることを示す色を設定（黄色）
  event.setColor(CalendarApp.EventColor.YELLOW);

  return event;
}

function buildDescription(task) {
  let description = '';

  if (task.content) {
    description += task.content + '\n\n';
  }

  description += '---\n';
  description += 'LINE WORKSタスクから自動同期\n';
  if (task._userId && task._userId !== 'me') {
    description += '担当者: ' + (task.assignees?.[0]?.assigneeName || task._userId) + '\n';
  }
  description += 'LW_TASK_ID:' + task.taskId;

  return description;
}

function markEventAsCompleted(calendar, taskId) {
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const events = calendar.getEvents(startDate, endDate);

  for (const event of events) {
    const description = event.getDescription() || '';
    if (description.includes('LW_TASK_ID:' + taskId)) {
      // タイトルを完了に変更
      const currentTitle = event.getTitle();
      if (!currentTitle.startsWith('[完了]')) {
        event.setTitle(currentTitle.replace('[タスク]', '[完了]'));
        event.setColor(CalendarApp.EventColor.GREEN);
      }
      break;
    }
  }
}


// ===========================================
// テスト・ユーティリティ関数
// ===========================================

// タスク取得テスト
function testFetchTasks() {
  try {
    const tasks = fetchLineWorksTasks();
    Logger.log('=== 取得したタスク ===');
    Logger.log('タスク数: ' + tasks.length);
    tasks.forEach(task => {
      const owner = task._userId === 'me' ? '自分' : task._userId;
      Logger.log('- [' + owner + '] ' + task.title + ' (期限: ' + (task.dueDate || 'なし') + ', 状態: ' + task.status + ')');
    });
  } catch (e) {
    Logger.log('エラー: ' + e.message);
  }
}

// カテゴリー取得テスト
function testFetchCategories() {
  const token = getValidAccessToken();

  const url = API_BASE + '/users/me/task-categories';
  Logger.log('カテゴリーAPI URL: ' + url);

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  Logger.log('HTTPステータス: ' + response.getResponseCode());
  Logger.log('レスポンス: ' + response.getContentText());
}

// 特定ユーザーのタスク取得テスト（他メンバーのタスク取得確認用）
function testFetchUserTasks() {
  const token = getValidAccessToken();

  // ===== ここに対象ユーザーのIDを入力 =====
  const targetUserId = 'ここに対象ユーザーのID';
  // ========================================

  Logger.log('=== ユーザー ' + targetUserId + ' のタスク取得テスト ===');

  // カテゴリー取得
  const catUrl = API_BASE + '/users/' + targetUserId + '/task-categories';
  Logger.log('カテゴリーAPI URL: ' + catUrl);

  const catResponse = UrlFetchApp.fetch(catUrl, {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  Logger.log('カテゴリー HTTPステータス: ' + catResponse.getResponseCode());
  Logger.log('カテゴリー レスポンス: ' + catResponse.getContentText());

  if (catResponse.getResponseCode() !== 200) {
    Logger.log('エラー: 他ユーザーのタスク取得ができません。');
    return;
  }

  // タスク取得
  const taskUrl = API_BASE + '/users/' + targetUserId + '/tasks?categoryId=default';
  Logger.log('タスクAPI URL: ' + taskUrl);

  const taskResponse = UrlFetchApp.fetch(taskUrl, {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  Logger.log('タスク HTTPステータス: ' + taskResponse.getResponseCode());
  Logger.log('タスク レスポンス: ' + taskResponse.getContentText());

  if (taskResponse.getResponseCode() === 200) {
    Logger.log('成功！他ユーザーのタスク取得が可能です。');
  }
}

// 認証URLを表示（ログで確認用）
function showAuthUrl() {
  const url = getAuthorizationUrl();
  Logger.log('認証URL: ' + url);
  Logger.log('このURLをブラウザで開いてログインしてください。');
}

// トークン状態を確認
function checkTokenStatus() {
  const tokens = getStoredTokens();
  if (tokens) {
    Logger.log('トークン状態: 保存済み');
    Logger.log('有効期限: ' + new Date(tokens.expires_at));
    Logger.log('期限切れ: ' + (Date.now() > tokens.expires_at ? 'はい' : 'いいえ'));
  } else {
    Logger.log('トークン状態: 未認証');
    Logger.log('ウェブアプリURLにアクセスしてログインしてください。');
  }
}

// 認証をリセット（再認証が必要な場合）
function resetAuth() {
  PropertiesService.getScriptProperties().deleteProperty('lineworks_tokens');
  Logger.log('認証情報をリセットしました。ウェブアプリURLにアクセスして再認証してください。');
}
