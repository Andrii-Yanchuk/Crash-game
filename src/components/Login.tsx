"use client";

import Image from "next/image";
import { useState } from "react";
import { isValidUsername, USERNAME_REQUIREMENTS } from "@/lib/username";

type LoginProps = {
  onLogin: (username: string) => void;
};

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const trimmedUsername = username.trim();
  const isUsernameInvalid = !isValidUsername(trimmedUsername);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUsernameInvalid) {
      return;
    }

    onLogin(trimmedUsername);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="size-16 mb-4 bg-[#FBBF241A] rounded-full flex items-center justify-center border border-[#FBBF244D]">
        <Image src="/logo.svg" alt="Crash Game Logo" width={32} height={32} />
      </div>
      <h1 className="text-2xl">
        <span className="text-[#FBBF24]">Crash</span> Game
      </h1>
      <p className="text-center text-[#7A8599] mb-8">
        High-stakes real-time betting. Cash out before the
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-[#0E1119] p-6 rounded-2xl border border-[#1A1F2E]"
      >
        <span className="text-[#7A8599] uppercase text-xs mb-2">username</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          aria-invalid={isUsernameInvalid}
          autoComplete="username"
          className="bg-[#111620] border border-[#1A1F2E] text-white px-4 py-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24] transition"
        />
        <span className="text-[#7A8599] text-xs mb-6">
          {USERNAME_REQUIREMENTS}
        </span>
        <button
          type="submit"
          disabled={isUsernameInvalid}
          className="bg-[#FBBF24] text-black font-semibold text-lg py-3.5 rounded-[10px] hover:bg-[#FBBF24CC] transition cursor-pointer disabled:bg-[#4A5568] disabled:cursor-not-allowed disabled:hover:bg-[#4A5568]"
        >
          Enter Game
        </button>
      </form>
    </div>
  );
}
