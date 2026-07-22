export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export type ApiErrorResponse = {
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
};

export function handleApiError(error: unknown): ApiErrorResponse {
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code || 'INTERNAL_ERROR',
        statusCode: error.statusCode,
      },
    };
  }

  if (error instanceof Error) {
    return {
      error: {
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message,
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    };
  }

  return {
    error: {
      message: 'An unknown error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  };
}

export function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<T> {
  return handler().catch((error) => {
    throw error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'An error occurred',
      500
    );
  });
}
