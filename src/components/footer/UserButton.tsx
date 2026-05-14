import Image from "next/image";

type UserButtonProps = {
  onLogout: () => void;
  username: string;
};

export function UserButton({ onLogout, username }: UserButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="flex h-5 max-w-36 items-center gap-1.5 rounded-full bg-[#101621] px-2 text-sm font-medium text-white transition hover:bg-[#171E2B] cursor-pointer"
    >
      <Image
        src="/user-icon.svg"
        alt="user icon"
        aria-hidden="true"
        width={16}
        height={16}
        className="hidden md:block size-3"
      />
      <span className="min-w-0 text-[10px] md:text-xs">{username}</span>
      <Image
        src="/logout-icon.svg"
        alt="logout icon"
        aria-hidden="true"
        width={16}
        height={16}
        className="size-2.5 md:size-3"
      />
    </button>
  );
}
