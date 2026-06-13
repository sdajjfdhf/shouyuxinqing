import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { Search, Bookmark, BookmarkCheck, Heart, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { KnowledgeArticle } from '@/types';
import { searchArticlesByAI, SearchResult } from '@/lib/deepSeekService';
import { useStore } from '@store/useStore';

const categories = ['全部', '情绪管理', '焦虑缓解', '正念冥想', '人际关系', '自我成长'];

const articles: (KnowledgeArticle & { content: string })[] = [
  {
    id: '0',
    title: '如何应对"周日焦虑"？',
    excerpt: '5个实用技巧帮你缓解周末结束前的紧张感，让周一不再那么可怕...',
    category: '焦虑缓解',
    readTime: '5分钟',
    author: '小鹿露露',
    authorEmoji: '🦌',
    likes: 2100,
    imageGradient: 'from-green-400 via-pink-400 to-pink-500',
    content: `## 什么是周日焦虑？

周日焦虑，也被称为"周日晚间忧郁"，是一种在周末即将结束时出现的焦虑情绪。很多人都会在周日下午或晚上感到烦躁、不安，想到即将到来的工作或学习就感到压力重重。

### 周日焦虑的常见表现

1. **情绪低落**：感到莫名的悲伤或烦躁
2. **失眠**：周日晚上难以入睡
3. **注意力不集中**：无法享受周末的最后时光
4. **身体不适**：头痛、胃痛、疲劳等

### 5个应对技巧

#### 1. 提前规划周一

周日下午花10分钟列出周一的待办事项，可以帮助你感到更有条理，减少不确定性带来的焦虑。

#### 2. 保持规律的作息

不要在周末熬夜太多，保持规律的睡眠可以让你在周一感觉更精力充沛。

#### 3. 留出"过渡时间"

周日晚上不要安排太多活动，给自己一些时间从周末的放松状态慢慢过渡到工作状态。可以做一些轻松的事情，比如看一部电影、泡个澡或者读一本书。

#### 4. 关注当下

当焦虑来袭时，试试正念呼吸。把注意力带到你的呼吸上，感受吸气和呼气的感觉。这可以帮助你从对未来的担忧中回到当下。

#### 5. 设定一个"快乐仪式"

在周日晚上创造一个让你期待的仪式，比如做一顿美味的晚餐、听一首喜欢的歌或者写感恩日记。这可以让周日晚上变得更有意义。

### 记住

焦虑是正常的情绪反应，每个人都会经历。关键是学会如何应对它，而不是被它控制。明天又是新的一天，你已经准备好迎接它了！`,
  },
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
    content: `## 什么是认知行为疗法？

认知行为疗法（CBT）是一种非常有效的心理治疗方法。它的核心观点是：**我们的情绪和行为不是由事件本身引起的，而是由我们对事件的看法和解释引起的。**

### 情绪ABC模型

A - 触发事件（Activating event）
B - 信念/想法（Belief）
C - 情绪和行为结果（Consequence）

例如：
- **A**：朋友没回我消息
- **B**：他讨厌我了 / 他可能很忙
- **C**：感到焦虑、生气 / 感到理解、平静

### 常见的思维误区

1. **非黑即白思维**：事情只有好或坏两种极端
2. **过度概括**：一次失败就认为自己永远会失败
3. **个人化**：把所有不好的事情都归咎于自己
4. **情绪推理**：感觉是真的，所以事实就是如此

### 练习：情绪观察日记

每天花5分钟记录：
1. 发生了什么事？
2. 我当时的想法是什么？
3. 我感受到了什么情绪？
4. 这个想法是100%真实的吗？有没有其他可能性？

记住，情绪就像天气一样，会来也会走。学会观察它，而不是被它带走。`,
  },
  {
    id: '2',
    title: '蝴蝶拥抱：自我安抚技巧',
    excerpt: '一个简单的动作，帮助你在焦虑时快速平静下来。适合在任何场合练习...',
    category: '焦虑缓解',
    readTime: '音频',
    author: '小鹿露露',
    authorEmoji: '🦌',
    likes: 850,
    imageGradient: 'from-purple-400 to-pink-500',
    content: `## 什么是蝴蝶拥抱？

蝴蝶拥抱是一种来自墨西哥的创伤治疗技术，现在被广泛用于焦虑和压力管理。它通过有节奏的身体动作和呼吸来激活身体的放松反应。

### 如何做蝴蝶拥抱？

1. **准备姿势**：坐直或躺下，双手交叉放在胸前
2. **开始动作**：用右手轻轻拍打左肩，然后用左手拍打右肩
3. **节奏**：以大约每2秒一次的速度交替拍打
4. **呼吸**：配合深呼吸，吸气4秒，呼气6秒
5. **持续**：保持这个动作1-2分钟，直到感到平静

### 什么时候使用？

- 感到焦虑或恐慌时
- 睡前难以入睡时
- 工作压力大时
- 在公共场合感到紧张时

### 小贴士

蝴蝶拥抱的力量在于它的简单性。你可以随时随地进行，不需要任何工具。当你感到情绪波动时，试试这个方法，让自己像蝴蝶一样轻盈。`,
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
    content: `## 什么是正念饮食？

正念饮食是一种通过觉察来改变饮食习惯的方法。它帮助我们从无意识的暴饮暴食转变为有意识的、健康的饮食方式。

### 葡萄干练习

拿一颗葡萄干，按照以下步骤进行：

1. **观察**：仔细看这颗葡萄干，注意它的颜色、形状和纹理
2. **触摸**：感受它的质地，是光滑还是粗糙
3. **闻**：闻一闻它的香气
4. **放进口中**：感受它在口中的感觉，但先不要咀嚼
5. **咀嚼**：慢慢咀嚼，感受味道的变化
6. **吞咽**：感受它滑下喉咙的感觉

### 正念饮食的原则

1. **放慢速度**：花至少20分钟吃一顿饭
2. **专注**：吃饭时不看手机或电视
3. **觉察饥饿感**：区分身体饥饿和情绪饥饿
4. **感恩**：感谢食物带来的滋养

### 开始练习

今天吃饭时，选择第一口食物进行正念练习。感受食物的味道、口感和香气。慢慢吃，享受每一口。`,
  },
  {
    id: '4',
    title: '非暴力沟通：建立深度连接',
    excerpt: '学习如何表达自己的需求，同时倾听他人，建立健康的人际关系...',
    category: '人际关系',
    readTime: '8分钟',
    author: '小兔贝贝',
    authorEmoji: '🐰',
    likes: 980,
    imageGradient: 'from-rose-400 to-pink-500',
    content: `## 什么是非暴力沟通？

非暴力沟通（NVC）是一种沟通方式，它帮助我们在表达自己的同时，也能理解和尊重他人。

### NVC四步法

1. **观察**：客观描述发生的事情，不评判
2. **感受**：表达自己的感受
3. **需要**：说出背后的需求
4. **请求**：提出具体的请求

### 例子对比

**暴力沟通：** "你总是不回我消息，你根本不在乎我！"

**非暴力沟通：** "这一周我发了三条消息你都没回（观察），我感到有些担心（感受），因为我重视我们的关系（需要），你方便的时候可以回我一下吗？（请求）"

### 倾听的艺术

非暴力沟通也包括倾听他人。当别人说话时，试着：
- 放下自己的评判
- 体会对方的感受和需求
- 用自己的话复述确认理解

### 练习

今天尝试用NVC的方式表达一次你的感受，看看会发生什么变化。`,
  },
  {
    id: '5',
    title: '成长型思维：拥抱挑战',
    excerpt: '了解固定型思维和成长型思维的区别，培养面对挑战的勇气...',
    category: '自我成长',
    readTime: '6分钟',
    author: '狐狸老师',
    authorEmoji: '🦊',
    likes: 1100,
    imageGradient: 'from-orange-400 to-amber-500',
    content: `## 两种思维模式

斯坦福大学心理学家卡罗尔·德韦克提出了两种思维模式：

### 固定型思维
- 认为能力是天生的
- 害怕失败，因为失败意味着自己不够好
- 回避挑战，待在舒适区
- 遇到困难容易放弃

### 成长型思维
- 认为能力可以通过努力培养
- 把失败看作学习的机会
- 拥抱挑战，相信努力会带来进步
- 遇到困难坚持不懈

### 如何培养成长型思维

1. **注意你的语言**：把"我做不到"换成"我还没做到"
2. **庆祝努力**：表扬过程而非结果
3. **拥抱挑战**：主动寻找让自己成长的机会
4. **从反馈中学习**：把批评看作改进的建议

### 成长型思维的力量

当你相信能力可以成长时，你会更有动力去学习和尝试新事物。记住，每一次挑战都是成长的机会。`,
  },
  {
    id: '6',
    title: '身体扫描：深度放松练习',
    excerpt: '从头顶到脚尖，系统地放松身体的每一个部位...',
    category: '正念冥想',
    readTime: '10分钟',
    author: '熊猫大师',
    authorEmoji: '🐼',
    likes: 720,
    imageGradient: 'from-gray-300 to-gray-400',
    content: `## 什么是身体扫描？

身体扫描是一种冥想练习，通过系统地关注身体的各个部位，帮助我们觉察身体的感受并释放紧张。

### 如何进行身体扫描

找一个安静、舒适的地方躺下或坐下：

1. **开始**：深呼吸几次，让自己放松下来
2. **头顶**：把注意力带到头顶，感受头皮的感觉
3. **额头**：放松额头的肌肉
4. **眼睛**：轻轻闭上眼睛，放松眼部周围的肌肉
5. **面部**：放松脸颊、嘴巴和下巴
6. **颈部**：放松脖子上的肌肉
7. **肩膀**：有意识地放下肩膀，释放紧张
8. **手臂**：从肩膀到手臂，再到手掌和手指
9. **胸部**：感受呼吸时胸部的起伏
10. **腹部**：感受呼吸时腹部的起伏
11. **腿部**：从大腿到小腿，再到脚部
12. **结束**：深呼吸三次，慢慢睁开眼睛

### 小贴士

如果思绪飘走了，没关系，温柔地把注意力带回到身体上就好。身体扫描可以帮助你更好地了解自己的身体，释放累积的紧张。`,
  },
];

