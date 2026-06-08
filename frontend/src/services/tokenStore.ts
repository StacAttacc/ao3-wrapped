const KEY = 'ao3w_token';

export const tokenStore = {
  get: (): string | null => sessionStorage.getItem(KEY),
  set: (token: string): void => { sessionStorage.setItem(KEY, token); },
  clear: (): void => { sessionStorage.removeItem(KEY); },
};
