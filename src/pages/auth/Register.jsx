import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Mail, Lock, User, Github, Chrome } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const formRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords don't match");
    
    setLoading(true);
    try {
      // Register as Admin for this public form
      await import('@/lib/api').then(m => m.default.post('/auth/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        role: 'admin' 
      }));
      alert('Admin account created! Please log in at the Admin Portal.');
      navigate('/admin/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".register-content", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
      
      gsap.from(".register-image", {
        x: -20,
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
      {/* Left Side - Image/Pattern (Swapped for Register) */}
      <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900">
           <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-indigo-500/20" />
           <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse duration-[7000ms]" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center z-10 register-image">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/20">H</div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Join the Future</h2>
          <p className="text-lg text-gray-300 max-w-md">Create an account to start managing your hostel with the power of AI.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center relative z-10">
        <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
          Back to Home
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center lg:text-left space-y-2 register-content">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">Enter your details below to create your account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 register-content" ref={formRef}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button disabled={loading} className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative register-content">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 register-content">
            <Button variant="outline" className="h-11 hover:bg-muted transition-colors">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="h-11 hover:bg-muted transition-colors">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground register-content">
            Already have an account?{" "}
            <Link to="/admin/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
