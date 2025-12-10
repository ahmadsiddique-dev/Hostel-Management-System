import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetStudentsQuery } from '@/store/api/apiSlice';
import { useDebounce } from '@/hooks/useDebounce';

const Students = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data: students = [], isLoading: loading } = useGetStudentsQuery(); // @REVIEW: Query Check

  const filteredStudents = students.filter(s => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      s.user?.name?.toLowerCase().includes(searchLower) ||
      s.user?.email?.toLowerCase().includes(searchLower) ||
      s.cnic?.toLowerCase().includes(searchLower) ||
      s.phone?.toLowerCase().includes(searchLower) ||
      s.room?.number?.toLowerCase().includes(searchLower)
    );
  });

  const clearSearch = () => setSearch('');

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage student records and admissions</p>
        </div>
        <Link to="/admin/register" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> New Admission
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-3 pb-4">
          <CardTitle className="text-lg sm:text-xl">All Students</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-10"
              placeholder="Search by name, email, CNIC, phone, or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No students found
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-md border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium text-sm border-b border-border">
                  <div className="col-span-2">Name</div>
                  <div>Room</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="grid grid-cols-5 gap-4 p-4 text-sm border-b border-border last:border-0 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-2 font-medium truncate">{student.user?.name || 'Unknown'}</div>
                    <div className="truncate">{student.room?.number || 'Unassigned'}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        student.isActive !== false ? 'bg-emerald-500/15 text-emerald-500' : 'bg-gray-500/15 text-gray-500'
                      }`}>
                        {student.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-right">
                      <Link to={`/admin/student/${student._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-border">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm truncate">{student.user?.name || 'Unknown'}</h4>
                          <p className="text-xs text-muted-foreground">Room {student.room?.number || 'Unassigned'}</p>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        student.isActive !== false ? 'bg-emerald-500/15 text-emerald-500' : 'bg-gray-500/15 text-gray-500'
                      }`}>
                        {student.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Link to={`/admin/student/${student._id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" /> View Profile
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
