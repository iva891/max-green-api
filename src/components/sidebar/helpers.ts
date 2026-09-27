import { AVATAR_COLORS } from '../../constants';

export const getInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
};

export const avatarColor = (chatId: string): string => {
  const index = Number(chatId) || chatId.length;
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};
