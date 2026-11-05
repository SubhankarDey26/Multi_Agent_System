import React, { useState } from 'react';
import {
  Coins,
  CreditCard,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SAMPLE_USAGE_DATA } from '../../mocks/mockData';

export const UsagePage = () => {
  const { showToast } = useAppStore();
  const [usage, setUsage] = useState(SAMPLE_USAGE_DATA);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const percentUsed = Math.round((usage.currentBalance / usage.monthlyQuota) * 100);

  const handleDemoCheckout = (planName) => {
    showToast(`Razorpay checkout is in Demo Mode. Subscribed to ${planName} (demo).`, 'success');
    setShowUpgradeModal(false);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232B3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#56CFE1]/15 text-[#56CFE1] border border-[#56CFE1]/30 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F1F5F9]">Usage & Credit Telemetry</h1>
            <p className="text-xs text-[#94A3B8]">
              Billing cycle: {usage.billingPeriod} • Current Plan: {usage.planName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B7CFF] to-[#56CFE1] text-[#0B0D12] text-xs font-semibold shadow-[0_0_15px_rgba(139,124,255,0.3)] transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upgrade Quota</span>
        </button>
      </div>

      {/* Credit Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Available Balance */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Available Balance</span>
            <Coins className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F1F5F9]">
              {usage.currentBalance.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#94A3B8] ml-2">
              / {usage.monthlyQuota.toLocaleString()}
            </span>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-[#181D2A] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B7CFF] to-[#56CFE1] transition-all duration-300"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
              <span>{percentUsed}% capacity remaining</span>
              <span>Renews Dec 1</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Billing Tier */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Active Tier</span>
            <Shield className="w-4 h-4 text-[#56CFE1]" />
          </div>
          <div className="my-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#F1F5F9]">Cortex Pro</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Includes unlimited coding agent runs and prioritized model routing.
            </p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="text-xs text-[#8B7CFF] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Manage billing details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Inference Latency */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Average Inference Latency</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
              142 ms
            </span>
            <p className="text-xs text-[#94A3B8] mt-1">Dedicated edge GPU inference routing enabled.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All 6 Agent Clusters Operational</span>
          </div>
        </div>
      </div>

      {/* Agent Consumption Breakdown */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#F1F5F9]">Agent Consumption Breakdown</h2>

        <div className="space-y-3.5">
          {usage.agentBreakdown.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F1F5F9]">{item.agent}</span>
                <span className="font-mono text-[#94A3B8]">
                  {item.used.toLocaleString()} credits ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181D2A] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
          <h2 className="text-sm font-bold text-[#F1F5F9]">Recent Quota Ledger Transactions</h2>
          <span className="text-xs text-[#94A3B8] font-mono">Audit Log</span>
        </div>

        <div className="divide-y divide-[#232B3E]/60">
          {usage.transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#94A3B8]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#F1F5F9]">{tx.desc}</span>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    {tx.date} • Agent: <span className="text-[#56CFE1]">{tx.agent}</span>
                  </div>
                </div>
              </div>

              <span
                className={`font-mono font-bold text-xs ${
                  tx.credits > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {tx.credits > 0 ? `+${tx.credits.toLocaleString()}` : `${tx.credits.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade / Pricing Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-2xl w-full rounded-3xl bg-[#121620] border border-[#232B3E] p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
              <div>
                <h2 className="text-lg font-bold text-[#F1F5F9]">Upgrade Cortex Workspace</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Select a tier below. Payments are demonstrated in demo mode.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pro Tier */}
              <div className="p-5 rounded-2xl bg-[#181D2A] border border-[#8B7CFF]/50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#8B7CFF] uppercase">
                    Pro Plan
                  </span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-[#F1F5F9]">$29</span>
                    <span className="text-xs text-[#94A3B8]"> / month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#94A3B8] my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B7CFF]" />
                      <span>100,000 monthly credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B7CFF]" />
                      <span>Access to all 6 specialist agents</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B7CFF]" />
                      <span>Dedicated edge low latency</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleDemoCheckout('Cortex Pro Plan')}
                  className="w-full py-2.5 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-black font-semibold text-xs transition-colors"
                >
                  Current Plan
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="p-5 rounded-2xl bg-[#0E1118] border border-[#232B3E] hover:border-[#56CFE1]/50 transition-colors flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#56CFE1] uppercase">
                    Enterprise
                  </span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-[#F1F5F9]">$99</span>
                    <span className="text-xs text-[#94A3B8]"> / month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#94A3B8] my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#56CFE1]" />
                      <span>500,000 monthly credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#56CFE1]" />
                      <span>Custom fine-tuned agent adapters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#56CFE1]" />
                      <span>Dedicated microservices cluster</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleDemoCheckout('Cortex Enterprise Plan')}
                  className="w-full py-2.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#F1F5F9] border border-[#232B3E] font-semibold text-xs transition-colors"
                >
                  Upgrade to Enterprise (Demo)
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] text-center">
              Notice: Razorpay payment gateway integration will be connected upon backend deployment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsagePage;
