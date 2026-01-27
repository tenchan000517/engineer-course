import Link from 'next/link';
import { getGuidesByCategory, salesSubCategories } from '@/lib/guides';
import {
  ChevronLeft,
  BookOpen,
  Settings,
  FileText,
  Anchor,
  BarChart3,
  Folder,
  ArrowRight,
  Scroll,
  DollarSign
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  sales: <DollarSign className="w-6 h-6" />,
  automation: <Settings className="w-6 h-6" />,
  prompts: <FileText className="w-6 h-6" />,
  hooks: <Anchor className="w-6 h-6" />,
  scripts: <Scroll className="w-6 h-6" />,
  analysis: <BarChart3 className="w-6 h-6" />,
  other: <Folder className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  sales: 'bg-yellow-500',
  automation: 'bg-blue-500',
  prompts: 'bg-purple-500',
  hooks: 'bg-orange-500',
  scripts: 'bg-pink-500',
  analysis: 'bg-green-500',
  other: 'bg-gray-500',
};

// salesサブカテゴリの色を取得
function getGuideColor(guide: { category: string; subCategory?: string }): string {
  if (guide.category === 'sales' && guide.subCategory) {
    const subCat = salesSubCategories[guide.subCategory as keyof typeof salesSubCategories];
    return subCat?.color || categoryColors.sales;
  }
  return categoryColors[guide.category] || categoryColors.other;
}

export default function GuidesPage() {
  const categories = getGuidesByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 戻るリンク */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          トップに戻る
        </Link>

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-2xl mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Instagramガイド集
          </h1>
          <p className="text-lg text-gray-600">
            プロンプト・自動化・フック集など
          </p>
        </div>

        {/* カテゴリ別ガイド一覧 */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">まだガイドがありません</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.id}>
                {/* カテゴリヘッダー */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-gray-700">
                    {categoryIcons[category.id] || <Folder className="w-6 h-6" />}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {category.guides.length}件
                  </span>
                </div>

                {/* salesカテゴリの場合はサブカテゴリ凡例を表示 */}
                {category.id === 'sales' && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(salesSubCategories).map(([key, sub]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${sub.color}`}></span>
                        <span className="text-sm text-gray-600">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ガイドカード */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.guides.map((guide) => {
                    const cardColor = getGuideColor(guide);
                    const subCatInfo = guide.subCategory
                      ? salesSubCategories[guide.subCategory as keyof typeof salesSubCategories]
                      : null;

                    return (
                      <Link
                        key={guide.slug}
                        href={`/reference/guides/${guide.slug}`}
                        className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
                      >
                        {/* カードヘッダー */}
                        <div className={`${cardColor} p-4 text-white`}>
                          {/* サブカテゴリバッジ */}
                          {subCatInfo && (
                            <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded mb-2">
                              {guide.order}. {subCatInfo.name}
                            </span>
                          )}
                          <h3 className="text-lg font-bold line-clamp-2">{guide.title}</h3>
                        </div>

                        {/* カードボディ */}
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {guide.description || 'ガイドを表示'}
                          </p>
                          <div className={`flex items-center justify-center gap-2 ${cardColor} hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-colors`}>
                            詳細を見る
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="text-center py-8 mt-8 text-sm text-gray-500">
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
