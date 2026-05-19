import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { Search } from 'lucide-react';
import { KnowledgeArticle } from '@/types';

const categories = ['全部', '情绪管理', '焦虑缓解', '正念冥想', '人际关系', '自我成长'];

const articles: KnowledgeArticle[] = [
  {
    id: '1',
    title: '情绪就像天气：CBT基础',
    excerpt: '学习如何识别和改变负面思维模式，像观察天气一样观察自己的情绪...',
    category: '情绪管理',
    readTime: '5分钟',
    author: '猫头鹰博士',
    authorEmoji: '🦉',
    likes: 1200,
    imageGradient: 'from-blue-400 to-blue-600',
  },
  {
    id: '2',
    title: '蝴蝶拥抱：自我安抚技巧',
    excerpt: '一个简单的动作，帮助你在焦虑时快速平静下来。适合在公共场合 discreetly 练习...',
    category: '焦虑缓解',
    readTime: '音频',
    author: '小鹿露露',
    authorEmoji: '🦌',
    likes: 850,
    imageGradient: 'from-purple-400 to-pink-500',
  },
  {
    id: '3',
    title: '正念饮食：与食物重建连接',
    excerpt: '通过一颗葡萄干，学习如何全然地活在当下。改变你与饮食的关系...',
    category: '正念冥想',
    readTime: '互动',
    author: '熊师傅',
    authorEmoji: '🐻',
    likes: 530,
    imageGradient: 'from-green-400 to-teal-500',
  },
];

export function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => 
    (activeCategory === '全部' || article.category === activeCategory) &&
    (searchQuery === '' || article.title.includes(searchQuery) || article.excerpt.includes(searchQuery))
  );

  return (
    <div className="space-y-6 pb-24">
      <section className="px-6 pt-6">
        <h1 className="mb-1 text-2xl font-bold text-forest-900">森林小课堂</h1>
        <p className="mb-3 text-sm text-forest-700">用温暖的方式理解心理学</p>
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-forest-600" />
          <input
            type="text"
            placeholder="搜索心理学知识..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm flex-1 text-forest-900 placeholder-forest-600/50"
          />
        </div>
      </section>

      <section className="px-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-forest-500 to-blossom-500 text-white shadow-md'
                  : 'bg-white/60 text-forest-700 hover:bg-blossom-50'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="px-6 space-y-4">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="overflow-hidden">
              <div className={`h-32 bg-gradient-to-br ${article.imageGradient} relative flex items-center justify-center`}>
                <motion.span 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl"
                >
                  {article.category === '情绪管理' && '🌊'}
                  {article.category === '焦虑缓解' && '🦋'}
                  {article.category === '正念冥想' && '🌿'}
                </motion.span>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium">
                  {article.readTime}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-forest-900 text-lg mb-2">{article.title}</h3>
                <p className="text-forest-700 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs">
                      {article.authorEmoji}
                    </span>
                    <span className="text-xs text-forest-600">{article.author}</span>
                  </div>
                  <span className="text-xs text-forest-500 font-medium">
                    {article.likes.toLocaleString()} 人已学
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
