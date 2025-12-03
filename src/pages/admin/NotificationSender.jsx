import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSendNotificationMutation, useGetStudentsQuery } from '@/store/api/apiSlice';

// Fallback for Textarea
const FormTextarea = (props) => (
  <textarea 
    {...props} 
    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const NotificationSender = () => {
  const [target, setTarget] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [message, setMessage] = useState('');
  
  const { data: students = [], isLoading: loadingStudents } = useGetStudentsQuery();
  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const handleSend = async () => {
    try {
      const payload = {
        title: 'Announcement',
        message,
        target
      };
      
      if (target === 'specific' && selectedStudentId) {
        payload.student = selectedStudentId;
      }
      
      await sendNotification(payload).unwrap();
      setMessage('');
      setSelectedStudentId('');
      toast.success('Notification sent successfully!');
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">Send announcements to students.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
          <CardDescription>Select audience and write your message.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${target === 'all' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-accent'}`}
                onClick={() => setTarget('all')}
              >
                <Users className="w-6 h-6" />
                <span className="font-medium text-center">All Students</span>
              </div>
              <div 
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${target === 'specific' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-accent'}`}
                onClick={() => setTarget('specific')}
              >
                <User className="w-6 h-6" />
                <span className="font-medium text-center">Specific Student</span>
              </div>
            </div>
          </div>

          {target === 'specific' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-medium">Select Student</label>
              {loadingStudents ? (
                <div className="text-sm text-muted-foreground">Loading students...</div>
              ) : (
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">-- Select a student --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.user?.name || 'Unknown'} ({student.room?.number || 'No Room'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <FormTextarea 
              placeholder="Type your announcement here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSend} 
            disabled={!message || (target === 'specific' && !selectedStudentId) || isLoading}
          >
            <Send className="w-4 h-4 mr-2" /> 
            {isLoading ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSender;
