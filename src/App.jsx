import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { useSocket } from './hooks/useSocket';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// Layouts
import ManagerLayout from './components/layout/ManagerLayout';
import StudentLayout from './components/layout/StudentLayout';

// Manager Pages
import Dashboard from './pages/management/Dashboard';
import Students from './pages/management/Students';
import StudentRegistration from './pages/admin/StudentRegistration';
import StudentProfile from './pages/admin/StudentProfile';
import AttendanceManager from './pages/admin/AttendanceManager';
import NotificationSender from './pages/admin/NotificationSender';
import Rooms from './pages/management/Rooms';
import ManagerComplaints from './pages/management/ManagerComplaints';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentFees from './pages/student/StudentFees';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentIdCard from './pages/student/StudentIdCard';
import StudentComplaints from './pages/student/StudentComplaints';

function App() {
  // Initialize Socket.IO connection
  useSocket();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/secret-admin-register" element={<Register />} />

          {/* Manager Routes */}
          <Route path="/admin" element={<ManagerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="register" element={<StudentRegistration />} />
            <Route path="student/:id" element={<StudentProfile />} />
            <Route path="attendance" element={<AttendanceManager />} />
            <Route path="notifications" element={<NotificationSender />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="complaints" element={<ManagerComplaints />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="id-card" element={<StudentIdCard />} />
            <Route path="complaints" element={<StudentComplaints />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;