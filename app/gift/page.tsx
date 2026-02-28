import Link from 'next/link';
import { getAllGifts } from '@/lib/markdown';

export default function GiftsListPage() {
  const gifts = getAllGifts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 戻るリンク */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          トップに戻る
        </Link>

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-2xl mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            特典一覧
          </h1>
          <p className="text-lg text-gray-600">
            {gifts.length} 件の特典
          </p>
        </div>

        {/* 特典一覧 */}
        {gifts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">特典がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifts.map((gift) => (
              <div
                key={gift.slug}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4"
              >
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {gift.title}
                  </h3>

                  {/* メタ情報 */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                    {gift.duration && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {gift.duration}
                      </span>
                    )}
                    {gift.difficulty && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {gift.difficulty}
                      </span>
                    )}
                  </div>

                  {/* URL表示 */}
                  <div className="mt-auto">
                    <div className="bg-gray-50 rounded-lg p-2 mb-3">
                      <code className="text-xs text-purple-600 break-all">
                        /gift/{gift.slug}
                      </code>
                    </div>

                    <Link
                      href={`/gift/${gift.slug}`}
                      className="block text-center bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      開く →
                    </Link>
                  </div>
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
