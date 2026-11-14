import { SAMPLE_USAGE_DATA } from '../mocks/mockData';

const STORAGE_KEY = 'cortex_usage_data';

const getStoredUsage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored usage data:', err);
  }
  return { ...SAMPLE_USAGE_DATA };
};

let usageStore = getStoredUsage();

const persistUsage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usageStore));
  } catch (err) {
    console.warn('Failed to persist usage data:', err);
  }
};

export const usageService = {
  getUsageOverview() {
    return { ...usageStore };
  },

  deductCredits(amount, description, agent) {
    usageStore.currentBalance = Math.max(0, usageStore.currentBalance - amount);
    if (!usageStore.transactions) {
      usageStore.transactions = [];
    }
    usageStore.transactions.unshift({
      id: 'tx-' + Date.now(),
      date: 'Just now',
      desc: description,
      credits: -amount,
      agent,
    });
    persistUsage();
    return usageStore.currentBalance;
  },
};

export default usageService;
