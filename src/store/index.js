import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api/apiSlice';
import authReducer from './authSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
};

// Wrap auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(api.middleware)
});

export const persistor = persistStore(store);
