import { getIsSoundEnabled, toggleSoundEnabled } from "@/stores/sound";
import Image from "next/image";
import { useState } from "react";

export function SoundToggleButton() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(getIsSoundEnabled);

  return (
    <button
      type="button"
      aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
      aria-pressed={isSoundEnabled}
      onClick={() => setIsSoundEnabled(toggleSoundEnabled())}
      className="flex size-6 items-center justify-center rounded-full hover:bg-[#101621] transition cursor-pointer"
    >
      <Image
        src={isSoundEnabled ? "/sound-on.svg" : "/sound-off.svg"}
        alt="sound icon"
        aria-hidden="true"
        width={24}
        height={24}
        className="size-3.5 md:size-5"
      />
    </button>
  );
}
