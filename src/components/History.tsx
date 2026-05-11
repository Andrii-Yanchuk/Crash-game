"use client";

import { useRecentStore } from "@/stores/recent";

const TIER_CLASSES = {
  low: "border-[#82181A] bg-[#460809]/40 text-red-400",
  mid: "border-[#7B3306] bg-[#46190166]/40 text-orange-400",
  high: "border-[#0D542B] bg-[#032E1566]/40 text-green-400",
};

export function History() {
  const rounds = useRecentStore((state) => state.rounds);
  const visibleRounds = rounds.slice(0, 15);

  return (
    <section className="scrollbar-none flex h-10 w-full max-w-[1500px] min-w-0 items-center gap-2 overflow-x-auto overflow-y-hidden">
      {visibleRounds.map((round) => (
        <span
          key={round.roundId}
          className={`shrink-0 rounded-[40px] border px-2 py-0.5 text-xs font-semibold ${TIER_CLASSES[round.tier]}`}
        >
          {round.crashPoint.toFixed(2)}x
        </span>
      ))}
    </section>
  );
}
