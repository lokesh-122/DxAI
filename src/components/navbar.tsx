'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, Menu, X, LogOut, User, FileText, Users, BarChart3, Zap, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/', icon: Stethoscope },
    // { label: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
    { label: 'Upload', href: '/upload', icon: FileText },
    { label: 'Team', href: '/team', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const handleQuickStart = () => {
    router.push('/upload');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0]; // First name only
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Username part of email
    }
    return 'User';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 medical-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center medical-shadow group-hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold medical-text-gradient font-poppins">
                DxAI
              </h1>
              <p className="text-xs text-slate-600 hidden sm:block">
                AI Medical Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Show all items, but dashboard requires auth
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => handleNavigation(item.href)}
                  className="text-slate-700 hover:text-green-600 font-medium transition-colors duration-200 focus-medical flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
            
            {/* Quick Start Button */}
            <Button
              onClick={handleQuickStart}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Upload Report
            </Button>
            
            {/* Authentication Section - Only render when not loading */}
            {!authLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="focus-medical hover:bg-green-50 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3 text-green-600" />
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {getUserDisplayName()}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="medical-card w-56">
                      <div className="px-3 py-2 text-sm">
                        <p className="font-medium text-slate-900">
                          {user.displayName || getUserDisplayName()}
                        </p>
                        <p className="text-slate-600 text-xs">
                          {user.email || 'demo@dxai.com'}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <Lock className="w-3 h-3" />
                          <span>Authenticated</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => handleNavigation('/upload')}
                        className="hover:bg-green-50 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Report
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="hover:bg-red-50 text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={handleSignIn}
                    variant="outline"
                    className="hover:bg-green-50 border-green-300 text-green-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Quick Start */}
            <Button
              onClick={handleQuickStart}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg"
            >
              <Zap className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus-medical"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-200 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
        )}>
          <div className="pt-4 space-y-3">
            {navItems.map((item) => {
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => handleNavigation(item.href)}
                  className="w-full justify-start text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors duration-200 focus-medical"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
            
            {/* Mobile Authentication - Only render when not loading */}
            {!authLoading && (
              <>
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-slate-600 border-t border-slate-200 mt-3 pt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-3 h-3 text-green-600" />
                        <span>Signed in as {getUserDisplayName()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleSignIn}
                    className="w-full justify-start text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors duration-200 focus-medical"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}