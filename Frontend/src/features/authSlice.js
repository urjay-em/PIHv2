import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
    user: user,
    userInfo: {}, 
    isAuthenticated: user ? true : false, // Track authentication state
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};


export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await authService.login(userData);
        localStorage.setItem("user", JSON.stringify(response)); 
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(handleError(error));
    }
});

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout();
        localStorage.removeItem("user");
    }
);

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (_, thunkAPI) => {
        try {
            const accessToken = thunkAPI.getState().auth.user.access;
            return await authService.getUserInfo(accessToken);
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.resetPassword(userData);
            return response;
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const resetPasswordConfirm = createAsyncThunk(
    "auth/resetPasswordConfirm",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.resetPasswordConfirm(userData);
            return response;
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const activate = createAsyncThunk(
    "auth/activate",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.activate(userData);
            return response;
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                console.log('Login pending');
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.userInfo = {};
                state.isAuthenticated = false;
                localStorage.removeItem("user");
            })
            .addCase(getUserInfo.pending, (state) => { state.isLoading = true; })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                console.log('Fetched user info:', action.payload);
                state.isLoading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resetPasswordConfirm.pending, (state) => { state.isLoading = true; })
            .addCase(resetPasswordConfirm.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(activate.pending, (state) => { state.isLoading = true; })
            .addCase(activate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(activate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
