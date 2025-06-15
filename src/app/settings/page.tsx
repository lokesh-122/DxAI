'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Camera, 
  Save, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings as SettingsIcon,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Activity,
  FileText,
  Smartphone,
  Monitor,
  Globe,
  Moon,
  Sun,
  Languages,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check if user has uploaded reports (mock check for now)
  const [hasReports] = useState(false); // Set to true when user has reports

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    address: '123 Main St, City, State 12345'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    healthReminders: true,
    reportSummaries: true,
    productUpdates: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: 'private',
    twoFactorAuth: false
  });

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

  // Show login form if user is not authenticated
  if (!user) {
    return <AuthForm />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Privacy settings updated!');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    if (!hasReports) {
      toast.info('No data to export yet. Upload your first medical report to get started!');
      return;
    }
    toast.success('Preparing data export... You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires additional verification. Please contact support.');
  };

  const handleAvatarUpload = () => {
    toast.info('Avatar upload feature coming soon!');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@dxai.health', '_blank');
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 font-poppins">
                Manage Your DxAI Experience
              </h1>
              <p className="text-slate-600 font-inter">
                Update your preferences, privacy, and account settings anytime
              </p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg p-1 scale-in rounded-2xl">
            <TabsTrigger value="profile" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              <SettingsIcon className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              Privacy & Data
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Camera className="w-5 h-5 text-blue-500" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-32 h-32 mx-auto shadow-lg border-4 border-white">
                    <AvatarImage src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-2xl font-bold">
                      {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleAvatarUpload}
                      className="w-full gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl"
                    >
                      <Upload className="w-4 h-4" />
                      Upload New Photo
                    </Button>
                    <p className="text-xs text-slate-500 font-inter">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl lg:col-span-2 fade-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <User className="w-5 h-5 text-teal-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-slate-700 font-medium">
                          Time Zone
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select 
                            id="timezone"
                            value={profileData.timezone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full h-12 pl-10 pr-4 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white"
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-lg font-medium rounded-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Updating Profile...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Theme & Language */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Moon className="w-5 h-5 text-blue-500" />
                    Theme & Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Mode */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value as any }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            preferences.theme === theme.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 hover:border-blue-300 text-slate-600'
                          }`}
                        >
                          <theme.icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="text-sm font-medium">{theme.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">Language</Label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full h-12 pl-10 pr-4 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white"
                      >
                        <option value="en">English (Default)</option>
                        <option value="es" disabled>Spanish (Coming Soon)</option>
                        <option value="fr" disabled>French (Coming Soon)</option>
                        <option value="de" disabled>German (Coming Soon)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Bell className="w-5 h-5 text-teal-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium text-slate-800">Email me report summaries</h4>
                          <p className="text-sm text-slate-600">Get notified when analysis is complete</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.reportSummaries}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, reportSummaries: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-teal-500" />
                        <div>
                          <h4 className="font-medium text-slate-800">Health reminders</h4>
                          <p className="text-sm text-slate-600">Medication and appointment reminders</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.healthReminders}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, healthReminders: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-cyan-50/50 rounded-xl border border-cyan-100">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-cyan-500" />
                        <div>
                          <h4 className="font-medium text-slate-800">Product updates</h4>
                          <p className="text-sm text-slate-600">Monthly newsletter and feature updates</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.productUpdates}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, productUpdates: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handlePreferencesUpdate}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl"
              >
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Privacy & Data Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Privacy Controls */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Privacy Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div>
                      <h4 className="font-medium text-slate-800">Data Sharing</h4>
                      <p className="text-sm text-slate-600">Allow anonymized data for research</p>
                    </div>
                    <Switch
                      checked={privacySettings.dataSharing}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                    <div>
                      <h4 className="font-medium text-slate-800">Analytics Tracking</h4>
                      <p className="text-sm text-slate-600">Help improve our service with usage analytics</p>
                    </div>
                    <Switch
                      checked={privacySettings.analyticsTracking}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, analyticsTracking: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Profile Visibility</Label>
                    <select 
                      className="w-full h-12 px-3 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white"
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Download className="w-5 h-5 text-teal-500" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-xl bg-blue-50/30">
                      <h4 className="font-medium text-slate-800 mb-2">Export Your Data</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        {hasReports 
                          ? 'Download a copy of all your medical reports and analysis data'
                          : 'No data to export yet. Upload your first medical report to get started!'
                        }
                      </p>
                      <Button 
                        onClick={handleExportData}
                        variant="outline" 
                        className={`w-full gap-2 rounded-xl ${
                          hasReports 
                            ? 'hover:bg-blue-50 border-blue-300' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!hasReports}
                      >
                        <Download className="w-4 h-4" />
                        {hasReports ? 'Request Data Export' : 'No Data Available'}
                      </Button>
                    </div>

                    <div className="p-4 border border-red-200 rounded-xl bg-red-50/30">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button 
                        onClick={handleDeleteAccount}
                        variant="outline" 
                        className="w-full gap-2 text-red-600 border-red-300 hover:bg-red-100 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* HIPAA Compliance Notice */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-2xl fade-in-up">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2 text-lg font-poppins">HIPAA Compliant & Secure</h4>
                    <p className="text-green-700 font-inter leading-relaxed">
                      Your medical data is protected under HIPAA regulations and encrypted with enterprise-grade security. 
                      We follow strict privacy protocols to ensure your health information remains confidential and secure.
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">End-to-End Encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">FDA Guidelines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">SOC 2 Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={handlePrivacyUpdate}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl"
              >
                Update Privacy Settings
              </Button>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Support */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Mail className="w-5 h-5 text-blue-500" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 font-inter">
                    Need help? Our support team is here to assist you with any questions or issues.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleContactSupport}
                      className="w-full gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl"
                    >
                      <Mail className="w-4 h-4" />
                      Email Support
                    </Button>
                    <div className="text-center text-sm text-slate-500">
                      support@dxai.health
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Resources */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-lg rounded-2xl fade-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <HelpCircle className="w-5 h-5 text-teal-500" />
                    Help Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      className="w-full gap-2 justify-between hover:bg-blue-50 border-blue-200 rounded-xl"
                      onClick={() => toast.info('FAQ section coming soon!')}
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        FAQ / Help Center
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full gap-2 justify-between hover:bg-teal-50 border-teal-200 rounded-xl"
                      onClick={() => window.open('/terms', '_blank')}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Terms of Service
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full gap-2 justify-between hover:bg-cyan-50 border-cyan-200 rounded-xl"
                      onClick={() => window.open('/privacy', '_blank')}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Privacy Policy
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* App Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/50 rounded-2xl fade-in-up">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 font-poppins">DxAI</h3>
                <p className="text-slate-600 mb-4 font-inter">AI-Powered Medical Diagnosis Assistant</p>
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>Built with ❤️ for better healthcare</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}