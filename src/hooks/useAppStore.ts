import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  checkAccount,
  GreenApiError,
  normalizePhone,
  sendMessage,
  setSettings,
} from '../api/greenApi';
import { loadPersistedState, savePersistedState } from '../storage';
import type { Chat, Credentials, Message, PersistedState } from '../types';
import { ensureChatFromIncoming, useNotificationPoller } from './useNotificationPoller';

let initialPersisted: PersistedState | null = null;

const getInitialPersisted = (): PersistedState => {
  if (!initialPersisted) {
    initialPersisted = loadPersistedState();
  }
  return initialPersisted;
};

const createMessage = (
  chatId: string,
  text: string,
  outgoing: boolean,
  status?: Message['status'],
  id?: string,
  timestamp?: number,
): Message => ({
  id: id ?? crypto.randomUUID(),
  chatId,
  text,
  outgoing,
  timestamp: timestamp ?? Date.now(),
  status,
});

export const useAppStore = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [chats, setChats] = useState<Chat[]>(() => getInitialPersisted().chats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    () => getInitialPersisted().messages,
  );
  const [activeChatId, setActiveChatId] = useState<string | null>(
    () => getInitialPersisted().activeChatId,
  );

  const [loginError, setLoginError] = useState<string | null>(null);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    savePersistedState({ chats, messages, activeChatId });
  }, [chats, messages, activeChatId]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.chatId === activeChatId) ?? null,
    [activeChatId, chats],
  );

  const activeMessages = useMemo(
    () => (activeChatId ? messages[activeChatId] ?? [] : []),
    [activeChatId, messages],
  );

  const handleIncomingText = useCallback(
    (incoming: {
      chatId: string;
      text: string;
      idMessage: string;
      timestamp: number;
      title?: string;
      phone?: string;
    }) => {
      setChats((prevChats) => {
        const chat = ensureChatFromIncoming(prevChats, incoming);
        if (prevChats.some((item) => item.chatId === chat.chatId)) {
          return prevChats;
        }
        return [chat, ...prevChats];
      });

      setMessages((prevMessages) => {
        const list = prevMessages[incoming.chatId] ?? [];
        if (list.some((item) => item.id === incoming.idMessage)) {
          return prevMessages;
        }

        const message = createMessage(
          incoming.chatId,
          incoming.text,
          false,
          'sent',
          incoming.idMessage,
          incoming.timestamp,
        );

        return {
          ...prevMessages,
          [incoming.chatId]: [...list, message],
        };
      });
    },
    [],
  );

  useNotificationPoller({
    credentials,
    onIncomingText: handleIncomingText,
  });

  const handleLogin = async (nextCredentials: Credentials) => {
    setLoginError(null);
    await setSettings(nextCredentials);
    setCredentials(nextCredentials);
  };

  const handleLogout = () => {
    setCredentials(null);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleCreateChat = async (rawPhone: string) => {
    if (!credentials) return;

    const phoneNumber = normalizePhone(rawPhone);
    if (!phoneNumber) {
      setSidebarError('Неверный номер. Используйте формат 79991234567');
      return;
    }

    setCreatingChat(true);
    setSidebarError(null);

    try {
      const result = await checkAccount(credentials, phoneNumber);
      if (!result.exist || !result.chatId) {
        throw new GreenApiError('Аккаунт MAX на этом номере не найден');
      }

      const chat: Chat = {
        chatId: result.chatId,
        phone: String(phoneNumber),
        title: String(phoneNumber),
      };

      setChats((prev) =>
        prev.some((item) => item.chatId === chat.chatId) ? prev : [chat, ...prev],
      );
      setActiveChatId(chat.chatId);
    } catch (error) {
      setSidebarError(
        error instanceof Error ? error.message : 'Не удалось создать чат',
      );
    } finally {
      setCreatingChat(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!credentials || !activeChatId) return;

    const chatId = activeChatId;
    const tempId = crypto.randomUUID();
    const optimistic = createMessage(chatId, text, true, 'sending', tempId);

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), optimistic],
    }));

    setSending(true);
    try {
      const response = await sendMessage(credentials, chatId, text);
      setMessages((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map((item) =>
          item.id === tempId
            ? { ...item, id: response.idMessage, status: 'sent' }
            : item,
        ),
      }));
    } catch {
      setMessages((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map((item) =>
          item.id === tempId ? { ...item, status: 'error' } : item,
        ),
      }));
    } finally {
      setSending(false);
    }
  };

  return {
    credentials,
    chats,
    activeChatId,
    activeChat,
    activeMessages,
    loginError,
    sidebarError,
    creatingChat,
    sending,
    handleLogin,
    handleLogout,
    handleSelectChat,
    handleCreateChat,
    handleSend,
  };
};
