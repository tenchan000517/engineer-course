import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllGuides, getGuideBySlug } from '@/lib/guides';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

const categoryColors: Record<string, string> = {
  automation: 'bg-blue-500',
  prompts: 'bg-purple-500',
  hooks: 'bg-orange-500',
  analysis: 'bg-green-500',
  other: 'bg-gray-500',
};

const categoryNames: Record<string, string> = {
  automation: '自動化・ワークフロー',
  prompts: 'プロンプト・テンプレート',
  hooks: 'フック集',
  analysis: '分析・リサーチ',
  other: 'その他',
};

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  // タイトル行を除去
  const contentWithoutTitle = guide.content
    .replace(/^#\s+[^\n]*\n*/m, '')
    .trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 戻るリンク */}
        <Link
          href="/reference/guides"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ガイド一覧に戻る
        </Link>

        {/* ガイドヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 ${categoryColors[guide.category] || 'bg-gray-500'} text-white rounded-full text-sm`}>
              {categoryNames[guide.category] || guide.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {guide.title}
          </h1>
        </div>

        {/* マークダウンコンテンツ */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <MarkdownRenderer content={contentWithoutTitle} />
        </div>

        {/* フッター */}
        <div className="text-center py-8 text-sm text-gray-500">
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
