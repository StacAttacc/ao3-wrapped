import { createBrowserRouter, redirect } from 'react-router-dom';
import { tokenStore } from '@/services/tokenStore';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

function requireAuth() {
  if (!tokenStore.get()) return redirect('/login');
  return null;
}

function requireGuest() {
  if (tokenStore.get()) return redirect('/dashboard');
  return null;
}

export const router = createBrowserRouter([
  {
    path: '/',
    loader: () => redirect(tokenStore.get() ? '/dashboard' : '/login'),
  },
  {
    element: <AuthLayout />,
    loader: requireGuest,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AppLayout />,
    loader: requireAuth,
    children: [
      // dashboard and other authenticated routes go here
    ],
  },
]);
