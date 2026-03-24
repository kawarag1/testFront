import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Shield, 
  Music, 
  Settings, 
  Users, 
  MessageSquare, 
  Bell, 
  ChevronRight,
  Search,
  LogOut,
  Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useI18n } from '../i18n';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { t } = useI18n();

  const servers = [
    { id: 1, name: 'Helper Community', icon: 'HC', members: '12.4k', active: true },
    { id: 2, name: 'Dev Hub', icon: 'DH', members: '1.2k', active: false },
    { id: 3, name: 'Gaming Zone', icon: 'GZ', members: '450', active: false },
  ];

  const menuItems = [
    { id: 'general', name: t.dashboard.menuGeneral, icon: Settings },
    { id: 'mod', name: t.dashboard.menuModeration, icon: Shield },
    { id: 'music', name: t.dashboard.menuMusic, icon: Music },
    { id: 'members', name: t.dashboard.menuMembers, icon: Users },
    { id: 'logs', name: t.dashboard.menuLogs, icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 flex">
        {/* Sidebar */}
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
                    <p className={`text-[10px] ${server.active ? 'text-white/70' : 'text-muted-foreground'}`}>{server.members} {t.dashboard.membersSuffix}</p>
                  </div>
                </button>
              ))}
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

          <div className="mt-auto p-6 border-t border-border">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all text-sm font-bold">
              <LogOut size={18} />
              {t.dashboard.logout}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl font-bold font-serif mb-2">{t.dashboard.generalSettings}</h1>
                <p className="text-muted-foreground">{t.dashboard.configureBasic}</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </button>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  {t.dashboard.saveChanges}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Setting Card 1 */}
              <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare size={20} className="text-primary" />
                    </div>
                    <h3 className="font-bold">{t.dashboard.prefix}</h3>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{t.dashboard.global}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t.dashboard.prefixDescription}</p>
                <input
                  type="text"
                  defaultValue="!"
                  className="w-full bg-secondary/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              {/* Setting Card 2 */}
              <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield size={20} className="text-primary" />
                    </div>
                    <h3 className="font-bold">{t.dashboard.autoMod}</h3>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t.dashboard.autoModDescription}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold">{t.dashboard.spam}</span>
                  <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold">{t.dashboard.links}</span>
                  <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold">{t.dashboard.invites}</span>
                </div>
              </div>

              {/* Setting Card 3 - Full Width */}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;