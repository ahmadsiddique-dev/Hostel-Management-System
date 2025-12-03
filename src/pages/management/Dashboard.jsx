import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, CheckCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '@/store/api/apiSlice';

const Dashboard = () => {
  const { data: stats = {}, isLoading } = useGetDashboardStatsQuery();

  const dashboardStats = {
    totalStudents: stats.totalStudents || 0,
    totalRooms: stats.totalRooms || 0,
    attendanceToday: stats.attendanceToday || 0,
    pendingComplaints: stats.pendingComplaints || 0
  };

  const statsCards = [
    { title: 'Total Students', value: dashboardStats.totalStudents, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Total Rooms', value: dashboardStats.totalRooms, icon: Home, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Today\'s Attendance', value: dashboardStats.attendanceToday, icon: CheckCircle, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Pending Complaints', value: dashboardStats.pendingComplaints, icon: MessageSquare, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ];

  const quickActions = [
    { title: 'Register Student', desc: 'Add new student', icon: Users, href: '/admin/register', color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Mark Attendance', desc: 'Take today\'s attendance', icon: CheckCircle, href: '/admin/attendance', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Manage Rooms', desc: 'View and assign rooms', icon: Home, href: '/admin/rooms', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your hostel operations efficiently</p>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    </div>
  );
};

export default Dashboard;
