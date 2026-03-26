import type { ReactNode } from "react";
import type { MinigameProps } from "@dino-atlas/types";

interface GameWrapperProps extends MinigameProps {
  title?: string;
  children: ReactNode;
}

export function GameWrapper({ title, children, onExit }: GameWrapperProps) {
  return (
    <div className="game-wrapper">
      <header className="game-header">
        <button onClick={onExit} className="game-exit" aria-label="Zurueck">
          ✕
        </button>
        {title && <h1 className="game-title">{title}</h1>}
      </header>
      <main className="game-content">{children}</main>
    </div>
  );
}
