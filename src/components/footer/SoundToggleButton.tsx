import { getIsSoundEnabled, toggleSoundEnabled } from "@/stores/sound";
import Image from "next/image";
import { useRef } from "react";

export function SoundToggleButton() {
  const isSoundEnabled = getIsSoundEnabled();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const soundOnIconRef = useRef<HTMLImageElement>(null);
  const soundOffIconRef = useRef<HTMLImageElement>(null);

  function syncButtonState(isSoundEnabled: boolean) {
    const button = buttonRef.current;
    const soundOnIcon = soundOnIconRef.current;
    const soundOffIcon = soundOffIconRef.current;

    if (!button || !soundOnIcon || !soundOffIcon) {
      return;
    }

    button.setAttribute(
      "aria-label",
      isSoundEnabled ? "Disable sound" : "Enable sound",
    );
    button.setAttribute("aria-pressed", String(isSoundEnabled));
    button.className = `flex size-10 items-center justify-center rounded-full transition cursor-pointer ${
      isSoundEnabled
        ? "text-[#7A8599] hover:bg-[#101621] hover:text-white"
        : "bg-[#101621] text-[#FBBF24]"
    }`;
    soundOnIcon.hidden = !isSoundEnabled;
    soundOffIcon.hidden = isSoundEnabled;
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
      aria-pressed={isSoundEnabled}
      onClick={() => {
        syncButtonState(toggleSoundEnabled());
      }}
      className={`flex size-10 items-center justify-center rounded-full transition cursor-pointer ${
        isSoundEnabled
          ? "text-[#7A8599] hover:bg-[#101621] hover:text-white"
          : "bg-[#101621] text-[#FBBF24]"
      }`}
    >
      <Image
        ref={soundOnIconRef}
        src="/sound-on.svg"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        hidden={!isSoundEnabled}
      />
      <Image
        ref={soundOffIconRef}
        src="/sound-off.svg"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        hidden={isSoundEnabled}
      />
    </button>
  );
}
