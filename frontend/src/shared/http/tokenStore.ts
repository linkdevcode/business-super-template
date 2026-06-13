let accessToken: string | null = null;
type AccessTokenListener = (nextAccessToken: string | null) => void;
const listeners = new Set<AccessTokenListener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(nextAccessToken: string | null): void {
  accessToken = nextAccessToken;
  notifyListeners();
}

export function clearAccessToken(): void {
  accessToken = null;
  notifyListeners();
}

export function subscribeToAccessTokenChanges(listener: AccessTokenListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener(accessToken);
  }
}
