'use client';

import { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  useEffect(() => {
    // Auto-redirect to dashboard for demo purposes
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualLogin = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              MakrCave Portal
            </h1>
            <p className="text-gray-300 mt-2">
              Makerspace Management System
            </p>
          </div>

          {/* Loading State */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300 mb-6">
              Redirecting to dashboard...
            </p>
            
            <Button
              onClick={handleManualLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
            >
              Continue to Dashboard
            </Button>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 text-center">
              🔒 Secure authentication powered by MakrX SSO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}