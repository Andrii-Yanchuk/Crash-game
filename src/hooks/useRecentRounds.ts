import { api } from "@/lib/apiClient";
import { RecentRound, useRecentStore } from "@/stores/recent";
import { useQuery } from "@tanstack/react-query";

type RecentRoundsResponse = {
  rounds: RecentRound[];
};

export function useRecentRounds(username: string | null) {
  const setInitial = useRecentStore((state) => state.setInitial);

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
