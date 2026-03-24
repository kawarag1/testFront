import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home.tsx';
import Commands from './src/pages/Commands.tsx';
import Dashboard from './src/pages/Dashboard.tsx';
import NotFound from './src/pages/NotFound.tsx';
import { I18nProvider } from './src/i18n.tsx';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <Theme appearance="light" radius="large" scaling="100%">
        <Router>
          <main className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/dashboard" element={<Dashboard />} />
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