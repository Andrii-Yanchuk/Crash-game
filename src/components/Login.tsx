"use client";

import { LoginForm } from "./login/LoginForm";
import { LoginHeader } from "./login/LoginHeader";

type LoginProps = {
  onLogin: (username: string) => void;
};

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <LoginHeader />
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
