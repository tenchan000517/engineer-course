import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getCategoryBySlug,
  getModulesByCategory,
  getModuleBySlug,
  SubcourseData,
} from '@/lib/markdown';
import { ReactNode } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// アイコンマッピング
const iconMap: Record<string, ReactNode> = {
  briefcase: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  rocket: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  workflow: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
};

// カラーマッピング
const colorMap: Record<string, { bg: string; bgHover: string; light: string; text: string }> = {
  blue: { bg: 'bg-blue-500', bgHover: 'hover:bg-blue-600', light: 'bg-blue-100 text-blue-700', text: 'text-white' },
  purple: { bg: 'bg-purple-500', bgHover: 'hover:bg-purple-600', light: 'bg-purple-100 text-purple-700', text: 'text-white' },
  orange: { bg: 'bg-orange-500', bgHover: 'hover:bg-orange-600', light: 'bg-orange-100 text-orange-700', text: 'text-white' },
  green: { bg: 'bg-green-500', bgHover: 'hover:bg-green-600', light: 'bg-green-100 text-green-700', text: 'text-white' },
  white: { bg: 'bg-gray-900', bgHover: 'hover:bg-gray-800', light: 'bg-gray-100 text-gray-700', text: 'text-white' },
  amber: { bg: 'bg-amber-500', bgHover: 'hover:bg-amber-600', light: 'bg-amber-100 text-amber-700', text: 'text-white' },
  yellow: { bg: 'bg-yellow-500', bgHover: 'hover:bg-yellow-600', light: 'bg-yellow-100 text-yellow-700', text: 'text-white' },
  pink: { bg: 'bg-pink-500', bgHover: 'hover:bg-pink-600', light: 'bg-pink-100 text-pink-700', text: 'text-white' },
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
  const params: { categorySlug: string; slug: string }[] = [];

  categories.forEach((category) => {
    // サブコースがある場合
    if (category.hasSubcourses && category.subcourses) {
      category.subcourses.forEach((subcourse: SubcourseData) => {
        params.push({
          categorySlug: category.id,
          slug: subcourse.id,
        });
      });
    } else {
      // サブコースがない場合はモジュールを直接
      const modules = getModulesByCategory(category.id);
      modules.forEach((module) => {
        params.push({
          categorySlug: category.id,
          slug: module.slug,
        });
      });
    }
  });

  return params;
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const { categorySlug, slug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  // サブコースがある場合、slugがサブコースIDかチェック
  if (category.hasSubcourses && category.subcourses) {
    const subcourse = category.subcourses.find((s: SubcourseData) => s.id === slug);
    if (subcourse) {
      // サブコース一覧ページを表示
      return <SubcoursePage category={category} subcourse={subcourse} />;
    }
  }

  // サブコースがない場合、またはサブコースIDにマッチしない場合はモジュールページ
  const module = getModuleBySlug(categorySlug, slug);
  if (!module) {
    notFound();
  }

  const modules = getModulesByCategory(categorySlug);
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full">
      <CategorySidebar
        category={category}
        modules={modules}
        currentModuleSlug={slug}
      />
      <main className="flex-1 md:ml-64 w-full overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full min-w-0">
          {/* 上部ナビゲーション */}
          <div className="flex justify-between items-center mb-6 md:mb-8 gap-2 w-full min-w-0">
            {prevModule ? (
              <Link
                href={`/category/${categorySlug}/${prevModule.slug}`}
                className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {module.duration}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

// サブコースページコンポーネント
function SubcoursePage({
  category,
  subcourse,
}: {
  category: ReturnType<typeof getCategoryBySlug> & { id: string };
  subcourse: SubcourseData;
}) {
  const modules = getModulesByCategory(subcourse.id);
  const colors = colorMap[category.color] || colorMap.blue;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        {/* パンくずリスト */}
        <div className="flex items-center gap-2 text-gray-600 mb-8 text-sm flex-wrap">
          <Link href="/" className="hover:text-gray-900">
            講座一覧
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/category/${category.id}`} className="hover:text-gray-900">
            {category.title}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{subcourse.title}</span>
        </div>

        {/* サブコースヘッダー */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl mb-4`}
          >
            {iconMap[category.icon] || iconMap.briefcase}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {subcourse.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">{subcourse.description}</p>
        </div>

        {/* タグ表示 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {category.tags.editor.slice(0, 2).map((editor) => (
            <span
              key={editor}
              className={`px-3 py-1 ${colors.light} rounded-full text-sm`}
            >
              {editor}
            </span>
          ))}
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {subcourse.level === 'beginner' ? '初級' : subcourse.level === 'intermediate' ? '中級' : '上級'}
          </span>
        </div>

        {/* モジュール一覧 */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            モジュール一覧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.slug}
                href={`/category/${category.id}/${subcourse.id}/${module.slug}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* カードヘッダー */}
                <div className={`${colors.bg} p-6 ${colors.text}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <span className="text-2xl font-bold">
                        {formatOrder(module.order)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold line-clamp-2">{module.title}</h3>
                    </div>
                  </div>
                </div>

                {/* カードボディ */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {module.duration}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {module.difficulty}
                    </span>
                  </div>
                  <div className={`text-center ${colors.bg} ${colors.bgHover} ${colors.text} font-medium py-2 px-4 rounded-lg transition-colors`}>
                    講座を見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTAボタン */}
        {modules.length > 0 && (
          <div className="text-center pb-8">
            <Link
              href={`/category/${category.id}/${subcourse.id}/${modules[0].slug}`}
              className={`inline-block ${colors.bg} ${colors.bgHover} ${colors.text} font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors`}
            >
              講座をはじめる
            </Link>
          </div>
        )}

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
    </div>
  );
}
