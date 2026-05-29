import { memo } from "react";
import { PlayersList } from "./PlayersList";

type PlayersPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

function PlayersPanelContent({ onClose }: { onClose: () => void }) {
  return (
    <PlayersList
      className="h-full rounded-none border-y-0 border-r-0"
      onClose={onClose}
    />
  );
}

function PlayersPanelComponent({ isOpen, onClose }: PlayersPanelProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close live players"
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-40 h-dvh w-62.5 max-w-[85vw] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isOpen ? <PlayersPanelContent onClose={onClose} /> : null}
      </aside>
    </>
  );
}

export const PlayersPanel = memo(PlayersPanelComponent);
