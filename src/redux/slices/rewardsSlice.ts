import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface RewardSummary {
    staking: number;
    level: number;
    referral: number;
    total: number;
}

interface RewardsState {
    summary: RewardSummary;
    items: any[];
    loading: boolean;
    error: string | null;
    page: number;
    pages: number;
    total: number;
    filteredTotal: number;
}

const initialState: RewardsState = {
    summary: {
        staking: 0,
        level: 0,
        referral: 0,
        total: 0
    },
    items: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
    filteredTotal: 0
};

export const fetchRewardSummary = createAsyncThunk(
    'rewards/fetchSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/rewards/summary');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reward summary');
        }
    }
);

export const fetchRewards = createAsyncThunk(
    'rewards/fetchList',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/rewards', { params });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch rewards list');
        }
    }
);

const rewardsSlice = createSlice({
    name: 'rewards',
    initialState,
    reducers: {
        resetRewardsState: (state) => {
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Summary
            .addCase(fetchRewardSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
            })
            .addCase(fetchRewardSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch List
            .addCase(fetchRewards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewards.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
                state.filteredTotal = action.payload.filteredTotal;
            })
            .addCase(fetchRewards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetRewardsState } = rewardsSlice.actions;
export default rewardsSlice.reducer;
