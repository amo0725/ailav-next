/**
 * Centralised server-side logger.
 *
 * Wraps `console.*` so call sites express intent (`securityWarn`, `info`, …)
 * instead of leaking raw `console.error` everywhere. Lets us swap in Pino,
 * Sentry, or Vercel Log Drains later without touching every call site.
 *
 * Server-only — `console` writes go to stderr/stdout in the Node runtime
 * (Vercel captures these into the function logs).
 */

type LogData = Record<string, unknown> | undefined;

function emit(level: 'info' | 'warn' | 'error', tag: string, message: string, data?: LogData) {
  const prefix = `[${tag}]`;
   
  const fn = level === 'info' ? console.info : level === 'warn' ? console.warn : console.error;
  if (data) {
    fn(prefix, message, data);
  } else {
    fn(prefix, message);
  }
}

export function info(tag: string, message: string, data?: LogData) {
  emit('info', tag, message, data);
}

export function warn(tag: string, message: string, data?: LogData) {
  emit('warn', tag, message, data);
}

/** Use for genuine errors — exceptional conditions that warrant operator attention. */
export function error(tag: string, message: string, data?: LogData) {
  emit('error', tag, message, data);
}

/** Use for security-relevant events (auth failures, suspicious input, etc.). */
export function securityWarn(message: string, data?: LogData) {
  emit('warn', 'security', message, data);
}
