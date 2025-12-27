import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getModulesByCategory } from '@/lib/markdown';
import { ReactNode } from 'react';

// サブコースIDとディレクトリのマッピング
const subcourseDirectoryMap: Record<string, string> = {
  'kling-basics': 'kling',
  'kling-advanced': 'kling-advanced',
};

export async function generateStaticParams() {
  return [
    { subcourseSlug: 'kling-basics' },
    { subcourseSlug: 'kling-advanced' },
  ];
}

// アイコンマッピング
const iconMap: Record<string, ReactNode> = {
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
};

// カラーマッピング
const colorMap: Record<string, { bg: string; text?: string; border: string }> = {
  green: { bg: 'bg-green-600', text: 'text-white', border: '#16a34a' },
};

export default async function SubcoursePage({
  params,
}: {
  params: Promise<{ subcourseSlug: string }>;
}) {
  const { subcourseSlug } = await params;

  // 親カテゴリ（kling）を取得
  const parentCategory = getCategoryBySlug('kling');
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

  const colors = colorMap[parentCategory.color] || colorMap.green;

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
          <Link href="/category/kling" className="hover:text-gray-900">
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
            className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} ${colors.text || 'text-white'} rounded-2xl mb-4`}
          >
            {iconMap.video}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {subcourse.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">{subcourse.description}</p>
        </div>

        {/* タグ表示 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            KLING AI
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {subcourse.level === 'beginner' ? '初級' : subcourse.level === 'advanced' ? '上級' : '中級'}
          </span>
        </div>

        {/* モジュール一覧 */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            モジュール一覧
          </h2>
          {modules.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {modules.map((module) => (
                <Link
                  key={module.slug}
                  href={`/category/kling/${subcourseSlug}/${module.slug}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4"
                  style={{ borderLeftColor: colors.border }}
                >
                  <div className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                    <div
                      className={`${colors.bg} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${colors.text || 'text-white'} font-bold text-lg md:text-xl flex-shrink-0`}
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
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500">モジュールは準備中です</p>
            </div>
          )}
        </div>

        {/* CTAボタン */}
        {modules.length > 0 && (
          <div className="text-center pb-8">
            <Link
              href={`/category/kling/${subcourseSlug}/${modules[0].slug}`}
              className={`inline-block ${colors.bg} hover:opacity-90 ${colors.text || 'text-white'} font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-opacity`}
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
