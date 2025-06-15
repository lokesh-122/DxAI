'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import { Stethoscope, Shield, Heart, Brain, Star, CheckCircle2, Users, TrendingUp, Zap } from 'lucide-react';

export default function SignInPage() {
  const { user, loading: authLoading } = useAuth();
  const { isLoading } = useLoading();
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Don't render content while loading or if user is already authenticated
  if (isLoading || authLoading || user) {
    return null;
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get instant diagnosis insights with 95% accuracy, explained in simple terms you can understand."
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Receive tailored lifestyle, dietary, and medical care recommendations for your specific condition."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data is protected with enterprise-grade security and HIPAA compliance."
    }
  ];

  const stats = [
    { icon: Users, label: "Users Helped", value: "100K+" },
    { icon: TrendingUp, label: "Accuracy Rate", value: "95%" },
    { icon: Zap, label: "Analysis Time", value: "15s" }
  ];

  const trustIndicators = [
    "HIPAA Compliant",
    "FDA Guidelines", 
    "End-to-End Encrypted",
    "AI-Powered"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-800 font-poppins">
              Welcome to DxAI
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-inter">
              Sign in to access AI-powered medical diagnosis insights, personalized recommendations, 
              and nearby hospital suggestions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 font-poppins">
                  Why Choose DxAI?
                </h2>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2 font-poppins">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-inter">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 font-poppins flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Trusted & Secure
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700 font-inter">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md border border-slate-200">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 mb-1 font-poppins">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 font-inter">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <div className="p-8">
                  <AuthForm />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 font-poppins">
                Experience the Future of Healthcare
              </h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium font-inter">Instant AI Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium font-inter">Personalized Recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium font-inter">Hospital Finder</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium font-inter">HIPAA Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}