import { logger } from "./logger";
import { useFeatureFlags } from "./featureFlags";

/**
 * Telemetry event sender factory and React hook helpers.
 * Respects:
 * - REACT_APP_NEXT_TELEMETRY_DISABLED (defaults true)
 * - REACT_APP_API_BASE / REACT_APP_BACKEND_URL presence
 * - REACT_APP_LOG_LEVEL for console verbosity (delegated to logger)
 */

// PUBLIC_INTERFACE
export function createTelemetrySender() {
  /** Create a safe, no-op friendly telemetry sender. */
  const telemetryDisabled = String(process.env.REACT_APP_NEXT_TELEMETRY_DISABLED || "true") === "true";
  const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  const hasBackend = !!apiBase && !telemetryDisabled;

  async function post(name, data) {
    // Always log locally (honors REACT_APP_LOG_LEVEL)
    logger.event(name, data);

    if (!hasBackend) return;
    try {
      await fetch(`${String(apiBase).replace(/\/$/, "")}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: name, data, ts: Date.now() }),
        keepalive: true
      });
    } catch {
      // swallow errors
    }
  }

  return {
    // PUBLIC_INTERFACE
    emit: post
  };
}

// PUBLIC_INTERFACE
export function useTelemetry() {
  /**
   * Hook that returns a feature-aware telemetry emitter and flags snapshot.
   * Events are only sent to backend if URL is configured and telemetry isn't disabled.
   * Console logs always follow logger level.
   */
  const { flags, experimentsEnabled } = useFeatureFlags();
  const sender = createTelemetrySender();

  return {
    emit: sender.emit,
    flags,
    experimentsEnabled
  };
}
