'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight, Brain, MapPin, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .scale-in, .stagger-children'
    );
    
    animatedElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const validateForm = (isSignUp = false) => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Form submission - attempting sign in');
      await signIn(formData.email, formData.password);
      console.log('Sign in completed successfully');
    } catch (error: any) {
      console.error('Sign in form error:', error);
      // Error is already handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Form submission - attempting sign up');
      await signUp(formData.email, formData.password, formData.name);
      console.log('Sign up completed successfully');
    } catch (error: any) {
      console.error('Sign up form error:', error);
      // Error is already handled in the signUp function
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setFormData({
      email: 'demo@dxai.com',
      password: 'demo123',
      name: '',
      confirmPassword: ''
    });
    
    try {
      await signIn('demo@dxai.com', 'demo123');
    } catch (error) {
      // If demo account doesn't exist, create it
      try {
        await signUp('demo@dxai.com', 'demo123', 'Demo User');
      } catch (signUpError) {
        toast.error('Demo account setup failed. Please try manual sign up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "🧠 Smarter Reports, Simpler Words",
      description: "We translate complex medical jargon into clear, actionable summaries."
    },
    {
      icon: MapPin,
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "📍 Local Care, Instantly Mapped",
      description: "Get hospital recommendations nearby based on your actual condition."
    },
    {
      icon: Shield,
      image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "🔒 Built with Trust in Mind",
      description: "End-to-end encryption. Your data stays private, always."
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="medical-card medical-shadow-lg relative overflow-hidden scale-in">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        
        <CardHeader className="text-center pb-2 relative">
          <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-800 font-poppins">
            Welcome to DxAI
          </CardTitle>
          <p className="text-slate-600 font-inter">
            Unlock smarter, simpler healthcare insights
          </p>
        </CardHeader>

        <CardContent className="p-6 lg:p-8 relative">
          {/* Demo Account Button */}
          <div className="mb-6">
            <Button
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Setting up demo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Try Demo Account
                </div>
              )}
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">
              Quick access with demo@dxai.com
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 medical-card p-1 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg"></div>
              <TabsTrigger value="signin" className="gap-2 relative z-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2 relative z-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-700 font-medium font-inter">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-700 font-medium font-inter">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="signin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-green-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 interactive-hover-button text-white text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Signing In...
                    </div>
                  ) : (
                    <div className="button-content">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 button-arrow" />
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-slate-700 font-medium font-inter">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-700 font-medium font-inter">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-700 font-medium font-inter">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-green-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-700 font-medium font-inter">
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 focus:ring-2 focus:ring-green-500 border-slate-200 hover:border-green-300 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 interactive-hover-button text-white text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="button-content">
                      <span>Join DxAI</span>
                      <ArrowRight className="w-4 h-4 button-arrow" />
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Security Notice with Medical Image */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-blue-100/20"></div>
            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                <img 
                  src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Security"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-1 font-poppins">🔒 Built with Trust in Mind</p>
                <p className="text-green-700 font-inter leading-relaxed">
                  End-to-end encryption. Your data stays private, always. 
                  HIPAA compliant and FDA guidelines compliant.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}