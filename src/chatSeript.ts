// src/chatService.ts
import { supabase } from '@/lib/supabase'

export async function saveChatMessage(
  role: 'user' | 'assistant',
  content: string,
  animalKey: string = 'deer-lulu',
  userId: string = 'test-user-001'
) {
  console.log(`📝 准备保存 ${role} 消息:`, content)

  try {
    const { error } = await supabase
      .from('chat_support_message')
      .insert([
        {
          user_id: userId,
          animal_key: animalKey,
          role: role,
          content: content,
          sort_order: Date.now()
        }
      ])

    if (error) throw error
    console.log('✅ 保存成功')
    return true
  } catch (err) {
    console.error('❌ 保存失败:', err)
    return false
  }
}