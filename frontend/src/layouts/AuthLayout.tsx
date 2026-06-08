import { Outlet, NavLink, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">AO3 Wrapped</h1>
            <p className="text-base-content/60 text-sm mt-1">
              {isLogin ? 'Your year in fanfiction' : 'Create your account'}
            </p>
          </div>

          <Outlet />

          <p className="text-center text-sm text-base-content/60">
            {isLogin ? (
              <>
                New here?{' '}
                <NavLink to="/register" className="link link-primary">
                  Create an account
                </NavLink>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <NavLink to="/login" className="link link-primary">
                  Log in
                </NavLink>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
