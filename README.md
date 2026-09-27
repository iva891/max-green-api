# MAX Chat — GREEN-API

Текстовый чат [MAX](https://max.ru/) через [GREEN-API](https://green-api.com/max). UI — упрощённая копия [web.max.ru](https://web.max.ru/).

## Стек

- Vite + React 19 + TypeScript
- Состояние в `useAppStore()` (без Redux/MobX)
- Стили: BEM, CSS-переменные

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

```bash
npm run build
```

## Как пользоваться

1. В личном кабинете [GREEN-API](https://console.green-api.com/) создайте инстанс MAX и авторизуйте его.
2. Оставьте `webhookUrl` пустым.
3. На экране входа укажите `idInstance` и `apiTokenInstance` (опционально — `apiUrl`).
4. Создайте чат по номеру телефона (`7XXXXXXXXXX`).
5. Отправляйте и получайте текстовые сообщения.

Ключи инстанса хранятся только в памяти вкладки: после обновления страницы нужен повторный вход. Список чатов и сообщения сохраняются в `localStorage`.

## GREEN-API

| Метод | Назначение |
|---|---|
| `SetSettings` | `webhookUrl: ""`, `incomingWebhook: "yes"` |
| `CheckAccount` | номер → `{ exist, chatId }` |
| `SendMessage` | отправка текста |
| `ReceiveNotification` | long-polling входящих |
| `DeleteNotification` | подтверждение получения |

`chatId` в MAX — внутренний id, не номер телефона. Запросы к `api.green-api.com` в dev идут через Vite proxy `/api/green`.

## Вне scope

Группы, медиа, звонки, статусы «прочитано», каналы, цитирование.
