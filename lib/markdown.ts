import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');
const modulesDirectory = path.join(contentDirectory, 'modules');

// ============================================
// Types
// ============================================

export interface CategoryTags {
  language: string[];
  framework: string[];
  editor: string[];
  platform: string[];
  level: string;
  topics: string[];
}

export interface SubcourseData {
  id: string;
  title: string;
  description: string;
  moduleCount: number;
  level: string;
}

export interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  tags: CategoryTags;
  moduleCount: number;
  hasSubcourses?: boolean;
  subcourses?: SubcourseData[];
  isSubcourse?: boolean;
  parentCategory?: string;
}

export interface ModuleData {
  slug: string;
  categoryId: string;
  title: string;
  duration: string;
  difficulty: string;
  content: string;
  order: number;
}

// ============================================
// Category Functions
// ============================================

export function getAllCategories(): CategoryData[] {
  const categoryDirs = fs.readdirSync(modulesDirectory).filter((dir) => {
    const fullPath = path.join(modulesDirectory, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  const categories = categoryDirs
    .map((dir) => {
      const categoryPath = path.join(modulesDirectory, dir, '_category.json');
      if (!fs.existsSync(categoryPath)) {
        return null;
      }
      const categoryData = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
      return categoryData as CategoryData;
    })
    .filter((cat): cat is CategoryData => cat !== null)
    .filter((cat) => !cat.isSubcourse) // サブコースは講座一覧から除外
    .sort((a, b) => a.order - b.order);

  return categories;
}

export function getCategoryBySlug(slug: string): CategoryData | null {
  const categoryPath = path.join(modulesDirectory, slug, '_category.json');
  if (!fs.existsSync(categoryPath)) {
    return null;
  }
  const categoryData = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
  return categoryData as CategoryData;
}

// ============================================
// Module Functions
// ============================================

function parseModuleContent(
  fileName: string,
  fileContents: string,
  categoryId: string
): ModuleData {
  const slug = fileName.replace(/\.md$/, '');
  const { content } = matter(fileContents);

  // Extract title from first h1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  // Extract duration and difficulty
  const durationMatch = content.match(/\*\*所要時間\*\*:\s*(.+)/);
  const difficultyMatch = content.match(/\*\*難易度\*\*:\s*(.+)/);

  const duration = durationMatch ? durationMatch[1] : '';
  const difficulty = difficultyMatch ? difficultyMatch[1] : '';

  // Extract module number for ordering
  const orderMatch = slug.match(/(?:module-)?(\d+)/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : 99;

  // Clean content
  let cleanedContent = content;
  cleanedContent = cleanedContent.replace(/^#\s+.+$/m, '');
  cleanedContent = cleanedContent.replace(/\*\*所要時間\*\*:\s*.+\n?/g, '');
  cleanedContent = cleanedContent.replace(/\*\*難易度\*\*:\s*.+\n?/g, '');
  cleanedContent = cleanedContent.replace(/^\n+---\n+/, '');
  cleanedContent = cleanedContent.trim();

  return {
    slug,
    categoryId,
    title,
    duration,
    difficulty,
    content: cleanedContent,
    order,
  };
}

export function getModulesByCategory(categoryId: string): ModuleData[] {
  const categoryDir = path.join(modulesDirectory, categoryId);
  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryDir);

  const modules = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(categoryDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return parseModuleContent(fileName, fileContents, categoryId);
    })
    .sort((a, b) => a.order - b.order);

  return modules;
}

export function getModuleBySlug(
  categoryId: string,
  moduleSlug: string
): ModuleData | null {
  try {
    const fullPath = path.join(
      modulesDirectory,
      categoryId,
      `${moduleSlug}.md`
    );
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return parseModuleContent(`${moduleSlug}.md`, fileContents, categoryId);
  } catch (error) {
    return null;
  }
}

// ============================================
// Filter Functions (for future use)
// ============================================

export function getCategoriesByTag(
  tagType: keyof CategoryTags,
  tagValue: string
): CategoryData[] {
  const allCategories = getAllCategories();
  return allCategories.filter((category) => {
    const tagValues = category.tags[tagType];
    if (Array.isArray(tagValues)) {
      return tagValues.includes(tagValue);
    }
    return tagValues === tagValue;
  });
}

export function getAvailableTags(): {
  languages: string[];
  frameworks: string[];
  editors: string[];
  platforms: string[];
  levels: string[];
  topics: string[];
} {
  const allCategories = getAllCategories();

  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const editors = new Set<string>();
  const platforms = new Set<string>();
  const levels = new Set<string>();
  const topics = new Set<string>();

  allCategories.forEach((cat) => {
    cat.tags.language.forEach((l) => languages.add(l));
    cat.tags.framework.forEach((f) => frameworks.add(f));
    cat.tags.editor.forEach((e) => editors.add(e));
    cat.tags.platform.forEach((p) => platforms.add(p));
    levels.add(cat.tags.level);
    cat.tags.topics.forEach((t) => topics.add(t));
  });

  return {
    languages: Array.from(languages),
    frameworks: Array.from(frameworks),
    editors: Array.from(editors),
    platforms: Array.from(platforms),
    levels: Array.from(levels),
    topics: Array.from(topics),
  };
}

// ============================================
// Legacy Functions (for backward compatibility)
// ============================================

export function getAllModules(): ModuleData[] {
  // Returns all modules from the first category (portfolio) for backward compatibility
  const categories = getAllCategories();
  if (categories.length === 0) return [];
  return getModulesByCategory(categories[0].id);
}
