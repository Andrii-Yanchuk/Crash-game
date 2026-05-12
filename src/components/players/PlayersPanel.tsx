import { PlayersList } from "./PlayersList";
import { useGameStore } from "@/stores/game";

type PlayersPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PlayersPanel({ isOpen, onClose }: PlayersPanelProps) {
  const players = useGameStore((state) => state.players);

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
        <PlayersList
          players={players}
          className="h-full rounded-none border-y-0 border-r-0"
          onClose={onClose}
        />
      </aside>
    </>
  );
}
