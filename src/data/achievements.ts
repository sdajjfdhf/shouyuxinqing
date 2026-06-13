export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  stars: number;
  category: string;
  condition: (stats: AchievementStats) => boolean;
  unlockedAt?: string;
}

export interface AchievementStats {
  streakDays: number;
  totalDays: number;
  meditationMinutes: number;
  chatCount: number;
  moodRecordCount: number;
  totalStars: number;
  animalCount: number;
  diaryCount: number;
  sleepEarlyCount: number;
  wakeEarlyCount: number;
  courseCount: number;
  shareCount: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first_tree',
    icon: '🌱',
    title: '初入森林',
    description: '完成第一次冥想',
    stars: 50,
    category: '入门',
    condition: (stats) => stats.meditationMinutes >= 1,
  },
  {
    id: 'streak_7',
    icon: '🔥',
    title: '坚持者',
    description: '连续打卡7天',
    stars: 100,
    category: '连续',
    condition: (stats) => stats.streakDays >= 7,
  },
  {
    id: 'meditation_pro',
    icon: '🧘',
    title: '冥想大师',
    description: '累计冥想100分钟',
    stars: 250,
    category: '冥想',
    condition: (stats) => stats.meditationMinutes >= 100,
  },
  {
    id: 'emotion_master',
    icon: '😊',
    title: '心情使者',
    description: '记录心情10次',
    stars: 150,
    category: '心情',
    condition: (stats) => stats.moodRecordCount >= 10,
  },
  {
    id: 'forest_friend',
    icon: '🦉',
    title: '森林之友',
    description: '解锁所有动物伙伴',
    stars: 200,
    category: '探索',
    condition: (stats) => stats.animalCount >= 8,
  },
  {
    id: 'deep_meditation',
    icon: '💎',
    title: '深度冥想',
    description: '单次冥想超过30分钟',
    stars: 180,
    category: '冥想',
    condition: (stats) => stats.meditationMinutes >= 30,
  },
  {
    id: 'streak_30',
    icon: '👑',
    title: '月度冠军',
    description: '连续打卡30天',
    stars: 300,
    category: '连续',
    condition: (stats) => stats.streakDays >= 30,
  },
  {
    id: 'night_owl',
    icon: '🦉',
    title: '夜猫子',
    description: '在晚上11点前入睡',
    stars: 80,
    category: '睡眠',
    condition: (stats) => stats.sleepEarlyCount >= 7,
  },
  {
    id: 'early_bird',
    icon: '🐦',
    title: '早起鸟儿',
    description: '早上7点前起床',
    stars: 80,
    category: '习惯',
    condition: (stats) => stats.wakeEarlyCount >= 7,
  },
  {
    id: 'healing_expert',
    icon: '✨',
    title: '治愈专家',
    description: '完成所有疗愈课程',
    stars: 220,
    category: '课程',
    condition: (stats) => stats.courseCount >= 6,
  },
  {
    id: 'diary_master',
    icon: '🌳',
    title: '树洞知己',
    description: '写满10篇日记',
    stars: 120,
    category: '心情',
    condition: (stats) => stats.diaryCount >= 10,
  },
  {
    id: 'share_star',
    icon: '💬',
    title: '分享达人',
    description: '分享给3位朋友',
    stars: 100,
    category: '社交',
    condition: (stats) => stats.shareCount >= 3,
  },
];

export const categories = ['入门', '连续', '冥想', '心情', '探索', '睡眠', '习惯', '课程', '社交'];