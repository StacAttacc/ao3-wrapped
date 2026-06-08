import { apiFetch } from './api';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthResponse {
  token: string;
  username: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
}

export const authService: IAuthService = {
  login(credentials) {
    return apiFetch<AuthResponse>('/api/auth/login/', {
      method: 'POST',
      body: credentials,
    });
  },

  register(credentials) {
    return apiFetch<AuthResponse>('/api/auth/register/', {
      method: 'POST',
      body: credentials,
    });
  },
};
