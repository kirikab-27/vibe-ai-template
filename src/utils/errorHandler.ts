export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const errorHandler = {
  handle: (error: unknown): AppError => {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(
        error.message,
        'UNKNOWN_ERROR',
        500,
        { originalError: error.stack }
      );
    }
    
    return new AppError(
      'An unknown error occurred',
      'UNKNOWN_ERROR',
      500,
      { error }
    );
  },
  
  log: (error: AppError, context?: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${context || 'ERROR'} [${error.code}]: ${error.message}`;
    
    if (import.meta.env.DEV) {
      console.error(logMessage, error.details);
    } else {
      console.error(logMessage);
    }
  },
  
  isNetworkError: (error: unknown): boolean => {
    return error instanceof Error && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('ERR_NETWORK'));
  },
  
  isAuthError: (error: unknown): boolean => {
    return error instanceof AppError && 
           (error.statusCode === 401 || error.statusCode === 403);
  }
};