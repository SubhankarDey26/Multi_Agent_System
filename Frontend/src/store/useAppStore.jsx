import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AppStoreContext = createContext(null);

export const AppStoreProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cortex_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('cortex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth state
  const [user, setUser] = useState(() => {
    return authService.getStoredUser();
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Automatic session verification via Backend Gateway API (/api/me)
  // Backend protect middleware verifies the session in Redis (7-Day TTL)
  useEffect(() => {
    let isMounted = true;
    const verifyUserSession = async () => {
      try {
        const remoteUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(remoteUser);
        }
      } catch (err) {
        console.warn('Backend session verification warning:', err);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    verifyUserSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    setUser(null);
  };

  const refreshUser = async () => {
    setIsAuthLoading(true);
    try {
      const updated = await authService.getCurrentUser();
      setUser(updated);
      return updated;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cortex_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('cortex_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Workspace conversations & messages state (persisted across page refresh)
  const [currentConversationId, setCurrentConversationId] = useState(() => {
    return localStorage.getItem('cortex_current_task_id') || 'workspace-main';
  });

  useEffect(() => {
    localStorage.setItem('cortex_current_task_id', currentConversationId);
  }, [currentConversationId]);

  const [messagesMap, setMessagesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('cortex_messages_map');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn('Failed to parse cortex_messages_map:', err);
    }
    return {
      'workspace-main': [],
    };
  });

  useEffect(() => {
    localStorage.setItem('cortex_messages_map', JSON.stringify(messagesMap));
  }, [messagesMap]);

  const addMessage = (conversationId, message) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...list, message],
      };
    });
  };

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Confirm Dialog System
  const [confirmState, setConfirmState] = useState(null);
  const requestConfirm = ({ title, message, confirmText = 'Confirm', onConfirm }) => {
    setConfirmState({
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmState(null);
      },
      onCancel: () => setConfirmState(null),
    });
  };

  return (
    <AppStoreContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        setUser,
        isAuthLoading,
        loginUser,
        logoutUser,
        refreshUser,
        getCurrentUser: () => authService.getCurrentUser(),
        isSidebarCollapsed,
        toggleSidebarCollapse,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        currentConversationId,
        setCurrentConversationId,
        messagesMap,
        addMessage,
        toast,
        showToast,
        confirmState,
        requestConfirm,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};

export default useAppStore;