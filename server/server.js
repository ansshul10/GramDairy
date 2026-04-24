// ─── Logger MUST be imported first so console.log() is intercepted everywhere ─
import logger from './utils/logger.js';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { errorMiddleware, morganMiddleware } from './middlewares/index.js';
import apiRoutes from './routes/index.js';
import initCronJobs from './utils/cronJobs.js';


// ─── Load env vars ────────────────────────────────────────────────────────────
dotenv.config();

// ─── Global Process Crash Handlers ───────────────────────────────────────────
// These catch any error that escapes try/catch blocks and would crash the server
process.on('uncaughtException', (err) => {
  logger.error(`[UNCAUGHT EXCEPTION] ${err.message}`, {
    name:  err.name,
    stack: err.stack,
  });
  logger.warn('Server is shutting down due to an uncaught exception...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('[UNHANDLED REJECTION] A Promise rejected without a .catch()', {
    reason: reason instanceof Error ? reason.stack : String(reason),
    promise: String(promise),
  });
  // Do NOT exit — keep server running but log the failure
});

// ─── DB Connection ─────────────────────────────────────────────────────────────
connectDB();

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// ─── Trust Proxy (required for deployment behind reverse proxy: Render, Railway, etc.) ──
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());         // Security headers
app.use(compression());    // Gzip compression for all responses
app.use(mongoSanitize());  // Prevent NoSQL injection
app.use(hpp());            // Prevent HTTP Parameter Pollution
app.use(morganMiddleware); // HTTP request logger (every route, always)
app.use(cookieParser());   // Parse cookies

const origins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Global Rate Limiter (100 req/15min per IP for general API) ──────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin:      origins,
    methods:     ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);
initCronJobs(io);

io.on('connection', (socket) => {
  logger.info(`[SOCKET] Client connected   → ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`[SOCKET] User ${userId} joined private room`);
  });



  socket.on('disconnect', (reason) => {
    logger.info(`[SOCKET] Client disconnected ← ${socket.id} (reason: ${reason})`);
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GramDairy API is running' });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const ENV  = process.env.NODE_ENV || 'development';

httpServer.listen(PORT, () => {
  // ── Startup banner ──────────────────────────────────────────────────────────
  const line  = '─'.repeat(52);
  const c = {
    reset:   '\x1b[0m',
    bright:  '\x1b[1m',
    cyan:    '\x1b[36m',
    green:   '\x1b[32m',
    yellow:  '\x1b[33m',
    magenta: '\x1b[35m',
    gray:    '\x1b[90m',
  };

  process.stdout.write(
    `\n${c.cyan}${c.bright}╔${line}╗${c.reset}\n` +
    `${c.cyan}${c.bright}║${c.reset}${c.bright}         🥛  GramDairy API Server — ONLINE           ${c.reset}${c.cyan}${c.bright}║${c.reset}\n` +
    `${c.cyan}${c.bright}╚${line}╝${c.reset}\n` +
    `${c.gray}  ┌─ Port    : ${c.reset}${c.green}${c.bright}${PORT}${c.reset}\n` +
    `${c.gray}  ├─ Mode    : ${c.reset}${c.yellow}${ENV}${c.reset}\n` +
    `${c.gray}  ├─ URL     : ${c.reset}${c.cyan}http://localhost:${PORT}${c.reset}\n` +
    `${c.gray}  ├─ API     : ${c.reset}${c.cyan}http://localhost:${PORT}/api/v1${c.reset}\n` +
    `${c.gray}  └─ Origins : ${c.reset}${c.magenta}${origins.join(', ')}${c.reset}\n` +
    `\n`
  );

  logger.info(`[PROCESS] Server started on port ${PORT} in ${ENV} mode`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.warn('[PROCESS] SIGTERM received — shutting down gracefully...');
  httpServer.close(() => {
    logger.info('[PROCESS] Server closed. Goodbye!');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warn('[PROCESS] SIGINT received (Ctrl+C) — shutting down gracefully...');
  httpServer.close(() => {
    logger.info('[PROCESS] Server closed. Goodbye!');
    process.exit(0);
  });
});
