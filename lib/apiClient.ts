// lib/apiClient.ts
const API_BASE_URL = 'http://localhost:5000';

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  private async requestFormData<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      method,
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Brand endpoints
  async getBrands() {
    return this.request('/api/brands');
  }

  // Cluster endpoints
  async getClusters() {
    return this.request('/api/clusters');
  }

  // Materi endpoints
  async getMateri() {
    return this.request('/api/materi');
  }

  async getMateriById(id: number) {
    return this.request(`/api/materi/${id}`);
  }

  async createMateri(formData: FormData) {
    return this.requestFormData('/api/materi', formData, 'POST');
  }

  async updateMateri(id: number, formData: FormData) {
    return this.requestFormData(`/api/materi/${id}`, formData, 'PUT');
  }

  async deleteMateri(id: number) {
    return this.request(`/api/materi/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();