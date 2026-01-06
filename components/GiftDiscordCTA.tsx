'use client';

import Link from 'next/link';
import { MessageCircle, Users, Zap } from 'lucide-react';

export default function GiftDiscordCTA() {
  return (
    <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
      {/* Discord風グラデーション背景 */}
      <div className="bg-gradient-to-br from-[#5865F2] to-[#7289DA] p-8 md:p-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Discordアイコン */}
          <div className="mb-6">
            <svg
              className="w-12 h-12 mx-auto text-white/90"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>

          {/* タイトル */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            わからないことがあったら
          </h3>
          <p className="text-white/80 text-sm md:text-base mb-2">
            副業・転職・フリーランスの0→1は、わからないことだらけ。
            <br className="hidden md:block" />
            一人で悩まず、仲間と一緒に進みましょう。
          </p>
          <p className="text-white/60 text-xs mb-6">
            ※コミュニティ運営に特化したツール「Discord」を使用しています
          </p>

          {/* メリット */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-[#5865F2]" />
              <div className="text-gray-800 font-medium text-sm">いつでも質問OK</div>
              <div className="text-gray-500 text-xs mt-1">つまづいたらすぐ聞ける</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Users className="w-6 h-6 mx-auto mb-2 text-[#5865F2]" />
              <div className="text-gray-800 font-medium text-sm">仲間がいる安心感</div>
              <div className="text-gray-500 text-xs mt-1">同じ目標を持つ人と繋がる</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Zap className="w-6 h-6 mx-auto mb-2 text-[#5865F2]" />
              <div className="text-gray-800 font-medium text-sm">最新情報をキャッチアップ</div>
              <div className="text-gray-500 text-xs mt-1">AI・副業のトレンドを共有</div>
            </div>
          </div>

          {/* ボタン */}
          <Link
            href="https://discord.gg/xQM6NgmwPk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#5865F2] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discordに参加する（無料）
          </Link>
        </div>
      </div>
    </div>
  );
}
