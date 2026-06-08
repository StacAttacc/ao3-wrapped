import { useReducer, type FormEvent } from 'react';
import { type ZodType, type ZodError } from 'zod';

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface FormState<T> {
  values: T;
  errors: FieldErrors<T>;
  isPending: boolean;
}

type FormAction<T> =
  | { type: 'SET_VALUE'; field: keyof T; value: string }
  | { type: 'SET_ERRORS'; errors: FieldErrors<T> }
  | { type: 'SET_PENDING'; pending: boolean };

function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_PENDING':
      return { ...state, isPending: action.pending };
  }
}

export function useForm<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  initialValues: T,
) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    isPending: false,
  });

  const setValue = (field: keyof T, value: string) => {
    dispatch({ type: 'SET_VALUE', field, value });
  };

  const handleSubmit = (onSubmit: (values: T) => Promise<void>) =>
    (e: FormEvent) => {
      e.preventDefault();
      const result = schema.safeParse(state.values);
      if (!result.success) {
        const errors = {} as FieldErrors<T>;
        for (const issue of (result.error as ZodError).issues) {
          const field = issue.path[0] as keyof T;
          if (field && !errors[field]) errors[field] = issue.message;
        }
        dispatch({ type: 'SET_ERRORS', errors });
        return;
      }
      dispatch({ type: 'SET_PENDING', pending: true });
      void onSubmit(result.data).finally(() => {
        dispatch({ type: 'SET_PENDING', pending: false });
      });
    };

  return { values: state.values, errors: state.errors, isPending: state.isPending, setValue, handleSubmit };
}
