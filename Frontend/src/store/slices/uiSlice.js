import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  return localStorage.getItem('cortex_theme') || 'dark';
};

const getInitialSidebarCollapsed = () => {
  return localStorage.getItem('cortex_sidebar_collapsed') === 'true';
};

const initialState = {
  theme: getInitialTheme(),
  isSidebarCollapsed: getInitialSidebarCollapsed(),
  mobileSidebarOpen: false,
  toast: null,
  confirmState: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      localStorage.setItem('cortex_theme', nextTheme);
      const root = document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('cortex_theme', action.payload);
      const root = document.documentElement;
      if (action.payload === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    },
    toggleSidebarCollapse: (state) => {
      const next = !state.isSidebarCollapsed;
      state.isSidebarCollapsed = next;
      localStorage.setItem('cortex_sidebar_collapsed', String(next));
    },
    setSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
      localStorage.setItem('cortex_sidebar_collapsed', String(action.payload));
    },
    setMobileSidebarOpen: (state, action) => {
      state.mobileSidebarOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        id: Date.now(),
        message: action.payload.message || action.payload,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    openConfirm: (state, action) => {
      state.confirmState = {
        title: action.payload.title,
        message: action.payload.message,
        confirmText: action.payload.confirmText || 'Confirm',
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      };
    },
    closeConfirm: (state) => {
      state.confirmState = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  setMobileSidebarOpen,
  showToast,
  hideToast,
  openConfirm,
  closeConfirm,
} = uiSlice.actions;

export default uiSlice.reducer;