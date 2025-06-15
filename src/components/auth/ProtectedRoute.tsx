'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { Stethoscope } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading } = useAuth();
  const { isLoading } = useLoading();

  // Show loading screen while auth is loading or app is initializing
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 medical-shadow-lg animate-pulse">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold medical-text-gradient font-poppins mb-2">
            DxAI
          </h2>
          <p className="text-slate-600 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  // Always show content - authentication will be handled at component level
  return <>{children}</>;
}