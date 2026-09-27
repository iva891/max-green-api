import type { Credentials } from '../types';

export type IncomingTextPayload = {
  chatId: string;
  text: string;
  idMessage: string;
  timestamp: number;
  title?: string;
  phone?: string;
};

export type UseNotificationPollerOptions = {
  credentials: Credentials | null;
  onIncomingText: (payload: IncomingTextPayload) => void;
};
