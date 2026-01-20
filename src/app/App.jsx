import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';

import RequireAuth from './RequireAuth.jsx';
import RequireRole from './RequireRole.jsx';
import HomeRedirect from './HomeRedirect.jsx';
import { ROUTES } from './routeConstants.js';

import LoginPage from '../pages/auth/LoginPage.jsx';
import SignUpPage from '../pages/auth/SignUpPage.jsx';

import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage.jsx';
import AssistantDashboardPage from '../pages/dashboards/AssistantDashboardPage.jsx';
import CallHistoryPage from '../pages/CallHistoryPage.jsx';
import CaseLibraryPage from '../pages/CaseLibraryPage.jsx';
import PptTrainingPage from '../pages/training/PptTrainingPage.jsx';
import RolePlayingPage from '../pages/training/RolePlayingPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />

      {/* Protected */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<HomeRedirect />} />

        <Route
          path={ROUTES.DASH_ADMIN}
          element={
            <RequireRole allow={['admin']}>
              <AdminDashboardPage />
            </RequireRole>
          }
        />
      
        <Route path={ROUTES.DASH_ASSISTANT} element={<AssistantDashboardPage />} />
        <Route path={ROUTES.CALL_HISTORY} element={<CallHistoryPage />} />
        <Route path={ROUTES.CASE_LIBRARY} element={<CaseLibraryPage />} />
        <Route path={ROUTES.TRAIN_PPT} element={<PptTrainingPage />} />
        <Route path={ROUTES.TRAIN_ROLEPLAY} element={<RolePlayingPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
