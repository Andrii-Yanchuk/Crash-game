import Image from "next/image";

type SoundToggleButtonProps = {
  isSoundEnabled: boolean;
  onToggle: () => void;
};

export function SoundToggleButton({
  isSoundEnabled,
  onToggle,
}: SoundToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
      aria-pressed={isSoundEnabled}
      onClick={onToggle}
      className={`flex size-10 items-center justify-center rounded-full transition cursor-pointer ${
        isSoundEnabled
          ? "text-[#7A8599] hover:bg-[#101621] hover:text-white"
          : "bg-[#101621] text-[#FBBF24]"
      }`}
    >
      <Image
        src={isSoundEnabled ? "/sound-on.svg" : "/sound-off.svg"}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
    </button>
  );
}
