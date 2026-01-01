import Link from 'next/link';
import { getAllGifts } from '@/lib/markdown';

export default function GiftsPage() {
  const gifts = getAllGifts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            特典一覧
          </h1>
          <p className="text-gray-600">
            Instagram投稿の特典コンテンツ
          </p>
        </div>

        {/* カード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gifts.map((gift) => (
            <Link
              key={gift.slug}
              href={`/gift/${gift.slug}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {gift.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-blue-600 hover:text-blue-800">
                  詳細を見る →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 件数表示 */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          全 {gifts.length} 件
        </div>
      </main>
    </div>
  );
}
