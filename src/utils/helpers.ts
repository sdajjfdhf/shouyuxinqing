import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm', { locale: zhCN });
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 11) return '早上好';
  if (hour < 13) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export function getRandomResponse(_mood: string): string {
  const responses = [
    `我理解你的感受...能多说一点吗？🌿`,
    `这确实不容易，你想聊聊具体发生了什么吗？`,
    `我听到了，这种感觉一定很难受。抱抱你 🤗`,
    `你愿意试试深呼吸吗？有时候身体放松了，心情也会好一些。`,
    `谢谢你愿意和我分享这些，这需要勇气。`,
    `这种感觉是很正常的，很多人都会有类似的经历。`,
    `你想听听我的一些建议吗？或者只是需要有人倾听？`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
