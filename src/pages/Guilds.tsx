import React, { useEffect, useState, useRef } from 'react';
import { Building2, Loader2, ShieldCheck, TriangleAlert, AlertCircle, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiUrl } from '../config/api';
import { toast } from 'react-toastify';
import { useI18n } from '../i18n';

type Guild = {
  id: string;
  name: string;
  icon_url?: string | null;
  owner?: boolean;
  approximate_member_count?: number;
};

type GuildsApiResponse = {
  guilds?: Guild[];
  data?: Guild[];
};

let guildsRequestPromise: Promise<Guild[]> | null = null;

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
  return guild.icon_url || null;
}

async function loadGuildsOnce(): Promise<Guild[]> {
  if (guildsRequestPromise) {
    return guildsRequestPromise;
  }

  guildsRequestPromise = fetch(apiUrl('/api/v1/guilds/guilds'), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Слишком много запросов к API гильдий. Подождите несколько секунд и попробуйте снова.');
        }

        throw new Error(`Не удалось загрузить гильдии: ${response.status} ${response.statusText}`);
      }

      const payload = (await response.json()) as unknown;
      return toGuildArray(payload);
    })
    .finally(() => {
      guildsRequestPromise = null;
    });

  return guildsRequestPromise;
}

async function checkBotOnGuild(guildId: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl(`/api/v1/guilds/guilds/${guildId}`), {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const status = response.status;

    // Try to parse JSON, fall back to text when needed
    let body: unknown;
    try {
      body = await response.json();
    } catch (e) {
      try {
        body = await response.text();
      } catch {
        body = null;
      }
    }

      // debug logging removed

    if (!response.ok) {
      throw new Error(`Failed to check bot status: ${status}`);
    }

    // Normalize common response shapes
    if (typeof body === 'boolean') {
      return body;
    }

    if (typeof body === 'string') {
      const s = body.trim().toLowerCase();
      if (s === 'true') return true;
      if (s === 'false') return false;

      // maybe a JSON string
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed === 'boolean') return parsed;
        if (parsed && typeof parsed === 'object') {
          if ('added' in parsed) return Boolean((parsed as any).added);
          if ('bot' in parsed) return Boolean((parsed as any).bot);
          if ('isBot' in parsed) return Boolean((parsed as any).isBot);
          if ('ok' in parsed) return Boolean((parsed as any).ok);
        }
      } catch {
        // ignore
      }
    }

    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      if ('added' in obj) return Boolean(obj.added as any);
      if ('bot' in obj) return Boolean(obj.bot as any);
      if ('isBot' in obj) return Boolean(obj.isBot as any);
      if ('ok' in obj) return Boolean(obj.ok as any);
    }

    // Fallback: truthy body means true
    return Boolean(body);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking bot status:', error);
    throw error;
  }
}

const Guilds: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingGuildId, setCheckingGuildId] = useState<string | null>(null);
  const [missingBotGuild, setMissingBotGuild] = useState<Guild | null>(null);

  const handleGuildSelect = async (guild: Guild) => {
    setCheckingGuildId(guild.id);

    try {
      const isBotAdded = await checkBotOnGuild(guild.id);

      if (isBotAdded) {
        window.localStorage.setItem('selectedGuild', JSON.stringify(guild));
        navigate(`/dashboard/${guild.id}`, { state: { guild } });
      } else {
        setMissingBotGuild(guild);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : tRef.current.guildsPage.checkStatusError;
      setError(message);
    } finally {
      setCheckingGuildId(null);
    }
  };

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        const parsedGuilds = await loadGuildsOnce();
        setGuilds(parsedGuilds);
      } catch (err) {
        const message = err instanceof Error ? err.message : tRef.current.guildsPage.loadGuildsError;
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

      {missingBotGuild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-lg max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <h2 className="text-lg font-semibold">{t.guildsPage.botNotAddedTitle}</h2>
            </div>

            <p className="text-muted-foreground mb-2">
              {t.guildsPage.botNotAddedMessage} <strong>{missingBotGuild.name}</strong>.
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              {t.guildsPage.botNotAddedHint}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setMissingBotGuild(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {t.guildsPage.cancel}
              </button>
              <a
                href={`https://discord.com/oauth2/authorize?client_id=1403029892387569766&scope=bot&permissions=8&guild_id=${missingBotGuild.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-center flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                {t.guildsPage.addBot}
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">{t.guildsPage.title}</h1>
            <p className="text-muted-foreground">{t.guildsPage.subtitle}</p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-border bg-card p-8 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-muted-foreground">{t.guildsPage.loading}</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-8">
              <div className="flex items-center gap-3 mb-3 text-red-500">
                <TriangleAlert className="h-5 w-5" />
                <h2 className="text-xl font-semibold">{t.guildsPage.failedToLoadTitle}</h2>
              </div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error && guilds.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t.guildsPage.noGuildsTitle}</h2>
              <p className="text-muted-foreground">{t.guildsPage.noGuildsDesc}</p>
            </div>
          )}

          {!loading && !error && guilds.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds.map((guild) => {
                const iconUrl = guildIconUrl(guild);
                const initials = guild.name.slice(0, 2).toUpperCase();
                const isChecking = checkingGuildId === guild.id;

                return (
                  <button
                    key={guild.id}
                    type="button"
                    onClick={() => handleGuildSelect(guild)}
                    disabled={isChecking || loading}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{guild.name}</h3>
                          {isChecking && <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">ID: {guild.id}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.guildsPage.membersLabel}: {guild.approximate_member_count ?? '—'}
                      </span>
                      {guild.owner && (
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <ShieldCheck className="h-4 w-4" />
                          {t.guildsPage.ownerLabel}
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
