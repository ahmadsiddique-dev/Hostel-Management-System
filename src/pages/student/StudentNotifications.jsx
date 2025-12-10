import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock } from 'lucide-react';
import { useGetNotificationsQuery } from '@/store/api/apiSlice';

const StudentNotifications = () => {
  const { data: notifications = [], refetch } = useGetNotificationsQuery();
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Listen for real-time notification events
  useEffect(() => {
    const handleNewNotification = () => {
      console.log('🔄 Refreshing notifications list...');
      refetch(); // Refresh the notification list
    };

    // Listen for custom event from useSocket hook
    window.addEventListener('new-notification', handleNewNotification);

    return () => {
      window.removeEventListener('new-notification', handleNewNotification);
    };
  }, [refetch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with latest announcements.</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {unreadCount} New
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">No notifications yet.</div>
        ) : (
          notifications.map((notification) => (
            <Card key={notification._id} className={`transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-lg ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                        {!notification.isRead && (
                          <Badge variant="outline" className="ml-2 text-xs">NEW</Badge>
                        )}
                      </h4>
                      <p className="text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
