import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { companiesSlice } from './slices/companiesSlice';
import { dashboardSlice } from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    companies: companiesSlice.reducer,
    dashboard: dashboardSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

