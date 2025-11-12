function parseFlags(raw) {
  if (!raw) return {};
  try {
    if (raw.trim().startsWith("{")) {
      return JSON.parse(raw);
    }
    // comma-separated a:b pairs or list of names to true
    const obj = {};
    raw.split(",").map(s => s.trim()).filter(Boolean).forEach(entry => {
      if (entry.includes(":")) {
        const [k, v] = entry.split(":").map(s => s.trim());
        obj[k] = v === "true" ? true : (v === "false" ? false : v);
      } else {
        obj[entry] = true;
      }
    });
    return obj;
  } catch {
    return {};
  }
}

// PUBLIC_INTERFACE
export function useFeatureFlags() {
  /** Returns evaluated feature flags and experiments flag from env. */
  const raw = process.env.REACT_APP_FEATURE_FLAGS || "";
  const experimentsEnabled = String(process.env.REACT_APP_EXPERIMENTS_ENABLED || "false") === "true";
  const flags = {
    canvasRenderer: true,
    analytics: true,
    showGridLines: false,
    ...parseFlags(raw)
  };
  return { flags, experimentsEnabled };
}
