"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Settings,
  HelpCircle,
  BarChart3,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/slices/authSlice";
import { clearAuthData } from "@/lib/auth";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
  },
  {
    title: "Performance",
    href: "#",
    icon: TrendingUp,
  },
  {
    title: "Users",
    href: "#",
    icon: Users,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
  },
  {
    title: "Help",
    href: "#",
    icon: HelpCircle,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    // Clear localStorage
    clearAuthData();

    // Clear Redux state
    dispatch(logout());

    // Redirect to login (will be handled by AuthProvider)
    router.push("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out z-50",
          // Fixed positioning for both mobile and desktop
          "fixed inset-y-0 left-0",
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-16"
            : "translate-x-0 w-64 md:w-64"
        )}
      >
        <div className="flex h-full flex-col bg-gray-900 border-r border-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Header with Logo and Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              {!isCollapsed && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xl font-semibold text-white">
                    FlowState
                  </span>
                </div>
              )}
              {isCollapsed && (
                <div className="w-8 h-8 bg-blue-600 rounded mx-auto flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-1 h-8 w-8"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-6 px-2 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white",
                        isCollapsed ? "h-6 w-6" : "h-5 w-5 mr-3"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-200">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Profile Section */}
            <div className="border-t border-gray-800 p-4">
              <div
                className={cn(
                  "transition-all duration-200",
                  isCollapsed
                    ? "flex flex-col items-center space-y-3" // vertical in collapsed view
                    : "flex items-center justify-between" // horizontal in expanded view
                )}
              >
                {/* User Avatar + Info */}
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <div className="ml-3 transition-opacity duration-200">
                      <p className="text-sm font-medium text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className={cn(
                    "text-gray-400 hover:text-white hover:bg-gray-800 transition-colors",
                    isCollapsed ? "p-1" : "p-2"
                  )}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
