import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { apiUrl } from '../config/api';

type CallbackResponse = {
  user?: unknown;
  token?: string;
};

const callbackRequests = new Map<string, Promise<CallbackResponse>>();

function exchangeCallbackCode(code: string): Promise<CallbackResponse> {
  const existingRequest = callbackRequests.get(code);
  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(apiUrl('/api/v1/auth/get_owner'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ code }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        console.error('Авторизация: API ответил не ok', {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });
        throw new Error(`Ошибка авторизации: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as CallbackResponse;
      console.log('Авторизация: успешный ответ сервера', {
        status: response.status,
        statusText: response.statusText,
        data,
      });

      return data;
    })
    .finally(() => {
      callbackRequests.delete(code);
    });

  callbackRequests.set(code, request);
  return request;
}

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Callback: window.location.href=', window.location.href);
      console.log('Callback: window.location.search=', window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      console.log('Callback: code=', code);

      if (!code) {
        setError('Код авторизации не найден');
        setLoading(false);
        return;
      }

      try {
        console.log('Sending code:', code);
        const data = await exchangeCallbackCode(code);

        if (!data) {
          throw new Error('Пустой ответ от сервера авторизации');
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        setTimeout(() => navigate('/guilds', { replace: true }), 1500);
      } catch (err) {
        console.error('Авторизация: исключение в handleCallback', err);
        const message = err instanceof Error ? err.message : 'Произошла ошибка при авторизации';
        setError(`Ошибка авторизации: ${message}`);
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/50">
      <div className="text-center">
        {loading && (
          <>
            <div className="flex justify-center mb-4">
              <Loader className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Авторизация через Discord</h1>
            <p className="text-muted-foreground">Пожалуйста, подождите...</p>
          </>
        )}

        {error && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-2">Ошибка авторизации</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all"
            >
              Вернуться на главную
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;