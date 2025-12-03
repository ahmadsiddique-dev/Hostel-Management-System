import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateChallanPDF } from '@/utils/challanGenerator';
import toast from 'react-hot-toast';
import { useGetFeesByStudentQuery, useGetStudentProfileQuery } from '@/store/api/apiSlice';

const StudentFees = () => {
  const { data: fees = [], isLoading: loadingFees } = useGetFeesByStudentQuery();
  const { data: studentProfile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const [downloadingId, setDownloadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, unpaid, overdue

  const loading = loadingFees || loadingProfile;

  const studentInfo = studentProfile ? {
    name: studentProfile.user?.name,
    email: studentProfile.user?.email,
    room: studentProfile.room?.number
  } : null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-emerald-500/15 text-emerald-500';
      case 'overdue': return 'bg-red-500/15 text-red-500';
      default: return 'bg-yellow-500/15 text-yellow-500';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'paid' ? 
      <CheckCircle className="w-10 h-10" /> : 
      <AlertCircle className="w-10 h-10" />;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // Filter fees based on status
  const filteredFees = fees.filter(fee => {
    if (statusFilter === 'all') return true;
    return fee.status === statusFilter;
  });

  const currentDue = fees.find(f => f.status !== 'paid') || fees[0];

  const handleDownloadChallan = async (fee) => {
    if (!studentInfo) {
      toast.error('Student information not loaded yet. Please try again.');
      return;
    }
    
    setDownloadingId(fee._id);
    
    try {
      const type = fee.status === 'paid' ? 'paid' : 'unpaid';
      await generateChallanPDF(fee, studentInfo, type);
      toast.success('Challan downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate challan:', error);
      toast.error('Failed to download challan. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Fee History</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Track your payments and dues</p>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Fees' : status}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr,380px]">
        {/* Payment History */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {filteredFees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No fee records found
                </div>
              ) : (
                filteredFees.map((fee) => (
                  <div 
                    key={fee._id} 
                    className="relative flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all group"
                  >
                    {/* Status Icon */}
                    <div className={`p-3 rounded-full ${getStatusColor(fee.status)}`}>
                      {getStatusIcon(fee.status)}
                    </div>

                    {/* Month/Year & Due Date */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg">
                        {monthNames[fee.month - 1]} {fee.year}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Due: {new Date(fee.dueDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        })}
                      </div>
                    </div>

                    {/* Fee Breakdown - Hide on small screens */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Rent</div>
                        <div className="font-semibold text-sm">PKR</div>
                        <div className="font-bold">{fee.roomRent?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Mess</div>
                        <div className="font-semibold text-sm">PKR</div>
                        <div className="font-bold">{fee.messFee?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="font-semibold text-sm">PKR</div>
                        <div className="font-bold text-primary text-lg">{fee.amount?.toLocaleString() || 0}</div>
                      </div>
                    </div>

                    {/* Total on mobile */}
                    <div className="md:hidden text-right">
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="font-bold text-primary text-lg">
                        {fee.amount?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs font-medium">PKR</div>
                    </div>

                    {/* Status Badge & Download */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(fee.status)}`}>
                        {fee.status}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDownloadChallan(fee)}
                        disabled={downloadingId === fee._id}
                        title="Download Challan/Receipt"
                      >
                        {downloadingId === fee._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Dues Sidebar */}
        <Card className="overflow-hidden h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Current Dues</CardTitle>
            <CardDescription className="text-base">
              {currentDue ? `${monthNames[currentDue.month - 1]} ${currentDue.year}` : 'No pending dues'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentDue && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Room Rent</span>
                    <span className="font-semibold">{currentDue.roomRent?.toLocaleString() || 0} PKR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mess Fee (Compulsory)</span>
                    <span className="font-semibold">{currentDue.messFee?.toLocaleString() || 0} PKR</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      {currentDue.amount?.toLocaleString() || 0} PKR
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-500/10 text-yellow-500 text-sm rounded-lg border border-yellow-500/20 font-medium">
                  Due Date: {new Date(currentDue.dueDate).toLocaleDateString('en-US', { 
                    day: 'numeric',
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => currentDue && handleDownloadChallan(currentDue)}
                  disabled={downloadingId === currentDue?._id}
                >
                  {downloadingId === currentDue?._id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Challan
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentFees;
