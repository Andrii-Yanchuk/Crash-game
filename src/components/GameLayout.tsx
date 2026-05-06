interface GameLayoutProps {
  onLogout: () => void;
}

export function GameLayout({ onLogout }: GameLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 p-3 text-white">
      <section className="flex h-10 items-center gap-2 overflow-hidden rounded-lg border border-[#1A1F2E] bg-[#0E1119] px-3">
        <span className="shrink-0 text-xs font-semibold uppercase text-[#7A8599]">
          Crash history
        </span>
        <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
          {["1.24x", "3.10x", "1.02x", "7.82x", "2.44x"].map((multiplier) => (
            <span
              key={multiplier}
              className="shrink-0 rounded border border-[#FBBF244D] bg-[#FBBF241A] px-2 py-0.5 text-xs font-semibold text-[#FBBF24]"
            >
              {multiplier}
            </span>
          ))}
        </div>
      </section>

      <section className="flex min-h-[360px] flex-1 items-center justify-center rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-4">
        <span className="text-sm font-semibold uppercase text-[#7A8599]">
          Main graph
        </span>
      </section>

      <section className="flex min-h-[180px] items-center justify-center rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-4">
        <span className="text-sm font-semibold uppercase text-[#7A8599]">
          Bet controls
        </span>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-[10px] border border-[#1A1F2E] bg-[#111620] px-5 py-3 font-semibold text-white transition hover:bg-[#1A1F2E] cursor-pointer"
      >
        Logout
      </button>
    </main>
  );
}
