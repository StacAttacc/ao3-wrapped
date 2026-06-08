import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <header className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">AO3 Wrapped</span>
        </div>
        <div className="flex-none gap-2">
          <span className="text-sm text-base-content/60">{user?.username}</span>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            Log out
          </button>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
