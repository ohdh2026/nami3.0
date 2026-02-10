
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FerryProvider, useFerry } from './store/context';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogEntry from './pages/LogEntry';
import LogHistory from './pages/LogHistory';
import UserManagement from './pages/UserManagement';
import TelegramConfigPage from './pages/TelegramConfig';

const AppRoutes: React.FC = () => {
  const { currentUser } = useFerry();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Captain/Engineer restricted landing
  const isFieldStaff = currentUser.role === '선장' || currentUser.role === '기관장';

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entry" element={<LogEntry />} />
        <Route path="/history" element={<LogHistory />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/telegram" element={<TelegramConfigPage />} />
        <Route path="*" element={<Navigate to={isFieldStaff ? "/entry" : "/dashboard"} replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <FerryProvider>
        <AppRoutes />
      </FerryProvider>
    </Router>
  );
};

export default App;
