'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/loading-screen';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoadingScreen: (duration?: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInitialLoad, setShowInitialLoad] = useState(true);

  useEffect(() => {
    // Show loading screen on initial app load for 1.5 seconds (faster)
    const timer = setTimeout(() => {
      setShowInitialLoad(false);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const showLoadingScreen = (duration = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  const handleLoadingComplete = () => {
    setShowInitialLoad(false);
    setIsLoading(false);
  };

  const value = {
    isLoading,
    setIsLoading,
    showLoadingScreen
  };

  return (
    <LoadingContext.Provider value={value}>
      {showInitialLoad && (
        <LoadingScreen 
          onComplete={handleLoadingComplete}
          duration={1500}
        />
      )}
      {!showInitialLoad && children}
    </LoadingContext.Provider>
  );
}