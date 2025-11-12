function parseFlags(raw) {
  if (!raw || typeof raw !== "string") return {};
  try {
    const trimmed = raw.trim();
    if (!trimmed) return {};
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      return parsed && typeof parsed === "object" ? parsed : {};
    }
    // comma-separated a:b pairs or list of names to true
    const obj = {};
    trimmed
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(entry => {
        if (entry.includes(":")) {
          const [k, v] = entry.split(":").map(s => s.trim());
          const lower = String(v).toLowerCase();
          if (lower === "true" || lower === "false") {
            obj[k] = lower === "true";
          } else if (!Number.isNaN(Number(v))) {
            obj[k] = Number(v);
          } else {
            obj[k] = v;
          }
        } else {
          obj[entry] = true;
        }
      });
    return obj;
  } catch {
    return {};
  }
}

/**
 * Evaluate experiments boolean from env safely.
 */
function getExperimentsEnabled() {
  const raw = String(process.env.REACT_APP_EXPERIMENTS_ENABLED ?? "").trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return false; // sensible default disabled
}

/**
 * PUBLIC_INTERFACE
 */
// PUBLIC_INTERFACE
export function useFeatureFlags() {
  /** Returns evaluated feature flags and experiments flag from env. */
  const raw = process.env.REACT_APP_FEATURE_FLAGS || "";
  const experimentsEnabled = getExperimentsEnabled();

  // default flags (safe, conservative)
  const defaults = {
    canvasRenderer: true,
    analytics: true,
    showGridLines: false
  };

  const parsed = parseFlags(raw);
  const flags = { ...defaults, ...parsed };

  return { flags, experimentsEnabled };
}
