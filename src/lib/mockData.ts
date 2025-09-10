// Mock data generator for different financial years
export const generateMockDataForYear = (financialYear: string) => {
  const baseMultiplier = getMultiplierForYear(financialYear);

  const revenueData = [
    { month: 'Apr', revenue: Math.round(850 * baseMultiplier), profit: Math.round(120 * baseMultiplier) },
    { month: 'May', revenue: Math.round(920 * baseMultiplier), profit: Math.round(140 * baseMultiplier) },
    { month: 'Jun', revenue: Math.round(1100 * baseMultiplier), profit: Math.round(180 * baseMultiplier) },
    { month: 'Jul', revenue: Math.round(1250 * baseMultiplier), profit: Math.round(220 * baseMultiplier) },
    { month: 'Aug', revenue: Math.round(1180 * baseMultiplier), profit: Math.round(200 * baseMultiplier) },
    { month: 'Sep', revenue: Math.round(1350 * baseMultiplier), profit: Math.round(250 * baseMultiplier) },
    { month: 'Oct', revenue: Math.round(1420 * baseMultiplier), profit: Math.round(280 * baseMultiplier) },
    { month: 'Nov', revenue: Math.round(1380 * baseMultiplier), profit: Math.round(265 * baseMultiplier) },
    { month: 'Dec', revenue: Math.round(1500 * baseMultiplier), profit: Math.round(320 * baseMultiplier) },
    { month: 'Jan', revenue: Math.round(1580 * baseMultiplier), profit: Math.round(340 * baseMultiplier) },
    { month: 'Feb', revenue: Math.round(1620 * baseMultiplier), profit: Math.round(360 * baseMultiplier) },
    { month: 'Mar', revenue: Math.round(1720 * baseMultiplier), profit: Math.round(390 * baseMultiplier) },
  ];

  const marginTrendsData = [
    { month: 'Q1', revenue: Math.round(85 * baseMultiplier), cost: Math.round(45 * baseMultiplier), sales: Math.round(65 * baseMultiplier) },
    { month: 'Q2', revenue: Math.round(92 * baseMultiplier), cost: Math.round(48 * baseMultiplier), sales: Math.round(70 * baseMultiplier) },
    { month: 'Q3', revenue: Math.round(110 * baseMultiplier), cost: Math.round(55 * baseMultiplier), sales: Math.round(85 * baseMultiplier) },
    { month: 'Q4', revenue: Math.round(125 * baseMultiplier), cost: Math.round(62 * baseMultiplier), sales: Math.round(95 * baseMultiplier) },
  ];

  const entityPerformanceData = [
    {
      companyName: 'BlueTech Solutions Ltd',
      revenue: `€${(8.5 * baseMultiplier).toFixed(1)}M`,
      netProfit: `€${(1.2 * baseMultiplier).toFixed(1)}M`,
      ebitda: `€${(1.5 * baseMultiplier).toFixed(1)}M`,
      costFlowRatio: `€${(4.5 * baseMultiplier).toFixed(1)}M`,
      wcCashRatio: Math.round(85 * (baseMultiplier > 1 ? 1.1 : 0.9))
    },
    {
      companyName: 'Global Tech Solutions',
      revenue: `€${(62.4 * baseMultiplier).toFixed(1)}M`,
      netProfit: `€${(6.2 * baseMultiplier).toFixed(1)}M`,
      ebitda: `€${(8.1 * baseMultiplier).toFixed(1)}M`,
      costFlowRatio: `€${(4.5 * baseMultiplier).toFixed(1)}M`,
      wcCashRatio: Math.round(76 * (baseMultiplier > 1 ? 1.1 : 0.9))
    },
    {
      companyName: 'Innovative Tech Solutions',
      revenue: `€${(48.6 * baseMultiplier).toFixed(1)}M`,
      netProfit: `€${(5.3 * baseMultiplier).toFixed(1)}M`,
      ebitda: `€${(6.8 * baseMultiplier).toFixed(1)}M`,
      costFlowRatio: `€${(3.8 * baseMultiplier).toFixed(1)}M`,
      wcCashRatio: Math.round(68 * (baseMultiplier > 1 ? 1.1 : 0.9))
    },
    {
      companyName: 'Creative Design Group',
      revenue: `€${(36.5 * baseMultiplier).toFixed(1)}M`,
      netProfit: `€${(4.1 * baseMultiplier).toFixed(1)}M`,
      ebitda: `€${(5.2 * baseMultiplier).toFixed(1)}M`,
      costFlowRatio: `€${(2.3 * baseMultiplier).toFixed(1)}M`,
      wcCashRatio: Math.round(89 * (baseMultiplier > 1 ? 1.1 : 0.9))
    },
    {
      companyName: 'Digital Dynamics Inc',
      revenue: `€${(28.6 * baseMultiplier).toFixed(1)}M`,
      netProfit: `€${(3.5 * baseMultiplier).toFixed(1)}M`,
      ebitda: `€${(4.2 * baseMultiplier).toFixed(1)}M`,
      costFlowRatio: `€${(1.9 * baseMultiplier).toFixed(1)}M`,
      wcCashRatio: Math.round(23 * (baseMultiplier > 1 ? 1.1 : 0.9))
    },
  ];

  const metrics = {
    totalRevenue: `€${(24.5 * baseMultiplier).toFixed(1)}B`,
    totalProfit: `€${(40.5 * baseMultiplier).toFixed(1)}M`,
    marginTrend: Number((14.6 * baseMultiplier).toFixed(1)),
    totalExpenses: `€${(25.7 * baseMultiplier).toFixed(1)}M`
  };

  return {
    revenueData,
    marginTrendsData,
    entityPerformanceData,
    metrics
  };
};

function getMultiplierForYear(financialYear: string): number {
  switch (financialYear) {
    case '2022-23':
      return 0.85; // 15% less than base
    case '2023-24':
      return 0.95; // 5% less than base
    case '2024-25':
      return 1.0;  // Current year (base)
    default:
      return 1.0;
  }
}

export const getFinancialYearLabel = (financialYear: string): string => {
  const labels: { [key: string]: string } = {
    '2022-23': 'FY 2022-23',
    '2023-24': 'FY 2023-24',
    '2024-25': 'FY 2024-25 (Current)'
  };
  return labels[financialYear] || financialYear;
};

