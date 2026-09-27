import { API_BASE, NOTIFICATION_RECEIVE_TIMEOUT } from '../constants';
import type {
  CheckAccountResponse,
  Credentials,
  NotificationPayload,
  SendMessageResponse,
} from '../types';

export class GreenApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'GreenApiError';
  }
}

const buildUrl = (credentials: Credentials, method: string, suffix = ''): string => {
  const { idInstance, apiTokenInstance } = credentials;
  return `${API_BASE}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`;
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
};

const requestJson = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const data = await parseJson<{ message?: string; reason?: string } & T>(response);

  if (!response.ok) {
    const message =
      data?.message ?? data?.reason ?? `HTTP ${response.status}`;
    throw new GreenApiError(message, response.status);
  }

  return data;
};

export const setSettings = async (credentials: Credentials): Promise<void> => {
  await requestJson(buildUrl(credentials, 'setSettings'), {
    method: 'POST',
    body: JSON.stringify({
      webhookUrl: '',
      outgoingWebhook: 'yes',
      stateWebhook: 'yes',
      incomingWebhook: 'yes',
    }),
  });
};

export const checkAccount = async (
  credentials: Credentials,
  phoneNumber: number,
): Promise<CheckAccountResponse> => {
  const data = await requestJson<CheckAccountResponse>(
    buildUrl(credentials, 'checkAccount'),
    {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, force: false }),
    },
  );

  if (!data) {
    throw new GreenApiError('Пустой ответ CheckAccount');
  }

  return data;
};

export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const data = await requestJson<SendMessageResponse>(
    buildUrl(credentials, 'sendMessage'),
    {
      method: 'POST',
      body: JSON.stringify({ chatId, message }),
    },
  );

  if (!data?.idMessage) {
    throw new GreenApiError('Не удалось отправить сообщение');
  }

  return data;
};

export const receiveNotification = async (
  credentials: Credentials,
  receiveTimeout = NOTIFICATION_RECEIVE_TIMEOUT,
): Promise<NotificationPayload | null> => {
  const url = `${buildUrl(credentials, 'receiveNotification')}?receiveTimeout=${receiveTimeout}`;
  const response = await fetch(url);

  if (!response.ok) {
    const data = await parseJson<{ message?: string }>(response);
    throw new GreenApiError(
      data?.message ?? `HTTP ${response.status}`,
      response.status,
    );
  }

  const text = await response.text();
  if (!text) return null;

  return JSON.parse(text) as NotificationPayload;
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
): Promise<void> => {
  await requestJson(buildUrl(credentials, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
  });
};

export const normalizePhone = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11 || !digits.startsWith('7')) return null;
  return Number(digits);
};

export const formatPhone = (phone: string | number): string => {
  const digits = String(phone).replace(/\D/g, '');
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
};
