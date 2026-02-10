import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Level {
    id: number;
    no: string;
    name: string;
    criteria: string;
    reward: string;
    status: 'achieved' | 'locked';
    progress: number;
    claimStatus: 'not_claimed' | 'pending' | 'approved' | 'rejected';
    isClaimed: boolean;
    remainingDirect: number;
    remainingTotal: number;
}

interface DashboardStats {
    user: {
        name: string;
        referralId: string;
        rank: string;
        role: string;
    };
    kpis: {
        totalBusinessVolume: number;
        totalDirectBusiness: number;
        totalIndirectBusiness: number;
        totalProfitEarned: number;
        stakingIncome: number;
        referralIncome: number;
        levelIncome: number;
        availableBalance: number;
    };
    teamStats: {
        totalTeamSize: number;
        directTeam: number;
        indirectTeam: number;
    };
    investment: {
        totalInvestment: number;
        totalProfit: number;
        monthlyProfit: number;
        roiStatus: string;
        currentPhase: number;
        profitRate: number;
    };
    rewards: {
        staking: number;
        level: number;
        referral: number;
        total: number;
    };
    levels: Level[];
}

interface DashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    stats: null,
    loading: false,
    error: null
};

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/investors/dashboard/stats');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard statistics');
        }
    }
);

export const claimReward = createAsyncThunk(
    'dashboard/claimReward',
    async (rankId: number, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/rewards/claim', { rankId });
            dispatch(fetchDashboardStats());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to claim reward');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        resetDashboardState: (state) => {
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
