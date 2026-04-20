import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Shield, Music, Settings, Info, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useI18n } from '../i18n';

const Commands = () => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useI18n();

  const commands = [
    { id: 'ban', name: '/ban', category: 'mod', desc: t.commandsPage.banDesc, usage: '/ban [user] [reason]', permissions: t.commandsPage.banMembers },
    { id: 'kick', name: '/kick', category: 'mod', desc: t.commandsPage.kickDesc, usage: '/kick [user] [reason]', permissions: t.commandsPage.kickMembers },
    { id: 'play', name: '/play', category: 'music', desc: t.commandsPage.playDesc, usage: '/play [query/url]', permissions: t.commandsPage.none },
    { id: 'skip', name: '/skip', category: 'music', desc: t.commandsPage.skipDesc, usage: '/skip', permissions: t.commandsPage.none },
    { id: 'help', name: '/help', category: 'info', desc: t.commandsPage.helpDesc, usage: '/help [command]', permissions: t.commandsPage.none },
    { id: 'ping', name: '/ping', category: 'util', desc: t.commandsPage.pingDesc, usage: '/ping', permissions: t.commandsPage.none },
    { id: 'about', name: '/about', category: 'info', desc: t.commandsPage.aboutDesc, usage: '/about', permissions: t.commandsPage.none },
    { id: 'clear', name: '/clear', category: 'mod', desc: t.commandsPage.clearDesc, usage: '/clear [amount]', permissions: t.commandsPage.manageMessages },
    { id: 'create_voice', name: '/create_voice', category: 'util', desc: t.commandsPage.createVoiceDesc, usage: '/create_voice [name] [user_limit (optional)]', permissions: t.commandsPage.none },
  ];

  const filteredCommands = commands.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">{t.commandsPage.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.commandsPage.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t.commandsPage.searchPlaceholder}
            className="w-full bg-secondary/50 border border-border rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Commands List */}
        <div className="space-y-4">
          {filteredCommands.map((cmd) => (
            <div key={cmd.id} className="border border-border rounded-2xl overflow-hidden bg-card">
              <button
                onClick={() => setExpanded(expanded === cmd.id ? null : cmd.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Terminal size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{cmd.name}</h3>
                    <p className="text-muted-foreground text-sm">{cmd.desc}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expanded === cmd.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === cmd.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-border bg-secondary/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.commandsPage.usage}</h4>
                          <code className="block p-4 bg-background border border-border rounded-xl font-mono text-sm">
                            {cmd.usage}
                          </code>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.commandsPage.permissions}</h4>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Shield size={16} className="text-primary" />
                            {cmd.permissions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Commands;