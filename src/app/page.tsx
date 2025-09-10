'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { loginStart, loginSuccess, loginFailure } from '@/lib/slices/authSlice';
import { simulateLogin, saveAuthData } from '@/lib/auth';
import { AppDispatch } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('user@flowstate.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      // Simulate login API call
      const authData = await simulateLogin(email, password);
      
      // Save auth data to localStorage
      saveAuthData(authData);
      
      // Update Redux state
      dispatch(loginSuccess(authData));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      dispatch(loginFailure());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded mr-2 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin opacity-0"></div>
                <div className="absolute w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-2xl font-semibold text-blue-600">FlowState</span>
            </div>
          </div>

          {/* Login Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                <p className="text-gray-600">Enter your credentials to sign into your account</p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {/* Demo credentials notice */}
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
                  <strong>Demo Credentials:</strong><br />
                  Email: user@flowstate.com<br />
                  Password: password
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="someone@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                    disabled={loading}
                  />
                  <div className="text-right mt-1">
                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account? <Link href="#" className="text-blue-600 hover:underline">Sign up</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-8 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-40 right-40 w-12 h-12 border border-white rounded-lg"></div>
        </div>

        <div className="text-center space-y-8 relative z-10">
          {/* Main Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-lg mr-3 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Drive Better Decisions<br />
              with Centralized<br />
              Performance &<br />
              Account Intelligence.
            </h1>
          </div>

          {/* Bottom Icon */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 border-2 border-white/30 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border border-white/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
