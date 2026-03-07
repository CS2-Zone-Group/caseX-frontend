interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

interface LogEntry {
  timestamp: string;
  level: LogLevel[keyof LogLevel];
  message: string;
  context?: string;
  metadata?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private sessionId: string;
  private userId?: string;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;
  private readonly flushInterval = 30000; // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startPeriodicFlush();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createLogEntry(level: LogLevel[keyof LogLevel], message: string, context?: string, metadata?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
      userId: this.userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    };
  }

  error(message: string, context?: string, metadata?: any) {
    const logEntry = this.createLogEntry(LOG_LEVELS.ERROR, message, context, metadata);
    this.addToBuffer(logEntry);
    console.error(`[${logEntry.timestamp}] ERROR [${context || 'App'}]:`, message, metadata);
  }

  warn(message: string, context?: string, metadata?: any) {
    const logEntry = this.createLogEntry(LOG_LEVELS.WARN, message, context, metadata);
    this.addToBuffer(logEntry);
    console.warn(`[${logEntry.timestamp}] WARN [${context || 'App'}]:`, message, metadata);
  }

  info(message: string, context?: string, metadata?: any) {
    const logEntry = this.createLogEntry(LOG_LEVELS.INFO, message, context, metadata);
    this.addToBuffer(logEntry);
    console.info(`[${logEntry.timestamp}] INFO [${context || 'App'}]:`, message, metadata);
  }

  debug(message: string, context?: string, metadata?: any) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.createLogEntry(LOG_LEVELS.DEBUG, message, context, metadata);
      this.addToBuffer(logEntry);
      console.debug(`[${logEntry.timestamp}] DEBUG [${context || 'App'}]:`, message, metadata);
    }
  }

  // Specific logging methods
  logUserAction(action: string, metadata?: any) {
    this.info(`User action: ${action}`, 'UserAction', metadata);
  }

  logApiCall(method: string, url: string, statusCode?: number, responseTime?: number, error?: any) {
    const level = error ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    const message = `API ${method} ${url}`;
    const logMetadata = {
      method,
      url,
      statusCode,
      responseTime,
      error: error?.message
    };

    if (error) {
      this.error(message, 'ApiCall', logMetadata);
    } else {
      this.info(message, 'ApiCall', logMetadata);
    }
  }

  logPageView(page: string, metadata?: any) {
    this.info(`Page view: ${page}`, 'PageView', metadata);
  }

  logPerformance(metric: string, value: number, metadata?: any) {
    this.info(`Performance: ${metric} = ${value}ms`, 'Performance', { metric, value, ...metadata });
  }

  private addToBuffer(logEntry: LogEntry) {
    this.logBuffer.push(logEntry);
    
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend })
      });
    } catch (error) {
      console.error('Failed to send logs to server:', error);
      // Store failed logs in localStorage as backup
      this.storeLogsLocally(logsToSend);
    }
  }

  private storeLogsLocally(logs: LogEntry[]) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('failedLogs') || '[]');
      const allLogs = [...existingLogs, ...logs].slice(-200); // Keep only last 200 logs
      localStorage.setItem('failedLogs', JSON.stringify(allLogs));
    } catch (error) {
      console.error('Failed to store logs locally:', error);
    }
  }

  private startPeriodicFlush() {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.flush();
      }, this.flushInterval);

      // Flush on page unload
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  private setupGlobalErrorHandlers() {
    if (typeof window !== 'undefined') {
      // Handle uncaught JavaScript errors
      window.addEventListener('error', (event) => {
        this.error('Uncaught error', 'GlobalErrorHandler', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection', 'GlobalErrorHandler', {
          reason: event.reason,
          stack: event.reason?.stack
        });
      });

      // Handle resource loading errors
      window.addEventListener('error', (event) => {
        if (event.target !== window) {
          this.error('Resource loading error', 'ResourceLoader', {
            tagName: (event.target as any)?.tagName,
            source: (event.target as any)?.src || (event.target as any)?.href
          });
        }
      }, true);
    }
  }

  // Manual flush method
  async forceFlush() {
    await this.flush();
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for use in components
export default logger;