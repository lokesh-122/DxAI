
import './globals.css';
import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LoadingScreen } from '@/components/loading-screen'; // Import LoadingScreen

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DxAI - AI-Powered Medical Diagnosis Assistant',
  description: 'Upload your medical reports and get AI-powered diagnosis insights, treatment recommendations, and nearby hospital suggestions with DxAI',
  keywords: 'AI diagnosis, medical reports, healthcare AI, medical analysis, hospital finder',
  authors: [{ name: 'DxAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.className}>
      <head>
        {/* next/font handles optimized font loading, so manual links are removed */}
      </head>
      <body className={`${roboto.className} antialiased`} suppressHydrationWarning>
        <LoadingProvider>
          <LoadingScreen /> {/* LoadingScreen is now a sibling, uses context */}
          <AuthProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </AuthProvider>
        </LoadingProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
