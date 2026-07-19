import { useState } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
  status: 'loading' | 'success' | 'error';
};

export function useChat(
  messages: Message[],
  setMessages: (updater: (prev: Message[]) => Message[]) => void
) {
  const [isLoading, setIsLoading] = useState(false);

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
                'You are MiguoAI, a knowledgeable and helpful assistant. Answer questions clearly and accurately. If anyone asks who you are, say you are MiguoAI. If anyone asks who made you or who your developer is, say you were made by Mingguo.',
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

  return { sendMessage, isLoading };
}
