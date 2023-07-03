export type KnownErrorName =
  | 'NotFoundError'
  | 'UnauthorizedError'
  | 'ForbiddenError'
  | 'BadRequestError'
  | 'UnprocessableEntityError';

export abstract class KnownError extends Error {
  name: KnownErrorName;

  protected constructor(message: string, name: KnownErrorName) {
    super(message);
    this.name = name;
  }
}

export class NotFoundError extends KnownError {
  constructor(message: string) {
    super(message, 'NotFoundError');
  }
}

export class UnauthorizedError extends KnownError {
  constructor(message: string) {
    super(message, 'UnauthorizedError');
  }
}

export class ForbiddenError extends KnownError {
  constructor(message: string) {
    super(message, 'ForbiddenError');
  }
}

export class BadRequestError extends KnownError {
  constructor(message: string) {
    super(message, 'BadRequestError');
  }
}

export class UnprocessableEntityError extends KnownError {
  constructor(message: string) {
    super(message, 'UnprocessableEntityError');
  }
}

export type HandledError = {
  code: number;
  body: {
    metadata: {
      error: {
        code: string;
        message: string;
      };
    };
  };
};
