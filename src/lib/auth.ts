import { AuthData } from './slices/authSlice';

const AUTH_STORAGE_KEY = 'flowstate_auth';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer before expiry

/**
 * Save authentication data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToStore = {
      ...authData,
      storedAt: Date.now(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
}

/**
 * Get authentication data from localStorage
 */
export function getStoredAuthData(): AuthData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const parsedData = JSON.parse(stored);
    
    // Check if token is expired (with buffer)
    const now = Date.now();
    if (parsedData.expiresAt && now > (parsedData.expiresAt - TOKEN_EXPIRY_BUFFER)) {
      clearAuthData();
      return null;
    }
    
    return {
      user: parsedData.user,
      token: parsedData.token,
      expiresAt: parsedData.expiresAt,
    };
  } catch (error) {
    console.error('Failed to get stored auth data:', error);
    clearAuthData();
    return null;
  }
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
}

/**
 * Check if current session is valid
 */
export function isSessionValid(): boolean {
  const authData = getStoredAuthData();
  return authData !== null;
}

/**
 * Generate a mock JWT token (for demo purposes)
 * In a real app, this would come from your backend
 */
export function generateMockToken(): { token: string; expiresAt: number } {
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours
  
  // Mock JWT token (in real app, this comes from backend)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: '1',
    email: 'user@flowstate.com',
    name: 'John Doe',
    exp: Math.floor(expiresAt / 1000)
  }));
  const signature = 'mock-signature';
  
  return {
    token: `${header}.${payload}.${signature}`,
    expiresAt,
  };
}

/**
 * Simulate login API call
 * In a real app, this would be an actual API call
 */
export async function simulateLogin(email: string, password: string): Promise<AuthData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation (in real app, validate with backend)
  if (email === 'user@flowstate.com' && password === 'password') {
    const { token, expiresAt } = generateMockToken();
    
    return {
      user: {
        id: '1',
        email: 'user@flowstate.com',
        name: 'John Doe',
      },
      token,
      expiresAt,
    };
  } else {
    throw new Error('Invalid credentials');
  }
}

