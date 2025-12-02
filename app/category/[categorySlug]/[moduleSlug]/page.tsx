import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getCategoryBySlug,
  getModulesByCategory,
  getModuleBySlug,
} from '@/lib/markdown';
import CategorySidebar from '@/components/CategorySidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export async function generateStaticParams() {
  const categories = getAllCategories();
  const params: { categorySlug: string; moduleSlug: string }[] = [];

  categories.forEach((category) => {
    const modules = getModulesByCategory(category.id);
    modules.forEach((module) => {
      params.push({
        categorySlug: category.id,
        moduleSlug: module.slug,
      });
    });
  });

  return params;
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ categorySlug: string; moduleSlug: string }>;
}) {
  const { categorySlug, moduleSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const module = getModuleBySlug(categorySlug, moduleSlug);

  if (!category || !module) {
    notFound();
  }

  const modules = getModulesByCategory(categorySlug);
  const currentIndex = modules.findIndex((m) => m.slug === moduleSlug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full">
      <CategorySidebar
        category={category}
        modules={modules}
        currentModuleSlug={moduleSlug}
      />
      <main className="flex-1 md:ml-64 w-full overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full min-w-0">
          {/* 上部ナビゲーション */}
          <div className="flex justify-between items-center mb-6 md:mb-8 gap-2 w-full min-w-0">
            {prevModule ? (
              <Link
                href={`/category/${categorySlug}/${prevModule.slug}`}
                className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
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
                href={`/category/${categorySlug}/${nextModule.slug}`}
                className="flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
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
                href={`/category/${categorySlug}/${prevModule.slug}`}
                className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
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
                href={`/category/${categorySlug}/${nextModule.slug}`}
                className="flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
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
