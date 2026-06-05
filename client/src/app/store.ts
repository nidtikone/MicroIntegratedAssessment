import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import { loadPersistedApi, persistApi, throttle, REHYDRATE_TYPE } from './persist';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Rehydrate the persisted RTK Query cache via extractRehydrationInfo (safe merge).
const persistedApi = loadPersistedApi();
if (persistedApi) {
  store.dispatch({ type: REHYDRATE_TYPE, payload: { [api.reducerPath]: persistedApi } });
}

// Persist the api cache (throttled) so reloads/revisits hydrate from localStorage.
const save = throttle(() => persistApi(store.getState()[api.reducerPath] as never), 1000);
store.subscribe(save);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
