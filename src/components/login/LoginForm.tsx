"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { USERNAME_REQUIREMENTS } from "@/lib/username";

type LoginFormProps = {
  onLogin: (username: string) => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const {
    handleSubmit,
    isSubmitDisabled,
    setUsername,
    shouldShowUsernameError,
    username,
  } = useLoginForm({ onLogin });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-[#0E1119] p-6 rounded-2xl border border-[#1A1F2E]"
    >
      <label
        htmlFor="username"
        className="text-[#7A8599] uppercase text-xs mb-2"
      >
        username
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter your username"
        aria-describedby="username-requirements"
        aria-invalid={shouldShowUsernameError}
        autoComplete="username"
        className="bg-[#111620] border border-[#1A1F2E] text-white px-4 py-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24] transition"
      />
      <span id="username-requirements" className="text-[#7A8599] text-xs mb-6">
        {USERNAME_REQUIREMENTS}
      </span>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="bg-[#FBBF24] text-black font-semibold text-lg py-3.5 rounded-[10px] hover:bg-[#FBBF24CC] transition cursor-pointer disabled:bg-[#4A5568] disabled:cursor-not-allowed disabled:hover:bg-[#4A5568]"
      >
        Enter Game
      </button>
    </form>
  );
}
