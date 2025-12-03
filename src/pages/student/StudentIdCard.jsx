import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';
import { useGetStudentProfileQuery } from '@/store/api/apiSlice';

const StudentIdCard = () => {
  const navigate = useNavigate();
  const { data: student, isLoading: loading, error } = useGetStudentProfileQuery();

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    console.error('Error loading student profile:', error);
    return (
      <div className="flex justify-center items-center h-96 text-center">
        <div>
          <p className="text-red-500 font-semibold">Error loading profile</p>
          <p className="text-sm text-muted-foreground mt-2 mb-4">{error?.data?.message || 'Please try refreshing the page'}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-muted-foreground">Student profile not found.</p>
      </div>
    );
  }

  // Log the student data for debugging
  console.log('Student data:', student);

  // Safely extract values with fallbacks
  const studentName = student?.user?.name || student?.name || 'Student';
  const studentEmail = student?.user?.email || student?.email || 'Not available';
  const studentCnic = student?.cnic || 'Not available';
  const roomNumber = student?.room?.number || 'Unassigned';
  const enrollmentDate = student?.createdAt || student?.enrollmentDate || new Date();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md perspective-1000">
        <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden text-white p-6 flex flex-col justify-between transform transition-transform hover:scale-105 duration-500">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full blur-3xl" />
             <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center font-bold text-xl border border-white/30">
                H
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">Hostel<span className="text-indigo-200">AI</span></h3>
                <p className="text-xs text-indigo-200">Official Student ID</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md">
              {student?.isActive !== false ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Content */}
          <div className="relative z-10 flex gap-6 items-center mt-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 overflow-hidden flex items-center justify-center">
                <User className="w-12 h-12 text-white/80" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-indigo-600">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{studentName}</h2>
              <p className="text-indigo-200 text-sm font-medium">{studentEmail}</p>
              <div className="flex items-center gap-2 text-xs text-indigo-100 mt-2 bg-white/10 px-2 py-1 rounded-md w-fit">
                <CreditCard className="w-3 h-3" />
                <span>CNIC: {studentCnic}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Room Number</p>
              <p className="font-mono text-xl font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {roomNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Joined Date</p>
              <p className="font-mono text-sm font-medium flex items-center justify-end gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(enrollmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
