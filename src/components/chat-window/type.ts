import type { Chat, Message } from '../../types';

export type ChatWindowProps = {
  chat: Chat | null;
  messages: Message[];
  onSend: (text: string) => Promise<void>;
  sending?: boolean;
};

export type MessageGroup = {
  label: string;
  items: Message[];
};
