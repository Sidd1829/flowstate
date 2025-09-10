"use client";

import { Button } from "@/components/ui/button";
import { generateMockDataForYear, getFinancialYearLabel } from "@/lib/mockData";
import {
  fetchDataForYear,
  setEntityPerformance,
  setLoading,
  setMarginTrends,
  setMetrics,
  setRevenueData,
} from "@/lib/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar, Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isCollapsed?: boolean;
}

export function Header({
  onMobileMenuToggle,
  isCollapsed = false,
}: HeaderProps) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedFinancialYear, financialYears, loading } = useSelector(
    (state: RootState) => state.dashboard
  );

  // Load data for the selected financial year
  const loadDataForYear = useCallback(
    async (year: string) => {
      dispatch(setLoading(true));

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData = generateMockDataForYear(year);

      dispatch(setMetrics(mockData.metrics));
      dispatch(setRevenueData(mockData.revenueData));
      dispatch(setMarginTrends(mockData.marginTrendsData));
      dispatch(setEntityPerformance(mockData.entityPerformanceData));
      dispatch(setLoading(false));
    },
    [dispatch]
  );

  // Handle financial year change
  const handleFinancialYearChange = useCallback((year: string) => {
    dispatch(fetchDataForYear(year));
    loadDataForYear(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial data load
  useEffect(() => {
    loadDataForYear(selectedFinancialYear);
  }, [loadDataForYear, selectedFinancialYear]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 bg-white shadow-sm border-b z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? "md:left-16" : "md:left-64"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo - only show on mobile */}
          <div className="md:hidden flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded mr-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold text-blue-600">
              FlowState
            </span>
          </div>

          {/* Desktop - no navigation since it's in the sidebar */}
          <div className="hidden md:block">
            {/* <h1 className="text-xl font-semibold text-gray-900">
              {pathname.split("/").pop()}
            </h1> */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pathname.split("/").pop() === "dashboard"
                    ? "Dashboard"
                    : "Companies"}
                </h1>
              </div>
              {pathname.split("/").pop() === "dashboard" && (
                <div className="flex items-center gap-4">
                  {/* Financial Year Selector */}
                  <div className="flex items-center gap-2">
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
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            className="p-2 relative"
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
