import { useState } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
  status: 'loading' | 'success' | 'error';
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
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
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json() as { answer: string };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: data.answer, status: 'success' as const }
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

  return { messages, sendMessage, isLoading };
}
