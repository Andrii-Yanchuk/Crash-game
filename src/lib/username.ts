export const USERNAME_REQUIREMENTS =
  "Use at least 3 characters: Latin letters, numbers, underscores, or hyphens.";

const USERNAME_PATTERN = /^[A-Za-z0-9_-]{3,}$/;

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username.trim());
}
