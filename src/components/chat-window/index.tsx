import { useEffect, useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react';
import { formatPhone } from '../../api/greenApi';
import { Button } from '../button';
import { formatTime, getInitials, groupMessagesByDate } from './helpers';
import './style.css';
import type { ChatWindowProps } from './type';

export const ChatWindow = ({ chat, messages, onSend, sending = false }: ChatWindowProps) => {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chat?.chatId]);

  if (!chat) {
    return (
      <section className="chat-window chat-window--empty">
        <div className="chat-window__empty-state">
          <div className="chat-window__empty-state-icon">💬</div>
          <h2 className="chat-window__empty-state-title">Выберите чат</h2>
          <p className="chat-window__empty-state-text">
            Создайте новый чат по номеру телефона или выберите существующий
          </p>
        </div>
      </section>
    );
  }

  const sendCurrentMessage = async () => {
    const value = text.trim();
    if (!value || sending) return;
    setText('');
    await onSend(value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendCurrentMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendCurrentMessage();
    }
  };

  const groups = groupMessagesByDate(messages);

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        <div className="chat-window__header-avatar">{getInitials(chat.title)}</div>
        <div className="chat-window__header-info">
          <h2 className="chat-window__header-title">{chat.title}</h2>
          <span className="chat-window__header-subtitle">{formatPhone(chat.phone)}</span>
        </div>
      </header>

      <div className="chat-window__messages-area">
        {groups.map((group) => (
          <div key={group.label} className="chat-window__message-group">
            <div className="chat-window__date-separator">{group.label}</div>
            {group.items.map((message) => (
              <div
                key={message.id}
                className={`chat-window__message-row ${message.outgoing ? 'chat-window__message-row--outgoing' : 'chat-window__message-row--incoming'}`}
              >
                <div
                  className={`chat-window__bubble ${message.outgoing ? 'chat-window__bubble--outgoing' : 'chat-window__bubble--incoming'}`}
                >
                  <div className="chat-window__bubble-text">{message.text}</div>
                  <div className="chat-window__bubble-meta">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.status === 'error' && (
                      <span className="chat-window__bubble-error">ошибка</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-window__writebar" onSubmit={handleSubmit}>
        <textarea
          className="chat-window__writebar-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          rows={1}
          disabled={sending}
        />
        <Button
          type="submit"
          buttonType="icon"
          className="chat-window__send-btn"
          disabled={sending || !text.trim()}
          aria-label="Отправить"
        >
          <svg
            className="chat-window__send-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 19V5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 10l5-5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </form>
    </section>
  );
};

export type { ChatWindowProps, MessageGroup } from './type';
