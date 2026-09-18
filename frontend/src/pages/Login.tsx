import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SEO } from '../components/SEO';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email: data.email, password: data.password });
      if (res.success) {
        login(res.data.token, res.data.user);
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Log In" />
      <div className="min-h-screen flex bg-background">
        
        {/* Left Side: Image Container (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 relative bg-surface items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-overlay"></div>
          <img 
            src="/auth-bg.png" 
            alt="Productivity Abstract" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 flex flex-col justify-end p-12">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Back to TaskFlow.</h2>
            <p className="text-textMuted text-lg max-w-md">Log in to seamlessly pick up where you left off and stay on top of your priorities.</p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Subtle background glow for mobile */}
          <div className="lg:hidden absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="lg:hidden absolute -bottom-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="w-full max-w-md animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text">TaskFlow AI</h1>
              <p className="text-textMuted mt-2">Welcome back. Log in to your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
                <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
                <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field pr-10 ${errors.password ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}>
                <button
                  type="submit"
                  className="btn-primary w-full mt-6 py-3"
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-textMuted mt-6 animate-slide-up" style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primaryHover font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
