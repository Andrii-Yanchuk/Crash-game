export function getTemporaryApiKey(username: string) {
  return encodeURIComponent(username);
}

