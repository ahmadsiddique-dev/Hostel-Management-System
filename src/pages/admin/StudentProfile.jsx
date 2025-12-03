import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Assuming Badge exists or I'll use span
import { Calendar, CreditCard, User, Phone, MapPin } from 'lucide-react';

// Fallback for Badge
const StatusBadge = ({ status }) => {
  const styles = {
    paid: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25',
    unpaid: 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25',
    present: 'bg-emerald-500/15 text-emerald-500',
    absent: 'bg-rose-500/15 text-rose-500',
    leave: 'bg-yellow-500/15 text-yellow-500',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const StudentProfile = () => {
  // Mock Data
  const student = {
    name: 'Ali Khan',
    room: '101-A',
    cnic: '35202-1234567-1',
    phone: '+92 300 1234567',
    email: 'ali.khan@example.com',
    address: 'House 123, Street 4, Lahore',
    guardian: { name: 'Ahmed Khan', phone: '+92 300 7654321' },
    attendanceStats: { present: 22, absent: 2, leave: 1 },
    feeStatus: 'Paid',
  };

  const feeHistory = [
    { month: 'November 2025', amount: 20000, status: 'Paid', date: '2025-11-05' },
    { month: 'October 2025', amount: 20000, status: 'Paid', date: '2025-10-03' },
    { month: 'September 2025', amount: 20000, status: 'Paid', date: '2025-09-07' },
  ];

  const attendanceHistory = [
    { date: '2025-11-24', status: 'Present' },
    { date: '2025-11-23', status: 'Present' },
    { date: '2025-11-22', status: 'Absent' },
    { date: '2025-11-21', status: 'Present' },
    { date: '2025-11-20', status: 'Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
          <p className="text-muted-foreground">Room {student.room} • {student.cnic}</p>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> {student.phone}
              </div>
              <div className="text-sm pl-6">{student.email}</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Guardian</p>
              <p className="text-sm">{student.guardian.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" /> {student.guardian.phone}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                {student.address}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & History */}
        <div className="md:col-span-2 space-y-6">
          {/* Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Attendance History
                </div>
                <div className="text-sm font-normal text-muted-foreground">
                  {student.attendanceStats.present} Present • {student.attendanceStats.absent} Absent
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendanceHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">{record.date}</span>
                    <StatusBadge status={record.status} />
                  </div>
                ))}
                <Button variant="link" className="w-full text-xs text-muted-foreground">View Full History</Button>
              </div>
            </CardContent>
          </Card>

          {/* Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Fee History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feeHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{record.month}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold">{record.amount.toLocaleString()} PKR</span>
                      <StatusBadge status={record.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
