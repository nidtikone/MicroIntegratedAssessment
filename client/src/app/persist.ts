// Persist the RTK Query cache to localStorage so revisits/reloads render
// instantly from cache (reducing API calls). We persist only fulfilled queries
// and drop transient mutation state to keep the snapshot clean and safe.

const KEY = 'formforge_cache_v1';

/** Action type dispatched on startup to rehydrate the RTK Query cache. */
export const REHYDRATE_TYPE = 'formforge/rehydrate';

type ApiSliceState = {
  queries?: Record<string, { status?: string } | undefined>;
  mutations?: Record<string, unknown>;
  [k: string]: unknown;
};

export function loadPersistedApi(): ApiSliceState | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as ApiSliceState;
  } catch {
    return undefined;
  }
}

export function persistApi(apiState: ApiSliceState): void {
  try {
    const queries: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(apiState.queries ?? {})) {
      if (v && v.status === 'fulfilled') queries[k] = v;
    }
    const clean = { ...apiState, queries, mutations: {} };
    localStorage.setItem(KEY, JSON.stringify(clean));
  } catch {
    /* quota or serialization error — caching is best-effort */
  }
}

/** Returns a throttled version of fn that runs at most once per `wait` ms. */
export function throttle<T extends (...args: never[]) => void>(fn: T, wait: number): T {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: never[]) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}
