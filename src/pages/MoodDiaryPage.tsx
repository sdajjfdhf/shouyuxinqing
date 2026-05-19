import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, eachDayOfInterval, subDays, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft, Lock, Sparkles, Trees, Heart } from 'lucide-react';
import { GlassCard } from '@components/GlassCard';
import { MoodSelector } from '@components/MoodSelector';
import { useStore } from '@store/useStore';
import type { EmotionTag, MoodType } from '@/types';
import { cn } from '@utils/helpers';
import {
  loadTreeHole,
  addTreeHole,
  loadFragments,
  addFragment,
  hasDiaryVault,
  loadDiaryEncrypted,
  saveDiaryEncrypted,
  type DiaryEntry,
  type TreeHolePost,
  type FragmentPost,
} from '@/lib/localJournal';

const TAG_OPTIONS: { id: EmotionTag; label: string }[] = [
  { id: 'anxious', label: '焦虑' },
  { id: 'tired', label: '疲惫' },
  { id: 'low', label: '低落' },
  { id: 'irritable', label: '烦躁' },
];

const TAG_LABEL: Record<EmotionTag, string> = {
  anxious: '焦虑',
  tired: '疲惫',
  low: '低落',
  irritable: '烦躁',
};

const MOOD_SCORE: Record<MoodType, number> = {
  sad: 1.2,
  anxious: 2,
  tired: 2.4,
  calm: 4,
  happy: 4.6,
  excited: 5,
};

function moodScore(m: MoodType): number {
  return MOOD_SCORE[m] ?? 3;
}

function MoodCurve({ history }: { history: { date: string; mood: MoodType }[] }) {
  const end = new Date();
  const start = subDays(end, 13);
  const days = eachDayOfInterval({ start, end });
  const byDate = new Map(history.map((e) => [e.date, e.mood]));
  const points = days.map((d, i) => ({
    i,
    label: format(d, 'M/d', { locale: zhCN }),
    score: byDate.has(format(d, 'yyyy-MM-dd'))
      ? moodScore(byDate.get(format(d, 'yyyy-MM-dd'))!)
      : null,
  }));

  const W = 300;
  const H = 88;
  const padX = 8;
  const padY = 10;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const coords = points.map((p) => {
    const x = padX + (p.i / Math.max(1, points.length - 1)) * innerW;
    const y =
      p.score === null
        ? null
        : padY + innerH - (p.score / 5) * innerH;
    return { ...p, x, y };
  });

  let dPath = '';
  let penUp = true;
  for (const c of coords) {
    if (c.y === null) {
      penUp = true;
      continue;
    }
    dPath += penUp ? `M ${c.x} ${c.y}` : ` L ${c.x} ${c.y}`;
    penUp = false;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        className="w-full max-h-32"
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={W - padX}
            y1={padY + t * innerH}
            y2={padY + t * innerH}
            stroke="rgba(6,78,59,0.08)"
            strokeWidth="1"
          />
        ))}
        {dPath && (
          <path
            d={dPath}
            fill="none"
            stroke="rgb(5 150 105)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {coords.map(
          (c) =>
            c.y !== null && (
              <circle key={c.i} cx={c.x} cy={c.y} r={3.2} fill="white" stroke="rgb(5 150 105)" strokeWidth="2" />
            )
        )}
        <text x={padX} y={H + 14} className="fill-forest-600 text-[9px]" fontSize="9">
          {points[0]?.label} — {points[points.length - 1]?.label}
        </text>
      </svg>
    </div>
  );
}

