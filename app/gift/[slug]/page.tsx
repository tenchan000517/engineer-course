import { notFound } from 'next/navigation';
import { getAllGifts, getGiftBySlug } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import GiftDiscordCTA from '@/components/GiftDiscordCTA';

export async function generateStaticParams() {
  const gifts = getAllGifts();
  return gifts.map((gift) => ({
    slug: gift.slug,
  }));
}

export default async function GiftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gift = getGiftBySlug(slug);

  if (!gift) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {gift.title}
          </h1>
          {(gift.duration || gift.difficulty) && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {gift.duration && (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {gift.duration}
                </span>
              )}
              {gift.difficulty && (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {gift.difficulty}
                </span>
              )}
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <MarkdownRenderer content={gift.content} />
        </div>

        {/* Discord CTA */}
        <GiftDiscordCTA />
      </main>
    </div>
  );
}
