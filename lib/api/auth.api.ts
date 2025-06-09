import { AuthResponse, GoogleCallbackResponse, User, AuthResponseSchema, GoogleCallbackResponseSchema, UserSchema } from '@/types/auth.types';

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AuthApi {
  private readonly baseUrl = `${API_BASE_URL}/auth`;

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData
      );
    }
    return response.json();
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<{ user: User }>(response);
      
      // Log the actual response for debugging
      console.log('API Response for token verification:', data);
      
      // Validate the user data structure
      if (!data.user) {
        throw new AuthApiError('User data not found in response', 500, 'USER_DATA_MISSING');
      }

      // Parse and validate user data with better error handling
      try {
        return UserSchema.parse(data.user);
      } catch (zodError) {
        console.error('User schema validation failed:', zodError);
        console.error('Received user data:', data.user);
        throw new AuthApiError(
          'Invalid user data format received from server',
          500,
          'INVALID_USER_DATA',
          { receivedData: data.user, zodError }
        );
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(
        'Failed to verify token',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  async initiateGoogleLogin(): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/google`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<{ url: string }>(response);
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(
        'Failed to initiate Google login',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  async handleGoogleCallback(code: string): Promise<GoogleCallbackResponse> {
    try {
      console.log('Sending Google callback with code:', code);
      
      const response = await fetch(`${this.baseUrl}/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await this.handleResponse<GoogleCallbackResponse>(response);
      
      // Log the actual response for debugging
      console.log('Google callback response:', data);
      
      // Parse and validate response with better error handling
      try {
        return GoogleCallbackResponseSchema.parse(data);
      } catch (zodError) {
        console.error('Google callback schema validation failed:', zodError);
        console.error('Received callback data:', data);
        throw new AuthApiError(
          'Invalid callback response format received from server',
          500,
          'INVALID_CALLBACK_DATA',
          { receivedData: data, zodError }
        );
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(
        'Failed to handle Google callback',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Logout errors are non-critical, just log them
      console.warn('Logout request failed:', error);
    }
  }
}

export const authApi = new AuthApi();