import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getModulesByCategory } from '@/lib/markdown';
import { ReactNode } from 'react';

// サブコースIDとディレクトリのマッピング
const subcourseDirectoryMap: Record<string, string> = {
  'instagram-dm-automation': 'instagram-dm-automation',
  'instagram-research': 'instagram-research',
};

export async function generateStaticParams() {
  return [
    { subcourseSlug: 'instagram-dm-automation' },
    { subcourseSlug: 'instagram-research' },
  ];
}

// アイコンマッピング
const iconMap: Record<string, ReactNode> = {
  instagram: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
};

// カラーマッピング
const colorMap: Record<string, string> = {
  pink: 'bg-pink-500',
};

// orderを表示用に変換（2.1 → A, 2.2 → B, ...）
function formatOrder(order: number): string {
  if (Number.isInteger(order)) {
    return order.toString();
  }
  const decimal = Math.round((order % 1) * 10);
  return String.fromCharCode(64 + decimal);
}

export default async function SubcoursePage({
  params,
}: {
  params: Promise<{ subcourseSlug: string }>;
}) {
  const { subcourseSlug } = await params;

  // 親カテゴリ（instagram）を取得
  const parentCategory = getCategoryBySlug('instagram');
  if (!parentCategory || !parentCategory.subcourses) {
    notFound();
  }

  // サブコース情報を取得
  const subcourse = parentCategory.subcourses.find(s => s.id === subcourseSlug);
  if (!subcourse) {
    notFound();
  }

  // サブコースのモジュールディレクトリを特定
  const moduleDirectory = subcourseDirectoryMap[subcourseSlug];
  if (!moduleDirectory) {
    notFound();
  }

  // モジュール一覧を取得
  const modules = getModulesByCategory(moduleDirectory);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        {/* パンくずリスト */}
        <div className="flex items-center gap-2 text-gray-600 mb-8 text-sm">
          <Link href="/" className="hover:text-gray-900">
            講座一覧
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/category/instagram" className="hover:text-gray-900">
            {parentCategory.title}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{subcourse.title}</span>
        </div>

        {/* サブコースヘッダー */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${
              colorMap[parentCategory.color] || 'bg-pink-500'
            } text-white rounded-2xl mb-4`}
          >
            {iconMap.instagram}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {subcourse.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">{subcourse.description}</p>
        </div>

        {/* タグ表示 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Instagram
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Meta API
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {subcourse.level === 'beginner' ? '初級' : subcourse.level === 'intermediate' ? '中級' : '上級'}
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
                href={`/category/instagram/${subcourseSlug}/${module.slug}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4"
                style={{ borderLeftColor: '#ec4899' }}
              >
                <div className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                  <div
                    className="bg-pink-500 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0"
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
              href={`/category/instagram/${subcourseSlug}/${modules[0].slug}`}
              className="inline-block bg-pink-500 hover:opacity-90 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-opacity"
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
