import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Loader2, Search } from 'lucide-react';
import { useI18n } from '../i18n';
import { apiUrl } from '../config/api';

interface AuditLogsProps {
  guildId: string;
  guildName: string;
}

type MemberActionSchema = {
  username: string;
  avatar_url: string | null;
};

type ActionSchema = {
  id: number;
  user: MemberActionSchema;
  guild_id: number;
  action: string;
  target: MemberActionSchema;
  reason: string;
  details: string;
  created_at: string;
};

type ApiActionPayload = {
  id?: unknown;
  user?: unknown;
  guild_id?: unknown;
  action?: unknown;
  target?: unknown;
  reason?: unknown;
  details?: unknown;
  created_at?: unknown;
};

function toMemberAction(value: unknown): MemberActionSchema {
  if (!value || typeof value !== 'object') {
    return {
      username: '',
      avatar_url: null,
    };
  }

  const raw = value as { username?: unknown; avatar_url?: unknown };

  return {
    username: typeof raw.username === 'string' ? raw.username : '',
    avatar_url: typeof raw.avatar_url === 'string' ? raw.avatar_url : null,
  };
}

function toActionArray(payload: unknown): ActionSchema[] {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { actions?: unknown[] }).actions)
      ? (payload as { actions: unknown[] }).actions
      : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown[] }).data)
        ? (payload as { data: unknown[] }).data
        : [];

  return rawItems
    .filter((item): item is ApiActionPayload => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const parsedId = typeof item.id === 'number' ? item.id : Number(item.id);
      const parsedGuildId = typeof item.guild_id === 'number' ? item.guild_id : Number(item.guild_id);

      return {
        id: Number.isFinite(parsedId) ? parsedId : 0,
        user: toMemberAction(item.user),
        guild_id: Number.isFinite(parsedGuildId) ? parsedGuildId : 0,
        action: typeof item.action === 'string' ? item.action : '',
        target: toMemberAction(item.target),
        reason: typeof item.reason === 'string' ? item.reason : '',
        details: typeof item.details === 'string' ? item.details : '',
        created_at: typeof item.created_at === 'string' ? item.created_at : '',
      };
    })
    .filter((item) => item.id > 0 && item.action.length > 0)
    .sort((a, b) => {
      const left = Date.parse(a.created_at);
      const right = Date.parse(b.created_at);

      if (Number.isNaN(left) || Number.isNaN(right)) {
        return b.id - a.id;
      }

      return right - left;
    });
}

async function fetchAuditLogs(guildId: string): Promise<ActionSchema[]> {
  const response = await fetch(apiUrl(`/api/v1/actions/${encodeURIComponent(String(guildId))}`), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load audit logs: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  return toActionArray(payload);
}

const AuditLogs: React.FC<AuditLogsProps> = ({ guildId, guildName }) => {
  const { t, language } = useI18n();
  const tRef = useRef(t);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<ActionSchema[]>([]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    let cancelled = false;

    const loadAuditLogs = async () => {
      if (!guildId) {
        setActions([]);
        setLoading(false);
        setError(tRef.current.auditLogs.noGuildId);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const nextActions = await fetchAuditLogs(String(guildId));

        if (!cancelled) {
          setActions(nextActions);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : tRef.current.auditLogs.loadError;
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAuditLogs();

    return () => {
      cancelled = true;
    };
  }, [guildId]);

  const filteredActions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch.length === 0) {
      return actions;
    }

    return actions.filter((item) => {
      const actor = item.user.username.toLowerCase();
      const target = item.target.username.toLowerCase();
      const action = item.action.toLowerCase();
      const reason = item.reason.toLowerCase();
      const details = item.details.toLowerCase();

      return (
        actor.includes(normalizedSearch) ||
        target.includes(normalizedSearch) ||
        action.includes(normalizedSearch) ||
        reason.includes(normalizedSearch) ||
        details.includes(normalizedSearch)
      );
    });
  }, [actions, search]);

  const formatDate = (value: string): string => {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    const locale = language === 'ru' ? 'ru-RU' : 'en-US';

    const timePart = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(parsedDate);

    const datePart = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
    }).format(parsedDate);

    return `${timePart}, ${datePart}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold font-serif mb-2">{t.auditLogs.title}: {guildName}</h1>
        <p className="text-muted-foreground">{t.auditLogs.subtitle}</p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder={t.auditLogs.searchPlaceholder}
          className="w-full bg-secondary/50 border border-border rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground text-lg">{t.auditLogs.loading}</p>
        </div>
      )}

      {!loading && error && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-2xl p-6 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredActions.map((item) => {
            const actorName = item.user.username || t.auditLogs.unknownUser;
            const targetName = item.target.username || t.auditLogs.unknownUser;
            const actorFallback = actorName.slice(0, 2).toUpperCase();
            const targetFallback = targetName.slice(0, 2).toUpperCase();

            return (
              <div
                key={item.id}
                className="border border-border rounded-2xl overflow-hidden bg-card p-5 md:p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                      <Activity size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">{item.action}</h3>
                      <p className="text-xs text-muted-foreground truncate">ID: {item.id}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    <p>{t.auditLogs.dateLabel}</p>
                    <p>{formatDate(item.created_at)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/40 border border-border/60">
                    <p className="text-xs text-muted-foreground mb-2">{t.auditLogs.actorLabel}</p>
                    <div className="flex items-center gap-3">
                      {item.user.avatar_url ? (
                        <img
                          src={item.user.avatar_url}
                          alt={actorName}
                          className="w-9 h-9 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                          {actorFallback}
                        </div>
                      )}
                      <p className="font-medium truncate">{actorName}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/40 border border-border/60">
                    <p className="text-xs text-muted-foreground mb-2">{t.auditLogs.targetLabel}</p>
                    <div className="flex items-center gap-3">
                      {item.target.avatar_url ? (
                        <img
                          src={item.target.avatar_url}
                          alt={targetName}
                          className="w-9 h-9 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                          {targetFallback}
                        </div>
                      )}
                      <p className="font-medium truncate">{targetName}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.auditLogs.reasonLabel}</p>
                    <p className="text-sm break-words">{item.reason.trim() || t.auditLogs.noReason}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.auditLogs.detailsLabel}</p>
                    <p className="text-sm break-words">{item.details.trim() || t.auditLogs.noDetails}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredActions.length === 0 && (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">{t.auditLogs.empty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
