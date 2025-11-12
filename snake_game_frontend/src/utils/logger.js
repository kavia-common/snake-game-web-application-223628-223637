const LEVELS = ["error", "warn", "info", "debug"];
const envLevel = (process.env.REACT_APP_LOG_LEVEL || "info").toLowerCase();
const threshold = Math.max(0, LEVELS.indexOf(envLevel));

const telemetryDisabled = String(process.env.REACT_APP_NEXT_TELEMETRY_DISABLED || "true") === "true";
const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
const hasBackend = !!apiBase;

// Safe network stub
async function sendEvent(payload) {
  if (!hasBackend || telemetryDisabled) return;
  try {
    await fetch(`${apiBase.replace(/\/$/, "")}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // swallow to avoid breaking gameplay
  }
}

function fmt(level, msg, data) {
  return [`[${new Date().toISOString()}]`, level.toUpperCase(), msg, data ? data : ""];
}

// PUBLIC_INTERFACE
export const logger = {
  /** Structured console logger honoring REACT_APP_LOG_LEVEL, with optional network event stub. */
  error(event, data) {
    if (threshold >= 0) {
      // eslint-disable-next-line no-console
      console.error(...fmt("error", event, data));
      sendEvent({ level: "error", event, data, ts: Date.now() });
    }
  },
  // PUBLIC_INTERFACE
  warn(event, data) {
    if (threshold >= 1) {
      // eslint-disable-next-line no-console
      console.warn(...fmt("warn", event, data));
      sendEvent({ level: "warn", event, data, ts: Date.now() });
    }
  },
  // PUBLIC_INTERFACE
  info(event, data) {
    if (threshold >= 2) {
      // eslint-disable-next-line no-console
      console.info(...fmt("info", event, data));
      sendEvent({ level: "info", event, data, ts: Date.now() });
    }
  },
  // PUBLIC_INTERFACE
  debug(event, data) {
    if (threshold >= 3) {
      // eslint-disable-next-line no-console
      console.debug(...fmt("debug", event, data));
      sendEvent({ level: "debug", event, data, ts: Date.now() });
    }
  },
  // PUBLIC_INTERFACE
  event(name, data) {
    this.info(name, data);
  }
};
