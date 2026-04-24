import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// ─── ANSI Color Codes for custom coloring ────────────────────────────────────
const COLORS = {
  reset:   '\x1b[0m',
  bright:  '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  magenta: '\x1b[35m',
  blue:    '\x1b[34m',
  white:   '\x1b[37m',
  gray:    '\x1b[90m',
  bgRed:   '\x1b[41m',
};

// ─── Method color mapping (for HTTP logs) ────────────────────────────────────
const methodColor = (method) => {
  const map = {
    GET:    COLORS.green,
    POST:   COLORS.cyan,
    PUT:    COLORS.yellow,
    PATCH:  COLORS.magenta,
    DELETE: COLORS.red,
  };
  return map[method] || COLORS.white;
};

// ─── Status code color ───────────────────────────────────────────────────────
const statusColor = (status) => {
  if (status >= 500) return COLORS.red + COLORS.bright;
  if (status >= 400) return COLORS.yellow;
  if (status >= 300) return COLORS.cyan;
  if (status >= 200) return COLORS.green;
  return COLORS.white;
};

// ─── Level color mapping ─────────────────────────────────────────────────────
const levelColor = (level) => {
  const map = {
    error:   COLORS.red + COLORS.bright,
    warn:    COLORS.yellow,
    info:    COLORS.cyan,
    http:    COLORS.magenta,
    debug:   COLORS.blue,
    verbose: COLORS.gray,
  };
  return map[level] || COLORS.white;
};

// ─── Level badge ─────────────────────────────────────────────────────────────
const levelBadge = (level) => {
  const map = {
    error:   '✖ ERROR ',
    warn:    '⚠ WARN  ',
    info:    '● INFO  ',
    http:    '◈ HTTP  ',
    debug:   '◎ DEBUG ',
    verbose: '· TRACE ',
  };
  return map[level] || level.toUpperCase().padEnd(7);
};

// ─── Pretty Console Format ───────────────────────────────────────────────────
const prettyConsoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const color   = levelColor(level);
  const badge   = levelBadge(level);
  const ts      = `${COLORS.gray}${timestamp}${COLORS.reset}`;
  const lvl     = `${color}${badge}${COLORS.reset}`;
  const sep     = `${COLORS.gray}│${COLORS.reset}`;

  // HTTP log — parse morgan output and reformat beautifully
  if (level === 'http') {
    const parts = message.split(' ');
    // Format: METHOD URL STATUS SIZE - TIME ms
    if (parts.length >= 3) {
      const method = parts[0] || '';
      const url    = parts[1] || '';
      const status = parseInt(parts[2]) || 0;
      const size   = parts[3] || '-';
      const time   = parts[5] || '?';

      const mc = methodColor(method);
      const sc = statusColor(status);

      return (
        `${ts} ${lvl} ${sep} ` +
        `${mc}${COLORS.bright}${method.padEnd(7)}${COLORS.reset} ` +
        `${COLORS.white}${url}${COLORS.reset} ` +
        `${sc}${status}${COLORS.reset} ` +
        `${COLORS.gray}[${size} bytes — ${time}ms]${COLORS.reset}`
      );
    }
  }

  // Error — show stack trace
  const body = stack
    ? `${COLORS.red}${message}\n${COLORS.dim}${stack}${COLORS.reset}`
    : `${COLORS.white}${message}${COLORS.reset}`;

  // Extra metadata (skip internal fields)
  const ignoredKeys = new Set(['service', 'label']);
  const extraKeys   = Object.keys(meta).filter(k => !ignoredKeys.has(k));
  const extraStr    = extraKeys.length
    ? `\n${COLORS.gray}  ↳ ${JSON.stringify(
        Object.fromEntries(extraKeys.map(k => [k, meta[k]])),
        null, 2
      ).replace(/\n/g, '\n    ')}${COLORS.reset}`
    : '';

  return `${ts} ${lvl} ${sep} ${body}${extraStr}`;
});

// ─── File Format (structured JSON) ───────────────────────────────────────────
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// ─── Create logger ────────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: 'http',   // capture http + all levels above (info, warn, error)
  format: fileFormat,
  defaultMeta: { service: 'GramDairy' },
  transports: [
    // ── Error file ──
    new winston.transports.DailyRotateFile({
      filename:    'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level:       'error',
      maxFiles:    '14d',
    }),
    // ── Combined file ──
    new winston.transports.DailyRotateFile({
      filename:    'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '14d',
    }),
    // ── Terminal (always on) ──
    new winston.transports.Console({
      format: combine(
        timestamp({ format: 'HH:mm:ss' }),
        errors({ stack: true }),
        prettyConsoleFormat
      ),
    }),
  ],
});

// ─── Intercept console.log / console.error / console.warn ────────────────────
// This ensures ALL console.log() calls across the codebase appear in the
// formatted Winston output instead of a raw, unstyled terminal line.
const _origLog   = console.log.bind(console);
const _origError = console.error.bind(console);
const _origWarn  = console.warn.bind(console);

console.log = (...args) => {
  logger.info(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
};
console.error = (...args) => {
  logger.error(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
};
console.warn = (...args) => {
  logger.warn(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
};
console.debug = (...args) => {
  logger.debug(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
};

// Keep a raw logger for internal use (used by the startup banner below)
export const rawLog = _origLog;

export default logger;
