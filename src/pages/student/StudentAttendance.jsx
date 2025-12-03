import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { useGetAttendanceByStudentQuery } from '@/store/api/apiSlice';

const StudentAttendance = () => {
  const { data: attendance = [] } = useGetAttendanceByStudentQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Attendance</h2>
        <p className="text-muted-foreground">View your daily attendance record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <div className="grid grid-cols-3 p-4 bg-muted/50 font-medium text-sm border-b border-border">
              <div>Date</div>
              <div>Status</div>
              <div>Time</div>
            </div>
            {attendance.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No attendance records found.</div>
            ) : (
              attendance.map((record) => (
                <div key={record._id} className="grid grid-cols-3 p-4 text-sm border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <div>{new Date(record.date).toLocaleDateString()}</div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      record.status === 'present' ? 'bg-emerald-500/15 text-emerald-500' :
                      record.status === 'absent' ? 'bg-rose-500/15 text-rose-500' :
                      'bg-yellow-500/15 text-yellow-500'
                    }`}>
                      {record.status === 'present' && <Check className="w-3 h-3 mr-1" />}
                      {record.status === 'absent' && <X className="w-3 h-3 mr-1" />}
                      {record.status === 'leave' && <Clock className="w-3 h-3 mr-1" />}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </div>
                  <div className="text-muted-foreground">{new Date(record.date).toLocaleTimeString()}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
