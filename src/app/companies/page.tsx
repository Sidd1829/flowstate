"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  setAllCompanies,
  setCompanies,
  setSearchQuery,
  setSorting,
  setCurrentPage,
  setLoading,
  updatePagination,
} from "@/lib/slices/companiesSlice";
import {
  Search,
  ArrowUpDown,
  Plus,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const companiesData = [
  {
    id: "1",
    name: "Global Tech Solutions",
    ceoKeyPerson: { name: "Abe Morgan", avatar: "/avatars/abe.jpg" },
    revenue: "€32M",
    profit: "+€2M",
    profitChange: 25.3,
    ebitda: "+€2M",
    coreMargin: 22.3,
    coreMarginChange: 22.3,
    keyInsights: "Strong Growth",
    category: "Growth Leaders",
  },
  {
    id: "2",
    name: "Tech Innovation Corp",
    ceoKeyPerson: { name: "Abe Morgan", avatar: "/avatars/abe.jpg" },
    revenue: "€24M",
    profit: "+€5M",
    profitChange: -5.2,
    ebitda: "+€2M",
    coreMargin: 22.3,
    coreMarginChange: 22.3,
    keyInsights: "High Profitability",
    category: "Good Growth",
  },
  {
    id: "3",
    name: "BlueCore Innovations",
    ceoKeyPerson: { name: "Jordan Lee", avatar: "/avatars/jordan.jpg" },
    revenue: "€22M",
    profit: "-€1M",
    profitChange: -8.5,
    ebitda: "+€2M",
    coreMargin: 18.5,
    coreMarginChange: 18.5,
    keyInsights: "Robust Expansion",
    category: "Tech Growth Stocks",
  },
  {
    id: "4",
    name: "Strategy Solutions",
    ceoKeyPerson: { name: "Martin Luther", avatar: "/avatars/martin.jpg" },
    revenue: "€8M",
    profit: "+€5M",
    profitChange: 12.8,
    ebitda: "+€2M",
    coreMargin: 12.8,
    coreMarginChange: 12.8,
    keyInsights: "Peer Expansion",
    category: "Loss making",
  },
  {
    id: "5",
    name: "Vertex Global Services",
    ceoKeyPerson: { name: "John Malez", avatar: "/avatars/john.jpg" },
    revenue: "€12M",
    profit: "-€1M",
    profitChange: -4.2,
    ebitda: "+€1M",
    coreMargin: 4.4,
    coreMarginChange: 4.4,
    keyInsights: "Restructuring Phase",
    category: "Strategic Pivot",
  },
  {
    id: "6",
    name: "Pacific Solutions Ltd",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€6M",
    profit: "+€1M",
    profitChange: -9.4,
    ebitda: "+€2M",
    coreMargin: -9.4,
    coreMarginChange: -9.4,
    keyInsights: "Struggling Growth",
    category: "Revenue Decline",
  },
  {
    id: "7",
    name: "Dynamic Computing Inc",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€9M",
    profit: "+€1M",
    profitChange: -20.1,
    ebitda: "+€2M",
    coreMargin: -20.1,
    coreMarginChange: -20.1,
    keyInsights: "Market Leader",
    category: "Cost Optimization",
  },
  {
    id: "8",
    name: "Pinnacle Systems",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€7M",
    profit: "+€5M",
    profitChange: 17.8,
    ebitda: "+€2M",
    coreMargin: 17.8,
    coreMarginChange: 17.8,
    keyInsights: "Reliable Revenue",
    category: "Strong Moat",
  },
  {
    id: "9",
    name: "Pacific Solutions Ltd",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€6M",
    profit: "+€5M",
    profitChange: -14.2,
    ebitda: "+€9M",
    coreMargin: -14.2,
    coreMarginChange: -14.2,
    keyInsights: "Solid Financial Track Record",
    category: "Investor Friendly",
  },
  {
    id: "10",
    name: "Innovations Dynamics",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€6M",
    profit: "+€1M",
    profitChange: -9.7,
    ebitda: "+€2M",
    coreMargin: -9.7,
    coreMarginChange: -9.7,
    keyInsights: "High Overheads",
    category: "High Overheads",
  },
  {
    id: "11",
    name: "Software Group",
    ceoKeyPerson: { name: "Joe Dalton", avatar: "/avatars/joe.jpg" },
    revenue: "€2M",
    profit: "+€1M",
    profitChange: 3.5,
    ebitda: "+€5M",
    coreMargin: 3.5,
    coreMarginChange: 3.5,
    keyInsights: "Healthy Balance",
    category: "Strength Checkers",
  },
];

export default function CompaniesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    companies,
    allCompanies,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    loading,
  } = useSelector((state: RootState) => state.companies);

  // Initialize data
  useEffect(() => {
    dispatch(setAllCompanies(companiesData));
  }, [dispatch]);

  // Apply filters, sorting, and pagination
  const processedCompanies = useMemo(() => {
    let filtered = allCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ceoKeyPerson.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    // Sort companies
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "revenue":
          aValue = parseInt(a.revenue.replace(/€|M/g, ""));
          bValue = parseInt(b.revenue.replace(/€|M/g, ""));
          break;
        case "profitChange":
          aValue = a.profitChange;
          bValue = b.profitChange;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

    return filtered;
  }, [allCompanies, searchQuery, sortBy, sortOrder]);

  // Update pagination when processed companies change
  useEffect(() => {
    dispatch(updatePagination({ totalItems: processedCompanies.length }));
  }, [processedCompanies.length, dispatch]);

  // Get paginated companies
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedCompanies.slice(startIndex, endIndex);
  }, [processedCompanies, currentPage, itemsPerPage]);

  // Update companies when pagination changes
  useEffect(() => {
    dispatch(setCompanies(paginatedCompanies));
  }, [paginatedCompanies, dispatch]);

  // Handle page change with loading state
  const handlePageChange = useCallback(
    async (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;

      dispatch(setLoading(true));
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      dispatch(setCurrentPage(page));
      dispatch(setLoading(false));
    },
    [currentPage, totalPages, dispatch]
  );

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSorting({ sortBy: field, sortOrder: newOrder }));
  };

  const getProfitColor = (change: number) => {
    if (change > 10) return "text-green-600";
    if (change > 0) return "text-green-500";
    return "text-red-500";
  };

  const getProfitIcon = (change: number) => {
    return change > 0 ? "↗" : "↘";
  };

  const getCategoryBadgeVariant = (category: string) => {
    const variants: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      "Growth Leaders": "default",
      "Good Growth": "default",
      "Tech Growth Stocks": "secondary",
      "Loss making": "destructive",
      "Strategic Pivot": "outline",
      "Revenue Decline": "destructive",
      "Cost Optimization": "secondary",
      "Strong Moat": "default",
      "Investor Friendly": "default",
      "High Overheads": "destructive",
      "Strength Checkers": "outline",
    };
    return variants[category] || "outline";
  };

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Companies"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10"
                disabled={loading}
              />
            </div>

            {/* Results Summary */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 whitespace-nowrap">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span>
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} companies
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Download className="h-4 w-4 mr-2 text-blue-600" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Companies Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {totalPages > 1 && (
              <div className="flex justify-center lg:justify-end p-4 pb-0">
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        size="default"
                        className={`cursor-pointer ${
                          currentPage <= 1 || loading
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100"
                        }`}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {getVisiblePageNumbers(currentPage, totalPages).map(
                      (pageNum, index) => (
                        <PaginationItem key={index}>
                          {pageNum === "..." ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(Number(pageNum))}
                              isActive={currentPage === Number(pageNum)}
                              size="icon"
                              className={`cursor-pointer ${
                                loading
                                  ? "pointer-events-none opacity-50"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        size="default"
                        className={`cursor-pointer ${
                          currentPage >= totalPages || loading
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            <div className="overflow-x-auto mt-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className="p-0 h-auto font-medium text-gray-700 hover:bg-transparent"
                      >
                        Company Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      CEO/Key Person
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("revenue")}
                        className="p-0 h-auto font-medium text-gray-700 hover:bg-transparent"
                      >
                        Revenue
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Profit
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      EBITDA
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("profitChange")}
                        className="p-0 h-auto font-medium text-gray-700 hover:bg-transparent"
                      >
                        Core Margin
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Key Insights
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    // Loading skeleton rows
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <tr key={`loading-${index}`} className="border-t">
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-16"></div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </td>
                      </tr>
                    ))
                  ) : companies.length > 0 ? (
                    // Actual company rows
                    companies.map((company) => (
                      <tr
                        key={company.id}
                        className="border-t hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {company.name}
                          </div>
                          <Badge
                            variant={getCategoryBadgeVariant(company.category)}
                            className="mt-1 text-xs"
                          >
                            {company.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                            </div>
                            <span className="font-medium">
                              {company.ceoKeyPerson.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          {company.revenue}
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`font-medium ${getProfitColor(
                              company.profitChange
                            )}`}
                          >
                            {company.profit}
                          </div>
                          <div
                            className={`text-sm ${getProfitColor(
                              company.profitChange
                            )}`}
                          >
                            {getProfitIcon(company.profitChange)}{" "}
                            {Math.abs(company.profitChange)}%
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          {company.ebitda}
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`font-medium ${getProfitColor(
                              company.coreMarginChange
                            )}`}
                          >
                            {getProfitIcon(company.coreMarginChange)}{" "}
                            {Math.abs(company.coreMarginChange)}%
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-700">
                            {company.keyInsights}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // No results found
                    <tr className="border-t">
                      <td
                        colSpan={7}
                        className="py-8 px-6 text-center text-gray-500"
                      >
                        No companies found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// Helper function to get visible page numbers with ellipsis
function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const visiblePages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  } else {
    // Always show first page
    visiblePages.push(1);

    if (currentPage <= 4) {
      // Show pages 2,3,4,5 ... last
      for (let i = 2; i <= 5; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("...");
      visiblePages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show 1 ... last-4, last-3, last-2, last-1, last
      visiblePages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Show 1 ... current-1, current, current+1 ... last
      visiblePages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("...");
      visiblePages.push(totalPages);
    }
  }

  return visiblePages;
}
