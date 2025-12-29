import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getCategoryBySlug,
  getModulesByCategory,
  SubcourseData,
} from '@/lib/markdown';
import { ReactNode } from 'react';

// サブコースIDとディレクトリのマッピング
const subcourseDirectoryMap: Record<string, string> = {
  'n8n-instagram': 'n8n',
  'n8n-advanced': 'n8n-advanced',
  'nanobanana-beginner': 'nanobanana-beginner',
};

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    categorySlug: category.id,
  }));
}

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
};

// カラーマッピング
const colorMap: Record<string, { bg: string; text?: string }> = {
  blue: { bg: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500' },
  orange: { bg: 'bg-orange-500' },
  green: { bg: 'bg-green-500' },
  white: { bg: 'bg-gray-900' },
  amber: { bg: 'bg-amber-500' },
  yellow: { bg: 'bg-yellow-500' },
  pink: { bg: 'bg-pink-500' },
};

// orderを表示用に変換（2.1 → A, 2.2 → B, ...）
function formatOrder(order: number): string {
  if (Number.isInteger(order)) {
    return order.toString();
  }
  const decimal = Math.round((order % 1) * 10);
  return String.fromCharCode(64 + decimal);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const modules = getModulesByCategory(categorySlug);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        {/* 戻るリンク */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          講座一覧に戻る
        </Link>

        {/* カテゴリヘッダー */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${
              colorMap[category.color]?.bg || 'bg-gray-500'
            } ${colorMap[category.color]?.text || 'text-white'} rounded-2xl mb-4`}
          >
            {iconMap[category.icon] || iconMap.briefcase}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">{category.description}</p>
        </div>

        {/* タグ表示 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {category.tags.language.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {lang}
            </span>
          ))}
          {category.tags.editor.map((editor) => (
            <span
              key={editor}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {editor}
            </span>
          ))}
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {category.tags.level}
          </span>
        </div>

        {/* サブコースがある場合はカード表示 */}
        {category.hasSubcourses && category.subcourses ? (
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
              コース一覧
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.subcourses.filter((subcourse: SubcourseData) => !subcourse.hidden).map((subcourse: SubcourseData) => {
                // 動的にモジュール数をカウント
                const moduleDir = subcourseDirectoryMap[subcourse.id];
                const actualModuleCount = moduleDir ? getModulesByCategory(moduleDir).length : subcourse.moduleCount;

                return (
                <Link
                  key={subcourse.id}
                  href={`/category/${categorySlug}/${subcourse.id}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  {/* カードヘッダー */}
                  <div className={`${colorMap[category.color]?.bg || 'bg-orange-500'} p-6 ${colorMap[category.color]?.text || 'text-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`${colorMap[category.color]?.text ? 'bg-gray-200' : 'bg-white/20'} p-3 rounded-xl`}>
                        {iconMap[category.icon] || iconMap.workflow}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{subcourse.title}</h3>
                        <p className={`${colorMap[category.color]?.text ? 'text-gray-600' : 'text-white/80'} text-sm`}>
                          {actualModuleCount} モジュール
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* カードボディ */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {subcourse.description}
                    </p>

                    {/* レベル表示 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {subcourse.level === 'beginner' ? '初級' : subcourse.level === 'intermediate' ? '中級' : '上級'}
                      </span>
                    </div>

                    {/* CTAボタン */}
                    <div
                      className={`text-center ${colorMap[category.color]?.bg || 'bg-orange-500'} hover:opacity-90 ${colorMap[category.color]?.text || 'text-white'} font-medium py-2 px-4 rounded-lg transition-opacity`}
                    >
                      講座を見る →
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* モジュール一覧 */}
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                モジュール一覧
              </h2>
              <div className="space-y-3 md:space-y-4">
                {modules.map((module) => (
                  <Link
                    key={module.slug}
                    href={`/category/${categorySlug}/${module.slug}`}
                    className={`block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4`}
                    style={{
                      borderLeftColor:
                        category.color === 'blue'
                          ? '#3b82f6'
                          : category.color === 'purple'
                          ? '#a855f7'
                          : category.color === 'orange'
                          ? '#f97316'
                          : category.color === 'green'
                          ? '#22c55e'
                          : category.color === 'amber'
                          ? '#f59e0b'
                          : category.color === 'yellow'
                          ? '#eab308'
                          : category.color === 'pink'
                          ? '#ec4899'
                          : category.color === 'white'
                          ? '#1f2937'
                          : '#3b82f6',
                    }}
                  >
                    <div className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                      <div
                        className={`${
                          colorMap[category.color]?.bg || 'bg-blue-500'
                        } w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${colorMap[category.color]?.text || 'text-white'} font-bold text-lg md:text-xl flex-shrink-0`}
                      >
                        {formatOrder(module.order)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 break-words">
                          {module.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                          <span>{module.duration}</span>
                          <span>{module.difficulty}</span>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0"
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
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTAボタン */}
            {modules.length > 0 && (
              <div className="text-center pb-8">
                <Link
                  href={`/category/${categorySlug}/${modules[0].slug}`}
                  className={`inline-block ${
                    colorMap[category.color]?.bg || 'bg-blue-600'
                  } hover:opacity-90 ${colorMap[category.color]?.text || 'text-white'} font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-opacity`}
                >
                  講座をはじめる
                </Link>
              </div>
            )}
          </>
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
