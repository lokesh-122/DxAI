'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Building2, User, Copy, ThumbsUp, ThumbsDown, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Message, PDFData } from '@/app/page';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  pdfData: PDFData | null;
}

export function ChatInterface({ messages, onSendMessage, isProcessing, pdfData }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    onSendMessage(input.trim());
    setInput('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const businessQuestions = [
    "Generate an executive summary of this document",
    "What are the key performance indicators?",
    "Identify risks and compliance issues",
    "Provide strategic recommendations",
    "Analyze financial performance metrics"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <ScrollArea className="flex-1 px-6 business-scrollbar" ref={scrollAreaRef}>
        <div className="py-6 space-y-6 max-w-5xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'ai' && (
                <Avatar className="w-10 h-10 border-2 border-white business-shadow">
                  <AvatarFallback className="business-gradient text-white">
                    <Building2 className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={cn(
                "max-w-3xl transition-all duration-300 hover:business-shadow-lg group",
                message.type === 'user' 
                  ? 'business-gradient text-white business-shadow' 
                  : 'business-card business-shadow'
              )}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="whitespace-pre-wrap leading-relaxed text-base">
                      {message.content}
                    </div>
                    
                    {message.metadata && (
                      <div className="flex items-center gap-6 text-xs opacity-75 pt-3 border-t border-current/20">
                        <span className="flex items-center gap-1">
                          📄 {message.metadata.fileName}
                        </span>
                        <span className="flex items-center gap-1">
                          📊 {message.metadata.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          📝 {message.metadata.wordCount?.toLocaleString()} words
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-xs opacity-60 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {message.type === 'user' && (
                <Avatar className="w-10 h-10 border-2 border-white business-shadow">
                  <AvatarFallback className="bg-gray-100">
                    <User className="w-5 h-5 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex gap-4 justify-start">
              <Avatar className="w-10 h-10 border-2 border-white business-shadow">
                <AvatarFallback className="business-gradient text-white">
                  <Building2 className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="business-card business-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      DxAI is analyzing your business document...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Business Questions */}
      {pdfData && messages.length <= 2 && (
        <div className="px-6 py-4 business-card border-t m-4 rounded-lg business-shadow">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Business Intelligence Queries:
            </p>
            <div className="flex flex-wrap gap-3">
              {businessQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(question)}
                  className="text-sm h-9 bg-white hover:bg-gray-50 border-gray-200 transition-all duration-200 hover:border-blue-300"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 business-card border-t m-4 rounded-lg business-shadow">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pdfData ? "Ask DxAI about your business document..." : "Upload a business document to begin analysis..."}
                disabled={isProcessing || !pdfData}
                className="h-12 pr-12 bg-white border-gray-200 focus:border-blue-500 transition-all duration-200 text-base"
              />
              {input && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <TrendingUp className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || isProcessing || !pdfData}
              className="h-12 px-6 business-gradient hover:opacity-90 transition-all duration-200 business-shadow"
            >
              <Send className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}