import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageSquare, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetComplaintsQuery, useUpdateComplaintStatusMutation } from '@/store/api/apiSlice';

const ManagerComplaints = () => {
  const [filter, setFilter] = useState('all');
  const { data: complaints = [], isLoading: loading } = useGetComplaintsQuery(); // @REVIEW: Query Check
  const [updateStatus] = useUpdateComplaintStatusMutation(); // @REVIEW: Mutation Check

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Complaint marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/15 text-red-500 border-red-500/20';
      default: return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20';
    }
  };

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Complaints Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Track and resolve student issues</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complaints</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredComplaints.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
              <p>No complaints found</p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint._id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{complaint.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{complaint.student?.user?.name}</span>
                      <span>•</span>
                      <span>Room {complaint.student?.room?.number || 'N/A'}</span>
                      <span>•</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(complaint.status)}>
                    {complaint.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-300 mb-4">{complaint.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-end border-t border-border pt-4">
                  {complaint.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                        onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Resolve
                      </Button>
                    </>
                  )}
                  {complaint.status !== 'pending' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleStatusUpdate(complaint._id, 'pending')}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerComplaints;
