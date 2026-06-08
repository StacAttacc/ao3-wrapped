import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { tokenStore } from '@/services/tokenStore';
import { authService, type IAuthService } from '@/services/authService';
import type { AuthAction, AuthState, AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isInitialised: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        user: action.payload?.user ?? null,
        token: action.payload?.token ?? null,
        isInitialised: true,
      };
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isInitialised: true };
    case 'LOGOUT':
      return { user: null, token: null, isInitialised: true };
  }
}

const initialState: AuthState = { user: null, token: null, isInitialised: false };

export function AuthProvider({
  children,
  service = authService,
}: {
  children: ReactNode;
  service?: IAuthService;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = tokenStore.get();
    if (token) {
      dispatch({ type: 'HYDRATE', payload: { user: { username: '' }, token } });
    } else {
      dispatch({ type: 'HYDRATE', payload: null });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await service.login(credentials);
    tokenStore.set(data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { username: data.username }, token: data.token } });
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await service.register(credentials);
    tokenStore.set(data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { username: data.username }, token: data.token } });
  };

  const logout = () => {
    tokenStore.clear();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
