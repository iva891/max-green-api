import type { Chat } from '../../types';

export type SidebarProps = {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (phone: string) => Promise<void>;
  onLogout: () => void;
  creating?: boolean;
  error?: string | null;
};
