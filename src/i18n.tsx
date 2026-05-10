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
    logout: string;
    switchLanguageAria: string;
    signedOutSuccess: string;
    signedOutError: string;
    notAuthorized: string;
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
    aboutDesc: string;
    clearDesc: string;
    createVoiceDesc: string;
    banMembers: string;
    kickMembers: string;
    manageMessages: string;
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
    farewellMessage: string;
    farewellPlaceholder: string;
    selectOtherServer: string;
    commands: string;
    unknownGuild: string;
  };
  guildsPage: {
    title: string;
    subtitle: string;
    loading: string;
    failedToLoadTitle: string;
    noGuildsTitle: string;
    noGuildsDesc: string;
    membersLabel: string;
    memberSingular: string;
    memberPlural2: string;
    memberPlural5: string;
    ownerLabel: string;
    botNotAddedTitle: string;
    botNotAddedMessage: string;
    botNotAddedHint: string;
    cancel: string;
    addBot: string;
    checkStatusError: string;
    loadGuildsError: string;
  };
  callbackPage: {
    authTitle: string;
    pleaseWait: string;
    authErrorTitle: string;
    backHome: string;
    codeNotFound: string;
    emptyResponse: string;
    authFailedPrefix: string;
  };
  commandsManagement: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    commandLabel: string;
    commandDisabled: string;
    commandEnabled: string;
    toggleError: string;
    disableCommandTitle: string;
    enableCommandTitle: string;
    empty: string;
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
      logout: 'Logout',
      switchLanguageAria: 'Switch language',
      signedOutSuccess: 'You have been signed out',
      signedOutError: 'Failed to sign out',
      notAuthorized: 'You are not authorized',
    },
    home: {
      trustedBy: 'The Most Powerful Discord Bot',
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
      helpDesc: 'Shows all bot commands.',
      pingDesc: 'Checks the bot latency.',
      aboutDesc: 'Shows information about the bot.',
      clearDesc: 'Clears messages.',
      createVoiceDesc: 'Creates a temporary voice chat.',
      banMembers: 'Ban Members',
      kickMembers: 'Kick Members',
      manageMessages: 'Manage Messages',
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
      farewellMessage: 'Farewell Message',
      farewellPlaceholder: 'Goodbye, {user}. We hope to see you again!',
      selectOtherServer: 'Select another server',
      commands: 'Commands',
      unknownGuild: 'Unknown Guild',
    },
    guildsPage: {
      title: 'Your Guilds',
      subtitle: 'List of Discord servers you have access to.',
      loading: 'Loading guilds...',
      failedToLoadTitle: 'Failed to fetch guild list',
      noGuildsTitle: 'Guilds not found',
      noGuildsDesc: 'The API returned an empty list for the current user.',
      membersLabel: 'Members',
      memberSingular: 'member',
      memberPlural2: 'members',
      memberPlural5: 'members',
      ownerLabel: 'Owner',
      botNotAddedTitle: 'Bot is not added',
      botNotAddedMessage: 'The bot has not been added to server',
      botNotAddedHint: 'Please add the bot to your server to start using its features.',
      cancel: 'Cancel',
      addBot: 'Add bot',
      checkStatusError: 'Failed to check bot status',
      loadGuildsError: 'Failed to load guilds',
    },
    callbackPage: {
      authTitle: 'Discord Authorization',
      pleaseWait: 'Please wait...',
      authErrorTitle: 'Authorization error',
      backHome: 'Back to home',
      codeNotFound: 'Authorization code not found',
      emptyResponse: 'Empty response from authorization server',
      authFailedPrefix: 'Authorization error',
    },
    commandsManagement: {
      title: 'Commands management',
      subtitle: 'Enable and disable bot commands for your server',
      searchPlaceholder: 'Search commands...',
      commandLabel: 'Command',
      commandDisabled: 'disabled',
      commandEnabled: 'enabled',
      toggleError: 'Failed to toggle command',
      disableCommandTitle: 'Disable command',
      enableCommandTitle: 'Enable command',
      empty: 'No commands found',
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
      logout: 'Выйти',
      switchLanguageAria: 'Сменить язык',
      signedOutSuccess: 'Вы вышли из профиля',
      signedOutError: 'Не удалось выйти из профиля',
      notAuthorized: 'Вы не авторизованы',
    },
    home: {
      trustedBy: 'Сделайте ваш сервер лучше',
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
      helpDesc: 'Показать все команды бота',
      pingDesc: 'Проверяет задержку бота.',
      aboutDesc: 'Показывает информацию о боте.',
      clearDesc: 'Очищает сообщения.',
      createVoiceDesc: 'Создаёт временный голосовой чат.',
      banMembers: 'Бан участников',
      kickMembers: 'Кик участников',
      manageMessages: 'Управление сообщениями',
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
      farewellMessage: 'Прощальное сообщение',
      farewellPlaceholder: 'До встречи, {user}! Будем рады видеть вас снова.',
      selectOtherServer: 'Выбрать другой сервер',
      commands: 'Команды',
      unknownGuild: 'Неизвестный сервер',
    },
    guildsPage: {
      title: 'Ваши гильдии',
      subtitle: 'Список серверов Discord, к которым у вас есть доступ.',
      loading: 'Загружаем гильдии...',
      failedToLoadTitle: 'Не удалось получить список гильдий',
      noGuildsTitle: 'Гильдии не найдены',
      noGuildsDesc: 'API вернул пустой список для текущего пользователя.',
      membersLabel: 'Участников',
      memberSingular: 'участник',
      memberPlural2: 'участника',
      memberPlural5: 'участников',
      ownerLabel: 'Владелец',
      botNotAddedTitle: 'Бот не добавлен',
      botNotAddedMessage: 'Бот не был добавлен на сервер',
      botNotAddedHint: 'Пожалуйста, добавьте бота на ваш сервер, чтобы начать использовать функции бота.',
      cancel: 'Отмена',
      addBot: 'Добавить бота',
      checkStatusError: 'Ошибка проверки статуса бота',
      loadGuildsError: 'Ошибка загрузки гильдий',
    },
    callbackPage: {
      authTitle: 'Авторизация через Discord',
      pleaseWait: 'Пожалуйста, подождите...',
      authErrorTitle: 'Ошибка авторизации',
      backHome: 'Вернуться на главную',
      codeNotFound: 'Код авторизации не найден',
      emptyResponse: 'Пустой ответ от сервера авторизации',
      authFailedPrefix: 'Ошибка авторизации',
    },
    commandsManagement: {
      title: 'Управление командами',
      subtitle: 'Включайте и выключайте команды бота для вашего сервера',
      searchPlaceholder: 'Поиск команд...',
      commandLabel: 'Команда',
      commandDisabled: 'отключена',
      commandEnabled: 'включена',
      toggleError: 'Ошибка при переключении команды',
      disableCommandTitle: 'Отключить команду',
      enableCommandTitle: 'Включить команду',
      empty: 'Команды не найдены',
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
