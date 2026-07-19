import { useState, useCallback } from 'react';
import { type Message } from './use-chat';

export type Session = {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
};

const SESSIONS_KEY = 'miguoai-sessions';
const ACTIVE_KEY = 'miguoai-active-session';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {}
}

function loadActiveId(sessions: Session[]): string {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id && sessions.find((s) => s.id === id)) return id;
  } catch {}
  return sessions[0]?.id ?? '';
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [activeId, setActiveId] = useState<string>(() => {
    const s = loadSessions();
    return loadActiveId(s);
  });

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  const persistSessions = (updated: Session[]) => {
    setSessions(updated);
    saveSessions(updated);
  };

  const newSession = useCallback(() => {
    const session: Session = {
      id: generateId(),
      title: 'New chat',
      createdAt: Date.now(),
      messages: [],
    };
    const updated = [session, ...sessions];
    persistSessions(updated);
    setActiveId(session.id);
    localStorage.setItem(ACTIVE_KEY, session.id);
    return session.id;
  }, [sessions]);

  const selectSession = useCallback((id: string) => {
    setActiveId(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const deleteSession = useCallback((id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    persistSessions(updated);
    if (activeId === id) {
      const next = updated[0]?.id ?? '';
      setActiveId(next);
      localStorage.setItem(ACTIVE_KEY, next);
    }
  }, [sessions, activeId]);

  const updateMessages = useCallback((id: string, messages: Message[]) => {
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s;
        // Auto-title from first user message
        const firstUser = messages.find((m) => m.role === 'user');
        const title = firstUser
          ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? '…' : '')
          : 'New chat';
        return { ...s, messages, title };
      });
      saveSessions(updated);
      return updated;
    });
  }, []);

  return {
    sessions,
    activeId,
    activeSession,
    newSession,
    selectSession,
    deleteSession,
    updateMessages,
  };
}
