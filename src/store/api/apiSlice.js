import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../authSlice';
import { getAccessToken, setAccessToken } from '../../utils/tokenManager';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include', // CRITICAL: Send cookies (for refresh token)
  prepareHeaders: (headers) => {
    // Get token from memory, not Redux state
    const token = getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('🔄 Access token expired, attempting refresh...');
    
    // Try to refresh the access token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.accessToken) {
      // Store new access token in memory
      setAccessToken(refreshResult.data.accessToken);
      
      console.log('✅ Access token refreshed successfully');
      
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - logout user
      console.error('❌ Token refresh failed, logging out...');
      api.dispatch(logout());
      
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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
    getAttendanceByDate: builder.query({
      query: (date) => `/manager/attendance/${date}`,
      providesTags: ['Attendance'],
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
  useGetAttendanceByDateQuery,
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
