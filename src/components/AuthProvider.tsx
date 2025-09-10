'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState, AppDispatch } from '@/lib/store';
import { restoreSession, clearSession } from '@/lib/slices/authSlice';
import { getStoredAuthData } from '@/lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicPaths = ['/', '/login', '/test'];

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize auth state only after mounting
  useEffect(() => {
    if (!mounted) return;

    const storedAuth = getStoredAuthData();
    if (storedAuth) {
      dispatch(restoreSession(storedAuth));
    } else {
      dispatch(clearSession());
    }
  }, [mounted, dispatch]);

  // Handle redirects only after mounting
  useEffect(() => {
    if (!mounted) return;

    // Small delay to avoid hydration issues
    const timer = setTimeout(() => {
      const isPublicPath = publicPaths.includes(pathname);
      
      if (!isAuthenticated && !isPublicPath) {
        router.replace('/');
      } else if (isAuthenticated && pathname === '/') {
        router.replace('/dashboard');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted, isAuthenticated, pathname, router]);

  // Do not render anything until mounted (prevents SSR hydration issues)
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}