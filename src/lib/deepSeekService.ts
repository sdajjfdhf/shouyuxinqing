export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepSeekResponse {
  reply: string;
}

const LOCAL_REPLIES = {
  greeting: [
    '你好呀～有什么想聊的吗？',
    '嗨！很高兴遇见你，今天心情怎么样？',
    '你好呀，我是你的森林伙伴～'
  ],
  positive: [
    '真为你开心！继续保持这份好心情～',
    '太棒了！听你这么说我也很开心～',
    '真好呀，希望这份快乐一直陪伴你！'
  ],
  negative: [
    '我在这里陪着你，别难过...',
    '有时候生活确实不容易，你已经很棒了～',
    '想哭就哭出来吧，我会一直倾听的。'
  ],
  neutral: [
    '嗯，我在听呢～',
    '原来是这样，继续说说看～',
    '我懂你的感受。'
  ],
  confused: [
    '我不太明白你说的是什么呢，可以再说一遍吗？',
    '抱歉，我没太理解，可以解释一下吗？'
  ],
  default: [
    '我在这里，随时愿意倾听～',
    '你想说什么都可以哦～',
    '嗯嗯，我在呢。'
  ]
};

function getLocalReply(mood: string = 'neutral'): string {
  const category = LOCAL_REPLIES[mood as keyof typeof LOCAL_REPLIES] || LOCAL_REPLIES.default;
  return category[Math.floor(Math.random() * category.length)];
}

export async function fetchDeepSeekResponse(
  message: string,
  context: ChatMessage[],
  mood: string = 'neutral'
): Promise<string> {
  try {
    const response = await fetch('http://localhost:8787/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        context,
        partnerName: '森林伙伴',
        useDeepSeek: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn('DeepSeek API error:', errorData);
      return getLocalReply(mood);
    }

    const data: DeepSeekResponse = await response.json();
    return data.reply || getLocalReply(mood);
  } catch (error) {
    console.error('Failed to fetch DeepSeek response:', error);
    return getLocalReply(mood);
  }
}

export interface SearchResult {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
}

export async function searchArticlesByAI(
  query: string
): Promise<SearchResult[]> {
  try {
    const response = await fetch('http://localhost:8787/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        useDeepSeek: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn('DeepSeek search API error:', errorData);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return [];
  }
}