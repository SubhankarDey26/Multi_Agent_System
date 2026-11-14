import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore onConfirm/onCancel functions in confirmState dialog
        ignoredPaths: ['ui.confirmState.onConfirm', 'ui.confirmState.onCancel'],
        ignoredActionPaths: ['payload.onConfirm', 'payload.onCancel'],
      },
    }),
});

export default store;