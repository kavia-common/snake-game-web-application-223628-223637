import React, { useEffect, useRef } from "react";
import { GRID_WIDTH, GRID_HEIGHT, COLORS } from "../constants/gameConfig";
import { useFeatureFlags } from "../utils/featureFlags";

// PUBLIC_INTERFACE
export default function GameBoard({
  gridWidth = GRID_WIDTH,
  gridHeight = GRID_HEIGHT,
  snake,
  food,
  status,
  showGrid = false,
  onCanvasReady
}) {
  /**
   * Canvas-based renderer. Uses Ocean Professional tokens via CSS for container;
   * this component focuses only on draw logic and responsiveness.
   */
  const canvasRef = useRef(null);
  const { flags } = useFeatureFlags();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (typeof onCanvasReady === "function") onCanvasReady(canvasRef.current);
  }, [onCanvasReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Handle hi-dpi
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    ctx.scale(scale, scale);

    // Compute cell size
    const cellSize = Math.floor(Math.min(width / gridWidth, height / gridHeight));
    const boardW = cellSize * gridWidth;
    const boardH = cellSize * gridHeight;
    const offsetX = Math.floor((width - boardW) / 2);
    const offsetY = Math.floor((height - boardH) / 2);

    // Background
    ctx.fillStyle = COLORS.boardBg;
    ctx.fillRect(0, 0, width, height);

    // Board area
    ctx.fillStyle = COLORS.boardInnerBg;
    ctx.fillRect(offsetX, offsetY, boardW, boardH);

    // Grid lines (optional)
    const showGridLines = flags.showGridLines || showGrid;
    if (showGridLines) {
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      for (let x = 0; x <= gridWidth; x++) {
        const px = offsetX + x * cellSize + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, offsetY + 0.5);
        ctx.lineTo(px, offsetY + boardH + 0.5);
        ctx.stroke();
      }
      for (let y = 0; y <= gridHeight; y++) {
        const py = offsetY + y * cellSize + 0.5;
        ctx.beginPath();
        ctx.moveTo(offsetX + 0.5, py);
        ctx.lineTo(offsetX + boardW + 0.5, py);
        ctx.stroke();
      }
    }

    // Draw food
    if (food) {
      ctx.fillStyle = COLORS.food;
      const fx = offsetX + food.x * cellSize;
      const fy = offsetY + food.y * cellSize;
      const pad = Math.max(1, Math.floor(cellSize * 0.15));
      ctx.fillRect(fx + pad, fy + pad, cellSize - pad * 2, cellSize - pad * 2);
    }

    // Draw snake segments
    if (snake && snake.length) {
      snake.forEach((seg, idx) => {
        const sx = offsetX + seg.x * cellSize;
        const sy = offsetY + seg.y * cellSize;
        const pad = Math.max(1, Math.floor(cellSize * (idx === 0 ? 0.08 : 0.18)));
        ctx.fillStyle = idx === 0 ? COLORS.snakeHead : COLORS.snakeBody;
        ctx.fillRect(sx + pad, sy + pad, cellSize - pad * 2, cellSize - pad * 2);
      });
    }

    // Status overlay (Paused / Game Over)
    if (status === "paused" || status === "over") {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(offsetX, offsetY, boardW, boardH);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        status === "paused" ? "Paused" : "Game Over - Press Enter to Restart",
        offsetX + boardW / 2,
        offsetY + boardH / 2
      );
    }
  }, [snake, food, gridWidth, gridHeight, status, showGrid, flags]);

  return (
    <div className="board-inner" role="img" aria-label="Snake game board">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {/* Accessible live region handled in HUD */}
    </div>
  );
}
