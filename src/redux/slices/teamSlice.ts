import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    phone: string;
    amount: number;
    profit: number;
    date: string;
    upline: string;
    type: 'direct' | 'indirect';
}

interface TeamState {
    direct: TeamMember[];
    indirect: TeamMember[];
    all: TeamMember[];
    loading: boolean;
    error: string | null;
}

const initialState: TeamState = {
    direct: [],
    indirect: [],
    all: [],
    loading: false,
    error: null
};

export const fetchTeamMembers = createAsyncThunk(
    'team/fetchMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/investors/team');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
        }
    }
);

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        resetTeamState: (state) => {
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.direct = action.payload.direct || [];
                state.indirect = action.payload.indirect || [];
                state.all = action.payload.all || [];
            })
            .addCase(fetchTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
