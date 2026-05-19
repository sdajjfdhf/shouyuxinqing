import type { TabType } from '@/types';

export type PageNatureBannerKey = Exclude<TabType, 'home'>;

export type PageNatureTheme = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  animalEmoji: string;
};

/** 各 Tab 对应的自然治愈图 + 小动物（集中在首页横滑入口展示） */
export const PAGE_NATURE_THEMES: Record<PageNatureBannerKey, PageNatureTheme> = {
  forest: {
    imageSrc: '/assets/backgrounds/forest.svg',
    imageAlt: '阳光穿过森林小径，绿意与雾气交织',
    title: '心灵森林',
    subtitle: '与小鹿一起，走进深呼吸的绿荫',
    animalEmoji: '🦌',
  },
  chat: {
    imageSrc: '/assets/backgrounds/forest.svg',
      imageAlt: '蕨类与林间柔光，安静舒展的绿意',
    title: '安心对话',
    subtitle: '小兔在树下，听你慢慢说',
    animalEmoji: '🐰',
  },
  knowledge: {
    imageSrc: '/assets/backgrounds/hollow.svg',
    imageAlt: '书页与木桌，一盏暖灯与绿植',
    title: '森林小课堂',
    subtitle: '猫头鹰博士为你翻开温柔的一章',
    animalEmoji: '🦉',
  },
  profile: {
    imageSrc: '/assets/backgrounds/sakura.svg',
    imageAlt: '阳光下盛开的粉色花田',
    title: '我的小径',
    subtitle: '小熊陪你收藏成长与勇气',
    animalEmoji: '🐻',
  },
  diary: {
    imageSrc: '/assets/backgrounds/lake.svg',
    imageAlt: '远山与云海，宁静辽阔的天际',
    title: '情绪日记',
    subtitle: '小猫守着的树洞与星光笔记',
    animalEmoji: '🐱',
  },
};

/** 首页「一站一景」顺序：与底部导航森林 / 对话 / 学习 / 我的 一致，并含情绪日记 */
export const HOME_NAV_NATURE_DESTINATIONS: { tab: PageNatureBannerKey; navLabel: string }[] = [
  { tab: 'forest', navLabel: '森林' },
  { tab: 'chat', navLabel: '对话' },
  { tab: 'knowledge', navLabel: '学习' },
  { tab: 'profile', navLabel: '我的' },
  { tab: 'diary', navLabel: '情绪日记' },
];

/** 首页上半部：樱花、古树与树洞意象、治愈水林 */
export const HOME_NATURE_HERO = [
  {
    id: 'sakura',
    label: '樱花季',
    tagline: '风里都是温柔的花香',
    imageSrc: '/assets/backgrounds/sakura.svg',
    imageAlt: '盛开的粉色樱花枝条',
    animalEmoji: '🐇',
    span: 'full' as const,
    minHeight: 'h-40 sm:h-44',
  },
  {
    id: 'hollow',
    label: '悠久树洞',
    tagline: '年轮里藏着时间的答案',
    imageSrc: '/assets/backgrounds/hollow.svg',
    imageAlt: '粗壮古树与幽深林荫',
    animalEmoji: '🦉',
    span: 'half' as const,
    minHeight: 'h-32 sm:h-36',
  },
  {
    id: 'stream',
    label: '溪水苔绿',
    tagline: '让心事像水波慢慢散开',
    imageSrc: '/assets/backgrounds/lake.svg',
    imageAlt: '平静的湖水倒映远山与天空',
    animalEmoji: '🦊',
    span: 'half' as const,
    minHeight: 'h-32 sm:h-36',
  },
];
