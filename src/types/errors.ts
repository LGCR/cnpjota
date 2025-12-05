export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Não autorizado') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Acesso negado') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso não encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class InsufficientCreditsError extends ApiError {
  constructor(message: string = 'Créditos insuficientes') {
    super(402, message);
    this.name = 'InsufficientCreditsError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Limite de requisições excedido') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

export class ExternalApiError extends ApiError {
  constructor(message: string, public source?: string) {
    super(502, message);
    this.name = 'ExternalApiError';
  }
}
