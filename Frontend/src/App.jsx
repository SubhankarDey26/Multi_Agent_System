import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppStoreProvider } from './store/useAppStore';
import { router } from './app/router';

export const App = () => {
  return (
    <AppStoreProvider>
      <RouterProvider router={router} />
    </AppStoreProvider>
  );
};

export default App;
