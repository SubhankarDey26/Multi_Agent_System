import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import LoadingState from '../components/common/LoadingState';

const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const ChatWorkspace = lazy(() => import('../features/chat/ChatWorkspace'));
const CodingWorkspace = lazy(() => import('../features/coding/CodingWorkspace'));
const PptWorkspace = lazy(() => import('../features/ppt/PptWorkspace'));
const PdfWorkspace = lazy(() => import('../features/pdf/PdfWorkspace'));
const ImageWorkspace = lazy(() => import('../features/image/ImageWorkspace'));
const SearchWorkspace = lazy(() => import('../features/search/SearchWorkspace'));
const HistoryPage = lazy(() => import('../features/history/HistoryPage'));
const FilesPage = lazy(() => import('../features/files/FilesPage'));
const UsagePage = lazy(() => import('../features/usage/UsagePage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingState message="Loading specialist workspace..." />}>
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
        path: 'agent/coding',
        element: (
          <SuspenseWrapper>
            <CodingWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'agent/ppt',
        element: (
          <SuspenseWrapper>
            <PptWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'agent/pdf',
        element: (
          <SuspenseWrapper>
            <PdfWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'agent/image',
        element: (
          <SuspenseWrapper>
            <ImageWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'agent/search',
        element: (
          <SuspenseWrapper>
            <SearchWorkspace />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'history',
        element: (
          <SuspenseWrapper>
            <HistoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'files',
        element: (
          <SuspenseWrapper>
            <FilesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'usage',
        element: (
          <SuspenseWrapper>
            <UsagePage />
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
