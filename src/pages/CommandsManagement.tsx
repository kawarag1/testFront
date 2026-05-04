import React, { useState } from 'react';
import { Search, Terminal, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useI18n } from '../i18n';
import { apiUrl } from '../config/api';

interface CommandsManagementProps {
  guildId: string;
  guildName: string;
}

interface Command {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
}

const CommandsManagement: React.FC<CommandsManagementProps> = ({ guildId, guildName }) => {
  const [search, setSearch] = useState('');
  const [togglingCommandId, setTogglingCommandId] = useState<string | null>(null);
  const { t } = useI18n();

  // List of commands with their states (initially all enabled)
  const [commands, setCommands] = useState<Command[]>([
    { id: 'ban', name: '/ban', desc: t.commandsPage.banDesc, enabled: true },
    { id: 'kick', name: '/kick', desc: t.commandsPage.kickDesc, enabled: true },
    { id: 'play', name: '/play', desc: t.commandsPage.playDesc, enabled: true },
    { id: 'skip', name: '/skip', desc: t.commandsPage.skipDesc, enabled: true },
    { id: 'help', name: '/help', desc: t.commandsPage.helpDesc, enabled: true },
    { id: 'ping', name: '/ping', desc: t.commandsPage.pingDesc, enabled: true },
    { id: 'about', name: '/about', desc: t.commandsPage.aboutDesc, enabled: true },
    { id: 'clear', name: '/clear', desc: t.commandsPage.clearDesc, enabled: true },
    { id: 'create_voice', name: '/create_voice', desc: t.commandsPage.createVoiceDesc, enabled: true },
  ]);

  const filteredCommands = commands.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCommand = async (command: Command) => {
    setTogglingCommandId(command.id);

    try {
      const endpoint = command.enabled ? '/api/v1/commands/disable' : '/api/v1/commands/enable';

      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          guild_id: parseInt(guildId, 10) || guildId,
          command_name: command.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle command: ${response.status}`);
      }

      // Update local state
      setCommands(commands.map(c =>
        c.id === command.id ? { ...c, enabled: !c.enabled } : c
      ));

      const action = command.enabled ? 'отключена' : 'включена';
      toast.success(`Команда ${command.name} ${action}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при переключении команды';
      toast.error(message);
      console.error('Error toggling command:', error);
    } finally {
      setTogglingCommandId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold font-serif mb-2">Управление командами: {guildName}</h1>
        <p className="text-muted-foreground">Включайте и выключайте команды бота для вашего сервера</p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Поиск команд..."
          className="w-full bg-secondary/50 border border-border rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Commands List */}
      <div className="space-y-4">
        {filteredCommands.map((cmd) => (
          <div
            key={cmd.id}
            className="border border-border rounded-2xl overflow-hidden bg-card p-6 flex items-center justify-between hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Terminal size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{cmd.name}</h3>
                <p className="text-muted-foreground text-sm">{cmd.desc}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => toggleCommand(cmd)}
              disabled={togglingCommandId === cmd.id}
              className="ml-4 flex-shrink-0 relative inline-flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {togglingCommandId === cmd.id && (
                <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin text-primary" />
              )}
              <input
                type="checkbox"
                checked={cmd.enabled}
                onChange={() => {}}
                disabled={togglingCommandId === cmd.id}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-primary"></div>
            </button>
          </div>
        ))}

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <Terminal size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Команды не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandsManagement;
