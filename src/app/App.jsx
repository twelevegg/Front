import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';

import RequireAuth from './RequireAuth.jsx';
import RequireRole from './RequireRole.jsx';
import HomeRedirect from './HomeRedirect.jsx';
import { ROUTES } from './routeConstants.js';

import LoginPage from '../pages/auth/LoginPage.jsx';
import SignUpPage from '../pages/auth/SignUpPage.jsx';
import HomePage from '../pages/HomePage.jsx';

import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage.jsx';
import AssistantDashboardPage from '../pages/dashboards/AssistantDashboardPage.jsx';
import CallHistoryPage from '../pages/CallHistoryPage.jsx';
import CaseLibraryPage from '../pages/CaseLibraryPage.jsx';
import PptTrainingPage from '../pages/training/PptTrainingPage.jsx';
import RolePlayingPage from '../pages/training/RolePlayingPage.jsx';

import AttritionPredictionPage from '../pages/dashboards/AttritionPredictionPage.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import BurnoutAnalysisPage from '../pages/dashboards/BurnoutAnalysisPage.jsx';

import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* Public Routes with Animation */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      </Route>
      {/* ✅ 개인정보처리방침은 로그인 없이 접근 가능해야 함 */}
      <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />

      {/* Protected */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >


        <Route
          path={ROUTES.DASH_ADMIN}
          element={
            <RequireRole allow={['admin']}>
              <AdminDashboardPage />
            </RequireRole>
          }
        />

        {/* Admin Analysis Routes */}
        <Route
          path={ROUTES.ADMIN_ATTRITION}
          element={
            <RequireRole allow={['admin']}>
              <AttritionPredictionPage />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN_BURNOUT}
          element={
            <RequireRole allow={['admin']}>
              <BurnoutAnalysisPage />
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
