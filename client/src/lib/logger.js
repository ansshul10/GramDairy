const isDev = import.meta.env.MODE === 'development';

const logger = {
  info: (message, ...args) => {
    if (isDev) {
      console.log(`%c[INFO] %c${message}`, 'color: #007bff; font-weight: bold;', 'color: inherit;', ...args);
    }
  },
  
  success: (message, ...args) => {
    if (isDev) {
      console.log(`%c[SUCCESS] %c${message}`, 'color: #28a745; font-weight: bold;', 'color: inherit;', ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (isDev) {
      console.warn(`%c[WARN] %c${message}`, 'color: #ffc107; font-weight: bold;', 'color: inherit;', ...args);
    }
  },
  
  error: (message, ...args) => {
    console.error(`%c[ERROR] %c${message}`, 'color: #dc3545; font-weight: bold;', 'color: inherit;', ...args);
    
    // In production, you might want to send this to a service like Sentry
    if (!isDev) {
      // sendToLoggingService(message, args);
    }
  },
  
  debug: (message, ...args) => {
    if (isDev) {
      console.debug(`%c[DEBUG] %c${message}`, 'color: #6c757d; font-weight: bold;', 'color: inherit;', ...args);
    }
  }
};

export default logger;
