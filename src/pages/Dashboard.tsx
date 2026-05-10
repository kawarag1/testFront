import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Music, 
  Settings, 
  Users, 
  ChevronRight,
  Search,
  LogOut,
  Activity,
  Terminal
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CommandsManagement from './CommandsManagement.tsx';
import { useI18n } from '../i18n';

type Guild = {
  id: string;
  name: string;
  icon_url?: string | null;
  owner?: boolean;
  approximate_member_count?: number;
};

type DashboardLocationState = {
  guild?: Guild;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { guildId } = useParams();
  const location = useLocation();
  const { t } = useI18n();

  const pluralizeMembers = (count: number | undefined): string => {
    if (count === undefined || count === null) return '—';
    
    const num = count % 100;
    if (num >= 11 && num <= 14) return `${count} участников`;
    
    const lastDigit = count % 10;
    if (lastDigit === 1) return `${count} участник`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${count} участника`;
    
    return `${count} участников`;
  };

  const locationState = location.state as DashboardLocationState | null;

  let selectedGuild: Guild | null = locationState?.guild ?? null;

  if (!selectedGuild) {
    const storedGuild = window.localStorage.getItem('selectedGuild');
    if (storedGuild) {
      try {
        const parsed = JSON.parse(storedGuild) as Guild;
        if (!guildId || parsed.id === guildId) {
          selectedGuild = parsed;
        }
      } catch {
        selectedGuild = null;
      }
    }
  }

  const activeGuildName = selectedGuild?.name || guildId || t.dashboard.unknownGuild;

  const servers = [
    {
      id: selectedGuild?.id || guildId || 'selected',
      name: activeGuildName,
      icon: activeGuildName.slice(0, 2).toUpperCase(),
      members: pluralizeMembers(selectedGuild?.approximate_member_count),
      active: true,
    },
  ];

  const menuItems = [
    { id: 'general', name: t.dashboard.menuGeneral, icon: Settings },
    { id: 'music', name: t.dashboard.menuMusic, icon: Music },
    { id: 'members', name: t.dashboard.menuMembers, icon: Users },
    { id: 'logs', name: t.dashboard.menuLogs, icon: Activity },
    { id: 'commands', name: t.dashboard.commands, icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 flex">
        <aside className="w-72 border-r border-border hidden lg:flex flex-col bg-secondary/10">
          <div className="p-6">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder={t.dashboard.searchServers}
                className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            <div className="space-y-2 mb-12">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-4">{t.dashboard.yourServers}</p>
              {servers.map(server => (
                <button
                  key={server.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${server.active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-secondary'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${server.active ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                    {server.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold truncate">{server.name}</p>
                    <p className={`text-[10px] ${server.active ? 'text-white/70' : 'text-muted-foreground'}`}>{server.members}</p>
                  </div>
                </button>
              ))}
              <Link
                to="/guilds"
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl mt-3 text-sm font-medium bg-secondary/50 hover:bg-secondary transition-all"
              >
                {t.dashboard.selectOtherServer}
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-4">{t.dashboard.settings}</p>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="max-w-4xl mx-auto">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl font-bold font-serif mb-2">{t.dashboard.generalSettings}: {activeGuildName}</h1>
                  <p className="text-muted-foreground">{t.dashboard.configureBasic}</p>
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  {t.dashboard.saveChanges}
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm">
                  <h3 className="font-bold mb-6">{t.dashboard.welcomeMessage}</h3>
                  <textarea
                    rows={4}
                    placeholder={t.dashboard.welcomePlaceholder}
                    className="w-full bg-secondary/50 border border-border rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary/50 outline-none resize-none mb-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['{user}', '{server}', '{member_count}', '{owner}'].map(tag => (
                      <button key={tag} className="px-3 py-1 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-xs font-mono">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm">
                  <h3 className="font-bold mb-6">{t.dashboard.farewellMessage}</h3>
                  <textarea
                    rows={4}
                    placeholder={t.dashboard.farewellPlaceholder}
                    className="w-full bg-secondary/50 border border-border rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary/50 outline-none resize-none mb-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['{user}', '{server}', '{member_count}', '{owner}'].map(tag => (
                      <button key={tag} className="px-3 py-1 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-xs font-mono">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'commands' && (
            <CommandsManagement guildId={guildId || ''} guildName={activeGuildName} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;