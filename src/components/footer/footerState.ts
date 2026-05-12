type ConnectionState = {
  connectionError: string | null;
  isConnected: boolean;
  isReconnecting: boolean;
};

export function getDisplayedRoundId(roundId: string | null) {
  return roundId?.replace("round_", "R#") ?? "R#----";
}

export function getConnectionStatus({
  connectionError,
  isConnected,
  isReconnecting,
}: ConnectionState) {
  if (isConnected) {
    return {
      dotClassName: "bg-[#22C55E]",
      label: "Connected",
    };
  }

  if (isReconnecting) {
    return {
      dotClassName: "bg-[#FBBF24]",
      label: "Reconnecting",
    };
  }

  return {
    dotClassName: "bg-[#EF4444]",
    label: connectionError ? "Connection error" : "Disconnected",
  };
}
