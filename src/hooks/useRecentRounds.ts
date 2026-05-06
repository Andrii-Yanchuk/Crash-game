import { socket } from "@/lib/socket";
import { api } from "@/lib/apiClient";
import { RecentRound, useRecentStore } from "@/stores/recent";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type RecentRoundsResponse = {
  rounds: RecentRound[];
};

export function useRecentRounds(username: string | null) {
  const setInitial = useRecentStore((state) => state.setInitial);

  useEffect(() => {
    function handleRoundCrash(event: RecentRound) {
      useRecentStore.getState().prepend(event);
    }

    socket.on("round:crash", handleRoundCrash);

    return () => {
      socket.off("round:crash", handleRoundCrash);
    };
  }, []);

  return useQuery({
    queryKey: ["recent-rounds", username],
    queryFn: async () => {
      const { rounds } = await api<RecentRoundsResponse>(
        "/api/rounds/recent?limit=20",
        { username: username! },
      );

      setInitial(rounds);

      return rounds;
    },
    enabled: Boolean(username),
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
