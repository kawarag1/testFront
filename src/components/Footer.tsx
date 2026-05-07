import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useI18n } from '../i18n';

const Footer = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFeaturesClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (location.pathname === '/') {
      const featuresSection = document.getElementById('features');
      featuresSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate('/#features');
  };

  return (
    <footer className="bg-secondary/30 border-t border-border pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 mb-16 w-full items-start">
          <div className="w-full text-left">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold font-serif">Helper</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          
          <div className="w-full text-left">
            <h4 className="font-bold mb-6">{t.footer.product}</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="/#features" onClick={handleFeaturesClick} className="hover:text-primary transition-colors">{t.footer.features}</a></li>
              <li><Link to="/commands" className="hover:text-primary transition-colors">{t.footer.commands}</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.premium}</a></li>
            </ul>
          </div>

          <div className="w-full text-left">
            <h4 className="font-bold mb-6">{t.footer.support}</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/commands" className="hover:text-primary transition-colors">{t.footer.documentation}</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.discordServer}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.contactUs}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;