import fs from 'fs';
import path from 'path';

const GUIDES_BASE_DIR = path.join(process.cwd(), 'docs/reference/guides');

export interface GuideItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  order?: number;
  content: string;
}

// salesカテゴリのサブカテゴリ定義（実装順）
export const salesSubCategories = {
  foundation: { name: '基盤設計', color: 'bg-green-500', order: 1 },
  product: { name: '商品設計', color: 'bg-purple-500', order: 2 },
  funnel: { name: '導線設計', color: 'bg-orange-500', order: 3 },
  payment: { name: '決済', color: 'bg-blue-500', order: 4 },
  community: { name: '運営', color: 'bg-cyan-500', order: 5 },
  automation: { name: '自動化', color: 'bg-pink-500', order: 6 },
} as const;

// salesガイドのサブカテゴリ・順序・説明マッピング
const salesGuideConfig: Record<string, { subCategory: keyof typeof salesSubCategories; order: number; description: string }> = {
  'sns-profile-strategy': { subCategory: 'foundation', order: 1, description: 'プロフィール+ハイライト8個の完全設計。集客の土台' },
  'ai-monetization-strategy': { subCategory: 'foundation', order: 2, description: 'AI活用で収益を最大化する戦略設計。3人の専門家が解説' },
  'instagram-tokuten-page-guide': { subCategory: 'product', order: 3, description: '無料特典ページの完全設計。リード獲得の入口' },
  'instagram-paid-course-guide': { subCategory: 'product', order: 4, description: '有料講座3層設計。価格帯別の商品ラインナップ' },
  'instagram-premium-program-guide': { subCategory: 'product', order: 5, description: '30万円高額プログラムの設計と販売戦略' },
  'instagram-upsell-guide': { subCategory: 'funnel', order: 6, description: '無料→有料→高額への導線設計。LTV最大化' },
  'instagram-lp-design-guide': { subCategory: 'funnel', order: 7, description: 'CVR15%を目指すLP完全設計。15セクション構成' },
  'stripe-payment-system-guide': { subCategory: 'payment', order: 8, description: 'Stripe決済+Webhook連携。分割払い対応' },
  'discord-community-guide': { subCategory: 'community', order: 9, description: '会員制コミュニティ運営。52チャンネル設計' },
  'n8n-automation-guide': { subCategory: 'automation', order: 10, description: '完全無料の自動化基盤。Oracle Cloud+n8n' },
  'n8n-auto-report-guide': { subCategory: 'automation', order: 11, description: '週次・月次レポート自動生成。PDF配信' },
  'x-auto-dm-guide': { subCategory: 'automation', order: 12, description: 'X自動DM+リード獲得の半自動化フロー' },
  'instagram-automation-guide': { subCategory: 'automation', order: 13, description: 'フック→台本→動画生成の完全自動化' },
};

export interface GuideCategory {
  id: string;
  name: string;
  guides: GuideItem[];
}

/**
 * ガイドのカテゴリを判定
 */
function getGuideCategory(slug: string): { id: string; name: string } {
  if (slug.includes('lp') || slug.includes('sales') || slug.includes('upsell') || slug.includes('premium-program') || slug.includes('tokuten') || slug.includes('paid-course') || slug.includes('monetization') || slug.includes('strategy') || slug.includes('discord') || slug.includes('stripe') || slug.includes('n8n') || slug.includes('x-auto') || slug.includes('instagram-automation')) {
    return { id: 'sales', name: 'セールス・LP設計' };
  }
  if (slug.includes('automation')) {
    return { id: 'automation', name: '自動化・ワークフロー' };
  }
  if (slug.includes('prompt') || slug.includes('PROMPT') || slug.includes('META-PROMPT') || slug.includes('batch')) {
    return { id: 'prompts', name: 'プロンプト・テンプレート' };
  }
  if (slug.includes('hook')) {
    return { id: 'hooks', name: 'フック集' };
  }
  if (slug.includes('script') || slug.includes('viral')) {
    return { id: 'scripts', name: '台本集' };
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

    const guideItem: GuideItem = {
      slug,
      title,
      description,
      category: category.id,
      content,
    };

    // salesカテゴリの場合、サブカテゴリ・順序・説明を追加
    if (category.id === 'sales' && salesGuideConfig[slug]) {
      guideItem.subCategory = salesGuideConfig[slug].subCategory;
      guideItem.order = salesGuideConfig[slug].order;
      guideItem.description = salesGuideConfig[slug].description;
    }

    guides.push(guideItem);
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
  const categoryOrder = ['sales', 'automation', 'prompts', 'hooks', 'scripts', 'analysis', 'other'];
  const categoryNames: Record<string, string> = {
    automation: '自動化・ワークフロー',
    sales: 'セールス・LP設計',
    prompts: 'プロンプト・テンプレート',
    hooks: 'フック集',
    scripts: '台本集',
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
      const category = categoryMap.get(catId)!;
      // salesカテゴリは順序でソート
      if (catId === 'sales') {
        category.guides.sort((a, b) => (a.order || 999) - (b.order || 999));
      }
      result.push(category);
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
