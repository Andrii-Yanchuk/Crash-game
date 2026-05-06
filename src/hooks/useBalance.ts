import { api } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

type BalanceResponse = {
  balance: number;
};

async function fetchBalance(username: string) {
  const data = await api<BalanceResponse>("/api/balance", { username });

  return data.balance;
}

export function useBalance(username: string | null) {
  return useQuery({
    queryKey: ["balance", username],
    queryFn: () => fetchBalance(username!),
    enabled: Boolean(username),
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
