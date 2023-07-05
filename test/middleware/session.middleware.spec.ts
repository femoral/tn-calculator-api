import { RequestHandler, Request, Response } from 'express';
import { makeSessionMiddleware } from '../../src/middleware/session.middleware';
import { Cache } from '../../src/common/cache/redis';
import { UnauthorizedError } from '../../src/common/error/errors';

describe('Session Middleware', () => {
  let sessionMiddleware: RequestHandler;
  const cache = {
    get: jest.fn(),
  };
  const next = jest.fn();
  let req: Request;
  const res = { clearCookie: jest.fn() } as unknown as Response;

  beforeEach(() => {
    sessionMiddleware = makeSessionMiddleware(cache as unknown as Cache);
    req = {
      cookies: {
        SESSION: 'sessionToken',
      },
    } as unknown as Request;
  });

  it('should call cache.get with the session token, when called', async () => {
    await sessionMiddleware(req, res, next);

    expect(cache.get).toHaveBeenCalledWith('sessionToken');
  });

  it('should call next with no arguments, when session is found', async () => {
    cache.get.mockResolvedValueOnce({ userId: 'userId' });

    await sessionMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next with an UnauthorizedError, when session is not found', async () => {
    cache.get.mockResolvedValueOnce(undefined);

    await sessionMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with an UnauthorizedError, when SESSION cookie is not found', async () => {
    delete req.cookies.SESSION;

    await sessionMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should set req.session with the session, when session is found', async () => {
    cache.get.mockResolvedValueOnce({ userId: 'userId' });

    await sessionMiddleware(req, res, next);

    expect(req).toHaveProperty('session', { userId: 'userId' });
  });

  it('should clear the SESSION cookie, when session is not found', async () => {
    cache.get.mockResolvedValueOnce(undefined);

    await sessionMiddleware(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith('SESSION');
  });
});
