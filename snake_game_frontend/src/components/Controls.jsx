import React from "react";

// PUBLIC_INTERFACE
export default function Controls({
  status,
  onStart,
  onPauseResume,
  onRestart,
  onDirection
}) {
  /** Renders buttons and a D-pad for mobile control */
  const isRunning = status === "running";
  const isIdle = status === "idle";
  const isOver = status === "over";
  const isPaused = status === "paused";

  return (
    <footer className="surface controls" role="region" aria-label="Game Controls">
      <div className="buttons" role="group" aria-label="Primary actions">
        {isIdle && (
          <button className="btn u-btn u-btn--primary" onClick={onStart} aria-label="Start game">
            Start
          </button>
        )}
        {isRunning && (
          <button className="btn u-btn" onClick={onPauseResume} aria-label="Pause game">
            Pause
          </button>
        )}
        {isPaused && (
          <button className="btn u-btn" onClick={onPauseResume} aria-label="Resume game">
            Resume
          </button>
        )}
        {(isOver || isPaused || isRunning) && (
          <button className="btn u-btn u-btn--warn" onClick={onRestart} aria-label="Restart game">
            Restart
          </button>
        )}
      </div>

      <div className="dpad" role="group" aria-label="Directional pad">
        <button
          className="pad-btn"
          style={{ gridArea: "up" }}
          onClick={() => onDirection("up")}
          aria-label="Up"
        >
          ↑
        </button>
        <button
          className="pad-btn"
          style={{ gridArea: "left" }}
          onClick={() => onDirection("left")}
          aria-label="Left"
        >
          ←
        </button>
        <button
          className="pad-btn"
          style={{ gridArea: "right" }}
          onClick={() => onDirection("right")}
          aria-label="Right"
        >
          →
        </button>
        <button
          className="pad-btn"
          style={{ gridArea: "down" }}
          onClick={() => onDirection("down")}
          aria-label="Down"
        >
          ↓
        </button>
      </div>
    </footer>
  );
}
