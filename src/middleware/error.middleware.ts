import { ErrorRequestHandler } from 'express';
import { mapError } from '../common/error/mapper';

export const makeErrorMiddleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (): ErrorRequestHandler => (err, req, res, next) => {
    //TODO: implement proper logging
    console.error(err);

    const mappedError = mapError(err);

    res.status(mappedError.code).send(mappedError.body);
  };
