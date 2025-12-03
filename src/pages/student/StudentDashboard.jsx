import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Bell, IdCard, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetStudentProfileQuery, useGetAttendanceByStudentQuery, useGetNotificationsQuery, useGetFeesByStudentQuery } from '@/store/api/apiSlice';

const StudentDashboard = () => {
  const { data: student, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const { data: attendance = [], isLoading: loadingAttendance } = useGetAttendanceByStudentQuery();
  const { data: notifications = [], isLoading: loadingNotifications } = useGetNotificationsQuery();
  const { data: fees = [], isLoading: loadingFees } = useGetFeesByStudentQuery();

  const loading = loadingProfile || loadingAttendance || loadingNotifications || loadingFees;

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const attendancePerc = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const hasPendingFees = fees.some(fee => fee.status !== 'paid');
  const feeStatus = hasPendingFees ? 'Pending Dues' : 'All Paid';

  const stats = {
    attendance: `${attendancePerc}%`,
    fees: feeStatus,
    notifications: notifications.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const quickActions = [
    { title: 'View Attendance', desc: 'Check your attendance record', icon: Calendar, href: '/student/attendance', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Fee History', desc: 'Download fee receipts', icon: CreditCard, href: '/student/fees', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Digital ID Card', desc: 'View your student ID', icon: IdCard, href: '/student/id-card', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Submit Complaint', desc: 'Report an issue', icon: MessageSquare, href: '/student/complaints', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome, {student?.user?.name || 'Student'}!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Here's your dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-500">{stats.attendance}</p>
              </div>
              <div className="bg-green-500/10 p-2 sm:p-3 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Fee Status</p>
                <p className={`text-xl sm:text-2xl font-bold truncate ${stats.fees === 'Pending Dues' ? 'text-red-500' : ''}`}>{stats.fees}</p>
              </div>
              <div className="bg-blue-500/10 p-2 sm:p-3 rounded-lg">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden sm:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{stats.notifications}</p>
              </div>
              <div className="bg-yellow-500/10 p-2 sm:p-3 rounded-lg">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{action.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Room Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Your Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Room Number:</span>
                <span className="text-xl sm:text-2xl font-bold">{student?.room?.number || 'N/A'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{student?.room?.type || 'N/A'}</span>
              </div>
            </div>
            <Link 
              to="/student/id-card"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <IdCard className="w-4 h-4" />
              <span>View Digital ID</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
