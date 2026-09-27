import { useEffect } from 'react';
import { deleteNotification, receiveNotification } from '../api/greenApi';
import { NOTIFICATION_RECEIVE_TIMEOUT, POLLING_RETRY_DELAY_MS } from '../constants';
import type { Chat, IncomingNotificationBody } from '../types';
import type { IncomingTextPayload, UseNotificationPollerOptions } from './type';

const extractIncomingText = (body: IncomingNotificationBody): IncomingTextPayload | null => {
  if (body.typeWebhook !== 'incomingMessageReceived') return null;
  if (body.messageData?.typeMessage !== 'textMessage') return null;

  const text = body.messageData.textMessageData?.textMessage;
  const chatId = body.senderData?.chatId;
  if (!text || !chatId) return null;

  return {
    chatId,
    text,
    idMessage: body.idMessage,
    timestamp: body.timestamp * 1000,
    title: body.senderData?.chatName,
    phone: body.senderData?.senderPhoneNumber
      ? String(body.senderData.senderPhoneNumber)
      : undefined,
  };
};

export const useNotificationPoller = ({
  credentials,
  onIncomingText,
}: UseNotificationPollerOptions): void => {
  useEffect(() => {
    if (!credentials) return;

    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotification(
            credentials,
            NOTIFICATION_RECEIVE_TIMEOUT,
          );
          if (cancelled) break;

          if (notification?.receiptId != null && notification.body) {
            const incoming = extractIncomingText(notification.body);
            if (incoming) {
              onIncomingText(incoming);
            }
            await deleteNotification(credentials, notification.receiptId);
          }
        } catch (error) {
          console.error('Polling error:', error);
          await new Promise((resolve) => setTimeout(resolve, POLLING_RETRY_DELAY_MS));
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [credentials, onIncomingText]);
};

export const ensureChatFromIncoming = (
  chats: Chat[],
  incoming: Pick<IncomingTextPayload, 'chatId' | 'title' | 'phone'>,
): Chat => {
  const existing = chats.find((chat) => chat.chatId === incoming.chatId);
  if (existing) return existing;

  return {
    chatId: incoming.chatId,
    phone: incoming.phone ?? incoming.chatId,
    title: incoming.title ?? incoming.phone ?? incoming.chatId,
  };
};
