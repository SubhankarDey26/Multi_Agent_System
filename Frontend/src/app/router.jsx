import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import LoadingState from '../components/common/LoadingState';

const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const ChatWorkspace = lazy(() => import('../features/chat/ChatWorkspace'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingState message="Loading workspace..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/agent/chat" replace />,
      },
      {
        path: 'agent/chat',
        element: (
          <SuspenseWrapper>
            <ChatWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/agent/chat" replace />,
      },
    ],
  },
]);

export default router;