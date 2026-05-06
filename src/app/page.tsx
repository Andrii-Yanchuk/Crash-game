"use client";

import { Login } from "@/components/Login";
import { socket } from "@/lib/socket";
import { useEffect, useSyncExternalStore } from "react";

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

export default function Home() {
  const username = useSyncExternalStore(
    subscribeToUsername,
    getStoredUsername,
    getServerUsername,
  );

  useEffect(() => {
    if (!username) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: username,
    };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [username]);

  function handleLogin(nextUsername: string) {
    sessionStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  function handleLogout() {
    socket.disconnect();

    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
    window.dispatchEvent(new Event(USERNAME_CHANGE_EVENT));
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {username ? (
        <main className="flex flex-col items-center gap-4 p-8 text-white">
          <h1 className="text-3xl font-semibold">
            Welcome, <span className="text-[#FBBF24]">{username}</span>
          </h1>
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
