import {
  AuthResponse,
  GoogleCallbackResponse,
  User,
  AuthResponseSchema,
  GoogleCallbackResponseSchema,
  UserSchema,
} from "@/types/auth.types";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthApi {
  private readonly baseUrl = `${API_BASE_URL}/auth`;

  private async handleResponse<T>(
    response: Response,
    context?: string
  ): Promise<T> {
    if (!response.ok) {
      let errorData: any = {};

      try {
        const text = await response.text();

        if (text) {
          errorData = JSON.parse(text);
        }
      } catch (parseError) {
        errorData = {};
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        `HTTP ${response.status}: ${response.statusText}`;

      throw new AuthApiError(
        errorMessage,
        response.status,
        errorData.code,
        errorData
      );
    }

    try {
      const text = await response.text();

      if (!text) {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (parseError) {
      throw new AuthApiError(
        "Invalid JSON response from server",
        500,
        "INVALID_JSON",
        {
          parseError,
          context,
        }
      );
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      if (!token) {
        throw new AuthApiError("Token is required", 400, "TOKEN_MISSING");
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await this.handleResponse<{ user: User }>(
        response,
        "verifyToken"
      );

      // Validate the user data structure
      if (!data.user) {
        throw new AuthApiError(
          "User data not found in response",
          500,
          "USER_DATA_MISSING"
        );
      }

      // Parse and validate user data with better error handling
      try {
        return UserSchema.parse(data.user);
      } catch (zodError) {
        throw new AuthApiError(
          "Invalid user data format received from server",
          500,
          "INVALID_USER_DATA",
          { receivedData: data.user, zodError }
        );
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      console.error("Token verification failed:", error);
      throw new AuthApiError(
        "Failed to verify token",
        0,
        "NETWORK_ERROR",
        error
      );
    }
  }

  async initiateGoogleLogin(): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/google`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse<{ url: string }>(
        response,
        "initiateGoogleLogin"
      );
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(
        "Failed to initiate Google login",
        0,
        "NETWORK_ERROR",
        error
      );
    }
  }

  async handleGoogleCallback(code: string): Promise<GoogleCallbackResponse> {
    try {
      if (!code) {
        throw new AuthApiError(
          "Authorization code is required",
          400,
          "CODE_MISSING"
        );
      }

      const requestBody = { code };

      const response = await fetch(`${this.baseUrl}/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await this.handleResponse<GoogleCallbackResponse>(
        response,
        "handleGoogleCallback"
      );

      // Check for specific error codes from server
      if (!data.success) {
        const errorMessage = data.message || "Google callback failed";

        // Handle specific error codes
        if ((data as any).error_code === "USER_NOT_REGISTERED") {
          throw new AuthApiError(
            errorMessage,
            403,
            "USER_NOT_REGISTERED",
            data
          );
        }

        if ((data as any).error_code === "GOOGLE_SERVICE_UNAVAILABLE") {
          throw new AuthApiError(
            errorMessage,
            503,
            "GOOGLE_SERVICE_UNAVAILABLE",
            data
          );
        }

        if ((data as any).error_code === "INVALID_GOOGLE_RESPONSE") {
          throw new AuthApiError(
            errorMessage,
            502,
            "INVALID_GOOGLE_RESPONSE",
            data
          );
        }

        throw new AuthApiError(
          errorMessage,
          400,
          (data as any).error_code,
          data
        );
      }

      // Parse and validate response with better error handling
      try {
        const validatedData = GoogleCallbackResponseSchema.parse(data);
        return validatedData;
      } catch (zodError) {
        console.error("Google callback schema validation failed:", zodError);
        console.error("Received callback data:", data);
        throw new AuthApiError(
          "Invalid callback response format received from server",
          500,
          "INVALID_CALLBACK_DATA",
          { receivedData: data, zodError }
        );
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      console.error("Google callback failed:", error);
      throw new AuthApiError(
        "Failed to handle Google callback",
        0,
        "NETWORK_ERROR",
        error
      );
    }
  }

  async logout(token: string): Promise<void> {
    try {
      if (!token) {
        console.warn("No token provided for logout");
        return;
      }

      const response = await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await this.handleResponse<void>(response, "logout");
    } catch (error) {
      // Logout errors are non-critical, just log them
      console.warn("Logout request failed:", error);
    }
  }

  // Helper method to check API connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

export const authApi = new AuthApi();
