/**
 * Small logging shim so components never call console.* directly.
 *
 * In development it prints to the console for debugging; in a production build it
 * stays silent, which keeps internal error shapes out of a visitor's console.
 * Swap the production branch for Sentry (or any collector) by reporting `error`
 * inside `reportError` — every call site already routes through here.
 */
const isDev: boolean = import.meta.env.DEV;

export function logError(context: string, error: unknown): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error(`[${context}]`, error);
  }
  // Production: forward to an error collector here, e.g.
  // Sentry.captureException(error, { tags: { context } });
}

export function logInfo(context: string, message: string): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info(`[${context}]`, message);
  }
}
