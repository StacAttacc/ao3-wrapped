interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export function FormField({ id, label, type, value, onChange, error, autoComplete, disabled }: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`input w-full${error ? ' input-error' : ''}`}
      />
      {error && (
        <p id={errorId} role="alert" className="fieldset-label text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
