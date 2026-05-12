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
      className="flex h-10 max-w-36 items-center gap-1.5 rounded-full bg-[#101621] px-4 text-sm font-medium text-white transition hover:bg-[#171E2B] cursor-pointer"
    >
      <span className="min-w-0 truncate">{username}</span>
      <Image
        src="/logout-icon.svg"
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
        className="shrink-0"
      />
    </button>
  );
}
