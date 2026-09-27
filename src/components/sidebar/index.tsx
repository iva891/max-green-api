import { useState, type SubmitEvent } from 'react';
import { formatPhone } from '../../api/greenApi';
import { Button } from '../button';
import { avatarColor, getInitials } from './helpers';
import './style.css';
import type { SidebarProps } from './type';

export const Sidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onLogout,
  creating = false,
  error,
}: SidebarProps) => {
  const [phone, setPhone] = useState('');

  const handleCreate = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone.trim()) return;
    await onCreateChat(phone.trim());
    setPhone('');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__title">
          <span className="sidebar__logo">MAX</span>
          <span className="sidebar__title-text">Чаты</span>
        </div>
        <Button type="button" buttonType="ghost" onClick={onLogout}>
          Выйти
        </Button>
      </div>

      <form className="sidebar__new-chat-form" onSubmit={handleCreate}>
        <input
          className="sidebar__input"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Номер телефона (79991234567)"
          disabled={creating}
        />
        <Button type="submit" buttonType="primary" disabled={creating}>
          {creating ? '…' : 'Новый чат'}
        </Button>
      </form>

      {error && <div className="sidebar__error">{error}</div>}

      <div className="sidebar__chat-list">
        {chats.length === 0 ? (
          <div className="sidebar__chat-list-empty">
            Создайте чат по номеру телефона
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.chatId}
              type="button"
              className={`sidebar__chat-item ${activeChatId === chat.chatId ? 'sidebar__chat-item--active' : ''}`}
              onClick={() => onSelectChat(chat.chatId)}
            >
              <div
                className="sidebar__chat-avatar"
                style={{ backgroundColor: avatarColor(chat.chatId) }}
              >
                {getInitials(chat.title)}
              </div>
              <div className="sidebar__chat-body">
                <div className="sidebar__chat-top">
                  <span className="sidebar__chat-title">{chat.title}</span>
                </div>
                <div className="sidebar__chat-preview">
                  {formatPhone(chat.phone)}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export type { SidebarProps } from './type';
