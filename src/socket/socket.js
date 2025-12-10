import { io } from 'socket.io-client';

// Get API URL from environment
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Create socket instance (don't auto-connect yet)
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

// Helper to get token from Redux store
export const connectSocket = (token) => {
  if (!token) {
    console.warn('⚠️ Cannot connect socket: No token provided');
    return;
  }

  // Set auth token
  socket.auth = { token };
  
  // Connect
  socket.connect();
  
  console.log('🔌 Socket connecting...');
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket disconnected');
  }
};

// Socket event listeners
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Socket disconnected:', reason);
});

export default socket;
