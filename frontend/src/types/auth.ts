export interface AuthUser {
  username: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isInitialised: boolean;
}

export type AuthAction =
  | { type: 'HYDRATE'; payload: { user: AuthUser; token: string } | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGOUT' };

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface ApiErrorBody {
  error?: string;
}
