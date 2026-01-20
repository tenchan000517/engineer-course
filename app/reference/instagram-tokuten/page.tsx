import Link from 'next/link';
import { getAllTokutenAccounts } from '@/lib/tokuten';

export default function TokutenAccountsPage() {
  const accounts = getAllTokutenAccounts();

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-2xl mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Instagram特典リサーチ
          </h1>
          <p className="text-lg text-gray-600">
            他アカウントの特典例を収集・分析
          </p>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-800 font-medium">参考資料用</p>
              <p className="text-yellow-700 text-sm">
                このページは自分の特典設計の参考にするための資料です。
                他アカウントの特典をそのまま使用することはお控えください。
              </p>
            </div>
          </div>
        </div>

        {/* アカウント一覧 */}
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">まだ特典が収集されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Link
                key={account.slug}
                href={`/reference/instagram-tokuten/${account.slug}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* カードヘッダー */}
                <div className="bg-pink-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{account.name}</h3>
                      <p className="text-white/80 text-sm">
                        {account.tokutenCount} 件の特典
                      </p>
                    </div>
                  </div>
                </div>

                {/* カードボディ */}
                <div className="p-6">
                  <div className="text-center bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    特典一覧を見る →
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
