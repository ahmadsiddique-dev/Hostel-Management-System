import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, logout } from '../authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // CRITICAL: Send cookies with every request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);

    if (refreshResult.data) {
      // store the new token
      api.dispatch(setToken(refreshResult.data.token));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Students', 'Rooms', 'Attendance', 'Fees', 'Notifications', 'Complaints'],
  endpoints: (builder) => ({
    // ========================================
    // ADMIN/MANAGER ENDPOINTS - /api/manager/*
    // ========================================
    // Students Management (Admin)
    getStudents: builder.query({
      query: () => `/manager/students`,
      providesTags: ['Students'],
    }),
    getStudentById: builder.query({
      query: (id) => `/manager/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    registerStudent: builder.mutation({
      query: (data) => ({
        url: '/manager/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Students', 'Rooms'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/manager/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Students'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/manager/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students', 'Rooms'],
    }),
    
    // Rooms Management (Admin)
    getRooms: builder.query({
      query: () => '/manager/rooms',
      providesTags: ['Rooms'],
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: '/manager/rooms',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rooms'],
    }),
    
    // Attendance Management (Admin)
    markAttendance: builder.mutation({
      query: (data) => ({
        url: '/manager/attendance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    // Notifications Management (Admin)
    sendNotification: builder.mutation({
      query: (data) => ({
        url: '/manager/notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications'],
    }),
    
    // Complaints Management (Admin)
    getComplaints: builder.query({
      query: () => `/manager/complaints`,
      providesTags: ['Complaints'],
    }),
    updateComplaintStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/manager/complaints/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Complaints'],
    }),

    // Dashboard Stats (Admin)
    getDashboardStats: builder.query({
      query: () => '/manager/stats',
      providesTags: ['Students', 'Rooms', 'Attendance', 'Complaints'], // Invalidate when any of these change
    }),
    
    // ========================================
    // STUDENT ENDPOINTS - /api/student/*
    // ========================================
    
    // Student Profile
    getStudentProfile: builder.query({
      query: () => `/student/profile`,
      providesTags: ['Students'],
    }),
    
    // Student Attendance
    getAttendanceByStudent: builder.query({
      query: () => `/student/attendance`,
      providesTags: ['Attendance'],
    }),
    
    // Student Fees
    getFeesByStudent: builder.query({
      query: () => `/student/fees`,
      providesTags: ['Fees'],
    }),
    
    // Student Notifications
    getNotifications: builder.query({
      query: () => `/student/notifications`,
      providesTags: ['Notifications'],
    }),
    
    // Student Complaints
    getMyComplaints: builder.query({
      query: () => `/student/complaints`,
      providesTags: ['Complaints'],
    }),
    createComplaint: builder.mutation({
      query: (data) => ({
        url: '/student/complaints',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Complaints'],
    }),
  }),
});

export const {
  // Admin endpoints
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useRegisterStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetRoomsQuery,
  useCreateRoomMutation,
  useMarkAttendanceMutation,
  useSendNotificationMutation,
  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetDashboardStatsQuery,
  // Student endpoints
  useGetStudentProfileQuery,
  useGetAttendanceByStudentQuery,
  useGetFeesByStudentQuery,
  useGetNotificationsQuery,
  useGetMyComplaintsQuery,
  useCreateComplaintMutation,
} = api;
