import type { Message } from '../../types';
import type { MessageGroup } from './type';

export const formatTime = (timestamp: number): string =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));

export const formatDateLabel = (timestamp: number): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp));

export const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];

  for (const message of messages) {
    const label = formatDateLabel(message.timestamp);
    const last = groups[groups.length - 1];
    if (!last || last.label !== label) {
      groups.push({ label, items: [message] });
    } else {
      last.items.push(message);
    }
  }

  return groups;
};

export const getInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
};
