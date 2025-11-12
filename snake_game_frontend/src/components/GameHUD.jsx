import React from "react";

// PUBLIC_INTERFACE
export default function GameHUD({ score, highScore, status, speedMs }) {
  /** Displays score, high score, and status badges. Includes aria-live region for screen readers. */
  return (
    <header className="surface hud" aria-label="Game Heads-up Display">
      <div className="hud-left">
        <div className="stat" aria-label={`Score ${score}`}>
          {score}
          <small>Score</small>
        </div>
        <div className="stat" aria-label={`High score ${highScore}`}>
          {highScore}
          <small>High</small>
        </div>
      </div>
      <div className="hud-right">
        <span className="badge" aria-label={`Status ${status}`}>{status}</span>
        <span className="badge" title="Current tick speed">{speedMs}ms</span>
      </div>
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        Score {score}. High score {highScore}. Status {status}.
      </div>
    </header>
  );
}
