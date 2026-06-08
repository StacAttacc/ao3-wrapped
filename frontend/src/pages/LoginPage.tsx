import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useForm } from '@/hooks/useForm';
import { loginSchema } from '@/schemas/authSchemas';
import { FormField } from '@/components/FormField/FormField';
import { SubmitButton } from '@/components/SubmitButton/SubmitButton';
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner';
import { ApiError } from '@/services/api';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const { values, errors, isPending, setValue, handleSubmit } = useForm(
    loginSchema,
    { username: '', password: '' },
  );

  const onSubmit = handleSubmit(async (data) => {
    setApiError(null);
    try {
      await login(data);
      void navigate('/dashboard');
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Something went wrong');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <ErrorBanner message={apiError} />
      <FormField
        id="username"
        label="Username"
        type="text"
        value={values.username}
        onChange={(v) => setValue('username', v)}
        error={errors.username}
        autoComplete="username"
        disabled={isPending}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={(v) => setValue('password', v)}
        error={errors.password}
        autoComplete="current-password"
        disabled={isPending}
      />
      <SubmitButton isPending={isPending}>Log in</SubmitButton>
    </form>
  );
}
