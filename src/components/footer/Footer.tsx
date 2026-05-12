"use client";

import { ConnectionStatus } from "./ConnectionStatus";
import { getConnectionStatus, getDisplayedRoundId } from "./footerState";
import { MobilePlayersButton } from "./MobilePlayersButton";
import { SoundToggleButton } from "./SoundToggleButton";
import { UserButton } from "./UserButton";
import { PlayersPanel } from "./../PlayersPanel";
import { useGameStore } from "@/stores/game";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

interface FooterProps {
  username: string;
  onLogout: () => void;
}

export function Footer({ username, onLogout }: FooterProps) {
  const [isPlayersPanelOpen, setIsPlayersPanelOpen] = useState(false);
  const playersButtonRef = useRef<HTMLButtonElement>(null);
  const {
    connectionError,
    isConnected,
    isReconnecting,
    isSoundEnabled,
    playerCount,
    players,
    roundId,
    setIsSoundEnabled,
  } = useGameStore(
    useShallow((state) => ({
      connectionError: state.connectionError,
      isConnected: state.isConnected,
      isReconnecting: state.isReconnecting,
      isSoundEnabled: state.isSoundEnabled,
      playerCount: state.playerCount,
      players: state.players,
      roundId: state.roundId,
      setIsSoundEnabled: state.setIsSoundEnabled,
    })),
  );
  const displayedRoundId = getDisplayedRoundId(roundId);
  const { dotClassName: connectionDotClassName, label: connectionLabel } =
    getConnectionStatus({
      connectionError,
      isConnected,
      isReconnecting,
    });

  function closePlayersPanel() {
    playersButtonRef.current?.focus();
    setIsPlayersPanelOpen(false);
  }

  return (
    <>
      <footer className="flex h-18 items-center justify-between border-t border-[#1A1F2E] bg-[#0B0E16] px-4 text-[#7A8599]">
        <div className="flex min-w-0 items-center gap-3">
          <ConnectionStatus
            connectionDotClassName={connectionDotClassName}
            connectionLabel={connectionLabel}
            displayedRoundId={displayedRoundId}
            playerCount={playerCount}
          />

          <MobilePlayersButton
            buttonRef={playersButtonRef}
            onClick={() => setIsPlayersPanelOpen(true)}
            playerCount={playerCount}
          />
        </div>

        <div className="flex items-center gap-3">
          <UserButton username={username} onLogout={onLogout} />

          <SoundToggleButton
            isSoundEnabled={isSoundEnabled}
            onToggle={() => setIsSoundEnabled(!isSoundEnabled)}
          />
        </div>
      </footer>

      <PlayersPanel
        isOpen={isPlayersPanelOpen}
        players={players}
        onClose={closePlayersPanel}
      />
    </>
  );
}
