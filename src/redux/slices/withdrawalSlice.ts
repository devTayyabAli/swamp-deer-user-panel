import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Withdrawal {
    _id: string;
    amount: number;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    method?: string;
    txId?: string;
    createdAt: string;
}

interface WithdrawalState {
    balance: number;
    history: Withdrawal[];
    loading: boolean;
    error: string | null;
}

const initialState: WithdrawalState = {
    balance: 0,
    history: [],
    loading: false,
    error: null
};

export const fetchBalance = createAsyncThunk(
    'withdrawal/fetchBalance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/withdrawals/balance');
            return response.data.data.balance;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
        }
    }
);

export const fetchWithdrawalHistory = createAsyncThunk(
    'withdrawal/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/withdrawals');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch withdrawal history');
        }
    }
);

export const submitWithdrawalRequest = createAsyncThunk(
    'withdrawal/submitRequest',
    async (amount: number, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('/withdrawals', { amount });
            // Refresh balance after successful request
            dispatch(fetchBalance());
            dispatch(fetchWithdrawalHistory());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit withdrawal request');
        }
    }
);

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState,
    reducers: {
        clearWithdrawalError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Balance
            .addCase(fetchBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
            })
            .addCase(fetchBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch History
            .addCase(fetchWithdrawalHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Submit Request
            .addCase(submitWithdrawalRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitWithdrawalRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearWithdrawalError } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
