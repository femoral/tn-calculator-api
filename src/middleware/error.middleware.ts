import { ErrorRequestHandler } from 'express';
import { mapError } from '../common/error/mapper';

export const makeErrorMiddleware =
  (): ErrorRequestHandler => (err, req, res) => {
    //TODO: implement proper logging
    console.error(err);

    const mappedError = mapError(err);

    res.status(mappedError.code).send(mappedError.body);
  };
