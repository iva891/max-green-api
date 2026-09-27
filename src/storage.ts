import { STORAGE_KEY } from './constants';
import type { PersistedState } from './types';

const defaultState: PersistedState = {
  chats: [],
  messages: {},
  activeChatId: null,
};

export const loadPersistedState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      chats: parsed.chats ?? [],
      messages: parsed.messages ?? {},
      activeChatId: parsed.activeChatId ?? null,
    };
  } catch {
    return defaultState;
  }
};

export const savePersistedState = (state: PersistedState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
