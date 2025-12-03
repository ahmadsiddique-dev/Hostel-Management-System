import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ArrowLeft, Mail, Lock, Github, Chrome } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const formRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const api = await import('@/lib/api').then(m => m.default);
      
      // Trim inputs to remove accidental whitespace
      const payload = { 
        email: email.trim(), 
        password: password.trim() 
      };

      const { data } = await api.post('/auth/login', payload);
      
      // Only allow students on this login page
      if (data.role === 'admin') {
        toast.error('Please use the Admin Portal to login.');
        setLoading(false);
        return;
      }

      dispatch(setCredentials({ user: data, token: data.token }));
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/student/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
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
      
      gsap.from(".login-image", {
        x: 20,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full flex bg-background text-foreground transition-colors duration-300">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center relative z-10">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center lg:text-left space-y-2 login-content">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 login-content" ref={formRef}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button disabled={loading} className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative login-content">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 login-content">
            <Button variant="outline" className="h-11 hover:bg-muted transition-colors">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="h-11 hover:bg-muted transition-colors">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground login-content">
            Don't have an account?{" "}
            <span className="text-primary font-medium">
              Contact your hostel manager.
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] animate-pulse duration-[5000ms]" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center z-10 login-image">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/20">H</div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Manage Hostels with AI</h2>
          <p className="text-lg text-gray-300 max-w-md">Streamline your campus operations with our intelligent management system.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
