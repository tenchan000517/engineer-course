import fs from 'fs';
import path from 'path';

const TOKUTEN_BASE_DIR = path.join(process.cwd(), 'docs/reference/instagram-tokuten');

export interface TokutenAccount {
  slug: string;
  name: string;
  tokutenCount: number;
}

export interface TokutenItem {
  slug: string;
  title: string;
  account: string;
  accountName: string;
  genre: string;
  format: string;
  collectedDate: string;
  content: string;
}

/**
 * 全アカウント（親カテゴリ）を取得
 */
export function getAllTokutenAccounts(): TokutenAccount[] {
  if (!fs.existsSync(TOKUTEN_BASE_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(TOKUTEN_BASE_DIR, { withFileTypes: true });
  const accounts: TokutenAccount[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'images') {
      const accountDir = path.join(TOKUTEN_BASE_DIR, entry.name);
      const files = fs.readdirSync(accountDir).filter(f => f.endsWith('.md'));

      accounts.push({
        slug: entry.name,
        name: entry.name,
        tokutenCount: files.length,
      });
    }
  }

  return accounts;
}

/**
 * 特定アカウントの全特典を取得
 */
export function getTokutensByAccount(accountSlug: string): TokutenItem[] {
  const accountDir = path.join(TOKUTEN_BASE_DIR, accountSlug);

  if (!fs.existsSync(accountDir)) {
    return [];
  }

  const files = fs.readdirSync(accountDir).filter(f => f.endsWith('.md'));
  const tokutens: TokutenItem[] = [];

  for (const file of files) {
    const filePath = path.join(accountDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // マークダウンからメタデータを抽出
    const parsed = parseMarkdownContent(fileContent, accountSlug);
    if (parsed) {
      tokutens.push({
        ...parsed,
        slug: file.replace('.md', ''),
      });
    }
  }

  // ファイル名でソート（tokuten-01, tokuten-02, ...）
  tokutens.sort((a, b) => a.slug.localeCompare(b.slug));

  return tokutens;
}

/**
 * 特定の特典を取得
 */
export function getTokutenBySlug(accountSlug: string, tokutenSlug: string): TokutenItem | null {
  const filePath = path.join(TOKUTEN_BASE_DIR, accountSlug, `${tokutenSlug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseMarkdownContent(fileContent, accountSlug);

  if (!parsed) {
    return null;
  }

  return {
    ...parsed,
    slug: tokutenSlug,
  };
}

/**
 * マークダウンコンテンツからメタデータを抽出
 */
function parseMarkdownContent(content: string, account: string): Omit<TokutenItem, 'slug'> | null {
  // タイトルを抽出（# 特典例 XX: タイトル）
  const titleMatch = content.match(/^#\s*特典例\s*\d+:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '無題';

  // テーブルからメタデータを抽出
  const accountNameMatch = content.match(/\|\s*アカウント\s*\|\s*(.+?)\s*\|/);
  const genreMatch = content.match(/\|\s*ジャンル\s*\|\s*(.+?)\s*\|/);
  const formatMatch = content.match(/\|\s*特典形式\s*\|\s*(.+?)\s*\|/);
  const dateMatch = content.match(/\|\s*収集日\s*\|\s*(.+?)\s*\|/);

  return {
    title,
    account,
    accountName: accountNameMatch ? accountNameMatch[1].trim() : account,
    genre: genreMatch ? genreMatch[1].trim() : '不明',
    format: formatMatch ? formatMatch[1].trim() : '不明',
    collectedDate: dateMatch ? dateMatch[1].trim() : '不明',
    content,
  };
}
