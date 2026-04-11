import React, { useEffect, useState } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home.tsx';
import Commands from './src/pages/Commands.tsx';
import Dashboard from './src/pages/Dashboard.tsx';
import Callback from './src/pages/Callback.tsx';
import Guilds from './src/pages/Guilds';
import NotFound from './src/pages/NotFound.tsx';
import { I18nProvider } from './src/i18n.tsx';
import { getSessionUser } from './src/utils/auth.ts';

const ProtectedDashboardRoute: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    void getSessionUser().then((user) => setIsAuthorized(Boolean(user)));
  }, []);

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Dashboard />;
};

const ProtectedGuildsRoute: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    void getSessionUser().then((user) => setIsAuthorized(Boolean(user)));
  }, []);

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Guilds />;
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <Theme appearance="light" radius="large" scaling="100%">
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <main className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/dashboard" element={<Navigate to="/guilds" replace />} />
              <Route path="/dashboard/:guildId" element={<ProtectedDashboardRoute />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/guilds" element={<ProtectedGuildsRoute />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </main>
        </Router>
      </Theme>
    </I18nProvider>
  );
}

export default App;