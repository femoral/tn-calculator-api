import {
  BadRequestError,
  ForbiddenError,
  KnownError,
  KnownErrorName,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '../../src/common/error/errors';

export type Scenario = {
  error: KnownError;
  expected: {
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
};

export type KnownErrorScenario = {
  [key in KnownErrorName]: Scenario;
};

const knownErrorScenarioMap: KnownErrorScenario = {
  NotFoundError: {
    error: new NotFoundError('Not found'),
    expected: {
      code: 404,
      body: {
        metadata: {
          error: {
            code: 'NotFoundError',
            message: 'Not found',
          },
        },
      },
    },
  },
  ForbiddenError: {
    error: new ForbiddenError('Forbidden'),
    expected: {
      code: 403,
      body: {
        metadata: {
          error: {
            code: 'ForbiddenError',
            message: 'Forbidden',
          },
        },
      },
    },
  },
  BadRequestError: {
    error: new BadRequestError('Bad request'),
    expected: {
      code: 400,
      body: {
        metadata: {
          error: {
            code: 'BadRequestError',
            message: 'Bad request',
          },
        },
      },
    },
  },
  UnauthorizedError: {
    error: new UnauthorizedError('Unauthorized'),
    expected: {
      code: 401,
      body: {
        metadata: {
          error: {
            code: 'UnauthorizedError',
            message: 'Unauthorized',
          },
        },
      },
    },
  },
  UnprocessableEntityError: {
    error: new UnprocessableEntityError('Unprocessable entity'),
    expected: {
      code: 422,
      body: {
        metadata: {
          error: {
            code: 'UnprocessableEntityError',
            message: 'Unprocessable entity',
          },
        },
      },
    },
  },
};
export const buildKnownErrorScenarios = (): Scenario[] => {
  return Object.values(knownErrorScenarioMap);
};
