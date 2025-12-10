import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Search, RefreshCw, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useGetStudentsQuery, useMarkAttendanceMutation, useGetAttendanceByDateQuery } from '@/store/api/apiSlice';

const AttendanceManager = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  
  const { data: studentsData = [] } = useGetStudentsQuery();
  const { data: existingAttendance = [], refetch } = useGetAttendanceByDateQuery(date);
  const [markAttendance, { isLoading: saving }] = useMarkAttendanceMutation();

  // Load students and merge with existing attendance
  useEffect(() => {
    if (studentsData.length > 0) {
      const studentsWithStatus = studentsData.map(student => {
        const existing = existingAttendance.find(
          att => att.student._id === student._id
        );
        
        return {
          ...student,
          status: existing ? existing.status : 'present'
        };
      });
      
      setStudents(studentsWithStatus);
      setIsUpdate(existingAttendance.length > 0);
    }
  }, [studentsData, existingAttendance]);

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  // Date navigation helpers
  const changeDate = (days) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + days);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  const setToday = () => {
    setDate(new Date().toISOString().split('T')[0]);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday.toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = dateStr;
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateOnly === todayStr) return 'Today';
    if (dateOnly === yesterdayStr) return 'Yesterday';
    
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
      const result = await markAttendance({ date, records }).unwrap();
      
      if (result.isUpdate) {
        toast.success('Attendance updated successfully!');
      } else {
        toast.success('Attendance marked successfully!');
      }
      
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to save attendance');
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
        
        {/* Beautiful Date Picker Section */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeDate(-1)}
                  className="h-10 w-10 flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-start text-left font-semibold h-10 gap-2"
                    >
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{formatDisplayDate(date)}</span>
                      {isUpdate && (
                        <Badge variant="secondary" className="ml-auto hidden sm:inline-flex">
                          Has Data
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-2">
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeDate(1)}
                  className="h-10 w-10 flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Access Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={setYesterday}
                  className="flex-1"
                >
                  Yesterday
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={setToday}
                  className="flex-1"
                >
                  Today
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={markAllPresent} 
            variant="outline" 
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 sm:flex-[2]"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {isUpdate ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                {isUpdate ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update Attendance
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Attendance
                  </>
                )}
              </>
            )}
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
