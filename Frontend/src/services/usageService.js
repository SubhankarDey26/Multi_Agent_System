import { SAMPLE_USAGE_DATA } from '../mocks/mockData';

export const usageService = {
  getUsageOverview() {
    return { ...SAMPLE_USAGE_DATA };
  },

  deductCredits(amount, description, agent) {
    SAMPLE_USAGE_DATA.currentBalance = Math.max(0, SAMPLE_USAGE_DATA.currentBalance - amount);
    SAMPLE_USAGE_DATA.transactions.unshift({
      id: 'tx-' + Date.now(),
      date: 'Just now',
      desc: description,
      credits: -amount,
      agent,
    });
    return SAMPLE_USAGE_DATA.currentBalance;
  },
};

export default usageService;
