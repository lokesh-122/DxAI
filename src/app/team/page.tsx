'use client';

import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Star, Sparkles, Users, Award, Coffee, Heart } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
  contributions: string[];
}

export default function TeamPage() {
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


const developers: Developer[] = [
    {
      id: '1',
      name: 'J Lokesh Varma',
      role: 'Lead & Gen AI Engineer',
      bio: 'Passionate full-stack developer with expertise in React, Node.js, and AI integration. Led the development of DxAI\'s core architecture and user interface.',
      image: '/lokesh.png', // updated to local image
      social: {
        github: 'https://github.com/jlokeshvarma',
        linkedin: 'https://linkedin.com/in/jlokeshvarma',
        email: 'lokesh@dxai.com'
      },
      contributions: [
        'Designed and implemented the main application architecture',
        'Developed the medical report upload and analysis system',
        'Created the responsive UI/UX design',
        'Integrated AI diagnostic algorithms'
      ]
    },
    {
      id: '2',
      name: 'K Manosree',
      role: 'Project Manager & Data Scientist',
      bio: 'Experienced project manager and data scientist specializing in healthcare analytics and team coordination. Ensures project delivery while extracting valuable insights from medical data.',
      image: '/manosree.png', // updated to local image
      social: {
        github: 'https://github.com/kmanosree',
        linkedin: 'https://linkedin.com/in/kmanosree',
        email: 'manosree@dxai.com'
      },
      contributions: [
        'Managed project timelines and coordinated team efforts',
        'Analyzed medical data patterns and trends',
        'Developed data-driven insights for product improvement',
        'Ensured quality standards and project deliverables'
      ]
    },
    {
      id: '3',
      name: 'K Kiran',
      role: 'Backend and Gen AI Engineer',
      bio: 'Backend specialist with strong expertise in database design, API development, and generative AI systems. Focused on building scalable and intelligent backend solutions.',
      image: '/kiran.jpg', // updated to local image
      social: {
        github: 'https://github.com/kkiran',
        linkedin: 'https://linkedin.com/in/kkiran',
        email: 'kiran@dxai.com'
      },
      contributions: [
        'Built robust backend APIs and database architecture',
        'Implemented generative AI models for medical analysis',
        'Developed the hospital finder and mapping features',
        'Ensured HIPAA compliance and data security'
      ]
    },
    {
      id: '4',
      name: 'R Saritha',
      role: 'Frontend Developer & UI/UX Designer',
      bio: 'Creative frontend developer and designer focused on creating intuitive user experiences. Specialized in modern web technologies and accessibility.',
      image: '/saritha.jpg', // updated to local image
      social: {
        github: 'https://github.com/rsaritha',
        linkedin: 'https://linkedin.com/in/rsaritha',
        email: 'saritha@dxai.com'
      },
      contributions: [
        'Designed the complete user interface and experience',
        'Implemented responsive design across all devices',
        'Created the medical-themed design system',
        'Ensured accessibility compliance and best practices'
      ]
    }
  ];


  const teamStats = [
    { icon: Users, label: 'Team Members', value: '4', color: 'text-green-600' },
    { icon: Code, label: 'Lines of Code', value: '50K+', color: 'text-blue-600' },
    { icon: Coffee, label: 'Coffee Consumed', value: '∞', color: 'text-amber-600' },
    { icon: Heart, label: 'Passion Level', value: '100%', color: 'text-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden hero-bg">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 opacity-5">
            <Sparkles className="w-full h-full text-green-500 animate-spin" style={{animationDuration: '8s'}} />
          </div>
          <div className="absolute bottom-20 right-20 w-24 h-24 opacity-8">
            <Star className="w-full h-full text-blue-500 animate-pulse" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-20 fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 medical-text-gradient font-poppins">
                Meet Our Development Team
              </h1>
              
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-inter">
                The talented developers behind DxAI - combining technical expertise with passion 
                for healthcare innovation to create cutting-edge medical AI solutions.
              </p>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 stagger-children">
              {teamStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    <stat.icon className="w-8 h-8 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <div className="text-3xl font-bold medical-text-gradient mb-2 font-poppins group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium font-inter">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {developers.map((developer, index) => (
                <Card 
                  key={developer.id} 
                  className={`medical-card group hover:medical-shadow-lg transition-medical relative overflow-hidden ${
                    index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'
                  }`}
                >
                  {/* Card Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <CardContent className="p-8 text-center relative">
                    {/* Profile Image */}
                    <div className="relative mb-8">
                      <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden medical-shadow-lg group-hover:scale-105 transition-transform duration-500 relative">
                        <img
                          src={developer.image}
                          alt={developer.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-10 h-10 medical-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Floating sparkles */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="w-full h-full animate-pulse" />
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 font-poppins mb-1">
                          {developer.name}
                        </h3>
                        <p className="text-green-600 font-medium text-sm font-inter">
                          {developer.role}
                        </p>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed font-inter">
                        {developer.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center scale-in">
              <div className="medical-card p-12 rounded-3xl max-w-4xl mx-auto relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-cyan-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-6 h-6 text-green-400 opacity-30">
                  <Code className="w-full h-full animate-pulse" />
                </div>
                <div className="absolute bottom-4 left-4 w-5 h-5 text-blue-400 opacity-30">
                  <Star className="w-full h-full animate-spin" style={{animationDuration: '4s'}} />
                </div>
                
                <div className="relative">
                  <h3 className="text-3xl font-semibold text-slate-800 mb-6 font-poppins">
                    Built with Passion & Innovation
                  </h3>
                  <p className="text-slate-600 mb-8 font-inter text-lg leading-relaxed">
                    Our team is dedicated to revolutionizing healthcare through AI technology. 
                    We combine technical expertise with a deep understanding of medical needs 
                    to create solutions that truly make a difference.
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm text-slate-500 flex-wrap">
                    <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                      <Award className="w-4 h-4 text-green-600" />
                      <span>Excellence in Development</span>
                    </div>
                    <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Healthcare Innovation</span>
                    </div>
                    <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span>AI-Powered Solutions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}