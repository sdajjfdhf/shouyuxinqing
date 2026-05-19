// src/chatDB.js
import { supabase } from "@/lib/supabase"; // 
// 保存用户发送的消息
export async function saveUserText(text) {
  await supabase.from("chat_support_message").insert([
    {
      user_id: "test001", // 临时用户ID，后期可换成真实登录ID
      animal_key: "deer-lulu", // 你的小鹿角色标识
      role: "user",
      content: text,
      sort_order: Date.now() // 用时间戳保证消息顺序
    }
  ]);
}

// 保存AI/动物回复的消息
export async function saveAiText(text) {
  await supabase.from("chat_support_message").insert([
    {
      user_id: "test001",
      animal_key: "deer-lulu",
      role: "assistant",
      content: text,
      sort_order: Date.now()
    }
  ]);
}