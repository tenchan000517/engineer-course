import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTokutenAccounts, getTokutensByAccount } from '@/lib/tokuten';

export async function generateStaticParams() {
  const accounts = getAllTokutenAccounts();
  return accounts.map((account) => ({
    accountSlug: account.slug,
  }));
}

export default async function TokutenListPage({
  params,
}: {
  params: Promise<{ accountSlug: string }>;
}) {
  const { accountSlug } = await params;
  const tokutens = getTokutensByAccount(accountSlug);
  const accounts = getAllTokutenAccounts();
  const account = accounts.find(a => a.slug === accountSlug);

  if (!account) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 戻るリンク */}
        <Link
          href="/reference/instagram-tokuten"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          アカウント一覧に戻る
        </Link>

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-2xl mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {account.name}
          </h1>
          <p className="text-lg text-gray-600">
            {tokutens.length} 件の特典を収集
          </p>
        </div>

        {/* 特典一覧 */}
        {tokutens.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">まだ特典が収集されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokutens.map((tokuten, index) => (
              <Link
                key={tokuten.slug}
                href={`/reference/instagram-tokuten/${accountSlug}/${tokuten.slug}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* カードヘッダー */}
                <div className="bg-pink-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <span className="text-2xl font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold line-clamp-2">{tokuten.title}</h3>
                    </div>
                  </div>
                </div>

                {/* カードボディ */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                      {tokuten.genre}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {tokuten.format}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">
                    収集: {tokuten.collectedDate}
                  </p>
                  <div className="text-center bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    詳細を見る →
                  </div>
                </div>
              </Link>
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
