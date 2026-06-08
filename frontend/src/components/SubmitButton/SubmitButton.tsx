import type { ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  isPending: boolean;
  disabled?: boolean;
}

export function SubmitButton({ children, isPending, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      aria-busy={isPending}
      className="btn btn-primary w-full"
    >
      {isPending ? <span className="loading loading-spinner loading-sm" /> : children}
    </button>
  );
}
