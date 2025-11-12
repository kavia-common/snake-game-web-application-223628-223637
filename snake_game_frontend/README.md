# Snake Game Frontend

This is a lightweight React frontend that implements a classic Snake game with a modern UI, keyboard and on‑screen controls, feature flags, and optional telemetry. It is built with Create React App and uses only vanilla CSS for styling.

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm start
```
This starts the app at http://localhost:3000 by default.

### Run tests
```bash
npm test
```

### Production build
```bash
npm run build
```
Outputs a production build to the build/ directory.

## Game Controls

The game supports both keyboard and on‑screen controls.

- Start: 
  - Press Space when idle, or click the Start button.
- Pause/Resume:
  - Press Space during a game to toggle pause, or click Pause/Resume.
- Restart:
  - When paused or running or after game over, click Restart. When game over, Enter will also restart.
- Direction:
  - Arrow keys: ArrowUp, ArrowDown, ArrowLeft, ArrowRight
  - WASD keys: W/A/S/D
  - On-screen D‑Pad: Up/Left/Right/Down buttons
- Reverse direction is blocked to prevent instant self‑collision (e.g., cannot go from Right to Left in one step).

## Feature Flags

Feature flags are read from the environment at build time via REACT_APP_FEATURE_FLAGS and REACT_APP_EXPERIMENTS_ENABLED. Flags can be provided as:

- JSON string:
  - REACT_APP_FEATURE_FLAGS='{"showGridLines":true,"analytics":false}'
- Comma-separated entries:
  - Names only (treated as true): REACT_APP_FEATURE_FLAGS="showGridLines,autoPauseOnBlur"
  - Key:value pairs: REACT_APP_FEATURE_FLAGS="showGridLines:true,analytics:false,emitTickEvents:true"

Default flag values (from src/utils/featureFlags.js):
- canvasRenderer: true
- analytics: true
- showGridLines: false
- autoPauseOnBlur: true

Experiments:
- REACT_APP_EXPERIMENTS_ENABLED: "true" or "false" (defaults to false)

Examples:
- Enable grid lines:
  - REACT_APP_FEATURE_FLAGS="showGridLines:true"
- Disable analytics but keep local logging:
  - REACT_APP_FEATURE_FLAGS="analytics:false"

## Analytics and Telemetry

Telemetry and logging behavior is handled by src/utils/logger.js and src/utils/telemetry.js with safe, no‑op defaults.

- Local console logging level is controlled by REACT_APP_LOG_LEVEL with levels: error, warn, info, debug. Default: info.
- Network telemetry is sent only if:
  - A backend base URL is configured via REACT_APP_API_BASE or REACT_APP_BACKEND_URL, and
  - Telemetry is not disabled via REACT_APP_NEXT_TELEMETRY_DISABLED.
- When enabled, events are POSTed to: <REACT_APP_API_BASE>/events (the trailing slash is handled)
- Telemetry disable flag:
  - REACT_APP_NEXT_TELEMETRY_DISABLED defaults to "true". Set to "false" to allow network telemetry.

Event samples emitted by the game (names only; payloads vary):
- game_start, game_toggle_pause, game_restart
- input_direction, input_direction_blocked, input_key
- food_eaten, level_up, game_over
- game_tick (emitted only if flags.analytics is true and flags.emitTickEvents is true)

Important:
- If no backend URL is configured or telemetry is disabled, gameplay continues with local logging only.
- Network errors when posting telemetry are swallowed to avoid impacting gameplay.

## Accessibility Notes

The UI aims to be usable with screen readers and keyboards:
- GameHUD exposes live updates of score, high score, and status via an aria-live region.
- GameBoard uses role="img" with an aria-label that reflects paused/over state.
- Controls are grouped with appropriate role and aria-labels; all buttons are focusable and operable via keyboard.
- Visual focus styles are present via focus-visible tokens; color contrast is designed for both light and dark themes.
- Optional auto-pause on tab hidden is enabled by default (autoPauseOnBlur flag) to reduce surprise motion.

## Environment Variables

The following environment variables are supported at build time. Create React App requires that runtime-consumed variables are prefixed with REACT_APP_.

- REACT_APP_API_BASE
  - Description: Base URL for backend telemetry endpoint. If present (and telemetry not disabled), events are POSTed to `${REACT_APP_API_BASE}/events`.
  - Default: unset
  - Example: https://api.example.com

- REACT_APP_BACKEND_URL
  - Description: Alternative to REACT_APP_API_BASE for backend event posting. Used if REACT_APP_API_BASE is not set.
  - Default: unset

- REACT_APP_FRONTEND_URL
  - Description: Not consumed by the current code; reserved for future use in links or CORS-aware deployments.
  - Default: unset

- REACT_APP_WS_URL
  - Description: Not consumed by the current code; reserved for future WebSocket gameplay or live events.
  - Default: unset

- REACT_APP_NODE_ENV
  - Description: Not directly consumed in code; may be used by tooling or future logic.
  - Default: unset

- REACT_APP_NEXT_TELEMETRY_DISABLED
  - Description: Controls whether network telemetry is disabled. When "true", network posts are suppressed. Console logging still follows REACT_APP_LOG_LEVEL.
  - Default: "true"
  - Valid values: "true" | "false"

- REACT_APP_ENABLE_SOURCE_MAPS
  - Description: Not consumed by the app code; Create React App may use an equivalent setting via build scripts. Keep for CI/CD parity if needed.
  - Default: unset

- REACT_APP_PORT
  - Description: Not consumed by app code; the dev server port is typically controlled by PORT. Kept here for environment parity.
  - Default: unset

- REACT_APP_TRUST_PROXY
  - Description: Not used in this frontend; reserved for reverse proxy configurations in other environments.
  - Default: unset

- REACT_APP_LOG_LEVEL
  - Description: Controls console verbosity. One of: error, warn, info, debug.
  - Default: "info"

- REACT_APP_HEALTHCHECK_PATH
  - Description: Not consumed by the app; reserved for future health endpoints.
  - Default: unset

- REACT_APP_FEATURE_FLAGS
  - Description: Feature flags string or JSON. See Feature Flags section for syntax and defaults.
  - Default: empty (uses defaults listed above)

- REACT_APP_EXPERIMENTS_ENABLED
  - Description: Enables experimental features. Parsed strictly as "true" or "false".
  - Default: "false"

Note on Create React App:
- These variables are read at build time. Update the variables and rebuild to change behavior.

## Theming

- Light/Dark theme toggle is available in the UI. It applies data-theme="light|dark" on the documentElement to switch token values (see src/theme.css).
- The board and UI use CSS variables for consistent colors, spacing, and shadows.

## Project Structure Overview

- src/components/GameBoard.jsx: Canvas renderer for the board, snake, food, grid lines.
- src/components/GameHUD.jsx: Heads-up display with score and status badges and screen-reader announcements.
- src/components/Controls.jsx: Primary action buttons and on‑screen D‑Pad for directional input.
- src/hooks/useSnakeGame.js: Core game loop, input handling, collisions, scoring, speed increments.
- src/utils/featureFlags.js: Flag parsing and defaults; experiments flag handling.
- src/utils/logger.js: Structured logging with optional network mirroring.
- src/utils/telemetry.js: Safe telemetry emitter and React hook, respecting environment and flags.
- src/constants/gameConfig.js: Grid size and color constants.

## Troubleshooting

- No telemetry observed:
  - Ensure REACT_APP_NEXT_TELEMETRY_DISABLED is set to "false"
  - Ensure REACT_APP_API_BASE or REACT_APP_BACKEND_URL is set (e.g., https://api.example.com)
  - The backend must expose POST /events to receive telemetry
- Grid lines not visible:
  - Set REACT_APP_FEATURE_FLAGS="showGridLines:true" and rebuild
- Reverse direction not working:
  - This is intended; the game prevents instantaneous reversal to avoid self collisions

## License

This project template and game logic are intended for demonstration purposes and can be adapted for your use case.
