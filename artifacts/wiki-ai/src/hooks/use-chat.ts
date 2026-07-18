import { useState, useEffect } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
  status: 'loading' | 'success' | 'error';
};

const STORAGE_KEY = 'miguoai-chat-history';

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    // Never restore loading messages
    return parsed.filter((m) => m.status !== 'loading');
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    const toSave = messages.filter((m) => m.status !== 'loading');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [isLoading, setIsLoading] = useState(false);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: text,
      status: 'success',
    };

    const assistantMessageId = Date.now().toString() + '-assistant';
    const loadingMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      status: 'loading',
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are MiguoAI, a knowledgeable and helpful assistant. Answer questions clearly and accurately.',
            },
            ...history,
          ],
          model: 'openai',
          private: true,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const answer = await response.text();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: answer.trim(), status: 'success' as const }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Sorry, something went wrong. Please try again.',
                status: 'error' as const,
                error: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, clearHistory };
}
