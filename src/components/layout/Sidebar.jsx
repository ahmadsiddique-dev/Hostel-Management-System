import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  UserPlus,
  CalendarCheck,
  Bell,
  LogOut,
  CreditCard,
  IdCard,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);



  // ... inside component
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  const managerLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
    { href: '/admin/register', label: 'Register Student', icon: UserPlus },
    { href: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/complaints', label: 'Complaints', icon: MessageSquare },
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/student/fees', label: 'Fees', icon: CreditCard },
    { href: '/student/notifications', label: 'Notifications', icon: Bell },
    { href: '/student/id-card', label: 'Digital ID', icon: IdCard },
    { href: '/student/complaints', label: 'Complaints', icon: MessageSquare },
  ];

  const links = role === 'admin' ? managerLinks : studentLinks;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header - Always visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">H</div>
            <span className="text-lg font-bold">Hostel<span className="text-primary">AI</span></span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Desktop Logo */}
        <div className="hidden lg:flex p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">H</div>
            <span className="text-xl font-bold">Hostel<span className="text-primary">AI</span></span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-16 lg:mt-0" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link key={link.href} to={link.href} onClick={closeSidebar}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-background">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
