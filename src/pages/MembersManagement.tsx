import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Users, Loader2, Ban, UserX } from 'lucide-react';
import { toast } from 'react-toastify';
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
  const response = await fetch(apiUrl(`/api/v1/guilds/${guildId}/members`), {
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

type KickPayload = {
  delete_user_messages: boolean;
  reason: string;
};

type BanPayload = {
  delete_user_messages: boolean;
  reason: string;
};

async function kickMember(guildId: string, userId: string, payload: KickPayload): Promise<void> {
  const response = await fetch(apiUrl(`/api/v1/guilds/${encodeURIComponent(String(guildId))}/members/${encodeURIComponent(String(userId))}`), {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let backendMessage = '';

    try {
      const responsePayload = (await response.json()) as { detail?: unknown };
      backendMessage = typeof responsePayload.detail === 'string' ? responsePayload.detail : '';
    } catch {
      backendMessage = '';
    }

    throw new Error(
      backendMessage
        ? `Failed to kick member: ${response.status} (${backendMessage})`
        : `Failed to kick member: ${response.status}`,
    );
  }
}

async function banMember(guildId: string, userId: string, payload: BanPayload): Promise<void> {
  const response = await fetch(apiUrl(`/api/v1/guilds/${encodeURIComponent(String(guildId))}/bans/${encodeURIComponent(String(userId))}`), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let backendMessage = '';

    try {
      const responsePayload = (await response.json()) as { detail?: unknown };
      backendMessage = typeof responsePayload.detail === 'string' ? responsePayload.detail : '';
    } catch {
      backendMessage = '';
    }

    throw new Error(
      backendMessage
        ? `Failed to ban member: ${response.status} (${backendMessage})`
        : `Failed to ban member: ${response.status}`,
    );
  }
}

const MembersManagement: React.FC<MembersManagementProps> = ({ guildId, guildName }) => {
  const { t } = useI18n();
  const tRef = useRef(t);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [banModalMember, setBanModalMember] = useState<GuildMember | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDeleteUserMessages, setBanDeleteUserMessages] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [kickModalMember, setKickModalMember] = useState<GuildMember | null>(null);
  const [kickReason, setKickReason] = useState('');
  const [isKicking, setIsKicking] = useState(false);

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

  const openKickModal = (member: GuildMember) => {
    setKickModalMember(member);
    setKickReason('');
  };

  const openBanModal = (member: GuildMember) => {
    setBanModalMember(member);
    setBanReason('');
    setBanDeleteUserMessages(false);
  };

  const closeKickModal = () => {
    if (isKicking) {
      return;
    }

    setKickModalMember(null);
    setKickReason('');
  };

  const closeBanModal = () => {
    if (isBanning) {
      return;
    }

    setBanModalMember(null);
    setBanReason('');
    setBanDeleteUserMessages(false);
  };

  const handleBanConfirm = async () => {
    const trimmedReason = banReason.trim();

    if (!banModalMember || trimmedReason.length === 0) {
      return;
    }

    setIsBanning(true);

    try {
      await banMember(String(guildId), String(banModalMember.id), {
        delete_user_messages: banDeleteUserMessages,
        reason: trimmedReason,
      });

      setMembers((currentMembers) => currentMembers.filter((member) => member.id !== banModalMember.id));

      toast.success(t.membersManagement.banSuccess.replace('{username}', banModalMember.username));
      setBanModalMember(null);
      setBanReason('');
      setBanDeleteUserMessages(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : t.membersManagement.actionError;
      toast.error(message);
    } finally {
      setIsBanning(false);
    }
  };

  const handleKickConfirm = async () => {
    const trimmedReason = kickReason.trim();

    if (!kickModalMember || trimmedReason.length === 0) {
      return;
    }

    setIsKicking(true);

    try {
      await kickMember(String(guildId), String(kickModalMember.id), {
        delete_user_messages: false,
        reason: trimmedReason,
      });

      setMembers((currentMembers) => currentMembers.filter((member) => member.id !== kickModalMember.id));

      toast.success(t.membersManagement.kickSuccess.replace('{username}', kickModalMember.username));
      setKickModalMember(null);
      setKickReason('');
    } catch (e) {
      const message = e instanceof Error ? e.message : t.membersManagement.actionError;
      toast.error(message);
    } finally {
      setIsKicking(false);
    }
  };

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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/25 hover:shadow-md active:translate-y-0"
                    onClick={() => openBanModal(member)}
                  >
                    <Ban size={16} />
                    {t.membersManagement.banAction}
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-500/25 hover:shadow-md active:translate-y-0"
                    onClick={() => openKickModal(member)}
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

      {kickModalMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-2">{t.membersManagement.kickModalTitle}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t.membersManagement.kickModalDescription.replace('{username}', kickModalMember.username)}
            </p>

            <label className="block text-sm font-medium mb-2" htmlFor="kick-reason-input">
              {t.membersManagement.kickReasonLabel}
            </label>
            <textarea
              id="kick-reason-input"
              rows={4}
              value={kickReason}
              onChange={(e) => setKickReason(e.target.value)}
              placeholder={t.membersManagement.kickReasonPlaceholder}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm mb-5 resize-none"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeKickModal}
                disabled={isKicking}
                className="px-4 py-2 rounded-lg border border-border transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {t.membersManagement.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleKickConfirm}
                disabled={isKicking || kickReason.trim().length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-500/25 hover:shadow-sm active:translate-y-0 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isKicking ? <Loader2 size={16} className="animate-spin" /> : <UserX size={16} />}
                {t.membersManagement.kickAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {banModalMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-2">{t.membersManagement.banModalTitle}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t.membersManagement.banModalDescription.replace('{username}', banModalMember.username)}
            </p>

            <label className="block text-sm font-medium mb-2" htmlFor="ban-reason-input">
              {t.membersManagement.banReasonLabel}
            </label>
            <textarea
              id="ban-reason-input"
              rows={4}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder={t.membersManagement.banReasonPlaceholder}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm mb-4 resize-none"
            />

            <label className="flex items-start gap-3 mb-5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={banDeleteUserMessages}
                onChange={(e) => setBanDeleteUserMessages(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border bg-secondary accent-primary focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">{t.membersManagement.banDeleteMessagesLabel}</span>
            </label>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeBanModal}
                disabled={isBanning}
                className="px-4 py-2 rounded-lg border border-border transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {t.membersManagement.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleBanConfirm}
                disabled={isBanning || banReason.trim().length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/25 hover:shadow-sm active:translate-y-0 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isBanning ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                {t.membersManagement.banAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;