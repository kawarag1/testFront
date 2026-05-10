import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Users, Loader2, Ban, UserX } from 'lucide-react';
import { useI18n } from '../i18n';
import { apiUrl } from '../config/api';

interface MembersManagementProps {
  guildId: string;
  guildName: string;
}

interface GuildMember {
  id: string;
  username: string;
  avatar_url?: string | null;
  roles: Array<string | number>;
}

type ApiMemberPayload = {
  id?: unknown;
  username?: unknown;
  avatar_url?: unknown;
  roles?: unknown;
};

function toMemberArray(payload: unknown): GuildMember[] {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { members?: unknown[] }).members)
      ? (payload as { members: unknown[] }).members
      : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown[] }).data)
        ? (payload as { data: unknown[] }).data
        : [];

  return rawItems
    .filter((item): item is ApiMemberPayload => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const id = typeof item.id === 'string' ? item.id : String(item.id ?? '');
      const username = typeof item.username === 'string' ? item.username : '';

      return {
        id,
        username,
        avatar_url: typeof item.avatar_url === 'string' ? item.avatar_url : null,
        roles: Array.isArray(item.roles) ? (item.roles as Array<string | number>) : [],
      };
    })
    .filter((member) => member.id.length > 0 && member.username.length > 0);
}

async function fetchMembers(guildId: string): Promise<GuildMember[]> {
  const response = await fetch(apiUrl(`/api/v1/guilds/guilds/${guildId}/members`), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load members: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  return toMemberArray(payload);
}

type MemberAction = 'ban' | 'kick';

const MembersManagement: React.FC<MembersManagementProps> = ({ guildId, guildName }) => {
  const { t } = useI18n();
  const tRef = useRef(t);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    let cancelled = false;

    const loadMembers = async () => {
      if (!guildId) {
        setMembers([]);
        setLoading(false);
        setError(tRef.current.membersManagement.noGuildId);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const nextMembers = await fetchMembers(String(guildId));

        if (!cancelled) {
          setMembers(nextMembers);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : tRef.current.membersManagement.loadError;
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [guildId]);

  const filteredMembers = useMemo(
    () => members.filter((member) => member.username.toLowerCase().includes(search.toLowerCase())),
    [members, search],
  );

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold font-serif mb-2">{t.membersManagement.title}: {guildName}</h1>
        <p className="text-muted-foreground">{t.membersManagement.subtitle}</p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder={t.membersManagement.searchPlaceholder}
          className="w-full bg-secondary/50 border border-border rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground text-lg">{t.membersManagement.loading}</p>
        </div>
      )}

      {!loading && error && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-2xl p-6 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredMembers.map((member) => {
            const avatarFallback = member.username.slice(0, 2).toUpperCase();

            return (
              <div
                key={member.id}
                className="border border-border rounded-2xl overflow-hidden bg-card p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.username}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {avatarFallback}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">{member.username}</h3>
                    <p className="text-xs text-muted-foreground truncate">ID: {member.id}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.membersManagement.rolesLabel}:{' '}
                      {member.roles.length > 0 ? member.roles.map(String).join(', ') : t.membersManagement.noRoles}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 text-red-400"
                  >
                    <Ban size={16} />
                    {t.membersManagement.banAction}
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400"
                  >
                    <UserX size={16} />
                    {t.membersManagement.kickAction}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">{t.membersManagement.empty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MembersManagement;