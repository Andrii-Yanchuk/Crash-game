import { formatAmount } from "./format";
import type { MyBet, RoundPhase } from "@/types/type";

const BET_BUTTON_STATE = {
  waiting: {
    label: "Place bet",
    className: "bg-[#FBBF24] text-black",
    disabled: false,
  },
  starting: {
    label: "Wait for next round",
    className: "bg-[#4A5568] text-white",
    disabled: true,
  },
  running: {
    label: "Cash Out",
    className: "bg-[#22C55E] text-black",
    disabled: false,
  },
  crashed: {
    label: "Crashed",
    className: "bg-[#EF4444] text-white",
    disabled: true,
  },
} as const satisfies Record<
  RoundPhase,
  {
    label: string;
    className: string;
    disabled: boolean;
  }
>;

type BetControlStateInput = {
  phase: RoundPhase;
  myBet: MyBet | null;
  isBetPending: boolean;
};

export function getBetControlState({
  phase,
  myBet,
  isBetPending,
}: BetControlStateInput) {
  const hasPlacedBet = phase === "waiting" && Boolean(myBet);
  const canCashOut = phase === "running" && Boolean(myBet);
  const isWaitingForNextRound = phase === "running" && !myBet;
  const displayedBetButtonState = isWaitingForNextRound
    ? BET_BUTTON_STATE.starting
    : BET_BUTTON_STATE[phase];
  const isBetButtonDisabled =
    displayedBetButtonState.disabled ||
    isBetPending ||
    hasPlacedBet ||
    isWaitingForNextRound;
  const isBetControlsDisabled =
    isBetPending || Boolean(myBet) || phase !== "waiting";
  const betButtonLabel = isBetPending
    ? "Loading..."
    : canCashOut
      ? "Cash Out"
      : isWaitingForNextRound
        ? "Wait for next round"
        : hasPlacedBet
          ? `Bet placed - ${formatAmount(myBet?.amount ?? 0)}`
          : displayedBetButtonState.label;

  return {
    betButtonClassName: displayedBetButtonState.className,
    betButtonLabel,
    isBetButtonDisabled,
    isBetControlsDisabled,
  };
}
