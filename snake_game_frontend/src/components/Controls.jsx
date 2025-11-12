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
    <footer className="surface controls" aria-label="Game Controls">
      <div className="buttons">
        {isIdle && (
          <button className="btn primary" onClick={onStart} aria-label="Start game">
            Start
          </button>
        )}
        {isRunning && (
          <button className="btn" onClick={onPauseResume} aria-label="Pause game">
            Pause
          </button>
        )}
        {isPaused && (
          <button className="btn" onClick={onPauseResume} aria-label="Resume game">
            Resume
          </button>
        )}
        {(isOver || isPaused || isRunning) && (
          <button className="btn warn" onClick={onRestart} aria-label="Restart game">
            Restart
          </button>
        )}
      </div>

      <div className="dpad" aria-label="Directional pad">
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
