import { isValidUsername } from "@/lib/username";
import type { FormEvent } from "react";
import { useState } from "react";

type UseLoginFormInput = {
  onLogin: (username: string, rememberMe: boolean) => void;
};

export function useLoginForm({ onLogin }: UseLoginFormInput) {
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const trimmedUsername = username.trim();
  const hasUsernameInput = trimmedUsername.length > 0;
  const isUsernameValid = isValidUsername(trimmedUsername);
  const shouldShowUsernameError = hasUsernameInput && !isUsernameValid;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isUsernameValid) {
      return;
    }

    onLogin(trimmedUsername, rememberMe);
  }

  return {
    handleSubmit,
    isSubmitDisabled: !isUsernameValid,
    rememberMe,
    setRememberMe,
    setUsername,
    shouldShowUsernameError,
    username,
  };
}
