import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Terminal,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  ExternalLink,
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
  const [ssoProvider, setSsoProvider] = useState(null);

  // Google SSO Authentication via Firebase + Backend API
  const handleGoogleLogin = async () => {
    setLoading(true);
    setSsoProvider('google');
    setError('');
    try {
      const user = await authService.loginWithGoogle();
      loginUser(user);
      showToast(`Welcome back, ${user.name}! Active session authenticated.`, 'success');
      navigate('/agent/chat');
    } catch (err) {
      console.warn('Google sign-in fallback or error:', err);
      // Detailed user-friendly feedback
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Authentication popup was closed. Please try again or explore the sandbox below.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use instant demo access.');
      } else {
        setError(
          err.message?.includes('network')
            ? 'Network error reaching authentication server. You can use Instant Demo Access.'
            : 'Firebase Google authentication encountered an issue. You can sign in with demo credentials below.'
        );
      }
    } finally {
      setLoading(false);
      setSsoProvider(null);
    }
  };

  // GitHub SSO simulation for developer workspace
  const handleGithubLogin = async () => {
    setLoading(true);
    setSsoProvider('github');
    setError('');
    try {
      // Simulate quick OAuth exchange
      await new Promise((r) => setTimeout(r, 600));
      const user = authService.loginDemo('developer@github.com', 'GitHub Operator');
      loginUser(user);
      showToast('Authenticated via GitHub Developer SSO', 'success');
      navigate('/agent/chat');
    } catch (err) {
      setError('GitHub authentication failed.');
    } finally {
      setLoading(false);
      setSsoProvider(null);
    }
  };

  // Email & Password Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both work email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginWithEmail(email, password);
      loginUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/agent/chat');
    } catch (err) {
      setError(err.message || 'Failed to sign in with email credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Access
  const handleDemoAccess = () => {
    const user = authService.loginDemo('alex.vance@cortex.ai', 'Alex Vance');
    loginUser(user);
    showToast('Entered Cortex AI Multi-Agent Sandbox (Pro Plan)', 'success');
    navigate('/agent/chat');
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E2E2E9] antialiased flex flex-col justify-between selection:bg-[#8B7CFF]/30 selection:text-white relative overflow-x-hidden">
      {/* Background Neural Matrix Grid & Ambient Glow (from Stitch Design System) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(71, 69, 84, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(71, 69, 84, 0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>
      <div className="fixed top-1/4 -left-32 w-[500px] h-[500px] bg-[#8B7CFF]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#56CFE1]/12 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Top Header Shell (Stitch spec) */}
      <header className="w-full z-20 bg-[#0B0D12]/80 backdrop-blur-md border-b border-[#232B3E]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.25)]">
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#F1F5F9]">Cortex AI</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#56CFE1]/10 text-[#56CFE1] border border-[#56CFE1]/25">
                v2.4 Pro
              </span>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121620] border border-[#232B3E] text-[#94A3B8] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Right: Sandbox / Documentation shortcut */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('Documentation is available in workspace settings', 'info')}
              className="hidden sm:flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F1F5F9] px-2 py-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>
            <button
              onClick={handleDemoAccess}
              className="px-3.5 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#56CFE1] border border-[#232B3E] hover:border-[#56CFE1]/40 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Instant Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10 relative">
        <div className="w-full max-w-md">
          {/* Glassmorphic Card */}
          <div className="relative rounded-2xl bg-[#121620]/90 sm:bg-[#1a1b21]/80 backdrop-blur-xl border border-[#232B3E] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] p-6 sm:p-9 transition-all">
            {/* Top Edge Accent Gradient Line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#8B7CFF] to-transparent"></div>

            {/* Card Header & Brand Mark */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#181D2A] border border-[#8B7CFF]/40 text-[#8B7CFF] shadow-[0_0_20px_-2px_rgba(139,124,255,0.25)] mb-3">
                <Sparkles className="w-6 h-6 text-[#8B7CFF]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9] mb-1">
                Cortex AI Workspace
              </h1>
              <p className="text-xs text-[#94A3B8] max-w-xs mx-auto">
                Sign in to deploy autonomous agents and neural reasoning pipelines.
              </p>
            </div>

            {/* Neural Fabric Status Feedback Alert */}
            <div className="mb-5 rounded-xl bg-[#0E1118]/80 border border-[#56CFE1]/30 p-2.5 flex items-start gap-2.5 text-left">
              <span className="text-[#56CFE1] shrink-0 text-sm leading-5">✦</span>
              <p className="text-xs text-[#94A3B8] leading-tight">
                <span className="text-[#56CFE1] font-medium">Neural Fabric v2.4 Active:</span> Secure token exchange and HTTP-only session verification enabled.
              </p>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* One-Click Enterprise SSO */}
            <div className="space-y-2.5 mb-5">
              {/* Google SSO Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#F1F5F9] border border-[#232B3E] hover:border-[#8B7CFF]/40 flex items-center justify-center gap-3 transition-all duration-150 text-xs font-semibold group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading && ssoProvider === 'google' ? (
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

              {/* GitHub Developer SSO */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#F1F5F9] border border-[#232B3E] hover:border-[#8B7CFF]/40 flex items-center justify-center gap-3 transition-all duration-150 text-xs font-semibold active:scale-[0.98] disabled:opacity-60 shadow-sm"
              >
                {loading && ssoProvider === 'github' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B7CFF]" />
                ) : (
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                )}
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Semantic Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#232B3E]"></div>
              </div>
              <span className="relative px-3 bg-[#121620] sm:bg-[#1a1b21] text-[#94A3B8] text-[11px] font-mono">
                or sign in with enterprise email
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {/* Work Email */}
              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1.5" htmlFor="email">
                  Work Email
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
                      showToast('Password reset link sent to registered email', 'info');
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

              {/* Remember device toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0E1118] border-[#232B3E] text-[#8B7CFF] focus:ring-0 cursor-pointer accent-[#8B7CFF]"
                  />
                  <span className="text-[11px] text-[#94A3B8]">Remember this terminal (7 days)</span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,124,255,0.35)] transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              >
                {loading && !ssoProvider ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D12]" />
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/15 text-[10px] font-mono">↵</span>
                  </>
                )}
              </button>
            </form>

            {/* Instant Demo Sandbox Access Banner (Stitch Spec) */}
            <div className="mt-6 pt-5 border-t border-[#232B3E] text-center" id="demo">
              <p className="text-[11px] text-[#94A3B8] mb-2.5">
                Need immediate evaluation without credentials?
              </p>
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#56CFE1]/30 hover:border-[#56CFE1]/60 text-[#56CFE1] flex items-center justify-between text-xs font-semibold transition-all group active:scale-[0.98] shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#56CFE1] animate-pulse"></span>
                  <span>Explore Live Multi-Agent Sandbox</span>
                </span>
                <span className="text-[11px] font-mono text-[#94A3B8] group-hover:text-[#56CFE1] transition-colors">
                  Instant Node ➔
                </span>
              </button>
            </div>

            {/* Security Compliance & Footer note */}
            <div className="mt-6 pt-4 border-t border-[#232B3E]/60 flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOC-2 Type II Certified & End-to-End Encrypted</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Don't have a workspace?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Enterprise pilot registration submitted!', 'success');
                  }}
                  className="text-[#8B7CFF] font-medium hover:underline"
                >
                  Request pilot access
                </a>
              </p>
            </div>
          </div>

          {/* Operational Latency Telemetry */}
          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#56CFE1]"></span>
              Cluster: us-east-neural-1
            </span>
            <span>•</span>
            <span>Session Ping: 18ms</span>
          </div>
        </div>
      </main>

      {/* Global Shared Footer (Stitch Spec) */}
      <footer className="w-full bg-[#0B0D12] border-t border-[#232B3E] z-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#F1F5F9] font-semibold">Cortex AI</span>
            <span className="text-[#94A3B8]">•</span>
            <p className="text-[11px] text-[#94A3B8]">
              © 2026 Cortex AI Orchestration Systems. Neural architecture secured.
            </p>
          </div>
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#94A3B8]">
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              Security & Compliance
            </a>
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              Privacy Protocol
            </a>
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              API Status
            </a>
            <a href="#" className="hover:text-[#F1F5F9] transition-colors">
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
