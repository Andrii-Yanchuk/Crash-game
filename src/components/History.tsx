const CRASH_HISTORY = ["1.24x", "3.10x", "1.02x", "7.82x", "2.44x"];

export function History() {
  return (
    <section className="flex h-10 items-center gap-2 overflow-hidden rounded-lg border border-[#1A1F2E] bg-[#0E1119] px-3">
      <span className="shrink-0 text-xs font-semibold uppercase text-[#7A8599]">
        Crash history
      </span>
      <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
        {CRASH_HISTORY.map((multiplier) => (
          <span
            key={multiplier}
            className="shrink-0 rounded border border-[#FBBF244D] bg-[#FBBF241A] px-2 py-0.5 text-xs font-semibold text-[#FBBF24]"
          >
            {multiplier}
          </span>
        ))}
      </div>
    </section>
  );
}
