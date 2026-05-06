import { useSyncExternalStore } from "react";

const USERNAME_STORAGE_KEY = "crash-game-username";
const USERNAME_CHANGE_EVENT = "crash-game-username-change";

function getStoredUsername() {
  return sessionStorage.getItem(USERNAME_STORAGE_KEY);
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
    sessionStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  function logout() {
    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  return { username, login, logout };
}
