import React, { useEffect, useState } from 'react';
import { Building2, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiUrl } from '../config/api';

type Guild = {
  id: string;
  name: string;
  icon?: string | null;
  owner?: boolean;
  members?: number;
};

type GuildsApiResponse = {
  guilds?: Guild[];
  data?: Guild[];
};

function toGuildArray(payload: unknown): Guild[] {
  if (Array.isArray(payload)) {
    return payload as Guild[];
  }

  if (payload && typeof payload === 'object') {
    const objectPayload = payload as GuildsApiResponse;

    if (Array.isArray(objectPayload.guilds)) {
      return objectPayload.guilds;
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data;
    }
  }

  return [];
}

function guildIconUrl(guild: Guild): string | null {
  if (!guild.icon) {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
}

const Guilds: React.FC = () => {
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGuildSelect = (guild: Guild) => {
    window.localStorage.setItem('selectedGuild', JSON.stringify(guild));
    navigate(`/dashboard/${guild.id}`, { state: { guild } });
  };

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        const response = await fetch(apiUrl('/api/v1/guilds/guilds'), {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Не удалось загрузить гильдии: ${response.status} ${response.statusText}`);
        }

        const payload = (await response.json()) as unknown;
        const parsedGuilds = toGuildArray(payload);

        setGuilds(parsedGuilds);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки гильдий';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadGuilds();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Ваши гильдии</h1>
            <p className="text-muted-foreground">Список серверов Discord, к которым у вас есть доступ.</p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-border bg-card p-8 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-muted-foreground">Загружаем гильдии...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-8">
              <div className="flex items-center gap-3 mb-3 text-red-500">
                <TriangleAlert className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Не удалось получить список гильдий</h2>
              </div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error && guilds.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Гильдии не найдены</h2>
              <p className="text-muted-foreground">API вернул пустой список для текущего пользователя.</p>
            </div>
          )}

          {!loading && !error && guilds.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds.map((guild) => {
                const iconUrl = guildIconUrl(guild);
                const initials = guild.name.slice(0, 2).toUpperCase();

                return (
                  <button
                    key={guild.id}
                    type="button"
                    onClick={() => handleGuildSelect(guild)}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={guild.name}
                          className="h-12 w-12 rounded-xl object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{guild.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">ID: {guild.id}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Участников: {guild.members ?? '—'}
                      </span>
                      {guild.owner && (
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <ShieldCheck className="h-4 w-4" />
                          Владелец
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Guilds;
