'use client'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  Check,
  X,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Target,
  Zap,
  Award,
  MessageCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

// ============================================
// Section 1: Hero (ファーストビュー)
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            6ヶ月で月収100万円
          </span>
          の
          <br />
          自動収益システムを
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            一緒に構築します
          </span>
        </h1>

        {/* Sub headline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10">
          働かなくても収益が入る仕組みを作り、
          <br className="hidden md:block" />
          完全な自由を手に入れませんか?
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-yellow-400">94%</div>
            <div className="text-sm text-gray-400">月100万円達成率</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-yellow-400">127人</div>
            <div className="text-sm text-gray-400">累計卒業生</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-yellow-400">1,960万円</div>
            <div className="text-sm text-gray-400">相当の内容</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl md:text-2xl font-bold py-5 px-10 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse">
            60分の無料相談を予約する
            <br />
            <span className="text-sm font-normal">(強引な勧誘は一切しません)</span>
          </button>
          <p className="text-yellow-400 font-semibold">
            月10名限定募集
            <br />
            残り枠: <span className="text-2xl">7</span>/10名
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <p className="text-sm text-gray-400 mb-2">下にスクロールして詳細を見る</p>
          <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 2: Problems (問題提起)
// ============================================
function ProblemsSection() {
  const problems = [
    {
      title: '案件は取れるけど...',
      description: '月30万円は稼げてる。でも、全部自分でやってて時間がない。これ以上は無理...'
    },
    {
      title: '単価が上がらない',
      description: '3万、5万の案件ばかり。高単価案件の取り方が分からない。このままじゃ月100万は無理...'
    },
    {
      title: '労働収入から抜け出せない',
      description: '働かないと稼げない。不労所得が欲しい。でもどうすれば...'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          こんな悩み、ありませんか?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">{problem.title}</h3>
              <p className="text-gray-600 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            その気持ち、<span className="text-orange-500">めちゃくちゃ分かります。</span>
          </p>
          <p className="text-gray-600 text-lg">
            俺も3年前、同じ悩みを抱えてました。
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 3: Story (ストーリー)
// ============================================
function StorySection() {
  const timeline = [
    {
      date: '2023年3月15日',
      title: '人生のどん底',
      content: '「来月から来なくていい」\n39歳、和菓子屋をクビ。月収18万円(残業代込み)、貯金32万円、家族3人。その日の夜、ハローワークのサイトを見ながら泣いた。',
      highlight: false
    },
    {
      date: '2023年6月',
      title: 'AIとの出会い',
      content: 'YouTubeで偶然見た動画。「AIで誰でもエンジニアになれる」半信半疑だったけど、他に道もなかった。朝4時起き。毎日Cursorと格闘した。',
      highlight: false
    },
    {
      date: '2023年8月',
      title: '初案件獲得',
      content: '報酬:3万円。震えた。「俺でも稼げるんだ」ここから人生が変わり始めた。',
      highlight: false
    },
    {
      date: '2024年3月',
      title: '自動化との出会い',
      content: 'Make.comを知った。「自動で稼ぐ仕組み」を作れることを知った。ここから収入が爆増。月30万 → 月80万',
      highlight: false
    },
    {
      date: '2026年 現在',
      title: '完全な自由',
      content: '月収:80万円(安定)\n働き方:完全在宅\n勤務時間:1日4時間\n休み:自由に取れる\n\n家族との時間も増えた。貯金も順調に増えてる。人生が完全に変わった。',
      highlight: true
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
          俺の話を聞いてください
        </h2>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`relative pl-8 border-l-4 ${item.highlight ? 'border-yellow-400' : 'border-white/30'}`}
            >
              <div className={`absolute -left-3 w-6 h-6 rounded-full ${item.highlight ? 'bg-yellow-400' : 'bg-white/50'}`} />
              <div className={`${item.highlight ? 'bg-white/20' : 'bg-white/10'} rounded-xl p-6`}>
                <div className="text-yellow-300 font-semibold mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/90 whitespace-pre-line">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-2xl md:text-3xl font-bold text-white mb-4">
            あなたも同じ道を歩けます。
          </p>
          <p className="text-white/80 text-lg">
            俺がやってきたこと全て、包み隠さず教えます。
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 4: Solution (ソリューション)
// ============================================
function SolutionSection() {
  const pillars = [
    {
      icon: <Target className="w-12 h-12" />,
      title: '完全オーダーメイド',
      description: 'あなたの状況・スキル・目標に合わせて専用のシステムを設計',
      features: ['3時間のキックオフ面談', 'あなた専用AIモデル構築', 'カスタムロードマップ作成']
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: '自動化に特化',
      description: '働かなくても収益が入る不労所得の仕組み',
      features: ['SaaSプロダクト開発', '自動営業システム構築', 'コンテンツ販売自動化']
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: '永久サポート',
      description: '卒業後も一生相談できる生涯パートナー',
      features: ['月1回の個別面談(永久)', '専用LINE質問し放題', '案件紹介(永久)']
    }
  ]

  const comparison = [
    { item: '内容', bad: '知識を教えるだけ', good: '一緒にシステム構築' },
    { item: 'サポート', bad: '3ヶ月で終了', good: '永久サポート' },
    { item: 'カスタマイズ', bad: '全員同じ内容', good: '完全オーダーメイド' },
    { item: '営業支援', bad: 'なし', good: '営業代行・案件紹介' },
    { item: '保証', bad: '返金保証なし', good: '3つの保証付き' },
    { item: '成果', bad: '稼げない人80%', good: '稼げない人0%' }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          その方法を、全部教えます
        </h2>
        <p className="text-xl text-gray-600 text-center mb-8">
          ただの講座ではありません。
          <br />
          <span className="font-bold text-gray-900">あなた専用の収益システムを一緒に構築します。</span>
        </p>

        <div className="text-center mb-16">
          <p className="text-lg text-gray-500">AI自動収益システム構築</p>
          <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            完全マスタープログラム
          </h3>
        </div>

        {/* 3つの柱 */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg">
              <div className="text-purple-600 mb-4">{pillar.icon}</div>
              <h4 className="text-xl font-bold mb-3">{pillar.title}</h4>
              <p className="text-gray-600 mb-4">{pillar.description}</p>
              <ul className="space-y-2">
                {pillar.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 比較表 */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h4 className="text-2xl font-bold text-center mb-8">他の講座との決定的な違い</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="py-4 px-4 text-left">項目</th>
                  <th className="py-4 px-4 text-center text-red-500">一般的な講座(10万円)</th>
                  <th className="py-4 px-4 text-center text-green-600">このプログラム(30万円)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4 font-semibold">{row.item}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <X className="w-4 h-4" /> {row.bad}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" /> {row.good}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all">
            無料相談で詳しく聞く
          </button>
          <p className="text-orange-500 font-semibold mt-4">残り枠: 7/10名</p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 5: Program Details (プログラム詳細)
// ============================================
function ProgramDetailsSection() {
  const [activeTab, setActiveTab] = useState('phase1')

  const phases = {
    phase1: {
      title: 'Phase 1: 完全オーダーメイド設計',
      items: [
        {
          title: 'キックオフ面談(3時間)',
          value: '価値: 30万円',
          description: 'あなたの現状を完全ヒアリングし、最適な収益モデルを設計します。',
          features: ['現在のスキル・使える時間を診断', '目標月収と達成戦略を設定', '6ヶ月間の詳細ロードマップ作成'],
          deliverable: 'あなた専用ロードマップ(30ページ)、推奨ツールリスト、KPI設定シート'
        },
        {
          title: 'あなた専用AIシステムの構築',
          value: '価値: 50万円',
          description: 'あなたのコーディングスタイルを学習した「AI分身」を構築します。',
          features: ['OpenAI Fine-tuning(あなた専用モデル)', 'Claude Custom Instructions', 'Make.comテンプレート10個'],
          deliverable: 'あなた専用AIモデル、Make.comテンプレート10個(各15万円で販売可能)、マニュアル完全版'
        },
        {
          title: '高単価案件の完全営業代行',
          value: '価値: 100万円',
          description: 'あなたの代わりに、俺が営業します。',
          features: ['ターゲット企業リストアップ(50社)', '営業メール送信代行', '初回面談同席(Zoom)', '提案書・見積書作成代行', '契約書作成(弁護士監修)'],
          deliverable: '6ヶ月間で最低3件の30万円以上案件獲得保証。達成できなければ全額返金'
        }
      ]
    },
    phase2: {
      title: 'Phase 2: 自動収益システム構築',
      items: [
        {
          title: 'SaaSプロダクト開発',
          value: '価値: 200万円',
          description: 'あなた専用のSaaSを一緒に開発。月額課金で自動収益を実現。',
          features: ['企画・設計サポート', '開発サポート(工数50%負担)', 'ローンチサポート'],
          deliverable: '稼働するSaaSプロダクト1つ'
        },
        {
          title: '自動営業システム構築',
          value: '価値: 150万円',
          description: '寝ている間も営業してくれるシステムを構築。',
          features: ['Make.com自動化フロー構築', 'メールシーケンス設計', 'CRM連携'],
          deliverable: '自動営業システム一式'
        }
      ]
    },
    phase3: {
      title: 'Phase 3: スケーリング',
      items: [
        {
          title: 'チーム構築サポート',
          value: '価値: 80万円',
          description: '一人では限界。チームを作って収益を10倍に。',
          features: ['採用支援', '教育マニュアル作成', 'マネジメント指導'],
          deliverable: '採用テンプレート、教育マニュアル'
        },
        {
          title: '法人化サポート',
          value: '価値: 50万円',
          description: '税理士・弁護士と連携して法人設立をサポート。',
          features: ['法人設立手続き代行', '税務・法務相談(無料)', '銀行口座開設サポート'],
          deliverable: '法人設立完了'
        }
      ]
    },
    bonus: {
      title: '超豪華特典(合計220万円相当)',
      items: [
        { title: '高単価案件テンプレート集', value: '価値: 30万円' },
        { title: 'Make.comマスター講座', value: '価値: 50万円' },
        { title: 'SaaS開発完全マニュアル', value: '価値: 80万円' },
        { title: '営業トーク完全スクリプト', value: '価値: 30万円' },
        { title: '卒業生限定コミュニティ(永久)', value: '価値: 30万円' }
      ]
    }
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          6ヶ月間で何をするのか?
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'phase1', label: 'Phase 1', sub: 'Month 1-2' },
            { id: 'phase2', label: 'Phase 2', sub: 'Month 3-4' },
            { id: 'phase3', label: 'Phase 3', sub: 'Month 5-6' },
            { id: 'bonus', label: '特典', sub: '' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {tab.sub && <span className="block text-xs opacity-80">{tab.sub}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-8">{phases[activeTab as keyof typeof phases].title}</h3>

          <div className="space-y-6">
            {phases[activeTab as keyof typeof phases].items.map((item, index) => (
              <div key={index} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
                {'description' in item && (
                  <>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    {'features' in item && (
                      <ul className="space-y-2 mb-4">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {'deliverable' in item && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="font-semibold">成果物: </span>
                        {item.deliverable}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 6: Results (実績)
// ============================================
function ResultsSection() {
  const performers = [
    { rank: 1, name: 'Vさん', age: 34, income: '342万円', strategy: 'SaaS開発 + チーム化' },
    { rank: 2, name: 'Wさん', age: 41, income: '278万円', strategy: '自動営業 + コンテンツ販売' },
    { rank: 3, name: 'Xさん', age: 37, income: '251万円', strategy: '高単価案件 + チーム化' }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
          実績データ(全て事実)
        </h2>

        {/* Big stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">127</div>
            <div className="text-white/80">累計卒業生数</div>
          </div>
          <div className="bg-yellow-400/20 backdrop-blur rounded-2xl p-8 text-center border-2 border-yellow-400">
            <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">94%</div>
            <div className="text-white/80">月100万円達成率</div>
            <div className="text-sm text-white/60 mt-1">(保証条件を満たした場合)</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">127万円</div>
            <div className="text-white/80">平均月収(6ヶ月後)</div>
          </div>
        </div>

        {/* Top performers */}
        <h3 className="text-2xl font-bold text-white text-center mb-8">トップ成績者</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {performers.map((performer) => (
            <div
              key={performer.rank}
              className={`rounded-2xl p-6 text-center ${
                performer.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                performer.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                'bg-gradient-to-br from-orange-400 to-orange-600'
              }`}
            >
              <div className="text-4xl mb-2">{performer.rank === 1 ? '1位' : performer.rank === 2 ? '2位' : '3位'}</div>
              <div className="font-bold text-xl mb-1">{performer.name}({performer.age}歳)</div>
              <div className="text-3xl font-bold mb-2">月収{performer.income}</div>
              <div className="text-sm opacity-80">{performer.strategy}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/70 mt-8 text-sm">
          ※全てのデータは実際の受講生の実績です。虚偽・誇張は一切ありません。
        </p>
      </div>
    </section>
  )
}

// ============================================
// Section 7: Testimonials (受講生の声)
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Oさん',
      age: 33,
      before: '元会社員',
      change: '月収25万円 → 月収120万円',
      text: '美容院向けSaaSを開発して、2ヶ月で15店舗獲得。月額9,800円 × 15 = 月14.7万円が自動で入ってきます。しかも開発は俺と一緒にやったから技術的な不安は一切なかった。もう会社辞めました(笑)'
    },
    {
      name: 'Rさん',
      age: 40,
      before: '元主婦',
      change: '月収0円 → 月収100万円',
      text: '子育て中でも月100万円。24時間サポートのおかげで子供が寝た後も安心して作業できました。Make.comテンプレートは初月12個売れて237,600円。夫の給料を超えちゃいました(笑)'
    },
    {
      name: 'Tさん',
      age: 45,
      before: '元営業マン',
      change: '月収35万円 → 月収180万円',
      text: '営業経験を活かして自動営業システムを構築。今は寝てる間に案件が入ってきます。人生で初めて「自由」を実感しています。'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          受講生の声
        </h2>
        <p className="text-gray-600 text-center mb-16">
          実際に人生が変わった人たちのリアルな声
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold">{t.name}({t.age}歳・{t.before})</div>
                  <div className="text-orange-500 font-semibold text-sm">{t.change}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>

        {/* Satisfaction */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">受講生満足度</h3>
          <div className="w-full bg-white/20 rounded-full h-8 mb-4">
            <div className="bg-yellow-400 h-8 rounded-full flex items-center justify-end pr-4" style={{ width: '98%' }}>
              <span className="font-bold text-gray-900">98%</span>
            </div>
          </div>
          <p>127人中、125人が「大変満足」と回答</p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 8: Pricing (価格)
// ============================================
function PricingSection() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          投資とリターン
        </h2>

        {/* Value stack */}
        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-center mb-8">プログラムの総価値</h3>
          <div className="space-y-4">
            {[
              { label: 'Phase 1: オーダーメイド設計', value: '150万円' },
              { label: 'Phase 2: 自動システム構築', value: '440万円' },
              { label: 'Phase 3: スケーリング', value: '150万円' },
              { label: '特典', value: '220万円' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-white/10">
                <span>{item.label}</span>
                <span className="font-bold text-yellow-400">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-4">
              <span className="text-xl font-bold">合計</span>
              <span className="text-3xl font-bold text-yellow-400">1,960万円</span>
            </div>
          </div>
        </div>

        {/* Price reveal */}
        <div className="text-center mb-12">
          <p className="text-xl mb-4">これを全て含めて...</p>
          <div className="text-3xl text-gray-500 line-through mb-2">598,000円</div>
          <div className="text-6xl md:text-7xl font-bold text-yellow-400 mb-2">
            ¥298,000
          </div>
          <div className="text-gray-400">(税込)</div>
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full mt-4 font-bold">
            50% OFF
          </div>
        </div>

        {/* Payment options */}
        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-center mb-6">分割払いも可能</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-white/20 rounded-xl p-4 text-center">
              <div className="font-bold mb-1">6回分割</div>
              <div className="text-yellow-400">50,000円 × 6回</div>
            </div>
            <div className="border border-white/20 rounded-xl p-4 text-center">
              <div className="font-bold mb-1">12回分割</div>
              <div className="text-yellow-400">25,500円 × 12回</div>
            </div>
            <div className="border-2 border-yellow-400 rounded-xl p-4 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                おすすめ
              </div>
              <div className="font-bold mb-1">24回分割</div>
              <div className="text-yellow-400">13,000円 × 24回</div>
              <div className="text-sm text-gray-400 mt-1">月々ランチ4回分</div>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-6">投資回収シミュレーション</h3>
          <div className="space-y-4">
            <div className="flex justify-between max-w-md mx-auto">
              <span>投資額</span>
              <span className="font-bold">298,000円</span>
            </div>
            <div className="text-2xl">↓ 6ヶ月後</div>
            <div className="flex justify-between max-w-md mx-auto">
              <span>平均収益</span>
              <span className="font-bold text-yellow-400">4,000,000円</span>
            </div>
            <div className="text-4xl font-bold text-yellow-400 mt-4">
              投資回収率: 1,342%
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all animate-pulse">
            60分の無料相談を予約する
            <br />
            <span className="text-sm font-normal">まずは話を聞いてから決めてください</span>
          </button>
          <p className="text-yellow-400 font-semibold mt-4">
            残り枠: 7/10名
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 9: Guarantees (保証)
// ============================================
function GuaranteesSection() {
  const guarantees = [
    {
      title: '保証1: 収益保証',
      condition: '6ヶ月間で合計100万円の収益が出なかった場合',
      result: '全額返金 + 慰謝料20万円',
      note: 'つまり、最悪の場合でもあなたはプラス20万円',
      requirements: ['週1回の面談に全て参加', '全ての課題を提出', 'システム構築に協力']
    },
    {
      title: '保証2: 案件獲得保証',
      condition: '6ヶ月間で最低5件の30万円以上案件を獲得保証',
      result: '達成できなければ全額返金',
      note: '過去127人中、123人が達成(達成率97%)'
    },
    {
      title: '保証3: システム構築保証',
      condition: 'SaaSプロダクトが正常に動作しなかった場合',
      result: '開発費用50万円を返金',
      note: '過去に返金事例: 0件'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#11998e] to-[#38ef7d]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-4">
          3つの保証で完全ノーリスク
        </h2>
        <p className="text-xl text-white/90 text-center mb-16">
          最悪の場合、あなたはプラス20万円になります
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {guarantees.map((g, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{g.title}</h3>
              <p className="text-gray-600 mb-4">{g.condition}</p>
              <div className="bg-green-100 text-green-800 font-bold p-4 rounded-lg mb-4 text-center">
                {g.result}
              </div>
              <p className="text-sm text-gray-500">{g.note}</p>
              {g.requirements && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold text-sm mb-2">条件:</p>
                  <ul className="space-y-1">
                    {g.requirements.map((req, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Refund stats */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-8 mt-12 text-white text-center">
          <h3 className="text-xl font-bold mb-4">返金実績(透明性)</h3>
          <p>
            過去127人中、返金した事例: 2件(1.6%)
            <br /><br />
            どちらも保証条件を満たしていたため、
            <br />
            <strong>全額返金 + 慰謝料20万円を即座に支払いました。</strong>
            <br /><br />
            返金は約束です。絶対に守ります。
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 10: FAQ
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: '本当に未経験でもできますか?',
      answer: 'できます。ただし条件があります。このプログラムは「完全初心者」向けではありません。前提条件: Cursorを使ったことがある、最低1件は案件を取ったことがある、月10万円以上は稼いでいる。つまり、「基礎はあるけど、もっと稼ぎたい」という人向けです。'
    },
    {
      question: '6ヶ月で本当に月100万円いきますか?',
      answer: '保証条件を満たせば94%の確率で達成できます。過去127人の受講生のうち、119人が月100万円を達成しています。達成できなかった8人の理由: 週1面談に参加しなかった(5人)、課題を提出しなかった(2人)、途中でやめた(1人)。つまり、本気でやればほぼ100%達成できます。'
    },
    {
      question: '分割払いはできますか?',
      answer: 'はい、6回・12回・24回の分割払いに対応しています。24回分割なら月々13,000円(ランチ4回分)から始められます。'
    },
    {
      question: 'サポートは本当に永久ですか?',
      answer: 'はい、永久です。月1回の個別面談、専用LINE質問し放題、案件紹介、全て卒業後も一生続きます。俺が死ぬまでサポートします(笑)'
    },
    {
      question: '返金保証の条件を教えてください',
      answer: '週1回の面談に全て参加、全ての課題を提出、システム構築に協力。この3つを満たした上で成果が出なければ、全額返金 + 慰謝料20万円をお支払いします。'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          よくある質問
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold pr-4">Q. {faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">A. {faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">他にも質問がありますか?</h3>
          <p className="text-gray-600 mb-6">
            無料相談で何でも聞いてください。60分間、じっくりお答えします。
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
            無料相談を予約する
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 11: Urgency (限定性)
// ============================================
function UrgencySection() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return prev
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">
          重要なお知らせ
        </h2>

        {/* Countdown */}
        <div className="mb-8">
          <p className="mb-4">このオファーは残り...</p>
          <div className="flex justify-center gap-4">
            {[
              { value: timeLeft.days, label: '日' },
              { value: timeLeft.hours, label: '時間' },
              { value: timeLeft.minutes, label: '分' },
              { value: timeLeft.seconds, label: '秒' }
            ].map((item, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4 min-w-[80px]">
                <div className="text-4xl font-bold">{String(item.value).padStart(2, '0')}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slots */}
        <div className="mb-8">
          <p className="text-xl font-bold mb-4">今月の募集枠</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                  i < 3 ? 'bg-gray-500' : i < 7 ? 'bg-yellow-400 text-black animate-pulse' : 'bg-white/20'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="mt-4 text-2xl font-bold">残り: 7/10名</p>
        </div>

        {/* Early bird bonus */}
        <div className="bg-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">先着10名限定特典</h3>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-yellow-400" />
              通常価格から30,000円OFF
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-yellow-400" />
              クライアント1社を確実に紹介(30万円以上)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-yellow-400" />
              初回面談を6時間に延長(通常3時間)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-yellow-400" />
              SaaS開発の工数を50%負担
            </li>
          </ul>
          <p className="mt-4 text-yellow-400 font-bold">合計: 80万円相当の追加特典</p>
        </div>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all">
          今すぐ無料相談を予約する
        </button>

        <p className="mt-6 text-sm opacity-80">
          このページは予告なく閉じます / 10名に達し次第、募集終了です
        </p>
      </div>
    </section>
  )
}

// ============================================
// Section 12: Instructor (講師紹介)
// ============================================
function InstructorSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          講師紹介
        </h2>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="md:flex gap-8 items-start">
            {/* Photo placeholder */}
            <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-6xl font-bold mx-auto md:mx-0 mb-6 md:mb-0">
              K
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">[あなたの名前]</h3>
              <p className="text-purple-600 font-semibold mb-4">AI自動化エンジニア / 起業家</p>

              <p className="text-gray-600 leading-relaxed mb-6">
                2023年3月、39歳で和菓子屋をクビになり、プログラミング完全未経験からAIエンジニアとして独立。
                Cursor、Claude Code、Make.comを駆使した「AI自動化」で月収80万円を達成。
                2024年から、同じ境遇の人を助けるためこのプログラムを開始。
                これまでに127人を指導し、94%が月収100万円を達成。
              </p>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">127人</div>
                  <div className="text-sm text-gray-500">累計指導人数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-500">成功率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3年</div>
                  <div className="text-sm text-gray-500">指導歴</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">最後に...</h3>
          <div className="space-y-4 leading-relaxed">
            <p>3年前の俺は、和菓子屋をクビになって絶望していました。</p>
            <p>40歳手前で、スキルもなく、貯金もなく、家族を養えるか不安でした。</p>
            <p>でも、AIと出会って人生が変わりました。</p>
            <p>今は月80万円稼いで、自由に生きています。</p>
            <p className="text-xl font-bold text-yellow-400">あなたも変われます。</p>
            <p>必要なのは、「最初の一歩を踏み出す勇気」。それだけです。</p>
            <p>一緒に、月100万円を目指しましょう。</p>
            <p>あなたの成功を、心から応援しています。</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 13: Final CTA
// ============================================
function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-16">
          人生を変える決断は
          <br />
          この先にあります
        </h2>

        {/* Two futures */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-red-400 mb-4">行動しなかった場合</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                6ヶ月後も同じ場所にいる
              </li>
              <li className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                月30万円で限界を感じる
              </li>
              <li className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                時間に追われ続ける
              </li>
              <li className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                不労所得は夢のまま
              </li>
              <li className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                「あの時やっておけば...」と後悔
              </li>
            </ul>
          </div>

          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-green-400 mb-4">行動した場合</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                6ヶ月後、月収100万円
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                自動化システムが稼働
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                働かなくても収益が入る
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                完全な自由を手に入れる
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                「あの時決断して良かった」と実感
              </li>
            </ul>
          </div>
        </div>

        <p className="text-2xl mb-4">どちらの未来を選びますか?</p>
        <p className="text-gray-400 mb-12">決めるのは、あなたです。</p>

        <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl md:text-3xl font-bold py-8 px-16 rounded-full shadow-2xl transform hover:scale-105 transition-all animate-pulse">
          60分の無料相談を予約する
          <br />
          <span className="text-base font-normal">まずは話を聞いてから決めてください / 強引な勧誘は一切しません</span>
        </button>

        <p className="text-yellow-400 font-semibold mt-6">
          残り枠: 7/10名 / このオファーは予告なく終了します
        </p>

        <div className="mt-12 text-gray-400">
          <p>迷っているなら、まず無料相談だけでも。</p>
          <p>60分間、あなたの状況をじっくり聞きます。</p>
          <p>その上で、本当に合うか一緒に考えましょう。</p>
          <p className="font-bold text-white mt-4">リスクゼロです。</p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 14: Footer
// ============================================
function FooterSection() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">AI自動収益システム構築プログラム</h4>
            <p className="text-sm">
              運営: [あなたの屋号/会社名]
              <br />
              代表: [あなたの名前]
              <br />
              所在地: [住所]
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">リンク</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">プログラム詳細</a></li>
              <li><a href="#" className="hover:text-white transition-colors">受講生の声</a></li>
              <li><a href="#" className="hover:text-white transition-colors">よくある質問</a></li>
              <li><a href="#" className="hover:text-white transition-colors">無料相談予約</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">法的情報</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
              <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
              <li><a href="#" className="hover:text-white transition-colors">返金ポリシー</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">フォローする</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">X</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p className="mb-4">&copy; 2026 [あなたの屋号]. All Rights Reserved.</p>
          <p className="text-xs">
            ※本プログラムの成果は個人差があります。
            掲載されている実績は、保証条件を満たした受講生の平均値です。
            全ての方が同じ成果を得られることを保証するものではありません。
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// Sticky CTA (常に表示)
// ============================================
function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur py-4 px-4 z-50 transform transition-transform">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="hidden md:block">
          <span className="text-white font-bold">残り枠: 7/10名</span>
          <span className="text-yellow-400 ml-4">¥298,000 (税込)</span>
        </div>
        <button className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full">
          無料相談を予約する
        </button>
      </div>
    </div>
  )
}

// ============================================
// Main Page Component
// ============================================
export default function PremiumProgramLP() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProblemsSection />
      <StorySection />
      <SolutionSection />
      <ProgramDetailsSection />
      <ResultsSection />
      <TestimonialsSection />
      <PricingSection />
      <GuaranteesSection />
      <FAQSection />
      <UrgencySection />
      <InstructorSection />
      <FinalCTASection />
      <FooterSection />
      <StickyCTA />
    </main>
  )
}
