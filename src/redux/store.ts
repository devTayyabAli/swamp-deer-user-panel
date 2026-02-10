import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';
import rewardsReducer from './slices/rewardsSlice';
import teamReducer from './slices/teamSlice';
import dashboardReducer from './slices/dashboardSlice';
import withdrawalReducer from './slices/withdrawalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sales: salesReducer,
        rewards: rewardsReducer,
        team: teamReducer,
        dashboard: dashboardReducer,
        withdrawal: withdrawalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
