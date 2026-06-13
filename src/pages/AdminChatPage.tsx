import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { LeafBackground } from '../components/LeafBackground';

interface ChatMessage {
  id: string;
  created_at: string;
  user_id: string;
  email: string | null;
  device_id: string | null;
  content: string;
  type: 'user' | 'ai';
  session_id: string | null;
  model_used: string;
  animal_key: string | null;
}

interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  email: string | null;
  device_id: string | null;
  animal_key: string;
  title: string;
  message_count: number;
}

interface AdminChatPageProps {
  onBack?: () => void;
}

export default function AdminChatPage({ onBack }: AdminChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'ai'>('all');

  const fetchAllMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_chat_view')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_session_view')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setSessionMessages(data || []);
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  useEffect(() => {
    fetchAllMessages();
    fetchAllSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchSessionMessages(selectedSession);
    }
  }, [selectedSession]);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (msg.email && msg.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesUser = !filterUser || msg.user_id === filterUser;
    const matchesType = filterType === 'all' || msg.type === filterType;
    return matchesSearch && matchesUser && matchesType;
  });

  const uniqueUsers = [...new Map(messages.map(m => [m.user_id, m])).values()];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnimalName = (key: string | null) => {
    const animals: Record<string, string> = {
      deer: '小鹿露露',
      rabbit: '小兔朵朵',
      bear: '小熊阿悟',
      cat: '小猫米亚'
    };
    return animals[key || ''] || '未知';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-blossom-50 relative">
      <LeafBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-forest-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-forest-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-forest-700" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-forest-800">管理员对话管理</h1>
              <p className="text-sm text-forest-600 mt-1">查看所有用户的对话记录</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchAllMessages();
                fetchAllSessions();
              }}
              className="px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
            >
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-forest-700 mb-1">搜索内容或邮箱</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blossom-400"
                placeholder="搜索..."
              />
            </div>
            <div className="min-w-[150px]">
              <label className="block text-sm text-forest-700 mb-1">筛选用户</label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blossom-400"
              >
                <option value="">全部用户</option>
                {uniqueUsers.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.email || user.device_id || `用户 ${user.user_id.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[120px]">
              <label className="block text-sm text-forest-700 mb-1">消息类型</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'user' | 'ai')}
                className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blossom-400"
              >
                <option value="all">全部</option>
                <option value="user">用户消息</option>
                <option value="ai">AI回复</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedSession(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !selectedSession
                ? 'bg-forest-500 text-white'
                : 'bg-white/80 text-forest-700 hover:bg-forest-100'
            }`}
          >
            消息列表
          </button>
          <button
            onClick={() => {
              setSelectedSession(null);
              fetchAllSessions();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSession
                ? 'bg-forest-500 text-white'
                : 'bg-white/80 text-forest-700 hover:bg-forest-100'
            }`}
          >
            对话会话
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedSession ? (
          /* Session Details */
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm">
            <button
              onClick={() => setSelectedSession(null)}
              className="mb-4 text-forest-600 hover:text-forest-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>
            <h3 className="text-lg font-semibold text-forest-800 mb-4">
              会话消息 ({sessionMessages.length})
            </h3>
            <div className="space-y-3">
              {sessionMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`rounded-xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-blossom-50 border border-blossom-200 ml-auto max-w-[80%]'
                      : 'bg-forest-50 border border-forest-200 mr-auto max-w-[80%]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      msg.type === 'user' ? 'bg-blossom-200 text-blossom-700' : 'bg-forest-200 text-forest-700'
                    }`}>
                      {msg.type === 'user' ? '用户' : `AI - ${getAnimalName(msg.animal_key)}`}
                    </span>
                    <span className="text-xs text-forest-500">
                      {formatTime(msg.created_at)}
                    </span>
                    {msg.model_used && msg.model_used !== 'local' && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {msg.model_used}
                      </span>
                    )}
                  </div>
                  <p className="text-forest-800 text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-forest-600">没有找到匹配的消息</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        msg.type === 'user'
                          ? 'bg-blossom-100 text-blossom-700'
                          : 'bg-forest-100 text-forest-700'
                      }`}>
                        {msg.type === 'user' ? '用户' : 'AI'}
                      </span>
                      <span className="text-sm text-forest-500">
                        {msg.email || `设备: ${msg.device_id?.slice(0, 12)}...`}
                      </span>
                      {msg.animal_key && (
                        <span className="text-sm text-forest-600">
                          {getAnimalName(msg.animal_key)}
                        </span>
                      )}
                      {msg.model_used && msg.model_used !== 'local' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {msg.model_used}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-forest-400">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-forest-800 text-sm leading-relaxed">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sessions List */}
        {!selectedSession && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">对话会话列表</h3>
            <div className="grid gap-3">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-forest-800">{session.title}</h4>
                      <p className="text-sm text-forest-500">
                        {session.email || `设备: ${session.device_id?.slice(0, 12)}...`}
                        {' · '} {getAnimalName(session.animal_key)}
                        {' · '} {session.message_count} 条消息
                      </p>
                    </div>
                    <span className="text-xs text-forest-400">
                      {formatTime(session.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav currentPage="profile" />
    </div>
  );
}