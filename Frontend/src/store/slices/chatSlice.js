import { createSlice } from '@reduxjs/toolkit';

const getInitialTaskId = () => {
  return localStorage.getItem('cortex_current_task_id') || 'workspace-main';
};

const getInitialMessages = () => {
  try {
    const saved = localStorage.getItem('cortex_messages_map');
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Failed to parse cortex_messages_map from localStorage:', err);
  }
  return {
    'workspace-main': [],
  };
};

const initialState = {
  currentConversationId: getInitialTaskId(),
  messagesMap: getInitialMessages(),
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
      localStorage.setItem('cortex_current_task_id', action.payload);
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messagesMap[conversationId]) {
        state.messagesMap[conversationId] = [];
      }
      state.messagesMap[conversationId].push(message);
      try {
        localStorage.setItem(
          'cortex_messages_map',
          JSON.stringify(state.messagesMap)
        );
      } catch (err) {
        console.warn('Failed to persist messages to localStorage:', err);
      }
    },
    clearMessages: (state, action) => {
      const conversationId = action.payload;
      if (conversationId) {
        state.messagesMap[conversationId] = [];
      } else {
        state.messagesMap = { 'workspace-main': [] };
      }
      try {
        localStorage.setItem(
          'cortex_messages_map',
          JSON.stringify(state.messagesMap)
        );
      } catch (err) {
        console.warn('Failed to persist messages to localStorage:', err);
      }
    },
  },
});

export const {
  setCurrentConversationId,
  addMessage,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;