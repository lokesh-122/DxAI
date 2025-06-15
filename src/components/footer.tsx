'use client';

import { Stethoscope, Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="mb-8">
          {/* Brand Section */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 medical-gradient rounded-2xl flex items-center justify-center medical-shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold medical-text-gradient font-poppins">
                DxAI
              </h3>
              <p className="text-sm text-slate-400">
                AI Medical Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400 font-inter">
              © {currentYear} DxAI. All rights reserved.
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-6 p-6 bg-slate-800 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm text-slate-400 leading-relaxed font-inter">
                <strong className="text-slate-300 text-base">Medical Disclaimer:</strong> DxAI is an AI-powered diagnostic assistance tool 
                designed to support healthcare decision-making. It is not intended to replace professional medical advice, 
                diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions 
                regarding medical conditions. Never disregard professional medical advice or delay seeking treatment 
                because of information provided by DxAI.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}