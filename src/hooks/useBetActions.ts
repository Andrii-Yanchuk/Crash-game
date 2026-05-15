import { MAX_BET_AMOUNT } from "@/config/bet";
import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { getIsSoundEnabled } from "@/stores/sound";
import { useCallback } from "react";
import useSound from "use-sound";

export type PlaceBetInput = {
  amount: number;
  autoCashOutAt: number | null;
};

function validateBetAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_BET_AMOUNT) {
    return `Bet amount must be greater than 0 and no more than ${MAX_BET_AMOUNT}.`;
  }

  return null;
}

export function useBetActions() {
  const [playBetSound] = useSound("/sounds/bet.mp3", {
    volume: 0.6,
  });

  const cashOut = useCallback(() => {
    const { phase, myBet, isBetPending, setBetError, setIsBetPending } =
      useGameStore.getState();

    if (phase !== "tick" || !myBet || isBetPending) {
      return;
    }

    setBetError(null);
    setIsBetPending(true);
    socket.emit("bet:cashout", {});
  }, []);

  const placeBet = useCallback(({ amount, autoCashOutAt }: PlaceBetInput) => {
    const { phase, myBet, isBetPending, setBetError, setIsBetPending } =
      useGameStore.getState();

    if (phase !== "waiting" || myBet || isBetPending) {
      return;
    }

    const validationError = validateBetAmount(amount);

    if (validationError) {
      setBetError(validationError);
      return;
    }

    setBetError(null);
    setIsBetPending(true);
    if (getIsSoundEnabled()) {
      playBetSound();
    }
    socket.emit("bet:place", {
      amount,
      autoCashOutAt,
    });
  }, [playBetSound]);

  return {
    cashOut,
    placeBet,
  };
}
