"use client";

import type { RecentRound } from "@/stores/recent";
import { useRecentStore } from "@/stores/recent";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

const VISIBLE_ROUNDS_COUNT = 15;

const TIER_CLASSES = {
  low: "border-[#82181A] bg-[#460809]/40 text-red-400",
  mid: "border-[#7B3306] bg-[#46190166]/40 text-orange-400",
  high: "border-[#0D542B] bg-[#032E1566]/40 text-green-400",
};

function HistoryRoundPill({ roundId }: { roundId: string }) {
  const round = useRecentStore((state) =>
    state.rounds.find((item) => item.roundId === roundId),
  );

  if (!round) {
    return null;
  }

  return (
    <span
      className={`shrink-0 rounded-[40px] border px-2 py-0.5 text-xs font-semibold ${
        TIER_CLASSES[round.tier]
      }`}
    >
      {round.crashPoint.toFixed(2)}x
    </span>
  );
}

const MemoizedHistoryRoundPill = memo(HistoryRoundPill);

function HistoryComponent() {
  const visibleRoundIds = useRecentStore(
    useShallow((state) =>
      state.rounds
        .slice(0, VISIBLE_ROUNDS_COUNT)
        .map((round: RecentRound) => round.roundId),
    ),
  );

  return (
    <section className="scrollbar-none flex h-10 w-full max-w-375 min-w-0 items-center gap-2 overflow-x-auto overflow-y-hidden">
      {visibleRoundIds.map((roundId) => (
        <MemoizedHistoryRoundPill key={roundId} roundId={roundId} />
      ))}
    </section>
  );
}

export const History = memo(HistoryComponent);
