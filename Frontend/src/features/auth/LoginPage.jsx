import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import authService from '../../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, showToast, user, isAuthLoading } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated via 7-day session or local store, automatically route to workspace
  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate('/agent/chat', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  // Google SSO Authentication via Firebase + Backend API Gateway (/api/auth/login)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const authData = await authService.loginWithGoogle();
      loginUser(authData);
      showToast(`Welcome, ${authData.name}!`, 'success');
      navigate('/agent/chat');
    } catch (err) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use Demo access.');
      } else {
        setError(err.response?.data?.message || err.message || 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Instant Sandbox Demo Access
  const handleDemoAccess = () => {
    const demoUser = authService.loginDemo('developer@cortex.ai', 'Cortex Developer');
    loginUser(demoUser);
    showToast('Signed in with Demo session', 'success');
    navigate('/agent/chat');
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E2E2E9] antialiased flex flex-col justify-between selection:bg-[#8B7CFF]/30 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glow & Grid Lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(71, 69, 84, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(71, 69, 84, 0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>
      <div className="fixed top-1/4 -left-32 w-[450px] h-[450px] bg-[#8B7CFF]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -right-32 w-[450px] h-[450px] bg-[#56CFE1]/12 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <header className="w-full z-20 bg-[#0B0D12]/80 backdrop-blur-md border-b border-[#232B3E]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.25)]">
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            </div>
            <span className="font-bold text-base tracking-tight text-[#F1F5F9]">Cortex AI</span>
          </div>

          <button
            onClick={handleDemoAccess}
            className="px-3.5 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#56CFE1] border border-[#232B3E] hover:border-[#56CFE1]/40 text-xs font-medium transition-all active:scale-95 shadow-sm"
          >
            Instant Demo
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10 relative">
        <div className="w-full max-w-md">
          <div className="relative rounded-2xl bg-[#121620]/90 sm:bg-[#1a1b21]/80 backdrop-blur-xl border border-[#232B3E] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] p-6 sm:p-9 transition-all">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#8B7CFF] to-transparent"></div>

            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#181D2A] border border-[#8B7CFF]/40 text-[#8B7CFF] shadow-[0_0_20px_-2px_rgba(139,124,255,0.25)] mb-3">
                <Sparkles className="w-6 h-6 text-[#8B7CFF]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] mb-1">
                Cortex AI
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Sign in with your Google account to access your workspace
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Google Sign-in (Backend Supported: POST /api/auth/login) */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#F1F5F9] border border-[#232B3E] hover:border-[#8B7CFF]/50 flex items-center justify-center gap-3 transition-all duration-150 text-xs font-semibold group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B7CFF]" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.72-2.1-6.66-4.92H1.27v3.13C3.25 21.3 7.31 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.34 14.28c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.07-3.13z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.07 3.13c.94-2.82 3.56-4.97 6.66-4.97z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#232B3E]"></div>
                </div>
                <span className="relative px-3 bg-[#121620] sm:bg-[#1a1b21] text-[#94A3B8] text-[11px]">
                  or evaluate instantly
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] hover:border-[#56CFE1]/40 text-[#56CFE1] flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                <span className="w-2 h-2 rounded-full bg-[#56CFE1] animate-pulse"></span>
                <span>Enter Workspace Demo (Instant Access)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0B0D12] border-t border-[#232B3E] z-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-[#94A3B8]">
            © 2026 Cortex AI. Autonomous Multi-Agent Systems.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;