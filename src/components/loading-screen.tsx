'use client';

import { useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 1500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 4; // Faster increment (4% each time)
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 200); // Faster completion
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, duration / 25); // 25 steps to reach 100% (faster)

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-200 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Stethoscope className="w-10 h-10 text-white" />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          DxAI
        </h1>
        <p className="text-slate-600 mb-8">AI Medical Assistant</p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress Text */}
        <p className="text-slate-500 text-sm">
          Loading... {progress}%
        </p>
      </div>
    </div>
  );
}