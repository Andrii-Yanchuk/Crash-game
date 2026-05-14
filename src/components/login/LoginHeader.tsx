"use client";

import Image from "next/image";
import { memo } from "react";

function LoginHeaderComponent() {
  return (
    <>
      <div className="size-16 mb-4 bg-[#FBBF241A] rounded-full flex items-center justify-center border border-[#FBBF244D]">
        <Image src="/logo.svg" alt="Crash Game Logo" width={32} height={32} />
      </div>
      <h1 className="text-2xl text-white">
        <span className="text-[#FBBF24]">Crash</span> Game
      </h1>
      <p className="text-center text-[#7A8599] mb-8">
        High-stakes real-time betting. Cash out before the crash.
      </p>
    </>
  );
}

export const LoginHeader = memo(LoginHeaderComponent);
