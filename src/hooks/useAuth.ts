import { useSyncExternalStore } from "react";
import { isValidUsername } from "@/lib/username";

const USERNAME_STORAGE_KEY = "crash-game-username";
const USERNAME_CHANGE_EVENT = "crash-game-username-change";

function getStoredUsername() {
  const username = sessionStorage.getItem(USERNAME_STORAGE_KEY);

  if (!username || !isValidUsername(username)) {
    return null;
  }

  return username;
}

function getServerUsername() {
  return null;
}

function subscribeToUsername(callback: () => void) {
  window.addEventListener(USERNAME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener(USERNAME_CHANGE_EVENT, callback);
  };
}

export function useAuth() {
  const username = useSyncExternalStore(
    subscribeToUsername,
    getStoredUsername,
    getServerUsername,
  );

  function login(nextUsername: string) {
    const username = nextUsername.trim();

    if (!isValidUsername(username)) {
      return;
    }

    sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  function logout() {
    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  return { username, login, logout };
}
