'use client';

import { PDFUploader } from '@/components/pdf-uploader';
import { Building2, TrendingUp, Shield, Users, BarChart3, FileText } from 'lucide-react';
import type { PDFData } from '@/app/page';

interface WelcomeScreenProps {
  onUpload: (data: PDFData) => void;
  isProcessing: boolean;
}

export function WelcomeScreen({ onUpload, isProcessing }: WelcomeScreenProps) {
  const businessFeatures = [
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Extract KPIs, financial metrics, and performance indicators from your reports"
    },
    {
      icon: TrendingUp,
      title: "Strategic Analysis",
      description: "Get actionable insights for strategic planning and decision-making"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with compliance standards for sensitive business data"
    }
  ];

  const businessStats = [
    { label: "Enterprise Clients", value: "500+" },
    { label: "Documents Processed", value: "1M+" },
    { label: "Accuracy Rate", value: "99.8%" },
    { label: "Processing Speed", value: "<15s" }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative bg-gray-50">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 business-gradient rounded-2xl mb-8 business-shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            <span className="text-business">DxAI Enterprise</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your business documents into strategic intelligence. 
            Upload reports, financial statements, and strategic documents for comprehensive AI-powered analysis.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-12">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Enterprise-grade security and compliance</span>
          </div>
        </div>

        {/* Business Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {businessFeatures.map((feature, index) => (
            <div 
              key={index}
              className="business-card p-8 rounded-xl business-shadow hover:business-shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 business-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <PDFUploader onUpload={onUpload} isProcessing={isProcessing} />
        </div>

        {/* Business Stats */}
        <div className="business-card rounded-xl p-8 business-shadow">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Trusted by Leading Organizations</h3>
            <p className="text-gray-600">Delivering enterprise-grade document intelligence solutions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {businessStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-business mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Use Cases */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="business-card p-6 rounded-xl business-shadow">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Document Types
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Financial Reports & Statements</li>
              <li>• Strategic Planning Documents</li>
              <li>• Market Research & Analysis</li>
              <li>• Compliance & Audit Reports</li>
              <li>• Business Proposals & Plans</li>
            </ul>
          </div>
          
          <div className="business-card p-6 rounded-xl business-shadow">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Analysis Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Executive Summary Generation</li>
              <li>• KPI & Metrics Extraction</li>
              <li>• Risk Assessment & Compliance</li>
              <li>• Competitive Analysis</li>
              <li>• Strategic Recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}