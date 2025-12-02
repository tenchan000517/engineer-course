import Link from 'next/link';
import { ReactNode } from 'react';
import { getAllCategories, getModulesByCategory } from '@/lib/markdown';

// アイコンマッピング
const iconMap: Record<string, ReactNode> = {
  briefcase: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  rocket: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  workflow: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

// カラーマッピング
const colorMap: Record<string, { bg: string; bgHover: string; border: string }> = {
  blue: { bg: 'bg-blue-500', bgHover: 'hover:bg-blue-600', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-500', bgHover: 'hover:bg-purple-600', border: 'border-purple-500' },
  orange: { bg: 'bg-orange-500', bgHover: 'hover:bg-orange-600', border: 'border-orange-500' },
  green: { bg: 'bg-green-500', bgHover: 'hover:bg-green-600', border: 'border-green-500' },
};

export default function Home() {
  const categories = getAllCategories();

  // カテゴリごとのモジュール数を取得
  const categoriesWithCount = categories.map((category) => {
    const modules = getModulesByCategory(category.id);
    return {
      ...category,
      actualModuleCount: modules.length,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        {/* ヘッダーセクション */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Engineer Course
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-2">
            プログラミング・自動化・AI開発を学ぶ
          </p>
          <p className="text-base md:text-lg text-gray-600">
            非エンジニアでも始められる、実践的な講座
          </p>
        </div>

        {/* カテゴリカード一覧 */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            講座一覧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithCount.map((category) => {
              const colors = colorMap[category.color] || colorMap.blue;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  {/* カードヘッダー */}
                  <div className={`${colors.bg} p-6 text-white`}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        {iconMap[category.icon] || iconMap.briefcase}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.title}</h3>
                        <p className="text-white/80 text-sm">
                          {category.actualModuleCount} モジュール
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* カードボディ */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.tags.editor.slice(0, 2).map((editor) => (
                        <span
                          key={editor}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {editor}
                        </span>
                      ))}
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {category.tags.level}
                      </span>
                    </div>

                    {/* CTAボタン */}
                    <div
                      className={`text-center ${colors.bg} ${colors.bgHover} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                    >
                      講座を見る →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            講座の特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                number: 1,
                title: '実践的な学習',
                description:
                  '実際に手を動かしながら学ぶことで、実践的なスキルを身につけることができます。',
                color: 'bg-blue-500',
              },
              {
                number: 2,
                title: '非エンジニア向け',
                description:
                  'プログラミング初心者でも安心して学べる、丁寧でわかりやすい解説を提供しています。',
                color: 'bg-green-500',
              },
              {
                number: 3,
                title: '最新技術に対応',
                description:
                  'Next.js、AI開発ツール、自動化ツールなど、最新の技術を学べます。',
                color: 'bg-purple-500',
              },
              {
                number: 4,
                title: 'スキマ時間で学習',
                description:
                  '各モジュールは短時間で完了できるよう設計。忙しい方でも継続しやすい構成です。',
                color: 'bg-orange-500',
              },
            ].map((feature) => (
              <div
                key={feature.number}
                className="bg-white rounded-2xl shadow-lg p-4 md:p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div
                    className={`${feature.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0`}
                  >
                    {feature.number}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 break-words">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
