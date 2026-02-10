import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface User {
    _id: string;
    name: string;
    email: string;
    userName: string;
    role: string;
    phone?: string;
    address?: string;
    branchId?: any;
    status?: string;
    totalTeamSize?: number;
    currentLevel?: number;
    createdAt?: string;
    token: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const userFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;

const initialState: AuthState = {
    user: userFromStorage,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                return response.data.data;
            }
            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                // If token is present, login immediately (admin created user pre-verified)
                if (response.data.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    return response.data.data;
                }
                // If no token, return null or indicator. Since redux fulfilled payload becomes user, returning null means no user set.
                // The component can infer success by lack of rejection.
                return null;
            }
            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.put(`/auth/verifyemail/${token}`); // Use PUT as defined in backend routes
            if (response.data.success) {
                return response.data.message;
            }
            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Verification failed.'
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/profile', userData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                return response.data.data;
            }
            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Profile update failed.'
            );
        }
    }
);

export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwordData: any, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/password', passwordData);
            if (response.data.success) {
                return response.data.message;
            }
            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Password update failed.'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
