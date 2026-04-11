import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'ru';

type Dictionary = {
  nav: {
    home: string;
    commands: string;
    dashboard: string;
    addToDiscord: string;
    authorize: string;
    myServers: string;
  };
  home: {
    trustedBy: string;
    heroTitleTop: string;
    heroTitleAccent: string;
    heroDescription: string;
    viewDashboard: string;
    ecosystem: string;
    featuresTitle: string;
    featuresSubtitle: string;
    featureModerationTitle: string;
    featureModerationDesc: string;
    featureFastTitle: string;
    featureFastDesc: string;
    featureMusicTitle: string;
    featureMusicDesc: string;
    featureCustomTitle: string;
    featureCustomDesc: string;
  };
  footer: {
    description: string;
    product: string;
    features: string;
    commands: string;
    premium: string;
    support: string;
    documentation: string;
    discordServer: string;
    contactUs: string;
    social: string;
    rights: string;
    privacy: string;
    terms: string;
  };
  commandsPage: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    usage: string;
    permissions: string;
    categoryModeration: string;
    categoryMusic: string;
    categoryUtility: string;
    categoryInformation: string;
    banDesc: string;
    kickDesc: string;
    playDesc: string;
    skipDesc: string;
    helpDesc: string;
    pingDesc: string;
    banMembers: string;
    kickMembers: string;
    none: string;
  };
  dashboard: {
    searchServers: string;
    yourServers: string;
    membersSuffix: string;
    settings: string;
    menuGeneral: string;
    menuModeration: string;
    menuMusic: string;
    menuMembers: string;
    menuLogs: string;
    logout: string;
    generalSettings: string;
    configureBasic: string;
    saveChanges: string;
    prefix: string;
    global: string;
    prefixDescription: string;
    autoMod: string;
    autoModDescription: string;
    spam: string;
    links: string;
    invites: string;
    welcomeMessage: string;
    welcomePlaceholder: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
};

