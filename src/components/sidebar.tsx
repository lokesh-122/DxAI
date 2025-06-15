'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, FileText, MessageCircle, Clock, BarChart3, TrendingUp, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PDFData, Message } from '@/app/page';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pdfData: PDFData | null;
  messages: Message[];
}

export function Sidebar({ isOpen, onClose, pdfData, messages }: SidebarProps) {
  const recentMessages = messages.slice(-5).reverse();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:transform-none business-shadow",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Business Panel
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] lg:h-full business-scrollbar">
          <div className="p-6 space-y-8">
            {/* Document Info */}
            {pdfData && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Active Document
                </h3>
                <div className="business-card rounded-xl p-4 space-y-3 border border-blue-100 bg-blue-50/50">
                  <p className="font-medium text-gray-900 truncate">
                    {pdfData.metadata.fileName}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {pdfData.pages} pages
                    </span>
                    <span>{Math.round(pdfData.metadata.fileSize / 1024)} KB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full w-fit">
                    <Building2 className="w-3 h-3" />
                    Enterprise Ready
                  </div>
                </div>
              </div>
            )}

            {/* Business Analytics */}
            {pdfData && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Document Analytics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="business-card rounded-xl p-4 text-center border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">{pdfData.pages}</div>
                    <div className="text-xs text-blue-700 font-medium">Pages</div>
                  </div>
                  <div className="business-card rounded-xl p-4 text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(pdfData.text.split(' ').length / 1000)}K
                    </div>
                    <div className="text-xs text-green-700 font-medium">Words</div>
                  </div>
                </div>
                
                {/* Business Metrics */}
                <div className="business-card rounded-xl p-4 border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Analysis Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Text Extraction</span>
                      <span className="text-green-600 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Business Intelligence</span>
                      <span className="text-green-600 font-medium">Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strategic Analysis</span>
                      <span className="text-green-600 font-medium">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator className="bg-gray-200" />

            {/* Recent Conversations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Recent Analysis
              </h3>
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div key={message.id} className="business-card rounded-xl p-4 border border-gray-100 hover:business-shadow transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                      )} />
                      <span className="text-xs font-medium text-gray-600 capitalize">
                        {message.type === 'user' ? 'Business Query' : 'AI Analysis'}
                      </span>
                      <Clock className="w-3 h-3 text-gray-400 ml-auto" />
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No analysis yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Tools */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-sm hover:bg-gray-50">
                  Generate Executive Summary
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-sm hover:bg-gray-50">
                  Extract Key Metrics
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-sm hover:bg-gray-50">
                  Risk Assessment
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-sm hover:bg-gray-50">
                  Strategic Recommendations
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}