import { useState, type SubmitEvent } from 'react';
import { Button } from '../button';
import './style.css';
import type { LoginScreenProps } from './type';

export const LoginScreen = ({ onSubmit, error }: LoginScreenProps) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setLocalError('Укажите idInstance и apiTokenInstance');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });
    } catch (submitError) {
      setLocalError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось подключиться',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-screen__card">
        <div className="login-screen__logo">MAX</div>
        <h1 className="login-screen__title">Вход через GREEN-API</h1>
        <p className="login-screen__subtitle">
          Введите данные инстанса из личного кабинета GREEN-API
        </p>

        <form className="login-screen__form" onSubmit={handleSubmit}>
          <label className="login-screen__field">
            idInstance
            <input
              className="login-screen__input"
              type="text"
              value={idInstance}
              onChange={(event) => setIdInstance(event.target.value)}
              placeholder="1100000001"
              autoComplete="off"
            />
          </label>

          <label className="login-screen__field">
            apiTokenInstance
            <input
              className="login-screen__input"
              type="password"
              value={apiTokenInstance}
              onChange={(event) => setApiTokenInstance(event.target.value)}
              placeholder="••••••••••••••••••••"
              autoComplete="off"
            />
          </label>

          {(localError || error) && (
            <div className="login-screen__error">{localError ?? error}</div>
          )}

          <Button type="submit" buttonType="primary" disabled={loading}>
            {loading ? 'Подключение…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export type { LoginScreenProps } from './type';
