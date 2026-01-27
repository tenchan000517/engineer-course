import fs from 'fs';
import path from 'path';

const GUIDES_BASE_DIR = path.join(process.cwd(), 'docs/reference/guides');

export interface GuideItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

export interface GuideCategory {
  id: string;
  name: string;
  guides: GuideItem[];
}

/**
 * ガイドのカテゴリを判定
 */
function getGuideCategory(slug: string): { id: string; name: string } {
  if (slug.includes('automation')) {
    return { id: 'automation', name: '自動化・ワークフロー' };
  }
  if (slug.includes('prompt') || slug.includes('PROMPT') || slug.includes('META-PROMPT') || slug.includes('batch')) {
    return { id: 'prompts', name: 'プロンプト・テンプレート' };
  }
  if (slug.includes('hook')) {
    return { id: 'hooks', name: 'フック集' };
  }
  if (slug.includes('ANALYSIS')) {
    return { id: 'analysis', name: '分析・リサーチ' };
  }
  return { id: 'other', name: 'その他' };
}

/**
 * マークダウンからタイトルと説明を抽出
 */
function parseGuideContent(content: string): { title: string; description: string } {
  // タイトルを抽出（最初の # から）
  const titleMatch = content.match(/^#\s+(.+)$/m);
  let title = titleMatch ? titleMatch[1].replace(/\*\*/g, '').trim() : '無題';

  // 絵文字を除去
  title = title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

  // 説明を抽出（最初の段落または概要セクション）
  const descMatch = content.match(/^##\s*(?:概要|🎯|自動化の全体像)[^\n]*\n+([^\n#]+)/m);
  let description = '';

  if (descMatch) {
    description = descMatch[1].replace(/\*\*/g, '').trim();
  } else {
    // 最初の段落を取得
    const paragraphMatch = content.match(/^[^#\n][^\n]+/m);
    if (paragraphMatch) {
      description = paragraphMatch[0].replace(/\*\*/g, '').trim();
    }
  }

  // 説明が長すぎる場合は切り詰め
  if (description.length > 100) {
    description = description.substring(0, 100) + '...';
  }

  return { title, description };
}

/**
 * 全ガイドを取得
 */
export function getAllGuides(): GuideItem[] {
  if (!fs.existsSync(GUIDES_BASE_DIR)) {
    return [];
  }

  const files = fs.readdirSync(GUIDES_BASE_DIR).filter(f => f.endsWith('.md') && f !== 'index.md');
  const guides: GuideItem[] = [];

  for (const file of files) {
    const filePath = path.join(GUIDES_BASE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = file.replace('.md', '');
    const { title, description } = parseGuideContent(content);
    const category = getGuideCategory(slug);

    guides.push({
      slug,
      title,
      description,
      category: category.id,
      content,
    });
  }

  return guides;
}

/**
 * カテゴリ別にグループ化したガイドを取得
 */
export function getGuidesByCategory(): GuideCategory[] {
  const guides = getAllGuides();
  const categoryMap = new Map<string, GuideCategory>();

  // カテゴリの順序
  const categoryOrder = ['automation', 'prompts', 'hooks', 'analysis', 'other'];
  const categoryNames: Record<string, string> = {
    automation: '自動化・ワークフロー',
    prompts: 'プロンプト・テンプレート',
    hooks: 'フック集',
    analysis: '分析・リサーチ',
    other: 'その他',
  };

  for (const guide of guides) {
    if (!categoryMap.has(guide.category)) {
      categoryMap.set(guide.category, {
        id: guide.category,
        name: categoryNames[guide.category] || guide.category,
        guides: [],
      });
    }
    categoryMap.get(guide.category)!.guides.push(guide);
  }

  // カテゴリ順でソート
  const result: GuideCategory[] = [];
  for (const catId of categoryOrder) {
    if (categoryMap.has(catId)) {
      result.push(categoryMap.get(catId)!);
    }
  }

  return result;
}

/**
 * 特定のガイドを取得
 */
export function getGuideBySlug(slug: string): GuideItem | null {
  const filePath = path.join(GUIDES_BASE_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const { title, description } = parseGuideContent(content);
  const category = getGuideCategory(slug);

  return {
    slug,
    title,
    description,
    category: category.id,
    content,
  };
}
