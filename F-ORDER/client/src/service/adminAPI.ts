import { rootApi } from "./rootApi";

interface GetPrice {
  $numberDecimal: string;
}

interface Order {
  _id: string;
  tableName: string;
  name: string;
  description: string;
  totalPrice: number | GetPrice;
  orderTime: string;
  userName: string;
}

interface Revenues {
  totalRevenue: number;
  totalStaff: number;
  totalOrder: number;
  totalMenuItems: number;
}

interface Annual {
  _id: string;
  totalRevenue: number | GetPrice;
}

interface BestSale {
  name: string;
  categoryName: string;
  count: string;
}

interface OrderCount {
  month: string;
  orderCount: string;
}

export interface Staff {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  result: Order[];
}

interface ApiRevenue {
  success: boolean;
  result: Revenues;
}

interface APIRevenueAnnual {
  success: boolean;
  result: Annual[];
}

interface ApiItemsBestSale {
  success: boolean;
  result: BestSale[];
}

interface ApiOrderCountMonthly {
  success: boolean;
  result: OrderCount[];
}

interface ApiAllStaff {
  success: boolean;
  result: Staff[];
}

interface APIDetailStaff {
  success: boolean;
  result: Staff;
}

export const adminApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getOrderStartEnd: builder.query<
        ApiResponse,
        { startDate: string; endDate: string }
      >({
        query: ({ startDate, endDate }) =>
          `/revenues/startDay-endDay?startDate=${startDate}&endDate=${endDate}`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getAllRevenue: builder.query<ApiRevenue, void>({
        query: () => `/revenues/total`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getRevenueAnnual: builder.query<APIRevenueAnnual, { year: string }>({
        query: ({ year }) => `/revenues/annual?year=${year}`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getItemsBestSale: builder.query<ApiItemsBestSale, void>({
        query: () => `/revenues/best-sales`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getOrderCountMonthly: builder.query<
        ApiOrderCountMonthly,
        { year: string }
      >({
        query: ({ year }) => `/revenues/order-monthly?year=${year}`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getAllStaff: builder.query<ApiAllStaff, void>({
        query: () => `/revenues/all-staff`,
        // providesTags: [{ type: "ITEM" }],
      }),

      getDetailStaff: builder.query<APIDetailStaff, { id: string }>({
        query: ({ id }) => `/revenues/staff/${id}`,
        // providesTags: [{ type: "ITEM" }],
      }),

      putUpdateStaff: builder.mutation<
        void,
        { id: string; username: string; role: string }
      >({
        query: ({ id, username, role }) => ({
          url: `/revenues/update-staff/${id}`,
          method: "PUT",
          body: {
            username,
            role,
          },
        }),
      }),

      deleteStaff: builder.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `/revenues/delete-staff/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "ITEM" }],
      }),
    };
  },
});

// Destructure the hook from the adminApi object
export const {
  useGetOrderStartEndQuery,
  useGetAllRevenueQuery,
  useGetRevenueAnnualQuery,
  useGetItemsBestSaleQuery,
  useGetOrderCountMonthlyQuery,
  useGetAllStaffQuery,
  useGetDetailStaffQuery,
  usePutUpdateStaffMutation,
  useDeleteStaffMutation,
} = adminApi;
