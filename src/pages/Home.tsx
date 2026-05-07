import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Music, Star, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useI18n } from '../i18n';

const Home = () => {
  const { t } = useI18n();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#features') {
      const featuresSection = document.getElementById('features');
      featuresSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const features = [
    { icon: Shield, title: t.home.featureModerationTitle, desc: t.home.featureModerationDesc },
    { icon: Zap, title: t.home.featureFastTitle, desc: t.home.featureFastDesc },
    { icon: Music, title: t.home.featureMusicTitle, desc: t.home.featureMusicDesc },
    { icon: Star, title: t.home.featureCustomTitle, desc: t.home.featureCustomDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8">
                <Sparkles size={16} />
                <span>{t.home.trustedBy}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 tracking-tight leading-tight">
                {t.home.heroTitleTop} <br />
                <span className="text-primary">{t.home.heroTitleAccent}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                {t.home.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1403029892387569766"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 inline-block text-center">
                  {t.nav.addToDiscord} <ChevronRight size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold font-serif mb-4">{t.home.featuresTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.home.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;