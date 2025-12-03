import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useGetStudentsQuery, useMarkAttendanceMutation } from '@/store/api/apiSlice';

const AttendanceManager = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  
  const { data: studentsData = [] } = useGetStudentsQuery();
  const [markAttendance] = useMarkAttendanceMutation();

  useEffect(() => {
    if (studentsData.length > 0) {
      const studentsWithStatus = studentsData.map(s => ({ ...s, status: 'present' }));
      setStudents(studentsWithStatus);
    }
  }, [studentsData]);

  const toggleStatus = (id) => {
    setStudents(students.map(s => 
      s._id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const handleSubmit = async () => {
    try {
      const records = students.map(s => ({ studentId: s._id, status: s.status }));
      await markAttendance({ date, records }).unwrap();
      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const filteredStudents = students.filter(s => 
    s.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Mark daily attendance for students</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-auto flex-1"
          />
          <Button onClick={markAllPresent} variant="outline" className="w-full sm:w-auto whitespace-nowrap">
            Mark All Present
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto whitespace-nowrap">
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Student List Card */}
      <Card className="overflow-hidden">
        <CardHeader className="space-y-3 pb-4">
          <CardTitle className="text-lg sm:text-xl">Student List</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search student..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student._id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                >
                  {/* Student Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white ${
                      student.status === 'present' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {student.user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm sm:text-base truncate">
                        {student.user?.name || 'Unknown'}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        Room: {student.room?.number || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 sm:flex-none ${
                        student.status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                      }`}
                      onClick={() => toggleStatus(student._id)}
                    >
                      <Check className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Present</span>
                    </Button>
                    <Button 
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => toggleStatus(student._id)}
                    >
                      <X className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Absent</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManager;
