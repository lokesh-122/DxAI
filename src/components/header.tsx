'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Building2, Download, Settings, TrendingUp, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8 business-shadow">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 business-gradient rounded-lg flex items-center justify-center business-shadow">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-gray-900">
              DxAI Enterprise
            </h1>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              Business Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Enterprise</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">System Online</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="business-card">
            <DropdownMenuItem className="hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}