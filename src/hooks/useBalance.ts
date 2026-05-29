import { api } from "@/lib/apiClient";
import { useGameStore } from "@/stores/game";
import { useQuery } from "@tanstack/react-query";

type BalanceResponse = {
  balance: number;
};

export function useBalance(username: string | null) {
  const setBalance = useGameStore((state) => state.setBalance);

  return useQuery({
    queryKey: ["balance", username],
    queryFn: async () => {
      const { balance } = await api<BalanceResponse>("/api/balance", {
        username: username!,
      });

      setBalance(balance);

      return balance;
    },
    enabled: Boolean(username),
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
