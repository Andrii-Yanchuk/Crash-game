"use client";

import { Login } from "@/components/Login";
import { useSyncExternalStore } from "react";

const USERNAME_STORAGE_KEY = "crash-game-username";
const USERNAME_CHANGE_EVENT = "crash-game-username-change";

function getStoredUsername() {
  return localStorage.getItem(USERNAME_STORAGE_KEY);
}

function getServerUsername() {
  return null;
}

function subscribeToUsername(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(USERNAME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(USERNAME_CHANGE_EVENT, callback);
  };
}

export default function Home() {
  const username = useSyncExternalStore(
    subscribeToUsername,
    getStoredUsername,
    getServerUsername,
  );

  function handleLogin(nextUsername: string) {
    localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  function handleLogout() {
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {username ? (
        <main className="flex flex-col items-center gap-4 p-8 text-white">
          <h1 className="text-3xl font-semibold">
            Welcome, <span className="text-[#FBBF24]">{username}</span>
          </h1>
          <p className="text-[#7A8599]">Home page is shown after login.</p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-[10px] bg-[#4A5568] px-5 py-3 font-semibold text-white transition hover:bg-[#5A667A] cursor-pointer"
          >
            Logout
          </button>
        </main>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
