import { RootState } from "@/redux/store";
// import { login, logout } from "@/redux/slices/authSlice";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  phone: string;
  role: string;
  email?: string;
  fulname?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "https://f-order-production.up.railway.app",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  // console.log(result)
  // if (result?.error?.status === 401) {
  //   if (result?.error?.data?.message === "Token has expired.") {
  //     const refreshToken = api.getState().auth.refreshToken;
  //     if (refreshToken) {
  //       // goi den server de verify de nhan lai access token moi
  //       const refreshResult = await baseQuery(
  //         {
  //           url: "/refresh-token",
  //           body: { refreshToken },
  //           method: "POST",
  //         },
  //         api,
  //         extraOptions
  //       );
  //       const newAccessToken = refreshResult?.data?.accessToken;
  //       if (newAccessToken) {
  //         api.dispatch(
  //           login({
  //             accessToken: newAccessToken,
  //             refreshToken,
  //           })
  //         );
  //         result = await baseQuery(args, api, extraOptions);
  //       } else {
  //         await api.dispatch(logout());
  //         window.location.href = "/login";
  //       }
  //     }
  //   } else {
  //     window.location.href = "/login";
  //   }
  // }
  return result;
};

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "ITEM",
    "ITEM_ADMIN",
    "ORDER",
    "ITEM_DETAIL",
    "TABLES",
    "CHEF",
    "DUPITIEM",
  ],
  refetchOnFocus: true,
  // c4: tu dong refetch lai du lieu khi mat mang
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterFormData>({
      query: (props) => ({
        url: "/auth/signup",
        body: { ...props },
        method: "POST",
      }),
    }),
    login: builder.mutation<AuthResponse, LoginFormData>({
      query: (formData) => ({
        url: "/auth/login",
        body: formData,
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = rootApi;
