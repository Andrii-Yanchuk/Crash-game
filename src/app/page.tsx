"use client";

import { GameLayout } from "@/components/GameLayout";
import { Login } from "@/components/Login";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";

export default function Home() {
  const { username, login, logout } = useAuth();
  useSocket(username);

  return (
    <div className="flex min-h-screen flex-col bg-[#07080F] font-sans">
      {username ? (
        <GameLayout username={username} onLogout={logout} />
      ) : (
        <Login onLogin={login} />
      )}
    </div>
  );
}
