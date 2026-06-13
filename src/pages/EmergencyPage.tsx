import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { ArrowLeft, Heart, Phone, MessageCircle, AlertTriangle, UserPlus, Trash2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const hotlines = [
  { id: '1', name: '心理援助热线', phone: '400-161-9995', description: '24小时心理援助服务', icon: '💚' },
  { id: '2', name: '青少年心理热线', phone: '12355', description: '青少年心理健康服务', icon: '💙' },
  { id: '3', name: '北京心理危机干预中心', phone: '010-8295-1332', description: '危机干预服务', icon: '🧡' },
  { id: '4', name: '生命热线', phone: '400-810-1117', description: '生命关怀服务', icon: '💛' },
];

const initialContacts: Contact[] = [
  { id: '1', name: '妈妈', phone: '13800138001', relationship: '家人' },
  { id: '2', name: '好朋友小明', phone: '13900139002', relationship: '朋友' },
  { id: '3', name: '辅导员张老师', phone: '13700137003', relationship: '老师' },
];

export default function EmergencyPage({ onBack }: { onBack: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '朋友' });

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
      };
      setContacts([...contacts, contact]);
      setShowAddContact(false);
      setNewContact({ name: '', phone: '', relationship: '朋友' });
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const relationshipOptions = ['家人', '朋友', '老师', '同事', '其他'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-rose-100 p-4">
      {/* 头部 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">紧急求助</h1>
          <p className="text-sm text-gray-500">您不是一个人，我们都在这里</p>
        </div>
      </motion.div>

      {/* 紧急按钮 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-6 bg-gradient-to-r from-red-500 to-rose-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">需要紧急帮助？</h2>
              <p className="text-white/80 text-sm">请立即拨打 110 或 120</p>
            </div>
            <button className="px-6 py-3 bg-white text-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg">
              紧急呼叫
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* 心理援助热线 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          心理援助热线
        </h2>
        <div className="space-y-3">
          {hotlines.map((hotline, index) => (
            <motion.div
              key={hotline.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-pink-100 to-red-100">
                  <span className="text-2xl">{hotline.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{hotline.name}</h3>
                  <p className="text-sm text-gray-500">{hotline.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 紧急联系人 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            紧急联系人
          </h2>
          <button 
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            添加
          </button>
        </div>
        
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <GlassCard className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">{contact.phone}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{contact.relationship}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 温馨提示 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-white/60 rounded-xl"
      >
        <p className="text-sm text-gray-600 text-center">
          💝 无论何时何地，都有人关心你。如果你感到痛苦或无助，请不要犹豫，寻求帮助是勇敢的表现。
        </p>
      </motion.div>

      {/* 添加联系人弹窗 */}
      {showAddContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddContact(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加紧急联系人</h2>
            
            <div className="space-y-4">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">姓名</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="联系人姓名"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              
              {/* 电话 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">电话号码</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="13800138000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              
              {/* 关系 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">关系</label>
                <select
                  value={newContact.relationship}
                  onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {relationshipOptions.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={addContact}
                disabled={!newContact.name || !newContact.phone}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}