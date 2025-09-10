'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Initialize sidebar as collapsed on mobile, expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile); // Collapse on mobile by default
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      
      {/* Main Layout Area */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed 
          ? 'ml-0 md:ml-16' 
          : 'ml-0 md:ml-64'
      }`}>
        {/* Fixed Header */}
        <Header onMobileMenuToggle={handleMobileMenuToggle} isCollapsed={isCollapsed} />
        
        {/* Scrollable Main Content */}
        <main className="pt-16 h-screen overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
