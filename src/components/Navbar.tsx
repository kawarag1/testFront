import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ChevronRight, LayoutDashboard, BookOpen, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDiscordLogin = () => {
    const clientId = '1403029892387569766';
    const redirectUri = encodeURIComponent('http://185.92.72.38:5173//callback');
    const scope = 'identify+guilds';
    
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = discordAuthUrl;
  };

  const navLinks = [
    { name: t.nav.home, path: '/', icon: HomeIcon },
    { name: t.nav.commands, path: '/commands', icon: BookOpen },
    { name: t.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Bot className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-serif">Helper</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            className="bg-secondary border border-border text-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-all"
            aria-label="Switch language"
          >
            {language === 'en' ? 'RU' : 'EN'}
          </button>
          <button
            onClick={handleDiscordLogin}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer border-0">
            {t.nav.addToDiscord}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            className="bg-secondary border border-border px-3 py-1.5 rounded-full text-xs font-bold"
            aria-label="Switch language"
          >
            {language === 'en' ? 'RU' : 'EN'}
          </button>
          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={20} className="text-primary" />
                    <span className="font-medium">{link.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
              ))}
              <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold mt-2">
                {t.nav.addToDiscord}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;