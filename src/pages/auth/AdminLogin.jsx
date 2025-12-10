import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const formRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const api = await import('@/lib/api').then(m => m.default);
      const { data } = await api.post('/auth/login', { email, password });
      
      // Only allow admins on this login page
      if (data.user.role !== 'admin') {
        toast.error('Please use the Student Portal to login.');
        setLoading(false);
        return;
      }

      // New auth structure: { user, accessToken }
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".login-content", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-zinc-950">
         <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-900/10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <Link to="/" className="absolute top-0 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="text-center space-y-2 mb-8 login-content">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground">Restricted access for hostel management.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 login-content" ref={formRef}>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-red-500/50"
                id="email"
                placeholder="admin@gravity.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-red-500/50"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button disabled={loading} className="w-full h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
