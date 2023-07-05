import { Cache } from '../common/cache/redis';
import { UnauthorizedError } from '../common/error/errors';
import { RequestHandler } from 'express';

export const makeSessionMiddleware =
  (cache: Cache): RequestHandler =>
  async (req, res, next) => {
    if (!req.cookies.SESSION)
      return next(new UnauthorizedError('Missing session cookie'));

    const session = await cache.get(req.cookies.SESSION);

    if (!session) {
        res.clearCookie('SESSION');
        return next(new UnauthorizedError('Session expired or not found'));
    }

    req.session = session;

    next();
  };
