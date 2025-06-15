'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Linkedin, Twitter, Mail, Award, Users, BookOpen, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Chief Medical Officer',
      bio: 'Board-certified physician with 15+ years in AI-driven healthcare solutions and medical diagnostics.',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
      credentials: ['MD', 'PhD in Medical AI', 'Board Certified Internal Medicine'],
      social: {
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/drsarahchen',
        email: 'sarah.chen@dxai.com'
      }
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      role: 'Head of AI Research',
      bio: 'Leading AI researcher specializing in medical image analysis and natural language processing for healthcare.',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
      credentials: ['PhD Computer Science', 'MS Biomedical Engineering', '50+ Published Papers'],
      social: {
        linkedin: 'https://linkedin.com/in/michaelrodriguez',
        email: 'michael.rodriguez@dxai.com'
      }
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      role: 'Clinical Director',
      bio: 'Experienced clinician focused on integrating AI tools into clinical workflows and patient care protocols.',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
      credentials: ['MD', 'MPH', 'Board Certified Emergency Medicine'],
      social: {
        linkedin: 'https://linkedin.com/in/emilywatson',
        twitter: 'https://twitter.com/dremilywatson',
        email: 'emily.watson@dxai.com'
      }
    },
    {
      id: '4',
      name: 'Dr. James Park',
      role: 'Data Science Lead',
      bio: 'Expert in healthcare data analytics and machine learning model development for medical applications.',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
      credentials: ['PhD Statistics', 'MS Computer Science', 'Healthcare Data Specialist'],
      social: {
        linkedin: 'https://linkedin.com/in/jamespark',
        email: 'james.park@dxai.com'
      }
    }
  ];

  const stats = [
    { icon: Users, label: 'Medical Professionals', value: '50+' },
    { icon: Award, label: 'Years Combined Experience', value: '200+' },
    { icon: BookOpen, label: 'Research Publications', value: '150+' },
    { icon: Stethoscope, label: 'Patients Helped', value: '100K+' }
  ];

  const handleSocialClick = (url: string, platform: string) => {
    window.open(url, '_blank');
    toast.success(`Opening ${platform} profile`);
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
    toast.success(`Opening email to ${email}`);
  };

  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 medical-gradient rounded-3xl mb-10 medical-shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 medical-text-gradient font-poppins">
            Meet Our Medical Team
          </h2>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-inter">
            Our team combines decades of medical expertise with cutting-edge AI research 
            to deliver accurate, reliable healthcare insights you can trust.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold medical-text-gradient mb-2 font-poppins">
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
          {teamMembers.map((member) => (
            <Card key={member.id} className="medical-card group hover:medical-shadow-lg transition-medical">
              <CardContent className="p-8 text-center">
                {/* Profile Image */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden medical-shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 medical-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 font-poppins mb-1">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium text-sm font-inter">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-inter">
                    {member.bio}
                  </p>

                  {/* Credentials */}
                  <div className="space-y-2">
                    {member.credentials.map((credential, index) => (
                      <div key={index} className="text-xs text-slate-500 font-inter bg-slate-50 px-3 py-1 rounded-full">
                        {credential}
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-4">
                    {member.social.linkedin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 hover:bg-green-50 rounded-full group/btn"
                        onClick={() => handleSocialClick(member.social.linkedin!, 'LinkedIn')}
                      >
                        <Linkedin className="w-4 h-4 text-green-600 group-hover/btn:scale-110 transition-transform duration-200" />
                      </Button>
                    )}
                    {member.social.twitter && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 hover:bg-blue-50 rounded-full group/btn"
                        onClick={() => handleSocialClick(member.social.twitter!, 'Twitter')}
                      >
                        <Twitter className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform duration-200" />
                      </Button>
                    )}
                    {member.social.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 hover:bg-blue-50 rounded-full group/btn"
                        onClick={() => handleEmailClick(member.social.email!)}
                      >
                        <Mail className="w-4 h-4 text-slate-600 group-hover/btn:scale-110 transition-transform duration-200" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="medical-card p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-slate-800 mb-6 font-poppins">
              Trusted by Healthcare Professionals
            </h3>
            <p className="text-slate-600 mb-8 font-inter text-lg leading-relaxed">
              Our AI-powered diagnostic tools are developed and validated by leading medical experts 
              to ensure accuracy and reliability in clinical decision-making.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 flex-wrap">
              <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                <Award className="w-4 h-4 text-green-600" />
                <span>FDA Guidelines Compliant</span>
              </div>
              <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                <Stethoscope className="w-4 h-4 text-red-500" />
                <span>HIPAA Secure</span>
              </div>
              <div className="flex items-center gap-2 glass-medical px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}