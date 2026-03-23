import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../store';
import { updateUserApi } from '../../utils/burger-api';

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async () => await getUserApi()
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

interface TUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  } as TUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const getUser = (state: RootState) => state.user.user;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
