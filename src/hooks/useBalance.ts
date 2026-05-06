import { API_URL } from "@/config/api";
import { getTemporaryApiKey } from "@/lib/apiKey";
import { useQuery } from "@tanstack/react-query";

type BalanceResponse = {
  balance: number;
};

async function fetchBalance(username: string) {
  const response = await fetch(`${API_URL}/api/balance`, {
    headers: {
      "X-API-Key": getTemporaryApiKey(username),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load balance");
  }

  const data = (await response.json()) as BalanceResponse;

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
