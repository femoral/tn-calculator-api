import { HandledError, KnownError, KnownErrorName } from './errors';

const makeDefaultMapper = (code: number) => (error: KnownError) => ({
  code,
  body: {
    metadata: {
      error: {
        code: error.name,
        message: error.message,
      },
    },
  },
});

type KnownErrorMapper = {
  [key in KnownErrorName]: (error: KnownError) => HandledError;
};

const knownErrorMapper: KnownErrorMapper = {
  NotFoundError: makeDefaultMapper(404),
  UnauthorizedError: makeDefaultMapper(401),
  ForbiddenError: makeDefaultMapper(403),
  InvalidInputError: makeDefaultMapper(400),
  UnprocessableEntityError: makeDefaultMapper(422),
};

export const mapError = (error: unknown) => {
  if (error instanceof KnownError) {
    return knownErrorMapper[error.name](error);
  } else {
    return {
      code: 500,
      body: {
        metadata: {
          error: {
            code: 'InternalServerError',
            message: 'Internal server error',
          },
        },
      },
    };
  }
};
