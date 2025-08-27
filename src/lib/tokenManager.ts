// Token Manager - Handles all localStorage operations for authentication

import { ROUTES } from "./routes";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "student" | "admin" | "faculty";
  department?: string;
}

export interface AuthData {
  token: string;
  user: User;
  expiresAt: number;
}

class TokenManager {
  private readonly TOKEN_KEY = "token";
  private readonly USER_KEY = "user";
  private readonly AUTH_STATUS_KEY = "isAuthenticated";
  private readonly EXPIRES_AT_KEY = "expiresAt";

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresAt = this.getExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > expiresAt) {
      this.clearAuth();
      return false;
    }

    return true;
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get user data
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Get token expiration time
  getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  // Set authentication data
  setAuth(token: string, user: User, expiresInHours: number = 24): void {
    const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.AUTH_STATUS_KEY, "true");
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  // Update user data
  updateUser(user: Partial<User>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  // Clear all authentication data
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.AUTH_STATUS_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  // Refresh token (if needed)
  refreshToken(newToken: string, expiresInHours: number = 24): void {
    const user = this.getUser();
    if (user) {
      this.setAuth(newToken, user, expiresInHours);
    }
  }

  // Get user email (for backward compatibility)
  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  // Check if user has specific role
  hasRole(role: User["role"]): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole("admin");
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole("student");
  }

  // Check if user is faculty
  isFaculty(): boolean {
    return this.hasRole("faculty");
  }

  // Get user department
  getUserDepartment(): string | null {
    const user = this.getUser();
    return user?.department || null;
  }

  // Get all auth data
  getAuthData(): AuthData | null {
    const token = this.getToken();
    const user = this.getUser();
    const expiresAt = this.getExpiresAt();

    if (!token || !user || !expiresAt) {
      return null;
    }

    return {
      token,
      user,
      expiresAt,
    };
  }

  // Set auth data from complete object
  setAuthData(authData: AuthData): void {
    const expiresInHours = (authData.expiresAt - Date.now()) / (60 * 60 * 1000);
    this.setAuth(authData.token, authData.user, expiresInHours);
  }

  // Check if token will expire soon (within specified minutes)
  isTokenExpiringSoon(minutes: number = 30): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;

    const expirationThreshold = Date.now() + minutes * 60 * 1000;
    return expiresAt <= expirationThreshold;
  }

  // Get remaining token validity time in milliseconds
  getTokenValidityTime(): number {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return 0;

    return Math.max(0, expiresAt - Date.now());
  }

  // Get remaining token validity time in hours
  getTokenValidityHours(): number {
    return this.getTokenValidityTime() / (60 * 60 * 1000);
  }

  // Logout user
  logout(): void {
    this.clearAuth();
    // Redirect to login page
    window.location.href = ROUTES.HOME;
  }

  // Initialize auth state (for app startup)
  initializeAuth(): boolean {
    return this.isAuthenticated();
  }
}

// Create and export a singleton instance
const tokenManager = new TokenManager();

export default tokenManager;

// Export individual functions for convenience
export const {
  isAuthenticated,
  getToken,
  getUser,
  getExpiresAt,
  setAuth,
  updateUser,
  clearAuth,
  refreshToken,
  getUserEmail,
  hasRole,
  isAdmin,
  isStudent,
  isFaculty,
  getUserDepartment,
  getAuthData,
  setAuthData,
  isTokenExpiringSoon,
  getTokenValidityTime,
  getTokenValidityHours,
  logout,
  initializeAuth,
} = tokenManager;
