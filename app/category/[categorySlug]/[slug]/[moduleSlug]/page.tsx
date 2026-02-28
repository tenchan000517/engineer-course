import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getCategoryBySlug,
  getModulesByCategory,
  getModuleBySlug,
  SubcourseData,
} from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// サブコースIDとディレクトリのマッピング
const subcourseDirectoryMap: Record<string, string> = {
  'n8n-instagram': 'n8n',
};

// カラーマッピング
const colorMap: Record<string, { bg: string; bgHover: string; light: string; lightText: string; text: string; textHover: string }> = {
  blue: { bg: 'bg-blue-600', bgHover: 'hover:bg-blue-700', light: 'bg-blue-100', lightText: 'text-blue-700', text: 'text-blue-600', textHover: 'hover:text-blue-800' },
  purple: { bg: 'bg-purple-600', bgHover: 'hover:bg-purple-700', light: 'bg-purple-100', lightText: 'text-purple-700', text: 'text-purple-600', textHover: 'hover:text-purple-800' },
  orange: { bg: 'bg-orange-600', bgHover: 'hover:bg-orange-700', light: 'bg-orange-100', lightText: 'text-orange-700', text: 'text-orange-600', textHover: 'hover:text-orange-800' },
  green: { bg: 'bg-green-600', bgHover: 'hover:bg-green-700', light: 'bg-green-100', lightText: 'text-green-700', text: 'text-green-600', textHover: 'hover:text-green-800' },
  white: { bg: 'bg-gray-800', bgHover: 'hover:bg-gray-900', light: 'bg-gray-100', lightText: 'text-gray-700', text: 'text-gray-600', textHover: 'hover:text-gray-800' },
  amber: { bg: 'bg-amber-600', bgHover: 'hover:bg-amber-700', light: 'bg-amber-100', lightText: 'text-amber-700', text: 'text-amber-600', textHover: 'hover:text-amber-800' },
  yellow: { bg: 'bg-yellow-600', bgHover: 'hover:bg-yellow-700', light: 'bg-yellow-100', lightText: 'text-yellow-700', text: 'text-yellow-600', textHover: 'hover:text-yellow-800' },
  pink: { bg: 'bg-pink-600', bgHover: 'hover:bg-pink-700', light: 'bg-pink-100', lightText: 'text-pink-700', text: 'text-pink-600', textHover: 'hover:text-pink-800' },
};

// orderを表示用に変換（2.1 → A, 2.2 → B, ...）
function formatOrder(order: number): string {
  if (Number.isInteger(order)) {
    return order.toString();
  }
  const decimal = Math.round((order % 1) * 10);
  return String.fromCharCode(64 + decimal);
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const params: { categorySlug: string; slug: string; moduleSlug: string }[] = [];

  categories.forEach((category) => {
    if (category.hasSubcourses && category.subcourses) {
      category.subcourses.forEach((subcourse: SubcourseData) => {
        const moduleDir = subcourseDirectoryMap[subcourse.id] || subcourse.id;
        const modules = getModulesByCategory(moduleDir);
        modules.forEach((module) => {
          params.push({
            categorySlug: category.id,
            slug: subcourse.id,
            moduleSlug: module.slug,
          });
        });
      });
    }
  });

  return params;
}

export default async function SubcourseModulePage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string; moduleSlug: string }>;
}) {
  const { categorySlug, slug: subcourseSlug, moduleSlug } = await params;

  // 親カテゴリを取得
  const parentCategory = getCategoryBySlug(categorySlug);
  if (!parentCategory || !parentCategory.subcourses) {
    notFound();
  }

  // サブコース情報を取得
  const subcourse = parentCategory.subcourses.find((s: SubcourseData) => s.id === subcourseSlug);
  if (!subcourse) {
    notFound();
  }

  // モジュール情報を取得
  const moduleDir = subcourseDirectoryMap[subcourseSlug] || subcourseSlug;
  const module = getModuleBySlug(moduleDir, moduleSlug);
  if (!module) {
    notFound();
  }

  const modules = getModulesByCategory(moduleDir);
  const currentIndex = modules.findIndex((m) => m.slug === moduleSlug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const basePath = `/category/${categorySlug}/${subcourseSlug}`;
  const colors = colorMap[parentCategory.color] || colorMap.blue;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full">
      {/* サイドバー */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg overflow-y-auto z-40">
        <div className="p-4 border-b">
          <Link href={`/category/${categorySlug}`} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {parentCategory.title}
          </Link>
          <h2 className="text-lg font-bold text-gray-900">{subcourse.title}</h2>
        </div>
        <nav className="p-2">
          {modules.map((m) => (
            <Link
              key={m.slug}
              href={`${basePath}/${m.slug}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                m.slug === moduleSlug
                  ? `${colors.light} ${colors.lightText}`
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                m.slug === moduleSlug
                  ? `${colors.bg} text-white`
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {formatOrder(m.order)}
              </span>
              <span className="text-sm truncate">{m.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 w-full overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full min-w-0">
          {/* 上部ナビゲーション */}
          <div className="flex justify-between items-center mb-6 md:mb-8 gap-2 w-full min-w-0">
            {prevModule ? (
              <Link
                href={`${basePath}/${prevModule.slug}`}
                className={`flex items-center gap-1 md:gap-2 ${colors.text} ${colors.textHover} font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">前のモジュール</span>
                <span className="sm:hidden">前へ</span>
              </Link>
            ) : (
              <div />
            )}
            {nextModule ? (
              <Link
                href={`${basePath}/${nextModule.slug}`}
                className={`flex items-center gap-1 md:gap-2 ${colors.bg} ${colors.bgHover} text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base`}
              >
                <span className="hidden sm:inline">次のモジュール</span>
                <span className="sm:hidden">次へ</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* モジュールヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8 w-full min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 break-words w-full">
              {module.title}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-gray-600 w-full">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {module.duration}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {module.difficulty}
              </span>
            </div>
          </div>

          {/* マークダウンコンテンツ */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-6 md:mb-8 overflow-hidden w-full min-w-0">
            <MarkdownRenderer content={module.content} />
          </div>

          {/* 下部ナビゲーション */}
          <div className="flex justify-between items-center gap-2 mb-4 w-full min-w-0">
            {prevModule ? (
              <Link
                href={`${basePath}/${prevModule.slug}`}
                className={`flex items-center gap-1 md:gap-2 ${colors.text} ${colors.textHover} font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">前のモジュール</span>
                <span className="sm:hidden">前へ</span>
              </Link>
            ) : (
              <div />
            )}
            {nextModule ? (
              <Link
                href={`${basePath}/${nextModule.slug}`}
                className={`flex items-center gap-1 md:gap-2 ${colors.bg} ${colors.bgHover} text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base`}
              >
                <span className="hidden sm:inline">次のモジュール</span>
                <span className="sm:hidden">次へ</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* フッター */}
          <div className="text-center py-4 text-sm text-gray-500">
            運営:{' '}
            <a
              href="https://yumesuta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ゆめスタ
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
