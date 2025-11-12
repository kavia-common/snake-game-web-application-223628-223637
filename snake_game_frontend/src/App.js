import React, { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";
import GameBoard from "./components/GameBoard";
import GameHUD from "./components/GameHUD";
import Controls from "./components/Controls";
import { useSnakeGame } from "./hooks/useSnakeGame";

// PUBLIC_INTERFACE
function App() {
  /** Root application: composes HUD, GameBoard, Controls, and theme toggle. */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const {
    snake,
    food,
    score,
    highScore,
    status,
    speedMs,
    start,
    pauseResume,
    restart,
    setDirection
  } = useSnakeGame();

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <div className="game-shell">
        <GameHUD score={score} highScore={highScore} status={status} speedMs={speedMs} />

        <div className="surface board-wrap">
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 2px 10px" }}>
            <button
              className="theme-toggle u-btn u-btn--ghost"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
          <GameBoard snake={snake} food={food} status={status} />
        </div>

        <Controls
          status={status}
          onStart={start}
          onPauseResume={pauseResume}
          onRestart={restart}
          onDirection={setDirection}
        />
      </div>
    </div>
  );
}

export default App;
