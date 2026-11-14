import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import authService from '../../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, showToast } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google SSO Authentication via Firebase + Backend API
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginWithGoogle();
      loginUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/agent/chat');
    } catch (err) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use Demo access.');
      } else {
        setError('Google sign-in failed. You can sign in with Demo Instant Access below.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginWithEmail(email, password);
      loginUser(user);
      showToast(`Signed in as ${user.name}`, 'success');
      navigate('/agent/chat');
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Access
  const handleDemoAccess = () => {
    const user = authService.loginDemo('alex.vance@cortex.ai', 'Alex Vance');
    loginUser(user);
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

          {/* Quick Demo Access Trigger */}
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
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Google Sign-in */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#F1F5F9] border border-[#232B3E] hover:border-[#8B7CFF]/40 flex items-center justify-center gap-3 transition-all duration-150 text-xs font-semibold group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#232B3E]"></div>
              </div>
              <span className="relative px-3 bg-[#121620] sm:bg-[#1a1b21] text-[#94A3B8] text-[11px]">
                or sign in with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@cortex.ai"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0E1118] border border-[#232B3E] rounded-xl text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#8B7CFF] focus:ring-1 focus:ring-[#8B7CFF] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-medium text-[#94A3B8]" htmlFor="password">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to your email', 'info');
                    }}
                    className="text-[11px] text-[#8B7CFF] hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0E1118] border border-[#232B3E] rounded-xl text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#8B7CFF] focus:ring-1 focus:ring-[#8B7CFF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0E1118] border-[#232B3E] text-[#8B7CFF] focus:ring-0 cursor-pointer accent-[#8B7CFF]"
                  />
                  <span className="text-[11px] text-[#94A3B8]">Remember this device</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,124,255,0.35)] transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D12]" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Instant Demo Access Button */}
            <div className="mt-6 pt-5 border-t border-[#232B3E] text-center">
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
            © 2026 Cortex AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
