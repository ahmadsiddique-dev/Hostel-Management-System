import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket, { connectSocket, disconnectSocket } from '../socket/socket';
import { selectCurrentToken } from '../store/authSlice';
import toast from 'react-hot-toast';

// Custom hook to handle Socket.IO connection and events
export const useSocket = () => {
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (token) {
      // Connect socket with token
      connectSocket(token);

      // Listen for new notifications
      socket.on('new-notification', (notification) => {
        console.log('🔔 New notification received:', notification);
        
        // Show toast notification
        toast.success(`New notification: ${notification.title}`, {
          duration: 4000,
          icon: '🔔',
        });

        // Trigger a custom event for components to listen to
        window.dispatchEvent(new CustomEvent('new-notification', {
          detail: notification
        }));
      });

      // Cleanup on unmount or token change
      return () => {
        socket.off('new-notification');
        disconnectSocket();
      };
    }
  }, [token]);

  return socket;
};
