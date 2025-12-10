'use client';

import React, { useState, isValidElement, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { CheckCircle, CheckSquare, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// コードブロックからテキストを抽出するヘルパー関数
function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return extractTextFromChildren(props.children);
  }
  return '';
}

// コピーボタン付きのコードブロックコンポーネント
function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractTextFromChildren(children);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="コードをコピー"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="my-4 rounded-lg overflow-hidden overflow-x-auto max-w-full bg-gray-900 p-4" {...props}>
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none break-words overflow-x-hidden w-full min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-8 mb-4 break-words" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 break-words" {...props} />
          ),
          h3: ({ node, children, ...props }) => {
            const text = String(children);
            const hasCheckmark = text.includes('✅');

            if (hasCheckmark) {
              const cleanText = text.replace(/✅\s*/g, '');
              return (
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 break-words flex items-center gap-2" {...props}>
                  <CheckSquare className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span>{cleanText}</span>
                </h3>
              );
            }

            return <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 break-words" {...props}>{children}</h3>;
          },
          h4: ({ node, ...props }) => (
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mt-4 mb-2 break-words" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed my-4 break-words" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside space-y-2 my-4 ml-4 md:ml-6 pl-0" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside space-y-2 my-4 ml-4 md:ml-6 pl-0" {...props} />
          ),
          li: ({ node, children, ...props }) => {
            // childrenをテキストに変換して✅が含まれているかチェック
            const text = String(children);
            const hasCheckmark = text.includes('✅');

            if (hasCheckmark) {
              // ✅を削除したテキストを取得
              const cleanText = text.replace(/✅\s*/g, '');
              return (
                <li className="flex items-start gap-2 text-gray-700 break-words" {...props}>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{cleanText}</span>
                </li>
              );
            }

            return <li className="text-gray-700 pl-2 break-words" {...props}>{children}</li>;
          },
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-gray-100 text-red-700 px-1.5 py-0.5 rounded text-sm font-mono break-all max-w-full font-semibold"
                {...props}
              />
            ) : (
              <code className="block text-gray-100" {...props} />
            ),
          pre: ({ node, ...props }) => <CodeBlock {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-3 md:pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic break-words"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 w-full">
              <table className="w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 bg-gray-100 px-2 md:px-4 py-2 text-left font-bold text-xs md:text-base whitespace-nowrap" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-2 md:px-4 py-2 text-xs md:text-base" {...props} />
          ),
          a: ({ node, href, ...props }) => {
            const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline break-all"
                {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
