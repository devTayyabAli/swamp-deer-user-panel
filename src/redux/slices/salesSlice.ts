import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Sale {
    _id: string;
    description: string;
    amount: number;
    commission: number;
    investorProfit: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    investorId?: any;
    branchId?: any;
    documentPath?: string;
}

interface SalesState {
    sales: Sale[];
    summary: {
        totalAmount: number;
        totalProfit: number;
    };
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SalesState = {
    sales: [],
    summary: {
        totalAmount: 0,
        totalProfit: 0,
    },
    loading: false,
    error: null,
    success: false,
};

export const createSale = createAsyncThunk(
    'sales/create',
    async (saleData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/sales', saleData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create sale.'
            );
        }
    }
);

export const getSales = createAsyncThunk(
    'sales/getAll',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/sales', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch sales.'
            );
        }
    }
);

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        resetSalesState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createSale.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sales.unshift(action.payload);
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSales.fulfilled, (state, action) => {
                state.loading = false;
                state.sales = action.payload.items;
                state.summary = action.payload.summary;
            })
            .addCase(getSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSalesState } = salesSlice.actions;
export default salesSlice.reducer;
