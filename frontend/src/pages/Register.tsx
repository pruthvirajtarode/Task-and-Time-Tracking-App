import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SEO } from '../components/SEO';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  
  const isConfirmMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/register', { 
        name: data.name, 
        email: data.email, 
        password: data.password 
      });
      if (res.success) {
        login(res.data.token, res.data.user);
        toast.success('Account created successfully');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign Up" />
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
            <h2 className="text-4xl font-bold text-white mb-4">Empower Your Productivity.</h2>
            <p className="text-textMuted text-lg max-w-md">Join TaskFlow AI and streamline your workflow with intelligent task and time management tailored for professionals.</p>
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
              <p className="text-textMuted mt-2">Create your account to get started.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
                <label className="block text-sm font-medium text-textMuted mb-1">Full Name</label>
                <input
                  type="text"
                  className={`input-field ${errors.name ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
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
              
              <div className="animate-slide-up" style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}>
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
                
                {/* Dynamic Password Checklist */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={passwordValue?.length >= 8 ? "text-success" : "text-textMuted/40"} />
                    <span className={passwordValue?.length >= 8 ? "text-textMuted" : "text-textMuted/60"}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={/[A-Z]/.test(passwordValue || '') ? "text-success" : "text-textMuted/40"} />
                    <span className={/[A-Z]/.test(passwordValue || '') ? "text-textMuted" : "text-textMuted/60"}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={/[a-z]/.test(passwordValue || '') ? "text-success" : "text-textMuted/40"} />
                    <span className={/[a-z]/.test(passwordValue || '') ? "text-textMuted" : "text-textMuted/60"}>One lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={/[0-9]/.test(passwordValue || '') ? "text-success" : "text-textMuted/40"} />
                    <span className={/[0-9]/.test(passwordValue || '') ? "text-textMuted" : "text-textMuted/60"}>One number</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={/[^A-Za-z0-9]/.test(passwordValue || '') ? "text-success" : "text-textMuted/40"} />
                    <span className={/[^A-Za-z0-9]/.test(passwordValue || '') ? "text-textMuted" : "text-textMuted/60"}>One special character</span>
                  </div>
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}>
                <label className="block text-sm font-medium text-textMuted mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`input-field pr-10 transition-colors duration-300
                      ${errors.confirmPassword && !isConfirmMatch ? 'border-danger focus:border-danger focus:ring-danger' : ''}
                      ${isConfirmMatch ? 'border-success text-success focus:border-success focus:ring-success' : ''}
                    `}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                      ${isConfirmMatch ? 'text-success' : 'text-textMuted hover:text-text'}
                    `}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {isConfirmMatch ? <CheckCircle2 size={18} /> : showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && !isConfirmMatch && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
                <button
                  type="submit"
                  className="btn-primary w-full mt-6 py-3"
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-textMuted mt-6 animate-slide-up" style={{ animationDelay: '600ms', opacity: 0, animationFillMode: 'forwards' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
