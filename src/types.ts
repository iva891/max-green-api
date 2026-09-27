export type Credentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type Chat = {
  chatId: string;
  phone: string;
  title: string;
};

export type Message = {
  id: string;
  chatId: string;
  text: string;
  outgoing: boolean;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
};

export type PersistedState = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
};

export type CheckAccountResponse = {
  exist: boolean;
  chatId: string;
  fromCache?: boolean;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type NotificationPayload = {
  receiptId: number;
  body: IncomingNotificationBody;
};

export type IncomingNotificationBody = {
  typeWebhook: string;
  timestamp: number;
  idMessage: string;
  senderData?: {
    chatId: string;
    chatName?: string;
    senderPhoneNumber?: number;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
};
