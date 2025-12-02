import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getCategoryBySlug,
  getModulesByCategory,
} from '@/lib/markdown';
import { ReactNode } from 'react';

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
const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
};

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
              colorMap[category.color] || 'bg-gray-500'
            } text-white rounded-2xl mb-4`}
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
                className={`block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 ${
                  colorMap[category.color]
                    ? `border-${category.color}-500`
                    : 'border-blue-500'
                }`}
                style={{
                  borderLeftColor:
                    category.color === 'blue'
                      ? '#3b82f6'
                      : category.color === 'purple'
                      ? '#a855f7'
                      : category.color === 'orange'
                      ? '#f97316'
                      : '#3b82f6',
                }}
              >
                <div className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                  <div
                    className={`${
                      colorMap[category.color] || 'bg-blue-500'
                    } w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0`}
                  >
                    {module.order}
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
                colorMap[category.color] || 'bg-blue-600'
              } hover:opacity-90 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-opacity`}
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
