import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GRID_WIDTH, GRID_HEIGHT, INITIAL_SPEED_MS, SPEED_STEP } from "../constants/gameConfig";
import { logger } from "../utils/logger";

const KEY_TO_DIR = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", W: "up", s: "down", S: "down", a: "left", A: "left", d: "right", D: "right"
};

const DIR_TO_VEC = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

function randomFood(snake, gridW, gridH) {
  while (true) {
    const fx = Math.floor(Math.random() * gridW);
    const fy = Math.floor(Math.random() * gridH);
    const onSnake = snake.some(seg => seg.x === fx && seg.y === fy);
    if (!onSnake) return { x: fx, y: fy };
  }
}

function isOpposite(a, b) {
  return (a === "up" && b === "down") ||
         (a === "down" && b === "up") ||
         (a === "left" && b === "right") ||
         (a === "right" && b === "left");
}

// PUBLIC_INTERFACE
export function useSnakeGame({
  gridWidth = GRID_WIDTH,
  gridHeight = GRID_HEIGHT,
} = {}) {
  /**
   * PUBLIC_INTERFACE
   * Core snake game state and controls. Provides rAF loop, input handlers,
   * pause/resume, restart, and exposes draw state to the board.
   */
  const [snake, setSnake] = useState([{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }]);
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState("right");
  const [food, setFood] = useState(() => randomFood([{ x: 5, y: 5 }], gridWidth, gridHeight));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const v = localStorage.getItem("highScore");
    return v ? parseInt(v, 10) : 0;
  });
  const [status, setStatus] = useState("idle"); // idle | running | paused | over
  const [speedMs, setSpeedMs] = useState(INITIAL_SPEED_MS);

  const lastTickRef = useRef(0);
  const rafRef = useRef(0);

  const resetGame = useCallback(() => {
    setSnake([{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }]);
    setDirection("right");
    setNextDirection("right");
    setFood(randomFood([{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }], gridWidth, gridHeight));
    setScore(0);
    setSpeedMs(INITIAL_SPEED_MS);
  }, [gridHeight, gridWidth]);

  const start = useCallback(() => {
    if (status === "running") return;
    resetGame();
    setStatus("running");
    logger.info("game_start", { speedMs: INITIAL_SPEED_MS });
  }, [resetGame, status]);

  const pauseResume = useCallback(() => {
    setStatus(prev => {
      const next = prev === "running" ? "paused" : (prev === "paused" ? "running" : prev);
      logger.info("game_toggle_pause", { from: prev, to: next });
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    resetGame();
    setStatus("running");
    logger.info("game_restart");
  }, [resetGame]);

  const setDirectionSafe = useCallback((dir) => {
    setNextDirection((curr) => {
      if (isOpposite(dir, direction)) return curr; // prevent reversing directly
      return dir;
    });
  }, [direction]);

  const onKeyDown = useCallback((e) => {
    const key = e.key;
    if (KEY_TO_DIR[key]) {
      e.preventDefault();
      setDirectionSafe(KEY_TO_DIR[key]);
    } else if (key === " " || key === "Spacebar") {
      e.preventDefault();
      if (status === "idle") {
        start();
      } else {
        pauseResume();
      }
    } else if (key === "Enter" && status === "over") {
      e.preventDefault();
      restart();
    }
  }, [pauseResume, restart, setDirectionSafe, start, status]);

  // Movement tick
  const tick = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const dir = nextDirection;
      const vec = DIR_TO_VEC[dir];
      const newHead = { x: head.x + vec.x, y: head.y + vec.y };

      // Update direction immediately after movement
      setDirection(dir);

      // Wall collision
      if (newHead.x < 0 || newHead.x >= gridWidth || newHead.y < 0 || newHead.y >= gridHeight) {
        logger.warn("collision_wall", { head: newHead });
        setStatus("over");
        if (score > highScore) {
          localStorage.setItem("highScore", String(score));
          setHighScore(score);
        }
        return prev;
      }

      // Self collision
      if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        logger.warn("collision_self", { head: newHead });
        setStatus("over");
        if (score > highScore) {
          localStorage.setItem("highScore", String(score));
          setHighScore(score);
        }
        return prev;
      }

      let grow = false;
      setFood(currFood => {
        if (currFood && currFood.x === newHead.x && currFood.y === newHead.y) {
          grow = true;
          const newScore = score + 1;
          setScore(newScore);
          // Increase speed slightly every 3 foods
          if (newScore % 3 === 0) {
            setSpeedMs(s => Math.max(50, s - SPEED_STEP));
            logger.info("level_up", { newScore, speedMs: Math.max(50, speedMs - SPEED_STEP) });
          }
          return randomFood([newHead, ...prev], gridWidth, gridHeight);
        }
        return currFood;
      });

      const newSnake = [newHead, ...prev];
      if (!grow) newSnake.pop();
      return newSnake;
    });
  }, [gridHeight, gridWidth, highScore, nextDirection, score, speedMs]);

  // rAF game loop
  const loop = useCallback((ts) => {
    if (status !== "running") return;
    if (!lastTickRef.current) lastTickRef.current = ts;
    const delta = ts - lastTickRef.current;
    if (delta >= speedMs) {
      lastTickRef.current = ts;
      tick();
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [speedMs, status, tick]);

  useEffect(() => {
    if (status === "running") {
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
    return undefined;
  }, [loop, status]);

  // Keyboard events
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const api = useMemo(() => ({
    start,
    pauseResume,
    restart,
    setDirection: setDirectionSafe
  }), [pauseResume, restart, setDirectionSafe, start]);

  return {
    snake,
    food,
    score,
    highScore,
    status,
    speedMs,
    ...api
  };
}
