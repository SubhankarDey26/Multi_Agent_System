import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CONVERSATIONS, SAMPLE_CHAT_MESSAGES, SAMPLE_CODING_MESSAGES, AGENTS } from '../mocks/mockData';
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
    return authService.getCurrentUser();
  });

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

  // Sidebar states
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

  // Active agent & conversations
  const [activeAgentId, setActiveAgentId] = useState('chat');
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [currentConversationId, setCurrentConversationId] = useState('task-1');

  // Messages repository { [conversationId]: Array<Message> }
  const [messagesMap, setMessagesMap] = useState({
    'task-1': SAMPLE_CHAT_MESSAGES,
    'task-2': SAMPLE_CODING_MESSAGES,
  });

  const createNewTask = (agentId = activeAgentId, customTitle) => {
    const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
    const newId = 'task-' + Date.now();
    const newTask = {
      id: newId,
      agentId: agent.id,
      title: customTitle || `New ${agent.name} Task`,
      dateGroup: 'Today',
      updatedAt: 'Just now',
      messagesCount: 0,
    };

    setConversations((prev) => [newTask, ...prev]);
    setCurrentConversationId(newId);
    setMessagesMap((prev) => ({
      ...prev,
      [newId]: [],
    }));
    return newTask;
  };

  const addMessage = (conversationId, message) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...list, message],
      };
    });
  };

  const updateStreamingMessage = (conversationId, messageId, content) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      const updated = list.map((msg) =>
        msg.id === messageId ? { ...msg, content, isStreaming: true } : msg
      );
      return {
        ...prev,
        [conversationId]: updated,
      };
    });
  };

  const finalizeStreamingMessage = (conversationId, messageId, finalPayload = {}) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      const updated = list.map((msg) =>
        msg.id === messageId ? { ...msg, ...finalPayload, isStreaming: false } : msg
      );
      return {
        ...prev,
        [conversationId]: updated,
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
        loginUser,
        logoutUser,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        activeAgentId,
        setActiveAgentId,
        conversations,
        currentConversationId,
        setCurrentConversationId,
        messagesMap,
        createNewTask,
        addMessage,
        updateStreamingMessage,
        finalizeStreamingMessage,
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
