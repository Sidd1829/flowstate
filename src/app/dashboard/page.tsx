"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  setRevenueData,
  setMarginTrends,
  setEntityPerformance,
  setMetrics,
  setLoading,
  fetchDataForYear,
} from "@/lib/slices/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  AlertCircle,
  Maximize2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { generateMockDataForYear } from "@/lib/mockData";

// Data is now generated dynamically based on selected financial year

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [fullscreenCard, setFullscreenCard] = useState<string | null>(null);
  const {
    metrics,
    selectedFinancialYear,
    loading,
    revenueData,
    marginTrends,
    entityPerformance,
  } = useSelector((state: RootState) => state.dashboard);

  const handleFullscreen = (cardId: string) => {
    setFullscreenCard(fullscreenCard === cardId ? null : cardId);
  };

  // Load data for the selected financial year
  const loadDataForYear = useCallback(async (year: string) => {
    dispatch(setLoading(true));

    // Simulate API call delay
    await new Promise<void>(resolve => setTimeout(resolve, 800));

    const mockData = generateMockDataForYear(year);

    dispatch(setMetrics(mockData.metrics));
    dispatch(setRevenueData(mockData.revenueData));
    dispatch(setMarginTrends(mockData.marginTrendsData));
    dispatch(setEntityPerformance(mockData.entityPerformanceData));
    dispatch(setLoading(false));
  }, [dispatch]);

  // Initial data load and reload when financial year changes
  useEffect(() => {
    loadDataForYear(selectedFinancialYear);
  }, [loadDataForYear, selectedFinancialYear]);

  // Calculate percentage changes based on financial year
  const getPercentageChange = (metricType: string) => {
    const baseYear = '2024-25';
    const currentYear = selectedFinancialYear;
    
    if (currentYear === baseYear) return { value: '+8.2%', isPositive: true };
    
    const changes: { [key: string]: { [key: string]: { value: string; isPositive: boolean } } } = {
      'revenue': {
        '2022-23': { value: '-15.2%', isPositive: false },
        '2023-24': { value: '-5.8%', isPositive: false },
        '2024-25': { value: '+8.2%', isPositive: true }
      },
      'profit': {
        '2022-23': { value: '-18.4%', isPositive: false },
        '2023-24': { value: '-7.6%', isPositive: false },
        '2024-25': { value: '+12.4%', isPositive: true }
      },
      'margin': {
        '2022-23': { value: '-3.1%', isPositive: false },
        '2023-24': { value: '-1.5%', isPositive: false },
        '2024-25': { value: '+2.1%', isPositive: true }
      },
      'expenses': {
        '2022-23': { value: '-12.5%', isPositive: true },
        '2023-24': { value: '-4.2%', isPositive: true },
        '2024-25': { value: '+3.5%', isPositive: false }
      }
    };
    
    return changes[metricType]?.[currentYear] || { value: '+0.0%', isPositive: true };
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your business performance</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Financial Year Selector */}
        {/* <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select
                value={selectedFinancialYear}
                onValueChange={handleFinancialYearChange}
                disabled={loading}
              >
                <SelectTrigger className="w-44 bg-white">
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {getFinancialYearLabel(year)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>  */}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                // Loading Skeleton for Metrics
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                          </div>
                          <div className="ml-3 mt-2">
                            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                // Actual Metrics Cards
                <>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Consolidated Revenue
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics.totalRevenue}
                          </p>
                          <div className="flex items-center">
                            {getPercentageChange('revenue').isPositive ? (
                              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <p className={`text-xs font-medium ${
                              getPercentageChange('revenue').isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getPercentageChange('revenue').value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Net Income
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics.totalProfit}
                          </p>
                          <div className="flex items-center">
                            {getPercentageChange('profit').isPositive ? (
                              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <p className={`text-xs font-medium ${
                              getPercentageChange('profit').isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getPercentageChange('profit').value}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            EBITDA Margin
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics.marginTrend}%
                          </p>
                          <div className="flex items-center">
                            {getPercentageChange('margin').isPositive ? (
                              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <p className={`text-xs font-medium ${
                              getPercentageChange('margin').isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getPercentageChange('margin').value}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Operating Expenses
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics.totalExpenses}
                          </p>
                          <div className="flex items-center">
                            {getPercentageChange('expenses').isPositive ? (
                              <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <p className={`text-xs font-medium ${
                              getPercentageChange('expenses').isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getPercentageChange('expenses').value}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue & Profit Trend */}
              <Card className="lg:col-span-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Revenue & Profit Trend
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-blue-600 text-xs"
                      >
                        Revenue
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-orange-600 text-xs"
                      >
                        Profit
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFullscreen('revenue-chart')}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-full h-[280px] flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-500">
                          Loading chart data...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Margin Trends */}
              <Card className="lg:col-span-4">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Margin Trends
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Last 6 Months
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFullscreen('margin-chart')}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-full h-[280px] flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-500">
                          Loading chart data...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={marginTrends}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#3b82f6" />
                        <Bar dataKey="cost" fill="#ef4444" />
                        <Bar dataKey="sales" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Entity-wise Performance Table and Insights - Horizontally Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Entity-wise Performance
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFullscreen('performance-table')}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="flex space-x-4 py-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="flex-1 h-4 bg-gray-200 rounded animate-pulse"
                          ></div>
                        ))}
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex space-x-4 py-3">
                          {[1, 2, 3, 4, 5, 6].map((j) => (
                            <div
                              key={j}
                              className="flex-1 h-4 bg-gray-100 rounded animate-pulse"
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            Company Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            Revenue
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            Net Profit
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            EBITDA
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            Cost Flow Ratio
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                            WC Cash Ratio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entityPerformance.map((company, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                              {company.companyName}
                            </td>
                            <td className="py-4 px-4 text-gray-700 text-sm">
                              {company.revenue}
                            </td>
                            <td className="py-4 px-4 text-green-600 font-medium text-sm">
                              {company.netProfit}
                            </td>
                            <td className="py-4 px-4 text-gray-700 text-sm">
                              {company.ebitda}
                            </td>
                            <td className="py-4 px-4 text-gray-700 text-sm">
                              {company.costFlowRatio}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant={
                                  company.wcCashRatio > 70
                                    ? "default"
                                    : company.wcCashRatio > 40
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {company.wcCashRatio}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4">
            {/* Insights Section */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-orange-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Insights
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFullscreen('insights-card')}
                    className="h-8 w-8 p-0 hover:bg-orange-100"
                  >
                    <Maximize2 className="h-4 w-4 text-orange-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Top Priority
                    </p>
                    <p className="text-sm text-orange-700">
                      The company reported an 8% decline in profit this month.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Recommendations
                    </p>
                    <p className="text-sm text-orange-700">
                      Review cost structure and optimize operational efficiency.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Revenue Growth
                    </p>
                    <p className="text-sm text-orange-700">
                      Despite profit decline, revenue grew by 12% compared to
                      last month.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Cash Flow
                    </p>
                    <p className="text-sm text-orange-700">
                      Monitor working capital trends as cash ratios show
                      improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

