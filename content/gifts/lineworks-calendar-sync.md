# LINE WORKSのタスクをGoogleカレンダーに自動連携する

**この特典を受け取っていただきありがとうございます！**

LINE WORKSで登録したタスクを、Googleカレンダーに自動で同期する仕組みを構築します。Google Apps Script（GAS）を使用し、一度設定すれば自動で動作します。

チームメンバー全員のタスクを1つのカレンダーに集約することも可能です。

:::caution 重要な仕様
- LINE WORKSのタスクAPIは**User Account認証**（OAuth 2.0）でのみ利用できます
- **各ユーザーが自分自身で認証する必要があります**（他の人が代わりに認証することはできません）
- 取得できるのは**自分が作成したタスク**のみです（他人から依頼されたタスクは取得できません）
:::

---

## 目次

1. [全体の流れ](#全体の流れ)
2. [ステップ1: LINE WORKSデベロッパーコンソールの設定](#ステップ1-line-worksデベロッパーコンソールの設定)
3. [ステップ2: GASプロジェクト作成](#ステップ2-gasプロジェクト作成)
4. [ステップ3: GASコードの実装](#ステップ3-gasコードの実装)
5. [ステップ4: デプロイしてURL取得](#ステップ4-デプロイしてurl取得)
6. [ステップ5: Redirect URLの設定](#ステップ5-redirect-urlの設定)
7. [ステップ6: ユーザー登録と認証](#ステップ6-ユーザー登録と認証)
8. [ステップ7: 動作確認](#ステップ7-動作確認)
9. [ステップ8: 自動実行設定](#ステップ8-自動実行設定)
10. [トラブルシューティング](#トラブルシューティング)
11. [カスタマイズ例](#カスタマイズ例)

---

## 全体の流れ

| ステップ | 内容 | 所要時間目安 |
|----------|------|--------------|
| 1 | LINE WORKSデベロッパーコンソールの設定 | 10分 |
| 2 | GASプロジェクト作成 | 3分 |
| 3 | GASコードの実装 | 10分 |
| 4 | デプロイしてURL取得 | 5分 |
| 5 | Redirect URLの設定 | 3分 |
| 6 | ユーザー登録と認証 | 各ユーザー5分 |
| 7 | 動作確認 | 5分 |
| 8 | 自動実行設定 | 5分 |

---

## ステップ1: LINE WORKSデベロッパーコンソールの設定

プログラムがLINE WORKSにアクセスするための「鍵」を取得します。

### 1-1. Developer Consoleにアクセス

1. [LINE WORKS Developer Console](https://dev.worksmobile.com/jp/console) にアクセス
2. LINE WORKSの管理者アカウントでログイン

![Developer Console トップ画面](/gifts/lineworks-calendar-sync/developer-console-top.png)

### 1-2. アプリを作成

1. 左メニュー「API」から「ClientApp」を選択

![アプリリスト](/gifts/lineworks-calendar-sync/app-list.png)

2. 「アプリの新規追加」をクリック
3. 「認証アプリ」を選択し、アプリ名を入力（例: `タスク連携アプリ`）

![アプリ作成モーダル](/gifts/lineworks-calendar-sync/app-create-modal.png)

4. 「同意して利用する」をクリック

### 1-3. 認証情報をメモ

アプリ作成後、設定画面が表示されます。以下の情報をメモ帳などに控えてください：

![アプリ設定画面](/gifts/lineworks-calendar-sync/app-settings.png)

| 項目 | 説明 |
|------|------|
| **Client ID** | アプリの識別子 |
| **Client Secret** | アプリの秘密鍵 |

:::tip
Service AccountやPrivate Keyは**不要**です。タスクAPIはUser Account認証を使用するため、Client IDとClient Secretのみ使用します。
:::

### 1-4. OAuth Scopeの設定

OAuth Scopesの「管理」ボタンをクリックし、以下を追加：

- `task`（タスクの読み書き）
- `task.read`（タスクの読み取り）

![OAuth Scope選択](/gifts/lineworks-calendar-sync/oauth-scopes.png)

「保存」をクリックして設定を完了します。

---

## ステップ2: GASプロジェクト作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「LINEWORKSタスク連携」などに変更

![GASエディタ](/gifts/lineworks-calendar-sync/gas-editor.png)

:::note
この時点ではデプロイしません。まずコードを実装してからデプロイします。
:::

---

## ステップ3: GASコードの実装

### 3-1. コードを入力

GASエディタで、既存のコードを**すべて削除**し、以下のコードを貼り付けてください。

**3箇所を自分の情報に書き換えてください：**
- `CLIENT_ID`: ステップ1でメモしたClient ID
- `CLIENT_SECRET`: ステップ1でメモしたClient Secret
- `REDIRECT_URI`: **ステップ4で取得するウェブアプリURL**（後で入力）
- `CALENDAR_ID`: タスクを同期するGoogleカレンダーのID

:::tip カレンダーIDの確認方法
1. Googleカレンダーを開く
2. 左サイドバーで対象カレンダーの「︙」→「設定と共有」
3. 「カレンダーの統合」セクションでカレンダーIDを確認

デフォルトカレンダーを使う場合は `primary` のままでOKです。
:::

```javascript
// ===== LINE WORKS タスク → Google カレンダー同期 =====
// 複数ユーザー対応版（動的登録UI付き）

// ===== 設定エリア =====
const CONFIG = {
  // LINE WORKS API設定
  CLIENT_ID: 'ここにClient IDを入力',
  CLIENT_SECRET: 'ここにClient Secretを入力',

  // Redirect URL（デプロイしたウェブアプリURL）
  REDIRECT_URI: 'ここにウェブアプリURLを入力',

  // Googleカレンダー設定
  CALENDAR_ID: 'primary'
};

// OAuth URLs
const AUTH_URL = 'https://auth.worksmobile.com/oauth2/v2.0/authorize';
const TOKEN_URL = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const API_BASE = 'https://www.worksapis.com/v1.0';


// ===========================================
// ユーザー管理（動的）
// ===========================================

function getRegisteredUsers() {
  const props = PropertiesService.getScriptProperties();
  const data = props.getProperty('registered_users');
  return data ? JSON.parse(data) : [];
}

function addUser(userId) {
  const users = getRegisteredUsers();
  if (!users.includes(userId)) {
    users.push(userId);
    PropertiesService.getScriptProperties().setProperty('registered_users', JSON.stringify(users));
  }
  return users;
}

function removeUser(userId) {
  let users = getRegisteredUsers();
  users = users.filter(u => u !== userId);
  PropertiesService.getScriptProperties().setProperty('registered_users', JSON.stringify(users));
  PropertiesService.getScriptProperties().deleteProperty('lineworks_tokens_' + userId);
  return users;
}


// ===========================================
// ウェブアプリエントリーポイント
// ===========================================

function doGet(e) {
  // 認可コードを受け取った場合
  if (e && e.parameter && e.parameter.code) {
    const state = e.parameter.state || '';
    const userId = decodeURIComponent(state.split('_')[0]);
    return handleCallback(e.parameter.code, userId);
  }

  // メインページ
  return createMainPage();
}


// ===========================================
// HTML UI
// ===========================================

function createMainPage() {
  const users = getRegisteredUsers();

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LINE WORKS タスク同期</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 1.5rem;
      margin: 0 0 8px 0;
      color: #333;
    }
    .subtitle {
      color: #666;
      margin-bottom: 24px;
    }
    .user-row {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    .user-row:last-child { border-bottom: none; }
    .user-info {
      flex: 1;
    }
    .user-id {
      font-weight: 500;
      color: #333;
    }
    .status {
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .status.ok { color: #22c55e; }
    .status.ng { color: #ef4444; }
    .btn {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #00C73C;
      color: white;
    }
    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }
    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
      font-size: 0.8rem;
      padding: 6px 12px;
    }
    .btn:hover { opacity: 0.9; }
    .add-form {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    .add-form input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }
    .empty {
      text-align: center;
      color: #666;
      padding: 32px 0;
    }
    .info-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 16px;
      font-size: 0.9rem;
      color: #1e40af;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>LINE WORKS タスク同期</h1>
    <p class="subtitle">タスクをGoogleカレンダーに自動同期</p>
`;

  if (users.length === 0) {
    html += `
    <div class="empty">
      <p>登録されたユーザーがいません</p>
      <p>下のフォームからLINE WORKS IDを追加してください</p>
    </div>
`;
  } else {
    users.forEach(userId => {
      const tokens = getStoredTokens(userId);
      const statusClass = tokens ? 'ok' : 'ng';
      const statusText = tokens ? '✅ 認証済み' : '❌ 未認証';
      const btnText = tokens ? '再認証' : '認証する';
      const btnClass = tokens ? 'btn-secondary' : 'btn-primary';
      const authUrl = getAuthorizationUrl(userId);

      html += `
    <div class="user-row">
      <div class="user-info">
        <div class="user-id">${userId}</div>
        <div class="status ${statusClass}">${statusText}</div>
      </div>
      <a href="${authUrl}" class="btn ${btnClass}" target="_top">${btnText}</a>
    </div>
`;
    });
  }

  html += `
    <div class="info-box">
      ユーザーの追加・削除はGASエディタで <code>manualAddUser</code> / <code>manualRemoveUser</code> を実行してください
    </div>
  </div>
</body>
</html>
`;

  return HtmlService.createHtmlOutput(html)
    .setTitle('LINE WORKS タスク同期')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createSuccessPage(userId) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>認証成功</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .success-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 1.3rem;
      margin: 0 0 8px 0;
      color: #22c55e;
    }
    .user-badge {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 500;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="success-icon">✅</div>
    <h1>認証成功！</h1>
    <div class="user-badge">${userId}</div>
    <p>LINE WORKSとの連携が完了しました</p>
    <p style="color:#666;font-size:0.9rem;margin-top:16px;">このページは閉じてOKです</p>
  </div>
</body>
</html>
`;

  return HtmlService.createHtmlOutput(html)
    .setTitle('認証成功');
}


// ===========================================
// 認証フロー
// ===========================================

function getAuthorizationUrl(userId) {
  const state = encodeURIComponent(userId) + '_' + Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('oauth_state_' + userId, state);

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

function handleCallback(code, userId) {
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
        '<h2>認証エラー</h2><p>' + result.error_description + '</p>' +
        '<p><a href="' + CONFIG.REDIRECT_URI + '">戻る</a></p>'
      );
    }

    saveTokens(userId, result);
    return createSuccessPage(userId);

  } catch (e) {
    return HtmlService.createHtmlOutput(
      '<h2>エラー</h2><p>' + e.message + '</p>' +
      '<p><a href="' + CONFIG.REDIRECT_URI + '">戻る</a></p>'
    );
  }
}

function refreshAccessToken(userId) {
  const tokens = getStoredTokens(userId);
  if (!tokens || !tokens.refresh_token) {
    throw new Error(userId + ' のRefresh Tokenがありません。再認証が必要です。');
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
    PropertiesService.getScriptProperties().deleteProperty('lineworks_tokens_' + userId);
    throw new Error(userId + ' のトークンが期限切れです。再認証してください。');
  }

  saveTokens(userId, result);
  return result.access_token;
}


// ===========================================
// トークン管理
// ===========================================

function saveTokens(userId, tokens) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('lineworks_tokens_' + userId, JSON.stringify({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000)
  }));
}

function getStoredTokens(userId) {
  const props = PropertiesService.getScriptProperties();
  const data = props.getProperty('lineworks_tokens_' + userId);
  return data ? JSON.parse(data) : null;
}

function getValidAccessToken(userId) {
  const tokens = getStoredTokens(userId);

  if (!tokens) {
    throw new Error(userId + ' は未認証です。');
  }

  if (Date.now() > tokens.expires_at - 300000) {
    return refreshAccessToken(userId);
  }

  return tokens.access_token;
}


// ===========================================
// LINE WORKSタスク取得
// ===========================================

function fetchLineWorksTasks() {
  const users = getRegisteredUsers();
  let allTasks = [];

  users.forEach(userId => {
    try {
      const token = getValidAccessToken(userId);
      const userTasks = fetchTasksForUser(token, userId);
      allTasks = allTasks.concat(userTasks);
    } catch (e) {
      Logger.log('ユーザー ' + userId + ' のタスク取得をスキップ: ' + e.message);
    }
  });

  return allTasks;
}

function fetchTasksForUser(token, userId) {
  const categoriesUrl = API_BASE + '/users/me/task-categories';
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

  let userTasks = [];

  categories.forEach(category => {
    const url = API_BASE + '/users/me/tasks?categoryId=' + encodeURIComponent(category.categoryId);

    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + token },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      const result = JSON.parse(response.getContentText());
      if (result.tasks) {
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
      if (!task.dueDate) {
        skippedCount++;
        return;
      }

      if (isAlreadyRegistered(calendar, task.taskId)) {
        if (task.status === 'DONE') {
          markEventAsCompleted(calendar, task.taskId);
        }
        skippedCount++;
        return;
      }

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
  const hasTime = task.dueDate.includes('T');

  let event;

  if (hasTime) {
    const endDate = new Date(dueDate.getTime() + 60 * 60 * 1000);
    event = calendar.createEvent(
      '[タスク] ' + task.title,
      dueDate,
      endDate,
      { description: buildDescription(task) }
    );
  } else {
    event = calendar.createAllDayEvent(
      '[タスク] ' + task.title,
      dueDate,
      { description: buildDescription(task) }
    );
  }

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
  description += '担当者: ' + task._userId + '\n';
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

function testFetchTasks() {
  try {
    const tasks = fetchLineWorksTasks();
    Logger.log('=== 取得したタスク ===');
    Logger.log('タスク数: ' + tasks.length);
    tasks.forEach(task => {
      Logger.log('- [' + task._userId + '] ' + task.title + ' (期限: ' + (task.dueDate || 'なし') + ', 状態: ' + task.status + ')');
    });
  } catch (e) {
    Logger.log('エラー: ' + e.message);
  }
}

function checkAllAuthStatus() {
  const users = getRegisteredUsers();
  Logger.log('=== 認証状態一覧 ===');
  Logger.log('登録ユーザー数: ' + users.length);
  users.forEach(userId => {
    const tokens = getStoredTokens(userId);
    if (tokens) {
      Logger.log(userId + ': ✅ 認証済み (有効期限: ' + new Date(tokens.expires_at) + ')');
    } else {
      Logger.log(userId + ': ❌ 未認証');
    }
  });
}

function resetAllAuth() {
  const users = getRegisteredUsers();
  const props = PropertiesService.getScriptProperties();
  users.forEach(userId => {
    props.deleteProperty('lineworks_tokens_' + userId);
  });
  Logger.log('全ユーザーの認証情報をリセットしました。');
}

function resetAllData() {
  const props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
  Logger.log('全データをリセットしました。');
}

// 手動でユーザーを追加する関数
function manualAddUser() {
  // 以下のユーザーIDを書き換えて実行
  addUser('user@yourcompany.works');
  Logger.log('追加完了: ' + JSON.stringify(getRegisteredUsers()));
}

// 手動でユーザーを削除する関数
function manualRemoveUser() {
  // 以下のユーザーIDを書き換えて実行
  removeUser('user@yourcompany.works');
  Logger.log('削除完了: ' + JSON.stringify(getRegisteredUsers()));
}
```

### 3-2. コードを保存

1. 「ファイル」→「保存」（またはCtrl+S）

:::note
`REDIRECT_URI` は次のステップでデプロイ後に取得するURLを入力します。一旦このまま保存してください。
:::

---

## ステップ4: デプロイしてURL取得

コードを保存したら、ウェブアプリとしてデプロイしてURLを取得します。

### 4-1. ウェブアプリとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」をクリック

![デプロイメニュー](/gifts/lineworks-calendar-sync/gas-deploy-menu.png)

2. 「種類の選択」で歯車アイコンをクリック →「ウェブアプリ」を選択

![デプロイ種類選択](/gifts/lineworks-calendar-sync/gas-deploy-type.png)

3. 以下の設定を行う：

| 項目 | 設定値 |
|------|--------|
| 説明 | `LINE WORKS認証` |
| 次のユーザーとして実行 | `自分` |
| アクセスできるユーザー | `全員` |

4. 「デプロイ」をクリック
5. 表示される**ウェブアプリURL**をコピーして保存

![デプロイ完了](/gifts/lineworks-calendar-sync/gas-deploy-complete.png)

:::warning 重要
このURLは後で何度も使用します。必ずメモ帳などに保存してください。

例: `https://script.google.com/macros/s/AKfycbx.../exec`
:::

### 4-2. コードにURLを設定

1. 取得したURLをコードの `REDIRECT_URI` に入力：

```javascript
REDIRECT_URI: 'https://script.google.com/macros/s/AKfycbx.../exec',
```

2. 「ファイル」→「保存」
3. 「デプロイ」→「デプロイを管理」
4. 右上の**鉛筆アイコン**（編集）をクリック
5. バージョンを「**新バージョン**」に変更
6. 「デプロイ」をクリック

:::tip URLは変わりません
「デプロイを管理」から「新バージョン」で更新した場合、URLは同じままです。
:::

---

## ステップ5: Redirect URLの設定

LINE WORKSがログイン後にGASに戻ってこれるよう、Redirect URLを登録します。

### 5-1. Developer Consoleで設定

1. [LINE WORKS Developer Console](https://dev.worksmobile.com/jp/console) に戻る
2. 作成したアプリ（タスク連携アプリ）を選択
3. 「**User Account認証**」セクションを探す
4. 「**Redirect URL**」欄に、ステップ4でコピーしたウェブアプリURLを貼り付け
5. 「追加」をクリック

![Redirect URL設定](/gifts/lineworks-calendar-sync/redirect-url-setting.png)

---

## ステップ6: ユーザー登録と認証

チームメンバー全員のタスクを同期するには、**各メンバーが自分自身で認証する**必要があります。

:::danger 必ず本人が認証してください
「認証する」ボタンは誰でもクリックできますが、**LINE WORKSログイン時に必ず本人のアカウントでログインしてください**。

他の人のアカウントでログインすると、その人のタスクが取得されてしまい、正しく動作しません。
:::

### 認証の仕組み

```
┌─────────────────────────────────────────────────────┐
│  LINE WORKS Task API の仕様                          │
├─────────────────────────────────────────────────────┤
│  ・各ユーザーは自分のタスクのみ取得可能              │
│  ・他人のタスクは取得できない                        │
│  ・そのため各ユーザーが個別に認証する必要がある      │
└─────────────────────────────────────────────────────┘
```

### 6-1. ユーザーを追加

GASエディタで`manualAddUser`関数を使ってユーザーを追加します。

1. GASエディタを開く
2. コードの最下部にある`manualAddUser`関数を探す
3. ユーザーIDを書き換える：

```javascript
function manualAddUser() {
  // 追加したいユーザーIDに書き換え
  addUser('yamada@yourcompany.works');
  Logger.log('追加完了: ' + JSON.stringify(getRegisteredUsers()));
}
```

4. 関数選択で`manualAddUser`を選択して「実行」
5. 複数ユーザーを追加する場合は、IDを変えて繰り返し実行

:::tip 複数ユーザーを一度に追加
```javascript
function manualAddUser() {
  addUser('yamada@yourcompany.works');
  addUser('tanaka@yourcompany.works');
  addUser('suzuki@yourcompany.works');
  Logger.log('追加完了: ' + JSON.stringify(getRegisteredUsers()));
}
```
:::

### 6-2. 各ユーザーが認証

:::danger 重要: 本人が認証する必要があります
「認証する」ボタンは誰でもクリックできますが、**LINE WORKSログイン時に本人のアカウントでログインしないと正しく動作しません**。

例えば、山田さんの「認証する」をクリックして、田中さんのアカウントでログインすると、田中さんのトークンが山田さんとして保存されてしまい、山田さんのタスクが取得できません。
:::

**正しい手順:**

1. `manualAddUser`でユーザーを追加（ステップ6-1）
2. **各ユーザー本人に**ウェブアプリURLを共有
3. 各ユーザーがウェブアプリURLにアクセス
4. 自分の行の「認証する」をクリック
5. **自分のLINE WORKSアカウント**でログイン
6. 「認証成功」と表示されれば完了

![認証成功](/gifts/lineworks-calendar-sync/auth-success.png)

### 6-3. 認証状態の確認

管理画面で各ユーザーの状態を確認：

![管理画面（ユーザー一覧）](/gifts/lineworks-calendar-sync/management-page.png)

| 状態 | 意味 |
|------|------|
| ✅ 認証済み | 正常にタスク取得可能 |
| ❌ 未認証 | 認証が必要 |

または、GASエディタで `checkAllAuthStatus` を実行して確認することもできます。

---

## ステップ7: 動作確認

### 7-1. タスク取得テスト

1. GASエディタに戻る
2. 関数選択ボックスから `testFetchTasks` を選択
3. 「実行」ボタンをクリック
4. 初回は権限承認が求められるので、画面の指示に従って許可

:::info 初回実行時の権限承認
初めて実行すると「承認が必要です」と表示されます。

![承認が必要](/gifts/lineworks-calendar-sync/permission-required.png)

「権限を確認」→「詳細」をクリックし、警告画面で「（安全ではないページ）に移動」を選択します。

![Googleで確認されていません](/gifts/lineworks-calendar-sync/app-not-verified.png)

![詳細表示](/gifts/lineworks-calendar-sync/app-not-verified-detail.png)

必要な権限を確認して「許可」をクリックします。

![権限選択](/gifts/lineworks-calendar-sync/permission-select.png)
:::

実行ログに各ユーザーのタスクが表示されればOKです：

```
ユーザー yamada@yourcompany.works のタスク: 3件
ユーザー tanaka@yourcompany.works のタスク: 2件
=== 取得したタスク ===
タスク数: 5
- [yamada@yourcompany.works] 企画書作成 (期限: 2026-01-25, 状態: TODO)
- [yamada@yourcompany.works] ミーティング準備 (期限: なし, 状態: TODO)
...
```

![実行ログ](/gifts/lineworks-calendar-sync/execution-log.png)

### 7-2. カレンダー同期テスト

1. 関数選択ボックスから `syncLineWorksTasks` を選択
2. 「実行」ボタンをクリック
3. ログに「同期完了」と表示されればOK
4. Googleカレンダーを開いてタスクが表示されているか確認

LINE WORKSで期限を設定したタスクが：

![LINE WORKSタスク](/gifts/lineworks-calendar-sync/lineworks-task.png)

Googleカレンダーに同期されます：

![Googleカレンダーに同期されたタスク](/gifts/lineworks-calendar-sync/calendar-synced.png)

:::note
期限（dueDate）が設定されていないタスクはカレンダーに同期されません。
:::

---

## ステップ8: 自動実行設定

### 8-1. トリガー設定

1. GASエディタ左側の「時計」アイコン（トリガー）をクリック

![GASサイドバー - トリガー](/gifts/lineworks-calendar-sync/gas-sidebar-trigger.png)

2. 右下「トリガーを追加」をクリック
3. 以下のように設定：

| 項目 | 設定値 |
|------|--------|
| 実行する関数 | `syncLineWorksTasks` |
| イベントのソース | `時間主導型` |
| 時間ベースのトリガー | `時間ベースのタイマー` |
| 時間の間隔 | `1時間おき`（または好みの間隔） |

![トリガー追加モーダル](/gifts/lineworks-calendar-sync/trigger-add-modal.png)

4. 「保存」をクリック

設定が完了すると、トリガー一覧に表示されます：

![トリガー一覧](/gifts/lineworks-calendar-sync/trigger-list.png)

### 8-2. 設定完了

これで自動同期が有効になりました。設定した間隔でLINE WORKSのタスクがGoogleカレンダーに同期されます。

---

## トラブルシューティング

### 「未認証です」と表示される

そのユーザーが認証していません。本人にウェブアプリURLを共有して、自分のアカウントで認証してもらってください。

### 他のユーザーのタスクが取得できない

LINE WORKS Task APIの仕様により、各ユーザーは自分のタスクのみ取得できます。他のユーザーのタスクを取得するには、そのユーザー本人が認証する必要があります。

### 認証したのにタスクが0件

- LINE WORKSにタスクが登録されているか確認
- **自分が作成したタスク**のみ取得できます（他人から依頼されたタスクは取得不可）
- タスクにカテゴリーが設定されているか確認

### カレンダーにイベントが作成されない

- タスクに期限（dueDate）が設定されているか確認
- `CALENDAR_ID`が正しいか確認
- すでに同じタスクが登録済みでないか確認（タスクIDで重複チェック）

### 「Refresh Tokenがありません」と表示される

トークンの有効期限（90日）が切れています。該当ユーザーに再認証してもらってください。

### ユーザーの追加・削除方法

ユーザーの追加は`manualAddUser`関数を使用します（ステップ6-1参照）。

ユーザーを削除する場合は、以下の関数を実行：

```javascript
function manualRemoveUser() {
  removeUser('yamada@yourcompany.works');
  Logger.log('削除完了: ' + JSON.stringify(getRegisteredUsers()));
}
```

---

## カスタマイズ例

### 同期間隔を変更する

トリガー設定で以下の間隔を選択可能：

- 15分おき
- 30分おき
- 1時間おき
- 毎日の特定時刻

### 特定のカレンダーに同期する

`CALENDAR_ID`をカレンダーのIDに変更：

```javascript
CALENDAR_ID: 'your-calendar-id@group.calendar.google.com'
```

カレンダーIDは、Googleカレンダーの「設定と共有」→「カレンダーの統合」から確認できます。

### 完了タスクをスキップする

`syncLineWorksTasks`関数内で、完了タスクをスキップ：

```javascript
tasks.forEach(task => {
  // 完了タスクはスキップ
  if (task.status === 'DONE') {
    skippedCount++;
    return;
  }
  // 以下同期処理
});
```

---

## まとめ

この設定で以下が自動化されます：

| 機能 | 説明 |
|------|------|
| 複数ユーザー対応 | チーム全員のタスクを1つのカレンダーに集約 |
| 認証状態の可視化 | ウェブアプリで各ユーザーの認証状態を確認可能 |
| 自動同期 | 設定した間隔でタスクをチェック・同期 |
| 二重登録防止 | タスクIDで管理し、同じタスクは登録しない |
| 完了マーク | 完了したタスクは「[完了]」に変更され緑色に |

:::warning 認証の注意点
- 各ユーザーは**自分自身で認証**する必要があります
- 取得できるのは**自分が作成したタスク**のみです
- Refresh Tokenの有効期限は90日です
:::

---

## 参考リンク

- [LINE WORKS Developer Console](https://dev.worksmobile.com/jp/console)
- [LINE WORKS API 2.0 ドキュメント](https://developers.worksmobile.com/jp/docs/)
- [Google Apps Script リファレンス](https://developers.google.com/apps-script)
- [Googleカレンダー API](https://developers.google.com/calendar)