function WeeklyReport({ history }: { history: { date: string; mood: MoodType; tags?: EmotionTag[] }[] }) {
  const { weekDates, prevDates } = useMemo(() => {
    const end = new Date();
    const thisStart = subDays(end, 6);
    const w = eachDayOfInterval({ start: thisStart, end }).map((d) => format(d, 'yyyy-MM-dd'));
    const prevEnd = subDays(thisStart, 1);
    const prevStart = subDays(prevEnd, 6);
    const p = eachDayOfInterval({ start: prevStart, end: prevEnd }).map((d) =>
      format(d, 'yyyy-MM-dd')
    );
    return { weekDates: w, prevDates: p };
  }, []);

  const weekRecords = history.filter((e) => weekDates.includes(e.date));
  const avg =
    weekRecords.length > 0
      ? weekRecords.reduce((s, e) => s + moodScore(e.mood), 0) / weekRecords.length
      : null;

  const tagCounts: Record<EmotionTag, number> = {
    anxious: 0,
    tired: 0,
    low: 0,
    irritable: 0,
  };
  weekRecords.forEach((e) => e.tags?.forEach((t) => tagCounts[t]++));

  const topTags = (Object.entries(tagCounts) as [EmotionTag, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const prevRecords = history.filter((e) => prevDates.includes(e.date));
  const prevAvg =
    prevRecords.length > 0
      ? prevRecords.reduce((s, e) => s + moodScore(e.mood), 0) / prevRecords.length
      : null;

  let trend = '本周数据不足，多打几次卡会更准哦。';
  if (avg !== null && prevAvg !== null) {
    const diff = avg - prevAvg;
    if (diff > 0.35) trend = '和上周相比，整体心情有回升，给自己一点掌声。';
    else if (diff < -0.35) trend = '这周似乎更吃力一些，试试树洞或呼吸练习，慢慢就好。';
    else trend = '和上周差不多平稳，保持觉察已经很棒。';
  } else if (avg !== null) {
    trend = '本周心情指数已记录，坚持打卡会看到更多规律。';
  }

  return (
    <div className="space-y-3 text-sm text-forest-800">
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
          打卡 {weekRecords.length} 天
        </span>
        {avg !== null && (
          <span className="px-3 py-1 rounded-full bg-white/80 text-forest-700 font-medium">
            平均心情分 {avg.toFixed(1)} / 5
          </span>
        )}
      </div>
      <p className="text-forest-700 leading-relaxed">{trend}</p>
      {topTags.length > 0 && (
        <div>
          <p className="text-xs text-forest-600 mb-1">常见情绪标签</p>
          <div className="flex flex-wrap gap-1.5">
            {topTags.map(([t, n]) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-lg bg-amber-100/80 text-amber-900">
                {TAG_LABEL[t]} × {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MoodDiaryPage() {
  const {
    todayMood,
    setTodayMood,
    emotionHistory,
    refreshEmotionHistory,
    setCurrentTab,
  } = useStore();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = emotionHistory.find((e) => e.date === todayStr);

  const [tags, setTags] = useState<EmotionTag[]>(todayRecord?.tags ?? []);
  const [memo, setMemo] = useState(todayRecord?.memo ?? '');
  const [savedHint, setSavedHint] = useState('');

  const [ventTab, setVentTab] = useState<'hole' | 'fragment' | 'diary'>('hole');
  const [treePosts, setTreePosts] = useState<TreeHolePost[]>(() => loadTreeHole());
  const [fragPosts, setFragPosts] = useState<FragmentPost[]>(() => loadFragments());
  const [treeInput, setTreeInput] = useState('');
  const [fragInput, setFragInput] = useState('');

  const [diaryPassword, setDiaryPassword] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[] | null>(null);
  const [diaryDraft, setDiaryDraft] = useState('');
  const [diaryError, setDiaryError] = useState('');
  const [diaryBusy, setDiaryBusy] = useState(false);

  useEffect(() => {
    refreshEmotionHistory();
  }, [refreshEmotionHistory]);

  useEffect(() => {
    setTags(todayRecord?.tags ?? []);
    setMemo(todayRecord?.memo ?? '');
  }, [todayRecord?.date, todayRecord?.tags, todayRecord?.memo]);

  const toggleTag = (id: EmotionTag) => {
    setTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const saveCheckIn = async () => {
    if (!todayMood) {
      setSavedHint('请先选一个今日心情～');
      return;
    }
    setSavedHint('保存中…');
    await setTodayMood(todayMood, { tags, memo });
    setSavedHint('已保存今日打卡');
    setTimeout(() => setSavedHint(''), 2500);
  };

  const submitTree = () => {
    if (!treeInput.trim()) return;
    addTreeHole(treeInput);
    setTreePosts(loadTreeHole());
    setTreeInput('');
  };

  const submitFrag = () => {
    if (!fragInput.trim()) return;
    addFragment(fragInput);
    setFragPosts(loadFragments());
    setFragInput('');
  };

  const unlockDiary = async () => {
    setDiaryError('');
    if (!diaryPassword.trim()) {
      setDiaryError('请输入密码');
      return;
    }
    setDiaryBusy(true);
    try {
      if (!hasDiaryVault()) {
        setDiaryEntries([]);
        setDiaryError('');
      } else {
        const entries = await loadDiaryEncrypted(diaryPassword);
        setDiaryEntries(entries);
      }
    } catch {
      setDiaryError('密码错误或数据损坏，请重试');
      setDiaryEntries(null);
    } finally {
      setDiaryBusy(false);
    }
  };

  const lockDiary = () => {
    setDiaryEntries(null);
    setDiaryPassword('');
    setDiaryError('');
  };

  const saveDiary = async () => {
    setDiaryError('');
    if (!diaryPassword.trim()) {
      setDiaryError('请先设定并记住密码，用于加密');
      return;
    }
    if (diaryEntries === null) return;
    let next = [...diaryEntries];
    if (diaryDraft.trim()) {
      next = [
        {
          id: crypto.randomUUID(),
          content: diaryDraft.trim(),
          createdAt: new Date().toISOString(),
        },
        ...next,
      ];
      setDiaryDraft('');
    }
    setDiaryBusy(true);
    try {
      await saveDiaryEncrypted(diaryPassword, next);
      setDiaryEntries(next);
      setSavedHint('私密日记已加密保存');
      setTimeout(() => setSavedHint(''), 2000);
    } catch {
      setDiaryError('保存失败，请稍后重试');
    } finally {
      setDiaryBusy(false);
    }
  };

  const curveHistory = useMemo(
    () => emotionHistory.map((e) => ({ date: e.date, mood: e.mood })),
    [emotionHistory]
  );

  return (
    <div className="space-y-5 pb-28 pt-2">
      <div className="flex items-center gap-3 px-6">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setCurrentTab('home')}
          className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-2xl glass text-forest-800 shadow-sm"
          aria-label="返回首页"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-forest-900">
            <Sparkles className="h-5 w-5 text-blossom-500" />
            情绪日记
          </h1>
          <p className="text-xs text-forest-600">打卡 · 曲线 · 树洞与加密日记</p>
        </div>
      </div>

      {savedHint && (
        <p className="px-6 text-sm font-medium text-forest-700">{savedHint}</p>
      )}

      <section className="px-6">
        <GlassCard className="p-5">
          <h2 className="font-bold text-forest-900 mb-3 flex items-center gap-2">
            今日心情打卡
            <span className="text-xs font-normal text-forest-500">
              {format(new Date(), 'M月d日 EEEE', { locale: zhCN })}
            </span>
          </h2>
          <MoodSelector selectedMood={todayMood} onSelect={(m) => setTodayMood(m)} />
          <p className="text-xs text-forest-600 mt-4 mb-2">情绪标签（可多选）</p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  tags.includes(t.id)
                    ? 'bg-forest-500 text-white shadow-md'
                    : 'bg-white/70 text-forest-700 border border-white/80'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label className="block mt-4">
            <span className="text-xs text-forest-600">备注（可选）</span>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              placeholder="写一句给自己的话…"
              className="mt-1 w-full rounded-2xl border border-white/80 bg-white/60 px-3 py-2 text-sm text-forest-900 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={saveCheckIn}
            className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-forest-500 to-emerald-600 text-white font-bold text-sm shadow-lg"
          >
            保存今日打卡
          </motion.button>
          <p className="text-[10px] text-forest-500 mt-2 leading-relaxed">
            标签与备注会随心情同步到云端（与原有心情记录共用）；树洞与私密内容仅保存在本机。
          </p>
        </GlassCard>
      </section>

      <section className="px-6 space-y-3">
        <GlassCard className="p-5">
          <h2 className="font-bold text-forest-900 mb-1">心情曲线</h2>
          <p className="text-xs text-forest-600 mb-3">近 14 天心情指数（按打卡记录）</p>
          {curveHistory.length === 0 ? (
            <p className="text-sm text-forest-600">还没有足够数据，先去上面打个卡吧～</p>
          ) : (
            <MoodCurve history={curveHistory} />
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-bold text-forest-900 mb-1">情绪周报</h2>
          <p className="text-xs text-forest-600 mb-3">最近 7 天小结</p>
          <WeeklyReport history={emotionHistory} />
        </GlassCard>
      </section>

      <section className="px-6">
        <GlassCard className="p-5">
          <h2 className="font-bold text-forest-900 mb-3 flex items-center gap-2">
            <Trees className="h-5 w-5 text-forest-600" />
            树洞 · 碎碎念 · 私密日记
          </h2>

          <div className="flex gap-1 p-1 rounded-2xl bg-white/50 mb-4">
            {(
              [
                ['hole', '匿名树洞'],
                ['fragment', '碎碎念'],
                ['diary', '私密日记'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setVentTab(id)}
                className={cn(
                  'flex-1 py-2 rounded-xl text-xs font-bold transition-all',
                  ventTab === id
                    ? 'bg-forest-500 text-white shadow'
                    : 'text-forest-700 hover:bg-white/60'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {ventTab === 'hole' && (
            <div className="space-y-3">
              <p className="text-xs text-forest-600 leading-relaxed">
                内容只保存在你的浏览器里，不会上传服务器，当作匿名倾诉角。
              </p>
              <textarea
                value={treeInput}
                onChange={(e) => setTreeInput(e.target.value)}
                rows={3}
                placeholder="说出来会轻松一点…"
                className="w-full rounded-2xl border border-white/80 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <button
                type="button"
                onClick={submitTree}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold"
              >
                投进树洞
              </button>
              <ul className="space-y-2 max-h-52 overflow-y-auto">
                {treePosts.map((p) => (
                  <li
                    key={p.id}
                    className="text-sm text-forest-800 bg-white/50 rounded-xl px-3 py-2 border border-white/60"
                  >
                    <span className="text-[10px] text-forest-500 block mb-1">
                      {format(parseISO(p.createdAt), 'M月d日 HH:mm', { locale: zhCN })}
                    </span>
                    {p.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ventTab === 'fragment' && (
            <div className="space-y-3">
              <p className="text-xs text-forest-600">零碎心情速记，同样仅存本机。</p>
              <textarea
                value={fragInput}
                onChange={(e) => setFragInput(e.target.value)}
                rows={3}
                placeholder="一闪而过的念头…"
                className="w-full rounded-2xl border border-white/80 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <button
                type="button"
                onClick={submitFrag}
                className="w-full py-2.5 rounded-xl bg-forest-600 text-white text-sm font-bold"
              >
                记下这句
              </button>
              <ul className="space-y-2 max-h-52 overflow-y-auto">
                {fragPosts.map((p) => (
                  <li
                    key={p.id}
                    className="text-sm text-forest-800 bg-white/50 rounded-xl px-3 py-2 border border-white/60"
                  >
                    <span className="text-[10px] text-forest-500 block mb-1">
                      {format(parseISO(p.createdAt), 'M月d日 HH:mm', { locale: zhCN })}
                    </span>
                    {p.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ventTab === 'diary' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-forest-600 leading-relaxed bg-amber-50/80 rounded-xl p-3 border border-amber-100">
                <Lock className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <span>
                  使用 AES-GCM + PBKDF2 在本地加密。密码不会上传；请务必记住密码，丢失无法找回内容。
                </span>
              </div>

              {diaryEntries === null ? (
                <>
                  <input
                    type="password"
                    value={diaryPassword}
                    onChange={(e) => setDiaryPassword(e.target.value)}
                    placeholder="输入日记密码"
                    className="w-full rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-sm"
                  />
                  {diaryError && <p className="text-xs text-red-600">{diaryError}</p>}
                  <button
                    type="button"
                    disabled={diaryBusy}
                    onClick={unlockDiary}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold disabled:opacity-50"
                  >
                    {hasDiaryVault() ? '解锁日记' : '创建并进入（首次）'}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={lockDiary}
                      className="flex-1 py-2 rounded-xl border border-forest-200 text-forest-800 text-sm font-medium"
                    >
                      锁定
                    </button>
                    <button
                      type="button"
                      disabled={diaryBusy}
                      onClick={saveDiary}
                      className="flex-1 py-2 rounded-xl bg-forest-600 text-white text-sm font-bold disabled:opacity-50"
                    >
                      保存并加密
                    </button>
                  </div>
                  <textarea
                    value={diaryDraft}
                    onChange={(e) => setDiaryDraft(e.target.value)}
                    rows={3}
                    placeholder="今天想对自己保密的话…"
                    className="w-full rounded-2xl border border-white/80 bg-white/60 px-3 py-2 text-sm"
                  />
                  {diaryError && <p className="text-xs text-red-600">{diaryError}</p>}
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {diaryEntries.map((e) => (
                      <li
                        key={e.id}
                        className="text-sm text-forest-900 bg-white/60 rounded-xl px-3 py-2 border border-white/70"
                      >
                        <span className="text-[10px] text-forest-500 block mb-1">
                          {format(parseISO(e.createdAt), 'yyyy年M月d日', { locale: zhCN })}
                        </span>
                        {e.content}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </GlassCard>
      </section>

      <p className="px-8 text-center text-[10px] text-forest-500 flex items-center justify-center gap-1">
        <Heart className="w-3 h-3" />
        照顾好自己，一天比一天更接近森林里的光。
      </p>
    </div>
  );
}
