interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div role="alert" aria-live="assertive" className="alert alert-error">
      <span>{message}</span>
    </div>
  );
}
