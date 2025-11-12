import React from "react";

// PUBLIC_INTERFACE
export default function GameHUD({ score, highScore, status, speedMs }) {
  /** Displays score, high score, and status badges. Includes aria-live region for screen readers. */
  return (
    <header
      className="surface hud"
      role="region"
      aria-label="Game Heads-up Display"
      tabIndex={-1}
    >
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
        <span className="badge u-badge" aria-label={`Status ${status}`} aria-live="polite">
          {status}
        </span>
        <span className="badge u-badge" title="Current tick speed" aria-label={`Speed ${speedMs} milliseconds`}>
          {speedMs}ms
        </span>
      </div>
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        Score {score}. High score {highScore}. Status {status}.
      </div>
    </header>
  );
}
