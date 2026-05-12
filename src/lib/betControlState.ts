import type { MyBet, RoundPhase } from "@/types/type";

const BET_BUTTON_STATE = {
  waiting: {
    label: "Place bet",
    className: "bg-[#FBBF24] text-black",
    disabled: false,
  },
  start: {
    label: "Wait for next round",
    className: "bg-[#4A5568] text-white",
    disabled: true,
  },
  tick: {
    label: "Cash Out",
    className: "bg-[#22C55E] text-black",
    disabled: false,
  },
  crash: {
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
  const canCashOut = phase === "tick" && Boolean(myBet);
  const isWaitingForNextRound = phase === "tick" && !myBet;
  const displayedBetButtonState = isWaitingForNextRound
    ? BET_BUTTON_STATE.start
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
          ? `Bet placed - ${myBet?.amount}`
          : displayedBetButtonState.label;

  return {
    betButtonClassName: displayedBetButtonState.className,
    betButtonLabel,
    isBetButtonDisabled,
    isBetControlsDisabled,
  };
}
