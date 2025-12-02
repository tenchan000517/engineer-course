'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CategoryData, ModuleData } from '@/lib/markdown';

interface CategorySidebarProps {
  category: CategoryData;
  modules: ModuleData[];
  currentModuleSlug: string;
}

// カラーマッピング
const colorMap: Record<string, { bg: string; text: string; activeBg: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-700', activeBg: 'bg-blue-50' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-700', activeBg: 'bg-purple-50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-700', activeBg: 'bg-orange-50' },
  green: { bg: 'bg-green-500', text: 'text-green-700', activeBg: 'bg-green-50' },
};

export default function CategorySidebar({
  category,
  modules,
  currentModuleSlug,
}: CategorySidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const colors = colorMap[category.color] || colorMap.blue;

  return (
    <>
      {/* ハンバーガーメニューボタン (モバイルのみ) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 ${colors.bg} text-white p-2 rounded-lg shadow-lg`}
        aria-label="メニュー"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* オーバーレイ (モバイルのみ) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link
            href="/"
            className="block mb-2 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            ← 講座一覧
          </Link>
          <Link
            href={`/category/${category.id}`}
            className="block mb-8"
            onClick={() => setIsOpen(false)}
          >
            <h1 className="text-xl font-bold text-gray-900">{category.title}</h1>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {category.description}
            </p>
          </Link>

          <nav>
            <div className="space-y-1">
              {modules.map((module) => {
                const isActive = module.slug === currentModuleSlug;
                return (
                  <Link
                    key={module.slug}
                    href={`/category/${category.id}/${module.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? `${colors.activeBg} ${colors.text} font-medium`
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive
                            ? `${colors.bg} text-white`
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {module.order}
                      </span>
                      <span className="text-sm flex-1 break-words">
                        {module.title
                          .replace(/^モジュール\d+:\s*/, '')
                          .replace(/^Google\s+/, '')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
