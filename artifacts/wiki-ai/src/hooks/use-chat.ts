import { useState, useRef, useEffect } from 'react';
import { searchWikipedia, type WikipediaSummary } from '@/lib/wikipedia';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: WikipediaSummary;
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
      const summary = await searchWikipedia(text);
      
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            if (!summary) {
              return {
                ...msg,
                content: "I couldn't find anything on Wikipedia for that. Could you try asking in a different way?",
                status: 'success',
              };
            }
            if (!summary.extract) {
              return {
                ...msg,
                content: "Wikipedia has an article for this, but no summary is available.",
                data: summary,
                status: 'success',
              };
            }
            return {
              ...msg,
              content: summary.extract,
              data: summary,
              status: 'success',
            };
          }
          return msg;
        })
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Sorry, I encountered an error while searching Wikipedia. Please try again later.',
                status: 'error',
                error: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