export function KnowledgePage() {
  const { selectedArticleId, setSelectedArticleId } = useStore();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[0] | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [aiResults, setAiResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useAI, setUseAI] = useState(false);

  // 当从首页跳转过来时，自动打开指定的文章
  useEffect(() => {
    if (selectedArticleId) {
      const article = articles.find(a => a.id === selectedArticleId);
      if (article) {
        setSelectedArticle(article);
      }
      setSelectedArticleId(null);
    }
  }, [selectedArticleId, setSelectedArticleId]);

  const filteredArticles = articles.filter(article => 
    (activeCategory === '全部' || article.category === activeCategory) &&
    (searchQuery === '' || article.title.includes(searchQuery) || article.excerpt.includes(searchQuery))
  );

  useEffect(() => {
    if (searchQuery.length > 2 && useAI) {
      handleAISearch();
    } else if (!useAI) {
      setAiResults([]);
    }
  }, [searchQuery, useAI]);

  const handleAISearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchArticlesByAI(searchQuery);
      setAiResults(results);
    } catch (error) {
      console.error('AI search failed:', error);
      setAiResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      handleAISearch();
    }
  };

  const handleToggleFavorite = (articleId: string) => {
    setFavorites(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleLike = (articleId: string) => {
    setLikes(prev => ({
      ...prev,
      [articleId]: (prev[articleId] || articles.find(a => a.id === articleId)?.likes || 0) + 1
    }));
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-lg font-bold text-forest-900 mb-3 mt-6">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-base font-semibold text-forest-800 mb-2 mt-4">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-forest-700 text-sm ml-4 mb-1 flex items-start gap-2">
          <span className="text-pink-400 mt-1">•</span>
          <span>{line.slice(2)}</span>
        </li>;
      }
      if (line.trim()) {
        return <p key={index} className="text-forest-700 text-sm mb-3 leading-relaxed">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <AnimatePresence mode="wait">
        {selectedArticle ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <section className="px-6 pt-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-forest-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="font-bold text-forest-900">{selectedArticle.title}</h1>
                  <p className="text-xs text-forest-600">{selectedArticle.category} · {selectedArticle.readTime}</p>
                </div>
              </div>
            </section>

            <section className="px-6">
              <GlassCard className="overflow-hidden">
                <div className={`h-36 bg-gradient-to-br ${selectedArticle.imageGradient} relative flex items-center justify-center`}>
                  <motion.span 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-7xl"
                  >
                    {selectedArticle.category === '情绪管理' && '🌊'}
                    {selectedArticle.category === '焦虑缓解' && '🦋'}
                    {selectedArticle.category === '正念冥想' && '🌿'}
                    {selectedArticle.category === '人际关系' && '💝'}
                    {selectedArticle.category === '自我成长' && '🌟'}
                  </motion.span>
                </div>
                <div className="p-6">
                  {renderMarkdownContent(selectedArticle.content)}
                  <div className="flex items-center gap-4 pt-4 border-t border-forest-100">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm">
                        {selectedArticle.authorEmoji}
                      </span>
                      <span className="text-sm text-forest-700">{selectedArticle.author}</span>
                    </div>
                    <div className="flex-1" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(selectedArticle.id)}
                      className="flex items-center gap-1 text-pink-500"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="text-sm">{(likes[selectedArticle.id] || selectedArticle.likes).toLocaleString()}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFavorite(selectedArticle.id)}
                      className={`flex items-center gap-1 ${favorites.includes(selectedArticle.id) ? 'text-amber-500' : 'text-forest-400'}`}
                    >
                      {favorites.includes(selectedArticle.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      <span className="text-sm">收藏</span>
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <section className="px-6 pt-6">
              <h1 className="mb-1 text-2xl font-bold text-forest-900">森林小课堂</h1>
              <p className="mb-3 text-sm text-forest-700">用温暖的方式理解心理学</p>
              <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm">
                <Search className="w-5 h-5 text-forest-600" />
                <input
                  type="text"
                  placeholder="搜索心理学知识..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-transparent border-0 outline-none text-sm flex-1 text-forest-900 placeholder-forest-600/50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setUseAI(!useAI)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${useAI
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white/60 text-forest-600 hover:bg-blossom-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI搜索
                </motion.button>
              </div>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center justify-center gap-2 text-forest-600 text-sm"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  正在用AI搜索相关文章...
                </motion.div>
              )}
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

            {aiResults.length > 0 && useAI && (
              <section className="px-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-forest-700">AI为你推荐相关文章</span>
                </div>
                <div className="space-y-4">
                  {aiResults.map((article, index) => (
                    <motion.div
                      key={`ai-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard hover onClick={() => {
                        setSelectedArticle({
                          ...article,
                          id: `ai-${index}`,
                          author: 'AI助手',
                          authorEmoji: '🤖',
                          likes: 0,
                          imageGradient: 'from-purple-400 to-indigo-500',
                        } as (typeof articles)[0]);
                      }} className="overflow-hidden cursor-pointer border border-purple-200">
                        <div className="h-32 bg-gradient-to-br from-purple-400 to-indigo-500 relative flex items-center justify-center">
                          <motion.span 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl"
                          >
                            {article.category === '情绪管理' && '🌊'}
                            {article.category === '焦虑缓解' && '🦋'}
                            {article.category === '正念冥想' && '🌿'}
                            {article.category === '人际关系' && '💝'}
                            {article.category === '自我成长' && '🌟'}
                            {!['情绪管理', '焦虑缓解', '正念冥想', '人际关系', '自我成长'].includes(article.category) && '✨'}
                          </motion.span>
                          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium">
                            {article.readTime}
                          </div>
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-400 to-pink-400 px-2 py-1 rounded-lg text-xs text-white font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-forest-900 text-lg mb-2">{article.title}</h3>
                          <p className="text-forest-700 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">
                                🤖
                              </span>
                              <span className="text-xs text-forest-600">AI助手</span>
                            </div>
                            <span className="text-xs text-purple-500 font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI生成
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section className="px-6 space-y-4">
              {(searchQuery === '' || !useAI) && (
                <>                  
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard hover onClick={() => setSelectedArticle(article)} className="overflow-hidden cursor-pointer">
                        <div className={`h-32 bg-gradient-to-br ${article.imageGradient} relative flex items-center justify-center`}>
                          <motion.span 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl"
                          >
                            {article.category === '情绪管理' && '🌊'}
                            {article.category === '焦虑缓解' && '🦋'}
                            {article.category === '正念冥想' && '🌿'}
                            {article.category === '人际关系' && '💝'}
                            {article.category === '自我成长' && '🌟'}
                          </motion.span>
                          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium">
                            {article.readTime}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(article.id);
                            }}
                            className={`absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ${favorites.includes(article.id) ? 'text-amber-500' : 'text-white'}`}
                          >
                            {favorites.includes(article.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </motion.button>
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
                              {(likes[article.id] || article.likes).toLocaleString()} 人已学
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
