import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, CreditCard, User, Phone, MapPin, Loader2, ArrowLeft, Edit } from 'lucide-react';
import { 
  useGetStudentByIdQuery, 
  useUpdateStudentMutation,
  useGetAttendanceByStudentQuery,
  useGetFeesByStudentQuery 
} from '@/store/api/apiSlice';
import toast from 'react-hot-toast';

// Status Badge Component
const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const styles = {
    paid: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25',
    unpaid: 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25',
    pending: 'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25',
    present: 'bg-emerald-500/15 text-emerald-500',
    absent: 'bg-rose-500/15 text-rose-500',
    leave: 'bg-yellow-500/15 text-yellow-500',
    late: 'bg-orange-500/15 text-orange-500',
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch Student Data
  const { data: student, isLoading, error, refetch } = useGetStudentByIdQuery(id);
  
  // Fetch Related Data (only if student exists)
  const userId = student?.user?._id;
  const { data: attendance = [] } = useGetAttendanceByStudentQuery(userId, { skip: !userId });
  const { data: fees = [] } = useGetFeesByStudentQuery(userId, { skip: !userId });
  
  // Update Mutation
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    cnic: ''
  });

  // Populate form when student data loads
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.user?.name || '',
        phone: student.phone || '',
        address: student.address || '',
        guardianName: student.guardian?.name || '',
        guardianPhone: student.guardian?.phone || '',
        cnic: student.cnic || ''
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStudent({
        id,
        name: formData.name, // Update user name
        phone: formData.phone,
        address: formData.address,
        cnic: formData.cnic,
        guardian: {
          name: formData.guardianName,
          phone: formData.guardianPhone
        }
      }).unwrap();
      
      toast.success('Profile updated successfully');
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
      console.error('Update error:', err);
    }
  };

  // Calculate Stats
  const attendanceStats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    leave: attendance.filter(a => a.status === 'leave').length
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-destructive font-medium">Error loading student profile</p>
        <Button variant="outline" onClick={() => navigate('/admin/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/students')} className="h-8 w-8 -ml-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">{student.user?.name}</h2>
          </div>
          <p className="text-muted-foreground ml-8">
            Room {student.room?.number || 'Unassigned'} • {student.cnic}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Student Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC</Label>
                  <Input id="cnic" name="cnic" value={formData.cnic} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2 border-t pt-4 mt-4">
                <h4 className="font-medium text-sm text-muted-foreground">Guardian Details</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input id="guardianName" name="guardianName" value={formData.guardianName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone</Label>
                  <Input id="guardianPhone" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} required />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> {student.phone || 'N/A'}
              </div>
              <div className="text-sm pl-6">{student.user?.email}</div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Guardian</p>
              <p className="text-sm font-medium">{student.guardian?.name || 'N/A'}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" /> {student.guardian?.phone || 'N/A'}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="break-words">{student.address || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={student.isActive ? 'default' : 'secondary'}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Joined</span>
                <span>{new Date(student.createdAt).toLocaleDateString()}</span>
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
                <div className="text-sm font-normal text-muted-foreground hidden sm:block">
                  {attendanceStats.present} Present • {attendanceStats.absent} Absent
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {attendance.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No attendance records found.</p>
                ) : (
                  attendance.slice(0, 10).map((record) => (
                    <div key={record._id} className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <StatusBadge status={record.status} />
                    </div>
                  ))
                )}
                {attendance.length > 10 && (
                  <Button variant="link" className="w-full text-xs text-muted-foreground">View Full History</Button>
                )}
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
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {fees.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No fee records found.</p>
                ) : (
                  fees.map((record) => (
                    <div key={record._id} className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{record.month} {record.year}</p>
                        <p className="text-xs text-muted-foreground">Due: {new Date(record.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">{record.amount.toLocaleString()} PKR</span>
                        <StatusBadge status={record.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
