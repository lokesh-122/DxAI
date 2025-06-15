'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Zap, Award, Activity, Stethoscope, ArrowRight, Upload, FileText, MapPin, Brain } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
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

  const features = [
    {
      icon: Heart,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms analyze your medical reports with 95% accuracy"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your medical data is encrypted and protected with enterprise-grade security"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive diagnosis insights and recommendations in under 30 seconds"
    }
  ];

  const capabilities = [
    {
      number: "1️⃣",
      title: "Upload Your Medical Report (PDF)",
      description: "Simply drag and drop any lab report like a Liver Function Test, Lipid Profile, or CBC.",
      icon: Upload,
      color: "text-green-600"
    },
    {
      number: "2️⃣",
      title: "Get Instant AI Summary",
      description: "DxAI reads your report and gives you diagnosis summary in plain language, condition stage (e.g., Mild / Moderate / Severe), and lifestyle & food recommendations powered by AI.",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      number: "3️⃣",
      title: "Find the Right Department",
      description: "Based on your condition, DxAI suggests which specialist you should consult (e.g., Gastroenterology, Cardiology).",
      icon: Stethoscope,
      color: "text-purple-600"
    },
    {
      number: "4️⃣",
      title: "Discover Hospitals Near You",
      description: "Integrated with Google Maps, see a list of verified hospitals nearby your location.",
      icon: MapPin,
      color: "text-red-600"
    }
  ];

  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="medical-text-gradient font-poppins block">
              AI-Powered Medical
            </span>
            <span className="text-slate-800 font-inter block">
              Diagnosis Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-inter fade-in-up">
            Upload your medical reports and get instant AI-powered diagnosis insights, 
            personalized treatment recommendations, and nearby hospital suggestions.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-12 flex-wrap stagger-children">
            <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span>HIPAA Compliant & Secure</span>
            </div>
            <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-green-600" />
              <span>FDA Guidelines Compliant</span>
            </div>
            <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Real-time Analysis</span>
            </div>
          </div>

          {/* Call to Action - Single Button */}
          <div className="flex justify-center scale-in">
            <Link href="/upload">
              <Button size="lg" className="interactive-hover-button text-white text-lg px-8 py-4 rounded-2xl">
                <div className="button-content">
                  <Stethoscope className="w-5 h-5 button-icon" />
                  <span>Upload Medical Report</span>
                  <ArrowRight className="w-5 h-5 button-arrow" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32 stagger-children">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="medical-card p-8 text-center group hover:scale-105 transition-medical"
            >
              <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* What DxAI Can Do Today Section */}
        <div className="relative fade-in-up">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20">
              <Brain className="w-full h-full text-green-500 animate-pulse" />
            </div>
            <div className="absolute top-20 right-20 w-16 h-16">
              <FileText className="w-full h-full text-blue-500 animate-bounce" />
            </div>
            <div className="absolute bottom-20 left-20 w-18 h-18">
              <Heart className="w-full h-full text-red-500 animate-pulse" />
            </div>
          </div>

          <div className="medical-card p-12 rounded-3xl medical-shadow-lg relative overflow-hidden">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            
            <div className="relative">
              {/* Section Header */}
              <div className="text-center mb-16 fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 medical-gradient rounded-3xl mb-8 medical-shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 medical-text-gradient font-poppins">
                  What DxAI Can Do Today
                </h2>
                
                <div className="max-w-3xl mx-auto">
                  <p className="text-2xl font-semibold text-slate-800 mb-4 font-poppins">
                    Your medical reports. Understood. Instantly.
                  </p>
                  <p className="text-lg text-slate-600 font-inter leading-relaxed">
                    Our Minimum Viable Product (MVP) focuses on solving the core pain points in healthcare literacy — using real AI.
                  </p>
                </div>
              </div>

              {/* MVP Badge */}
              <div className="flex justify-center mb-12 fade-in">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-lg">✅ What You Can Do Right Now:</span>
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {capabilities.map((capability, index) => (
                  <div 
                    key={index}
                    className={`group relative ${index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'}`}
                  >
                    <div className="medical-card p-8 rounded-2xl medical-shadow hover:medical-shadow-lg transition-medical h-full relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                        <capability.icon className="w-full h-full" />
                      </div>
                      
                      <div className="relative">
                        {/* Number and Icon */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-3xl font-bold">
                            {capability.number}
                          </div>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                            <capability.icon className={`w-6 h-6 ${capability.color}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-slate-800 mb-4 font-poppins group-hover:text-green-600 transition-colors duration-300">
                          {capability.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-inter">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center scale-in">
                <div className="inline-flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-800 font-poppins">
                      Ready to experience the future of healthcare?
                    </span>
                  </div>
                  
                  <Link href="/upload">
                    <Button size="lg" className="interactive-hover-button text-white text-lg px-10 py-4 rounded-2xl">
                      <div className="button-content">
                        <Upload className="w-5 h-5 button-icon" />
                        <span>Try DxAI Now - It's Free</span>
                        <ArrowRight className="w-5 h-5 button-arrow" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}