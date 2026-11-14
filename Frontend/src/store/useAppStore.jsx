import React, { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  verifySession,
  processGoogleRedirect,
  logoutUser as logoutUserThunk,
  setUser,
  loginDemo,
  clearUser,
  setLoadingDone,
} from './slices/authSlice';
import {
  toggleTheme as toggleThemeAction,
  setTheme as setThemeAction,
  toggleSidebarCollapse as toggleSidebarCollapseAction,
  setSidebarCollapsed as setSidebarCollapsedAction,
  setMobileSidebarOpen as setMobileSidebarOpenAction,
  showToast as showToastAction,
  hideToast as hideToastAction,
  openConfirm as openConfirmAction,
  closeConfirm as closeConfirmAction,
} from './slices/uiSlice';
import {
  setCurrentConversationId as setCurrentConversationIdAction,
  addMessage as addMessageAction,
  clearMessages as clearMessagesAction,
} from './slices/chatSlice';
import authService from '../services/authService';

/**
 * AppInitializer component runs inside Redux Provider to trigger session verification on boot
 */
const AppInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  // Sync theme class to html/document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // On boot, verify session against backend.
  // If a valid cached user already exists (from redirect result or demo), skip the
  // backend round-trip to avoid clearing the user during the race window.
  const existingUser = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (existingUser) {
      // User already in Redux (from getStoredUser() initial state) — just mark loading done
      dispatch(setLoadingDone());
    } else {
      // No cached user — verify against backend /api/me
      dispatch(verifySession());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

/**
 * AppStoreProvider wraps application with Redux Provider
 */
export const AppStoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
};

/**
 * useAppStore hook provides clean unified access to Redux state and actions
 */
export const useAppStore = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const user = useAppSelector((state) => state.auth.user);
  const isAuthLoading = useAppSelector((state) => state.auth.isAuthLoading);
  const authError = useAppSelector((state) => state.auth.error);

  const theme = useAppSelector((state) => state.ui.theme);
  const isSidebarCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);
  const mobileSidebarOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);
  const toast = useAppSelector((state) => state.ui.toast);
  const confirmState = useAppSelector((state) => state.ui.confirmState);

  const currentConversationId = useAppSelector((state) => state.chat.currentConversationId);
  const messagesMap = useAppSelector((state) => state.chat.messagesMap);

  // Auth Dispatches
  const loginUser = useCallback((userData) => {
    dispatch(setUser(userData));
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
    } catch (err) {
      console.warn('Logout warning:', err);
      dispatch(clearUser());
    }
    return true;
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    return await dispatch(verifySession()).unwrap();
  }, [dispatch]);

  const handleGoogleRedirect = useCallback(async () => {
    return await dispatch(processGoogleRedirect()).unwrap();
  }, [dispatch]);

  // UI Dispatches
  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const setTheme = useCallback((newTheme) => {
    dispatch(setThemeAction(newTheme));
  }, [dispatch]);

  const toggleSidebarCollapse = useCallback(() => {
    dispatch(toggleSidebarCollapseAction());
  }, [dispatch]);

  const setSidebarCollapsed = useCallback((collapsed) => {
    dispatch(setSidebarCollapsedAction(collapsed));
  }, [dispatch]);

  const setMobileSidebarOpen = useCallback((open) => {
    dispatch(setMobileSidebarOpenAction(open));
  }, [dispatch]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    dispatch(showToastAction({ message, type }));
    setTimeout(() => {
      dispatch(hideToastAction());
    }, duration);
  }, [dispatch]);

  const requestConfirm = useCallback(({ title, message, confirmText = 'Confirm', onConfirm }) => {
    dispatch(
      openConfirmAction({
        title,
        message,
        confirmText,
        onConfirm: () => {
          onConfirm?.();
          dispatch(closeConfirmAction());
        },
        onCancel: () => {
          dispatch(closeConfirmAction());
        },
      })
    );
  }, [dispatch]);

  // Chat Dispatches
  const setCurrentConversationId = useCallback((id) => {
    dispatch(setCurrentConversationIdAction(id));
  }, [dispatch]);

  const addMessage = useCallback((conversationId, message) => {
    dispatch(addMessageAction({ conversationId, message }));
  }, [dispatch]);

  const clearMessages = useCallback((conversationId) => {
    dispatch(clearMessagesAction(conversationId));
  }, [dispatch]);

  return {
    // Redux State
    user,
    isAuthLoading,
    authError,
    theme,
    isSidebarCollapsed,
    mobileSidebarOpen,
    toast,
    confirmState,
    currentConversationId,
    messagesMap,

    // Auth Actions
    loginUser,
    logoutUser,
    refreshUser,
    handleGoogleRedirect,
    getCurrentUser: () => authService.getCurrentUser(),

    // UI Actions
    toggleTheme,
    setTheme,
    toggleSidebarCollapse,
    setSidebarCollapsed,
    setMobileSidebarOpen,
    showToast,
    requestConfirm,

    // Chat Actions
    setCurrentConversationId,
    addMessage,
    clearMessages,

    // Raw Redux Dispatch for direct slice actions
    dispatch,
  };
};

export default useAppStore;