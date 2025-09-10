import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardMetrics {
  totalRevenue: string;
  totalProfit: string;
  marginTrend: number;
  totalExpenses: string;
}

interface ChartData {
  month: string;
  revenue: number;
  profit: number;
}

interface MarginTrendData {
  month: string;
  revenue: number;
  cost: number;
  sales: number;
}

interface PerformanceData {
  companyName: string;
  revenue: string;
  netProfit: string;
  ebitda: string;
  costFlowRatio: string;
  wcCashRatio: number;
}

interface DashboardState {
  metrics: DashboardMetrics;
  revenueData: ChartData[];
  marginTrends: MarginTrendData[];
  entityPerformance: PerformanceData[];
  loading: boolean;
  selectedTimeframe: string;
  selectedFinancialYear: string;
  financialYears: string[];
}

const initialState: DashboardState = {
  metrics: {
    totalRevenue: "€24.5B",
    totalProfit: "€40.5M",
    marginTrend: 14.6,
    totalExpenses: "€25.7M"
  },
  revenueData: [],
  marginTrends: [],
  entityPerformance: [],
  loading: false,
  selectedTimeframe: "Current",
  selectedFinancialYear: "2024-25",
  financialYears: ["2022-23", "2023-24", "2024-25"]
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload;
    },
    setRevenueData: (state, action: PayloadAction<ChartData[]>) => {
      state.revenueData = action.payload;
    },
    setMarginTrends: (state, action: PayloadAction<MarginTrendData[]>) => {
      state.marginTrends = action.payload;
    },
    setEntityPerformance: (state, action: PayloadAction<PerformanceData[]>) => {
      state.entityPerformance = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSelectedTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload;
    },
    setSelectedFinancialYear: (state, action: PayloadAction<string>) => {
      state.selectedFinancialYear = action.payload;
    },
    fetchDataForYear: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.selectedFinancialYear = action.payload;
    },
  },
});

export const { setMetrics, setRevenueData, setMarginTrends, setEntityPerformance, setLoading, setSelectedTimeframe, setSelectedFinancialYear, fetchDataForYear } = dashboardSlice.actions;

export default dashboardSlice;