const dictionaries: Record<Language, Dictionary> = {
  en: {
    nav: {
      home: 'Home',
      commands: 'Commands',
      dashboard: 'Dashboard',
      addToDiscord: 'Add to Discord',
      authorize: 'Authorize',
      myServers: 'My Servers',
    },
    home: {
      trustedBy: 'Trusted by 50,000+ Servers',
      heroTitleTop: 'The Ultimate Assistant',
      heroTitleAccent: 'For Your Community',
      heroDescription: 'Helper brings professional-grade moderation, entertainment, and utility tools to your Discord server in one powerful package.',
      viewDashboard: 'View Dashboard',
      ecosystem: 'Part of the Helper Ecosystem',
      featuresTitle: 'Everything you need',
      featuresSubtitle: 'Powerful features designed for modern communities.',
      featureModerationTitle: 'Advanced Moderation',
      featureModerationDesc: 'Keep your community safe with automated filters and logging.',
      featureFastTitle: 'Lightning Fast',
      featureFastDesc: 'Built on high-performance infrastructure for zero-latency responses.',
      featureMusicTitle: 'Crystal Clear Audio',
      featureMusicDesc: 'High-quality music streaming with support for all major platforms.',
      featureCustomTitle: 'Customizable',
      featureCustomDesc: 'Tailor every aspect of the bot to fit your server\'s unique needs.',
    },
    footer: {
      description: 'The most advanced multipurpose bot for your Discord community. Moderation, music, and more.',
      product: 'Product',
      features: 'Features',
      commands: 'Commands',
      premium: 'Premium',
      support: 'Support',
      documentation: 'Documentation',
      discordServer: 'Discord Server',
      contactUs: 'Contact Us',
      social: 'Social',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    commandsPage: {
      title: 'Bot Commands',
      subtitle: 'Explore the full list of Helper commands. Click on any command to see detailed usage and permissions.',
      searchPlaceholder: 'Search commands...',
      usage: 'Usage',
      permissions: 'Permissions',
      categoryModeration: 'Moderation',
      categoryMusic: 'Music',
      categoryUtility: 'Utility',
      categoryInformation: 'Information',
      banDesc: 'Bans a user from the server.',
      kickDesc: 'Kicks a user from the server.',
      playDesc: 'Plays a song from YouTube or Spotify.',
      skipDesc: 'Skips the current song.',
      helpDesc: 'Shows the help menu.',
      pingDesc: 'Checks the bot latency.',
      banMembers: 'Ban Members',
      kickMembers: 'Kick Members',
      none: 'None',
    },
    dashboard: {
      searchServers: 'Search servers...',
      yourServers: 'Your Servers',
      membersSuffix: 'members',
      settings: 'Settings',
      menuGeneral: 'General Settings',
      menuModeration: 'Moderation',
      menuMusic: 'Music Player',
      menuMembers: 'Member Management',
      menuLogs: 'Audit Logs',
      logout: 'Logout',
      generalSettings: 'General Settings',
      configureBasic: 'Configure the basic behavior of Helper in your server.',
      saveChanges: 'Save Changes',
      prefix: 'Prefix',
      global: 'Global',
      prefixDescription: 'The character used to trigger bot commands.',
      autoMod: 'Auto-Mod',
      autoModDescription: 'Automatically filter spam and malicious links.',
      spam: 'Spam',
      links: 'Links',
      invites: 'Invites',
      welcomeMessage: 'Welcome Message',
      welcomePlaceholder: 'Welcome to the server, {user}!',
    },
    notFound: {
      title: 'OOPS! Page Not Found',
      description: 'We can\'t seem to find the page you are looking for!',
      backHome: 'Back to homepage',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      commands: 'Команды',
      dashboard: 'Панель',
      addToDiscord: 'Добавить в Discord',
      authorize: 'Авторизоваться',
      myServers: 'Мои серверы',
    },
    home: {
      trustedBy: 'Нам доверяют 50 000+ серверов',
      heroTitleTop: 'Лучший помощник',
      heroTitleAccent: 'Для вашего сообщества',
      heroDescription: 'Helper объединяет профессиональную модерацию, развлечения и полезные инструменты для вашего Discord-сервера в одном мощном решении.',
      viewDashboard: 'Открыть панель',
      ecosystem: 'Часть экосистемы Helper',
      featuresTitle: 'Все, что вам нужно',
      featuresSubtitle: 'Мощные функции для современных сообществ.',
      featureModerationTitle: 'Продвинутая модерация',
      featureModerationDesc: 'Защитите сообщество с помощью автоматических фильтров и логирования.',
      featureFastTitle: 'Молниеносная скорость',
      featureFastDesc: 'Высокопроизводительная инфраструктура для откликов без задержек.',
      featureMusicTitle: 'Кристально чистый звук',
      featureMusicDesc: 'Качественный музыкальный стриминг с поддержкой популярных платформ.',
      featureCustomTitle: 'Гибкая настройка',
      featureCustomDesc: 'Настройте каждый аспект бота под уникальные задачи вашего сервера.',
    },
    footer: {
      description: 'Самый продвинутый многофункциональный бот для вашего Discord-сообщества. Модерация, музыка и многое другое.',
      product: 'Продукт',
      features: 'Возможности',
      commands: 'Команды',
      premium: 'Премиум',
      support: 'Поддержка',
      documentation: 'Документация',
      discordServer: 'Discord-сервер',
      contactUs: 'Связаться с нами',
      social: 'Соцсети',
      rights: 'Все права защищены.',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
    },
    commandsPage: {
      title: 'Команды бота',
      subtitle: 'Изучите полный список команд Helper. Нажмите на любую команду, чтобы увидеть использование и права доступа.',
      searchPlaceholder: 'Поиск команд...',
      usage: 'Использование',
      permissions: 'Права доступа',
      categoryModeration: 'Модерация',
      categoryMusic: 'Музыка',
      categoryUtility: 'Утилиты',
      categoryInformation: 'Информация',
      banDesc: 'Блокирует пользователя на сервере.',
      kickDesc: 'Исключает пользователя с сервера.',
      playDesc: 'Воспроизводит трек из YouTube или Spotify.',
      skipDesc: 'Пропускает текущий трек.',
      helpDesc: 'Показывает меню помощи.',
      pingDesc: 'Проверяет задержку бота.',
      banMembers: 'Бан участников',
      kickMembers: 'Кик участников',
      none: 'Не требуется',
    },
    dashboard: {
      searchServers: 'Поиск серверов...',
      yourServers: 'Ваши серверы',
      membersSuffix: 'участников',
      settings: 'Настройки',
      menuGeneral: 'Общие настройки',
      menuModeration: 'Модерация',
      menuMusic: 'Музыкальный плеер',
      menuMembers: 'Управление участниками',
      menuLogs: 'Журнал аудита',
      logout: 'Выйти',
      generalSettings: 'Общие настройки',
      configureBasic: 'Настройте базовое поведение Helper на вашем сервере.',
      saveChanges: 'Сохранить изменения',
      prefix: 'Префикс',
      global: 'Глобально',
      prefixDescription: 'Символ для запуска команд бота.',
      autoMod: 'Авто-модерация',
      autoModDescription: 'Автоматически фильтрует спам и вредоносные ссылки.',
      spam: 'Спам',
      links: 'Ссылки',
      invites: 'Приглашения',
      welcomeMessage: 'Приветственное сообщение',
      welcomePlaceholder: 'Добро пожаловать на сервер, {user}!',
    },
    notFound: {
      title: 'УПС! Страница не найдена',
      description: 'Похоже, мы не можем найти страницу, которую вы ищете!',
      backHome: 'Вернуться на главную',
    },
  },
};

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem('language');
    if (storedLanguage === 'en' || storedLanguage === 'ru') {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem('language', nextLanguage);
  };

  const value = useMemo(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
};
