import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTokutenAccounts, getTokutensByAccount, getTokutenBySlug } from '@/lib/tokuten';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export async function generateStaticParams() {
  const accounts = getAllTokutenAccounts();
  const params: { accountSlug: string; tokutenSlug: string }[] = [];

  for (const account of accounts) {
    const tokutens = getTokutensByAccount(account.slug);
    for (const tokuten of tokutens) {
      params.push({
        accountSlug: account.slug,
        tokutenSlug: tokuten.slug,
      });
    }
  }

  return params;
}

export default async function TokutenDetailPage({
  params,
}: {
  params: Promise<{ accountSlug: string; tokutenSlug: string }>;
}) {
  const { accountSlug, tokutenSlug } = await params;

  const tokuten = getTokutenBySlug(accountSlug, tokutenSlug);
  if (!tokuten) {
    notFound();
  }

  const tokutens = getTokutensByAccount(accountSlug);
  const currentIndex = tokutens.findIndex((t) => t.slug === tokutenSlug);
  const prevTokuten = currentIndex > 0 ? tokutens[currentIndex - 1] : null;
  const nextTokuten = currentIndex < tokutens.length - 1 ? tokutens[currentIndex + 1] : null;

  const basePath = `/reference/instagram-tokuten/${accountSlug}`;

  // コンテンツから基本情報テーブルを除去し、特典内容以降のみ表示
  const contentWithoutHeader = tokuten.content
    .replace(/^#\s*特典例[^\n]*\n*/m, '')  // タイトル行を除去
    .replace(/^## 基本情報[\s\S]*?^---\s*\n*/m, '')  // 基本情報セクションを除去
    .replace(/^## 特典内容\s*\n*/m, '')  // 「## 特典内容」ヘッダーを除去
    .trim();

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full">
      {/* サイドバー */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg overflow-y-auto z-40">
        <div className="p-4 border-b">
          <Link href={basePath} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {accountSlug}
          </Link>
          <h2 className="text-lg font-bold text-gray-900">特典一覧</h2>
        </div>
        <nav className="p-2">
          {tokutens.map((t, index) => (
            <Link
              key={t.slug}
              href={`${basePath}/${t.slug}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                t.slug === tokutenSlug
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                t.slug === tokutenSlug
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm truncate">{t.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 w-full overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full min-w-0">
          {/* 上部ナビゲーション */}
          <div className="flex justify-between items-center mb-6 md:mb-8 gap-2 w-full min-w-0">
            {prevTokuten ? (
              <Link
                href={`${basePath}/${prevTokuten.slug}`}
                className="flex items-center gap-1 md:gap-2 text-pink-600 hover:text-pink-800 font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">前の特典</span>
                <span className="sm:hidden">前へ</span>
              </Link>
            ) : (
              <div />
            )}
            {nextTokuten ? (
              <Link
                href={`${basePath}/${nextTokuten.slug}`}
                className="flex items-center gap-1 md:gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <span className="hidden sm:inline">次の特典</span>
                <span className="sm:hidden">次へ</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
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
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* 特典ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8 w-full min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 break-words w-full">
              {tokuten.title}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-gray-600 w-full">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
                {tokuten.genre}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                {tokuten.format}
              </span>
              <span className="flex items-center gap-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                収集: {tokuten.collectedDate}
              </span>
            </div>
          </div>

          {/* マークダウンコンテンツ */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-6 md:mb-8 overflow-hidden w-full min-w-0">
            <MarkdownRenderer content={contentWithoutHeader} />
          </div>

          {/* 下部ナビゲーション */}
          <div className="flex justify-between items-center gap-2 mb-4 w-full min-w-0">
            {prevTokuten ? (
              <Link
                href={`${basePath}/${prevTokuten.slug}`}
                className="flex items-center gap-1 md:gap-2 text-pink-600 hover:text-pink-800 font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">前の特典</span>
                <span className="sm:hidden">前へ</span>
              </Link>
            ) : (
              <div />
            )}
            {nextTokuten ? (
              <Link
                href={`${basePath}/${nextTokuten.slug}`}
                className="flex items-center gap-1 md:gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                <span className="hidden sm:inline">次の特典</span>
                <span className="sm:hidden">次へ</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
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
              </Link>
            ) : (
              <div />
            )}
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
      </main>
    </div>
  );
}
